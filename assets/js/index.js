import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, match } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import createRoutes from './routes';
const state = window.__STATE__; // eslint-disable-line no-underscore-dangle
const store = window.store = configureStore(state, browserHistory);

store.subscribe(function() {
    const { meta } = store.getState();
    document.title = meta.title;
});

const mountNode = document.getElementById('root');
window.$ = document.querySelectorAll.bind(document);

createRoutes(browserHistory, store).then(function(routes) {
    browserHistory.listen(function() {
        match({
            history: browserHistory,
            routes
            // location: window.location.pathname
        }, function(err, redirectLocation, renderProps) {
            ReactDOM.render(
            (
                <Provider store={store}>
                    {routes}
                </Provider>
            ), mountNode);
        });
    });
});
