var request = require('request');
var Firebase = require('firebase');
// Pokemon IDs of all base pokemon (non-evolved)
// This function takes in a time in milliseconds and converts it to an 'ago' time
// e.g. 39275875ms --> 17 hours ago

//These functions are utilized by the addPokemon function in our pokeHelpers file
module.exports.timeSince = function(date) {
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

var availablePokemon = [
  1,4,7,10,13,16,19,21,23,25,27,29,32,35,37,39,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,77,79,81,83,84,86,88,90,92,95,96,98,100,102,104,106,107,108,109,111,113,114,115,116,118,120,122,123,124,125,126,127,128,129,131,132,133 /*Eevee has several possible evolutions to consider*/,137,138,140,142,143,147
];

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports.getRandomPokemonId = function() {
  return availablePokemon[getRandomInt(1, availablePokemon.length - 1)];
};

//These functions are utilized by our loadPokemon function in the pokeHelpers file

var capitalize = function(word) {
  if(!word) return "";
  var firstLetter = word[0].toUpperCase();
  var restWord = word.slice(1).toLowerCase();
  return firstLetter + restWord;
};

module.exports.queryPokemon = function(pokeId, callback) {
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


//EVOLUTION UTILS HERE!!!
// ------------------- //
module.exports.setPokemonInfo = function(pokeRef, pokemonId) {
  pokeRef.once('value', function(snapshot) {
    if(snapshot.child(pokemonId).exists()) {
      //Just checked to see if initial poke exists. We can call our evolve pokemon function here
      if (canEvolve(pokemonId)) {
        console.log('Yea baby');
      }

      var currentOwned = snapshot.child(pokemonId).child('numberOwned').val();
      var evolvedPokemonId = pokemonId + 1;
      pokeRef.child(pokemonId).update({
        numberOwned: currentOwned + 1
      })
      pokeRef.child(evolvedPokemonId).update({
        numberOwned: 1,
        caught: Date.now()
      })
    } else {
      pokeRef.child(pokemonId).update({
        numberOwned: 1,
        caught: Date.now()
      })
    }
  });
}

var canEvolve = function(pokeId, callback) {
  return request({
    url: "http://pokeapi.co/api/v1/pokemon/" + pokeId,
    method: "GET"
  }, function(error, res, data) {
    data = JSON.parse(data);
    console.log("DATA EVOLUTIONS: ", data.evolutions);
    if(data.evolutions === [] || data.evolutions.length === 0){
      callback(false);
    } else {
      callback(true);
    }
  });
}

module.exports.addOrEvolvePokemon = function(databaseRef, pokemonId, pokemonURI) {
  var pokemonData = {};
  databaseRef.once('value', function(snapshot) {
    //If pokemon isn't in DB
    if(!snapshot.child(pokemonId).exists()) {
      console.log("POKEMON DID NOT PREVIOUSLY EXIST");
      //Add Pokemon ID and details
      databaseRef.child(pokemonId).update({
        numberOwned: 1,
        caught: Date.now()
      });
    } else {
      pokemonURI = pokemonURI || "/api/v1/pokemon/" + pokemonId;
      //if pokemon can evolve
      canEvolve(pokemonId, function(evolvable) {
        if (evolvable === true) {
          console.log("YOUR POKEMON IS EVOLVING!");
          request({
            url: "http://pokeapi.co/" + pokemonURI,
            method: "GET"
          }, function(error, res, data) {
            data = JSON.parse(data);
            pokemonData.evolution_uri = data.evolutions[0].resource_uri;
            pokemonData.evolvesTo = data.evolutions[0].to;
            request({
                url: "http://pokeapi.co/" + pokemonData.evolution_uri,
                method: "GET"
              }, function(error, res, data) {
                data = JSON.parse(data);
                pokemonData.evolution_id = data.national_id;
                if (pokemonData.evolvesTo.indexOf('mega') === -1) {
                  module.exports.addOrEvolvePokemon(databaseRef, pokemonData.evolution_id, pokemonData.evolution_uri);
                } else {
                  console.log("CANNOT EVOLVE FURTHER");
                }
            })
          });
        } else {
          var currentOwned = snapshot.child(pokemonId).child('numberOwned').val();
          var evolvedPokemonId = pokemonId + 1;
          databaseRef.child(pokemonId).update({
            numberOwned: currentOwned + 1
          });
        }
      });
    }
  });
}









