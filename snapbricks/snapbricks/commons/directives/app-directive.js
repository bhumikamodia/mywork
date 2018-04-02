'use strict';
// factory for websocket data

 
myApp.factory('WebMqtt', function($rootScope,ENV,$timeout,$interval,$cookieStore,$location,toaster) {
    
	
 $rootScope.globals = $cookieStore.get('globals') || {};
if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
      
    } 
	
$rootScope.flag=false;
var client;

client = new Paho.MQTT.Client(ENV.apimqttConnectionUrl, ENV.apimqttConnectionPort,"/ws", "myclientid_" + parseInt(Math.random() * 100, 10));
  //console.log("client id :: " +"myclientid_" + parseInt(Math.random() * 100, 10))
  var options = {
    useSSL: false,
    userName: "iotuser",
    password: "ei12@",
    onSuccess:onConnect,
    onFailure:doFail
  }

  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.disconnect = onDisconnect;

  function onDisconnect(){
      $rootScope.flag = true
  //  console.log("disconnect")
    toaster.pop('error','', " WebMqtt Disconnected.");
    client.connect(options);
   // console.log("on Disconnected:"+client.isConnected());
  //  $rootScope.mqttSubscribe($rootScope.mqttGatewayId,50)

  }

  
  if(!client.isConnected()){
    client.connect(options);
  }
  
  function onConnect() {
  //  console.log("client iss  ",client)
    toaster.pop('wait','', " WebMqtt Connected.");
    if($rootScope.flag == true)
      $rootScope.mqttSubscribe($rootScope.mqttGatewayId,50)
   	 $rootScope.flag = false
  }

  function doFail(e){
     
    console.log("fail",e);
	if(!client.isConnected()){
		 client.connect(options);
	}
   //  console.log("fail:"+client.isConnected());
     
  }
  function onConnectionLost(responseObject) {
    $rootScope.flag = true
    console.log("onConnectionLost:"+responseObject.errorCode);
    if (responseObject.errorCode != 0) {
    //  console.log("in if",options)
     //toaster.pop('error','',responseObject.errorMessage);
     client.connect(options);
    // console.log("onConnectionLost:"+client.isConnected(),localStorage.getItem('mqtt_topic'));
     
   }


 }
function onMessageArrived(message) {
  try{
    message = JSON.parse(message.payloadString)}
    
    catch(e){
    }
    var msgArray=['Package installing','All Apps Details'];
	//console.log("message arriveddddddddddddd route",JSON.stringify(message));
    //collection.push(message.payloadString);
    if(message.data !=undefined){
     $timeout(function(){
      $rootScope.$broadcast('mqtt_message',message.data);
	  if(message.data.JOBID=="Notifications"){
        $rootScope.$broadcast('notification_mqtt',message.data);
      }
      if(msgArray.indexOf(message.data.consumer_message) ==-1){

       if(message.data.data != null && message.data.data.responsecode==200){
        if(message.data.consumer_message != undefined){
        toaster.pop('success','',""+message.data.consumer_message);
        }else{
          toaster.pop('success','',""+message.data.data.consumer_message);
        } 
     }else if(message.data.data != null && message.data.data.responsecode==400){
          if(message.data.consumer_message != undefined){
        toaster.pop('error','',""+message.data.consumer_message);
      }else{
        toaster.pop('error','',""+message.data.data.consumer_message);
      }
      }else if(message.data.responsecode==200){
       
        toaster.pop('success','',""+message.data.consumer_message);
      }else if(message.data.responsecode==400){
        toaster.pop('error','',""+message.data.consumer_message);
      }
    }

  },1000);
   }else if(message!=undefined){
     $timeout(function(){
      $rootScope.$broadcast('mqtt_message',message);
      if(msgArray.indexOf(message.consumer_message) ==-1){

       if(message.data != null && message.data.responsecode==200){
        if(message.consumer_message != undefined){
        toaster.pop('success','',""+message.consumer_message);
        }else{
          toaster.pop('success','',""+message.data.consumer_message);
        } 
     }else if(message.data != null && message.data.responsecode==400){
          if(message.consumer_message != undefined){
        toaster.pop('error','',""+message.consumer_message);
      }else{
        toaster.pop('error','',""+message.data.consumer_message);
      }
      }else if(message.responsecode==200){
       
        toaster.pop('success','',""+message.consumer_message);
      }else if(message.responsecode==400){
        toaster.pop('error','',""+message.consumer_message);
      }
    }

  },1000);
   }
 }
 $rootScope.mqttSubscribe = function(gatewayData,tTime){
  $rootScope.mqttGatewayId = gatewayData;
  //console.log($rootScope.mqttGatewayId)
  //localStorage.setItem('mqtt_topic',gatewayData)
  $timeout(function() {
	 
	if(client.isConnected())
	{
		client.subscribe(gatewayData+"/#",{qos:1,onFailure:doFail})
		toaster.pop('wait','', " WebMqtt subscribed.");
		$rootScope.clientCall = client;
	}
  // console.log("topic is: ",gatewayData+"/#")
  
 }, tTime);
  

}
 $rootScope.mqttUnsubscribe = function(gatewayData){
  $rootScope.mqttGatewayId = gatewayData
  //console.log($rootScope.mqttGatewayId)
  //localStorage.setItem('mqtt_topic',gatewayData)
  
   toaster.pop('info','', " WebMqtt unsubscribed.");

  // console.log("topic is: ",gatewayData+"/#")
   client.unsubscribe($rootScope.mqttGatewayId+"/#")
  
  
 
  

}
$rootScope.$watch(function() {
  return $location.path();
},
function(a){  
     //console.log('url has changed: ' + a);
     if($rootScope.mqttGatewayId != undefined && client.isConnected()){
       //alert("hellooooooo"+JSON.stringify(client)+"   "+client.isConnected())
       client.unsubscribe($rootScope.mqttGatewayId+"/#");
     }

   }
   )
   return 0;
});
myApp.directive('disallowSpaces', function() {
  return {
    restrict: 'A',

    link: function($scope, $element) {
      $element.bind('input', function() {
        $(this).val($(this).val().replace(/ /g, ''));
      });
    }
  };
});
			
  myApp.directive('datetimepickerNeutralTimezone', function() {
    return {
      restrict: 'A',
      priority: 1,
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$formatters.push(function (value) {
          var date = new Date(Date.parse(value));
          date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()));
          return date;
        });

        // ctrl.$parsers.push(function (value) {
        //   var date = new Date(value.getTime() - (60000 * value.getTimezoneOffset()));
        //   return date;
        // });
      }
    };
  });


