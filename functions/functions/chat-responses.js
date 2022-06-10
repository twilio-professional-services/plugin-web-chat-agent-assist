exports.handler = function(context, event, callback) {
   // Create a custom Twilio Response
  const response = new Twilio.Response();

  const questions = [
    {
      "section": "Sales",
      "questions": [
        {
          "label": "Cost",
          "text": "We have multiple billing options. You can pay yearly and save 10%"
        },
        {
          "label": "Promotion",
          "text": "We do offer discounts for our best customers."
        }
      ]
    },
    {
      "section": "Support",
      "questions": [
        { "label": "Login", "text": "You can login at https://example.com" },
        {
          "label": "Forgot Password",
          "text": "You can reset your password here at https://example.com/passwordreset"
        }
      ]
    }
  ];

  // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  response.setBody({data: questions});
      
  // Return a success response using the callback function
  return callback(null, response);
};
