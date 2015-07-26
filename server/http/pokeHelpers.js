var Firebase = require('firebase');
var request = require('request');

module.exports.addPokemon = function(req, response) {

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var pokemonId = getRandomInt(1, 151);

  var timeInMs = Date.now();

  var savePokemonId = function() {
    var userId = req.session.userId;
    var myFirebaseRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/" + pokemonId + "/");
    myFirebaseRef.set({
      caught: timeInMs
    });
  };

  savePokemonId();
  response.end()
};

module.exports.getPokemon = function(req, response) {
  var userId = req.session.userId;
  //var myFirebaseRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/" + pokemonId + "/");
  var pokemonArray = [];

  request({
    url: 'https://ridemon.firebaseio.com/users/userIds/' + userId + '.json',
    method: 'GET'
  }, function(error, res, body) {
    if (error) {
      console.log(error);
    }

    body = JSON.parse(body);
    console.log(body);

    response.end(JSON.stringify(body.pokemonIds));
  });
};
