import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector   : 'analytics',
    templateUrl: './analytics.component.html',
    styleUrls  : ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit
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
            firstName : ['', Validators.required]
        });
    }
}
