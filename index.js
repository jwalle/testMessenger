'use strict';

const	express = require('express'),
	bodyParser = require('body-parser'),
	app = express().use(bodyParser.json());

app.post('/webhook', (req, res) => {
        let body = req.body;

        if (body.object === 'page') {
                body.entry.forEach(function(entry) {
                        let webhook_event = entry.messaging[0];
                        console.log(webhook_event);
                });
                res.status(200).send('EVENT_RECEIVED');
        } else {
                res.status(404);
        }
});

app.get('/webhook', (req, res) => {
        let VERIFY_TOKEN = "randomstring";

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (mode && token) {
                if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                        console.log("WEBHOOK_VERIFIED");
                        res.status(200).send(challenge);
                } else {
                        res.sendStatus(403);
                }
        }
})

function isPalin(str) {
        str = str.toLowerCase();
        let len = str.length;
        if (len < 2) {
                return false;
        }
        for (var i = 0; i < len/2; i++) {
                if (str[i] !== str[len - 1 - i]) {
                        return false;
                }
        }
        return true;
}

const test = [
        { word: "Kayak", palin: true },
        { word: "Test", palin: false },
        { word: "Été", palin: true },
        { word: "éte", palin: false },
        { word: "baab", palin: true },
        { word: "a", palin: false }
];

console.log('Testing...');
test.forEach(function(elem) {
        process.stdout.write('Testing : ' + elem.word);
        if (isPalin(elem.word) === elem.palin) {
                console.log('\x1b[32m%s\x1b[0m', ' --> OK');
        } else {
                console.log('\x1b[31m%s\x1b[0m', ' --> NOPE');                
        }
})

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));