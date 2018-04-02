var gatewayModule = angular.module('gatewayModule.controllers', ['ui.bootstrap','ngSanitize','angular.filter','ngMaterial']);

gatewayModule.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
            start = +start; // parse to int
            return input.slice(start);
        }
        return [];
    };
});


//	Gateway Controller 
//	Function Parameters : $scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $uibModal,$state
gatewayModule.controller('gatewayCtrl', function ($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $uibModal,$state,toaster,CustomMessages) {

    /*	Data Attribute Initialize Function of Gateway
     Dynamic Generic Function for Initialize Data Attributes
     */

    // $scope.WebMqtt = WebMqtt
    // var	client = $scope.WebMqtt.client

     $rootScope.globals = $cookieStore.get('globals') || {};
     var $ctrl = this;
     if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
	
	}

	$scope.refreshFunc = function(){
		$state.reload();
		//$scope.getDataGateway(1);
	};
	$scope.trashGateway = function(gateway){
		var errormsg="Gateway not deleted successfully.";
		var successmsg="Gateway deleted successfully."; 
		gatewayModuleService.trashGateway(gateway.id).then(function (data) {
			
			$scope.getDataGateway(1);
			toaster.pop('success','',successmsg);
		});
		$scope.getDataGateway(1);
	};
	
	var data4GatewayManager = {"fields":"gatewaymanager,gatewaymanager_username"};
	var data4GatewayObject = 'gateway';
	var data4GatewayStatus = {"fields":"gateway_status"};
	var data4GatewayDisplayName = {"fields":"displayname"};
	
	gatewayModuleService.getAllGatewayManager(data4GatewayObject,data4GatewayDisplayName).then(function (data) {
		$scope.gatewayDisplayName_all = data.Data;
		if($scope.gatewayDisplayName_all != undefined || $scope.gatewayDisplayName_all != ""){
			

			var arr = JSON.stringify($scope.gatewayDisplayName_all);

			var arr2 = JSON.parse(arr);
			for (var i = 0; i<arr2.length; i++) {
				arr2[i].label = arr2[i].displayname;

				delete arr2[i].displayname;

			}
		$scope.jsonFormatData = arr2;
	}

});
	$scope.completeDnameSearch=function(){
	
	$( "#dnameSearch" ).autocomplete({
		appendTo: "#myModal",    // <-- do this
		open:function(event){

			var target = $(event.target); 
			var widget = target.autocomplete("widget");
			widget.zIndex(target.zIndex() + 1); 

		},
		close: function (event, ui){
			$(this).autocomplete("option","appendTo","#myModal");  // <-- and do this  
		},	
		source: $scope.jsonFormatData,
		autoFocus: false,
		select: function(event,ui){
			$timeout(function(){
				event.preventDefault();
			
			var UIvalue = ui.item.value;
			var UIlabel = ui.item.label;
			

			$( "#dnameSearch"  ).val(UIlabel);

			
			
			
		});
			
			
			return false;
		},
	});





};

gatewayModuleService.getAllGatewayManager(data4GatewayObject,data4GatewayManager).then(function (data) {
	$scope.gatewaymanager_all = data.Data;
});
gatewayModuleService.getAllGatewayManager(data4GatewayObject,data4GatewayStatus).then(function (data) {
	$scope.gatewaystatus_all = data.Data;
});
$scope.searchFeaturesSubmit = function(){
	
		$scope.params={};
		if($scope.dnameSearch != undefined && $scope.dnameSearch != "" && $scope.dnameSearch != null)
		{
			
			$scope.params.displayname=$scope.dnameSearch;
			
			
		}
		if($scope.gmanSearch != undefined && $scope.gmanSearch != "" && $scope.gmanSearch != null)
		{
			
			
			$scope.params.gatewaymanager=$scope.gmanSearch;
			
		}
		if($scope.statusSearch != undefined && $scope.statusSearch != "" && $scope.statusSearch != null)
		{

			
			$scope.params.gateway_status=$scope.statusSearch;			
			
			
		}
		$scope.getDataGateway(1,$scope.params);
		
	};		
	
	$scope.openRegisterInfo = function(urlStatus,gateway){
		$rootScope.gatewayselectedInfo = gateway;
		localStorage.setItem('gatewayselectedInfo',JSON.stringify($rootScope.gatewayselectedInfo));
		$location.path('gateway/'+urlStatus);
	};
	$scope.assignGroup = function(gateway){
		
		$rootScope.gatewayselectedInfo = gateway;
		localStorage.setItem('gatewayselectedInfo',JSON.stringify($rootScope.gatewayselectedInfo));
		$location.path('gateway/groups');
		
	};
	
	$scope.rebootGateway = function(gateway,action){
		var SocketCollection = [];
		$rootScope.mqttSubscribe(gateway.id,50);

		$scope.dataLoadingDiscovery = true;
		var errormsg,successmsg;
		if(action == "TURNOFF_GATEWAY"){
			errormsg = CustomMessages.GATEWAY_TURNOFF_ERROR;
			successmsg = CustomMessages.GATEWAY_TURNOFF_SUCCESS;
		}else if(action == "REBOOT_GATEWAY")
		{
			errormsg = CustomMessages.GATEWAY_REBOOT_ERROR;
			successmsg = CustomMessages.GATEWAY_REBOOT_SUCCESS;
		}
		if(gateway.length ==0){
			toaster.pop('error','',errormsg);
			return false;
		}
			//$scope.dataLoading = true;
			
			
				
				gatewayModuleService.rebootData(gateway.id,action).then(function (data) {
					if(data.status ==404 || data.status==400){
						$scope.dataLoadingDiscovery = false;
					}
					else{
						$scope.$on("mqtt_message",function(e,a){


							if(a.data.responsecode==200){
								$scope.getDataGateway(1);
								$scope.dataLoadingDiscovery = false;
							}
							else{
								$scope.dataLoadingDiscovery = false;
							}
						});
					}

					});


			};

			$scope.openLiveInfo = function(gateway){
				$rootScope.gatewayselectedInfo = gateway;
				localStorage.setItem('gatewayselectedInfo',JSON.stringify($rootScope.gatewayselectedInfo));
				$location.path('gateway/live');
			}
			$scope.openDisplayInfo = function(gateway){
		$scope.displayname = gateway.displayname;
		$scope.gatewayId = gateway.id;
		
		localStorage.setItem('displayname',$scope.displayname);
		localStorage.setItem('gatewayId',$scope.gatewayId);
		localStorage.setItem('gatewayInfo',JSON.stringify(gateway));
		$location.path('gateway/detail/'+$scope.gatewayId);
	};
	$scope.openDeviceInfo = function(gateway){
		$scope.gatewayInfo = gateway;
		$scope.displayname = gateway.displayname;
		$scope.gatewayId = gateway.id;
		
		localStorage.setItem('displayname',$scope.displayname);
		localStorage.setItem('gatewayId',$scope.gatewayId);
		
		localStorage.setItem('gatewayInfo',JSON.stringify($scope.gatewayInfo));	
		$location.path('gateway/detail/'+gateway.id+'/devices');
	};
	
	$scope.getDataGateway = function(pageno,params){
		var latitude=[],longitude=[],modelname=[],macid=[],modelid=[],serialnumber=[],provider=[];
		$scope.gatewayList = [];
		$scope.currentGatewayPage = pageno;
		$scope.gatewayPerPage = ENV.recordPerPage;
		$scope.dataLoading = true;
		gatewayModuleService.getGatewayList(pageno,params).then(function (data) {
			
			$timeout(function(){
				$scope.dataLoading = false;	




			if(data.Data != undefined){
				$scope.gatewayList = data.Data;
				$scope.totalItems =  data.total_records;
					
				}else{
					$scope.totalItems = 0;
				}

				$.each(data.Data, function(index, object) {
					if(object.gatewaymeta != undefined)
					{


						latitude[index]= object.gatewaymeta.latitude;


						longitude[index]=object.gatewaymeta.longitude;


						if(object.gatewaymeta.modelname){modelname[index]=object.gatewaymeta.modelname;}else{modelname[index]="N/A";};
						if(object.gatewaymeta.macid){macid[index]=object.gatewaymeta.macid;}else{macid[index]="N/A";}
						if(object.gatewaymeta.modelid){modelid[index]=object.gatewaymeta.modelid;}else{modelid[index]="N/A";}
						if(object.gatewaymeta.serialnumber){serialnumber[index]=object.gatewaymeta.serialnumber;}else{serialnumber[index]="N/A";}	          
						if(object.gatewaymeta.provider){provider[index]=object.gatewaymeta.provider;}else{provider[index]="N/A";}
		      }
		  });
				angular.element('#myIframe').attr('src', "map.html?latitude="+latitude+"&longitude="+longitude+"&modelname="+modelname+"&macid="+macid+"&modelid="+modelid+"&serialnumber="+serialnumber+"&provider="+provider); 
			
				function getFieldByType(Type,packages){
					var DataResponse="";
					if(packages.length>0)
					{

						angular.forEach(packages, function (Package) {
							if(Package.packageType == 'OS')
							{
								DataResponse = Package.packageName+' / '+Package.version;
							}
						});
					}
					return DataResponse;
				};
				function getFieldByType2(Type,packages){
					var DataResponse="";
					if(packages.length>0)
					{

						angular.forEach(packages, function (Package) {
							if(Package.packageType == 'FW')
							{
								DataResponse = Package.packageName+' / '+Package.version;
							}
						});
					}
					return DataResponse;
				};
				for(var i=0;i<$scope.gatewayList.length;i++){


		
}
$scope.selectedRow = null;
$scope.setClickedRow = function(index,gatewayInfo){
	$scope.selectedRow = index;
	$scope.selectedRowGateway = gatewayInfo;
		
	};
			
		});
		}).catch(function(error){
			$scope.totalItems = 0;
			$scope.dataLoading = false;	
		});
	};
	$scope.trashGateway = function(gateway){
		var errormsg="Gateway not deleted successfully.",successmsg="Gateway deleted successfully."; 
		gatewayModuleService.trashGateway(gateway.id).then(function (data) {
			toaster.pop('success','',successmsg);
			$scope.getDataGateway(1);
		});
		
	};
	$scope.pageChanged = function(){
		
		$scope.getResultsPage($scope.currentGatewayPage,$scope.params);	

	};
	$scope.getResultsPage = function(pageNumber,params){

		$scope.currentGatewayPage = pageNumber;
		$scope.params = params;
		$scope.gatewayPerPage = ENV.recordPerPage;
		$scope.getDataGateway($scope.currentGatewayPage,$scope.params);

	};
	$scope.getDataGateway(1);

});

