import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from "rxjs/index";
import { takeUntil } from 'rxjs/operators';
import {MatSnackBar} from "@angular/material";

@Component({
    selector   : 'analytics',
    templateUrl: './analytics.component.html',
    styleUrls  : ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    analyticsForm: FormGroup;
    breadcrumbs = ['Settings', 'Analytics'];
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
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.analyticsForm = this._formBuilder.group({
            trackingCode : [''],
            useTagManager : [false],
            tagManager : [{value: '', disabled: true }]
        });

        this.httpClient.get('/admin/en/json/settings/get-settings')
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    let settings = response['settings'];

                    this.analyticsForm.patchValue({
                        trackingCode: settings['trackingCode']['value'],
                        useTagManager: settings['useTagManager']['value'] == 1 ? true : false,
                        tagManager  : settings['tagManager']['value']
                    });
                    this.spinner = false;
                }
            )
            .subscribe();

        this.onChanges();
    }

    onSave(){
        this.saveSpinner = true;
        let data = {
            settingsType: 'analytics',
            form: this.analyticsForm.value
        };

        this.httpClient.post('/admin/json/settings/store', data)
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    if(response['code'] != 200){
                        if(response['errors']){
                            let errors = response['errors'];
                            this.openSnackBar(errors[Object.keys(errors)[0]], 'X', 'error', 10000);
                        }
                    }else{
                        this.openSnackBar(response['message'], 'X', 'success');
                    }
                    this.saveSpinner = false;
                }
            )
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

    onChanges() {
        this.analyticsForm.get('useTagManager').valueChanges
            .subscribe(useTagManager => {
                if (!useTagManager) {
                    this.analyticsForm.get('tagManager').disable();
                }else {
                    this.analyticsForm.get('tagManager').enable();
                }
            });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
