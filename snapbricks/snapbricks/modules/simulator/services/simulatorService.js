'use strict';

var simulatorModule = angular.module('simulatorModule.services', []);

simulatorModule.service('simulatorModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
		var servicePath;
   
   var WSO2Mode = ENV.WSO2Mode;
	if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of GSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API

   var URL;

   this.getGatewayList = function () {
		
       
		URL = servicePath+apiConstant.gatewayAll;
      
		
		
		return $http({
            method: 'GET',
            url: URL,
			
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			
        });
		
		
    };
    this.getGatewaypageviseList = function (page,params) {
		
       
		URL = servicePath+apiConstant.gatewayAll;
      
		
		if(page != "")
		{
			URL = URL + "&page="+page;
		}
		return $http({
            method: 'GET',
            url: URL,
			params:params,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			
        });
		
		
    };
    this.getGatewayById = function(gwid) {


        URL = servicePath + String.format(apiConstant.getGatewayDetails, gwid);



        return $http({
            method: 'GET',
            url: URL,

            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response.data);
            return response.data;

        });


    };
});