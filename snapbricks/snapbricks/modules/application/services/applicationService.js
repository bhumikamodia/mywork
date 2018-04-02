'use strict';

var applicationModule = angular.module('applicationModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
applicationModule.service('applicationModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
   var servicePath;              // Base path of API
   var WSO2Mode = ENV.WSO2Mode;
    if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.userapiEndpoint;              // Base path of API
  
   var URL;
  // --------------------------------------START EVENTS AREA ---------------------------------------------
   // Function Name : getApplicationsList
  // Description 	 : Get All Application List
	 
    this.getApplicationsList = function (page) {
		
      
		URL = servicePath+apiConstant.getApplicationsList;
       
		
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
			
        }).catch(function(error){
			return error;
		});
		
		
    };
	this.statusApplicationChangeRequest = function(statusParameter,application){
		URL = servicePath+String.format(apiConstant.statusApplicationChangeRequest,statusParameter, application.id);
       
		
		
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
	 this.getApplicationDetailFromId = function (ID) {
		
     
			URL = servicePath+String.format(apiConstant.getApplicationDetailFromId, ID);
       
		
		
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
    this.PostOrgData = function (organisationData,applicationId) {
		
       
			var Methoddata;
       
		if(applicationId != undefined)
		{
			URL = servicePath+String.format(apiConstant.getApplicationDetailFromId, applicationId);
			Methoddata = 'PUT';
		}else{
			
			URL = servicePath+apiConstant.getOrganizationData;
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
  // Function Name : DeleteApplication
  // Description 	 : Delete Application Request
	 
    this.DeleteApplication = function (applicationID) {
		
      
		URL = servicePath+String.format(apiConstant.getApplicationDetailFromId, applicationID);
       
	
       

        //changed By Sanny Soni 
        return $http({
            method: 'DELETE',
            url: URL,
            headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response.data;
        });;
		
		
    };
	this.getSubscription = function (subscription) {
		
     
		URL = servicePath+String.format(apiConstant.getSubscription, subscription);
       
		
		
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
   this.getAPIGroups = function (page) {
		
     
		URL = servicePath+apiConstant.getAPIGroups;
       
		
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
   
   this.putSubscriptionForOrg = function(appId,orgname,email,arr){
	   URL = servicePath+String.format(apiConstant.getApplicationDetailFromId, appId);
       
		var jsonStartStream = {"orgname":orgname,"email":email,"subscription":arr};
       

        //changed By Sanny Soni 
        return $http({
            method: 'PUT',
            url: URL,
            data: jsonStartStream,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response.data;
        });
   }
    // --------------------------------------END EVENTS AREA ---------------------------------------------
	
});