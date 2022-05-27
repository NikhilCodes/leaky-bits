import { all, fork } from 'redux-saga/effects';

import querySaga from './query.saga';

// Connect types to sagas
const rootSaga = function* root() {
  yield all([
    fork(querySaga),
  ]);
};

export default rootSaga;
