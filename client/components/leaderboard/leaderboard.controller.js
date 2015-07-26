RidemonApp.controller('LeaderboardController', ['$scope', '$firebase', '$firebaseArray', '$firebaseObject', "$http", function($scope, $firebase, $firebaseArray, $firebaseObject, $http) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  $scope.userArray = [];

  users.orderByKey().on("child_added", function(snapshot) {
    $scope.userArray.unshift(getAllPokemon(snapshot.val(), snapshot.key()));
  });

  function getAllPokemon(user, userId) {
    $http.get("/pokedex", {params: {
      specialUid: userId
    }}).success(function(data) {
      user.Uid = userId;
      user.pokemon = data.map(function(info) {
        return info.name;
      }).join(", ");
      user.count = 0;
      for(var i in user.pokemonIds) {
        user.count++;
      }
      })
      .error(function(err) {
        console.error(err);
      });
    return user;
  };

}])