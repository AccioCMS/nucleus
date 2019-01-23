import { Action } from '@ngrx/store';

export const SET_APPLICATION_MENU_LINKS = 'SET_APPLICATION_MENU_LINKS';
export const SET_GLOBAL_DATA = 'SET_GLOBAL_DATA';
export const SET_CMS_MENUS = 'SET_CMS_MENUS';
export const SET_LANGUAGES = 'SET_LANGUAGES';
export const SET_PLUGIN_CONFIGS = 'SET_PLUGIN_CONFIGS';

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

export type SharedActions =  SetAppMenuLinks | SetGlobalData | SetCmsMenus | SetLanguages | SetPluginConfigs;