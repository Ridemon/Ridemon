var Firebase = require('firebase');
var request = require('request');
var pokeUtils = require('../utils/pokeUtils.js');

module.exports.addPokemon = function(req, response, pokemonId) {
  //This checks to see if a set pokemon is requested (i.e. legendary pokemon), otherwise it generates a random poke
  pokemonId = pokemonId - 1 || pokeUtils.getRandomPokemonId();
  var userId = req.session.userId;

  var userPokemon = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId);
  var userPokemonIds = userPokemon.child('pokemonIds');
  //Check to see if user owns the pokemon already and set the proper number of pokemon owned
  pokeUtils.addOrEvolvePokemon(userPokemonIds, pokemonId);

  // This chunk of code updates the current total amount of pokemon
  userPokemon.once("value", function(snapshot) {
      var userData = snapshot.val();
      var currentCount = userData.pokemonCount;
      currentCount++;
      userPokemon.update({
        pokemonCount: currentCount
      });
    }, function (errorObject) {
      console.log("the read failed: " + errorObject.code);
    });
};


module.exports.loadPokemon = function(req, response) {
  var pokemonArray = [];

  var userId = req.params.specialUid || req.session.userId;

  request({
    url: 'https://ridemon.firebaseio.com/users/userIds/' + userId + '.json',
    method: 'GET'
  }, function(error, res, body) {
    if (error) {
      console.log(error);
    }

    if(JSON.parse(body)) {
      var pokemonIds = JSON.parse(body).pokemonIds;
      var index = 0, count = 0;
      for(var pokemonId in pokemonIds) {
        /* jshint ignore:start */
        (function(ind) {
          pokeUtils.queryPokemon(pokemonId, function(data) {
            data.caught = pokeUtils.timeSince(pokemonIds[pokemonId].caught) + ' ago';
            pokemonArray[count] = data;
            count++;
            if(count === index) {
              response.send(pokemonArray);
            }
          });
        })(pokemonId);
        /* jshint ignore:end */
        index++;
      }
    } else {
      response.end();
    }
  });
};





