var healthModule = angular.module('healthModule.controllers', ['ui.bootstrap','ngSanitize']);

healthModule.controller('healthCtrl', function ($scope, $rootScope, healthModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window) {

    /*	Data Attribute Initialize Function of Health
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
