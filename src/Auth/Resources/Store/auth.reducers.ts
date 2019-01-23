import * as AuthActions from './auth.actions';

export interface State {
    token: string;
    authenticated: boolean;
    authUser: object;
}

const initialState: State = {
    token: null,
    authenticated: false,
    authUser: {
      profileimage: {
        url: ''
      }
    }
}

export function authReducer(state = initialState, action: AuthActions.AuthActions){
    switch (action.type) {
        case (AuthActions.SIGNIN):
          return {
            ...state,
            authenticated: true,
            token: action.payload
          };
        case (AuthActions.SET_AUTH_USER):
          return {
            ...state,
            authUser: action.payload
          };  
        case (AuthActions.LOGOUT):
          return {
            ...state,
            token: null,
            authenticated: false
          };
          
        default:
          return state;
    }
}