import * as LabelActions from './label.actions';
import {SET_POST_TYPE_LABELS} from "./label.actions";

export interface LabelState {
    settingsLabels: [];
    postTypeLabels: [];
}

const initialState: LabelState = {
    settingsLabels: [],
    postTypeLabels: []
}

export function labelReducer(state = initialState, action: LabelActions.LabelActions){
    switch (action.type) {
        case (LabelActions.SET_SETTINGS_LABELS):
            return {
                ...state,
                settingsLabels: action.payload
            };

        case (LabelActions.SET_POST_TYPE_LABELS):
            return {
                ...state,
                postTypeLabels: action.payload
            };

        default:
            return state;
    }
}
