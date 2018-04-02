var securityModule = angular.module('securityModule.controllers', ['ui.bootstrap','ngSanitize']);

securityModule.controller('securityCtrl', function ($scope, $rootScope, securityModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window) {

    /*	Data Attribute Initialize Function of Security
     Dynamic Generic Function for Initialize Data Attributes
     */
	$rootScope.globals = $cookieStore.get('globals') || {};
	
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
    }
	
	
			
});
