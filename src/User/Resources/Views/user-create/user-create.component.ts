import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';


import { DataSource } from '@angular/cdk/collections';

import { UsersService } from "../../users.service";

import { fuseAnimations } from '../../../../Shared/@fuse/animations';


import { Observable, Subject } from 'rxjs';

import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';

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
    public users = [];

    breadcrumbs = ['Users', 'New User'];


    displayedColumns: string[] = ['checkbox','name', 'email', 'phone', 'jobtitle','buttons'];
    // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
    dataSource =   ELEMENT_DATA;
    usersForm: FormGroup;



    roles = new FormControl();

    rolesList: string[] = ['Admin', 'Editor', 'Author', 'Testim Group'];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _userService : UsersService,
        private _formBuilder: FormBuilder
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        this.usersForm = this._formBuilder.group({
            email: ['', Validators.required],
            lastname: [''],
            firstName: [''],
            password: ['', Validators.required],
            conf_password: [''],
            phone: [''],
            street: [''],
            country: [''],
            about   : ['Froala', Validators.required],
        });
    }


    hack(val) {
        return Array.from(val);
    }


    onSave(){
        console.log('Save clicked');
    }

    onCancel(){
        console.log('Cancel clicked');
    }


}


export class SelectMultipleExample {
    toppings = new FormControl();
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
}


export interface IUser
{
    id : number,
    Name : string,
    Lastname : string

}
