var softwareupdateModule = angular.module('softwareupdateModule.controllers', ['ui.toggle','rzModule','ui.bootstrap','ngSanitize','ui.multiselect']);

softwareupdateModule.filter('myFilter', function () {  
    return function(inputs,filterValues) {
      var output = [];
      angular.forEach(inputs, function (input) {
        if (filterValues.indexOf(input.id) !== -1)
            output.push(input);
       });
       return output;
   };
});

softwareupdateModule.filter('customServerFilter', function() {
  return function(input, value) {
    var result = [];
	
    input.forEach(function(item){
       
	   if(value.network.indexOf(item.mesh_group) > -1 && value.name == item.mesh){
		//console.log(value.network);
		//console.log(item);   
		result.push(item);
	   }
    });
    return result;
  };
});


softwareupdateModule.controller('provisionCtrl', function ($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$mdDialog,$uibModal,toaster,filterFilter) {

    /*	Data Attribute Initialize Function of Deployment
     Dynamic Generic Function for Initialize Data Attributes
     */
	$rootScope.globals = $cookieStore.get('globals') || {};
	//console.log($rootScope.globals);
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	
	
	
	$scope.returnPlus = function(copies){
		copies = parseInt(copies);
		if(copies <10){
			copies = copies +1;
		}else{
			copies = 1;	
		}
		
		return copies;
	}
	$scope.returnMinus = function(copies){
		copies = parseInt(copies);
		if(copies <= 1){
			copies = 1;
		}else{
			copies = copies -1;	
		}
		
		return copies;
	}
	$scope.filterValue = function($event){
        if(isNaN(String.fromCharCode($event.keyCode))){
            $event.preventDefault();
        }
};
	$scope.refreshFunc = function(){
		//$scope.getServerCall(1);
		$scope.provisionWizard = false;
		$scope.provisionTrashWizard = false;
		$scope.installationWizard = false;
		$scope.upgradationWizard = false;
		$scope.uninstallWizard = false;
		$scope.serverSelection('OFF');
	};
	
	$scope.INSTALLATIONPACKAGES = function(){
			$scope.provisionWizard = false;
			$scope.provisionTrashWizard = false;
			$scope.upgradationWizard = false;
			$scope.installationWizard = true;
			$scope.uninstallWizard = false;
			$scope.meshSelection('ON');
			
	}
	$scope.UPGRADATIONPACKAGES = function(){
			$scope.provisionWizard = false;
			$scope.provisionTrashWizard = false;
			$scope.installationWizard = false;
			$scope.upgradationWizard = true;
			$scope.uninstallWizard = false;
			$scope.serverSelection('OFF');
	}
	$scope.UNINSTALLPACKAGES = function(){
			$scope.provisionWizard = false;
			$scope.provisionTrashWizard = false;
			$scope.installationWizard = false;
			$scope.upgradationWizard = false;
			$scope.uninstallWizard = true;
			$scope.serverSelection('OFF');
	}
	
	$scope.provisionGatewayFunction = function(){
			$scope.provisionWizard = true;
			$scope.provisionTrashWizard = false;
			$scope.installationWizard = false;
			$scope.upgradationWizard = false;
			$scope.uninstallWizard = false;
			$scope.serverSelection('OFF');
	}
	$scope.provisionTrashFunction = function(){
			$scope.provisionWizard = false;
			$scope.provisionTrashWizard = true;
			$scope.installationWizard = false;
			$scope.upgradationWizard = false;
			$scope.uninstallWizard = false;
			$scope.serverSelection('OFF');
	}
	$scope.provisionWizardmesh = function(){
			$scope.provisionWizardmeshSelection = 'ON';
			$scope.provisionWizardserverSelection = 'OFF';
			$scope.provisionWizardgatewaySelection = 'OFF';
			$scope.provisionWizarddockerSelection = 'OFF';
			$scope.provisionWizardconfigureSelection = 'OFF';
			$scope.provisionWizardconfirmSelection = "OFF";
	}
	$scope.provisionWizardServer = function(){
				$scope.provisionWizardmeshSelection = 'OFF';
				$scope.provisionWizardserverSelection = 'ON';
				$scope.provisionWizardgatewaySelection = 'OFF';
				$scope.provisionWizarddockerSelection = 'OFF';
				$scope.provisionWizardconfigureSelection = 'OFF';
				$scope.provisionWizardconfirmSelection = "OFF";
	};
	$scope.provisionWizardGateway = function(){
				$scope.provisionWizardmeshSelection = 'OFF';
				$scope.provisionWizardserverSelection = 'OFF';
				$scope.provisionWizardgatewaySelection = 'ON';
				$scope.provisionWizarddockerSelection = 'OFF';
				$scope.provisionWizardconfigureSelection = 'OFF';
				$scope.provisionWizardconfirmSelection = "OFF";
	};
	$scope.provisionWizardDocker = function(){
				$scope.provisionWizardmeshSelection = 'OFF';
				$scope.provisionWizardserverSelection = 'OFF';
				$scope.provisionWizardgatewaySelection = 'OFF';
				$scope.provisionWizarddockerSelection = 'ON';
				$scope.provisionWizardconfigureSelection = 'OFF';
				$scope.provisionWizardconfirmSelection = "OFF";
	};
	$scope.provisionWizardConfiguration = function(){
				$scope.provisionWizardmeshSelection = 'OFF';
				$scope.provisionWizardserverSelection = 'OFF';
				$scope.provisionWizardgatewaySelection = 'OFF';
				$scope.provisionWizarddockerSelection = 'OFF';
				$scope.provisionWizardconfigureSelection = 'ON';
				$scope.provisionWizardconfirmSelection = "OFF";
	}
	$scope.provisionTrashWizardMesh = function(){
				$scope.provisionTrashWizardmeshSelection = 'ON';
				$scope.provisionTrashWizardserverSelection = 'OFF';
				$scope.provisionTrashWizardgatewaySelection = 'OFF';
				$scope.provisionTrashWizardconfirmSelection = 'OFF';
	};
	$scope.provisionTrashWizardServer = function(){
				
				$scope.provisionTrashWizardserverSelection = 'ON';
				$scope.provisionTrashWizardgatewaySelection = 'OFF';
				$scope.provisionTrashWizardmeshSelection = 'OFF';
				$scope.provisionTrashWizardconfirmSelection = 'OFF';
	};
	$scope.provisionTrashWizardGateway = function(){
				$scope.provisionTrashWizardserverSelection = 'OFF';
				$scope.provisionTrashWizardgatewaySelection = 'ON';
				$scope.provisionTrashWizardmeshSelection = 'OFF';
				$scope.provisionTrashWizardconfirmSelection = 'OFF';
	}
	$scope.provisionTrashWizardConfirm = function(){
				$scope.provisionTrashWizardserverSelection = 'OFF';
				$scope.provisionTrashWizardgatewaySelection = 'OFF';
				$scope.provisionTrashWizardmeshSelection = 'OFF';
				$scope.provisionTrashWizardconfirmSelection = 'ON';
				
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
							//console.log($scope.params);
							//alert($scope.currentPackageAppPage);
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
							$scope.getServerCall($scope.currentServerAppPage);	
						};
	};
	$scope.$watch('provisionTrashWizard',function(provisionTrashWizard){
	if(provisionTrashWizard == true){
	
		$scope.provisionTrashWizardMesh();
		$scope.$watch('provisionTrashWizardmeshSelection',function(provisionTrashWizardmeshSelection){
			if(provisionTrashWizardmeshSelection == 'ON'){
				
				
					$scope.getMeshCall(1);
					$scope.nextStepProvisionTrashMesh = function(){
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
								$scope.provisionTrashWizardServer();
							}
					}
			}
		});
		$scope.$watch('provisionTrashWizardserverSelection',function(provisionTrashWizardserverSelection){
			if(provisionTrashWizardserverSelection == 'ON'){
					var params = {"mid":$scope.selectedRowMesh.id};
					
					$scope.getServerCall(1,params);
					$scope.nextStepProvisionTrashServer = function(){
						
						if($scope.selectedRowServer == null)
						{
							 alert = $mdDialog.alert({
							title: 'Please Select Server',
							textContent: 'Please select any one server for next process..!!',
							ok: 'Close'
							});

						  $mdDialog
							.show( alert )
							.finally(function() {
							  alert = undefined;
							});
						}else{
							
							
							$scope.provisionTrashWizardGateway();
						}
					};
			}
		});
		$scope.$watch('provisionTrashWizardgatewaySelection',function(provisionTrashWizardgatewaySelection){
			if(provisionTrashWizardgatewaySelection == 'ON'){
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
											//console.log($scope.totalItems);
											
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
												var idx2 = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelectionBody,gateway);
												$scope.arrGatewayCheckboxSelection.splice(idx,1);
												$scope.arrGatewayCheckboxSelectionBody.splice(idx2,1);
											}
									   });
									};
									
							$scope.selectedRow1 = null;
							$scope.setClickedRowGateway = function(index,gateway){
								$scope.selectedRow1 = index;
								$scope.selectedRowGateway = gateway;
									var idx = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelection,gateway.id);
									var idx2 = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelectionBody,gateway);
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
							$scope.nextStepProvisionTrashGateway = function(){
								if($scope.arrGatewayCheckboxSelection.length == 0)
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
									$scope.provisionTrashWizardConfirm();
								}
							}
			}
		});
		$scope.$watch('provisionTrashWizardconfirmSelection',function(provisionTrashWizardconfirmSelection){
			if(provisionTrashWizardconfirmSelection == 'ON'){
				$scope.nextStepProvisionTrashData = function(){
						var gateways = [];
						var meshArray = {};
						var serverArray = [];
						$scope.dataDeviceLoadingProvisionTrash = true;
						$rootScope.mqttSubscribe($scope.orgid+"_GatewayTrash",100);
						angular.forEach($scope.arrGatewayCheckboxSelectionBody,function(gateway,index){
						gateways.push({"gwid":gateway.id,"ip":gateway.gatewaymeta.staticip,"displayname":gateway.displayname});	
						});
						
						var mesh_id = $scope.selectedRowMesh.id;
						var mesh_name = $scope.selectedRowMesh.name;
						var mesh_network = $scope.selectedRowMesh.network;
						if(mesh_id != undefined){
							meshArray.mesh_id = mesh_id;
							meshArray.mesh_name = mesh_name;
							meshArray.mesh_network = mesh_network;
						}
						
						var serverid  =$scope.selectedRowServer.id;
						var server_network = $scope.selectedRowServer.mesh_group;
						var macid = $scope.selectedRowServer.macid;
						if(serverid != undefined){
							serverArray.push({"serverid":serverid,"network":server_network,"macid":macid});
						}
						
					
						var responseData;
						waitingDialog.show('Operation in progress, this can take some time. Please Wait and do not reload the page...',{
						  headerText: 'Please Wait...',
									dialogSize: 'lg',
									progressType: 'success'
						  });
						softwareupdateModuleService.trashProvision(meshArray,gateways,serverArray).then(function(response){
							$scope.$on("mqtt_message",function(e,a){
								//console.log(a);
								if(a.data.operation == 'docker_delete'){
									responseData = a.data;
									$scope.dataDeviceLoadingProvisionTrash = false;
									var modalInstance = $uibModal.open({
										  animation: true,
										  backdrop  : 'static',
										  ariaLabelledBy: 'modal-title',
										  ariaDescribedBy: 'modal-body',
										  templateUrl: 'ResponseRemoveContent.html',
										  controller: 'ResponseRemoveCtrl',
										  size: 'lg',
										  resolve: {
											dsparam: function () {
											 return {'responseData':responseData};
											}
										  }
									});
									waitingDialog.hide();
									$state.reload();
								}
							});
							
						});
						//responseData = {"operation": "docker_delete","output":[{"dockerName": "Samsung_Artik_4-snapbricks-8046","gwid": "ra","dockerCreatedId": "5248e34a31211a5575c07a77c8ebc1575d7793f7c6d3e30b27a43fa6e21cca72","status": "1","boardID": "123","boardIP": "10.115.2.12"},{"dockerName": "Samsung_Artik_2-snapbricks-8045","gwid": "adada","dockerCreatedId": "5248e34a31211a5575c07a77c8ebc1575d7793f7c6d3e30b27a43fa6e21cca72","status": "1","boardID": "123","boardIP": "10.115.2.12"}]};
						
						
						
				}
			}
		});
	}
	});
	
	$scope.$watch('provisionWizard',function(provisionWizard){
		if(provisionWizard == true){
			
			$scope.provisionWizardmesh();
			$scope.$watch('provisionWizardmeshSelection',function(provisionWizardmeshSelection){
				if(provisionWizardmeshSelection == 'ON'){
					
					$scope.getMeshCall(1);
					$scope.nextStepProvisionMesh = function(){
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
								$scope.provisionWizardServer();
							}
					}
				}
			});
			$scope.$watch('provisionWizardserverSelection',function(provisionWizardserverSelection){
				if(provisionWizardserverSelection == 'ON'){
					
					var params = {"mid":$scope.selectedRowMesh.id};
					$scope.getServerCall(1,params);
					$scope.nextStepProvisionServer = function(){
						if($scope.selectedRowServer == null)
						{
							 alert = $mdDialog.alert({
							title: 'Please Select Server',
							textContent: 'Please select any one server for next process..!!',
							ok: 'Close'
							});

						  $mdDialog
							.show( alert )
							.finally(function() {
							  alert = undefined;
							});
						}else{
							
							
							$scope.provisionWizardGateway();
						}
					};
				}
			});
			
			$scope.$watch('provisionWizardgatewaySelection',function(provisionWizardgatewaySelection){
				if(provisionWizardgatewaySelection == 'ON'){
					$scope.arrGatewayProvision = [];
					var params = {"mid":$scope.selectedRowMesh.id,"network":$scope.selectedRowServer.ansibleserver_network};
					$scope.getDataGateway = function(pageno,params){
				  
						$scope.gatewayList = [];
						$scope.currentGatewayPage = pageno;
						$scope.gatewayPerPage = ENV.recordPerPage;
						$scope.dataLoading = true;
						softwareupdateModuleService.autogatewayData(pageno,params).then(function (data) {
							
							$timeout(function(){
							$scope.dataLoading = false;	
							
							//console.log(data.Data);
							if(data.Data != undefined){
									$scope.gatewayList = data.Data;
											

									$scope.totalItems =  data.total_records;
									//console.log($scope.gatewayList);
									
							}else{
									$scope.totalItems = 0;
							}
							 
							
														
							$scope.selectedRow1 = null;
							$scope.setClickedRowGateway = function(index,gateway){
								$scope.selectedRow1 = index;
								$scope.selectedRowGateway = gateway;
									var idx = $scope.arrayObjectIndexOf($scope.arrGatewayProvision,gateway);
								if($scope.arrayObjectIndexOf($scope.arrGatewayProvision,gateway) > -1){
									$scope.arrGatewayProvision.splice(idx,1);
											}else{
												$scope.arrGatewayProvision.push(gateway);
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
								$scope.getDataGateway($scope.currentGatewayPage,$scope.params);	
								
							};
				};
					$scope.getDataGateway(1,params);
					$scope.nextStepProvisionGateway = function(){
							if($scope.arrGatewayProvision.length == 0)
							{
								 alert = $mdDialog.alert({
								title: 'Please Select Board',
								textContent: 'Please select any one board for next process..!!',
								ok: 'Close'
								});

							  $mdDialog
								.show( alert )
								.finally(function() {
								  alert = undefined;
								});
							}else{
							$scope.provisionWizardserverSelection = "OFF";
							$scope.provisionWizardgatewaySelection = "OFF";
							$scope.provisionWizarddockerSelection = "ON";
							$scope.provisionWizardconfirmSelection = "OFF";
							}
					};
				}
			});
			
			$scope.$watch('provisionWizarddockerSelection',function(provisionWizarddockerSelection){
				if(provisionWizarddockerSelection == 'ON'){
					 $scope.arrDockerProvision = [];
					 $scope.arrDockerProvisionBody = [];
					$scope.getDockerAppsCall = function(pageno){
						$scope.DockerApps = [];
						$scope.currentDockerAppPage = pageno;
						$scope.DockerAppPerPage = ENV.recordPerPage;
						$scope.dataDockerAppLoading = true;
					
				softwareupdateModuleService.getDockerApp(pageno).then(function(response){
					
					$timeout(function(){
							//console.log(response);
							$scope.dataDockerAppLoading = false;	
							
							//console.log(data.Data);
							if(response.Data != undefined){
								$scope.DockerApps = response.Data;
								$scope.DockerAppsTotalRecords = response.total_records;
								//alert($scope.packageAppsTotalRecords);
							}else{
								$scope.DockerAppsTotalRecords =0;
							}
							
							
							$scope.selectedRow = null;
								
								$scope.setClickedRowDocker = function(index,DockerApp){
									$scope.selectedRow = index;
									$scope.selectedRowDocker = DockerApp;
									
										var idx = $scope.arrayObjectIndexOf($scope.arrDockerProvision,DockerApp.id);
										var idx2 = $scope.arrayObjectIndexOf($scope.arrDockerProvisionBody,DockerApp);
										
									if($scope.arrayObjectIndexOf($scope.arrDockerProvision,DockerApp.id) > -1){
										$scope.arrDockerProvision.splice(idx,1);
										$scope.arrDockerProvisionBody.splice(idx2,1);
									}else{
										$scope.arrDockerProvision.push(DockerApp.id);
										$scope.arrDockerProvisionBody.push(DockerApp);
									}
								
									
									
								};
								
							
					});		
							
				});	
				$scope.pageChanged4 = function(){
				console.log($scope.currentDockerAppPage);
				$scope.getDockerAppsCall($scope.currentDockerAppPage);	
				};
				};
					$scope.getDockerAppsCall(1);
					$scope.nextStepProvisionDocker = function(){
						if($scope.arrDockerProvision.length == 0)
							{
								 alert = $mdDialog.alert({
								title: 'Please Select Docker',
								textContent: 'Please select any one docker for next process..!!',
								ok: 'Close'
								});

							  $mdDialog
								.show( alert )
								.finally(function() {
								  alert = undefined;
								});
							}else{
						$scope.provisionWizardserverSelection = "OFF";
						$scope.provisionWizardgatewaySelection = "OFF";
						$scope.provisionWizarddockerSelection = "OFF";
						$scope.provisionWizardconfirmSelection = "OFF";
						$scope.provisionWizardconfigureSelection = "ON";
							}
					};
				}
			});
			$scope.$watch('provisionWizardconfigureSelection',function(provisionWizardconfigureSelection){
				if(provisionWizardconfigureSelection == 'ON'){
					$scope.docker_configurations = {};
					$scope.configuration = {};
					$scope.cloud = [];
					$scope.local = [];
					$scope.deploy = [];
					$scope.org = { "url": "EI", "orgid": $scope.orgid}
					$scope.configuration.baseabbr = "EI";
					$scope.configuration.baseabbr1 = "data";
					$scope.configuration.baseurl = "$orgid$";
					$scope.configuration2 = {};
					$scope.configuration2.usbConfiguration = {};
					$scope.configuration.AzureIoTHubConfiguration = {};
					$scope.data = {};
					$scope.data.group = "";
					$scope.gw = {
						"roles":[]
					}
					$scope.AddRecord = function(index, action) {
					if (action == 'cloud') {
						$scope.cloud.push({ "type": "","protocol":"", "username": "", "password": "", "brokerip": ""});
					} else if (action == 'local') {
						$scope.local.push({ "type": "","protocol":"", "username": "", "password": "", "brokerip": ""});
					} else if (action == 'deploy') {
						$scope.deploy.push({ "type": "","protocol":"", "username": "", "password": "", "brokerip": ""});
					}
				}

				$scope.DeleteRecord = function(index, action) {
					if (action == 'cloud') {
						$scope.cloud.splice(index, 1);
					} else if (action == 'local') {
						$scope.local.splice(index, 1);
					} else if (action == 'deploy') {
						$scope.deploy.splice(index, 1);
					}
				}
					/*$scope.getCloudConfiguration = function(){
						$scope.configuration3 = {};
						$scope.configuration4 = {};
						$scope.configuration5 = {};
						$scope.configuration3.baseurlConfiguration = {};
						$scope.configuration3.baseurlConfiguration.baseabbr = "EI";
						$scope.configuration3.baseurlConfiguration.baseurl = "/$orgid$/";
						
						
						$scope.consumer = 1;
						$scope.configuration4.CloudConnectivityConfiguration 		= [{"connectivityid": "1","type": "primary","brokerip": "11.22.33.44","port": 1883,"username": "user123","password": "user123","protocol": "MQTT"},
									   {"connectivityid": "2","type": "secondary","brokerip": "44.55.22.11","port": 5672,"username": "user321","password": "user321","protocol": "AMQP"}

									  ];
						$scope.configuration5.deploymentbrokers 		= [{"connectivityid": "1","type": "primary","brokerip": "11.22.33.44","port": 1883,"username": "user123","password": "user123","protocol": "MQTT"},
									   {"connectivityid": "2","type": "secondary","brokerip": "44.55.22.11","port": 5672,"username": "user321","password": "user321","protocol": "AMQP"}

									  ];			  
					}
					$scope.getCloudConfiguration();
					
					$scope.AddCloudeRecord = function(totallength)
					{
						$scope.configuration4.CloudConnectivityConfiguration.push({});
					}
					$scope.AddDeployRecord = function(totallength)
					{	
						$scope.configuration5.deploymentbrokers.push({});
					}
					$scope.DeleteCloudeRecord = function(index)
					{
						$scope.configuration4.CloudConnectivityConfiguration.splice(index, 1);
					}
					$scope.DeleteDeploymentRecord = function(index){
						$scope.configuration5.deploymentbrokers.splice(index, 1);
					}*/
					
					$scope.nextStepProvisionConfiguration = function(){
						
						
						$scope.docker_configurations.baseurl = $scope.org.url;
						$scope.docker_configurations.orgid = $scope.orgid;
						$scope.docker_configurations.cloudbrokers = $scope.cloud;
						$scope.docker_configurations.deploymentbrokers = $scope.deploy;
						$scope.docker_configurations.localbrokers = $scope.local;
						
						
						$scope.docker_configurations.noofusbs = $scope.configuration2.usbConfiguration.noofusbs;
						$scope.docker_configurations.azureConnectivity = {};
						$scope.docker_configurations.azureConnectivity.IoTHubName = $scope.configuration.AzureIoTHubConfiguration.IoTHubName;
						$scope.docker_configurations.azureConnectivity.SecondaryConnectionString = $scope.configuration.AzureIoTHubConfiguration.SecondaryConnectionString;
						$scope.docker_configurations.azureConnectivity.PrimaryConnectionString = $scope.configuration.AzureIoTHubConfiguration.PrimaryConnectionString;
						$scope.docker_configurations.mode = $scope.data.group;
						
						$scope.provisionWizardserverSelection = "OFF";
						$scope.provisionWizardgatewaySelection = "OFF";
						$scope.provisionWizarddockerSelection = "OFF";
						$scope.provisionWizardconfigureSelection = "OFF";
						$scope.provisionWizardconfirmSelection = "ON";
					}
				}
			});
			
			$scope.$watch('provisionWizardconfirmSelection',function(provisionWizardconfirmSelection){
				if(provisionWizardconfirmSelection == 'ON'){
					
					$scope.nextStepProvisionData = function(){
						$rootScope.mqttSubscribe($scope.orgid+"_GatewayProvisioning",100);
						 waitingDialog.show('Operation in progress, this can take some time. Please Wait and do not reload the page...',{
						  headerText: 'Please Wait...',
									dialogSize: 'lg',
									progressType: 'success'
						  });
						$scope.dataDeviceLoadingProvision = true;
						//$scope.selectedRowServer;
						//$scope.arrGatewayProvision;
						//$scope.arrDockerProvision;
						$scope.postprovisiondata = [];
						var meshArray = {};
						if($scope.selectedRowMesh.id != undefined){
							meshArray.mesh_id = $scope.selectedRowMesh.id;
							meshArray.mesh_name = $scope.selectedRowMesh.name;
							meshArray.mesh_network = $scope.selectedRowMesh.network;
							
						}
						var dockerArray = [];
							angular.forEach($scope.arrDockerProvisionBody,function(docker,dockerIndex){
							dockerArray.push({'id':docker.id,'count':docker.copies});
							});
						angular.forEach($scope.arrGatewayProvision,function(gateway,index){
							$scope.postprovisiondata[index] = {};
							$scope.postprovisiondata[index].id = gateway.id;
							$scope.postprovisiondata[index].name = gateway.name;
							$scope.postprovisiondata[index].macid = gateway.macid;
							$scope.postprovisiondata[index].ip = gateway.ip;
							$scope.postprovisiondata[index].username = gateway.username;
							$scope.postprovisiondata[index].password = gateway.password;
							$scope.postprovisiondata[index].architecture = gateway.architecture;
							$scope.postprovisiondata[index].vendor = gateway.vendor;
							$scope.postprovisiondata[index].status = "NEW";
							$scope.postprovisiondata[index].orgid = $scope.orgid;
							$scope.postprovisiondata[index].mesh_name = gateway.mesh;
							$scope.postprovisiondata[index].mesh_network = gateway.mesh_group;
				
						});
						var serverArray = [];
						serverArray.push({"serverid":$scope.selectedRowServer.id,"network":$scope.selectedRowServer.mesh_group});
						
						//alert(JSON.stringify($scope.postprovisiondata));
						softwareupdateModuleService.postProvision(meshArray,$scope.postprovisiondata,dockerArray,serverArray,$scope.docker_configurations).then(function(response){
							//SocketCollection = $scope.SocketData.collection;
							//$scope.jobid = response.message.JOBID;
							$scope.macDetails = [];
							$scope.passwordDetails = [];
							$scope.dockerDetails = [];
							$scope.$on("mqtt_message",function(e,a){
								//console.log(a);
								
								if(a.data.operation == 'mac_resolution'){
									//toaster.pop('success','',"");
									$scope.macDetails  = a.data.output;
									var lengthMac = $scope.macDetails.length;
									angular.forEach($scope.macDetails,function(mac,index){
										$scope.macStatus = true;
										if(mac.status != 200 && lengthMac ==1 ){
											$scope.macStatus = false;
										}
									});
									
									
									$scope.modalInstanceMac = $uibModal.open({
										  animation: true,
										  backdrop  : 'static',
										  ariaLabelledBy: 'modal-title',
										  ariaDescribedBy: 'modal-body',
										  templateUrl: 'ResponseDockerContent.html',
										  controller: 'ResponseDockerCtrl',
										  size: 'lg',
										  resolve: {
											dsparam: function () {
											 return {'dockerDetails':[],'passwordDetails' :[],'macDetails' :$scope.macDetails};
											}
										  }
									});
								}
								if(a.data.operation == 'change_password'){
									$scope.passwordDetails = a.data.output;
									
									
									
										if($scope.modalInstanceMac != undefined){
										$scope.modalInstanceMac.close();	
										}
									
									$scope.modalInstanceChangePassword = $uibModal.open({
										  animation: true,
										  backdrop  : 'static',
										  ariaLabelledBy: 'modal-title',
										  ariaDescribedBy: 'modal-body',
										  templateUrl: 'ResponseDockerContent.html',
										  controller: 'ResponseDockerCtrl',
										  size: 'lg',
										  resolve: {
											dsparam: function () {
											 return {'dockerDetails':[],'passwordDetails' :$scope.passwordDetails,'macDetails' :[]};
											}
										  }
									});
								}
								if(a.data.operation == 'docker_create'){
									$scope.dockerDetails = a.data.output;
									if($scope.modalInstanceChangePassword != undefined){
										$scope.modalInstanceChangePassword.close();	
									}
									
									
									var modalInstance = $uibModal.open({
										  animation: true,
										  backdrop  : 'static',
										  ariaLabelledBy: 'modal-title',
										  ariaDescribedBy: 'modal-body',
										  templateUrl: 'ResponseDockerContent.html',
										  controller: 'ResponseDockerCtrl',
										  size: 'lg',
										  resolve: {
											dsparam: function () {
											 return {'dockerDetails':$scope.dockerDetails,'passwordDetails' :$scope.passwordDetails,'macDetails' :$scope.macDetails};
											}
										  }
									});
									waitingDialog.hide();
									$scope.dataDeviceLoadingProvision = false;
									$rootScope.mqttUnsubscribe($scope.orgid+"_GatewayProvisioning");
									$scope.refreshFunc();
								}
								if($scope.macStatus == false){
									waitingDialog.hide();
									$scope.dataDeviceLoadingProvision = false;
									$scope.refreshFunc();
								}
							});
							
						}).catch(function(error){
							waitingDialog.hide();
							$scope.dataDeviceLoadingProvision = false;
						});
					};
				}
			});
			
		};
	});
	/*  Code for Steps after assigning portion - Start */
	
	$scope.$watch('upgradationWizard',function(upgradationWizard){
			if(upgradationWizard == true){
				$scope.upgradationMeshSelection = function(){
					$scope.upgradationMeshOption = 'ON';
					$scope.upgradationServerOption = 'OFF';
					$scope.upgradationGatewayOption = 'OFF';
					$scope.upgradationAppOption = 'OFF';
					$scope.upgradationConfirmOption = 'OFF';
				}
				$scope.upgradationServerSelection = function(){
					$scope.upgradationMeshOption = 'OFF';
					$scope.upgradationServerOption = 'ON';
					$scope.upgradationGatewayOption = 'OFF';
					$scope.upgradationAppOption = 'OFF';
					$scope.upgradationConfirmOption = 'OFF';
				}
				
				$scope.upgradationAppSelection = function(){
					$scope.upgradationMeshOption = 'OFF';
					$scope.upgradationAppOption = 'ON';
					$scope.upgradationServerOption = 'OFF';
					$scope.upgradationGatewayOption = 'OFF';
					$scope.upgradationConfirmOption = 'OFF';
				}
				$scope.upgradationGatewaySelection = function(){
					$scope.upgradationMeshOption = 'OFF';
					$scope.upgradationGatewayOption = 'ON';
					$scope.upgradationServerOption = 'OFF';
					$scope.upgradationAppOption = 'OFF';
					$scope.upgradationConfirmOption = 'OFF';
				}
				$scope.upgradationConfirmSelection = function(){
					$scope.upgradationMeshOption = 'OFF';
					$scope.upgradationGatewayOption = 'OFF';
					$scope.upgradationServerOption = 'OFF';
					$scope.upgradationAppOption = 'OFF';
					$scope.upgradationConfirmOption = 'ON';
				}
				$scope.upgradationMeshSelection();
				$scope.$watch('upgradationMeshOption',function(upgradationMeshOption){
				if(upgradationMeshOption == 'ON'){
					
					$scope.getMeshCall(1);
					$scope.nextStepUpgradationMesh = function(){
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
								$scope.upgradationServerSelection();
								
							}
					};
				}
				});
				$scope.$watch('upgradationServerOption',function(upgradationServerOption){
					if(upgradationServerOption == 'ON'){
						$scope.arrServerCheckboxSelection = [];
						$scope.arrServerCheckboxSelectionBody = [];
						var params = {"mid":$scope.selectedRowMesh.id};
						$scope.getServerCall = function(pageno,params){
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
							$scope.selectedAll = "";
							$scope.checkAllSoftwareServer = function (selectedAll) {
								
											$scope.selectedAll = selectedAll;
											if ($scope.selectedAll) {
												$scope.selectedAll = true;
											} else {
												$scope.selectedAll = false;
											}
											
										   angular.forEach($scope.ServerApps, function (serverApp) {
											 
												if($scope.selectedAll == true){
													$scope.arrServerCheckboxSelection.push(serverApp.id);
													$scope.arrServerCheckboxSelectionBody.push(serverApp);
												}else{
													var idx = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id);
													$scope.arrServerCheckboxSelection.splice(idx,1);
													var idx2 = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelectionBody,serverApp);
													$scope.arrServerCheckboxSelectionBody.splice(idx2,1);
												}
										   });
										};
							
							$scope.selectedRow3 = null;
								
								$scope.setClickedRowServer = function(index,serverApp){
									$scope.selectedRow3 = index;
									$scope.selectedRowServer = serverApp;
									//$scope.selectedPackages[packageInstall.id] =true;
										var idx = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id);
										var idx2 = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelectionBody,serverApp);
									if($scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id) > -1){
										$scope.arrServerCheckboxSelection.splice(idx,1);
										$scope.arrServerCheckboxSelectionBody.splice(idx2,1);
									}else{
										$scope.arrServerCheckboxSelection.push(serverApp.id);
										$scope.arrServerCheckboxSelectionBody.push(serverApp);
									}
								
									
									
								};
								
							$scope.checkStatus= function(serverApp) {
							
							 serverApp.ServerAppSelected = !serverApp.ServerAppSelected;
						};	
					});		
							
				});	
				$scope.pageChanged = function(){
				//console.log($scope.params);
				//alert($scope.currentPackageAppPage);
				$scope.getServerCall($scope.currentServerAppPage,params);	
				};
			};
						$scope.getServerCall(1,params);
						$scope.nextStepUpgradationServer = function(){
							if($scope.arrServerCheckboxSelectionBody.length == 0)
							{
								 alert = $mdDialog.alert({
								title: 'Please Select Server',
								textContent: 'Please select any one server for next process..!!',
								ok: 'Close'
								});

							  $mdDialog
								.show( alert )
								.finally(function() {
								  alert = undefined;
								});
							}else{
								$scope.upgradationAppSelection();
								
							}
						}
					}
				});
				$scope.$watch('upgradationAppOption',function(upgradationAppOption){
					if(upgradationAppOption == 'ON'){
						
				
					$scope.arrCheckboxSelection = [];
					$scope.arrCheckboxSelectionBody = [];
					$scope.getAppsCall = function(pageno,params){
						$scope.packageApps = [];
						$scope.currentPackageAppPage = pageno;
						$scope.packageAppPerPage = ENV.recordPerPage;
						$scope.dataPackageAppLoading = true;
					
				softwareupdateModuleService.getLatestApps(pageno,params).then(function(response){
					
					$timeout(function(){
							//console.log(response);
							$scope.dataPackageAppLoading = false;	
							
							//console.log(data.Data);
							if(response.Data != undefined){
								
								$scope.packageApps = response.Data;
								$scope.packageAppsTotalRecords = response.total_records;
								//alert($scope.packageAppsTotalRecords);
							}else{
								$scope.packageAppsTotalRecords =0;
							}
							
							
							$scope.selectedRow = null;
								
								$scope.setClickedRowPackage = function(index,packageInstall){
									$scope.selectedRow = index;
									$scope.selectedRowPackage = packageInstall;
									//$scope.selectedPackages[packageInstall.id] =true;
									
									
									
								};
								
							$scope.checkStatus= function(packageInstall) {
							
							 packageInstall.packageInstallSelected = !packageInstall.packageInstallSelected;
						};	
					});		
							
				});	
					$scope.pageChanged4 = function(){
				//	console.log($scope.currentPackageAppPage);
					$scope.getAppsCall($scope.currentPackageAppPage,params);	
					};
					
				};
					
					$scope.responseVersion = function(index,packageInstall) {
					
					if (packageInstall.newversion.appid != undefined) {
							//console.log("Selected Device Info :");
							//console.log(device);
							
							
							if($scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageInstall.packageName) > -1)
							{
								//alert("Already Exists....!!!")
							}else{
								$scope.arrCheckboxSelection.push(packageInstall.packageName);
								$scope.arrCheckboxSelectionBody.push(packageInstall);
							}
						}
						console.log($scope.arrCheckboxSelectionBody);
						
					};
					$scope.alreadyExists=function(packageInstall)
					{
						
						if($scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageInstall.packageName) > -1)
						{
							
							console.log("Already ....!!!!");
							return true;
						}
						else{
							return false;
						}
					}
					$scope.removePackage = function(packageInstall){
					//$scope.tags;
					//console.log("removed");
						var idx = $scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageInstall.id);
						$scope.arrCheckboxSelection.splice(idx,1); 
						var idx2 = $scope.arrayObjectIndexOf($scope.arrCheckboxSelectionBody,packageInstall);
						$scope.arrCheckboxSelectionBody.splice(idx2,1); 
					};
					var object4App = 'apps';
					var object4fields = {fields:'packageType,version',architecture:'all'};
					$scope.responseFilters = [];
					softwareupdateModuleService.getFilterDetail(object4App,object4fields).then(function(response){
						$scope.responseFilters = response.Data;
					});
					$scope.params = {arch:'all'};
					$scope.funcFilterSearch = function(appType,appVersion){
						if(appType !== undefined && appType !== null){
							//alert(appType);
							$scope.params.packagetype = appType;
						}else{
							 delete $scope.params.packagetype;
						}
						if(appVersion !== undefined && appVersion !== null){
							//alert(appVersion);
							$scope.params.version = appVersion;
						}else{
							 delete $scope.params.version;
						}
						$scope.getAppsCall(1,$scope.params);
					};
					$scope.getAppsCall(1,$scope.params);
						$scope.nextStepupgradeWizardApp = function(){
							//console.log($scope.arrCheckboxSelectionBody);
							if($scope.arrCheckboxSelectionBody.length == 0)
							{
								 alert = $mdDialog.alert({
								title: 'Please Select App',
								textContent: 'Please select any one app for next process..!!',
								ok: 'Close'
								});

							  $mdDialog
								.show( alert )
								.finally(function() {
								  alert = undefined;
								});
							}else{
								$scope.upgradationGatewaySelection();
								
							}
						}
					}
				});
	
				$scope.$watch('upgradationGatewayOption',function(upgradationGatewayOption){
					if(upgradationGatewayOption == 'ON'){
							var meshid = $scope.selectedRowMesh.id;
							$scope.arrGatewayCheckboxSelection = [];
							$scope.arrGatewayCheckboxSelectionBody = [];
							//console.log($scope.allarrays);
							 $scope.getDataGateway = function(meshid,pageno){
							  
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
													

											$scope.totalItems =  $scope.gatewayList.length;
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
										$scope.getDataGateway(meshid,$scope.currentGatewayPage,params);	
										
									};
							};
							//var params = {'appid':$scope.arrCheckboxSelection};
							$scope.getDataGateway(meshid,1);
							$scope.nextStepupgradeWizardGateway = function(){
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
									$scope.upgradationConfirmSelection();
								}
							}
							$scope.nextStepupgradeWizardAllGateway = function(){
								
									$scope.upgradationConfirmSelection();
								
							}
					};
				});
				
				$scope.$watch('upgradationConfirmOption',function(upgradationConfirmOption){
				if(upgradationConfirmOption == 'ON'){
					
					$scope.confirmSaveUpgradeWizard = function(){
						$scope.dataDeviceLoadingUpgrade = true;
	
						$rootScope.mqttSubscribe($scope.orgid+"_AutoDeployment_upgrade_app",100);
						if($scope.arrServerCheckboxSelectionBody.length<=0 && $scope.arrCheckboxSelectionBody.length<=0 && $scope.arrGatewayCheckboxSelectionBody.length<=0 && $scope.selectedRowMesh != undefined){
							toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
						}else{
							
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
							var appArray = [];
							console.log($scope.arrCheckboxSelectionBody);
							angular.forEach($scope.arrCheckboxSelectionBody,function(app){
								
								appArray.push({"id":app.newversion.appid,"version":app.newversion.appversion,"packageName":app.packageName,"packageType":app.packageType,"architecture":app.architecture,"ServerDetails":app.newversion.ServerDetails});
									
								
							});
							var gatewayArray = [];
							angular.forEach($scope.arrGatewayCheckboxSelectionBody,function(gateway){
								var appids = [];
								angular.forEach($scope.arrCheckboxSelectionBody, function(app){
									var packageName = app.packageName;
									angular.forEach(app.version,function(appVersion){
										appids.push({"installedPackageId":appVersion.appid,"installedPackageVersion":appVersion.appversion,"packageName":packageName,"upgradePackageId":app.newversion.appid,"upgradePackageVersion":app.newversion.appversion,"upgradecondition":"Versions"});
									});
									
								});
								
							gatewayArray.push({"gwid":gateway.id,"ip":gateway.gatewaymeta.staticip,"displayname":gateway.displayname,"upgradepackages":appids});
															
							});
							var serverArray = [];
							angular.forEach($scope.arrServerCheckboxSelectionBody,function(serverApp){
							serverArray.push({'serverid':serverApp.id,'network':serverApp.mesh_group,'macid':serverApp.macid});
							});
							
							//alert(JSON.stringify($scope.arrCheckboxSelectionBody));
							
							var responseData;
							softwareupdateModuleService.ConfirmUpgradeDeployment(meshArray,serverArray,gatewayArray,appArray).then(function(data){
								//toaster.pop("success","","Successfully Upgrade Deployment..!!!");
								//$scope.dataDeviceLoadingUpgrade = false;
								$scope.$on("mqtt_message",function(e,a){
									console.log(a);
									//console.log(a.data.operation);
									//console.log("==============================");
									//console.log(a.operation);
									if(a.data.operation == 'upgrade_apps'){
										responseData = a.data;
										$scope.dataDeviceLoadingUpgrade = false;
										var modalInstance = $uibModal.open({
											  animation: true,
											  backdrop  : 'static',
											  ariaLabelledBy: 'modal-title',
											  ariaDescribedBy: 'modal-body',
											  templateUrl: 'ResponseUpdateContent.html',
											  controller: 'ResponseUpdateCtrl',
											  size: 'lg',
											  resolve: {
												dsparam: function () {
												 return {'responseData':responseData};
												}
											  }
										});
										$state.reload();
									}
								});
							});
						}
					}
				}
				});
			};
	});
	
	$scope.$watch('uninstallWizard',function(uninstallWizard){
		if(uninstallWizard == true){
			$scope.uninstallWizardMesh = function(){
				$scope.uninstallWizardMeshSelection = 'ON';
				$scope.uninstallWizardGatewaySelection = 'OFF';
				$scope.uninstallWizardServerSelection = 'OFF';
				$scope.uninstallWizardAppSelection = 'OFF';
				$scope.uninstallWizardConfirmSelection = 'OFF';
			}
			$scope.uninstallWizardServer = function(){
				$scope.uninstallWizardMeshSelection = 'OFF';
				$scope.uninstallWizardGatewaySelection = 'OFF';
				$scope.uninstallWizardServerSelection = 'ON';
				$scope.uninstallWizardAppSelection = 'OFF';
				$scope.uninstallWizardConfirmSelection = 'OFF';
			}
			$scope.uninstallWizardGateway = function(){
				$scope.uninstallWizardMeshSelection = 'OFF';
				$scope.uninstallWizardGatewaySelection = 'ON';
				$scope.uninstallWizardServerSelection = 'OFF';
				$scope.uninstallWizardAppSelection = 'OFF';
				$scope.uninstallWizardConfirmSelection = 'OFF';
				
			}
			$scope.uninstallWizardApp = function(){
				$scope.uninstallWizardAppSelection = 'ON';
				$scope.uninstallWizardMeshSelection = 'OFF';
				$scope.uninstallWizardGatewaySelection = 'OFF';
				$scope.uninstallWizardServerSelection = 'OFF';
				$scope.uninstallWizardConfirmSelection = 'OFF';
			}
			$scope.uninstallWizardConfirm = function(){
				$scope.uninstallWizardConfirmSelection ='ON';
				$scope.uninstallWizardMeshSelection = 'OFF';
				$scope.uninstallWizardServerSelection = 'OFF';
				$scope.uninstallWizardAppSelection = 'OFF';
				$scope.uninstallWizardGatewaySelection = 'OFF';
			}
			$scope.uninstallWizardMesh();
			$scope.$watch('uninstallWizardMeshSelection',function(uninstallWizardMeshSelection){
				if(uninstallWizardMeshSelection == 'ON'){
					$scope.getMeshCall(1);
					$scope.nextStepUninstallMesh = function(){
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
								$scope.uninstallWizardServer();
								
							}
					};
				}
			});
			$scope.$watch('uninstallWizardServerSelection',function(uninstallWizardServerSelection){
				if(uninstallWizardServerSelection == 'ON'){
					$scope.arrServerCheckboxSelection = [];
					$scope.arrServerCheckboxSelectionBody = [];
					var params = {"mid":$scope.selectedRowMesh.id};
					$scope.getServerCall = function(pageno,params){
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
							$scope.selectedAll = "";
							$scope.checkAllSoftwareServer = function (selectedAll) {
								
											$scope.selectedAll = selectedAll;
											if ($scope.selectedAll) {
												$scope.selectedAll = true;
											} else {
												$scope.selectedAll = false;
											}
											
										   angular.forEach($scope.ServerApps, function (serverApp) {
											 
												if($scope.selectedAll == true){
													$scope.arrServerCheckboxSelection.push(serverApp.id);
												}else{
													var idx = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id);
													$scope.arrServerCheckboxSelection.splice(idx,1);
												}
										   });
										};
							
							$scope.selectedRow3 = null;
								
								$scope.setClickedRowServer = function(index,serverApp){
									$scope.selectedRow3 = index;
									$scope.selectedRowServer = serverApp;
									//$scope.selectedPackages[packageInstall.id] =true;
										var idx = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id);
										var idx2 = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelectionBody,serverApp);
									if($scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id) > -1){
										$scope.arrServerCheckboxSelection.splice(idx,1);
										$scope.arrServerCheckboxSelectionBody.splice(idx2,1);
									}else{
										$scope.arrServerCheckboxSelection.push(serverApp.id);
										$scope.arrServerCheckboxSelectionBody.push(serverApp);
									}
								
									
									
								};
								
							$scope.checkStatus= function(serverApp) {
							
							 serverApp.ServerAppSelected = !serverApp.ServerAppSelected;
						};	
					});		
							
				});	
				$scope.pageChanged = function(){
				//console.log($scope.params);
				//alert($scope.currentPackageAppPage);
				$scope.getServerCall($scope.currentServerAppPage,params);	
				};
			};
					$scope.getServerCall(1,params);
					$scope.nextStepUninstallServer = function(){
						
						if($scope.arrServerCheckboxSelection.length == 0)
						{
							 alert = $mdDialog.alert({
							title: 'Please Select Server',
							textContent: 'Please select any one server for next process..!!',
							ok: 'Close'
							});

						  $mdDialog
							.show( alert )
							.finally(function() {
							  alert = undefined;
							});
						}else{
							
							
							//$scope.uninstallWizardGateway();
							$scope.uninstallWizardApp();
						}
					};
				}
			});
			$scope.$watch('uninstallWizardAppSelection',function(uninstallWizardAppSelection){
				if(uninstallWizardAppSelection =='ON'){
						
					$scope.arrCheckboxSelection = [];
					$scope.arrCheckboxSelectionBody = [];
					$scope.getAppsCall = function(pageno,params){
						$scope.packageApps = [];
						$scope.currentPackageAppPage = pageno;
						$scope.packageAppPerPage = ENV.recordPerPage;
						$scope.dataPackageAppLoading = true;
					
				softwareupdateModuleService.getApps(pageno,params).then(function(response){
					
					$timeout(function(){
							//console.log(response);
							$scope.dataPackageAppLoading = false;	
							
							//console.log(data.Data);
							if(response.Data != undefined){
								$scope.packageApps = response.Data;
								$scope.packageAppsTotalRecords = response.total_records;
								//alert($scope.packageAppsTotalRecords);
							}else{
								$scope.packageAppsTotalRecords =0;
							}
							$scope.selectedAllApp ="";
							$scope.checkAllSoftwareAPP = function (selectedAllApp) {
											$scope.selectedAllApp = selectedAllApp;
											if ($scope.selectedAllApp) {
												$scope.selectedAllApp = true;
											} else {
												$scope.selectedAllApp = false;
											}
											angular.forEach($scope.packageApps, function (packageapp) {
											 
												if($scope.selectedAllApp == true){
													$scope.arrCheckboxSelection.push(packageapp.id);
													$scope.arrCheckboxSelectionBody.push(packageapp);
												}else{
													var idx = $scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageapp.id);
													var idx2 =$scope.arrayObjectIndexOf($scope.arrCheckboxSelectionBody,packageapp);
													$scope.arrCheckboxSelection.splice(idx,1);
													$scope.arrCheckboxSelectionBody.splice(idx2,1);
												}
										   });
										  
										};
							
							$scope.selectedRow = null;
								
								$scope.setClickedRowPackage = function(index,packageInstall){
									$scope.selectedRow = index;
									$scope.selectedRowPackage = packageInstall;
									//$scope.selectedPackages[packageInstall.id] =true;
										var idx = $scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageInstall.id);
										var idx2 =$scope.arrayObjectIndexOf($scope.arrCheckboxSelectionBody,packageInstall);
									if($scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageInstall.id) > -1){
										$scope.arrCheckboxSelection.splice(idx,1);
										$scope.arrCheckboxSelectionBody.splice(idx2,1);
									}else{
										$scope.arrCheckboxSelection.push(packageInstall.id);
										$scope.arrCheckboxSelectionBody.push(packageInstall);
									}
								
									
									
								};
								
							$scope.checkStatus= function(packageInstall) {
							
							 packageInstall.packageInstallSelected = !packageInstall.packageInstallSelected;
						};	
					});		
							
				});	
					$scope.pageChanged4 = function(){
				//	console.log($scope.currentPackageAppPage);
					$scope.getAppsCall($scope.currentPackageAppPage,params);	
					};
					
				};
					
					
					var object4App = 'apps';
					var object4fields = {fields:'packageType,version',architecture:'all'};
					$scope.responseFilters = [];
					softwareupdateModuleService.getFilterDetail(object4App,object4fields).then(function(response){
						$scope.responseFilters = response.Data;
					});
					$scope.params = {arch:'all'};
					$scope.funcFilterSearch = function(appType,appVersion){
						if(appType !== undefined && appType !== null){
							//alert(appType);
							$scope.params.packagetype = appType;
						}else{
							 delete $scope.params.packagetype;
						}
						if(appVersion !== undefined && appVersion !== null){
							//alert(appVersion);
							$scope.params.version = appVersion;
						}else{
							 delete $scope.params.version;
						}
						$scope.getAppsCall(1,$scope.params);
					};
					$scope.getAppsCall(1,$scope.params);
					
					$scope.nextStepuninstallWizardApp = function(){
						if($scope.arrCheckboxSelection.length == 0)
						{
							 alert = $mdDialog.alert({
							title: 'Please Select App',
							textContent: 'Please select any one app for next process..!!',
							ok: 'Close'
							});

						  $mdDialog
							.show( alert )
							.finally(function() {
							  alert = undefined;
							});
						}else{
						//	console.log($scope.arrCheckboxSelection);
						//	console.log($scope.arrCheckboxSelectionBody);
						$scope.uninstallWizardGateway();
						}
					}
					
				}
			});
			$scope.$watch('uninstallWizardGatewaySelection',function(uninstallWizardGatewaySelection){
				if(uninstallWizardGatewaySelection == 'ON'){
					
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
									var idx2 = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelectionBody,gateway);
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
							$scope.nextStepuninstallWizardGateway = function(){
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
									$scope.uninstallWizardConfirm();
								}
							}
				}
			});
			$scope.$watch('uninstallWizardConfirmSelection',function(uninstallWizardConfirmSelection){
				if(uninstallWizardConfirmSelection == 'ON'){
					$scope.confirmSaveUninstallWizard = function(){
						$scope.dataDeviceLoadingUninstall = true;
						
						$rootScope.mqttSubscribe($scope.orgid+"_PackageDeployment_masspackage_uninstallation",100);
						if($scope.arrServerCheckboxSelectionBody.length<=0 && $scope.arrCheckboxSelectionBody.length<=0 && $scope.arrGatewayCheckboxSelectionBody.length<=0 && $scope.selectedRowMesh != undefined){
							toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
						}else{
							waitingDialog.show('Operation in progress, this can take some time. Please Wait and do not reload the page...',{
							  headerText: 'Please Wait...',
							  dialogSize: 'lg',
							  progressType: 'success'
							});
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
							angular.forEach($scope.arrServerCheckboxSelectionBody,function(serverApp){
							serverArray.push({'serverid':serverApp.id,'network':serverApp.mesh_group,'macid':serverApp.macid});
							});
							var appArray = [];
							angular.forEach($scope.arrCheckboxSelectionBody,function(app){
								appArray.push({"id":app.id,"architecture":app.architecture,"version":app.version,"packageName":app.packageName,"packageType":app.packageType});
								
							});
							//console.log(gatewayArray);
							softwareupdateModuleService.ConfirmUninstallDeployment(meshArray,serverArray,appArray,gatewayArray).then(function(data){
								//toaster.pop("success","","Successfully Uninstall Deployment..!!!");
								
								$scope.$on("mqtt_message",function(e,a){
								//console.log(a);
								if(a.data.operation == 'package_uninstallation'){
									responseData = a.data;
									$scope.dataDeviceLoadingUninstall = false;
									waitingDialog.hide();
									var modalInstance = $uibModal.open({
										  animation: true,
										  backdrop  : 'static',
										  ariaLabelledBy: 'modal-title',
										  ariaDescribedBy: 'modal-body',
										  templateUrl: 'ResponseUninstallContent.html',
										  controller: 'ResponseUninstallCtrl',
										  size: 'lg',
										  resolve: {
											dsparam: function () {
											 return {'responseData':responseData};
											}
										  }
									});
									$state.reload();
								}
							});
								
							});
						}
					}
				}
			});
			
		}
	});
	
	
	
	$scope.gatewaySelection = function(selectedOption){
		 $scope.gatewaySelectionOption = selectedOption;
		 $scope.appSelectionOption = "OFF";
		 $scope.serverSelectionOption = "OFF";
		 $scope.confirmSelectionOption="OFF";
		 $scope.meshSelectionOption = "OFF";
	};
	$scope.appSelection = function(selectedOption){
		 $scope.appSelectionOption = selectedOption;
		 $scope.gatewaySelectionOption = "OFF";
		  $scope.serverSelectionOption = "OFF";
		  $scope.confirmSelectionOption="OFF";
		  $scope.meshSelectionOption = "OFF";
	};
	$scope.serverSelection = function(selectedOption){
		    $scope.serverSelectionOption = selectedOption;
			$scope.appSelectionOption = "OFF";
			$scope.gatewaySelectionOption = "OFF";
			$scope.confirmSelectionOption="OFF";
			$scope.meshSelectionOption = "OFF";
	};
	$scope.meshSelection = function(selectedOption){
			$scope.meshSelectionOption = selectedOption;
			$scope.serverSelectionOption = "OFF";
			$scope.appSelectionOption = "OFF";
			$scope.gatewaySelectionOption = "OFF";
			$scope.confirmSelectionOption="OFF";
	};
	$scope.nextStepGateway = function(){
		//alert(JSON.stringify($scope.arrGatewayCheckboxSelection));
		if($scope.arrGatewayCheckboxSelection.length == 0)
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
			$scope.appSelectionOption = "ON";
			$scope.gatewaySelectionOption = "OFF";
			$scope.serverSelectionOption = "OFF";
			$scope.meshSelectionOption = "OFF";
		}
	};
	$scope.nextStepApp = function(){
		if($scope.arrCheckboxSelection.length == 0)
		{
			 alert = $mdDialog.alert({
        title: 'Please Select App',
        textContent: 'Please select any one app for next process..!!',
        ok: 'Close'
      });

      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
		}else{
			$scope.serverSelectionOption = "OFF";
			$scope.appSelectionOption = "OFF";
			$scope.gatewaySelectionOption = "OFF";
			$scope.confirmSelectionOption = "ON";
			$scope.meshSelectionOption = "OFF";
		}
	};
	$scope.nextStepServer = function(){
		if($scope.arrServerCheckboxSelection.length == 0)
		{
			 alert = $mdDialog.alert({
			title: 'Please Select Server',
			textContent: 'Please select any one server for next process..!!',
			ok: 'Close'
			});

		  $mdDialog
			.show( alert )
			.finally(function() {
			  alert = undefined;
			});
		}else{
			$scope.confirmSelectionOption = "OFF";
			$scope.serverSelectionOption = "OFF";
			$scope.appSelectionOption = "OFF";
			$scope.gatewaySelectionOption = "ON";
			$scope.meshSelectionOption = "OFF";
		}
	};
	$scope.nextStepMesh = function(){
		if($scope.selectedRowMesh ==null)
		{
			 alert = $mdDialog.alert({
			title: 'Please Select Mesh',
			textContent: 'Please select any one mesh for next process..!!',
			ok: 'Close'
			});

		  $mdDialog
			.show( alert )
			.finally(function() {
			  alert = undefined;
			});
		}else{
		$scope.confirmSelectionOption = "OFF";
			$scope.serverSelectionOption = "ON";
			$scope.appSelectionOption = "OFF";
			$scope.gatewaySelectionOption = "OFF";
			$scope.meshSelectionOption = "OFF";
		}
	}
	
	$scope.$watch('gatewaySelectionOption', function (gatewaySelectionOption) {
				if(gatewaySelectionOption == 'ON'){
				//	Gateway Comes From Server - Start Code	
				//alert(JSON.stringify($scope.arrServerCheckboxSelection));
				$scope.allarrays = [];
				var dataId = $scope.selectedRowMesh.id;
					
				//$scope.allarrays =$scope.allarrays.concat(dataArray.gateways);
							
							
						
						
					
					
				$scope.arrGatewayCheckboxSelection = [];
				$scope.arrGatewayCheckboxSelectionBody = [];
				//console.log($scope.allarrays);
				 $scope.getDataGateway = function(dataId,pageno,params){
				  
					$scope.gatewayListtest = [];
					$scope.gatewayList = [];
					$scope.currentGatewayPage = pageno;
					$scope.gatewayPerPage = ENV.recordPerPage;
					$scope.dataLoading = true;
					softwareupdateModuleService.getGatewaysFromMesh(dataId,pageno).then(function (data) {
						
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
						var idx2 = $scope.arrayObjectIndexOf($scope.arrGatewayCheckboxSelectionBody,gateway);
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
							console.log($scope.currentGatewayPage);
							$scope.getDataGateway(dataId,$scope.currentGatewayPage,$scope.params);	
							
						};
				};
				$scope.getDataGateway(dataId,1);
					
					
				// Gateway Comes From Server - End Code	
				}
	});
	
	$scope.$watch('appSelectionOption', function (appSelectionOption) {
				if(appSelectionOption == 'ON'){	
	
					 $scope.arrCheckboxSelection = [];
					 $scope.arrCheckboxSelectionBody = [];
					$scope.getAppsCall = function(pageno,params){
						$scope.packageApps = [];
						$scope.currentPackageAppPage = pageno;
						$scope.packageAppPerPage = ENV.recordPerPage;
						$scope.dataPackageAppLoading = true;
					
				softwareupdateModuleService.getApps(pageno,params).then(function(response){
					
					$timeout(function(){
							//console.log(response);
							$scope.dataPackageAppLoading = false;	
							
							//console.log(data.Data);
							if(response.Data != undefined){
								$scope.packageApps = response.Data;
								$scope.packageAppsTotalRecords = response.total_records;
								//alert($scope.packageAppsTotalRecords);
							}else{
								$scope.packageAppsTotalRecords =0;
							}
							$scope.selectedAllApp ="";
							$scope.checkAllSoftwareAPP = function (selectedAllApp) {
											$scope.selectedAllApp = selectedAllApp;
											if ($scope.selectedAllApp) {
												$scope.selectedAllApp = true;
											} else {
												$scope.selectedAllApp = false;
											}
											angular.forEach($scope.packageApps, function (packageapp) {
											 
												if($scope.selectedAllApp == true){
													$scope.arrCheckboxSelection.push(packageapp.id);
													$scope.arrCheckboxSelectionBody.push(packageapp);
												}else{
													var idx = $scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageapp.id);
													var idx2 = $scope.arrayObjectIndexOf($scope.arrCheckboxSelectionBody,packageapp);
													$scope.arrCheckboxSelection.splice(idx,1);
													$scope.arrCheckboxSelectionBody.splice(idx2,1);
												}
										   });
										  
										};
							
							$scope.selectedRow = null;
								
								$scope.setClickedRowPackage = function(index,packageInstall){
									$scope.selectedRow = index;
									$scope.selectedRowPackage = packageInstall;
									//$scope.selectedPackages[packageInstall.id] =true;
										var idx = $scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageInstall.id);
										var idx2 = $scope.arrayObjectIndexOf($scope.arrCheckboxSelectionBody,packageInstall);
									if($scope.arrayObjectIndexOf($scope.arrCheckboxSelection,packageInstall.id) > -1){
										$scope.arrCheckboxSelection.splice(idx,1);
										$scope.arrCheckboxSelectionBody.splice(idx2,1);
									}else{
										$scope.arrCheckboxSelection.push(packageInstall.id);
										$scope.arrCheckboxSelectionBody.push(packageInstall);
									}
								
									
									
								};
								
							$scope.checkStatus= function(packageInstall) {
							
							 packageInstall.packageInstallSelected = !packageInstall.packageInstallSelected;
						};	
					});		
							
				});	
				$scope.pageChanged4 = function(){
				//console.log($scope.currentPackageAppPage);
				$scope.getAppsCall($scope.currentPackageAppPage,params);	
				};
				};
					$scope.params = {arch:'all'};
					$scope.getAppsCall(1,$scope.params);

					$scope.$on("serverResponse",function(e,a){
						if(a.data == "testServer"){
							$scope.getAppsCall(1,$scope.params);
						}
					
					});
	
	}
	});			

	$scope.$watch('serverSelectionOption',function(serverSelectionOption){
		if(serverSelectionOption == 'ON'){
				$scope.arrServerCheckboxSelection = [];
				$scope.arrServerCheckboxSelectionBody = [];
				var params = {"mid":$scope.selectedRowMesh.id};
				$scope.getServerCall = function(pageno,params){
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
							$scope.selectedAll = "";
							$scope.checkAllSoftwareServer = function (selectedAll) {
								
											$scope.selectedAll = selectedAll;
											if ($scope.selectedAll) {
												$scope.selectedAll = true;
											} else {
												$scope.selectedAll = false;
											}
											
										   angular.forEach($scope.ServerApps, function (serverApp) {
											 
												if($scope.selectedAll == true){
													$scope.arrServerCheckboxSelection.push(serverApp.id);
													$scope.arrServerCheckboxSelectionBody.push(serverApp);
												}else{
													var idx = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id);
													var idx2 = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelectionBody,serverApp);
													$scope.arrServerCheckboxSelection.splice(idx,1);
													$scope.arrServerCheckboxSelectionBody.splice(idx2,1);
												}
										   });
										};
							
							$scope.selectedRow3 = null;
								
								$scope.setClickedRowServer = function(index,serverApp){
									$scope.selectedRow3 = index;
									$scope.selectedRowServer = serverApp;
									//$scope.selectedPackages[packageInstall.id] =true;
										var idx = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id);
										var idx2 = $scope.arrayObjectIndexOf($scope.arrServerCheckboxSelectionBody,serverApp);
									if($scope.arrayObjectIndexOf($scope.arrServerCheckboxSelection,serverApp.id) > -1){
										$scope.arrServerCheckboxSelection.splice(idx,1);
										$scope.arrServerCheckboxSelectionBody.splice(idx2,1);
									}else{
										$scope.arrServerCheckboxSelection.push(serverApp.id);
										$scope.arrServerCheckboxSelectionBody.push(serverApp);
									}
								
									
									
								};
								
							$scope.checkStatus= function(serverApp) {
							
							 serverApp.ServerAppSelected = !serverApp.ServerAppSelected;
						};	
					});		
							
				});	
				$scope.pageChanged = function(){
				//console.log($scope.params);
				//alert($scope.currentPackageAppPage);
				$scope.getServerCall($scope.currentServerAppPage,params);	
				};
			};
				$scope.getServerCall(1,params);
		}
	});
	
	$scope.$watch('meshSelectionOption',function(meshSelectionOption){
		if(meshSelectionOption == 'ON'){
								
						$scope.getMeshCall(1);
						
		}
	});
	
	
	/*  Code for Steps after assigning portion - End */
		
$scope.$on("serverConfirmResponse",function(e,a){

		var socketData = a.data;
		  var modalInstance = $uibModal.open({
      animation: true,
	  backdrop  : 'static',
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'ResponseContent.html',
      controller: 'ResponseCtrl',
      size: 'lg',
      resolve: {
        dsparam: function () {
          return socketData;
        }
      }
    });
		
	
	
	});
	
$scope.confirmSave =function(){
	var SocketCollection = [];
	$scope.dataDeviceLoadingDeployment = true;
	
	
	if($scope.arrServerCheckboxSelectionBody.length<=0 && $scope.arrCheckboxSelectionBody.length<=0 && $scope.arrGatewayCheckboxSelectionBody.length<=0 && $scope.selectedRowMesh != undefined){
		toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
	}else{
		$rootScope.mqttSubscribe($scope.orgid+"_PackageDeployment",100);
		waitingDialog.show('Operation in progress, this can take some time. Please Wait and do not reload the page...',{
		  headerText: 'Please Wait...',
		  dialogSize: 'lg',
		  progressType: 'success'
		});
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
		angular.forEach($scope.arrServerCheckboxSelectionBody,function(serverApp){
		serverArray.push({'serverid':serverApp.id,'network':serverApp.mesh_group,'macid':serverApp.macid});
		});
		var appArray = [];
		angular.forEach($scope.arrCheckboxSelectionBody,function(app){
			appArray.push(app.id);
		});
		//console.log(gatewayArray);
		softwareupdateModuleService.ConfirmSaveDeployment(meshArray,serverArray,gatewayArray,appArray).then(function(data){
		//	console.log(data);
		$scope.jobid = data.Data.JOBID;
		$scope.gwid = data.Data.CLIENTID;
		$scope.$on("mqtt_message",function(e,a){
														
								if(a.data.length>0){
									$rootScope.$broadcast('serverConfirmResponse',{data : a.data});
								}
								if(a.data.responsecode == 200){
									$scope.serverSelection("ON");
								}
			$scope.dataDeviceLoadingDeployment = false;
			waitingDialog.hide();
			$state.reload();
		});
		/*SocketCollection = $scope.SocketData.collection;
			$rootScope.dataStreamSocket.onMessage(function(){
				$timeout(function(){
				for(var i=0;i<(SocketCollection.length);i++)
				{
						
						
								
								if(SocketCollection[i].JOBID == $scope.jobid)
								{
									//console.log(SocketCollection[i]);
									//console.log(SocketCollection[i].JOBID + "=="+$scope.jobid);
									if(SocketCollection[i].data.length > 0){
										
										$rootScope.$broadcast('serverConfirmResponse',{data : SocketCollection[i].data});
										
										
										
									}
									
									//if(SocketCollection[i].data.responsecode ==200)
									//{
										
										
										//$state.reload();
										$scope.serverSelection("ON");
										
									//}
									$scope.dataDeviceLoadingDeployment = false;
									$scope.SocketData.collection.splice(i, 1);
								}
				}
				});
			});*/	
		});
	}
};
	