myApp.directive('exportExcel',function(){
		// console.log("%%%%%%%%%%%%%%%%")
  	return {
	restrict: 'A',
    	link: function (scope, element, attrs) {
			//console.log(attrs);
			//console.log(scope);
			
    		var el = element[0];
	        element.bind('click', function(e){
				var attrname = attrs.attrname;
				var attrpageno = attrs.attrpageno;
	        	//var table = e.target.nextElementSibling;
	        	var table = document.getElementById(attrname)
	        	var xlsString;
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length;j++){
	        		//xlsString = xlsString + rowData[j].innerText + ",";
	        		
	        		var hasComma = rowData[j].innerText
	        	//	console.log(hasComma);
	                var expr = ",";
	        		if((hasComma).match(expr))
	        		{
	        		//	console.log("True")
	        			xlsString = xlsString + hasComma.replace(/,/g, "_")+ ",";
	        		}
	        		else
	        		{
	        			//console.log("False")
	        		    xlsString = xlsString + rowData[j].innerText + ",";	
	        		}
	        		

	        	    // console.log("#########"+rowData[j].innerText);		
	        		}
	                xlsString = xlsString.substring(0,xlsString.length - 1)+ "\n";
	                //xlsString = xlsString + "\n";
			    }

				var filename = attrname+"_page_"+attrpageno+".xls";
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(xlsString),
		            download:filename
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
        
     }
  	
  	});
myApp.directive('exportCsv',function(){
		// console.log("%%%%%%%%%%%%%%%%")
  	return {
	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
				var attrname = attrs.attrname;
				var attrpageno = attrs.attrpageno;
	        	//var table = e.target.nextElementSibling;
	        	var table = document.getElementById(attrname)
	        	var csvString;
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length;j++){
	        		//csvString = csvString + rowData[j].innerText + ",";
	        		
	        		var hasComma = rowData[j].innerText
	        	//	console.log(hasComma);
	                var expr = ",";
	        		if((hasComma).match(expr))
	        		{
	        		//	console.log("True")
	        			csvString = csvString + hasComma.replace(/,/g, "_")+ ",";
	        		}
	        		else
	        		{
	        		//	console.log("False")
	        		    csvString = csvString + rowData[j].innerText + ",";	
	        		}
	        		

	        	    // console.log("#########"+rowData[j].innerText);		
	        		}
	                csvString = csvString.substring(0,csvString.length - 1)+ "\n";
	                //csvString = csvString + "\n";
			    }

				var filename = attrname+"_page_"+attrpageno+".csv";
				
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:filename
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
        
     }
  	
  	});
	
