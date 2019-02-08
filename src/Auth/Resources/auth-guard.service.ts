import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";

import * as fromAuth from './Store/auth.reducers';
import {take, map} from 'rxjs/operators';
import { Injectable } from "@angular/core";

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Rx";

@Injectable()
export class AuthGuard implements CanActivate{
    check = false;

    constructor(
        private store: Store<fromAuth.State>,
        private router: Router,
        private httpClient: HttpClient
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
        let checkAuth = false;
        this.store.select('auth')
            .pipe(take(1))
            .subscribe(
                (authSate) => {
                    if(authSate.authenticated){
                        checkAuth = true;
                    }
                }
            );

        if(checkAuth){
            return true;
        }

        return this.httpClient.get('/admin/get-base-data/en')
            .map(
                (response) => {
                    if(response['status'] == true){
                        return true;
                    }else{
                        this.router.navigate(['/admin/login']);
                        return false;
                    }
                }
            );
    }
}
