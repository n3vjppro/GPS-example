import {SEARCH} from '../ActionTypes/ActionSearchTypes'

//Action: "header Search"
export const headerSearch = (textSearch) => {
    return {
        type: SEARCH,
        textSearch
    }
}
