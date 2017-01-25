( function () {
    
    var queries = {

        retrieveBills : 'Select ' +
            'vo.id, sett.alias, vo.emissionDate, vo.expirationDate, vo.cost, vo.wasRead, ' +
            'pro.type as serviceCategory, cat.description as userCategory, com.logo, ' +
            'com.id as companyId, com.name as companyName ' +
            'from Voucher as vo, Account as ac, Settings as sett, Product as pro, Category as cat, Company as com ' +
            'where vo.accountId = ac.id and ac.id = sett.accountId and ac.productId = pro.id ' +
            'and sett.categoryId = cat.id and pro.companyId = com.id;',

        retrieveExpiredBills : 'Select ' +
            'vo.id, sett.alias, vo.emissionDate, vo.expirationDate, vo.cost, vo.wasRead, ' +
            'pro.type as serviceCategory, cat.description as userCategory, com.logo, ' +
            'com.id as companyId, com.name as companyName ' +
            'from Voucher as vo, Account as ac, Settings as sett, Product as pro, Category as cat, Company as com ' +
            'where vo.accountId = ac.id and ac.id = sett.accountId and ac.productId = pro.id ' +
            'and sett.categoryId = cat.id and pro.companyId = com.id and vo.state != "R" and vo.expirationDate < ?;',

        retrieveActiveBills : 'Select ' +
            'vo.id, sett.alias, vo.emissionDate, vo.expirationDate, vo.cost, vo.wasRead,' +
            'pro.type as serviceCategory, cat.description as userCategory, com.logo, ' +
            'com.id as companyId, com.name as companyName ' +
            'from Voucher as vo, Account as ac, Settings as sett, Product as pro, Category as cat, Company as com ' +
            'where vo.accountId = ac.id and ac.id = sett.accountId and ac.productId = pro.id ' +
            'and sett.categoryId = cat.id and pro.companyId = com.id and vo.state not in ("R", "P") '+
            'and vo.expirationDate >= ?;',

        retrieveBillsByState : 'Select ' +
            'vo.id, sett.alias, vo.emissionDate, vo.expirationDate, vo.cost, vo.wasRead,' +
            'pro.type as serviceCategory, cat.description as userCategory, com.logo, ' +
            'com.id as companyId, com.name as companyName ' +
            'from Voucher as vo, Account as ac, Settings as sett, Product as pro, Category as cat, Company as com ' +
            'where vo.accountId = ac.id and ac.id = sett.accountId and ac.productId = pro.id ' +
            'and sett.categoryId = cat.id and pro.companyId = com.id and vo.state = ?',

        retrieveCostsByProduct : 'Select pro.type, sum(vo.cost+vo.nationalCost + vo.foreignCost) as totalCost ' +
            'from Voucher vo, Account acc, Product pro ' +
            'where vo.accountId = acc.id and acc.productId = pro.id and ' +
            'strftime("%Y-%m",date(vo.emissionDate/1000, "unixepoch")) = strftime("%Y-%m",date("now", "localtime")) ' +
            'group by pro.type; ',

        retrieveCostsByMonth : 'SELECT strftime("%m",date(vo.emissionDate/1000, "unixepoch")) as month, ' +
            'sum(vo.cost + vo.nationalCost + vo.foreignCost) as totalCost ' +
            'FROM Voucher vo ' +
            'group by strftime("%Y-%m",date(vo.emissionDate/1000, "unixepoch")) ' +
            'order by vo.emissionDate asc ' +
            'limit 12;',

        retrieveBill : 'Select vo.id, vo.emissionDate, vo.expirationDate, vo.cost, vo.consumption, ' +
            'vo.nationalCost, vo.foreignCost, vo.wasRead, vo.state, vo.accountId, sett.alias, com.logo ' +
            'from Voucher as vo, Account as acc, Settings as sett, Product as pro, Company as com ' +
            'where acc.id = vo.accountId and acc.id = sett.accountId and pro.id = acc.productId ' +
            'and com.id = pro.companyId and vo.id = ?;',

        retrieveBillHistoric : 'Select vo.id, vo.emissionDate, vo.expirationDate, vo.cost, ' +
            'vo.consumption, vo.nationalCost, vo.foreignCost, vo.accountId, sett.alias ' +
            'from Voucher as vo, Account as acc, Settings as sett ' +
            'where acc.id = vo.accountId and acc.id = sett.accountId and vo.accountId = ? ' +
            'and vo.emissionDate <= ? order by vo.emissionDate asc limit 6;',

        retrieveDetailsType : 'Select * from voucherdetail as detail where detail.voucherId = ? and detail.type = ?;',

        updateBillState : 'UPDATE voucher SET state = ? WHERE voucher.id = ?;',
        updateBill : 'UPDATE voucher SET state = ?, wasRead = ? WHERE voucher.id = ?;',

        removeAccountBills : 'DELETE FROM voucher WHERE accountId = ?;',
        saveBill : 'INSERT INTO Voucher ' +
            '(id, accountId, voucherCode, expirationDate, emissionDate, cost, consumption, ' +
            'nationalCost, foreignCost ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?);',
    };

    var billsDAO = angular.module('dao.bills-dao', ['dao.db-manager']);
    
    billsDAO.factory( 'BillsDAO', [ '$q', 'DataBaseManager',
        function ( $q, DataBaseManager) {
        
        var dao = {};
        var dataBase = DataBaseManager.getInstance();
        
        dao.saveBill = function(bill) {            

            var deferred = $q.defer();            

            dataBase.transaction( function(transaction) {
                transaction.executeSql( queries.saveBill, 
                    [ bill.id, bill.accountId, bill.voucherCode, bill.expirationDate, bill.emissionDate, 
                        bill.cost, bill.consumption, bill.nationalCost, bill.foreignCost],
                    function (resultSet) {
                        // dao.saveVoucherDetails(bill);                        
                        deferred.resolve("SUCCESS");
                }, function(error) {
                    deferred.reject(error);
                });
            });
            
            return deferred.promise;
        }
        
        dao.saveVoucherDetails = function(voucherId, voucher) {
            
            console.log("SaveVoucherDetails VOUCHERID", voucherId);
            
            var saveVoucherDetailQuery = 'INSERT INTO VoucherDetail (voucherId, `date`, cost, consumption, unit, description,type) VALUES (?, ?, ?, ?, ?, ?, ?);';
            var queryList = [];
            
            for(var index in voucher.detalles) {
                
                var detailDB = {
                    voucherId : voucherId,
                    date: voucher.detalles[index].fecha,
                    cost: voucher.detalles[index].monto,
                    consumption: voucher.detalles[index].consumo,
                    unit: voucher.detalles[index].unit ? voucher.detalles[index].unit : '',
                    description: voucher.detalles[index].descripcion,
                    type: voucher.detalles[index].tipo
                };
                
                console.log("FOR: ", angular.toJson(detailDB));
                
                queryList.push([saveVoucherDetailQuery,[detailDB.voucherId,detailDB.date,detailDB.cost,detailDB.consumption,detailDB.unit, detailDB.description, detailDB.type]]);
            }
            
            console.log("SaveVoucherDetails Query List: ", angular.toJson(queryList));
            $rootScope.db.sqlBatch( queryList , function() {
                console.log('SAVED');
            }, function(error) {
                console.log('ERROR', angular.toJson(error));                
            });
        }

        dao.retrieveBills = function(state) {            
            return dao.retrieveBillListExecute( queries.retrieveBills, [] );    
        }

        dao.retrieveActiveBills = function(state) {
            var currentTime = new Date().getTime();
            return dao.retrieveBillListExecute( queries.retrieveActiveBills, [currentTime] );    
        }

        dao.retrieveExpiredBills = function() {
            var currentTime = new Date().getTime();
            return dao.retrieveBillListExecute( queries.retrieveExpiredBills , [currentTime] );
        }

        dao.retrieveBillsByState = function(state) {
            return dao.retrieveBillListExecute( queries.retrieveBillsByState , [state] );    
        }

        dao.retrieveCostsByProduct = function() {
            return dao.retrieveBillListExecute( queries.retrieveCostsByProduct , [] );
        }

        dao.retrieveCostsByMonth = function() {            
            return dao.retrieveBillListExecute( queries.retrieveCostsByMonth , [] );
        }

        dao.retrieveBillHistoric = function(bill) {
            return dao.retrieveBillListExecute( queries.retrieveBillHistoric , [bill.accountId, bill.emissionDate] );
        }

        dao.retrieveDetailsType = function (billId, type) {
            console.log("retrieveDetailsType: ", billId);       
            return dao.retrieveBillListExecute( queries.retrieveDetailsType , [billId, type] );
        }

        dao.retrieveBillListExecute = function ( query , params) {
            var deferred = $q.defer();

            dataBase.transaction( function(transaction) {

                transaction.executeSql( query , params,
                    function (tr, resultSet) {
                    
                        var bills = [];
                        
                        for( var index = 0; index < resultSet.rows.length; index++) {
                            bills.push(resultSet.rows.item(index));
                        }
                        
                        console.log('Bills: ' + angular.toJson(bills));
                        deferred.resolve(bills);

                    }, function(error) {
                        deferred.reject(error);
                    });
            });
            
            return deferred.promise;
        }

        dao.updateBillState = function(billId, state) {
            
            var deferred = $q.defer();
            
            dataBase.transaction( function(transaction) {
                transaction.executeSql( queries.updateBillState, [ state, billId ],
                    function (resultSet) {
                    deferred.resolve("SUCCESS");
                }, function(error) {
                    deferred.reject(error);
                });        
            });            
            
            return deferred.promise;
        }

        dao.updateBill = function(bill) {
            
            var deferred = $q.defer();
            console.log("updateBill dao:", angular.toJson(bill));
            dataBase.transaction( function(transaction) {
                transaction.executeSql( queries.updateBill, [ bill.state, bill.wasRead, bill.id ],
                    function (resultSet) {                        
                        deferred.resolve("SUCCESS");
                    }, function(error) {
                        deferred.reject(error);
                    });
            });
            
            return deferred.promise;
        }        
        
        dao.retrieveBill = function (billId) {
            
            var deferred = $q.defer(); 

            dataBase.transaction( function(transaction) {

                transaction.executeSql( queries.retrieveBill , [billId],
                    function (tr, resultSet) {
                        console.log(resultSet.rows.length, billId);
                        
                        var bill = {};

                        if( !resultSet.rows.length) {
                            deferred.reject('NOT FOUND');
                        } else {
                            bill = resultSet.rows.item(0);
                            console.log('Bill: ' + angular.toJson(bill));
                            deferred.resolve(bill);    
                        }
                    }, function(error) {
                        deferred.reject(error);
                    });
            });
            
            return deferred.promise;
        }

        dao.removeAccountBills = function (accountId) {
            
            console.log("removeAccountBills: ", accountId);
            
            var deferred = $q.defer();            
                
            dataBase.transaction( function(transaction) {
                transaction.executeSql( queries.removeAccountBills , [accountId],
                    function (tr, res) {
                        console.log( 'RemoveAccountBills SUCCESS' );                        
                        deferred.resolve("SUCCESS");
                }, function(error) {
                    console.log('SAVED Settings ERROR: ', angular.toJson(error));
                    deferred.reject(error);
                });
            });
            
            return deferred.promise;
        }
        
        return dao;
        
    }]);
    
} )()