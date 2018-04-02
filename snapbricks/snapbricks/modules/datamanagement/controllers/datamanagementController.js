var datamanagementModule = angular.module('datamanagementModule.controllers', ['ui.bootstrap', 'ngSanitize','ngTagsInput','elif']);

datamanagementModule.controller('datamgtCtrl', function($scope, $rootScope, ruleengineModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state,toaster,$mdDialog,CustomMessages,WebMqtt) {

    /*	Data Attribute Initialize Function of Camera Id, Camera IP, Camera PTZ
     Dynamic Generic Function for Initialize Data Attributes
     */
    $rootScope.globals = $cookieStore.get('globals') || {};
    $scope.showCreateNewRule = false;
	
		
    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
    }

});