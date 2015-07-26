RidemonApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state("requestRide", {
      url: "/",
      templateUrl: "components/request/request.html"
    })
    .state("pokedex", {
      url: "/pokedex",
      templateUrl: "components/pokedex/pokedex.html"
    })
    .state("about", {
      url: "/about",
      templateUrl: "components/about/about.html"
    })
    .state("request", {
      url: "/request-ride",
      templateUrl: "components/request/request.html"
    });

}]);