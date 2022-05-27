import { QueryStatus } from '../types';
import { TabledataSource } from '../../component/InteractiveTable';

const initialState = {
  loading: false,
  dataSource: { data: [], total: 0 } as TabledataSource,
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
