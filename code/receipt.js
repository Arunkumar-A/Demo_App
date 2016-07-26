var rece = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"receipt",
        "recipient_name":"getStarted",
        "order_number":"78945656",
        "currency":"SGD",
        "payment_method":"Visa 2345",        
        "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
        "timestamp":"1428444852", 
        "elements":[
          {
            "title":"Classic White T-Shirt",
            "subtitle":"100% Soft and Luxurious Cotton",
            "quantity":2,
            "price":50,
            "currency":"SGD",
            "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
          },
          {
            "title":"Classic Gray T-Shirt",
            "subtitle":"100% Soft and Luxurious Cotton",
            "quantity":1,
            "price":25,
            "currency":"SGD",
            "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
          }
        ],
        "address":{
          "street_1":"Thomas st",
          "street_2":"",
          "city":"Menlo Park",
          "postal_code":"94025",
          "state":"CA",
          "country":"Singapore"
        },
        "summary":{
          "subtotal":75.00,
          "shipping_cost":4.95,
          "total_tax":6.19,
          "total_cost":56.14
        },
        "adjustments":[
          {
            "name":"New Customer Discount",
            "amount":20
          },
          {
            "name":"10% Off Coupon",
            "amount":10
          }
        ]
      }
    }
  }
  
module.exports={
	rece
	
}