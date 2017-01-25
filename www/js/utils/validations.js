(function(){

	var validations = angular.module('utils.validations', ['utils.constants']);

	validations.directive( "emailValidator", [ 'AppConstants', function( AppConstants ) {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.emailValidator = function(email) {
                    console.log("Email Validator: ", email);                    
                    console.log("Email Validator: ", AppConstants.EMAIL_PATTERN.test(email));

                    return AppConstants.EMAIL_PATTERN.test(email);
                };
            }
        };
    }]);

    validations.directive( "tokenValidator", [ 'AppConstants', function( AppConstants ) {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.tokenValidator = function(token) {
                    console.log("Token Validator: ", token);
                    console.log("Token Validator: ", AppConstants.TOKEN_PATTERN.test(token));

                    return AppConstants.TOKEN_PATTERN.test(token);
                };
            }
        };
    }]);

    validations.directive( "passwordValidator", [ 'AppConstants', function( AppConstants ) {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.passwordValidator = function(password) {
                    console.log("passwordValidator Validator: ", password);
                    console.log("passwordValidator Validator: ", AppConstants.PASSWORD_PATTERN.test(password));

                    return AppConstants.PASSWORD_PATTERN.test(password);
                };
            }
        };
    }]);

    validations.directive( "containsNumber", [ 'AppConstants', function( AppConstants ) {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.containsNumber = function(password) {
                    console.log("containsNumber Validator: ", password);
                    console.log("containsNumber Validator: ", AppConstants.CONTAINS_NUMBER.test(password));

                    return AppConstants.CONTAINS_NUMBER.test(password);
                };
            }
        };
    }]);

    validations.directive( "containsUppercase", [ 'AppConstants', function( AppConstants ) {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.containsUppercase = function(password) {
                    console.log("containsUppercase Validator: ", password);
                    console.log("containsUppercase Validator: ", AppConstants.CONTAINS_UPPER_CASE.test(password));

                    return AppConstants.CONTAINS_UPPER_CASE.test(password);
                };
            }
        };
    }]);

    validations.directive( "containsLowercase", [ 'AppConstants', function( AppConstants ) {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.containsLowercase = function(password) {
                    console.log("containsLowercase Validator: ", password);
                    console.log("containsLowercase Validator: ", AppConstants.CONTAINS_LOWER_CASE.test(password));

                    return AppConstants.CONTAINS_LOWER_CASE.test(password);
                };
            }
        };
    }]);

    validations.directive( "containsSpecialchar", [ 'AppConstants', function( AppConstants ) {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.containsSpecialchar = function(password) {
                    console.log("containsSpecialchar Validator: ", password);
                    console.log("containsSpecialchar Validator: ", AppConstants.CONTAINS_SPECIAL_CHAR.test(password));

                    return AppConstants.CONTAINS_SPECIAL_CHAR.test(password);
                };
            }
        };
    }]);    

    validations.directive( "compareTo", function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },            
            link: function(scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function(modelValue) {
                    console.log("compareTo Validator: ", modelValue);
                    console.log("compareTo Validator: ", scope.otherModelValue);
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    });

})()