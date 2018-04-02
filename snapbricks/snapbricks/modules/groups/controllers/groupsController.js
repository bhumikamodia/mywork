var groupModule = angular.module('groupModule.controllers', ['ui.bootstrap','ngSanitize','ngMaterial']);

groupModule.controller('groupCtrl', function ($scope, $rootScope, groupModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,$mdDialog,CustomMessages) {

    /*	Data Attribute Initialize Function of Group
     Dynamic Generic Function for Initialize Data Attributes
     */
	$rootScope.globals = $cookieStore.get('globals') || {};
	
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
    }
	$scope.refreshFunc = function(){
		$state.reload();
	};
	$scope.create = function(group){
		if(group != ""){
			
				localStorage.setItem('groupselectedInfo',JSON.stringify(group));
			
		}
			$location.path('groups/addgroup');
	};
	$scope.deleteGroup = function(groupID,ev){
		 var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($cancelButton).addClass('md-focused');
                        angular.element($confirmButton).removeClass('md-focused');
                        $cancelButton.focus();
            }})
          .title(CustomMessages.MD_GROUP_DELETE_TITLE)
          .textContent(CustomMessages.MD_GROUP_DELETE_TEXT_CONTENT)
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .cancel(CustomMessages.MD_GENERAL_CANCEL)
          .ok(CustomMessages.MD_GENERAL_OK);
         
	 $mdDialog.show(confirm).then(function() {
			$scope.dataGroupsLoading = true;
			if(groupModuleService.DeleteGroupRequest(groupID))
			{
				$timeout(function(){
				toaster.pop('success', "", CustomMessages.GROUP_DELETE_POST_SUCCESS);
				$state.reload();	
				},2000);
			
				
			} 
	 });
			
	};
	$scope.groupCall = function(pageno){
			$scope.dataGroupsLoading = true;
			$scope.groupList = [];
			$scope.currentgroupPage=pageno;
			 $scope.groupPerPage=10;
			 
				groupModuleService.getGroupsList(pageno).then(function (data) {
					
					$timeout(function(){
						$scope.groupList = data.Data;
						$scope.totalgroupItems =  data.total_records;
						
						$scope.dataGroupsLoading = false;
						
						
						$scope.checkAll = function (selectedAll) {
							$scope.selectedAll = selectedAll;
							if ($scope.selectedAll) {
								$scope.selectedAll = true;
							} else {
								$scope.selectedAll = false;
							}
						   angular.forEach($scope.groupList, function (group) {
								group.groupSelected = $scope.selectedAll;
						   });
						};	
					});
					
					
					
				}).catch(function(error){
					$scope.dataGroupsLoading = false;
					$scope.totalgroupItems =0;
				});
				
				$scope.selectedRow = null;
				$scope.setClickedRow = function(index,group){
					$scope.selectedRow = index;
					$scope.selectedRowGroup = group;
					//console.log(gatewayInfo);
					//console.log($scope.selectedRow);
					if(group.groupSelected == true)
					{
						group.groupSelected=false;
					}else{
						group.groupSelected=true;
					}
				};
	};
	 $scope.pageChanged = function(){

				//console.log($scope.currentgroupPage);
				$scope.groupCall($scope.currentgroupPage);
			};
	$scope.groupCall(1);
	
});


		
groupModule.controller('GroupCreateEditCtrl', function ($scope, $rootScope, groupModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,CustomMessages) {
//console.log($scope.ruleEngineselectedInfo);



    $scope.selectedNode = "";
	if($scope.groupselectedInfo != undefined){
		$scope.groupName = $scope.groupselectedInfo.groupname;
		$scope.groupDescription = $scope.groupselectedInfo.description;
		$scope.groupId = $scope.groupselectedInfo.id;
	}
buildEmptyTree($scope.groupId);	
  $scope.saveGroup = function(groupId){
		//console.log($('#container11').jstree(true).get_selected());
		//console.log($("#container11").jstree("get_selected").toString());
		var parentGroups = $("#container11").jstree("get_selected").toString();
		
		if($scope.groupName == undefined || $scope.groupDescription == undefined)
		{
			toaster.pop('error', "", CustomMessages.GROUP_BLANK_ERROR);
			return false;
		}
		if(parentGroups != "" && parentGroups != "[object Object]")
		{
			var str_array = parentGroups.split(',');
			var parentID = "";
			if(str_array[0] != "")
			{
				if(str_array[0] == $scope.groupId)
				{
					 var parentData = $("#container11").jstree(true).get_node($scope.groupId).original;
					// console.log();
					parentID = parentData.parent;
				}
				else{
					parentID = str_array[0];
				}
			}
		}
		
		//console.log(parentID);
		//console.log($scope.groupId);
		//return false;
		if(parentID == $scope.groupId)
		{
			parentID ="";
		}
		if(parentID == undefined){
			parentID ="";
		}
		$scope.parentID = parentID;
		
		if(groupId != undefined)
		{
				groupModuleService.EditGroupRequest($scope.groupName,$scope.groupDescription,$scope.parentID,groupId).then(function(data){
				
					
						toaster.pop('success', "", CustomMessages.GROUP_UPDATE_POST_SUCCESS);
						$location.path('groups');
				
			
				});
		}else{
				groupModuleService.AddGroupRequest($scope.groupName,$scope.groupDescription,$scope.parentID).then(function(data){
				
						toaster.pop('success', "", CustomMessages.GROUP_INSERT_POST_SUCCESS);
						$location.path('groups');
					
				});
		}
		
		
  };

 function buildEmptyTree(groupId) {

           
 groupModuleService.getGroupsData().then(function(data){
				
				$scope.displayTree = data;
				var arr = JSON.stringify($scope.displayTree);
						
						var arr2 = JSON.parse(arr);
						for (var i = 0; i<arr2.length; i++) {
							
							delete arr2[i].parent;
							
						}
						//console.log(arr2);
						$scope.jsonFormatData = arr2;
		


				var j1 =  angular.element('#container11')
				.bind("loaded.jstree", function (event, data) {
					//console.log( data);
					$(this).jstree("open_all");
				 })
				 
				 .on("ready.jstree", function(e, data) {
					  $('#container11').jstree("select_node", groupId);
					  $("#container11").jstree(true).disable_node(groupId);
					 var parentData = $("#container11").jstree(true).get_node(groupId).original;
						
						 var nodeData = data.instance.get_node(groupId);
						//console.log(nodeData);
						
						if(nodeData)
						{	//console.log(nodeData.children_d);
							for(var i=0;i<nodeData.children_d.length;i++)
							{
									$("#container11").jstree(true).disable_node(nodeData.children_d[i]);
							}
						}
				 }) 
				 .on('create_node.jstree', function (e, data) {

					

			   
				})
				.on('open_node.jstree', function (e, data) { data.instance.set_icon(data.node, "glyphicon glyphicon-minus-sign");}) 
				.on('close_node.jstree', function (e, data) { data.instance.set_icon(data.node, "glyphicon glyphicon-plus-sign");})
				.on('changed.jstree', function (e, data) {
				   
				  
					 var node = data.instance.get_node(data.selected[0])
					//console.log(node);
					
				}).jstree({
					
				"plugins" : [ "themes", "html_data", "crrm", "dnd", "types"],
				
				'core' : {
					 "themes":{
						 
						  "dots": true,
						"icons":false
					},
				  'data' : $scope.jsonFormatData,
				   
				  'multiple': false,
				  
				},
				 checkbox: {       
				  three_state : false, // to avoid that fact that checking a node also check others
				  whole_node : false,  // to avoid checking the box just clicking the node 
				  
				},
				 
				 
				types: {
				
				"root": {
				  "icon" : "glyphicon glyphicon-plus-sign"
				},
				"child": {
				  "icon" : "glyphicon glyphicon-leaf"
				},
				
				"default" : {
				  "icon" : 'glyphicon glyphicon-minus-sign'
				}
			  },
				 
				 
			  }); 		
					
		});   
   
    }

});
