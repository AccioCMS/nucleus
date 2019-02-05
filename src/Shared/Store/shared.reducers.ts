import * as SharedActions from './shared.actions';
import { FuseNavigation } from '../@fuse/types';

export interface SharedState {
    applicationMenuLinks: FuseNavigation[];
    globalData: object;
    cmsMenus: [];
    languages: any;
    pluginsConfigs: [];
    isLoading: boolean;
}

const initialState: SharedState = {
    applicationMenuLinks: [],
    globalData: null,
    cmsMenus: null,
    languages: [],
    pluginsConfigs: null,
    isLoading: false
}

export function sharedReducer(state = initialState, action: SharedActions.SharedActions){
    switch (action.type) {
        case (SharedActions.SET_APPLICATION_MENU_LINKS):
          return {
            ...state,
            applicationMenuLinks: action.payload
          };

        case (SharedActions.SET_GLOBAL_DATA):
          return {
            ...state,
            globalData: action.payload
          };

        case (SharedActions.SET_CMS_MENUS):
          return {
            ...state,
            cmsMenus: action.payload
          };

        case (SharedActions.SET_LANGUAGES):
          return {
            ...state,
            languages: action.payload
          };

        case (SharedActions.SET_PLUGIN_CONFIGS):
          return {
            ...state,
            pluginsConfigs: action.payload
          };

        case (SharedActions.SET_IS_LOADING):
            return {
                ...state,
                isLoading: action.payload
            };

        case (SharedActions.ADD_LANGUAGE):
            return {
                ...state,
                languages: [...state.languages, action.payload]
            };

        case (SharedActions.DELETE_LANGUAGE):
            let oldLanguages = [...state.languages];
            oldLanguages = oldLanguages.filter(function( obj ) {
                return obj.languageID != action.payload;
            });
            return{
                ...state,
                languages: oldLanguages
            };

        case (SharedActions.DELETE_MULTIPLE_LANGUAGES):
            let keyArray = action.payload;
            let oldLanguagesM = [...state.languages];
            oldLanguagesM = oldLanguagesM.filter(item => !keyArray.includes(item.languageID) );
            return{
                ...state,
                languages: oldLanguagesM
            };

        default:
          return state;
    }
}
