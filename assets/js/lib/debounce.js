export default function debounce(fn, time) {
    let timeout;

    return function() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn.bind(null, ...arguments), time);
    };
}
