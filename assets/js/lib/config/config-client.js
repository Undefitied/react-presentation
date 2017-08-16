import makeConfig from 'mini-config';

const config = makeConfig();

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

config.set('isProduction', IS_PRODUCTION);
config.set('isIE', document.querySelector('.ie') !== null);
config.set('apiUrl', window.__CONFIG__.apiUrl);
config.set('staticPrefix', window.__CONFIG__.staticPrefix);
config.set('contentfulSpace', window.__CONFIG__.contentfulSpace);
config.set('contentfulAccessToken', window.__CONFIG__.contentfulAccessToken);
config.set('externalUrl', window.__CONFIG__.externalUrl);
config.set('gaId', window.__CONFIG__.gaId);

export default config;
