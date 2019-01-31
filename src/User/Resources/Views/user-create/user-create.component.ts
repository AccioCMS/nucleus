import { Component } from '@angular/core';

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

export interface Users {
    checkbox : number;
    name: string;
    email: string;
    phone: string;
    jobtitle: string;
    asd: string
}

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

    public users = [];
    public email: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public phone: string = "";
    public street: string = "";
    public country: string = "";
    public about: string = "";
    public isActive: number = 1;
    public groups: string[];


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
        private router: Router

    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        this.usersForm = this._formBuilder.group({
            email: ['', Validators.required],
            lastName: [''],
            firstName: [''],
            password: ['', Validators.required],
            confpassword: [''],
            phone: [''],
            street: [''],
            country: [''],
            groups: [''],
            about   : ['', Validators.required],
        });
        this.spinner = false;
    }

    onSave(){
        // this.showErrorMessage = false;
        this.spinner = true;
        let formData = this.usersForm.value;
        console.log(formData);
        let data = {'user' : { email: this.usersForm.get('email').value,password: this.usersForm.get('password').value, confpassword: this.usersForm.get('confpassword').value,lastName:  this.usersForm.get('lastName').value, firstName:  this.usersForm.get('firstName').value,
                phone:  this.usersForm.get('phone').value, street:  this.usersForm.get('street').value, country: this.usersForm.get('country').value, about: this.usersForm.get('about').value, groups: this.usersForm.get('groups').value}};

        this.httpClient.post('admin/api/user/store', data)
            .map(
                (data) => {
                    console.log(data);
                    if(data){
                        this.spinner = false;
                    }else{
                        // this.showErrorMessage = true;
                    }
                }
            )
            .subscribe();

    }

    onCancel(){
        console.log('Cancel clicked');
    }


}
