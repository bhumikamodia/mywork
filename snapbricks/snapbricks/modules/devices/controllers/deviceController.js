var deviceModule = angular.module('deviceModule.controllers', ['ui.toggle','rzModule','ui.bootstrap','ngSanitize']);

deviceModule.run(function($rootScope) {
	$rootScope.typeOf = function(value) {
		return typeof value;
	};
})


deviceModule.directive('stringToNumber', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(value) {
				return '' + value;
			});
			ngModel.$formatters.push(function(value) {
				return parseFloat(value);
			});
		}
	};
});
deviceModule.directive('toggableButton', function(){

    return {
        restrict: 'E',
        scope: {
            pressedImg: "@",
            defaultImg: "@"
        }, 
        template: '<img style="width:27px; height:30px" src="{{imageUrl}}" ng-click="click()" />',
        controller: function($scope) {
            $scope.clicked = false;
            $scope.entered = false;
            $scope.imageUrl = $scope.defaultImg;
            
            $scope.click = function() {
                $scope.entered = false;
                $scope.clicked = !$scope.clicked;
                checkStates();
            }
            
           
            function checkStates() {
                if ($scope.entered) {
                    $scope.imageUrl = $scope.hoveredImg;
                } else {
                    if ($scope.clicked) {
                        $scope.imageUrl = $scope.pressedImg;
                    } else {
                        $scope.imageUrl = $scope.defaultImg;
                    }            
                }
            }

        }
    }
});
deviceModule.controller('propertiesPanelCtrl', function($http, $scope, $rootScope, ENV, deviceModuleService, gatewayModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, imageConstant, propParam, $uibModalInstance) {
    $scope.isClicked = true; /*To disable cancel button in property panel*/
    $scope.resData = []
    $scope.datapropaccessLoading = true;
   // alert($scope.datapropaccessLoading)
    var propertyReqArray = []
    var jsonObj = {}
    var jsonObj2 = {}
    $scope.accessArray = []
    /*$scope.dataProp=[]*/

    $scope.opAccessArray = []


    $scope.getLockdata = []
    $scope.postLockdata = []
    $scope.deleteLockdata = []
    $scope.notifyLockdata = []
    $scope.dispname = propParam.deviceInformation.displayname;
    $scope.dataProperty = propParam.deviceInformation.regproperties;
    $scope.deviceId = propParam.deviceInformation.id;
    


    $scope.objInit = [];

    $scope.addProptoArrayFun = function(prop) {
        //alert("addProptoArrayFun")
        var methodArray = [];
        deviceModuleService.getPropertyLockId($scope.deviceId).then(function(data) {
            if (data.Data != undefined) {
                $scope.resData = data.Data[0];
                $scope.propertyaccessid = data.Data[0].propertyaccessid
              
            }
            $scope.datapropaccessLoading = false;
               
        });
    }
    $scope.addProptoArrayFun($scope.dataProperty);

    $scope.lock = function(flag, lockArr, property, accessArray1) {
		
        if (accessArray1 != undefined) {


            angular.copy(accessArray1, $scope.accessArray);

        }
		//console.log(propertyReqArray.indexOf(property));
        if (propertyReqArray.indexOf(property) != (-1)) //to check requested property is already their or not
        {

            if (flag == true) //for lock
            {
                //to get already request json by property name

                jsonObj = $filter('filter')($scope.accessArray, { propertyname: property });

                if (lockArr.hasOwnProperty(property)) {
                    jsonObj.lock = lockArr[property];
                }

            } else //for unlock
            {
                //to get already request json by property name
                jsonObj = $filter('filter')($scope.accessArray, { propertyname: property })[0];
                //Example:  {propertyname:intensity,lock:["get"]}




                if (lockArr.hasOwnProperty(property)) {
                    jsonObj.lock = lockArr[property];
                }


            }




        } 


    }

	$scope.funcPropStatus = function(propStatus, name,accessArray1){
		
		
		//console.log(propStatus);
		//console.log(name);
		console.log(accessArray1); 
         if (accessArray1 != undefined) {


            angular.copy(accessArray1, $scope.accessArray);

        }
	}
    $scope.getPropertyAccessData = function(propParam, flag) {
        //alert("getPropertyAccessData")
        deviceid = $scope.deviceId;

            deviceModuleService.getPropertyLockId(deviceid).then(function(data) {

                if (data.Data == undefined) {
                    //$scope.propertyAccessLoading=false;

                } else {
                    $scope.resData = []
                    $scope.accessArray1 = []


                    $scope.resData = data.Data[0] //display data to UI after cancel(from api)
  
                }

            });
            $scope.accessArray = [];
    }




    $scope.afterCancel = function() {
        $scope.getPropertyAccessData(propParam, true);


    }


    $scope.cleardeviceProperties = function() {
        $uibModalInstance.close();
    }


    //this is for SAVE lock Property
    $scope.updatePropertyLock = function(deviceid) {

        //      alert("updatePropertyLock")
        //console.log("in save",  $scope.resData.properties)
        $scope.propertyAccessLoading = true
        var propertyAccessid;
        $scope.accessArray = []
        for(var i=0;i<$scope.resData.properties.length;i++){
            for(var j=0;j<$scope.resData.properties[i].properties.length;j++){
                $scope.accessArray.push({"status":$scope.resData.properties[i].properties[j].status,"lock":$scope.resData.properties[i].properties[j].lock,"propertyname":$scope.resData.properties[i].properties[j].propertyName})
            }

        }
        console.log($scope.accessArray)
        console.log($scope.propertyaccessid)
          deviceModuleService.updatePropertyLockData($scope.accessArray, deviceid, $scope.propertyaccessid).then(function(data) {


                    $scope.propertyAccessData = data.Data

                    $scope.getPropertyAccessData(deviceid, true)
                    //$scope.accessArray = [];
                    $scope.methodsArray = [];
                    $scope.opAccessArray = [];
                    
                    if (data.Data != undefined) {

                        toaster.pop('success', "", CustomMessages.DATA_UPDATED_SUCCESS);
                    } else {

                        toaster.pop('error', "", CustomMessages.DATA_UPDATED_FAILURE);

                    }
                    $scope.propertyAccessLoading = false;
                });
                $scope.accessArray = [];
       
    }


    $scope.opAccessArray = [];
    $scope.methodsArray = {}
    $scope.againClick = false
    //this is for adding unique method to lockArray
    $scope.pushMethods = function(lock, methods, name, accessArray1) {

        $scope.againClick = false;


        if ($scope.methodsArray.hasOwnProperty(name)) {
            var value = $scope.methodsArray[name]
            if (value.indexOf(methods) == -1) {
                value.push(methods);

                $scope.methodsArray[name] = value
            }


        } else {

            lock.push(methods)
            $scope.methodsArray[name] = lock;

            $scope.opAccessArray = [];
        }
        //var json = {name :lock}





        //$scope.opAccessArray = $scope.methodsArray
        $scope.lock(true, $scope.methodsArray, name, accessArray1)
    }



    //this is for removing  method from lockArray
    $scope.popMethods = function(lock, methods, name, accessArray1) {



        if ($scope.methodsArray.hasOwnProperty(name)) {
            var value = $scope.methodsArray[name]
            if (value.indexOf(methods) != -1) {
                var index = value.indexOf(methods);

                value.splice(index, 1);
                $scope.methodsArray[name] = value
            }


        } else {

            var index = lock.indexOf(methods);

            lock.splice(index, 1);
            $scope.methodsArray[name] = lock;

            $scope.opAccessArray = [];
        }


        $scope.lock(false, $scope.methodsArray, name, accessArray1)

    }

    $scope.checkCombineProperty = function(propArr) {
        //this is for every property

        if (propArr.properties.length > 1) {
            angular.forEach(propArr.properties, function(value, key) {

                $scope.op = value.operations
            });
        }

    }






})
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%END CONTROL PANEL CONTROLLER%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

