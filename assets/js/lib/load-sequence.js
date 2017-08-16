import Promise from 'bluebird';

// /img/slide/comps/_COMP 001 IN/_COMP OO1 IN_00000.png
function zeroPad(num, max) {
    const s = String(num);
    if (s.length < max) {
        const toAdd = max - s.length;
        return `${('0').repeat(toAdd)}${s}`;
    } else {
        return s;
    }
}

function loadImage(uri) {
    return new Promise(function(res, rej) {
        const i = new Image();
        i.src = uri;
        i.crossorigin = true;
        i.onload = res.bind(null, i);
        i.onerror = rej;
    });
}

export default function(baseName, quantity, startAt = 0) {
    const params = [];
    for (let i = 0; i < quantity; i++) {
        params.push(`${baseName}${zeroPad(i, 5)}.png`);
    }
    const loadingImages = Promise.map(params, loadImage, { concurrency: 4 });
    loadingImages.then(function(arrayOfLoadedImages) {
        return arrayOfLoadedImages;
    }).catch(function(err) {
        // boom, try again?
        console.log(err);
    });
    return loadingImages;
}
