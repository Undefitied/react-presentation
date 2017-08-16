import makeConfig from 'mini-config';

const config = makeConfig();
const isProduction = process.env.NODE_ENV === 'production';

config.set('isProduction', isProduction);
config.set('useCache', isProduction);
config.set('apiUrl', process.env.API_URL || '/api');
config.set('isIE', false);
config.set('useVersionedResources', process.env.USE_VERSIONED_RESOURCES || isProduction);
config.set('staticPrefix', process.env.STATIC_PREFIX || '/');
config.set('port', process.env.PORT || 3030);
config.set('useHttps', !!process.env.USE_HTTPS);
config.set('contentfulAccessToken', process.env.CONTENTFUL_TOKEN || '0e688555201a9bb9b81db0c5fcc1daf07305054b3263ae2a516a5755a13f0ebc');
config.set('contentfulSpace', process.env.CONTENTFUL_SPACE || 'kk3ncyes3l6f');
config.set('externalUrl', process.env.EXTERNAL_URL || 'localhost:3030');
config.set('emailTo', process.env.EMAIL_TO || 'harsha.yogasundram@akqa.com');
config.set('gaId', process.env.ANALYTICS_ID || 'UA-84655150-1');
config.set('XMLJobsUrl', process.env.XML_JOBS_URL || 'https://innogy-innovationhub-jobs.personio.de/xml?language=en');
config.set('companyId', process.env.COMPANY_ID || '1471');
config.set('accessToken', process.env.ACCESS_TOKEN || 'c479586302e181f2e3d0');
config.set('personioPostLink', process.env.PERSONIO_POST_LINK || 'https://api.personio.de/recruiting/applicant');

export default config;
