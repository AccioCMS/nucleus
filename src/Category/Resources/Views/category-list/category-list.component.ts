import {Component, OnInit, Inject, ViewChild, OnDestroy} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";

import {MatDialog, MatDialogRef, MatSort, MatPaginator} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import { Subject } from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { AccioDialogComponent } from "../../../../Shared/App/accio-dialog/accio-dialog.component";

@Component({
    selector   : 'category-list',
    templateUrl: './category-list.component.html',
    styleUrls  : ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    displayedColumns: string[] = ['select', 'categoryID', 'title', 'slug', 'buttons'];
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    breadcrumbs = ['Post Type', 'Categories', 'List'];
    spinner: boolean = true;
    deleteSpinner: boolean = false;
    loadingSpinner: boolean = false;
    totalSize: number = 0;
    pageSize: number = 10;
    postTypeID: number;

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
        private route:ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        let params = '?pageSize='+this.pageSize;

        if (this.route.snapshot.queryParams['page']){
            params += '&page='+this.route.snapshot.queryParams['page'];
        }
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            params += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];
        }

        this.postTypeID = this.route.snapshot.params['id'];
        this.httpClient.get('admin/en/json/category/get-tree/'+this.postTypeID+''+params)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.totalSize = response['total'];
                    this.spinner = false;
                }
            )
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
        this.httpClient.get('/admin/en/json/category/delete/'+id)
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
                    this.deleteSpinner = false;
                }
            )
            .subscribe();
    }

    edit(id){
        this.router.navigate(['../../edit/'+id], {relativeTo: this.route});
    }

    addNew(){
        this.router.navigate(['../../create/'+this.postTypeID], {relativeTo: this.route});
    }

    openDialog(id, index): void {
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete this Category?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.deleteSpinner = true;
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
                title: 'Delete',
                text: 'Are you sure that you want to delete these Categories?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.deleteSpinner = true;

                let selectedData = this.selection.selected;
                var keyArray = selectedData.map(function(item) { return item["categoryID"]; });
                let data = { ids: keyArray };

                this.httpClient.post('/admin/json/category/bulk-delete', data)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .map(
                        (response) => {
                            if(response['code'] == 200){
                                this.removeSelection();
                                this.openSnackBar(response['message'], 'X', 'success');

                                let newData = this.dataSource.data;
                                newData = newData.filter(item => !keyArray.includes(item.categoryID) );
                                this.dataSource = new MatTableDataSource<any>(newData);
                            }else{
                                this.openSnackBar(response['message'], 'X', 'error', 10000);
                            }
                            this.deleteSpinner = false;
                        }
                    )
                    .subscribe();
            }
        });
    }

    removeSelection(){
        this.selection.clear();
    }

    customSort(event){
        this.loadingSpinner = true;
        if (this.route.snapshot.queryParams['page']) {
            this.router.navigate(['./'],
                {
                            relativeTo: this.route,
                            queryParams: {
                                page: this.route.snapshot.queryParams['page'],
                                pageSize: this.route.snapshot.queryParams['page'] ? this.route.snapshot.queryParams['page'] : null,
                                order: event['active'],
                                type: event['direction']
                            }
                });
        }else{
            this.router.navigate(['./'], { relativeTo: this.route, queryParams: { order: event['active'], type: event['direction'] } });
        }

        this.httpClient.get('/admin/en/json/category/get-tree/'+this.postTypeID+'?pageSize='+this.paginator.pageSize+'&order='+event['active']+'&type='+event['direction'])
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.paginator.pageIndex = 0;
                    this.loadingSpinner = false;
                }
            )
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
            this.router.navigate(['./'], { relativeTo: this.route, queryParams: { page: (event.pageIndex + 1) } });
        }

        this.httpClient.get('/admin/en/json/category/get-tree/'+this.postTypeID+''+params)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.loadingSpinner = false;
                }
            )
            .subscribe();
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
