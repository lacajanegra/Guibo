(function(){
	var walkthrough = angular.module('controllers.walkthrough', []);

	walkthrough.controller('WalkthroughController', [ '$scope', '$state', '$ionicHistory',
		function( $scope, $state, $ionicHistory ){

			$scope.slideChanged = function(index){
				console.log("slideChanged", index);	
				$scope.slideIndex = index;
			};

			$scope.startApp = function() {
				$ionicHistory.nextViewOptions({ disableBack: true });
				$state.go('app.bills-inbox');
			};

		}]);
})()