var softwareupdateModule = angular.module('softwareupdateModule.controllers');

softwareupdateModule.controller('explorerCtrl', function ($scope, $rootScope, softwareupdateModuleService,gatewayModuleService,ENV,$state,$cookieStore,$location,$filter,$timeout, $window, CustomMessages,$mdDialog,$uibModal,toaster,AclService) {

    /*	Data Attribute Initialize Function of Deployment
     Dynamic Generic Function for Initialize Data Attributes
     */
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
		//$scope.assignAnsibleServer();
	//	$scope.getServerCall(1);
	$state.reload();
	};
	$scope.$on("serverResponse",function(e,a){
	if(a.data == "testServer"){
		$scope.getServerCall(1);
	}
	
	});
	$scope.$on("meshResponse",function(e,a){
	if(a.data == "testMesh"){
		$scope.getMeshCall(1);
	}
	});
	$scope.aDetail = {};
	
	
	
	
	$scope.funAddNewGateway = function(){
		if($scope.aDetail.gateways == undefined){
		$scope.aDetail.gateways = [];
		}
		var gatewaysize = 0;
		if($scope.aDetail.gateways.length >= 0){
			gatewaysize = $scope.aDetail.gateways.length + 1;
			var glength = $scope.aDetail.gateways.length;
			$scope.aDetail.gateways.push({'id':gatewaysize});
				
		}
	};
	
	
	
	$scope.createServerFun = function(ServerApp){
		if(ServerApp != undefined){
					var modelInstance = $uibModal.open({
					animation:true,
					backdrop  : 'static',
					ariaLabelledBy:'modal-title',
					ariaDescribedBy:'modal-body',
					templateUrl:'modalCreateServer.html',
					controller:'CreateServerCtrl',
					windowClass: 'app-modal-window',
					resolve:{
						dsparam:{"ServerApp":ServerApp}
					}
					});
					}else{
						var modelInstance = $uibModal.open({
						animation:true,
						backdrop  : 'static',
						ariaLabelledBy:'modal-title',
						ariaDescribedBy:'modal-body',
						templateUrl:'modalCreateServer.html',
						controller:'CreateServerCtrl',
						windowClass: 'app-modal-window',
						resolve:{
							dsparam:{}
						}
						});
					}
		
	};
	$scope.MeshFun = function(){
		$scope.MeshFunOption = true;
		$scope.assigndockerImageOption = false;
		$scope.assignGatewayOption = false;
		$scope.AppsOption = false;
		
	}
	
	
	$scope.createDockerFun = function(){
		$scope.MeshFunOption = false;
		$scope.assigndockerImageOption = true; 
		$scope.assignGatewayOption = false;
		$scope.AppsOption = false;
		
	};
	
	$scope.createGatewayFun = function(){
		$scope.MeshFunOption = false;
		$scope.assigndockerImageOption = false; 
		$scope.assignGatewayOption = true;
		$scope.AppsOption = false;
		
	}
	$scope.AppsFun = function(){
		$scope.MeshFunOption = false;
		$scope.assigndockerImageOption = false; 
		$scope.assignGatewayOption = false;
		$scope.AppsOption = true;
		
	}
	$scope.GatewaysFun = function(){
		$scope.MeshFunOption = false;
		$scope.assigndockerImageOption = false; 
		$scope.assignGatewayOption = false;
		$scope.AppsOption = false;
		
	}
	/*	Code for Steps - Docker Code*/
	$scope.$watch('assigndockerImageOption', function (assigndockerImageOption) {
				if(assigndockerImageOption == true){
					$scope.getDockerCall = function(pageno,params){
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
										$scope.DockerAppTotalRecords = response.total_records;
										//alert($scope.packageAppsTotalRecords);
									}else{
										$scope.DockerAppTotalRecords =0;
									}
								$scope.selectedRow3 = null;
								$scope.setClickedRowServer = function(index,DockerApp){
								$scope.selectedRow3 = index;
								$scope.selectedRowDocker = DockerApp;
								//console.log(gatewayInfo);
								//console.log($scope.selectedRow3);
								if(DockerApp.Selected == true)
								{
									DockerApp.Selected=false;
								}else{
									DockerApp.Selected=true;
								}
								};
							
							});		
									
						});	
						$scope.pageChanged = function(){
						//console.log($scope.params);
						//alert($scope.currentPackageAppPage);
						$scope.getDockerCall($scope.currentDockerAppPage);	
						};
					};
				$scope.getDockerCall(1);
				
				$scope.createNewDockerFun = function(DockerApp){
					if(DockerApp != undefined){
						var modelInstance = $uibModal.open({
							animation:true,
							backdrop  : 'static',
							ariaLabelledBy:'modal-title',
							ariaDescribedBy:'modal-body',
							templateUrl:'modalCreateDocker.html',
							controller:'CreateDockerCtrl',
							windowClass: 'app-modal-window',
							resolve:{
								dsparam:function(){
									return{'DockerApp':DockerApp}
								}
							}
						});
					}else{
						var modelInstance = $uibModal.open({
							animation:true,
							backdrop  : 'static',
							ariaLabelledBy:'modal-title',
							ariaDescribedBy:'modal-body',
							templateUrl:'modalCreateDocker.html',
							controller:'CreateDockerCtrl',
							windowClass: 'app-modal-window',
							resolve:{
								dsparam:{}
							}
						});
					}
					
				
				};
				
				$scope.$on("dockerListReload",function(e,a){
					if(a.data == "testServer"){
						$scope.getDockerCall($scope.currentDockerAppPage);
					}
					
				});
				
				$scope.deleteDocker = function(dockerApp,event){
					
					var confirm = $mdDialog.confirm()
                  .title('Are you sure to delete the record?')
                  .textContent('Record will be deleted permanently.')
                  .ariaLabel('Snapbricks')
                  .targetEvent(event)
                  .ok('Yes')
                  .cancel('No');
                  $mdDialog.show(confirm).then(function() {
                    softwareupdateModuleService.deleteDockerApp(dockerApp.id).then(function(data){
						toaster.pop("success","","Docker Successfully Removed");
						$scope.getDockerCall($scope.currentDockerAppPage);
					});
                     });
				  
					
				}; 
				
				}
	});
	/*	End of Code for Steps - Docker Code */
	
	/*  Code for Steps before assigning portion - Start */
	$scope.$watch('MeshFunOption', function (MeshFunOption) {
				if(MeshFunOption == true){
					$scope.addMeshGroups = function(meshInformation){
						var modelInstance = $uibModal.open({
							animation:true,
							backdrop  : 'static',
							ariaLabelledBy:'modal-title',
							ariaDescribedBy:'modal-body',
							templateUrl:'modalAddMesh.html',
							controller:'AddMeshCtrl',
							windowClass: 'app-modal-window',
							resolve:{
								dsparam:{'meshApp':meshInformation},
							}
						});
					}
					$scope.deleteMeshFun = function(meshApp,event){
						var confirm = $mdDialog.confirm()
					  .title('Are you sure to delete the record?')
					  .textContent('Record will be deleted permanently.')
					  .ariaLabel('Snapbricks')
					  .targetEvent(event)
					  .ok('Yes')
					  .cancel('No');
					  $mdDialog.show(confirm).then(function() {
						softwareupdateModuleService.deleteMeshApp(meshApp.id).then(function(data){
							toaster.pop("success","",data.message);
							$scope.getMeshCall($scope.currentMeshAppPage);
						});
						 });
					};
					$scope.selectedmeshServer = function(selectedMeshInformation){

						var modelInstance = $uibModal.open({
							animation:true,
							backdrop  : 'static',
							ariaLabelledBy:'modal-title',
							ariaDescribedBy:'modal-body',
							templateUrl:'modalMeshServer.html',
							controller:'MeshServerCtrl',
							windowClass: 'app-modal-window',
							resolve:{
								dsparam:{"MeshApp":selectedMeshInformation}
							}
						});

					};
					$scope.selectedmeshHWBoards = function(selectedMeshInformation){
						var modelInstance = $uibModal.open({
							animation:true,
							backdrop  : 'static',
							ariaLabelledBy:'modal-title',
							ariaDescribedBy:'modal-body',
							templateUrl:'modalMeshHWBoards.html',
							controller:'MeshHWBoardsCtrl',
							windowClass: 'app-modal-window',
							resolve:{
								dsparam:{"MeshApp":selectedMeshInformation}
							}
						});
					}
					$scope.getMeshCall = function(pageno,params){
						$scope.MeshApps = [];
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
								//console.log(gatewayInfo);
								//console.log($scope.selectedRow3);
								if(meshApp.Selected == true)
								{
								meshApp.Selected=false;
								}else{
								meshApp.Selected=true;
								}
								};
							
							});		
									
						});	
						$scope.pageChanged = function(){
						//console.log($scope.params);
						//alert($scope.currentPackageAppPage);
						$scope.getMeshCall($scope.currentMeshAppPage);	
						};
					};
					$scope.getMeshCall(1);
	
				}
	});
	/*  Code for Steps before assigning portion - End */
	
	$scope.$watch('assignGatewayOption',function(assignGatewayOption){
		if(assignGatewayOption == true){
			
			$scope.getGatewayAppCall = function(pageno,params){
				$scope.GatewayApps = [];
				$scope.currentGatewayAppPage = pageno;
				$scope.GatewayAppPerPage = ENV.recordPerPage;
				$scope.dataGatewayAppLoading = true;
			
				softwareupdateModuleService.autogatewayData(pageno).then(function(response){
					
					$timeout(function(){
							//console.log(response);
							$scope.dataGatewayAppLoading = false;	
							
							//console.log(data.Data);
							if(response.Data != undefined){
								$scope.GatewayApps = response.Data;
								$scope.GatewayAppsTotalRecords = response.total_records;
								//alert($scope.packageAppsTotalRecords);
							}else{
								$scope.GatewayAppsTotalRecords =0;
							}
						$scope.selectedRow3 = null;
						$scope.setClickedRowGateway = function(index,gatewayApp){
						$scope.selectedRow3 = index;
						$scope.selectedRowGateway = gatewayApp;
						//console.log(gatewayInfo);
						//console.log($scope.selectedRow3);
						if(gatewayApp.Selected == true)
						{
						gatewayApp.Selected=false;
						}else{
						gatewayApp.Selected=true;
						}
						};
					
					});		
							
				});	
				$scope.pageChanged = function(){
				//console.log($scope.params);
				//alert($scope.currentPackageAppPage);
				$scope.getGatewayAppCall($scope.currentGatewayAppPage);	
				};
			};
			$scope.getGatewayAppCall(1);
			
			$scope.createNewGatewayFun = function(GatewayApp)
			{
				if(GatewayApp != undefined){
				var modelInstance = $uibModal.open({
					animation:true,
					backdrop  : 'static',
					ariaLabelledBy:'modal-title',
					ariaDescribedBy:'modal-body',
					templateUrl:'modalCreateGateway.html',
					controller:'CreateGatewayCtrl',
					windowClass: 'app-modal-window',
					resolve:{
								dsparam:function(){
									return{'GatewayApp':GatewayApp}
								}
							}
				 });
				}else{
				var modelInstance = $uibModal.open({
					animation:true,
					backdrop  : 'static',
					ariaLabelledBy:'modal-title',
					ariaDescribedBy:'modal-body',
					templateUrl:'modalCreateGateway.html',
					controller:'CreateGatewayCtrl',
					windowClass: 'app-modal-window',
					resolve:{
								dsparam:{}
							}
				 });	
				}	
			}
			
			
			$scope.$on("gatewayListReload",function(e,a){
					if(a.data == "testServer"){
						$scope.getGatewayAppCall($scope.currentGatewayAppPage);
					}
					
				});
			$scope.deleteGateway = function(gatewayApp,event){
					
				var confirm = $mdDialog.confirm()
                  .title('Are you sure to delete the record?')
                  .textContent('Record will be deleted permanently.')
                  .ariaLabel('Snapbricks')
                  .targetEvent(event)
                  .ok('Yes')
                  .cancel('No');
                  $mdDialog.show(confirm).then(function() {
                    softwareupdateModuleService.deleteGatewayApp(gatewayApp.id).then(function(data){
						toaster.pop("success","","Gateway Successfully Removed");
						$scope.getGatewayAppCall($scope.currentGatewayAppPage);
					});
                     });
				  
					
				}; 
			
		};
	});
	 
	/* Code for Steps - Apps Code*/
	$scope.$watch('AppsOption',function(AppsOption){
		if(AppsOption == true){
					$scope.params = {arch:"all"};
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
							
							
							$scope.selectedRow = null;
								
								$scope.setClickedRowPackage = function(index,packageInstall){
									$scope.selectedRow = index;
									$scope.selectedRowPackage = packageInstall;
									//$scope.selectedPackages[packageInstall.id] =true;
									
								};
								
							
					});		
							
				});	
				$scope.pageChanged4 = function(){
				//console.log($scope.currentPackageAppPage);
				$scope.getAppsCall($scope.currentPackageAppPage,params);	
				};
				};
					$scope.getAppsCall(1,$scope.params);
		}
	});
	/* End of Code for Steps - Apps Code */
	
	
	
	