//	Gateway Assign Group Controller 
//	Function Parameters : $scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state, toaster,CustomMessages
/*gatewayModule.controller('gatewayAssignGroupCtrl', function ($scope, $rootScope, groupModuleService,gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state, toaster,CustomMessages) {
var gatewayInfo = {};
$timeout(function(){
	

	if($scope.gatewayselectedInfo != "undefined" || $scope.gatewayselectedInfo != undefined)
	{
		gatewayModuleService.getGatewayDetails($scope.gatewayselectedInfo.id).then(function (data){
			$scope.gatewayselectedInfo = data.Data;



			groupModuleService.getGroupsData().then(function(data){
				$scope.displayTree = data;
				var arr = JSON.stringify($scope.displayTree);

				var arr2 = JSON.parse(arr);
				for (var i = 0; i<arr2.length; i++) {

					delete arr2[i].parent;

				}
$scope.jsonFormatData = arr2;

var j1 =  angular.element('#container11')
.bind("loaded.jstree", function (event, data) {
					
				})
.on("ready.jstree", function(e, data) {
if($scope.gatewayselectedInfo.groups != undefined){
	var groupsarray = $scope.gatewayselectedInfo.groups;
	for(var i=0;i<groupsarray.length;i++)
	{
		
		$('#container11').jstree("select_node", groupsarray[i]);
	}
}


}) 
.on('create_node.jstree', function (e, data) {




})
	.on('changed.jstree', function (e, data) {


		
	}).jstree({
		"plugins" : [ "themes", "html_data", "crrm", "dnd", "types","checkbox"],
		core : {
			data : $scope.jsonFormatData,
			"themes":{
				"icons":false
			},
			multiple: true,
		},
		checkbox: {       
      three_state : false, // to avoid that fact that checking a node also check others
      whole_node : true,  // to avoid checking the box just clicking the node 

  },
			 

			});
});

			$scope.assignedGroups = function(){
				var parentGroups = $("#container11").jstree("get_selected").toString();
	if(parentGroups != "" && parentGroups != "[object Object]")
	{
		var arrayGroups = [];

		var str_array = parentGroups.split(',');
		for(var i=0;i<str_array.length;i++)
		{
			arrayGroups[i] = str_array[i];
		}
		gatewayModuleService.assignedGroupsGateway($scope.gatewayselectedInfo.id,$scope.gatewayselectedInfo,arrayGroups).then(function(data){
			toaster.pop('success','',CustomMessages.GATEWAY_ASSIGN_GROUP+data.Data.displayname+" Gateway.");
		});
	}
	
};
});

	}
});
});*/
gatewayModule.controller('editConfigurationController', function($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,$uibModalInstance,param,toaster,CustomMessages,$controller) {
$rootScope.globals = $cookieStore.get('globals') || {};

if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
	}
	//$scope.WebMqtt = WebMqtt
	$scope.msg = {};
	$scope.msg.message={};
	$scope.msg.messages = param.messages;
	$scope.gatewayid = param.gatewayid;
	$rootScope.mqttSubscribe($scope.gatewayid,1000)
	$scope.closeEvent = function(){
		$uibModalInstance.close();
	};




});
gatewayModule.controller('installPackageModalCtrl', function ($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,$uibModalInstance,param,toaster,CustomMessages,$controller) {


$rootScope.globals = $cookieStore.get('globals') || {};

if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
	}
	$scope.gatewayId = param.gatewayId;
	$scope.orgId = param.orgId;
	$scope.action = param.action;
	$scope.Package = param.Package;
	$scope.gateway = param.gateway;
	$scope.selectedPackages = [];

	$scope.getAppsCall = function(pageno,params){
		$scope.packageApps = [];
		$scope.currentPackageAppPage = pageno;
		$scope.packageAppPerPage = ENV.recordPerPage;
		$scope.dataPackageAppLoading = true;

		gatewayModuleService.getApps($scope.gatewayId,$scope.gateway,pageno).then(function(response){

			$timeout(function(){
				$scope.dataPackageAppLoading = false;	

			if(response.Data != undefined){
				$scope.packageApps = response.Data;
				$scope.packageAppsTotalRecords = response.total_records;
			}else{
				$scope.packageAppsTotalRecords =0;
			}
			
			$scope.checkAll = function (selectedAll) {
				$scope.selectedAll = selectedAll;
				if ($scope.selectedAll) {
					$scope.selectedAll = true;
				} else {
					$scope.selectedAll = false;
				}

				angular.forEach($scope.packageApps, function (packageInstall) {

					packageInstall.packageInstallSelected = $scope.selectedAll;
				});
			};
			
			$scope.selectedRow = null;

			$scope.setClickedRowPackage = function(index,packageInstall){
				$scope.selectedRow = index;
				$scope.selectedRowPackage = packageInstall;
					//$scope.selectedPackages[packageInstall.id] =true;
					
					if(packageInstall.packageInstallSelected == true)
					{
						packageInstall.packageInstallSelected=false;
						
						
					}else{
						packageInstall.packageInstallSelected=true;
						
					}
				};
				
				$scope.checkStatus= function(packageInstall) {

					packageInstall.packageInstallSelected = !packageInstall.packageInstallSelected;
				};	
			});		
			
		});	
	};
	$scope.getAppsCall(1);
	$scope.pageChanged = function(){
$scope.getAppsCall($scope.currentPackageAppPage);	
};
$scope.dataInstallNewPackagesLoading=[];
$scope.upgradePackage = function(newPackageId,oldPackageId){
	var successMsg, errorMsg, SocketCollection = [];
	if($scope.action == 'UPDATE_PACKAGE')
	{
		successMsg = CustomMessages.GATEWAY_UPDATE_PACKAGE_SUCCESS;
		errorMsg = CustomMessages.GATEWAY_UPDATE_PACKAGE_ERROR;
	}
	$scope.dataInstallNewPackagesLoading[newPackageId] = true;	
	
		
		
		gatewayModuleService.PackageUpdateCall($scope.gatewayId,$scope.action,newPackageId,oldPackageId).then(function (data){
			if(data.status==400 || data.status==404){
				$scope.dataInstallNewPackagesLoading[newPackageId] = false;
			}
			else{
				var data =data.data;
				$scope.jobid = data.Data.id;
				$scope.gwid = data.Data.gwid;
				$scope.$on("mqtt_message",function(e,a){


					if(a.responsecode==200){
						$rootScope.$broadcast('gatewayPackages',{gwid : $scope.gwid});
						$uibModalInstance.close($scope.packageApps);
						$scope.dataInstallNewPackagesLoading[newPackageId] = false;
					}
					else{
						$scope.dataInstallNewPackagesLoading[newPackageId] = false;
					}
				});

			}
		});


	};
	$scope.InstallNew = function(packageInstallId){

		$scope.packageInstallId = packageInstallId;
		var successMsg, errorMsg, SocketCollection = [];
		if($scope.action == 'INSTALL_NEW_PACKAGE')
		{
			successMsg = CustomMessages.GATEWAY_INSTALL_PACKAGE_SUCCESS;
			errorMsg = CustomMessages.GATEWAY_INSTALL_PACKAGE_ERROR;
		}
		$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = true;



				
				
				
				gatewayModuleService.PackageInstallCall($scope.gatewayId,$scope.action,$scope.packageInstallId).then(function (data){
					if(data.status==400 || data.status==404){
						$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = false;
					}
					else{
				var data =data.data
				$scope.jobid = data.Data.id;
				$scope.gwid = data.Data.gwid;
				$scope.$on("mqtt_message",function(e,a){


					if(a.data.responsecode==200){
				$rootScope.$broadcast('gatewayPackages',{gwid : $scope.gwid});
				$uibModalInstance.close($scope.packageApps);
				$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = false;
				$timeout(function(){
					$scope.getAppsCall(1);
				},500)
				
			}
			else{
				$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = false;
			}
		});

	}
			

	});

	}
	




	$scope.closePackages = function(){
		$uibModalInstance.close();
	};
});
//	Gateway Description Controller 
//	Function Parameters : $scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state
gatewayModule.controller('gatewayDescCtrl', function ($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,$uibModal,toaster,CustomMessages,AclService,$mdDialog) {
	
	$scope.installSelectionOption="OFF";
	$scope.updateSelectionOption="OFF";
	$scope.appsdiv = 'ON'
	$scope.configuration=[];
	$scope.msg ={};
	$scope.editingMeshInfo = false
	$scope.meshInfoFlag =false
	

	$rootScope.mqttSubscribe($scope.gatewayId,1000)
	 localStorage.setItem('selectedgateway', JSON.stringify($scope.gateway));
	$rootScope.globals = $cookieStore.get('globals') || {};

	if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
	}
	
	$scope.$on("gatewayPackages",function(e,a){
		$scope.getPackageCalls(a.gwid);
	});
	$scope.$on('websocketMessageReceived', function(event, incomingMessage){
		// Do something with 'incomingMessage'

	//$scope.getPackageCalls(incomingMessage.gwid);

	});

	//For gateway description and mesh info
	$scope.getGatewayDescription = function(){
		gatewayModuleService.getGatewayDescription($scope.gateway.id).then(function(response){
			if(response.Data!=undefined){
				$scope.gatewayDesc = response.Data;
				localStorage.setItem('gatewaydesc',JSON.stringify($scope.gatewayDesc))
				 if($scope.gateway.gatewaymeta.mode=='Mesh'){
$scope.getMeshDetailsByGateway($scope.gatewayDesc.gatewaymeta.meshID)
}
			}
		})
	}
	$scope.getGatewayDescription()
	$scope.editConfiguration = function(){
		var modalInstance = $uibModal.open({
			backdrop  : 'static',
			ariaLabelledBy: 'Edit Configuration',
			ariaDescribedBy: 'Gateway Editing Configuration',
			templateUrl: 'edit-configuration.html',
			controller: 'editConfigurationController',
			resolve: {
				param: function () {
					return {'gatewayid':$scope.gateway.id,'configuration' :$scope.configuration};
				}
			}
		});
		
	};
	$scope.decryptData = function(param) {
		$scope.protectedpassword="";
		if(param.length >0){
			
			for(var i=0; i<param.length; ++i) {
				
				$scope.protectedpassword += '*';
			}
		}
		return $scope.protectedpassword;
	};
	$scope.openEditingGeneralInfo = function(){
		
		//var acpanels = $("#accordion2").find('.panel-collapse:not(".in")');
		var scpanels = $("#accordion2").find('div#gen_info2');
		scpanels.collapse("show");
		

		$scope.editingGeneralInfo=true;
	};
	$scope.openeditingMessagingInterface = function(){
		
		var scpanels = $("#accordion2").find('div#messages');
		scpanels.collapse("show");
		$scope.editingMessagingInterface=true;
	};
	$scope.openeditingHardware = function(){
		var scpanels = $("#accordion2").find('div#hardware');
		scpanels.collapse("show");
		$scope.editingHardware = true;
	};
	$scope.editmessage = [];
	$scope.openeditingMessages = function(index){
		
		var scpanels = $("#accordion2").find('div#messages'+index);
		scpanels.collapse("show");
		$scope.editmessage[index] = true;
	};
	
		$scope.gatewayId = $scope.gateway.id;

		$scope.gatewayConfigurationCall = function(gatewayId){
		//$scope.configuration = $scope.gateway.configuration;
		gatewayModuleService.getGatewayConfiguration(gatewayId).then(function(data) {

			$scope.configuration = data.Data.configuration;
			$scope.totalConfigurationItems=$scope.configuration.length;
			$scope.msg.tinterval = $scope.configuration.telemetry.tinterval;
			$scope.msg.messages = $scope.configuration.message;
			$scope.android_uniqueids=[];

			$scope.getLength=function(android_uniqueids)
			{
return Object.keys(android_uniqueids).length

}
//web mqtt remain
$scope.onValueChange=function(value,broker_url,port,username,password,android_uniqueids)
{
	var SocketCollection=[];


	gatewayModuleService.updateLocalAndroidAccess(broker_url,port,android_uniqueids,$scope.gatewayId,value,username,password).then(function (data){
		if(data.status==400 || data.status==404){

		}
		else{
			var data =data.data
			$scope.jobid = data.Data.payload.JOBID;
			$scope.gwid = data.Data.payload.gwid;
			
			$scope.$on("mqtt_message",function(e,a){


				if(a.responsecode==200){
			
				$scope.gatewayConfigurationCall($scope.gwid);
			}
	
			});
		}

	});


};



		if(($scope.configuration.protocols_subscribed != null) || ($scope.configuration.protocols_subscribed != undefined))
		{
			angular.forEach($scope.configuration.protocols_subscribed, function(protocols_subscribed)
			{
				$scope.msg.OPCData[protocols_subscribed.protocol] = protocols_subscribed.protocol;
			});
			
			
			
			
			
		}
		
	}).catch(function(error){
		$scope.totalConfigurationItems=0;
	});
};
		$scope.msg.OPCData = [];
		$scope.protocolSubscribe = function(protocol,status){
			if(status ==1){
				$scope.msg.OPCData[protocol] = protocol;
			}else{
				$scope.msg.OPCData[protocol] = '';
			}

		};





$scope.packageAction = function(gatewayId,orgid,action,package){
	var successMsg, errorMsg, SocketCollection = [];
	if(action == 'GET_PACKAGE'){
		successMsg = CustomMessages.GATEWAY_PACKAGE_SUCCESS_REFRESH;
		errorMsg = CustomMessages.GATEWAY_PACKAGE_ERROR_REFRESH;
	}
	if(action == 'UNINSTALL_PACKAGE'){
		successMsg = CustomMessages.GATEWAY_PACKAGE_SUCCESS_UNINSTALL;
		errorMsg = CustomMessages.GATEWAY_PACKAGE_ERROR_UNINSTALL;
	}
	var arr = [];
		
			 if(package != undefined)
			 {
			 	arr.push(package.packageId);
			 }

		
		if(action == 'UNINSTALL_PACKAGE' && arr.length ==0)
		{
			toaster.pop('error','',CustomMessages.GATEWAY_ANYSELECTION_UNINSTALL_PACKAGE);
			return false;	
		}
		$scope.datarefreshPackagesLoading = true;
		
		
		
		
		var flag=false
		gatewayModuleService.PackageRefresh(gatewayId,action,arr).then(function (data){
			if(data.status==400 || data.status==404){
				$scope.datarefreshPackagesLoading=false;
			}
			else{
				var data =data.data
				$scope.$on("mqtt_message",function(e,a){


					if(a.data.responsecode==200){	
						$timeout(function(){
							$scope.getPackageCalls();		
							},1000)
		
		$scope.datarefreshPackagesLoading=false;
	}
	else{
		$scope.datarefreshPackagesLoading=false;
	}
});
			}
		

});
	};	


	/*$scope.install = function(selectedOption){
		$scope.updateSelectionOption = "OFF";
		$scope.installSelectionOption = selectedOption;
	};
	$scope.update = function(selectedOption){
		$scope.installSelectionOption = "OFF";
		$scope.updateSelectionOption = selectedOption;
	};*/
	
	$scope.packageInstall = function(gatewayId,orgId,action,selectedRowPackage){
		
		var ariaLabelledBy1,ariaDescribedBy1;
		if(action == "INSTALL_NEW_PACKAGE")
		{
			ariaLabelledBy1 = 'Install Packages';
			ariaDescribedBy1 = 'Installing Packages of the gateway';
		}else{
			ariaLabelledBy1 = 'Upgrade Packages';
			ariaDescribedBy1 = 'Upgrading Packages of the gateway';
		}
		if(selectedRowPackage == undefined && action !== "INSTALL_NEW_PACKAGE")
		{
			toaster.pop("error","",CustomMessages.GATEWAY_PACKAGE_SELECTION_ERROR);
			return false;
		}
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop  : 'static',
			ariaLabelledBy: ariaLabelledBy1,
			ariaDescribedBy: ariaDescribedBy1,
			templateUrl: 'installPackage.html',
			controller: 'installPackageModalCtrl',

			size: 'lg',
			resolve: {
				param: function () {
					return {'gatewayId':gatewayId,'orgId' :orgId,'action' :action,'Package':selectedRowPackage,'gateway':$scope.gateway};
				}
			}
		});
	};
	$scope.getPackageCalls = function(){
		$scope.packagesperpage = ENV.recordPerPage;
		$scope.currentPackagePage = 1;
		gatewayModuleService.getGatewayPackageDetails($scope.gateway.id).then(function (data) {
			$scope.packagesData = data.Data.packages; 
$scope.datarefreshPackagesLoading=false;
			$scope.totalPackageItems = $scope.packagesData.length;
		
						$scope.selectedRow = null;
						$scope.setClickedRowPackageData = function(index,package){
							$scope.selectedRow = index;
							$scope.selectedRowPackage = package;

							if(package.packageSelected == true)
							{
								package.packageSelected=false;

							}else{

								package.packageSelected=true;

							}
						};

					}).catch(function(error){
						$scope.totalPackageItems = 0;

					});
				};	
				if(AclService.can('retrieve_packagegateway')){
					//$scope.getPackageCalls();

				}
				$scope.refreshEvents = function(){
					$scope.getEventsCall($scope.gateway.id,1);
				};
				$scope.getEventsCall = function(gatewayId,page){
					$scope.gatewayEvents = [];
					$scope.currentEventPage = page;
					$scope.eventsperpage = ENV.recordPerPage;	
					gatewayModuleService.getEventsList(gatewayId,page).then(function(data){
						if(data.Data != undefined){
							$scope.gatewayEvents = data.Data;
							$scope.totalGatewayEvents = data.total_records;
						}else{
							$scope.totalGatewayEvents = 0;
						}

            $scope.appsdiv = 'ON'

					});
					$scope.pageChanged = function(){
					
						$scope.getEventsCall(gatewayId,$scope.currentEventPage);	
					};
				};


	$scope.getTaskDetails = function(gatewayId){

		gatewayModuleService.getGatewayTaskDetails(gatewayId).then(function (data) {
			var status;
			var taskArray=[];
			var runningArray=[];
			var idleArray=[];
			$scope.tasksData = data.Data.tasks;
			//$scope.packagesGatewayData = data.Data.packages;




			taskArray = $scope.tasksData;
		angular.forEach(taskArray, function(valueProperties, keyProperties){
			status = valueProperties.Status;


					if(status=='Running'){
						runningArray.push
					}
				});
		for(var i=0;i<taskArray.length;i++){
			
			if(taskArray[i].Status=='Running' && taskArray[i].AppType=='APP'){
				
				runningArray.push(taskArray[i]);
			}else if((taskArray[i].Status=='NotRunning' ||taskArray[i].Status=='Not Running') && taskArray[i].AppType=='APP'){
				
				idleArray.push(taskArray[i]);
			}
		}
		
		$scope.task_running = runningArray;
		$scope.task_idle = idleArray;

		$scope.selectedAllTask = false;
		$scope.checkAllTask = function (selectedAllTask) {
			$scope.selectedAllTask = selectedAllTask;
			if ($scope.selectedAllTask) {
				$scope.selectedAllTask = true;
			} else {
				$scope.selectedAllTask = false;
			}

			angular.forEach($scope.tasksData, function (task) {

				task.taskSelected = $scope.selectedAllTask;
			});
		};
		$scope.selectedRowTask = null;
		$scope.selectedRow = null;
		$scope.setClickedRowTask = function(index,task){
			$scope.selectedRow = index;
			$scope.selectedRowTask = task;

					if(task.taskSelected == true)
					{
						task.taskSelected=false;
						
						
					}else{
						task.taskSelected=true;
						
					}
					
				};

			});
		
	};
		if(AclService.can('list_event')){
			//$scope.getEventsCall($scope.gateway.id,1);
		}

	$scope.duplicateApp = function(action,task,ev){
		if(task =="" || task ==null)
		{
			toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
			$scope.datarefreshTaskLoading = false;
			return false;
		}else{
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop  : 'static',
				templateUrl: 'duplicateApp.html',
				controller: 'duplicateAppCtrl',
				size: 'sm',
				resolve: {
					param: function () {
						return {'gatewayId':$scope.gateway.id,'action' :action,'task':task};
					}
				}
			});
		}
		
	};
	$scope.actionApp = function(action,task){
		var successMsg, errorMsg, SocketCollection =[];
		if(action == 'START_APP')
		{
			successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_START;
			errorMsg = CustomMessages.GATEWAY_TASK_ERROR_START;
		}
		else if(action == 'KILL_APP')
		{
			successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_ENDED;
			errorMsg = CustomMessages.GATEWAY_TASK_ERROR_ENDED;
		}else if(action == 'RESTART_APP')
		{
			successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_RESTART;
			errorMsg = CustomMessages.GATEWAY_TASK_ERROR_RESTART;
		}

		if(task =="" || task ==null)
		{
			toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
			$scope.datarefreshTaskLoading = false;
			return false;
		}
		
		$scope.datarefreshTaskLoading = true;
		
		
		
		
		gatewayModuleService.PostTaskForm($scope.gateway.id,task,action).then(function (data){
			if(data.status==400 || data.status==404){
				$scope.datarefreshTaskLoading = false;
			}else{
				var data =data.data
				$scope.jobid = data.Data.id;
				$scope.gwid = data.Data.gwid;
				$scope.$on("mqtt_message",function(e,a){


					if(a.responsecode==200){
		$scope.datarefreshTaskLoading = false;
		$scope.getTaskDetails($scope.gwid);
	}
	else{
		$scope.datarefreshTaskLoading = false;
	}
});
			}

});				
	}
	$scope.actionTask = function(action){
		var successMsg, errorMsg, SocketCollection = [];
		if(action == 'GET_APP')
		{
			successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_REFRESH;
			errorMsg = CustomMessages.GATEWAY_TASK_ERROR_REFRESH;
		}

		$scope.datarefreshTaskLoading = true;
		
		
		
		gatewayModuleService.PostTaskForm($scope.gateway.id,'',action).then(function (data){
			if(data.status ==400|| data.status==404){
				$scope.datarefreshTaskLoading = false;
			}
			else{
				var data =data.data;
				
				$scope.jobid = data.Data.id;
				$scope.gwid = data.Data.gwid;
				$scope.$on("mqtt_message",function(e,a){
					console.log(a);

					if(a.data.responsecode==200){
						$scope.getTaskDetails($scope.gwid);
						$scope.datarefreshTaskLoading = false;
					}
					else{
						$scope.datarefreshTaskLoading = false;
					}
				});

			}
		

});
		
	};
	$scope.checkStatus= function(task) {

		task.taskSelected = !task.taskSelected;
	};
	
	
	$scope.todayDateTime = new Date();
	var minutes = 1000*60;
	var hours = minutes*60;
	var days = hours*24;
	var foo_date1 = $scope.todayDateTime;
	var foo_date2 = new Date($filter('date')($scope.gateway.connectedtimestamp, "MM/dd/yyyy HH:mm:ss"));

	$scope.diff_date = Math.round((foo_date1-foo_date2)/days);
	
	 if($scope.diff_date<=0)
	 {
	 	var starthour = parseInt(foo_date1.getHours());
	 	var endhour = parseInt(foo_date2.getHours());
	 	$scope.timeDiff = parseInt(endhour-starthour);

	 }else{
	 	$scope.timeDiff = null;
	 }
 $scope.edit = function(){
        //alert("hello")
        $scope.editingMeshInfo = true
    }	 
	 $scope.getMeshDetailsByGateway = function(mid){
	 	gatewayModuleService.getMeshByGwid(mid).then(function(data){
			
	 		if(data != undefined && data.Data!=undefined){
					$scope.meshData = data.Data
				}
	 	})
	 }

