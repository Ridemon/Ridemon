var request = require('request');

/*
Ride Request

POST PARAMETERS

Name                  Type     Description
product_id            string  The unique ID of the product being requested.
start_latitude        float   The beginning or "pickup" latitude.
start_longitude       float   The beginning or "pickup" longitude.
end_latitude          float   The final or destination latitude.
end_longitude         float   The final or destination longitude.
surge_confirmation_id (optional)  string  The unique identifier of the surge session for a user. Required when returned from a 409 Conflict response on previous POST attempt.
*/

module.exports.requestRide = function(req, res) {
  request({
    url: 'https://sandbox-api.uber.com/v1/requests',
    method: 'POST',
    qs: req.data,
    headers: {
      'Content-Type': 'application/JSON',
    }
  }, function(error, res, body) {
    console.log('body:', body);
    console.log('error:', error);
    response.send(JSON.parse(body));
  })
};




