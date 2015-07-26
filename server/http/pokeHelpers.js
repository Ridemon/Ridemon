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
  var userId = req.session.userId;

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
