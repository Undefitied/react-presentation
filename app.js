// for running on azure, but can be generic entry point too
console.log(process.env.NODE_ENV, ' - node env');
require('./server/prod-server');
