var request = require('request');

module.exports.requestPokemon = function(req, response) {

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var pokemonId = getRandomInt(1, 151);
  console.log(pokemonId);

  request({
    url: "http://pokeapi.co/api/v1/sprite/" + pokemonId + "/",
    method: 'GET',
    qs: req.query,
    headers: {
      'Content-Type': 'application/JSON',
    }
  }, function(error, res, body) {
    if (!error && response.statusCode == 200) {
      console.log(JSON.parse(body)) 
      response.send("Hello, World");

    } else {
      console.log('error:', error);
    }
    response.end();
  })
};

