var request = require('request');
var token = require('../../server');
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

  // First get uber products for the area of request
  var latitude = 33,
      longitude = 123;

  getProducts(latitude, longitude, function(data) {

    console.log(data);
    res.end();
  });
/*
    request({
      url: 'https://sandbox-api.uber.com/v1/requests',
      method: 'POST',
      qs: {
        product_id: 33,
        start_latitude: latitude,
        start_longitude: longitude,
        end_latitude: 32,
        end_longitude: 123
      },
      headers: {
        'Content-Type': 'application/JSON',
      }
    }, function(error, res, body) {
      console.log('body:', body);
      console.log('error:', error);
      response.send(JSON.parse(body));
    })
  });
*/
};

var getProducts = function(lat, long, callback) {
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
    callback(body);
  });
};


