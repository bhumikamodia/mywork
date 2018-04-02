'use strict';

var ruleEngineModule = angular.module('ruleEngineModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
ruleEngineModule.service('ruleengineModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
   var servicePath;              // Base path of API
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
	 
    this.getRuleEngineList = function (page,mode,id) {


        URL = servicePath+apiConstant.getRuleEngineList;
		
		if(page != "")
		{
			URL = URL + "?page="+page;
		}
        if(mode!=undefined && id!=undefined){

            if(URL.indexOf('?page')!=-1){
                if(mode=='Mesh'){
                URL = URL +"&mode="+mode+"&meshid="+id;
            }else if(mode=='Standalone'){
                 URL = URL +"&mode="+mode+"&processedby="+id;
            }
            }else{
                if(mode=='Mesh'){
                 URL = URL +"?mode="+mode+"&meshid="+id 
                }else if(mode=='Standalone'){
                    URL = URL +"&mode="+mode+"&processedby="+id
                }
                
            }
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
	
	this.addRules = function(jsonFormData){
       // console.log("Deviceid is test data");
		
        var jsonFormData;
        URL = servicePath+apiConstant.getRuleEngineList;
        jsonFormData = jsonFormData;
	    return $http({
            method:'POST',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            return response.data;
        }).catch(function(error){
              //  console.log(error);
                return error;
        
        })
		

    };
	this.mainRulesedit = function(jsonFormData,ruleId){
        //console.log("Deviceid is test data");
		
        var jsonFormData;
        URL = servicePath+String.format(apiConstant.mainRulesedit,ruleId);
        jsonFormData = jsonFormData;
	    return $http({
            method:'PUT',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            return response.data;
        }).catch(function(error){
              //  console.log(error);
                return error;
        
        })
		

    };
	this.subRulesedit = function(jsonFormData,ruleId,gwid,appid){
       // console.log("Deviceid is test data");
		
        var jsonFormData;
        URL = servicePath+String.format(apiConstant.subRulesedit,ruleId,gwid,appid);
		jsonFormData = jsonFormData;
	    return $http({
            method:'PUT',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            return response.data;
        }).catch(function(error){
             //   console.log(error);
                return error;
        
        })
		

    };
	this.subRulesAdd = function(jsonFormData,gwid,appid){
       // console.log("Deviceid is test data");
		
        var jsonFormData;
        URL = servicePath+String.format(apiConstant.subRulesAdd,gwid,appid);
		jsonFormData = jsonFormData;
	    return $http({
            method:'POST',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
			return response.data;
        }).catch(function(error){
              //  console.log(error);
                return error;
        
        })
		

    };
	this.deleteRules = function(id,jsonFormData){
        
		
        URL = servicePath+String.format(apiConstant.mainRulesedit,id);
		  return $http({
            method: 'DELETE',
            url: URL,
			 data: jsonFormData,
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
          //  console.log(response);
            return response.data;
        });

    };
	this.deleteSubRules = function(sub_rule_id,app_id,gwid,ch,jsonFormData){
        
	    URL = servicePath+String.format(apiConstant.subRulesedit,sub_rule_id,gwid,app_id);
          return $http({
            method: 'DELETE',
            url: URL,
			data: jsonFormData,
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
          //  console.log(response);
            return response.data;
        });

    };
	
	this.getdata = function(ruleId){
        var jsonFormData;
        URL = servicePath+String.format(apiConstant.mainRulesedit,ruleId);
        jsonFormData = jsonFormData;
	    return $http({
            method:'GET',
            url:URL,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
			return response.data;
        }).catch(function(error){
             //   console.log(error);
                return error;
        
        })
		

    };
	this.getDevicelist = function(jsonFormData){
        var jsonFormData;
        URL = servicePath+'api/deviceproperty/devicepropertylist/';
        jsonFormData = jsonFormData;
	    return $http({
            method:'POST',
            url:URL,
			data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            return response.data;
        }).catch(function(error){
                //console.log(error);
                return error;
        
        })
		

    };
	this.getMeshlist = function(jsonFormData,parameter){
        var jsonFormData;
        URL = servicePath+apiConstant.meshgroup;
        jsonFormData = jsonFormData;
	    return $http({
            method:'GET',
            url:URL,
			data: jsonFormData,
			headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {      return response.data;
        }).catch(function(error){
            //    console.log(error);
                return error;
        
        })
    };
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
	this.getProcessbylist = function(meshid,networkid,appname,mode){
        URL = servicePath+apiConstant.ruleEngineGatewayList;
			//meshid={0}&appname={1}&network={2}&mode={3}
			var params3;
			if(meshid !== '' && networkid !== ''){
				 params3 = {"meshid":meshid,"appname":appname,"network":networkid,"mode":mode};
			}else{
				 params3 = {"appname":appname,"mode":mode};
			}
			
        return $http({
            method:'GET',
            url:URL,
			params:params3,
			headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {      return response.data;
        }).catch(function(error){
               // console.log(error);
                return error;
        
        });
    };
this.getActivePropList=function(did)
    {
        URL = servicePath+String.format(apiConstant.getactiveProperties);
       
        //console.log(URL)
         return $http({
            method: 'POST',
            url: URL,
            data:did
        }).then(function (response) {
            
            return response.data;
        });



}
	this.getGatewayFromId = function(id){
		   URL = servicePath+String.format(apiConstant.gatewayDescription,id)
		
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
     this.getStandaloneGateway = function(){
    URL = servicePath+String.format(apiConstant.gatewayAll)
    URL = URL + "&mode=Standalone"
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
    // --------------------------------------END RULE ENGINE AREA ---------------------------------------------
	
});