myApp.directive('backButton', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);
 myApp.directive('nodeTree', function () {
        
		return {
            template: '<node ng-repeat="node in tree"></node>',
            replace: true,
            restrict: 'EA',
            scope: {
                tree: '=children',
				page: '='
            }
        };
    });
    myApp.directive('node', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'commons/files/node.html', // HTML for a single node.
            link: function (scope, element,attrs) {
                /*
                 * Here we are checking that if current node has children then compiling/rendering children.
                 * */
                if (scope.node && scope.node.permissions && scope.node.permissions.length > 0) {
                    scope.node.childrenVisibility = true;
                    var childNode = $compile('<ul class="tree" ng-if="!node.childrenVisibility"><node-tree children="node.permissions"></node-tree></ul>')(scope);
                    element.append(childNode);
                } else {
                    scope.node.childrenVisibility = false;
                }
				 if(attrs.page=="addUser")
                {

                	scope.page=true;
                	//console.log("###",scope.page);
                }
            },
            controller: ["$scope", function ($scope) {
                // This function is for just toggle the visibility of children
                $scope.toggleVisibility = function (node) {
                    if (node.permissions) {
                        node.childrenVisibility = !node.childrenVisibility;
                    }
                };

                // Here We are marking check/un-check all the nodes.
                $scope.checkNode = function (node) {
                    node.checked = !node.checked;
                    function checkChildren(c) {
                        angular.forEach(c.permissions, function (c) {
                            c.checked = node.checked;
                            checkChildren(c);
                        });
                    }

                    checkChildren(node);
                };
            }]
        };
    });
//directive to show image viz, company logo, layout icons, etc. It also fetches image path and file names as per image constants defined
myApp.directive("imageSource", ['imageConstant', function (imageConstant) {

        var linker = function (scope, element, attrs) {
			
            scope.companyLogoHeader =  imageConstant.companyLogoHeader; //company logo small - bel
			scope.LogoHeader = imageConstant.LogoHeader;
			scope.LogoHeaderLogin = imageConstant.LogoHeaderLogin;
        };
        return {
            restrict: "A",
            link: linker
        };
    }]);
				

 
 myApp.filter('utcToLocal', function ($filter) {

       return function (utcDateString, format) {
            // return if input date is null or undefined
            if (!utcDateString) {
                return;
            }

            // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
            if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
                utcDateString += 'Z';
            }

            // convert and format date using the built in angularjs date filter
            return $filter('date')(utcDateString, format);
        };
    });
 
