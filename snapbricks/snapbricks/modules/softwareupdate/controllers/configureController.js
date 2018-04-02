var softwareupdateModule = angular.module('softwareupdateModule.controllers');

softwareupdateModule.controller('configureCtrl', function ($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$mdDialog,$uibModal,toaster,AclService) {


$scope.can = AclService.can;
$rootScope.globals = $cookieStore.get('globals') || {};
	//console.log($rootScope.globals);
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
    }
	
	$scope.refreshFunc = function(){
	$scope.configureGatewayWizard = false;
	$scope.configureAppWizard = false;
	};
	
	
	$scope.configureGatewayFunction = function(){
		
		$scope.configureGatewayWizard = true;
		$scope.configureAppWizard = false;
		
	}
    $scope.configureAppFunction = function(){
		$scope.configureGatewayWizard = false;
		$scope.configureAppWizard = true;
	}
	
	
	$scope.getMeshCall = function(pageno){
									$scope.MeshApps = [];
									$scope.selectedRowMesh = null;
									$scope.currentMeshAppPage = pageno;
									$scope.MeshAppPerPage = ENV.recordPerPage;
									$scope.dataMeshAppLoading = true;
								
							softwareupdateModuleService.getmeshgroup(pageno).then(function(response){
								
								$timeout(function(){
										//console.log(response);
										$scope.dataMeshAppLoading = false;	
										
										//console.log(data.Data);
										if(response.Data != undefined){
											$scope.MeshApps = response.Data;
											$scope.MeshAppTotalRecords = response.total_records;
											//alert($scope.packageAppsTotalRecords);
										}else{
											$scope.MeshAppTotalRecords =0;
										}
										
										$scope.selectedRow3 = null;
											
											$scope.setClickedRowMesh = function(index,meshApp){
												$scope.selectedRow3 = index;
												$scope.selectedRowMesh = meshApp;
											
											};
											
										
								});		
										
							}).catch(function(error){
								$scope.MeshAppTotalRecords =0;
								$scope.dataMeshAppLoading = false;
							});	
							$scope.pageChanged = function(){
							$scope.getMeshCall($scope.currentMeshAppPage);	
							};
	};
	
	$scope.getServerCall = function(pageno,params){
					$scope.selectedRowServer = null;
					$scope.ServerApps = [];
					$scope.currentServerAppPage = pageno;
					$scope.ServerAppPerPage = ENV.recordPerPage;
					$scope.dataServerAppLoading = true;
				
					softwareupdateModuleService.getServerApp(pageno,params).then(function(response){
						
						$timeout(function(){
								//console.log(response);
								$scope.dataServerAppLoading = false;	
								
								//console.log(data.Data);
								if(response.Data != undefined){
									$scope.ServerApps = response.Data;
									$scope.ServerAppTotalRecords = response.total_records;
									//alert($scope.packageAppsTotalRecords);
								}else{
									$scope.ServerAppTotalRecords =0;
								}
																
								$scope.selectedRow3 = null;
									
									$scope.setClickedRowServer = function(index,serverApp){
										$scope.selectedRow3 = index;
										$scope.selectedRowServer = serverApp;
										//$scope.selectedPackages[packageInstall.id] =true;
										
									};
								$scope.checkStatus= function(serverApp) {
								
								 serverApp.ServerAppSelected = !serverApp.ServerAppSelected;
								};	
						});		
								
					});	
						$scope.pageChanged = function(){
							$scope.getServerCall($scope.currentServerAppPage,params);	
						};
	};
	
	
	$scope.$watch('configureGatewayWizard',function(configureGatewayWizard){
	if(configureGatewayWizard == true){
		$scope.configGatewayMeshSelection = function(){
					$scope.configGatewayMeshOption = true;
					$scope.configGatewayServerOption = false;
					$scope.configGatewayGatewayOption = false;
					$scope.configGatewayAppOption = false;
		}
		
		$scope.configGatewayServerSelection = function(){
			$scope.configGatewayMeshOption = false;
			$scope.configGatewayServerOption = true;
			$scope.configGatewayGatewayOption = false;
			$scope.configGatewayAppOption = false;
		}
		
		$scope.configGatewayGatewaySelection = function(){
			$scope.configGatewayMeshOption = false;
			$scope.configGatewayServerOption = false;
			$scope.configGatewayGatewayOption = true;
			$scope.configGatewayAppOption = false;
		}
		$scope.configGatewayAppSelection = function(){
			$scope.configGatewayMeshOption = false;
			$scope.configGatewayServerOption = false;
			$scope.configGatewayGatewayOption = false;
			$scope.configGatewayAppOption = true;
		}
		$scope.configGatewayMeshSelection();
		
		$scope.$watch('configGatewayMeshOption',function(configGatewayMeshOption){
			if(configGatewayMeshOption == true){
				$scope.getMeshCall(1);
						$scope.nextStepconfigGatewayMesh = function(){
							if($scope.selectedRowMesh == undefined)
								{
									 alert = $mdDialog.alert({
									title: 'Please Select Mesh',
									textContent: 'Please select one Mesh for next process..!!',
									ok: 'Close'
									});

								  $mdDialog
									.show( alert )
									.finally(function() {
									  alert = undefined;
									});
								}else{
									$scope.configGatewayServerSelection();
									
								}
						};
			}
		});
		$scope.$watch('configGatewayServerOption',function(configGatewayServerOption){
		if(configGatewayServerOption == true){
			var params = {"mid":$scope.selectedRowMesh.id};
			$scope.getServerCall(1,params);
						$scope.nextStepconfigGatewayServer = function(){
							
							if($scope.selectedRowServer == undefined)
								{
									 alert = $mdDialog.alert({
									title: 'Please Select Server',
									textContent: 'Please select one Server for next process..!!',
									ok: 'Close'
									});

								  $mdDialog
									.show( alert )
									.finally(function() {
									  alert = undefined;
									});
								}else{
									$scope.configGatewayGatewaySelection();
									
								}
						}
		}
		});
		$scope.$watch('configGatewayGatewayOption',function(configGatewayGatewayOption){
		if(configGatewayGatewayOption == true){
							$scope.allarrays = [];
							var meshid = $scope.selectedRowMesh.id;
						
							
							$scope.arrGatewayCheckboxSelection = [];
							$scope.arrGatewayCheckboxSelectionBody = [];
							//console.log($scope.allarrays);
							$scope.getDataGateway = function(meshid,pageno,params){
							  
								$scope.gatewayList = [];
								$scope.currentGatewayPage = pageno;
								$scope.gatewayPerPage = ENV.recordPerPage;
								$scope.dataLoading = true;
								softwareupdateModuleService.getGatewaysFromMesh(meshid,pageno).then(function (data) {
									
									$timeout(function(){
									$scope.dataLoading = false;	
									
									//console.log(data.Data);
									if(data.Data != undefined){
											$scope.gatewayList = data.Data.Data;
											$scope.totalItems =  data.Data.total_records;
											//console.log($scope.gatewayList);
											
									}else{
											$scope.totalItems = 0;
									}
									 
									
									$scope.selectedAllGateway = "";
									$scope.checkAllSoftwareGateway = function (selectedAllGateway) {
							
										$scope.selectedAllGateway = selectedAllGateway;
										if ($scope.selectedAllGateway) {
											$scope.selectedAllGateway = true;
										} else {
											$scope.selectedAllGateway = false;
										}
										
									   angular.forEach($scope.gatewayList, function (gateway) {
										 
											if($scope.selectedAllGateway == true){
												$scope.arrGatewayCheckboxSelection.push(gateway.id);
												$scope.arrGatewayCheckboxSelectionBody.push(gateway);
											}else{
												var idx = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelection,gateway.id);
												$scope.arrGatewayCheckboxSelection.splice(idx,1);
												var idx2 = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelectionBody,gateway);
												$scope.arrGatewayCheckboxSelectionBody.splice(idx2,1);
											}
									   });
									};
									
									$scope.selectedRow1 = null;
									$scope.setClickedRowGateway = function(index,gateway){
										$scope.selectedRow1 = index;
										$scope.selectedRowGateway = gateway;
											var idx = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelection,gateway.id);
											var idx2= $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelectionBody,gateway);
										if($scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelection,gateway.id) > -1){
											$scope.arrGatewayCheckboxSelection.splice(idx,1);
											$scope.arrGatewayCheckboxSelectionBody.splice(idx2,1);
													}else{
														$scope.arrGatewayCheckboxSelection.push(gateway.id);
														$scope.arrGatewayCheckboxSelectionBody.push(gateway);
													}
										
										
									};
									
									});
									
							 }).catch(function(error){
								 $scope.totalItems = 0;
								 $scope.dataLoading = false;	
							 });
							 $scope.pageChanged1 = function(){
										//console.log($scope.params);
										//console.log($scope.currentGatewayPage);
										$scope.getDataGateway(meshid,$scope.currentGatewayPage,$scope.params);	
										
									};
							};
	
							$scope.getDataGateway(meshid,1);
							$scope.nextStepconfigGatewayGateway = function(){
								if($scope.arrGatewayCheckboxSelectionBody.length == 0)
								{
									 alert = $mdDialog.alert({
								title: 'Please Select Gateway',
								textContent: 'Please select any one gateway for next process..!!',
								ok: 'Close'
							  });

							  $mdDialog
								.show( alert )
								.finally(function() {
								  alert = undefined;
								});
								}else{
									$scope.configGatewayAppSelection();
								}
							}
		}
		});
		$scope.$watch('configGatewayAppOption',function(configGatewayAppOption){
			if(configGatewayAppOption == true){
				
				$scope.getcloud = function()
				{	
					$scope.configAll = {};
					$scope.configuration = {};
					$scope.configuration2 = {};
					$scope.configuration3 = {};
					$scope.configuration4 = {};
					$scope.configuration3.baseurlConfiguration = {};
					$scope.configuration3.baseurlConfiguration.baseurl = "EI";
					$scope.consumer = 1;
					$scope.configuration4.CloudConnectivityConfiguration 		= [{"connectivityid": "1","type": {"management": "primary","data": "primary"},"broker":"NA","url": "11.22.33.44","port": 1883,"username": "user123","password": "user123","protocol": "MQTT"},
								   {"connectivityid": "2","type": {"management": "secondary","data": "secondary"},"broker":"NA","url": "44.55.22.11","port": 5672,"username": "user321","password": "user321","protocol": "AMQP"}

								  ];
					$scope.configuration4.LocalConnectivityConfiguration 		= [{"connectivityid": "1","type": {"management": "primary","data": "primary"},"broker":"NA","url": "11.22.33.44","port": 1883,"username": "user123","password": "user123","protocol": "MQTT"}

								  ];			   
					$scope.configuration4.DeployConnectivityConfiguration 		= [{"connectivityid": "1","type": {"management": "primary","data": "primary"},"broker":"NA","url": "11.22.33.44","port": 1883,"username": "user123","password": "user123","protocol": "MQTT"}

								  ];			  
				}
				$scope.getcloud();
				$scope.protocolFun = function(protocol,cdata){
					if(protocol =="MQTT"){
						cdata.port=1883;
					}else if(protocol =="STOMP"){
						cdata.port=61613;
					}else{
						cdata.port=5672;
					}
					
				}
				$scope.AddCloudeRecord = function(totallength)
				{
					$scope.configuration4.CloudConnectivityConfiguration.push({});
				}
				$scope.DeleteCloudeRecord = function(index)
				{
					$scope.configuration4.CloudConnectivityConfiguration.splice(index, 1);
				}
				$scope.AddDeployRecord = function(index){
					$scope.configuration4.DeployConnectivityConfiguration.push({});
				}
				$scope.AddLocalRecord = function(index){
					$scope.configuration4.LocalConnectivityConfiguration.push({});
				}
				$scope.funcCloudConnectivity = function(action,index){
				
				
				
				
				}
				$scope.SaveCloudeRecord = function(){
					$rootScope.mqttSubscribe($scope.orgid+"_GatewayConfiguration",100);
					$scope.dataLoadingCloudConnection = true;
					var mesh_id = $scope.selectedRowMesh.id;
					var mesh_name = $scope.selectedRowMesh.name;
					var mesh_network = $scope.selectedRowMesh.network;
					var meshArray = {};
					
					
					if(mesh_id != undefined){
						meshArray.mesh_id = mesh_id;
					}
					if(mesh_name != undefined){
						meshArray.mesh_name = mesh_name;
					}
					if(mesh_network != undefined){
						meshArray.mesh_network = mesh_network;
					}
					var gatewayArray = [];
					angular.forEach($scope.arrGatewayCheckboxSelectionBody,function(gateway){
					gatewayArray.push({"gwid":gateway.id,"ip":gateway.gatewaymeta.staticip,"displayname":gateway.displayname});
					});
					var serverArray = [];
					var operation = "configuration";
					serverArray.push({'serverid':$scope.selectedRowServer.id,'network':$scope.selectedRowServer.mesh_group,'macid':$scope.selectedRowServer.macid});
					//console.log($scope.configuration.azureIOTConfig);
					softwareupdateModuleService.sendGatewayConfiguration(operation,meshArray,serverArray,gatewayArray,$scope.configuration4,$scope.orgid).then(function (response){
					$scope.$on("mqtt_message",function(e,a){
						var adata = a.data.output;
						if(adata.length>0){
									$rootScope.$broadcast('configConfirmResponse',{data : adata});
									//console.log(response);
									$scope.dataLoadingCloudConnection = false;
								}
					});
					
					});
				}
				$scope.baseConnection = function(){
					$rootScope.mqttSubscribe($scope.orgid+"_GatewayConfiguration",100);
					$scope.dataLoadingBaseConnection = true;
					var mesh_id = $scope.selectedRowMesh.id;
					var mesh_name = $scope.selectedRowMesh.name;
					var mesh_network = $scope.selectedRowMesh.network;
					var meshArray = {};
					
					
					if(mesh_id != undefined){
						meshArray.mesh_id = mesh_id;
					}
					if(mesh_name != undefined){
						meshArray.mesh_name = mesh_name;
					}
					if(mesh_network != undefined){
						meshArray.mesh_network = mesh_network;
					}
					var gatewayArray = [];
					angular.forEach($scope.arrGatewayCheckboxSelectionBody,function(gateway){
					gatewayArray.push({"gwid":gateway.id,"ip":gateway.gatewaymeta.staticip,"displayname":gateway.displayname});
					});
					var serverArray = [];
					var operation = "configuration";
					serverArray.push({'serverid':$scope.selectedRowServer.id,'network':$scope.selectedRowServer.mesh_group,'macid':$scope.selectedRowServer.macid});
					//console.log($scope.configuration.azureIOTConfig);
					softwareupdateModuleService.sendGatewayConfiguration(operation,meshArray,serverArray,gatewayArray,$scope.configuration3,$scope.orgid).then(function (response){
					//console.log(response);
						$scope.$on("mqtt_message",function(e,a){
						var adata = a.data.output;
						
						if(adata.length>0){
							$rootScope.$broadcast('configConfirmResponse',{data : adata});
							$scope.dataLoadingBaseConnection = false;
							
						}
						});
					});
				}
				$scope.usbConnection = function(){
					$rootScope.mqttSubscribe($scope.orgid+"_GatewayConfiguration",100);
					$scope.dataLoadingUsbConnection = true;
					var mesh_id = $scope.selectedRowMesh.id;
					var mesh_name = $scope.selectedRowMesh.name;
					var mesh_network = $scope.selectedRowMesh.network;
					var meshArray = {};
					
					
					if(mesh_id != undefined){
						meshArray.mesh_id = mesh_id;
					}
					if(mesh_name != undefined){
						meshArray.mesh_name = mesh_name;
					}
					if(mesh_network != undefined){
						meshArray.mesh_network = mesh_network;
					}
					var gatewayArray = [];
					angular.forEach($scope.arrGatewayCheckboxSelectionBody,function(gateway){
					gatewayArray.push({"gwid":gateway.id,"ip":gateway.gatewaymeta.staticip,"displayname":gateway.displayname});
					});
					var serverArray = [];
					var operation = "configuration";
					serverArray.push({'serverid':$scope.selectedRowServer.id,'network':$scope.selectedRowServer.mesh_group,'macid':$scope.selectedRowServer.macid});
					//console.log($scope.configuration.azureIOTConfig);
					softwareupdateModuleService.sendGatewayConfiguration(operation,meshArray,serverArray,gatewayArray,$scope.configuration2,$scope.orgid).then(function (response){
					//console.log(response);
							$scope.$on("mqtt_message",function(e,a){
						var adata = a.data.output;
						if(adata.length>0){
									$rootScope.$broadcast('configConfirmResponse',{data : adata});
									//console.log(response);
									$scope.dataLoadingUsbConnection = false;
								}
					});
					});
				}
				$scope.hubConnection = function(){
					$rootScope.mqttSubscribe($scope.orgid+"_GatewayConfiguration",100);
					$scope.dataLoadingHubConnection = true;
					var mesh_id = $scope.selectedRowMesh.id;
					var mesh_name = $scope.selectedRowMesh.name;
					var mesh_network = $scope.selectedRowMesh.network;
					var meshArray = {};
					
					
					if(mesh_id != undefined){
						meshArray.mesh_id = mesh_id;
					}
					if(mesh_name != undefined){
						meshArray.mesh_name = mesh_name;
					}
					if(mesh_network != undefined){
						meshArray.mesh_network = mesh_network;
					}
					var gatewayArray = [];
					angular.forEach($scope.arrGatewayCheckboxSelectionBody,function(gateway){
					gatewayArray.push({"gwid":gateway.id,"ip":gateway.gatewaymeta.staticip,"displayname":gateway.displayname});
					});
					var serverArray = [];
					var operation = "configuration";
					serverArray.push({'serverid':$scope.selectedRowServer.id,'network':$scope.selectedRowServer.mesh_group,'macid':$scope.selectedRowServer.macid});
					//console.log($scope.configuration.azureIOTConfig);
					softwareupdateModuleService.sendGatewayConfiguration(operation,meshArray,serverArray,gatewayArray,$scope.configuration,$scope.orgid).then(function (response){
					//console.log(response);
					$scope.$on("mqtt_message",function(e,a){
						var adata = a.data.output;
						if(adata.length>0){
									
									console.log(adata);
									$rootScope.$broadcast('configConfirmResponse',{data : adata});
									
									$scope.dataLoadingHubConnection = false;
								}
					});
					
					});
					
				};
				$scope.saveAllOptions = function(){
					$rootScope.mqttSubscribe($scope.orgid+"_GatewayConfiguration",100);
					$scope.dataLoadingsaveAllConnection = true;
					var mesh_id = $scope.selectedRowMesh.id;
					var mesh_name = $scope.selectedRowMesh.name;
					var mesh_network = $scope.selectedRowMesh.network;
					var meshArray = {};
					
					
					if(mesh_id != undefined){
						meshArray.mesh_id = mesh_id;
					}
					if(mesh_name != undefined){
						meshArray.mesh_name = mesh_name;
					}
					if(mesh_network != undefined){
						meshArray.mesh_network = mesh_network;
					}
					var gatewayArray = [];
					angular.forEach($scope.arrGatewayCheckboxSelectionBody,function(gateway){
					gatewayArray.push({"gwid":gateway.id,"ip":gateway.gatewaymeta.staticip,"displayname":gateway.displayname});
					});
					var serverArray = [];
					var operation = "configuration";
					serverArray.push({'serverid':$scope.selectedRowServer.id,'network':$scope.selectedRowServer.mesh_group,'macid':$scope.selectedRowServer.macid});
					$scope.configAll.AzureIoTHubConfiguration = $scope.configuration.AzureIoTHubConfiguration;
					$scope.configAll.usbConfiguration = $scope.configuration2.usbConfiguration;
					$scope.configAll.baseurlConfiguration = $scope.configuration3.baseurlConfiguration;
					$scope.configAll.baseurlConfiguration = $scope.configuration3.baseurlConfiguration;
					$scope.configAll.CloudConnectivityConfiguration = $scope.configuration4.CloudConnectivityConfiguration;
					softwareupdateModuleService.sendGatewayConfiguration(operation,meshArray,serverArray,gatewayArray,$scope.configAll,$scope.orgid).then(function (response){
					//console.log(response);
					$scope.$on("mqtt_message",function(e,a){
						var adata = a.data.output;
						if(adata.length>0){
									
									console.log(adata);
									$rootScope.$broadcast('configConfirmResponse',{data : adata});
									
									$scope.dataLoadingsaveAllConnection = false;
								}
					});
					
					});
				}
				$scope.$on("configConfirmResponse",function(e,a){
				if(a.data !== undefined){
					var socketData = a.data;
					  var modalInstance = $uibModal.open({
					  animation: true,
					  backdrop  : 'static',
					  ariaLabelledBy: 'modal-title',
					  ariaDescribedBy: 'modal-body',
					  templateUrl: 'ConfigResponseContent.html',
					  controller: 'ConfigResponseCtrl',
					  size: 'lg',
					  resolve: {
						dsparam: function () {
						  return socketData;
						}
					  }
					});
		
				}
				});
			}
		});
		
	}
	});

	
});
softwareupdateModule.controller('ConfigResponseCtrl',function($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$mdDialog,$uibModalInstance,toaster,dsparam){
	$scope.socketData = dsparam;
	console.log($scope.socketData);
	var socketData =$scope.socketData;
	$scope.cleargatewayUpdate = function(){
		$uibModalInstance.close();
	}
	
	
});