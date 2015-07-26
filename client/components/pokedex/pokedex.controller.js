RidemonApp.controller('PokedexController', ['$scope', '$firebaseObject', '$http', function($scope, $firebaseObject, $http) {
  var pokeData = new Firebase("https://ridemon.firebaseio.com/");
  var testObj = $firebaseObject(pokeData);

  var capitalize = function(word) {
    if(!word) return "";
    var firstLetter = word[0].toUpperCase();
    var restWord = word.slice(1).toLowerCase();
    return firstLetter + restWord;
  };

  $scope.readToMe = function(phrase) {
    var msg = new SpeechSynthesisUtterance(phrase);
    window.speechSynthesis.speak(msg);
  };

  $scope.pokemon = [];
  // TODO: get actual pokemon ids. Looking for an array of pokemon objects, 
  // with name, captured_date, description, and image properties.

  var getPokemon = function(pokeId) {
    var pokey = {};
    $http.get("http://pokeapi.co/api/v1/pokemon/" + pokeId)
      .success(function(data) {
        pokey.abilities = data.abilities;
        pokey.evolvesTo = data.evolutions[0].to;
        $http.get("http://pokeapi.co/api/v1/sprite/" + pokeId)
          .success(function(data) {
            pokey.name = capitalize(data.pokemon.name);
            pokey.image = data.image;
          });
      });
    return pokey;
  };

  // Stubbed out pokemon ids:
  var pokemonIds = [1,2,3,4,5,6,7,8,9,10,11,56];
  pokemonIds.forEach(function(pokemonId, ind) {
    $scope.pokemon[ind] = getPokemon(pokemonId);
  })




}]);