// Express server
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var FirebaseStore = require('connect-firebase')(session);

var handleAuth = require('./server/http/authHelpers')
var uberHelper = require('./server/http/uberHelpers');
var pokemonHelper = require('./server/http/pokeHelpers');

var port = process.env.PORT || 3333;

app.use('/', express.static(__dirname + '/client'));
app.use(bodyParser.json());

app.use(session({
  store: new FirebaseStore({host: 'ridemon.firebaseio.com/sessions'}),
  secret: 'jigglypuff',
  resave: true,
  saveUninitialized: true
}));


// ---- Uber Login Process with oAuth 2.0 -----
app.get('/login', handleAuth.login);

// Callback route that uber redirects to after login
app.get('/auth/uber/callback', handleAuth.callback);

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.post('/request-ride', uberHelper.requestRide);
app.post('/cancel-ride', uberHelper.cancelRide);
app.get('/pokedex', pokemonHelper.loadPokemon);

app.listen(port, function() { console.log('listening on port ' + port + '...')});