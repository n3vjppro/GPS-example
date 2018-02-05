import { SEARCH } from '../Actions/ActionTypes/ActionSearchTypes';
const stateDefault={
    textSearch:'',
}
const headerSearchReducers = (state = stateDefault , action) => {
    switch (action.type) {
        case SEARCH:
            return {
                textSearch: action.textSearch
            }
        default:
            return state; //state does not change
    }
}

export default headerSearchReducers;