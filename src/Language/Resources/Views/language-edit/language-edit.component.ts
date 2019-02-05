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

import { Store } from "@ngrx/store";
import * as SharedActions from "../../../../Shared/Store/shared.actions";

@Component({
    selector   : 'language-edit',
    templateUrl: './language-edit.component.html',
    styleUrls  : ['./language-edit.component.scss']
})
export class LanguageEditComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    id: number;
    languageForm: FormGroup;
    breadcrumbs = ['Settings', 'Languages', 'Edit Language'];
    spinner: boolean = true;
    saveSpinner: boolean = false;
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
        private route: ActivatedRoute,
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

        this.languageForm = this._formBuilder.group({
            name : [{value: '', disabled: true}, Validators.required],
            nativeName: [{ value : '', disabled: true}, Validators.required],
            slug   : [ { value : '', disabled: true} ],
            isVisible  : [false],
            isDefault  : [false]
        });

        this.id = this.route.snapshot.params['id'];

        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/language/details/'+this.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    let details = response['details'];
                    this.languageForm.patchValue({
                        name: details['name'],
                        slug: details['slug'],
                        nativeName: details['nativeName'],
                        isVisible  : details['isVisible'] == 1 ? true : false,
                        isDefault  : details['isDefault'] == 1 ? true : false,
                    });
                    this.spinner = false;
                }
            )
            .subscribe();
    }

    onSave(){
        this.store.dispatch(new SharedActions.SetIsLoading(true));
        let data = this.languageForm.getRawValue();
        data.id = this.id;
        this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/language/store', data)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    if(response['code'] == 200){
                        this.openSnackBar(response['message'], 'X', 'success', 2000);
                        this.router.navigate(['../../list'], {relativeTo: this.route});
                    }else{
                        this.openSnackBar(response['message'], 'X', 'error', 10000);
                    }

                    this.store.dispatch(new SharedActions.SetIsLoading(false));
                }
            )
            .subscribe();
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
