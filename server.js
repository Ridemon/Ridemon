// Express server
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var uberStrategy = require('passport-uber');
var uberAPIData = require('./server/config/config');
var firebase = require('./server/db/dbHelper');
var uberHelper = require('./server/http/httpHelpers');

var session = require('express-session');

var app = express();
var port = process.env.PORT || 3333;

var token;

app.use('/', express.static(__dirname + '/client'));
app.use(express.static('bower_components'));

app.use(bodyParser.json());

app.use(session({
  secret: 'jigglypuff',
  resave: false,
  saveUninitialized: true
}));

app.get('/login', function(req, res) {
  res.redirect('https://login.uber.com/oauth/authorize?response_type=code&scope=profile&client_id=' + uberAPIData.clientID);
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
    console.log('body: ', body);
    console.log('access token: ', body.access_token);
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

    // body.access_token is the access token
    // save it to db with the user on this session
    // send accesstoken with every request
    res.redirect('/');
  })
});

app.get('/', function(req,res){
  sess = req.session;
});

app.get('/request-ride', uberHelper.requestRide);

app.listen(port, function() { console.log('listening on port ' + port + '...')});

