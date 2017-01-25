(function(){
    var menu = angular.module( 'controllers.menu', ['service.auth'])
    
    menu.controller('MenuController', ['$scope', '$state', '$rootScope','$ionicPopup', 
        '$ionicActionSheet', 'AuthService', '$ionicHistory', 
        
        function( $scope, $state, $rootScope, $ionicPopup, $ionicActionSheet,AuthService, $ionicHistory) {

        $scope.showMenuMoya = true;

        $scope.settings = {             
            0 : "app.profile",
            1 : "app.add-account-qr"
        }
        
        $scope.showSettings = function() {
            $scope.showMenuMoya = false;
        };

        $scope.hideSettings = function() {
            $scope.showMenuMoya = true;
        };
        
        $scope.logout = function() {

            console.log("logout");
            var user = angular.fromJson( window.localStorage.getItem('user') );
            var device = angular.fromJson( window.localStorage.getItem('device') );            

            var success = function(response) {
                $scope.showMenuMoya = true;
                window.localStorage.removeItem('user');
                $state.go('home');
            };

            var error = function(response) {
                console.log("RESPONSE: ", angular.toJson(response));
            };

            AuthService.logout(user, device).then(success).catch(error);
        };
        
        $scope.showSortOptions = function() {
            
            $ionicActionSheet.show(
                {
                    buttons: [
                        { text: '<i class="icon ion-calendar"></i>Ordenar por Fecha' },
                        { text: '<i class="icon ion-folder"></i>Ordenar por tipo de cuenta' },
                        { text: '<i class="icon ion-person"></i>Ordenar por Categoria' },
                        { text: '<i class="icon ion-arrow-swap"></i>Ordenar por Compañia' },
                    ],
                    
                    cancelText: 'Cancelar',
                    
                    buttonClicked: function(index) {
                        if(index === 0) {
                            $rootScope.$broadcast('sort-event','dateSort');
                        }                        
                        if(index === 1) {
                            $rootScope.$broadcast('sort-event','accountSort')
                        }
                        if(index === 2) {
                            $rootScope.$broadcast('sort-event','userSort')
                        }
                        if(index === 3) {
                            $rootScope.$broadcast('sort-event','companySort')
                        }
                        return true
                    },
                }
            );
        }

        $scope.showSettingsOptions = function() {
            
            $ionicActionSheet.show(
                {
                    buttons: [
                        { text: '<i class="icon ion-person"></i>Perfil' },
                        { text: '<i class="icon ion-plus-circled"></i>Agregar Cuenta' },
                    ],
                    
                    cancelText: 'Cancelar',
                    
                    buttonClicked: function(index) {
                        $rootScope.$broadcast('settings-event', $scope.settings[index])
                        return true;
                    },
                }
            );
        }
        
        $scope.isBox = function() {
            
            var resp = false;
            
            if( $ionicHistory.currentView().stateName === 'app.bills-inbox' || 
                $ionicHistory.currentView().stateName === 'app.bills-ready' || 
                $ionicHistory.currentView().stateName === 'app.bills-expired' || 
                $ionicHistory.currentView().stateName === 'app.bills-programmed' ||
                $ionicHistory.currentView().stateName === 'app.bills-all' ) {
                resp = true;
            }
            
            return resp;
        }
        
    }]);
    
})()