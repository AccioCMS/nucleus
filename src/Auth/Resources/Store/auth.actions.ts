import { Action } from '@ngrx/store';

export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';
export const SET_AUTH_USER = 'SET_AUTH_USER';


export class Signin implements Action {
    readonly type = SIGNIN;

    constructor(public payload: string){}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class SetAuthUser implements Action {
    readonly type = SET_AUTH_USER;

    constructor(public payload: object){}
}

export type AuthActions =  Signin | Logout | SetAuthUser;