/*
		$scope.meshGroupList = function(pageno,params){
		$scope.currentMeshPage = pageno;
		$scope.meshPerPage = ENV.recordPerPage;
		gatewayModuleService.getMeshList(pageno,params).then(function(data){
			$timeout(function(){
				if(data.Data!=undefined){
					$scope.meshList = data.Data
				}else{
					toaster.pop("error","",""+data.message)

				}

				$scope.setClickedRow = function(index,meshInfo){
					$scope.selectedRow = index;
					$scope.selectedRowMesh = meshInfo;
				};
				$scope.pageChanged = function(){

					$scope.meshGroupList($scope.currentGatewayPage);	
				};
			},10)

		});
	}
	*/

    $scope.dropDownData = function(mesh){
        $scope.meshNetworkList = mesh.network
    }
    $scope.edit = function(){
        //alert("hello")
        $scope.editingMeshInfo = true
    }
    $scope.postMeshInfo = function(gateway,mesh, network){
        //var netarr = [];
       // netarr.push(network)
        gatewayModuleService.updateMeshDetails(gateway.id,mesh.id,network).then(function(data){
            if(data.message=='Data Created Successfully'){
                toaster.pop("success","",data.message);
                
                $scope.editingMeshInfo = false;
                
                gatewayModuleService.getGatewayDetails(gateway.id).then(function(data){
                if(data.Data!=undefined){
                    $scope.gateway =data.Data

                }
                $scope.getMeshDetailsByGateway($scope.gatewayId)
                //$scope.$apply();
            }) //this triggers a $digest
            }else{
                toaster.pop("error","",data.message);
                //$scope.$apply();
            }

            
        })
    }

    $scope.configure = function() {
        // $scope.appsdiv = 'OFF'
       
        localStorage.setItem('selectedgateway', JSON.stringify($scope.gateway));
        localStorage.setItem('gatewaydesc',JSON.stringify($scope.gatewayDesc))
        console.log('gateway/detail/' + $scope.gateway.id + '/configurations')
        $location.path('gateway/detail/' + $scope.gateway.id + '/configurations')
    }
    $scope.backButton = function() {
        $scope.appsdiv = 'ON'
        console.log($scope.selectedRowTask)
    }




    /*##################################################################*/


});
gatewayModule.controller('gatewayConfigurationCtrl', function($scope, $uibModal, $rootScope, gatewayModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster) {
   // console.log("appppp", $scope.selectedRowTask)
   $scope.gateway = JSON.parse(localStorage.getItem('selectedgateway'));
   $scope.gatewayDesc = JSON.parse(localStorage.getItem('gatewaydesc'))
    $scope.gatewayData = [];
    $scope.gatewayApp = [];
    $scope.getAppflag = 0;
    $scope.devicedata = [];
    $scope.configuration = {};
    $scope.cloud = [];
    $scope.local = [];
    $scope.deploy = [];
    $scope.mqttptl = [];

    $scope.configuration.baseabbr = "EI";
    $scope.configuration.baseabbr1 = "data";
    $scope.configuration.baseurl = "$orgid$";
    $scope.gw = {
        "roles": []
    }
     console.log("11111",$scope.gatewayDesc)
    //$rootScope.mqttSubscribe($scope.gateway.id,100);
    $scope.appname = [];
    $scope.getTaskDetails = function(){
    	gatewayModuleService.getGatewayTaskDetails($scope.gateway.id).then(function(response){
    		if(response.Data!=undefined){
    			$scope.taskList = response.Data.tasks
    			for (var i = 0; i < response.Data.tasks.length; i++) {
        	$scope.appname.push(response.Data.tasks[i].AppName)
    }
    		}
    	})
    }
    
      $scope.getTaskDetails()
    $scope.getAppData = function() {

        
            $scope.devicedata = [];
            $scope.getAppflag = 1;
            $scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.gatewayData.orgid);
        
    }




    $scope.viewSelection = function(protocol) {
        //alert(protocol);
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'viewPacketJson.html',
            controller: 'viewPacketJsonCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                param: function() {
                    return { 'protocol': protocol, 'appName': $scope.selectedName.appname };
                }
            }

        });
    }

    $scope.functionCallAppGatewayList = function(gatewayid, orgid) {


        $scope.base = {};
        $scope.org = { "url": "EI", "orgid": $scope.gatewayData.orgid, "gatewayid": gatewayid }
        $scope.base = { "url": "", "orgid": $scope.gatewayData.orgid, "gatewayid": gatewayid};
        gatewayModuleService.fetchAppFromGateway(gatewayid).then(function(data) {

            var config = data.Data.configuration;

            //  console.log("aaaaaaaaaaaa",config)
            if (config.baseurl != undefined) {
				$scope.org = { "url": config.baseurl, "orgid": $scope.gatewayData.orgid, "gatewayid": gatewayid}
            }
            if(config.mode !=undefined){
            	 $scope.mode =config.mode
            }
            if (config.cloudbrokers != undefined) {
                //$scope.existingCloudData = devicedataarr.appconfig.cloudconnections;
                $scope.cloud = config.cloudbrokers;
                //  console.log($scope.cloud)
            }
            if (config.localbrokers != undefined) {
                //$scope.existingCloudData = devicedataarr.appconfig.cloudconnections;
                $scope.local = config.localbrokers;
                console.log($scope.local)
            }
            if (config.deploybrokers != undefined) {
                //$scope.existingCloudData = devicedataarr.appconfig.cloudconnections;
                $scope.deploy = config.deploybrokers;
                console.log($scope.deploy)
            }if(config.mqttptl!=undefined){
            	 $scope.mqttptl.push(config.mqttptl.mqttptlbroker);
            	 $scope.mqttptl[0]['envid'] = config.mqttptl.envid
            	// $scope.mqttptl['envid'] = config.mqttptl.envid
                console.log($scope.mqttpl)
            }
        });
        /* if ($scope.cloud.length == 0) {
             $scope.cloud = [{ "connectivityid": "1", "type": { "management": "primary", "data": "primary" }, "url": "11.22.33.44", "username": "user123", "password": "user123", "protocol": "MQTT" }];
         }*/
    }

    $scope.init = function() {
        //console.log(localStorage.getItem("configurationDatat"))
        // var data = localStorage.getItem("configurationDatat");
        $scope.gatewayData = $scope.gateway;
        $scope.DisplayName = $scope.gatewayData.displayname;
        angular.forEach($scope.gatewayData.tasks, function(value, key) {

            if (value.AppType == 'APP') {
                $scope.gatewayApp.push({ "appname": value.AppName });
            }
        });
        $scope.getAppData()

    };
    $scope.init();
    $scope.getResoponse = function(existingData, connectivity) {

        var found = $filter('filter')(existingData, { connectivityid: connectivity }, true);
        var flag = false;

        if (found.length > 0) {
            flag = true;
        }
        return flag;
    }
    $scope.AddRecord = function(index, action) {
        if (action == 'cloud') {
            $scope.cloud.push({ "type": "", "protocol": "", "username": "", "password": "", "brokerip": "", "status": "NEW" });
        } else if (action == 'local') {
            $scope.local.push({ "type": "", "protocol": "", "username": "", "password": "", "brokerip": "", "status": "NEW" });
        } else if (action == 'deploy') {
            $scope.deploy.push({ "type": "", "protocol": "", "username": "", "password": "", "brokerip": "", "status": "NEW" });
        }else if (action == 'mqttptl' && $scope.mqttptl.length<1) {
            $scope.mqttptl.push({ "protocol": "", "username": "", "password": "", "brokerip": "", "status": "NEW" });
        }
    }

    $scope.DeleteRecord = function(index, action) {
        if (action == 'cloud') {
            $scope.cloud.splice(index, 1);
        } else if (action == 'local') {
            $scope.local.splice(index, 1);
        } else if (action == 'deploy') {
            $scope.deploy.splice(index, 1);
        }else if(action == 'mqttptl'){
        	$scope.mqttptl.splice(index, 1);
        }
    }
    $scope.checkAllName = function() {
        if ($scope.gw.roles.length < $scope.appname.length) {
            $scope.gw.roles = angular.copy($scope.appname);
        } else {
            $scope.gw.roles = [];
        }
        console.log($scope.gw.roles)
    };
    $scope.addName = function(name) {
        if ($scope.gw.roles.length == 0) {
            console.log("blank array")
            $scope.gw.roles.push(name)
        } else {
            if ($scope.gw.roles.indexOf(name) == -1) {
                console.log("not addedd")
                $scope.gw.roles.push(name)
            } else {
                var index = $scope.gw.roles.indexOf(name)
                console.log("added")
                $scope.gw.roles.splice(1, index)
            }
        }
    }
    $scope.funcBaseUrl = function(action) {

        $scope.baseurlAppLoading = true;
        gatewayModuleService.baseUrlAppPost($scope.gatewayData.id, $scope.org.url, action).then(function(response) {
            $scope.baseurlAppLoading = false;
            if (response.Data != undefined) {
                //toaster.pop("success",'',"Base URL "+action+"ED successfully")
                $scope.$on('mqtt_message', function(e, a) {
                    //  alert(a)
                    $scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.gatewayData.orgid);
                })
            } else {
                //toaster.pop("error",'',"Error in Base URL "+action+"ING")
            }
        });
    }
    $scope.savecommontopic = function() {
        console.log($scope.configuration)
    }
    $scope.cloudConnAppLoading = [];
    $scope.localConnAppLoading = [];
    $scope.deployConnAppLoading = [];
    $scope.mqttptlConnAppLoading = []
    $scope.addConnectivity = function(action, index, type) {

        if (type == 'cloud') {
            $scope.cloudConnAppLoading[index] = true;
            delete $scope.cloud[index].status;
            gatewayModuleService.ConnectivityApp($scope.gatewayData.id,  $scope.cloud[index], action, type).then(function(response) {


                if (response.status == 400) {
                    $scope.cloudConnAppLoading[index] = false;
                } else {
					
                    $scope.$on('mqtt_message', function(e, a) {
						
						
                        $scope.cloudConnAppLoading[index] = false;
						if(a.responsecode == 200){
                        if (action == "DELETE") {
                            $scope.cloud.splice(index, 1);
                        }
                        $scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.gatewayData.orgid);
						}
                    });
                }
            })

        } else if (type == 'local') {

            $scope.localConnAppLoading[index] = true;
            delete $scope.local[index].status;
            gatewayModuleService.ConnectivityApp($scope.gatewayData.id, $scope.local[index], action, type).then(function(response) {

                $scope.localConnAppLoading[index] = false;
                if (response.status == 400) {
                    $scope.localConnAppLoading[index] = false;
                } else {

                    $scope.localConnAppLoading[index] = false;
                    $scope.$on('mqtt_message', function(e, a) {
                       //console.log(a);
						if(a.responsecode == 200){
							 if (action == "DELETE") {
								$scope.local.splice(index, 1);
							 }
							$scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.gatewayData.orgid);
						}
                        
                    })
                }
            });

        } else if (type == 'deploy') {
            $scope.deployConnAppLoading[index] = true;
            delete $scope.deploy[index].status;
            gatewayModuleService.ConnectivityApp($scope.gatewayData.id, $scope.deploy[index], action, type).then(function(response) {
                if (response.status == 400) {
                    $scope.deployConnAppLoading[index] = false;
                } else {
                    $scope.deployConnAppLoading[index] = false;
                  

                    $scope.$on('mqtt_message', function(e, a) {
						if(a.responsecode == 200){
                         if (action == "DELETE") {
							$scope.deploy.splice(index, 1);
						}
                        $scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.gatewayData.orgid);
						}
                    })
                }
            });
        }
        else if (type == 'mqttptl') {
            $scope.mqttptlConnAppLoading[index] = true;
            delete $scope.mqttptl[index].status;
            gatewayModuleService.ConnectivityApp($scope.gatewayData.id, $scope.mqttptl[index], action, type).then(function(response) {
                if (response.status == 400) {
                    $scope.mqttptlConnAppLoading[index] = false;
                } else {
                    $scope.mqttptlConnAppLoading[index] = false;
                  

                    $scope.$on('mqtt_message', function(e, a) {
						if(a.responsecode == 200){
                         if (action == "DELETE") {
							$scope.mqttptl.splice(index, 1);
						}
                        $scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.gatewayData.orgid);
						}
                    })
                }
            });
        }
    }
    $scope.testConnection = function(index, type) {
        if (type == 'cloud') {
            $scope.cloudConnAppLoading[index] = true;
            delete $scope.cloud[index].status;
            gatewayModuleService.testConnection($scope.gatewayData.id, $scope.cloud[index]).then(function(response) {

                if (response.data != undefined) {
                    //$scope.cloud[index]['status'] = "NEW"
                    $scope.$on('mqtt_message', function(e, a) {
                        $scope.cloudConnAppLoading[index] = false;
                        //  $scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.AppID, $scope.gatewayData.orgid);
                    })
                } else {
                    $scope.cloudConnAppLoading[index] = false;
                }

            });
        } else if (type == 'local') {
            $scope.localConnAppLoading[index] = true;
            delete $scope.local[index].status;
            gatewayModuleService.testConnection($scope.gatewayData.id, $scope.local[index]).then(function(response) {
                
                if (response.data != undefined) {
                    //$scope.local[index]['status'] = "NEW"
                    $scope.$on('mqtt_message', function(e, a) {
                        $scope.localConnAppLoading[index] = false;
                        //$scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.AppID, $scope.gatewayData.orgid);
                    })
                }else{
                    $scope.localConnAppLoading[index] = false;
                }

            });

        } else if (type == 'deploy') {
            $scope.deployConnAppLoading[index] = true;
            delete $scope.deploy[index].status;
            gatewayModuleService.testConnection($scope.gatewayData.id, $scope.deploy[index]).then(function(response) {
             
                if (response.data != undefined) {
                    //  $scope.deploy[index]['status'] = "NEW"
                    $scope.$on('mqtt_message', function(e, a) {
                           $scope.deployConnAppLoading[index] = false;
                        // $scope.functionCallAppGatewayList($scope.gatewayData.id, $scope.AppID, $scope.gatewayData.orgid);
                    })
                }else{
                       $scope.deployConnAppLoading[index] = false;
                }

            });
        }

    }
    $scope.saveappAccessControl = function() {
        $scope.accesscontrolAppLoading = true;
        console.log($scope.gw.roles)
        var arr = []
        arr.push({ "gwid": $scope.gateway.id, "apptype": $scope.gw.roles })
        var obj = {}
        obj = { "accessConfig": arr }
        gatewayModuleService.gwAccessControl(obj, $scope.gateway.id, $scope.AppID).then(function(data) {
            $scope.accesscontrolAppLoading = false
            if (data.Data != undefined) {
                toaster.pop("success", "", "data added successfully")
                $scope.gw.roles = []
            }

        })
    }

    $scope.getMeshList = function() {
    	if($scope.gatewayDesc.gatewaymeta.mode=='Mesh'){
        gatewayModuleService.getMeshDetailById($scope.gatewayDesc.gatewaymeta.meshID).then(function(data) {
            if (data.Data != undefined) {
                console.log(data.Data.Data)
                $scope.meshGatewayList = data.Data.Data
            }
        });
   
    }

}


    $scope.data = {
    	"group":$scope.gatewayDesc.gatewaymeta.mode
    }

    $scope.accesscontrolconfig = function(mode) {
        console.log(mode)

        if (mode != undefined) {
            var modelInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'viewAccessControl.html',
                controller: 'GatewayAccessControlCtrl',
                windowClass: 'app-modal-window',
                resolve: {
                    dsparam: function() {
                        return { 'mode': mode, 'selectedtask': $scope.selectedRowTask, 'gateway': $scope.gateway, 'gwMeshList': $scope.meshGatewayList,'tasklist':$scope.taskList };
                    }
                }

            });
        } else {
            toaster.pop("error", '', 'Select gateway mode first')
        }

    }
    $scope.RedirectDevice = function(deviceid) {
        $scope.gatewayData.selected_device_id = deviceid;
        localStorage.setItem('configurationDatat', JSON.stringify($scope.gatewayData));
        $location.path('configurations/device');
    }

})
gatewayModule.controller('GatewayAccessControlCtrl', function($scope, $uibModalInstance, $rootScope, meshModuleService, deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, dsparam, $mdDialog,gatewayModuleService) {
    $rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;
        //$scope.channelid = $rootScope.channelid;

    }
    $scope.dataShowFlag = true;
    $scope.gw = {
        "roles": [],
        "gateways": []
    }

    $scope.gateway = dsparam.gateway;
    $scope.selectedRowTask = dsparam.selectedtask;
    $scope.mode = dsparam.mode
    $scope.meshGatewayList = dsparam.gwMeshList
    $scope.taskList = dsparam.tasklist;

    if ($scope.mode == 'standalone') {

        $scope.appnameArr = [];
        $scope.remainingapp = [];
        $scope.selectedApp = $scope.selectedRowTask.AppName
        for (var i = 0; i < $scope.taskList.length; i++) {
            if ($scope.appnameArr.indexOf($scope.taskList[i].AppName) == -1) {
                $scope.appnameArr.push($scope.taskList[i].AppName)

                if ($scope.taskList[i].AppName != $scope.selectedApp) {
                    $scope.remainingapp.push($scope.taskList[i].AppName)
                }
            }
        }
        $scope.addName = function(name) {
            if ($scope.gw.roles.length == 0) {
                console.log("blank array")
                $scope.gw.roles.push(name)
            } else {
                if ($scope.gw.roles.indexOf(name) == -1) {
                    console.log("not addedd")
                    $scope.gw.roles.push(name)
                } else {
                    var index = $scope.gw.roles.indexOf(name)
                    console.log("added")
                    $scope.gw.roles.splice(index, 1)
                }
            }
            console.log($scope.gw.roles)

        }
        $scope.accessControl = []
        $scope.saveInformation = function(mode) {
            console.log(mode)

            $scope.dataShowFlag = false
            $scope.accessConfig = [];
            $scope.accessConfig.push({ "gwid": $scope.gateway.id, "apptype": $scope.gw.roles })
            $scope.accessControl.push({ "appname": $scope.selectedApp, "gwid": $scope.gateway.id, "accessConfig": $scope.accessConfig })
            console.log(JSON.stringify($scope.accessControl))
            $scope.gw.roles = []
            if ($scope.remainingapp.length == 0) {
                $scope.clearmodel()
                gatewayModuleService.postAppAccess($scope.accessControl).then(function(response) {
                    console.log("here", JSON.stringify(response.Data))
                });
            }



        }
        $scope.yesFromAlert = function(mode) {
            console.log(mode)

            if ($scope.remainingapp.length != 0) {
                $scope.selectedApp = $scope.remainingapp[0];
                $scope.dataShowFlag = true;
                $scope.remainingapp.splice(0, 1)
            } else {
                $scope.clearmodel()
            }
        }
        $scope.noFromAlert = function(mode) {

            if ($scope.remainingapp.length - 1 != 0) {
                $scope.selectedApp = $scope.remainingapp[0];
                $scope.remainingapp.splice(0, 1)

            } else {
                $scope.clearmodel()
                gatewayModuleService.postAppAccess($scope.accessControl).then(function(response) {
                    console.log("here", JSON.stringify(response.Data))
                });
            }
        }
    } else if ($scope.mode == 'mesh') {
        $scope.selectedApp = $scope.gateway.displayname
        console.log("11111",$scope.meshGatewayList)
        $scope.remainingGw = [];
        $scope.remainingapp = [];
        for (var i = 0; i < $scope.meshGatewayList.length; i++) {
            if ($scope.meshGatewayList[i].id != $scope.gateway.id) {
                $scope.remainingGw.push($scope.meshGatewayList[i])
                $scope.remainingapp.push($scope.meshGatewayList[i].displayname)
            }
        }

         
       $scope.getAppArray = function(tasks){
       $scope.appnameArr = [];
        for (var i = 0; i < tasks.length; i++) {
            if ($scope.appnameArr.indexOf(tasks[i].AppName) == -1) {
                $scope.appnameArr.push(tasks[i].AppName)
            }
        }

         $scope.selMeshApp = $scope.appnameArr[0]
         console.log($scope.selMeshApp)
        $scope.selApp = $scope.appnameArr[0]
    }
    $scope.getAppArray($scope.taskList);

        $scope.openappDiv = [];

        $scope.openAppList = function(gateway, index) {


            if (index != undefined) {
                $scope.openappDiv[index] = true;
            }
            $scope.openGw = gateway.id
            $scope.openGwTasks = gateway.tasks


        }

        $scope.addGateway = function(gateway) {

            var found = $scope.gw.gateways.some(function(el) {
                return el.gwid === gateway.id;
            });

            if ($scope.gw.gateways.length == 0) {

                $scope.gw.gateways.push({ "gwid": gateway.id, "appType": [] })
            } else {

                var obj = { "gwid": gateway.id, "appType": [] }

                if (!found) {

                    $scope.gw.gateways.push(obj)
                } else {
                    var obj = { "gwid": gateway.id, "appType": [] }
                    var index = $scope.gw.gateways.indexOf(obj)

                    $scope.gw.gateways.splice(index, 1)
                }
            }
            console.log(JSON.stringify($scope.gw.gateways))
        }

        $scope.addMeshName = function(name) {
            for (var i = 0; i < $scope.gw.gateways.length; i++) {
                if ($scope.gw.gateways[i].gwid == $scope.openGw) {
                    if ($scope.gw.gateways[i].appType.length == 0) {
                        console.log("blank array")
                        $scope.gw.gateways[i].appType.push(name)
                    } else {
                        if ($scope.gw.gateways[i].appType.indexOf(name) == -1) {
                            console.log("not addedd")
                            $scope.gw.gateways[i].appType.push(name)
                        } else {
                            var index = $scope.gw.gateways[i].appType.indexOf(name)
                            console.log("added")
                            $scope.gw.gateways[i].appType.splice(index, 1)
                        }
                    }

                }
            }
            console.log(JSON.stringify($scope.gw.gateways))
        }
       
        $scope.changeApp = function(app) {
            console.log(app)
            for (var i = 0; i < $scope.gw.gateways.length; i++) {
                if ($scope.gw.gateways[i].appType.length == 0) {
                    for (var j = 0; j < $scope.meshGatewayList.length; j++) {
                        if ($scope.gw.gateways[i].gwid == $scope.meshGatewayList[j].id) {
                            for (var k = 0; k < $scope.meshGatewayList[j].tasks.length; k++) {
                                $scope.gw.gateways[i].appType.push($scope.meshGatewayList[j].tasks[k].AppName)
                            }
                        }
                    }
                }
            }
            $scope.accessControl.push({ "appname": $scope.selApp, "gwid": $scope.gateway.id, "accessConfig": $scope.gw.gateways })
            console.log(JSON.stringify($scope.accessControl))
            $scope.gw.gateways = []
            $scope.active = null
            $scope.selApp = app
        }
        $scope.accessControl = []
        $scope.saveInformation = function(mode) {
            console.log(mode)

            $scope.dataShowFlag = false
            for (var i = 0; i < $scope.gw.gateways.length; i++) {
                if ($scope.gw.gateways[i].appType.length == 0) {
                    for (var j = 0; j < $scope.meshGatewayList.length; j++) {
                        if ($scope.gw.gateways[i].gwid == $scope.meshGatewayList[j].id) {
                            for (var k = 0; k < $scope.meshGatewayList[j].tasks.length; k++) {
                                $scope.gw.gateways[i].appType.push($scope.meshGatewayList[j].tasks[k].AppName)
                            }
                        }
                    }
                }
            }
            $scope.accessControl.push({ "appname": $scope.selApp, "gwid": $scope.gateway.id, "accessConfig": $scope.gw.gateways })
            console.log(JSON.stringify($scope.accessControl))
            $scope.gw.gateways = []
            $scope.active = null
            $scope.meshGatewayList = $scope.meshGatewayList
            if ($scope.remainingGw.length == 0) {
                $scope.clearmodel()
                for(var i=0;i<$scope.accessControl.length;i++){
                    if($scope.accessControl[i].accessConfig.length==0){
                         console.log("from for   ",$scope.accessControl[i].appname)
                        $scope.accessControl.splice(i,1)
                    }
                }

                gatewayModuleService.postAppAccess($scope.accessControl).then(function(response) {
                    console.log("here", JSON.stringify(response.Data))
                });
            }



        }
        $scope.checkedGateway = function(gw) {
            var found = $scope.gw.gateways.some(function(el) {
                return el.gwid === gw.id;
            });
            if (found) {
                return true;
            } else {
                return false;
            }
        }
        $scope.checkedApp = function(app) {
            alert($scope.gw.gateways.length)
            for (var i = 0; i < $scope.gw.gateways.length; i++) {
                if ($scope.gw.gateways[i].gfwid == $scope.openGw) {
                    for (var j = 0; j < $scope.gw.gateways[i].appType.length; j++) {
                        if ($scope.gw.gateways[i].appType[j] == app) {
                            return true;
                        }
                    }
                }
            }

        }

        $scope.yesFromAlert = function(mode) {


            if ($scope.remainingGw.length != 0) {
                $scope.gateway = $scope.remainingGw[0];
                $scope.getAppArray($scope.gateway)
                $scope.selectedApp = $scope.gateway.displayname
                $scope.dataShowFlag = true;
                $scope.remainingGw.splice(0, 1)
                $scope.remainingapp.splice(0,1)
            } else {
                $scope.clearmodel()
            }
        }


        $scope.noFromAlert = function(mode) {


            if ($scope.remainingGw.length - 1 != 0) {

                $scope.gateway = $scope.remainingGw[0];
                $scope.getAppArray($scope.gateway)
                $scope.selectedApp = $scope.gateway.displayname
                $scope.remainingGw.splice(0, 1)
                 $scope.remainingapp.splice(0,1)
            } else {
                $scope.clearmodel()
                 for(var i=0;i<$scope.accessControl.length;i++){
                    if($scope.accessControl[i].accessConfig.length==0){
                        console.log("from for   ",$scope.accessControl[i].appname)
                        $scope.accessControl.splice(i,1)
                    }
                }
                gatewayModuleService.postAppAccess($scope.accessControl).then(function(response) {
                    console.log("here", JSON.stringify(response.Data))
                });
            }
        }

        $scope.showDetail = function(gw) {

            if ($scope.active != gw.displayname) {
                $scope.active = gw.displayname;
            } else {
                $scope.active = null;
            }
        };


    }
    $scope.clearmodel = function() {
        $uibModalInstance.close();
    }








})

