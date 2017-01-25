( function() {

    var notificationService = angular.module('service.notification', ['ngCordova']);
    
    notificationService.factory('NotificationService', [
        function( ) {

        var device = {};

        var instance = PushNotification.init({

            android: {
                senderID: "687585600231"
            },

            ios: {
                senderID: "687585600231",
                gcmSandbox : false,
                alert: "true",
                badge: "true",
                sound: "true"
            },
        });

        var service = {};
        
        service.getInstance = function() {
            console.log("instance", instance)
            return instance;
        }

        service.registration = function() {

            device = window.localStorage.getItem('device');

            instance.on('registration', function(data) {
                console.log("registration data", angular.toJson(data))
                device.registrationToken = data.registrationId;
                console.log("guiboDevice", angular.toJson(device))
                window.localStorage.setItem('device', angular.toJson(device));
            })
        }
        
        return service;
        
    }]);
    
})()