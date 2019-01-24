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

import { ActivatedRoute } from '@angular/router';


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
    selector   : 'user-update',
    templateUrl: './user-update.component.html',
    styleUrls  : ['./user-update.component.scss'],
    animations   : fuseAnimations,
    providers: [UsersService]
})

export class UserUpdateComponent
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    public users = [];
    public email: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public phone: string = "";
    public street: string = "";
    public country: string = "";
    public about: string = "";
    public isActive: number = 1;

    breadcrumbs = ['Users', 'Update User'];


    displayedColumns: string[] = ['checkbox','name', 'email', 'phone', 'jobtitle','buttons'];
    // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
    dataSource =   ELEMENT_DATA;
    usersForm: FormGroup;

    private sub: any;
    id: string;


    roles = new FormControl();

    rolesList: string[] = ['Admin', 'Editor', 'Author', 'Testim Group'];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _userService : UsersService,
        private _formBuilder: FormBuilder,
        private httpClient: HttpClient,
        private router: Router,
        // private route: ActivatedRoute
        private route: ActivatedRoute,

    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

    }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get("id")
        this.getUser();


        this.usersForm = this._formBuilder.group({
            email: [' ', Validators.required],
            lastName: [' '],
            firstName: [' '],
            password: [' ', Validators.required],
            conf_password: [' '],
            phone: [' '],
            street: [' '],
            country: [' '],
            groups: [' '],
            about   : [' ', Validators.required],
            isActive :[''],
        });
    }

    // ngOnChanges() {
    //     if (this.usersForm) {
    //         this.usersForm.setValue({ email: this.email});
    //     }
    // }

    hack(val) {
        return Array.from(val);
    }

    onSave(){
        this.updateUser();
    }

    updateUser() {
        // this.showErrorMessage = false;
        // let formData = this.usersForm.value;
        this.id = this.route.snapshot.paramMap.get('id');

        let formData = this.usersForm.value;
        // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
        let data = {'user' : {id:  this.id , email: this.usersForm.get('email').value, lastName: formData.lastName, firstName: formData.firstName,
                phone: formData.phone, street: formData.street, country: formData.country , about: formData.about, groups: formData.groups}};
        console.log(data);
        this.httpClient.post("/api/user/storeUpdate/",data)
            .map(
                (data) => {
                    if(data == 1){
                        this.router.navigate(["/test/users/list/"+this.id+""])
                    }else{
                    }
                }
            )
            .subscribe();

    }

    getUser() {
        // this.showErrorMessage = false;
        // let formData = this.usersForm.value;
        this.id = this.route.snapshot.paramMap.get('id');


<<<<<<< HEAD
        // dataSource = this._userService.getUsers().subscribe(data => this.users = data);

        this.httpClient.post("/api/user/get/"+this.id)
=======
        // console.log( this.id);
        this.httpClient.get("/api/user/get/"+this.id+"")
>>>>>>> f9bf42ea602d487e78ef6cc78129db534bfd82ee
            .map(
                (data) => {
               /*     this.email = data['details'].email;
                    this.firstName = data['details'].firstName;
                    this.lastName = data['details'].lastName;
                    this.phone = data['details'].phone;
                    this.street = data['details'].street;
                    this.country = data['details'].country;
                    this.about = data['details'].about;*/
               // console.log(data);

                    if(data){
                        this.email = data['details'].email;
                        this.firstName = data['details'].firstName;
                        this.lastName = data['details'].lastName;
                        this.phone = data['details'].phone;
                        this.street = data['details'].street;
                        this.country = data['details'].country;
                        this.about = data['details'].about;

                    }else{
                        // this.showErrorMessage = true;
                    }
                }
            )
            .subscribe();
        // console.log('Save clicked');
    }

    onCancel(){
        console.log('Cancel clicked');
    }


}


export class UserModel {

    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public phone: string,
        public street: string,
        public country: string,
        public about: string
    )
    {

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