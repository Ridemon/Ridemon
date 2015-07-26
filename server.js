// Express server
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var passport = require('passport');
var uberStrategy = require('passport-uber');
var uberAPIData = require('./server/config/config');
var firebase = require('./server/db/dbHelper');
var uberHelper = require('./server/http/httpHelpers');

var app = express();
var port = process.env.PORT || 3333;

app.use('/', express.static(__dirname + '/client'));
app.use(express.static('bower_components'));

app.use(bodyParser.json());

passport.use(new uberStrategy(uberAPIData,
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    firebase.set({'uberid': profile.first_name, 'profileObj': profile});
    done();
  }
));

app.get('/auth/uber', passport.authenticate('uber'));

app.get('/auth/uber/callback',
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.listen(port, function() { console.log('listening on port ' + port + '...')});