$scope.arrayObjectIndexOf = function(arr, obj) {
	 for(var i = 0; i < arr.length; i++){
        if(angular.equals(arr[i], obj)){
            return i;
        }
    };
    return -1;
}
	
});
softwareupdateModule.controller('gatewayUpdateCtrl',function($scope,$rootScope,softwareupdateModuleService,gatewayModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,dsparam){

$rootScope.globals = $cookieStore.get('globals') || {};
	// console.log("==>"+$scope.gatewayId);
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
    	//console.log($rootScope.globals);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.ServerApp = dsparam.ServerApp;
	$scope.serverIndex = dsparam.serverIndex;
	//alert(JSON.stringify($scope.ServerApp));
	if($scope.ServerApp.gwids.length>0)
	{
		$scope.arrAssignedGatewaySelection = $scope.ServerApp.gwids;
	}else{
		$scope.arrAssignedGatewaySelection = [];
	}
	
	 $scope.getDataGateway = function(pageno,params){
	  
		$scope.gatewayList = [];
		$scope.currentGatewayPage1 = pageno;
		$scope.gatewayPerPage1 = ENV.recordPerPage;
		$scope.dataLoading = true;
		gatewayModuleService.getGatewayList(pageno,params).then(function (data) {
			
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
			var idx = $scope.arrAssignedGatewaySelection.indexOf(gateway.id);
		if($scope.arrAssignedGatewaySelection.indexOf(gateway.id) > -1){
			$scope.arrAssignedGatewaySelection.splice(idx,1);
					}else{
						$scope.arrAssignedGatewaySelection.push(gateway.id);
					}
		
		
	};
			
			});
			
	 }).catch(function(error){
		 $scope.totalItems = 0;
		 $scope.dataLoading = false;	
	 });
	  $scope.pageChanged2 = function(){
				//console.log($scope.params);
				console.log($scope.currentGatewayPage1);
				$scope.getDataGateway($scope.currentGatewayPage1,$scope.params);	
				
			};
	};
	$scope.getDataGateway(1);
	 $scope.cleargatewayUpdate = function(){
 		$uibModalInstance.close();
	 }
	 $scope.saveGateway = function(){
		 $rootScope.$broadcast('gatewayListFromPopup',{arrGateways : $scope.arrAssignedGatewaySelection,serverIndex:$scope.serverIndex});
		 
		 softwareupdateModuleService.assignGatewayToServer($scope.ServerApp.id,$scope.arrAssignedGatewaySelection).then(function(data){
						//	$scope.getServerCall(1);
							toaster.pop('success','',data.message);
						});
		 $uibModalInstance.close();
	 }
});

