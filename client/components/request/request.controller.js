RidemonApp.controller("RequestController", ["$scope", "$http", "$q", function($scope, $http, $q) {
  $scope.current = {};

  $scope.reset = function() {
    $scope.request = {};
    $scope.cancel();
    $scope.message = "";
  };

  $scope.cancel = function() {
    $scope.cleanSlate = true;
  };

  $scope.useCurrentLocation = function() {
    $scope.request.start_address = $scope.current.address;
  };

  $scope.charityList = [
    {
      name: 'St. Anthony Foundation',
      address: '150 Golden Gate Ave. San Francisco, CA 94102',
      pokemon: 'MewTwo',
      pokemonID: 151
    },
    {
      name: 'SF-Marin Food Bank',
      address: '900 Pennsylvania Ave. San Francisco, CA  94107',
      pokemon: 'Articuno',
      pokemonID: 145
    },
    {
      name: 'SF SPCA Pet Adoption Center',
      address: '250 Florida Street San Francisco CA 94103',
      pokemon: 'Zapdos',
      pokemonID: 146
    },
    {
      name: 'HandsOn Bay Area',
      address: '1504 Bryant Street, San Francisco, CA 94103',
      pokemon: 'Moltres',
      pokemonID: 147
    },
  ];

  $scope.charityList.forEach(function(charity) {
    $http.get("http://pokeapi.co/api/v1/sprite/" + charity.pokemonID)
        .success(function(data) {
          charity.image = data.image;
      });
  });

  $scope.requestRide = function(charity) {
    var start, end;
    var legendary = false;

    if(charity && charity.address) {
      $scope.request.destination = charity.address;
      $scope.request.end_address = charity.address;
      legendary = charity.pokemonID;
    }

    $scope.message = "";
    $scope.cleanSlate = false;
    var rideRequest = {};
    parseAddressToLatLng($scope.request.start_address).then(function(res) {
      start = res;
      parseAddressToLatLng($scope.request.end_address).then(function(res) {
        end = res;
        rideRequest.data = {};
        if(!start.lat || !start.lng || !end.lat || !end.lng) {
          return new Error("Missing latitude or longitude information");
        }
        rideRequest.data.start_latitude = start.lat;
        rideRequest.data.start_longitude = start.lng;
        rideRequest.data.end_latitude = end.lat;
        rideRequest.data.end_longitude = end.lng;
        rideRequest.data.legendary = legendary;
        $http.post("/request-ride", rideRequest)
          .error(function(data) {
            if(!$scope.message) {
              $scope.message = "We're sorry! Something went wrong. Please try again.";
              $scope.cancel();
            }
          });
      });
    });
  };

  var parseAddressToLatLng = function(address) {
   return $q(function(resolve, reject) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address)
        .then(resolve);
    }).then(function(data) {
       if(data.status === "ZERO_RESULTS") {
         $scope.message = "We found zero results for that address.";
         $scope.cancel();
       } else if(data && data.data && data.data.results && data.data.results[0] && data.data.results[0].geometry) {
         return data.data.results[0].geometry.location;
       } else {
         $scope.message = "No results.";
         $scope.cancel();
       }
    });
  };

  $scope.reset();

  // Get current position
  navigator.geolocation.getCurrentPosition(
    // Geolocation allowed
    function(position) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude)
        .success(function(data) {
          if(data && data.results && data.results[0] && data.results[0].formatted_address) {
            $scope.current.address = data.results[0].formatted_address;
          } else {
            $scope.message = "We don't recognize that address. Please try again.";
            $scope.cancel();
          }
        })
    },
    // TODO: Handle geolocation failure/disallowal
    // Geolocation failed
    function() {
      $scope.message = "Geolocation appears to be disabled in your browser. Please enable to use this feature.";
    }
  );
}]);
