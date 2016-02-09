import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';

import createElmishStore from './elm/createElmishStore';
import forwardTo from './elm/forwardTo';

import { View, update } from './todoOnboarding';

const MainView = connect(appState => ({model: appState}))(props => <View {...props} />);

const store = createElmishStore(update);

const Application = () => (
  <Provider store={store}>
    <MainView />
  </Provider>
);

render(<Application />, document.getElementById('app'));
