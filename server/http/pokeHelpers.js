var Firebase = require('firebase');
var request = require('request');

module.exports.requestPokemon = function(req, response) {

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var pokemonId = getRandomInt(1, 151);

  var timeInMs = Date.now();

  var savePokemonId = function() {
    var userId = req.session.userId;
    console.log(req.session);
    var myFirebaseRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/" + pokemonId + "/");
    myFirebaseRef.set({
      caught: timeInMs
    });
  };

  savePokemonId();
  response.end()
};

