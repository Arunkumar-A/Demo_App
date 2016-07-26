var button_type = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"This is the button template example",
        "buttons":[
          {
            "type":"web_url",
            "url":"www.google.com",
            "title":"Show Website"
          },
          {
            "type":"postback",
            "title":"Start Chatting",
            "payload":"USER_DEFINED_PAYLOAD"
          }
        ]
      }
    }
  }
  
 module.exports={
	button_type
	
}