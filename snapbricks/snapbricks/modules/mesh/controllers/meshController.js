var meshModule = angular.module('meshModule.controllers', ['ui.bootstrap', 'ngSanitize','ngTagsInput','elif']);

meshModule.controller('meshCtrl', function($scope, $rootScope, meshModuleService,deviceModuleService, ENV, $cookieStore, $location,$filter,$timeout, $window, $uibModal,$state,toaster,CustomMessages,AclService) {
	$rootScope.globals = $cookieStore.get('globals') || {};
	if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;

	} 
	$scope.mainlist = true;
	$scope.viewGateway = false
	$scope.meshGroupList = function(pageno,params){
		$scope.meshList = []
		$scope.currentMeshPage = pageno;
		$scope.dataLoading = true
		$scope.meshPerPage = ENV.recordPerPage;
		meshModuleService.getMeshList(pageno,params).then(function(data){
			
			$timeout(function(){
				if(data.status ==204){
					$scope.meshList =[]
				}else{
				if(data.data.Data!=undefined){
					
					$scope.meshList = data.data.Data;
					$scope.totalmeshrecords = data.data.total_records;
				}

				$scope.dataLoading = false
			}
	
				$scope.setClickedRow = function(index,meshInfo){
					$scope.selectedRow = index;
					$scope.selectedRowMesh = meshInfo;
					
				};
				$scope.pageChanged = function(){

					$scope.meshGroupList($scope.currentMeshPage);	
				};
			},10)
				$scope.dataLoading = false
		});
	}
	$scope.meshGroupList(1)
	$scope.funConfig = function(selectedRowMesh){
	var modelInstance = $uibModal.open({
		animation:true,
		backdrop  : 'static',
		ariaLabelledBy:'modal-title',
		ariaDescribedBy:'modal-body',
		templateUrl:'meshConfig.html',
		controller:'meshConfigController',
		windowClass: 'app-modal-window',
		resolve:{
			dsparam:function(){
				return{'meshInformation':selectedRowMesh}
			}
		}
	});
}

	$scope.meshConnections = function(selectedMeshInformation){
		localStorage.setItem('meshname',selectedMeshInformation.name);

		localStorage.setItem('meshInfo',JSON.stringify(selectedMeshInformation));
		localStorage.setItem('meshId',selectedMeshInformation.id);
		$location.path('mesh/'+selectedMeshInformation.id+'/connections');
	}

	$scope.addGatewayGroups = function(){

		$location.path('mesh/addgatewaygroups');
	}


	$scope.addDeviceGroups = function(){
		$location.path('mesh/adddevicegroups');
	}


	$scope.selectedmeshServer = function(selectedMeshInformation){

		localStorage.setItem('meshname',selectedMeshInformation.name);

		localStorage.setItem('meshInfo',JSON.stringify(selectedMeshInformation));
		localStorage.setItem('meshId',selectedMeshInformation.id);
		$location.path('mesh/'+selectedMeshInformation.id+'/servers');

	};

	$scope.selectedgateway = function(selectedMeshInformation){


		localStorage.setItem('meshname',selectedMeshInformation.name);

		localStorage.setItem('meshInfo',JSON.stringify(selectedMeshInformation));
		localStorage.setItem('meshId',selectedMeshInformation.id);
		$location.path('mesh/'+selectedMeshInformation.id+'/gateways');

	};
	$scope.selectedDevices = function(selectedMeshInformation){

		localStorage.setItem('meshname',selectedMeshInformation.name);
		localStorage.setItem('meshInfo',JSON.stringify(selectedMeshInformation));
		localStorage.setItem('meshId',selectedMeshInformation.id);
		$location.path('mesh/'+selectedMeshInformation.id+'/devices');

    };
    $scope.viewdeviceGroups = function(selectedMeshInformation) {
        localStorage.setItem('meshname', selectedMeshInformation.name);
        localStorage.setItem('meshInfo', JSON.stringify(selectedMeshInformation));
        localStorage.setItem('meshId', selectedMeshInformation.id);
        $location.path('mesh/' + selectedMeshInformation.id + '/devicegroups');
    }
});


meshModule.controller('meshGatewayGroupCtrl', function($scope, $rootScope, meshModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster) {



});


