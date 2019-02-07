import { Action } from '@ngrx/store';

export const SET_APPLICATION_MENU_LINKS = 'SET_APPLICATION_MENU_LINKS';
export const SET_GLOBAL_DATA = 'SET_GLOBAL_DATA';
export const SET_CMS_MENUS = 'SET_CMS_MENUS';
export const SET_LANGUAGES = 'SET_LANGUAGES';
export const SET_PLUGIN_CONFIGS = 'SET_PLUGIN_CONFIGS';
export const SET_IS_LOADING = 'SET_IS_LOADING';

export const ADD_LANGUAGE = 'ADD_LANGUAGE';
export const DELETE_LANGUAGE = 'DELETE_LANGUAGE';
export const DELETE_MULTIPLE_LANGUAGES = 'DELETE_MULTIPLE_LANGUAGES';
export const SET_SITE_TITLE = 'SET_SITE_TITLE';

export class SetAppMenuLinks implements Action{
    readonly type = SET_APPLICATION_MENU_LINKS;

    constructor(public payload: []){}
}

export class SetGlobalData implements Action {
    readonly type = SET_GLOBAL_DATA;

    constructor(public payload: object){}
}

export class SetCmsMenus implements Action {
    readonly type = SET_CMS_MENUS;

    constructor(public payload: object){}
}

export class SetLanguages implements Action {
    readonly type = SET_LANGUAGES;

    constructor(public payload: any){}
}

export class SetPluginConfigs implements Action {
    readonly type = SET_PLUGIN_CONFIGS;

    constructor(public payload: object){}
}

export class SetIsLoading implements Action {
    readonly type = SET_IS_LOADING;

    constructor(public payload: boolean){}
}


export class AddLanguage implements Action {
    readonly type = ADD_LANGUAGE;

    constructor(public payload: {}){}
}

export class DeleteLanguage implements Action {
    readonly type = DELETE_LANGUAGE;

    constructor(public payload: string){}
}

export class DeleteMupltipleLanguages implements Action {
    readonly type = DELETE_MULTIPLE_LANGUAGES;

    constructor(public payload: any[]){}
}

export class SetSiteTitle implements Action {
    readonly type = SET_SITE_TITLE;

    constructor(public payload: string){}
}

export type SharedActions =
    SetAppMenuLinks |
    SetGlobalData |
    SetCmsMenus |
    SetLanguages |
    SetPluginConfigs |
    SetIsLoading |
    AddLanguage |
    DeleteLanguage |
    DeleteMupltipleLanguages |
    SetSiteTitle;
