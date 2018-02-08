import { TRACKING_LOCATION, FETCH_DIRECTIONS } from '../ActionTypes/ActionMapTypes';


//Action: "tracking location"
export const trackingLocation = (latitude, longitude) => {
    return {
        type: TRACKING_LOCATION,
        latitude,
        longitude
    }
}
//Action: "FETCH_DIRECTIONS"
export const fetchDirections = (directions) => {
    return {
        type: FETCH_DIRECTIONS,
        directions
    }
}