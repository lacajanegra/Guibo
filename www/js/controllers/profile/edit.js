(function(){

	var profile = angular.module('controllers.profile-edit', ['ionic-material']);

	profile.controller('EditController', 
		[ 
			'$scope', 
			'$state', 
			'$timeout', 
			'ionicMaterialMotion', 
			'ionicMaterialInk',
			'$ionicActionSheet',
			
		function( $scope, $state, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicActionSheet ) {
			
			$scope.moreSettings = {
	            0 : 'app.profile-change-password',
	            1 : 'app.profile-remove',
	            // 1 : 'changeEmail',
	            
	        }

	        $scope.optionsLabels  = [
	            { text: 'Cambiar contraseña' },
	            // { text: 'Cambiar email' },
	            { text: 'Eliminar Cuenta' },
	        ]

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

		    $scope.moreOptions = function() {
            
            $ionicActionSheet.show (
                {
                    buttons: $scope.optionsLabels,
                    cancelText: 'Cancelar',
                    buttonClicked: function(index) {
                    	$state.go($scope.moreSettings[index])
                        return true
                    },
                }
            );
        };

		}]);
})()