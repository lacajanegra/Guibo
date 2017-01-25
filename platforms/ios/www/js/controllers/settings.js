(function() {
    var settings = angular.module('controllers.settings', 
        [ 'service.account', 'dao.settings-dao', 'dao.account-dao', 'dao.category-dao', 'utils.loading','dao.bills-dao','utils.constants']);
    
    settings.controller('SettinsController', 
        [ '$rootScope', '$scope', '$state','$stateParams','$ionicPopup', 
            '$ionicHistory', 'AccountService', 'AccountDAO', 'SettingsDAO', 'CategoryDAO','BillsDAO', 'Loading', 'AppConstants',

        function( $rootScope, $scope, $state, $stateParams, $ionicPopup, 
            $ionicHistory, AccountService, AccountDAO, SettingsDAO, CategoryDAO, BillsDAO, Loading, AppConstants) {
        
        console.log("SettinsController");
        $scope.accountId = $stateParams.accountId;
        $scope.user = angular.fromJson(window.localStorage.getItem('user'));
        $scope.tmpInfo = {};
        
        $scope.getAccount = function(){

            Loading.show();
            var success = function(response){
                console.log("SUCCESS SETTINGS:", angular.toJson(response));
                $scope.settings = {};
                $scope.settings.id = response.id;
                $scope.settings.notification = response.notification;
                $scope.settings.alias = response.alias;
                $scope.settings.categoryId = response.categoryId;
                $scope.settings.accountId = response.accountId;
                $scope.settings.address = response.address;

                console.log("getAccount:", angular.toJson($scope.settings));
                $scope.tmpInfo.notification = $scope.settings.notification == 1;                
                $scope.getCategories();
                Loading.hide();
            }
            
            var error = function(error){
                Loading.hide();
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
                console.log(angular.toJson(error));
            }
            console.log("$scope.accountId", $scope.accountId);
            SettingsDAO.findSettingByAccount($scope.accountId).then(success).catch(error);
            
        }
        
        $scope.getCategories = function(){
            Loading.show();
            var success = function(response){
                
                $scope.categories = response;
                
                for( var index in $scope.categories ) {
                    if($scope.settings.categoryId === $scope.categories[index].id) {
                        $scope.tmpInfo.category = $scope.categories[index];                        
                        break;
                    }                        
                }
                Loading.hide();                
            }
            
            var error = function(error){
                console.log(angular.toJson(error));
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
                Loading.hide();
            }
            
            CategoryDAO.retrieveCategories().then(success).catch(error);
            
        }
        
        $scope.editAlias = function() {

            $scope.tmpInfo.alias = $scope.settings.alias;

            $ionicPopup.show({
                template: '<input type="text" ng-model="tmpInfo.alias">',
                title: 'Escriba un alias para esta cuenta',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Guardar</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.tmpInfo.alias) {
                                e.preventDefault();
                            } else {
                                console.log("tmpInfo:", angular.toJson($scope.tmpInfo));
                                $scope.settings.alias = $scope.tmpInfo.alias;
                                return $scope.tmpInfo.alias;
                            }
                        }
                    }
                ]
            });
        };
        
        $scope.saveSettings = function() {
            $scope.updateAccountSettings();            
        };
        
        $scope.updateAccountSettings = function() {
            Loading.show();
            var success = function(response) {
                console.log("Update Response", angular.toJson(response));
                $rootScope.$broadcast('refresh-boxes-event');
                $rootScope.$broadcast('refresh-detail-event');
                $ionicHistory.goBack();
                Loading.hide();
            }
            
            var error = function(error) {
                console.log("Update Error", angular.toJson(error));
                $ionicPopup.alert({
                         title: 'Error al guardar',
                         template: angular.toJson(error)
                });
                Loading.hide();
            }
            
            $scope.settings.notification = $scope.tmpInfo.notification ? 1 : 0;
            $scope.settings.categoryId = $scope.tmpInfo.category.id;

            SettingsDAO.updateSettings($scope.settings).then(success).catch(error);

        }
        
        $scope.removeSetting = function() {

            Loading.show();

            var success = function(response) {                
                console.log("removeSetting Response", angular.toJson(response));
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.bills-inbox');
                Loading.hide();
            }
            
            var error = function(error) {
                Loading.hide();
                console.log("Remove Error", angular.toJson(error));
                $ionicPopup.alert({
                    title: AppConstants.ERROR_TITLE,
                    template: angular.toJson(error)
                });
            }
            
            AccountService.removeAccount($scope.accountId, $scope.user.id)
            .then( function(response) {
                return BillsDAO.removeAccountBills($scope.accountId);
            }).then( function(response) {
                console.log(angular.toJson(response));
                return SettingsDAO.removeSetting($scope.accountId);
            }).then( function(response) {
                console.log(angular.toJson(response));
                return AccountDAO.removeAccount($scope.accountId);
            }).then(success).catch(error);
            
        };

        $scope.$on("$ionicView.afterEnter", function(event, data){
            $scope.getAccount();
        });

    }]);
    
})()