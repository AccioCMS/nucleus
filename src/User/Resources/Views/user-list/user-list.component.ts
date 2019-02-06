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
    selector   : 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls  : ['./user-list.component.scss'],
    animations   : fuseAnimations,
    providers: [UsersService]
})

export class UserListComponent
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
    totalSize: number;
    pageSize: string = '10';
    selectedIndex:number;
    displayedColumns: string[] = ['checkbox','userID','firstName', 'email', 'phone', 'jobtitle','buttons'];
    mainRouteParams;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatTable) table: MatTable<any>;
    // @ViewChild(MatSort) sort: MatSort;

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


    ngOnInit(){
        this.mainRouteParams = this.route.parent.parent.snapshot.params;

        let params = '?size='+this.pageSize;

        if (this.route.snapshot.queryParams['page']){
            params += '&page='+this.route.snapshot.queryParams['page'];
        }
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            params += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];
        }

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/user/get-all'+params)
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
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/user/delete/'+id)
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

                this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/user/bulk-delete', data)
                    .map(
                        (response) => {
                            console.log(data);
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
        this.router.navigate(['../create'], {relativeTo: this.route});
    }


    edit(id){
        this.router.navigate(['../edit/'+id], {relativeTo: this.route});
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
        // this.spinner = false;
        // console.log(event['direction']);
        this.router.navigate(["../list"],{ relativeTo: this.route, queryParams: { order: event['active'],type: event['direction']}});
        // this.order = true;

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/user/get-all?size='+this.paginator.pageSize+'&order='+event['active']+'&type='+event['direction'])
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    console.log(response);
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.paginator.pageIndex = 0;
                    this.loadingSpinner = false;
                }
            )
            .subscribe();


    }

    onPageChange(event){
        // if(event['pageSize']){
        //     this.pageSize = event['pageSize'];
        // }
        this.loadingSpinner = true;

        let params = '?size='+this.paginator.pageSize+'&page='+(event.pageIndex + 1);
        // this.router.navigate(["/admin/en/user/list"],{queryParams: { page: event['pageIndex'] +1 ,size: event['pageSize'] }});
        this.router.navigate(['../list'], { relativeTo: this.route, queryParams: { order: event['active'], type: event['direction'] } });
        // this.httpClient.get('admin/en/json/user/get-all/?page='+(event['pageIndex'] +1)+"&size="+event['pageSize'] )
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .map(
        //         (response) => {
        //             console.log(response);
        //             this.dataSource = new MatTableDataSource<any>(response['data']);
        //             this.loadingSpinner = false;
        //         }
        //     )
        //     .subscribe();


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

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/user/get-all'+params)
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


export interface IUser
{
    id : number,
    Name : string,
    Lastname : string

}
