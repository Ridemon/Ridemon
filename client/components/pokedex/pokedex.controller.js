RidemonApp.controller('PokedexController', ['$scope', '$firebaseObject', '$http', function($scope, $firebaseObject, $http) {
  var pokeData = new Firebase("https://ridemon.firebaseio.com/");
  var testObj = $firebaseObject(pokeData);

  $scope.readToMe = function(phrase) {
    var msg = new SpeechSynthesisUtterance(phrase);
    window.speechSynthesis.speak(msg);
  };

  $scope.pokemon = {};

  $http.get("/pokedex")
    .success(function(data) {
      $scope.pokemon.pokemon = data;
      if($scope.pokemon.pokemon.length) {
        $scope.pokemon.message = "These are the pokemon that you've earned. Enjoy them!";
      } else {
        $scope.pokemon.message = "You haven't earned any pokemon yet. You gotta ride if you want to fill up your Pokedex!";
      }
    })
    .error(function(err) {
      console.error(err);
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
