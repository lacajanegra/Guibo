( function() {
    
    var queries = {
        saveStat : 'INSERT INTO Stats ( action, timestamp, user, device, description) VALUES (?,?,?,?, ?);',
        retrieveStats : 'Select * from Stats',
        removeStats : 'DELETE FROM Stats WHERE id = ?;',
    }

    var statsDAO = angular.module('dao.stats-dao', ['dao.db-manager']);
    
    statsDAO.factory('StatsDAO', ['$q', 'DataBaseManager', function($q, DataBaseManager) {
        
        var dao = {};
        var dataBase = DataBaseManager.getInstance();

        dao.saveStat = function (stat) {
            
            console.log("saveStat: ", angular.toJson(stat));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.saveStat , 
                    [stat.action, stat.timestamp, stat.user, stat.device, stat.description ], 

                    function (tr, resultSet) {
                        console.log('resultSet: ', resultSet.rows.length );
                        console.log('SAVED');
                        deferred.resolve('SUCCESS');
                }, function(error) {
                    console.log('SAVED STATS ERROR: ' + angular.toJson(error));
                    deferred.reject(error);
                });

            });            
            
            return deferred.promise;
        };

        dao.retrieveStats = function () {
            
            console.log("retrieveStats");
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.retrieveStats , [], 
                    function (tr, resultSet) {

                        var stats = [];

                        if ( 0 == resultSet.rows.length ) {
                            deferred.reject("NO STATS");
                        }

                        for( var index = 0; index < resultSet.rows.length; index++) {
                            stats.push(resultSet.rows.item(index));
                        }
                    
                        console.log('Stats: ', angular.toJson(stats));                    
                        deferred.resolve(stats);

                    }, function(error) {
                        console.log('retrieveStats ERROR: ' + angular.toJson(error));
                        deferred.reject(error);
                    });
            });
            
            return deferred.promise;
        };

        dao.removeStats = function (statsList) {
            
            console.log( "removeStats", angular.toJson(statsList) );
            
            var deferred = $q.defer();            

            dataBase.transaction (function(transaction) {
                
                for( var index = 0; index < statsList.length; index++ ) {
                    var stat = statsList[index];
                    transaction.executeSql( queries.removeStats, [stat.id]);
                }

            }, function(error) {
              console.log('Transaction ERROR: ' + error.message);
            }, function() {
              console.log('REMOVE STATS OK');
            });
            
            return deferred.promise;
        };        
        
        return dao;
        
    }]);
    
})()