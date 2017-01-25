(function(){
	
	var constants = angular.module('utils.constants', []);

	constants.constant('AppConstants', {

		'EMAIL_PATTERN' : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		'TOKEN_PATTERN' : /^[a-zA-Z0-9]*$/,
		'CONTAINS_NUMBER' : /^(?=.*\d)/,
		'CONTAINS_UPPER_CASE' : /^(?=.*[A-Z])/,
		'CONTAINS_LOWER_CASE' : /^(?=.*[a-z])/,
		'CONTAINS_SPECIAL_CHAR' : /^(?=.*[$@!%*#?&.])/,
		'PASSWORD_PATTERN' : /^(?=.*[$@!%*#?&.])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$@!%*#?&.]{8,}$/,

		// WEB SERVICES
		// 'BASE_URL' : 'http://guibo.talka.cl/',
		// 'BASE_URL' : 'http://guibo.talka.kvz.local/',
		
		'BASE_URL' : 'http://192.168.10.227:1337/',
		// 'BASE_URL' : 'http://192.168.1.45:1337/',
		
		//AUTH
		'SEND_TOKEN_VALIDATOR' : 'auth/sendTokenValidator',
		'VALIDATE_TOKEN' : 'auth/validateToken',
		'REGISTER_USER' : 'auth/registerUser',
		'SIGNIN' : 'auth/signinUser',
		'LOGOUT' : 'auth/logOut',
		'FORGOT_PASSWORD' : 'auth/forgotPassword',

		//ACCOUNT
		'RETRIEVE_ACCOUNT' : 'account/retrieveAccount',
		'ENROLL_ACCOUNT' : 'account/enrollAccount',
		'REMOVE_ACCOUNT' : 'account/removeUserAccount',

		//SETTINGS
		'NOTIFICATION_SETTINGS' : 'settings/updateAccountSettings',

		//STATS
		'SAVE_STATS' : 'stats/saveStats',

		//BILLS
		'RETRIEVE_BILLS' : 'bill/retrieveBill',
		'HISTORICAL_BILLS' : 'bill/retrieveHistoricalBills',

		//DEVICE
		'UPDATE_TOKEN' : 'device/updateToken',
		
		//BILLS_STATUS
		'INBOX_STATUS' : 'I',
		'READY_STATUS' : 'R',
		'PROGRAMMED_STATUS' : 'P',
		'EXPIRED_STATUS' : 'E',

		// SECRET QUESTIONS
		'SECRET_QUESTIONS' : [
				'¿Nombre de tu primera mascota?',
				'¿Nombre de tu pelicula favorita?',
				'¿Nombre de tu ciudad natal?',
				'¿Primera empresa donde trabajaste?',
				'¿Libro favorito?'],

		//MONTHS
		'MONTHS_LARGE' : [
              "Enero", "Febrero", "Marzo",
              "Abril", "Mayo", "Junio", "Julio",
              "Agosto", "Septiembre", "Octubre",
              "Noviembre", "Diciembre"
            ],

        'MONTHS_SHORT' : ["ENE", "FEB", "MAR","ABR", "MAY", "JUN", "JUL","AGO", "SEP", "OCT","NOV", "DIC"],

        //BILLS ACTIONS
        'INBOX_ACTION' : 'INBOX ACTION',
        'READY_ACTION' : 'READY ACTION',
        'PROGRAMMED_ACTION' : 'PROGRAMMED ACTION',
        'EXPIRED_ACTION' : 'EXPIRED ACTION',

        //ERROR MESSAGES
        'ERROR_TITLE': 'Ocurrió un Error',
        'DEFAULT_ERROR' : 'Ocurrió un error intentelo más tarde',

        //CATEGORIES
        'DEFAULT_CATEGORY' : 5,

	});

})()