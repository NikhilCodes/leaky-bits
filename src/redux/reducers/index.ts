import { combineReducers } from 'redux';
import queryReducer from './query.reducer';

const allReducers = {
  queryReducer
};

const rootReducer = combineReducers(allReducers);

export default rootReducer;
