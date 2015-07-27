// Authentication helper functions
var request = require('request');
var session = require('express-session');
var config = require('../config/config');

module.exports.login = function(req, res) {
  // Redirect to uber login page
  res.redirect('https://login.uber.com/oauth/authorize?response_type=code&scope=profile+history+request_receipt+request&client_id=' + config.clientID);
};

module.exports.callback = function(req, res) {
  var code = req.query.code;

  // Send POST with credentials to gain oAuth 2.0 access token from Uber
  request({
    url: 'https://login.uber.com/oauth/token',
    method: 'POST',
    qs: {
      'client_secret': config.clientSecret,
      'client_id': config.clientID,
      'grant_type': 'authorization_code',
      'redirect_uri': 'http://localhost:3333/auth/uber/callback',
      'code': code
    }
  }, function(error, response, body) {
    body = JSON.parse(body);
    // Save access token to the session so it's sent with every request to Uber
    req.session.access_token = body.access_token;

    req.session.save(function(err) {
      if(err) {
        console.log('Error: ', err);
      }
    });

    // Make request for Uber's profile to obtain userID and Name so that we can access
    // the correct data from database
    request({
      url:'https://api.uber.com/v1/me',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + body.access_token
      }
    }, function(error, response, body) {
      body = JSON.parse(body);
      req.session.userId = body.uuid;
      req.session.name = body.first_name + " " + body.last_name;
      req.session.save(function(err) {
        if(err) {
          console.log('Error: ', err);
        }
      });

      // Store first name in cookie to display name in nav bar
      res.cookie('first_name', body.first_name);
      res.redirect('/');
    });
});
};
