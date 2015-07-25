// Express server
var express = require('express');
var bodyParser = require('body-parser');

var myFB = require('./server/db/dbHelper');
var uberHelper = require('./server/http/httpHelpers');

var app = express();
var port = process.env.PORT || 3333;

app.use('/', express.static(__dirname + '/client'));
app.use(express.static('bower_components'));

app.use(bodyParser.json());

app.get('/uberData', uberHelper);

app.get('/', function(req, res) {
  myFB.set("hello world!");
  res.end();
});

app.listen(port, function() { console.log('listening on port ' + port + '...')});

