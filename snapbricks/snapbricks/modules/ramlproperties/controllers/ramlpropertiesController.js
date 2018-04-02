var ramlpropertiesModule = angular.module('ramlpropertiesModule.controllers', ['ui.bootstrap','ngSanitize']);



//&&&&&&&&&&&&&&&&&&&&&&&&&&ramlpropertiesCtrl&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

ramlpropertiesModule.controller('ramlpropertiesCtrl', function ($scope, $rootScope, deviceModuleService,ramlpropertiesModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,toaster,$mdDialog,CustomMessages,gatewayModuleService) {

	$rootScope.globals = $cookieStore.get('globals') || {};
	
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;
    }

	$scope.arrayObjectIndexOf = function(arr, obj) {
		 for(var i = 0; i < arr.length; i++){
			if(angular.equals(arr[i], obj)){
				return i;
			}
		};
		return -1;
	}	
  $scope.meshlist =[];
	ramlpropertiesModuleService.getMeshData().then(function (data) {
		$scope.meshlist = data.Data;
	});
$scope.getGatewayFromMesh = function(mesh){
	//console.log(mesh);
	if(mesh != "" && mesh != undefined){
			localStorage.setItem('meshId',mesh);
			ramlpropertiesModuleService.getMeshDetailById(mesh).then(function (data) {
					$scope.gatewayDisplayName_all = data.Data.Data;
						if($scope.gatewayDisplayName_all != undefined || $scope.gatewayDisplayName_all != ""){
										
							var arr = JSON.stringify($scope.gatewayDisplayName_all);
							
							var arr2 = JSON.parse(arr);
							for (var i = 0; i<arr2.length; i++) {
								
								arr2[i].label = arr2[i].displayname;
								
								delete arr2[i].displayname;
								delete arr2[i].gatewaymanager_username;
								delete arr2[i].certificate;
								delete arr2[i].connectedtimestamp;
								delete arr2[i].createdts;
								delete arr2[i].gateway_status;
								delete arr2[i].gatewaymanager;
								delete arr2[i].tasks;
								delete arr2[i].packages;
								delete arr2[i].gatewaymeta;
								
							}
							$scope.jsonFormatData = arr2;		
						}		
					}).catch(function(error){
						$scope.jsonFormatData = [];
			});

	}
};	
$scope.deviceList = [];

   	$scope.params = {};
    $scope.completegSearch = function(){
		$( "#gSearch" ).autocomplete({
			
		source: $scope.jsonFormatData,
		autoFocus: false,
		select: function(event,ui){
			$timeout(function(){
				
			
			var UIvalue = ui.item.id;
			var UIlabel = ui.item.label;
			

			$( "#gSearch"  ).val(UIlabel);
			$scope.params = {"g_id":UIvalue};
			$scope.getDataDevice(1,$scope.params);	
			$scope.arrdevId = [];
			$scope.arrdevIdTemp = [];			
			event.preventDefault();
			
		});
				
				
				return false;
			},
		});    	
    }
	$scope.arrdevId = [];
	$scope.arrdevIdTemp = [];
	
	 $scope.getDataDevice = function(pageno,params){
		
		$scope.deviceList = [];
		$scope.currentDevicePage = pageno;
		$scope.devicePerPage = ENV.recordPerPage;
		$scope.dataLoading = true;
		
		deviceModuleService.getDeviceList(pageno,params).then(function (data) {

			$timeout(function(){

				if(data.Data != undefined){
					$scope.deviceList = data.Data;
					
					$scope.totalDevices = data.total_records;
					
				}else{
					$scope.totalDevices = 0;
				}

				$scope.selectedRow = null;
				$scope.setClickedRowDevice = function(index,device){
					$scope.selectedRow = index;
					$scope.selectedRowDevice = device;
						 if ($scope.arrdevId.length == 0) {
							$scope.arrdevId.push(device);
							$scope.arrdevIdTemp.push(device.id);
						} else {
							if ($scope.arrdevId.indexOf(device) == -1) {
								$scope.arrdevId.push(device);
								$scope.arrdevIdTemp.push(device.id);
							} else {
								var index = $scope.arrdevId.indexOf(device);
								var indexTemp = $scope.arrdevIdTemp.indexOf(device.id);
								$scope.arrdevId.splice(index, 1);
								$scope.arrdevIdTemp.splice(indexTemp, 1);
							}
						}
					
					};

					$scope.checkAllDevice = function (selectedAllDevice) {

						$scope.selectedAllDevice = selectedAllDevice;
						if ($scope.selectedAllDevice) {
							$scope.selectedAllDevice = true;
						} else {
							$scope.selectedAllDevice = false;
						}

						angular.forEach($scope.deviceList, function (device) {
							device.Selected = $scope.selectedAllDevice;
						});



					};
					$scope.checkStatus= function(device) {
						device.Selected = !device.Selected;
					};
					$scope.pageChanged5 = function(){
						
						$scope.getDataDevice($scope.currentDevicePage,params);	
					};
			});

				$scope.dataLoading = false;		
			}).catch(function(error){
				$scope.totalDevices = 0;
				
				$scope.dataLoading = false;		 
			});
	};
		
	
	/*$scope.checkedDevice = function(obj){
		
		 if ($scope.arrdevId.length == 0) {
            $scope.arrdevId.push(obj);
			$scope.arrdevIdTemp.push(obj.id);
        } else {
            if ($scope.arrdevId.indexOf(obj) == -1) {
                $scope.arrdevId.push(obj);
				$scope.arrdevIdTemp.push(obj.id);
            } else {
                var index = $scope.arrdevId.indexOf(obj);
                var indexTemp = $scope.arrdevIdTemp.indexOf(obj.id);
				$scope.arrdevId.splice(index, 1);
				$scope.arrdevIdTemp.splice(indexTemp, 1);
            }
        }
        //console.log(JSON.stringify($scope.arrdevId))
	}*/
    $scope.setDeviceraml = function(){
		//console.log('hello')
		
        localStorage.setItem('devList', JSON.stringify($scope.arrdevId))
        $location.path('ramlproperties/deviceraml')
		//localStorage.setItem('gatewayInfo',JSON.stringify($scope.gatewayInfo));	
		//localStorage.setItem('devList',JSON.stringify($scope.deviceList))
		//$location.path('gateway/detail/'+$scope.gatewayInfo.id+'/devices/raml')
	}
	$scope.getRAMLDef = function(page){

		$scope.getRAMList = [];
		$scope.currentRAMLPage = page;
		$scope.RAMLPerPage = ENV.recordPerPage;
		$scope.dataLoading = true;
		ramlpropertiesModuleService.getRAMLDefinitionTemplate(page).then(function(data){
			$scope.getRAMList = data.Data;
			$scope.totalItems = data.total_records;
				//console.log("My RAML is"+ JSON.stringify($scope.getRAMList))
			 $scope.dataLoading = false;
   
		});
		$scope.selectedRow = null;
			$scope.setClickedRowRAMLDefinition = function(index,ramll){				
			$scope.selectedRow = index;
			$scope.selectedRamll = ramll;
			if(ramll.Selected == true)
			{
			ramll.Selected=false;
			}else{
			ramll.Selected=true;
			}
		};

		$scope.pageChanged = function(){
			$scope.getRAMLDef($scope.currentRAMLPage);	
		}	
	}	
    $scope.getRAMLDef(1);
	
	$scope.getRAMLDev = function(page){
		$scope.getRAMList1 = [];
		$scope.dataLoading = true;
		$scope.currentRAMLPage = page;
		$scope.RAMLPerPage = ENV.recordPerPage;

		ramlpropertiesModuleService.getRAMLDeviceTemplate(page).then(function(data){
			$scope.getRAMList1 = data.Data;
			$scope.totalItemsDev = data.total_records;
			$scope.dataLoading = false;
	
		});
		$scope.selectedRow = null;
		$scope.setClickedRowRAMLDevice = function(index,ramll){
				
			$scope.selectedRow = index;
			$scope.selectedRamll = ramll;
			if(ramll.Selected == true)
			{
			ramll.Selected=false;
			}else{
			ramll.Selected=true;
			}
		};
		$scope.pageChanged1 = function(){
			$scope.getRAMLDev($scope.currentRAMLPage);	
		}

	};

	$scope.getRAMLDev(1);
	
	$scope.$on("updateList",function(e,a){
		 $scope.getRAMLDev(1);
	});
	
	$scope.refreshFuncDefinition = function(){
		$scope.getRAMLDef(1);
		$scope.getRAMLDef(1);
	};
	$scope.createRAML = function(){

		$location.path('/ramlproperties/addraml');
	};
	$scope.createTemplateRAML = function(){

		$location.path('/ramlproperties/addramltemplate');
	};
	
	$scope.editRAML = function(ramlDevId){
			if(ramlDevId != ""){
				localStorage.setItem('ramlDevId',JSON.stringify(ramlDevId));
			}
			$location.path('/ramlproperties/editramldefinition');	
	}
	$scope.deleteRamlDefinition = function(id,ev){
					 var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
								var $dialog = angular.element(document.querySelector('md-dialog'));
								var $actionsSection = $dialog.find('md-dialog-actions');
								var $cancelButton = $actionsSection.children()[0];
								var $confirmButton = $actionsSection.children()[1];
								angular.element($confirmButton).removeClass('md-focused');
								angular.element($cancelButton).addClass('md-focused');
								$cancelButton.focus();
					}})
				  .title("You are about to delete this Definition. Are you sure?")
				  .textContent("It can't be retrieved.")
				  .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
				  .targetEvent(ev)
				  .cancel(CustomMessages.MD_GENERAL_CANCEL)
				  .ok(CustomMessages.MD_GENERAL_OK);
			 $mdDialog.show(confirm).then(function() {
			
				ramlpropertiesModuleService.deleteRamlDefinition(id).then(function(data){
					if(data.message != undefined){
						$scope.message = data.message;
						$scope.getRAMLDef(1);
						toaster.pop('success','',$scope.message);
						
					}
					else{
						toaster.pop('error','',data.message)
					}
				
				});
			 });



	}
	$scope.refreshFuncDevices = function(){
		$scope.getRAMLDev(1);	
	};
	
	$scope.createRAMLDevice = function(ramlDevId){
		if(ramlDevId != ""){
			
				localStorage.setItem('ramlDevId',JSON.stringify(ramlDevId));
			
		}
			$location.path('/ramlproperties/addramlDevice');
	};	
	$scope.editRamlDevice = function(ramlDefId){
		if(ramlDefId != ""){
				localStorage.setItem('ramlDefId',ramlDefId);
		}
			$location.path('/ramlproperties/editramldevice');
	}
	$scope.deleteRamlDevice = function(id,ev){

		var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
        }})
          .title("You are about to delete this Device. Are you sure?")
          .textContent("It can't be retrieved.")
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .cancel(CustomMessages.MD_GENERAL_CANCEL)
          .ok(CustomMessages.MD_GENERAL_OK);
		 $mdDialog.show(confirm).then(function() {
		
			ramlpropertiesModuleService.deleteRamlDevice(id).then(function(data){
			
			   //alert("Response3 "+data);

			if(data.message != undefined){
				$scope.message = data.message;
				toaster.pop('success','',$scope.message);
			$scope.getRAMLDev($scope.currentRAMLPage);
			}
			else{
				toaster.pop('error','',data.message)
			}
			
			});
		 });
	};	

});