RidemonApp.controller('LeaderboardController', ['$scope', '$firebase', '$firebaseArray', '$firebaseObject', "$http", function($scope, $firebase, $firebaseArray, $firebaseObject, $http) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  var userArray = $firebaseArray(users);
  //grab user and pokemon data
  var userPokemon = users.child('name');
  var userPokemonArray = $firebaseObject(userPokemon);
  $scope.userName = $firebaseObject(users.child('name'));
  $scope.userArray = userArray;

  function retrieveUsers() {
    users.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var temp = [];
        var key = childSnapshot.key();
        temp[0] = key;
        console.log(key);
        $http.get("/pokedex", {params: {
          specialUid: key
        }}).success(function(pokemon) {
          console.log(pokemon);
          $scope.users = pokemon;
        });
      });
    })
  }

  //TODO access req.server.name
  retrieveUsers();
}])