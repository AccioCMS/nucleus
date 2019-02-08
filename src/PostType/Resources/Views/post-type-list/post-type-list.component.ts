import {Component, OnInit, Inject, ViewChild, OnDestroy} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";

import {MatDialog, MatDialogRef, MatSort, MatPaginator} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { AccioDialogComponent } from "../../../../Shared/App/accio-dialog/accio-dialog.component";
import { Store } from "@ngrx/store";
import * as SharedActions from "../../../../Shared/Store/shared.actions";

import * as LabelActions from "../../../../Label/Resources/Store/label.actions";
import { LabelService } from "../../../../Label/Resources/label.service";
import { AccioRouteParamsService } from "../../../../Shared/Services/route-params.service";

@Component({
    selector   : 'post-type-list',
    templateUrl: './post-type-list.component.html',
    styleUrls  : ['./post-type-list.component.scss']
})
export class PostTypeListComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    displayedColumns: string[] = ['select', 'postTypeID', 'name', 'slug', 'buttons'];
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    breadcrumbs = ['post-types', 'list'];
    spinner: boolean = true;
    deleteSpinner: boolean = false;
    loadingSpinner: boolean = false;
    totalSize: number = 0;
    pageSize: number = 10;
    mainRouteParams;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _labelService: LabelService,
        private translate: TranslateService,
        private httpClient: HttpClient,
        private router: Router,
        private route:ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private store: Store<any>,
        private _accioRouteParamsService: AccioRouteParamsService
    )
    {
        this.mainRouteParams = this.route.parent.parent.snapshot.params;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.paginator._intl.itemsPerPageLabel = this.translate.instant('items-per-page');

        let loadLangs = this.store.select(state => state)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data) => {
                    let labels = data['label']['postTypeLabels'];
                    if(labels.length > 0){
                        this._fuseTranslationLoaderService.loadTranslationsAccio(labels);
                        this.getData();
                    }else{
                        this.getLabels('postType');
                    }
                }
            );
        loadLangs.unsubscribe();
    }

    async getLabels(module: string){
        await this._labelService.setLabelsByModule(this.mainRouteParams['adminPrefix'] , module);
        this.getData();
    }

    getData(){
        if(this.route.snapshot.queryParams['page']){
            this.pageSize = this.route.snapshot.queryParams['pageSize'];
            this.paginator.pageSize = this.pageSize;
        }
        if(this.route.snapshot.queryParams['page']){
            this.paginator.pageIndex = +this.route.snapshot.queryParams['page'] - 1;
        }

        let params = this._accioRouteParamsService.getParamsString(this.pageSize);
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/post-type/get-all'+params)
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

    delete(id, index){
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/post-type/delete/'+id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    if(response['code'] == 200){
                        let newData = this.dataSource.data;
                        newData.splice(index, 1);
                        this.dataSource = new MatTableDataSource<any>(newData);
                        this.openSnackBar(this.translate.instant(response['message']), 'X', 'success');
                    }else{
                        this.openSnackBar(this.translate.instant(response['message']), 'X', 'error', 10000);
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

    edit(id){
        this.router.navigate(['../edit/'+id], {relativeTo: this.route});
    }

    addNew(){
        this.router.navigate(['../create'], {relativeTo: this.route});
    }

    openDialog(id, index): void {
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'delete',
                text: 'delete-question'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.store.dispatch(new SharedActions.SetIsLoading(true));
                this.delete(id, index);
            }
        });
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

    bulkDelete(){
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'delete',
                text: 'bulk-delete-question'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.store.dispatch(new SharedActions.SetIsLoading(true));

                let selectedData = this.selection.selected;
                var keyArray = selectedData.map(function(item) { return item["postTypeID"]; });
                let data = { ids: keyArray };

                this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/post-type/bulk-delete', data)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .map(
                        (response) => {
                            if(response['code'] == 200){
                                this.removeSelection();
                                this.openSnackBar(this.translate.instant(response['message']), 'X', 'success');

                                let newData = this.dataSource.data;
                                newData = newData.filter(item => !keyArray.includes(item.postTypeID) );
                                this.dataSource = new MatTableDataSource<any>(newData);
                            }else{
                                this.openSnackBar(this.translate.instant(response['message']), 'X', 'error', 10000);
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

    removeSelection(){
        this.selection.clear();
    }

    customSort(event){
        this.loadingSpinner = true;

        let allParams = this._accioRouteParamsService.customSortParams(event, this.paginator.pageSize);
        this.router.navigate(['../list'], { relativeTo: this.route, queryParams: allParams['queryParams'] });

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/post-type/get-all'+allParams['stringParams'])
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

        let allParams = this._accioRouteParamsService.paginationParams(event, this.paginator.pageSize);
        this.router.navigate(['../list'], { relativeTo: this.route, queryParams: allParams['queryParams'] });

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/post-type/get-all'+allParams['stringParams'])
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
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

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
