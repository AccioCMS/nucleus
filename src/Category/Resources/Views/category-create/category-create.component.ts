import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import { Subject } from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromShared from '../../../../Shared/Store/shared.reducers';

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
    languages = [];
    form = { title: {}, slug: {}, parent: {}, description: {}, featuredImage: {},  isVisible: {}};
    parentCategories: string[] = ['One', 'Two', 'Three'];

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
        console.log(this.form);
        let data = {
            form: this.form,
            postTypeID: this.route.snapshot.params['id'],
        };

        /*this.httpClient.post('/admin/json/category/store', data)
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
                        this.openSnackBar(response['message'], 'X', 'success');
                    }
                    console.log(response);
                }
            )
            .subscribe();*/
    }

    onCancel(){
        this.router.navigate(['../../list/'+this.route.snapshot.params['id']], {relativeTo:this.route});
    }

    createSlug(title, slug){
        this.form.slug[slug] = "";
        if(title != '' && title.length > 0){
            this.httpClient.get('/admin/en/json/category/check-slug/'+this.route.snapshot.params['id']+'/'+title)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (response) => {
                        this.form.slug['en'] = response['slug'];
                    }
                )
                .subscribe();
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
