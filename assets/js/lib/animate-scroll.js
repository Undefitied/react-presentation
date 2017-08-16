import raf from 'raf';


// easing functions http://goo.gl/5HLl8
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

let lastAnimFrame = false;
function scrollTo(to, duration, callback) {
    callback = callback || function() {};
    duration = (typeof(duration) === 'undefined') ? 500 : duration;

    // because it's so fucking difficult to detect the scrolling element, just move them all
    function move(amount) {
        const offset = Math.ceil(parseFloat(amount));
        // document.documentElement.scrollTop = offset;
        // document.body.parentNode.scrollTop = offset;
        // document.body.scrollTop = offset;
        window.scrollTo(0, offset);
    }

    function position() {
        return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
    }
    const start = position();
    const change = to - start;
    const increment = 20;
    let currentTime = 0;
    let cancelled = false;

    function animateScroll() {
        if (cancelled) {
            raf.cancel(lastAnimFrame);
            return false;
        }
        // increment the time
        currentTime += increment;
        // find the value with the quadratic in-out easing function
        const val = easeInOutQuad(currentTime, start, change, duration).toFixed(1);
        // move the document.body
        move(val);
        // do the animation unless its over
        if ((currentTime < duration) && change) {
            lastAnimFrame = raf(animateScroll);
        } else {
            if (callback && typeof(callback) === 'function') {
                // the animation is done so lets callback
                raf(callback);
            }
        }
    }
    animateScroll();
    return function cancelAnimation() {
        cancelled = true;
        raf(callback);
    };
}

export default scrollTo;
