describe('RequestController', function() {
  beforeEach(module('RidemonApp'));

  var $controller, $factory;
  var controller, $scope;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  beforeEach(function() {
    $factory = {
      getGeolocation: function(cb) {
        cb('123 Fake Street');
      }
    };
  });

  beforeEach(function() {
    $scope = {};
    controller = $controller('RequestController', { $scope: $scope, RideService: $factory });
  });

  describe('RequestController tests', function() {

    it('has a RideService factory with a getGeolocation method', function() {
      expect($factory.getGeolocation).toBeDefined();
    });

    it('has a reset method', function() {
      expect($scope.reset).toBeDefined();
    });

    it('has a requestRide method', function() {
      expect($scope.requestRide).toBeDefined();
    });

    it('has a cancelRide method', function() {
      expect($scope.cancelRide).toBeDefined();
    });
  });

  describe('$scope.reset', function() {
    it('resets all of the scope variables when called', function() {
      // Build scope variables with test data
      $scope.request = {
        start_address: '123 Fake Street',
        end_address: 'Cerulean City'
      };
      $scope.message = "Test Message";
      $scope.cleanSlate = false;
      $scope.ride = {
        data : {
            start_latitude  : 34,
            start_longitude : 122,
            end_latitude    : 44,
            end_longitude   : 132,
          }
      };

      $scope.reset();

      expect($scope.request).toEqual({});
      expect($scope.message).toEqual('');
      expect($scope.cleanSlate).toEqual(true);
      expect($scope.ride).toEqual(null);
    });
  });
});
