import { combineReducers } from 'redux';
import cful from './contentful';
import navbar from './navbar';
import ua from './ua';
import meta from './meta';

const rootReducer = combineReducers({
    cful,
    navbar,
    ua,
    meta
});

export default rootReducer;
