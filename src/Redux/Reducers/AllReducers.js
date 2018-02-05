import { combineReducers } from 'redux';
import mapReducers from './mapReducers';
import headerSearchReducers from './headerSearchReducers';

const allReducers = combineReducers({
    mapReducers,
    headerSearchReducers
    //you can add more reducers here, separated by , !
});
export default allReducers;