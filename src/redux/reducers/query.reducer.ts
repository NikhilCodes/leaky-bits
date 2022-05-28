import { QueryStatus } from '../types';
import { TabledataSource } from '../../component/InteractiveTable';

const initialState = {
  loading: false,
  lastQuery: null,
  dataSource: new TabledataSource(),
  error: null,
};

const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case QueryStatus.PENDING:
      return { ...state, loading: true, error: null };
    case QueryStatus.SUCCESS:
      return {
        ...state,
        loading: false,
        dataSource: action.dataSource,
        error: null,
        lastQuery: action.lastQuery
      };
    case QueryStatus.ERROR:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default queryReducer;
