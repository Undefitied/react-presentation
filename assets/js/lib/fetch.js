import Promise from 'bluebird';
import makeFetch from 'fetch-ponyfill';

const iface = makeFetch({
    Promise
});

export default iface.fetch;

export const lib = iface;
