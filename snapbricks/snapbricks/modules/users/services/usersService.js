'use strict';

var userModule = angular.module('userModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
userModule.service('userModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore, apiConstant) {
   var servicePath;              // Base path of API
   var WSO2Mode = ENV.WSO2Mode;
    if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API
   var URL;
  // --------------------------------------START EVENTS AREA ---------------------------------------------
    // Function Name : getUsersList
     this.getUsersList = function (page) {
		
    
		URL = servicePath+apiConstant.getUsersList;
       
		
		if(page != "")
		{
			URL = URL + "&page="+page;
		}
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
	this.getUserRolesList = function(page){
		
		URL = servicePath+apiConstant.getUserRolesList;
       
		
		if(page != "")
		{
			URL = URL + "&page="+page;
		}
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
    // Function Name : getAllRoles
	this.getAllRoles = function(){
		URL = servicePath+apiConstant.getAllRoles;
       
		return $http({
            method: 'GET',
            url: URL,
			params: {"STAFF":true},
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			
        });
	};
	this.getAllAPIGroupsPermission = function(userId){
		//URL = servicePath+apiConstant.getAllRoles;
		URL = servicePath+String.format(apiConstant.postUserData,userId);
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
	this.sendRoleRequest = function(arrayData,statusData){
		var methodpass;
		if(statusData =='delete'){
			URL= servicePath+String.format(apiConstant.sendRoleRequest,arrayData);
			methodpass = 'DELETE';
		}
		
		//var jsonStartStream = {"id":arrayData};
       
		return $http({
            method: methodpass,
            url: URL,
			// data: jsonStartStream,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			
        });
	};
	this.sendRequest = function(arrayData,statusData){
		var methodpass;
		if(statusData =='delete'){
			URL= servicePath+apiConstant.getUsersList;
			methodpass = 'DELETE';
		}else if(statusData =='activate'){
			URL= servicePath+apiConstant.sendRequest1;
			methodpass = 'POST';
		}else if(statusData =='deactivate'){
			URL= servicePath+apiConstant.sendRequest2;
			methodpass = 'POST';
		}
		var jsonStartStream = {"id":arrayData};
       
		return $http({
            method: methodpass,
            url: URL,
			 data: jsonStartStream,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
          //  console.log(response.data);
            return response.data;
        }).catch(function(response)
        {
        	//console.log(response.data);
            return response.data;
        });
	};
	// Function Name : getOrganizationDetailFromId
	this.getOrganizationDetailFromId = function(orgId){
		URL = servicePath+String.format(apiConstant.getApplicationDetailFromId,orgId);
       
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
	// Function Name : postRoleData
	this.postRoleData = function(organisationData,userId){
		var Methoddata;
       
		if(userId != undefined)
		{
			URL = servicePath+String.format(apiConstant.sendRoleRequest,userId);
			Methoddata = 'PUT';
		}else{
			
			URL = servicePath+apiConstant.getAllRoles;
			Methoddata = 'POST';
		}
		
		return $http({
            method: Methoddata,
            url: URL,
			 data: organisationData,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			
        });
	}
	// Function Name : postUserData
	this.postUserData = function(organisationData,userId){
			var Methoddata;
       
		if(userId != undefined)
		{
			URL = servicePath+String.format(apiConstant.postUserData,userId);
			Methoddata = 'PUT';
		}else{
			
			URL = servicePath+apiConstant.CreateUserUrl;
			Methoddata = 'POST';
		}
		
		return $http({
            method: Methoddata,
            url: URL,
			 data: organisationData,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			
        }).catch(function(error){
			
			return error;
			
		});
		
	};
	// Function Name : postUserData2-login
	this.postUserData2 = function(organisationData,userId){
			var Methoddata;
       
		if(userId != undefined)
		{
			URL = servicePath+String.format(apiConstant.postUserData2,userId);
			Methoddata = 'POST';
		}
		
		return $http({
            method: Methoddata,
            url: URL,
			 data: organisationData,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			}).catch(function(error){
			
			return error;
			

			
        });
		
	};
	// Function Name : changepassword
	this.changepassword = function(userData){
		var Methoddata;
       
		
			URL = servicePath+apiConstant.changepassword;
			Methoddata = 'POST';
		
		
		return $http({
            method: Methoddata,
            url: URL,
			 data: userData,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
			
        });
	};

	this.getAllDesignation = function(object,parameters){
		URL = servicePath+String.format(apiConstant.getAllUsers, object);
	
		               
        return $http({
            method: 'GET',
            url: URL,
			params: parameters,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.getUserList = function (page,params) {
		
       
		URL = servicePath+apiConstant.getUsersList;
			//console.log("My url",URL);
      
		
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

    // --------------------------------------END EVENTS AREA ---------------------------------------------
	
});