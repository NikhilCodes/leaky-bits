import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

const configureStore = (rootReducer, rootSaga) => {
  const middlewares = [];
  const enhancers = [];

  const sagaMiddleware = createSagaMiddleware();

  // All Redux Middlewares
  middlewares.push(sagaMiddleware); // Saga Middleware

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger()); // Redux Logger Middleware
  }

  // Assemble middlewares
  enhancers.push(applyMiddleware(...middlewares));

  // Create Redux Store
  const store = createStore(rootReducer, compose(...enhancers));

  // kick off root saga
  sagaMiddleware.run(rootSaga);

  return {
    store,
    sagaMiddleware,
  };
};

export default configureStore;
