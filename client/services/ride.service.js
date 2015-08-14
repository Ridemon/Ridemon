RidemonApp.factory("RideService", ["$q", "$http", function($q, $http) {
  var rideMaker = function(startAddress, endAddress, callback) {
    var start, end;
    var rideObject;

    parseAddressToLatLng(startAddress, function(res) {
      start = res;
      parseAddressToLatLng(endAddress, function(res) {
        end = res;

        if(!start || !end) {
          return new Error("Missing latitude or longitude information");
        }

        var rideRequest = {
          data : {
            start_latitude  : start.lat,
            start_longitude : start.lng,
            end_latitude    : end.lat,
            end_longitude   : end.lng,
          }
        };

        makeRequest(rideRequest, function(data) {
          callback(data.data);
        });
      })
    })


  }

  var parseAddressToLatLng = function(address, callback) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address).
        then(function(res) {
          callback(res.data.results[0].geometry.location);
        }, function(err) {
          return new Error(err);
        })
      };
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

  var makeRequest = function(rideRequestObj, callback) {
    $http.post('/request-ride', rideRequestObj).
      then(function(res) {
        callback(res);
      })
  };

  return {
    rideMaker: rideMaker
  }
}]);
