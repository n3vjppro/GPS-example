import HomeMap from '../../Screen/Home/HomeMap';
import { trackingLocation } from '../Actions/AllActions/AllActionMap';
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        latitude: state.mapReducers.latitude,
        longitude: state.mapReducers.longitude,
        directions: state.mapMarkerReducer.directions
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        autoLoad: (latitude, longitude) => {
            dispatch(trackingLocation(latitude, longitude));
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeMap);