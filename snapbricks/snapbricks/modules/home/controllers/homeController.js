var homeModule = angular.module('homeModule.controllers', ['ui.bootstrap', 'ngSanitize', 'angular.filter', 'ngMaterial']);

homeModule.controller('homeCtrl', function($state, $scope, $rootScope, homeModuleService, gatewayModuleService, deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, powerBIConstant, toaster, $uibModal) {

    /*	Data Attribute Initialize Function of Home
     Dynamic Generic Function for Initialize Data Attributes
     */

    $rootScope.globals = $cookieStore.get('globals') || {};

    // alert(currentUrl.match(powerbiAuthorizeCodeURLPattern));
    if (!$rootScope.globals.currentUser) {
        //console.log($rootScope.globals);
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;
        //console.log(SocketData);
    }
    $scope.$on('gatewaymodal', function(e, a) {
        $scope.getGatewayList()
    })


    var powerbiAuthorizeCodeURLPattern = new RegExp('^' + powerBIConstant.redirectUri +
        '\/\\?code\\=' + '[a-zA-Z0-9?_&=!$*-]+' + '\\#\/home$');
    var currentUrl = $window.location.toString();

    if (currentUrl.match(powerbiAuthorizeCodeURLPattern)) {

        var code = currentUrl.split("?")[1].split("&")[0].split("=")[1];
        // alert(code);
        if (code != null) {
            // toaster.pop("success","","Authorize Code Generated");
            homeModuleService.getAccessToken(code, function(response) {
                if (response.hasOwnProperty('access_token')) {
                    toaster.pop("success", "", "Access Token Generated");
                    localStorage.setItem("validAccessToken", response['access_token']);
                  console.log(localStorage.getItem("validAccessToken"))
                    $scope.dataLoadingHome = false;
                                        
                       $scope.dataLoadingHome = true;
                     var obj = {"token":localStorage.getItem("validAccessToken")}
            homeModuleService.setdataset(obj).then(function(response){
                        console.log(response)
                           $scope.dataLoadingHome = false;
                        $timeout(function(){
                         $scope.getGatewayList()
                        // $scope.getAddGatewayList()
                     },500)
                    })
           
                    
      } else {
                    // toaster.pop("success","","Access Token Expired");
                    localStorage.removeItem("validAccessToken");
                }
            });
        }
    }

    $scope.newgatewayList = []
    $scope.getGatewayList = function() {
         $scope.dataLoadingHome = true;
        $scope.powerbigatewayList = []
        homeModuleService.getShowGatewayList().then(function(data) {
             console.log(data)
              $scope.dataLoadingHome = false
            if (data.status == 204) {
                $scope.gatewayList = [];

                $scope.powerbigatewayList = []
            } else {
                if (data.data.Data != undefined) 
                {
                       console.log(data.data.Data)
                    $scope.powerbiGatewayList = data.data.Data
                console.log($scope.powerbiGatewayList)
                }
              
            }
        });
    }
     // $scope.getGatewayList()

      $scope.getAddGatewayList = function() {
         $scope.dataLoadingHome = true;
       // $scope.powerbiAddgatewayList = []
        homeModuleService.getAddGatewayList().then(function(data) {
            
            if(data.Data!=undefined){
                console.log("1",data.Data)
                $scope.addGwList = data.Data
                console.log("2",$scope.addGwList)
              
            }
               $scope.dataLoadingHome = false;
        });
    }
$scope.apiFlag = false;
    $scope.powerbiSignin = function() {

        $scope.dataLoadingHome = true;

        homeModuleService.powerbiLogin(function(response) {
            $window.location.href = response;
            $scope.apiFlag = true;
            

        });

    };

    $scope.powerbiSignOut = function() {
        localStorage.removeItem("validAccessToken");
        toaster.pop("success", "", "Successfully Logged Out");
    };

    $scope.getDevices = function(gateway) {
     $scope.powerbideviceList = gateway.devices

       
    };

    $scope.getAddDevices = function(gateway) {
        $scope.addGateway = gateway
     $scope.powerbiAdddeviceList = gateway.devices

       
    };
    $scope.addPushURL = function(pushurl){
        console.log("urlll ",pushurl)
        var obj = {"gwid":$scope.addGateway.gwid,"token":localStorage.getItem('validAccessToken'),"dataset_url":pushurl};
        homeModuleService.postURL(obj).then(function(response){
            console.log(response)
            $state.reload()
        })
    }
/*
    $scope.addGateway = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modaladdgateway.html',
            controller: 'addGatewayCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: { 'gwlist': $scope.gatewayList }
            }
        });
    }

    $scope.addDevices = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modaladddevice.html',
            controller: 'addDeviceCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: { 'devlist': $scope.deviceList ,'gateway':$scope.selectedGateway}
            }
        });
    }
*/

    $scope.deviceSelected = function(deviceId) {
         
        $scope.selectedDevice = deviceId;
    }

    $scope.deviceAddSelected = function(deviceId) {
         
        $scope.selectedAddDevice = deviceId;
        window.open(powerBIConstant.powerbi_datasets, '','left=20,top=20,width=800,height=500,toolbar=1,resizable=0');
        //$scope.$apply()
    }

    $scope.getDashboard = function(deviceId) {
        console.log(deviceId)
        if(localStorage.getItem("validAccessToken") != null){
        	var embedConfiguration = { "type": 'dashboard', "accessToken": localStorage.getItem("validAccessToken"), "embedUrl": String.format(powerBIConstant.dashboardEmbedURL, deviceId) }
        	console.log("obj ", embedConfiguration)
        	var $reportContainer = $('#dashboardContainer');
          
            console.log($reportContainer)
        	var report = powerbi.embed($reportContainer.get(0), embedConfiguration);
              console.log(report)
        	/*	homeModuleService.getDeviceDashboard(deviceId).then(function(response){
        			alert("getDeviceDashboard:"+ response);
        		});*/
        }else{
			toaster.pop("success", "Token expired.. Please Re-login to PowerBi");
        }
    }

    $scope.tokenStatus = function() {
        if (localStorage.getItem('validAccessToken') != null) {
            // alert("Hi"+localStorage.getItem('validAccessToken'));
            return localStorage.getItem('validAccessToken');
        }
        return false;
    }

});

