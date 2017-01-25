(function(){
    var sort = angular.module('service.sort', []);
    
    sort.factory('VoucherSortService', [ 'AppConstants', function(AppConstants) {
        
        var sortService = {};
        
        sortService.dateSort = function ( voucherList ) {
            console.log('dateSort');
            var voucherMap = {};

            voucherList.sort(function( firstBill , secondBill ) {
                return secondBill.emissionDate - firstBill.emissionDate;
            });

            for(var index in voucherList) {
                var voucher = voucherList[index];
                var sectionVouchers= [];
                
                var sectionDate = new Date(voucherList[index].emissionDate);
                sectionDate.setDate(1);
                sectionDate.setHours(0);
                sectionDate.setMinutes(0);
                sectionDate.setSeconds(0);
                
                var sectionTitle = AppConstants.MONTHS_LARGE[sectionDate.getMonth()];
                
                for(var voucherIndex in voucherList) {
                    var voucherMonth = new Date(voucherList[voucherIndex].emissionDate).getMonth();
                    if( sectionDate.getMonth() === voucherMonth ) {                        
                        sectionVouchers.push(voucherList[voucherIndex]);
                    }
                }
                
                if(!voucherMap.hasOwnProperty(sectionTitle)) {
                    voucherMap[sectionTitle] = sectionVouchers;                    
                }
            }
            
            return voucherMap;
        };
        
        sortService.accountSort = function (voucherList) {
            console.log('accountSort');
            var voucherMap = {};
            for(var index in voucherList) {
                var voucher = voucherList[index];
                var sectionVouchers= [];                
                var sectionAccount = voucherList[index].serviceCategory;
                
                for(var voucherIndex in voucherList) {
                    var voucherAccount = voucherList[voucherIndex].serviceCategory;
                    if( sectionAccount === voucherAccount ) {                        
                        sectionVouchers.push(voucherList[voucherIndex]);
                    }
                }
                
                if(!voucherMap.hasOwnProperty(sectionAccount)) {
                    voucherMap[sectionAccount] = sectionVouchers;                    
                }
            }
            
            return voucherMap;
        };
        
        sortService.userSort = function (voucherList) {
            console.log('userSort');
            var voucherMap = {};
            for(var index in voucherList) {
                var voucher = voucherList[index];
                var sectionVouchers= [];                
                var sectionAccount = voucherList[index].userCategory;                
                
                for(var voucherIndex in voucherList) {
                    var voucherAccount = voucherList[voucherIndex].userCategory;
                    if( sectionAccount === voucherAccount ) {                        
                        sectionVouchers.push(voucherList[voucherIndex]);
                    }
                }
                
                if(!voucherMap.hasOwnProperty(sectionAccount)) {
                    voucherMap[sectionAccount] = sectionVouchers;                    
                }
            }
            
            return voucherMap;
        };
        
        sortService.companySort = function (voucherList) {
            console.log('companySort');
            var voucherMap = {};
            for(var index in voucherList) {
                var voucher = voucherList[index];
                var sectionVouchers= [];                
                var sectionAccount = voucherList[index].companyName;
                var companyId = voucherList[index].companyId;
                
                for(var voucherIndex in voucherList) {
                    var voucherCompany = voucherList[voucherIndex].companyId;
                    if( companyId === voucherCompany ) {
                        sectionVouchers.push(voucherList[voucherIndex]);                        
                    }
                }
                
                if(!voucherMap.hasOwnProperty(sectionAccount)) {
                    voucherMap[sectionAccount] = sectionVouchers;                    
                }
            }
            
            return voucherMap;
        };

        sortService.sortVouchers = function (type, voucherList) {
            var voucherMap = {};
            switch (type) {
                case 'dateSort':
                    voucherMap = sortService.dateSort(voucherList);
                    break;
                case 'accountSort':
                    voucherMap = sortService.accountSort(voucherList);
                    break;
                case 'userSort':
                    voucherMap = sortService.userSort(voucherList);
                    break;
                case 'companySort':
                    voucherMap = sortService.companySort(voucherList);
                    break;
            }
            
            return voucherMap;
        };
        
        return sortService;
        
    }]);
})()