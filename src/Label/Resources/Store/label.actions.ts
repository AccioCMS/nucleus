import { Action } from '@ngrx/store';

export const SET_SETTINGS_LABELS = 'SET_SETTINGS_LABELS';
export const SET_POST_TYPE_LABELS = 'SET_POST_TYPE_LABELS';

export class SetSettingsLabels implements Action{
    readonly type = SET_SETTINGS_LABELS;

    constructor(public payload: []){}
}

export class SetPostTypesLabels implements Action{
    readonly type = SET_POST_TYPE_LABELS;

    constructor(public payload: []){}
}

export type LabelActions = SetSettingsLabels | SetPostTypesLabels;
