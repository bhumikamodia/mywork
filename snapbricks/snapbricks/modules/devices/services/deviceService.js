'use strict';

var deviceModule = angular.module('deviceModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
deviceModule.service('deviceModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant,$q) {
   var servicePath;              // Base path of API
   
	if(ENV.WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API
	var URL;
  // --------------------------------------START EVENTS AREA ---------------------------------------------
    // Function Name : getDeviceList
    
//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa

this.getPropertyLockId=function(deviceid)
{


 URL = servicePath+String.format(apiConstant.getPropertyLockId,deviceid);
// console.log(URL)
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
            
            return response.data;
        });



}
this.deviceDeregisterAll = function(gatewayid,appName,deviceStatus){
		var jsonFormData;
		URL = servicePath+apiConstant.deviceDeRegisterAll;
		
		jsonFormData = {"action": deviceStatus,"gwid": gatewayid};
		
		//console.log(jsonFormData);
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			params:{'appname':appName},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.status);
            return response;
        });
};
this.deviceDeactivationAll = function(gatewayid,appName,deviceStatus){
	
		var jsonFormData;
		URL = servicePath+apiConstant.deviceDeactivationAll;
		
		jsonFormData = {"action": deviceStatus,"gwid": gatewayid};
		
		
		//console.log(jsonFormData);
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			params:{'appname':appName},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.status);
            return response;
        });
}
this.postPropertyLockData=function(accessArray,deviceid,userid,orgid)
{
   //alert("aishanee"+deviceid)
        var jsonFormData;

        URL = servicePath+String.format(apiConstant.postPropertyLockData);
  

        jsonFormData={"access":accessArray,"deviceid" : deviceid,"userid":userid,"orgid":orgid}; 
    //   console.log("my request payload   ",JSON.stringify(jsonFormData));
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
        });

    };
//this is for Put device property lock data
this.updatePropertyLockData=function(accessArray,deviceid,propertyAccessid)
{
   //alert("aishanee"+deviceid)
        var jsonFormData;

        URL = servicePath+String.format(apiConstant.putPropertyLockData,propertyAccessid);
  

        jsonFormData={"access":accessArray,"deviceid" : deviceid}; 
     //  console.log("my request payload   ",JSON.stringify(jsonFormData));
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
        });

    };

//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA	
    this.getDeviceList = function (page,params) {
        var deferred = $q.defer();
			URL = servicePath+apiConstant.getDeviceList;
		
        if(page != "" && page != undefined)
		{
			URL = URL + "&page="+page;
		}
		
	//	$timeout(function() {
			 $http({
				method: 'GET',
				url: URL,
				params:params,
			}).then(function (response) {
				
				 deferred.resolve(response.data);
				 
			   
			});
		//	 }, 2000);
			return deferred.promise;

    };
    
    this.getDeviceProperties = function(id){
         URL = servicePath+String.format(apiConstant.getDeviceProperties,id);
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
        });


    }
   

    this.registerDeviceProperties = function(deviceid,gatewayid,appid,arr){
    	//console.log("Deviceid is:"+deviceid +" and gwid is: "+ gatewayid+" and appid is: "+ appid+ " and name is: "+ arr);
    	var jsonFormData;
    	URL = servicePath+apiConstant.registerDeviceProperties;
    	jsonFormData = {"deviceid":deviceid,"gwid":gatewayid,"appid":appid ,"action":"REGISTER_DEVICE_PROPERTIES","properties":arr,"mapping":{}};
       // console.log(jsonFormData);

        return $http({
        	method:'POST',
        	url:URL,
        	data: jsonFormData,
        	headers:{
        		'Content-Type':'application/json'
        	}
        }).then(function(response)
        {
            //console.log(response);
            return response;
        });

    };


