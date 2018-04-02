'use strict';

var softwareupdateModule = angular.module('softwareupdateModule.services', []);


//	Service Name : landingPage which includes all functions based on its module.
softwareupdateModule.service('softwareupdateModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
   var servicePath;              // Base path of API
   if(ENV.WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of WSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API
   var URL;
  // --------------------------------------START Software Update AREA ---------------------------------------------
    // Function Name : getApps
    this.getApps = function(pageno,paramsdata){
		
		URL = servicePath+apiConstant.getApps;
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		
		
		return $http({
            method: 'GET',
            url: URL,
			params:paramsdata,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
        });
	};
	 // Function Name : getApps
    this.getLatestApps = function(pageno,paramsdata){
		
		URL = servicePath+apiConstant.getLatestApps;
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		
		
		return $http({
            method: 'GET',
            url: URL,
			params:paramsdata,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
        });
	};
	this.getFetchGatewayFromPackages = function(pageno,paramsdata){
		URL = servicePath+apiConstant.getFetchGatewayFromPackages;
		
		
		
		return $http({
            method: 'POST',
            url: URL,
			data:paramsdata,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			//console.log(response.data);
            return response.data;
        });
	};
    this.getAllGatewayManager = function(object,parameters,pageno){
		URL = servicePath+String.format(apiConstant.getAllGatewayManager, object);
		if(pageno != "")
		{
			URL = URL + "&page="+pageno;
		}
		               
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
	this.getDockerApp = function(pageno){
		URL = servicePath+apiConstant.getDockerApp;
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		               
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
	this.deleteServerApp = function(id){
		URL = servicePath+String.format(apiConstant.postServerData,id);
		return $http({
            method: 'DELETE',
            url: URL,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.deleteDockerApp = function(id){
	URL = servicePath+String.format(apiConstant.deleteDockerApp,id);
		return $http({
            method: 'DELETE',
            url: URL,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	};
	this.deleteGatewayApp = function(id){
		URL = servicePath+String.format(apiConstant.deleteGatewayApp,id);
		return $http({
            method: 'DELETE',
            url: URL,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	};
	this.ADDDocker = function(params,id){
			var methoddata;
			
			if(id != undefined){
				URL = servicePath+String.format(apiConstant.deleteDockerApp,id);
				methoddata = 'PUT';
			}else{
				URL = servicePath+apiConstant.getDockerApp;
				methoddata = 'POST';
			}
		
		  return $http({
            method: methoddata,
            url: URL,
			data:params,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	};
	this.AddGatewayApp = function(params1,id,mid){
		var methoddata;
			
			if(id != undefined){
				URL = servicePath+apiConstant.getGatewayDocker+id+'/?mid='+mid;
				methoddata = 'PUT';
			}else{
				URL = servicePath+apiConstant.getGatewayDocker+'?mid='+mid;
				methoddata = 'POST';
			}
		
		  return $http({
            method: methoddata,
            url: URL,
			data:params1,
			
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	};
	this.getServerApp = function(pageno,params){
		URL = servicePath+apiConstant.getServerApp;
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		               
        return $http({
            method: 'GET',
            url: URL,
			params:params,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.assignGatewayToServer = function(serverid,gatewayArray){
		URL = servicePath+apiConstant.assignGatewayToServer;
		
		               
        return $http({
            method: 'POST',
            url: URL,
			data:{"serverid":serverid,"gwids":gatewayArray},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.ConfirmSaveDeployment = function(meshArray,serverArray,gatewayArray,appArray){
		URL = servicePath+apiConstant.ConfirmSaveDeployment;
		
		               
        return $http({
            method: 'POST',
            url: URL,
			data:{"mesh":meshArray,"gateways":gatewayArray,"apps":appArray,"ansibleserver":serverArray},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.ConfirmUninstallDeployment = function(meshArray,serverArray,appArray,gatewayArray){
		URL = servicePath+apiConstant.ConfirmUninstallDeployment;
		
		               
        return $http({
            method: 'POST',
            url: URL,
			data:{"mesh":meshArray,"apps_to_uninstall":appArray,"ansibleserver":serverArray,"gateways":gatewayArray},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.ConfirmUpgradeDeployment = function(meshArray,serverArray,gatewayArray,appArray){
		URL = servicePath+apiConstant.ConfirmUpgradeDeployment;
		
		               
        return $http({
            method: 'POST',
            url: URL,
			data:{"mesh":meshArray,"gateways":gatewayArray,"ansibleserver":serverArray,"upgradeapp_information":appArray},
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.trashProvision= function(meshArray,gateways,serverArray){
		URL = servicePath+apiConstant.trashProvision;
		 return $http({
            method:'POST',
            url:URL,
            data: {"action":"Trash_Gateway","mesh":meshArray,"gateways":gateways,"ansibleserver":serverArray},
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });
	};
	this.sendGatewayConfiguration = function(operation,meshArray,serverArray,gatewayArray,configuration,orgid){
		URL = servicePath+apiConstant.sendGatewayConfiguration;
		 return $http({
            method:'POST',
            url:URL,
            data: {"operation":operation,"mesh":meshArray,"gateways":gatewayArray,"ansibleserver":serverArray,"configuration":configuration,"orgid":orgid},
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });
	};
	this.deleteMeshServer = function(serverid){
		URL = servicePath+String.format(apiConstant.postServerData,serverid);
		return $http({
            method: 'DELETE',
            url: URL,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.postServerData=function(createServerData)
	{

		
		 var jsonFormData,methoddata;
		
			if(createServerData.serverid != undefined){
				URL = servicePath+String.format(apiConstant.editmeshServer,createServerData.serverid,createServerData.mesh_id);
				methoddata = 'PUT';
			}else{
				URL = servicePath+String.format(apiConstant.getmeshserverlist,createServerData.mesh_id);
				methoddata = 'POST';
			}
			
		jsonFormData={"name":createServerData.serverName,"ip":createServerData.ip,"macid":createServerData.macid,"ansibleserver_network":createServerData.network,"orgid":createServerData.orgid,"meshid":createServerData.mesh_id};
		
		               
        return $http({
            method:methoddata,
            url:URL,
            data: jsonFormData,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });

	}
	this.postMesh = function(params){
		
		var jsondata;
		URL = servicePath+apiConstant.getmeshList;
		jsondata = {"name":params.name,"description":params.description,"gateways":[],"network":params.network,"location":params.location,"orgid":params.orgid}
		 return $http({
				method:'POST',
				url:URL,
				data: jsondata,
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
		
	}
	this.putMesh = function(params){
		
		var jsondata;
		URL = servicePath+String.format(apiConstant.editMesh,params.id);
		jsondata = {"name":params.name,"description":params.description,"gateways":[],"network":params.network,"location":params.location,"orgid":params.orgid}
		 return $http({
				method:'PUT',
				url:URL,
				data: jsondata,
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
		
	}
	this.autogatewayData=function(pageno,params)
	{

	URL = servicePath+apiConstant.getGatewayDocker;
		
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		
		 var jsonFormData;
		   return $http({
            method:'GET',
            url:URL,
			params:params,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });

	}
	this.postProvision = function(meshArray,postProvisionData,dockerArray,serverArray,docker_configurations){
		URL = servicePath+apiConstant.postProvision;
		 return $http({
            method:'POST',
            url:URL,
            data: {"mesh":meshArray,"boards":postProvisionData,"ansibleserver":serverArray,"dockers":dockerArray,'docker_configurations':docker_configurations},
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });
	}
	this.getFilterDetail = function(getObject,getFields){
		URL = servicePath+String.format(apiConstant.getAllGatewayManager,getObject);
		
		
		   return $http({
            method:'GET',
            url:URL,
			params: getFields,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });
	}
	this.getmeshgroup = function(pageno){
		URL = servicePath+apiConstant.meshgroup;
		
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		
	
		   return $http({
            method:'GET',
            url:URL,
          
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });
	}
	this.deleteMeshApp = function(id){
		URL = servicePath+String.format(apiConstant.getGatewaysFromMesh,id);
		return $http({
            method: 'DELETE',
            url: URL,
			headers: {
				'Content-Type':'application/json'	
			 }
        }).then(function (response) {
			return response.data;
        });
	}
	this.getGatewaysFromMesh = function(id,pageno){
		URL = servicePath+String.format(apiConstant.getGatewayFromMesh,id);
		
		if(pageno != "")
		{
			URL = URL + "?page="+pageno;
		}
		
	
		   return $http({
            method:'GET',
            url:URL,
          
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });
	}
    // --------------------------------------END EVENTS AREA ---------------------------------------------
});