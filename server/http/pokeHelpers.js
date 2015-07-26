var Firebase = require('firebase');
var request = require('request');

module.exports.addPokemon = function(req, response) {

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var pokemonId = getRandomInt(1, 145);

  var timeInMs = Date.now();

  var savePokemonId = function() {
    var userId = req.session.userId;
    var name = req.session.name;
    var setName = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/name/");
    setName.set({
      name: name
    })
    var myFirebaseRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/" + pokemonId + "/");
    myFirebaseRef.set({
      caught: timeInMs
    });
  };

  savePokemonId();
  response.end()
};

module.exports.addLegendary = function(req, response, pokemonId) {
  var userId = req.session.userId;
  var myFirebaseRef = new Firebase("https://ridemon.firebaseio.com/users/userIds/" + userId + "/pokemonIds/" + pokemonId + "/");
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
          getOnePokemon(pokemonId, function(data) {
            data.caught = timeSince(pokemonIds[pokemonId].caught);
            pokemonArray[ind] = data;
            count++;
            if(count === index) {
              response.send(pokemonArray);
            }
          });
        })(index);
        index++;
      }
    } else {
      response.end();
    }
  });
};

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



