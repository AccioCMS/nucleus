import { Action } from '@ngrx/store';

export const SET_GENERAL_LABELS = 'SET_GENERAL_LABELS';
export const SET_SETTINGS_LABELS = 'SET_SETTINGS_LABELS';
export const SET_POST_TYPE_LABELS = 'SET_POST_TYPE_LABELS';
export const SET_USER_LABELS = 'SET_USER_LABELS';
export const SET_POST_LABELS = 'SET_POST_LABELS';
export const SET_CATEGORY_LABELS = 'SET_CATEGORY_LABELS';
export const SET_TAG_LABELS = 'SET_TAG_LABELS';

export class SetGeneralLabels implements Action{
    readonly type = SET_GENERAL_LABELS;

    constructor(public payload: []){}
}

export class SetSettingsLabels implements Action{
    readonly type = SET_SETTINGS_LABELS;

    constructor(public payload: []){}
}

export class SetPostTypesLabels implements Action{
    readonly type = SET_POST_TYPE_LABELS;

    constructor(public payload: []){}
}

export class SetUserLabels implements Action{
    readonly type = SET_USER_LABELS;

    constructor(public payload: []){}
}

export class SetPostLabels implements Action{
    readonly type = SET_POST_LABELS;

    constructor(public payload: []){}
}

export class SetCategoryLabels implements Action{
    readonly type = SET_CATEGORY_LABELS;

    constructor(public payload: []){}
}

export class SetTagLabels implements Action{
    readonly type = SET_TAG_LABELS;

    constructor(public payload: []){}
}

export type LabelActions =
    SetGeneralLabels |
    SetSettingsLabels |
    SetPostTypesLabels |
    SetUserLabels |
    SetPostLabels |
    SetCategoryLabels |
    SetTagLabels;
