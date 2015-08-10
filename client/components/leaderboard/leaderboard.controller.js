RidemonApp.controller('LeaderboardController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  $scope.userNames = $firebaseArray(users);
}])