homeModule.controller('addGatewayCtrl', function($scope, dsparam, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService, $uibModalInstance, powerBIConstant, homeModuleService) {

    $scope.gatewayList = dsparam.gwlist
    $scope.currentPage = 1;
    $scope.gatewayPerPage = ENV.recordPerPage
    $scope.arrgwid = []
    $scope.dataAddGatewayLoading = false

    $scope.clearDevicemodal = function() {
        $uibModalInstance.close()
    }
    $scope.checkedGateway = function(obj) {


        if ($scope.arrgwid.length == 0) {
            $scope.arrgwid.push(obj)

        } else {
            if ($scope.arrgwid.indexOf(obj) == -1) {
                $scope.arrgwid.push(obj)

            } else {
                var index = $scope.arrgwid.indexOf(obj);
                $scope.arrgwid.splice(index, 1);
            }
        }
      //  console.log($scope.arrgwid)
    }
    $scope.saveGatewayList = function() {
        $scope.dataAddGatewayLoading = true
        var headers, obj;
       // console.log(localStorage.getItem('validAccessToken'))
        headers = { "Authorization": "Bearer " + localStorage.getItem('validAccessToken'), "Content-Type": "application/json" }
        var obj = { "create_dataset_url": powerBIConstant.dataset_powerbi, "headers": headers, "gateways": $scope.arrgwid }
      // console.log("list", JSON.stringify(obj))
        homeModuleService.setdataset(obj).then(function(data) {

        	var response = data.data.Data
        	
        	if(response["success_count"] > 0){
        		toaster.pop("success", "",response["success_count"] + " Added Successfully");
        	}
        	if(response["failure_count"] > 0){
        		toaster.pop("error", "",response["failure_count"] + " Failed To Add");
        	}
          //  console.log(data.data.Data);
            $scope.dataAddGatewayLoading = false
            $scope.clearDevicemodal()
            $rootScope.$broadcast('gatewaymodal', '');
        });

    }
});


homeModule.controller('addDeviceCtrl', function($scope, dsparam, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService, $uibModalInstance, powerBIConstant, homeModuleService) {

    $scope.deviceList = dsparam.devlist
    $scope.selectedGateway = dsparam.gateway
    $scope.currentPage = 1;
    $scope.devPerPage = ENV.recordPerPage
    $scope.arrgwid = []
    $scope.dataAddDeviceLoading = false

    $scope.clearDevicemodal = function() {
        $uibModalInstance.close()
    }

    $scope.nextPage = function(device) {

        var obj = {}
        var arr = [];
        for (var i = 0; i < device.device_regproperties.length; i++) {

            for (var j = 0; j < device.device_regproperties[i].properties.length; j++) {
                if (device.device_regproperties[i].properties[j].type == 'number' || device.device_regproperties[i].properties[j].type == 'integer') {
                    if (device.device_regproperties[i].properties[j].minimum != undefined && device.device_regproperties[i].properties[j].maximum != undefined) {

                        obj = {
                            [device.device_regproperties[i].properties[j].propertyName + '_value_' + device.device_name + '_' + device.device_id]: "Number",
                            [device.device_regproperties[i].properties[j].propertyName + '_minimum_' + device.device_name + '_' + device.device_id]: "Number",
                            [device.device_regproperties[i].properties[j].propertyName + '_maximum_' + device.device_name + '_' + device.device_id]: "Number"
                        }
                        arr.push(obj)
                    }else{
                    	obj = {
                            [device.device_regproperties[i].properties[j].propertyName + '_value_' + device.device_name + '_' + device.device_id]: "Number"}
                             arr.push(obj)
                    }
                }
            }
        }
        //console.log(JSON.stringify(arr))
        window.open(powerBIConstant.powerbi_datasets, '','left=20,top=20,width=800,height=500,toolbar=1,resizable=0');
        $scope.clearDevicemodal()
       // console.log($scope.selectedGateway)
        localStorage.setItem('powerbigateway',JSON.stringify($scope.selectedGateway));
        localStorage.setItem('powerbilist',JSON.stringify(arr));
        localStorage.setItem('powerbidevice',JSON.stringify(device));
        $location.path('home/powerbidevice');
    }
});

homeModule.controller('powerbiCtrl', function($state, $scope, $rootScope, homeModuleService, gatewayModuleService, deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, powerBIConstant, toaster, $uibModal) {
	//console.log($scope.powerbiDevice)
	//console.log($scope.powerbiList.length)
	//console.log($scope.powerbiGateway)
	$scope.keyArr = []
	$scope.getKeys = function(obj){
	
	$scope.keyArr = Object.keys(obj)
	//console.log($scope.keyArr)
}
	});