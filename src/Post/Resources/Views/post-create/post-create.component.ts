import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import {takeUntil} from "rxjs/internal/operators";
import {Subject} from "rxjs/index";

@Component({
    selector   : 'post-create',
    templateUrl: './post-create.component.html',
    styleUrls  : ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    breadcrumbs = ['Post', 'New Post'];
    postForm: FormGroup;
    categories = [];
    tags = [];
    statuses = ['published', 'draft', 'pending'];
    users: [];
    mainRouteParams;
    userID;

    public options: Object = {
        toolbarButtons: ['undo', 'redo' , '|', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'outdent', 'indent',
            'clearFormatting', 'insertTable', 'html', 'align', 'insertLink', 'insertImage'],
        toolbarButtonsXS: ['undo', 'redo' , '-', 'bold', 'italic', 'underline']
    }

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private httpClient: HttpClient,
        private route: ActivatedRoute
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.postForm = this._formBuilder.group({
            title : ['', Validators.required],
            content   : [
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
                Validators.required
            ],
            postCategory: [''],
            postTag: [''],
        });


    }

    ngOnInit(){
        this.mainRouteParams = this.route.parent.parent.snapshot.params;

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/post/json/get-data-for-create/post_articles')
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                   // console.log(response);
                    this.categories = response['categories'];
                    this.users = response['users'];
                    this.userID = response['createdByUserID'];
                }
            ).subscribe();
    }

    onSave(){
        if(this.postForm.valid){
            console.log('Valid Field');
        }else{
            Object.keys(this.postForm.controls).forEach(field => {
                const control = this.postForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
            //this.openSnackBar('Please fill out the required fields.', 'X', 'error', 10000);
        }
    }

    onCancel(){
        console.log('Cancel clicked');
    }

    ngOnDestroy(){
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
