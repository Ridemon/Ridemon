// Express server
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var config = require('./server/config/config');
var firebase = require('./server/db/dbHelper');
var uberHelper = require('./server/http/httpHelpers');
var pokemonHelper = require('./server/http/pokeHelpers');

var session = require('express-session');

var app = express();
var port = process.env.PORT || 3333;

var FirebaseStore = require('connect-firebase')(session);

app.use('/', express.static(__dirname + '/client'));
app.use(bodyParser.json());

app.use(session({
  store: new FirebaseStore({host: 'ridemon.firebaseio.com/sessions'}),
  secret: 'jigglypuff',
  resave: true,
  saveUninitialized: true
}));


// ---- Uber Login Process wtih oAuth 2.0 ----------
app.get('/login', function(req, res) {
  // Redirect to uber login page
  res.redirect('https://login.uber.com/oauth/authorize?response_type=code&scope=profile+history+request_receipt+request&client_id=' + uberAPIData.clientID);
});

// Callback route that uber redirects to after login
app.get('/auth/uber/callback', function(req, res) {
  var code = req.query.code;

  // Send POST with credentials to gain oAuth 2.0 access token from Uber
  request({
    url: 'https://login.uber.com/oauth/token',
    method: 'POST',
    qs: {
      'client_secret': uberAPIData.clientSecret,
      'client_id': uberAPIData.clientID,
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

  })
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});


app.post('/request-ride', uberHelper.requestRide);
app.get('/pokedex', pokemonHelper.getPokemon);


app.listen(port, function() { console.log('listening on port ' + port + '...')});

