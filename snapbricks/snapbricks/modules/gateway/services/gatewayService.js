'use strict';

var gatewayModule = angular.module('gatewayModule.services', []);


//	Service Name : Gateway which includes all functions based on its module.
gatewayModule.service('gatewayModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,$filter, apiConstant) {
   var servicePath;
   
   var WSO2Mode = ENV.WSO2Mode;
	if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of GSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API

   var URL;
  // --------------------------------------START GATEWAY AREA ---------------------------------------------
    // Function Name : getGatewayList
    
    // Description 	 : Get All Gateway List
    this.getGatewayList = function (page,params) {
		
       
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

    this.getGatewayDescription = function (gwid) {
		
       
		URL = servicePath+String.format(apiConstant.gatewayDescription,gwid);
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

    this.getGatewayTaskDetails = function (gwid) {
		
       
		URL = servicePath+String.format(apiConstant.gatewayTasks,gwid);
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
		
		
    }
    this.getGatewayPackageDetails = function (gwid) {
		
       
		URL = servicePath+String.format(apiConstant.gatewayPackages,gwid);
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
		
		
    }
	this.getEventsList = function(gatewayId,page){
		URL = servicePath+String.format(apiConstant.getEventsList,gatewayId);
      
		
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
	//	Get Gateway Details from Gateway ID
	this.getGatewayDetails = function(gatewayId,params){
		//if(apiMode == 'Demo')
		URL = servicePath+String.format(apiConstant.getGatewayDetails, gatewayId);
       // else
		//	URL = servicePath+'api/gateway/?format=json';
       
		
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
	//	Get Sensor Display List of discover Calls
	this.getGatewayDiscover = function(){
		//if(apiMode == 'Demo')
            URL = 'commons/json/discoverGateway.json';
       // else
		//	URL = servicePath+'api/gateway/?format=json';
       
		
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
	
	//	Get GatewayInfo From Id
	this.getGatewayDetailFromId = function(gatewayId){
		
		
		URL = 'commons/json/gatewayGetDataInRegisterActivation.json';
               
        return $http({
            method: 'GET',
            url: URL
        }).then(function (response) {
			var object_by_id = $filter('filter')(response.data.gatewaysData, {gatewayid: gatewayId })[0];
			//console.log(object_by_id);
			
            return object_by_id;
        });
		
	};
	
	this.getNameIDFromAllGateway = function(){
		
		
			URL = servicePath+apiConstant.getGatewayNameANDIDOnly;
		
		               
        return $http({
            method: 'GET',
            url: URL,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        }).catch(function(error){
			//console.log(error);
			return error;
		});
		
	};
	this.getRegisteredUsersGateway = function(orgid){
		
		URL = servicePath+apiConstant.getRegisteredUsersGateway;
		
		               
        return $http({
            method: 'GET',
            url: URL,
			params: {"fields":"id,username","orgid":orgid,"is_deleted":false},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.getAllGatewayManager = function(object,parameters){
		URL = servicePath+String.format(apiConstant.getAllGatewayManager, object);
		
		               
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

	this.getMeshByGwid = function(meshid){

		URL = servicePath+String.format(apiConstant.editMesh, meshid);
		return $http({
            method: 'GET',
            url: URL,
            
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log("aaaaaa  ",response.status);
            return response.data;
        });
	}
	this.updateMeshDetails = function(gwid,mid,network){
		var jsonData;
		URL = servicePath+String.format(apiConstant.putMeshDetailsinGateway, gwid);
		jsonData = {"meshID":mid,"meshNetwork":network}
		 return $http({
            method: 'PUT',
            url: URL,
            data: jsonData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log("aaaaaa  ",response.status);
            return response.data;
        });
	}
	
	this.setActivateANDDeactivatePostForm = function(gatewayId,action){
	
	  
		URL = servicePath+apiConstant.setActivateANDDeactivatePostForm;
		var jsonStartStream;
		if(action == "ACTIVATE")
		{
			jsonStartStream = {"gwid": gatewayId,"action":"ACTIVATE"};
		}else{
			jsonStartStream = {"gwid": gatewayId,"action":"DEACTIVATE"};
		}
        
       

        //changed By Sanny Soni 
        return $http({
            method: 'POST',
            url: URL,
            data: jsonStartStream,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
		//	console.log("aaaaaa  ",response.status);
            return response.data;
        });;
	};
	
	this.getMeshList = function(page,params){
   	URL = servicePath+apiConstant.getmeshList;
  // 	console.log("url is",URL)
   	if(page != "" && page != undefined)
		{
			URL = URL + "?page="+page;
		} 
		return $http({
            method: 'GET',
            url: URL,
			params:params,
        }).then(function (response) {
		//	console.log(JSON.stringify(response))
            return response.data;
        });
   } 
	this.setRegisterPostForm = function(gatewayId,userData){
	
		//console.log(userData);
		
		URL = servicePath+String.format(apiConstant.setRegisterPostForm, gatewayId);
		
        var jsonStartStream = {"id": gatewayId,"gatewaymanager":userData.id,"gatewaymanager_username":userData.username,"action":"REGISTER_GATEWAY"};
        var dataForm = "&action=REGISTER_GATEWAY&gatewaymanager="+userData.id+"&id="+gatewayId+"&gatewaymanager_username="+userData.username;
		//console.log(jsonStartStream);
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
	};
	this.setDeregisterPostForm = function(gatewayId){
		//alert(gatewayId+"=="+Fullname);
		URL = servicePath+String.format(apiConstant.setDeregisterPostForm, gatewayId);
		
        var jsonStartStream = {"id": gatewayId,"action":"DEREGISTER_GATEWAY"};
        var dataForm = "action=DEREGISTER_GATEWAY&id="+gatewayId;
		//console.log(jsonStartStream);
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
		
	};
	this.getGatewayGroupsDetails = function(gatewayId){
		
		URL = servicePath+String.format(apiConstant.getGatewayGroupsDetails, gatewayId);
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
        });
		
	};
	this.getOPCGatewayDiscover = function(gatewayId,urldata,appName,protocol,meshID){
		
		URL = servicePath+apiConstant.getGatewayDiscover;
	    var jsonStartStream = {"gwid": gatewayId,"action":"DISCOVER","protocol":protocol,"appid":appName,"address":urldata,"meshID":meshID};
      
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
	this.getZigbeeGatewayDiscover = function(gatewayId,appName,protocol,meshID){
		
		URL = servicePath+apiConstant.getGatewayDiscover;
		
        var jsonStartStream = {"gwid": gatewayId,"action":"DISCOVER","protocol":protocol,"appid":appName,"meshID":meshID};
      
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
	this.getDiscoverGateway = function(gatewayId,appName,protocol,meshID){
		
		URL = servicePath+apiConstant.getGatewayDiscover;
		
        var jsonStartStream = {"gwid": gatewayId,"action":"DISCOVER","protocol":protocol,"appid":appName,"meshID":meshID};
      
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
	this.postOPCActivationDataForm = function(gwid,formData,period){
		URL = servicePath+apiConstant.postOPCActivationDataForm;
		var jsonFormData;
		if(period == "ACTIVATE"){
			if(formData[0].protocol && formData[0].protocol == "OPC"){
				jsonFormData = {"action": "ACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid,"address":formData[0].address};
			}else{
				jsonFormData = {"action": "ACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid};
			}
			
		}else{
			if(formData[0].protocol && formData[0].protocol == "OPC"){
				jsonFormData = {"action": "DEACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid,"address":formData[0].address};
			}else{
				jsonFormData = {"action": "DEACTIVATE","gwid": gwid,"deviceId":formData[0].id,"protocol":formData[0].protocol,"appid":formData[0].appid};
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
			//console.log(response);
            return response;
        });
	};
	
	this.postOPCDataForm = function(gwid,formData,period){
		
		URL = servicePath+apiConstant.postOPCDataForm;
		
		var jsonFormData; 
		if(period == "REGISTER"){
			//console.log(formData[0].protocol);
		if(formData[0].protocol && formData[0].protocol == "OPC"){
			jsonFormData = {"action": "REGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"address":formData[0].address,"devices":formData};
		} else {
			jsonFormData = {"action": "REGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"devices":formData};
		}
		
			
		}else{
			if(formData[0].protocol && formData[0].protocol == "OPC"){
			jsonFormData = {"action": "DEREGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"address":formData[0].address,"devices":formData};
			}else{
				jsonFormData = {"action": "DEREGISTER","gwid": gwid,"appid":formData[0].appid,"protocol":formData[0].protocol,"devices":formData};
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
			//console.log(response);
            return response;
        });
		
	};
	this.postLiveData = function(dataString2){
		URL = servicePath+apiConstant.postLiveData;
		//developed By Sanny Soni 
        return $http({
            method: 'POST',
            url: URL,
			data: dataString2
			
		
        }).then(function (response) {
			//console.log(response);
            return response.data;
			
        });
	};
	this.getJobList = function(jobId){
		
		URL = servicePath+String.format(apiConstant.getJobList, jobId);
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
        });
	};
	this.getActivation = function(gatewayId){
		
		URL = servicePath+String.format(apiConstant.getActivation, gatewayId);
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
        });
	};
	this.getDeviceData = function(gatewayId){
		
		URL = servicePath+String.format(apiConstant.getDeviceData, gatewayId);
		
		//URL = URL + "&items=40";
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
        });
	};
	this.getDeviceList = function(gatewayId,page,protocol){
		
		
		URL = servicePath+String.format(apiConstant.getDeviceData, gatewayId);
		
		if(page != "" && page != undefined)
		{
			URL = URL + "&page="+page;
		}
		if(protocol != "" && protocol != undefined)
		{
			URL = URL + "&protocol="+protocol;
		}
		//URL = URL + "&items=40";
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
        });
	};
	this.getGatewayRequestManagers = function(gatewayId,pageno){
		
		URL = servicePath+String.format(apiConstant.getGatewayRequestManagers,gatewayId);
		
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
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
	this.getGatewayConfiguration = function(gatewayId){
		
		URL = servicePath+String.format(apiConstant.getGatewayConfiguration, gatewayId);
		//developed By Sanny Soni 
		
        return $http({
            method: 'GET',
            url: URL,
			
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(JSON.stringify(response));
            return response.data;
        });
		
	};

	this.updateLocalAndroidAccess=function(url,port,uniqueId,gwid,value,username,pass)
	{
		URL = servicePath+apiConstant.updateLocalAndroidAccess;

		var jsonFormData = {"url":url,"port":port,"android_uniqueid":uniqueId,"gwid":gwid,"is_active":value,"username":username,"password":pass,"action":"REGISTER_ANDROID_DEVICE"};
       
        
        return $http({
            method: 'POST',
            url: URL,
			data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			
            return response;
        });



	};
	this.rebootData = function(ID,action){
		URL = servicePath+apiConstant.rebootData;
		//developed By Sanny Soni 
		var jsonFormData = {"action": action,"gwid": ID};
        return $http({
            method: 'POST',
            url: URL,
			data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response;
        });
	};
	this.assignedGroupsGateway = function(ID,gatewayInfo,assignedGroups){
		
		URL = servicePath+String.format(apiConstant.getGatewayDetails, ID);
		//developed By Sanny Soni 
		var jsonFormData = {"orgid":gatewayInfo.orgid,"clientid":gatewayInfo.clientid,"gatewaymanager_username":gatewayInfo.gatewaymanager_username,"displayname":gatewayInfo.displayname,"is_active":gatewayInfo.is_active,"clientname":gatewayInfo.clientname,"gatewaymanager":gatewayInfo.gatewaymanager,"timezone":gatewayInfo.timezone,"groups": assignedGroups};
        return $http({
            method: 'PUT',
            url: URL,
			data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response.data;
        });
	};
	this.getTaskDetails = function(gatewayId){
		URL = servicePath+String.format(apiConstant.getTaskDetails, gatewayId);
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
	this.PackageRefresh = function(gwid,action,arr){
		
		var jsonFormData;
		if(action == "GET_PACKAGE"){
		URL = servicePath+apiConstant.PackageRefresh;	
		jsonFormData = {"action": action,"gwid": gwid};
		}
		if(action == "UNINSTALL_PACKAGE"){
		URL = servicePath+apiConstant.PackageUninstall;	
		jsonFormData = {"action": action,"gwid": gwid,"packageIds":arr};
		}
		
		
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response;
        });
	};
	
	this.getApps = function(gatewayId,gateway,pageno){
	//	console.log(gateway);
		URL = servicePath+apiConstant.getApps;
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		
		var paramsData = {"gwid":gatewayId,"arch":gateway.gatewaymeta.architecture};
		return $http({
            method: 'GET',
            url: URL,
			params:paramsData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
        });
	};
	this.PackageUpdateCall = function(gwid,action,newPackageId,oldPackageId){
		var jsonFormData;
		URL = servicePath+apiConstant.PackageUpdate;
		var combineoldnew = {"old":oldPackageId, "new":newPackageId};
		jsonFormData = {"action": action,"gwid": gwid,"packageIds": [combineoldnew]};
		
		
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response;
        });
	};
	this.PackageInstallCall = function(gwid,action,packageInstallId){
		var jsonFormData;
		URL = servicePath+apiConstant.PackageInstall;
		
		jsonFormData = {"action": action,"gwid": gwid,"packageIds": [packageInstallId]};
		
		
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
		//	console.log("response is  ",JSON.stringify(response));
            return response;
        });
	};
	
	this.PostTaskForm = function(gwid,formData,Status,duplicateappName,protocol){
		
		var jsonFormData;
		if(Status == "DUPLICATE_APP"){
			URL = servicePath+apiConstant.DuplicateApp;
		}else{
			URL = servicePath+apiConstant.PostTaskForm;
		}
		
		//console.log("FormData:::");
		
		//console.log(formData);
		if(formData != null)
		{
			if(Status =="KILL_APP")
			{
				jsonFormData = {"action": Status,"gwid": gwid,"appName":formData.AppName,"packageId":formData.packageId,"PID":""+formData.PID+""};
			}
			else if(Status == "DUPLICATE_APP"){
				jsonFormData = {"action": Status,"gwid": gwid,"appName":formData.AppName,"packageId":formData.packageId,"pid":""+formData.PID+"","duplicateAppName":duplicateappName,'protocol':protocol};
			}
			else{
				jsonFormData = {"action": Status,"gwid": gwid,"appName":formData.AppName,"packageId":formData.packageId};
			}
			
		}else{
			jsonFormData = {"action": Status,"gwid": gwid};
		}
		
		
		
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response;
        });
		
	};
	this.PostConfigureForm = function(gwid,arr,Status,step,key){
		//alert(arr);
		
		var jsonFormData;
		URL = servicePath+apiConstant.PostConfigureForm;

		if(step =='general_info'){
		jsonFormData = {"action": Status,"gwid": gwid,"data":{"configuration":[{"telemetry":arr}]}};	
		}else if(step == 'hardware')
		{
		jsonFormData = {"action": Status,"gwid": gwid,"data":{"configuration":[{"protocols_subscribed":arr}]}};		
		}		
		else if(step == 'messages')
		{
		jsonFormData = {"action": Status,"gwid": gwid,"data":{"configuration":[{"brokers":arr}]}};		
		}
		else if(step == 'editmessages')
		{
		jsonFormData = {"action": Status,"gwid": gwid,"brokerid": key,"data":{"configuration":[{"brokers":arr}]}};		
		}
		else if(step == 'refresh')
		{
		jsonFormData = {"action": Status,"gwid": gwid,"data":{"configuration":[]}};		
		}
		//console.log(JSON.stringify(jsonFormData))
		return $http({
            method: 'POST',
            url: URL,
            data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log("response api      "+JSON.stringify(response));
            return response;
        });
	};
	this.trashGateway = function(gwid){
		URL = servicePath+apiConstant.trashGateway;
		var jsonFormData = {"id":[gwid]};
		
		return $http({
            method: 'POST',
            url: URL,
			data: jsonFormData,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response);
            return response.data;
        });
	};
	this.getAllDevicesFromGateway = function(gwid,appname){
		URL = servicePath+String.format(apiConstant.getDeviceData2, gwid, appname);
		
		
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
    // --------------------------------------END GATEWAY AREA ---------------------------------------------
	
	this.fetchAppFromGateway = function(gatewayId){
		URL = servicePath+String.format(apiConstant.fetchAppFromGateway,gatewayId);
		
		               
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
	this.baseUrlAppPost = function(gwid,baseData,action){
		URL = servicePath+String.format(apiConstant.baseUrlAppPost,gwid);
		
		               
        return $http({
            method: 'POST',
            url: URL,
			data:{'baseurl':baseData,'action':action},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	
	this.ConnectivityApp = function(gwid,connectivityData,action,type){
		var obj ;
		if(type=='cloud'){
		URL = servicePath+String.format(apiConstant.cloudConnectivityApp,gwid);
		obj = {'cloudbroker':connectivityData,'action':action}
	}else if(type == 'local'){
		URL = servicePath+String.format(apiConstant.localConnectivityApp,gwid);
		obj = {'localbroker':connectivityData,'action':action}
	}else if(type=='deploy'){
			URL = servicePath+String.format(apiConstant.deployConnectivityApp,gwid);
		obj = {'deploybroker':connectivityData,'action':action}
		console.log(obj)
	} else if(type=='mqttptl'){
		URL = servicePath+String.format(apiConstant.mqttptlConnectivityApp,gwid);
		obj = {'envid':connectivityData.envid,"mqttptlbroker":{"brokerip":connectivityData.brokerip,"username":connectivityData.username,"password":connectivityData.password,"port":connectivityData.port,"protocol":connectivityData.protocol}}
		console.log(obj)
	}            
        return $http({
            method: 'POST',
            url: URL,
			data:obj,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {

			return response;
        });
	}
	this.testConnection = function(gwid,connectivityData){
		var obj ;
	
		URL = servicePath+String.format(apiConstant.testConnection,gwid);
		obj = {'broker':connectivityData}
        return $http({
            method: 'POST',
            url: URL,
			data:obj,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {

			return response;
        });
	}
	this.gwAccessControl = function(obj,gwid,appname){
		URL = servicePath+String.format(apiConstant.gwAccessControl,gwid,appname);
		
		               
        return $http({
            method: 'POST',
            url: URL,
			data:obj,
			headers: {
				'Content-Type':'application/json'	
			 }
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

   	this.postAppAccess = function(obj){
    URL = servicePath+String.format(apiConstant.appaccesscontrol)
     return $http({
            method:'POST',
            url:URL,
            data:obj,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            return response.data;
        })
   }
	
});