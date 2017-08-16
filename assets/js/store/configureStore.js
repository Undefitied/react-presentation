import { createStore, applyMiddleware } from 'redux';
// import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
// import apiMiddleware from '../middleware/api';
import rootReducer from '../reducers';


export default function configureStore(initialState, history) {
    const createStoreWithMiddleware = applyMiddleware(
      thunkMiddleware
    //   routerMiddleware(history)
      // apiMiddleware
    )(createStore);
    const store = createStoreWithMiddleware(rootReducer, initialState,
    typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f);

    if (module.hot) {
        // Enable hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
