// Express server
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var uberStrategy = require('passport-uber');
var uberAPIData = require('./server/config/config');
var firebase = require('./server/db/dbHelper');
var uberHelper = require('./server/http/httpHelpers');
var pokemonHelper = require('./server/http/pokeHelpers')

var session = require('express-session');

var app = express();
var port = process.env.PORT || 3333;

FirebaseStore = require('connect-firebase')(session);

var options = {
  host: 'ridemon.firebaseio.com/sessions'
}

app.use(session({
  store: new FirebaseStore(options),
  secret: 'jigglypuff',
  resave: true,
  saveUninitialized: true
}));

app.use('/', express.static(__dirname + '/client'));
app.use(express.static('bower_components'));

app.use(bodyParser.json());

app.get('/login', function(req, res) {
  res.redirect('https://login.uber.com/oauth/authorize?response_type=code&scope=profile+history+request_receipt+request&client_id=' + uberAPIData.clientID);
});

app.get('/auth/uber/callback', function(req, res) {
  var code = req.query;

  request({
    url: 'https://login.uber.com/oauth/token',
    method: 'POST',
    qs: {
      'client_secret': uberAPIData.clientSecret,
      'client_id': uberAPIData.clientID,
      'grant_type': 'authorization_code',
      'redirect_uri': 'http://localhost:3333/auth/uber/callback',
      'code': code.code
    }
  }, function(error, response, body) {
    body = JSON.parse(body);
    req.session.access_token = body.access_token;

    req.session.save(function(err) {
      console.log('Error: ', err);
    });

    request({
      url:'https://api.uber.com/v1/me',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + body.access_token
      }
    }, function(error, response, body) {
      body = JSON.parse(body);
      console.log(body);
    })

    res.redirect('/');
  })
});

app.get('/request-ride', uberHelper.requestRide);

app.get('/pokedex', pokemonHelper.requestPokemon);
//Listener for the uber web hook.
// app.on('uber ride complete hook', pokemonHelper.requestPokemon);

app.listen(port, function() { console.log('listening on port ' + port + '...')});

