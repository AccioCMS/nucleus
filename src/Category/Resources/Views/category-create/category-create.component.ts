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
    spinner: boolean = false;
    languages = [];

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
                data => (
                    this.languages = data['shared']['languages']
                )
            );

    }

    onSave(){
        /*if(this.categoryForm.valid){
            this.spinner = true;
            let data = this.categoryForm.value;
            data.fields = [];
            data.slug = this.slug;

            this.httpClient.post('/admin/json/post-type/store', data)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (data) => {
                        if(data['code'] == 200){
                            this.router.navigate(['../edit/'+data['id']], {relativeTo:this.route});
                        }else{
                            this.openSnackBar(data['message'], 'X', 'error', 10000);
                        }
                    }
                )
                .subscribe();
        }else{
            Object.keys(this.categoryForm.controls).forEach(field => {
                const control = this.categoryForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }*/
    }

    onCancel(){
        this.router.navigate(['../../list/'+this.route.snapshot.params['id']], {relativeTo:this.route});
    }

    createSlug(title, index){
        /*let name = this.categoryForm.value.name;
        if(name != ''){
            this.httpClient.get('/admin/en/json/post-type/check-slug/'+name)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (data) => {
                        this.categoryForm.patchValue({
                            slug: data['slug']
                        });
                        this.slug  = data['slug'];
                    }
                )
                .subscribe();
        }*/
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
