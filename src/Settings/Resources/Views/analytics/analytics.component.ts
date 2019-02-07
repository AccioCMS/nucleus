import {Component, OnDestroy, OnInit} from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Observable, Subject} from "rxjs/index";
import { takeUntil } from 'rxjs/operators';
import {MatSnackBar} from "@angular/material";

import { ActivatedRoute } from "@angular/router";

import { Store } from "@ngrx/store";
import * as SharedActions from "../../../../Shared/Store/shared.actions";
import * as LabelActions from "../../../../Label/Resources/Store/label.actions";
import { LabelService } from "../../../../Label/Resources/label.service";

@Component({
    selector   : 'analytics',
    templateUrl: './analytics.component.html',
    styleUrls  : ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;
    analyticsForm: FormGroup;
    breadcrumbs = ['settings', 'analytics'];
    spinner: boolean = true;
    saveSpinner: boolean = false;
    mainRouteParams;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _labelService: LabelService,
        private _formBuilder: FormBuilder,
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
        this.analyticsForm = this._formBuilder.group({
            trackingCode : [''],
            useTagManager : [false],
            tagManager : [{value: '', disabled: true }]
        });

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

        this.onChanges();
    }

    async getLabels(module: string){
        await this._labelService.setLabelsByModule(this.mainRouteParams['adminPrefix'] , module);
        this.getData();
    }

    getData(){
        this.httpClient.get('/'+this.mainRouteParams['adminPrefix']+'/'+this.mainRouteParams['lang']+'/json/settings/get-settings')
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
            .catch((error: any) => {
                var message = error.message+' \n '+error.error.message;
                this.openSnackBar(message, 'X', 'error', 30000);

                return Observable.throw(error.message);
            })
            .subscribe();
    }


    onSave(){
        this.store.dispatch(new SharedActions.SetIsLoading(true));
        let data = {
            settingsType: 'analytics',
            form: this.analyticsForm.value
        };

        this.httpClient.post('/'+this.mainRouteParams['adminPrefix']+'/json/settings/store', data)
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
