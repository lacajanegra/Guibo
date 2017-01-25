( function() {

    var dbManager = angular.module('dao.db-manager', []);
    
    dbManager.factory('DataBaseManager', ['$rootScope', '$q', 
        function( $rootScope, $q ) {
        
        var instance;
        var service = {};
        
        service.getInstance = function() {
            console.log("getInstance");
            if( !instance ) {
                // instance = window.sqlitePlugin.openDatabase({name: 'guibo.db', location: 'default'});
                //instance = openDatabase('guibo', '1.0', 'guibo.db', 100 * 1024 * 1024);
                instance = openDatabase('guibo','1.0','guibo.db',1024 * 1024);
                console.log("getInstance", angular.toJson(instance));
            }
            console.log("isntance", instance)
            return instance;
        }
        
        return service;
        
    }]);
    
})()