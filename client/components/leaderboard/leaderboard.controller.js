RidemonApp.controller('LeaderboardController', ['$scope', '$firebase', '$firebaseArray', '$firebaseObject', "$http", function($scope, $firebase, $firebaseArray, $firebaseObject, $http) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  $scope.userNames = $firebaseArray(users);
}])