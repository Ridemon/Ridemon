var Firebase = require('firebase');
var request = require('request');

// Pokemon IDs of all base pokemon (non-evolved)
var availablePokemon = [
  1,4,7,10,13,16,19,21,23,25,27,29,32,35,37,39,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,77,79,81,83,84,86,88,90,92,95,96,98,100,102,104,106,107,108,109,111,113,114,115,116,118,120,122,123,124,125,126,127,128,129,131,132,133 /*Eevee has several possible evolutions to consider*/,137,138,140,142,143,147
];

module.exports.addPokemon = function(req, response) {

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Get random base pokemon
  var pokemonId = availablePokemon[getRandomInt(1, availablePokemon.length - 1)];

  // Time pokemon was caught
  var timeInMs = Date.now();

  // Save pokemon to Firebase with time caught
  var savePokemonId = function() {
    var userId = req.session.userId;  // Store pokemon data by userID
    var name = req.session.name;      // Store user's name
    // Access or create user
    var setName = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/name/");
    setName.set({
      name: name
    });
    // Save pokemon info into db under appropriate userID
    var myFirebaseRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/" + pokemonId + "/");
    myFirebaseRef.set({
      caught: timeInMs
    });
  };

  savePokemonId();
  response.end()
};

// If pokemon is legendary, the pokeID will be passed in so this function will be called instead
// not very DRY
module.exports.addLegendary = function(req, response, pokemonId) {
  var userId = req.session.userId;
  var myFirebaseRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/" + (++pokemonId) + "/");
  myFirebaseRef.set({
    caught: Date.now()
  });
};

var capitalize = function(word) {
  if(!word) return "";
  var firstLetter = word[0].toUpperCase();
  var restWord = word.slice(1).toLowerCase();
  return firstLetter + restWord;
};

var getOnePokemon = function(pokeId, callback) {
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
      url: "http://pokeapi.co/api/v1/sprite/" + pokeId,
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

module.exports.getPokemon = function(req, response) {
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
          getOnePokemon(ind, function(data) {
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

// This function takes in a time in milliseconds and converts it to an 'ago' time
// e.g. 39275875ms --> 17 hours ago
function timeSince(date) {
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
}




