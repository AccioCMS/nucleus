import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";

import * as fromAuth from './Store/auth.reducers';
import {take, map} from 'rxjs/operators';
import { Injectable } from "@angular/core";

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate{
    check = false;

    constructor(
        private store: Store<fromAuth.State>,
        private router: Router,
        private httpClient: HttpClient
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.store.select('auth')
        .pipe(
            take(1),
            map((authState: fromAuth.State) => {
                if(authState.authenticated){
                    return true;
                }else{
                    this.httpClient.get('/test/auth')
                    .map(
                        (data) => {
                            if(data['status'] == true){
                                return true;
                            }else{
                                this.router.navigate(['/admin/login']);
                                return false;
                            }
                        }
                    )
                    .subscribe();
                }

                return true;
            })
        );
    }
}
