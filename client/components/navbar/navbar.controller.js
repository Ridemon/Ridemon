RidemonApp.controller("NavbarController", ["$scope", "UserService", function($scope, UserService) {
  $scope.loggedIn = !!UserService.user;
  // $scope.loggedIn = true;
  // $scope.user = {};
  // $scope.user.first_name = "Tessa"
  $scope.logout = function() {
    UserService.logout();
  };
}]);