
## Development

npm -v 3.10.10  
gulp -v 3.9.1  
node -v 6.3.0  
[Install Node version 6.3.0](https://nodejs.org/download/release/v6.3.0/)


Install NPM packages

    $ npm install

Set env mode, currently supports: DEV|QA|STAGE|CI

    $ export NODE_ENV=DEV
    
DEV: http://innogy-dev/  
QA: http://innogy-qa/  
STAGE: http://innogy.akqa.net/ (rwe / innogy)  
CI: http://vmd-rwe-innogy01:8080/ (rwe / innogy)  

In order to launch project

    $ gulp
    
server up on http://localhost:3030
