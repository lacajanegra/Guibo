( function() {
    
    var queries = {        
        retrieveCategories : 'Select * from Category',        
    }

    var categoryDAO = angular.module('dao.category-dao', ['dao.db-manager']);
    
    categoryDAO.factory('CategoryDAO', ['$q', 'DataBaseManager', function($q, DataBaseManager) {
        
        var dao = {};
        var dataBase = DataBaseManager.getInstance();

        // dao.saveCategory = function (stat) {
            
        //     console.log("saveStat: ", angular.toJson(stat));
            
        //     var deferred = $q.defer();

        //     dataBase.transaction( function(transaction) {

        //         transaction.executeSql( queries.saveStat , 
        //             [stat.action, stat.timestamp, stat.user, stat.device, stat.description ], 

        //             function (tr, resultSet) {
        //                 console.log('resultSet: ', resultSet.rows.length );
        //                 console.log('SAVED');
        //                 deferred.resolve('SUCCESS');
        //         }, function(error) {
        //             console.log('SAVED STATS ERROR: ' + angular.toJson(error));
        //             deferred.reject(error);
        //         });

        //     });            
            
        //     return deferred.promise;
        // };

        dao.retrieveCategories = function () {
            
            console.log("retrieveCategories");
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.retrieveCategories , [], 
                    function (tr, resultSet) {

                        var categories = [];

                        if ( 0 == resultSet.rows.length ) {
                            deferred.reject("NO STATS");
                        }

                        for( var index = 0; index < resultSet.rows.length; index++) {
                            categories.push(resultSet.rows.item(index));
                        }
                    
                        console.log('Categories: ', angular.toJson(categories));                    
                        deferred.resolve(categories);

                    }, function(error) {
                        console.log('retrieveCategories ERROR: ' + angular.toJson(error));
                        deferred.reject(error);
                    });
            });
            
            return deferred.promise;
        };        
        
        return dao;
        
    }]);
    
})()