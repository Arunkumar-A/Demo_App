var generic_type = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "www.google.com",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "www.google.com",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
module.exports={
	generic_type
	
}