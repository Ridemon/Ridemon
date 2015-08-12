var Firebase = require('firebase');
var request = require('request');
var pokeUtils = require('../utils/pokeUtils.js');

module.exports.addPokemon = function(req, response, pokemonId) {
  //This checks to see if a set pokemon is requested (i.e. legendary pokemon), otherwise it generates a random poke
  pokemonId = pokemonId - 1 || pokeUtils.getRandomPokemonId();
  var userId = req.session.userId;
  var userPokemon = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/");

  //Check to see if user owns the pokemon already and set the proper number of pokemon owned
  userPokemon.once('value', function(snapshot) {
    if(snapshot.child(pokemonId).exists()) {
      var currentOwned = snapshot.child(pokemonId).child('numberOwned').val();
      userPokemon.child(pokemonId).update({
        numberOwned: currentOwned + 1
      })
    } else {
      userPokemon.child(pokemonId).update({
        numberOwned: 1
      })
    }
  })
  userPokemon.child(pokemonId).update({
    caught: Date.now()
  });

  // This chunk of code updates the current total amount of pokemon
  var pokemonCounter = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId);
  pokemonCounter.child('pokemonCount')
    .once("value", function(snapshot) {
      var currentNumber = snapshot.val();
      currentNumber++;
      pokemonCounter.update({
        pokemonCount: currentNumber
      })
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
        +(function(ind) {
          pokeUtils.queryPokemon(ind, function(data) {
            data.caught = pokeUtils.timeSince(pokemonIds[ind].caught) + ' ago';
            pokemonArray[count] = data;
            count++;
            if(count === index) {
              response.send(pokemonArray);
            }
          });
        })(pokemonId);
        index++;
      }
    } else {
      response.end();
    }
  });
};





