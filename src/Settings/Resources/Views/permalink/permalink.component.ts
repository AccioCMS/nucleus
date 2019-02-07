import { Component, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import {MatSnackBar} from '@angular/material';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";

import {Observable, Subject} from "rxjs/index";
import { takeUntil } from 'rxjs/operators';

import { Store } from "@ngrx/store";
import * as SharedActions from "../../../../Shared/Store/shared.actions";
import * as LabelActions from "../../../../Label/Resources/Store/label.actions";
import { LabelService } from "../../../../Label/Resources/label.service";

@Component({
    selector   : 'permalink',
    templateUrl: './permalink.component.html',
    styleUrls  : ['./permalink.component.scss']
})
export class PermalinkComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    breadcrumbs = ['settings', 'permalinks'];
    spinner: boolean = true;
    saveSpinner: boolean = false;
    data = {};
    mainRouteParams;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _labelService: LabelService,
        private httpClient: HttpClient,
        public snackBar: MatSnackBar,
        private store: Store<any>,
        private route: ActivatedRoute
    )
    {
        this.mainRouteParams = this.route.parent.parent.parent.snapshot.params;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        let loadLangs = this.store.select(state => state)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data) => {
                    let labels = data['label']['settingsLabels'];
                    if(labels.length > 0){
                        this._fuseTranslationLoaderService.loadTranslationsAccio(labels);
                        this.getData();
                    }else{
                        this.getLabels('settings');
                    }
                }
            );
        loadLangs.unsubscribe();
    }

    async getLabels(module: string){
        await this._labelService.setLabelsByModule(this.mainRouteParams['adminPrefix'] , module);
        this.getData();
    }

    getData(){
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/settings/get-permalinks')
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
                    this.spinner = false;
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                return Observable.throw(error.message);
            })
            .subscribe();
    }

    onSave(){
        this.store.dispatch(new SharedActions.SetIsLoading(true));
        this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/settings/store-permalinks', this.data)
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
                    this.store.dispatch(new SharedActions.SetIsLoading(false));
                }
            )
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                this.store.dispatch(new SharedActions.SetIsLoading(false));
                return Observable.throw(error.message);
            })
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
