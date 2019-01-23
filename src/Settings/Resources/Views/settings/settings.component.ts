import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector   : 'settings',
    templateUrl: './settings.component.html',
    styleUrls  : ['./settings.component.scss']
})
export class SettingsComponent implements OnInit
{
    exampleForm: FormGroup;
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(){
        this.exampleForm = this._formBuilder.group({
            company   : [
                {
                    value   : 'Google',
                    disabled: true
                }, Validators.required
            ],
            firstName : ['', Validators.required],
            lastName  : ['', Validators.required],
            address   : ['', Validators.required],
            address2  : ['', Validators.required],
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]],
            country   : ['', Validators.required]
        });
    }
}
