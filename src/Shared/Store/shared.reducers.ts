import * as SharedActions from './shared.actions';
import { FuseNavigation } from '../@fuse/types';

export interface SharedState {
    applicationMenuLinks: FuseNavigation[];
    globalData: object;
    cmsMenus: [];
    languages: any;
    pluginsConfigs: [];
}

const initialState: SharedState = {
    applicationMenuLinks: [
        {
            id       : 'applications',
            title    : 'Applications',
            translate: 'NAV.APPLICATIONS',
            type     : 'group',
            children : [
                {
                    id       : 'sample',
                    title    : 'Sample',
                    translate: 'NAV.SAMPLE.TITLE',
                    type     : 'item',
                    icon     : 'email',
                    url      : '/test/fuse',
                    badge    : {
                        title    : '25',
                        translate: 'NAV.SAMPLE.BADGE',
                        bg       : '#F44336',
                        fg       : '#FFFFFF'
                    }
                },
                {
                    id       : 'users',
                    title    : 'Users',
                    translate: 'NAV.USERS.TITLE',
                    type     : 'item',
                    icon     : 'account_box',
                    url      : '/test/users'
                },
                {
                    id       : 'users',
                    title    : 'Users',
                    translate: 'NAV.POST.ADD',
                    type     : 'item',
                    icon     : 'account_box',
                    url      : '/test/post/add'
                },
                {
                    id       : 'users',
                    title    : 'Users',
                    translate: 'NAV.SETTINGS',
                    type     : 'item',
                    icon     : 'account_box',
                    url      : '/test/settings/general'
                }
            ]
        },
        {
            id       : 'post-types',
            title    : 'Post Types',
            translate: 'NAV.POST_TYPES',
            type     : 'group',
            children : [
                {
                    id       : 'articles',
                    title    : 'Articles',
                    translate: 'NAV.ARTICLES.TITLE',
                    type     : 'item',
                    icon     : 'label',
                    url      : '/articles'
                }
            ]
        },
        {
            id       : 'plugins',
            title    : 'Plugins',
            translate: 'NAV.PLUGINS',
            type     : 'group',
            icon     : 'library_add',
            children : [
                {
                    id   : 'plugin-1',
                    title: 'Plugin 1',
                    type : 'item',
                    url  : '/plugins/first',
                    icon : 'library_add',
                },
                {
                    id   : 'plugin-2',
                    title: 'Plugin 2',
                    type : 'item',
                    url  : '/plugins/second',
                    icon : 'library_add',
                }
            ]
        },
    ],
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
        default:
          return state;
    }
}