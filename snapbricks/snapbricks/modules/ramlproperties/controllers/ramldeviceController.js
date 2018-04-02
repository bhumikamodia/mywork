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
				
				$scope.addrml.defination.push({"name":selected_val,"properties":data.Data.item});		
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
					//console.log(JSON.stringify($scope.defaultProperty));
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
	$scope.propertyTypeFunctionData = function(value){
		var propertySelect = -1;
		if(value =="number" || value =="integer" || value =="float")
			propertySelect = 0;
		else if(value == "string")
			propertySelect = 1;
        else if(value == "boolean")
			propertySelect = 2;
 
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
		$scope.defaultProperty.push({"ope_arr":["other"],"data":[{"propertyType":"other","propertyName":"","UserpropertyName":"","type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":""}]});
	}
	$scope.Addproperty = function (index,type)
	{
		if(type == 'Units')
		{
			$scope.defaultProperty[index].data.push({"propertyType":"Units","propertyName":"Units","UserpropertyName":"Units","type":"","operations":[],"sub_property":[]});
			$scope.defaultProperty[index].ope_arr.push("Units");
		}
		else if(type == 'Interval')
		{
			$scope.defaultProperty[index].data.push({"propertyType":"Interval","propertyName":"Interval","UserpropertyName":"Interval","type":"","operations":[],"units":"","type":""});
			$scope.defaultProperty[index].ope_arr.push("Interval");
		}
		else if(type == 'Threshold')
		{
			$scope.defaultProperty[index].data.push({"propertyType":"Threshold","propertyName":"Threshold","UserpropertyName":"Threshold","type":"","operations":[],"thresholdValue":""});
			$scope.defaultProperty[index].ope_arr.push("Threshold");
		}
		else{
			$scope.defaultProperty[index].data.push({"propertyType":"other","propertyName":"","UserpropertyName":"","type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":""});			
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
		$scope.defaultProperty[mainindex].data[index].propertyName =prname;
	}
	$scope.addDefinitionPropertiesData = function()
	{
		//console.log(JSON.stringify($scope.defaultProperty[0].parentname));
		
		
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
							objprr.push({"units":subarr.unit,"type":subarr.type,"propertyName":subarr.UserpropertyName,"operations":subarr.operations});	
						else if(subarr.type == 'string')
						{
								 if(subarr.enum.length>0){
								  for(var k in subarr.enum)
									{
										$scope.en_savedata.push(subarr.enum[k].value); 	  
									}
								}
								objprr.push({"units":subarr.unit,"type":subarr.type,"propertyName":subarr.UserpropertyName,"operations":subarr.operations,"enum":$scope.en_savedata});	
						}
						else
						objprr.push({"units":subarr.unit,"minimum":subarr.minimum,"maximum":subarr.maximum,"type":subarr.type,"propertyName":subarr.UserpropertyName,"operations":subarr.operations});	
					
						property_name = subarr.UserpropertyName;
					}
					else{
						
						if(subarr.propertyType == "Units"){
							obj.push({"operations":subarr.operations,"units":subarr.sub_property,"type":subarr.type,"subpropertyName":subarr.UserpropertyName,"propertyType":subarr.propertyType});
						}
						else if(subarr.propertyType == "Interval"){
							obj.push({"operations":subarr.operations,"units":subarr.units,"subpropertyName":subarr.UserpropertyName,"type":subarr.type,"propertyType":subarr.propertyType});
						}
						else if(subarr.propertyType == "Threshold"){
							obj.push({"operations":subarr.operations,"value":subarr.thresholdValue,"subpropertyName":subarr.UserpropertyName,"type":subarr.type,"propertyType":subarr.propertyType});
						}
						else{
								if(subarr.type == 'boolean')
									obj.push({"units":subarr.unit,"type":subarr.type,"propertyName":subarr.UserpropertyName,"operations":subarr.operations,"propertyType":subarr.propertyType});	
								else if(subarr.type == 'string')
								{
										 if(subarr.enum.length>0){
										  for(var k in subarr.enum)
											{
												$scope.en_savedata.push(subarr.enum[k].value); 	  
											}
										}
										obj.push({"units":subarr.unit,"type":subarr.type,"propertyName":subarr.UserpropertyName,"operations":subarr.operations,"enum":$scope.en_savedata,"propertyType":subarr.propertyType});	
								}
								else
									obj.push({"units":subarr.unit,"minimum":subarr.minimum,"maximum":subarr.maximum,"type":subarr.type,"propertyName":subarr.UserpropertyName,"operations":subarr.operations,"propertyType":subarr.propertyType});	
						}	
						
					}//else end key
					
				});
				$scope.savesubproperties.push({"parentdefinition":defination.name,"parent":property_name,"subproperties":obj});
				
			});
			$scope.saveproperties.push({"definitionName":defination.name,"properties":objprr});
		});
		$scope.finalData = {"devicename":$scope.addrml.devicename,"description":$scope.addrml.deviceDesc,"keywords":$scope.addrml.devicekeywords.split(","),
							"definitions":$scope.saveproperties,"subdefinitions":$scope.savesubproperties, "item":$scope.addrml.defination};
							
		
		//console.log(JSON.stringify($scope.finalData));
				
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
});

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
	/*$scope.checkUniqueName = function(enter_val)
	{
		var check_flage = 0;
		var key ='';
		var key_not ='';
		angular.forEach($scope.defaultProperty,function(dataval1,key1){
			if(dataval1.propertyName == "")
			{
				key_not = key1;
			}
			else if(dataval1.propertyName != "" && dataval1.propertyName == enter_val)
			{
				check_flage = 1;
				key = key1;
			}
		});
		
		$timeout(function() {
			if(check_flage == 1)	
			{
				alert("Property name should not be same");
				$scope.defaultProperty[key_not]["UserpropertyName"]= "";
			}
			else{
				$scope.defaultProperty[key_not]["propertyName"] = $scope.defaultProperty[key_not]["UserpropertyName"];
			}

		},800);
		
		
	}*/
	$scope.checkUniqueName = function(enter_val,index)
	{
		var check_flage = 0;
		$scope.defaultProperty[index]["propertyName"] = $scope.defaultProperty[index]["UserpropertyName"] = "";
		
		angular.forEach($scope.defaultProperty,function(dataval1,key1){
			if(dataval1.propertyName != "" && dataval1.propertyName == enter_val)
			{
				check_flage = 1;
			}
		});
		
		$timeout(function() {
			if(check_flage == 1)	
			{
				alert("Property name should not be same");
				$scope.defaultProperty[index]["UserpropertyName"]= "";
			}
			else{
				$scope.defaultProperty[index]["propertyName"] = $scope.defaultProperty[index]["UserpropertyName"] = enter_val;
				
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
					$scope.defaultProperty.push({"propertyName":selected_val,"UserpropertyName":selected_val,"type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":"",
						"units":{"type":"","operations":[],"sub_property":[]},
						"interval":{"operations":[],"units":"","type" :""},
						"threshold":{"operations":[],"type":"","thresholdValue":""}
						});	
					}
				}				
			});		
	};
	
	$scope.editDefinitionPropertiesData = function(){
		var selected_val = $scope.defaultProperty[0]['propertyName'];
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
	$scope.propertyTypeFunctionData = function(value){
		var propertySelect = -1;
		if(value =="number" || value =="integer" || value =="float")
			propertySelect = 0;
		else if(value == "string")
			propertySelect = 1;
        else if(value == "boolean")
			propertySelect = 2;
 
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
		$scope.defaultProperty.push({"propertyName":selected_val,"UserpropertyName":"","type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":"",
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
				$scope.saveproperties.push({"units":data.unit,"type":data.type,"propertyName":data.UserpropertyName,"operations":data.operations});	
				else if(data.type == 'string')
				{
					 if(data.enum.length>0){
					  for(var k in data.enum)
						{
							$scope.en_savedata.push(data.enum[k].value); 	  
						}
					}
					$scope.saveproperties.push({"units":data.unit,"type":data.type,"propertyName":data.UserpropertyName,"operations":data.operations,"enum":$scope.en_savedata});	
				}
				else
				 $scope.saveproperties.push({"units":data.unit,"minimum":data.minimum,"maximum":data.maximum,"type":data.type,"propertyName":data.UserpropertyName,"operations":data.operations});	
				
				if(data.units.sub_property != "" || data.units.type != "" || data.units.operations.length >0)
				{
					obj.push({"operations":data.units.operations,"units":data.units.sub_property,"subpropertyName":"units","type":data.units.type});
				}
				if(data.interval.type != "" || data.interval.units != "" || data.interval.operations.length >0)
				{
					obj.push({"operations":data.interval.operations,"units":data.interval.units,"subpropertyName":"interval","type":data.interval.type});
				}
				if(data.threshold.type != "" || data.threshold.thresholdValue != "" || data.threshold.operations.length >0)
				{
					obj.push({"operations":data.threshold.operations,"value":data.threshold.thresholdValue,"subpropertyName":"threshold","type":data.threshold.type});
				}
				if(obj.length >0)
				$scope.savesubdefinitions.push({"parentdefinition":data_def.name,"parentproperty":data_def.UserpropertyName,"subproperties":obj});
				
				
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

});