import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '../../../../Shared/@fuse/services/translation-loader.service';

import { Store } from "@ngrx/store";
import * as LabelActions from "../../../../Label/Resources/Store/label.actions";
import { LabelService } from "../../../../Label/Resources/label.service";

import {takeUntil} from "rxjs/operators";
import { Subject } from "rxjs/index";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector   : 'settings',
    templateUrl: './settings.component.html',
    styleUrls  : ['./settings.component.scss']
})
export class SettingsComponent implements OnInit
{
    private _unsubscribeAll: Subject<any>;
    mainRouteParams;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _labelService: LabelService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute
    )
    {
        this.mainRouteParams = this.route.parent.parent.snapshot.params;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    async getLabels(module: string){
        await this._labelService.setLabelsByModule(this.mainRouteParams['adminPrefix'] , module);
    }

    ngOnInit(){
        let loadLangs = this.store.select(state => state)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data) => {
                    let labels = data['label']['settingsLabels'];
                    if(labels.length > 0){
                        this._fuseTranslationLoaderService.loadTranslationsAccio(labels);
                    }else{
                        this.getLabels('settings');
                    }
                }
            );
        loadLangs.unsubscribe();
    }
}
