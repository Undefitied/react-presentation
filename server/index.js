import express from 'express';
import es6render from 'express-es6-template-engine';
import { resolve } from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import userAgent from 'express-useragent';
import cx from 'classnames';
import Promise from 'bluebird';
import { useRouterHistory, RouterContext, match } from 'react-router';
import { createMemoryHistory, useQueries } from 'history';
import { Provider } from 'react-redux';
import apicache from 'apicache';
const cache = apicache.options({
    debug: true
}).middleware;
import url from 'url';
import rp from 'request-promise';

import debounce from '../assets/js/lib/debounce';
import configureStore from '../assets/js/store/configureStore';
import createRoutes from '../assets/js/routes';
import assetPath from './lib/asset-path';
import config from '../assets/js/lib/config';
import { updateUA } from '../assets/js/actions/ua';
import mail from './mail';
import { changeBgVisibility } from '../assets/js/actions/navbar';

const USE_CACHE = config.get('useCache');
const clientConfig = {};
clientConfig.apiUrl = config.get('apiUrl');
clientConfig.staticPrefix = config.get('staticPrefix');
clientConfig.contentfulAccessToken = config.get('contentfulAccessToken');
clientConfig.contentfulSpace = config.get('contentfulSpace');
clientConfig.externalUrl = config.get('externalUrl');
clientConfig.gaId = config.get('gaId');

let clearCounter = 0;
const debouncedClear = debounce(function() {
    console.log('cache cleared. times called: ', ++clearCounter);
    apicache.clear();
}, 10000);

const cacheWrapper = (function cacheWrapper() {
    if (USE_CACHE) {
        console.log('returning cache middleware');
        return cache('1 minute');
    } else {
        return function(req, res, next) {
            console.log('skipping cache');
            return next();
        };
    }
}());


export default function makeServer (middleware) {
    const app = express();
    app.engine('html', es6render);
    app.set('views', resolve(__dirname, 'views'));
    app.set('view engine', 'html');

    if (middleware) {
        app.use(middleware);
    }
    app.use(mail);

    app.get('/api/cache', function(req, res) {
        res.send(apicache.getIndex());
    });

    app.all('/api/cache/clear', function(req, res) {
        console.log('Queuing cache clear.');
        debouncedClear();
        res.send('Queuing cache clear.');
    });

    app.get('/spaces/*', cacheWrapper, function(req, res) {
        const options = url.parse(req.url);
        options.host = 'cdn.contentful.com';
        options.protocol = 'http';
        delete req.headers.host;
        delete req.headers['accept-encoding'];
        delete req.headers['user-agent'];
        options.headers = req.headers;
        options.method = req.method;
        options.agent = false;

        console.log('requesting to:', url.format(options));
        rp({
            method: 'GET',
            uri: url.format(options),
            headers: req.headers,
            resolveWithFullResponse: true
        }).then(function(response) {
            res.status(response.statusCode);
            res.send(response.body);
        }).catch(err => res.status(500).send(err));
    });

    app.get('*', function(req, res) {
        const ua = userAgent.parse(req.headers['user-agent']);
        const isIE = ua.isIE || ua.isEdge;
        const isTouch = ua.isMobile || ua.isTablet;
        const history = useRouterHistory(useQueries(createMemoryHistory))();
        const store = configureStore({}, history);
        store.dispatch(updateUA(isIE ? 'ie' : isTouch ? 'touch' : 'modern'));
        const gettingRoutes = createRoutes(history, store);
        const location = history.createLocation(req.url);

        function subscribeUrl () {
            let currentUrl = location.pathname + location.search;
            const unsubscribe = history.listen(newLoc => {
                if (newLoc.action === 'PUSH') {
                    currentUrl = newLoc.pathname + newLoc.search;
                }
            });
            return [() => currentUrl, unsubscribe];
        }

        gettingRoutes.then(function(routes) {
            match({ routes, location }, function(error, redirectLocation, renderProps) {
                if (redirectLocation) {
                    res.redirect(302, redirectLocation.pathname + redirectLocation.search);
                } else if (error) {
                    res.status(500).send(error.message);
                } else if (typeof renderProps === 'undefined') {
                    console.log(`404 - ${req.url}`);
                    res.status(404).send('Not Found');
                } else {
                    const [getCurrentUrl, unsubscribe] = subscribeUrl();
                    const reqUrl = location.pathname + location.search;
                    const loaders = renderProps.components.reduce((acc, comp) => {
                        if (comp && comp.fetchData) {
                            acc.push(comp.fetchData({
                                location: renderProps.location,
                                params: renderProps.params,
                                history,
                                store
                            }));
                        }
                        return acc;
                    }, []);
                    if (location.pathname === '/') {
                        store.dispatch(changeBgVisibility(false));
                    }

                    Promise.all(loaders).then(function() {
                        const html = ReactDOMServer.renderToString(
                            <Provider store={store}>
                                {<RouterContext {...renderProps} />}
                            </Provider>
                        );
                        const state = store.getState();
                        delete state.routing;
                        const meta = state.meta;
                        if (getCurrentUrl() === reqUrl) {
                            res.setHeader('Cache-Control', 'public, max-age=60');
                            res.render('index', {
                                locals: {
                                    html,
                                    htmlClasses: cx('noscript', {
                                        ie: isIE
                                    }),
                                    state: JSON.stringify(state),
                                    title: meta.title,
                                    description: meta.description,
                                    config: JSON.stringify({
                                        ...clientConfig,
                                        isIE
                                    }),
                                    assetPath
                                }
                            });
                            console.log(`200 - ${req.url}`);
                        } else {
                            console.log(`302 - ${req.url} => ${getCurrentUrl()}`);
                            res.redirect(302, getCurrentUrl());
                        }
                    }).catch(function(e) { return e.message === 'not found'; }, function(err) {
                        console.log(`404 - ${req.url} - ${err.message}`);
                        res.status(404).send('not found');
                    }).catch(function(err) {
                        // or next(err) and use general error handler in express
                        console.log(err, err.stack);
                        console.log(`500 - ${req.url} - ${err.message}`);
                        res.status(500).send(err.message);
                    }).finally(function() {
                        unsubscribe();
                    });
                }
            });
        }).catch(function(err) {
            console.log(err.stack);
            console.log(`500 - ${req.url} - ${err.message}`);
            res.status(500).send(err.message);
        });
    });

    return app;
}
