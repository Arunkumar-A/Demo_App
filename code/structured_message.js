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



function fbMessage(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_PAGE_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}


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
	console.log(messaging)
	
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
			switch(msg){
				case 'generic':
					sendGenericMessage(sender);
					break;
				
				case 'image':
					sendImageMessage(sender);
					break;
				
				case 'button':
					sendButtonMessage(sender);
					break;
				
				case 'receipt':
					sendReceiptMessage(sender);
					break;
					
				case 'quick':
					sendQuickMessage(sender);
					break;
					
				case 'airline':
					sendairlineItineraryMessage(sender);
					break;
					
				default:
					var messageData = {
						recipient: {
						  id: sender
						},
						message: {
						  text: msg
						}
					  };

					  fbMessage(messageData);
					  break
			}
	    
			
			}
    }
	else if(messaging.postback){
		console.log("Postback recieved")
	}
    res.sendStatus(200);
});

function sendGenericMessage(sender){
  const generic = require('./generic_type');
  var messageData = {
						recipient: {
						  id: sender
						},
						message: generic.generic_type
					  };

  fbMessage(messageData);
}
///To send image type
function sendImageMessage(sender){
  const image_type = require('./image');
  var messageData = {
						recipient: {
						  id: sender
						},
						message: image_type.image_type
					  };

  fbMessage(messageData);
}


function sendButtonMessage(sender){
  const button_type = require('./button_type');
  var messageData = {
						recipient: {
						  id: sender
						},
						message: button_type.button_type
					  };

  fbMessage(messageData);
}

function sendReceiptMessage(sender){
  const receipt = require('./receipt');
  var messageData = {
						recipient: {
						  id: sender
						},
						message: receipt.rece
					  };

  fbMessage(messageData);
}

function sendQuickMessage(sender){
  const quick_type = require('./quick_type');
  var messageData = {
						recipient: {
						  id: sender
						},
						message: quick_type.quick
					  };

  fbMessage(messageData);
}

function sendairlineItineraryMessage(sender){
  const airline = require('./airline_itinerary');
  var messageData = {
						recipient: {
						  id: sender
						},
						message: airline.airline
					  };

  fbMessage(messageData);
}
