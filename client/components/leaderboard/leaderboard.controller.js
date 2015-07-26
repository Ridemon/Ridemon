RidemonApp.controller('LeaderboardController', ['$scope', '$firebase', '$firebaseArray', function($scope, $firebase, $firebaseArray) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  var userArray = $firebaseArray(users);
  console.log(userArray);
  //grab user and pokemon data
  var userPokemon = users.child('pokemonIds');
  var userPokemonArray = $firebaseArray(userPokemon);
  console.log(userPokemonArray);
}])