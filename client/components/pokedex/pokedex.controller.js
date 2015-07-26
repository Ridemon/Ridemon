RidemonApp.controller('PokedexController', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var pokeData = new Firebase("https://ridemon.firebaseio.com/");
  var testObj = $firebaseObject(pokeData);

  $scope.capitalize = function(word) {
    if(!word) return "";
    var firstLetter = word[0].toUpperCase();
    var restWord = word.slice(1).toLowerCase();
    return firstLetter + restWord;
  };

  $scope.readToMe = function(phrase) {
    var msg = new SpeechSynthesisUtterance(phrase);
    window.speechSynthesis.speak(msg);
  };

  $scope.pokemon
  // TODO: get pokemon. Looking for an array of pokemon objects, 
  // with name, captured_date, description, and image properties.

}]);