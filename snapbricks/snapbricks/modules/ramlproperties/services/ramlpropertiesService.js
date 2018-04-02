'use strict';

var ramlpropertiesModule = angular.module('ramlpropertiesModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
ramlpropertiesModule.service('ramlpropertiesModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
   var servicePath;
     var WSO2Mode = ENV.WSO2Mode;
    if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API
 
   var apiMode = ENV.apiMode;              // Base path of API
   var URL;
  // --------------------------------------START EVENTS AREA ---------------------------------------------
    

    this.getRAMLDefinitionTemplate=function(page)
    {
        URL = servicePath+String.format(apiConstant.newRAMLDefinitionTemplate,page);
        if(page != "" && page != undefined)
        {
            URL = URL + "?page="+page;
        }

      //  console.log(URL)
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
            
            return response.data;
        });



}



  
    this.deleteRamlDefinition = function(id){
         URL = servicePath+String.format(apiConstant.putRAMLDefinitionTemplate,id);

          return $http({
            method: 'DELETE',
            url: URL,
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
            //console.log(response);
            return response.data;
        });

    }



         this.postRAMLDefinitionTemplate = function(jsonFormData){
         	var jsonFormData;

            URL = servicePath+apiConstant.newRAMLDefinitionTemplate;
            //jsonFormData={"name":name,"description":description,"properties":propArr,"subproperties":subPropArr}
            //console.log(jsonFormData);


            return $http({
        	method:'POST',
        	url:URL,
        	data: jsonFormData,
        	headers:{
        		'Content-Type':'application/json'
        	}
        }).then(function(response)
        {
           // console.log(response);
            return response.data;
        });

         };



 this.putRAMLDefinitionTemplate = function(jsonFormData,id){
          var jsonFormData;
          
            URL = servicePath+String.format(apiConstant.putRAMLDefinitionTemplate,id);
            
          //  jsonFormData={"name":name,"description":description,"properties":propArr,"subproperties":subPropArr}
          //  console.log(jsonFormData);
          // alert("JSON"+JSON.stringify(jsonFormData))

            return $http({
          method:'PUT',
          url:URL,
          data: jsonFormData,
          headers:{
            'Content-Type':'application/json'
          }
        }).then(function(response)
        {
          //  console.log(response);
            return response.data;
        });

         };
        



//******************************************************

this.getRAMLDeviceTemplate=function(page)
    {
        URL = servicePath+String.format(apiConstant.newRAMLDeviceTemplate,page);
        if(page != "" && page != undefined)
        {
            URL = URL + "?page="+page;
        }

        //console.log(URL)
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
            
            return response.data;
        });



}


this.retrieveDevFromID = function(id){
  
   URL = servicePath+String.format(apiConstant.retrieveRAMLDeviceTemplate,id);
        
       // console.log(URL)
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
          
            return response.data;
        });

}


  this.postRAMLDeviceTemplate = function(definitions,subdefinitions,keywords,devicename,description){
          var jsonFormData;
          
            URL = servicePath+String.format(apiConstant.newRAMLDeviceTemplate);
            
            jsonFormData={"definitions":definitions,"subdefinitions":subdefinitions,"keywords":keywords,"devicename":devicename,"description":description}
         //   console.log(jsonFormData);
          // alert("JSON"+JSON.stringify(jsonFormData))

            return $http({
          method:'POST',
          url:URL,
          data: jsonFormData,
          headers:{
            'Content-Type':'application/json'
          }
        }).then(function(response)
        {
           // console.log(response);
            return response.data;
        });

         };
 this.retrieveRAMLDevice = function(id){
	 URL = servicePath+String.format(apiConstant.deleteRAMLDefinitionTemplate,id);

          return $http({
            method: 'GET',
            url: URL,
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
            //console.log(response);
            return response.data;
        });
 };

 this.deleteRamlDevice = function(id){
         URL = servicePath+String.format(apiConstant.deleteRAMLDefinitionTemplate,id);

          return $http({
            method: 'DELETE',
            url: URL,
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
            //console.log(response);
            return response.data;
        });

    }



    // --------------------------------------END EVENTS AREA ---------------------------------------------
	this.RamlDeviceCreate = function(jsonFormData){
			var jsonFormData;
          
            URL = servicePath+apiConstant.newRAMLDeviceTemplate;
            jsonFormData=jsonFormData;
        
            return $http({
				  method:'POST',
				  url:URL,
				  data: jsonFormData,
				  headers:{
					'Content-Type':'application/json'
				  }
			}).then(function(response)
				{
				//	console.log(response);
					return response.data;
				});

    };
	this.RamlDeviceUpdate = function(jsonFormData,id){
			var jsonFormData;
          
            URL = servicePath+String.format(apiConstant.deleteRAMLDefinitionTemplate,id);
            jsonFormData=jsonFormData;
        
            return $http({
				  method:'PUT',
				  url:URL,
				  data: jsonFormData,
				  headers:{
					'Content-Type':'application/json'
				  }
			}).then(function(response)
				{
				//	console.log(response);
					return response.data;
				});

    };
	
this.retrieveRMLFromID = function(id){
  
   URL = servicePath+String.format(apiConstant.retrieveRAMLTemplate,id);
        
       // console.log(URL)
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
          
            return response.data;
        });

}
this.getMeshData = function(){
	 URL = servicePath+apiConstant.meshgroup;
        
       // console.log(URL)
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
          
            return response.data;
        });
}
 this.getMeshDetailById = function(mid){
    URL = servicePath+String.format(apiConstant.getGatewayFromMesh,mid)
     return $http({
            method:'GET',
            url:URL,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            return response.data;
        })
   }
this.setDeviceRaml = function(obj){
  
   URL = servicePath+String.format(apiConstant.setDeviceRaml);
        
       // console.log(URL)
         return $http({
            method: 'POST',
            data:obj,
            url: URL
        }).then(function (response) {
          
            return response.data;
        });

}
});