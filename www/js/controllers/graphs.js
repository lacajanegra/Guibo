(function(){

	var graphs = angular.module('controllers.graphs', 
		['nvd3', 'utils.constants', 'dao.bills-dao']);

	graphs.controller('GraphsController', [ '$scope', 'BillsDAO', 'AppConstants', '$ionicPopup',

		function( $scope, BillsDAO, AppConstants, $ionicPopup ) {			

			$scope.isPie = true;	
			$scope.colorsBarChart = [];	
						
			// console.log("aun no entro pero ya hay loader");

			$scope.loadPieChart = function() {
				$scope.isPie = true;

				var myColors = ["#ef473a", "#cacaca", "#f5392a", "f47e75", "#909090"];
				d3.scale.myColors = function() {
					return d3.scale.ordinal().range(myColors);
				};

				$scope.options = {
		            chart: {
		                type: 'pieChart',
		                height: 400,
		                margin : {
		                    top: 20,
		                    right: 20,
		                    bottom: 60,
		                    left: 25
		                },
		                x: function(d){ return d.label; },
		                y: function(d){ return d.value; },
		                color: (d3.scale.myColors().range()),
		                showValues: false,

		                tooltips : false, 
		                tooltip : null,
		                valueFormat: function(d){
		                    return d3.format(',.4f')(d);
		                },		                
		                transitionDuration: 500,
		                xAxis: {},
		                yAxis: {
		                    axisLabel: 'Y Axis',
		                    axisLabelDistance: 30
		                }
		            }
		        };

		        var success = function(costList) {
		        	var values = [];

		        	for( index in costList ) {
		        		var monthCost = costList[index];
		        		console.log(angular.toJson(monthCost));
		        		var value = { label : monthCost.type, value : monthCost.totalCost }
		        		values.push(value);
		        	}

		        	$scope.data =  values;
					console.log("loadPieChart", angular.toJson($scope.data));					
		        }

		        var error = function(error) {
		        	$ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                	});
		        	console.log(error);
		        }

		        BillsDAO.retrieveCostsByProduct().then(success).catch(error);

			}

			$scope.loadBarChart = function(){

				$scope.isPie = false;				
				console.log("voy a cargar")

		        var success = function(costList) {
		        	var values = [];

		        	for( index in costList ) {
		        		var monthCost = costList[index];
		        		var month = parseInt(monthCost.month)-1;
		        		var value = { label : AppConstants.MONTHS_SHORT[month], value : monthCost.totalCost }
		        		values.push(value);
		        		(index == costList.length -1 ) ? $scope.colorsBarChart.push("#ef473a") : $scope.colorsBarChart.push("#cacaca");
		        	}

		        	$scope.data =  [{
						key: "Historical",
						values: values
					}];

					$scope.options = {
			            chart: {
			                type: 'discreteBarChart',
			                height: 400,
			                margin : {
			                    top: 20,
			                    right: 20,
			                    bottom: 60,
			                    left: 55
			                },
			                x: function(d){ return d.label; },
			                y: function(d){ return d.value; },
			                color: $scope.colorsBarChart,
			                showValues: false,
			                tooltips : false, 
			                tooltip : null,
			                valueFormat: function(d){
			                    return d3.format(',.4f')(d);
			                },		                
			                transitionDuration: 500,
			                xAxis: {},
			                yAxis: {
			                    axisLabel: 'Y Axis',
			                    axisLabelDistance: 30
			                }
			            }
			        };
					
		        }

		        var error = function(error) {
		        	$ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                	});
		        	console.log(angular.toJson(error));
		        }

		        BillsDAO.retrieveCostsByMonth().then(success).catch(error);

			}
			
			$scope.$on("$ionicView.afterEnter", function(event, data){
				$scope.loadPieChart();
			});
		}]);
})()