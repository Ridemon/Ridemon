RidemonApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "components/home/home.html"
    })
    .state("pokedex", {
      url: "/pokedex",
      templateUrl: "components/pokedex/pokedex.html"
    })
    .state("about", {
      url: "/about",
      templateUrl: "components/about/about.html"
    })
    .state("login", {
      url: "/login",
      templateUrl: "components/login/login.html"
    })
    .state("request", {
      url: "/request-ride",
      templateUrl: "components/request/request.html"
    });

}]);