deviceModule.controller('historyCtrl', function ($http,$scope, $rootScope,ENV,deviceModuleService,gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $uibModal,$state,toaster,CustomMessages,AclService,$mdDialog, imageConstant,historyparam,$uibModalInstance) {

	/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%START DEVICE HISTORY CONTROLLER%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
	$scope.gatewayId =  historyparam.gatewayid;
	$scope.selectedRowDevice = historyparam.deviceInformation;

	$scope.clearControlPanel = function(){
		$uibModalInstance.close();
	};
	/* START LIVE/HISTORY*/
	$scope.jsonFormat = [];

	


	

	$scope.getRequestManagerList = function(gatewayId,deviceId,pageno,reqUnit,reqTime){

		$scope.currentRequestPage = pageno;
		$scope.requestPerPage = ENV.recordPerPage;
		$scope.requestManagerData = [];
	// $scope.dataLoadingRequestManager = true;
	deviceModuleService.getGatewayRequestManagers(gatewayId,deviceId,reqUnit,reqTime,pageno).then(function (data) {
		if(data.Data != undefined){
			$scope.requestManagerData = data.Data;
			$scope.totalRequestItems = data.total_records;
			// $scope.dataLoadingRequestManager = false;	
			$scope.selectedRow = null;
			$scope.setClickedRowGroup = function(index,groupInfo){
				$scope.selectedRow = index;
				$scope.selectedRowGroup = groupInfo;
				
			};	
			$("#dataLoadingGatewayLive").hide();


		}else{
			$("#dataLoadingGatewayLive").hide();

			$scope.totalRequestItems = 0;
		// $scope.dataLoadingRequestManager = false;
	}


}).catch(function(error){
	$scope.totalRequestItems = 0;
		// $scope.dataLoadingRequestManager = false;
	});	
$scope.pageChanged = function(){

	$scope.getRequestManagerList(gatewayId,deviceId,$scope.currentRequestPage);	
};
};	

		$scope.getEventsCall = function(gatewayId,deviceId,page){
			$scope.gatewayEvents = [];
			$scope.currentEventPage = page;
			$scope.eventsperpage = ENV.recordPerPage;	
			deviceModuleService.getEventsList(gatewayId,deviceId,page).then(function(data){
				if(data.Data != undefined){
				$scope.gatewayEvents = data.Data;
				$scope.totalGatewayEvents = data.total_records;	
				}else{
					$scope.totalGatewayEvents =0;
				}
				

				$scope.setClickedRowPackage = function(index,event){
					$scope.selectedRow = index;
				};	
		});
			$scope.pageChanged = function(){
			
				$scope.getEventsCall(gatewayId,deviceId,$scope.currentEventPage);	
			};
		};

		var labelValue = "";
		var constType= "";
		function createChartData(result,propertyType,propertyid){
			var propertyData=[];

			var tdate=[];

    


			$.each(result, function(index, object) {
				var unixtime = new Date(object.created_ts).getTime()/1000;
				var tsdate = new Date(parseInt(unixtime)*1000);
				
				//if(object.reported_value != null){
					propertyData.push (object.reported_value); 
				//}
				 
				tdate.push( tsdate );
				labelValue = propertyid;
				constType = propertyType;


					 
				})
			//alert(constType);
			//alert(JSON.stringify(propertyData));
		if(constType == 'boolean')
			{	
				$("#labeldisplay").text(labelValue + " data");
				generateChartBool(propertyData,tdate);		
			}
			if(constType == 'number')
			{
				$("#labeldisplay").text(labelValue + " data");
				generateChartNumber(propertyData,tdate);		
			}
			if(constType == 'string') 
			{
				$("#labeldisplay").text(labelValue + " data");
				generateChartStr(propertyData,tdate);
			}


			



		}
		function generateChartNumber(propertyData,tdate){
	 //for continuos values
	 var chart = c3.generate({
	 	data: {
			
	 		x: 'x',
			

	 		xFormat: '%m-%d-%Y %I:%M:%S %p',
       
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
	function generateChartStr(propertyData,tdate)
	{
		var dataArray = [];
		angular.forEach(propertyData,function(data,index){
			if(data == 'on'){
				dataArray.push(1);
			}
			if(data == 'off'){
				dataArray.push(0);
			}
		});
		if(dataArray.length >0){
			propertyData = dataArray;
		}
		//alert(JSON.stringify(dataArray));
	 //for continuos values
	 var chart = c3.generate({
	 	data: {

	 		x: 'x',
	 		type: 'line',

	 		xFormat: '%m-%d-%Y %I:%M:%S %p',

	 		columns:[['x'].concat(tdate),['x1'].concat(dataArray)]
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
	 		},
			
	 	},

	 });
	
	}

	function generateChartBool(propertyData,tdate){

		var chart = c3.generate({
			data: {

				x: 'x',
				type: 'area-step',

				xFormat: '%m-%d-%Y %I:%M:%S %p',

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
	
	$scope.btnSubmitDataReq = function(gatewayId,deviceId){
		$("#dataLoadingGatewayLive").show();

		var reqUnit,reqTime;
		var time=$("#timeReq").val();
		
		if(time=="Last_30_min"){reqUnit="minutes"; reqTime="30";}
		else if(time=="Last_45_min"){reqUnit="minutes"; reqTime="45";}
		else if(time=="Last_1_hour"){reqUnit="hours"; reqTime="1";}
		else if(time=="Last_12_hour"){reqUnit="hours"; reqTime="12";}
		else if(time=="Last_24_hour"){reqUnit="hours"; reqTime="24";}
		else if(time=="Last_Week"){reqUnit="day"; reqTime="7";}
		$scope.getRequestManagerList(gatewayId,deviceId,1,reqUnit,reqTime);	

		
	}
	$scope.btnSubmitData = function(ev){
		$("#dataLoadingGatewayLive").show();
		
			var propertyid_data = $("#propertyid").val();
			var propertyid_data2 = propertyid_data.replace('string:','');
			var propertyid = propertyid_data2.replace('"','');
			var objFilter = $filter('filter')($scope.selectedRowDevice.properties,{definitionName:propertyid})[0];
			
			$scope.propertyType = objFilter.properties[0].type;
			var time=$("#time").val()
			var cur_time = new Date().getTime();  

		
			var macArray = [];
		
			var reqUnit,timestamp;
			/*if(time=="Last_30_min"){timestamp = new Date().getTime() - (30 *60000);}
			else if(time=="Last_45_min"){timestamp = new Date().getTime() - (45 *60000);}
			else if(time=="Last_1_hour"){timestamp = new Date().getTime() - (60 *60000);}
			else if(time=="Last_12_hour"){timestamp = new Date().getTime() - (720 *60000);}
			else if(time=="Last_24_hour"){timestamp = new Date().getTime() - (1440 *60000);}
			else if(time=="Last_Week"){timestamp = new Date().getTime() - (7 * 1440 * 60000);}
			else if(time=="Last_Month"){timestamp = new Date().getTime() - (30 * 1440 * 60000);}*/
			if(time=="Last_30_min"){reqUnit="minutes";timestamp = 30;}
			else if(time=="Last_45_min"){reqUnit="minutes";timestamp = 45;}
			else if(time=="Last_1_hour"){reqUnit="hours";timestamp = 1;}
			else if(time=="Last_12_hour"){reqUnit="hours";timestamp = 12;}
			//var dataString ='gateway_id='+ gateway_id + '&mac_id='+ mac_id + '&time='+ timestamp;
			//timestamp = Math.floor(timestamp/1000);
			var dataString = '{"gwid":"'+$scope.gateway_id+'","lasttime":'+timestamp+',"macid":'+JSON.stringify(macArray)+'}';
			
			
			var dataString2 ='{"gwid" : "'+$scope.gateway_id+'","time":'+timestamp+',"unit":"'+reqUnit+'","deviceid": "'+$scope.selectedDeviceId+'","property": "'+ propertyid + '"}';


			
			
			deviceModuleService.postLiveData(dataString2).then(function(response){

				if(response.Data != undefined)
				{	
					createChartData(response.Data.device_status,$scope.propertyType,propertyid);
					/*angular.forEach(response.Data, function(key,value)
					{
						constType=key.type;
					});*/

					$("#chart").show();
				}
				else{
					$("#labeldisplay").text("No Result Found");
					$("#chart").hide();
				}

				$("#dataLoadingGatewayLive").hide();

			}).catch(function(response){
				
				angular.element("#dataLoadingGatewayLive").hide();
				angular.element("#labeldisplay").text("No Result Found");
				angular.element("#chart").hide();
			});
			
			
		};
		$scope.toggleEvents = function (selectedRowDevice) {
			$scope.getEventsCall(selectedRowDevice.gateway.id,selectedRowDevice.id,1);
   //   $scope.showEvent = !$scope.showEvent;
   $scope.showRequest = false;
   $scope.showTelemetry = false;
   $scope.showEvent = false;
};
$scope.toggleRequests = function (selectedRowDevice) {
		
		$scope.getRequestManagerList(selectedRowDevice.gateway.id,selectedRowDevice.id,1);	
   //   $scope.showRequest = !$scope.showRequest;
   $scope.showEvent = false;
   $scope.showTelemetry = false;
   $scope.showRequest = true;

};
$scope.toggleRequests($scope.selectedRowDevice);
$scope.toggleTelemetry = function (selectedRowDevice) {
	$scope.gateway_id = selectedRowDevice.gateway.id;
	$scope.protocol = selectedRowDevice.protocol;
	$scope.selectedDeviceId = selectedRowDevice.id;
   //   $scope.showTelemetry = !$scope.showTelemetry;
   $scope.showRequest = false;
   $scope.showEvent = false;
   $scope.showTelemetry = true;
};
/* END LIVE/HISTORY */
});
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%END DEVICE HISTORY CONTROLLER%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%START CONTROL PANEL CONTROLLER%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
deviceModule.controller('controlPanelCtrl', function ($http,$scope, $rootScope,ENV,deviceModuleService,gatewayModuleService,    $cookieStore,$location,$filter,$timeout, $window, $uibModal,$state,toaster,CustomMessages,AclService,$mdDialog, imageConstant,dsparam,$uibModalInstance) {
	$scope.gatewayId =  dsparam.gatewayid;
	$scope.selectedRowDevice = dsparam.deviceInformation;
	$scope.deviceId = $scope.selectedRowDevice.id;
	$scope.gwname = dsparam.gateway_name
	var deviceIdLock = $scope.deviceId


	$rootScope.selectedRowProp = null;
$scope.selectedRowProp = null;

$scope.LogoHeader = imageConstant.LogoHeader;

$scope.$on("mqtt_message", function(e, a) {
                console.log("in get",a)
                    if (a.responsecode != undefined && a.responsecode == 200) {
                        //$scope.dataDeviceLoadingProperties = false;
                        var socketProp;
                        var socketValue
                      //  console.log("1")
                        if (a.device_shadow.properties != undefined) {
                           // console.log("2")
                            angular.forEach(a.device_shadow.properties, function(propvalue, propkey) {
                            //console.log(propvalue,"2",propkey)    
                                if (propkey != 'status') {
                                   // socketProp = propkey
                                    //socketValue = propvalue.reported_value
                                    angular.forEach($scope.shadowArray, function(value, key) {
                                        if (key == propkey) {
                                            value.reported_value = propvalue.reported_value
                                            value.desired_value = propvalue.desired_value
                                        }
                                    })
                                }
                            })
                        }
                        //for updating shadow array in UI by web socket 
                    } else {
                        $scope.dataDeviceLoadingProperties = false;
                    }
               })
$scope.getRAMLFunc = function(selectedRowDevice, deviceMethod) {
       //console.log(selectedRowDevice);
       $scope.GETRAMLLOADING = true;
       $rootScope.mqttSubscribe("get_raml_" + selectedRowDevice.gateway.id, 50);
       var definitions = [];
       var subdefinitions = [];
       if (selectedRowDevice.properties != undefined) {
           definitions = selectedRowDevice.properties;
       }
       if (selectedRowDevice.deviceconfig != undefined) {
           subdefinitions = selectedRowDevice.deviceconfig;
       }
       var ramlArray = [{ 'definitions': definitions, 'subdefinitions': subdefinitions }];

       var object = { 'orgid': $scope.orgid, 'gwid': selectedRowDevice.gateway.id, 'deviceid': selectedRowDevice.id, 'deviceid': selectedRowDevice.id, 'appid': selectedRowDevice.appid, 'macid': selectedRowDevice.macid };
       deviceModuleService.GetRAMLDevice(object, deviceMethod).then(function(data) {


           $scope.$on("mqtt_message", function(e, a) {
			   console.log(a);
               if (a.data.responsecode == 200) {
                   toaster.pop('success', '', data.message);

                   $scope.getPropertyList(selectedRowDevice.id);
                   $rootScope.mqttUnsubscribe("get_raml_" + selectedRowDevice.gateway.id);
                  $scope.clearControlPanel();
                  $rootScope.$broadcast('devicelist_mqtt','detail');
               }

           });

       });
   }


$scope.clearControlPanel = function(){
    /*client = $rootScope.clientCall;
    //console.log("EI/UI/"+dsparam.deviceInformation.orgid+"/"+$scope.gatewayId+"/Device/"+$scope.deviceId+"/Reply");
    if(client.isConnected()){
        var message = new Paho.MQTT.Message($scope.deviceId);
        message.destinationName = "EI/UI/"+dsparam.deviceInformation.orgid+"/"+$scope.gatewayId+"/Device/"+$scope.deviceId+"/Del";
        client.send(message);

        client.unsubscribe("EI/UI/"+dsparam.deviceInformation.orgid+"/"+$scope.gatewayId+"/Device/"+$scope.deviceId+"/Reply");
    }
    */
	/*if(vxgplayer('vxg_media_player1') != undefined){
		vxgplayer('vxg_media_player1').dispose();
	}*/
	
	if($scope.gatewayId != undefined && $scope.deviceId != undefined){
		var topic = $scope.gatewayId+"_"+$scope.deviceId;
		$rootScope.mqttUnsubscribe(topic);
	}
    
    $uibModalInstance.close();
};

$scope.$on("live_mqtt_message",function(e,a){


});


$scope.save = function() {



$http.post(URL, $scope.deviceData).then(function(data) {
	$scope.msg = 'Data saved';
});

$scope.msg = 'Data sent: '+ JSON.stringify($scope.deviceData);

};


$scope.refreshSlider = function() {
	$timeout(function() {
		$scope.$broadcast('rzSliderForceRender');
	});
};

$scope.getSlider = {
							 value: 94,//selectedRowProperty.reported_value,
							 options: {
							   floor: 0,//selectedRowProperty.operations[i].constrains.minimum,
							   ceil: 100,//sectedRowProperty.operations[i].constrains.maximum+10,
							   step: 1,
							   showSelectionBar: true,
							   getPointerColor: function(value) {
							   	return '#3D6BA9;';
							   },
							   selectionBarGradient: {
							   	from: '#33f0ff',
							   	to: '#3342ff'
							   },
							 
							  minLimit: 10,//selectedRowProperty.operations[i].constrains.minimum,
							  maxLimit: 90,//sectedRowProperty.operations[i].constrains.maximum,
							  disabled:true
							}
						};
						$scope.postSlider = {

							options: {
							   floor: 0,//selectedRowProperty.operations[i].constrains.minimum,
							   ceil: 100,//sectedRowProperty.operations[i].constrains.maximum+10,
							   step: 1,
							 // onChange:$scope.onSliderChange($scope.defName.value),
							 showSelectionBar: true,
							 getPointerColor: function(value) {
							 	return '#3D6BA9;';
							 },
							 selectionBarGradient: {
							 	from: '#33f0ff',
							 	to: '#3342ff'
							 },
							
							}
						};



						$scope.getPropertyList = function(deviceId)
						{
							var operations;
							var subproperties;
							$scope.subpropertiesArray=[];
							$scope.accessLockData = [];
							$scope.regPropsDefinitionArray =[];
							$scope.dataControlPanelLoading = true;
							$scope.flag1=[];
							$timeout(function(){
								deviceModuleService.getPropertyLockId(deviceId).then(function(data){
									if(data.Data!=undefined){
										$scope.regPropsDefinitionArray = data.Data[0].properties;
									}else{
										$scope.regPropsDefinitionArray =[]
									}
									$scope.dataControlPanelLoading = false;
								});	
							},10);
								
						}


$scope.getShadowArray=function()
{
	
	deviceModuleService.getshadowValue($scope.deviceId).then(function (data) {
		if(data.Data != undefined){
			$scope.shadowArray=data.Data.properties;
		}
		
	});


};



$scope.getShadowArray();

//$scope.getPropertyList();
$scope.getPropertyList($scope.deviceId);
$scope.inactiveFlag = 0;
$scope.activeFlag = 0;
$scope.setFlag = function(mode){
if(mode == 'InActive'){
    $scope.inactiveFlag = $scope.inactiveFlag+1;
	$scope.flgInactiveLoading = true;
}else if(mode ==  'Active'){
    $scope.activeFlag = $scope.activeFlag +1;
	$scope.flgActiveLoading = true;
}
$scope.flgActiveLoading = false;
$scope.flgInactiveLoading = false;
}


$scope.dataVideoStreaming = function(){


		/*
		$scope.vdoStreaming = true;
		
			
			$scope.vdo_rtsp_url = ENV.videoStreamingPath;
			$scope.vdo_latency = 1000000;
		
		$timeout(function(){
			
			if(vxgplayer('vxg_media_player1') != undefined){
				
				console.log('===player.src='+vxgplayer('vxg_media_player1').src());
				console.log('===player.volume()='+vxgplayer('vxg_media_player1').volume());
				console.log('===player.autohide()='+vxgplayer('vxg_media_player1').autohide());
				console.log('===player.isMute()='+vxgplayer('vxg_media_player1').isMute());
				console.log('===player.isPlaying()='+vxgplayer('vxg_media_player1').isPlaying());
				console.log('===player.autoreconnect()='+vxgplayer('vxg_media_player1').autoreconnect());
				vxgplayer('vxg_media_player1').onReadyStateChange(function(onreadyState){
					
					console.log("player LOADED: versionPLG=" + vxgplayer('vxg_media_player1').versionPLG()+" versionAPP="+vxgplayer('vxg_media_player1').versionAPP());
					
				
					vxgplayer('vxg_media_player1').play();
					
					
				});
				vxgplayer('vxg_media_player1').onError(function(onErr){
					console.log("player ERROR: " + vxgplayer('vxg_media_player1').error());
				});
			}
			
			
		},500);
		     
		*/

}


$scope.DisabledGetMethod = [];
$scope.DisabledPostMethod = [];
$scope.DisabledPushMethod = [];
$scope.DisabledDeleteMethod = [];
$scope.DisabledNotifyMethod = [];
$scope.propDetail = false; 


$scope.LockGetMethod = [];
$scope.LockWriteMethod = [];
$scope.LockDeleteMethod = [];
$scope.LockNotifyMethod = [];



$scope.getPropLock = function(accessLockData,index){

		$scope.accessLockData = accessLockData;
		if($scope.accessLockData[index]!=undefined )
		{
			$scope.accessLock = $scope.accessLockData[index].lock;
		}
	
		
if($scope.accessLock!=undefined)
{
	if($scope.accessLock.indexOf("get") !== -1 ){
		$scope.LockGetMethod[index] = true;
	}

	if($scope.accessLock.indexOf("write") !== -1 ){
		$scope.LockWriteMethod[index] = true;

	}

	if($scope.accessLock.indexOf("delete") !== -1){ 
		
		$scope.LockDeleteMethod[index] = true;
	}
	if($scope.accessLock.indexOf("notify") !== -1 ){
		$scope.LockNotifyMethod[index] = true;
	}

}

};
$scope.getCountProperties = function(status3,propertyname,regPropsDefinitionArray){
	var flag = 0;
	if(regPropsDefinitionArray.length>0){
		
		angular.forEach(regPropsDefinitionArray,function(value,key){
			//console.log(value);
			if(propertyname !== value.definitionName && status3 == 'InActive'){
				flag = flag + 1;
				
			}
		});
	}

	return flag;
};
$scope.checkedFunctionOperations = function(operations,action){

	var flag = false;
	if(operations.indexOf(action) !== -1)
	{
		flag = true;
	}
	return flag;
}

$scope.setClickedRowProp = function(index){
	$scope.selectedRowProp = index;
	$rootScope.selectedRowProp = index;
	
	//$scope.getPropLock($scope.accessLockData,index);
};

$scope.toggleDeviceProperty = function(selectedRowProperty,index) {
	
	changedValueArr=[];//it is for creating value of UI properties Obj array
	$scope.changedValueArr = [];
	$scope.selectedRowProperty = selectedRowProperty;



	$scope.selectedRowProperty.Selected=true;



// $scope.propDetail = !$scope.propDetail;
if($scope.selectedRowProperty != undefined && $scope.selectedRowProperty.Selected == true)
{
	$scope.DisabledGetMethod[index] = true;
	$scope.DisabledPostMethod[index] = true;
	$scope.DisabledPushMethod[index] = true;
	$scope.DisabledDeleteMethod[index] = true;
	$scope.DisabledNotifyMethod[index] = true;

	if(selectedRowProperty.properties!=undefined)

	{
		for(var i=0;i<selectedRowProperty.properties.length;i++)
		{	
	
	if(selectedRowProperty.properties[i].operations.indexOf("get") !== -1)
	{
		$scope.visible = true;
		if(selectedRowProperty.properties[i].type == 'number' || selectedRowProperty.properties[i].type == 'integer' || selectedRowProperty.properties[i].type == 'string')
		{
			$scope.getSlider.options.floor=0;
			$scope.getSlider.options.ceil=125;
								

							}
							if(selectedRowProperty.properties[i].type == 'boolean')
							{
								
							}
							
							$scope.DisabledGetMethod[index]= false;
							$('#chkDisabled').attr('checked', true);

						}





						if(selectedRowProperty.properties[i].operations.indexOf("post") !== -1)
						{
							var editingProperty = false
							$scope.editingProperty =editingProperty
							$scope.visible = false;

							if(selectedRowProperty.properties[i].type == 'number' || selectedRowProperty.properties[i].type == 'integer' || selectedRowProperty.properties[i].type == 'string')
							{


								$scope.postSlider.options.minLimit=parseInt(selectedRowProperty.properties[i].minimum);
								
								$scope.postSlider.options.ceil=parseInt(selectedRowProperty.properties[i].maximum);
								
								$scope.postSlider.options.maxLimit=parseInt(selectedRowProperty.properties[i].maximum);

							    //for setting reported value in slider
							    angular.forEach($scope.shadowArray, function(value, key){

							    	if(key==selectedRowProperty.properties[i].propertyName)
							    	{


							    		$scope.postSlider.value=parseInt(value.reported_value);
								
								
							}

						})

							    $scope.postSlider.options.disabled= false;

							}
							if(selectedRowProperty.properties[i].type == 'boolean')
							{
							}
							$scope.DisabledPostMethod[index]= false;
						}
						if(selectedRowProperty.properties[i].operations[i] == "put")
						{
							$scope.DisabledPushMethod[index]= false;
						}
						if(selectedRowProperty.properties[i].operations[i] == "delete")
						{
							$scope.DisabledDeleteMethod[index]= false;
						}
						
						if(selectedRowProperty.properties[i].operations.indexOf('notify') !=-1)
						{
							$scope.DisabledNotifyMethod[index]= false;
						}
					}


				}
			}
			changedValueArr=[];//it is for creating value of UI properties Obj array
			$scope.changedValueArr = [];
		};



		$scope.checkForPostOperation=function(operations)
		{
			var hasPost=false;
			if(operations.indexOf('post')!=(-1))
			{

				hasPost=true;
			}
			else
			{
				hasPost=false;
			}
		
			return hasPost;
		}
		
		
		$scope.onValueChange=function(changePropValue,pname,arr)
		{
	
	$scope.postProp=pname;
	
	if(changedValueArr.length>0)
	{
	
	var flag = false;

	angular.forEach(changedValueArr, function(value, key){


		angular.forEach(value,function(valueJson,keyJson)
		{
		if(keyJson==pname)
		{	
			value[keyJson]=changePropValue;
			flag=true;
			return false;
		}
		if(flag==false)
	{		
			value[pname]=changePropValue;
			changedValueArr.push(value);
		}
	})
	})
}
else
{
	
	var jObj={};
	jObj[pname]=changePropValue;
	changedValueArr.push(jObj)
	
	$scope.changedValueArr=changedValueArr;

	
	

}
	//var length = $scope.funLength(arr)
};

$scope.checkSelectedValue=function(propName)
{

angular.forEach($scope.shadowArray,function(value,key)

{

	if(key==propName)
	{
		$scope.selectedShadowValue=value.reported_value;

	}

});
return $scope.selectedShadowValue;

}

 $scope.refreshProperties = function(properties_name, selectedRowProperty, propertiesTestIndex) {
       
        $scope.dataDeviceLoadingProperties = true;


        $scope.deviceInfo = $scope.selectedRowDevice;

        var property_arr = [];

        for (var i = 0; i < selectedRowProperty.properties.length; i++) {


            property_arr.push({ 'property': selectedRowProperty.properties[i].propertyName });

        }


        deviceModuleService.refreshDeviceProperties($scope.deviceInfo.id, $scope.gatewayId, $scope.deviceInfo.appid, property_arr).then(function(data) {

            $scope.jobid = data.data.Data.JOBID;
            $scope.gwid = data.data.Data.CLIENTID;
            if (data.status == 400 || data.status == 404) {
                $scope.dataDeviceLoadingProperties = false;
            } else {
                $scope.dataDeviceLoadingProperties = false;
               $scope.$on("mqtt_message", function(e, a) {
                    if (a.responsecode != undefined && a.responsecode == 200) {
                        $scope.dataDeviceLoadingProperties = false;
                        //var socketProp;
                       // var socketValue
                        //console.log(a);
                        if (a.device_shadow.properties != undefined) {
                           // console.log("2")
                            angular.forEach(a.device_shadow.properties, function(propvalue, propkey) {
                           // console.log(propvalue,"2",propkey)    
                                if (propkey != 'status') {
                                   // socketProp = propkey
                                    //socketValue = propvalue.reported_value
                                    angular.forEach($scope.shadowArray, function(value, key) {
                                        if (key == propkey) {
                                            value.reported_value = propvalue.reported_value
                                            value.desired_value = propvalue.desired_value
                                        }
                                    })
                                }
                            })
                        }
                        //for updating shadow array in UI by web socket 
                    } else {
                        $scope.dataDeviceLoadingProperties = false;
                    }
               })
            }

        });

    }
 $scope.setProperties = function(DeviceProperty, propertiesTestIndex) {
            var PropName = DeviceProperty.definitionName;
       

        $scope.selectedRowProperty;


        if (($scope.changedValueArr == null || $scope.changedValueArr == undefined)) {
            toaster.pop("error", "", "Required Field is neccesary.");

            $scope.dataDeviceLoadingProperties = false;
            return false;
        }
    

        $scope.dataDeviceLoadingProperties = true;


        var proPname;
        $scope.deviceInfo = $scope.selectedRowDevice;

        var arr = [];
        if ($scope.changedValueArr != undefined) {
            console.log($scope.changedValueArr)
            arr.push($scope.changedValueArr[0]);

           
        }
       for(var i=0;i<arr.length;i++){
            console.log(arr[i])
            angular.forEach(arr[i],function(value,key){
            if(key == PropName){
                $scope.desiredValue = value;                                  
            }
            })
        }
    
        angular.forEach($scope.shadowArray, function(valueShadow, keyShadow){
           
            if(keyShadow==PropName)
            {
                console.log(valueShadow)
              valueShadow.desired_value.push({"value":$scope.desiredValue})
             
            }
        }) 
        console.log(JSON.stringify($scope.shadowArray))
  
     
 
 if(arr[0]==null){
        toaster.pop("error",'','please set property value');
         $scope.dataDeviceLoadingProperties = false;
     }else{

        deviceModuleService.setDeviceProperties($scope.deviceInfo.id, $scope.gatewayId, $scope.deviceInfo.appid, arr).then(function(data) {
            if (data.status == 404) {
                toaster.pop("error", "", data.message)
                $scope.dataDeviceLoadingProperties = false;
            } else {
                $scope.dataDeviceLoadingProperties = false;
                var name;
                $scope.dataDeviceLoadingProperties = false;
                $scope.jobid = data.data.Data.JOBID;
                $scope.gwid = data.data.Data.CLIENTID;
      
                $scope.$on("mqtt_message", function(e, a) {
                  // console.log(a);
                    if (a.responsecode == 200) {
                        angular.forEach(a.device_shadow.properties, function(value, key) {
                          //  console.log(value+":::::::::"+key+"::::"+PropName)
                            if(key==PropName){
                                    //this is for updateing value of desired value of shdow property in UI by socket response
                                    angular.forEach($scope.shadowArray, function(value1, key1) {
                                        if (key1 == key) {

                                            value1.reported_value = value.reported_value
                                            value1.desired_value = value.desired_value
                                        }
                                    })
                                
                          
                    }
                        });
                    } else {
                        $scope.dataDeviceLoadingProperties = false;
                    }
                });

            }

        });
	 }

    }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$scope.openJobModel = function(jobId){
	
	var modelInstance = $uibModal.open({
		animation:true,
		backdrop  : 'static',
		ariaLabelledBy:'modal-title',
		ariaDescribedBy:'modal-body',
		templateUrl:'jobdialog.html',
		controller:'jobDialogController',
		windowClass: 'app-modal-windowssss',
		resolve:{
			dsparam:function(){
				return{'jobid':jobId,'jobData':$scope.jobDetails}
			}
		}
	});
}



//%%%%%%%%%%%%%~~~~~~~~~~~~~~~~~~~~~~
$scope.getRequestJob=function(requestJobId){
deviceModuleService.getRequestJobList(requestJobId).then(function(data)
{
		if(data.Data!=undefined){
			$scope.jobDetails = data.Data
			
		}
		$timeout(function(){
			$scope.openJobModel(requestJobId);
		})
});
}


//%%%%%%%%%%%%%%%%~~~~~~~~~~~~~~~~~~~~~~~~

});
deviceModule.controller('GetRAMLResponseCtrl',function ($http,$scope,$rootScope,ENV,deviceModuleService,gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,CustomMessages,AclService,$mdDialog,$controller,dsparam,$uibModalInstance) {
	$scope.getAllRAMLObject = dsparam.socketData;
	$scope.clearmodel = function(){
		$uibModalInstance.close();
	}
	
});
deviceModule.controller('jobDialogController',function ($http,$scope,$rootScope,ENV,deviceModuleService,gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,CustomMessages,AclService,$mdDialog,$controller,dsparam,$uibModalInstance) {


$scope.jobDetails = dsparam.jobData
$scope.jobid = dsparam.jobid
$scope.createdAt = new Date($scope.jobDetails.created_ts).toUTCString();

	$scope.clearmodel = function(){
		$uibModalInstance.close();
	};
});


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Device Controller %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
deviceModule.controller('deviceCtrl', function ($http,$scope, $rootScope,ENV,deviceModuleService,gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $uibModal,$state,toaster,CustomMessages,AclService,$mdDialog) {

/*	Data Attribute Initialize Function of Device
Dynamic Generic Function for Initialize Data Attributes
*/
$rootScope.globals = $cookieStore.get('globals') || {};
if (!$rootScope.globals.currentUser) {
$location.path('/login');
} else {
	$scope.username = $rootScope.globals.currentUser.username;
	$scope.orgid = $rootScope.globals.currentUser.orgid;
	

}


var client;
	
	
var gatewayData =$scope.gatewayInfo;



$rootScope.mqttSubscribe($scope.gatewayInfo.id,1000);


$scope.selectedControlPanel = function(selectedDeviceInformation){

var topic = $scope.gatewayInfo.id+"_"+selectedDeviceInformation.id;
//console.log(topic)
$rootScope.mqttSubscribe(topic,100)
var modelInstance = $uibModal.open({
    animation:true,
    backdrop  : 'static',
    keyboard : false,
    ariaLabelledBy:'modal-title',
    ariaDescribedBy:'modal-body',
    templateUrl:'modaldeviceControlPanel.html',
    controller:'controlPanelCtrl',
    windowClass: 'app-modal-window',
    resolve:{
        dsparam:function(){
            return{'gatewayid':$scope.gatewayInfo.id,'deviceInformation':selectedDeviceInformation,'gateway_name':$scope.gatewayInfo.displayname}
        }
    }
});

};


$scope.selectedVendorSelection = function(selectedDeviceInformation){
	
	var modelInstance = $uibModal.open({
		animation:true,
		backdrop  : 'static',
		ariaLabelledBy:'modal-title',
		ariaDescribedBy:'modal-body',
		templateUrl:'modaldeviceVendorSelection.html',
		controller:'vendorSelectionCtrl',
		windowClass: 'app-modal-windowssss',
		resolve:{
			dsparam:function(){
				return{'gatewayid':$scope.gatewayInfo.id,'deviceInformation':selectedDeviceInformation}
			}
		}
	});

};

$scope.selectedHistoryPanel = function(selectedDeviceInformation){
	var modelInstance = $uibModal.open({
		animation:true,
		backdrop  : 'static',
		ariaLabelledBy:'modal-title',
		ariaDescribedBy:'modal-body',
		templateUrl:'modaldeviceHistoryPanel.html',
		controller:'historyCtrl',
		windowClass: 'app-modal-window',
		resolve:{
			historyparam:function(){
				return{'gatewayid':$scope.gatewayInfo.id,'deviceInformation':selectedDeviceInformation}
			}
		}
	});
};

$scope.selectedPropertiesPanel = function(selectedDeviceInformation){
	
	var modelInstance = $uibModal.open({
		animation:true,
		backdrop  : 'static',
		ariaLabelledBy:'modal-title',
		ariaDescribedBy:'modal-body',
		templateUrl:'modalPropertiesPanel.html',
		controller:'propertiesPanelCtrl',
		windowClass: 'app-modal-window',
		resolve:{
			propParam:function(){
				return{'deviceInformation':selectedDeviceInformation}
			}
		}
	});

};






$scope.exportToExcel=function(tableId){ // ex: '#my-table'
}
$scope.gatewayId = $scope.gatewayInfo.id;
if($scope.gatewayId != undefined)
{
	$scope.params = {"g_id":$scope.gatewayId};
}


$scope.openDiscoverInfo = function(gateway){
$scope.discovers = '';
$scope.gatewayInfo = gateway;

localStorage.setItem('gatewayInfo',JSON.stringify($scope.gatewayInfo));	
$location.path('gateway/detail/'+$scope.gatewayInfo.id+'/devices/discover');
};
deviceModuleService.getDeviceList('',$scope.params).then(function (data) {
	$scope.gateway_all = data.Data;
	$scope.gatewaystatus_all = data.Data;
	$scope.gatewaymanager_all = data.Data;
});
$scope.openLiveInfo = function(device){
	$rootScope.deviceselectedInfo = device;
	localStorage.setItem('deviceselectedInfo',JSON.stringify($rootScope.deviceselectedInfo));
	localStorage.setItem('gatewayInfo',JSON.stringify($scope.gatewayInfo));
	$location.path('gateway/detail/'+$scope.gatewayInfo.id+'/devices/live');
};
$scope.openDeviceGroups = function(gatewayInfo){
	localStorage.setItem('gatewayInfo',JSON.stringify($scope.gatewayInfo));

	$location.path('gateway/detail/'+$scope.gatewayInfo.id+'/devices/devicegroups');
};
$scope.searchFeaturesSubmit = function(){
$scope.params={};
if($scope.gateway != undefined && $scope.gateway != "" && $scope.gateway != null){
$scope.params.g_id=$scope.gateway;
$scope.params.g_orgid = $scope.orgid;
}

if($scope.dnameSearch != undefined && $scope.dnameSearch != "" && $scope.dnameSearch != null)
{	
$scope.params.displayname=$scope.dnameSearch;
}
if($scope.gmanSearch != undefined && $scope.gmanSearch != "" && $scope.gmanSearch != null)
{	
$scope.params.g_gatewaymanager=$scope.gmanSearch;
}
if($scope.statusSearch != undefined && $scope.statusSearch != "" && $scope.statusSearch != null)
{
$scope.params.d_device_status=$scope.statusSearch;			
}
$scope.getDataDevice(1,$scope.params);

};	


$scope.deviceProperties = function(selectedRowDevice){
	var modelInstance = $uibModal.open({
		animation: true,
		backdrop  : 'static',
		ariaLabelledBy: 'modal-title',
		ariaDescribedBy: 'modal-body',
		templateUrl: 'modalDeviceProperties.html',
		controller: 'devicePropertiesCtrl',
		resolve: {
			param: function () {
				return {'gatewayid':$scope.gatewayInfo.id,'deviceInfo' :selectedRowDevice}; }
			}     
		});
}

$scope.selectedDeviceProperties = function(selectedRowDevice){
	var modelInstance = $uibModal.open({
		animation: true,
		backdrop  : 'static',
		ariaLabelledBy: 'modal-title',
		ariaDescribedBy: 'modal-body',
		templateUrl: 'DeviceConfigProperties.html',
		controller: 'deviceConfigurationCtrl',
		windowClass: 'app-modal-window',
		resolve: {
			param: function () {
				return {'gatewayid':$scope.gatewayInfo.id,'deviceInfo' :selectedRowDevice}; }
			}     
		});
}


$scope.$on('devicelist_mqtt',function(e,a){
       $scope.getDataDevice($scope.currentDevicePage,$scope.params);
   })

$scope.getDataDevice = function(pageno,params){
$scope.deviceList = [];
$scope.currentDevicePage = pageno;
$scope.devicePerPage = ENV.recordPerPage;
$scope.dataLoading = true;
deviceModuleService.getDeviceList(pageno,params).then(function (data) {

	$timeout(function(){

		if(data.Data != undefined){
			$scope.deviceList = data.Data;
			$scope.dataDeviceLoading = false;
			$scope.totalItems = data.total_records;
		}else{
			$scope.totalItems = 0;
		}

		$scope.selectedRow = null;
		$scope.setClickedRow = function(index,device){
			$scope.selectedRow = index;
			$scope.selectedRowDevice = device;

if(device.Selected == true)
{
	device.Selected=false;
}else{
	device.Selected=true;
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
});
	$scope.dataLoading = false;		
}).catch(function(error){
	$scope.totalItems = 0;
	$scope.dataDeviceLoading = false;
	$scope.dataLoading = false;		 
});	
};
$scope.pageChanged = function(){

$scope.getResultsPage($scope.currentDevicePage,$scope.params);	
};
$scope.getResultsPage = function(pageNumber,params){

	$scope.currentDevicePage = pageNumber;
	$scope.params = params;
	$scope.gatewayPerPage = ENV.recordPerPage;
	$scope.getDataDevice($scope.currentDevicePage,$scope.params);

};

$scope.getDataDevice(1,$scope.params);



$scope.refreshFunc = function(){
	$state.reload();

};

$scope.gaetwayTasks = function(){
       gatewayModuleService.getGatewayTaskDetails($scope.gatewayInfo.id).then(function(response){
           if(response.Data!=undefined){
           $scope.getAppnames = response.Data.tasks;
       }
       })
   }
   $scope.gaetwayTasks()

 $scope.deviceDeregisterAll = function(gatewayid,deviceStatus,appName){
		 $scope.dataLoadingActions=true;
		$rootScope.mqttSubscribe(gatewayid,50);
		
		 deviceModuleService.deviceDeregisterAll(gatewayid,appName,deviceStatus).then(function (data){
					//console.log(data);
					$scope.$on("mqtt_message",function(e,a){

						
						if(a.responsecode==200){
						$scope.dataLoadingActions=false;
							toaster.pop('success','',data.message);
							$('#myAllRAML').modal('hide');
							$scope.getDataDevice(1,$scope.params);	
	
							
						}
						else{
							$scope.dataLoadingActions=false;
						}
					});
				});
	 }
	 $scope.deviceDeactivateAll = function(gatewayid,deviceStatus,appName){
				
				$scope.dataLoadingActions=true;
				$rootScope.mqttSubscribe("multi_device_status_change"+gatewayid,50);
				deviceModuleService.deviceDeactivationAll(gatewayid,appName,deviceStatus).then(function (data){
					//console.log(data);
					$scope.$on("mqtt_message",function(e,a){
						//console.log(a);

						if(a.data.responsecode==200){
						$scope.dataLoadingActions=false;
						toaster.pop('success','',data.message);
							$('#myAllRAML').modal('hide');
							$scope.getDataDevice(1,$scope.params);	
						}
						else{
							$scope.dataLoadingActions=false;
						}
					});
				});
			}

$scope.getAllRAMLFunc = function(gatewayId,appName,deviceAction){
	//console.log(gatewayId);
	//console.log(appName);
	$scope.dataLoadingActions=true;
	$rootScope.mqttSubscribe("get_raml_"+gatewayId,50);
	var object = {"action":deviceAction,"gwid":gatewayId};
	deviceModuleService.GetAllRAMLDevice(object,appName).then(function (data) {
		
		
		$scope.$on("mqtt_message",function(e,a){
							console.log(a);						
								//alert(JSON.stringify(a));
							
								if(a.data.responsecode == 200 && a.JOBID == data.Data.JOBID){
									$scope.dataLoadingActions=false;
									toaster.pop('success','',data.message);
									$('#myAllRAML').modal('hide');
									$rootScope.$broadcast('serverGetAllRAMLResponse',{data : a.data});
									//$scope.getDataDevice(1,$scope.params);
									$rootScope.mqttUnsubscribe("get_raml_"+gatewayId);
								}
			
		});
			
	});
}


$scope.$on("serverGetAllRAMLResponse",function(e,a){
	var socketData = [];
		 socketData.push(a.data);
		if(socketData.length == 1 && socketData.length>0){
			var modalInstance = $uibModal.open({
			  animation: true,
			  backdrop  : 'static',
			  ariaLabelledBy: 'modal-title',
			  ariaDescribedBy: 'modal-body',
			  templateUrl: 'GetRAMLResponseContent.html',
			  controller: 'GetRAMLResponseCtrl',
			  size: 'lg',
			  resolve: {
				dsparam: function () {
					return{'socketData':socketData}
				}
			  }
				});
		}
	  
		
	
	
	});



$scope.deviceDeregister = function(deviceStatus,device){
	$scope.dataDeviceLoading = true;
	if(device == undefined)
	{
		toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
		$scope.dataDeviceLoading = false;
		return false;
	}else{
		if(device.protocol == "OPC" && device.address == "")
		{
			toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_OPC_ADDRESS_NULL);
			$scope.dataDeviceLoading = false;
			return false;
		}
	}
		
		
			var arr = [];
			var SocketCollection = [];
					

			   
			  arr.push({"id":device.id,
				"displayname":device.displayname,
				"macid":device.macid,
				"address":device.address,
				"protocol":device.protocol,
				"appid":device.appid});

				
			deviceModuleService.deviceDeregisterDataForm(device.gateway.id,arr,deviceStatus).then(function (data){
			$scope.jobid = data.data.Data.JOBID;
			if(data.status == 404 || data.status==400){
				$scope.dataDeviceLoading=false;
			}else{
					var data = data.data;
					$scope.$on("mqtt_message",function(e,a){
					//console.log($scope.jobid);
					//console.log(a);
					if(a.responsecode==200 && $scope.jobid == a.JOBID){
						$scope.dataDeviceLoading=false;
						$scope.getDataDevice($scope.currentDevicePage,$scope.params);
						
					}
					else{
						$scope.dataDeviceLoading=false;
					}
				});
			}
				});
			}
			
			$scope.deviceDeactivate = function(deviceStatus,device){
		$scope.dataDeviceLoading = true;
		if(device == undefined)
		{
			toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
			$scope.dataDeviceLoading = false;
			return false;
		}else{
			if(device.protocol == "OPC" && device.address == "")
			{
				toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_OPC_ADDRESS_NULL);
				$scope.dataDeviceLoading = false;
				return false;
			}
		}
		
		
		var arr = [];
		var SocketCollection = [];

			   arr.push({"id":device.id,

			   	"address":device.address,
			   	"protocol":device.protocol,
			   	"appid":device.appid});

			   



			deviceModuleService.deviceDeactivationDataForm(device.gateway.id,arr,deviceStatus).then(function (data){
				//console.log(data);
			$scope.jobid = data.data.Data.JOBID;
			if(data.status == 400 || data.status==404){
				$scope.dataDeviceLoading=false;
			}else{
				$scope.$on("mqtt_message",function(e,a){
					//console.log(a);

					if(a.responsecode==200 && $scope.jobid == a.JOBID){
					$scope.dataDeviceLoading=false;
					$scope.getDataDevice($scope.currentDevicePage,$scope.params);
						
					}
					else{
						$scope.dataDeviceLoading=false;
					}
				});
			}
			


		});

		}


	});
//	Gateway Discover Controller 
//	Function Parameters : $scope, $rootScope, gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state, toaster,$websocket,CustomMessages
gatewayModule.controller('gatewayDiscoverCtrl', function ($scope, $rootScope, gatewayModuleService,deviceModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state, toaster,CustomMessages, $uibModal) {
	$rootScope.globals = $cookieStore.get('globals') || {};
	if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
		
	}
	
	var client,message;

	

	$rootScope.mqttSubscribe($scope.gatewayInfo.id,1000)
	$scope.gaetwayTasks = function(){
       gatewayModuleService.getGatewayTaskDetails($scope.gatewayInfo.id).then(function(response){
           if(response.Data!=undefined){
           $scope.getAppnames = response.Data.tasks;
       }
       })
   }
$scope.gaetwayTasks ()
	//$scope.getAppnames = $scope.gatewayInfo.tasks;
	gatewayModuleService.getGatewayConfiguration($scope.gatewayInfo.id).then(function(data){
		$scope.DiscoverProtocolStatus = data.Data.configuration.protocols_subscribed;
		var OPCProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "OPC"});
		
		if(OPCProtocolStatus!=undefined && OPCProtocolStatus.length>0)
			$scope.OPCSTATUS = 1;
		var ZIGBEEProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "ZEGBEE"});
		if(ZIGBEEProtocolStatus!=undefined && ZIGBEEProtocolStatus.length>0)
			$scope.ZIGBEESTATUS = 2;
		var BLEProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "BLE"});
		if( BLEProtocolStatus !=undefined && BLEProtocolStatus.length>0)
			$scope.BLESTATUS = 3;
		var ZWAVEProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "ZWAVE"});
		if( ZWAVEProtocolStatus !=undefined && ZWAVEProtocolStatus.length>0)
			$scope.ZWAVESTATUS = 4;
		var WIFIProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "WIFI"});
		if( WIFIProtocolStatus !=undefined &&  WIFIProtocolStatus.length>0)
			$scope.WIFISTATUS = 5;
		var THREADProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "THREAD"});
		if(THREADProtocolStatus !=undefined && THREADProtocolStatus.length>0)
			$scope.THREADSTATUS = 6;
		var MQTTNODESProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "MQTT"});
		if(MQTTNODESProtocolStatus !=undefined && MQTTNODESProtocolStatus.length>0)
			$scope.MQTTNODESSTATUS = 7;
		var MQTTPTLSTATUSProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "MQTT PTL"});
		if(MQTTPTLSTATUSProtocolStatus !=undefined && MQTTPTLSTATUSProtocolStatus.length>0)
			$scope.MQTTPTLSTATUS = 9;
		var COAPNODESProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "COAP"});
		if(COAPNODESProtocolStatus !=undefined && COAPNODESProtocolStatus.length>0)
			$scope.CoAPNODESSTATUS = 8;
		var MODBUSProtocolStatus = $filter('filter')($scope.DiscoverProtocolStatus, {protocol : "MODBUS"});
		if(MODBUSProtocolStatus !=undefined && MODBUSProtocolStatus.length>0)
			$scope.MODBUSSTATUS = 1;
	});
	
	
	$scope.moveToOneTab = function (selectedOption) {

		$scope.discoverOption = selectedOption;

	};
	$scope.moveToOneTabZigbee = function (selectedOption) {
		$scope.zigbeediscoverOption = selectedOption;
	};
	$scope.moveToOneTabBLE = function (selectedOption) {
		$scope.BLEdiscoverOption = selectedOption;
	};
	$scope.moveToOneTabMQTTPTL = function(selectedOption){
		$scope.MQTTPTLdiscoverOption = selectedOption;
	}
	$scope.moveToZWAVETabBLE = function(selectedOption){
		$scope.ZWAVEdiscoverOption = selectedOption;
	};
	$scope.moveToMODBUSTabBLE = function(selectedOption){
		$scope.MODBUSdiscoverOption = selectedOption;
	};
	$scope.refreshClickOPC = function(){
		$scope.offlineOPCFunction(1);
	};
	$scope.refreshClickZigbee = function(){
		$scope.offlineZigbeeDiscover(1);
	};
	$scope.refreshClickBLE = function(){
		$scope.offlineBLEDiscover(1);
	};	
	$scope.refreshClickZWAVE = function(){
		$scope.offlineZWAVEDiscover(1);
	};
	$scope.refreshClickMODBUS = function(){
		$scope.offlineMODBUSDiscover(1);
	}
	$scope.refreshClickMQTTPTL = function(){
		$scope.offlineMQTTDiscover(1);
	}
	$scope.offlineOPCFunction = function(pageno){
		
		$scope.offlineOPCList =[];		
		$scope.currentofflineOPCPage=pageno;
		$scope.offlineOPCPerPage=ENV.recordPerPage;
		gatewayModuleService.getDeviceList($scope.gatewayInfo.id,pageno,'OPC').then(function (data) {
		if(data != "")
		{
			

			$scope.offlineOPCList = data.Data;

			$scope.totalOfflineOPCItems = data.total_records;

		}
	}).catch(function(error){
		//  $scope.dataOPCLoading = false;
	});
};


	//	-	ZIGBEE OFFLINE -- //
	$scope.offlineZigbeeDiscover = function(pageno){

		$scope.zigbeeOFFLINEdiscoverList = [];
		$scope.currentOFFLINEZigbeePage=pageno;
		$scope.ZigbeeOFFLINEPerPage=ENV.recordPerPage;
		gatewayModuleService.getDeviceList($scope.gatewayInfo.id,pageno,'ZIGBEE').then(function (data) {
		if(data != "")
		{
			

			$scope.zigbeeOFFLINEdiscoverList = data.Data;
			$scope.totalOfflineOPCItems = data.total_records;
	
}
}).catch(function(error){
		//  $scope.dataOPCLoading = false;
	});
};
$scope.offlineZWAVEDiscover = function(pageno){
	$scope.ZWAVEOFFLINEdiscoverList = [];
	$scope.currentOfflineZWAVEPage=pageno;
	$scope.ZWAVEPerPage=ENV.recordPerPage;
	gatewayModuleService.getDeviceList($scope.gatewayInfo.id,pageno,'ZWAVE').then(function (data) {
		if(data != "")
		{
			

			$scope.ZWAVEOFFLINEdiscoverList = data.Data;
			$scope.totalZWAVEOFFLINEItems = data.total_records;
		//	$scope.dataOPCLoading = false;
		var data4DeviceObject = 'xml';
		var data4DeviceStatus = {"fields":"vendor","orgid":$scope.orgid,"protocol":'ZWAVE'};
		$scope.getDisplayVendorModelID = [];
		deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
			$scope.getDisplayVendorModelID = data.Data;
		});

		$scope.getDisplayModelID = [];


		$scope.funcGetModelid = function(vendor,index){
			if($scope.getDisplayModelID[index] == undefined){
				$scope.getDisplayModelID[index] = {};
			}
			$scope.getDisplayModelID[index].data = [];
			var data4DeviceObject = 'xml';
			var data4DeviceStatus = {"fields":"modelid,devicename","vendor":vendor,"orgid":$scope.orgid};

			deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
				$scope.getDisplayModelID[index].data = data.Data;
			});	



		};
		$scope.selectedRow = null;
		$scope.setClickedRow = function(index,discover){

			$scope.selectedRow = index;
			$scope.selectedRowDiscover = discover;


			if(discover.discoverSelected == true)
			{
				discover.discoverSelected=false;
			}else{
				discover.discoverSelected=true;
			}
								};	
							}
						}).catch(function(error){
		//  $scope.dataOPCLoading = false;
	});
					}; 
		$scope.offlineMODBUSDiscover = function(pageno){
						$scope.offlineMODBUSList =[];		
						$scope.currentofflineMODBUSPage=pageno;
						$scope.offlineMODBUSPerPage=ENV.recordPerPage;
						gatewayModuleService.getDeviceList($scope.gatewayInfo.id,pageno,'MODBUS').then(function (data) {
		if(data != "")
		{
			

			$scope.offlineMODBUSList = data.Data;

			$scope.totalOfflineMODBUSItems = data.total_records;
			var data4DeviceObject = 'xml';
			var data4DeviceStatus = {"fields":"vendor","orgid":$scope.orgid,"protocol":'MODBUS'};
			$scope.getDisplayVendorModelID = [];
			deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
				$scope.getDisplayVendorModelID = data.Data;
			});
			
			$scope.getDisplayModelID = [];


			$scope.funcGetModelid = function(vendor,index){
				if($scope.getDisplayModelID[index] == undefined){
					$scope.getDisplayModelID[index] = {};
				}
				$scope.getDisplayModelID[index].data = [];
				var data4DeviceObject = 'xml';
				var data4DeviceStatus = {"fields":"modelid,devicename","vendor":vendor,"orgid":$scope.orgid};

				deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
					$scope.getDisplayModelID[index].data = data.Data;
				});	
				
				

			};
			$scope.selectedRow = null;
			$scope.setClickedRow = function(index,discover){

				$scope.selectedRow = index;
				$scope.selectedRowDiscover = discover;


				if(discover.discoverSelected == true)
				{
					discover.discoverSelected=false;
				}else{
					discover.discoverSelected=true;
				}

				};
			}
		}).catch(function(error){
		//  $scope.dataOPCLoading = false;
	});
	}
	$scope.offlineMQTTDiscover = function(pageno){
		$scope.BLEOFFLINEdiscoverList = [];
		$scope.currentOfflineBLEPage=pageno;
		$scope.BLEPerPage=ENV.recordPerPage;
		gatewayModuleService.getDeviceList($scope.gatewayInfo.id,pageno,'MQTT').then(function (data) {
		if(data != "")
		{
			

			$scope.BLEOFFLINEdiscoverList = data.Data;
			$scope.totalBLEOFFLINEItems = data.total_records;
		
}
}).catch(function(error){
		//  $scope.dataOPCLoading = false;
	});
};
  	
	$scope.offlineBLEDiscover = function(pageno){
		$scope.BLEOFFLINEdiscoverList = [];
		$scope.currentOfflineBLEPage=pageno;
		$scope.BLEPerPage=ENV.recordPerPage;
		gatewayModuleService.getDeviceList($scope.gatewayInfo.id,pageno,'BLE').then(function (data) {
		if(data != "")
		{
			

			$scope.BLEOFFLINEdiscoverList = data.Data;
			$scope.totalBLEOFFLINEItems = data.total_records;
		
}
}).catch(function(error){
		//  $scope.dataOPCLoading = false;
	});
};
  	 //$scope.offlineOPCFunction(1);
	 //$scope.offlineZigbeeDiscover(1);
	 //$scope.offlineBLEDiscover(1);
	 $scope.getAllRAMLFunc = function(gatewayId,appName,deviceAction){
		//console.log(gatewayId);
		//console.log(appName);
		$scope.dataOPCRegisterLoading = true;
		$rootScope.mqttSubscribe("get_raml_"+gatewayId,50);
		var object = {"action":deviceAction,"gwid":gatewayId};
		deviceModuleService.GetAllRAMLDevice(object,appName).then(function (data) {
			
			
			$scope.$on("mqtt_message",function(e,a){
								console.log(a);						
									//alert(JSON.stringify(a));
								
									if(a.data != null && a.data.responsecode == 200 && a.JOBID == data.Data.JOBID){
										toaster.pop('success','',data.message);
										$('#myAllRAML').modal('hide');
										$rootScope.$broadcast('serverGetAllRAMLResponse',{data : a.data});
										//$scope.getDataDevice(1,$scope.params);
										$rootScope.mqttUnsubscribe("get_raml_"+gatewayId);
										$scope.dataOPCRegisterLoading = false;
									}
				
			});
				
		});
	}


	$scope.$on("serverGetAllRAMLResponse",function(e,a){
		var socketData = [];
			 socketData.push(a.data);
			if(socketData.length == 1 && socketData.length>0){
				var modalInstance = $uibModal.open({
				  animation: true,
				  backdrop  : 'static',
				  ariaLabelledBy: 'modal-title',
				  ariaDescribedBy: 'modal-body',
				  templateUrl: 'GetRAMLResponseContent.html',
				  controller: 'GetRAMLResponseCtrl',
				  size: 'lg',
				  resolve: {
					dsparam: function () {
						return{'socketData':socketData}
					}
				  }
					});
			}
		  
			
		
		
		});
	 $scope.deviceDeregisterAll = function(gatewayid,protocol,deviceStatus,appName){
		 $scope.dataOPCRegisterLoading=true;
		$rootScope.mqttSubscribe(gatewayid,50);
		
		 deviceModuleService.deviceDeregisterAll(gatewayid,appName,deviceStatus).then(function (data){
					//console.log(data);
					$scope.$on("mqtt_message",function(e,a){

						
						if(a.responsecode==200){
						$scope.dataOPCRegisterLoading=false;
						
							if(protocol == "OPC"){


								
									$scope.onlineOPCFunction($scope.currentOPCPage);
								
							}
							if(protocol == "ZIGBEE"){


								
									$scope.onlineZIGBEEFunction($scope.currentZigbeePage);
								
							}
							if(protocol == "BLE"){


								
									$scope.getResultsPageData($scope.currentBLEPage);
								
							}
							if(protocol == "MQTT"){
									
										$scope.getResultsPageData($scope.currentBLEPage);
										
									
							}		
							if(protocol == "ZWAVE"){


								
																			
								$scope.onlineZWAVEFunction($scope.currentZWAVEPage);
																			
								
							}
							if(protocol == "MODBUS"){
								
								
									
									$scope.onlineMODBUSFunction($scope.currentMODBUSPage);
									
								
							}		
	
							
						}
						else{
							$scope.dataOPCRegisterLoading=false;
						}
					});
				});
	 }
	 $scope.deviceDeactivateAll = function(gatewayid,protocol,deviceStatus,appName){
				
				$scope.dataOPCActivationLoading=true;
				$rootScope.mqttSubscribe("multi_device_status_change"+gatewayid,50);
				deviceModuleService.deviceDeactivationAll(gatewayid,appName,deviceStatus).then(function (data){
					console.log(data);
					$scope.$on("mqtt_message",function(e,a){


						if(a.data.responsecode==200){
						$scope.dataOPCActivationLoading=false;
							if(protocol == "OPC"){


								
									$scope.onlineOPCFunction($scope.currentOPCPage);
								
							}
							if(protocol == "ZIGBEE"){


								
									$scope.onlineZIGBEEFunction($scope.currentZigbeePage);
								
							}
							if(protocol == "BLE"){


								
									$scope.getResultsPageData($scope.currentBLEPage);
								
							}
							if(protocol == "MQTT"){
							
										$scope.getResultsPageData($scope.currentBLEPage);
										
									
							}		
							if(protocol == "ZWAVE"){


								
																			
								$scope.onlineZWAVEFunction($scope.currentZWAVEPage);
								
							}
							if(protocol == "MODBUS"){
								
								
									$scope.onlineMODBUSFunction($scope.currentMODBUSPage);
									
								
							}	
							
						}
						else{
							$scope.dataOPCActivationLoading=false;
						}
					});
				});
			}
	 $scope.registerOPCActivateForm = function(gid,discovers,discoverStatus,type,period){
	
		$scope.dataOPCActivationLoading = true;
		
		
		var arr = [];
		/*for(var i in discovers){
			var discoverArray = [];
		   if(discovers[i].discoverSelected==true){
			 
			   //discovers[i].senp;
			   arr.push({"senid":discovers[i].senid,
								  "address":discovers[i].address,
								   "protocol":discovers[i].protocol,
								   "port":discovers[i].port
								 });
		   }
		}*/
		if(discovers != undefined){
		 /* arr.push({"senid":discovers.senid,
								  "address":discovers.address,
								   "protocol":discovers.protocol,
								   "port":discovers.port
								});*/

								arr.push({"id":discovers.id,

									"address":discovers.address,
									"protocol":discovers.protocol,
									"appid":discovers.appid});					 
							}						 
							if(arr.length ==0)
							{
								toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
								$scope.dataOPCActivationLoading = false;
								return false;
							}else{
								if(discovers.protocol == "OPC" && discovers.address == "")
								{
									toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_OPC_ADDRESS_NULL);
									$scope.dataOPCActivationLoading = false;
									return false;
								}
							}
		
		
		gatewayModuleService.postOPCActivationDataForm(gid,arr,period).then(function (data){
			if(data.status == 400 || data.status ==404){

			}else{
				var data = data.data
				$scope.jobid = data.Data.JOBID;
				$scope.gwid = data.Data.gwid;
				$scope.$on("mqtt_message",function(e,a){


					if(a.data != null && a.data.responsecode==200){

						if(type == "OPC"){
							if(discoverStatus =='online'){
								$scope.onlineOPCFunction($scope.currentOPCPage);
							}else{
								$scope.offlineOPCFunction($scope.currentofflineOPCPage);
							}
						}
						if(type == "ZIGBEE"){
							if(discoverStatus =='online'){
								$scope.onlineZIGBEEFunction($scope.currentZigbeePage);

							}else{
								$scope.offlineZigbeeDiscover($scope.currentOFFLINEZigbeePage);

							}
						}
						if(type == "BLE"){
							if(discoverStatus =='online'){
									
									$scope.getResultsPageData($scope.currentBLEPage);
									
								}else{
									
									$scope.offlineBLEDiscover($scope.currentOfflineBLEPage);
									
								}
							}
						if(type == "ZWAVE"){
							
							if(discoverStatus =='online'){
								
								$scope.onlineZWAVEFunction($scope.currentZWAVEPage);
								
							}else{
								
								$scope.offlineZWAVEDiscover($scope.currentOfflineZWAVEPage);
								
							}
						}
						if(type == "MODBUS"){
							
							if(discoverStatus =='online'){

								$scope.onlineMODBUSFunction($scope.currentMODBUSPage);
								
							}else{
								
								$scope.offlineMODBUSDiscover($scope.currentofflineMODBUSPage);
								
							}
						}
						if(type == "MQTT"){
							if(discoverStatus =='online'){
									
									$scope.getResultsPageData($scope.currentBLEPage);
									
								}else{
									
									$scope.offlineMQTTDiscover($scope.currentOfflineBLEPage);
									
								}
							}						
						$scope.dataOPCActivationLoading = false;	


		}
		else{

		$scope.dataOPCActivationLoading=false;
	}
});
			}
					$scope.dataOPCActivationLoading = false;		
				});

};
$scope.registerOPCPostForm = function(gid,discovers,discoverStatus,type,period){
		
	$scope.dataOPCRegisterLoading = true;
	$scope.discoverStatus = discoverStatus;
	$scope.type = type;

	var arr = [];
	if(discovers != undefined){

		if(discovers.selVendor != undefined && discovers.selModelId != undefined){
			arr.push({"id":discovers.id,
			"displayname":discovers.displayname,
			"macid":discovers.macid,
			"address":discovers.address,
			"protocol":discovers.protocol,
			"appid":discovers.appid,
			"vendor":discovers.selVendor,
			"modelid":discovers.selModelId});
		}else{
			arr.push({"id":discovers.id,
			"displayname":discovers.displayname,
			"macid":discovers.macid,
			"address":discovers.address,
			"protocol":discovers.protocol,
			"appid":discovers.appid});
		}
		
	}
		
		if(arr.length ==0)
		{
			toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
			$scope.dataOPCRegisterLoading = false;
			return false;
		}else{
			if(discovers.protocol == "OPC" && discovers.address == "")
			{
				toaster.pop('error',"",CustomMessages.GATEWAY_DEVICE_OPC_ADDRESS_NULL);
				$scope.dataOPCRegisterLoading = false;
				return false;
			}
		}
		
		
		gatewayModuleService.postOPCDataForm(gid,arr,period).then(function (data){
			if(data.status==400 || data.status==404){
				$scope.dataOPCRegisterLoading=false;
			}
			else{
				var data = data.data;
				$scope.$on("mqtt_message",function(e,a){


					if(a.responsecode==200){

						if(type == "OPC"){


							if(discoverStatus =='online'){
								$scope.onlineOPCFunction($scope.currentOPCPage);
							}else{
								$scope.offlineOPCFunction($scope.currentofflineOPCPage);
							}
						}
						if(type == "ZIGBEE"){


							if(discoverStatus =='online'){
								$scope.onlineZIGBEEFunction($scope.currentZigbeePage);
							}else{
								$scope.offlineZigbeeDiscover($scope.currentOFFLINEZigbeePage);
							}
						}
						if(type == "BLE"){


							if(discoverStatus =='online'){
								$scope.getResultsPageData($scope.currentBLEPage);
							}else{
								$scope.offlineBLEDiscover($scope.currentOfflineBLEPage);
							}
						}
						if(type == "MQTT"){
							if(discoverStatus =='online'){
									
									$scope.getResultsPageData($scope.currentBLEPage);
									
								}else{
									
									$scope.offlineMQTTDiscover($scope.currentOfflineBLEPage);
									
								}
							}		
						if(type == "ZWAVE"){


							if(discoverStatus =='online'){
																		
							$scope.onlineZWAVEFunction($scope.currentZWAVEPage);
																		
							}else{
								//	$scope.onlineZWAVEFunction($scope.currentZWAVEPage);									
							$scope.offlineZWAVEDiscover($scope.currentOfflineZWAVEPage);
																		
							}
						}
						if(type == "MODBUS"){
							
							if(discoverStatus =='online'){
								
								$scope.onlineMODBUSFunction($scope.currentMODBUSPage);
								
							}else{
								
								$scope.offlineMODBUSDiscover($scope.currentofflineMODBUSPage);
								
							}
						}		
			$scope.dataOPCRegisterLoading = false;

			//$scope.getDataDevice($scope.currentDevicePage,$scope.params);
		}
		else{

		$scope.dataOPCRegisterLoading=false;
	}
});
			}
					});



};
$scope.OPCDiscover = function(OPCURL,appName,protocol){
	$scope.dataOPCLoading = true;
			
			var SocketCollection = [];
			

			$scope.OPCURL = OPCURL;
			$scope.appName = appName;
			$scope.protocol = protocol;
			if(($scope.OPCURL == "" || $scope.OPCURL == null) || ($scope.appName == undefined))
			{
				toaster.pop('error', "",CustomMessages.GATEWAY_DISCOVER_OPC_ERROR);
				$scope.dataOPCLoading = false;

			}else{

				gatewayModuleService.getOPCGatewayDiscover($scope.gatewayInfo.id,$scope.OPCURL,$scope.appName,$scope.protocol,$scope.gatewayInfo.gatewaymeta.meshID).then(function (data) {
					if(data.status==400 || data.status==404){
						$scope.dataOPCLoading = false;
					}else{
						var datapass = angular.fromJson(data.data.Data);
						$scope.jobid = datapass.JOBID;
						$scope.gwid = datapass.gwid;
						$scope.$on("mqtt_message",function(e,a){


							if(a.data.responsecode==200){

								$scope.onlineOPCFunction(1);

							}
							else if(a.responsecode==200){

							}
							$scope.dataDeviceLoading=false;
						});
				}	
					

					}).catch(function(error){
						$scope.dataOPCLoading = false;
					});
}
				};
				$scope.onlineOPCFunction = function(pageno){
					$scope.discoverList =[];
					$scope.currentOPCPage=pageno;
					$scope.OPCPerPage=ENV.recordPerPage;


					$timeout(function(){	
						gatewayModuleService.getDeviceList($scope.gwid,pageno,$scope.protocol).then(function (data) {
							$scope.discoverList = data.Data;
							$scope.totalOPCItems = data.total_records;

							$scope.dataOPCLoading = false;
						}).catch(function(error){
							$scope.dataOPCLoading = false;
						});
					});	


				};					



		$scope.ZIGBEEDiscover = function(appName,protocol){
		$scope.dataZiGBEELoading  = true;
		var SocketCollection = [];
			

			$scope.appName = appName;
			$scope.protocol = protocol;
			if($scope.appName == "" || $scope.appName == null)
			{
				toaster.pop('error', "",CustomMessages.GATEWAY_DISCOVER_PORT_ERROR);
				$scope.dataZiGBEELoading  = false;

			}else{

				gatewayModuleService.getZigbeeGatewayDiscover($scope.gatewayInfo.id,$scope.appName,$scope.protocol,$scope.gatewayInfo.gatewaymeta.meshID).then(function (data) {
					if(data.status ==400 || data.status==404){
						$scope.dataZiGBEELoading  = false;
					}else{
						var data =data.data;
						$scope.jobid = data.Data.JOBID;
						$scope.gwid = data.Data.gwid;
						$scope.$on("mqtt_message",function(e,a){


							if(a.data.responsecode==200){

								$scope.onlineZIGBEEFunction(1);

							}
							else if(a.responsecode==200){

							}
							$scope.dataZiGBEELoading  = false;	
						});
					}

					
						}).catch(function(error){
							$scope.dataZiGBEELoading  = false;	
						});
					}
				};

				$scope.onlineZIGBEEFunction = function(pageno){
					$scope.zigbeediscoverList =[];
					$scope.currentZigbeePage=pageno;
					$scope.ZigbeePerPage=ENV.recordPerPage;
							

							gatewayModuleService.getDeviceList($scope.gwid,pageno,$scope.protocol).then(function (data) {
								$scope.zigbeediscoverList = data.Data;

								$scope.totalOPCItems = data.total_records;
								$scope.dataZiGBEELoading = false;
							}).catch(function(error){
								$scope.dataZiGBEELoading = false;
							});
							
						};
						$scope.MODBUSDiscover = function(modbusObj,protocol){

							var SocketCollection = [];
							$scope.dataMODBUSLoading = true;
		
		$scope.appName = modbusObj.appName;
		$scope.protocol = protocol;
		if($scope.appName == "" || $scope.appName == null)
		{

			toaster.pop('error', "",CustomMessages.GATEWAY_DISCOVER_PORT_ERROR);
			$scope.dataMODBUSLoading  = false;
			
		}
		else if((modbusObj.rdoConnectionMode == "" || modbusObj.rdoConnectionMode == null) || ((modbusObj.rdoSlave == 1 && (modbusObj.slaveRange2 == "" || modbusObj.slaveRange2 == undefined || modbusObj.slaveRange == "" || modbusObj.slaveRange == undefined)) ||  (modbusObj.rdoSlave == 2 && (modbusObj.slaveID == "" || modbusObj.slaveID == undefined)))){

			toaster.pop('error', "",CustomMessages.GATEWAY_DEVICE_CHECKBOX_OPTIONS);
			$scope.dataMODBUSLoading  = false;
		}
		else{
			$timeout(function(){


				deviceModuleService.getDiscoverMODBUSGateway($scope.gatewayInfo.id,$scope.appName,$scope.protocol,modbusObj,$scope.gatewayInfo.gatewaymeta.meshID).then(function (data) {
				
					if(data.status ==400 || data.status==404){
						$scope.dataMODBUSLoading = false;
					}else{
						var data = data.data;
						$scope.jobid = data.Data.JOBID;
						$scope.gwid = data.Data.gwid;
						$scope.$on("mqtt_message",function(e,a){


							if(a.data.responsecode==200){

								$scope.onlineMODBUSFunction(1);

							}
							else if(a.responsecode==200){

							}
							$scope.dataMODBUSLoading = false;
						});

					}
						
						$scope.dataMODBUSLoading = false;
						var data4DeviceObject = 'xml';
						var data4DeviceStatus = {"fields":"vendor","orgid":$scope.orgid,"protocol":$scope.protocol};
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

					});

			});
		}
		
	};
	$scope.BLEDiscover = function(appName,protocol){

		var SocketCollection = [];
		$scope.dataBLELoading  = true;
			
			
			$scope.appName = appName;
			$scope.protocol = protocol;
			if($scope.appName == "" || $scope.appName == null)
			{
				toaster.pop('error', "",CustomMessages.GATEWAY_DISCOVER_PORT_ERROR);
				$scope.dataBLELoading  = false;

			}else{

				gatewayModuleService.getDiscoverGateway($scope.gatewayInfo.id,$scope.appName,$scope.protocol,$scope.gatewayInfo.gatewaymeta.meshID).then(function (data) {

					if(data.status==400 || data.status==404){
						$scope.dataBLELoading  = false;	
					}
					else{
						  var data = data.data
						  $scope.jobid = data.Data.JOBID;
						  $scope.gwid = data.Data.gwid;
						  $scope.$on("mqtt_message",function(e,a){
								//console.log(a);

						  	if(a.data != null && a.data.responsecode==200){

						  		if($scope.protocol == 'ZWAVE')
						  		{
						  			$scope.onlineZWAVEFunction(1);
						  		}else{
						  			$scope.getResultsPageData(1);
						  		}


						  	}
						  	else if(a.responsecode==200){

						  	}
						  	$scope.dataBLELoading  = false;
						  });
						}
						  


						 $scope.pageChanged = function(){

							
							$scope.getResultsPageData($scope.currentBLEPage);
						};

					}).catch(function(error){
						$scope.dataBLELoading  = false;	
					});
				}
			};

			$scope.getResultsPageData = function(pageno){
				$scope.BLEdiscoverList=[];
				$scope.currentBLEPage=pageno;
				$scope.BLEPerPage=ENV.recordPerPage;


				$timeout(function(){

					gatewayModuleService.getDeviceList($scope.gwid,pageno,$scope.protocol).then(function (data) {
												$scope.BLEdiscoverList = data.Data;

												$scope.totalBLEItems = data.total_records;
													$scope.dataBLELoading = false;
												}).catch(function(error){
													$scope.dataBLELoading = false;
												});
											});

			};
			$scope.setDeviceinfo = function(vendor,modelid,deviceid,appid){
			
				var SocketCollection = [];
				deviceModuleService.setVendorModelDeviceinfo(vendor,modelid,deviceid,appid).then(function(data){
					if(data.status ==400 || data.status==404){
						$scope.dataBLELoading = false;
						
					}
					else{
						$scope.jobid = data.data.Data.JOBID;
						$scope.gwid = data.data.Data.gwid;
						$scope.$on("mqtt_message",function(e,a){
							if(a.data.responsecode==200){
								toaster.pop("success","","Save Information..!!!");
							}else{
								toaster.pop("error","","Error Returned....!!!!");
							}
						});
					}
			  
							});
			};
			$scope.onlineZWAVEFunction = function(pageno){
				$scope.ZWAVEdiscoverList=[];
				$scope.currentZWAVEPage=pageno;
				$scope.ZWAVEPerPage=ENV.recordPerPage;


				$timeout(function(){

					gatewayModuleService.getDeviceList($scope.gwid,pageno,$scope.protocol).then(function (data) {
				
						$scope.ZWAVEdiscoverList = data.Data;

						$scope.totalZWAVEItems = data.total_records;
													$scope.dataBLELoading = false;
													var data4DeviceObject = 'xml';
													var data4DeviceStatus = {"fields":"vendor","orgid":$scope.orgid,"protocol":$scope.protocol};
													$scope.getDisplayVendorModelID = [];
													deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
														
														$scope.getDisplayVendorModelID = data.Data;
													});
													$scope.getDisplayModelID = [];
													$scope.funcGetModelid = function(vendor,index){
														var data4DeviceObject = 'xml';
														var data4DeviceStatus = {"fields":"modelid,devicename","vendor":vendor,"orgid":$scope.orgid};
														
														if($scope.getDisplayModelID[index] == undefined){
															$scope.getDisplayModelID[index] = {};
														}
														$scope.getDisplayModelID[index].data = [];
														deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
															$scope.getDisplayModelID[index].data = data.Data;
														});	
														
													};
												}).catch(function(error){
													$scope.dataBLELoading = false;
												});
												
											});
				$scope.selectedRow = null;
				$scope.setClickedRow = function(index,discover){

					$scope.selectedRow = index;
					$scope.selectedRowDiscover = discover;


					if(discover.discoverSelected == true)
					{
						discover.discoverSelected=false;
					}else{
						discover.discoverSelected=true;
					}

								};	
							};					
							$scope.onlineMODBUSFunction = function(pageno){
								$scope.MODBUSdiscoverList=[];
								$scope.currentMODBUSPage=pageno;
								$scope.MODBUSPerPage=ENV.recordPerPage;


								$timeout(function(){

									gatewayModuleService.getDeviceList($scope.gwid,pageno,$scope.protocol).then(function (data) {
							$scope.MODBUSdiscoverList = data.Data;

							$scope.totalMODBUSItems = data.total_records;
								$scope.dataMODBUSLoading = false;
								var data4DeviceObject = 'xml';
								var data4DeviceStatus = {"fields":"vendor","orgid":$scope.orgid,"protocol":$scope.protocol};
								$scope.getDisplayVendorModelID = [];
								deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
									
									$scope.getDisplayVendorModelID = data.Data;
								});
								$scope.getDisplayModelID = [];
								$scope.funcGetModelid = function(vendor,index){
									var data4DeviceObject = 'xml';
									var data4DeviceStatus = {"fields":"modelid,devicename","vendor":vendor,"orgid":$scope.orgid};
									
									if($scope.getDisplayModelID[index] == undefined){
										$scope.getDisplayModelID[index] = {};
									}
									$scope.getDisplayModelID[index].data = [];
									deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
										$scope.getDisplayModelID[index].data = data.Data;
									});	
									
								};
							}).catch(function(error){
							//$scope.dataMODBUSLoading = false;
						});
							
						});
								$scope.selectedRow = null;
								$scope.setClickedRow = function(index,discover){

									$scope.selectedRow = index;
									$scope.selectedRowDiscover = discover;


									if(discover.discoverSelected == true)
									{
										discover.discoverSelected=false;
									}else{
										discover.discoverSelected=true;
									}
			};	
		};					
		$rootScope.offlineOPCFunction = $scope.offlineOPCFunction;
		$rootScope.offlineZigbeeDiscover = $scope.offlineZigbeeDiscover;
		$rootScope.offlineBLEDiscover = $scope.offlineBLEDiscover;
		$rootScope.offlineMQTTDiscover = $scope.offlineMQTTDiscover;
		$rootScope.getResultsPageData = $scope.getResultsPageData;
		$rootScope.onlineZIGBEEFunction = $scope.onlineZIGBEEFunction;
		$rootScope.onlineOPCFunction = $scope.onlineOPCFunction;
	//$rootScope.onlineZWAVEFunction = $scope.onlineZWAVEFunction;
	$rootScope.registerOPCActivateForm = $scope.registerOPCActivateForm;
	$rootScope.deviceDeactivateAll =  $scope.deviceDeactivateAll;
	$rootScope.deviceDeregisterAll = $scope.deviceDeregisterAll;
	$rootScope.registerOPCPostForm = $scope.registerOPCPostForm;
	$rootScope.getAllRAMLFunc = $scope.getAllRAMLFunc;
	
});