// directive for tr row gateway discover feature	
myApp.directive('trRowGatewayOfflineDiscover', function ($compile,$parse,$rootScope, $timeout,AclService) {

 var linker = function (scope, element, attrs) {
	
	
	
	scope.selectedRow = null;
	scope.setClickedRow = function(index,discover){
		
		scope.selectedRow = index;
		scope.selectedRowDiscover = discover;
		
		
		if(discover.discoverSelected == true)
		{
			discover.discoverSelected=false;
		}else{
			discover.discoverSelected=true;
		}
		
		//console.log(gatewayInfo);
		//console.log($scope.selectedRow);
    
	};
	scope.can = AclService.can;
	scope.checkStatus= function(discover) {
	
		discover.discoverSelected = !discover.discoverSelected;
		
    };
	
	 scope.pageChanged = function(){
		
		if(attrs.optionfield =="'OPC'"){
			
			if(attrs.optionselection =="'online'"){
			
				$rootScope.onlineOPCFunction(scope.currentofflinepage);
			}else{
				$rootScope.offlineOPCFunction(scope.currentofflinepage);
			}		
		}
		if(attrs.optionfield =="'ZIGBEE'"){
			if(attrs.optionselection =="'online'"){
				$rootScope.onlineZIGBEEFunction(scope.currentofflinepage);
			}else{
				$rootScope.offlineZigbeeDiscover(scope.currentofflinepage);	
			}	
		}
		if(attrs.optionfield =="'BLE'"){
			if(attrs.optionselection =="'online'"){
				$rootScope.getResultsPageData(scope.currentofflinepage);
			}else{
				$rootScope.offlineBLEDiscover(scope.currentofflinepage);
			}
		}
		if(attrs.optionfield =="'ZWAVE'"){
			if(attrs.optionselection =="'online'"){
				$rootScope.onlineZWAVEFunction(scope.currentofflinepage);
			}else{
				$rootScope.offlineZWAVEDiscover(scope.currentofflinepage);
			}
		}
			if(attrs.optionfield =="'MQTT'"){
			if(attrs.optionselection =="'online'"){
				$rootScope.getResultsPageData(scope.currentofflinepage);
			}else{
				$rootScope.offlineMQTTDiscover(scope.currentofflinepage);
			}
		}
	};
	 scope.checkAllOffline = function (selectedallofflinemodel) {
		scope.selectedallofflinemodel = selectedallofflinemodel;
        if (scope.selectedallofflinemodel) {
            scope.selectedallofflinemodel = true;
        } else {
            scope.selectedallofflinemodel = false;
        }
        angular.forEach(scope.tabledata, function (discover) {
            discover.discoverSelected = scope.selectedallofflinemodel;
        });

	};
	scope.registerOPCActivateForm = function(gatewayid,tabledata,offline,optionf,period){
		//alert(gatewayid);
		//console.log(tabledata);
		
		$timeout(function (){
		$rootScope.registerOPCActivateForm(gatewayid,tabledata,offline,optionf,period);	
		scope.selectedRow = null;
		scope.selectedRowDiscover = null;
		
		
		});
		
		//scope.setClickedRow(1000,{});
		
	}
	scope.deviceDeactivateAll = function(gatewayid,protocol,status,appName){
		
		$rootScope.deviceDeactivateAll(gatewayid,protocol,status,appName);	
	}
	scope.deviceDeregisterAll = function(gatewayid,protocol,status,appName){
		$rootScope.deviceDeregisterAll(gatewayid,protocol,status,appName);
	}
	scope.getAllRAMLFunc = function(gatewayid,appName,status){
		$rootScope.getAllRAMLFunc(gatewayid,appName,status);
	}
	scope.registerOPCPostForm = function(gatewayid,tabledata,offline,optionf,period){
		//alert(gatewayid);
		//console.log(tabledata);
		//alert(offline);
		//alert(optionf);
		
		$timeout(function (){
		$rootScope.registerOPCPostForm(gatewayid,tabledata,offline,optionf,period);	
		scope.selectedRow = null;
		scope.selectedRowDiscover = null;
		});
		//scope.setClickedRow(1000,{});
		
	}
var template = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-10 table-responsive mr-top10 border0"><table id="total" class="table table-striped" ng-show="(tabledata).length || optionselection==\'offline\'" ><thead><tr>'+
//'<th style="width:4%;"><SPAN class="checkbox checkbox-primary"><input type="checkbox" ng-model="selectedallofflinemodel" ng-click="checkAllOffline(selectedallofflinemodel)"/><label>&nbsp;</label></SPAN> </th>'+
'<th style="width:15%;">Display Name</th>'+
'<th >MACID</th>'+
'<th >AppId</th>'+
'<th >Vendor</th>'+
'<th >Protocol</th>'+
'<th >Status</th>'+
'<th>'+
'<i class="fa fa-filter" data-toggle="modal" data-target="#myModaloffline{{optionselection}}{{optionfield}}" ></i>'+
'<div class="modal fade" id="myModaloffline{{optionselection}}{{optionfield}}" role="dialog">'+
'<div class="modal-dialog mr-top80">'+
'<div class="modal-content black-bg"><div class="modal-header border0"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Filter Discover - under construction</h4></div>'+
'<div class="modal-body"><form class="form-horizontal"><div class="form-group"><label class="control-label col-lg-5" for="dname">On Development </label><div class="col-lg-5">On Development</div>'+
'</div><div class="form-group"><div class="col-sm-offset-5 col-sm-5"><button type="submit" ng-click="searchFeaturesSubmit();" data-dismiss=modal class="btn btn-filter">Apply Filter</button></div>'+
'</div></form></div></div></div></div></th></tr></thead><tbody >'+
'<tr ng-class="{\'selected\':$index == selectedRow}" style="cursor:pointer;" ng-click="setClickedRow($index,discover);" ng-repeat="discover in tabledata | limitTo:limitToData">'+
//'<td><SPAN class="checkbox checkbox-primary"><input type="checkbox"  ng-model="discover.discoverSelected"  ng-change="checkStatus(discover);"  /><label></label></SPAN></td>'+
'<td><a style="cursor:pointer;" ng-click="openDisplayInfo(discover);" class="pointer">{{discover.displayname}}</a></td>'+
'<td><div>{{discover.macid}}</div></td>'+
'<td><div>{{discover.appid}}</div></td>'+
'<td><div>{{discover.vendor}}</div></td>'+
'<td><div>{{discover.protocol}}</div></td>'+
'<td><div>{{discover.device_status}}</div></td>'+
'<td></td>'+
'</tr>'+
'<tr class="alert alert-danger" ng-if="(tabledata.length == 0 || totalitems ==0)"><td colspan="11"><strong>No Record Found.</strong></td></tr>'+
'</tbody></table></div>';
				
	template += '<div id="pagination" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mr-topmin15" ng-show="(tabledata).length"><div class="col-lg-12 blue-bg pad10"><div class="col-lg-9"><uib-pagination  total-items="totalitems" ng-model="currentofflinepage" ng-change="pageChanged()" items-per-page="offlineperpage" max-size="10" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" boundary-links="true" num-pages="numPages"></uib-pagination></div><div class="col-lg-3 text-right">Displaying {{currentofflinepage}} / {{numPages}} of {{numPages}}</div></div></div>';			

	template += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-10 table-responsive mr-top10 border0"><div ng-show="(tabledata).length" >'+
	'<div class="form-group"><button type="button" ng-disabled="(selectedRowDiscover.device_status==\'REGISTER\' || selectedRowDiscover.device_status==\'ACTIVE\' || selectedRowDiscover.device_status==\'DEACTIVE\') && selectedRowDiscover.device_status != \'NEW SENSOR\'" ng-show="can(\'device_register\')" class="btn btn_act" ng-click="registerOPCPostForm(gatewayid,selectedRowDiscover,optionselection,optionfield,\'REGISTER\')" ><i class="fa fa-plus-circle"></i>Register</button> '+
	'<button type="button" ng-disabled="(selectedRowDiscover.device_status != \'REGISTER\' && selectedRowDiscover.device_status != \'DEACTIVE\')" ng-show="can(\'activate_device\')" class="btn btn_act" ng-click="registerOPCActivateForm(gatewayid,selectedRowDiscover,optionselection,optionfield,\'ACTIVATE\');" ><i class="fa fa-check-circle"></i>Activate</button> '+
	'<button type="button" ng-disabled="(selectedRowDiscover.device_status != \'ACTIVE\') || selectedRowDiscover.device_status == \'REGISTER\'" ng-show="can(\'activate_device\')" class="btn btn_act" ng-click="registerOPCActivateForm(gatewayid,selectedRowDiscover,optionselection,optionfield,\'DEACTIVATE\');" style="background-color:#d9534f !important;"><i class="fa fa-ban"></i>Deactivate</button> '+
	'<button type="button" ng-disabled="selectedRowDiscover.device_status == \'NEW SENSOR\' || selectedRowDiscover.device_status == \'UNREGISTER\'" ng-show="can(\'device_register\')" class="btn btn_act" ng-click="registerOPCPostForm(gatewayid,selectedRowDiscover,optionselection,optionfield,\'DEREGISTER\')" style="background-color:#d9534f !important;"><i class="fa fa-trash"></i>Deregister</button> '+
	'<button type="button" ng-if="appname && optionselection==\'online\'" ng-show="can(\'device_register\')"  class="btn btn_act" ng-click="deviceDeregisterAll(gatewayid,optionfield,\'REGISTER\',appname)" style=""><i class="fa fa-plus-circle"></i>Register All</button> '+
	'<button  ng-if="appname && optionselection==\'online\'" ng-show="can(\'activate_device\')" type="button" class="btn btn_act"  ng-click="deviceDeactivateAll(gatewayid,optionfield,\'ACTIVATE\',appname)"><i class="fa fa-check-circle"></i>Activate All</button> '+
	'<button style="background-color:#d9534f !important;" ng-if="appname && optionselection==\'online\'" ng-show="can(\'activate_device\')" type="button" class="btn btn_act" ng-disabled="!gatewayid" ng-show="can(\'activate_device\')" ng-click="deviceDeactivateAll(gatewayid,optionfield,\'DEACTIVATE\',appname);"  ><i class="fa fa-ban"></i>Deactivate All</button> '+
	'<button type="button" ng-if="appname && optionselection==\'online\'" class="btn btn_act"  ng-click="deviceDeregisterAll(gatewayid,optionfield,\'DEREGISTER\',appname)" style="background-color:#d9534f !important;"><i class="fa fa-trash"></i>Deregister All</button> '+
	'<button type="button" ng-disabled="$parent.dataOPCRegisterLoading" ng-if="appname && optionselection==\'online\'" class="btn btn_act"  ng-click="getAllRAMLFunc(gatewayid,appname,\'GETRAML\')"><i class="fa fa-cubes"></i>Get All RAML</button> '+
	'<img ng-if="$parent.dataOPCRegisterLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />'+
	'<img ng-if="$parent.dataOPCActivationLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />'+
	'</div></div></div>';
				element.html(template);
				
				  $compile(element.contents())(scope);
			  
 };
  
  return {
         restrict: 'EA',
		 scope: {
			
            tabledata: '=',
			limitToData: '=',
			totalitems: '=',
			currentofflinepage: '=',
			offlineperpage: '=',
			selectedallofflinemodel: '=',
			gatewayid: '=',
			optionfield: '=',
			appname: '=',
			optionselection: '=',
			index: '@'
			
        },
		replace: true,
         link: linker
    };
 
});

