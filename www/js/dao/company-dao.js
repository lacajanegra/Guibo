( function() {
    
    var queries = {
        saveCompany : 'INSERT INTO Company (id, code, name, logo, address) VALUES ( ?, ?, ?, ?, ?);',
        findCompany : 'Select * from Company where id = ?;',
    }

    var companyDAO = angular.module('dao.company-dao', ['dao.db-manager']);
    
    companyDAO.factory('CompanyDAO', ['$q', 'DataBaseManager', function($q, DataBaseManager) {
        
        var dao = {};
        var dataBase = DataBaseManager.getInstance();

        dao.findOrCreate = function( company ) {

            return dao.findCompany(company.id).then(function(response) {
                        console.log("findCompany response:", angular.toJson(response));                        
                        if( response ) {
                            return $q.resolve(company.id);
                        }
                        return dao.saveCompany(company);
                    });
        }

        dao.saveCompany = function (company) {
            
            console.log("saveCompany: " + angular.toJson(company));
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.saveCompany , 
                    [company.id, company.code, company.name, company.logo, company.address],

                    function (tr, res) {
                        console.log( 'Company SAVED' );
                        console.log('insertId: ', res.insertId );                        
                        deferred.resolve(res.insertId);
                }, function(error) {
                    console.log('SAVED Company ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });

            });

            return deferred.promise;
        };

        dao.findCompany = function (companyId) {
            
            console.log("findCompany: ", companyId);
            
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.findCompany , 
                    [companyId],
                    function (tr, resultSet) {
                        var company;
                        console.log("findCompany resultSet:", angular.toJson(resultSet.rows.length));
                        if( resultSet.rows.length ) {
                            company = {};
                            company = resultSet.rows.item(0);
                        }
                        deferred.resolve(company);
                }, function(error) {
                    console.log('findCompany ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });
            });
            
            return deferred.promise;
        };        
        
        return dao;
        
    }]);
    
})()