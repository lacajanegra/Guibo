(function(){

	var profile = angular.module('controllers.profile-change-password', ['ionic-material']);

	profile.controller('ChangePasswordController',
		[ 
			'$scope', 
			'$state', 
			'$timeout', 
			'ionicMaterialMotion', 
			'ionicMaterialInk',			
			
		function( $scope, $state, $timeout, ionicMaterialMotion, ionicMaterialInk ) {
			
		    // Set Motion
		    $timeout(function() {
		        ionicMaterialMotion.slideUp({
		            selector: '.slide-up'
		        });
		    }, 300);

		    $timeout(function() {
		        ionicMaterialMotion.fadeSlideInRight({
		            startVelocity: 3000
		        });
		    }, 700);

		    // Set Ink
		    ionicMaterialInk.displayEffect();        

		}]);
})()