// all data storage for array usage in localstorage
myApp.factory("allDataStorage", function ($window, $rootScope) {

    //  console.log('Factory called');
    angular.element($window).on('storage', function (event) {
        if (event.key === 'permissions') {
            $rootScope.$apply();
        }
    });
    return {
        setData: function (val) {
            $window.localStorage && $window.localStorage.setItem('permissions', JSON.stringify(val));
            return this;
        },
        getData: function () {
            return $window.localStorage && JSON.parse($window.localStorage.getItem('permissions'));
        }
    };
});
//directive for media query jquery script code
myApp.directive("leftsideMediajquery",function(){

 var directive = {
        template : "",
        scope : { 
            save    : "&",
            subject : "="
        },
        link : function ($scope, el, attrs, ctrl) {
			
			
			$("#menu-toggle-3").click(function(e) {
				 
					e.preventDefault();
					$('#toggleLeftSpan1').toggleClass('glyphicon-menu-left glyphicon-menu-hamburger',200);
					$('#toggleLeftSpan2').toggleClass('glyphicon-menu-hamburger glyphicon-menu-right',200);
					$("#wrapper").toggleClass("toggled");
					
					$('#menu ul').hide();
			});
			
			/*$(document).ready(function() 
			{
					
				var mq6 = window.matchMedia("screen and (min-width: 1152px)");
				if (mq6.matches)
				{
					document.getElementById("mySidenav").style.width = "17%";
				//	alert("TEST1");
				}
			
				var mq5 = window.matchMedia("screen and (min-width: 1200px)");
				if (mq5.matches)
				{
					document.getElementById("mySidenav").style.width = "15%";
				//	alert("TEST3");
				}
				var mq8 = window.matchMedia("screen and (min-width: 1280px)");
				if (mq8.matches)
				{
					document.getElementById("mySidenav").style.width = "15%";
				//	alert("TEST2");
				}
				var mq3 = window.matchMedia("screen and (min-width: 1920px)");
				if (mq3.matches)
				{
					document.getElementById("mySidenav").style.width = "12%";
				//	alert("TEST4");
				}
				var mq4 = window.matchMedia("screen and (min-width: 1024px) and (max-width: 1200px) and (orientation:landscape)");
				if (mq4.matches)
				{
					document.getElementById("mySidenav").style.width = "20%";
				//	alert("TEST5");
				}
			});	*/
		}
    };

    return directive;

});

