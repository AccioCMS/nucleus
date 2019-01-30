import { Component, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as turkish } from '../../i18n/tr';

import {MatSnackBar} from '@angular/material';

import { HttpClient } from '@angular/common/http';

import { Subject } from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

@Component({
    selector   : 'permalink',
    templateUrl: './permalink.component.html',
    styleUrls  : ['./permalink.component.scss']
})
export class PermalinkComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    breadcrumbs = ['Settings', 'Permalinks'];
    spinner: boolean = false;
    data = {};

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private httpClient: HttpClient,
        public snackBar: MatSnackBar
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this.httpClient.get('/admin/en/json/settings/get-permalinks')
            .pipe(takeUntil(this._unsubscribeAll))
            .map(
                (response) => {
                    let permalinks = response;

                    for(let permalink in permalinks){
                        let belongsTo = permalinks[permalink].belongsTo;

                        if(this.data[belongsTo] === undefined){
                            this.data[belongsTo] = [];
                        }
                        this.data[belongsTo].push(permalinks[permalink]);
                    }
                }
            )
            .subscribe();
    }

    onSave(){
        this.spinner = true;
        this.httpClient.post('admin/json/settings/store-permalinks', this.data)
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

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
