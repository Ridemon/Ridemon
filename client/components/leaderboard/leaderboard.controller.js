RidemonApp.controller('PokedexController', ['$scope', '$firebase' function($scope, $firebase) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  console.log(users)
}])