import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { autoRehydrate } from 'redux-persist'

import authReducer from '../reducers/auth';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer
    }),
    composeEnhancers(
      applyMiddleware(thunk),
      autoRehydrate()
    )
  );

  return store;
};
