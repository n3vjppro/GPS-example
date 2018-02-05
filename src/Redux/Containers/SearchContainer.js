import Search from '../../Screen/Search/Search';
import { headerSearch } from '../Actions/AllActions/AllActionSearch';
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        textSearch: state.headerSearchReducers.textSearch
    }
}
export default connect(mapStateToProps)(Search);