// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', 
  [
    'ionic',
    'ngCordova',

    'utils.constants',
    'utils.validations',
    'utils.dbCreator',
    'utils.loading',
    
    'controllers.home',

    'controllers.register.validate-email',
    'controllers.register.confirmation-token',
    'controllers.register.registration',
    'controllers.register.terms',

    'controllers.walkthrough',
    'controllers.login',
    'controllers.forgot-password',

    'controllers.menu',

    'controllers.bills.inbox',
    'controllers.bills.ready',
    'controllers.bills.expired',
    'controllers.bills.programmed',
    'controllers.bills.all',

    'controllers.detail.service',
    'controllers.detail.transactional',
    'controllers.settings',

    'controllers.add-account.qr',
    'controllers.add-account.enroll',
    'controllers.add-account.confirm',

    'controllers.stats',

    'controllers.graphs',
    'controllers.notificationmanagement',

    'controllers.profile',
    'controllers.profile-edit',
    'controllers.profile-change-password',
    
    //REMOVE
    'controllers.notification',
    'dao.db-manager',
    'dao.bills-dao',
    'service.device'

  ])

.run(function( $ionicPlatform, $rootScope, $cordovaSQLite, DataBaseCreator, 
  StatsController, DataBaseManager, BillsDAO, AppConstants, NotificationController, DeviceService) {
  $ionicPlatform.ready(function() {

    //TODO Remove this device
    // device = {
    //   identifier: '62a02d8e20fe6a7a',
    //   os: 'Android',
    //   registrationToken: "clD3XZfMTwk:APA91bESqWaP1lJU5zMrFYVPHugi2Y-VR2X28tz3-9ZVK89gvvxyGS_Q5na8H8fOfijw1fy6l5ux_02FWhcrlt4MzaMw7Ss_VyYU4lv4Uv7cKpimOZCyVwte4nA-1_f9XxyYaEbPX0K-",
    // };
    // window.localStorage.setItem('device', angular.toJson(device));

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.$on('$cordovaLocalNotification:trigger', function (event, notification, state) {
        console.log("TRIGGER" , angular.toJson(notification));
        BillsDAO.updateBillState(notification.id, AppConstants.READY_STATUS);
        $rootScope.$broadcast('refresh-boxes-event');
    });

    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
      StatsController.exportStats();
    });

    console.log("inserting dummy data");
    DataBaseManager.getInstance().transaction( function(tx) {
      
      tx.executeSql("CREATE TABLE IF NOT EXISTS Stats (" +
            "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "action varchar NOT NULL," +
            "timestamp integer," +
            "user integer NOT NULL," +
            "device integer NOT NULL," +
            "description varchar" +
        ");");

      tx.executeSql("DROP TABLE IF EXISTS Company;");
      tx.executeSql("CREATE TABLE IF NOT EXISTS Company ( " +
            "id varchar PRIMARY KEY NOT NULL, " +
            "code varchar NOT NULL, " +
            "name varchar NOT NULL, " +
            "logo varchar, " +
            "address nvarchar" +
        ");");
      tx.executeSql("INSERT INTO Company (id,code, name, logo, address) VALUES ( '45', '123456' ,'Sedepal','http://www.iagua.es/sites/default/files/sedapal.jpg', 'Yungay #213');");
      tx.executeSql("INSERT INTO Company (id,code, name, logo, address) VALUES ( '2', '654321','Luz del Sur','https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Luz_del_Sur.svg/1280px-Luz_del_Sur.svg.png', 'Providencia #113');");
      tx.executeSql("INSERT INTO Company (id,code, name, logo, address) VALUES ( '46', '567890','Banco de Credito', 'http://www.laboratoriosindugan.com/modules/productpaymentlogos/img/d87f6bb91c5b25de162958a9a50d3eba.png', 'Providencia #113');");

      tx.executeSql("DROP TABLE IF EXISTS Product;");
      tx.executeSql("CREATE TABLE IF NOT EXISTS Product (" +
            "id varchar PRIMARY KEY NOT NULL," +
            "companyId varchar NOT NULL," +
            "code varchar NOT NULL," +
            "type varchar NOT NULL," +
            "description text," +
            "FOREIGN KEY (companyId) REFERENCES Company (id)" +
        ");");
      tx.executeSql("INSERT INTO Product (id,companyId,code,type,description) VALUES (1,'45','121212','Servicios','Servicio De Agua');");
      tx.executeSql("INSERT INTO Product (id,companyId,code,type,description) VALUES (2,'2','123123','Servicios','Servicio De Luz');");
      tx.executeSql("INSERT INTO Product (id,companyId,code,type,description) VALUES (3,'46','323232','Banca','Servicio Bancario');");

      tx.executeSql('DROP TABLE IF EXISTS Account;');
      tx.executeSql("CREATE TABLE IF NOT EXISTS Account (" +
            "id nvarchar PRIMARY KEY NOT NULL, " +
            "accountNumber nvarchar NOT NULL, " +
            "productId varchar," +
            "FOREIGN KEY (productId) REFERENCES Product (id)" +
        ");");
      tx.executeSql("INSERT INTO Account (id,accountNumber,productId) VALUES ('574de764ee0c119a20a5cb8e', '4241-3700-0029-6481', 2);");
      tx.executeSql("INSERT INTO Account (id,accountNumber,productId) VALUES ('5756e00cc5c51e54255b269e', 'CTA00000000TEST001', 1);");
      tx.executeSql("INSERT INTO Account (id,accountNumber,productId) VALUES ('6756e00cc5c51e54255b269e', 'CTA00000000TEST002', 3);");
      
      tx.executeSql("DROP TABLE IF EXISTS Category;");
      tx.executeSql("CREATE TABLE IF NOT EXISTS Category (" +
            "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "description text" +
      ");");      
      tx.executeSql("INSERT INTO Category (id,description) VALUES (1,'Mi Casa');");
      tx.executeSql("INSERT INTO Category (id,description) VALUES (2,'Hijos');");
      tx.executeSql("INSERT INTO Category (id,description) VALUES (3,'Trabajo');");
      tx.executeSql("INSERT INTO Category (id,description) VALUES (4,'Pareja');");
      tx.executeSql("INSERT INTO Category (id,description) VALUES (5,'Mis Cuentas');");

      tx.executeSql("DROP TABLE IF EXISTS Settings;");
      tx.executeSql("CREATE TABLE IF NOT EXISTS Settings (" +
            "id varchar PRIMARY KEY NOT NULL, " +
            "accountId integer NOT NULL, " +
            "alias nvarchar," +
            "notification integer(1) NOT NULL DEFAULT(1)," +
            "categoryId integer," +
            "FOREIGN KEY (accountId) REFERENCES Account (id)," +
            "FOREIGN KEY (categoryId) REFERENCES Category (id)" +
        ");");
      tx.executeSql("INSERT INTO Settings (id,accountId,alias,categoryId) VALUES (2,'574de764ee0c119a20a5cb8e','Luz',1);");
      tx.executeSql("INSERT INTO Settings (id,accountId,alias,categoryId) VALUES (4,'5756e00cc5c51e54255b269e','Cuenta del agua',1);");
      tx.executeSql("INSERT INTO Settings (id,accountId,alias,categoryId) VALUES (5,'6756e00cc5c51e54255b269e','Banca Guibo',1);");      
      
      tx.executeSql("DROP TABLE IF EXISTS Voucher;");
      tx.executeSql("CREATE TABLE IF NOT EXISTS Voucher (" +
            "id varchar PRIMARY KEY NOT NULL," +
            "voucherCode varchar NOT NULL," +
            "accountId varchar NOT NULL," +
            "expirationDate integer NOT NULL," +
            "emissionDate integer NOT NULL," +
            "programedDate integer," +
            "wasRead integer(1) NOT NULL DEFAULT(0)," +
            "state char(1) NOT NULL DEFAULT('I')," +
            "cost float NOT NULL DEFAULT(0)," +
            "consumption float NOT NULL DEFAULT(0)," +
            "nationalCost float NOT NULL DEFAULT(0)," +
            "foreignCost float NOT NULL DEFAULT(0)," +
            "synchronized integer(1) NOT NULL DEFAULT(1)," +
            "FOREIGN KEY (accountId) REFERENCES Account (id)" +
        ");");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (1,'12345678','574de764ee0c119a20a5cb8e',1482202800000,1462417200000,0,'I',8000,'70');");
         
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (2,'12345678', '5756e00cc5c51e54255b269e',1482202800000,1462417200000,0,'I',10000,23);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (3,'12345679', '5756e00cc5c51e54255b269e',1461898800000,1459825200000,0,'E',40000,103);");
      tx.executeSql("INSERT INTO Voucher (id, voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (4,'12345680', '5756e00cc5c51e54255b269e',1459220400000,1457146800000,0,'E',20000,63);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (5,'12345681', '5756e00cc5c51e54255b269e',1456714800000,1454641200000,0,'E',50000,43);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (6,'12345682', '5756e00cc5c51e54255b269e',1454036400000,1451962800000,0,'I',30000,83);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (7,'12345683', '5756e00cc5c51e54255b269e',1451358000000,1449284400000,0,'E',40000,53);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption) VALUES (8,'12345684', '5756e00cc5c51e54255b269e',1464490800000,1462417200000,0, 'P',60000,53);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (9,'12345684', '6756e00cc5c51e54255b269e',1464490800000,1462417200000,0, 'I',0,0, 7000, 8000);");           
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (10,'12345684', '6756e00cc5c51e54255b269e',1461898800000,1459825200000,0, 'I',0,0, 1000, 4000);");          
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (11,'12345684', '6756e00cc5c51e54255b269e',1480474800000,1457146800000,0, 'R',0,0, 2000, 1000);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (12,'12345684', '6756e00cc5c51e54255b269e',1459220400000,1457146800000,0, 'R',0,0, 2000, 1000);");
      
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (13,'12345684', '6756e00cc5c51e54255b269e',1473168876326,1473168876326,0, 'I',0,0, 6000, 2000);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (14,'12345684', '6756e00cc5c51e54255b269e',1473168876326,1473168876326,0, 'I',0,0, 3000, 5000);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (15,'12345684', '5756e00cc5c51e54255b269e',1473168876326,1473168876326,0, 'I',6000, 6000, 0, 0);");
      tx.executeSql("INSERT INTO Voucher (id,voucherCode,accountId,expirationDate,emissionDate,wasRead,state,cost,consumption, nationalCost,  foreignCost) VALUES (16,'12345684', '5756e00cc5c51e54255b269e',1473168876326,1473168876326,0, 'I',6000, 6000, 0, 0);");
      
      tx.executeSql("DROP TABLE IF EXISTS VoucherDetail;");
      tx.executeSql("CREATE TABLE IF NOT EXISTS VoucherDetail (" +
            "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "voucherId varchar NOT NULL," +
            "date integer NOT NULL," +
            "cost float NULL," +
            "consumption float NULL," +
            "unit varchar," +
            "description varchar," +
            "type varchar," +
            "cuota integer," +
            "FOREIGN KEY (voucherId) REFERENCES Voucher (id)" +
        ");");

      // Official Table
      // tx.executeSql("CREATE TABLE IF NOT EXISTS VoucherDetail (" +
      //       "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +
      //       "voucherId varchar NOT NULL," +
      //       "date integer NOT NULL," +
      //       "nationalAmount float NULL," +
      //       "foreignAmount float NULL," +            
      //       "description varchar," +            
      //       "FOREIGN KEY (voucherId) REFERENCES Voucher (id)" +
      //   ");");

      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (1, 9, 1464490800000, 700, 700, '$', 'PRACTIKA CAFET AROMA INOX', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (2, 9, 1464490800000, 500, 500, '$', 'SUAVE P.HIGIENICO D.HOJA', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (3, 9, 1464490800000, 600, 600, '$', 'MUG DE COLORES DISEÑO ZIG ZAG', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (4, 9, 1464490800000, 200, 200, '$', 'MUG DE COLORES DISE?O ZIG ZAG', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (5, 9, 1464490800000, 500, 500, '$', 'JEAN SOGA DKDA03936', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (6, 9, 1464490800000, 100, 100, '$', 'OTROS - DESCUENTOS', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (7, 10, 1464490800000, 700, 700, '$', 'BICI MICKEY - CLUB', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (8, 10, 1464490800000, 500, 500, '$', 'SOMETHING SPEC WHISKY UN750CM3.', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (9, 10, 1464490800000, 600, 600, '$', 'SOMETHING SPEC WHISKY UN750CM3.', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (10, 10, 1464490800000, 200, 200, '$', 'BICI MICKEY - CLUB', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (11, 10, 1464490800000, 500, 500, '$', 'SOMETHING SPEC WHISKY UN750CM3.', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (12, 10, 1464490800000, 100, 100, '$', 'BICI MICKEY - CLUB', 'NAC');"); 
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (13, 11, 1464490800000, 700, 700, '$', 'AER-POL-POCKET1-PV15', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (14, 11, 1464490800000, 500, 500, '$', 'MDS-NK-POL-JERSEY', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (15, 11, 1464490800000, 600, 600, '$', 'FRIENDSHIP EGGS', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (16, 11, 1464490800000, 200, 200, '$', 'FRIENDSHIP EGGS', 'INT');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (17, 11, 1464490800000, 500, 500, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (18, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (19, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (20, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (21, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (22, 11, 1464490800000, 10000, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (23, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (24, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");
      tx.executeSql("INSERT INTO VoucherDetail (id, voucherId, `date`, cost, consumption, unit, description,type) VALUES (25, 11, 1464490800000, 100, 100, '$', 'MDS-NK-POL-JERSEY', 'NAC');");

    }, function(error) {
      console.log('Transaction ERROR: ' + error.message);
    }, function() {
      console.log('Populated database OK');
    });

    var guiboDevice = {
          identifier: device.uuid,
          os : device.platform
        };

    window.localStorage.setItem('device', angular.toJson(guiboDevice));

    var push = PushNotification.init({
      android: {
        senderID: "687585600231"
      },

      ios: {
        senderID: "687585600231",
        gcmSandbox : true,
        alert: "true",
        badge: "true",
        sound: "true"
      },
    });
    
    push.on('registration', function(data) {
        console.log("registration data", angular.toJson(data))
        guiboDevice.registrationToken = data.registrationId;
        console.log("guiboDevice", angular.toJson(guiboDevice))
        window.localStorage.setItem('device', angular.toJson(guiboDevice));
        DeviceService.updateToken(guiboDevice)
    })
    
    console.log("Device", angular.toJson(device))
    console.log("guiboDevice", angular.toJson(guiboDevice))

    push.on('notification', function(data) {

      alert(angular.toJson(data.message))

      switch (data.additionalData.action) {
          case "newBill":
            NotificationController.loadBill(data.additionalData.billId);
          case "removeAccount":
            NotificationController.removeAccount(data.additionalData.accountId);
      }

    });

  });
})

.config( function( $stateProvider, $urlRouterProvider ) {  

  $stateProvider
    .state('home', {
      url : '/',
      templateUrl : 'templates/home.html',
      controller : 'HomeController'
    })

    .state('validate-email', {
      url : '/validate-email',
      templateUrl : 'templates/register/validate-email.html',
      controller : 'ValidateEmailController'
    })

    .state('confirmation-token', {
      url : '/confirmation-token',
      templateUrl : 'templates/register/confirmation-token.html',
      controller : 'ConfirmationTokenController'
    })

    .state('registration', {
      url : '/registration',
      templateUrl : 'templates/register/registration.html',
      controller : 'RegistrationController'
    })

    .state('terms', {
      url : '/terms',
      templateUrl : 'templates/register/terms.html',
      controller : 'TermsController'
    })

    .state('walkthrough', {
      url : '/walkthrough',
      templateUrl : 'templates/walkthrough.html',
      controller : 'WalkthroughController'      
    })

    .state('login', {
      url : '/login',
      templateUrl : 'templates/login.html',
      controller : 'LoginController'
    })

    .state('forgot-password', {
      url : '/forgot-password',
      templateUrl : 'templates/forgot-password.html',
      controller : 'ForgotPasswordController'
    })

    .state('app', {
      url : '/app',
      abstract: true,
      templateUrl : 'templates/menu.html',
      controller : 'MenuController'
    })    

    .state('app.bills-inbox', {
      url : '/bills/inbox',
      views : {
        'appContent' : {
            templateUrl : 'templates/bills/inbox.html',
            controller : 'InboxController'
        }
      }
    })

    .state('app.bills-ready', {
            url: '/bills/ready',
            views: {
                'appContent': {
                    templateUrl: 'templates/bills/ready.html',
                    controller : 'ReadyVoucherController'
                }
            }
      })

    .state('app.bills-expired', {
            url: '/bills/expired',
            views: {
                'appContent': {
                    templateUrl: 'templates/bills/expired.html',
                    controller : 'ExpiredVoucherController'
                }
            }
      })

    .state('app.bills-programmed', {
            url: '/bills/programmed',
            views: {
                'appContent': {
                    templateUrl: 'templates/bills/programmed.html',
                    controller : 'ReprogrammedVoucherController'
                }
            }
      })

    .state('app.bills-all', {
            url: '/bills/all',
            views: {
                'appContent': {
                    templateUrl: 'templates/bills/all.html',
                    controller : 'AllVoucherController'
                }
            }
      })

    .state('app.detail-service', {
            url: '/bills/detail/service/:bill',
            views: {
                'appContent': {
                    templateUrl: 'templates/detail/service.html',
                    controller: 'ServiceDetailController'
                }
            }
        })
  
  .state('app.detail-transactional', {
            url: '/bills/detail/transactional/:bill',
            views: {
                'appContent': {
                    templateUrl: 'templates/detail/transactional.html',
                    controller: 'TransacDetailController'
                }
            }
        })

  .state('app.settings', {
            url: '/bills/account/setting/:accountId',
            views: {
                'appContent': {
                    templateUrl: 'templates/settings.html',
                    controller: 'SettinsController'
                }
            }
        })

    .state('app.add-account-qr', {
      url : '/add-account/qr',
      views : {
        'appContent' : {
            templateUrl : 'templates/addAccount/qr.html',
            controller : 'QRController'
        }
      }
    })

    .state('app.add-account-enroll', {
      url : '/add-account/enroll/:account',
      views : {
        'appContent' : {
            templateUrl : 'templates/addAccount/enroll.html',
            controller : 'EnrollController',            
        }
      }
    })

    .state('app.add-account-confirm', {
      url : '/add-account/confirm/:companyId',
      views : {
        'appContent' : {
            templateUrl : 'templates/addAccount/confirm.html',
            controller : 'AccConfirmController'
        }
      }
    })

    .state('app.graphs', {
      url : '/graphs',
      views : {
        'appContent' : {
            templateUrl : 'templates/graphs.html',
            controller : 'GraphsController'
        }
      }
    })

    .state('app.notification-management', {
      url : '/notification-management',
      views : {
        'appContent' : {
            templateUrl : 'templates/notification-management.html',
            controller : 'NotificationManagerController'
        }
      }
    })

    .state('app.profile', {
      url : '/profile',
      views : {
        'appContent' : {
            templateUrl : 'templates/profile/profile.html',
            controller : 'ProfileController'
        }
      }
    })

    .state('app.profile-edit', {
      url : '/profile/edit',
      views : {
        'appContent' : {
            templateUrl : 'templates/profile/edit.html',
            controller : 'EditController'
        }
      }
    })

    .state('app.profile-change-password', {
      url : '/profile/changePassword',
      views : {
        'appContent' : {
            templateUrl : 'templates/profile/changePassword.html',
            controller : 'ChangePasswordController'
        }
      }
    })

    .state('app.profile-remove', {
      url : '/profile/changePassword',
      views : {
        'appContent' : {
            templateUrl : 'templates/profile/remove.html',            
        }
      }
    })
    ;
    
    var user = window.localStorage.getItem('user');

    if(!user) {
      $urlRouterProvider.otherwise('/');
    } else {
      $urlRouterProvider.otherwise('/app/bills/inbox');
    }

})
