(function(){
    
    var notification = angular.module('controllers.notificationmanagement', 
        ['service.account', 'dao.account-dao', 'dao.settings-dao', 'utils.loading','utils.constants']);
    
    notification.controller('NotificationManagerController', [ 
        '$rootScope', '$scope', '$scope', '$state' ,'AccountService', 
        'AccountDAO' ,'SettingsDAO', '$ionicHistory', 'Loading', '$ionicPopup', 'AppConstants',
        function( $rootScope, $scope, $scope, $state, AccountService, AccountDAO,
            SettingsDAO, $ionicHistory, Loading, $ionicPopup, AppConstants) {

        $scope.settingsSelected = [];
        $scope.user = angular.fromJson(window.localStorage.getItem('user'));

        $scope.categorySort = function (accountList) {
            console.log('NotificationManagerController, categorySort');
            $scope.accountsMap = {};

            for(var index in accountList) {                
                var section = [];                
                var sectionTitle = accountList[index].category;
                
                if($scope.accountsMap.hasOwnProperty(sectionTitle)) {
                    continue;
                }
                
                for(var accIndex in accountList) {
                    var category = accountList[accIndex].category;
                    if( sectionTitle === category ) {
                        var account = {
                            companyName : accountList[accIndex].companyName,
                            address : accountList[accIndex].address,
                            notification : accountList[accIndex].notification,
                            settingId : accountList[accIndex].settingId,
                            logo : accountList[accIndex].logo
                        };
                        section.push(account);
                    }
                }
                $scope.accountsMap[sectionTitle] = section;                
            }
            
            console.log("categorySort: ", angular.toJson($scope.accountsMap));
        };
        
        $scope.getAccounts = function() {
            Loading.show("notification manager");
            var success = function(response) {
                Loading.hide();
                console.log('NotificationManagerController:', angular.toJson(response))                
                $scope.categorySort(response);
            };
        
            var error = function(error) {
                Loading.hide();
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
                console.log('ERROR!!! ', angular.toJson(error) );
            };
            
            AccountDAO.retrieveAllAccounts().then(success).catch(error);
        };        

        $scope.containsSetting = function(setting) {
            var resp = false;

            for( var index in $scope.settingsSelected ) {                
                if( $scope.settingsSelected[index].id === setting.id ) {
                    resp = true;
                    break;
                }
            }

            return resp;
        };

        $scope.removeSetting = function(setting) {
            var list = [];

            for( var index in $scope.settingsSelected ) {
                if( $scope.settingsSelected[index].id !== setting.id ) {
                    list.push($scope.settingsSelected[index]);
                }
            }

            return list;
        };
        
        $scope.enableNotification = function(account) {

            console.log("enableNotification:", angular.toJson(account));

            var notification = account.notification != 1 ? 1 : 0;
            account.notification = notification;
            var setting = { id : account.settingId, notification : notification };
            
            if($scope.containsSetting(setting)) {
                $scope.settingsSelected = $scope.removeSetting(setting);
            }
            
            $scope.settingsSelected.push(setting);
            console.log( angular.toJson($scope.settingsSelected) );
        }
        
        $scope.changeNotificationStatus = function() {

           // Loading.show();

            var success = function(response) {
                console.log(angular.toJson("Notification Response:", response));

                $scope.getAccounts();
                $scope.settingsSelected = [];                
                //Loading.hide();
                $scope.showToast("Cambio Realizado");
            };
            
            var error = function(error) {
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
                console.log("Notification Response:", angular.toJson(error));
                //Loading.hide();
            };
            
            var updateLocalData = function(response) {
                return SettingsDAO.updateNotificationSetting($scope.settingsSelected)
                    .then(success).catch(error);
            };

            AccountService.updateNotificationSetting($scope.settingsSelected)
                .then(updateLocalData).catch(error);
            
        };

        $scope.showToast = function(message) {
            window.plugins.toast.showWithOptions(
                 {
                  message: message,
                  duration: "short",
                  position: "bottom",
                }
             );
        }
        
        $rootScope.$on('refresh-notiffication-view', function(event) {
            $scope.getAccounts();
        });

        $scope.$on("$ionicView.afterEnter", function(event, data){
            $scope.getAccounts();
        });

    }]);
    
})()