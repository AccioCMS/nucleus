import {Component, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import * as LanguageList from '../../language-list';

@Component({
    selector   : 'language-create',
    templateUrl: './language-create.component.html',
    styleUrls  : ['./language-create.component.scss']
})

export class LanguageCreateComponent implements OnInit
{
    languageForm: FormGroup;
    slug: string;
    nativeName: string;
    languageList: any;
    breadcrumbs = ['Settings', 'Languages', 'New Language'];
    spinner: boolean = false;

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
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(){
        this.languageList = LanguageList.LANGUAGES;

        this.languageForm = this._formBuilder.group({
            selectedLanguage: ['', Validators.required],
            name : [''],
            nativeName: [{ value : this.nativeName, disabled: true}],
            slug   : [ { value : this.slug, disabled: true} ],
            isVisible  : [true],
            isDefault  : [false]
        });
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
            this.spinner = true;
            let data = this.languageForm.value;
            data.slug = this.slug;
            data.nativeName = this.nativeName;

            this.httpClient.post('/admin/json/language/store', data)
                .map(
                    (response) => {
                        if(response['code'] == 200){
                            this.router.navigate(['../list'], {relativeTo:this.route});
                        }else{
                            if(response['errors']){
                                let errors = response['errors'];
                                this.openSnackBar(errors[Object.keys(errors)[0]], '');
                            }else{
                                this.openSnackBar(response['message'], '');
                            }
                            this.spinner = false;
                        }
                    }
                )
                .subscribe();
        }else{
            Object.keys(this.languageForm.controls).forEach(field => {
                const control = this.languageForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    onCancel(){
        this.router.navigate(['../list'], {relativeTo:this.route});
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
