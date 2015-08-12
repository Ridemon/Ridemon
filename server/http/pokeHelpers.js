var Firebase = require('firebase');
var request = require('request');

// Pokemon IDs of all base pokemon (non-evolved)
var availablePokemon = [
  1,4,7,10,13,16,19,21,23,25,27,29,32,35,37,39,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,77,79,81,83,84,86,88,90,92,95,96,98,100,102,104,106,107,108,109,111,113,114,115,116,118,120,122,123,124,125,126,127,128,129,131,132,133 /*Eevee has several possible evolutions to consider*/,137,138,140,142,143,147
];
// This function takes in a time in milliseconds and converts it to an 'ago' time
// e.g. 39275875ms --> 17 hours ago
var timeSince = function(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomPokemonId = function() {
  return availablePokemon[getRandomInt(1, availablePokemon.length - 1)];
};

module.exports.addPokemon = function(req, response, pokemonId) {
  //This checks to see if a set pokemon is requested (i.e. legendary pokemon), otherwise it generates a random poke
  pokemonId = pokemonId - 1 || getRandomPokemonId();
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

var capitalize = function(word) {
  if(!word) return "";
  var firstLetter = word[0].toUpperCase();
  var restWord = word.slice(1).toLowerCase();
  return firstLetter + restWord;
};

var queryPokemon = function(pokeId, callback) {
  var pokey = {};
  request({
    url: "http://pokeapi.co/api/v1/pokemon/" + pokeId,
    method: "GET"
  }, function(error, res, data) {
    data = JSON.parse(data);
    pokey.abilities = data.abilities;
    if(data.evolutions.length > 0){
      pokey.evolvesTo = data.evolutions[0].to;
    }
    request({
      url: "http://pokeapi.co/api/v1/sprite/" + (++pokeId),
      method: "GET"
    }, function(error, res, data) {
      data = JSON.parse(data);
      pokey.name = capitalize(data.pokemon.name);
      pokey.image = data.image;
      callback(pokey);
    })
  });
};

var pokemonArray = [];

module.exports.loadPokemon = function(req, response) {
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
          queryPokemon(ind, function(data) {
            data.caught = timeSince(pokemonIds[ind].caught) + ' ago';
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





