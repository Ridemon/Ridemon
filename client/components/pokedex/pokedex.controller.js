RidemonApp.controller('PokedexController', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  $scope.welcome = "Welcome to the Pokedex!!!"

  var pokeData = new Firebase("https://ridemon.firebaseio.com/");
  var testObj = $firebaseObject(pokeData);
  console.log(testObj);
}]);