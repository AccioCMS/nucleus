import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromShared from '../../../../Shared/Store/shared.reducers';
import {SharedState} from "../../../../Shared/Store/shared.reducers";

@Component({
    selector   : 'general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls  : ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit
{
    settingsForm: FormGroup;
    breadcrumbs = ['Settings', 'General'];
    spinner: boolean = false;
    pages: [];
    languages: [];
    userGroups: [];
    themeConfigs: [];
    timezoneOptions = ['UTC-12', 'UTC-11:30', 'UTC-11', 'UTC-10:30', 'UTC-10', 'UTC-9:30', 'UTC-9', 'UTC-8:30', 'UTC-8', 'UTC-7:30', 'UTC-7', 'UTC-6:30', 'UTC-6', 'UTC-5:30', 'UTC-5', 'UTC-4:30', 'UTC-4', 'UTC-3:30', 'UTC-3', 'UTC-2:30', 'UTC-2', 'UTC-1:30', 'UTC-1', 'UTC-0:30',
        'UTC+0', 'UTC+0:30', 'UTC+1', 'UTC+1:30', 'UTC+2', 'UTC+2:30', 'UTC+3', 'UTC+3:30', 'UTC+4', 'UTC+4:30', 'UTC+5', 'UTC+5:30', 'UTC+6', 'UTC+6:30', 'UTC+7', 'UTC+7:30', 'UTC+8', 'UTC+8:30', 'UTC+9', 'UTC+9:30', 'UTC+10',
        'UTC+10:30', 'UTC+11', 'UTC+11:30', 'UTC+12', 'UTC+12.45', 'UTC+13', 'UTC+13.45', 'UTC+14'];
    themes: [];

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private httpClient: HttpClient,
        private store: Store<fromShared.SharedState>,
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(){
        this.settingsForm = this._formBuilder.group({
            siteTitle : ['', Validators.required],
            adminEmail  : ['', [Validators.required, Validators.email]],
            defaultUserRole : ['', Validators.required],
            timezone  : ['', Validators.required],
            logo : [''],
            watermark : [''],
            defaultLanguage  : ['', Validators.required],
            homepageID : [],
            activeTheme : [''],
            activateMobileTheme : [false],
            mobileActiveTheme: [''],
        });

        this.httpClient.get('/admin/en/json/settings/get-settings')
            .map(
                (response) => {
                    let settings = response['settings'];
                    console.log(response['settings']);
                    this.userGroups = response['userGroups'];
                    this.pages = response['pages'];

                    this.settingsForm.patchValue({
                        siteTitle: settings['siteTitle']['value'],
                        adminEmail: settings['adminEmail']['value'],
                        defaultUserRole  : settings['defaultUserRole']['value'],
                        timezone  : settings['timezone']['value'],
                        activeTheme  : settings['activeTheme']['value'],
                        defaultLanguage  : settings['defaultLanguage']['value'],
                        homepageID  : +settings['homepageID']['value'],
                        activateMobileTheme:  settings['activateMobileTheme']['value'] == 1 ? true : false,
                        mobileActiveTheme: settings['mobileActiveTheme']['value']
                    });
                    this.spinner = false;
                }
            )
            .subscribe();

        this.store.select(state => state).subscribe(
            data => (
                this.languages = data['shared']['languages']
            )
        );

    }

    onSave(){
        this.spinner = true;
        let data = {
            settingsType: 'general',
            form: this.settingsForm.value
        };

        this.httpClient.post('/admin/json/settings/store', data)
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
                    this.spinner = false;
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
}