softwareupdateModule.controller('CreateDockerCtrl',function($scope,$rootScope,softwareupdateModuleService,gatewayModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,dsparam){

$rootScope.globals = $cookieStore.get('globals') || {};
	//alert(JSON.stringify(dsparam));
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
    	//console.log($rootScope.globals);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.docker = {};
	$scope.DockerApp = dsparam.DockerApp;
	if($scope.DockerApp != undefined || $scope.DockerApp != null){
		//alert(JSON.stringify($scope.DockerApp));
		$scope.docker.dockerId = $scope.DockerApp.id;
		$scope.docker.name = $scope.DockerApp.name;
		$scope.docker.url = $scope.DockerApp.url;
		$scope.docker.imagename = $scope.DockerApp.imageName;
		$scope.docker.username = $scope.DockerApp.username;
		$scope.docker.password = $scope.DockerApp.password;
		$scope.docker.architecture = $scope.DockerApp.architecture;
		$scope.docker.entrypoint = $scope.DockerApp.entry_point;
	}
	
	$scope.cleargatewayUpdate = function(){
 		$uibModalInstance.close();
	 }
	
	$scope.save = function(id){
	//alert(JSON.stringify($scope.docker));
	if(id != undefined){
			var params = [{"name":$scope.docker.name,"url":$scope.docker.url,"username":$scope.docker.username,"password":$scope.docker.password,"orgid":$scope.orgid,"architecture":$scope.docker.architecture,"entry_point":$scope.docker.entrypoint,"imageName":$scope.docker.imagename}];
			softwareupdateModuleService.ADDDocker(params,id).then(function(data){
				toaster.pop("success","",data.message);
				$rootScope.$broadcast('dockerListReload',{data : "testServer"});
				$uibModalInstance.close();
			});
	}else{
			
			var params = [{"name":$scope.docker.name,"url":$scope.docker.url,"username":$scope.docker.username,"password":$scope.docker.password,"orgid":$scope.orgid,"architecture":$scope.docker.architecture,"entry_point":$scope.docker.entrypoint,"imageName":$scope.docker.imagename}];
			softwareupdateModuleService.ADDDocker(params).then(function(data){
				
				toaster.pop("success","",data.message);
				$rootScope.$broadcast('dockerListReload',{data : "testServer"});
				$uibModalInstance.close();
			});
	}
	
	} 
	
});
softwareupdateModule.controller('MeshHWBoardsCtrl',function($scope,$rootScope,softwareupdateModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,dsparam,$mdDialog){
	$rootScope.globals = $cookieStore.get('globals') || {};
	// console.log("==>"+$scope.gatewayId);
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
    	//console.log($rootScope.globals);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.MeshApp = dsparam.MeshApp;
	console.log($scope.MeshApp);
	$scope.params = {"mid":$scope.MeshApp.id};
	$scope.gateway = {}
	
	$scope.getGatewayAppCall = function(pageno,params){
				$scope.GatewayApps = [];
				$scope.currentGatewayAppPage = pageno;
				$scope.GatewayAppPerPage = ENV.recordPerPage;
				$scope.dataGatewayAppLoading = true;
			
				softwareupdateModuleService.autogatewayData(pageno,params).then(function(response){
					
					$timeout(function(){
							//console.log(response);
							$scope.dataGatewayAppLoading = false;	
							
							//console.log(data.Data);
							if(response.Data != undefined){
								$scope.GatewayApps = response.Data;
								$scope.GatewayAppsTotalRecords = response.total_records;
								//alert($scope.packageAppsTotalRecords);
							}else{
								$scope.GatewayAppsTotalRecords =0;
							}
						$scope.selectedRow3 = null;
						$scope.setClickedRowGateway = function(index,gatewayApp){
						$scope.selectedRow3 = index;
						$scope.selectedRowGateway = gatewayApp;
						//console.log(gatewayInfo);
						//console.log($scope.selectedRow3);
						if(gatewayApp.Selected == true)
						{
						gatewayApp.Selected=false;
						}else{
						gatewayApp.Selected=true;
						}
						};
					
					});		
							
				});	
				$scope.pageChanged = function(){
				//console.log($scope.params);
				//alert($scope.currentPackageAppPage);
				$scope.getGatewayAppCall($scope.currentGatewayAppPage,$scope.params);	
				};
	};
	
	$scope.backtoListFlag = true;
	$scope.createHWBoardFlag = false;
	$scope.editHWBoardFlag = false;
	$scope.createHWBoardFun = function(){
		$scope.createHWBoardFlag = true;
		$scope.backtoListFlag = false;
		$scope.editHWBoardFlag = false;
		$scope.gateway={};
	};
	$scope.editHWBoardFun = function(hwBoard){
		$scope.editHWBoardFlag = true;
		$scope.createHWBoardFlag = false;
		$scope.backtoListFlag = false;
		$scope.gateway = hwBoard;
		console.log("aaaaa",JSON.stringify(hwBoard))
	}
	$scope.backtoList = function(){
		$scope.backtoListFlag = true;
		$scope.createHWBoardFlag = false;
		$scope.editHWBoardFlag = false;
		$scope.gateway={};
	}
	$scope.deleteGateway = function(gatewayApp,ev){
					var confirm = $mdDialog.confirm()
				  .parent(angular.element(document.querySelector('#meshBoard')))
                  .clickOutsideToClose(true)
                  .title('Are you sure to delete the record?')
                  .textContent('Record will be deleted permanently.')
                  .ariaLabel('Snapbricks')
                  .targetEvent(ev)
                  .ok('Yes')
                  .cancel('No');
                  $mdDialog.show(confirm).then(function() {
				
                    softwareupdateModuleService.deleteGatewayApp(gatewayApp.id).then(function(data){
						toaster.pop("success","","Gateway Successfully Removed");
						$scope.getGatewayAppCall($scope.currentGatewayAppPage,$scope.params);
					});
                  }); 
				  
					
				}; 
	$scope.$watch('backtoListFlag',function(backtoListFlag){
			if(backtoListFlag == true){
				$scope.getGatewayAppCall(1,$scope.params);
			}
	});
	$scope.$watch('createHWBoardFlag',function(createHWBoardFlag){
			if(createHWBoardFlag == true){
				
				
				 $scope.createGateway = function()
				 {
					
						//alert($scope.gateway.network);
						 var params = {"name":$scope.gateway.Name,"ip":$scope.gateway.ipadd,"noofusbs":$scope.gateway.noofusbs,"macid":$scope.gateway.macid,"username":$scope.gateway.username,"password":$scope.gateway.password,"orgid":$scope.orgid,"vendor":$scope.gateway.vendor,"architecture":$scope.gateway.architecture,"network":$scope.gateway.network,"meshid":$scope.MeshApp.id};
						
						 softwareupdateModuleService.AddGatewayApp(params,undefined,$scope.MeshApp.id).then(function (data){
							toaster.pop("success","",data.message);
							$scope.backtoList();
							//$rootScope.$broadcast('gatewayListReload',{data : "testServer"});
							//$uibModalInstance.close();
						});
					
				 }
			}
	});
	$scope.$watch('editHWBoardFlag',function(editHWBoardFlag){
			if(editHWBoardFlag == true){
				
				
				
				
				
				$scope.createGateway = function()
				 {
				 //var params = {"name":$scope.gateway.Name,"ip":$scope.gateway.ipadd,"noofusbs":$scope.gateway.noofusbs,"macid":$scope.gateway.macid,"username":$scope.gateway.username,"password":$scope.gateway.password,"orgid":$scope.orgid,"vendor":$scope.gateway.vendor,"architecture":$scope.gateway.architecture};
				 
				 softwareupdateModuleService.AddGatewayApp($scope.gateway,$scope.gateway.id,$scope.MeshApp.id).then(function (data){
					toaster.pop("success","",data.message);
					$scope.backtoList();
				//	$rootScope.$broadcast('gatewayListReload',{data : "testServer"});
				//	$uibModalInstance.close();
				 });
				 }
			}
	});
	$scope.clearMeshHWBoards = function(){
		$uibModalInstance.close();
	}
	
});
softwareupdateModule.controller('AddMeshCtrl',function($scope,$rootScope,softwareupdateModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,dsparam){
	$rootScope.globals = $cookieStore.get('globals') || {};
	// console.log("==>"+$scope.gatewayId);
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
    	//console.log($rootScope.globals);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
    }
	$scope.meshApp = dsparam.meshApp;
	//console.log($scope.meshApp);
	$scope.addNewChoice = function () {

			$scope.choiceSet.choices.push('');
		};
	if($scope.meshApp != undefined){

		$scope.meshData = {"network":$scope.meshApp.network};
		$scope.meshData.network = $scope.meshApp.network;
		$scope.meshData.id = $scope.meshApp.id;
		$scope.meshData.name = $scope.meshApp.name;
		$scope.meshData.description = $scope.meshApp.description;
		$scope.meshData.location = $scope.meshApp.location;
		$scope.choiceSet = {choices: []};
		$scope.choiceSet.choices = $scope.meshData.network;
		
		$scope.removeChoice = function (z) {
			$scope.meshData.network.splice(z,1);
			$scope.choiceSet.choices.splice(z,1);
		};
	}else{
		$scope.meshData = {"network":[]};
		$scope.choiceSet = {choices: []};
		$scope.choiceSet.choices = [];
		
		$scope.removeChoice = function (z) {

			$scope.choiceSet.choices.splice(z,1);
		};
		$scope.addNewChoice();
	}
	
	$scope.meshData.orgid = $scope.orgid;
	
	$scope.save = function(){
	$scope.dataAddMeshLoading = true;
	//$rootScope.mqttSubscribe($scope.orgid+"_AnsibleServer",100);
	if($scope.meshData.id != undefined){
		if($scope.meshData.description == undefined){
			$scope.meshData.description = '';
		}
		softwareupdateModuleService.putMesh($scope.meshData).then(function (data) {
			
			$scope.dataAddMeshLoading = false;
			console.log(data);
			toaster.pop("success","",data.message);
			$rootScope.$broadcast('meshResponse',{data : "testMesh"});
			$uibModalInstance.close();
		});
	}else{
		if($scope.meshData.description == undefined){
			$scope.meshData.description = '';
		}
		softwareupdateModuleService.postMesh($scope.meshData).then(function (data) {
			$scope.dataAddMeshLoading = false;
			console.log(data);
			toaster.pop("success","",data.message);
			$rootScope.$broadcast('meshResponse',{data : "testMesh"});
			$uibModalInstance.close();
		});
	}
	
	}
	
	$scope.clearMesh = function(){
		$uibModalInstance.close();
	}
});
softwareupdateModule.controller('MeshServerCtrl',function($scope,$rootScope,softwareupdateModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,dsparam,$mdDialog){
	$rootScope.globals = $cookieStore.get('globals') || {};
	// console.log("==>"+$scope.gatewayId);
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
    	//console.log($rootScope.globals);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.MeshApp = dsparam.MeshApp;
	console.log($scope.MeshApp);
	$scope.params = {"mid":$scope.MeshApp.id};
	
	$scope.meshServerCall = function(pageno,params){
		$scope.meshServerList = [];
		$scope.currentMeshServerPage = pageno;
		$scope.MeshServerPerPage = ENV.recordPerPage;
		$scope.dataMeshServerLoading = true;
	
		softwareupdateModuleService.getServerApp(pageno,params).then(function(response){
			
			$timeout(function(){
					//console.log(response);
					$scope.dataMeshServerLoading = false;	
					
					//console.log(data.Data);
					if(response.Data != undefined){
						$scope.meshServerList = response.Data;
						$scope.MeshServerTotalRecords = response.total_records;
						//alert($scope.packageAppsTotalRecords);
					}else{
						$scope.MeshServerTotalRecords =0;
					}
				$scope.selectedRow3 = null;
				$scope.setClickedRowMesh = function(index,meshServer){
				$scope.selectedRow3 = index;
				$scope.selectedRowMeshServer = meshServer;
				//console.log(gatewayInfo);
				//console.log($scope.selectedRow3);
				if(meshServer.Selected == true)
				{
					meshServer.Selected=false;
				}else{
					meshServer.Selected=true;
				}
				};
			
			});		
					
		});	
		$scope.pageChanged = function(){
		//console.log($scope.params);
		//alert($scope.currentPackageAppPage);
		$scope.meshServerCall($scope.currentMeshServerPage,$scope.params);	
		};
	}
	
	$scope.backtoListFlag = true;
	$scope.createServerFlag = false;
	$scope.editServerFlag = false;
	$scope.$watch('backtoListFlag',function(backtoListFlag){
			if(backtoListFlag == true){
				$scope.meshServerCall(1,$scope.params);
			}
	});
	
	
	$scope.createServerFun = function(){
		$scope.createServerFlag = true;
		$scope.backtoListFlag = false;
		$scope.editServerFlag = false;
		$scope.serverDetail={};
	};
	$scope.editServerFun = function(server){
		$scope.editServerFlag = true;
		$scope.createServerFlag = false;
		$scope.backtoListFlag = false;
		$scope.serverDetail = server;
	}
	$scope.removeServer = function(serverid,ev){
		
		
		var confirm = $mdDialog.confirm()
				  .parent(angular.element(document.querySelector('#meshServer')))
                  .clickOutsideToClose(true)
                  .title('Are you sure to delete the record?')
                  .textContent('Record will be deleted permanently.')
                  .ariaLabel('Snapbricks')
                  .targetEvent(ev)
                  .ok('Yes')
                  .cancel('No');
                  $mdDialog.show(confirm).then(function() {
						softwareupdateModuleService.deleteMeshServer(serverid).then(function(data){
							toaster.pop("success","",data.message);
							$scope.meshServerCall(1,$scope.params);
						});
				  });	
						
	}
	$scope.backtoList = function(){
		$scope.backtoListFlag = true;
		$scope.createServerFlag = false;
		$scope.editServerFlag = false;
		$scope.serverDetail={};
	}
	$scope.$watch('editServerFlag',function(editServerFlag){
		if(editServerFlag == true){
			console.log($scope.serverDetail);
			$scope.createServer = {"network":[]};
			$scope.createServer.mesh_name=$scope.MeshApp.name;
			$scope.createServer.mesh_id = $scope.MeshApp.id;
			$scope.createServer.orgid = $scope.orgid;
			if($scope.serverDetail != undefined || $scope.serverDetail.length>0){
				$scope.createServer.serverid = $scope.serverDetail.id;
				$scope.createServer.serverName = $scope.serverDetail.name;
				$scope.createServer.ip = $scope.serverDetail.ip;
				$scope.createServer.macid = $scope.serverDetail.macid;
				$scope.createServer.network = $scope.serverDetail.ansibleserver_network;
				$scope.choiceSet = {choices: []};
				$scope.choiceSet.choices = $scope.createServer.network;
			}else{
				$scope.createServer.network = [];
				$scope.choiceSet = {choices: []};
				$scope.choiceSet.choices = [];
			}
			$scope.removeChoice = function (z) {

					$scope.choiceSet.choices.splice(z,1);
					$scope.createServer.network.splice(z,1);
			};
			
			
			$scope.addNewChoice = function () {

			$scope.choiceSet.choices.push('');
			};
			$scope.addServer=function(createServerData){
					var SocketCollection = [];
					$scope.dataAddServerLoading = true;
					$rootScope.mqttSubscribe($scope.orgid+"_AnsibleServer",100);
					softwareupdateModuleService.postServerData(createServerData).then(function (data) {

					//	$scope.jobid = data.Data.JOBID;
					//	$scope.orgid = data.Data.orgid;
						
							toaster.pop("success","",data.message);
							//$rootScope.$broadcast('serverResponse',{data : "testServer"});
							//$uibModalInstance.close();
							$scope.backtoList();
						
						
						$scope.$on("mqtt_message",function(e,a){
							
							if(a.responsecode==200){
								toaster.pop("success","",data.message);
								//$rootScope.$broadcast('serverResponse',{data : "testServer"});
								//$uibModalInstance.close();
								$scope.backtoList();
							}
							
						});
						$scope.dataAddServerLoading = false;
						

					});


				}
		}
	});
	$scope.$watch('createServerFlag',function(createServerFlag){
			if(createServerFlag == true){
				
				$scope.createServer = {"network":[]};
				$scope.createServer.mesh_name=$scope.MeshApp.name;
				$scope.createServer.mesh_id = $scope.MeshApp.id;
				$scope.createServer.orgid = $scope.orgid;
				//$scope.createServer.network = [];
				//$scope.choiceSet = {choices: []};
				//$scope.choiceSet.choices = $scope.MeshApp.network;

				
			
				
				
				$scope.addServer=function(createServerData){
					var SocketCollection = [];
					$scope.dataAddServerLoading = true;
					$rootScope.mqttSubscribe($scope.orgid+"_AnsibleServer",100);
					softwareupdateModuleService.postServerData(createServerData).then(function (data) {

					//	$scope.jobid = data.Data.JOBID;
					//	$scope.orgid = data.Data.orgid;
						
							toaster.pop("success","",data.message);
							//$rootScope.$broadcast('serverResponse',{data : "testServer"});
							//$uibModalInstance.close();
							$scope.backtoList();
						
						
						$scope.$on("mqtt_message",function(e,a){
							
							if(a.responsecode==200){
								toaster.pop("success","",data.message);
								//$rootScope.$broadcast('serverResponse',{data : "testServer"});
								//$uibModalInstance.close();
								$scope.backtoList();
							}
							
						});
						$scope.dataAddServerLoading = false;
						

					});


				}
				
				
				
			}
	});
	$scope.clearMeshServer = function(){
		$uibModalInstance.close();
	}
});
softwareupdateModule.controller('CreateServerCtrl',function($scope,$rootScope,softwareupdateModuleService,gatewayModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,dsparam){



$rootScope.globals = $cookieStore.get('globals') || {};
	// console.log("==>"+$scope.gatewayId);
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
    	//console.log($rootScope.globals);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.mesh_array = [];
	var getObject = 'meshgroup';
	var getFields = {"fields":"name,network","orgid":$scope.orgid};
	
	
	$scope.notEmptyOrNull = function(expected, actual){
		
	  return !(expected.network === null || expected.network.trim().length === 0)
	}
	$scope.funcMeshNetwork = function(mesh_array,mesh){
		if(mesh != undefined){
		var meshData = $filter('filter')(mesh_array, {name: mesh},true);
		
		$scope.meshNetworkData = meshData[0].network;
		}else{
		$scope.meshNetworkData = [];	
		}
		
	}
	
	$scope.ServerApp = dsparam.ServerApp;
	$scope.createServer = {};
	if($scope.ServerApp != undefined || $scope.ServerApp != null){
		//alert(JSON.stringify($scope.DockerApp));
		$scope.createServer.id = $scope.ServerApp.id;
		$scope.createServer.serverName = $scope.ServerApp.name;
		$scope.createServer.ip = $scope.ServerApp.ip;
		$scope.createServer.macid = $scope.ServerApp.macid;
		$scope.createServer.subnet = $scope.ServerApp.docker_subnet;
		$scope.createServer.ip_range = $scope.ServerApp.docker_iprange;
		$scope.createServer.network_name = $scope.ServerApp.docker_networkName;
		$scope.createServer.mesh_selection = $scope.ServerApp.mesh;
		if($scope.ServerApp.mesh != undefined || $scope.ServerApp.mesh != ""){
			softwareupdateModuleService.getFilterDetail(getObject,getFields).then(function(data){
				$scope.mesh_array = data.Data;
				var filterData = $filter('filter')($scope.mesh_array, {name: $scope.ServerApp.mesh},true);
				$scope.meshNetworkData =  filterData[0].network;
			});
			
		}	
		
		
		$scope.createServer.meshNetwork = $scope.ServerApp.mesh_group;
	}else{
		softwareupdateModuleService.getFilterDetail(getObject,getFields).then(function(data){
		$scope.mesh_array = data.Data;
		});
		
	}
	
	$scope.cleargatewayUpdate = function(){
 		$uibModalInstance.close();
	 }
	 
	$scope.addServer=function(createServerData){
		var SocketCollection = [];
		$scope.dataAddServerLoading = true;
		$rootScope.mqttSubscribe($scope.orgid+"_AnsibleServer",100);
		softwareupdateModuleService.postServerData(createServerData).then(function (data) {

			$scope.jobid = data.Data.JOBID;
			$scope.orgid = data.Data.orgid;
			if(data.message == "Success"){
				toaster.pop("success","",data.message);
				$rootScope.$broadcast('serverResponse',{data : "testServer"});
				$uibModalInstance.close();
			}else{
				toaster.pop("error","",data.message);
				$rootScope.$broadcast('serverResponse',{data : "testServer"});
				$uibModalInstance.close();
			}
			
			
			$scope.$on("mqtt_message",function(e,a){
				
				if(a.responsecode==200){
					toaster.pop("success","",data.message);
					$rootScope.$broadcast('serverResponse',{data : "testServer"});
					$uibModalInstance.close();
				}
				
			});
			$scope.dataAddServerLoading = false;
			/*$rootScope.dataStreamSocket.onMessage(function(){
				$timeout(function(){
				SocketCollection = $scope.SocketData.collection;
				for(var i=0;i<(SocketCollection.length);i++)
				{
					//alert(JSON.stringify(SocketCollection[i]));
					if(SocketCollection[i].JOBID == $scope.jobid)
					{
						
						//console.log(SocketCollection[i].JOBID + "=="+$scope.jobid);
						if(SocketCollection[i].data.responsecode ==200){
							toaster.pop("success","",data.message);
							
							$rootScope.$broadcast('serverResponse',{data : "testServer"});
							$uibModalInstance.close();
						}
						$scope.dataAddServerLoading = false;
						$scope.SocketData.collection.splice(i, 1);
					}
				}
				});
				
			});	
		
*/

		});


	}
	 
});