deviceModule.controller('deviceGroupsCtrl', function ($scope, $rootScope, deviceModuleService,gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $uibModal,$state,toaster,CustomMessages,$mdDialog) {

	$rootScope.globals = $cookieStore.get('globals') || {};
if (!$rootScope.globals.currentUser) {
$location.path('/login');
} else {
	$scope.username = $rootScope.globals.currentUser.username;
	$scope.orgid = $rootScope.globals.currentUser.orgid;
	$scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));
}



$scope.addDevicee = function(){
}


$scope.newProfileArray = [];



$scope.addNewProfile =function(){


	$scope.newProfileArray.push({
		"deviceName":"",
		"deviceProperty":"",
		"deviceValue":""
	});

}
$scope.newProfile={};
$scope.newProfile.deviceName = [];
$scope.newProfile.deviceProperty = [];
$scope.myproperty = function(deviceIdselected){
	
	$scope.objectfind = $filter('filter')($scope.grpdevicesinformation.deviceids,{id:deviceIdselected});
   
   $scope.registeredPropertyData = $scope.objectfind[0].regproperties;
   
}

$scope.removeDevice = function(index){
	$scope.newProfileArray.splice(index, 1);
}





$scope.saveProfile = function(newProfileArray,grpname,grpdesc,grpschedfreq,grpschedtime,objectfind){
      
      $scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));

        devicegrpid = $scope.grpdevicesinformation.id
        deviceProtocol = objectfind[0].protocol
        deviceAppid = objectfind[0].appid
        deviceGatewayId = objectfind[0].gateway
        var a = JSON.stringify(grp)
        var b = a.substr(1, a.length - 2)
       
        var str = b.split("T")
        


