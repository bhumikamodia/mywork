var dataModule = angular.module('dataModule.controllers', ['ui.bootstrap','ngSanitize']);

dataModule.controller('dataCtrl', function ($scope, $rootScope, dataModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window) {

    /*	Data Attribute Initialize Function of Data
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
