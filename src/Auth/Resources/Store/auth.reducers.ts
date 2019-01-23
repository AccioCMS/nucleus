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
      about: null,
      avatar: null,
      country: null,
      createdByUserID: null,
      created_at: "2019-01-22 15:23:04",
      email: "arbnor.osmani@manaferra.com",
      firstName: 'Arbnor',
      gravatar: null,
      isActive: 1,
      lastName: 'Osmani',
      phone: null,
      profileImageID: 1,
      profileimage: '../../../../assets/images/avatars/Velazquez.jpg',
      slug: "arbnor",
      street: null,
      updated_at: "2019-01-22 15:23:04",
      userID: 21
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

        // case (AuthActions.SET_AUTH_USER):
        //   return {
        //     ...state,
        //     authUser: action.payload
        //   };  
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