//        arraayys = 
     
       //devname = newProfileArray.deviceName
       //devprop = newProfileArray.deviceProperty
       //devvalue = newProfileArray.deviceValue
       

  var devArr = [];
  for(var i in newProfileArray){
  	devArr.push({"deviceid":newProfileArray[i].deviceName,"property":newProfileArray[i].deviceProperty,"propertyvalue":parseInt(newProfileArray[i].deviceValue),"scheduledat":grpschedtime,"frequency":grpschedfreq,"protocol":deviceProtocol} )

}

deviceModuleService.postActionProfiles(devicegrpid,deviceAppid,deviceGatewayId,grpname,grpdesc,devArr).then(function (data) {
	$scope.dataLoading = true;
	$timeout(function(){
		toaster.pop('success','',data.message);
		//$scope.clearEditProfileModal();
		$scope.dataLoading = false;	
		$state.reload();	
	}).catch(function(error){
		toaster.pop('error','',data.message);
		$scope.dataLoading = false;
	});	
})
};


// Fetching devices of each group
$scope.getDataDevice = function(pageno,params){
$scope.deviceList = [];
$scope.currentDevicePage = pageno;
$scope.devicePerPage = ENV.recordPerPage;
$scope.dataLoading = true;

deviceModuleService.getDeviceList(pageno,params).then(function (data) {

	$timeout(function(){

		if(data.Data != undefined){
			$scope.deviceList = data.Data;
			$scope.dataDeviceLoading = false;
			$scope.totalItems = data.total_records;
		}else{
			$scope.totalItems = 0;
		}

		$scope.selectedRow = null;
		$scope.setClickedRow = function(index,device){
			$scope.selectedRow = index;
			$scope.selectedRowDevice = device;


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
$scope.pageChanged = function(){

	$scope.getDataDevice($scope.currentDevicePage,$scope.params);	
};
});

	$scope.dataLoading = false;		
}).catch(function(error){
	$scope.totalItems = 0;
	$scope.dataDeviceLoading = false;
	$scope.dataLoading = false;		 
});	
};
if($scope.gatewayId != undefined){
	$scope.params = {"g_id":$scope.gatewayId};
}
$scope.tags=[];

$scope.refreshGroupFunc = function(){

	$scope.getDataGroupDevice(1,$scope.params);
};
//$scope.getDataGroupDevice(1,$scope.params);
//$scope.getDataDevice(1,$scope.params);
$scope.getDeviceinfo = function(device) {
	if (device != "") {
			
			var found = $filter('filter')($scope.tags, {id: device.id}, true);
			if(found.length >0)
			{
		
			}else{
				$scope.tags.push(device);

			}
		}
	};
	$scope.alreadyExists=function(device)
	{
		var found = $filter('filter')($scope.tags, {id: device.id}, true);
		if(found.length >0){
			return true;
		}
		else{
			return false;
		}
	}
	$scope.removeTags = function(device){

	
	var index = $scope.tags.indexOf(device);
	$scope.tags.splice(index, 1);     
};



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


// Fetching Groups Data
$scope.getDataGroupDevice = function(pageno,params){
$scope.deviceGroupList = [];
$scope.currentDevicePage = pageno;
$scope.gatewayPerPage = ENV.recordPerPage;
$scope.dataLoading = true;
deviceModuleService.getDeviceGroups($scope.currentDevicePage,params).then(function(data){

	$timeout(function(){

		if(data.Data != undefined){
			$scope.deviceGroupList = data.Data;
			$scope.dataDeviceLoading = false;
			$scope.totalItems = data.total_records;
}else{
	$scope.totalItems = 0;
}

$scope.selectedRow = null;
$scope.setClickedRow = function(index,device){
	$scope.selectedRow = index;
	$scope.selectedRowDevice = device;

if(device.Selected == true)
{
	device.Selected=false;
}else{
	device.Selected=true;
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
$scope.pageChanged = function(){

$scope.getDataGroupDevice($scope.currentDevicePage,$scope.params);	
};
});$timeout(function(){



	if(data.Data != undefined){

		$scope.deviceGroupList = data.Data;
		$scope.dataDeviceLoading = false;
		$scope.totalItems = data.total_records;
	}

	$scope.selectedRow = null;
	$scope.setClickedRow = function(index,device){
		$scope.selectedRow = index;
		$scope.selectedDeviceGroup = device;

};

$scope.checkAllDevice = function (selectedAllDevice) {

	$scope.selectedAllDevice = selectedAllDevice;
	if ($scope.selectedAllDevice) {
		$scope.selectedAllDevice = true;
	} else {
		$scope.selectedAllDevice = false;
	}

	angular.forEach($scope.deviceGroupList, function (device) {
		device.Selected = $scope.selectedAllDevice;
	});

};
$scope.checkStatus= function(device) {

	device.Selected = !device.Selected;
};



});
$scope.dataLoading = false;		
}).catch(function(error){
	$scope.totalItems = 0;
	$scope.dataDeviceLoading = false;
	$scope.dataLoading = false;		 
});	
};
if($scope.gatewayId != undefined){
	$scope.params = {"gwid":$scope.gatewayId};
}
$scope.tags=[];


$scope.getDataGroupDevice(1,$scope.params);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

$scope.editDeviceGroups = function(deviceList){

	if(deviceList != undefined)
	{
		localStorage.setItem('editDeviceList',JSON.stringify(deviceList));
	}else{

		localStorage.setItem('editDeviceList',undefined);
	}
	$location.path('gateway/detail/'+$scope.gatewayInfo.id+'/devices/devicegroups/deviceaddgroup');
}


$scope.deleteDeviceGroups = function(deviceList,ev){


	var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
		var $dialog = angular.element(document.querySelector('md-dialog'));
		var $actionsSection = $dialog.find('md-dialog-actions');
		var $cancelButton = $actionsSection.children()[0];
		var $confirmButton = $actionsSection.children()[1];
		angular.element($confirmButton).removeClass('md-focused');
		angular.element($cancelButton).addClass('md-focused');
		$cancelButton.focus();
	}})
	.title("You are about to delete this group. Are you sure?")
	.textContent("It can't be retrieved. All the actions related to this group are also deleted.")
	.ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
	.targetEvent(ev)
	.cancel(CustomMessages.MD_GENERAL_CANCEL)
	.ok(CustomMessages.MD_GENERAL_OK);
	$mdDialog.show(confirm).then(function() {

		deviceModuleService.deleteGroupRequests(deviceList.id).then(function(data){

		   if(data.message != undefined){
		   	$scope.message = data.message;
		   	toaster.pop('success','',$scope.message);
		   	$state.reload();
		   }
		   else{
		   	toaster.pop('error','',data.message)
		   }

		});
	});

};