this.refreshDeviceProperties = function(deviceid,gatewayid,appid,property_arr){
    	//console.log("Deviceid is: "+deviceid +" and gwid is: "+ gatewayid+" and appid is: "+ appid );
    	var jsonFormData;
    	URL = servicePath+apiConstant.refreshDeviceProperties;
    	jsonFormData = {"deviceid":deviceid,"gwid":gatewayid,"appid":appid ,"action":"GET_DEVICE_STATE","properties":property_arr,"subproperties":[]};
        //console.log("Request payload    ",JSON.stringify(jsonFormData));
        

        return $http({
        	method:'POST',
        	url:URL,
        	data: jsonFormData,
        	headers:{
        		'Content-Type':'application/json'
        	}
        }).then(function(response)
        {
            /*console.log("Api response",JSON.stringify(response));*/
            return response;
        });

    };

this.refreshDeviceSubProperties = function(deviceid,gatewayid,appid,arr){
      
        var jsonFormData;
        URL = servicePath+apiConstant.refreshDeviceProperties;
        jsonFormData = {"deviceid":deviceid,"gwid":gatewayid,"appid":appid ,"action":"GET_DEVICE_STATE","properties":[],"subproperties":arr.subproperties};
       

        return $http({
            method:'POST',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
         //   console.log(response);
            return response.data;
        }).catch(function(error){
                return error;
        
        })


    };


this.setDeviceSubProperties = function(deviceid,gatewayid,appid,arr){
    	//console.log("Deviceid is: "+deviceid +" and gwid is: "+ gatewayid+" and appid is: "+ appid+ " and name is: "+ arr);
    	var jsonFormData;
    	URL = servicePath+apiConstant.setDeviceProperties;
    	jsonFormData = {"deviceid":deviceid,"gwid":gatewayid,"appid":appid ,"action":"SET_DEVICE_STATE","properties":[],"subproperties":arr.subproperties};
        //jsonFormData = {"deviceid":deviceid,"gwid":gatewayid,"appid":appid ,"action":"SET_DEVICE_STATE","properties":arr,"subproperties":[]};
     //  console.log(jsonFormData);

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
            return response;
        }).catch(function(error){
        	  	return error;
        
        })


    };
	
this.setDeviceProperties = function(deviceid,gatewayid,appid,arr){
    	//console.log("Deviceid is: "+deviceid +" and gwid is: "+ gatewayid+" and appid is: "+ appid+ " and name is: "+ arr);
    	var jsonFormData;
    	URL = servicePath+apiConstant.setDeviceProperties;
    	jsonFormData = {"deviceid":deviceid,"gwid":gatewayid,"appid":appid ,"action":"SET_DEVICE_STATE","properties":arr,"subproperties":[]};
        //console.log(JSON.stringify(jsonFormData));

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
            return response;
        }).catch(function(error){
        	  	return error;
        
        })


    };
this.getVendorModelIDForModbus = function(Object,fields){
	URL = servicePath+String.format(apiConstant.getAllGatewayManager,Object);
	
	 return $http({
            method: 'GET',
            url: URL,
			params: fields,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response.data;
        });
};
this.getDiscoverMODBUSGateway = function(gatewayId,appName,protocol,modbusObj,meshID){
		
		URL = servicePath+apiConstant.getGatewayDiscover;
		var jsonStartStream;
		if(modbusObj.rdoSlave == 1){
		jsonStartStream = {"gwid": gatewayId,"action":"DISCOVER","protocol":protocol,"appid":appName,"meshID":meshID,"mode":modbusObj.rdoConnectionMode,"range":modbusObj.slaveRange+"-"+modbusObj.slaveRange2};	
		}else{
		jsonStartStream = {"gwid": gatewayId,"action":"DISCOVER","protocol":protocol,"appid":appName,"meshID":meshID,"mode":modbusObj.rdoConnectionMode,"range":modbusObj.slaveID};
		}
        
      
		//console.log(jsonStartStream);
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
            return response;
        });
	};
	
