RidemonApp.controller('PokedexController', ['$scope', '$firebaseObject', '$http', function($scope, $firebaseObject, $http) {
  var pokeData = new Firebase("https://ridemon.firebaseio.com/");
  var testObj = $firebaseObject(pokeData);

  var capitalize = function(word) {
    if(!word) return "";
    var firstLetter = word[0].toUpperCase();
    var restWord = word.slice(1).toLowerCase();
    return firstLetter + restWord;
  };

  $scope.readToMe = function(phrase) {
    var msg = new SpeechSynthesisUtterance(phrase);
    window.speechSynthesis.speak(msg);
  };

  $scope.pokemon = [];

  var getPokemon = function(pokeId) {
    var pokey = {};
    $http.get("http://pokeapi.co/api/v1/pokemon/" + pokeId)
      .success(function(data) {
        console.log(data);
        pokey.abilities = data.abilities;
        if(data.evolutions.length > 0){
          pokey.evolvesTo = data.evolutions[0].to;
        }
        $http.get("http://pokeapi.co/api/v1/sprite/" + pokeId)
          .success(function(data) {
            pokey.name = capitalize(data.pokemon.name);
            pokey.image = data.image;
          });
      });
    return pokey;
  };

  $http.get('/pokedex')
    .success(function(pokemon, blah) {
      for(var pokemonId in pokemon) {
        var newPokemon = getPokemon(pokemonId);
        newPokemon.caught = timeSince(pokemon[pokemonId].caught) + ' ago';
        $scope.pokemon.push(newPokemon);
      }
    })
    .error(function(err) {
      console.error(error);
    });

}]);

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
