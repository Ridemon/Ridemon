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

  var token = req.session.access_token;
  // First get uber products for the area of request
  var latitude = 37,
      longitude = -122;

  var endLat = 37.5;
  var endLong = -122.5;

  getProducts(latitude, longitude, token, function(data) {
    console.log(data);
    var product_id = data.products[0].product_id;
    request({
      url: 'https://sandbox-api.uber.com/v1/requests',
      method: 'POST',
      json: {
        'product_id': product_id,
        'start_latitude': latitude,
        'start_longitude': longitude,
        'end_latitude': endLat,
        'end_longitude': endLong
      },
      headers: {
        'Content-Type': 'application/JSON',
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      console.log('body:', body);
      console.log('error:', error);
      res.end();
    });
  });
};

var getProducts = function(lat, long, token, callback) {
  console.log(token);
  request({
    url: 'https://api.uber.com/v1/products',
    method: 'GET',
    qs: {
      latitude: lat,
      longitude: long
    },
    headers: {
      'Content-Type': 'application/JSON',
      'Authorization': 'Bearer ' + token
    }
  }, function(error, res, body) {
    callback(JSON.parse(body));
  });
};


