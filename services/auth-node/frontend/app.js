import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import localForage from 'localforage'

import AppRouter from './routers/app-router';
import configureStore from './config/store';
import 'normalize.css/normalize.css';
import './styles/styles.scss';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(<p>Loading...</p>, document.getElementById('app'));

persistStore(store, { storage: localForage, whitelist: ['auth'] }, () => {
  ReactDOM.render(jsx, document.getElementById('app'));
});
