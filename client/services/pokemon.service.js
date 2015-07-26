// RidemonApp.factory("PokemonService", ["$http", function($http) {
//   var pokemon;
//   return {
//     pokemon: pokemon,
//     getPokemon: function() {
//       $http.get('http://pokeapi.co/api/v1/pokemon/')
//         .success(function(data, status, headers, config) {
//           console.log(data);
//         })
//         .error(function(data, status) {
//           console.error(data);
//         });
//     }
//   };
// }]);