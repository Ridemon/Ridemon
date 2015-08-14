RidemonApp.factory("RideService", ["$q", "$http", function($q, $http) {
  var start, end;

  parseAddressToLatLng(startAddress, function(res) {
    start = res;
    parseAddressToLatLng(endAddress, function(res) {
      end = res;

      console.log('coords: ', res.lat, res.lng)
    })
  })

  var parseAddressToLatLng = function(address) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address, function(data) {
        console.log(data);
      });
  //      if(data.status === "ZERO_RESULTS") {
  //        console.log("We found zero results for that address.")
  //        // $scope.message = "We found zero results for that address.";
  //        // $scope.reset();
  //        return null;
  //      } else if(data && data.data && data.data.results && data.data.results[0] && data.data.results[0].geometry) {
  //        return data.data.results[0].geometry.location;
  //      } else {
  //        console.log("We found zero results for that address.")
  //        // $scope.message = "No results.";
  //        // $scope.reset();
  //        return null;

  //      }
  };
}]);
