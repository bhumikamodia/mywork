'use strict';

var meshModule = angular.module('meshModule.services', []);

meshModule.service('meshModuleService', function ($http, $timeout, ENV, $rootScope, $cookieStore,apiConstant) {
		var servicePath;
   
   var WSO2Mode = ENV.WSO2Mode;
	if(WSO2Mode == true)
     servicePath = ENV.wso2ServerEndpoint;              // Base path of GSO2
	else
	 servicePath = ENV.apiEndpoint;              // Base path of API

   var URL;

   this.getMeshList = function(page,params){
   	URL = servicePath+apiConstant.getmeshList;
   	if(page != "" && page != undefined)
		{
			URL = URL + "?page="+page;
		} 
		return $http({
            method: 'GET',
            url: URL,
			params:params,
        }).then(function (response) {
			
            return response;
        });
   }
   this.deletemesh = function(mid){
    URL = servicePath+String.format(apiConstant.editMesh,mid)
     return $http({
            method:'DELETE',
            url:URL,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
            return response.data;
        })
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
   this.getmeshList = function(grpname,desc,network,location,arr,orgid){
   	var jsondata;
   	URL = servicePath+apiConstant.getmeshList;
   	jsondata = {"name":grpname,"description":desc,"gateways":arr,"network":network,"location":location,"orgid":orgid}
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

    };
   
   this.getMeshServerList = function(id){
   	URL = servicePath+String.format(apiConstant.getmeshserverlist,id);
   	
		return $http({
            method: 'GET',
            url: URL,
			
        }).then(function (response) {
			
            return response.data;
        });
   }

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

     this.deviceListbygatewayId = function(page,meshid){

            URL = servicePath+String.format(apiConstant.deviceListbygatewayId,meshid);
  
        
        if(page != "" && page != undefined)
        {
            URL = URL + "&page="+page;
        }                   
        return $http({
            method: 'GET',
            url: URL,
            
        }).then(function (response) {
            
            return response.data;
        });
    }
	
	this.getServerApp = function(pageno){
		URL = servicePath+apiConstant.getServerApp;
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
		//	console.log("response server ",response.data)
        });
	}

	this.postServerData=function(createServerData,meshid)
	{

		
		 var jsonFormData,methoddata;
		
			
				URL = servicePath+String.format(apiConstant.postMeshServer,createServerData.id);
				methoddata = 'POST';
			
		jsonFormData={"name":createServerData.name,"ip":createServerData.ip,"macid":createServerData.macid,"network":createServerData.network,"docker_subnet":createServerData.docker_subnet,"docker_iprange":createServerData.docker_iprange,"docker_networkName":createServerData.docker_networkName,"mid":meshid};
		
		               
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
	this.postAccessData = function(postdata){
		
		URL = servicePath+apiConstant.postAccessData;
		
			
		
		               
        return $http({
            method:'POST',
            url:URL,
            data: {'accessConfig':postdata},
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
           
            return response.data;
        });
	}
    this.putServerData=function(createServerData)
    {

        
         var jsonFormData,methoddata;
        
            
        URL = servicePath+String.format(apiConstant.editmeshServer,createServerData.id);
                
            
        jsonFormData={"id":createServerData.id,"name":createServerData.name,"ip":createServerData.ip,"macid":createServerData.macid,"network":createServerData.network,"docker_subnet":createServerData.docker_subnet,"docker_iprange":createServerData.docker_iprange,"docker_networkName":createServerData.docker_networkName};
        
                       
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

    }

    
 this.editDeviceGroup = function(grpname,grpdesc,arr1,gwid,devGrpId){
    
      var jsonFormData;
        jsonFormData = {"name":grpname,"description":grpdesc,"deviceids":arr1,"mode_id":gwid,"mode":"Mesh"};
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
	this.editmeshGroups =function(mesh){
       // console.log(JSON.stringify(mesh))
		URL = servicePath+String.format(apiConstant.editMesh,mesh.id);
		 return $http({
            method:'PUT',
            url:URL,
            data:mesh,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
        //    console.log("Resp: "+ JSON.stringify(response));
            return response.data;
        });

	}
	this.deletemeshServer = function(id){
		URL = servicePath+String.format(apiConstant.deletemeshServer,id);
		return $http({
            method:'DELETE',
            url:URL,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(function(response)
        {
          //  console.log("Resp: "+ JSON.stringify(response));
            return response.data;
        });
	}

 this.getDeviceGroups = function(page,params){
    
      // console.log(params)
       URL = servicePath+String.format(apiConstant.addDeviceGroups,params,page);
        //URL = servicePath+apiConstant.addDeviceGroups;

         if(page != "" && page != undefined)
        {
            URL = URL +"?meshid="+params.meshID+ "&page="+page;
        }  

         return $http({
            method: 'GET',
            url: URL,
           
        }).then(function (response) {
            //console.log(response.data)
            return response.data;
        });
    };
    this.addDeviceGroups = function(grpname,grpdesc,arr1,meshid){
      //  console.log("Deviceid is: "+grpname +" and gwid is: "+ grpdesc+" and array is: "+ arr1+" and gwid is: "+ gwid);
        var jsonFormData;
        URL = servicePath+apiConstant.addDeviceGroups;
        jsonFormData = {"name":grpname,"description":grpdesc,"deviceids":arr1,"mode_id":meshid,"mode":"Mesh"};
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


      this.deleteDeviceScheduledInfo = function(actionid){
     var jsonData;

     URL = servicePath+String.format(apiConstant.putDeviceScheduledInfo,actionid);
    
     jsonData = {"deleteactions" : actionid}
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


	});