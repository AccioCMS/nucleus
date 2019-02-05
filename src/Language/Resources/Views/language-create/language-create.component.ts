import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import * as LanguageList from '../../language-list';

import { Subject } from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { Store} from "@ngrx/store";
import * as SharedActions from "../../../../Shared/Store/shared.actions";

@Component({
    selector   : 'language-create',
    templateUrl: './language-create.component.html',
    styleUrls  : ['./language-create.component.scss']
})

export class LanguageCreateComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    languageForm: FormGroup;
    slug: string;
    nativeName: string;
    languageList: any;
    breadcrumbs = ['Settings', 'Languages', 'New Language'];
    spinner: boolean = false;
    loadingSpinner: boolean = true;
    mainRouteParams;

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
        this.mainRouteParams = this.route.parent.parent.parent.parent.snapshot.params;
        this.languageList = LanguageList.LANGUAGES;

        this.languageForm = this._formBuilder.group({
            selectedLanguage: ['', Validators.required],
            name : [''],
            nativeName: [{ value : this.nativeName, disabled: true}],
            slug   : [ { value : this.slug, disabled: true} ],
            isVisible  : [true],
            isDefault  : [false]
        });

        this.loadingSpinner = false;
    }

    languageChanged(){
        let language = this.languageForm.value.selectedLanguage;

        this.languageForm.patchValue({
            name: language.name,
            nativeName: language.nativeName,
            slug: language.slug
        });

        this.slug = language.slug;
        this.nativeName = language.nativeName;
    }

    onSave(){
        if(this.languageForm.valid){
            this.store.dispatch(new SharedActions.SetIsLoading(true));
            let data = this.languageForm.value;
            data.slug = this.slug;
            data.nativeName = this.nativeName;

            this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/language/store', data)
                .pipe(takeUntil(this._unsubscribeAll))
                .map(
                    (response) => {
                        if(response['code'] == 200){
                            let storeLang = { id: this.slug, title: data.name, languageID: response['id']};
                            this.store.dispatch(new SharedActions.AddLanguage(storeLang));
                            this.router.navigate(['../list'], {relativeTo:this.route});
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }else{
                            if(response['errors']){
                                let errors = response['errors'];
                                this.openSnackBar(errors[Object.keys(errors)[0]], 'X', 'error', 10000);
                            }else{
                                this.openSnackBar(response['message'], 'X', 'error', 10000);
                            }
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    }
                )
                .subscribe();
        }else{
            Object.keys(this.languageForm.controls).forEach(field => {
                const control = this.languageForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });

            this.openSnackBar('Please fill out the required fields.', 'X', 'error', 10000);
        }
    }

    onCancel(){
        this.router.navigate(['../list'], {relativeTo:this.route});
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
