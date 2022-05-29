import configureStore from './configureStore';
import reducers from './reducers';
import rootSaga from './sagas';

const { store } = configureStore(reducers, rootSaga);
const action = (type, payload = null) => store.dispatch({ type, payload });

export { store, action };
