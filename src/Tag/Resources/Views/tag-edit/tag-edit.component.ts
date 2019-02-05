import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as SharedActions from "../../../../Shared/Store/shared.actions";

@Component({
    selector   : 'tag-edit',
    templateUrl: './tag-edit.component.html',
    styleUrls  : ['./tag-edit.component.scss']
})
export class TagEditComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    breadcrumbs = ['Tag', 'Edit'];
    tagForm: FormGroup;
    slug = '';
    id: number;
    spinner: boolean = true;
    saveSpinner: boolean = false;
    postTypeID : number;

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
        public snackBar: MatSnackBar,
        private store: Store<any>
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.tagForm = this._formBuilder.group({
            title : ['', Validators.required],
            slug   : [
                {
                    value   : this.slug,
                    disabled: true
                }
            ],
            description  : [''],
            featuredImageID  : [false],
        });

        this.id = this.route.snapshot.params['id'];

        this.httpClient.get('/admin/en/json/tags/details/'+this.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (data) => {
                    console.log(data);

                    let details = data['details'];

                    this.postTypeID = details['postTypeID'];
                    this.tagForm.patchValue({
                        title: details['title'],
                        slug: details['slug'],
                        description  : details['description'],
                        featuredImageID  : details['featuredImageID']

                    });
                    this.slug = details['slug'];
                    this.spinner = false;
                    this.store.dispatch(new SharedActions.SetIsLoading(false));
                }
            )
            // .catch((error: any) => {
            //
            //     var message = error.message+' \n '+error.error.message;
            //     this.openSnackBar(message, 'X', 'error', 30000);
            //
            //     this.store.dispatch(new SharedActions.SetIsLoading(false));
            //     return Observable.throw(error.message);
            // })
            .subscribe();
    }

    onSave(){
        if(this.tagForm.valid){
            this.store.dispatch(new SharedActions.SetIsLoading(true));
            let data = this.tagForm.value;
            data.fields = [];
            data.slug = this.slug;
            data.id = this.id;
            data.postTypeID = this.postTypeID;
            data.deletedFieldsSlugs = [];
            console.log(data);
            this.httpClient.post('/admin/json/tags/store', data)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (data) => {

                        if(data['code'] == 200){
                            this.openSnackBar(data['message'], 'X', 'success');
                        }else{
                            this.openSnackBar(data['message'], 'X', 'error', 10000);
                        }
                        this.store.dispatch(new SharedActions.SetIsLoading(false));
                    }
                )
                .catch((error: any) => {
                    var message = error.message+' \n '+error.error.message;
                    this.openSnackBar(message, 'X', 'error', 30000);

                    this.store.dispatch(new SharedActions.SetIsLoading(false));
                    return Observable.throw(error.message);
                })
                .subscribe();
        }else{
            Object.keys(this.tagForm.controls).forEach(field => {
                const control = this.tagForm.get(field);
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
