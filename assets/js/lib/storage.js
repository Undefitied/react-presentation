import IS_SERVER from './is-server';


const data = Object.create(null);
let hasStorage = false;
if (!IS_SERVER) {
    try {
        localStorage.setItem('foo', 'bar');
        const v = localStorage.getItem('foo');
        if (v !== 'bar') throw new Error('no storage');
        hasStorage = true;
    } catch (e) {
        if (!IS_SERVER) {
            console.log(e);
        }
    }
}

const facade = {
    get (key) {
        if (IS_SERVER) throw new Error('tried to retrieve something server side:', key);
        if (hasStorage) {
            return localStorage.getItem(key);
        } else {
            return data[key];
        }
    },
    set (key, value) {
        if (IS_SERVER) throw new Error('tried to store something server side:', key, value);
        if (hasStorage) {
            return localStorage.setItem(key, value);
        } else {
            data[key] = String(value);
        }
    }
};

export default facade;
