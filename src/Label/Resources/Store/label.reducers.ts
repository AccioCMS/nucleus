import * as LabelActions from './label.actions';

export interface LabelState {
    generalLabels: [];
    settingsLabels: [];
    postTypeLabels: [];
}

const initialState: LabelState = {
    generalLabels: [],
    settingsLabels: [],
    postTypeLabels: []
}

export function labelReducer(state = initialState, action: LabelActions.LabelActions){
    switch (action.type) {
        case (LabelActions.SET_GENERAL_LABELS):
            return {
                ...state,
                generalLabels: action.payload
            };

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
