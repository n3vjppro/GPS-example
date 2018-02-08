import MapMarker from '../../Component/Maps/MapMarker';
import { fetchDirections } from '../Actions/AllActions/AllActionMap';
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        latitude: state.mapReducers.latitude,
        longitude: state.mapReducers.longitude,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onFetchDirections: (directions) => {
            dispatch(fetchDirections(directions));
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(MapMarker);