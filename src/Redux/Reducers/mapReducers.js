import { TRACKING_LOCATION } from '../Actions/ActionTypes/ActionMapTypes';
const stateDefault={
    longitude:0,
    latitude:0
}
const mapReducers = (state = stateDefault , action) => {
    switch (action.type) {
        case TRACKING_LOCATION:
            return {
                latitude: action.latitude,
                longitude:action.longitude
            }
        default:
            return state; //state does not change
    }
}

export default mapReducers;