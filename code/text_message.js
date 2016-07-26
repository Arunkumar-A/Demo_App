'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const config = require('./config');

// Webserver parameter
const PORT = process.env.PORT || config.PORT;


const FB_PAGE_TOKEN = config.FB_PAGE_TOKEN;
const FB_VERIFY_TOKEN = config.FB_VERIFY_TOKEN;

const FB_PAGE_ID = config.FB_PAGE_ID;


if (!FB_PAGE_ID) {
    throw new Error('missing FB_PAGE_ID');
}

if (!FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}


// Messenger API specific code


const fbReq = request.defaults({
    uri: 'https://graph.facebook.com/me/messages',
    method: 'POST',
    json: true,
    qs: {
        access_token: FB_PAGE_TOKEN
    },
    headers: {
        'Content-Type': 'application/json'
    },
});

const fbMessage = (recipientId, msg, cb) => {
    const opts = {
        form: {
            recipient: {
                id: recipientId,
            },
            message: {text: msg },
        },
    };
    fbReq(opts, (err, resp, data) => {
        if (cb) {
            cb(err || data.error && data.error.message, data);
        }
    });
};


const getFirstMessagingEntry = (body) => {
    const val = body.object == 'page' &&
        body.entry &&
        Array.isArray(body.entry) &&
        body.entry.length > 0 &&
        body.entry[0] &&
        body.entry[0].id == FB_PAGE_ID &&
        body.entry[0].messaging &&
        Array.isArray(body.entry[0].messaging) &&
        body.entry[0].messaging.length > 0 &&
        body.entry[0].messaging[0];
	//console.log(val)
    return val || null;
};



const sessions = {};

const findOrCreateSession = (fbid) => {
    let sessionId;
    // Let's see if we already have a session for the user fbid
    Object.keys(sessions).forEach(k => {
        if (sessions[k].fbid === fbid) {
            // Yep, got it!
            sessionId = k;
        }
    });
    if (!sessionId) {
        // No session found for user fbid, let's create a new one
        sessionId = new Date().toISOString();
        sessions[sessionId] = {
            fbid: fbid,
            context: {}
        };
    }
    return sessionId;
};

const app = express();
app.set('port', PORT);
app.listen(app.get('port'), function() {
    console.log("Connected to ",PORT);
});
app.use(bodyParser.json());

// Webhook setup
app.get('/', function(req, res) {

    res.send('Hello World!');

});


app.get('/webhook', (req, res) => {
    if (!FB_VERIFY_TOKEN) {
        throw new Error('missing FB_VERIFY_TOKEN');
    }
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        console.log("token Success")
        res.send(req.query['hub.challenge']);
    } else {
		console.log("Excuse me")
        res.sendStatus(400);
    }
});



// Message handler
app.post('/webhook', (req, res) => {
    // Parsing the Messenger API response
	
	//body =  req.body
    //messaging_events = json.loads(body.decode("utf-8"))
	//to get a sender_id directly use this line
	//var sender_id = messaging_events["entry"][0]["messaging"][0]["sender"]["id"]
	//var message = messaging_events["entry"][0]["messaging"][0]["message"]["text"]
	
	
    const messaging = getFirstMessagingEntry(req.body);
	
    if (messaging && messaging.message && messaging.recipient.id == FB_PAGE_ID) {
        
        const sender = messaging.sender.id;

        
        const sessionId = findOrCreateSession(sender);

        
        const msg = messaging.message.text;
        const atts = messaging.message.attachments;
		console.log(atts)
		
		
        if (atts) {
            // We received an attachment

            // Let's reply with an automatic message
            fbMessage(
                sender,
                'Sorry I can only process text messages for now.'
            );
        } else if (msg) {
            // We received a text message

            // Let's forward the message to the Wit.ai Bot Engine
            // This will run all actions until our bot has nothing left to do
	    
			fbMessage(
				sender,
				msg
			);
			}
    }
    res.sendStatus(200);
});



