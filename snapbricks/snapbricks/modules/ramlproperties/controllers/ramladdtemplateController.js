var ramlpropertiesModule4 = angular.module('ramlpropertiesModule.controllers');
//&&&&&&&&&&&&&&&&&&&&&&&&&&ramlpropertiesCtrl&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

ramlpropertiesModule4.controller('ramladdtemplateCtrl', function ($scope, $rootScope, ramlpropertiesModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window, $state,toaster,$mdDialog,CustomMessages) {

	$scope.Addraml = {"name":"","description":""};
	$scope.defaultProperty= [];
	$scope.defaultProperty.push({"ope_arr":["other"],"data":[{"propertytype":"other","propertyname":"","userpropertyname":"","type":"","operations":[],"enum":[],"minimum":"","maximum":"","unit":""}]});
	
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
	$scope.removepropertynameData = function(propertyIndex){
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
	$scope.SaveRML = function()
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
					//$scope.saveproperties.push({"units":subarr.unit,"minimum":subarr.minimum,"maximum":subarr.maximum,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations});	
				
					property_name = subarr.userpropertyname;
				}
				else{
					
					if(subarr.propertytype == "Units"){
						obj.push({"operations":subarr.operations,"units":subarr.sub_property,"type":subarr.type,"subpropertyname":subarr.userpropertyname,"propertytype":subarr.propertytype});
					}
					else if(subarr.propertytype == "Interval"){
						obj.push({"operations":subarr.operations,"value":subarr.value,"units":subarr.units,"subpropertyname":subarr.userpropertyname,"type":subarr.type,"propertytype":subarr.propertytype});
					}
					else if(subarr.propertytype == "Threshold"){
						obj.push({"operations":subarr.operations,"value":subarr.thresholdValue,"subpropertyname":subarr.userpropertyname,"type":subarr.type,"propertytype":subarr.propertytype});
					}
					else{
							if(subarr.type == 'boolean')
								obj.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});	
							else if(subarr.type == 'string')
							{
									 if(subarr.enum.length>0){
										 $scope.en_savedata =[];
									  for(var k in subarr.enum)
										{
											$scope.en_savedata.push(subarr.enum[k].value); 	  
										}
									}
									obj.push({"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"enum":$scope.en_savedata,"propertytype":subarr.propertytype});	
							}
							else
								obj.push({"units":subarr.unit,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});	
								//obj.push({"units":subarr.unit,"minimum":subarr.minimum,"maximum":subarr.maximum,"type":subarr.type,"propertyname":subarr.userpropertyname,"operations":subarr.operations,"propertytype":subarr.propertytype});	
					}	
					
				}//else end key
				
			});
			$scope.savesubproperties.push({"parent":property_name,"subproperties":obj});
			
		});
		$scope.finalData = {"name":$scope.Addraml.name,"description":$scope.Addraml.description,"properties":$scope.saveproperties,"subproperties":$scope.savesubproperties,"item":[]}; //item :$scope.defaultProperty
		$timeout(function(){				
				
				ramlpropertiesModuleService.postRAMLDefinitionTemplate($scope.finalData).then(function(data)
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
	//	console.log(JSON.stringify($scope.finalData));
	}
});