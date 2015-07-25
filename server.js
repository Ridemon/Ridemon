// Express server
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var port = process.env.PORT || 3333;

app.use('/', express.static(__dirname + '/client'));

app.use(bodyParser.json());

app.get('/uberData', function(req, response) {
  var queryData = req.query;
  console.log(queryData);
  request({
    url: 'https://sandbox-api.uber.com/v1/estimates/price',
    method: 'GET',
    qs: req.query,
    headers: {
      'Content-Type': 'application/JSON',
    }
  }, function(error, res, body) {
    console.log('body:', body);
    console.log('error:', error);
    response.send(JSON.parse(body));
  });
})

app.listen(port, function() { console.log('listening on port ' + port + '...')});
