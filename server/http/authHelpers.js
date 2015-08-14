// Authentication helper functions
var Firebase = require('firebase');
var request = require('request');
var session = require('express-session');
var config = require('../config/config');

var setNewUserInfo = function(userId, userName) {
  console.log("Now inserting new user into the database");
  var newUser = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId);
  newUser.set({
    name: userName,
    pokemonCount: 0
  });
};

var checkIfUserExists = function(userId, userName) {
  var usersRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/");
  usersRef.child(userId).once('value', function(snapshot) {
    if(!snapshot.exists()) {
      setNewUserInfo(userId, userName);
    } else {
      console.log("Welcome back ", userName);
    }
  }); 
};

module.exports.login = function(req, res) {
  // Redirect to uber login page
  res.redirect('https://login.uber.com/oauth/authorize?response_type=code&scope=profile+history+request_receipt+request&client_id=' + config.clientID);
};

//This could be renamed
module.exports.callback = function(req, res) {
  var code = req.query.code;

  // Send POST with credentials to gain oAuth 2.0 access token from Uber
  request({
    url: 'https://login.uber.com/oauth/token',
    method: 'POST',
    qs: {
      'client_secret' : config.clientSecret,
      'client_id'     : config.clientID,
      'grant_type'    : 'authorization_code',
      'redirect_uri'  : config.callbackURL,
      'code'          : code
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
        checkIfUserExists(req.session.userId, req.session.name);
      });

      // Store first name in cookie to display name in nav bar
      res.cookie('first_name', body.first_name);
      res.redirect('/');
    });
  });
};