softwareupdateModule.controller('CreateGatewayCtrl',function($scope,$rootScope,softwareupdateModuleService,gatewayModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,dsparam){

$rootScope.globals = $cookieStore.get('globals') || {};
	// console.log("==>"+$scope.gatewayId);
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
    	//console.log($rootScope.globals);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
    }
	$scope.gateway = {};
	$scope.funcMesh = function(mesh){
		$scope.networkData = [];
		if(mesh != undefined || mesh != ""){
		$scope.networkData = mesh;
			
		}
	}
	$scope.mesh_array = [];
	var getObject = 'meshgroup';
	var getFields = {"fields":"name,network","orgid":$scope.orgid};
	
	$scope.funcMeshNetwork = function(mesh_array,mesh){
		if(mesh != undefined){
			var meshData = $filter('filter')(mesh_array, {name: mesh},true);
			$scope.meshNetworkData = meshData[0].network;
		}else{
			$scope.meshNetworkData = [];
		}
	}
	
	$scope.notEmptyOrNull = function(expected, actual){
		
	  return !(expected.network === null || expected.network.trim().length === 0)
	}
	$scope.GatewayApp = dsparam.GatewayApp;
	if($scope.GatewayApp != undefined || $scope.GatewayApp != null){
		//console.log($scope.GatewayApp);
		$scope.gateway.id = $scope.GatewayApp.id;
		$scope.gateway.Name = $scope.GatewayApp.name;
		$scope.gateway.macid = $scope.GatewayApp.macid;
		$scope.gateway.ipadd = $scope.GatewayApp.ip;
		$scope.gateway.username = $scope.GatewayApp.username;
		$scope.gateway.password = $scope.GatewayApp.password;
		$scope.gateway.vendor = $scope.GatewayApp.vendor;
		$scope.gateway.architecture = $scope.GatewayApp.architecture;
		
		$scope.gateway.mesh_selection = $scope.GatewayApp.mesh;
		if($scope.GatewayApp.mesh != undefined || $scope.GatewayApp.mesh != ""){
			softwareupdateModuleService.getFilterDetail(getObject,getFields).then(function(data){
				$scope.mesh_array = data.Data;
				var filterData = $filter('filter')($scope.mesh_array, {name: $scope.GatewayApp.mesh},true);
				$scope.meshNetworkData =  filterData[0].network;
			});
			
		}	
		$scope.gateway.meshNetwork = $scope.GatewayApp.mesh_group;
		
	}else{
		softwareupdateModuleService.getFilterDetail(getObject,getFields).then(function(data){
			$scope.mesh_array = data.Data;
			
		});
		
	}
	$scope.cleargatewayUpdate = function(){
 		$uibModalInstance.close();
	 }
	 
	 $scope.createGateway = function(id)
	 {
		//console.log("id", id)
		 if(id != undefined){
			
			 var params = [{"name":$scope.gateway.Name,"ip":$scope.gateway.ipadd,"noofusbs":$scope.gateway.noofusbs,"macid":$scope.gateway.macid,"username":$scope.gateway.username,"password":$scope.gateway.password,"orgid":$scope.orgid,"vendor":$scope.gateway.vendor,"architecture":$scope.gateway.architecture,"mesh":$scope.gateway.mesh_selection,"mesh_group":$scope.gateway.meshNetwork}];
			 softwareupdateModuleService.AddGatewayApp(params,id).then(function (data){
				toaster.pop("success","",data.message);
				$rootScope.$broadcast('gatewayListReload',{data : "testServer"});
				$uibModalInstance.close();
			 });
		 }else{
			
			 var params = [{"name":$scope.gateway.Name,"ip":$scope.gateway.ipadd,"noofusbs":$scope.gateway.noofusbs,"macid":$scope.gateway.macid,"username":$scope.gateway.username,"password":$scope.gateway.password,"orgid":$scope.orgid,"vendor":$scope.gateway.vendor,"architecture":$scope.gateway.architecture,"mesh":$scope.gateway.mesh_selection,"mesh_group":$scope.gateway.meshNetwork}];
			 softwareupdateModuleService.AddGatewayApp(params).then(function (data){
				toaster.pop("success","",data.message);
				$rootScope.$broadcast('gatewayListReload',{data : "testServer"});
				$uibModalInstance.close();
			});
		 }
	 }
});

