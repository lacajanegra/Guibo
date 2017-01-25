(function() {

	var stats = angular.module( 'controllers.stats', [ 'dao.stats-dao', 'service.stats' ]);

	stats.factory('StatsController', [ '$rootScope', '$cordovaNetwork', 'StatsService', 'StatsDAO','$ionicPopup',
		function( $rootScope, $cordovaNetwork, StatsService, StatsDAO,$ionicPopup) {

			console.log("cargando StatsController");

			var service = {};

			service.exportStats = function() {

				console.log("exportStats");

				var isOnline = $cordovaNetwork.isOnline();

				if(!isOnline) {
					return;
				}

				var error = function(error) {					
					console.log(error);
				}

				var scope = this;

				StatsDAO.retrieveStats().then(function(stats) {
					console.log(stats);
					scope.stats = stats;
					return StatsService.saveStats(stats);
				}).then(function(response) {
					return StatsDAO.removeStats(scope.stats);
				}).then(function(response) {
					console.log('STATS EXPORTED TO BACKEND: ', response);
				}).catch(error);
			};

			return service;

		}]);
})()