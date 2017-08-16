import Promise from 'bluebird';

function loadScript(url) {
    return new Promise(function(resolve, reject) {
        const script = document.createElement('script');
        script.addEventListener('load', function() {
            resolve(url);
        }, false);
        script.addEventListener('error', function(error) {
            console.log('script load error: '+url, error);
            reject(error);
        }, false);
        script.src = url;
        script.async = true;
        script.type = 'text/javascript';
        document.head.appendChild(script);
    });
}

export default loadScript;
