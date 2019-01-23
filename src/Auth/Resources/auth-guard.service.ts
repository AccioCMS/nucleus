import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";

import * as fromAuth from './Store/auth.reducers';
import {take, map} from 'rxjs/operators';
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private store: Store<fromAuth.State>){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.store.select('auth')
        .pipe(
            take(1),
            map((authState: fromAuth.State) => {
                return authState.authenticated;
            })
        );
    }
}
