import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromShared from '../../../../Shared/Store/shared.reducers';
import * as SharedActions from "../../../../Shared/Store/shared.actions";

@Component({
    selector   : 'category-create',
    templateUrl: './category-create.component.html',
    styleUrls  : ['./category-create.component.scss']
})

export class CategoryCreateComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    breadcrumbs = ['Post Type', 'Category', 'Add New'];
    slug = '';
    spinner: boolean = true;
    saveSpinner: boolean = false;
    languages = [];
    form = { title: {}, slug: {}, parent: {}, description: {}, featuredImage: {},  isVisible: {}};
    parentCategories: [] = [];
    mainRouteParams;

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
        private httpClient: HttpClient,
        private router: Router,
        private route:ActivatedRoute,
        public snackBar: MatSnackBar,
        private store: Store<fromShared.SharedState>
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.mainRouteParams = this.route.parent.parent.snapshot.params;

        this.store.select(state => state)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data) => {
                    this.languages = data['shared']['languages'];
                    this.spinner = false;
                }
            );
    }

    onSave(){
        this.saveSpinner = true;
        let data = {
            form: this.form,
            postTypeID: this.route.snapshot.params['id'],
        };

        this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/category/store', data)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    if(response['code'] != 200){

                        if(response['errors']){
                            let errors = response['errors'];
                            this.openSnackBar(errors[Object.keys(errors)[0]], 'X', 'error', 10000);
                        }else{
                            this.openSnackBar(response['message'], 'X', 'error', 10000);
                        }
                    }else{
                        this.router.navigate(['../../list/'+this.route.snapshot.params['id']], {relativeTo: this.route});
                        this.openSnackBar(response['message'], 'X', 'success');

                    }

                    this.saveSpinner = false;
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.saveSpinner = false;
                return Observable.throw(error.message);
            })
            .subscribe();
    }

    onCancel(){
        this.router.navigate(['../../list/'+this.route.snapshot.params['id']], {relativeTo:this.route});
    }

    createSlug(title, slug){
        this.form.slug[slug] = "";
        if(typeof title !== 'undefined' && title.length > 0){
            this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/category/check-slug/'+this.route.snapshot.params['id']+'/'+title)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (response) => {
                        this.form.slug[slug] = response['slug'];
                    }
                )
                .catch((error: any) => {
                    var message = error.message+' \n '+error.error.message;
                    this.openSnackBar(message, 'X', 'error', 30000);

                    return Observable.throw(error.message);
                })
                .subscribe();
        }
    }

    searchCategories(value: string){
        if(value.length > 1){
            this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['adminPrefix']+'/json/category/'+this.route.snapshot.params['id']+'/search/'+value)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (response) => {
                        this.parentCategories = response['data'];
                    }
                )
                .catch((error: any) => {
                    var message = error.message+' \n '+error.error.message;
                    this.openSnackBar(message, 'X', 'error', 30000);

                    return Observable.throw(error.message);
                })
                .subscribe();
        }else{
            this.parentCategories = [];
        }
    }

    openSnackBar(message: string, action: string, type: string, duration: number = 3000) {
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
