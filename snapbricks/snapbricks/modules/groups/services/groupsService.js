'use strict';

var groupModule = angular.module('groupModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
groupModule.service('groupModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
   var servicePath;              // Base path of API
   
   var WSO2Mode = ENV.WSO2Mode;
   if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API
   var URL;
  // --------------------------------------START GROUPS AREA ---------------------------------------------
  // Function Name : getGroupsList
  // Description 	 : Get All Groups List
	 
    this.getGroupsList = function (page) {
		
       
			URL = servicePath+apiConstant.getGroupsList;
       
		
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
		//	console.log(response.data);
            return response.data;
			
        });
		
		
    };
	
	 this.getGroupsData = function () {
		
		
	
			URL = servicePath+apiConstant.getGroupsData;
		
      
       
		
		
		return $http({
            method: 'GET',
            url: URL,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
		//	console.log(response.data);
            return response.data;
			
        });
		
		
    };
    // Function Name : AddGroupRequest
  // Description 	 : POST Added Group Request
	 
    this.AddGroupRequest = function (groupName,groupDescription,parentID) {
		
      
		URL = servicePath+apiConstant.getGroupsList;
       
		var jsonStartStream = {"groupname":groupName,"description": groupDescription,"parent":parentID};
       

        //changed By Sanny Soni 
        return $http({
            method: 'POST',
            url: URL,
            data: jsonStartStream,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response.data;
        });;
		
		
    };
  // Function Name : EditGroupRequest
  // Description 	 : POST Edited Group Request
	 
    this.EditGroupRequest = function (groupName,groupDescription,parentID,groupID) {
		
      
		URL = servicePath+String.format(apiConstant.EditGroupRequest,groupID);
       
		var jsonStartStream = {"groupname":groupName,"description": groupDescription,"parent":parentID};
       

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
        });;
		
		
    };
	// Function Name : DeleteGroupRequest
  // Description 	 : Delete Group Request
	 
    this.DeleteGroupRequest = function (groupID) {
		
      
		URL = servicePath+String.format(apiConstant.EditGroupRequest,groupID);
       
	
       

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
	
    // --------------------------------------END GROUPS AREA ---------------------------------------------
});