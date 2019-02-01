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
    languages: [
        {
            id   : 'en',
            title: 'English',
            flag : 'us'
        }
    ],
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
        default:
          return state;
    }
}
