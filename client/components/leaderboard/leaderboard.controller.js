RidemonApp.controller('LeaderboardController', ['$scope', '$firebase', '$firebaseArray', '$firebaseObject', "$http", function($scope, $firebase, $firebaseArray, $firebaseObject, $http) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  var userArray = $firebaseArray(users);
  //grab user and pokemon data
  var userPokemon = users.child('name');
  $scope.userPokemonArray = $firebaseObject(userPokemon);
  $scope.userName = $firebaseObject(users.child('name'));
  $scope.userArray = userArray;

}])