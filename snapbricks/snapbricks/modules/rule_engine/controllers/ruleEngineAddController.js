var ruleEngineModule3 = angular.module('ruleEngineModule.controllers');

ruleEngineModule3.controller('ruleengineCreateEditCtrl', function($scope,$q, $rootScope, ruleengineModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, gatewayModuleService,deviceModuleService,$uibModal,toaster,WebMqtt,$mdDialog) {

		
	$scope.nextProcess = function(process) {
        $scope.processPage = process;
    };
	
	if (!$rootScope.globals.currentUser) {
		$location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid =  $rootScope.globals.currentUser.orgid;
    }
	$scope.applyGroups = "Gateways";
	
	$scope.tags = [];
	$scope.rule = {"parent_rule_name":"","parent_rule_desc":'',"rule_name":"",'rule_desc':"","edit_selected_row":-1,"create_block":0,"sel_block":0,'gui_code_flag':0,"parent_appid":""};
	
	$scope.appid = '';
	$scope.viewsessionData = [];
	$scope.selectedRuleEngineData = [];
	$scope.selectGatewaylist =[];
	$scope.meshlist =[];
	$scope.networklist =[];
	$scope.applist =[];
	$scope.showerrormessage ="";
	//======================= Get Device List ==========================================
	$scope.$watch('rule.mode',function(mode){
		//alert(mode);
		if(mode != undefined){
			
			if(mode == 'Standalone'){
				$scope.jsonFormatData = [];
			}else if(mode == 'Mesh'){
				$scope.jsonFormatData = [];
				ruleengineModuleService.getMeshlist().then(function(data){					
					$scope.meshlist =data.Data;		
				});
				$scope.getNetworklist = function(meshid){
					if(meshid != undefined){
								angular.forEach($scope.meshlist,function(value,key){
									if(value.id == meshid)
									{
										$scope.networklist = value.network;	
										$scope.gatewayDisplayName_all = [];
										ruleengineModuleService.getMeshDetailById(meshid).then(function (data) {
										//	console.log(data.Data);
										if(data.Data != undefined){
											$scope.gatewayDisplayName_all = data.Data.Data;
										}
										else{
											$scope.gatewayDisplayName_all = [];
										}
									
									
										if($scope.gatewayDisplayName_all.length >0){
										var arr = JSON.stringify($scope.gatewayDisplayName_all);
										
										var arr2 = JSON.parse(arr);
									
										$scope.jsonFormatData = $scope.gatewayDisplayName_all;	
										}else{
											$scope.jsonFormatData = [];
											$scope.deviceList = [];
											$scope.selectedDevicesList = [];
											
											$scope.tags = [];
											$scope.rule.parent_gwid = "";
										}			
												
											
								});
				
									}
								});
								if($scope.rule.parent_appid != undefined){
								$scope.getprocessbylist($scope.rule.parent_appid);
								}
													
					}
					
				};
				$scope.getapplist = function(){
					//$scope.rule.parent_appid ="";
				}
				$scope.getprocessbylist = function(appname){
					if(appname != "" && $scope.rule.networkid != undefined)
					{ 
					
					$scope.selectGatewaylist= [];
					ruleengineModuleService.getProcessbylist($scope.rule.meshid,$scope.rule.networkid,appname,$scope.rule.mode).then(function(data){
						//console.log(data);			
						$scope.selectGatewaylist =data.Data;			
					});
					
						
						
					}
				}
				
			}
		}
		
	});
	
	$scope.getselectedGWID = function(parent_gwid){
		//alert(parent_gwid);
		$scope.jsonFormatData = [];
		if(parent_gwid != undefined){
			ruleengineModuleService.getGatewayFromId(parent_gwid).then(function(data){
				$scope.jsonFormatData.push(data.Data);
								
			});
		}
	}
	$scope.funcDataGroup = function(dataGroup,appname){
		if(dataGroup == 'Standalone'){
				$scope.rule.meshid = '';
				$scope.rule.networkid = '';
				$scope.selectGatewaylist= [];
				ruleengineModuleService.getProcessbylist('','',appname,$scope.rule.mode).then(function(data){
					//console.log(data);			
					$scope.selectGatewaylist =data.Data;			
				});
				
		}
	}
	$scope.getDataDevice = function(pageno,params){
		$scope.deviceList = [];
		$scope.currentRuleEnginePage = pageno;
		$scope.ruleEnginePerPage = ENV.recordPerPage;
		$scope.dataRuleEngineLoading = true;
		$scope.sessionAddRules = [];
		$scope.OperatorsArr =['==','>','<','<>','>=','<='];
		deviceModuleService.getDeviceList(pageno,params).then(function (data) {
			
				$timeout(function(){
				if(data.Data != undefined){
						$scope.deviceList = data.Data;
						$scope.dataRuleEngineLoading = false;
						$scope.totaldevices = data.total_records;
				}else{
						$scope.totaldevices = 0;
						$scope.dataRuleEngineLoading = false;
				}
				
				});
		
			});		
	};
	$scope.completeGetGateway = function(gatewayId){
		
		$scope.params = {"g_id":gatewayId,"d_device_status":'ACTIVE',"propertystatus":'Active'};
			 $scope.getDataDevice(1, $scope.params);
		/*$( "#gateway" ).autocomplete({
		appendTo: "#myModalGroups",    // <-- do this
		open:function(event){

			var target = $(event.target); 
			var widget = target.autocomplete("widget");
			widget.zIndex(target.zIndex() + 1); 

		},
		close: function (event, ui){
			$(this).autocomplete("option","appendTo","#myModalGroups");  // <-- and do this  
		},	
		source: $scope.jsonFormatData,
		autoFocus: false,
		select: function(event,ui){
		  $timeout(function(){
			  event.preventDefault();
			var UIvalue = ui.item.id;
            var UIlabel = ui.item.label;
			
             $( "#gateway"  ).val(UIlabel);
			 $scope.params = {"g_id":UIvalue,"d_device_status":'ACTIVE'};
			 $scope.getDataDevice(1, $scope.params);
			 });
			return false;
			},
		});*/
		
	}
	
	 $scope.pageChanged = function(){
				$scope.getResultsPage($scope.currentRuleEnginePage,$scope.params);	
			};
	$scope.getResultsPage = function(pageNumber,params){
			$scope.getDataDevice(pageNumber,params);
		};
	$scope.checkStatusProperty = function(property,index){
		
			if(property.propertySelected)
			property.propertySelected = true;	
			else
			property.propertySelected = false;
	};
	$scope.nextProcedureSavedInfo = function(){
		$scope.propertySelectedcount = 0;
		$scope.dataFilterSelectedDevices = [];
		$scope.dataSelectedDevices = [];
		angular.forEach($scope.selectedDevicesList,function(index){
			
						angular.forEach(index.regproperties,function(propertyIndex){
							if(propertyIndex.propertySelected == true)
							{  
								property_type = '';
								angular.forEach(propertyIndex.properties, function(value, key) {
									property_type = (value.operations).join();
									if($scope.dataSelectedDevices.indexOf(index.id)==-1){
									$scope.dataSelectedDevices.push(index.id);
								}
									$scope.dataFilterSelectedDevices.push({'id':index.id,'displayname':index.displayname,'gatewayId':index.gateway.id,
									'gatewayDisplayname':index.gateway.displayname,'operator':index.id,"orgid":index.orgid,"appid":index.appid,"protocol":index.protocol,
									'defination':{"definitionName":propertyIndex.definitionName,"propertyName":value.propertyName,"properties":[value]},'propertyType':property_type});
								});
								$scope.propertySelectedcount = 1;		
							}
						});	
					
			});
			/*angular.forEach(index.regproperties,function(propertyIndex){
				if(propertyIndex.propertySelected == true)
				{  
					property_type = '';
					angular.forEach(propertyIndex.properties, function(value, key) {
						property_type = (value.operations).join();
						if($scope.dataSelectedDevices.indexOf(index.id)==-1){
						$scope.dataSelectedDevices.push(index.id);
					}
						$scope.dataFilterSelectedDevices.push({'id':index.id,'displayname':index.displayname,'gatewayId':index.gateway.id,
						'gatewayDisplayname':index.gateway.displayname,'operator':index.id,"orgid":index.orgid,"appid":index.appid,"protocol":index.protocol,
						'defination':{"definitionName":propertyIndex.definitionName,"propertyName":value.propertyName,"properties":[value]},'propertyType':property_type});
					});
					$scope.propertySelectedcount = 1;		
				}
			});*/
		
		
		if($scope.propertySelectedcount == 1)
		{
			$scope.nextProcess('transformation');	
			$scope.selectedRuleEngine = 0;
			$timeout(function() {
				if($scope.rule.create_block == 0)
				angular.element('#addblock').triggerHandler('click');
				
			},100);
		}
		else{
			//alert("Please select property from grid");
			 alert = $mdDialog.alert({
									title: 'Please select property from grid',
									textContent: 'Please select any one property of the device..!!',
									ok: 'Close'
									});

								  $mdDialog
									.show( alert )
									.finally(function() {
									 alert = undefined;
									});
		}	
			
		
									
									
	//	console.log(JSON.stringify($scope.dataFilterSelectedDevices));
	}
	$scope.setClickedRuleEngine = function(index){
		$scope.selectedRuleEngine = index;
	};
	$scope.selectedRuleEngineData = [];
	
	$scope.ruleEngineAction = function(item){
		var arry ={};
		var found ;
		if($scope.selectedRuleEngineData[$scope.selectedRuleEngine] == undefined)
		{
			$scope.selectedRuleEngineData[$scope.selectedRuleEngine] = {};
		}
		if($scope.selectedRuleEngineData[$scope.selectedRuleEngine].data == undefined)
		{
			$scope.selectedRuleEngineData[$scope.selectedRuleEngine].data = {};
		}
				
		if (item != "") {
			if($scope.selectedRuleEngine ==0)
				 found = $filter('filter')($scope.selectedRuleEngineData[$scope.selectedRuleEngine].data, {block:$scope.rule.sel_block,ifc:{item:{id: item.id,defination:{definitionName:item.defination.definitionName,properties:{propertyName:item.defination.properties[0].propertyName}}}}}, true);
			else
				 found = $filter('filter')($scope.selectedRuleEngineData[$scope.selectedRuleEngine].data, {item:{id: item.id,defination:{definitionName:item.defination.definitionName,properties:{propertyName:item.defination.properties[0].propertyName}}}}, true);
			if(found.length >0)
			{
				alert("Already Exists....!!!")
			}else{
					
				if($scope.selectedRuleEngine ==0 && (item.defination.properties[0].operations.indexOf('get') !== -1 || item.defination.properties[0].operations.indexOf('notify') !== -1))//&& item.defination.properties[0].operations.indexOf('get') !== -1
				{
					angular.forEach($scope.selectedRuleEngineData[$scope.selectedRuleEngine].data, function(value, key) {
						if(value.block == $scope.rule.sel_block)
						{
							$scope.selectedRuleEngineData[$scope.selectedRuleEngine].data[key].ifc.push({'operator':'','sel_val':'','filter_duration':'','filter_operation':'','sub_ope':'','item':item});
						}
					});
				}
				else if($scope.selectedRuleEngine ==1 && item.defination.properties[0].operations.indexOf('post') !== -1)
				{
				$scope.selectedRuleEngineData[$scope.selectedRuleEngine].data.push({'operator':'','sel_val':'','sub_ope':'','item':item});
				}
				else if($scope.selectedRuleEngine ==2 && item.defination.properties[0].operations.indexOf('post') !== -1)
				{
				$scope.selectedRuleEngineData[$scope.selectedRuleEngine].data.push({'operator':'','sel_val':'','sub_ope':'','item':item});
				}				
			}
		}
	};
	$scope.AddIfBlock = function()
	{
		var arry ={};
		$scope.rule.create_block = $scope.rule.create_block + 1;
		if($scope.selectedRuleEngineData[0] == undefined)
		{
			$scope.selectedRuleEngineData[0] = {};
		}
		if($scope.selectedRuleEngineData[0].data == undefined)
		{
			$scope.selectedRuleEngineData[0].data = {};
		}
		
		arry = {'block':$scope.rule.create_block,'main_ope':"","ifc":[]};
		$scope.selectedRuleEngineData[0].data.push(arry);		
	}
	$scope.alreadyExistsRuleEngine = function(item){
		var arrayData = [];
		var found ;
		if($scope.selectedRuleEngineData[$scope.selectedRuleEngine] == undefined)
		{
			$scope.selectedRuleEngineData[$scope.selectedRuleEngine] = {};
		}
		if($scope.selectedRuleEngineData[$scope.selectedRuleEngine].data == undefined)
		{
			$scope.selectedRuleEngineData[$scope.selectedRuleEngine].data = [];
		}
		if($scope.selectedRuleEngine ==0)
		 found = $filter('filter')($scope.selectedRuleEngineData[$scope.selectedRuleEngine].data, {block:$scope.rule.sel_block,ifc:{item:{id: item.id,defination:{definitionName:item.defination.definitionName,properties:{propertyName:item.defination.properties[0].propertyName}}}}}, true);
		else
		 found = $filter('filter')($scope.selectedRuleEngineData[$scope.selectedRuleEngine].data, {item:{id: item.id,defination:{definitionName:item.defination.definitionName,properties:{propertyName:item.defination.properties[0].propertyName}}}}, true);
		if(found.length >0){
			return true;
		}
		else{
				return false;
			}
	};
	$scope.getDeviceinfo = function(device) {
		if (device != "") {
			var found = $filter('filter')($scope.tags, {id: device.id}, true);
			if(found.length >0)
			{
				alert("Already Exists....!!!")
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
	$scope.saveSelectedDevices = function(){
		$scope.savemodalLoading = true;
		var arr = []
		//console.log($scope.tags)
		for(var i=0;i<$scope.tags.length;i++){
			arr.push($scope.tags[i].id)
		}
		//console.log(arr)
	
			
				$scope.selectedDevicesList = $scope.tags;
				
				
				
				$('#myModalGroups').modal('hide');
			
			$scope.savemodalLoading = false
		
		
		}
		
	$scope.clearSelectedDevices = function(){
		$scope.tags = [];
		
		$scope.deviceList = [];
		$( "#gateway" ).val("");
		//$('#myModalGroups').modal('hide');
	};
	$scope.setIFDeleteBlock = function(index,block_id){
	//	console.log(index+"---"+block_id);
		angular.forEach($scope.selectedRuleEngineData[0].data, function(value, key) {
			if(value.block == block_id)
			{	$scope.selectedRuleEngineData[0].data[key].ifc.splice(index,1);
				if(index == 0)
				$scope.selectedRuleEngineData[0].data[key].ifc[index].sub_ope = "";	
				else
				$scope.selectedRuleEngineData[0].data[key].ifc[index-1].sub_ope = "";		
			}
			
		});
			
	};
	$scope.setElseDeleteBlock = function(index){
		$scope.selectedRuleEngineData[2].data.splice(index,1);		
	};
	$scope.setThenDeleteBlock = function(index){
		$scope.selectedRuleEngineData[1].data.splice(index,1);		
	};
	
	$scope.setMainConditionclass = function(id,block_id)
	{
		$(".if_main_con ul.block_"+block_id+" li a").removeClass("main_con_selected");
		$("ul.block_"+block_id+" #"+id).addClass("main_con_selected");
	}
	$scope.setModelMainConditionclass = function(id)
	{
		$(".model_condition_ope .btn").addClass("btn-default");
		$(".model_condition_ope .btn").removeClass("btn-primary");		
		$("#"+id).addClass("btn-primary");
		$("#"+id).removeClass("btn-default");
	}
	$scope.nextProcedureSavedRule = function()
	{
		$scope.viewsessionData = [];
		$scope.nextProcess('confirmation');
	}
	$scope.RuleDataSave = function()
	{
		var i= 1;
		var create_main_con = '';
		var cond_str = '';
		var obj ={};
		var itype ;
		
		$scope.finalSessionData  = {metadata:{},subrules:[]}; 
		$scope.actionSessionData  = {thenCondition:[],elseCondition:[],monitor:[],condition:[],action:[],metadata:[]}; 
		$scope.getwayid ={};
		$scope.device_id=[];
		
		angular.forEach($scope.sessionAddRules,function(main){
			//if condition  data check
			angular.forEach(main.ifCondition,function(property){
				
				angular.forEach(property.ifc,function(item){
					if(item.filter_operation != "" && item.filter_duration != "")
					{
						$scope.actionSessionData.monitor.push({"monitorid":i,"deviceid" : item.item.id,"protocol" : item.item.protocol,"gwid":item.item.gatewayId,"propertyname":item.item.defination.propertyName,
												"constraints":{"type":"operation", "operation":item.filter_operation,"duration":item.filter_duration}});
					}
					else{
						$scope.actionSessionData.monitor.push({"monitorid":i,"deviceid" : item.item.id,"protocol" : item.item.protocol,"gwid":item.item.gatewayId,"propertyname":item.item.defination.propertyName});
					}
					
					itype = item.item.defination.properties[0].type;
					if(itype =='number' || itype == 'integer') {
						item.sel_val = parseInt(item.sel_val);
					}else if(itype == 'float') {
						item.sel_val = parseFloat(item.sel_val); 
					}else {
						item.sel_val = (item.sel_val); 
					}
					$scope.actionSessionData.condition.push({"conditionid":"C"+i,"monitorid" :i,"expectedvalue":item.sel_val,"relation":item.operator});
					cond_str = cond_str + "C"+i + " " +item.sub_ope +" ";
					i = i +1;
				});
					
				create_main_con  =  create_main_con + " (" + cond_str.trim() +") " +" "+ property.main_ope;
				cond_str = "";
			});
			//then condition data check
			angular.forEach(main.thenCondition,function(thenproperty){
				obj = {};
				itype = thenproperty.item.defination.properties[0].type;
				if(itype =='number' || itype == 'integer') {
					obj[thenproperty.item.defination.propertyName] = parseInt(thenproperty.sel_val);
				}else if(itype == 'float'){
					obj[thenproperty.item.defination.propertyName] = parseFloat(thenproperty.sel_val);
				}else {
					obj[thenproperty.item.defination.propertyName] = thenproperty.sel_val;
				}
				
				
				
				$scope.actionSessionData.thenCondition.push({"deviceid":thenproperty.item.id,"gwid":thenproperty.item.gatewayId,"protocol" : thenproperty.item.protocol,"action":"SET_DEVICE_STATE","properties":[obj]});
				$scope.getwayid[thenproperty.item.gatewayId] =thenproperty.item.gatewayId;
				$scope.device_id[0]=thenproperty.item.id;
			});
			//else condition data check
			
			angular.forEach(main.elseCondition,function(elseproperty){
				obj = {};
				itype = elseproperty.item.defination.properties[0].type;
				if(itype =='number' || itype == 'integer') {
					obj[elseproperty.item.defination.propertyName] = parseInt(elseproperty.sel_val);
				}else if(itype == 'float') {
					obj[elseproperty.item.defination.propertyName] = parseFloat(elseproperty.sel_val);
				}else {
					obj[elseproperty.item.defination.propertyName] = elseproperty.sel_val;
				}						
				$scope.actionSessionData.elseCondition.push({"deviceid":elseproperty.item.id,"gwid":elseproperty.item.gatewayId,"protocol" : elseproperty.item.protocol,"action":"SET_DEVICE_STATE","properties":[obj]});
				$scope.getwayid[elseproperty.item.gatewayId] =elseproperty.item.gatewayId;
				$scope.device_id[0]=elseproperty.item.id;
			});
			//final data merging
			$scope.actionSessionData.metadata = {"subruleid":'',"sub_rulename":main.ruleName,"expressiondescription":main.ruleDesc};
			$scope.actionSessionData.action.push({'if_expression':create_main_con,'then_action':$scope.actionSessionData.thenCondition,'else_action':$scope.actionSessionData.elseCondition});
			
			$scope.finalSessionData.subrules.push({"metadata":$scope.actionSessionData.metadata,"monitor":$scope.actionSessionData.monitor,"condition":$scope.actionSessionData.condition,"action":$scope.actionSessionData.action});
			create_main_con = '';
			$scope.actionSessionData  = {thenCondition:[],elseCondition:[],monitor:[],condition:[],action:[],metadata:[]}; 
			
		});
		
		$timeout(function(){
		if($scope.rule.mode == 'Standalone'){
			$scope.finalSessionData.metadata ={"ruleid":'',"mode":$scope.rule.mode,"rulename":$scope.rule.parent_rule_name,'description':$scope.rule.parent_rule_desc,'createdby':$scope.username,
											"appid":$scope.rule.parent_appid,"orgid":$scope.orgid,"processedby":$scope.rule.parent_gwid,'timestamp':(new Date).getTime()};
		}else{
			$scope.finalSessionData.metadata ={"ruleid":'',"mode":$scope.rule.mode,"rulename":$scope.rule.parent_rule_name,'description':$scope.rule.parent_rule_desc,'meshid':$scope.rule.meshid,'createdby':$scope.username,
											"appid":$scope.rule.parent_appid,"orgid":$scope.orgid,"processedby":$scope.rule.parent_gwid,'timestamp':(new Date).getTime()};
		}	
			
		
		$scope.finalSessionData.selecteddevices = $scope.dataSelectedDevices;
		
		
				ruleengineModuleService.addRules($scope.finalSessionData).then(function(data)
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
						 $location.path('/ruleengine');
					}
					
					/*$timeout(function(){
						SocketCollection = $scope.SocketData.collection;
							for(var i=0;i<(SocketCollection.length);i++)
							{
								if(SocketCollection[i].JOBID == $scope.jobid)
								{
									//alert(JSON.stringify(SocketCollection[i]));
									if(SocketCollection[i].responsecode ==200)
									{
										
									toaster.pop('success','',data.message+ " in refreshing device properties");
									$scope.getPropertyList($scope.deviceId);

									}
									$scope.dataDeviceLoadingProperties = false;
									$scope.SocketData.collection.splice(i, 1);
								}
							}
					},1000);*/

				});
		
	//	console.log(JSON.stringify($scope.finalSessionData));		
		
		},100);	
		
	}

	$scope.addRuleinSesson = function()
	{
		$scope.showerrormessage = "";
		var lenconditionarr =[];
		var lendoarr = 0;
		if($scope.selectedRuleEngineData[0] != undefined && $scope.selectedRuleEngineData[1] != undefined)
		{
			lendoarr = ($scope.selectedRuleEngineData[1].data).length;
			angular.forEach($scope.selectedRuleEngineData[0].data,function(value){
				if((value.ifc).length == 0)
				lenconditionarr.push((value.ifc).length);
			});
		}
		else{
			$scope.showerrormessage ="Conditions and Do action is required";
			return false;
		}		
	
		if($scope.rule.rule_name != "")
		{		
			if($scope.selectedRuleEngineData[0] != undefined && $scope.selectedRuleEngineData[1] != undefined && lenconditionarr.length == 0 && lendoarr >= 1)
			{
			var ifarr ;
			var thenarr ;
			var elsearr;	
			
			if($scope.selectedRuleEngineData[0] != undefined)
				var ifarr = angular.copy($scope.selectedRuleEngineData[0].data);
			
			if($scope.selectedRuleEngineData[1] != undefined)
			var thenarr = angular.copy($scope.selectedRuleEngineData[1].data);
		
			if($scope.selectedRuleEngineData[2] != undefined)
			var elsearr = angular.copy($scope.selectedRuleEngineData[2].data);
			
			$scope.sessionAddRules.push({"ruleName":$scope.rule.rule_name,"ruleDesc":$scope.rule.rule_desc,"ifCondition":ifarr,"thenCondition":thenarr,"elseCondition":elsearr});
			$scope.rule.rule_name = "";
			$scope.rule.rule_desc = '';
			$scope.clearAddRuleSession();
		//	console.log("Session data---------"+JSON.stringify($scope.sessionAddRules));
			}
			else{
				$scope.showerrormessage ="Conditions and Do action is required";
			}
		}
		else{
			$scope.showerrormessage ="Rule Name is required";
		}
	
	}
	$scope.editRuleinSesson = function()
	{
		var lenconditionarr = [];
		var lendoarr = 0;
		if($scope.selectedRuleEngineData[0] != undefined && $scope.selectedRuleEngineData[1] != undefined)
		{
			lendoarr = ($scope.selectedRuleEngineData[1].data).length;
			angular.forEach($scope.selectedRuleEngineData[0].data,function(value){
				if((value.ifc).length == 0)
				lenconditionarr.push((value.ifc).length);
			});
		}
		else{
			$scope.showerrormessage ="Conditions and Do action is required";
			return false;
		}
		if($scope.selectedRuleEngineData[0] != undefined && $scope.selectedRuleEngineData[1] != undefined && lenconditionarr.length == 0 && lendoarr >= 1)
		{
			var index1 = $scope.rule.edit_selected_row;
			var ifarr ;
			var thenarr ;
			var elsearr;
			
			if($scope.selectedRuleEngineData[0] != undefined)
			 ifarr = angular.copy($scope.selectedRuleEngineData[0].data);
		
			if($scope.selectedRuleEngineData[1] != undefined)
			 thenarr = angular.copy($scope.selectedRuleEngineData[1].data);
		
			if($scope.selectedRuleEngineData[2] != undefined)
			 elsearr = angular.copy($scope.selectedRuleEngineData[2].data);
			$scope.sessionAddRules.splice(index1,1,{"ruleName":$scope.rule.rule_name,"ruleDesc":$scope.rule.rule_desc,"ifCondition":ifarr,"thenCondition":thenarr,"elseCondition":elsearr});
			$scope.clearAddRuleSession();
		}
		else{
			$scope.showerrormessage ="Conditions and Do action is required";
		}
		
	}
	
	$scope.clearAddRuleSession = function()
	{
		$scope.rule.rule_name = "";
		$scope.rule.rule_desc = "";
		$scope.rule.rule_name = null;
		$scope.rule.edit_selected_row = -1;
		$scope.rule.create_block =0;
		$scope.rule.sel_block =0;
		$scope.showerrormessage ="";
		
		$("#addrule").removeClass("hide");
		$("#addrule").addClass("show");
		$("#editrule").removeClass("show");
		$("#editrule").addClass("hide");
		
		if($scope.selectedRuleEngineData[0] != undefined)
		{
			for(var i = $scope.selectedRuleEngineData[0].data.length; i >= 0 ; i--)
			{
				$scope.selectedRuleEngineData[0].data.splice(i,1);			
			}	//remove then data
		}
		if($scope.selectedRuleEngineData[1] != undefined)
		{
			for(var j = $scope.selectedRuleEngineData[1].data.length; j >= 0 ; j--)
			{
				$scope.selectedRuleEngineData[1].data.splice(j,1);			
			}
		}
	//remove else data
		if($scope.selectedRuleEngineData[2] != undefined)
		{
			for(var k = $scope.selectedRuleEngineData[2].data.length; k >= 0 ; k--)
			{
				$scope.selectedRuleEngineData[2].data.splice(k,1);			
			}		
		}
		
		$scope.selectedRuleEngine = 0;
		$timeout(function() {
			if($scope.rule.create_block == 0)
			angular.element('#addblock').triggerHandler('click');
			
		},100);
	}
	$scope.deleteSessionRule = function(index)
	{
		$scope.sessionAddRules.splice(index, 1);		
	}
	$scope.editSessionRule = function(index)
	{
		$scope.clearAddRuleSession();
		$("#addrule").removeClass("show");
		$("#editrule").removeClass("hide");
		$("#addrule").addClass("hide");
		$("#editrule").addClass("show");
		$scope.rule.edit_selected_row = index;
		$scope.rule.rule_name = $scope.sessionAddRules[index].ruleName;	
		$scope.rule.rule_desc = $scope.sessionAddRules[index].ruleDesc;	
		
			angular.forEach($scope.sessionAddRules[index].ifCondition, function(value, key) {
				$scope.selectedRuleEngineData[0].data.push($scope.sessionAddRules[index].ifCondition[key]);	
				$scope.rule.create_block =value.block;				
			});
			angular.forEach($scope.sessionAddRules[index].thenCondition, function(value2, key1) {
					$scope.selectedRuleEngineData[1].data.push($scope.sessionAddRules[index].thenCondition[key1]);				
			});
			angular.forEach($scope.sessionAddRules[index].elseCondition, function(value2, key2) {				
					$scope.selectedRuleEngineData[2].data.push($scope.sessionAddRules[index].elseCondition[key2]);
			});
		
	}
	$scope.viewSessionRule = function(index)
	{
		$scope.viewsessionData = [];
		$scope.viewsessionData.push($scope.sessionAddRules[index]);		
	}
	$scope.SelectIfBlock = function(in_block_id)
	{
		$scope.rule.sel_block = in_block_id;
	}
	$scope.model = {'sel_data_id':'','sel_item_id':'','model_operation':'','model_time_txt':'','model_time':''};
	$scope.FilterOperationopen = function(data_id,item_id)
	{
		$scope.model.sel_data_id  	 = data_id;
		$scope.model.sel_item_id  	 = item_id;
		$scope.model.model_operation ='';
		$scope.model.model_time_txt  ='';
		$scope.model.model_time		 ='';
		$(".model_condition_ope ul li a").removeClass("main_con_selected");
	}		
	$scope.FilterOperationData = function()
	{
		if($scope.model.model_operation != "" && $scope.model.model_time_txt != "" && $scope.model.model_time != "")
		{
			$scope.selectedRuleEngineData[0].data[$scope.model.sel_data_id].ifc[$scope.model.sel_item_id].filter_operation = $scope.model.model_operation;
			$scope.selectedRuleEngineData[0].data[$scope.model.sel_data_id].ifc[$scope.model.sel_item_id].filter_duration = ($scope.model.model_time_txt + " "+$scope.model.model_time ) ;
		}
		$('#filteroperation').modal('hide');
		
	}
	$scope.FilterOperationdelete = function(data_id,item_id)
	{
		$scope.selectedRuleEngineData[0].data[data_id].ifc[item_id].filter_operation = '';
		$scope.selectedRuleEngineData[0].data[data_id].ifc[item_id].filter_duration = '' ;
	}
	$scope.getClassName = function(block_id)
	{
		var a = block_id;		
		if(('' + a).length == 1)
		{
			return "monitor"+block_id;
		}
		else if(('' + a).length >= 2)
		{
			return "monitor"+((''+ a).slice(-1));			
		}
		return ;
	}
	$scope.changeUITheme = function(flag_value)
	{
		if(flag_value == 0)
		$scope.rule.gui_code_flag =1;
		else
			$scope.rule.gui_code_flag =0;
	}
	$scope.selectSteps = function(sel_step)
	{
		if(sel_step == 1)
			$scope.nextProcess('process');
		if(sel_step == 2)
			$scope.nextProcess('transformation');
		if(sel_step == 3)
			$scope.nextProcess('confirmation');
		
	}
	$scope.CloseErromessage = function()
	{
		$scope.showerrormessage = "";		
	}
	 
	
});