import { Action } from '@ngrx/store';

export const TRY_SIGNIN = 'TRY_SIGNIN';
export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';
export const SET_TOKEN = 'SET_TOKEN';

export class TrySignin implements Action{
    readonly type = TRY_SIGNIN;

    constructor(public payload: {email: string, password: string}){}
}

export class Signin implements Action {
    readonly type = SIGNIN;

    constructor(public payload: string){}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export type AuthActions =  Signin | Logout | TrySignin;