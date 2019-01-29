import { Component,ViewChild } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';


import { DataSource  ,SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource ,MatTable} from '@angular/material';

import { UsersService } from "../../users.service";

import { fuseAnimations } from '../../../../Shared/@fuse/animations';


import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import {AccioDialogComponent} from "../../../../Shared/App/accio-dialog/accio-dialog.component";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSort} from '@angular/material';

import {MatSnackBar} from '@angular/material';
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

    dataSource = new MatTableDataSource<any>([]);

    selection = new SelectionModel<any>(true, []);
    spinner: boolean = false;
    order: boolean = false;
    orderBy: string;
    orderType: string;
    direction: string;
    loadingSpinner: boolean = false;
    displayedColumns: string[] = ['checkbox','firstName', 'email', 'phone', 'jobtitle','buttons'];

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
    }

    @ViewChild(MatTable) table: MatTable<any>;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit(){
        this.spinner = false;
        if(this.route.snapshot.queryParamMap.get('order')){
            // console.log(this.route.snapshot.queryParamMap.get('order'));
            this.httpClient.get('/admin/en/json/user/get-all/'+this.route.snapshot.queryParamMap.get('order')+'/'+this.route.snapshot.queryParamMap.get('type'))
                .map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['data']);
                        // console.log(response['data']);
                        this.spinner = false;
                    }
                )
                .subscribe();
        }else{
            this.spinner = true;
            this.httpClient.get('/admin/en/json/user/get-all')
                .map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['data']);
                        // console.log(response['data']);
                        this.spinner = false;
                    }
                )
                .subscribe();
        }

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
        this.httpClient.get('/api/json/user/delete/en/'+id)
            .map(
                (response) => {
                    this.openSnackBar(response['message'], '');
                    if(response['code'] == 200){
                        let newData = this.dataSource.data;
                        newData.splice(index, 1);
                        this.dataSource = new MatTableDataSource<any>(newData);
                    }
                }
            )
            .subscribe();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }


    addNew(){
        this.router.navigate(['../add/'], {relativeTo: this.route});
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
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    this.loadingSpinner = false;
                }
            )
            .subscribe();

    }



}


export interface IUser
{
    id : number,
    Name : string,
    Lastname : string

}
