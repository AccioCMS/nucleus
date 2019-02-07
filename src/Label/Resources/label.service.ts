import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {Observable} from "rxjs/index";
import * as LabelActions from "./Store/label.actions";

import { FuseTranslationLoaderService } from '../../Shared/@fuse/services/translation-loader.service';
import 'rxjs/add/operator/toPromise';
import {SetUserLabels} from "./Store/label.actions";
import {SetPostLabels} from "./Store/label.actions";
import {SetCategoryLabels} from "./Store/label.actions";
import {SetTagLabels} from "./Store/label.actions";

@Injectable({
    providedIn: 'root'
})
export class LabelService{

    constructor (
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private httpClient: HttpClient,
        private store: Store<any>
    )
    {

    }

    setLabelsByModule(adminPrefix: string, module: string):  Promise<any>{
        return this.httpClient.get('/'+adminPrefix+'/json/labels/'+module)
            .toPromise()
            .then(
                response => {
                    this._fuseTranslationLoaderService.loadTranslationsAccio(response['data']);

                    if(module == 'postType'){
                        this.store.dispatch(new LabelActions.SetPostTypesLabels(response['data']));
                    }else if(module == 'settings'){
                        this.store.dispatch(new LabelActions.SetSettingsLabels(response['data']));
                    }else if(module == 'post'){
                        this.store.dispatch(new LabelActions.SetPostLabels(response['data']));
                    }else if(module == 'category'){
                        this.store.dispatch(new LabelActions.SetCategoryLabels(response['data']));
                    }else if(module == 'tag'){
                        this.store.dispatch(new LabelActions.SetTagLabels(response['data']));
                    }else if(module == 'users'){
                        this.store.dispatch(new LabelActions.SetUserLabels(response['data']));
                    }else if(module == 'language'){
                        this.store.dispatch(new LabelActions.SetLanguageLabels(response['data']));
                    }
                }
            );
    }
}
