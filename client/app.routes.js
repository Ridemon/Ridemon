RidemonApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  var redirectToLogin = {
    rule: function() {
      return {
        to: "login"
      };
    }
  };

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state("requestRide", {
      url: "/",
      templateUrl: "components/request/request.html",
      data: redirectToLogin
    })
    .state("pokedex", {
      url: "/pokedex",
      templateUrl: "components/pokedex/pokedex.html",
      data: redirectToLogin
    })
    .state("leaderboard", {
      url: "/leaderboard",
      templateUrl: "components/leaderboard/leaderboard.html"
    })
    .state("about", {
      url: "/about",
      templateUrl: "components/about/about.html"
    })
    .state("login", {
      url: "/login",
      templateUrl: "components/login/login.html"
    })
    .state("logout", {
      data: redirectToLogin
    })
}])

.run(["$rootScope", "$state", "UserService", function($rootScope, $state, UserService) {
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (!to.data || !angular.isFunction(to.data.rule)) return;
    var result = to.data.rule(UserService);

    if (!UserService.user.loggedIn && result && result.to) {
      e.preventDefault();
      $state.go("login", {params: {}});
    }
  });
}]);
