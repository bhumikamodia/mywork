'use strict';

var myApp = angular.module('commonModule.controllers', []);





//admin menu show/hide
myApp.controller('adminMenu', function ($scope,$location) {
        
        $scope.$on('$locationChangeStart', function () {
             
            var o1 = $location.path();
            var userModules = '/admin';
            
            if(o1.match(userModules)){
                //show admin header
                $scope.adminDashboardTopMenu = function() {
                    return true;
                };
                //hide user dashboard header
                $scope.dashboardTopMenu = function() {
                    return false;
                };
                //hide left menu
                $scope.topLeftMenu = function() {
                    return false;
                };
                
            }
        });
});
// Function Name : String.format
// Parameters 	 : NA
// Description 	 : Use to do string formate to create parameterize any string
// The string containing the format items (e.g. "{0}") will and always has to be the first argument and so on.
String.format = function () {    
    var theString = arguments[0];
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
};
 function generateUUID() {
						var d = new Date().getTime();
						var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
							var r = (d + Math.random()*16)%16 | 0;
							d = Math.floor(d/16);
							return (c=='x' ? r : (r&0x3|0x8)).toString(16);
						});
						 return uuid;
						}
//	Controller Name 		:	logoutCtrl
//	Controller Parameters	:	$cookieStore,$http,$scope,$rootScope,$window,$location,$state
myApp.controller('logoutCtrl', function ($cookieStore, $http, $scope, $rootScope, $window, $location, $state) {
    //	Function Name			:	logout
    $scope.logout = function () {
     
       $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'JWT';
        var adminRestrictedPage = $.inArray($location.path(), ['/admin']) !== -1;
        if (adminRestrictedPage == false) {
			
            if (window.parent.opener == null) {
                $window.location.reload();
            } else {
				 $window.location.reload();
               // window.parent.opener.location.reload();
               // $window.close();
            }

        }
        $cookieStore.remove('globals');
    };
});
myApp.controller('changePasswordCtrl',function($cookieStore, $http, $scope, $rootScope, $window, $location, $state,userModuleService,$stateParams,toaster,$timeout,CustomMessages){
	
	 $rootScope.globals = $cookieStore.get('globals') || {};

            if ($rootScope.globals.currentUser) {
				
                $cookieStore.remove('globals');
				$window.location.reload();		
			}
			$scope.userData = {};
			$scope.saveApplication = function(){
			
				userModuleService.changepassword($scope.userData).then(function(data){
					
					$timeout(function(){
					toaster.pop('success','',CustomMessages.COMMON_MODAL_PASSWORD);
					$location.path('/login');
					});
				}).catch(function(response){
					$timeout(function(){
					//toaster.pop('error','',CustomMessages.COMMON_MODAL_PASSWORD_ERROR);
					//$location.path('/login');
					});
				});
			};
			//-------------------------------------------------------------------------------
			 $scope.inputType = 'password';
			 $scope.inputTypeNew='password';
			  
			  // Hide & show password function
			  $scope.hideShowPassword = function(){
			   
				if ($scope.inputType == 'password')
				{
				  $scope.inputType = 'text';
				}
				else
				{
				  $scope.inputType = 'password';
				}
			  


			  };
			   $scope.hideShowPasswordNew=function()
			   { 
			if ($scope.inputTypeNew == 'password')
				{
				  $scope.inputTypeNew = 'text';
				}
				else
				{
				  $scope.inputTypeNew = 'password';
				}
			}
//------------------------------------------------------------------------------------
});

myApp.controller('userInfoCtrl',function($cookieStore, $http, $scope, $rootScope, $window, $location, $state,userModuleService,$stateParams,toaster,$timeout,CustomMessages,allDataStorage){
	  $rootScope.globals = $cookieStore.get('globals') || {};

            if ($rootScope.globals.currentUser) {
				
					
				
				$cookieStore.remove('globals');
				
				allDataStorage.setData(null);
				$window.location.reload();	
				$rootScope.$broadcast("userInfoPage");
			}
		
      var userId = $scope.id;
	   $scope.inputType = 'password';
			
			  
			  // Hide & show password function
			  $scope.hideShowPassword = function(){
			   
				if ($scope.inputType == 'password')
				{
				  $scope.inputType = 'text';
				}
				else
				{
				  $scope.inputType = 'password';
				}
			  
			  };
	$scope.userData = {};
	$scope.userData.id = userId;
	
	$scope.saveApplication = function(){
	$scope.userData.clientname =$scope.userData.username;
	$scope.userData.ipaddresslist =["127.0.0.1","127.1.1.0"];
	userModuleService.postUserData2($scope.userData,$scope.userData.id).then(function(data){
		
		if(data.data==undefined)
		{
		$timeout(function(){
		toaster.pop('success','',CustomMessages.COMMON_MODAL_PROFILE_SUCCESS);
		$location.path('/login');
		});
		} 
		else if(data.data.detail != undefined && data.status ==403)
		{
			toaster.pop('error','',data.data.detail);
		}
		else if(data.data.message != undefined && data.status ==400)
		{
			toaster.pop('error','',CustomMessages.USER_TEMP_CREATE_ERROR);
		}
		else{
		ttoaster.pop('error','',CustomMessages.COMMON_MODAL_PROFILE_ERROR);  
		}
	}).catch(function(response){
		$timeout(function(){
		toaster.pop('error','',CustomMessages.COMMON_MODAL_PROFILE_ERROR);
		//$location.path('/login');
		});
	});
	};
});