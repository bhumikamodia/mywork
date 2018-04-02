'use strict';

var homeModule = angular.module('homeModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
homeModule.service('homeModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore, powerBIConstant,apiConstant) {
   var servicePath = ENV.apiEndpoint;              // Base path of API
   var URL;
  // --------------------------------------START EVENTS AREA ---------------------------------------------
    // Function Name : getGatewayList
    
    
    // --------------------------------------END EVENTS AREA ---------------------------------------------
	this.powerbiLogin = function(callback){

		var powerbiUrl = powerBIConstant.microsoftUrl + powerBIConstant.tenantId + powerBIConstant.authorizeAPI +
						'?client_id='+ powerBIConstant.clientId + '&response_type='
		    			+ powerBIConstant.responseType + '&redirect_uri=' +powerBIConstant.redirectUri + 
		    			'&responce_mode=' + powerBIConstant.responceMode
		    			+ '&resource=' +powerBIConstant.resource + '&state=' +powerBIConstant.state;


		callback(powerbiUrl);
		// return $http({
  //           method: 'GET',
  //           url: powerbiUrl,
  //           headers: {
  //               "Content-Type": "application/json"
  //           }
  //       })
  //       .then(function (response) {
  //          callback(response);
  //       }).catch(function (error) {					
  //       	callback(error);
		// });
	}

  this.getAccessToken = function(code,callback){
    
    var obj = {};
    obj['grant_type'] = powerBIConstant.grantType;
    obj['client_id'] = powerBIConstant.clientId;
    obj['client_secret'] = powerBIConstant.clientSecret;
    obj['resource'] = powerBIConstant.resource;
    obj['code'] = code;
    obj['redirect_uri'] = powerBIConstant.redirectUri;

    var dataBody = {
            "method":"POST",
            "url": powerBIConstant.microsoftUrl + powerBIConstant.tenantId + powerBIConstant.azureGetToken,
            "data":$.param(obj),
            "header":{
                "Content-Type": "application/x-www-form-urlencoded"
            }
    }
    
    return $http({
        method: 'POST',
        url: servicePath + apiConstant.callApi,
        data: dataBody, // pass in data as strings
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {   
        callback(response.data.Data);
    });
  }


  this.getDeviceDashboard = function(deviceId){
    alert("Under Developement... Coming Soon");
    URL = servicePath+String.format(apiConstant.getPowerBIDevice, deviceId);
    
    return $http({
        method: 'GET',
        url: URL,
        headers: {
            'Content-Type':'application/json' 
        }
    }).then(function (response) {
        return response.data;
    });
  }

  this.getShowGatewayList = function(){
    URL = servicePath+apiConstant.getDetailsForShowDashboard;
  
    return $http({
            method: 'GET',
            url: URL,
     
        }).then(function (response) {
      
            return response;
        });
   }
this.postURL = function(obj){
URL = servicePath+String.format(apiConstant.postpushURL);
  
    return $http({
            method: 'POST',
            url: URL,
            data:obj,
     
        }).then(function (response) {
            return response;
        });
}
 this.getAddGatewayList = function(){
    URL = servicePath+apiConstant.getDetailsForAddDashboard;
  
    return $http({
            method: 'GET',
            url: URL,
     
        }).then(function (response) {
      
            return response.data;
        });
   }

   this.getDeviceData = function(gwid){
    URL = servicePath+String.format(apiConstant.getpowerbidevicebygwid,gwid);
  
    return $http({
            method: 'GET',
            url: URL,
     
        }).then(function (response) {
      
            return response;
        });
   }


   this.setdataset = function(data){
    URL = servicePath+String.format(apiConstant.createdataset);
  
    return $http({
            method: 'POST',
            url: URL,
            data:data,
     
        }).then(function (response) {
            return response;
        });
   }
});