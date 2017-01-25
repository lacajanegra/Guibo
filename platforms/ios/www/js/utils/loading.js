(function(){
    
var app = angular.module('utils.loading', []);

app.factory( 'Loading', function($ionicLoading){
        return {
            show: function() {
                return $ionicLoading.show({
                     //templateUrl:"#/loading"
                  template:'<ion-spinner></ion-spinner><br /><span>Cargando...</span>'
                });
            },
            hide: function() {
                $ionicLoading.hide().then(function(){
                   console.log("The loading indicator is now hidden");
                });
            }

        };
           
    });

})()