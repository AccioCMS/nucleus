import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import { Subject } from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

@Component({
    selector   : 'post-type-edit',
    templateUrl: './post-type-edit.component.html',
    styleUrls  : ['./post-type-edit.component.scss']
})
export class PostTypeEditComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    breadcrumbs = ['Post Type', 'Edit'];
    postTypeForm: FormGroup;
    slug = '';
    id: number;
    spinner: boolean = true;
    saveSpinner: boolean = false;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private httpClient: HttpClient,
        private router: Router,
        private route:ActivatedRoute,
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.postTypeForm = this._formBuilder.group({
            name : ['', Validators.required],
            slug   : [
                {
                    value   : this.slug,
                    disabled: true
                }
            ],
            isVisible  : [false],
            hasCategories  : [false],
            isCategoryRequired  : [false],
            hasTags  : [false],
            isTagRequired  : [false],
            hasFeaturedImage  : [false],
            isFeaturedImageRequired  : [false],
            hasFeaturedVideo  : [false],
            isFeaturedVideoRequired  : [false],
            fields  : []
        });

        this.id = this.route.snapshot.params['id'];

        this.httpClient.get('/admin/en/json/post-type/details/'+this.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (data) => {
                    let details = data['details'];
                    this.postTypeForm.patchValue({
                        name: details['name'],
                        slug: details['slug'],
                        isVisible  : details['isVisible'] == 1 ? true : false,
                        hasCategories  : details['hasCategories'] == 1 ? true : false,
                        isCategoryRequired  : details['isCategoryRequired'] == 1 ? true : false,
                        hasTags  : details['hasTags'] == 1 ? true : false,
                        isTagRequired  : details['isTagRequired'] == 1 ? true : false,
                        hasFeaturedImage  : details['hasFeaturedImage'] == 1 ? true : false,
                        isFeaturedImageRequired  : details['isFeaturedImageRequired'] == 1 ? true : false,
                        hasFeaturedVideo  : details['hasFeaturedVideo'] == 1 ? true : false,
                        isFeaturedVideoRequired  : details['isFeaturedVideoRequired'] == 1 ? true : false,
                    });
                    this.slug = details['slug'];
                    this.spinner = false;
                }
            )
            .subscribe();
    }

    onSave(){
        if(this.postTypeForm.valid){
            this.saveSpinner = true;
            let data = this.postTypeForm.value;
            data.fields = [];
            data.slug = this.slug;
            data.id = this.id;
            data.deletedFieldsSlugs = [];

            this.httpClient.post('/admin/json/post-type/store', data)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (data) => {
                        if(data['code'] == 200){
                            this.openSnackBar(data['message'], 'X', 'success');
                        }else{
                            this.openSnackBar(data['message'], 'X', 'error', 10000);
                        }
                        this.saveSpinner = false;
                    }
                )
                .subscribe();
        }else{
            Object.keys(this.postTypeForm.controls).forEach(field => {
                const control = this.postTypeForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });

            this.openSnackBar('Please fill out the required fields.', 'X', 'error', 10000);
        }
    }

    onCancel(){
        this.router.navigate(['../../list'], {relativeTo:this.route});
    }

    openSnackBar(message: string, action: string, type: string, duration: number = 2000) {
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

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
