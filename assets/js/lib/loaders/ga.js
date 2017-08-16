import scriptLoader from '../script-loader';
import config from '../config';
import IS_SERVER from '../is-server';

let loadingGa;
function makeLoader() {
    return loadingGa = scriptLoader('//www.google-analytics.com/analytics.js').then(function() {
        console.log('GA Universal initialising');
        return window.ga;
    }).then(function(ga) {
        ga('create', config.get('gaId'));
        console.log('GA Universal Loaded');
        return ga;
    });
}

export default IS_SERVER ? Promise.resolve() : loadingGa ? loadingGa : makeLoader();
