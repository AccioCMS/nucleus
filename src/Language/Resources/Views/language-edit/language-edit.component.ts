import {Component, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';

@Component({
    selector   : 'language-edit',
    templateUrl: './language-edit.component.html',
    styleUrls  : ['./language-edit.component.scss']
})
export class LanguageEditComponent implements OnInit
{
    id: number;
    languageForm: FormGroup;
    breadcrumbs = ['Settings', 'Languages', 'Edit Language'];
    spinner: boolean = true;

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
        this.languageForm = this._formBuilder.group({
            name : [{value: '', disabled: true}, Validators.required],
            nativeName: [{ value : '', disabled: true}, Validators.required],
            slug   : [ { value : '', disabled: true} ],
            isVisible  : [false],
            isDefault  : [false]
        });

        this.id = this.route.snapshot.params['id'];

        this.httpClient.get('/admin/en/json/language/details/'+this.id)
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
        let data = this.languageForm.getRawValue();
        data.id = this.id;
        this.httpClient.post('/admin/json/language/store', data)
            .map(
                (response) => {
                    if(response['code'] == 200){
                        this.router.navigate(['../../list'], {relativeTo:this.route});
                    }else{
                        this.openSnackBar(response['message'], '');
                    }
                }
            )
            .subscribe();
    }

    onCancel(){
        this.router.navigate(['../../list'], {relativeTo:this.route});
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
