import { combineReducers } from 'redux';
import mapReducers from './mapReducers';
import headerSearchReducers from './headerSearchReducers';
import mapMarkerReducer from './mapMarkerReducer';
const allReducers = combineReducers({
    mapReducers,
    headerSearchReducers,
    mapMarkerReducer
    //you can add more reducers here, separated by , !
});
export default allReducers;