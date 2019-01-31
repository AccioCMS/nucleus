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
    public groups: string[];
    public selecdedGroups: number[];
    spinner: boolean = true;


    breadcrumbs = ['Users', 'Update User'];


    displayedColumns: string[] = ['checkbox','name', 'email', 'phone', 'jobtitle','buttons'];
    // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
    dataSource =   ELEMENT_DATA;
    usersForm: FormGroup;

    private sub: any;
    id: string;


    roles = new FormControl();

    public rolesList = [
        {"groupID": 1, "name": "Admin"},
        {"groupID": 2, "name": "Editor"},
        {"groupID": 3, "name": "Author"},
        {"groupID": 5, "name": "Testim Group"}
    ]

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

        this.usersForm = this._formBuilder.group({
            email: ['', Validators.required],
            lastName: [''],
            firstName: [''],
            password: ['', Validators.required],
            conf_password: [''],
            phone: [''],
            street: [''],
            country: [''],
            groups: [''],
            about   : ['', Validators.required],
            isActive :[false],
        });


        this.id = this.route.snapshot.paramMap.get('id');
        // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
        this.httpClient.get("admin/en/json/user/details/"+this.id)
            .map(
                (data) => {
                    if(data){
                        let details = data['details'];

                         this.groups = data['allGroups'];
                        this.selecdedGroups = data['details']['roles'];
                        // console.log(this.selecdedGroups);
                        this.usersForm.patchValue({
                            email: details['email'],
                            firstName: details['firstName'],
                            lastName: details['lastName'],
                            phone: details['phone'],
                            street: details['street'],
                            country: details['country'],
                            about: '',
                            groups: data['allGroups'],
                            isActive  : details['isActive'] == 1 ? true : false,
                        });

                        this.spinner = false;

                    }else{
                    }
                }
            )
            .subscribe();


    }

    onSave(){
        // this.showErrorMessage = false;
        // let formData = this.usersForm.value;
        this.id = this.route.snapshot.paramMap.get('id');


        let formData = this.usersForm.value;
        // dataSource = this._userService.getUsers().subscribe(data => this.users = data);
        // console.log("Groups"+this.usersForm.get('groups').value);
        let data = {'user' : {id:  this.id , email: this.usersForm.get('email').value, lastName:  this.usersForm.get('lastName').value, firstName:  this.usersForm.get('firstName').value,
                phone:  this.usersForm.get('phone').value, street:  this.usersForm.get('street').value, country: this.usersForm.get('country').value, about: this.usersForm.get('about').value, groups: this.usersForm.get('groups').value, isActive: this.usersForm.get('isActive').value}};
        this.httpClient.post("admin/en/user/storeUpdate/",data)
            .map(
                (data) => {
                    // console.log(data);
                    if(data == 1){

                        this.router.navigate(["/test/users/edit/"+this.id+""])
                        this.spinner = false;
                    }else{
                    }
                }
            )
            .subscribe();
    }

    onCancel(){
        console.log('Cancel clicked');
    }


}
