RidemonApp.controller('PokedexController', ['$scope', '$firebase', '$firebaseObject', function($scope, $firebaseObject) {
  $scope.welcome = "Welcome to the Pokedex!!!"

  var pokeData = new Firebase("https://ridemon.firebaseio.com/");
  console.log(pokeData);
}]);