gatewayModule.controller('gatewayConfigController',function($scope, $uibModalInstance,$rootScope, meshModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, dsparam){
    $rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
    $location.path('/login');
} else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;
        //$scope.channelid = $rootScope.channelid;

    }
    //console.log(dsparam.meshInformation);
    $scope.selectedMeshInformation = dsparam.meshInformation;
    $scope.gatewayAppObject = [];
$scope.getSelectedMeshDetail = function(pageno){
        //console.log($scope.selectedMeshInformation);
        $scope.meshGatewayList = [];
        $scope.currentDevicePage = pageno;
        $scope.devicePerPage = ENV.recordPerPage;
        $scope.dataLoading = true;
        meshModuleService.getMeshDetailById($scope.selectedMeshInformation.id,pageno).then(function(data){
            if(data.Data.Data!=undefined){
                $scope.meshGatewayList = data.Data.Data;
                $scope.meshGatewayTotalRecords = data.Data.total_records;
                $scope.gatewaytags = $scope.meshGatewayList;
                $scope.dataLoading = false;
            }else{
                $scope.meshGatewayTotalRecords =0;
                $scope.dataLoading = false;
            }
            $scope.checkedAllOption = "";
            $scope.arrCheckboxSelection = [];
                            $scope.checkAllApps = function (checkedAllOption) {
                                
                                            $scope.checkedAllOption = checkedAllOption;
                                            if ($scope.checkedAllOption) {
                                                $scope.checkedAllOption = true;
                                            } else {
                                                $scope.checkedAllOption = false;
                                            }
                                            
                                           angular.forEach($scope.meshGatewayList, function (gateway) {
                                             var tskarray = [];
                                             angular.forEach(gateway.tasks, function(task){
                                                  if($scope.checkedAllOption == true){
                                                    tskarray.push(task.AppName);
                                                  }else{
                                                    var idx = $scope.arrayObjectIndexOf(tskarray,task.AppName);
                                                    tskarray.splice(idx,1);
                                                  }
                                             });
                                            
                                                    
                                            $scope.arrCheckboxSelection.push({'gwid':gateway.id,'apptype':tskarray});
                                                    
                                                
                                                    
                                                    
                                                
                                                
                                           });
                                        };
                
        }).catch(function(error){
                $scope.meshGatewayTotalRecords =0;
                $scope.dataLoading = false;
        });
        $scope.pageChanged = function(){

        $scope.getSelectedMeshDetail($scope.currentDevicePage);    
        };
    }
    $scope.checkedSelectionApp = function(gatewayid,appname,taskSelection){
        var tskarray=[];
        if($scope.arrCheckboxSelection.length>0){
            
            angular.forEach($scope.arrCheckboxSelection,function(arr){
                if(arr.gwid == gatewayid){
                    if(taskSelection == true){
                    tskarray.push(appname);
                    }else{
                    var idx = $scope.arrayObjectIndexOf(tskarray,appname);
                    tskarray.splice(idx,1);    
                    }
                    $scope.arrCheckboxSelection.push({'gwid':gatewayid,'apptype':tskarray});
                }
                
            });
            
        }else{
            if(taskSelection == true){
                tskarray.push(appname);
            }else{
                var idx = $scope.arrayObjectIndexOf(tskarray,appname);
                tskarray.splice(idx,1);    
            }
            $scope.arrCheckboxSelection.push({'gwid':gatewayid,'apptype':tskarray});
        }
        
        
    }
    $scope.saveInformation = function(){
        console.log($scope.arrCheckboxSelection);
        var chckboxSelection = $scope.arrCheckboxSelection;
        
        meshModuleService.postAccessData(chckboxSelection).then(function(data){
            
        })
    }