meshModule.controller('meshAddGatewayCtrl', function($scope, $rootScope, meshModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, $uibModal) {
	$rootScope.globals = $cookieStore.get('globals') || {};

	if (!$rootScope.globals.currentUser) {

		$location.path('/login');
	} else {

		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;

	}
	
	$scope.selectedMeshInformation =$scope.mesh;
	//console.log("messhhhh",JSON.stringify($scope.selectedMeshInformation))
	$scope.gatewaytags = []
	$scope.selectedGatewayList = []

	$scope.addnewGatewayData = false

    $scope.getSelectedMeshDetail = function(pageno) {
        //console.log($scope.selectedMeshInformation);
        $scope.meshGatewayList = [];
        $scope.currentDevicePage = pageno;
        $scope.devicePerPage = ENV.recordPerPage;
        $scope.dataLoading = true;
        meshModuleService.getMeshDetailById($scope.selectedMeshInformation.id, pageno).then(function(data) {
            if (data.Data != undefined) {
                $scope.meshGatewayList = data.Data.Data;
                $scope.meshGatewayTotalRecords = data.Data.total_records;
                $scope.gatewaytags = $scope.meshGatewayList;
                $scope.dataLoading = false;
            } else {
                $scope.meshGatewayTotalRecords = 0;
                $scope.dataLoading = false;
            }
            $scope.selectedRow = null;
            $scope.setClickedRow = function(index, gateway) {

					$scope.selectedRow = index;
					$scope.selectedRowGateway = gateway;

					if(gateway.Selected == true)
					{
						gateway.Selected=false;
					}else{
						gateway.Selected=true;
					}
				};
				
		}).catch(function(error){
				$scope.meshGatewayTotalRecords =0;
				$scope.dataLoading = false;
		});
		$scope.pageChanged = function(){

		$scope.getSelectedMeshDetail($scope.currentDevicePage);	
		};
	}
$scope.getSelectedMeshDetail(1);


});
meshModule.controller('meshConfigController',function($scope, $uibModalInstance,$rootScope, meshModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, dsparam){
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
meshModule.controller('meshAnsibleServerCtrl', function($scope, $uibModal,$rootScope, meshModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster) {

	$rootScope.globals = $cookieStore.get('globals') || {};
	if (!$rootScope.globals.currentUser) {
	$location.path('/login');
} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		//$scope.channelid = $rootScope.channelid;

	}
	$scope.createServer = {};
	
	//$scope.createServerData = [];
	$scope.selectedRowMesh =JSON.parse(localStorage.getItem('meshInfo'));
	$scope.dataAddServerLoading = false;
	$scope.addnewServerData = false
//$scope.dataLoading = false;
$scope.dataLoadingMesh = false;
	$scope.$on('meshServerList',function(e,a){

		$scope.meshServerList = a;

	})

	$scope.getMeshServerList = function(pageno,id,params){
		$scope.currentServerPage = pageno;
		$scope.serverPerPage = ENV.recordPerPage;
		$scope.dataLoading = true;
		meshModuleService.getMeshServerList(id).then(function(data){
			if(data.Data!=undefined){
				
				$scope.meshServerList = data.Data
			}
			$scope.dataLoading = false;
			$scope.setClickedRow = function(index,server){
				$scope.selectedRow = index;
				$scope.selectedRowServer = server;
		
	};
})
	}

	$scope.getMeshServerList(1,$scope.selectedRowMesh.id);

});


meshModule.controller('meshDeviceGroupCtrl', function($scope, $rootScope, meshModuleService, deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, $mdDialog, CustomMessages, $uibModal) {
    $scope.addDeviceGroups = function() {
        //alert("here")
        localStorage.setItem('method', 'add');
        localStorage.setItem('meshname', $scope.displayname);
        localStorage.setItem('meshInfo', JSON.stringify($scope.mesh));
        localStorage.setItem('meshId', $scope.meshId);
        $location.path('mesh/' + $scope.meshId + '/devicegroups/adddevicegroups');
    }

    // Fetching Groups Data
    $scope.getDataGroupDevice = function(pageno, params) {
        $scope.deviceGroupList = [];
        $scope.currentDevicePage = pageno;
        $scope.devicePerPage = ENV.recordPerPage;
        $scope.dataLoading = true;
        meshModuleService.getDeviceGroups($scope.currentDevicePage, params).then(function(data) {

            $timeout(function() {

                if (data.Data != undefined) {
                    $scope.deviceGroupList = data.Data;
                    $scope.dataDeviceLoading = false;
                    $scope.totalItems = data.total_records;
                } else {
                    $scope.totalItems = 0;
                }

                $scope.selectedRow = null;
                $scope.setClickedRow = function(index, device) {
                    $scope.selectedRow = index;
                    $scope.selectedRowDevice = device;

                    if (device.Selected == true) {
                        device.Selected = false;
                    } else {
                        device.Selected = true;
                    }
                };

                $scope.checkAllDevice = function(selectedAllDevice) {

                    $scope.selectedAllDevice = selectedAllDevice;
                    if ($scope.selectedAllDevice) {
                        $scope.selectedAllDevice = true;
                    } else {
                        $scope.selectedAllDevice = false;
                    }

                    angular.forEach($scope.deviceList, function(device) {
                        device.Selected = $scope.selectedAllDevice;
                    });



                };
                $scope.checkStatus = function(device) {

                    device.Selected = !device.Selected;
                };
                $scope.pageChanged = function() {

                    $scope.getDataGroupDevice($scope.currentDevicePage, $scope.params);
                };

            });
            $scope.dataLoading = false;
        }).catch(function(error) {
            $scope.totalItems = 0;
            $scope.dataDeviceLoading = false;
            $scope.dataLoading = false;
        });
    };
    if ($scope.meshId != undefined) {
        $scope.params = { "meshID": $scope.meshId };
    }
    $scope.tags = [];


    $scope.getDataGroupDevice(1, $scope.params);
    $scope.editDeviceGroups = function(deviceList) {
        localStorage.setItem('method', 'edit');
        localStorage.setItem('editDeviceList', JSON.stringify(deviceList));

        $location.path('mesh/' + $scope.meshId + '/devicegroups/adddevicegroups');
    }

    $scope.refreshGroupFunc = function() {

        $scope.getDataGroupDevice(1, $scope.params);
    };

    $scope.deleteDeviceGroups = function(deviceList, ev) {


        var confirm = $mdDialog.confirm({
                onComplete: function afterShowAnimation() {
                    var $dialog = angular.element(document.querySelector('md-dialog'));
                    var $actionsSection = $dialog.find('md-dialog-actions');
                    var $cancelButton = $actionsSection.children()[0];
                    var $confirmButton = $actionsSection.children()[1];
                    angular.element($confirmButton).removeClass('md-focused');
                    angular.element($cancelButton).addClass('md-focused');
                    $cancelButton.focus();
                }
            })
            .title("You are about to delete this group. Are you sure?")
            .textContent("It can't be retrieved. All the actions related to this group are also deleted.")
            .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
            .targetEvent(ev)
            .cancel(CustomMessages.MD_GENERAL_CANCEL)
            .ok(CustomMessages.MD_GENERAL_OK);
        $mdDialog.show(confirm).then(function() {

            meshModuleService.deleteGroupRequests(deviceList.id).then(function(data) {

                if (data.message != undefined) {
                    $scope.message = data.message;
                    toaster.pop('success', '', $scope.message);
                    $state.reload();
                } else {
                    toaster.pop('error', '', data.message)
                }

            });
        });

    };

    $scope.actionProfiles = function(selectedDeviceGroup) {
        $scope.grpdeviceinfo = selectedDeviceGroup
        localStorage.setItem('grpdeviceinfo', JSON.stringify($scope.grpdeviceinfo));


        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalDeviceGroupActionProfile.html',
            controller: 'deviceGroupActionProfileCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                param: function() {
                    return { 'meshid': $scope.meshId, 'deviceGroupId': selectedDeviceGroup, 'mesh': $scope.mesh };
                }
            }

        });
        return false;
    }

});
meshModule.controller('meshaddDeviceGroupCtrl', function($scope, $rootScope, meshModuleService, meshModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster) {

    $rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;

    }

    $scope.devicegroupData = {};
    if ($scope.editDeviceInfo != undefined && $scope.editDeviceInfo != "undefined") {
        $scope.devicegroupData.name = $scope.editDeviceInfo.name;
        $scope.devicegroupData.description = $scope.editDeviceInfo.description;
        $scope.devicegroupData.deviceids = $scope.editDeviceInfo.deviceids;
        $scope.DeviceSavedList = $scope.devicegroupData.deviceids;
    }
    if ($scope.gatewayId != undefined) {
        $scope.params = { "g_id": $scope.gatewayId };
    }
    // alert($scope.devicegroupData)
    $scope.getDataDevice = function(pageno, params) {
        $scope.deviceList = [];
        $scope.currentDevicePage = pageno;
        $scope.devicePerPage = ENV.recordPerPage;
        $scope.dataLoading = true;
        $scope.deviceList = [];
        //$scope.params = { "selectedgateways": $scope.mesh.gateways }

        meshModuleService.deviceListbygatewayId(pageno, $scope.mesh.id).then(function(data) {

            $timeout(function() {

                if (data.Data != undefined) {
                    $scope.deviceList = data.Data;
                    $scope.dataDeviceLoading = false;
                    $scope.totalItems = data.total_records;
                } else {
                    $scope.totalItems = 0;
                }

                $scope.selectedRow = null;
                $scope.setClickedRow = function(index, device) {
                    $scope.selectedRow = index;
                    $scope.selectedRowDevice = device;
                    if (device.Selected == true) {
                        device.Selected = false;
                    } else {
                        device.Selected = true;
                    }
                };

                $scope.pageChanged = function() {

                    $scope.getDataDevice($scope.currentDevicePage, $scope.params);
                };

                $scope.checkAllDevice = function(selectedAllDevice) {

                    $scope.selectedAllDevice = selectedAllDevice;
                    if ($scope.selectedAllDevice) {
                        $scope.selectedAllDevice = true;
                    } else {
                        $scope.selectedAllDevice = false;
                    }

                    angular.forEach($scope.deviceList, function(device) {
                        device.Selected = $scope.selectedAllDevice;
                    });



                };
                $scope.checkStatus = function(device) {

                    device.Selected = !device.Selected;
                };
            });
            $scope.dataLoading = false;
        }).catch(function(error) {
            $scope.totalItems = 0;
            $scope.dataDeviceLoading = false;
            $scope.dataLoading = false;
        });
    };



    $scope.tags = [];

    $scope.getDataDevice(1, $scope.params);

    $scope.tags = $scope.devicegroupData.deviceids;
    $scope.removeTags1 = function(device) {

        var index = $scope.tags.indexOf(device);
        $scope.tags.splice(index, 1);

    };


    $scope.addGroups = function(devicegroupData, device) {


        var arr1 = []
        angular.forEach($scope.DeviceSavedList, function(device) {
            $scope.deviceIds = device.id
            arr1.push($scope.deviceIds)
        });

        var SocketCollection = [];

        $scope.grpName = devicegroupData.name;
        $scope.grpDesc = devicegroupData.description;
        $scope.datasaveGroupLoading = true;

        if ($scope.grpName == null || $scope.grpName == undefined) {
            toaster.pop("error", "", "Group Name is neccesary.");
            $scope.datasaveGroupLoading = false;
            return false;
        }


        if ($scope.grpDesc == null || $scope.grpDesc == undefined) {
            toaster.pop("error", "", "Group Description is necessary.");
            $scope.datasaveGroupLoading = false;
            return false;
        }

        $scope.datasaveGroupLoading = true;


        meshModuleService.addDeviceGroups($scope.grpName, $scope.grpDesc, arr1, $scope.meshId).then(function(data) {
            $scope.devgroupId = data.id;
            if (data.status == 404 || data.status == 400) {
                toaster.pop("error", "", data.data.message)
                $scope.dataLoading = false;
                //return false;
            } else {
                $scope.datasaveGroupLoading = false;
                toaster.pop('success', '', 'Device group created Successfully');
                $location.path('mesh/' + $scope.meshId + '/devicegroups');
            }

            $scope.devicegroupData = {};

        });

    }


    //**********************************************

    $scope.editGroups = function(devicegroupData, device) {
        $scope.editDeviceInfo = JSON.parse(localStorage.getItem('editDeviceList'));


        var arr1 = []
        angular.forEach($scope.DeviceSavedList, function(device) {
            $scope.deviceIds = device.id
            arr1.push($scope.deviceIds)
        });

        var SocketCollection = [];

        $scope.grpName = devicegroupData.name;
        $scope.grpDesc = devicegroupData.description;
        $scope.datasaveGroupLoading = true;
        $scope.groupsId = $scope.editDeviceInfo.id
        if ($scope.grpName == null || $scope.grpName == undefined) {
            toaster.pop("error", "", "Group Name is neccesary.");
            $scope.datasaveGroupLoading = false;
            return false;
        }



        if ($scope.grpDesc == null || $scope.grpDesc == undefined) {
            toaster.pop("error", "", "Group Description is necessary.");
            $scope.datasaveGroupLoading = false;
            return false;
        }

        $scope.dataLoading = true;


        meshModuleService.editDeviceGroup($scope.grpName, $scope.grpDesc, arr1, $scope.meshId, $scope.groupsId).then(function(data) {
            if (data.status == 404 || data.status == 400) {
                toaster.pop("error", "", data.data.message)
                //return false;
            } else {
                $scope.datasaveGroupLoading = false;
                toaster.pop('success', '', 'Device group edited Successfully');
                $location.path('mesh/' + $scope.meshId + '/devicegroups');
            }

            $scope.devicegroupData = {};
            localStorage.removeItem('editDeviceList')
        });

    }

    //***********************************************



    $scope.getDeviceinfo = function(device) {

        if (device != "") {
            if ($scope.tags == undefined) {
                $scope.tags = [];
            }
            var found = $filter('filter')($scope.tags, { id: device.id }, true);

            if (found.length > 0) {} else {
                $scope.tags.push(device);

            }
        }
    };
    $scope.alreadyExists = function(device) {
        if ($scope.tags == undefined) {
            $scope.tags = [];
        }
        var found = $filter('filter')($scope.tags, { id: device.id }, true);
        if (found.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    $scope.removeTags = function(device) {
        //$scope.tags;
        var index = $scope.tags.indexOf(device);
        $scope.tags.splice(index, 1);
    };


    $scope.savedeviceGroups = function(device) {

        $scope.DeviceSavedList = $scope.tags;


        $('#myModaladddevice').modal('hide');
    };

    $scope.cleardeviceGroups = function() {
        $scope.DevicesList = [];
        $scope.tags = [];
        $('#myModaladddevice').modal('hide');
    }

});

meshModule.controller('meshDevicesCtrl', function($scope, $rootScope, meshModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster) {

	$rootScope.globals = $cookieStore.get('globals') || {};
	if (!$rootScope.globals.currentUser) {
	$location.path('/login');
} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;

	}
	$scope.gatewaytags = []
	$scope.selectedRowMesh = $scope.mesh
	$scope.selectedGatewayList = [];
	
	
	$scope.getDataDevice = function(pageno, params) {
        $scope.deviceList = [];
        $scope.currentDevicePage = pageno;
        $scope.devicePerPage = ENV.recordPerPage;
        $scope.dataLoading = true;
        $scope.deviceList = [];
        // $scope.params = { "selectedgateways": $scope.mesh.gateways }
        console.log($scope.mesh)
        meshModuleService.deviceListbygatewayId(pageno, $scope.mesh.id).then(function(data) {

            $timeout(function() {

                if (data.Data != undefined) {
                    $scope.deviceList = data.Data;
                    $scope.dataDeviceLoading = false;
                    $scope.totalItems = data.total_records;
                } else {
                    $scope.totalItems = 0;
                }

                $scope.selectedRow = null;
                $scope.setClickedRow = function(index, device) {
                    $scope.selectedRow = index;
                    $scope.selectedRowDevice = device;
                    if (device.Selected == true) {
                        device.Selected = false;
                    } else {
                        device.Selected = true;
                    }
                };

                $scope.pageChanged = function() {

                    $scope.getDataDevice($scope.currentDevicePage, $scope.params);
                };

                $scope.checkAllDevice = function(selectedAllDevice) {

                    $scope.selectedAllDevice = selectedAllDevice;
                    if ($scope.selectedAllDevice) {
                        $scope.selectedAllDevice = true;
                    } else {
                        $scope.selectedAllDevice = false;
                    }

                    angular.forEach($scope.deviceList, function(device) {
                        device.Selected = $scope.selectedAllDevice;
                    });



                };
                $scope.checkStatus = function(device) {

                    device.Selected = !device.Selected;
                };
            });
            $scope.dataLoading = false;
        }).catch(function(error) {
            $scope.totalItems = 0;
            $scope.dataDeviceLoading = false;
            $scope.dataLoading = false;
        });
    };

$scope.getDataDevice(1);

});