this.getRequestJobList = function(jobId){
  

        URL = servicePath+String.format(apiConstant.getJobList,jobId);
        
        
        return $http({
            method:'GET',
            url:URL,
          
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
          //  console.log(JSON.stringify(response));
            return response.data;
        }).catch(function(error){
                return error;
        
        })


    };

this.addDeviceGroups = function(grpname,grpdesc,arr1,gwid){
      //  console.log("Deviceid is: "+grpname +" and gwid is: "+ grpdesc+" and array is: "+ arr1+" and gwid is: "+ gwid);
        var jsonFormData;
        URL = servicePath+apiConstant.addDeviceGroups;
        jsonFormData = {"name":grpname,"description":grpdesc,"deviceids":arr1,"gwid":gwid};
       // console.log(jsonFormData);

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
               // console.log(error);
                return error;
        
        })


    };

   this.editDeviceGroup = function(grpname,grpdesc,arr1,gwid,devGrpId){
    
      var jsonFormData;
        jsonFormData = {"name":grpname,"description":grpdesc,"deviceids":arr1,"gwid":gwid};
       // console.log(JSON.stringify(jsonFormData) + "and deviceid is" + devGrpId);

    URL = servicePath+String.format(apiConstant.putdeleteDeviceGroups,devGrpId);
     


     return $http({
            method: 'PUT',
            url: URL,
            data:jsonFormData,
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
           // console.log(response);
            return response.data;
        }).catch(function(error){
                //console.log(error);
                return error;
        
        })

   };


  this.getDeviceGroups = function(page,params){
    
      // console.log(params)
       URL = servicePath+String.format(apiConstant.addDeviceGroups,params,page);
        //URL = servicePath+apiConstant.addDeviceGroups;

         if(page != "" && page != undefined)
        {
            URL = URL +"?gwid="+params.gwid+ "&page="+page;
        }  

         return $http({
            method: 'GET',
            url: URL,
           
        }).then(function (response) {
            //console.log(response.data)
            return response.data;
        });
    };

  
    this.deleteGroupRequests = function(devGrpId){
         URL = servicePath+String.format(apiConstant.putdeleteDeviceGroups,devGrpId);

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




	this.deviceDeregisterDataForm = function(gwid,formData,deviceStatus){
		
		var jsonFormData;
		URL = servicePath+apiConstant.postOPCDataForm;
		
		if(deviceStatus =="deregister"){
			if(formData[0].protocol && formData[0].protocol == "OPC"){
			jsonFormData = {"action": "DEREGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"address":formData[0].address,"devices":formData};
			}else{
				jsonFormData = {"action": "DEREGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"devices":formData};
			}
		}
		if(deviceStatus =="register"){
			if(formData[0].protocol && formData[0].protocol == "OPC"){
				jsonFormData = {"action": "REGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"address":formData[0].address,"devices":formData};
			} else {
				jsonFormData = {"action": "REGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"devices":formData};
			}
			
		}
		//console.log(jsonFormData);
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
		//	console.log(response);
            return response;
        });
		
	};
	this.getAllDeviceManager = function(){
		URL = servicePath+apiConstant.getAllDeviceManager;
		 return $http({
            method: 'GET',
            url: URL,
			//params:params,
        }).then(function (response) {
			
            return response.data;
        });
	};
	this.deviceDeactivationDataForm = function(gwid,formData,deviceStatus){
		
		var jsonFormData;
		URL = servicePath+apiConstant.postOPCActivationDataForm;
		if(deviceStatus =="deactivate")
		{
			
			if(formData[0].protocol && formData[0].protocol == "OPC"){
				jsonFormData = {"action": "DEACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid,"address":formData[0].address};
			}else{
				jsonFormData = {"action": "DEACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid};
			}
			
		}
		if(deviceStatus =="activate")
		{
			if(formData[0].protocol && formData[0].protocol == "OPC"){
				jsonFormData = {"action": "ACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid,"address":formData[0].address};
			}else{
				jsonFormData = {"action": "ACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid};
			}
		} 
		
		//console.log(jsonFormData);
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.status);
            return response;
        });
	};
	
	// Function Name : getProperty
  // Description 	 : Get Device Property
	this.getPropertyOld = function(){
		URL = servicePath+apiConstant.getProperties;
      
		return $http({
            method: 'GET',
            url: URL,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
		//	console.log(response.data);
            return response.data;
			
        }).catch(function(error){
			return error;
		});
	}
	
    this.getProperty = function (deviceId) {
		
     
          //  URL = 'commons/json/custom.json';
       // else
			URL = servicePath+String.format(apiConstant.getDeviceProperties,deviceId);
      
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


	this.getPropertyConstrain = function(deviceid,defName)
	{
		URL = servicePath+String.format(apiConstant.getPropertyConstrain,deviceid,defName);
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
	}
	this.getSubproperties = function(deviceId)
	{
		 // URL = 'commons/json/modified_device_config.json';
       // else
			URL = servicePath+String.format(apiConstant.getSubProperties,deviceId);
		return $http({
            method: 'GET',
            url: URL,
			 headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			console.log(response.data);
            return response.data;
			
        });
	}

    this.getShadowValue = function(deviceId)
    {
      
        URL = servicePath+String.format(apiConstant.getShadowvalue,deviceId);

        return $http({
            method: 'GET',
            url: URL,
             headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
           // console.log(response.data);
            return response.data;
            
        });
	}
	
//************Action Profiles Get,Put,Post, Delete*******************


    this.getActionProfile = function(page,paramgrpid,paramgwid) {
        //.log("I am params"+paramgrpid+" .. "+paramgwid)
     URL = servicePath+apiConstant.actionProfiles;
      if(page != "" && page != undefined)
        {
            URL = URL + "?page="+page+"&devicegroupid="+paramgrpid;
        } 
        return $http({
            method: 'GET',
            url: URL,

        }).then(function (response) {
        //  console.log(response.data);
            return response.data;
            
        });
        
        
    };
  



   this.postActionProfiles = function(deviceGrpId,appid,profname,profdesc,property_arr,orgid,processby){
        //console.log("Deviceid is: "+deviceid +" and gwid is: "+ gatewayid+" and appid is: "+ appid+ " " );
        var jsonFormData;


        URL = servicePath+apiConstant.actionProfiles;
        jsonFormData = {"devicegroupid":deviceGrpId,"appid":'scheduler',"name":profname,"description":profdesc,"processedby":processby,"actions":property_arr};  //name,description,action
       //   console.log("essssssssssssssssss",JSON.stringify(jsonFormData));

        return $http({
            method:'POST',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
         //   console.log(response);
            return response.data;
        }).catch(function(error){
			
			return error;
		});

    };



   this.putActionProfiles = function(profileInfoId,deviceGrpId,appid,profname,profdesc,property_arr,processby){
         //console.log("I ammm "+profileInfoId)
        //console.log("Deviceid is: "+deviceid +" and gwid is: "+ gatewayid+" and appid is: "+ appid+ " ");
        
        var jsonFormData;


        URL = servicePath+String.format(apiConstant.putdeleteActProf,profileInfoId);
       // jsonFormData = {"devicegroupid":deviceGrpId,"appid":'scheduler',"gwid":gatewayId,"name":profname,"description":profdesc,"actions":property_arr};  //name,description,action
        jsonFormData = {"devicegroupid":deviceGrpId,"appid":'scheduler',"name":profname,"description":profdesc,"actions":property_arr,"processedby":processby};  //name,description,action
       // console.log("json is",JSON.stringify(jsonFormData))

        return $http({
            method:'PUT',
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           // console.log(response);
            return response.data;
        }).catch(function(error){
			
			return error;
		});

    };



   

       this.deleteActionProfile = function(profileId){
     //   console.log("I am profile"+profileId)
        var jsonData; 
      //  jsonData = {"ch":ch}
         URL = servicePath+String.format(apiConstant.putdeleteActProf,profileId);
         jsonData = {"devicegroupactionid":profileId}
       //  console.log("I am URL"+URL)
          return $http({
            method: 'DELETE',
            url: URL,
            data:jsonData,  
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
         //   console.log(response);
            return response.data;
        });

    }



//**************************getDeviceScheduleInfo*****************************************



  this.getDevSchlInfo = function(page,deviceId){
      
    var jsonData;

     URL = servicePath+String.format(apiConstant.getDeviceScheduleInfo);

 if(page != "" && page != undefined)
        {
            URL = URL + "?page="+page;

        } 

        jsonData = {"deviceid":deviceId};  //name,description,action


        return $http({
            method:'POST',
            url:URL,
            data:jsonData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            //console.log("Resp: "+ JSON.stringify(response.data));
            return response.data;
        });

    };



     
     this.getDevPropertySchl = function(page,deviceId,property){
      
    var jsonData;

     URL = servicePath+String.format(apiConstant.getDevicePropertyScheduleInfo);
	
 if(page != "" && page != undefined)
        {
            URL = URL + "?page="+page;

        } 

        jsonData = {"deviceid":deviceId,"property":property};  

        return $http({
            method:'POST',
            url:URL,
            data:jsonData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           //console.log("Resp: "+ JSON.stringify(response));
            return response.data;
        });

    };

	


     this.postDeviceScheduledInfo = function(definitionName,protocol,scheduledat,propertiesObj,frequency,appid,gwid,deviceid,orgid,dow,processby){
     var jsonData;
    // console.log("in service",propertiesObj)
     URL = servicePath+String.format(apiConstant.postDeviceScheduledInfo);
        if(frequency=='weekly'){
        jsonData = {"protocol":protocol,"scheduledat":scheduledat,"properties":propertiesObj,"frequency":frequency,"appid":appid,"gwid":gwid,"deviceid":deviceid,"orgid":orgid,"definitionname":definitionName,"dow":dow,"processedby":processby};  
      }
      else{
        jsonData = {"protocol":protocol,"scheduledat":scheduledat,"properties":propertiesObj,"frequency":frequency,"appid":appid,"gwid":gwid,"deviceid":deviceid,"orgid":orgid,"definitionname":definitionName,"processedby":processby};  
      }
  //    console.log("I am jsonData"+ JSON.stringify(jsonData))

        return $http({
            method:'POST',
            url:URL,
            data:jsonData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
          //  console.log("Resp: "+ JSON.stringify(response));
            return response.data;
        }).catch(function(error){
			return error;
		});

         }
         this.getGatewaySchedulerData = function(meshid,appName,network){
            URL = servicePath+String.format(apiConstant.getGatewayListSchdulerApp,meshid,appName,network);
          //  console.log("url is",URL);

            return $http({
            method: 'GET',
            url: URL,
            headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
            //console.log(response);
            return response;
        }).catch(function(error){
            return error;
        });
         }
	


    this.putDeviceScheduledInfo = function(actionid,protocol,scheduledat,frequency,appid,gwid,deviceid,orgid,propArr,definitionname,dow,pby){
     var jsonData;
		//alert(pby)
     URL = servicePath+String.format(apiConstant.putDeviceScheduledInfo,actionid);
        if(frequency=='weekly'){
jsonData = {"definitionname":definitionname,"protocol":protocol,"scheduledat":scheduledat,"frequency":frequency,"appid":appid,"gwid":gwid,"deviceid":deviceid,"orgid":orgid,"properties":propArr,"dow":dow,"processedby":pby};  
        }else{
        jsonData = {"definitionname":definitionname,"protocol":protocol,"scheduledat":scheduledat,"frequency":frequency,"appid":appid,"gwid":gwid,"deviceid":deviceid,"orgid":orgid,"properties":propArr,"processedby":pby};  
      }
      //  alert("I am jsonData"+ JSON.stringify(jsonData))
		//console.log("I am jsonData"+ JSON.stringify(jsonData))
        return $http({
            method:'PUT',
            url:URL,
            data:jsonData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           // console.log("Resp: "+ JSON.stringify(response));
            return response.data;
        });

         }


      this.deleteDeviceScheduledInfo = function(actionid,gatewayid,deviceid){
     var jsonData;

     URL = servicePath+String.format(apiConstant.putDeviceScheduledInfo,actionid);
    
     jsonData = {"gwid" : gatewayid,"deviceid":deviceid}
       // console.log("from dlt",jsonData)
        return $http({
            method:'DELETE',
            url:URL,
            data:jsonData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           // console.log("Resp: "+ JSON.stringify(response));
            return response.data;
        });

         }
  
this.getGatewayRequestManagers = function(gatewayId,deviceId,unit,time,pageno){
		
		URL = servicePath+String.format(apiConstant.getDeviceRequestManagers,gatewayId,deviceId,unit,time);
		
		if(pageno != "")
		{
			URL = URL + "&page="+pageno;
		}
		
		//developed By Sanny Soni 
        return $http({
            method: 'GET',
            url: URL,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response.data;
        }).catch(function(error){
			return error;
		});
		
	};
	this.getEventsList = function(gatewayId,deviceId,page){
		URL = servicePath+String.format(apiConstant.getDeviceEventsList,gatewayId,deviceId);
      
		
		if(page != "")
		{
			URL = URL + "&page="+page;
		}
		return $http({
            method: 'GET',
            url: URL,
		//	params:params,
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
	this.postLiveData = function(dataString2){
		URL = servicePath+apiConstant.postLiveData;
		
		//developed By Sanny Soni 
        return $http({
            method: 'POST',
            url: URL,
			data: dataString2,
			
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
		//	console.log('asd',response);
            return response.data;
			
        });
	};
	this.setVendorModelDeviceinfo = function(vendor,modelid,deviceid,appid){
		
		URL=servicePath+String.format(apiConstant.setXMLLookup,appid,deviceid,vendor,modelid);
		var dataString2 = {"vendor":vendor,"modelid":modelid,"deviceid":deviceid,"appid":appid};
     // console.log("My Url",JSON.stringify(URL))
        return $http({
            method: 'POST',
            url: URL,
			//data: dataString2,
             headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
            
             return response;
            
		});
	};

//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    this.getshadowValue=function(deviceId)
{
       //alert("mydev"+deviceId)
       /* URL = 'commons/json/shadow.json';*/
       URL=servicePath+String.format(apiConstant.getShdaowData,deviceId);
     // console.log("My Url",JSON.stringify(URL))
        return $http({
            method: 'GET',
            url: URL,
             headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
            
             return response.data;
            
 });

};

  this.getDeviceRAML=function(deviceId)
{
       
       URL=servicePath+String.format(apiConstant.getDeviceRAML,deviceId);
    
        return $http({
            method: 'GET',
            url: URL,
             headers: {
                'Content-Type':'application/json'   
             }
        }).then(function (response) {
            
             return response.data;
            
 });

};
this.GetAllRAMLDevice = function(object,appName){
	URL = servicePath+String.format(apiConstant.getAllRAMLDevice,appName);
	
	 return $http({
            method: 'POST',
            url: URL,
			data:object,
        }).then(function (response) {
            
            return response.data;
        });
}
this.GetRAMLDevice = function(object,deviceMethod){
	

	URL = servicePath+apiConstant.getRAMLDevice;
	
	
	
	 //console.log(URL)
         return $http({
            method: 'POST',
            url: URL,
			data:object,
        }).then(function (response) {
            
            return response.data;
        });
};

this.getRAMLDeviceTemplate=function()
    {
        URL = servicePath+String.format(apiConstant.newRAMLDeviceTemplate);
       
        //console.log(URL)
         return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
            
            return response.data;
        });



}
this.getActivePropList=function(did){
	
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
//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    // --------------------------------------END EVENTS AREA ---------------------------------------------
	
});