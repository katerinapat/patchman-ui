import { CLEAR_ADVISORY_DETAILS, FETCH_ADVISORY_DETAILS } from '../ActionTypes';

let initialState = {
    data: { attributes: {} },
    isLoading: true
};

// Reducer
export const AdvisoryDetailStore = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADVISORY_DETAILS + '_FULFILLED':
            return {
                ...state,
                isLoading: false,
                data: action.payload.data
            };
        case FETCH_ADVISORY_DETAILS + '_PENDING':
            return {
                ...state,
                isLoading: true
            };
        case CLEAR_ADVISORY_DETAILS:
            return initialState;

        default:
            return state;
    }
};
