var request = require('request');
var pokemonHelper = require('./pokeHelpers.js');
var config = require('../config/config');
var uberUtils = require('../utils/uberUtils.js');

module.exports.requestRide = function(req, res) {
  var token = req.session.access_token;
  // First get uber products for the area of request
  var startLat  = req.body.data.start_latitude,
      startLong = req.body.data.start_longitude;
  // Get legendary ID if there's a legendary in the request
  var legendary = req.body.data.legendary;
  // User is not logged in if there is no token
  if(token === undefined) {
    console.log('Error: user not authenticated');
    res.status(401).end();
  } else {
    // Make request for available products to obtain ID in order to request ride
    uberUtils.getProducts(startLat, startLong, token, function(data) {
      // If products array is empty, there are no Uber rides available at that location
      if (data.products.length === 0) {
        res.status(400).end();
      } else {
        // Use first product ID which is for basic Uber to make ride request
        var product_id = data.products[0].product_id;

        uberUtils.makeRideRequest(req, product_id, token, function(rideData) {
          // Make call to pokemon API to get new pokemon for the user
          if(legendary === false) {
            pokemonHelper.addPokemon(req, res);
          } else {
            console.log("LEGENDARY: ", legendary);
            pokemonHelper.addPokemon(req, res, legendary);
          }
          // Get map
          uberUtils.getMap(rideData.request_id, token, function(mapURL) {
            var responseData = {}; // JSON Object sent back to client as response
            responseData.map = mapURL;
            responseData.request_id = rideData.request_id;
            res.end(JSON.stringify(responseData));
            });
          });
        }
      });
  }
};


module.exports.cancelRide = function(req, res) {
  var token = req.session.access_token;
  if(token === undefined) {
    console.log('Error: user not authenticated');
    res.status(401).end();
  } else {
    request({
      method: 'DELETE',
      url: config.uberURL + 'requests/' + req.body.id,
      headers: {
            'Content-Type': 'application/JSON',
            'Authorization': 'Bearer ' + token
          }
        }, function(error, response, body) {
          if (error) {
            console.log("Error: " + error);
          }
          res.status(response.statusCode).end();
      });
  }
};

