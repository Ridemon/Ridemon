var request = require('request');

module.exports.requestPokemon = function(req, res) {
  var queryData = req.query;
  console.log(queryData);

  request({
    url: 'http://pokeapi.co/api/v1/pokemon/',
    method: 'GET',
    qs: req.query,
    headers: {
      'Content-Type': 'application/JSON',
    }
  }, function(error, res, body) {
    console.log('body:', body);
    console.log('error:', error);
    response.send(JSON.parse(body));
  })
};