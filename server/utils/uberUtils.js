var request = require('request');
var config = require('../config/config');

module.exports.makeRideRequest = function(req, product_id, token, callback) {

  var startLat  = req.body.data.start_latitude,
    startLong = req.body.data.start_longitude,
    endLat    = req.body.data.end_latitude,
    endLong   = req.body.data.end_longitude;

  request({
      url:  config.uberURL + 'requests',
      method: 'POST',
      json: {
        'product_id'      : product_id,
        'start_latitude'  : startLat,
        'start_longitude' : startLong,
        'end_latitude'    : endLat,
        'end_longitude'   : endLong
      },
      headers: {
        'Content-Type': 'application/JSON',
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      var map;  // variable to store map url for sending back to client
      if(error) {
        console.log('error:', error);
      }
      callback(body);
    });
};

module.exports.getMap = function(request_id, token, callback) {
  request({
    url: config.uberURL + 'requests/' + request_id + '/map',
    method: 'GET',
    headers: {
    'Content-Type': 'application/JSON',
    'Authorization': 'Bearer ' + token
    }
  }, function(error, response, body) {
    if(error) {
      console.log('error:', error);
    }
    callback(JSON.parse(body).href);
  });
};

module.exports.getProducts = function(lat, long, token, callback) {
  request({
    url: config.uberURL + 'products',
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
    if(error) {
      console.log('error:', error);
    }
    callback(JSON.parse(body));
  });
};