$scope.getSelectedMeshDetail(1);

    $scope.clearmodel = function(){
        $uibModalInstance.close();
    }
    $scope.arrayObjectIndexOf = function(arr, obj) {
         for(var i = 0; i < arr.length; i++){
            if(angular.equals(arr[i], obj)){
                return i;
            }
        };
        return -1;
    }    
});
gatewayModule.controller('duplicateAppCtrl', function($scope, $rootScope, gatewayModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, $uibModalInstance, param, toaster, CustomMessages, $controller) {

$rootScope.globals = $cookieStore.get('globals') || {};

if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
	}


$scope.gatewayId = param.gatewayId;
$scope.action = param.action;
$scope.task = param.task;

$scope.closeApps = function(){
	$uibModalInstance.close();	
};
$scope.addDuplicateApp = function(duplicateappName,protocol){
	var successMsg, errorMsg, SocketCollection = [];
	if(param.action == 'DUPLICATE_APP')
	{
		successMsg = CustomMessages.GATEWAY_DUPLICATE_APP_SUCCESS;
		errorMsg = CustomMessages.GATEWAY_DUPLICATE_APP_ERROR;
	}
	$scope.dataDupAppLoading = true;



		
		
		
		gatewayModuleService.PostTaskForm($scope.gatewayId,$scope.task,$scope.action,duplicateappName,protocol).then(function (data){
		if(data.status==400|| data.status==404){
			$scope.dataDupAppLoading = false;
		}
		else{
			var data=data.data
			$scope.jobid = data.Data.payload.JOBID;
			$scope.gwid = $scope.gatewayId;
			$scope.$on("mqtt_message",function(e,a){
				if(a.data.responsecode==200){
					$rootScope.$broadcast('duplicateAppViaControl',{gwid : $scope.gwid});
					$uibModalInstance.close();
					$scope.dataDupAppLoading = false;
				}
				else{
					$uibModalInstance.close();
					$scope.dataDupAppLoading = false;
				}
			});
		}
		
			

	}).catch(function(error){
		$scope.dataDupAppLoading = false;
		$uibModalInstance.close();	
	});
};

});


