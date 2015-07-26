RidemonApp.controller("RequestController", ["$scope", "$http", "$q", function($scope, $http, $q) {
  $scope.current = {};
  $scope.request = {};

  $scope.useCurrentLocation = function() {
    $scope.request.start_address = $scope.current.address;
  };

  $scope.requestRide = function() {
    $scope.message = "";
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
            $scope.message = "We're sorry! Something went wrong. Please try again.";
          });
      });
    });
  };

  var parseAddressToLatLng = function(address) {
    return $q(function(resolve, reject) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address)
        .then(resolve);
    }).then(function(data) {
        return data.data.results[0].geometry.location;
    });
  };

  // Get current position
  navigator.geolocation.getCurrentPosition(
    // Geolocation allowed
    function(position) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude)
        .success(function(data) {
          $scope.current.address = data.results[0].formatted_address;
        })
    },
    // TODO: Handle geolocation failure/disallowal
    // Geolocation failed
    function() {
      $scope.message = "Geolocation appears to be disabled in your browser. Please enable to use this feature.";
    }
  );
}]);
