RidemonApp.factory("UserService", ["$http", function($http) {
  var user;
  return {
    user: user,
    login: function(userData) {
      $http.post('/login', userData)
        .success(function(data, status) {
          user = data.user;
        })
        .error(function(data, status) {
          console.error(data);
        });
    },
    logout: function() {
      $http.post('/logout')
        .success(function() {
          user = null;
          console.log("Logging out");
        });
    },
    signup: function(userData) {
      $http.post('/signup', userData)
        .success(function(data, status) {
          this.login(data.user);
        });
    }
  };
}]);