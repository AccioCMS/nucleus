import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import { Subject, Observable } from "rxjs";
import { takeUntil, catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as SharedActions from '../../../../Shared/Store/shared.actions';

@Component({
    selector   : 'category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls  : ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    id: number;
    breadcrumbs = ['Post Type', 'Category', 'Edit Category'];
    languages = [];
    form = { title: {}, slug: {}, parent: {}, description: {}, featuredImage: {},  isVisible: {}};
    parentCategories: [] = [];
    postTypeID: number;
    spinner: boolean = false;

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
        private store: Store<any>
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.id = this.route.snapshot.params['id'];

        this.store.select(state => state)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data) => {
                    this.languages = data['shared']['languages'];
                }
            );

        this.httpClient.get('/admin/en/json/category/details/'+this.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    this.form = response['details'];
                    this.form.parent = response['details']['parentCategory'];
                    this.postTypeID = response['details']['postTypeID'];
                    this.spinner = false;
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.store.dispatch(new SharedActions.SetIsLoading(false));
                return Observable.throw(error.message);
            })
            .subscribe();
    }

    onSave(){
        this.store.dispatch(new SharedActions.SetIsLoading(true));

        let data = {
            form: this.form,
            id: this.id,
            postTypeID: this.postTypeID,
            customFieldValues: {},
            pluginsData: {},
            files: {},
            redirect: "save"
        };

        this.httpClient.post<any>('/admin/json/category/store', data)
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
                        //this.router.navigate(['../../list/'+this.route.snapshot.params['id']], {relativeTo: this.route});
                        this.openSnackBar(response['message'], 'X', 'success');
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
