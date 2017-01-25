( function() {
    
    var queries = {
        saveProduct : 'INSERT INTO Product (id,companyId,code,type,description) VALUES ( ?, ?, ?, ?, ?);',
        findProduct : 'Select * from Product where id = ?;',
    }

    var companyDAO = angular.module('dao.product-dao', ['dao.db-manager']);
    
    companyDAO.factory('ProductDAO', ['$q', 'DataBaseManager', function($q, DataBaseManager) {
        
        var dao = {};
        var dataBase = DataBaseManager.getInstance();

        dao.findOrCreate = function( product ) {

            return dao.findProduct(product).then(function(response) {
                        console.log("findProduct response:", angular.toJson(response));
                        if( response ) {
                            return $q.resolve(product.id);
                        }
                        return dao.saveProduct(product);
                    });
        }

        dao.saveProduct = function (product) {
            
            console.log("saveProduct: ", angular.toJson(product));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.saveProduct , 
                    [product.id, product.company.id, product.code, product.type, product.description ],

                    function (tr, res) {
                        console.log('Product SAVED');                        
                        deferred.resolve(res.insertId);
                    }, function(error) {
                        console.log('SAVED Product ERROR: ', angular.toJson(error));
                        deferred.reject(error);
                    });
            });

            return deferred.promise;
        };

        dao.findProduct = function (product) {
            
            console.log("findProduct: ", angular.toJson(product));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.findProduct , [product.id],
                    function (tr, resultSet) {

                        var product;
                        if( resultSet.rows.length ) {
                            product = resultSet.rows.item(0);
                        }
                        deferred.resolve(product);

                }, function(error) {
                    console.log('SAVED Product ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });
            });
            
            return deferred.promise;
        };
        
        return dao;
        
    }]);
    
})()