//directive for media query jquery script code
myApp.directive("allscriptCodeDirective", function () {

    var directive = {
        template : "",
        scope : { 
            save    : "&",
            subject : "="
        },
        link : function ($scope, el, attrs, ctrl) {
			
			
				 
				/*$('#menu-toggle-3').click(function(e) {
					e.preventDefault();
					$('#toggleLeftSpan1').toggleClass('glyphicon-menu-left glyphicon-menu-hamburger',200);
					$('#toggleLeftSpan2').toggleClass('glyphicon-menu-hamburger glyphicon-menu-right',200);
					$("#wrapper").toggleClass("toggled-2");
					$('#menu ul').hide();
				});*/
			
          /* $(document).ready(function() 
			{
				var mq6 = window.matchMedia("screen and (min-width: 1152px)");
				if (mq6.matches)
				{
					document.getElementById("main").style.marginLeft = "220px";
					
				}
				
				var mq5 = window.matchMedia("screen and (min-width: 1200px)");
				if (mq5.matches)
				{
					document.getElementById("main").style.marginLeft = "240px";
					
				}
				var mq6 = window.matchMedia("screen and (min-width: 1280px)");
				if (mq6.matches)
				{
					document.getElementById("main").style.marginLeft = "230px";
					
				}
				var mq3 = window.matchMedia("screen and (min-width: 1920px)");
				if (mq3.matches)
				{
					document.getElementById("main").style.marginLeft = "260px";
					//alert("TEST2");
				}
				var mq4 = window.matchMedia("screen and (min-width: 1024px) and (max-width: 1200px) and (orientation:landscape)");
				if (mq4.matches)
				{
					document.getElementById("main").style.marginLeft = "220px";
					
				}
			});*/
			
        }
    };

    return directive;

});
myApp.directive("setHeight", function ($window) {
		return{
			scope: {
			  myheight: '='
			},
			link: function(scope, element, attrs){
				if(scope.myheight != undefined && scope.myheight > 0)
					element.css('height', ($window.innerHeight - parseInt(scope.myheight))+ 'px');				
				else
					element.css('height', ($window.innerHeight - 260)+ 'px');				
			}
		}
});