$scope.actionProfiles = function(selectedDeviceGroup){
	$scope.grpdeviceinfo = selectedDeviceGroup
	localStorage.setItem('grpdeviceinfo',JSON.stringify($scope.grpdeviceinfo));	

	
	var modelInstance = $uibModal.open({
		animation: true,
		backdrop  : 'static',
		ariaLabelledBy:'modal-title',
		ariaDescribedBy:'modal-body',
		templateUrl:'modalDeviceGroupActionProfile.html',
		controller: 'deviceGroupActionProfileCtrl',
		windowClass: 'app-modal-window',
		resolve:{
			param: function(){
				return {'gatewayid':$scope.gatewayInfo.id,'deviceGroupId' :selectedDeviceGroup,'gateway':$scope.gatewayInfo};
			}
		}

	});
	return false;
}



});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%deviceGroupsAddCtrl%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


deviceModule.controller('deviceGroupsAddCtrl',function($scope,$rootScope,deviceModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $state,toaster,CustomMessages){
	$rootScope.globals = $cookieStore.get('globals') || {};
if (!$rootScope.globals.currentUser) {
	$location.path('/login');
} else {
$scope.username = $rootScope.globals.currentUser.username;
$scope.orgid = $rootScope.globals.currentUser.orgid;

}

$scope.devicegroupData = {};
if($scope.editDeviceInfo != undefined && $scope.editDeviceInfo != "undefined")
{
$scope.devicegroupData.name = $scope.editDeviceInfo.name;
$scope.devicegroupData.description = $scope.editDeviceInfo.description;
$scope.devicegroupData.deviceids = $scope.editDeviceInfo.deviceids;
$scope.DeviceSavedList = $scope.devicegroupData.deviceids;
}
if($scope.gatewayId != undefined)
{
	$scope.params = {"g_id":$scope.gatewayId};
}
$scope.getDataDevice = function(pageno,params){
$scope.deviceList = [];
$scope.currentDevicePage = pageno;
$scope.devicePerPage = ENV.recordPerPage;
$scope.dataLoading = true;
deviceModuleService.getDeviceList(pageno,params).then(function (data) {

	$timeout(function(){

		if(data.Data != undefined){
			$scope.deviceList = data.Data;
			$scope.dataDeviceLoading = false;
			$scope.totalItems = data.total_records;
		}else{
			$scope.totalItems = 0;
		}

		$scope.selectedRow = null;
		$scope.setClickedRow = function(index,device){
			$scope.selectedRow = index;
			$scope.selectedRowDevice = device;
if(device.Selected == true)
{
	device.Selected=false;
}else{
	device.Selected=true;
}
};

$scope.pageChanged = function(){

$scope.getDataDevice($scope.currentDevicePage,$scope.params);	
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
});
	$scope.dataLoading = false;		
}).catch(function(error){
	$scope.totalItems = 0;
	$scope.dataDeviceLoading = false;
	$scope.dataLoading = false;		 
});	
};



$scope.tags=[];

$scope.getDataDevice(1,$scope.params);

$scope.tags = $scope.devicegroupData.deviceids;
$scope.removeTags1 = function(device){

var index = $scope.tags.indexOf(device);
$scope.tags.splice(index, 1);     

};


$scope.addGroups = function(devicegroupData,device){


var arr1=[]
angular.forEach($scope.DeviceSavedList, function (device) {
	$scope.deviceIds = device.id
	arr1.push($scope.deviceIds)
});

var SocketCollection = [];

$scope.grpName = devicegroupData.name;
$scope.grpDesc = devicegroupData.description;
$scope.dataLoading=true;

if($scope.grpName == null || $scope.grpName == undefined)
{
	toaster.pop("error","","Group Name is neccesary.");
	$scope.dataLoading=false;
	return false;
}


if($scope.grpDesc == null || $scope.grpDesc == undefined)
{
	toaster.pop("error","","Group Description is necessary.");
	$scope.dataLoading=false;
	return false;
}

$scope.dataLoading=true;


deviceModuleService.addDeviceGroups($scope.grpName,$scope.grpDesc,arr1,$scope.gatewayInfo.id).then(function(data)
{
	$scope.devgroupId = data.id;
	if(data.status == 404 || data.status == 400)
	{
		toaster.pop("error","",data.data.message)
		$scope.dataLoading=false;
//return false;
}
else
{
	$scope.dataLoading=false;
	toaster.pop('success','',data.message);
	$location.path('gateway/detail/'+$scope.gatewayInfo.id+'/devices/devicegroups');
}

});

}


//**********************************************

$scope.editGroups = function(devicegroupData,device){
$scope.editDeviceInfo = JSON.parse(localStorage.getItem('editDeviceList'));


var arr1=[]
angular.forEach($scope.DeviceSavedList, function (device) {
	$scope.deviceIds = device.id
	arr1.push($scope.deviceIds)
});

var SocketCollection = [];

$scope.grpName = devicegroupData.name;
$scope.grpDesc = devicegroupData.description;
$scope.dataLoading=true;
$scope.groupsId = $scope.editDeviceInfo.id
if($scope.grpName == null || $scope.grpName == undefined)
{
	toaster.pop("error","","Group Name is neccesary.");
	$scope.dataLoading=false;
	return false;
}



if($scope.grpDesc == null || $scope.grpDesc == undefined)
{
	toaster.pop("error","","Group Description is necessary.");
	$scope.dataLoading=false;
	return false;
}

$scope.dataLoading=true;


deviceModuleService.editDeviceGroup($scope.grpName,$scope.grpDesc,arr1,$scope.gatewayInfo.id,$scope.groupsId).then(function(data)
{
	if(data.status == 404 || data.status == 400)
	{
		toaster.pop("error","",data.data.message)
//return false;
}
else
{
	$scope.dataLoading=false;
	toaster.pop('success','',data.message);
	$location.path('gateway/detail/'+$scope.gatewayInfo.id+'/devices/devicegroups');
}

});

}

//***********************************************



$scope.getDeviceinfo = function(device) {

	if (device != "") {
if($scope.tags == undefined){
	$scope.tags = [];
}
var found = $filter('filter')($scope.tags, {id: device.id}, true);

if(found.length >0)
{
}else{
	$scope.tags.push(device);

}
}
};
$scope.alreadyExists=function(device)
{
	if($scope.tags == undefined){
		$scope.tags = [];
	}
	var found = $filter('filter')($scope.tags, {id: device.id}, true);
	if(found.length >0){
		return true;
	}
	else{
		return false;
	}
}
$scope.removeTags = function(device){
//$scope.tags;
var index = $scope.tags.indexOf(device);
$scope.tags.splice(index, 1);     
};


$scope.savedeviceGroups = function(device){

	$scope.DeviceSavedList = $scope.tags;


$('#myModaladddevice').modal('hide');
};

$scope.cleardeviceGroups = function(){
	$scope.DevicesList=[];
	$scope.tags = [];
	$('#myModaladddevice').modal('hide');
}

});
deviceModule.controller('devicePropertiesCtrl',function($scope,$rootScope,deviceModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$state,toaster,CustomMessages,param){

	$rootScope.globals = $cookieStore.get('globals') || {};
	if (!$rootScope.globals.currentUser) {
		$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
	
	}
	$scope.param = param;
	$scope.gatewayId = $scope.param.gatewayid;
	$scope.deviceInfo = $scope.param.deviceInfo;

	$scope.datausersLoading = true;
	$scope.propertyList = [];

	



	deviceModuleService.getDeviceProperties($scope.deviceInfo.id).then(function(data){

   		$scope.propertyList1 = data.Data.regproperties;


   		$scope.appid = data.Data.appid;
   		$scope.totalpropertyListItems = $scope.propertyList1.length;

   		$scope.checkAll = function (selectedAll) {

   			$scope.selectedAll = selectedAll;
			if ($scope.selectedAll) {
				$scope.selectedAll = true;
			} else {
				$scope.selectedAll = false;
			}
			
			angular.forEach($scope.propertyList, function (property) {
				property.propertySelected = $scope.selectedAll;
			});

		};
	});



	$scope.savedeviceProperties = function(propertyList,propertyType){

		$scope.dataLoading = true;
		var SocketCollection = [];
    



					var arr = [];
					for(var i in propertyList){
						if(propertyList[i].propertySelected==true){
			  propertyList[i].name
			  arr.push({"name":propertyList[i].definitionName,"type":propertyList[i].type});
		   }  	
		}

		deviceModuleService.registerDeviceProperties($scope.deviceInfo.id,$scope.gatewayId,$scope.appid,arr).then(function(data)
		{
			if(data.status ==400 || data.status==404){
				$scope.dataDeviceLoading = false;
			}
			else{
				var data = data.data;
				$scope.jobid = data.Data.JOBID;
   		 $scope.gwid = data.Data.CLIENTID;
   		 if(data.message == "Success") {
   		 	toaster.pop('success','',data.message+ " in registering device properties");
   		 	$uibModalInstance.close();
   		 }
			}
 

						});



	}

	$scope.cleardeviceProperties = function(){
		$uibModalInstance.close();
	}



	$scope.checkStatus= function(property) {

		property.propertySelected = !property.propertySelected;
	};

	$scope.selectedRow = null;$scope.arrCheckboxSelection = [];
	$scope.setClickedRow = function(index,property){
		$scope.selectedRow = index;
		$scope.selectedRowUser = property;	
				property.propertySelected=true;
				};


			});



deviceModule.controller('EditprofileCtrl',function($scope,$rootScope,deviceModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$mdToast,$state,toaster,CustomMessages,param,$uibModal){


$rootScope.globals = $cookieStore.get('globals') || {};
if (!$rootScope.globals.currentUser) {
$location.path('/login');
} else {
	$scope.username = $rootScope.globals.currentUser.username;
	$scope.orgid = $rootScope.globals.currentUser.orgid;
	

} 
$scope.dayOriginalArray = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
$scope.gatewayId = param.gatewayId;
$scope.gatewayInfo = param.gateway

 $scope.profiledata = {};
$scope.grpactionDayArray = [];
 $scope.profileInfo = param.profileInfo;
$scope.deviceGroupId = param.deviceGroupId;
$scope.grpactionDayArray =[]




  if($scope.profileInfo != undefined || $scope.profileInfo != null){


  	$scope.profiledata.grpname = $scope.profileInfo.name;
  	$scope.profiledata.grpdesc = $scope.profileInfo.description;
  	$scope.processedby = $scope.profileInfo.processedby
	if($scope.profileInfo.actions.length>0)
	{
		
		$scope.profiledata.grpschedfreq = $scope.profileInfo.actions[0].frequency;
		$scope.profiledata.grpschedtime = $scope.profileInfo.actions[0].scheduledat;
		$scope.grpactionDayArray = $scope.profileInfo.actions[0].dow;
		

		$scope.uniqueActionId = $scope.profileInfo.actions[0].id;

   }else{
   	$scope.profiledata.grpschedfreq = "";
   	$scope.profiledata.grpschedtime = "";
   	$scope.profiledata.day = [];
   }


      $scope.returnTime1 = function(datetime,frequency) {
            //alert("hello"+frequency)
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




$scope.profileInfoId = param.profileInfo.id

}



$scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));


var changedValueArr =[];
$scope.newProfileArray = [];
$scope.editingFlag = [];
$scope.editNewProfile = function(index){

$scope.editingFlag[index] = true;
};
$scope.noSchedulerApp = false
$scope.getGatewayScheduleList = function(){
if($scope.gatewayInfo.gatewaymeta.meshID ==null || $scope.gatewayInfo.gatewaymeta.meshNetwork==null){
	toaster.pop("error","","Please update mesh details for this gateway")
}else{
	
	deviceModuleService.getGatewaySchedulerData($scope.gatewayInfo.gatewaymeta.meshID,'SchedulerApp',$scope.gatewayInfo.gatewaymeta.meshNetwork).then(function(data){


			
if(data.status==204){
$scope.noSchedulerApp = true;
}else{
		if(data.data.Data!=undefined){
			$scope.gatewayScheduleList = data.data.Data
		}
		for(var i=0; i<$scope.gatewayScheduleList.length;i++){
			if($scope.processedby == $scope.gatewayScheduleList[i].id){
				$scope.processedBy = $scope.gatewayScheduleList[i]

			}
		}
	}
	});
}
}

$scope.getGatewayScheduleList()

$scope.dropDownData= function(name){
$scope.processedBy = name.id
}

$scope.funcData = function(value){
		if($scope.grpactionDayArray.indexOf(value)==-1){
			$scope.grpactionDayArray.push(value)
			}else{
				var ind = $scope.grpactionDayArray.indexOf(value)
			$scope.grpactionDayArray.splice(ind,1)
	
			}
	
	};

$scope.addNewProfile =function(){
$scope.addnewdeviceData = true;
$scope.newProfileArray.push({
	"deviceName":"",
	"deviceDef":"",
	"deviceProperty":"",
	"deviceType":"",
	"deviceValue":""
});
}

$scope.newProfile={};
$scope.newProfile.deviceName = [];
$scope.newProfile.deviceProperty = [];
$scope.newProfile.deviceType = [];
$scope.newProfile.deviceDef = [];
$scope.newProfile.deviceValue = [];
$scope.registeredPropertyData = [];
$scope.myproperty = function(deviceIdselected,index){
var arr = [];
var propDef = [];
$scope.objectfind = $filter('filter')($scope.grpdevicesinformation.deviceids,{id:deviceIdselected});

  
   $scope.registeredPropertyData[index] = $scope.objectfind[0].regproperties;
   
  for(var i=0; i<$scope.registeredPropertyData[index].length;i++){
   	var yash = [];
   	for(var j=0; j<$scope.registeredPropertyData[index][i].properties.length;j++){
   		for(var k=0;k<$scope.registeredPropertyData[index][i].properties[j].operations.length;k++){

   			if($scope.registeredPropertyData[index][i].properties[j].operations[k] == 'post'){

   				var json = {"propertyName":$scope.registeredPropertyData[index][i].properties[j].propertyName};
   				yash.push(json);
   			}
   		}
   	}
   	if(yash.length > 0)
   	{
   		arr.push({"name":$scope.registeredPropertyData[index][i].definitionName,"properties":yash});
   	}
   }
   $scope.propertyPost = arr;
   return $scope.propertyPost;
   
}
$scope.onValueChange=function(defname,changePropValue,pname)
{	
	$scope.postProp=pname;
  if(changedValueArr.length>0)
  {
  var flag = false;
  angular.forEach(changedValueArr, function(value, key){

  	angular.forEach(value,function(valueJson,keyJson)
  	{
      if(keyJson==defname+"-"+pname )
      {
         value[keyJson]=changePropValue;
         flag=true;
         return false;
     }

 })

  })
  if(flag==false)
  {
            var j={}
            j[defname+"-"+pname]=changePropValue;
changedValueArr.push(j);

}
}
else
{
   
   var jObj={};
   jObj[defname+"-"+pname]=changePropValue;
    //jObj["value"]
    changedValueArr.push(jObj)
    
    $scope.changedValueArr=changedValueArr;
    //$scope.changePropValue=sliderValue;
}
return $scope.changedValueArr;
};

$scope.getDaydata = function(action){
	var days ={};
	if(action.dow!=null){
	if(action.dow.indexOf('sunday')!=-1){
		days['0']=true
	}if(action.dow.indexOf('monday')!=-1){
		days['1']=true
	}if(action.dow.indexOf('tuesday')!=-1){
		days['2']=true
	}if(action.dow.indexOf('wednesday')!=-1){
		days['3']=true
	}if(action.dow.indexOf('thursday')!=-1){
		days['4']=true
	}if(action.dow.indexOf('friday')!=-1){
		days['5']=true
	}if(action.dow.indexOf('saturday')!=-1){
		days['6']=true
	}
}
	action.dow = days
}
$scope.searchData;
$scope.searchFunction = function(datass) {
   
  if($scope.searchData !=null || $scope.searchData !=undefined){
  	if($scope.editingFlag.length==0){
  		var result = {};
  		result['deviceName'] =$scope.searchData
  		return result;
  	}else{
  		var result = {};
  		result['deviceid'] =$scope.searchData
  		return result;
  	}
  }
}

$scope.getTypeoftheProperty = function(deviceIdselected,propertyName,index){
	var getTypeProperty;
	changedValueArr =[];
	var arr =[];
	var temp = [];
	getTypeProperty = $filter('filter')($scope.grpdevicesinformation.deviceids,{id:deviceIdselected});

	if(getTypeProperty[0].regproperties != undefined){
	for(var x=0; x<$scope.propertyPost.length;x++){
	if(propertyName == $scope.propertyPost[x].name){
			if($scope.propertyPost[x].hasOwnProperty("properties")){
				for(var z=0;z<$scope.propertyPost[x].properties.length;z++){


							for(var i=0;i<getTypeProperty[0].regproperties.length;i++){
								for(var j=0;j<getTypeProperty[0].regproperties[i].properties.length;j++){


									for(var k=0; k<getTypeProperty[0].regproperties[i].properties[j].operations.length;k++){

				if($scope.propertyPost[x].properties[z].propertyName == getTypeProperty[0].regproperties[i].properties[j].propertyName && getTypeProperty[0].regproperties[i].properties[j].operations[k] == 'post'){
					var json = {};
					json["name"] = getTypeProperty[0].regproperties[i].properties[j].propertyName;
						if(getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("type")){
							json["type"] = getTypeProperty[0].regproperties[i].properties[j].type;
						}
						if(getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("enum")){
							json["enum"] = getTypeProperty[0].regproperties[i].properties[j].enum;
						}if(getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("minimum")){
							json["minimum"] = getTypeProperty[0].regproperties[i].properties[j].minimum;
						}if(getTypeProperty[0].regproperties[i].properties[j].hasOwnProperty("maximum")){
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
		if($scope.dataDevicePropertyType[0] != undefined)
		{

			return $scope.dataDevicePropertyType;
		}
		
	}
}


$scope.addType = function(){
	if($scope.profileInfo!=undefined){
	for(var j=0;j<$scope.profileInfo.actions.length;j++){
			for(var i=0;i<$scope.profileInfo.actions[j].properties.length;i++){
	$scope.myproperty($scope.profileInfo.actions[j].deviceid,j)
	var arr = $scope.getTypeoftheProperty($scope.profileInfo.actions[j].deviceid,$scope.profileInfo.actions[j].definitionname,j)
	$scope.profileInfo.actions[j].properties[i].types = arr[i]
}
}
}
}
$scope.addType()




$scope.removeDevice1 = function(index){
	$scope.profileInfo.actions.splice(index, 1);
}


$scope.removeDevice = function(index){
	$scope.addnewdeviceData = false;
	$scope.newProfileArray.splice(index, 1);
}

$scope.openByForceSombabu = function(){
	var modelInstance = $uibModal.open({
		animation: true,
		backdrop  : 'static',
		ariaLabelledBy:'modal-title',
		ariaDescribedBy:'modal-body',
		templateUrl:'modalDeviceGroupActionProfile.html',
		controller: 'deviceGroupActionProfileCtrl',
		windowClass: 'app-modal-window',
		resolve:{
			param: function(){
				return {'gatewayid':$scope.gatewayId,'deviceGroupId' :$scope.deviceGroupId,'gateway':$scope.gatewayInfo};
			}
		}

	});
	return false;
};
$scope.clearEditProfileModal = function(){
	$uibModalInstance.close();
	$scope.grpactionDayArray = [];
	$scope.openByForceSombabu();
}


    $scope.saveProfile = function(profileId, newProfileArray, profileInfoActions, grpname, grpdesc, grpschedfreq, grpschedtime, processby) {
        var saveflag = false

        if (processby.hasOwnProperty('id')) {
            processby = processby.id
        }

        var deviceAppid;
        var z = 1;
        var actionProfileId;
        $scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));
        devicegrpid = $scope.grpdevicesinformation.id;
        if(grpschedfreq !='once'){
        var a = JSON.stringify(grpschedtime)
        var b = a.substr(1, a.length - 2)
      
        var str = b.split("T")
       
        grpschedtime = str[1]
    }
    
        actionProfileId = $scope.profileInfoId;
        deviceGatewayId = $scope.gatewayId;
        var jsondata;
        $scope.devArr = [];
        $scope.devArrUpdate = []

 if($scope.dataDevicePropertyType !=undefined && $scope.changedValueArr!=undefined && newProfileArray!=[]){
saveflag = true
	for(var i in newProfileArray){
		var propertiesArr=[];
		for(var j=0;j<newProfileArray[i].deviceType.length;j++){

			for(var k=0;k<newProfileArray[i].deviceValue.length;k++){



if(newProfileArray[i].deviceName+"-"+newProfileArray[i].deviceType[j].name== Object.keys(newProfileArray[i].deviceValue[k])){
 			var json={};


 			json[newProfileArray[i].deviceType[j].name] = newProfileArray[i].deviceValue[k][newProfileArray[i].deviceName+"-"+newProfileArray[i].deviceType[j].name];

 			json["types"] = newProfileArray[i].deviceType[j];


  if(json[newProfileArray[i].deviceType[j].name] !=undefined ||json[newProfileArray[i].deviceType[j].name]!='' ){
  var value;
  var key = newProfileArray[i].deviceType[j].name;
  if(json.types.type=="number" || json.types.type == "integer") {
  	value = parseInt(json[key]);

  } else if(json.types.type == "float") {
  	value = parseFloat(json[key]);
  } else if(json.types.type == 'boolean') {
  	value = eval(json[key]);
  }else {
  	value = json[key];
  }
  json[key] = value
 
  propertiesArr.push(json);
}
	
	$scope.objectfind = $filter('filter')($scope.grpdevicesinformation.deviceids,{id:newProfileArray[i].deviceName});

                            deviceAppid = $scope.objectfind[0].appid;

                            if (grpschedfreq == 'weekly') {
                                jsondata = { "gwid": deviceGatewayId, "deviceid": newProfileArray[i].deviceName, "definitionname": newProfileArray[i].deviceDef, "scheduledat": grpschedtime, "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": propertiesArr, "dow": $scope.grpactionDayArray, "processedby": processby };

                            } else {
                                jsondata = { "gwid": deviceGatewayId, "deviceid": newProfileArray[i].deviceName, "definitionname": newProfileArray[i].deviceDef, "scheduledat": grpschedtime, "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": propertiesArr, "processedby": processby };
                            }


	
}

}
}
$scope.devArr.push(jsondata);

}


}else{
	if(actionProfileId ==undefined){
	$timeout(function(){
		toaster.pop("error","","aaaaaaa Please provide all inputs")
	})
}
}

 	for(var i in profileInfoActions){
 			editflag = true
 		
	for(var j=0;j<profileInfoActions[i].properties.length;j++){
		if($scope.changedValueArr!=undefined){

	 		for(var k=0;k<$scope.changedValueArr.length;k++){
	 			angular.forEach($scope.changedValueArr[k], function(values, key){
	 				if(key == profileInfoActions[i].deviceid+"-"+profileInfoActions[i].properties[j].types.name){

	 					var value;

	 					if(profileInfoActions[i].properties[j].types.type=="number" || profileInfoActions[i].properties[j].types.type== "integer") {
	 						value = parseInt(values);
	 					} else if(profileInfoActions[i].properties[j].types.type == "float") {
	 						value = parseFloat(values);
	 					} else if(profileInfoActions[i].properties[j].types.type == 'boolean') {
	 						value = eval(values);
	 					}else {
	 						value = values;
	 					}
	 					profileInfoActions[i].properties[j][profileInfoActions[i].properties[j].types.name] =value ; 
		
}
});
	 		}
	 	}
	 }
	




            $scope.objectfind = $filter('filter')($scope.grpdevicesinformation.deviceids, { id: profileInfoActions[i].deviceid });

            deviceAppid = $scope.objectfind[0].appid;
            actionProfileId = profileInfoActions[i].id
            if (grpschedfreq == 'weekly') {

                jsondata = { "gwid": deviceGatewayId, "id": profileInfoActions[i].id, "deviceid": profileInfoActions[i].deviceid, "definitionname": profileInfoActions[i].definitionname, "scheduledat": grpschedtime, "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": profileInfoActions[i].properties, "dow": $scope.grpactionDayArray, "processedby": processby };
            } else {
                jsondata = { "gwid": deviceGatewayId, "id": profileInfoActions[i].id, "deviceid": profileInfoActions[i].deviceid, "definitionname": profileInfoActions[i].definitionname, "scheduledat":grpschedtime, "frequency": grpschedfreq, "protocol": $scope.objectfind[0].protocol, "orgid": $scope.orgid, "properties": profileInfoActions[i].properties, "processedby": processby };
            }

if(jsondata!=null){
	$scope.devArr.push(jsondata);
}
}

if(grpname==undefined|| grpdesc==undefined||grpschedfreq==undefined||grpschedtime==undefined ||processby==undefined){
$timeout(function(){
		toaster.pop("error","","lastttt  Please provide all inputs")
	})
 
}else{
  if($scope.profileInfo == null || $scope.profileInfo == undefined){
  	if(saveflag==true){
		for(var i = 0;i<$scope.devArr.length;i++){
			for(var j=0;j<$scope.devArr[i].properties.length;j++){
				delete $scope.devArr[i].properties[j]["types"]
				delete $scope.devArr[i].properties[j]["$$hashKey"]
			}
		}
	deviceModuleService.postActionProfiles(devicegrpid,deviceAppid,grpname,grpdesc,$scope.devArr,$scope.orgid,processby).then(function (data) {
		$scope.dataLoading = true;
		$scope.processedBy = ''	
		$scope.grpactionDayArray = [];
		if(data.message == "Success")
			{	 $scope.addnewdeviceData = false;
				toaster.pop('success','',"Profile Created Successfully");
				$scope.dataLoading = false;	
				$uibModalInstance.close();
				$rootScope.$broadcast('devicesListbroadcast');
				$state.reload();
				$scope.openByForceSombabu();				
			}else{

				if(data.data.error != undefined && data.data.error.non_field_errors != undefined){
					toaster.pop('error','',"The fields property, deviceid, scheduledat must make a unique set.");
					$scope.dataLoading = false;
				}else{
					toaster.pop('error','',data.data.message);
					$scope.dataLoading = false;
				}


			}


		});
	saveflag = false
}


}
else
{
		for(var i = 0;i<$scope.devArr.length;i++){
			for(var j=0;j<$scope.devArr[i].properties.length;j++){
				delete $scope.devArr[i].properties[j]["types"]
				delete $scope.devArr[i].properties[j]["$$hashKey"]
			}
		}
											//devicegrpid,deviceAppid,deviceGatewayId,deviceChannelId,grpname,grpdesc,devArr,$scope.orgid
											deviceModuleService.putActionProfiles(profileId,devicegrpid,deviceAppid,grpname,grpdesc,$scope.devArr,processby).then(function (data) {
												$scope.grpactionDayArray = [];
												$scope.dataLoading = true;
												$scope.processedBy = ''	
												if(data.message == "Success")
												{
													toaster.pop('success','',"Profile Edited Successfully");
													$scope.dataLoading = false;	
													$uibModalInstance.close();
													$rootScope.$broadcast('devicesListbroadcast');
													$state.reload();
													$scope.openByForceSombabu();
												}else{
		if(data.data.error != undefined && data.data.error.non_field_errors != undefined){
			toaster.pop('error','',"The fields property, deviceid, scheduledat must make a unique set.");
			$scope.dataLoading = false;
		}else{
			toaster.pop('error','',data.data.message);
			$scope.dataLoading = false;
		}
		
		
	}

});
											
										
		}							
										
										
}
										

									};








})



deviceModule.controller('deviceGroupActionProfileCtrl',function($scope,$rootScope,deviceModuleService,ENV, $cookieStore,$location,$filter,$timeout, $window, $uibModalInstance,$mdToast,$state,toaster,CustomMessages,param,$uibModal){



	$rootScope.globals = $cookieStore.get('globals') || {};
if (!$rootScope.globals.currentUser) {
$location.path('/login');
} else {
	$scope.username = $rootScope.globals.currentUser.username;
	$scope.orgid = $rootScope.globals.currentUser.orgid;
	

} 

 $scope.deviceGroupId = param.deviceGroupId;
 $scope.grpid = param.deviceGroupId.id
 $scope.gatewayid = param.gatewayid
$scope.gatewayInfo =param.gateway

 $scope.grpdevicesinformation = JSON.parse(localStorage.getItem('grpdeviceinfo'));


$scope.$on("devicesListbroadcast",function(){
	$scope.getGroupActions(1);
});



$scope.getGroupActions = function(pageno,param){



 profilename=$scope.grpdevicesinformation.name
$scope.deviceActionList = [];
$scope.currentDevicePage = pageno;
$scope.devicePerPage = ENV.recordPerPage;
$scope.dataLoading = true;

deviceModuleService.getActionProfile(pageno,$scope.grpid,$scope.gatewayid).then(function(data) {

	$timeout(function(){

		if(data.Data != undefined){

			$scope.deviceActionList = data.Data;
		
$scope.dataDeviceLoading = false;
$scope.totalItems = data.total_records;
}else{
	$scope.totalItems = 0;
	"No Records Found"
}

$scope.selectedRow = null;
$scope.setClickedRow = function(index,device){
	
	$scope.selectedRow = index;
	$scope.selectedRowDevice = device;

if(device.Selected == true)
{
	device.Selected=false;
}else{
	device.Selected=true;
}
};

$scope.checkAllDevice = function (selectedAllDevice) {

	$scope.selectedAllDevice = selectedAllDevice;
	if ($scope.selectedAllDevice) {
		$scope.selectedAllDevice = true;
	} else {
		$scope.selectedAllDevice = false;
	}

	angular.forEach($scope.deviceActionList, function (device) {
		device.Selected = $scope.selectedAllDevice;
	});



};

$scope.pageChanged = function(){

$scope.getGroupActions($scope.currentDevicePage,$scope.params);	
};

$scope.checkStatus= function(device) {

	device.Selected = !device.Selected;
};
});
	$scope.dataLoading = false;		
}).catch(function(error){
	$scope.totalItems = 0;
	$scope.dataDeviceLoading = false;
	$scope.dataLoading = false;		 
});	
};

$scope.tags=[];

    $scope.getGroupActions(1, $scope.params);
 $scope.returnTime1 = function(datetime,frequency) {
        	//alert("hello"+frequency)
            if(frequency!='once'){
            var date1 = new Date()
            var a = JSON.stringify(date1.toISOString())
            var b = a.substr(1, a.length - 2)
          //  console.log(b)
            var str = b.split("T")
            var x = str[0] + "T" + datetime
            var dat = new Date(x)
            var temp = new Date($filter('date')(dat, "MM/dd/yyyy HH:mm:ss"));
            //(typeof temp);
            return temp;
        }else{
            var date1 = new Date(datetime);
    return  $filter('date')(date1,"MM/dd/yyyy HH:mm:ss");
        }
        };



    $scope.deleteProfile = function(profId) {



        deviceModuleService.deleteActionProfile(profId).then(function(data) {


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


$scope.profileDevices = function(profId){
	 if($uibModalInstance != undefined){
		 $uibModalInstance.close();
	 }
	
	var modelInstance = $uibModal.open({
		animation: true,
		backdrop  : 'static',
		ariaLabelledBy: 'modal-title',
		ariaDescribedBy: 'modal-body',
		templateUrl: 'modalEditProfile.html',
		controller: 'EditprofileCtrl',
		windowClass: 'app-modal-window',
		resolve: {
			param: function () {
				return {'profileInfo':profId,'gatewayId':$scope.gatewayid,'gateway':$scope.gatewayInfo,'deviceGroupId':$scope.deviceGroupId}; }
			}     
		});

}


$scope.clearGrpActnProfile = function(){
	$uibModalInstance.close();
}


$scope.triggerNow = function(prof){

	$scope.AppId = param.deviceGroupId
	for(var j in $scope.AppId.deviceids)
	{
		$scope.foundAppId =  $scope.AppId.deviceids[j].appid
     
  }


        
        tprofileID = prof.id;
        tdevicegrpid = prof.devicegroupid;
        tdeviceAppid = $scope.foundAppId
        tdeviceGatewayId = prof.actions[0].gwid
        tgrpname = prof.name
        processby = prof.processedby
        tgrpdesc = prof.description
        tdevArr = tArr
        processby = prof.processedby

        torgid = $scope.orgid
var now_utc;

        var tArr = []
        for (var i in prof.actions) {
            var value;
             var now = new Date();
       
        now_utc = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 2, now.getSeconds());
if(prof.actions[i].frequency !='once'){

        var a = JSON.stringify(now_utc)
        var b = a.substr(1, a.length - 2)
       
        var str = b.split("T")
        now_utc = str[1]
     }
            for (var j = 0; j < prof.actions[i].properties.length; j++) {

                if (prof.actions[i].frequency == 'weekly') {
                    tArr.push({ "id": prof.actions[i].id, "gwid": prof.actions[i].gwid, "deviceid": prof.actions[i].deviceid, "definitionname": prof.actions[i].definitionname, "properties": prof.actions[i].properties, "scheduledat": now_utc, "frequency": prof.actions[i].frequency, "protocol": prof.actions[i].protocol, "orgid": prof.actions[i].orgid, "dow": prof.actions[i].dow, "processedby": processby })
                } else {
                    tArr.push({ "id": prof.actions[i].id, "gwid": prof.actions[i].gwid, "deviceid": prof.actions[i].deviceid, "definitionname": prof.actions[i].definitionname, "properties": prof.actions[i].properties, "scheduledat": now_utc, "frequency": prof.actions[i].frequency, "protocol": prof.actions[i].protocol, "orgid": prof.actions[i].orgid, "processedby": processby })
                }
            }
           
        }

tdevArr= tArr
//processby= prof.processedby

torgid=$scope.orgid




deviceModuleService.putActionProfiles(tprofileID,tdevicegrpid,tdeviceAppid,tgrpname,tgrpdesc,tdevArr,processby).then(function (data) {
	$scope.dataLoading = true;
	if(data.message == "Success"){
		toaster.pop('success','',data.message);

		$scope.dataLoading = false;	
		$scope.getGroupActions(1,$scope.params);	

	}else{
		toaster.pop('error','',data.message);
		$scope.dataLoading = false;
	}

});


}


});





deviceModule.controller('vendorSelectionCtrl', function ($http,$scope, $rootScope,ENV,deviceModuleService,gatewayModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $uibModal,$state,toaster,CustomMessages,AclService,$mdDialog, imageConstant,dsparam,$uibModalInstance) {

	$rootScope.globals = $cookieStore.get('globals') || {};
	if (!$rootScope.globals.currentUser) {
	$location.path('/login');
	} else {
		$scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		
	}
	$scope.setDeviceVendorLoading=false;
	$scope.gatewayId =  dsparam.gatewayid;					
						
	
	$scope.selectedRowDevice = dsparam.deviceInformation;
	$scope.deviceId = $scope.selectedRowDevice.id;
	$scope.clearVendorSelection = function(){
		$uibModalInstance.close();
	};


	$scope.getVendorList = function(){
		var data4DeviceObject = 'xml';
		var data4DeviceStatus = {"fields":"vendor","orgid":$scope.orgid,"protocol":$scope.selectedRowDevice.protocol};
		deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
			$scope.getDisplayVendorModelID = data.Data;
		});
	}

	$scope.getVendorList();
	$scope.getDisplayModelID = [];
	$scope.funcGetModelid = function(vendor,index){
		if($scope.getDisplayModelID[index] == undefined){
			$scope.getDisplayModelID[index] = {};
		}
		$scope.getDisplayModelID[index].data = [];
		var data4DeviceObject = 'xml';
		var data4DeviceStatus = {"fields":"modelid,devicename","vendor":vendor};

		deviceModuleService.getVendorModelIDForModbus(data4DeviceObject,data4DeviceStatus).then(function(data){
			$scope.getDisplayModelID[index].data = data.Data;
		});	



	};

	$scope.setDeviceVendorinfo = function(vendor,modelid,deviceid,appid){
		$scope.setDeviceVendorLoading=true;
		$rootScope.mqttSubscribe($scope.gatewayId,1000);
		var SocketCollection = [];
		deviceModuleService.setVendorModelDeviceinfo(vendor,modelid,deviceid,appid).then(function(data){
			$scope.jobid = data.data.Data.JOBID;
			$scope.gwid = data.data.Data.CLIENTID;
			$scope.$on("mqtt_message",function(e,a){

				
				if(a.responsecode==200){
				$scope.setDeviceVendorLoading=false;
					
				}
				else{
					$scope.setDeviceVendorLoading=false;
				}
			});
		
							});
	};
	

});

/*END DEVICE PROPERTY*/