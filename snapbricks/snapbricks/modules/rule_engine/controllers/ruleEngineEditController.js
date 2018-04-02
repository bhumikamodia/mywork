var ruleEngineModule2 = angular.module('ruleEngineModule.controllers');

//&&&&&&&&&&&&&&&&&&&&&&&&&&ramlpropertiesCtrl&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

ruleEngineModule2.controller('ruleengineEditCtrl', function ($scope,$q, $rootScope, ruleengineModuleService,deviceModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, gatewayModuleService,deviceModuleService,$uibModal,toaster,WebMqtt) {

//======================= Get end Device List ==========================================
	 /*var str ="(C10) or (C11 xor C12) or (C13 and C14) or (C15) ";
 	var aa = str.split("(");
	console.log(aa);
	$scope.nextProcess = function(process) {
        $scope.processPage = process;
    };
	*/
		//======================= Gdddd========================================
		
	$rootScope.globals = $cookieStore.get('globals') || {};
    $scope.showCreateNewRule = false;
	$scope.rule = {"parent_rule_name":"","parent_rule_desc":'',"parent_appid":'',"rule_name":"",'rule_desc':"","edit_selected_row":-1,"create_block":0,"sel_block":0,'gui_code_flag':0,'rule_main_ruleid':'','rule_id':''};
	$scope.processPage = 'process';
	$scope.editsessionAddRules = [];
	$scope.selectedRuleEngineData = {0:{data:[]},1:{data:[]},2:{data:[]}};
	$scope.selectedRuleEngine = 0;
	$scope.OperatorsArr =['==','>','<','<>','>=','<='];
	$scope.showerrormessage ="";
	$scope.monitor_arr = [];
	$scope.monitor_max = 0;
	
	$scope.callAPIedit = function(ruleId)
	{
		
		$scope.ruleEngineeditData = [];
		ruleengineModuleService.getdata(ruleId).then(function(data) {

			$timeout(function() {
				if(data != "")
				{
					$scope.ruleEngineeditData = data.Data;
					$scope.ruleEngineselectedInfo = data.Data;	
					//$scope.getDataDevice("",{"g_id":$scope.ruleEngineeditData.metadata.processedby});					
					//console.log(JSON.stringify($scope.ruleEngineeditData));
					$scope.deviceList = [];
					$scope.dataRuleEngineLoading = true;
					$scope.dataFilterSelectedDevices =[];
					$scope.activeList = [];
					var condition =[]; var filter_duration = ''; var filter_operation='';var property_type = '';
					var params = {"selecteddevices" :$scope.ruleEngineeditData.selecteddevices }
					ruleengineModuleService.getDevicelist(params).then(function (data) {
					$timeout(function(){
						if(data.Data != undefined){
							$scope.deviceList = data.Data;
							var arrData = [];
							angular.forEach($scope.deviceList , function(dev_rec,dev_key){
								arrData.push(dev_rec.id);
							});
						ruleengineModuleService.getActivePropList(arrData).then(function(response){
							if(response.Data!=undefined){
								$scope.activeList =response.Data;
								angular.forEach($scope.deviceList , function(dev_rec,dev_key){
								angular.forEach($scope.activeList, function(propertyIndex1){
									if(propertyIndex1.deviceid == dev_rec.id){
										//alert(JSON.stringify(propertyIndex1.properties));
										angular.forEach(propertyIndex1.properties , function(sub_pro,sub_key){
											property_type = (sub_pro.properties[0].operations).join();
											$scope.dataFilterSelectedDevices.push({"id":dev_rec.id,"gatewayId":dev_rec.gateway.id,"gatewayDisplayname":dev_rec.gateway.displayname,"displayname":dev_rec.displayname,"propertyType":property_type,"defination":sub_pro});
										});
									}
								});
								
							});	
							}
						});
														
							
							angular.forEach($scope.ruleEngineeditData.subrules , function(s1,key1){
							
								angular.forEach(s1.monitor , function(m1,key2){
									angular.forEach($scope.deviceList , function(d1,key3){
										
										angular.forEach(d1.properties , function(d2,key4){
											if(d1.id == m1.deviceid && m1.propertyname == d2.definitionName)
											{
												m1.items = {"id":d1.id,"gatewayId":d1.gateway.id,"gatewayDisplayname":d1.gateway.displayname,"displayname":d1.displayname,"defination":d2};
												m1.operator =s1.condition[key2].relation;
												m1.sel_val =s1.condition[key2].expectedvalue;
												m1.condition = s1.condition[key2].conditionid;
												
												if(m1.constraints != undefined)
												{
													m1.filter_duration = m1.constraints.duration;
													m1.filter_operation =m1.constraints.operation;
												}
												else{
													m1.filter_duration ='';
													m1.filter_operation ='';
												}											
												
											}
										});
									});								
							
								});
								
							})//sub rules end
							
						}	//if data end heree 		
						
					});
				
				});
		
	
				}
			},100);
		}).catch(function(error){
			
		});
		
		//console.log(JSON.stringify($scope.ruleEngineeditData));
	}
	
	if($scope.ruleEngineselectedInfo.id != "")
	{
		$scope.callAPIedit($scope.ruleEngineselectedInfo.id);
	}
	
	$scope.editSavedInfo = function()
	{
		$scope.add = {"metadata":$scope.ruleEngineselectedInfo.metadata};
		ruleengineModuleService.mainRulesedit($scope.add,$scope.ruleEngineselectedInfo.id).then(function(data) {

			if(data.status == 404 || data.status == 400)
			{
				toaster.pop("error","",data.data.message);
				//return false;
			}
			else
			{
				$scope.dataLoading=false;
				toaster.pop('success','',data.message);
				$location.path('ruleengine/editrule');
			}
			
			
		});
			
	}
	$scope.editNextInfo = function()
	{
		var thenarr = [];
		var elsearr = [];
		var ifarr   = [];
		var ifcarr  = {};
		var block   = '';
		var arr = '';
		var obj = {};
		
		$scope.editsessionAddRules = [];
		angular.forEach($scope.ruleEngineeditData.subrules,function(subrules ,id_key){
			
			angular.forEach(subrules.action,function(value ,key){
				if_arr = (value.if_expression).split("(");
				for(var i =1 ;i <= if_arr.length;i++)
				{
					if(if_arr[i] != "" && if_arr[i] != undefined)
					{	var str = if_arr[i];
						if_exp_arr = str.split(")");
						
						if(ifcarr[id_key] == undefined)
							ifcarr[id_key] = {};
						if(ifcarr[id_key].data == undefined)
							ifcarr[id_key].data = [];
						
						if(if_exp_arr[0] != "" && if_exp_arr[0] != undefined)
						{
							if_con_arr = if_exp_arr[0].split(" ");	
							obj = {};
							var k =1;
							for(var j = 0; j<= if_con_arr.length; j++)
							{
								if(if_con_arr[j] != undefined)
								{
								str_value = if_con_arr[j].replace(/ /g,'');
								if(str_value == "or"  || str_value == "xor" || str_value == "and")
								{
									obj[k] = {opr:if_con_arr[j],condition:if_con_arr[j-1]};
									k = k+1;
									
								}
								else
									obj[k] = {condition:if_con_arr[j]};								
								}								
							}
							
						}
						ifcarr[id_key].data.push({block:i,condition:"("+if_arr[i],"main_ope":if_exp_arr[if_exp_arr.length - 1].trim(),"item":obj});
						
					}
				}
			});
		});
		//console.log(JSON.stringify(ifcarr));		
		var ifarr = [];		
		angular.forEach($scope.ruleEngineeditData.subrules,function(subrules ,id_key){
			ifarr = [];
		
			angular.forEach(ifcarr[id_key].data,function(if_sub_con ,s_key){
			var objdat = [];	
				angular.forEach(if_sub_con.item,function(sub_item ,s_i_key){
						
					angular.forEach(subrules.monitor,function(con_item ,c_key){
							if(con_item.condition == sub_item.condition)
							{
								if(sub_item.opr == undefined)
									sub_item.opr = '';
								$scope.monitor_arr.push(con_item.monitorid);
								objdat.push({"operator":con_item.operator,"sel_val":con_item.sel_val,
											"filter_duration":con_item.filter_duration,"filter_operation":con_item.filter_operation,
											"sub_ope":sub_item.opr,"condition":con_item.condition,item:con_item.items});	
							}
						});
						
					});
					ifarr.push({"block":if_sub_con.block,"main_ope":if_sub_con.main_ope,"ifc":objdat});				
			});
			
		angular.forEach(subrules.action,function(value ,key){
			elsearr = [];
		angular.forEach(value.else_action,function(elsevalue ,elsekey){
					key_name = Object.keys(elsevalue.properties[0])[0];
					
						angular.forEach($scope.deviceList , function(dev_rec,dev_key){
							
							angular.forEach(dev_rec.properties , function(sub_pro,sub_key){
								
								if(elsevalue.deviceid == dev_rec.id  && sub_pro.definitionName == key_name)
								{
									elsearr.push({"operator":"==","sel_val":elsevalue.properties[0][key_name],"sub_ope":"",
									"item":{"id":dev_rec.id,"gatewayId":dev_rec.gateway.id,"gatewayDisplayname":dev_rec.gateway.displayname,"displayname":dev_rec.displayname,"defination":sub_pro}});	
								//	console.log(sub_pro.definitionName+"--"+dev_rec.id);
								}
							});
						});
				});
				thenarr =[];
				angular.forEach(value.then_action,function(thenvalue ){
					key_name = Object.keys(thenvalue.properties[0])[0];
					//console.log(key_name );
					
						angular.forEach($scope.deviceList , function(dev_rec,dev_key){
							angular.forEach(dev_rec.properties , function(sub_pro,sub_key){
								
								if(thenvalue.deviceid == dev_rec.id  && sub_pro.definitionName == key_name)
								{
									thenarr.push({"operator":"==","sel_val":thenvalue.properties[0][key_name],"sub_ope":"",
									"item":{"id":dev_rec.id,"gatewayId":dev_rec.gateway.id,"gatewayDisplayname":dev_rec.gateway.displayname,"displayname":dev_rec.displayname,"defination":sub_pro}});										
								}
							});
						});
				});
		});	
		
		$scope.editsessionAddRules.push({"ruleID":subrules.id,"ruleName":subrules.metadata.sub_rulename,"ruleDesc":subrules.metadata.expressiondescription,
			"ifCondition":ifarr,"thenCondition":thenarr,"elseCondition":elsearr});
			
			ifarr =[];elsearr =[];thenarr =[];key_id ='';block = '';
		
		});
		$scope.processPage = 'edittransformation';
	//	console.log(JSON.stringify($scope.editsessionAddRules));
		if(($scope.monitor_arr).length >0)
		$scope.monitor_max = Math.max.apply(null,$scope.monitor_arr);	
		
		$scope.monitor_max  = $scope.monitor_max +1;
		//console.log("maxxxx----"+$scope.monitor_max);
	}
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
	$scope.editselectSteps = function(sel_step)
	{
		if(sel_step == 1)
			$scope.processPage = 'process';
		if(sel_step == 2)
			$scope.processPage = 'edittransformation';
	}
	$scope.editSessionRuleData = function(index)
	{
		
		$scope.cleardata();
		$("#editrule").addClass("show");
		$scope.rule.edit_selected_row = index;
		$scope.rule.rule_name = $scope.editsessionAddRules[index].ruleName;	
		$scope.rule.rule_desc = $scope.editsessionAddRules[index].ruleDesc;	
		$scope.rule.rule_id = $scope.editsessionAddRules[index].ruleID;
		
			angular.forEach($scope.editsessionAddRules[index].ifCondition, function(value, key) {
				$scope.selectedRuleEngineData[0].data.push($scope.editsessionAddRules[index].ifCondition[key]);	
				$scope.rule.create_block =value.block;				
			});
			angular.forEach($scope.editsessionAddRules[index].thenCondition, function(value2, key1) {
					$scope.selectedRuleEngineData[1].data.push($scope.editsessionAddRules[index].thenCondition[key1]);				
			});
			angular.forEach($scope.editsessionAddRules[index].elseCondition, function(value2, key2) {				
					$scope.selectedRuleEngineData[2].data.push($scope.editsessionAddRules[index].elseCondition[key2]);
			});
	}
	
	$scope.editSelectIfBlock = function(in_block_id)
	{
		$scope.rule.sel_block = in_block_id;
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
	$scope.editRuleinSessondata = function()
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
		
		
		if($scope.rule.rule_name != "")
		{
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
				$scope.editsessionAddRules.splice(index1,1,{"ruleID":$scope.rule.rule_id,"ruleName":$scope.rule.rule_name,"ruleDesc":$scope.rule.rule_desc,"ifCondition":ifarr,"thenCondition":thenarr,"elseCondition":elsearr});
				
				$scope.cleardata();
				$scope.updateSubrule(index1);
			}
			else{
					$scope.showerrormessage ="Conditions and Do action is required";
			}
		}
		else{
			$scope.showerrormessage ="Enter Rule Engine Name";
		}
		
		
		
	}
	$scope.addRuleinSessondata = function(){
		
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
			var obj = {"ruleName":$scope.rule.rule_name,"ruleDesc":$scope.rule.rule_desc,"ruleID":"","ifCondition":ifarr,"thenCondition":thenarr,"elseCondition":elsearr};
			//$scope.editsessionAddRules.push(obj);
			
			$scope.rule.rule_name = "";
			$scope.rule.rule_desc = '';
			$scope.cleardata();
			$scope.addSubrule(obj);
		  }else{
			  $scope.showerrormessage  = "Conditions and Do action is required";
		  }
		}
		else{
			$scope.showerrormessage  = "Enter Rule Engine Name";
		}
	}
	$scope.addSubrule = function(AddRule)
	{
		if($scope.monitor_max != "" && $scope.monitor_max != undefined)
			var i= $scope.monitor_max;
			else
			var i= 	1;
		var create_main_con = '';
		var cond_str = '';
		var obj ={};
		var itype ;
		$scope.finalSessionData  = {}; 
		$scope.actionSessionData  = {thenCondition:[],elseCondition:[],monitor:[],condition:[],action:[],metadata:[]}; 
		$scope.getwayid ={};
		
		var main = AddRule;
		
			//if condition  data check
			angular.forEach(main.ifCondition,function(property){
				
				angular.forEach(property.ifc,function(item){
					if(item.filter_operation != "" && item.filter_duration != "")
					{
						$scope.actionSessionData.monitor.push({"monitorid":i,"deviceid" : item.item.id,"protocol" : item.item.protocol,"gwid":item.item.gatewayId,"propertyname":item.item.defination.definitionName,
												"constraints":{"type":"operation", "operation":item.filter_operation,"duration":item.filter_duration}});
					}
					else{
						$scope.actionSessionData.monitor.push({"monitorid":i,"deviceid" : item.item.id,"protocol" : item.item.protocol,"gwid":item.item.gatewayId,"propertyname":item.item.defination.definitionName});
					}
					
					itype = item.item.defination.properties[0].type;
					if(itype =='number' || itype == 'integer') {
						item.sel_val = parseInt(item.sel_val);
					}else if(itype == 'float') {
						item.sel_val = parseFloat(item.sel_val); 
					}else {
						item.sel_val = (item.sel_val); 
					}
					/*
					else if(itype == 'boolean') {
						item.sel_val = eval(item.sel_val); */
					$scope.actionSessionData.condition.push({"conditionid":"C"+i,"monitorid" :i,"expectedvalue":item.sel_val,"relation":item.operator});
					cond_str = cond_str + "C"+i + " " +item.sub_ope +" ";
					i = i +1;
					$scope.monitor_max = i;
				});
					
				create_main_con  =  create_main_con + " (" + cond_str.trim() +") " +" "+ property.main_ope;
				cond_str = "";
			});
			//then condition data check
			angular.forEach(main.thenCondition,function(thenproperty){
				obj = {};
				itype = thenproperty.item.defination.properties[0].type;
				if(itype =='number' || itype == 'integer') {
					obj[thenproperty.item.defination.definitionName] = parseInt(thenproperty.sel_val);
				}else if(itype == 'float'){
					obj[thenproperty.item.defination.definitionName] = parseFloat(thenproperty.sel_val);
				}else {
					obj[thenproperty.item.defination.definitionName] = thenproperty.sel_val;
				}
				/*
				} else if(itype == 'boolean'){
					obj[thenproperty.item.defination.propertyName] = eval(thenproperty.sel_val); */
				
				
				$scope.actionSessionData.thenCondition.push({"deviceid":thenproperty.item.id,"gwid":thenproperty.item.gatewayId,"protocol" : thenproperty.item.protocol,"action":"SET_DEVICE_STATE","properties":[obj]});
				$scope.getwayid[thenproperty.item.gatewayId] =thenproperty.item.gatewayId;
			});
			//else condition data check
			
			angular.forEach(main.elseCondition,function(elseproperty){
				obj = {};
				itype = elseproperty.item.defination.properties[0].type;
				if(itype =='number' || itype == 'integer') {
					obj[elseproperty.item.defination.definitionName] = parseInt(elseproperty.sel_val);
				}else if(itype == 'float') {
					obj[elseproperty.item.defination.definitionName] = parseFloat(elseproperty.sel_val);
				}else {
					obj[elseproperty.item.defination.definitionName] = elseproperty.sel_val;
				}						
				$scope.actionSessionData.elseCondition.push({"deviceid":elseproperty.item.id,"gwid":elseproperty.item.gatewayId,"protocol" : elseproperty.item.protocol,"action":"SET_DEVICE_STATE","properties":[obj]});
				$scope.getwayid[elseproperty.item.gatewayId] =elseproperty.item.gatewayId;
			});
			//final data merging
			
			$scope.actionSessionData.rulemetadata = {"ruleid":$scope.ruleEngineselectedInfo.id,"processedby":$scope.ruleEngineselectedInfo.metadata.processedby};
			$scope.actionSessionData.metadata = {"ruleid":$scope.ruleEngineselectedInfo.id,"sub_rulename":main.ruleName,"expressiondescription":main.ruleDesc};
			$scope.actionSessionData.action.push({'if_expression':create_main_con,'then_action':$scope.actionSessionData.thenCondition,'else_action':$scope.actionSessionData.elseCondition});
			$scope.finalSessionData= {"rulemetadata":$scope.actionSessionData.rulemetadata,"metadata":$scope.actionSessionData.metadata,"monitor":$scope.actionSessionData.monitor,"condition":$scope.actionSessionData.condition,"action":$scope.actionSessionData.action,
				"id":$scope.ruleEngineselectedInfo.id,'createdby':$scope.ruleEngineselectedInfo.createdby,"modified_by": $scope.ruleEngineselectedInfo.modified_by,
				"ch":$scope.ruleEngineselectedInfo.metadata.ch,"is_deleted":$scope.ruleEngineselectedInfo.is_deleted, "is_active": $scope.ruleEngineselectedInfo.is_active,"orgid": $scope.ruleEngineselectedInfo.metadata.orgid,"createdts":"2017-06-21T02:28:07.503000"
				};
		//	console.log(JSON.stringify($scope.finalSessionData));
			$timeout(function(){
				
				
				ruleengineModuleService.subRulesAdd($scope.finalSessionData,$scope.ruleEngineselectedInfo.metadata.processedby,$scope.ruleEngineselectedInfo.metadata.appid).then(function(data)
				{
					if(data.status == 404 || data.status == 400)
					{
						toaster.pop("error","",data.data.message)
						//return false;
					}
					else
					{
						$scope.dataLoading=false;
						var len = $scope.editsessionAddRules.length;
						toaster.pop('success','',data.message);
						$scope.editsessionAddRules.push({"ruleName":AddRule.ruleName,"ruleDesc":AddRule.ruleDesc,"ruleID":data.Data.subrules[0].metadata.subruleid,"ifCondition":AddRule.ifCondition,"thenCondition":AddRule.thenCondition,"elseCondition":AddRule.elseCondition});
						$location.path('/ruleengine/editrule');
						return false;
					}
					
			/*		$timeout(function(){
						SocketCollection = $scope.SocketData.collection;
							for(var i=0;i<(SocketCollection.length);i++)
							{
								if(SocketCollection[i].JOBID == $scope.jobid)
								{
									//alert(JSON.stringify(SocketCollection[i]));
									if(SocketCollection[i].responsecode ==200)
									{
										
									toaster.pop('success','',data.message+ " in refreshing device properties");									

									}
									$scope.dataDeviceLoadingProperties = false;
									$scope.SocketData.collection.splice(i, 1);
								}
							}
					},1000);*/

				});		
					
		},100);
		
		
	}
	$scope.deleteSessionRuleData = function(index)
	{    
		var rule_id = $scope.editsessionAddRules[index].ruleID;
		var app_id = $scope.ruleEngineselectedInfo.metadata.appid;
		var gwid= $scope.ruleEngineselectedInfo.metadata.processedby;
		var ch=$scope.ruleEngineselectedInfo.metadata.ch;
		ruleengineModuleService.deleteSubRules(rule_id,app_id,gwid,ch,$scope.ruleEngineeditData.metadata).then(function(data) {
			if(data.message != undefined){
				$scope.message = data.message;
				toaster.pop('success','',$scope.message);
				$location.path('/ruleengine/editrule');
				$window.location.reload();
				return false;
			}
			else{
				toaster.pop('error','',data.message);
			}
		});
		
	}
	$scope.updateSubrule = function(index1)
	{
		if($scope.monitor_max != "" && $scope.monitor_max != undefined)
			var i= $scope.monitor_max;
			else
			var i= 	1;
		
		var create_main_con = '';
		var cond_str = '';
		var obj ={};
		var itype ;
		$scope.finalSessionData  = {}; 
		$scope.actionSessionData  = {thenCondition:[],elseCondition:[],monitor:[],condition:[],action:[],metadata:[]}; 
		$scope.getwayid ={};
		
		var main = $scope.editsessionAddRules[index1];
		
			//if condition  data check
			angular.forEach(main.ifCondition,function(property){
				
				angular.forEach(property.ifc,function(item){
					if(item.filter_operation != "" && item.filter_duration != "")
					{
						$scope.actionSessionData.monitor.push({"monitorid":i,"deviceid" : item.item.id,"protocol" : item.item.protocol,"gwid":item.item.gatewayId,"propertyname":item.item.defination.definitionName,
												"constraints":{"type":"operation", "operation":item.filter_operation,"duration":item.filter_duration}});
					}
					else{
						$scope.actionSessionData.monitor.push({"monitorid":i,"deviceid" : item.item.id,"protocol" : item.item.protocol,"gwid":item.item.gatewayId,"propertyname":item.item.defination.definitionName});
					}
					
					itype = item.item.defination.properties[0].type;
					if(itype =='number' || itype == 'integer') {
						item.sel_val = parseInt(item.sel_val);
					}else if(itype == 'float') {
						item.sel_val = parseFloat(item.sel_val); 
					}else {
						item.sel_val = (item.sel_val); 
					}
					/*
					else if(itype == 'boolean') {
						item.sel_val = eval(item.sel_val); */
					$scope.actionSessionData.condition.push({"conditionid":"C"+i,"monitorid" :i,"expectedvalue":item.sel_val,"relation":item.operator});
					if(item.sub_ope != undefined)
					cond_str = cond_str + "C"+i + " " +item.sub_ope +" ";
					else
					cond_str = cond_str + "C"+i + " ";
					i = i +1;
					$scope.monitor_max =i;
				});
				if(property.main_ope != undefined)	
					create_main_con  =  create_main_con + " (" + cond_str.trim() +") " +" "+ property.main_ope;
				else
					create_main_con  =  create_main_con + " (" + cond_str.trim() +") ";
				cond_str = "";
			});
			//then condition data check
			angular.forEach(main.thenCondition,function(thenproperty){
				obj = {};
				itype = thenproperty.item.defination.properties[0].type;
				if(itype =='number' || itype == 'integer') {
					obj[thenproperty.item.defination.definitionName] = parseInt(thenproperty.sel_val);
				}else if(itype == 'float'){
					obj[thenproperty.item.defination.definitionName] = parseFloat(thenproperty.sel_val);
				}else {
					obj[thenproperty.item.defination.definitionName] = thenproperty.sel_val;
				}
				/*
				} else if(itype == 'boolean'){
					obj[thenproperty.item.defination.propertyName] = eval(thenproperty.sel_val); */
				
				
				$scope.actionSessionData.thenCondition.push({"deviceid":thenproperty.item.id,"gwid":thenproperty.item.gatewayId,"protocol" : thenproperty.item.protocol,"action":"SET_DEVICE_STATE","properties":[obj]});
				$scope.getwayid[thenproperty.item.gatewayId] =thenproperty.item.gatewayId;
			});
			//else condition data check
			
			angular.forEach(main.elseCondition,function(elseproperty){
				obj = {};
				itype = elseproperty.item.defination.properties[0].type;
				if(itype =='number' || itype == 'integer') {
					obj[elseproperty.item.defination.definitionName] = parseInt(elseproperty.sel_val);
				}else if(itype == 'float') {
					obj[elseproperty.item.defination.definitionName] = parseFloat(elseproperty.sel_val);
				}else {
					obj[elseproperty.item.defination.definitionName] = elseproperty.sel_val;
				}						
				$scope.actionSessionData.elseCondition.push({"deviceid":elseproperty.item.id,"gwid":elseproperty.item.gatewayId,"protocol" : elseproperty.item.protocol,"action":"SET_DEVICE_STATE","properties":[obj]});
				$scope.getwayid[elseproperty.item.gatewayId] =elseproperty.item.gatewayId;
			});
		
			//final data merging
			$scope.actionSessionData.rulemetadata = {"ruleid":$scope.ruleEngineselectedInfo.id,"processedby":$scope.ruleEngineselectedInfo.metadata.processedby};
			if($scope.ruleEngineselectedInfo.metadata.mode == 'Standalone'){
			$scope.actionSessionData.metadata = {"ruleid":$scope.ruleEngineselectedInfo.id,"subruleid":main.ruleID,"sub_rulename":main.ruleName,"expressiondescription":main.ruleDesc,"mode":$scope.ruleEngineselectedInfo.metadata.mode};
			}else{
			$scope.actionSessionData.metadata = {"ruleid":$scope.ruleEngineselectedInfo.id,"subruleid":main.ruleID,"sub_rulename":main.ruleName,"expressiondescription":main.ruleDesc,"mode":$scope.ruleEngineselectedInfo.metadata.mode,"meshid":$scope.ruleEngineselectedInfo.metadata.meshid};	
			}
			$scope.actionSessionData.action.push({'if_expression':create_main_con,'then_action':$scope.actionSessionData.thenCondition,'else_action':$scope.actionSessionData.elseCondition});
			$scope.finalSessionData= {"rulemetadata":$scope.actionSessionData.rulemetadata,"metadata":$scope.actionSessionData.metadata,"monitor":$scope.actionSessionData.monitor,"condition":$scope.actionSessionData.condition,"action":$scope.actionSessionData.action,
				"id":$scope.ruleEngineselectedInfo.id,'createdby':$scope.ruleEngineselectedInfo.createdby,"modified_by": $scope.ruleEngineselectedInfo.modified_by,
				"ch":$scope.ruleEngineselectedInfo.metadata.ch,"is_deleted":$scope.ruleEngineselectedInfo.is_deleted, "is_active": $scope.ruleEngineselectedInfo.is_active,"orgid": $scope.ruleEngineselectedInfo.metadata.orgid,"createdts":"2017-06-21T02:28:07.503000"
				};
		//		console.log(JSON.stringify($scope.finalSessionData));
				
			$timeout(function(){
				
				ruleengineModuleService.subRulesedit($scope.finalSessionData,main.ruleID,$scope.ruleEngineselectedInfo.metadata.processedby,$scope.ruleEngineselectedInfo.metadata.appid).then(function(data)
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
						 $location.path('/ruleengine/editrule');
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

									}
									$scope.dataDeviceLoadingProperties = false;
									$scope.SocketData.collection.splice(i, 1);
								}
							}
					},1000);*/

				});		
					
		},100);
		
		//console.log(JSON.stringify($scope.finalSessionData));
	}
	$scope.AddIfBlockData = function()
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
	$scope.cleardata = function(){
		$scope.showerrormessage = "";
		$scope.rule.rule_name = "";
		$scope.rule.rule_desc = "";
		$scope.rule.rule_id = "";
		$scope.rule.rule_name = null;
		$scope.rule.edit_selected_row = -1;
		$scope.rule.create_block =0;
		$scope.rule.sel_block =0;
		
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
	$scope.setClickedRuleEngine = function(index){
		$scope.selectedRuleEngine = index;
	};
	
	$scope.setIFDeleteBlockData = function(index,block_id){
		angular.forEach($scope.selectedRuleEngineData[0].data, function(value, key) {
		 	if(value.block == block_id)
				$scope.selectedRuleEngineData[0].data[key].ifc.splice(index,1);
			});
	};
	$scope.setElseDeleteBlockData = function(index){
		$scope.selectedRuleEngineData[2].data.splice(index,1);		
	};
	$scope.setThenDeleteBlockData = function(index){
		$scope.selectedRuleEngineData[1].data.splice(index,1);		
	};
	$scope.setMainConditionclass = function(id,block_id)
	{
		$(".if_main_con ul.block_"+block_id+" li a").removeClass("main_con_selected");
		$("ul.block_"+block_id+" #"+id).addClass("main_con_selected");
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
	$scope.setModelMainConditionclass = function(id)
	{
		$(".model_condition_ope .btn").addClass("btn-default");
		$(".model_condition_ope .btn").removeClass("btn-primary");		
		$("#"+id).addClass("btn-primary");
		$("#"+id).removeClass("btn-default");
	}
	$scope.CloseErromessage = function()
	{
		$scope.showerrormessage = "";		
	}
});