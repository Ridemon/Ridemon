RidemonApp.controller("RequestController", ["$scope", "$http", "$q", "$sce", "RideService", function($scope, $http, $q, $sce, RideService) {
  $scope.current = {};
  $scope.ride_id;  // ID of uber ride to use when cancelling a ride

  $scope.reset = function() {
    $scope.request = {};
    $scope.message = "";
    $scope.mapURL = "";
    $scope.cleanSlate = true;
  };

  $scope.useCurrentLocation = function() {
    $scope.request.start_address = $scope.current.address;
  };

  $scope.showMap = function(mapURL) {
    //$scope.mapURL = mapURL;
    // Get height of current viewport to scale map to full screen
    var viewHeight = document.documentElement.clientHeight;
    angular.element(document).find('iframe').attr('height', viewHeight - 175); // Take into accout nav bar spacing
    angular.element(document).find('iframe').attr('width', '100%');
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
      $scope.ride = rideObject;
      console.log(rideObject);
      $scope.showMap(rideObject.map);
    });
  }
  //   var start, end;
  //   var legendary = false;

  //   if(charity && charity.address) {
  //     $scope.request.end_address = charity.address;
  //     legendary = charity.pokemonID;
  //   }

  //   $scope.message = "";
  //   $scope.cleanSlate = false;
  //   var rideRequest = {};

  //   parseAddressToLatLng($scope.request.start_address).then(function(res) {
  //     start = res;

  //     parseAddressToLatLng($scope.request.end_address).then(function(res) {
  //       end = res;

  //       rideRequest.data = {};

  //       if(!start.lat || !start.lng || !end.lat || !end.lng) {
  //         return new Error("Missing latitude or longitude information");
  //       }

  //       rideRequest.data.start_latitude = start.lat;
  //       rideRequest.data.start_longitude = start.lng;
  //       rideRequest.data.end_latitude = end.lat;
  //       rideRequest.data.end_longitude = end.lng;
  //       rideRequest.data.legendary = legendary;

  //       $http.post("/request-ride", rideRequest)
  //         .success(function(data, status, headers, config){
  //           $scope.showMap(data.map);
  //           $scope.ride_id = data.request_id;
  //         })
  //         .error(function(data) {
  //           if(!$scope.message) {
  //             $scope.message = "We're sorry! Something went wrong. Please try again.";
  //             $scope.reset();
  //           }
  //         });
  //     });
  //   });

  $scope.cancelRide = function() {
    console.log($scope.ride_id);
    var sendData = { id: $scope.ride_id };
    $http.post("/cancel-ride", sendData)
          .success(function(data, status, headers, config){
            $scope.reset();
          })
          .error(function(data) {
            console.log("Error: ", data);
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
            $scope.reset();
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
