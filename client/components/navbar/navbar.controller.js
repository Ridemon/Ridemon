RidemonApp.controller("NavbarController", ["$scope", "UserService", function($scope, UserService) {
  $scope.user = UserService.user;

  $scope.logout = function() {
    UserService.logout();
  };
}]);