gatewayModule.controller('gatewayDescriptionGroupsCtrl',function($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,$uibModal,CustomMessages,toaster,AclService){

	$scope.editGroup = function(group){

		if(group != "" && group != undefined){
			if(group.is_deleted == true)
			{
				toaster.pop('error',"",CustomMessages.GATEWAY_GROUP_DELETED);
				return false;
			}

			localStorage.setItem('groupselectedInfo',JSON.stringify(group));
			$location.path('groups/addgroup');	
		}
		else{
			toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
			return false;
		}

	};
	$scope.getGroupsList = function(gatewayId){
		$scope.dataLoadingGroup = true;
		gatewayModuleService.getGatewayGroupsDetails(gatewayId).then(function (data) {
			$scope.groupDetails = data.Data.groups;
			$scope.totalItemsGroups = $scope.groupDetails.length;
			$scope.dataLoadingGroup = false;	
			$scope.selectedRow = null;
			$scope.setClickedRowGroup = function(index,groupInfo){
				$scope.selectedRow = index;
				$scope.selectedRowGroup = groupInfo;
				
			};	
		}).catch(function(error){
			$scope.totalItemsGroups = 0;
			$scope.dataLoadingGroup = false;
		});	
	}

	$scope.groupsRefresh = function(tabId){

		$timeout(function() {
			$scope.getGroupsList($scope.gateway.id);

			$('#myTabs a[href="#'+tabId+'"]').tab('show');
		});
	};
	if(AclService.can('retrieve_gatewaygroup1')){

		
		$scope.getGroupsList($scope.gateway.id);	
	}
});
gatewayModule.controller('detailsManagerPageCtrl',function($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,$uibModalInstance, items,CustomMessages){
	$scope.channel = items.ch;
	$scope.servermsg = items.servermsg;
	$scope.devices = items.device;
	$scope.ok = function () {
		$uibModalInstance.close();
	};
});
gatewayModule.controller('gatewayDescriptionRequestManagerCtrl',function($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,$uibModal,CustomMessages,AclService){
	
	$scope.requestManagerRefresh = function(tabId){

		$timeout(function() {
			$scope.getRequestManagerList($scope.gateway.id,$scope.currentRequestPage);
			$('#myTabs a[href="#'+tabId+'"]').tab('show');
		});
	};
	$scope.detailsManagerPage = function(statusResponse,responseData){
		
		if(statusResponse =='COMPLETED'){
			var modalInstance = $uibModal.open({
				backdrop  : 'static',
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'modules/gateway/views/detailsManagerPage.html',
				controller: 'detailsManagerPageCtrl',
				size: 'lg',

				resolve: {
					items: function () {
						return responseData;
					}
				}
			});
		}
	};
	$scope.getRequestManagerList = function(gatewayId,pageno){
		$scope.requestManagerData = [];
		$scope.currentRequestPage = pageno;
		$scope.requestPerPage = ENV.recordPerPage;

		$scope.dataLoadingRequestManager = true;
		gatewayModuleService.getGatewayRequestManagers(gatewayId,pageno).then(function (data) {
			if(data.Data != undefined){
				$scope.requestManagerData = data.Data;
				$scope.totalRequestItems = data.total_records;
				$scope.dataLoadingRequestManager = false;	
				$scope.selectedRow = null;
				$scope.setClickedRowGroup = function(index,groupInfo){
					$scope.selectedRow = index;
					$scope.selectedRowGroup = groupInfo;
			
			};	
		}else{
			$scope.totalRequestItems = 0;
			$scope.dataLoadingRequestManager = false;
		}


	}).catch(function(error){
		$scope.totalRequestItems = 0;
		$scope.dataLoadingRequestManager = false;
	});	
};		
$scope.pageChanged = function(){

	$scope.getRequestManagerList($scope.gateway.id,$scope.currentRequestPage);	
};
if(AclService.can('retrieve_history')){
	$scope.getRequestManagerList($scope.gateway.id,1);	
}




});
gatewayModule.controller('gatewayLiveCtrl', function ($scope, $rootScope, gatewayModuleService,deviceModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $timeout, $q, $uibModal,$mdDialog,CustomMessages) {
	
	var labelValue = "";
	var constType= "";
	function createChartData(result,propertyid){


		var propertyData=["Data"];
   //  var pressure =["Pressure"];
   //  var humidity=["Humidity"];
   var tdate=['tdate'];
   var pdate=['pdate'];
   var hdate=['hdate'];
    $.each(result, function(index, object) {
    	var unixtime = new Date(object.created_ts).getTime()/1000;
    	var tsdate = new Date(parseInt(unixtime)*1000);
    	propertyData.push (object.value);  
    	tdate.push( tsdate );
    	labelValue = object.name;
    	constType = object.type;



								})
    $("#labeldisplay").text(labelValue + " data");
    generateChart(propertyData,tdate);

}
function generateChartBool(propertyData,tdate){
	var myArray=[];




	//for boolean value
	function drawChart()
	{
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'date');
		data.addColumn('number', 'properties');
		myArray=[0,1]; 
  // for(i = 0; i < myArray.length; i++)
    // data.addRow([tdate[i],myArray[i]] );


    data.addRow([tdate[0].toString(),myArray[0]])
    data.addRow([tdate[1].toString(),myArray[1]])

    var options = {
          // title: labelValue + " data",
          hAxis: {format:'hh:MM:ss', ticks: [new Date(tdate[0]),new Date(tdate[1])],textStyle:{color:'green'}},
          vAxis: {minValue: 0,maxValue: 1, gridlines:{count:2}, ticks: [{v:1, f:'ON'}, {v:0, f:'OFF'}],baselineColor:'red',textStyle:{color:'#E49307'}},
          legend: {position: 'bottom', textStyle: {color: 'orange', fontSize: 13}}
      };

      var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart'));
      chart.draw(data,options);

  }
  $(document).ready(function(){ 
  	setTimeout(function(){ 
  		google.charts.load('current', {'packages': ['corechart'], 'callback': drawChart});  }, 100); 
  });

}
function generateChartStr(propertyData,tdate)
{
	
	 //for continuos values
	 var chart = c3.generate({
	 	data: {

	 		x: 'x',
	 		type: 'area-spline',

	 		xFormat: '%m-%d-%Y %I:%M:%S %p',
        // columns: [
            // ['x',tdate[1],tdate[2],tdate[3]],
          // ['x1', propertyData[1],propertyData[2],propertyData[3]]
        // ]
        columns:[['x'].concat(tdate),['x1'].concat(propertyData)]
    },
    zoom: {
    	enabled: true
    },
    axis: {
    	x: {
    		type: 'timeseries',
    		tick: {
    			format: '%m-%d-%Y %I:%M:%S %p'

    		}
    	}

    },

});
	}
	function generateChart(propertyData,tdate){
//06-Dec-2016 11:43:56:000000
var chart = c3.generate({
	data: {

            xFormat: '%Y-%m-%dT%H:%M:%S.%LZ', // 'xFormat' can be used as custom format of 'x'
            xs:{
            	'Data': 'tdate',
             //  'Pressure': 'pdate',
             //  'Humidity':'hdate'
         },
         columns: [
         tdate,
            //   pdate,
            //   hdate,
            propertyData
           //    pressure,
           //    humidity
           ]
       },
       zoom: {
       	enabled: true
       },
       axis: {
       	x: {
       		type: 'timeseries',
       		tick: {
       			fit: true,
       			format: '%m-%d-%Y %I:%M:%S %p',
       			count : 10,
       		}
       	}
       }
   });

}


	$scope.locationPath = $location.path().substring(1);
	$scope.gatewaySelectionOptions = [{id:$scope.gatewayselectedInfo.id,name:$scope.gatewayselectedInfo.displayname}];
	gatewayModuleService.getDeviceData($scope.gatewayselectedInfo.id).then(function (data) {
			$scope.addresses = [];
			$scope.senIds = [];
			$scope.senNames = [];
			$scope.jsonFormat = [];
			
			angular.forEach(data.Data, function(value, key){
				/*if(value.address != ""){
				$scope.addresses[key] = value.address;
				}
				if(value.senid != ""){
					$scope.senIds[key] = value.senid;
				}
				if(value.dispname != ""){
				$scope.senNames[key] = value.dispname;
			}*/
				//$scope.jsonFormat[key] = {key:value.protocol,key:value.address,key:value.senid,key:value.dispname};
				if(value.device_status == "ACTIVE" || value.device_status == "REGISTER"){
					var prototypename = "";
					prototypename= value.protocol;
					
					$scope.jsonFormat.push({
						"protocol":value.protocol,
						"protocol_name":prototypename,
						"address":value.address,
						"macid":value.macid,
						"displayname":value.displayname,
						"properties":value.regproperties,
						"id":value.id
					});

				}
				
				
			});
		
			$scope.changeSelectedItem = function(){
				
				 var object_by_id = $filter('filter')($scope.jsonFormat, {id: $scope.selecteddevice })[0];
				 if(object_by_id == undefined)
				 {
				 	$scope.selectedmacid = "";
				 	$scope.properties = [];
				 }
				 $scope.selectedmacid = object_by_id.macid;
				 $scope.properties = object_by_id.properties;
				}

				$scope.changeSelectedMac = function(){


				}
				$scope.changeSelecteddefinition = function(){
					var object_by_properties = $filter('filter')($scope.properties, {definitionName: $scope.selecteddefinition })[0];
					$scope.propertyObject = object_by_properties;
				}
				$scope.changeSelectedpropertyid = function(){


				}
			



	}).catch(function(error){


	});
	$scope.btnSubmitData = function(ev){
		$("#dataLoadingGatewayLive").show();
			//event.preventDefault();
			var gateway_id_data = $("#gateway_id").val();
			
			var gateway_id_data2 = gateway_id_data.replace('string:','');
			var gateway_id = gateway_id_data2.replace('"','');
			var devices_data = $('#devices').val();
			var devices_data2 = devices_data.replace('string:','');
			var devices = devices_data2.replace('"','');
			
		//	var conceptName = $('#address').find(":selected").text();
		//	var address = conceptName;
			//var sen_id = $("#sen_id").find(":selected").text();
			var propertyid_data = $("#propertyid").val();
			var propertyid_data2 = propertyid_data.replace('string:','');
			var propertyid = propertyid_data2.replace('"','');
			
			var time=$("#time").val()
			var cur_time = new Date().getTime();  


			var macArray = [];
		//	macArray.push(mac_id);
			//macArray.push(mac_id);
			
			if(time=="Last_30_min"){timestamp = new Date().getTime() - (30 *60000);}
			else if(time=="Last_45_min"){timestamp = new Date().getTime() - (45 *60000);}
			else if(time=="Last_1_hour"){timestamp = new Date().getTime() - (60 *60000);}
			else if(time=="Last_12_hour"){timestamp = new Date().getTime() - (720 *60000);}
			else if(time=="Last_24_hour"){timestamp = new Date().getTime() - (1440 *60000);}
			else if(time=="Last_Week"){timestamp = new Date().getTime() - (7 * 1440 * 60000);}
			else if(time=="Last_Month"){timestamp = new Date().getTime() - (30 * 1440 * 60000);}
			
			
			timestamp = Math.floor(timestamp/1000);
			//var dataString ='gateway_id='+ gateway_id + '&mac_id='+ mac_id + '&time='+ timestamp;
			
			var dataString = '{"gwid":"'+gateway_id+'","lasttime":'+timestamp+',"macid":'+JSON.stringify(macArray)+'}';
			
			var dataString2 ='{"gwid" : "'+gateway_id+'","lasttime":'+timestamp+',"deviceid": "'+devices+'","property": "'+ propertyid + '"}';


			
			// AJAX Code To Submit Form.

			gatewayModuleService.postLiveData(dataString2).then(function(response){
				$timeout(function(){
					
					
					if(response != undefined && response.Data.length>0)
					{
						createChartData(angular.fromJson(response.Data),propertyid);
						$("#chart").show();
					}
					else{
						$("#labeldisplay").text("No Result Found");
						$("#chart").hide();
					}

					$("#dataLoadingGatewayLive").hide();
				},500);
				

			}).catch(function(response){
				
				angular.element("#dataLoadingGatewayLive").hide();
				angular.element("#labeldisplay").text("No Result Found");
				angular.element("#chart").hide();
			});
			
			
			
		};
	/*$scope.gatewayInfo = $scope.gatewayselectedInfo;
		$scope.modalInstance = $uibModal.open({
		  animation: true,
		  templateUrl: 'live-form.html',
		  backdrop: false,
		  size: 'lm',
		  scope: $scope,
		 
		
		});	
		$scope.closeFilterInfo = function() {
			$scope.modalInstance.close();
		};*/
	});

