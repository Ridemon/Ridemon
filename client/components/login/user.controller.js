RidemonApp.controller("UserController", ["$scope", "UserService", function($scope, UserService) {
  $scope.login = function() {
    UserService.login($scope.user);
  };

  $scope.signup = function() {
    UserService.signup($scope.newUser);
  };
}]);
