'use strict';

var datamanagementModule = angular.module('datamanagementModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
datamanagementModule.service('datamanagementModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
   var servicePath;              // Base path of API
   var WSO2Mode = ENV.WSO2Mode;
   
   if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API
   var apiMode = ENV.apiMode;              // Base path of API
   var URL;
 
	
});