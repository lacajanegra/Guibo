( function() {
    var database = angular.module('service.database', ['ngCordova']);
    
    database.factory( 'DatabaseManager', ['$rootScope', '$q', function ($rootScope, $q) {
        
        var databaseManager = {};
        
        databaseManager.insertAccounts = function(accountList) {
            
            var deferred = $q.defer();
            
            var query = "INSERT INTO Account (id,unit,settingsId,personId,serviceId) VALUES ( ?, ?, ?, ?, ?);";
            var queryList = [];
            
            for( var index in  accountList) {
                var account = accountList[index];
                queryList.push([ query, [account.id, account.unit, account.settingsId, account.serviceId] ]);
            }
            
            console.log("Query List: ", angular.toJson(queryList));
            $rootScope.db.sqlBatch( queryList , function() {
                console.log('SUCCESS');
                deferred.resolve("SUCCESS");
            }, function(error) {
                console.log('ERROR');
                deferred.reject(error);
            });
            
            return deferred.promise;  
        };
        
        databaseManager.getAllAccounts = function() {
            var deferred = $q.defer();
            
            $rootScope.db.executeSql('Select acc.id, ser.category, acc.settingsId , se.notification, co.name as companyName, co.address, co.logo  from Account as acc, Settings as se, Service as ser, Company as co where acc.settingsId = se.id and acc.serviceId = ser.id and ser.idCompany = co.id;', [],
                function (resultSet) {
                
                var accounts = [];
                
                for( var index = 0; index < resultSet.rows.length; index++) {
                    accounts.push(resultSet.rows.item(index));
                }
                
                console.log('Accunts: ' + angular.toJson(accounts));
                
                deferred.resolve(accounts);                
            }, function(error) {
                deferred.reject(error);
            });
            
            return deferred.promise;
        };
        
        databaseManager.getAccount = function(accountId) {
            
            var deferred = $q.defer();
            
            $rootScope.db.executeSql('Select acc.id, ser.category, acc.settingsId , se.notification, co.name as companyName, co.address, co.logo  from Account as acc, Settings as se, Service as ser, Company as co where acc.settingsId = se.id and acc.serviceId = ser.id and ser.idCompany = co.id and acc.id = ?;', [accountId],
                function (resultSet) {
                
                var account;
                
                if(resultSet.rows.length){                    
                    account = resultSet.rows.item(0);
                    console.log('Account Exist: ' + angular.toJson(account));
                }
                
                console.log('Account: ' + angular.toJson(account));
                if(account) {
                    deferred.resolve(vouchers);    
                } else {
                    deferred.reject("Cuenta Inexistente");
                }
                
            }, function(error) {
                console.log('GetAccount ERROR: ' + angular.toJson(error));
                deferred.reject(error);
            });
            
            return deferred.promise;
        }
        
        databaseManager.removeAccount = function(accountId){
            
            var deferred = $q.defer();
            
            var removeVocuhers = ["DELETE FROM voucher WHERE accountId = ?;",[accountId]];
            var removeAccount = ["DELETE FROM account WHERE id = ?;" ,[accountId]];            
            var queryList = [ removeVocuhers, removeAccount];
            
            console.log("Query List: ", angular.toJson(queryList));            
            $rootScope.db.sqlBatch( queryList , function() {
                console.log('SUCCESS');
                deferred.resolve("SUCCESS");
            }, function(error) {
                console.log('ERROR');
                deferred.reject(error);
            });
            
            return deferred.promise;
        }
        
        databaseManager.getAccountSettings = function(accountId) {
            var deferred = $q.defer();
            
            $rootScope.db.executeSql('Select acc.settingsId, se.alias, se.notification, se.categoryId, co.name as companyName, co.address, per.email from Account acc, Settings as se, Category as cat, Service as ser, Company as co, Person as per where acc.id = ? and acc.settingsId = se.id and se.categoryId = cat.id and per.id = acc.personId and acc.serviceId = ser.id and ser.idCompany = co.id;', [accountId],
                function (resultSet) {                
                var settings = resultSet.rows.item(0);
                console.log("GET_SETTINGS: ", angular.toJson(resultSet.rows.item(0)), accountId);
                
                deferred.resolve(settings);
            }, function(error) {
                deferred.reject(error);
            });
            
            return deferred.promise;
        };
        
        databaseManager.updateAccountSettings = function (account) {
            console.log("updateAccountSettings: ", angular.toJson(account));
            
            var deferred = $q.defer();
            
            $rootScope.db.executeSql('UPDATE Settings SET alias = ?, categoryId = ?, notification = ? WHERE Settings.id = ?;', [account.alias, account.categoryId, account.notification, account.settingsId],
                function (resultSet) {
                deferred.resolve("SUCCESS");
            }, function(error) {
                deferred.reject(error);
            });
            
            return deferred.promise;
            
        }
        
        databaseManager.getVoucher = function(voucherId){
            
            var deferred = $q.defer();
            
            $rootScope.db.executeSql('Select vo.id, vo.emissionDate, vo.expirationDate, vo.cost, vo.consumption, vo.nationalCost, vo.foreignCost, vo.wasRead, vo.state, vo.accountId, acc.unit, se.alias, per.email, ser.category, com.logo from Voucher as vo, Account as acc, Settings as se, Person as per, Service as ser, Company as com where acc.id = vo.accountId and acc.settingsId = se.id and acc.personId = per.id and ser.id = acc.serviceId and com.id = ser.idCompany and vo.id = ?;', [voucherId],
                function (resultSet) {
                var voucher = resultSet.rows.item(0);
                console.log("GET_VOUCHER: ", angular.toJson(voucher));
                deferred.resolve(voucher);
            }, function(error) {
                deferred.reject(error);
            });
            
            return deferred.promise;
        }      
        
        return databaseManager;
        
    }] );
    
} )()