( function() {
    
    var queries = {
        retrieveAllAccounts : 'Select ' +
            'acc.id, pro.type as category, sett.id as settingId, ' +
            'sett.notification, co.name as companyName, co.address, co.logo ' +            
            'from Account as acc, Settings as sett, Product as pro, Company as co ' +
            'where acc.id = sett.accountId and acc.productId = pro.id and pro.companyId = co.id;',
        saveAccount : 'INSERT INTO Account (id,accountNumber,productId) VALUES (?, ?, ?);',
        findAccount : 'Select * from Account where id = ?',
        removeAccount : 'DELETE FROM Account WHERE id = ?;'
    }

    var accountDAO = angular.module('dao.account-dao', ['dao.db-manager']);
    
    accountDAO.factory('AccountDAO', ['$q', 'DataBaseManager', function( $q, DataBaseManager ) {
        
        var dao = {};
        var dataBase = DataBaseManager.getInstance();

        dao.findOrCreate = function(account) {

            return dao.findAccount(account).then(function(response) {
                        console.log("findAccount response:", angular.toJson(response));
                        if( response ) {
                            return $q.resolve(account.id);
                        }
                        return dao.saveAccount(account);
                    });
        }

        dao.saveAccount = function (account) {
            
            console.log("saveAccount: ", angular.toJson(account));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {                

                transaction.executeSql( queries.saveAccount , 
                    [ account.id, account.accountNumber, account.product.id ],
                    function (tr, res) {
                        console.log('SAVED Account');
                        console.log('insertId: ', res.insertId );
                        deferred.resolve(res.insertId);
                    }, function(error) {
                        console.log('Account SAVED ERROR: ', angular.toJson(error));
                        deferred.reject(error);
                    });
            });

            return deferred.promise;
        };

        dao.findAccount = function (account) {
            
            console.log("findAccount: ", angular.toJson(account));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.findAccount , [account.id],
                    function (tr, resultSet) {

                        var account;

                        if( resultSet.rows.length ) {
                            account = resultSet.rows.item(0);
                        }

                        deferred.resolve(account);
                }, function(error) {
                    console.log('findAccount ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });
            });
            
            return deferred.promise;
        };

        dao.retrieveAllAccounts = function() {
                        
            var deferred = $q.defer();
            
            dataBase.transaction( function(transaction) {
                transaction.executeSql( queries.retrieveAllAccounts , [],
                    function (tx, resultSet) {
                    
                    var accounts = [];
                    
                    for( var index = 0; index < resultSet.rows.length; index++) {
                        accounts.push(resultSet.rows.item(index));
                    }
                    
                    console.log('Accunts: ' + angular.toJson(accounts));
                    
                    deferred.resolve(accounts);
                    
                }, function(error) {
                    console.log('retrieveAllAccounts ERROR: ' + angular.toJson(error));
                    deferred.reject(error);
                });
            });
            
            return deferred.promise;
        };

        dao.removeAccount = function(accountId) {    

            var deferred = $q.defer();        

            dataBase.transaction( function(transaction) {
                transaction.executeSql( queries.removeAccount , [accountId],
                    function (tr, res) {
                        console.log('RemoveAccount SUCCESS');
                        deferred.resolve("SUCCESS");
                }, function(error) {
                    console.log('RemoveAccount ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });
            });

            return deferred.promise;
        }
        
        return dao;
        
    }]);
    
})()