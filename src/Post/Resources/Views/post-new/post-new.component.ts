import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
    selector   : 'post-new',
    templateUrl: './post-new.component.html',
    styleUrls  : ['./post-new.component.scss']
})
export class NewPostComponent
{
    breadcrumbs = ['Post', 'New Post'];
    postForm: FormGroup;
    categories = ['Apple', 'Orange', 'Bannana'];
    tags = ['Movie', 'Fun', 'Sport'];
    statuses = ['Published', 'Draft'];

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
        private _formBuilder: FormBuilder,
        private httpClient: HttpClient
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this.postForm = this._formBuilder.group({
            title : ['', Validators.required],
            content   : [
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
                Validators.required
            ],
            postCategory: [''],
            postTag: [''],
        });
    }

    onSave(){
        this.httpClient.get('/admin/get-base-data')
            .map(
                (data) => {
                    console.log(data);
                }
            )
            .subscribe();
    }

    onCancel(){
        console.log('Cancel clicked');
    }
}
