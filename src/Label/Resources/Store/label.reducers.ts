import * as LabelActions from './label.actions';

export interface LabelState {
    generalLabels: [];
    settingsLabels: [];
    postTypeLabels: [];
    userLabels: [];
    postLabels: [];
    categoryLabels: [];
    tagLabels: [];
}

const initialState: LabelState = {
    generalLabels: [],
    settingsLabels: [],
    postTypeLabels: [],
    userLabels: [],
    postLabels: [],
    categoryLabels: [],
    tagLabels: []
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

        case (LabelActions.SET_USER_LABELS):
            return {
                ...state,
                userLabels: action.payload
            };

        case (LabelActions.SET_POST_LABELS):
            return {
                ...state,
                postLabesl: action.payload
            };

        case (LabelActions.SET_CATEGORY_LABELS):
            return {
                ...state,
                categoryLabels: action.payload
            };

        case (LabelActions.SET_TAG_LABELS):
            return {
                ...state,
                tagLabels: action.payload
            };
        default:
            return state;
    }
}
