import {Component, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {MatSnackBar} from '@angular/material';

@Component({
    selector   : 'post-type-create',
    templateUrl: './post-type-create.component.html',
    styleUrls  : ['./post-type-create.component.scss']
})
export class PostTypeCreateComponent implements OnInit
{
    breadcrumbs = ['Post Type', 'Add New'];
    postTypeForm: FormGroup;
    slug = '';
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
        this.postTypeForm = this._formBuilder.group({
            name : ['', Validators.required],
            slug   : [
                {
                    value   : this.slug,
                    disabled: true
                }
            ],
            isVisible  : [true],
            hasCategories  : [false],
            isCategoryRequired  : [false],
            hasTags  : [false],
            isTagRequired  : [false],
            hasFeaturedImage  : [true],
            isFeaturedImageRequired  : [false],
            hasFeaturedVideo  : [false],
            isFeaturedVideoRequired  : [false],
            fields  : []
        });
    }

    onSave(){
        if(this.postTypeForm.valid){
            this.spinner = true;
            let data = this.postTypeForm.value;
            data.fields = [];
            data.slug = this.slug;

            this.httpClient.post('/admin/json/post-type/store', data)
                .map(
                    (data) => {
                        if(data['code'] == 200){
                            this.router.navigate(['../edit/'+data['id']], {relativeTo:this.route});
                        }else{
                            this.openSnackBar(data['message'], '');
                        }
                    }
                )
                .subscribe();
        }else{
            Object.keys(this.postTypeForm.controls).forEach(field => {
                const control = this.postTypeForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    onCancel(){
        this.router.navigate(['../list'], {relativeTo:this.route});
    }

    createSlug(title, index){
        let name = this.postTypeForm.value.name;
        this.httpClient.get('/admin/en/json/post-type/check-slug/'+name)
            .map(
                (data) => {
                    this.postTypeForm.patchValue({
                        slug: data['slug']
                    });
                    this.slug  = data['slug'];
                }
            )
            .subscribe();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
