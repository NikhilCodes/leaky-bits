import { put, call, takeLatest, all } from 'redux-saga/effects';

import { QueryStatus, QueryActions } from '../types';
import { getResponseForQuery } from '../../api/public/query.api';

export function* executeQuery(action) {
  const { query, page, pageSize, sorter } = action.payload;
  try {
    yield put({ type: QueryStatus.PENDING });
    const dataSource = yield call(getResponseForQuery, { query, page, pageSize, sorter });
    yield put({ type: QueryStatus.SUCCESS, dataSource, lastQuery: query });
  } catch (error) {
    yield put({ type: QueryStatus.ERROR, error });
  }
}

export default function* querySaga() {
  yield all([
    takeLatest(QueryActions.EXECUTE_QUERY, executeQuery),
  ]);
}
