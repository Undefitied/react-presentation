import {
    GET_DATA,
    GET_PAGES,
    GET_STRUCTURE,
    GET_NEWS,
    GET_CURRENT_NEWS_ITEM
} from '../actions/contentful';

function getDefaultState() {
    return {
        pages: [],
        news: [],
        displayNewsItem: null
    };
}

export default function contentful(state = getDefaultState(), action) {
    switch (action.type) {
        case GET_DATA:
            state = {
                ...state,
                home: action.value
            };
            break;
        case GET_PAGES:
            state = {
                ...state,
                pages: action.value
            };
            break;
        case GET_NEWS:
            state = {
                ...state,
                news: action.value
            };
            break;
        case GET_STRUCTURE:
            state = {
                ...state,
                structure: {
                    topMenu: action.value
                }
            };
            break;
        case GET_CURRENT_NEWS_ITEM:
            state = {
                ...state,
                displayNewsItem: action.value
            };
            break;
        default:
            break;
    }

    return state;
}
