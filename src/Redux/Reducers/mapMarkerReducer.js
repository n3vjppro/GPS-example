import { FETCH_DIRECTIONS } from '../Actions/ActionTypes/ActionMapTypes';

const stateDefault = {
    directions: {
        distanceLocation: 0,
        timeGotoStore: 0,
        coords: []
    }

}

const mapReducers = (state = stateDefault, action) => {
    switch (action.type) {
        case FETCH_DIRECTIONS:
            return {
                directions: {
                    distanceLocation: action.directions.distanceLocation,
                    timeGotoStore: action.directions.timeGotoStore,
                    coords: action.directions.coords
                }

            };
        default:
            return state; //state does not change
    }
}

export default mapReducers;