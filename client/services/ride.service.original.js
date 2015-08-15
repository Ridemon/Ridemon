RidemonApp.factory("RideService", ["$q", "$http", function($q, $http) {
  var rideMaker = function(startAddress, endAddress) {




    return $q(function(resolve, request) {

    var start, end;

    parseAddressToLatLng(startAddress).then(function(res) {
      start = res;

      parseAddressToLatLng(endAddress).then(function(res) {
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

        makeRequest(rideRequest).then(function(data) {
          console.log('in then');
          return {
            data: data
          }
        });
      });
    });
  }).then(function(data) {
    console.log('next then', data);
    return data;
  }, function(err) {
    return new Error(err);
  });
  }

  var makeRequest = function(rideRequestObj) {
    return $q(function(resolve, reject) {
      $http.post("/request-ride", rideRequestObj)
      .then(resolve);
    }).then(function(data, status, headers, config){
      console.log('makerequest data: ', data);
      return data;
        // $scope.showMap(data.map);
        // $scope.ride_id = data.request_id;
    },function(err) {
      return new Error(err);
      // if(!$scope.message) {

        // $scope.message = "We're sorry! Something went wrong. Please try again.";
        // $scope.reset();
      // }
    });
  }

  // var requestRide = function(charity) {
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
  // };

//TODO: Handle all the scope variable interaction in this biz
  var parseAddressToLatLng = function(address) {
   return $q(function(resolve, reject) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address)
        .then(resolve);
    }).then(function(data) {
       if(data.status === "ZERO_RESULTS") {
         console.log("We found zero results for that address.")
         // $scope.message = "We found zero results for that address.";
         // $scope.reset();
         return null;
       } else if(data && data.data && data.data.results && data.data.results[0] && data.data.results[0].geometry) {
         return data.data.results[0].geometry.location;
       } else {
         console.log("We found zero results for that address.")
         // $scope.message = "No results.";
         // $scope.reset();
         return null;

       }
    });
  };

  return {
    rideMaker: rideMaker
  };
}]);