//	Gateway Register Controller 
//	Function Parameters : $scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $timeout, $q
/*gatewayModule.controller('gatewayRegisterCtrl', function ($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $timeout, $q, toaster,CustomMessages) {
	$scope.locationPath = $location.path().substring(1);
	var collection = [];
	$scope.gateway="";
	$rootScope.globals = $cookieStore.get('globals') || {};
	var $ctrl = this;
	if (!$rootScope.globals.currentUser) {
		
		$location.path('/login');
	} else {
		
		$scope.firstname = $rootScope.globals.currentUser.firstname;
		$scope.lastname = $rootScope.globals.currentUser.lastname;
		$scope.username = $rootScope.globals.currentUser.user;
		$scope.userFullName = $scope.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
	}

	if($scope.gatewayselectedInfo != "undefined" && $scope.gatewayselectedInfo != undefined)
	{	
		gatewayModuleService.getGatewayDetails($scope.gatewayselectedInfo.id).then(function (data){
			var data = data.Data;
				$scope.status = data.gateway_status;
				var date1 = new Date(data.modified_ts);
				date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset());
				//var millis = date1.getTime()+ (date1.getTimezoneOffset() *60*1000);
				$scope.statusEvent = data.gateway_status + " at "+ $filter('date')(date1,"MM/dd/yyyy HH:mm:ss ");
				if(data.gatewaymeta != null)
				{
					$scope.hardware = data.gatewaymeta.hardware;
					$scope.os = data.gatewaymeta.operating_system;
					$scope.gateway = data.displayname;
					$scope.gatewayid = data.id;
					$scope.location1 = data.gatewaymeta.address;
					$scope.registered_id = data.gatewaymanager;
					$scope.registered_username = data.gatewaymanager_username;
					$scope.registered = $scope.registered_username;
					$scope.registerto ={"username":$scope.registered_username,"id":$scope.registered_id};
					$scope.registerto = JSON.stringify($scope.registerto);
				}
				

			
			
			function getFieldByType(Type,packages){
				var DataResponse="";
				if(packages.length>0)
				{
					
					angular.forEach(packages, function (Package) {
						if(Package.packageType == 'OS')
						{
							DataResponse = Package.packageName+' / '+Package.version;
						}
					});
				}
				return DataResponse;
			};
			function getFieldByType2(Type,packages){
				var DataResponse="";
				if(packages.length>0)
				{
					
					angular.forEach(packages, function (Package) {
						if(Package.packageType == 'FW')
						{
							DataResponse = Package.packageName+' / '+Package.version;
						}
					});
				}
				return DataResponse;
			};
			

			
			$scope.OperationSystem = getFieldByType('OS',data.packages);
			$scope.FirmwareVersion = getFieldByType2('FW',data.packages);
		});
		
	}
	
	
	gatewayModuleService.getNameIDFromAllGateway().then(function (data){
		$scope.datasource =data.Data;
		if($scope.datasource != undefined && $scope.datasource != ""){
			

			var arr = JSON.stringify($scope.datasource);

			var arr2 = JSON.parse(arr);
			for (var i = 0; i<arr2.length; i++) {
				arr2[i].label = arr2[i].displayname;
				arr2[i].value = arr2[i].id;
				delete arr2[i].displayname;
				delete arr2[i].id;
			}
		$scope.jsonFormatData = arr2;
		angular.element("#gateway").focus();
	}
});
	if($scope.locationPath =='gateway/register')
	{		
		gatewayModuleService.getRegisteredUsersGateway($scope.orgid).then(function(data){
			$scope.gatewayRegisterData = data.Data;
			});


	}		
	
	
	
	$scope.complete=function(){

	
	$( "#gateway" ).autocomplete({
		source: $scope.jsonFormatData,
		autoFocus: false,
		focus: function (event, ui) {
			$timeout(function(){
				event.preventDefault();
			
			var UIvalue = ui.item.value;
			var UIlabel = ui.item.label;

			$( "#gateway"  ).val(UIlabel);
			var date1 = new Date(ui.item.modified_ts);
			//date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset()); 
			$scope.gatewayid = ui.item.value; 
			$scope.status = ui.item.gateway_status;
			$scope.statusEvent = ui.item.gateway_status + " at "+ $filter('date')(date1.toISOString(),"MM/dd/yyyy HH:mm:ss");
			$scope.hardware = ui.item.gatewaymeta.hardware;
			$scope.os = ui.item.gatewaymeta.operating_system;
			$scope.gateway = UIlabel;
			
			$scope.location1 = ui.item.gatewaymeta.address;
			$scope.registered_id = ui.item.gatewaymanager;
			$scope.registered_username = ui.item.gatewaymanager_username;
			$scope.registerto ={"username":$scope.registered_username,"id":$scope.registered_id};
			$scope.registered = $scope.registered_username;
			$scope.registerto = JSON.stringify($scope.registerto);
			//$scope.gatewayselectedInfo.gateway_status = ui.item.gateway_status;
			

			function getFieldByType(Type,packages){
				
				var DataResponse="";
				if(packages.length>0)
				{
					
					angular.forEach(packages, function (Package) {
						if(Package.packageType == 'OS')
						{
							DataResponse = Package.packageName+' / '+Package.version;
						}
					});
				}
				
				return DataResponse;
			};
			

			$scope.OperationSystem = getFieldByType('OS',ui.item.packages);
			
		});
		},
		select: function(event,ui){
			$timeout(function(){
				event.preventDefault();
			var UIvalue = ui.item.value;
			var UIlabel = ui.item.label;

			$( "#gateway"  ).val(UIlabel);
			var date1 = new Date(ui.item.modified_ts);
			date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset());  
			$scope.gatewayid = ui.item.value; 
			$scope.status = ui.item.gateway_status;
			$scope.statusEvent = ui.item.gateway_status + " at "+ $filter('date')(date1,"MM/dd/yyyy HH:mm:ss");
			$scope.hardware = ui.item.gatewaymeta.hardware;
			$scope.os = ui.item.gatewaymeta.operating_system;
			$scope.gateway = UIlabel;
			
			$scope.location1 = ui.item.gatewaymeta.address;
			$scope.registered_id = ui.item.gatewaymanager;
			$scope.registered_username = ui.item.gatewaymanager_username;
			$scope.registerto ={"username":$scope.registered_username,"id":$scope.registered_id};
			$scope.registered = $scope.registered_username;
			$scope.registerto = JSON.stringify($scope.registerto);
			//$scope.registerto = $scope.registered;
			//$scope.gatewayselectedInfo.gateway_status = ui.item.gateway_status;
			

			function getFieldByType(Type,packages){
				
				var DataResponse="";
				if(packages.length>0)
				{
					
					angular.forEach(packages, function (Package) {
						if(Package.packageType == 'OS')
						{
							DataResponse = Package.packageName+' / '+Package.version;
						}
					});
				}
				
				return DataResponse;
			};
			

			$scope.OperationSystem = getFieldByType('OS',ui.item.packages);
			
		});
			
			
			return false;
		},
		change: function(event, ui) { 
				event.preventDefault();
				$timeout(function(){
					if(ui.item == null)
					{
						$( "#gateway"  ).val('');

						$scope.statusEvent = '';
						$scope.hardware = '';
						$scope.os = '';
						$scope.gateway = '';
						$scope.location1 = '';
						$scope.OperationSystem ='';
						$scope.registered_id = '';
						$scope.registered_username = '';
						$scope.status = '';
						$scope.registered='';

					}

				});
				return false;
			}
		});





}
$scope.activatePostForm = function(){
	if($scope.gatewayid ==undefined){
		toaster.pop('error',CustomMessages.SELECT_GATEWAY_ACTIVATE);
		$scope.dataLoading = false;
		return false;
	}
	$scope.dataLoading = true;
	
		gatewayModuleService.setActivateANDDeactivatePostForm($scope.gatewayid,'ACTIVATE').then(function (data){
			if(data.message =="Success")
			{
				
				$timeout(function(){

				var jobId = data.Data.JOBID;
				var GWID = data.Data.gwid;
				
				
				dataStream1.onClose(function(){

					if($scope.websocketActivation == true)
					{
						gatewayModuleService.getGatewayDetails(GWID).then(function (data) {
								var date1 = new Date(data.Data.modified_ts);
									date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset());  
									$scope.status = data.Data.gateway_status;
										$scope.statusEvent = data.Data.gateway_status + " at " +  $filter('date')( date1, "dd/MM/yyyy HH:mm:ss");


										$scope.dataLoading = false;
										toaster.pop('success', "", CustomMessages.GATEWAY_ACTIVATE_POST_SUCCESS);
									}).catch(function(error){
										$scope.dataLoading = false;
										toaster.pop('error', "", CustomMessages.GATEWAY_ACTIVATE_POST_ERROR);
									});
								}else{
									
									gatewayModuleService.getJobList(jobId).then(function(data){

										if(data.Data.status !=="IN_PROGRESS")
										{
											gatewayModuleService.getGatewayDetails(GWID).then(function (data) {


												var date1 = new Date(data.Data.modified_ts);
												date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset());  
												$scope.status = data.Data.gateway_status;
											//	$scope.gatewayselectedInfo.gateway_status = data.Data.gateway_status;
											$scope.statusEvent = data.Data.gateway_status + " at " +  $filter('date')( date1, "dd/MM/yyyy HH:mm:ss");


											$scope.dataLoading = false;
											toaster.pop('success', "", CustomMessages.GATEWAY_ACTIVATE_POST_SUCCESS);
										}).catch(function(error){
											$scope.dataLoading = false;
											toaster.pop('error', "",CustomMessages.GATEWAY_ACTIVATE_POST_ERROR);
										});	
									}else{
										$scope.dataLoading = false;
										toaster.pop('error', "",CustomMessages.GATEWAY_ACTIVATE_POST_ERROR);
									}
								});
								}
							});
				dataStream1.onError(function(){
					$scope.websocketActivation = false;
				});
				dataStream1.onMessage(function(message) {

					$scope.websocketActivation = true;						
						dataStream1.close();	
						
					});
				
			});
			}
		}).catch(function(error){
			$scope.dataLoading = false;
		});

	};
	$scope.deactivatePostForm = function(){
		if($scope.gatewayid ==undefined){
			toaster.pop('error',CustomMessages.SELECT_GATEWAY_DEACTIVATE);
			$scope.dataLoading = false;
			return false;
		}
		$scope.dataLoading = true;
			
			

		gatewayModuleService.setActivateANDDeactivatePostForm($scope.gatewayid,'DEACTIVATE').then(function (data){
			if(data.message =="Success"){

				
				$timeout(function(){

				var jobId = data.Data.JOBID;
				var GWID = data.Data.gwid;
				
				
				dataStream1.onMessage(function(message) {

					$scope.websocketActivation = true;
						//jobs/58492cc970192a64799bc3bf/?format=json
						dataStream1.close();	
						
						//$timeout(function(){




						});	
				dataStream1.onClose(function(){

					if($scope.websocketActivation == true)
					{

						gatewayModuleService.getGatewayDetails(GWID).then(function (data) {

									var date1 = new Date(data.Data.modified_ts);
											date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset()); 
											$scope.status = data.Data.gateway_status;
											//$scope.gatewayselectedInfo.gateway_status = data.Data.gateway_status;
											$scope.statusEvent = data.Data.gateway_status + " at " +  $filter('date')( date1, "dd/MM/yyyy HH:mm:ss");


											$scope.dataLoading = false;
											toaster.pop('success', "", CustomMessages.GATEWAY_DEACTIVATE_POST_SUCCESS);
										}).catch(function(error){
											$scope.dataLoading = false;
											toaster.pop('error', "", CustomMessages.GATEWAY_DEACTIVATE_POST_ERROR);
										});	
									}else{

										gatewayModuleService.getJobList(jobId).then(function(data){

											if(data.Data.status !=="IN_PROGRESS")
											{
												gatewayModuleService.getGatewayDetails(GWID).then(function (data) {

										var date1 = new Date(data.Data.modified_ts);
										date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset()); 
										$scope.status = data.Data.gateway_status;
									//	$scope.gatewayselectedInfo.gateway_status = data.Data.gateway_status;
									$scope.statusEvent = data.Data.gateway_status + " at " +  $filter('date')(date1, "dd/MM/yyyy HH:mm:ss");


									$scope.dataLoading = false;
									toaster.pop('success', "", CustomMessages.GATEWAY_DEACTIVATE_POST_SUCCESS);
								}).catch(function(error){
									$scope.dataLoading = false;
									toaster.pop('error', "", CustomMessages.GATEWAY_DEACTIVATE_POST_ERROR);
								});	
							}else{
								$scope.dataLoading = false;
								toaster.pop('error', "", CustomMessages.GATEWAY_DEACTIVATE_POST_ERROR);
							}
						});



									}
								});
				dataStream1.onError(function(){
					$scope.websocketActivation = false;
				});

				
			});
			}
		}).catch(function(error){
			$scope.dataLoading = false;
		});

	};
	$scope.registerPostForm = function(registerto){

		$scope.dataLoading = true;
		for(var i = 0;i<$scope.jsonFormatData.length;i++){

			if($scope.gateway == $scope.jsonFormatData[i].label){
				$scope.flag = true;
				break;
			}
		}

		if($scope.gatewayid ==undefined || registerto == undefined || registerto == '' || $scope.gatewayid == '' || $scope.gateway == '' || !$scope.flag){
			toaster.pop('error',CustomMessages.GATEWAY_BLANK_ERROR);
			$scope.dataLoading = false;
			return false;
		}
			
			//return false;
			var registerto = JSON.parse(registerto);
			if(registerto.length<=0)
			{
				toaster.pop('error', "",CustomMessages.GATEWAY_REGISTER_POST_FIELD_ERROR);
				$scope.dataLoading = false;
				//return false;
			}else{
				

				gatewayModuleService.setRegisterPostForm($scope.gatewayid,registerto).then(function (data){
					$timeout(function(){
						$scope.dataLoading = false;
						$scope.registered = registerto;
						$scope.registerto = registerto;

						toaster.pop('success', "",CustomMessages.GATEWAY_REGISTER_POST_SUCCESS);
					});
				}).catch(function(error){
					$scope.dataLoading = false;
				});
			}	
		}
		$scope.deregisterPostForm = function(fullname){
			$scope.dataLoading = true;

			for(var i = 0;i<$scope.jsonFormatData.length;i++){

				if($scope.gateway == $scope.jsonFormatData[i].label){
					$scope.flag = true;
					break;
				}
			}
			if($scope.gatewayid ==undefined || $scope.gateway == '' || !$scope.flag){
				toaster.pop('error',CustomMessages.GATEWAY_DEACTIVATE_POST_ERROR_2);
				$scope.dataLoading = false;
				return false;
			}
			gatewayModuleService.setDeregisterPostForm($scope.gatewayid).then(function (data){
				$timeout(function(){
					$scope.dataLoading = false;

					toaster.pop('success', "",CustomMessages.GATEWAY_DEREGISTER_POST_SUCCESS);
					$scope.registered_username = data.Data.gatewaymanager_username;
				});
			}).catch(function(error){
				$scope.dataLoading = false;
			});
		}
});	*/
gatewayModule.controller('taskManagerCtrl',function($scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,$uibModal,CustomMessages,toaster,AclService){
	$scope.installSelectionOption="OFF";
	$scope.updateSelectionOption="OFF";
	
	$scope.$on("duplicateAppViaControl",function(e,a){
		
		$timeout(function(){
		
		$scope.getTaskDetails(a.gwid);
		$scope.actionTask('GET_APP');
		})
		
	});
	$scope.install = function(selectedOption){
		$scope.action ="INSTALL_NEW_PACKAGE";
		$scope.updateSelectionOption = "OFF";
		$scope.installSelectionOption = selectedOption;
	};
	$scope.update = function(selectedOption){

		$scope.installSelectionOption = "OFF";
		$scope.updateSelectionOption = selectedOption;
	};
	$scope.refresh = function(){
		$scope.installSelectionOption = 'OFF';
		$scope.updateSelectionOption ='OFF';
		
		$scope.getTaskDetails($scope.gateway.id);
		
	};

	$scope.actionTask = function(action){
		var successMsg, errorMsg, SocketCollection = [];
		if(action == 'GET_APP')
		{
			successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_REFRESH;
			errorMsg = CustomMessages.GATEWAY_TASK_ERROR_REFRESH;
		}

		$scope.datarefreshTaskLoading = true;
		
		gatewayModuleService.PostTaskForm($scope.gateway.id,'',action).then(function (data){
			if(data.status==400 ||data.status==404){
				$scope.datarefreshTaskLoading = false;
			}
			else{
				var flag=true
				var data=data.data
				$scope.jobid = data.Data.id;
				$scope.gwid = data.Data.gwid;
				$scope.$on("mqtt_message",function(e,a){


					if(a.data.responsecode==200 ){
						if(flag==true){
							flag=false
						 toaster.pop('success','',""+a.consumer_message);
						}
						
						$scope.getTaskDetails($scope.gwid);
						$scope.datarefreshTaskLoading = false;
					}
					else{

						$scope.datarefreshTaskLoading = false;
					}
				});

			}
		

				});
		
	};

	$scope.getTaskDetails = function(gatewayId){
	
		gatewayModuleService.getGatewayTaskDetails(gatewayId).then(function (data) {
			var status;
			var taskArray=[];
			var runningArray=[];
			var idleArray=[];
			$scope.tasksData = data.Data.tasks;
			$scope.packagesGatewayData = data.Data.packages;




			taskArray = $scope.tasksData;
		angular.forEach(taskArray, function(valueProperties, keyProperties){
			status = valueProperties.Status;


					
				});
		for(var i=0;i<taskArray.length;i++){
			
			if(taskArray[i].Status=='Running' && taskArray[i].AppType=='APP'){
				
				runningArray.push(taskArray[i]);
			}else if((taskArray[i].Status=='NotRunning' ||taskArray[i].Status=='Not Running') && taskArray[i].AppType=='APP'){
				
				idleArray.push(taskArray[i]);
			}
		}
		
		$scope.task_running = runningArray;
		$scope.task_idle = idleArray;

		
		$scope.selectedAllTask = false;
		$scope.checkAllTask = function (selectedAllTask) {
			$scope.selectedAllTask = selectedAllTask;
			if ($scope.selectedAllTask) {
				$scope.selectedAllTask = true;
			} else {
				$scope.selectedAllTask = false;
			}

			angular.forEach($scope.tasksData, function (task) {

                    task.taskSelected = $scope.selectedAllTask;
                });
            };
            $scope.selectedRowTask = null;
            $scope.selectedRow = null;
            $scope.setClickedRowTask = function(index, task) {

                $scope.selectedRow = index;
                $scope.selectedRowTask = task;
                localStorage.setItem('selectedtask', JSON.stringify($scope.selectedRowTask))

					
					if(task.taskSelected == true)
					{
						task.taskSelected=false;
						
						
					}else{
						task.taskSelected=true;
						
					}
					
				};

			});
		
	};
	//$scope.getTaskDetails($scope.gateway.id)
	$scope.getPackageGatewayDetails = function(gatewayId){
		gatewayModuleService.getGatewayPackageDetails(gatewayId).then(function (data) {
			var status;

			$scope.packagesGatewayData = data.Data.packages;


		});
	};

	$scope.getAppsCall = function(pageno,params){
		
		
		$scope.packageApps = [];

		$scope.currentPackageAppPage = pageno;
		
		$scope.packageAppPerPage = ENV.recordPerPage;
		$scope.dataPackageAppLoading = true;

		gatewayModuleService.getApps($scope.gatewayId,$scope.gateway,pageno).then(function(response){

			$timeout(function(){

				$scope.dataPackageAppLoading = false;	

			if(response.Data != undefined){
				$scope.packageApps = response.Data;
				
				$scope.packageAppsTotalRecords = response.total_records;
			}else{
				$scope.packageAppsTotalRecords =0;
			}
			
			$scope.checkAll = function (selectedAll) {
				$scope.selectedAll = selectedAll;
				if ($scope.selectedAll) {
					$scope.selectedAll = true;
				} else {
					$scope.selectedAll = false;
				}

				angular.forEach($scope.packageApps, function (packageInstall) {

					packageInstall.packageInstallSelected = $scope.selectedAll;
				});
			};
			
			$scope.selectedRow = null;

			$scope.setClickedRowPackage = function(index,packageInstall){
				
				$scope.selectedRow = index;
				$scope.selectedRowPackage = packageInstall;
					//$scope.selectedPackages[packageInstall.id] =true;
					
					if(packageInstall.packageInstallSelected == true)
					{
						packageInstall.packageInstallSelected=false;
						
						
					}else{
						packageInstall.packageInstallSelected=true;
						
					}
				};
				
				$scope.checkStatus= function(packageInstall) {

					packageInstall.packageInstallSelected = !packageInstall.packageInstallSelected;
				};	

			});		
			
		});	
	};


	$scope.pageChanged = function(){
	
		$scope.getResultsPage($scope.currentPackageAppPage,$scope.params);	

	};
	$scope.getResultsPage = function(pageNumber,params){
		
		$scope.currentPackageAppPage = pageNumber;
		$scope.params = params;
		$scope.gatewayPerPage = ENV.recordPerPage;
		$scope.getAppsCall($scope.currentPackageAppPage,$scope.params);

	};
	//$scope.getPackageGatewayDetails($scope.gateway.id);
	$scope.dataInstallNewPackagesLoading=[];
	$scope.dataUpdatePackagesLoading=[];
	$scope.dataStartPackagesLoading=[];
	$scope.dataRestartPackagesLoading=[];
	$scope.dataKillPackagesLoading=[];
	$scope.installOption ='false';

	$scope.installButton = function(value){
		
		$scope.installOption = value;
	};


	$scope.packageAction = function(gatewayId,orgid,action,package){
		var successMsg, errorMsg, SocketCollection = [];
		$scope.packageUninstallId = package.packageId;
		if(action == 'UNINSTALL_PACKAGE'){
			successMsg = CustomMessages.GATEWAY_PACKAGE_SUCCESS_UNINSTALL;
			errorMsg = CustomMessages.GATEWAY_PACKAGE_ERROR_UNINSTALL;
		}
		var arr = [];
		//for(var i in package){
			
		 //  if(package[i].packageSelected==true){
			 if(package != undefined)
			 {
			 	arr.push(package.packageId);
			 }

		 //  }
		//}
		if(action == 'UNINSTALL_PACKAGE' && arr.length ==0)
		{
			toaster.pop('error','',CustomMessages.GATEWAY_ANYSELECTION_UNINSTALL_PACKAGE);
			return false;	
		}
		$scope.dataUpdatePackagesLoading[$scope.packageUninstallId] = true;
		$scope.datarefreshPackagesLoading = true;
		
		
		
		gatewayModuleService.PackageRefresh(gatewayId,action,arr).then(function (data){
			if(data.status==400 || data.status==404){
				$scope.datarefreshPackagesLoading=false;
			}
			else{
				$scope.$on("mqtt_message",function(e,a){


					if(a.data.responsecode==200){

                        $scope.getPackageCalls();
                        $scope.datarefreshPackagesLoading = false;
                        $scope.dataUpdatePackagesLoading[$scope.packageUninstallId] = false;
                        $scope.getAppsCall(1);
                    } else {
                        $scope.datarefreshPackagesLoading = false;
                    }
                });

			}
		
	});

	};	


	$scope.InstallNew = function(packageInstallId){


		$scope.packageInstallId = packageInstallId;
		var successMsg, errorMsg, SocketCollection = [];
		if($scope.action == 'INSTALL_NEW_PACKAGE')
		{
			successMsg = CustomMessages.GATEWAY_INSTALL_PACKAGE_SUCCESS;
			errorMsg = CustomMessages.GATEWAY_INSTALL_PACKAGE_ERROR;
		}
		$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = true;
		
		
		
		
		
		
		gatewayModuleService.PackageInstallCall($scope.gatewayId,$scope.action,$scope.packageInstallId).then(function (data){
			if(data.status==400 || data.status==404){
				$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = false;
			}
			else{
				$scope.$on("mqtt_message",function(e,a){


					if(a.data.responsecode==200){
						$rootScope.$broadcast('gatewayPackages',{gwid : $scope.gwid});
						$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = false;
						$scope.getAppsCall(1);
					}
					else{
						$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = false;
					}
				});

			}
	});
	};

	$scope.openDeviceInfo1 = function(gateway){
		$scope.gatewayInfo = gateway;
		$scope.displayname = gateway.displayname;
		$scope.gatewayId = gateway.id;
		
		localStorage.setItem('displayname',$scope.displayname);
		localStorage.setItem('gatewayId',$scope.gatewayId);
		
		localStorage.setItem('gatewayInfo',JSON.stringify($scope.gatewayInfo));
			$location.path('gateway/detail/'+gateway.id+'/devices');
		};

    $scope.$on('notification_mqtt',function(e,a){
         $scope.getTaskDetails($scope.gateway.id);
    })


    $scope.actionApp = function(action, task) {
        if (task == "" || task == null) {
            toaster.pop('error', "", CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
            $scope.datarefreshTaskLoading = false;
            return false;
        }
        var successMsg, errorMsg, SocketCollection = [];
        $scope.actionId = task.packageId;
        if (action == 'START_APP') {
            $scope.dataStartPackagesLoading[task.AppName] = true;
            successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_START;
            errorMsg = CustomMessages.GATEWAY_TASK_ERROR_START;
        } else if (action == 'KILL_APP') {
            $scope.dataKillPackagesLoading[task.AppName] = true;
            successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_ENDED;
            errorMsg = CustomMessages.GATEWAY_TASK_ERROR_ENDED;
        } else if (action == 'RESTART_APP') {
            $scope.dataRestartPackagesLoading[task.AppName] = true;
            successMsg = CustomMessages.GATEWAY_TASK_SUCCESS_RESTART;
            errorMsg = CustomMessages.GATEWAY_TASK_ERROR_RESTART;
        }

		if(task =="" || task ==null)
		{
			toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
			$scope.datarefreshTaskLoading = false;
			return false;
		}
		
		$scope.datarefreshTaskLoading = true;
		
		
		
		
		gatewayModuleService.PostTaskForm($scope.gateway.id,task,action).then(function (data){
		if(data.status==400 || data.status==404){
			$scope.dataInstallNewPackagesLoading[$scope.packageInstallId] = false;
		}
		else{
			$scope.$on("mqtt_message",function(e,a){


				if(a.data.responsecode==200){
					$scope.getTaskDetails($scope.gateway.id);
				}
				else{

				}
				$scope.dataStartPackagesLoading[task.AppName] = false;
				$scope.dataKillPackagesLoading[task.AppName] = false;
				$scope.dataRestartPackagesLoading[task.AppName] = false;
				$scope.datarefreshTaskLoading = false;
			});

		}

	});				
	}

	

	
				});