meshModule.controller('meshConnectionCtrl', function($scope, $rootScope, meshModuleService, deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog) {

    var network = null;

    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;
        //$scope.channelid = $rootScope.globals.currentUser.channelid;
    }

    if(localStorage.getItem('meshNewjson')!=undefined){
        $scope.meshpath = JSON.parse(localStorage.getItem('meshNewjson'))
    }else{
   $scope.meshpath = {
   "Data":[
      {
         "gatewayname":"Zydus_General_Ward",
         "networks":[
            "ZYDUS_AHM_GUJ"
         ],
         "gateway_info": {
            "serialnumber" : "N/A",
            "staticip" : "10.115.3.64",
            "CPU_count" : "4",
            "harddisk" : "9.8G",
            "longitude" : 0,
            "macid" : "b8:27:eb:32:ef:aa",
            "hardware" : "ARMv7",
            "latitude" : 0,
            "modelname" : "ARMv7 Processor rev 4 (v7l)",
            "ram" : "925MiB",
            "address" : "",
            "usb" : 1,
            "os" : "Ubuntu 16.04.2 LTS",
            "architecture" : "armv7l"
         },
         "cloud_connectivity":"MQTT",
         "re_installed" : false
      },
      {
         "gatewayname":"Zydus_ICU",
         "networks":[
            "ZYDUS_AHM_GUJ"
         ],
         "gateway_info": {
            "serialnumber" : " 710MWBAD10000335",
            "staticip" : "172.17.0.3",
            "CPU_count" : "8",
            "harddisk" : "3.5G",
            "longitude" : 0,
            "macid" : "02:42:ac:11:00:03",
            "hardware" : "Samsung",
            "latitude" : 0,
            "modelname" : "Samsung artik710 raptor board based on s5p6818",
            "ram" : "957MiB",
            "address" : "",
            "usb" : 3,
            "os" : "Ubuntu 16.04.2 LTS",
            "architecture" : "armv7l"
         },
         "cloud_connectivity":"No cloud connectivity",
         "connected_to":"Zydus_General_Ward",
         "re_installed" : false
      },
      {
         "gatewayname":"Zydus_OPD",
         "networks":[
            "ZYDUS_AHM_GUJ"
         ],
         "gateway_info": {
            "serialnumber" : "N/A",
            "staticip" : "10.100.21.12",
            "meshID" : "5982f6581d41c82d24bbe58",
            "harddisk" : "46G",
            "CPU_count" : "4",
            "longitude" : 0,
            "macid" : "74:e6:e2:2c:f7:98",
            "hardware" : "Intel(R)",
            "latitude" : 0,
            "modelname" : "Intel(R) Core(TM) i3-4005U CPU @ 1.70GHz",
            "ram" : "8GiB",
            "address" : "",
            "usb" : 3,
            "os" : "Ubuntu 16.04.2 LTS",
            "architecture" : "x86_64"
         },
         "cloud_connectivity":"No cloud connectivity",
         "connected_to": "Zydus_General_Ward",
         "re_installed" : false
      },
      {
         "gatewayname":"Zydus_Emergency_Room",
         "networks":[
            "ZYDUS_AHM_GUJ"
         ],
         "gateway_info": {
            "serialnumber" : "N/A",
            "staticip" : "10.100.21.13",
            "meshID" : "5982f6581d41c82d24bbe58",
            "harddisk" : "46G",
            "CPU_count" : "4",
            "longitude" : 0,
            "macid" : "74:e6:e2:2c:f7:98",
            "hardware" : "Intel(R)",
            "latitude" : 0,
            "modelname" : "Intel(R) Core(TM) i3-4005U CPU @ 1.70GHz",
            "ram" : "8GiB",
            "address" : "",
            "usb" : 3,
            "os" : "Ubuntu 16.04.2 LTS",
            "architecture" : "x86_64"
         },
         "cloud_connectivity":"No cloud connectivity",
         "connected_to": "Zydus_General_Ward",
         "re_installed" : true
      },
      {
         "gatewayname":"Zydus_Labor_Room",
         "networks":[
            "ZYDUS_AHM_GUJ"
         ],
         "gateway_info": {
            "serialnumber" : "N/A",
            "staticip" : "10.100.17.205",
            "CPU_count" : "4",
            "harddisk" : "46G",
            "longitude" : 0,
            "macid" : "98:40:bb:18:17:a6",
            "hardware" : "Intel(R)",
            "latitude" : 0,
            "modelname" : "Intel(R) Core(TM) i3-5005U CPU @ 2.00GHz",
            "ram" : "8GiB",
            "address" : "",
            "usb" : 3,
            "os" : "Ubuntu 16.04.3 LTS",
            "architecture" : "x86_64"
         },
         "cloud_connectivity":"No cloud connectivity",
         "connected_to": "Zydus_General_Ward",
         "re_installed" : false
      }
   ]
}
   
   localStorage.setItem('meshjson',JSON.stringify($scope.meshpath))
}
       /* meshModuleService.getGatewaySchedulerData($scope.meshId, app, $scope.mesh.network).then(function(response) {
            if (response.data.Data != undefined) {
                $scope.mqttGwList = response.data.Data
                for (var i = 0; i < $scope.mqttGwList.length; i++) {
                    if ($scope.mqttGwList.length == 1) {
                        if ($scope.mqttGwList[i].displayname == 'Zydus_General_Ward') {
                            $scope.meshpath = 'modules/mesh/data1.json';
                            //console.log($scope.meshpath)
                        } else if ($scope.mqttGwList[i].displayname == 'SnapbricksGateway_2') {
                            $scope.meshpath = 'modules/mesh/data2.json';
                            // console.log($scope.meshpath)
                        }
                    } else if ($scope.mqttGwList.length == 2 && i + 2 <= $scope.mqttGwList.length) {
                        if (($scope.mqttGwList[i].displayname == 'SnapbricksGateway_1' && $scope.mqttGwList[i + 1].displayname == 'SnapbricksGateway_2') || ($scope.mqttGwList[i].displayname == 'SnapbricksGateway_2' && $scope.mqttGwList[i + 1].displayname == 'SnapbricksGateway_1')) {
                            $scope.meshpath = 'modules/mesh/data3.json';
                        }
                    }
                }
*/
 

                //For OT Bus Connection
                $scope.ot_data_json = function(data){
                    var json = {};
                    var nodes = [];
                    var edges = [];
                    var colors = [];
                    var typesWithColor = {};
                    var typesList = {};
                    var typesWithId = {};

        var totalGateways = data.Data.length;
        for (var i = 0; i < totalGateways; i++) {
            var obj = {};
            obj.id = i + 1;
            obj.label = data.Data[i].gatewayname;
            var networks = data.Data[i].networks.sort();
            if (networks.length > 1) {
                obj.label += ' (Bridge Gateway)';
            }
            var n = networks.slice();
            var networkList = getNetworkString(networks);
            if (typesWithColor.hasOwnProperty(networkList)) {
                obj.colors = typesWithColor[networkList];
                obj.color = typesWithColor[networkList][0];
            } else {
                var c = [];
                for (var j = 0; j < n.length; j++) {
                    if (typesWithColor.hasOwnProperty(n[j])) {
                        c = c.concat(typesWithColor[n[j]]);
                    } else {
                        var color = getRandomcolor();
                        var t1 = [];
                        var n1 = [];
                        t1.push(color);
                        n1.push(n[j]);
                        typesWithColor[n[j]] = t1;
                        typesList[n[j]] = n1;
                        c.push(color);
                    }
                }
                obj.color = c[0];
                obj.colors = c;
                typesWithColor[networkList] = c;
                typesList[networkList] = n;
            }
            obj.networks = n;
            obj.type = networkList;
            obj.shape = "dot";

            var title = obj.label + " : " + obj.type;
            var d = {};
            d["Network"] = obj.type;

            if (data.Data[i].hasOwnProperty("gateway_info")) {
                var keys = Object.keys(data.Data[i].gateway_info);
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    var value = data.Data[i].gateway_info[keys[j]];
                    var k = key.charAt(0).toUpperCase() + key.slice(1);
                    d[k] = value;
                }
            }

            obj.details = {};
            obj.details[obj.label] = d;
            obj.title = title;
            nodes.push(obj);
        }

        var clusters = Object.keys(typesWithColor);
        var count = totalGateways;
        for (var i = 0; i < clusters.length; i++) {
            if (typesList[clusters[i]].length == 1) {
                totalGateways++;
                var obj = {};
                obj.id = totalGateways;
                obj.type = clusters[i];
                obj.label = clusters[i];
                obj.title = clusters[i];
                obj.shape = 'star';
                obj.colors = typesWithColor[clusters[i]];
                obj.color = typesWithColor[clusters[i]][0];
                typesWithId[clusters[i]] = totalGateways;
                nodes.push(obj);
            }
        }

        for (var i = 0; i < count; i++) {
            var networks = typesList[nodes[i].type];
            for (var j = 0; j < networks.length; j++) {
                var obj = {};
                obj["from"] = nodes[i].id;
                obj["to"] = typesWithId[networks[j]];
                obj["color"] = { "inherit": "to" }
                edges.push(obj);
            }
            if (networks.length > 1) {
                var obj = {};
                obj["from"] = nodes[i].id;
                obj["to"] = typesWithId[nodes[i].type];
                obj["color"] = { "inherit": "to" }
                edges.push(obj);
            }
        }
        json.nodes = nodes;
        json.edges = edges;
        $scope.ot_data = json;

        function getNetworkString(networkList) {
            if (networkList.length == 0) {
                return '';
            } else if (networkList.length == 1) {
                return networkList[0];
            } else if (networkList.length == 2) {
                return networkList[0] + " & " + networkList[1];
            } else {
                var str = networkList[0] + ", ";
                networkList.splice(0, 1);
                return str + getNetworkString(networkList);
            }
        }

                    function getRandomcolor() {
                        var flag = true;
                        while (flag) {
                            var color = '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
                            if ($.inArray(color, colors) == -1) {
                                colors.push(color);
                                flag = false;
                                return color;
                            }
                        }
                    }
                };


