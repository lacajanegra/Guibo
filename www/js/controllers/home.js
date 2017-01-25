(function(){
    var home = angular.module( 'controllers.home', ['ionic-material'])
    
    home.controller('HomeController', [ 'ionicMaterialInk',        
        function( ionicMaterialInk ) {
            console.log("HomeController")
            ionicMaterialInk.displayEffect();
        }
    ]);
    
})()