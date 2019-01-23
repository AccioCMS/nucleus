import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";

import * as fromAuth from './Store/auth.reducers';
import {take, map} from 'rxjs/operators';
import { Injectable } from "@angular/core";

import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private store: Store<fromAuth.State>,
        private router: Router
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.store.select('auth')
        .pipe(
            take(1),
            map((authState: fromAuth.State) => {
                if(!authState.authenticated){
                    this.router.navigate(['/admin/login']);
                }
               
                return authState.authenticated;
            })
        );
    }
}
