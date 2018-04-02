'use strict';

var lookupModule = angular.module('lookupModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
lookupModule.service('lookupModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
    var servicePath;
     var WSO2Mode = ENV.WSO2Mode;
    if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API
 
   var apiMode = ENV.apiMode;              // Base path of API
   var URL;
  // --------------------------------------START RULE ENGINE AREA ---------------------------------------------
  // Function Name : getRuleEngineList
  // Description 	 : Get All Rule Engine List
	 
	this.addModbusData = function(formdata){
		var jsonFormData;
        URL = servicePath+apiConstant.setXML;
        jsonFormData = {"vendor":formdata.vendor,"modelid":formdata.modelid,"protocol":formdata.protocol,"xml":formdata.xmlData,"orgid":formdata.orgid};
        

        return $http({
            method:'POST',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
          //  console.log(response);
            return response.data;
        }).catch(function(error){
                //console.log(error);
                return error;
        
        });
	};
	this.submitModbusData = function(formdata){
       
		
        var jsonFormData;
        URL = servicePath+String.format(apiConstant.setXMLPARAM,formdata.modelid);
        jsonFormData = {"vendor":formdata.vendor,"modelid":formdata.modelid,"protocol":formdata.protocol,"xml":formdata.xmlData,"orgid":formdata.orgid};
        

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
        }).catch(function(error){
               // console.log(error);
                return error;
        
        })
		

    };
    
    // --------------------------------------END RULE ENGINE AREA ---------------------------------------------
	
});