$scope.arrayObjectIndexOf = function(arr, obj) {
		 for(var i = 0; i < arr.length; i++){
			if(angular.equals(arr[i], obj)){
				return i;
			}
		};
		return -1;
	}	
});

softwareupdateModule.controller('ResponseUpdateCtrl',function($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$uibModalInstance,toaster,dsparam){
$rootScope.globals = $cookieStore.get('globals') || {};
	//console.log($rootScope.globals);
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.responseData = dsparam.responseData;
	$rootScope.mqttUnsubscribe($scope.orgid+"_AutoDeployment_upgrade_app");
	$scope.cleargatewayUpdate = function(){
		$uibModalInstance.close();
	}	
});
softwareupdateModule.controller('ResponseUninstallCtrl',function($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$uibModalInstance,toaster,dsparam){
$rootScope.globals = $cookieStore.get('globals') || {};
	//console.log($rootScope.globals);
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.responseData = dsparam.responseData;
	$rootScope.mqttUnsubscribe($scope.orgid+"_PackageDeployment_masspackage_uninstallation");
	$scope.cleargatewayUpdate = function(){
		$uibModalInstance.close();
	}
});
softwareupdateModule.controller('ResponseRemoveCtrl',function($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$uibModalInstance,toaster,dsparam){
	$rootScope.globals = $cookieStore.get('globals') || {};
	//console.log($rootScope.globals);
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	
	$scope.responseData = dsparam.responseData;
	$rootScope.mqttUnsubscribe($scope.orgid+"_GatewayTrash");
	$scope.cleargatewayUpdate = function(){
		$uibModalInstance.close();
	}
});
softwareupdateModule.controller('ResponseDockerCtrl',function($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$uibModalInstance,toaster,dsparam){
$scope.dockerDetails = dsparam.dockerDetails;
$scope.passwordDetails = dsparam.passwordDetails;
$scope.macDetails = dsparam.macDetails;
$scope.showPass=false;
$scope.showPassFun = function(flag){
	$scope.showPass = flag;
}
$scope.decryptData = function(param) {
		$scope.protectedpassword="";
		if(param.length >0){
			
			for(var i=0; i<param.length; ++i) {
				
				$scope.protectedpassword += '*';
			}
		}
		return $scope.protectedpassword;
	};
$scope.cleargatewayUpdate = function(){
		$uibModalInstance.close();
	}
});
softwareupdateModule.controller('ResponseCtrl',function($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$uibModalInstance,toaster,dsparam){
	$scope.socketData = dsparam;
	//console.log($scope.socketData);
	var socketData =$scope.socketData;
	$scope.cleargatewayUpdate = function(){
		$uibModalInstance.close();
	}
	/*for(var j=0;j<socketData.length;j++){
											if(socketData[j].msg.DISPLAYNAME != null && socketData[j].msg.responsecode === 200){
												 toaster.success({title: socketData[j].msg.DISPLAYNAME, body:"Successfully Gateway."});
											}
											if(socketData[j].msg.DISPLAYNAME != null && socketData[j].msg.responsecode !== 200){
												 toaster.error({title: socketData[j].msg.DISPLAYNAME, body:"Failed Gateway."});
												 
											}
											var packagesData = socketData[j].msg.packages;
											//alert(JSON.stringify(packagesData));
											if(packagesData.length>0){
												for(var k=0;k<packagesData.length;k++){
													if(packagesData[k].Status == 'INSTALLED'){
														toaster.success({title: packagesData[k].packageName, body:packagesData[k].packageName+" Successfully installed in "+socketData[j].msg.DISPLAYNAME});
													}
													if(packagesData[k].Status !== 'INSTALLED'){
														toaster.error(packagesData[k].packageName, packagesData[k].packageName+" Failed installed in "+socketData[j].msg.DISPLAYNAME);
													}
												}
											}
										}*/
	//alert(JSON.stringify($scope.socketData));
});