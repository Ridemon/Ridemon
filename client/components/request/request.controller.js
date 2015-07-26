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

  $scope.requestRide = function() {
    $scope.message = "";
    $scope.cleanSlate = false;
    var start, end;
    var rideRequest = {};
    parseAddressToLatLng($scope.request.start_address).then(function(res) {
      start = res;
      parseAddressToLatLng($scope.request.end_address).then(function(res) {
        end = res;
        rideRequest.data = {};
        rideRequest.data.start_latitude = start.lat;
        rideRequest.data.start_longitude = start.lng;
        rideRequest.data.end_latitude = end.lat;
        rideRequest.data.end_longitude = end.lng;
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
    return $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address)
      .success(function(data) {
        if(data.status === "ZERO_RESULTS") {
          $scope.message = "We found zero results for that address.";
          $scope.cancel();
        } else if(data && data.data && data.data.results) {
          return data.data.results[0].geometry.location;
        } else {
          $scope.message = "No results.";
          $scope.cancel();
        }
          return;
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
