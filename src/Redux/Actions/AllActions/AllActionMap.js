import { TRACKING_LOCATION, SEARCH } from '../ActionTypes/ActionMapTypes';


//Action: "tracking location"
export const trackingLocation = (latitude, longitude) => {
    return {
        type: TRACKING_LOCATION,
        latitude,
        longitude
    }
}
