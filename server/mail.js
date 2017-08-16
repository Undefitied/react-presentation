import express from 'express';
import _ from 'lodash';
import parser from 'body-parser';
import config from '../assets/js/lib/config';

function makeValidator(keys) {
    return function(obj) {
        const incoming = Object.keys(obj);
        if (incoming.length !== keys.length) {
            return false;
        }
        return _.difference(keys, incoming).length === 0;
    };
}

const contactValidator = makeValidator(['name', 'email', 'intention', 'message']);
const subscribeValidator = makeValidator(['subscribeEmail']);
const applyValidator = makeValidator(['companyName','email','location','model','www', 'focusArea']);
const emailTo = config.get('emailTo');

const send = require('gmail-send')({
    user: 'innogy.automation@gmail.com',
    pass: 'innogy2016',
    to: emailTo,
    subject: 'Site Contact',
    text: 'test text'
});

const app = express();
app.use(parser());

app.post('/msg/contact', function(req, res) {
    const isValid = contactValidator(req.body);

    if (!isValid) {
        console.log(req.url, 'bad request', req.body)
        return res.status(400).send('bad request');
    }

    send({
        subject: 'Contact from Innovation Hub Site.',
        text:
`
Name: ${req.body.name}
Email: ${req.body.email}
Intention: ${req.body.intention}
Message: ${req.body.message}
`
    }, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(data);
            res.status(200).send(data);
        }
    });
});

app.post('/msg/subscribe', function(req, res) {
    const isValid = subscribeValidator(req.body);

    if (!isValid) {
        console.log(req.url, 'bad request', req.body)
        return res.status(400).send('bad request');
    }

    send({
        subject: 'Subscribe to Innovation Hub Site.',
        text:
`
Email: ${req.body.subscribeEmail}
`
    }, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(data);
            res.status(200).send(data);
        }
    });
});

app.post('/msg/apply', function(req, res) {
    const isValid = applyValidator(req.body);

    if (!isValid) {
        console.log(req.url, 'bad request', req.body)
        return res.status(400).send('bad request');
    }

    send({
        subject: 'New Application from Innovation Hub Site.',
        text:
`
Company Name: ${req.body.companyName}
Email: ${req.body.email}
Location: ${req.body.location}
Site: ${req.body.www}

Focus Area: ${req.body.focusArea}

Business Model:
${req.body.model}

`
    }, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(data);
            res.status(200).send(data);
        }
    });
});



export default app;
