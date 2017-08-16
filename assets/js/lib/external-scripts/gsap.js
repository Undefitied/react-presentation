import load from '../script-loader';

const GSAP_URL = '/vendor/TweenMax.js';
const DS_URL = '/vendor/DrawSVGPlugin.js';
const MORPH = '/vendor/MorphSVGPlugin.js';
const SCROLL = '/vendor/ScrollToPlugin.js';

export default function makeLoader() {
    return function() {
        return Promise.all([
            load(GSAP_URL),
            load(DS_URL),
            load(MORPH),
            load(SCROLL)
        ]);
    };
}

