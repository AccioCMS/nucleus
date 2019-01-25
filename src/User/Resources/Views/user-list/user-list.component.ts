import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';


import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

import { UsersService } from "../../users.service";

import { fuseAnimations } from '../../../../Shared/@fuse/animations';


import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import {AccioDialogComponent} from "../../../../Shared/App/accio-dialog/accio-dialog.component";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {MatSnackBar} from '@angular/material';
export interface Users {
    checkbox : number;
    name: string;
    email: string;
    phone: string;
    jobtitle: string;
    asd: string
}

const ELEMENT_DATA: Users[] = [
    {asd : "" ,checkbox: 0, name: 'Lorem Ipsum', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum dsa', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum ds', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum ', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsuma ', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
    {asd : "",checkbox: 0, name: 'Lorem Ipsum', email: 'example@example.com', phone: '044 123 456', jobtitle: 'Software Developer'},
];

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


    displayedColumns: string[] = ['checkbox','name', 'email', 'phone', 'jobtitle','buttons'];
    // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
    // dataSource =   ELEMENT_DATA

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



    ngOnInit(){
        this.httpClient.get('en/json/user/get-all')
            .map(
                (response) => {
                    this.dataSource = new MatTableDataSource<any>(response['data']);
                    console.log(response['data']);
                }
            )
            .subscribe();
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



}


export interface IUser
{
    id : number,
    Name : string,
    Lastname : string

}
