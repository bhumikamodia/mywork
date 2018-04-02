var ramlpropertiesModule5 = angular.module('ramlpropertiesModule.controllers');

ramlpropertiesModule4.controller('ramleditproCtrl', function ($scope, $rootScope, ramlpropertiesModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,toaster,$mdDialog,CustomMessages) {

	$scope.editraml = {"name":"","description":"","id":""};
	$scope.Addraml= {"name":""};
	$scope.defaultProperty= [];
	$scope.getdata = [];
	$scope.process_data = [];
	$scope.process_final = [];
	if($scope.ramlDevId != "" && $scope.ramlDevId != undefined)
	{
		//$scope.getRecord($scope.ramlDevId);	
	//	console.log(JSON.stringify($scope.ramlDevId.id));
		
		ramlpropertiesModuleService.retrieveRMLFromID($scope.ramlDevId.id).then(function(data){
				
				$scope.getdata = data.Data;
				$scope.editraml.name = $scope.Addraml.name = data.Data.name;
				$scope.editraml.description = data.Data.description;
				$scope.editraml.id = data.Data.id;
				var row_pr_data  = data.Data;
				//$scope.defaultProperty = data.Data.item;
			//	console.log(JSON.stringify(data.Data));
				var ope_arr = []; var enum_opp = [];
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
				$scope.defaultProperty = $scope.process_final;
				//console.log(JSON.stringify($scope.process_final));
				
			});
	}
	
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
			$scope.defaultProperty[index].data.push({"propertytype":"Interval","propertyname":"Interval","userpropertyname":"Interval","type":"","value":"","operations":[],"units":"","type":""});
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
	$scope.editRAMLSave = function()
	{
		
		$scope.saveproperties = [];
		$scope.savesubproperties = [];
		var property_name = "";
		var obj = "";
		$scope.en_savedata =[];
		angular.forEach($scope.defaultProperty, function(mainarr,mkey) {
				obj = [];
				angular.forEach(mainarr.data, function(subarr,skey) {
				
				if(skey == 0)
				{	
					if(subarr.type == 'boolean')
						$scope.saveproperties.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations});	
					else if(subarr.type == 'string')
					{		$scope.en_savedata =[];	
							 if(subarr.enum.length>0){
							  for(var k in subarr.enum)
								{
									$scope.en_savedata.push(subarr.enum[k].value); 	  
								}
							}
							$scope.saveproperties.push({"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"enum":$scope.en_savedata});	
					}
					else
					$scope.saveproperties.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations});	
					
					property_name = subarr.userpropertyname;
				}
				else{
					
					if(subarr.propertytype == "Units"){
						obj.push({"operations":subarr.operations,"units":subarr.sub_property,"type":subarr.type,"subpropertyname":subarr.userpropertyname,"propertytype":subarr.propertytype});
					}
					else if(subarr.propertytype == "Interval"){
						obj.push({"operations":subarr.operations,"units":subarr.units,"subpropertyname":subarr.userpropertyname,"type":subarr.type,"value":subarr.value,"propertytype":subarr.propertytype});
					}
					else if(subarr.propertytype == "Threshold"){
						obj.push({"operations":subarr.operations,"value":subarr.thresholdValue,"subpropertyname":subarr.userpropertyname,"type":subarr.type,"propertytype":subarr.propertytype});
					}
					else{
							if(subarr.type == 'boolean')
								obj.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});	
							else if(subarr.type == 'string')
							{		$scope.en_savedata =[];
									 if(subarr.enum.length>0){
									  for(var k in subarr.enum)
										{
											$scope.en_savedata.push(subarr.enum[k].value); 	  
										}
									}
									obj.push({"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"enum":$scope.en_savedata,"propertytype":subarr.propertytype});	
							}
							else
								obj.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});								
								
					}	
					
				}//else end key
				
			});
			$scope.savesubproperties.push({"parent":property_name,"subproperties":obj});
			
		});
		$scope.finalData = {"name":$scope.editraml.name,"description":$scope.editraml.description,"properties":$scope.saveproperties,"subproperties":$scope.savesubproperties,"item":[]}; //"item":$scope.defaultProperty
	//	console.log(JSON.stringify($scope.finalData));
		$timeout(function(){				
				
				ramlpropertiesModuleService.putRAMLDefinitionTemplate($scope.finalData,$scope.editraml.id).then(function(data)
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
						$rootScope.$broadcast('updateList',{"record":"updated"});
					}				
					

				});		
					
		},100);
		
	}
	
	

});