$scope.ot_data_json($scope.meshpath)




                //For IT Bus Connection
                $scope.it_data_json = function(data) {
                    var json = {};
                    var nodes = [];
                    var edges = [];
                    var colors = [];
                    var typesWithColor = {};
                    var typesList = {};
                    var typesWithId = {};

        var totalGateways = data.Data.length;
        for (var i = 0; i < totalGateways; i++) {
            var obj = {};
            obj.id = i + 1;
            obj.label = data.Data[i].gatewayname;
            obj.gatewayname = data.Data[i].gatewayname;
            // obj.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            var networks = data.Data[i].networks.sort();
            if (networks.length > 1) {
                obj.label += ' (Bridge Gateway)';
            }
            var n = networks.slice();
            var networkList = getNetworkString(networks);
            if (typesWithColor.hasOwnProperty(networkList)) {
                obj.colors = typesWithColor[networkList];
                obj.color = typesWithColor[networkList][0];
            } else {
                var c = [];
                for (var j = 0; j < n.length; j++) {
                    if (typesWithColor.hasOwnProperty(n[j])) {
                        c = c.concat(typesWithColor[n[j]]);
                    } else {
                        var color = getRandomcolor();
                        var t1 = [];
                        var n1 = [];
                        t1.push(color);
                        n1.push(n[j]);
                        typesWithColor[n[j]] = t1;
                        typesList[n[j]] = n1;
                        c.push(color);
                    }
                }
                obj.color = c[0];
                obj.colors = c;
                typesWithColor[networkList] = c;
                typesList[networkList] = n;
            }
            obj.networks = n;
            obj.type = networkList;
            obj.shape = "dot";
            var title = obj.label + " : " + obj.type;

            var d = {};

            if (data.Data[i].hasOwnProperty("cloud_connectivity")) {
                title += "<br/>";
                title += "Connection : ";
                if (data.Data[i].cloud_connectivity == "No cloud connectivity") {
                    obj.it = false;
                } else {
                    obj.it = true;
                }
                d["Connection"] = data.Data[i].cloud_connectivity;
                title += d["Connection"];
            }

            d["Network"] = obj.type;

            if (data.Data[i].hasOwnProperty("gateway_info")) {
                var keys = Object.keys(data.Data[i].gateway_info);
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    var value = data.Data[i].gateway_info[keys[j]];
                    var k = key.charAt(0).toUpperCase() + key.slice(1);
                    d[k] = value;
                }
            }

            obj.details = {};
            obj.details[obj.label] = d;
            obj.title = title;
            nodes.push(obj);
        }

        var clusters = Object.keys(typesWithColor);
        var count = totalGateways;
        for (var i = 0; i < clusters.length; i++) {
            if (typesList[clusters[i]].length == 1) {
                totalGateways++;
                var obj = {};
                obj.id = totalGateways;
                obj.type = clusters[i];
                obj.label = clusters[i];
                obj.title = clusters[i];
                obj.shape = 'star';
                obj.colors = typesWithColor[clusters[i]];
                obj.color = typesWithColor[clusters[i]][0];
                typesWithId[clusters[i]] = totalGateways;
                nodes.push(obj);
            }
        }

        for (var i = 0; i < count; i++) {
            var networks = typesList[nodes[i].type];
            for (var j = 0; j < networks.length; j++) {
                var obj = {};
                obj["from"] = nodes[i].id;
                obj["to"] = typesWithId[networks[j]];
                obj["color"] = { "inherit": "to" }
                obj["dashes"] = true;
                edges.push(obj);
            }
            if (networks.length > 1) {
                var obj = {};
                obj["from"] = nodes[i].id;
                obj["to"] = typesWithId[nodes[i].type];
                obj["color"] = { "inherit": "to" }
                edges.push(obj);
            }
        }

        for (var node = 0; node < nodes.length; node++) {
            var obj = nodes[node];
            if (!obj.it) {
                for (var k = 0; k < data.Data.length; k++) {
                    if (data.Data[k].gatewayname == obj.gatewayname) {
                        if (data.Data[k].hasOwnProperty("connected_to")) {
                            for (var l = 0; l < nodes.length; l++) {
                                if (data.Data[k].connected_to == nodes[l].gatewayname) {
                                    var edge = {};
                                    edge["from"] = obj.id;
                                    edge["to"] = nodes[l].id;
                                    edge["color"] = { "inherit": "to" }
                                    edge["arrows"] = 'to';
                                    edge["width"] = 6;
                                    edge["smooth"] = { type: 'continuous' }
                                    edge["length"] = 200;
                                    edges.push(edge);
                                }
                            }
                        }
                    }
                }
            }
        }

        json.nodes = nodes;
        json.edges = edges;
        $scope.it_data = json;

        function getNetworkString(networkList) {
            if (networkList.length == 0) {
                return '';
            } else if (networkList.length == 1) {
                return networkList[0];
            } else if (networkList.length == 2) {
                return networkList[0] + " & " + networkList[1];
            } else {
                var str = networkList[0] + ", ";
                networkList.splice(0, 1);
                return str + getNetworkString(networkList);
            }
        }

                    function getRandomcolor() {
                        var flag = true;
                        while (flag) {
                            var color = '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
                            if ($.inArray(color, colors) == -1) {
                                colors.push(color);
                                flag = false;
                                return color;
                            }
                        }
                    }
                }

                $scope.it_data_json($scope.meshpath)








                //For RE bus connection
                $scope.re_data_json = function(data) {
                    var json = {};
                    var nodes = [];
                    var edges = [];
                    var colors = [];
                    var typesWithColor = {};
                    var typesList = {};
                    var typesWithId = {};

        var totalGateways = data.Data.length;
        for (var i = 0; i < totalGateways; i++) {
            var obj = {};
            obj.id = i + 1;
            obj.label = data.Data[i].gatewayname;
            // obj.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            var networks = data.Data[i].networks.sort();
            if (networks.length > 1) {
                obj.label += ' (Bridge Gateway)';
            }
            var n = networks.slice();
            var networkList = getNetworkString(networks);
            if (typesWithColor.hasOwnProperty(networkList)) {
                obj.colors = typesWithColor[networkList];
                obj.color = typesWithColor[networkList][0];
            } else {
                var c = [];
                for (var j = 0; j < n.length; j++) {
                    if (typesWithColor.hasOwnProperty(n[j])) {
                        c = c.concat(typesWithColor[n[j]]);
                    } else {
                        var color = getRandomcolor();
                        var t1 = [];
                        var n1 = [];
                        t1.push(color);
                        n1.push(n[j]);
                        typesWithColor[n[j]] = t1;
                        typesList[n[j]] = n1;
                        c.push(color);
                    }
                }
                obj.color = c[0];
                obj.colors = c;
                typesWithColor[networkList] = c;
                typesList[networkList] = n;
            }
            obj.networks = n;
            obj.type = networkList;
            obj.shape = "dot";
            var title = obj.label + " : " + obj.type;

            var d = {};

            if (data.Data[i].hasOwnProperty('re_installed')) {
                title += "<br/>";
                title += "Rule Engine : ";
                if (data.Data[i].re_installed) {
                    obj.re = true;
                    d["Rule Engine"] = "Installed";
                } else {
                    obj.re = false;
                    d["Rule Engine"] = "Not installed";
                }
                title += d["Rule Engine"];
            }

            d["Network"] = obj.type;

            if (data.Data[i].hasOwnProperty('gateway_info')) {
                var keys = Object.keys(data.Data[i].gateway_info);
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    var value = data.Data[i].gateway_info[keys[j]];
                    var k = key.charAt(0).toUpperCase() + key.slice(1);
                    d[k] = value;
                }
            }

            obj.details = {};
            obj.details[obj.label] = d;
            obj.title = title;
            nodes.push(obj);
        }

        var clusters = Object.keys(typesWithColor);
        var count = totalGateways;
        for (var i = 0; i < clusters.length; i++) {
            if (typesList[clusters[i]].length == 1) {
                totalGateways++;
                var obj = {};
                obj.id = totalGateways;
                obj.type = clusters[i];
                obj.label = clusters[i];
                obj.title = clusters[i];
                obj.shape = 'star';
                obj.colors = typesWithColor[clusters[i]];
                obj.color = typesWithColor[clusters[i]][0];
                typesWithId[clusters[i]] = totalGateways;
                nodes.push(obj);
            }
        }

        for (var i = 0; i < count; i++) {
            var networks = typesList[nodes[i].type];
            for (var j = 0; j < networks.length; j++) {
                var obj = {};
                obj["from"] = nodes[i].id;
                obj["to"] = typesWithId[networks[j]];
                obj["color"] = { "inherit": "to" }
                edges.push(obj);
            }
            if (networks.length > 1) {
                var obj = {};
                obj["from"] = nodes[i].id;
                obj["to"] = typesWithId[nodes[i].type];
                obj["color"] = { "inherit": "to" }
                edges.push(obj);
            }
        }
        json.nodes = nodes;
        json.edges = edges;
        $scope.re_data = json;

        function getNetworkString(networkList) {
            if (networkList.length == 0) {
                return '';
            } else if (networkList.length == 1) {
                return networkList[0];
            } else if (networkList.length == 2) {
                return networkList[0] + " & " + networkList[1];
            } else {
                var str = networkList[0] + ", ";
                networkList.splice(0, 1);
                return str + getNetworkString(networkList);
            }
        }

        function getRandomcolor() {
            var flag = true;
            while (flag) {
                var color = '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
                if ($.inArray(color, colors) == -1) {
                    colors.push(color);
                    flag = false;
                    return color;
                }
            }
        }

                };
      $scope.re_data_json($scope.meshpath)

    

    $scope.ot_bus_button_clicked = false;
    $scope.it_bus_button_clicked = false;
    $scope.re_app_button_clicked = false;
    $scope.app_transfer_clicked = false;
    $scope.add_redundancy_clicked = false;
    $scope.gateway_selected = false;
     $scope.kill_app_clicked = false;

 //   meshpath = 'modules/mesh/data.json';
    //var meshdisplayname = ($scope.displayname).toLowerCase();

    /*if(meshdisplayname.indexOf('zone') != -1)
    {
        meshpath = 'modules/mesh/data_ez.json';
    }
    else if(meshdisplayname.indexOf('workshop') != -1)
    {
        meshpath = 'modules/mesh/data_fw.json';
    }
    else if(meshdisplayname.indexOf('ap') != -1)
    {
        meshpath = 'modules/mesh/data_ei.json';
    }*/







    $scope.transferApp = function(app,from,to){
    	
        $scope.fromGw = from
        $scope.toGw = to;
        for(var i=0;i<$scope.meshpath.Data.length;i++){
            if($scope.meshpath.Data[i].gatewayname == $scope.fromGw){
                $scope.meshpath.Data[i].re_installed = false;
            }
            if($scope.meshpath.Data[i].gatewayname == $scope.toGw){
                $scope.meshpath.Data[i].re_installed = true;
            }
        }
        $scope.ot_data_json($scope.meshpath)
        $scope.it_data_json($scope.meshpath)
        $scope.re_data_json($scope.meshpath)
        localStorage.setItem('meshNewjson',JSON.stringify($scope.meshpath))
        $state.reload();
        $timeout(function(){
        toaster.pop("success",'',"Successfully uninstalled from "+$scope.fromGw)
        toaster.pop("success",'',"Successfully installed in "+$scope.toGw)
        },100)
       
    }

    $scope.addRedundancy = function(app,exists,add){
        $scope.existsGw = exists;
        $scope.addGw = add;
        for(var i=0;i<$scope.meshpath.Data.length;i++){
            if($scope.meshpath.Data[i].gatewayname == $scope.addGw){
                $scope.meshpath.Data[i].cloud_connectivity = "MQTT" ;
                delete $scope.meshpath.Data[i]['connected_to']
            }
        }
        $scope.mqttGW = []
        

        $scope.ot_data_json($scope.meshpath)
        $scope.it_data_json($scope.meshpath)
        $scope.re_data_json($scope.meshpath)
        localStorage.setItem('meshNewjson',JSON.stringify($scope.meshpath))
        $state.reload();
         $timeout(function(){
        
        toaster.pop("success",'',"Successfully installed in "+$scope.addGw)
        },100)
    }

