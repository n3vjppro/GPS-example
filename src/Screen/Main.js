import React from 'react';
import Router from '../Router/Router'

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import allReducers from '../Redux/Reducers/AllReducers';

let store = createStore(allReducers);

export default class Main extends React.Component {
  render() {
    return (
      <Provider store = {store}>
        <Router />
      </Provider>
    );
  }
}