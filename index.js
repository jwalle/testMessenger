'use strict';

const PAGE_ACCESS_TOKEN = "<ADD_TOKEN_HERE>";
const VERIFY_TOKEN = "randomstring";

const	express = require('express'),
		request = require('request'),
		bodyParser = require('body-parser'),
		app = express().use(bodyParser.json());

function handleMessage(sender_psid, received_message) {
	let response;
	let responseValue = "Non.";
	let text = received_message.text;

	//test if the message contain text, then test if it's a palindrome
	if (text && isPalin(text)) {
		responseValue = "Oui.";
	}
	response = {
		"text": responseValue
	}
	callSendAPI(sender_psid, response);
}

// send a response message to facebook API
function callSendAPI(sender_psid, response) {
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"message": response
	}
	request({
		"uri": "https://graph.facebook.com/v2.6/me/messages",
		"qs": {"access_token": PAGE_ACCESS_TOKEN},
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (!err) {
			console.log('message sent!');
		} else {
			console.error('error while sending message: ' + err);
		}
	});
}

// messages are received here.
app.post('/webhook', (req, res) => {
        let body = req.body;
		console.log("webhook");
        if (body.object === 'page') {
			body.entry.forEach(function(entry) {
				let webhook_event = entry.messaging[0];
				let sender_psid = webhook_event.sender.id;
				if (webhook_event.message) {
					handleMessage(sender_psid, webhook_event.message);
				}
                });
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.status(404);
        }
});

// connect the node app with the FB app.
app.get('/webhook', (req, res) => {
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

// Test if str is a palindrolme
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

// Test the palindrome function.
function testPalinFunction () {
	const test = [
		{ word: "Kayak", palin: true },
		{ word: "Test", palin: false },
		{ word: "Été", palin: true },
		{ word: "éte", palin: false },
		{ word: "baab", palin: true },
		{ word: "a", palin: false },
		{ word: "", palin: false }
	];
	console.log('Testing...');
	test.forEach(function(elem) {
		process.stdout.write('Testing : ' + elem.word);
		// assert the result with the expected value.
		if (isPalin(elem.word) === elem.palin) {
				console.log('\x1b[32m%s\x1b[0m', ' --> OK');
		} else {
				console.log('\x1b[31m%s\x1b[0m', ' --> NOPE');                
		}
	})
}

// testPalinFunction();

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

module.exports = app;