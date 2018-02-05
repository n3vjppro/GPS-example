import HeaderSearch from '../../Component/HeaderSearch/HeaderSearch';
import { headerSearch } from '../Actions/AllActions/AllActionSearch';
import { connect } from 'react-redux';
const mapDispatchToProps = (dispatch) => {
    return {
        search: (textSearch) => {
            dispatch(headerSearch(textSearch));
        }
    };
}
export default connect(null, mapDispatchToProps)(HeaderSearch);