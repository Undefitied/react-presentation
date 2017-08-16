import contentful from 'contentful';
import dashify from 'dashify';
import config from '../lib/config';
import IS_SERVER from '../lib/is-server';
import Promise from 'bluebird';

export const client = contentful.createClient({
    space: config.get('contentfulSpace'),
    accessToken: config.get('contentfulAccessToken'),
    host: IS_SERVER ? 'localhost:3030' : config.get('externalUrl'),
    insecure: true
});


export const GET_STRUCTURE = 'GET_STRUCTURE';
export const GET_NEWS = 'GET_NEWS';
export const GET_DATA = 'GET_DATA';
export const GET_PAGES = 'GET_PAGES';
export const GET_CURRENT_NEWS_ITEM = 'GET_CURRENT_NEWS_ITEM';

function addUrls(data, key = 'items') {
    data[key].forEach(function (item) {
        if (item.fields.pageType === 'news-list') {
            item.fields.url = 'news-event';
        } else if (item.fields.pageType === 'career') {
            item.fields.url = 'career';
        } else {
            item.fields.url = item.fields.url || dashify(item.fields.title);
        }
    });
    return data;
}

function enrichNewsArticle(item) {
    item.fields.id = item.sys.id;
    item.fields.urlifiedTitle = dashify(item.fields.title);
    return item;
}


if (!IS_SERVER) {
    window.dashify = dashify;
    window.addUrls = addUrls;
    window.log = console.log.bind(console);
    window.client = client;
}

export function getContent() {
    return function (dispatch, getState) {
        const state = getState();
        if (state.cful && state.cful.news.length) {
            return Promise.resolve();
        }

        return client.getEntries({
            include: 10,
            skip: 0,
            limit: 500,
        })
            .then(function (data) {
                if (data.total > data.items.length) {
                    return new Promise(function (res, rej) {
                        // RD: I believe this 'skip' is wrong, as it
                        // needs to increment by 'limit' each time
                        client.getEntries({
                            include: 10,
                            skip: 0,
                            limit: 500,
                        }).then(function (nextPage) {
                            data.items = data.items.concat(nextPage.items);
                            res(data);
                        }).catch(rej);
                    });
                } else {
                    return data;
                }
            })
            .then(function (data) {
                const items = data.items;
                const pages = [];
                const newsArticles = [];
                const menus = [];

                items.forEach(function (item) {
                    switch (item.sys.contentType.sys.id) {
                        case 'newsItem':
                            enrichNewsArticle(item);
                            newsArticles.push(item);
                            break;
                        case 'genericPage':
                            pages.push(item);
                            break;
                        case 'topMenu':
                            try {
                                addUrls(item.fields, 'pages');
                                menus.push(item);
                            } catch (e) {
                                console.log(e);
                            }
                            break;
                        default:
                            // console.log('unhandled content_type:', item.sys.contentType.sys.id);
                            break;
                    }
                });

                newsArticles.sort(function (a, b) {
                    const dA = new Date(a.fields.displayDate).getTime();
                    const dB = new Date(b.fields.displayDate).getTime();
                    if (dB < dA) {
                        return -1;
                    } else if (dA < dB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                // setup url fields
                addUrls({ pages }, 'pages');

                dispatch({
                    type: GET_NEWS,
                    value: newsArticles
                });
                dispatch({
                    type: GET_PAGES,
                    value: pages
                });
                dispatch({
                    type: GET_STRUCTURE,
                    value: menus
                });
            });
    };
}

export function getNews() {
    return function (dispatch) {
        return client.getEntries({
            content_type: 'newsItem',
            order: '-fields.displayDate'
        }).then(function (data) {
            const items = data.items;
            items.forEach(enrichNewsArticle);
            dispatch({
                type: GET_NEWS,
                value: items
            });
        });
    };
}

export function getNewsItem(id) {
    return function (dispatch, getState) {
        if (id === null) {
            return Promise.resolve(dispatch({
                type: GET_CURRENT_NEWS_ITEM,
                value: null
            }));
        }
        return new Promise(function (res, rej) {
            const state = getState();

            // check if we have this item already available
            const item = state.cful.news.filter(i => i.fields.id === id).pop();

            if (item) {
                res(item);
            } else {
                // if not, let's have a look at contentful
                client.getEntries({
                    'sys.id': id,
                    include: 3
                }).then(response => {
                    if (response.total === 1) {
                        res(response.items.pop());
                    } else {
                        rej(new Error('not found'));
                    }
                });
            }
        }).then(function (item) {
            enrichNewsArticle(item);
            dispatch({
                type: GET_CURRENT_NEWS_ITEM,
                value: item
            });
        });
    };
}

export function getStructure() {
    return function (dispatch) {
        return client.getEntries({
            content_type: 'topMenu'
        }).then(function (data) {
            addUrls(data.items[0].fields, 'pages');
            addUrls(data.items[1].fields, 'pages');
            const fields = data.items;

            dispatch({
                type: GET_STRUCTURE,
                value: fields
            });
        });
    };
}

export function getHomePage() {
    return function (dispatch) {
        return client.getEntries({
            'fields.pageType[match]': 'Homepage',
            content_type: 'homePage'
        }).then(function (data) {
            const fields = data.items[0].fields;
            dispatch({
                type: GET_DATA,
                value: fields
            });
        });
    };
}

export function plainGetPages() {
    return client.getEntries({
        content_type: 'genericPage'
    }).then(addUrls);
}

export function getPages() {
    return function (dispatch) {
        return plainGetPages().then(function (data) {
            const fields = data.items;
            dispatch({
                type: GET_PAGES,
                value: fields
            });
            return data;
        });
    };
}
