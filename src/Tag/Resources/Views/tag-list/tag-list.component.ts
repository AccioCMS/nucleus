import { Component,ViewChild } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';


import { DataSource  ,SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource ,MatTable,MatPaginator} from '@angular/material';

import { UsersService } from "../../users.service";

import { fuseAnimations } from '../../../../Shared/@fuse/animations';


import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import {AccioDialogComponent} from "../../../../Shared/App/accio-dialog/accio-dialog.component";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSort} from '@angular/material';

import {MatSnackBar} from '@angular/material';
import {takeUntil} from "rxjs/operators";
export interface Users {
    checkbox : number;
    firstName: string;
    email: string;
    phone: string;
    jobtitle: string;
    asd: string
}


@Component({
    selector   : 'tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls  : ['./tag-list.component.scss'],
    animations   : fuseAnimations,
    providers: [UsersService]
})

export class TagListComponent
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    public users = [];
    private _unsubscribeAll: Subject<any>;
    dataSource = new MatTableDataSource<any>([]);

    selection = new SelectionModel<any>(true, []);
    spinner: boolean = true;
    breadcrumbs = ['Users', 'List'];
    order: boolean = false;
    orderBy: string;
    orderType: string;
    direction: string;
    loadingSpinner: boolean = false;
    totalPages: number;
    pageIndex: number;
    pageSize: string = '10';
    selectedIndex:number;
    displayedColumns: string[] = ['checkbox','userID','firstName', 'email', 'phone', 'jobtitle','buttons'];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _userService : UsersService,
        private httpClient: HttpClient,
        private route:ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatTable) table: MatTable<any>;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit(){
        if(this.route.snapshot.queryParamMap.get('order')){
            // console.log(this.route.snapshot.queryParamMap.get('order'));
            this.httpClient.get('/admin/en/json/user/get-all/'+this.route.snapshot.queryParamMap.get('order')+'/'+this.route.snapshot.queryParamMap.get('type'))
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['data']);
                        this.totalPages = response['total'];
                        this.pageIndex = response['current_page'];
                        this.spinner = false;
                    }
                )
                .subscribe();
        }else if(this.route.snapshot.queryParamMap.get('page')) {
            if(this.route.snapshot.queryParamMap.get('size')){
                this.pageSize = this.route.snapshot.queryParamMap.get('size');
            }

            this.httpClient.get('admin/en/json/user/get-all/?page=' +this.route.snapshot.queryParamMap.get('page')+"&size="+this.pageSize)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(

                    (response) => {

                        this.dataSource = new MatTableDataSource<any>(response['data']);
                        this.totalPages = response['total'];
                        this.pageIndex = response['current_page'];
                        this.loadingSpinner = false;
                        console.log(this.totalPages);
                    }
                )
                .subscribe();
        }
        else{
            // this.spinner = true;
            this.httpClient.get('/admin/en/json/user/get-all')
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['data']);
                        this.totalPages = response['total'];
                            this.spinner = false;
                    }
                )
                .subscribe();
        }

        // this.dataSource.paginator = this.paginator;

    }

    edit(id){
        this.router.navigate(['../edit/'+id], {relativeTo: this.route});
    }


    openDialog(id, index): void {
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete this User?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.delete(id, index);
            }
        });
    }


    delete(id, index){
        this.spinner = true;
        this.httpClient.get('admin/en/json/user/delete/'+id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.openSnackBar(response['message'], 'X', 'success');
                    if(response['code'] == 200){
                        let newData = this.dataSource.data;
                        newData.splice(index, 1);
                        this.dataSource = new MatTableDataSource<any>(newData);
                        this.spinner = false;
                    }
                }
            )
            .subscribe();
    }


    bulkDelete(){
        const dialogRef = this.dialog.open(AccioDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete these Users?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.spinner = true;

                let selectedData = this.selection.selected;

                var keyArray = selectedData.map(function(item) { return item["userID"]; });
                // console.log(keyArray);
                let data = { ids: keyArray };

                this.httpClient.post('/admin/json/user/bulk-delete', data)
                    .map(
                        (response) => {
                            // console.log(data);
                            if(response['code'] == 200){
                                this.removeSelection();
                                this.openSnackBar(response['message'], 'X', 'success');

                                let newData = this.dataSource.data;
                                newData = newData.filter(item => !keyArray.includes(item.userID) );
                                this.dataSource = new MatTableDataSource<any>(newData);
                            }else{
                                this.openSnackBar(response['message'], 'X', 'error', 10000);
                            }
                            this.spinner = false;
                        }
                    )
                    .subscribe();
            }
        });
    }

    removeSelection(){
        this.selection.clear();
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


    addNew(){
        this.router.navigate(['../add/'], {relativeTo: this.route});
    }

    setSelected(id){
        this.selectedIndex = id;
        console.log(id);
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


    sortTable(event) {
        this.loadingSpinner = true;
        this.spinner = false;
        this.router.navigate(["/admin/en/user/list"],{queryParams: { order: event['active'],type: event['direction']}});
        this.order = true;

        this.httpClient.get('admin/en/json/user/get-all/'+event['active']+"/"+event['direction'])
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.loadingSpinner = false;
                }
            )
            .subscribe();
    }

    onPageChange(event){
        if(event['pageSize']){
            this.pageSize = event['pageSize'];
        }

        this.router.navigate(["/admin/en/user/list"],{queryParams: { page: event['pageIndex'] +1 ,size: event['pageSize'] }});
        this.httpClient.get('admin/en/json/user/get-all/?page='+(event['pageIndex'] +1)+"&size="+event['pageSize'] )
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    console.log(response);
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


export interface IUser
{
    id : number,
    Name : string,
    Lastname : string

}
