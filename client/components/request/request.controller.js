RidemonApp.controller("RequestController", ["$scope", "$http", "$q", "$sce", "RideService", function($scope, $http, $q, $sce, RideService) {
  $scope.current = {};
  $scope.ride_id;  // ID of uber ride to use when cancelling a ride

  $scope.reset = function() {
    $scope.request = {};
    $scope.message = "";
    $scope.cleanSlate = true;
    $scope.ride = null;
  };

  $scope.useCurrentLocation = function() {
    $scope.request.start_address = $scope.current.address;
  };


  // This function gives permission for angular to load map content in an iframe
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.charityList = [
    {
      name: 'St. Anthony Foundation',
      address: '150 Golden Gate Ave. San Francisco, CA 94102',
      pokemon: 'MewTwo',
      pokemonID: 150
    },
    {
      name: 'SF-Marin Food Bank',
      address: '900 Pennsylvania Ave. San Francisco, CA  94107',
      pokemon: 'Articuno',
      pokemonID: 144
    },
    {
      name: 'SF SPCA Pet Adoption Center',
      address: '250 Florida Street San Francisco CA 94103',
      pokemon: 'Zapdos',
      pokemonID: 145
    },
    {
      name: 'HandsOn Bay Area',
      address: '1504 Bryant Street, San Francisco, CA 94103',
      pokemon: 'Moltres',
      pokemonID: 146
    },
  ];

  $scope.charityList.forEach(function(charity) {
    $http.get("http://pokeapi.co/api/v1/sprite/" + (++charity.pokemonID))
        .success(function(data) {
          charity.image = data.image;
      });
  });

  $scope.requestRide = function(charity) {
    $scope.message = "";
    $scope.cleanSlate = false;
    RideService.rideMaker($scope.request.start_address, $scope.request.end_address, function(rideObject) {
      // After request, set $scope.ride which will render the map view
      $scope.ride = rideObject;
      console.log($scope.ride.cancelRide);
      // Resize the map to the current view size
      RideService.resizeMap();
    });
  }


  $scope.cancelRide = function() {
    $scope.ride.cancelRide(function() {
      $scope.reset();
    });
  };

  $scope.reset();

  RideService.getGeolocation(function(address) {
    if(address) {
      $scope.current.address = address;
    } else {
      $scope.message = address;
      $scope.reset();
    }
  })

}]);
