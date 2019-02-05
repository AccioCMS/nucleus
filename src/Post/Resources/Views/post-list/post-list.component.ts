import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";

import {MatDialog, MatDialogRef, MatSort, MatPaginator} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { AccioDialogComponent } from "../../../../Shared/App/accio-dialog/accio-dialog.component";
import { Store } from "@ngrx/store";
import * as SharedActions from "../../../../Shared/Store/shared.actions";

@Component({
    selector   : 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls  : ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    displayedColumns: string[] = ['select', 'postID', 'title', 'category', 'published', 'author', 'buttons'];
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    breadcrumbs: string[] = ['Post Type', 'List'];
    spinner: boolean = true;
    loadingSpinner: boolean = false;
    totalSize: number = 0;
    pageSize: number = 25;
    postType: string;
    mainRouteParams;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private httpClient: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private store: Store<any>
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.mainRouteParams = this.route.parent.parent.snapshot.params;
        let name = this.route.snapshot.params['post_type'];
        this.postType = name.replace("post_", "");

        let params = '?pageSize='+this.pageSize;

        if (this.route.snapshot.queryParams['page']){
            params += '&page='+this.route.snapshot.queryParams['page'];
        }
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            params += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];
        }
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/posts/get-all/'+this.route.snapshot.params['post_type']+''+params)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.totalSize = response['total'];
                    this.spinner = false;
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.spinner = false;
                return Observable.throw(error.message);
            })
            .subscribe();
    }

    addNew(){
        this.router.navigate(['../create'], {relativeTo: this.route});
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    removeSelection(){
        this.selection.clear();
    }

    customSort(event){
        this.loadingSpinner = true;
        this.router.navigate(['../list'], { relativeTo: this.route, queryParams: { order: event['active'], type: event['direction'] } });

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/posts/get-all/'+this.route.snapshot.params['post_type']+'?pageSize='+this.paginator.pageSize+'&order='+event['active']+'&type='+event['direction'])
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.paginator.pageIndex = 0;
                    this.loadingSpinner = false;
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.loadingSpinner = false;
                return Observable.throw(error.message);
            })
            .subscribe();
    }

    onPaginateChange(event){
        this.loadingSpinner = true;
        let params = '?pageSize='+this.paginator.pageSize+'&page='+(event.pageIndex + 1);
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            params += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];
            this.router.navigate(['./'],
                {
                    relativeTo: this.route,
                    queryParams: {
                        page: (event.pageIndex + 1),
                        order: this.route.snapshot.queryParams['order'],
                        type: this.route.snapshot.queryParams['type']
                    }
                });
        }else{
            this.router.navigate(['../list'], { relativeTo: this.route, queryParams: { page: (event.pageIndex + 1) } });
        }

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/posts/get-all/'+this.route.snapshot.params['post_type']+''+params)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.loadingSpinner = false;
                    this.removeSelection();
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.loadingSpinner = false;
                return Observable.throw(error.message);
            })
            .subscribe();
    }

    openSnackBar(message: string, action: string, type: string, duration: number = 3000) {
        let bgClass = [''];
        if(type == 'error'){
            bgClass = ['red-snackbar-bg'];
        }else if(type == 'success'){
            bgClass = ['green-snackbar-bg'];
        }

        this.snackBar.open(message, action, {
            duration: duration,
            panelClass: bgClass,
        });
    }

    openDialog(id, index): void {
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete this Post Type?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.store.dispatch(new SharedActions.SetIsLoading(true));
                this.delete(id, index);
            }
        });
    }

    delete(id, index){
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/posts/delete/'+this.route.snapshot.params['post_type']+'/'+id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {

                    if(response['code'] == 200){
                        let newData = this.dataSource.data;
                        newData.splice(index, 1);
                        this.dataSource = new MatTableDataSource<any>(newData);
                        this.openSnackBar(response['message'], 'X', 'success');
                    }else{
                        this.openSnackBar(response['message'], 'X', 'error', 10000);
                    }
                    this.store.dispatch(new SharedActions.SetIsLoading(false));
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.store.dispatch(new SharedActions.SetIsLoading(false));
                return Observable.throw(error.message);
            })
            .subscribe();
    }

    bulkDelete(){
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete these Post Types?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.store.dispatch(new SharedActions.SetIsLoading(true));

                let selectedData = this.selection.selected;
                var keyArray = selectedData.map(function(item) { return item["postID"]; });
                let data = { ids: keyArray, postType: this.route.snapshot.params['post_type'] };

                this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/posts/bulk-delete', data)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .map(
                        (response) => {
                            if(response['code'] == 200){
                                this.removeSelection();
                                this.openSnackBar(response['message'], 'X', 'success');

                                let newData = this.dataSource.data;
                                newData = newData.filter(item => !keyArray.includes(item.postID) );
                                this.dataSource = new MatTableDataSource<any>(newData);
                            }else{
                                this.openSnackBar(response['message'], 'X', 'error', 10000);
                            }
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    )
                    .catch((error: any) => {
                        var message = error.message+' \n '+error.error.message;
                        this.openSnackBar(message, 'X', 'error', 30000);

                        this.store.dispatch(new SharedActions.SetIsLoading(false));
                        return Observable.throw(error.message);
                    })
                    .subscribe();
            }
        });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