$scope.killApp = function(app,gateway){
for(var i=0;i<$scope.meshpath.Data.length;i++){
            if($scope.meshpath.Data[i].gatewayname == gateway){
                $scope.meshpath.Data[i].cloud_connectivity = "No cloud connectivity" ;
                $scope.meshpath.Data[i].connected_to = ""
            }
        }
        for(var i=0;i<$scope.meshpath.Data.length;i++){
            if($scope.meshpath.Data[i].cloud_connectivity == "MQTT"){
                $scope.mqttGw = $scope.meshpath.Data[i].gatewayname
            }
        }
        for(var i=0;i<$scope.meshpath.Data.length;i++){
            if($scope.meshpath.Data[i].connected_to == gateway ||$scope.meshpath.Data[i].connected_to=='' ){
                $scope.meshpath.Data[i].connected_to = $scope.mqttGw
            }
        }
        $scope.ot_data_json($scope.meshpath)
        $scope.it_data_json($scope.meshpath)
        $scope.re_data_json($scope.meshpath)
        localStorage.setItem('meshNewjson',JSON.stringify($scope.meshpath))
        $state.reload();
         $timeout(function(){
        
        toaster.pop("success",'',"Successfully uninstalled in "+gateway)
        },100)
}











    $scope.ot_bus_button = function() {
        $scope.ot_bus_button_clicked = true;
        $scope.it_bus_button_clicked = false;
        $scope.re_app_button_clicked = false;
        $scope.app_transfer_clicked = false;
        $scope.add_redundancy_clicked = false;
        $scope.gateway_selected = false;
         $scope.kill_app_clicked = false;
    }

    $scope.it_bus_button = function() {
        $scope.ot_bus_button_clicked = false;
        $scope.it_bus_button_clicked = true;
        $scope.re_app_button_clicked = false;
        $scope.app_transfer_clicked = false;
        $scope.add_redundancy_clicked = false;
        $scope.gateway_selected = false;
         $scope.kill_app_clicked = false;
    }

    $scope.re_app_button = function() {
        $scope.ot_bus_button_clicked = false;
        $scope.it_bus_button_clicked = false;
        $scope.re_app_button_clicked = true;
        $scope.app_transfer_clicked = false;
        $scope.add_redundancy_clicked = false;
        $scope.gateway_selected = false;
         $scope.kill_app_clicked = false;
    }

    $scope.app_transfer = function(){
    	 $scope.ot_bus_button_clicked = false;
        $scope.it_bus_button_clicked = false;
        $scope.re_app_button_clicked = false;
        $scope.app_transfer_clicked = true;
        $scope.add_redundancy_clicked = false;
        $scope.gateway_selected = false;
         $scope.kill_app_clicked = false;
    }
      $scope.add_redundancy = function(){
    	 $scope.ot_bus_button_clicked = false;
        $scope.it_bus_button_clicked = false;
        $scope.re_app_button_clicked = false;
        $scope.app_transfer_clicked = false;
        $scope.add_redundancy_clicked = true;
        $scope.gateway_selected = false;
         $scope.kill_app_clicked = false;
    }

  $scope.kill_app = function(){
         $scope.ot_bus_button_clicked = false;
        $scope.it_bus_button_clicked = false;
        $scope.re_app_button_clicked = false;
        $scope.app_transfer_clicked = false;
        $scope.add_redundancy_clicked = false;
        $scope.kill_app_clicked = true;
        $scope.gateway_selected = false;
    }


    $scope.redrawFilteredGraph = function(json, filterfield, nodetype) {
        var filteredJson = {}
        var nodes = json.nodes;
        var edges = json.edges;
        var filteredNodes = [];
        var nodesSize = nodes.length;
        for (var i = 0, len = nodesSize; i < len; ++i) {
            // if($.inArray(nodetype, nodes[i].networks) != -1)
            if (nodes[i].type == nodetype || $.inArray(nodetype, nodes[i].networks) != -1) {
                filteredNodes.push(nodes[i]);
            }
        }
        filteredJson["nodes"] = filteredNodes;
        filteredJson["edges"] = edges;
        $scope.refreshDirectedGraph(filteredJson, filterfield, true);
    }

    $scope.redrawFilteredGraphWithType = function(json, filterfield, flag) {
        var filteredJson = {}
        var nodes = json.nodes;
        var edges = json.edges;
        var filteredNodes = [];
        var nodesSize = nodes.length;
        for (var i = 0, len = nodesSize; i < len; ++i) {
            if (nodes[i].hasOwnProperty(filterfield)) {
                if (nodes[i][filterfield] == flag) {
                    filteredNodes.push(nodes[i]);
                }
            }
        }
        filteredJson["nodes"] = filteredNodes;
        filteredJson["edges"] = edges;
        $scope.refreshDirectedGraph(filteredJson, filterfield, true);
    }

    $scope.refreshDirectedGraph = function(json, graphname, redraw) {
        if(json!=undefined){
        $scope.focus = json;
        if (!redraw) {
            $scope.graphdata = json;
            $scope.graphname = graphname;
        }
        var oldNodes = json.nodes;
        var oldEdges = json.edges;
        var newNodes = oldNodes;
        var newEdges = oldEdges;

        var nodes = new vis.DataSet(newNodes);
        var edges = new vis.DataSet(newEdges);
        // create a network
        var container = document.getElementById('mynetwork');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            // width:'985px',
            // height:'485px',
            nodes: {
                // shapeProperties:{borderDashes:[5,5]},
                shadow: true
            },
            interaction: {
                tooltipDelay: 100,
                hover: true
            },
            edges: {
                smooth: true,
                shadow: true,
                width: 3
            }
        };

        network = new vis.Network(container, data, options);
        network.on("selectNode", function(params) {
            var obj = null;
            for (var node = 0; node < newNodes.length; node++) {
                if (newNodes[node].id == params.nodes[0]) {
                    obj = newNodes[node];
                    break;
                }
            }
            if (obj.hasOwnProperty('details')) {
                $scope.gateway_selected = true;
                $scope.gateway_details = obj.details;
            } else {
                $scope.gateway_selected = false;
                $scope.gateway_details = {};
            }
            $scope.$apply();
        });

        network.on("beforeDrawing", function(ctx) {
            for (var i = 0; i < newNodes.length; i++) {
                var nodeId = newNodes[i].id;
                var nodePosition = network.getPositions([nodeId]);

                if (graphname == 'ot' && newNodes[i].hasOwnProperty("colors") && newNodes[i].colors.length > 2) {
                    var count = newNodes[i].colors.length - 2;
                    for (var j = 0; j < count; j++) {
                        var itr = count - j + 1;
                        ctx.fillStyle = newNodes[i].colors[itr];
                        ctx.circle(nodePosition[nodeId].x, nodePosition[nodeId].y, (14 + itr * 10));
                        ctx.fill();
                    }
                } else if (graphname == 'it' && newNodes[i].hasOwnProperty('it')) {
                    if (newNodes[i].it) {
                        ctx.fillStyle = 'green';
                    } else {
                        ctx.fillStyle = 'red';
                    }
                    ctx.circle(nodePosition[nodeId].x, nodePosition[nodeId].y, 38);
                    ctx.fill();
                } else if (graphname == 're' && newNodes[i].hasOwnProperty('re')) {
                    if (newNodes[i].re) {
                        ctx.fillStyle = 'green';
                    } else {
                        ctx.fillStyle = 'red';
                    }
                    ctx.circle(nodePosition[nodeId].x, nodePosition[nodeId].y, 38);
                    ctx.fill();
                }
            }
        });

        network.on("afterDrawing", function(ctx) {
            for (var i = 0; i < newNodes.length; i++) {
                if (newNodes[i].hasOwnProperty("colors")) {
                    if (newNodes[i].colors.length > 1) {
                        var nodeId = newNodes[i].id;
                        var nodePosition = network.getPositions([nodeId]);
                        // ctx.strokeStyle = 'pink';
                        // ctx.lineWidth = 4;
                        ctx.fillStyle = newNodes[i].colors[1];
                        ctx.circle(nodePosition[nodeId].x, nodePosition[nodeId].y, 12);
                        ctx.fill();
                        // ctx.stroke();
                    }
                }
            }
        });

        $timeout(function() {
            var nodeId = oldNodes[(Math.floor(Math.random() * nodes.length))].id;
            var nodeIds = [];
            for (var i = 0; i < oldNodes.length; i++) {
                if (oldNodes[i].shape == 'star') {
                    nodeIds.push(oldNodes[i].id);
                }
            }
            if (nodeIds.length > 0) {
                nodeId = nodeIds[(Math.floor(Math.random() * nodeIds.length))];
            }
            $scope.focusNode(nodeId);
        }, 100);
    }

    $scope.focusNode = function(nodeId) {
        //    console.log(nodeId);
        var options = {
            scale: 1.0,
            offset: { x: 0, y: 0 },
            animation: {
                duration: 1000,
                easingFunction: 'linear'
            }
        };
        network.focus(nodeId, options);
    }

    $scope.countType = function(json, filterfield, flag) {
		if(json!=undefined){
        var count = 0;
        for (var i = 0; i < json.length; ++i) {
            if (json[i].hasOwnProperty(filterfield)) {
                if (json[i][filterfield] == flag) {
                    count++;
                }
            }
        }
        return count;
		}
    }

    $scope.countNetwork = function(json, type) {
        var count = 0;
        for (var i = 0; i < json.length; ++i) {
            if (json[i].hasOwnProperty("networks")) {
                if ($.inArray(type, json[i].networks) != -1) {
                    count++;
                }
            }
        }
        return count;
    }
    }
});

