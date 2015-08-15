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
          var rideObject = data.data;

          rideObject.cancelRide = function(cb) {
            $http.post("/cancel-ride", rideObject.ride_id)
              .then(function(res){
                cb();
              }, function(err) {
                console.log('error: ', err);
                return new Error(err);
              });
          }

          callback(rideObject);
        });
      })
    })
  }

  // It may be possible to set up map view as a custom directive that performs this function
  var resizeMap = function() {
    var viewHeight = document.documentElement.clientHeight;
    angular.element(document).find('iframe').attr('height', viewHeight - 175); // Take into accout nav bar spacing
    angular.element(document).find('iframe').attr('width', '100%');
  }

  var parseAddressToLatLng = function(address, callback) {
    $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address).
      then(function(res) {
        callback(res.data.results[0].geometry.location);
      }, function(err) {
        return new Error(err);
      });
  };


  var makeRequest = function(rideRequestObj, callback) {
    $http.post('/request-ride', rideRequestObj).
      then(function(res) {
        callback(res);
      });
  };

  var getGeolocation = function(callback) {
    navigator.geolocation.getCurrentPosition(
    // Geolocation allowed
    function(position) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude)
        .success(function(data) {
          if(data && data.results && data.results[0] && data.results[0].formatted_address) {
            callback(data.results[0].formatted_address);
          } else {
            callback(false);
          }
        })
    },
    // TODO: Handle geolocation failure/disallowal
    // Geolocation failed
    function() {
      calback(false);
    }
  );
  }

  return {
    rideMaker: rideMaker,
    resizeMap: resizeMap,
    getGeolocation: getGeolocation
  }
}]);
