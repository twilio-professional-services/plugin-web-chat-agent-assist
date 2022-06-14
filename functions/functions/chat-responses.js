exports.handler = function (context, event, callback) {
  // Create a custom Twilio Response
  const response = new Twilio.Response();
  const openResponsesJSON = Runtime.getAssets()["/responses.json"].open;
  const responsesJSON = JSON.parse(openResponsesJSON());

  // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  response.setBody({ data: responsesJSON.categories });

  // Return a success response using the callback function
  return callback(null, response);
};