/*meshModule.controller('EditprofileCtrl', function($scope, $rootScope, meshModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModalInstance, $mdToast, $state, toaster, CustomMessages, param, $uibModal) {


    $rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;


    }
    $scope.dayOriginalArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    $scope.meshId = param.meshid;
    $scope.mesh = param.mesh
    console.log($scope.mesh)

    $scope.profiledata = {};
    $scope.grpactionDayArray = [];
    $scope.profileInfo = param.profileInfo;
    $scope.deviceGroupId = param.deviceGroupId;
    $scope.grpactionDayArray = []




    if ($scope.profileInfo != undefined || $scope.profileInfo != null) {


        $scope.profiledata.grpname = $scope.profileInfo.name;
        $scope.profiledata.grpdesc = $scope.profileInfo.description;
        $scope.processedby = $scope.profileInfo.processedby
        if ($scope.profileInfo.actions.length > 0) {

            $scope.profiledata.grpschedfreq = $scope.profileInfo.actions[0].frequency;
            $scope.profiledata.grpschedtime = $scope.profileInfo.actions[0].scheduledat;
            $scope.grpactionDayArray = $scope.profileInfo.actions[0].dow;


            $scope.uniqueActionId = $scope.profileInfo.actions[0].id;

        } else {
            $scope.profiledata.grpschedfreq = "";
            $scope.profiledata.grpschedtime = "";
            $scope.profiledata.day = [];
        }


        $scope.returnTime1 = function(datetime) {
            var date1 = new Date()
            var a = JSON.stringify(date1.toISOString())
            var b = a.substr(1, a.length - 2)
            console.log(b)
            var str = b.split("T")
            var x = str[0] + "T" + datetime
            var dat = new Date(x)
            var temp = new Date($filter('date')(dat.toISOString(), "MM/dd/yyyy HH:mm:ss"));
            console.log(typeof temp);
            return temp;
        };




        $scope.profileInfoId = param.profileInfo.id

    }



    $scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));


    var changedValueArr = [];
    $scope.newProfileArray = [];
    $scope.editingFlag = [];
    $scope.editNewProfile = function(index) {

        $scope.editingFlag[index] = true;
    };
    $scope.noSchedulerApp = false
    $scope.getGatewayScheduleList = function() {

        meshModuleService.getGatewaySchedulerData($scope.meshId, 'SchedulerApp', $scope.mesh.network).then(function(data) {



            if (data.status == 204) {
                $scope.noSchedulerApp = true;
            } else {
                if (data.data.Data != undefined) {
                    $scope.gatewayScheduleList = data.data.Data
                }
                for (var i = 0; i < $scope.gatewayScheduleList.length; i++) {
                    if ($scope.processedby == $scope.gatewayScheduleList[i].id) {
                        $scope.processedBy = $scope.gatewayScheduleList[i]

                    }
                }
            }
        });

    }

    $scope.getGatewayScheduleList()

    $scope.dropDownData = function(name) {
        $scope.processedBy = name.id
    }

    $scope.funcData = function(value) {
        if ($scope.grpactionDayArray.indexOf(value) == -1) {
            $scope.grpactionDayArray.push(value)
        } else {
            var ind = $scope.grpactionDayArray.indexOf(value)
            $scope.grpactionDayArray.splice(ind, 1)

        }

    };

    $scope.addNewProfile = function() {
        $scope.addnewdeviceData = true;
        $scope.newProfileArray.push({
            "deviceName": "",
            "deviceDef": "",
            "deviceProperty": "",
            "deviceType": "",
            "deviceValue": ""
        });
    }

    $scope.newProfile = {};
    $scope.newProfile.deviceName = [];
    $scope.newProfile.deviceProperty = [];
    $scope.newProfile.deviceType = [];
    $scope.newProfile.deviceDef = [];
    $scope.newProfile.deviceValue = [];
    $scope.registeredPropertyData = [];
    $scope.dateOptions = {
    
    formatYear: 'yy',
    maxDate: new Date(2030, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };
    $scope.popup1 = {
    opened: false
  };
 $scope.open1 = function() {
    $scope.popup1.opened = true;
  };
  $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.myproperty = function(deviceIdselected, index) {
        var arr = [];
        var propDef = [];
        $scope.objectfind = $filter('filter')($scope.grpdevicesinformation.deviceids, { id: deviceIdselected });
        
        var arr2 = [];
        arr2.push($scope.objectfind[0].id);
        meshModuleService.getActivePropList(arr2).then(function(response){
            if(response.Data.length!=0){
				angular.forEach(response.Data,function(propertyIndex1){
					if($scope.objectfind[0].id == propertyIndex1.deviceid)
					{
						if(propertyIndex1.properties != undefined){
						$scope.registeredPropertyData[index] = propertyIndex1.properties;       
						}else{
							$scope.registeredPropertyData[index] = []
						}
					}
					
				});
                //console.log($scope.registeredPropertyData[index]);
				
                

				for (var i = 0; i < $scope.registeredPropertyData[index].length; i++) {
					var yash = [];
					for (var j = 0; j < $scope.registeredPropertyData[index][i].properties.length; j++) {
						for (var k = 0; k < $scope.registeredPropertyData[index][i].properties[j].operations.length; k++) {

							if ($scope.registeredPropertyData[index][i].properties[j].operations[k] == 'post') {

								var json = { "propertyName": $scope.registeredPropertyData[index][i].properties[j].propertyName };
								yash.push(json);
							}
						}
					}
					if (yash.length > 0) {
						arr.push({ "name": $scope.registeredPropertyData[index][i].definitionName, "properties": yash });
					}
					}
				
				}
				 })
				$scope.propertyPost = arr;
				//console.log(JSON.stringify(arr))
				return $scope.propertyPost;
			
       

       

    }
    $scope.onValueChange = function(defname, changePropValue, pname) {
        $scope.postProp = pname;
        if (changedValueArr.length > 0) {
            var flag = false;
            angular.forEach(changedValueArr, function(value, key) {

                angular.forEach(value, function(valueJson, keyJson) {
                    if (keyJson == defname + "-" + pname) {
                        value[keyJson] = changePropValue;
                        flag = true;
                        return false;
                    }

                })

            })
            if (flag == false) {
                var j = {}
                j[defname + "-" + pname] = changePropValue;
                changedValueArr.push(j);

            }
        } else {

            var jObj = {};
            jObj[defname + "-" + pname] = changePropValue;
            //jObj["value"]
            changedValueArr.push(jObj)

            $scope.changedValueArr = changedValueArr;
            //$scope.changePropValue=sliderValue;
        }
        return $scope.changedValueArr;
    };

    $scope.getDaydata = function(action) {
        var days = {};
        if (action.dow != null) {
            if (action.dow.indexOf('sunday') != -1) {
                days['0'] = true
            }
            if (action.dow.indexOf('monday') != -1) {
                days['1'] = true
            }
            if (action.dow.indexOf('tuesday') != -1) {
                days['2'] = true
            }
            if (action.dow.indexOf('wednesday') != -1) {
                days['3'] = true
            }
            if (action.dow.indexOf('thursday') != -1) {
                days['4'] = true
            }
            if (action.dow.indexOf('friday') != -1) {
                days['5'] = true
            }
            if (action.dow.indexOf('saturday') != -1) {
                days['6'] = true
            }
        }
        action.dow = days
    }
    $scope.searchData;
    $scope.searchFunction = function(datass) {

        if ($scope.searchData != null || $scope.searchData != undefined) {
            if ($scope.editingFlag.length == 0) {
                var result = {};
                result['deviceName'] = $scope.searchData
                return result;
            } else {
                var result = {};
                result['deviceid'] = $scope.searchData
                return result;
            }
        }
    }

    $scope.getTypeoftheProperty = function(deviceIdselected, propertyName, index) {
        var getTypeProperty;
        changedValueArr = [];
        var arr = [];
        var temp = [];
        getTypeProperty = $filter('filter')($scope.grpdevicesinformation.deviceids, { id: deviceIdselected });

        if (getTypeProperty[0].regproperties != undefined) {
            for (var x = 0; x < $scope.propertyPost.length; x++) {
                if (propertyName == $scope.propertyPost[x].name) {
                    if ($scope.propertyPost[x].hasOwnProperty("properties")) {
                        for (var z = 0; z < $scope.propertyPost[x].properties.length; z++) {


                            for (var i = 0; i < getTypeProperty[0].regproperties.length; i++) {
                                for (var j = 0; j < getTypeProperty[0].regproperties[i].properties.length; j++) {


                                    for (var k = 0; k < getTypeProperty[0].regproperties[i].properties[j].operations.length; k++) {

                                        if ($scope.propertyPost[x].properties[z].propertyName == getTypeProperty[0].regproperties[i].properties[j].propertyName && getTypeProperty[0].regproperties[i].properties[j].operations[k] == 'post') {
                                            var json = {};
                                            json["name"] = getTypeProperty[0].regproperties[i].properties[j].propertyName;
                                            if (getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("type")) {
                                                json["type"] = getTypeProperty[0].regproperties[i].properties[j].type;
                                            }
                                            if (getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("enum")) {
                                                json["enum"] = getTypeProperty[0].regproperties[i].properties[j].enum;
                                            }
                                            if (getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("minimum")) {
                                                json["minimum"] = getTypeProperty[0].regproperties[i].properties[j].minimum;
                                            }
                                            if (getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("maximum")) {
                                                json["maximum"] = getTypeProperty[0].regproperties[i].properties[j].maximum;
                                            }
                                            arr.push(json);
                                        }
                                    }

                                }
                            }

                        }


                    }
                }
            }
            $scope.dataDevicePropertyType = arr;
            if ($scope.dataDevicePropertyType[0] != undefined) {

                return $scope.dataDevicePropertyType;
            }

        }
    }
    $scope.addType = function() {
        if ($scope.profileInfo != undefined) {
            for (var j = 0; j < $scope.profileInfo.actions.length; j++) {
                for (var i = 0; i < $scope.profileInfo.actions[j].properties.length; i++) {
                    $scope.myproperty($scope.profileInfo.actions[j].deviceid, j)
					
                    var arr = $scope.getTypeoftheProperty($scope.profileInfo.actions[j].deviceid, $scope.profileInfo.actions[j].definitionname, j)
					
                    $scope.profileInfo.actions[j].properties[i].types = arr[i]
                }
            }
        }
    }
    $scope.addType()
    $scope.removeDevice1 = function(index) {
        $scope.profileInfo.actions.splice(index, 1);
    }


    $scope.removeDevice = function(index) {
        $scope.addnewdeviceData = false;
        $scope.newProfileArray.splice(index, 1);
    }

    $scope.openByForceSombabu = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalDeviceGroupActionProfile.html',
            controller: 'deviceGroupActionProfileCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                param: function() {
                    return { 'meshid': $scope.meshId, 'deviceGroupId': $scope.deviceGroupId, 'mesh': $scope.mesh };
                }
            }
        });
        return false;
    };
    $scope.clearEditProfileModal = function() {
        $uibModalInstance.close();
        $scope.grpactionDayArray = [];
        $scope.openByForceSombabu();
    }


    $scope.saveProfile = function(profileId, newProfileArray, profileInfoActions, grpname, grpdesc, grpschedfreq, grpschedtime, processby,schdate) {
		//console.log(schdate);
		
        var saveflag = false

        if (processby.hasOwnProperty('id')) {
            processby = processby.id
        }

        var deviceAppid;
        var z = 1;
        var actionProfileId;
        $scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));
        devicegrpid = $scope.grpdevicesinformation.id;
        var a = JSON.stringify(grpschedtime)
        var b = a.substr(1, a.length - 2)
        console.log(b)
        var str = b.split("T")
        console.log(str[1])
        actionProfileId = $scope.profileInfoId;
        deviceGatewayId = $scope.gatewayId;
        var jsondata;
        $scope.devArr = [];
        $scope.devArrUpdate = [];
		var newDate1 = new Date(schdate);
		
		var newDate3 = new Date((newDate1.getMonth()+1)+' '+ newDate1.getDate()+', '+newDate1.getFullYear()+' '+grpschedtime.getHours()+':'+grpschedtime.getMinutes()+':'+grpschedtime.getSeconds());
				
		
        if ($scope.dataDevicePropertyType != undefined && $scope.changedValueArr != undefined && newProfileArray != []) {
            saveflag = true
            for (var i in newProfileArray) {
                var propertiesArr = [];
                for (var j = 0; j < newProfileArray[i].deviceType.length; j++) {

                    for (var k = 0; k < newProfileArray[i].deviceValue.length; k++) {



                        if (newProfileArray[i].deviceName + "-" + newProfileArray[i].deviceType[j].name == Object.keys(newProfileArray[i].deviceValue[k])) {
                            var json = {};


                            json[newProfileArray[i].deviceType[j].name] = newProfileArray[i].deviceValue[k][newProfileArray[i].deviceName + "-" + newProfileArray[i].deviceType[j].name];

                            json["types"] = newProfileArray[i].deviceType[j];


                            if (json[newProfileArray[i].deviceType[j].name] != undefined || json[newProfileArray[i].deviceType[j].name] != '') {
                                var value;
                                var key = newProfileArray[i].deviceType[j].name;
                                if (json.types.type == "number" || json.types.type == "integer") {
                                    value = parseInt(json[key]);

                                } else if (json.types.type == "float") {
                                    value = parseFloat(json[key]);
                                } else if (json.types.type == 'boolean') {
                                    value = eval(json[key]);
                                } else {
                                    value = json[key];
                                }
                                json[key] = value

                                propertiesArr.push(json);
                            }

                            $scope.objectfind = $filter('filter')($scope.grpdevicesinformation.deviceids, { id: newProfileArray[i].deviceName });

                            deviceAppid = $scope.objectfind[0].appid;

                            if (grpschedfreq == 'weekly') {
                                jsondata = { "meshID": $scope.meshId, "deviceid": newProfileArray[i].deviceName, "definitionname": newProfileArray[i].deviceDef, "scheduledat": str[1], "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": propertiesArr, "dow": $scope.grpactionDayArray, "processedby": processby };

                            } else if(grpschedfreq == 'once'){
                                jsondata = { "meshID": $scope.meshId, "deviceid": newProfileArray[i].deviceName, "definitionname": newProfileArray[i].deviceDef, "scheduledat": newDate3, "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": propertiesArr, "processedby": processby };
                            }else{
                                jsondata = { "meshID": $scope.meshId, "deviceid": newProfileArray[i].deviceName, "definitionname": newProfileArray[i].deviceDef, "scheduledat": str[1], "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": propertiesArr, "processedby": processby };
                            }
                        }

                    }
                }
                $scope.devArr.push(jsondata);
            }
        } else {
            if (actionProfileId == undefined) {
                $timeout(function() {
                    toaster.pop("error", "", "aaaaaaa Please provide all inputs")
                })
            }
        }

        for (var i in profileInfoActions) {
            editflag = true

            for (var j = 0; j < profileInfoActions[i].properties.length; j++) {
                if ($scope.changedValueArr != undefined) {

                    for (var k = 0; k < $scope.changedValueArr.length; k++) {
                        angular.forEach($scope.changedValueArr[k], function(values, key) {
                            if (key == profileInfoActions[i].deviceid + "-" + profileInfoActions[i].properties[j].types.name) {

                                var value;

                                if (profileInfoActions[i].properties[j].types.type == "number" || profileInfoActions[i].properties[j].types.type == "integer") {
                                    value = parseInt(values);
                                } else if (profileInfoActions[i].properties[j].types.type == "float") {
                                    value = parseFloat(values);
                                } else if (profileInfoActions[i].properties[j].types.type == 'boolean') {
                                    value = eval(values);
                                } else {
                                    value = values;
                                }
                                profileInfoActions[i].properties[j][profileInfoActions[i].properties[j].types.name] = value;

                            }
                        });
                    }
                }
            }

            $scope.objectfind = $filter('filter')($scope.grpdevicesinformation.deviceids, { id: profileInfoActions[i].deviceid });

            deviceAppid = $scope.objectfind[0].appid;
            actionProfileId = profileInfoActions[i].id
            if (grpschedfreq == 'weekly') {

                jsondata = { "meshID": $scope.meshId, "actionid": profileInfoActions[i].id, "deviceid": profileInfoActions[i].deviceid, "definitionname": profileInfoActions[i].definitionname, "scheduledat": str[1], "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": profileInfoActions[i].properties, "dow": $scope.grpactionDayArray, "processedby": processby };
            } else {
                jsondata = { "meshID": $scope.meshId, "actionid": profileInfoActions[i].id, "deviceid": profileInfoActions[i].deviceid, "definitionname": profileInfoActions[i].definitionname, "scheduledat": str[1], "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": profileInfoActions[i].properties, "processedby": processby };
            }

            if (jsondata != null) {
                $scope.devArr.push(jsondata);
            }
        }

        if (grpname == undefined || grpdesc == undefined || grpschedfreq == undefined || grpschedtime == undefined || processby == undefined) {
            $timeout(function() {
                toaster.pop("error", "", "lastttt  Please provide all inputs")
            })

        } else {
            if ($scope.profileInfo == null || $scope.profileInfo == undefined) {
                if (saveflag == true) {
                    for (var i = 0; i < $scope.devArr.length; i++) {
                        for (var j = 0; j < $scope.devArr[i].properties.length; j++) {
                            delete $scope.devArr[i].properties[j]["types"]
                            delete $scope.devArr[i].properties[j]["$$hashKey"]
                        }
                    }
                    meshModuleService.postActionProfiles(devicegrpid, deviceAppid, grpname, grpdesc, $scope.devArr, $scope.orgid, processby).then(function(data) {
                        $scope.dataLoading = true;
                        $scope.processedBy = ''
                        $scope.grpactionDayArray = [];
                        if (data.message == "Success") {
                            $scope.addnewdeviceData = false;
                            toaster.pop('success', '', "Profile Created Successfully");
                            $scope.dataLoading = false;
                            $uibModalInstance.close();
                            $rootScope.$broadcast('devicesListbroadcast');
                            $state.reload();
                            $scope.openByForceSombabu();
                        } else {
                            if (data.data.error != undefined && data.data.error.non_field_errors != undefined) {
                                toaster.pop('error', '', "The fields property, deviceid, scheduledat must make a unique set.");
                                $scope.dataLoading = false;
                            } else {
                                toaster.pop('error', '', data.data.message);
                                $scope.dataLoading = false;
                            }
                        }
                    });
                    saveflag = false
                }
            } else {
                for (var i = 0; i < $scope.devArr.length; i++) {
                    for (var j = 0; j < $scope.devArr[i].properties.length; j++) {
                        delete $scope.devArr[i].properties[j]["types"]
                        delete $scope.devArr[i].properties[j]["$$hashKey"]
                    }
                }
                //devicegrpid,deviceAppid,deviceGatewayId,deviceChannelId,grpname,grpdesc,devArr,$scope.orgid
                meshModuleService.putActionProfiles(profileId, devicegrpid, deviceAppid, grpname, grpdesc, $scope.devArr, processby).then(function(data) {
                    $scope.grpactionDayArray = [];
                    $scope.dataLoading = true;
                    $scope.processedBy = ''
                    if (data.message == "Success") {
                        toaster.pop('success', '', "Profile Edited Successfully");
                        $scope.dataLoading = false;
                        $uibModalInstance.close();
                        $rootScope.$broadcast('devicesListbroadcast');
                        $state.reload();
                        $scope.openByForceSombabu();
                    } else {
                        if (data.data.error != undefined && data.data.error.non_field_errors != undefined) {
                            toaster.pop('error', '', "The fields property, deviceid, scheduledat must make a unique set.");
                            $scope.dataLoading = false;
                        } else {
                            toaster.pop('error', '', data.data.message);
                            $scope.dataLoading = false;
                        }


                    }

                });


            }


        }

    }
})

meshModule.controller('deviceGroupActionProfileCtrl', function($scope, $rootScope, meshModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModalInstance, $mdToast, $state, toaster, CustomMessages, param, $uibModal) {



    $rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;


    }

    $scope.deviceGroupId = param.deviceGroupId;
    $scope.grpid = param.deviceGroupId.id
    $scope.meshId = param.meshid
    $scope.mesh = param.mesh

    $scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));


    $scope.$on("devicesListbroadcast", function() {
        $scope.getGroupActions(1);
    });



    $scope.getGroupActions = function(pageno, param) {



        profilename = $scope.grpdevicesinformation.name
        $scope.deviceActionList = [];
        $scope.currentDevicePage = pageno;
        $scope.devicePerPage = ENV.recordPerPage;
        $scope.dataLoading = true;

        meshModuleService.getActionProfile(pageno, $scope.grpid, $scope.gatewayid).then(function(data) {

            $timeout(function() {

                if (data.Data != undefined) {

                    $scope.deviceActionList = data.Data;

                    $scope.dataDeviceLoading = false;
                    $scope.totalItems = data.total_records;
                } else {
                    $scope.totalItems = 0;
                    "No Records Found"
                }

                $scope.selectedRow = null;
                $scope.setClickedRow = function(index, device) {

                    $scope.selectedRow = index;
                    $scope.selectedRowDevice = device;

                    if (device.Selected == true) {
                        device.Selected = false;
                    } else {
                        device.Selected = true;
                    }
                };

                $scope.checkAllDevice = function(selectedAllDevice) {

                    $scope.selectedAllDevice = selectedAllDevice;
                    if ($scope.selectedAllDevice) {
                        $scope.selectedAllDevice = true;
                    } else {
                        $scope.selectedAllDevice = false;
                    }

                    angular.forEach($scope.deviceActionList, function(device) {
                        device.Selected = $scope.selectedAllDevice;
                    });



                };

                $scope.pageChanged = function() {

                    $scope.getGroupActions($scope.currentDevicePage, $scope.params);
                };

                $scope.checkStatus = function(device) {

                    device.Selected = !device.Selected;
                };
            });
            $scope.dataLoading = false;
        }).catch(function(error) {
            $scope.totalItems = 0;
            $scope.dataDeviceLoading = false;
            $scope.dataLoading = false;
        });
    };

    $scope.tags = [];

    $scope.getGroupActions(1, $scope.params);
    $scope.returnTime1 = function(datetime,frequency) {

        if(frequency!='once'){
            var date1 = new Date()
            var a = JSON.stringify(date1.toISOString())
            var b = a.substr(1, a.length - 2)
            
            var str = b.split("T")
            var x = str[0] + "T" + datetime
            var dat = new Date(x)
            var temp = new Date($filter('date')(dat, "MM/dd/yyyy HH:mm:ss"));
           
            return temp;
        }else{
            var date1 = new Date(datetime);
            return  $filter('date')(date1,"MM/dd/yyyy HH:mm:ss");
        }
    };



    $scope.deleteProfile = function(profId) {



        meshModuleService.deleteActionProfile(profId).then(function(data) {


            if (data.message != undefined) {
                $scope.message = data.message;
                toaster.pop('success', '', $scope.message);
                $rootScope.$broadcast('devicesListbroadcast');
                $state.reload();
            } else {
                toaster.pop('error', '', data.message)
            }

        });

    }


    $scope.profileDevices = function(profId) {
        if ($uibModalInstance != undefined) {
            $uibModalInstance.close();
        }

        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalEditProfile.html',
            controller: 'EditprofileCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                param: function() {
                    return { 'profileInfo': profId, 'meshid': $scope.meshId, 'mesh': $scope.mesh, 'deviceGroupId': $scope.deviceGroupId };
                }
            }
        });

    }


    $scope.clearGrpActnProfile = function() {
        $uibModalInstance.close();
    }


    $scope.triggerNow = function(prof) {

        $scope.AppId = param.deviceGroupId
        for (var j in $scope.AppId.deviceids) {
            $scope.foundAppId = $scope.AppId.deviceids[j].appid

        }


        var now = new Date();
        //var now_3 = now.setMinutes(now.getMinutes
        var now_utc = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 2, now.getSeconds());
        var a = JSON.stringify(now_utc)
        var b = a.substr(1, a.length - 2)
        console.log(b)
        var str = b.split("T")
        console.log(str[1])
        tprofileID = prof.id;
        tdevicegrpid = prof.devicegroupid;
        tdeviceAppid = $scope.foundAppId
        tdeviceGatewayId = prof.actions[0].meshID
        tgrpname = prof.name
        processby = prof.processedby
        tgrpdesc = prof.description
        tdevArr = tArr
        processby = prof.processedby

        torgid = $scope.orgid


        var tArr = []
        for (var i in prof.actions) {
            var value;
            for (var j = 0; j < prof.actions[i].properties.length; j++) {

                if (prof.actions[i].frequency == 'weekly') {
                    tArr.push({ "id": prof.actions[i].id, "meshID": $scope.meshId, "deviceid": prof.actions[i].deviceid, "definitionname": prof.actions[i].definitionname, "properties": prof.actions[i].properties, "scheduledat": str[1], "frequency": prof.actions[i].frequency, "protocol": prof.actions[i].protocol, "orgid": prof.actions[i].orgid, "dow": prof.actions[i].dow, "processedby": processby })
                } else {
                    tArr.push({ "id": prof.actions[i].id, "meshID": $scope.meshId, "deviceid": prof.actions[i].deviceid, "definitionname": prof.actions[i].definitionname, "properties": prof.actions[i].properties, "scheduledat": str[1], "frequency": prof.actions[i].frequency, "protocol": prof.actions[i].protocol, "orgid": prof.actions[i].orgid, "processedby": processby })
                }
            }


        }

        tdevArr = tArr
        //processby= prof.processedby

        torgid = $scope.orgid




        meshModuleService.putActionProfiles(tprofileID, tdevicegrpid, tdeviceAppid, tgrpname, tgrpdesc, tdevArr, processby).then(function(data) {
            $scope.dataLoading = true;
            if (data.message == "Success") {
                toaster.pop('success', '', data.message);

                $scope.dataLoading = false;
                $scope.getGroupActions(1, $scope.params);

            } else {
                toaster.pop('error', '', data.message);
                $scope.dataLoading = false;
            }

        });


    }


});*/