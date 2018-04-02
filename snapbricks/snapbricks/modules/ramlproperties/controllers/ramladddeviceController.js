var ramlpropertiesModule2 = angular.module('ramlpropertiesModule.controllers');

//&&&&&&&&&&&&&&&&&&&&&&&&&&ramlpropertiesCtrl&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

ramlpropertiesModule2.controller('ramlDevicepropertiesCtrl', function ($scope, $rootScope, ramlpropertiesModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,toaster,$mdDialog,CustomMessages) {

	$scope.addrml = {"devicename":"","deviceDesc":"","devicekeywords":"","device_defpro":"","selectedproperty":''};
	$scope.Addraml = {"name":""};
	$scope.addrml.defination = [];
	$scope.maindefpro =[];
	$scope.defaultProperty= [];
	$scope.subdefinition=[];
	var check_flag = 0;
	
	$scope.getDefinationPro = function(){
		ramlpropertiesModuleService.getRAMLDefinitionTemplate().then(function(data){
		$scope.maindefpro = data.Data;	
		});
	};
	$scope.getDefinationPro();
	$scope.AddProperty = function(obj)
	{	var selected_val = obj.name; 
		ramlpropertiesModuleService.retrieveRMLFromID(obj.id).then(function(data){
			//	console.log(JSON.stringify(data.Data));
				var row_pr_data  = data.Data;
				var ope_arr = []; var enum_opp = [];$scope.process_final = [];
				angular.forEach(row_pr_data.properties, function(value, key) {
					$scope.process_data =[];
					value.userpropertyname = value.propertyname;
					value.propertytype = "other";
					if(value.enum != undefined || value.enum != null)
					{	enum_opp = [];
						angular.forEach(value.enum, function(v2,vkey){
								enum_opp.push({id:"propertyValue"+(vkey+1),value:v2});
						}); 						
						delete(value.enum);
						value.enum =enum_opp;
					}
					
					$scope.process_data.push(value);
					ope_arr = [];
					angular.forEach(row_pr_data.subproperties, function(sub_pr, su_key) {
						if(sub_pr.parent == value.propertyname)
						{	
							angular.forEach(sub_pr.subproperties, function(sub_pr2, su_key2) {
							
							
							if(sub_pr2.propertytype == 'other')
							{
								sub_pr2.userpropertyname = sub_pr2.propertyname;
								if(sub_pr2.enum != undefined || sub_pr2.enum != null)
								{	enum_opp = [];
									angular.forEach(sub_pr2.enum, function(v3,v3key){
											enum_opp.push({id:"propertyValue"+(v3key+1),value:v3});
									}); 						
									delete(sub_pr2.enum);
									sub_pr2.enum =enum_opp;
								}
							}
							else{
								sub_pr2.userpropertyname = sub_pr2.subpropertyname;
								sub_pr2.propertyname 	 = sub_pr2.subpropertyname;
								delete(sub_pr2.subpropertyname);
							}
							
							if(sub_pr2.propertytype == 'Threshold')
							{
								sub_pr2.thresholdValue = sub_pr2.value; 
								delete(sub_pr2.value);
							}
							if(sub_pr2.propertytype == 'Units')
							{
								sub_pr2.sub_property = sub_pr2.units; 
								delete(sub_pr2.units);
							}
							$scope.process_data.push(sub_pr2);
							ope_arr.push(sub_pr2.propertytype);
							
						});
						}
						//console.log(sub_pr);
						
					});
					$scope.process_final.push({data:$scope.process_data,"ope_arr":ope_arr});					
				});
				//console.log(JSON.stringify($scope.process_final));
				$scope.addrml.defination.push({"name":selected_val,"properties":$scope.process_final});
		});
	}
	$scope.delProperty = function(index)
	{
		$scope.addrml.defination.splice(index,1);		
	}
	$scope.showProperty = function(selected_val){
		$scope.defaultProperty= [];
		angular.forEach($scope.addrml.defination, function(value,key) {
				if(value.name == selected_val)
				{
					angular.forEach(value.properties, function(propertydata) {
							$scope.defaultProperty.push({data:propertydata.data,"ope_arr":propertydata.ope_arr,"parentname":value.name});
					});
					$scope.Addraml.name = value.name;
				//	console.log(JSON.stringify($scope.defaultProperty));
				}				
			});
	};
	$scope.changePropertytemplate = function(sel_type,mainindex,index)
	{
		$scope.defaultProperty[mainindex].data[index].enum = []; 
		$scope.defaultProperty[mainindex].data[index].minimum = "";
		$scope.defaultProperty[mainindex].data[index].maximum = "";
		$scope.defaultProperty[mainindex].data[index].unit = "";
		
	}
	$scope.propertyTypeFunctionData = function(value,choice){
		var propertySelect = -1;
		if(value =="number" || value =="integer" || value =="float")
			propertySelect = 0;
		else if(value == "string")
			propertySelect = 1;
        else if(value == "boolean")
			propertySelect = 2;
		
		if(choice != undefined && propertySelect == 1)
		{
			if(choice.length == 0)
				{
					var newItemNo = choice.length+1;
					choice.push({'id':'propertyValue'+newItemNo});
				}
		}
		
		return propertySelect;
	};
	$scope.deletePropertyChoicesData = function(propertyValues,index){
			propertyValues.splice(index,1);
	};
	$scope.addNewPropertyChoiceData = function(choice){
		var newItemNo = choice.length+1;
		choice.push({'id':'propertyValue'+newItemNo});
	}
	$scope.newAddPropertyNameData = function()
	{
		$scope.defaultProperty.push({"ope_arr":["other"],"data":[{"propertytype":"other","propertyname":"","userpropertyname":"","type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":""}]});
	}
	$scope.Addproperty = function (index,type)
	{
		if(type == 'Units')
		{
			$scope.defaultProperty[index].data.push({"propertytype":"Units","propertyname":"Units","userpropertyname":"Units","type":"","operations":[],"sub_property":[]});
			$scope.defaultProperty[index].ope_arr.push("Units");
		}
		else if(type == 'Interval')
		{
			$scope.defaultProperty[index].data.push({"propertytype":"Interval","propertyname":"Interval","userpropertyname":"Interval","type":"","operations":[],"units":"","type":""});
			$scope.defaultProperty[index].ope_arr.push("Interval");
		}
		else if(type == 'Threshold')
		{
			$scope.defaultProperty[index].data.push({"propertytype":"Threshold","propertyname":"Threshold","userpropertyname":"Threshold","type":"","operations":[],"thresholdValue":""});
			$scope.defaultProperty[index].ope_arr.push("Threshold");
		}
		else{
			$scope.defaultProperty[index].data.push({"propertytype":"other","propertyname":"","userpropertyname":"","type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":""});			
		}
		
		//$scope.defaultProperty[index].data = data_Ara;
		
	}
	$scope.removePropertyNameData = function(propertyIndex){
		$scope.defaultProperty.splice(propertyIndex,1);
	}
	$scope.removeProperty = function(index,propertyIndex,type)
	{
		$scope.defaultProperty[index].data.splice(propertyIndex,1);
		var idx = $scope.defaultProperty[index].ope_arr.indexOf(type);
		if(idx != -1)
		$scope.defaultProperty[index].ope_arr.splice(idx,1);
		
	}
	$scope.addNewSubPropertyChoiceData = function(choice){
		var newItemNo = choice.length+1;
		choice.push({'id':'subpropertyValue'+newItemNo});
	}
	$scope.setpropertyOperationsData =function(operation,fieldvalue)
	{
		var data = operation.indexOf(fieldvalue);
	
		if(operation.indexOf(fieldvalue) !== -1) {
			operation.splice(data,1);
		}else{
			
			operation.push(fieldvalue);
		}
	};
	$scope.deletePropertyChoicesData = function(propertyValues,index){
			propertyValues.splice(index,1);
	};
	$scope.checkuniquenameTemp = function(prname,mainindex,index)
	{
		$scope.defaultProperty[mainindex].data[index].propertyname =prname;
	}
	$scope.addDefinitionPropertiesData = function()
	{
	//	console.log(JSON.stringify($scope.defaultProperty[0].parentname));
		
		
		var selected_val = $scope.defaultProperty[0].parentname;
		angular.forEach($scope.addrml.defination, function(value,key) {
			if(value.name == selected_val)
				{
					value.properties = $scope.defaultProperty;
					$timeout(function() {
						$scope.defaultProperty = [];
					},100);
				}				
			});	
		
	}
	$scope.SaveData = function()
	{
		
		$scope.saveproperties = [];
		$scope.finalData = {};
		$scope.en_savedata = [];
		$scope.savesubproperties = [];
		var obj = []; var objprr= [];
		//console.log(JSON.stringify($scope.addrml.defination));
		angular.forEach($scope.addrml.defination, function(defination,skey) {
			 objprr =[];
				angular.forEach(defination.properties, function(mainarr,mkey) {
					obj = [];
					angular.forEach(mainarr.data, function(subarr,skey) {
					
					if(skey == 0)
					{	
						if(subarr.type == 'boolean')
							objprr.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations});	
						else if(subarr.type == 'string')
						{		$scope.en_savedata = [];	
								 if(subarr.enum.length>0){
								  for(var k in subarr.enum)
									{
										$scope.en_savedata.push(subarr.enum[k].value); 	  
									}
								}
								objprr.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"enum":$scope.en_savedata});	
						}
						else
						objprr.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations});	
						//objprr.push({"units":subarr.unit,"minimum":subarr.minimum,"maximum":subarr.maximum,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations});	
					
						property_name = subarr.userpropertyname;
					}
					else{
						
						if(subarr.propertytype == "Units"){
							obj.push({"operations":subarr.operations,"units":subarr.sub_property,"type":subarr.type,"subpropertyname":subarr.userpropertyname,"propertytype":subarr.propertytype});
						}
						else if(subarr.propertytype == "Interval"){
							obj.push({"operations":subarr.operations,"units":subarr.units,"subpropertyname":subarr.userpropertyname,"value":subarr.value,"type":subarr.type,"propertytype":subarr.propertytype});
						}
						else if(subarr.propertytype == "Threshold"){
							obj.push({"operations":subarr.operations,"value":subarr.thresholdValue,"subpropertyname":subarr.userpropertyname,"type":subarr.type,"propertytype":subarr.propertytype});
						}
						else{
								if(subarr.type == 'boolean')
									obj.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});	
								else if(subarr.type == 'string')
								{		$scope.en_savedata = [];	
										 if(subarr.enum.length>0){
										  for(var k in subarr.enum)
											{
												$scope.en_savedata.push(subarr.enum[k].value); 	  
											}
										}
										obj.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"enum":$scope.en_savedata,"propertytype":subarr.propertytype});	
								}
								else
								obj.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});		
								//obj.push({"units":subarr.unit,"minimum":subarr.minimum,"maximum":subarr.maximum,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});	
						}	
						
					}//else end key
					
				});
				$scope.savesubproperties.push({"parentdefinition":defination.name,"parent":property_name,"subproperties":obj});
				
			});
			$scope.saveproperties.push({"definitionName":defination.name,"properties":objprr});
		});
		$scope.finalData = {"devicename":$scope.addrml.devicename,"description":$scope.addrml.deviceDesc,"keywords":$scope.addrml.devicekeywords.split(","),
							"definitions":$scope.saveproperties,"subdefinitions":$scope.savesubproperties, "item":[]}; //"item":$scope.addrml.defination
							
		
	//	console.log(JSON.stringify($scope.finalData));
				
		$timeout(function(){				
				
				ramlpropertiesModuleService.RamlDeviceCreate($scope.finalData).then(function(data)
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
						 $location.path('/ramlproperties');
					}

				});		
					
		},100);		
	
	}
});
/*
ramlpropertiesModule2.controller('ramleditDevicepropertiesCtrl', function ($scope, $rootScope, ramlpropertiesModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,toaster,$mdDialog,CustomMessages) {
	
	$scope.editrml = {"devicename":"","deviceDesc":"","devicekeywords":"","device_defpro":"","selectedproperty":'',"orgid":"","id":""};
	$scope.editrml.defination = [];
	$scope.maindefpro =[];
	$scope.defaultProperty= [];
	$scope.subdefinition=[];
	var check_flag = 0;
	
	$scope.getData = function(){
		
		if($scope.ramlDefId != undefined)
		{
			ramlpropertiesModuleService.retrieveRAMLDevice($scope.ramlDefId).then(function(data){
				
				$scope.editrml.defination = data.Data.item;
				$scope.editrml.devicename = data.Data.devicename;
				$scope.editrml.devicekeywords = data.Data.keywords.join(",");
				$scope.editrml.deviceDesc = data.Data.description;
				$scope.editrml.orgid =data.Data.orgid;
				$scope.editrml.id =data.Data.id;				
			});
			
			ramlpropertiesModuleService.getRAMLDefinitionTemplate().then(function(data){
				$scope.maindefpro = data.Data;
			});
		}
   
	}		
	$scope.getData();
	
	$scope.AddPropertyData = function(selected_val)
	{	
		check_flag = 0;
		angular.forEach($scope.editrml.defination, function(value,key) {
			if(value.name == selected_val)
				{
					check_flag = 1;	
				}				
		});
		$timeout(function() {
			if(check_flag == 0)	
				$scope.editrml.defination.push({"name":selected_val,"properties":[]});
		},100);
				
	}
	$scope.delPropertyData = function(index)
	{
		$scope.editrml.defination.splice(index,1);
		//$scope.defaultProperty= [];
	}
	
	$scope.checkUniqueName = function(enter_val,index)
	{
		var check_flage = 0;
		$scope.defaultProperty[index]["propertyname"] = $scope.defaultProperty[index]["userpropertyname"] = "";
		
		angular.forEach($scope.defaultProperty,function(dataval1,key1){
			if(dataval1.propertyname != "" && dataval1.propertyname == enter_val)
			{
				check_flage = 1;
			}
		});
		
		$timeout(function() {
			if(check_flage == 1)	
			{
				alert("Property name should not be same");
				$scope.defaultProperty[index]["userpropertyname"]= "";
			}
			else{
				$scope.defaultProperty[index]["propertyname"] = $scope.defaultProperty[index]["userpropertyname"] = enter_val;
				
			}

		},800);
		
		
	}
	$scope.showPropertyData = function(selected_val){
		$scope.defaultProperty= [];
		angular.forEach($scope.editrml.defination, function(value,key) {
				
				if(value.name == selected_val)
				{
					if(value.properties.length != 0)
					{
						angular.forEach(value.properties, function(propertydata) {
							$scope.defaultProperty.push(propertydata);
						});
					}
					else
					{
					$scope.defaultProperty.push({"propertyname":selected_val,"userpropertyname":selected_val,"type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":"",
						"units":{"type":"","operations":[],"sub_property":[]},
						"interval":{"operations":[],"units":"","type" :""},
						"threshold":{"operations":[],"type":"","thresholdValue":""}
						});	
					}
				}				
			});		
	};
	
	$scope.editDefinitionPropertiesData = function(){
		var selected_val = $scope.defaultProperty[0]['propertyname'];
		angular.forEach($scope.editrml.defination, function(value,key) {
			if(value.name == selected_val)
				{
					value.properties = $scope.defaultProperty;
					$timeout(function() {
						$scope.defaultProperty = [];
					},100);
				}				
			});		
	}
	$scope.propertyTypeFunctionData = function(value,choice){
		var propertySelect = -1;
		if(value =="number" || value =="integer" || value =="float")
			propertySelect = 0;
		else if(value == "string")
			propertySelect = 1;
        else if(value == "boolean")
			propertySelect = 2;
			
		if(choice != undefined && propertySelect == 1)
		{
			if(choice.length == 0)
				{
					var newItemNo = choice.length+1;
					choice.push({'id':'propertyValue'+newItemNo});
				}
		}
		return propertySelect;
	};
	$scope.enumEditFunctionData = function(enumtest,enumChoice){
		if(enumtest != undefined){
			var newItemNo = enumChoice.length+1;
			var newItemNo1 = enumChoice.length;
			for(var i=0;i<enumtest.length;i++)
			{
				enumChoice.push({'id':'propertyValue'+i,'value':enumtest[i]});
			}
		}
	};
	$scope.setpropertyOperationsData =function(operation,fieldvalue)
	{
		var data = operation.indexOf(fieldvalue);
	
		if(operation.indexOf(fieldvalue) !== -1) {
			operation.splice(data,1);
		}else{
			
			operation.push(fieldvalue);
		}
	};
	$scope.deletePropertyChoicesData = function(propertyValues,index){
			propertyValues.splice(index,1);
	};
	$scope.addNewPropertyChoiceData = function(choice){
		var newItemNo = choice.length+1;
		choice.push({'id':'propertyValue'+newItemNo});
	}
	$scope.addNewSubPropertyChoiceData = function(choice){
		var newItemNo = choice.length+1;
		choice.push({'id':'subpropertyValue'+newItemNo});
	}
	$scope.newAddPropertyNameData = function(selected_val)
	{
		$scope.defaultProperty.push({"propertyname":selected_val,"userpropertyname":"","type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":"",
						"units":{"type":"","operations":[],"sub_property":[]},
						"interval":{"operations":[],"units":"","type" :""},
						"threshold":{"operations":[],"type":"","thresholdValue":""}
						});
	}	
	$scope.removePropertyNameData = function(propertyIndex){
		$scope.defaultProperty.splice(propertyIndex,1);
	}
	$scope.EditSaveData = function()
	{
		$scope.savedefinitions = {"pr":[] };
		$scope.saveproperties = [];
		$scope.savesubdefinitions = [];
		$scope.finalData = {};
		$scope.en_savedata = [];
		var obj = [];
		
			
		angular.forEach($scope.editrml.defination, function(data_def) {
			$scope.saveproperties=[];
			angular.forEach(data_def.properties, function(data) {
				obj = []; $scope.en_savedata=[];
				if(data.type == 'boolean')
				$scope.saveproperties.push({"units":data.unit,"type":data.type,"propertyname":data.userpropertyname,"operations":data.operations});	
				else if(data.type == 'string')
				{
					 if(data.enum.length>0){
					  for(var k in data.enum)
						{
							$scope.en_savedata.push(data.enum[k].value); 	  
						}
					}
					$scope.saveproperties.push({"units":data.unit,"type":data.type,"propertyname":data.userpropertyname,"operations":data.operations,"enum":$scope.en_savedata});	
				}
				else
				 $scope.saveproperties.push({"units":data.unit,"minimum":data.minimum,"maximum":data.maximum,"type":data.type,"propertyname":data.userpropertyname,"operations":data.operations});	
				
				if(data.units.sub_property != "" || data.units.type != "" || data.units.operations.length >0)
				{
					obj.push({"operations":data.units.operations,"units":data.units.sub_property,"subpropertyname":"units","type":data.units.type});
				}
				if(data.interval.type != "" || data.interval.units != "" || data.interval.operations.length >0)
				{
					obj.push({"operations":data.interval.operations,"units":data.interval.units,"subpropertyname":"interval","type":data.interval.type});
				}
				if(data.threshold.type != "" || data.threshold.thresholdValue != "" || data.threshold.operations.length >0)
				{
					obj.push({"operations":data.threshold.operations,"value":data.threshold.thresholdValue,"subpropertyname":"threshold","type":data.threshold.type});
				}
				if(obj.length >0)
				$scope.savesubdefinitions.push({"parentdefinition":data_def.name,"parentproperty":data_def.userpropertyname,"subproperties":obj});
				
				
			});	
				$scope.savedefinitions.pr.push({"definitionName":data_def.name,"properties":$scope.saveproperties});			
		});
		$scope.finalData = {"devicename":$scope.editrml.devicename,"description":$scope.editrml.deviceDesc,"keywords":$scope.editrml.devicekeywords.split(","),"orgid":$scope.editrml.orgid,
							"definitions":$scope.savedefinitions.pr,"subdefinitions":$scope.savesubdefinitions, "item":$scope.editrml.defination};
							
		
			$timeout(function(){				
				
				ramlpropertiesModuleService.RamlDeviceUpdate($scope.finalData,$scope.editrml.id).then(function(data)
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
						 $location.path('/ramlproperties');
					}
					
					$timeout(function(){
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
					},1000);

				});		
					
		},100);
		
	}

});*/