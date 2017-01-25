( function() {
    
    var queries = {
        updateNotificationSetting : 'UPDATE Settings SET notification = ? WHERE Settings.id = ?;',
        updateSettings : 'UPDATE Settings ' +
            'SET notification = ?, alias = ?, categoryId = ? WHERE Settings.id = ?;',
        saveSetting: 'INSERT INTO Settings (id,accountId,alias,categoryId) VALUES (?, ?, ?, ?);',
        findSetting : 'Select * from Settings where id = ?',
        findSettingByAccount: 'Select ' +
            'sett.id, sett.alias, sett.accountId, sett.notification, sett.categoryId, com.address ' +
            'from Account acc, Product pro, Company com, Settings sett ' +
            'where acc.productId = pro.id and pro.companyId = com.id and ' +
            'acc.id = sett.accountId and sett.accountId = ?;',
        removeSetting : 'DELETE FROM Settings WHERE accountId = ?;'
    }

    var settingsDAO = angular.module('dao.settings-dao', ['dao.db-manager']);
    
    settingsDAO.factory('SettingsDAO', ['$q', 'DataBaseManager', function($q, DataBaseManager) {
        
        var dao = {};
        var dataBase = DataBaseManager.getInstance();

        dao.findOrCreate = function( setting ) {

            return dao.findSetting(setting.id).then(function(response) {
                        console.log("findSetting response:", angular.toJson(response));
                        if( response ) {
                            return $q.resolve(setting.id);
                        }
                        return dao.saveSetting(setting);
                    });
        }

        dao.saveSetting = function (setting) {
            
            console.log("saveSetting: ", angular.toJson(setting));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.saveSetting , 
                    [setting.id, setting.accountId, setting.alias, setting.categoryId],

                    function (tr, res) {
                        console.log( 'Settings SAVED' );
                        console.log('insertId: ', res.insertId );
                        deferred.resolve(res.insertId);
                }, function(error) {
                    console.log('SAVED Settings ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });

            });

            return deferred.promise;
        };

        dao.findSetting = function (settingId) {            
            return dao.retrieveSetting(queries.findSetting, [settingId]);
        };

        dao.findSettingByAccount = function (accountId) {
            return dao.retrieveSetting(queries.findSettingByAccount, [accountId]);
        };

        dao.retrieveSetting = function( query, params ) {            
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( query , params,

                    function (tr, resultSet) {
                        var setting;
                        if( resultSet.rows.length ) {
                            setting = {};
                            setting = resultSet.rows.item(0);
                        }                        
                        console.log('Settings: ' + angular.toJson(setting));
                        deferred.resolve(setting);
                    }, function(error) {
                        deferred.reject(error);
                    });
            });
                        
            return deferred.promise;

        }

        dao.updateNotificationSetting = function (settingsList) {
            
            console.log("updateNotificationSetting: ", angular.toJson(settingsList));
            
            var deferred = $q.defer();            
                
            dataBase.transaction( function(transaction) {

                console.log("SettingsDAO ENTRO: ", angular.toJson(settingsList));

                for ( var index in  settingsList) {
                    var setting = settingsList[index];                    
                    transaction.executeSql( queries.updateNotificationSetting , 
                        [setting.notification, setting.id]);
                }

            }, function(error) {
                console.log('ERROR');
                deferred.reject(error);                
            }, function(){
                console.log('SUCCESS');
                deferred.resolve("SUCCESS");
            });
            
            return deferred.promise;
        };

        dao.updateSettings = function (settings) {
            
            console.log("updateSettings: ", angular.toJson(settings));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.updateSettings , 
                    [settings.notification, settings.alias, settings.categoryId, settings.id],

                    function (tr, resultSet) {                                            
                        console.log('Settings: ', resultSet.rowsAffected);
                        deferred.resolve("SUCCESS");
                    }, function(error) {
                        deferred.reject(error);
                    });
            });
            
            return deferred.promise;
        };

        dao.removeSetting = function (accountId) {
            
            console.log("removeSetting: ", accountId);
            
            var deferred = $q.defer();            
                
            dataBase.transaction( function(transaction) {
                transaction.executeSql( queries.removeSetting , [accountId],
                    function (tr, res) {
                        console.log('RemoveSetting SUCCESS');
                        deferred.resolve("SUCCESS");
                }, function(error) {
                    console.log('SAVED Settings ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });
            });
            
            return deferred.promise;
        };
        
        return dao;
        
    }]);
    
})()