/* global TimelineMax, TweenLite, Power0 */

import p2 from './slide-anims/p2';

export const slide2 = p2;

export function slide1() {
    const tl = new TimelineMax();
    return tl.progress(0.0000001).pause();
}

function attach(tl, sel, offset, position){
    // tl(sel, )
}



export function slide3() {
    const shapes = '.p3 .block';
    const tl = new TimelineMax({
        onComplete: () => tl.progress(0)
    });
    tl.staggerFromTo(shapes, 2, { scale: '0' }, { scale: '1' }, 0.1);
    return tl.progress(0.0000001).pause();
}

export function slide4() {
    const shapes = '.p4 .block';
    const tl = new TimelineMax({
        onComplete: () => tl.progress(0)
    });
    tl.staggerFromTo(shapes, 2, { scale: '0' }, { scale: '1' }, 0.1);
    return tl.progress(0.0000001).pause();
}

export function slide5() {
    const shapes = '.p5 .block';
    const tl = new TimelineMax({
        onComplete: () => tl.progress(0)
    });
    tl.staggerFromTo(shapes, 5, { scale: '0' }, { scale: '1' }, 0.1);
    return tl.progress(0.0000001).pause();
}


export default function() {
    return false;
}
