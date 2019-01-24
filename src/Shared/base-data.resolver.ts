import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as SharedActions from './Store/shared.actions';
import * as AuthActions from '../Auth/Resources/Store/auth.actions';

@Injectable()
export class BaseBataResolver implements Resolve<any> {
    constructor(
        private httpClient: HttpClient,
        private store: Store<any>
    ) {}

    resolve() {
        return this.httpClient.get('/test/auth')
            .map(
                (data) => {
                    if(data['status'] == true){
                        this.store.dispatch(new AuthActions.Signin(data['accessToken']));

                        let langauges = [];
                        this.httpClient.get('/admin/get-base-data')
                            .map(
                                (data) => {
                                    this.store.dispatch(new SharedActions.SetLanguages(data['languages']));
                                    this.store.dispatch(new SharedActions.SetGlobalData(data['global_data']));
                                    this.store.dispatch(new SharedActions.SetCmsMenus(data['cmsMenus']));
                                    this.store.dispatch(new SharedActions.SetPluginConfigs(data['pluginsConfigs']));

                                    this.store.dispatch(new AuthActions.SetAuthUser(data['auth']));
                                }
                            )
                            .toPromise();
                    }
                }
            )
            .subscribe();;
    }
}
