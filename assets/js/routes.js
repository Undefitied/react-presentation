
import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { getContent, getPages } from './actions/contentful';
import App from './components/app';
import Home from './pages/home';
import GenericPage from './pages/generic-page';
import NewsDetail from './pages/news-detail';
import NewsList from './pages/news-list';
import Apply from './pages/apply';
import Career from './pages/career';
import Iprize from './pages/iprize';
import Unconference from './pages/unconference';
import CareerDetail from './pages/career-detail';
import Contact from './pages/contact';
import IS_SERVER from './lib/is-server';
import loadingGa from './lib/loaders/ga';


function pageChanged() {
    window.scrollTo(0, 0);

    loadingGa.then(function(ga) {
        ga('set', {
            page: window.location.pathname
        });
        ga('send', 'pageview');
    });
}

const makeRoutes = function(history, store) {
    return store.dispatch(getContent()).then(function() {
        const pages = store.getState().cful.pages;
        const toCreate = pages.reduce(function(routes, page) {
            if (page.sys.contentType.sys.id === 'genericPage') {
                routes.push(page.fields);
            }
            return routes;
        }, []);
        return (
            <Router
                history={history}
                onUpdate={pageChanged}>
                <Route path="/" component={App}>
                    <IndexRoute
                        component={Home} />
                    {toCreate.map(function(route) {
                        const comp = [];
                        switch (route.pageType) {
                            case 'news-list':
                                comp.push(<Route key={route.url} path={route.url} component={NewsList} />);
                                comp.push(<Route path={`${route.url}/:id/:title`} component={NewsDetail} />);
                                break;
                            case 'apply':
                                comp.push(<Route key={route.url} path={route.url} component={Apply} />);
                                break;
                            case 'career':
                                comp.push(<Route key={route.url} path={route.url} component={Career} />);
                                break;
                            case 'iprize':
                                comp.push(<Route key={route.url} path={route.url} component={Iprize} />);
                                break;
                            case 'unconference':
                                comp.push(<Route key={route.url} path={route.url} component={Unconference} />);
                                break;
                            case 'career-detail':
                                comp.push(<Route key={route.url} path={`${route.url}/:id`} component={CareerDetail} />);
                                break;
                            case 'contact':
                                comp.push(<Route key={route.url} path={route.url} component={Contact} />);
                                break;
                            default:
                                comp.push(<Route key={route.url} path={route.url} component={GenericPage} />);
                                break;
                        }
                        return comp;
                    })}
                    {!IS_SERVER && <Route path="*" component={function() { return <h1>Not Found</h1>; }} />}
                </Route>
            </Router>
        );
    });
};


export default makeRoutes;
