RidemonApp.factory("UserService", ["$http", "$state", function($http, $state) {
  var user = {};
  var login = function() {
    var firstInd = document.cookie.indexOf("first_name");
    if(firstInd > -1) {
      user.first_name = document.cookie.slice(firstInd).split("=")[1];
      user.loggedIn = true;
    }
  };
  login();
  return {
    user: user,
    logout: function() {
      delete user.first_name;
      delete user.loggedIn;
      document.cookie="first_name='';expires=" + new Date(0).toGMTString();
      $http.get('/logout')
        .success(function() {
          $state.go("login");
        });
    }
  };
}]);