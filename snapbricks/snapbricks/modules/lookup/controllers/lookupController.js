var lookupModule = angular.module('lookupModule.controllers', ['ui.bootstrap', 'ngSanitize','ngTagsInput','elif']);

lookupModule.controller('lookupCtrl', function($scope, $rootScope, lookupModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster) {

    /*	Data Attribute Initialize Function of LookUp
     Dynamic Generic Function for Initialize Data Attributes
     */
    $rootScope.globals = $cookieStore.get('globals') || {};
    $scope.showCreateNewRule = false;
    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
    }
	$scope.openCtrl = '';
	$scope.openLookup = function(openCtrl){
		$scope.openCtrl = openCtrl;
	};
	$scope.refreshFunc = function(){
		$state.reload();
	};
	$scope.$watch('openCtrl', function (openCtrl) {
		if(openCtrl !== ''){
					
				var data4DeviceObject = 'xml';
				var data4DeviceStatus = {"fields":"vendor","orgid":$scope.orgid,"protocol":openCtrl};
				$scope.getDisplayVendorModelID = [];
				deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
					$scope.getDisplayVendorModelID = data.Data;
				});	
				$scope.funcGetModelid = function(vendor){
				var data4DeviceObject = 'xml';
				var data4DeviceStatus = {"fields":"modelid,devicename","vendor":vendor,"orgid":$scope.orgid};
				$scope.getDisplayModelID = [];
				deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
					$scope.getDisplayModelID = data.Data;
				});	
					
				};
				$scope.funcGetDevicename = function(modelid){
					
				};
				$scope.modbus = {};
				$scope.modbus.protocol = 'modbus';
				$scope.modbus.orgid = $scope.orgid;
				$scope.zwave = {};
				$scope.zwave.protocol = 'zwave';
				$scope.zwave.orgid = $scope.orgid;
				$scope.funSaveAdd = function(datapass){
					
					lookupModuleService.addModbusData(datapass).then(function(data){
						if(data.Data != undefined){
							toaster.pop('success',"",data.message);
							$state.reload();
						}else{
							
							toaster.pop('error',"",data.data.message);
							$state.reload();
							
						}
						
					});
				}
				$scope.funSave = function(datapass){
					
					lookupModuleService.submitModbusData(datapass).then(function(data){
						if(data.Data != undefined){
							toaster.pop('success',"",data.message);
							$state.reload();
						}else{
							toaster.pop('error',"",data.data.message);
							$state.reload();
							
						}
						
					});
				}
		}
	});
	

});