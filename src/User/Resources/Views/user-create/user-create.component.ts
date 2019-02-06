import { Component } from '@angular/core';

import { Location } from '@angular/common';
import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';


import { DataSource } from '@angular/cdk/collections';

import { UsersService } from "../../users.service";

import { fuseAnimations } from '../../../../Shared/@fuse/animations';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import * as AuthActions from "../../../../Auth/Resources/Store/auth.actions";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import { Store } from "@ngrx/store";
import * as SharedActions from "../../../../Shared/Store/shared.actions";

@Component({
    selector   : 'user-create',
    templateUrl: './user-create.component.html',
    styleUrls  : ['./user-create.component.scss'],
    animations   : fuseAnimations,
    providers: [UsersService]
})

export class UserCreateComponent
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    // public users = [];

    users = [];
    id: number;
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    phone: string = "";
    street: string = "";
    country: string = "";
    about: string = "";
    isActive: number = 1;
    groups: string[];
    mode: string = 'create';
    location;
    // isActive : boolean;

    breadcrumbs = ['Users', 'New User'];


    spinner: boolean = true;
    // public groups: string[];


    displayedColumns: string[] = ['checkbox','name', 'email', 'phone', 'jobtitle','buttons'];
    // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
    // dataSource =   ELEMENT_DATA;
    usersForm: FormGroup;


    roles = new FormControl();

    // rolesList: string[] = ['Admin', 'Editor', 'Author', 'Testim Group'];

    public rolesList = [
        {"id": 1, "name": "Admin"},
        {"id": 2, "name": "Editor"},
        {"id": 3, "name": "Author"},
        {"id": 5, "name": "Testim Group"}
    ]
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _userService : UsersService,
        private _formBuilder: FormBuilder,
        private httpClient: HttpClient,
        private router: Router,
        public snackBar: MatSnackBar,
        private store: Store<any>,
        location: Location
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        this.usersForm = this._formBuilder.group({
            email: ['', Validators.required],
            lastName: ['', Validators.required],
            firstName: ['', Validators.required],
            password: ['', Validators.required],
            confpassword: [''],
            phone: [''],
            street: [''],
            country: [''],
            groups: [''],
            about   : [''],
            isActive : [this.isActive]
        });
        this.spinner = false;

        // this._unsubscribeAll = new Subject();
        this.location = location;



    }

    onSave(){

        if(this.usersForm.valid) {
            this.store.dispatch(new SharedActions.SetIsLoading(true));
            // this.spinner = true;
            let data = this.usersForm.value;
            // console.log(formData);

            data.fields = [];
            if(this.mode == 'edit'){
                data.id = this.id;
                data.isActive = this.isActive;
            }else{
                this.breadcrumbs = ['Users', 'Update User'];
            }

            console.log(data.isActive);
            this.httpClient.post('admin/api/user/store', data)
                .map(
                    (data) => {

                        if (data['code'] == 200) {
                            // this.isActive  = data['details'].isActive;
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                            let locationPath = this.location.prepareExternalUrl(this.location.path());
                            locationPath = locationPath.replace('create', 'edit/'+data['id']);
                            this.location.go(locationPath);
                            this.mode = 'edit';
                            this.id = data['id'];
                            this.openSnackBar(data['message'], 'X', 'success');
                            this.spinner = false;

                        } else {
                            this.openSnackBar(data['message'], 'X', 'error', 10000);
                        }
                    }
                ) .catch((error: any) => {
                        var message = error.message+' \n '+error.error.message;
                        this.openSnackBar(message, 'X', 'error', 30000);

                        this.store.dispatch(new SharedActions.SetIsLoading(false));
                        return Observable.throw(error.message);
                    })
                .subscribe();
        }else{
            Object.keys(this.usersForm.controls).forEach(field => {
                const control = this.usersForm.get(field);
                control.markAsTouched({ onlySelf: true });
                this.openSnackBar("Please fill out the required fields", 'X', 'error', 10000);
            });
        }

    }


    openSnackBar(message: string, action: string, type: string, duration: number = 2000) {
        let bgClass = [''];
        if(type == 'error'){
            bgClass = ['red-snackbar-bg'];
        }else if(type == 'success'){
            bgClass = ['green-snackbar-bg'];
        }

        let snackBarRef =  this.snackBar.open(message, action, {
            duration: duration,
            panelClass: bgClass,
        });


    }

    onCancel(){
        console.log('Cancel clicked');
    }


}
