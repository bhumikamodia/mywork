var roleModule = angular.module('roleModule.controllers', ['ui.bootstrap','ngSanitize','ngMaterial']);
roleModule.controller('userRoleCtrl',function($scope,$rootScope,roleModuleService, ENV, $cookieStore,$location,$filter,$timeout,$window,$state,toaster,$mdDialog,CustomMessages){
	
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

	$scope.create = function(){

		localStorage.setItem('userRoleselectedInfo',null);
		$location.path('role/addrole');
	
	};
	$scope.edit = function(userRole,ev){

        //console.log(userRole.id);
    
      
      //(userRole!= ""){
         if(userRole!=""){    
            localStorage.setItem('userRoleselectedInfo',JSON.stringify(userRole));
            //**********************
  
   //alert("roleid is "+userRole.id);


roleModuleService.roleEditNotification(userRole).then(function(data){

 //alert("Data is " + data.Data)
  if(data.Data != "")
  {
 var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
            }})
          .title(CustomMessages.MD_EDIT_ROLE_TITLE)
          .textContent(CustomMessages.MD_EDIT_ROLE_TEXT_CONTENT+data.Data + " ")
          //.textContent(CustomMessages.MD_EDIT_ROLE_TEXT_CONTENT)
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .cancel(CustomMessages.MD_GENERAL_CANCEL)
          .ok(CustomMessages.MD_GENERAL_OK);
     $mdDialog.show(confirm).then(function() {

 //alert ("Now do");
  $location.path('role/addrole');
     });
 }

 else
  {
     var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
            }})
          .title(CustomMessages.MD_EDIT_ROLE_TITLE)
          .textContent(CustomMessages.MD_EDIT_ROLE_TEXT_CONTENT_2)
          //.textContent(CustomMessages.MD_EDIT_ROLE_TEXT_CONTENT)
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .cancel(CustomMessages.MD_GENERAL_CANCEL)
          .ok(CustomMessages.MD_GENERAL_OK);
     $mdDialog.show(confirm).then(function() {

 //alert ("Now do");
  $location.path('role/addrole');
     });

 }
    

        });
            
    }
    
    };



	$scope.userRoleCall = function(pageno){
			$scope.datauserRolesLoading = true;
			$scope.userRoleList = [];
			$scope.currentuserRolePage=pageno;
			 $scope.userRolePerPage=10;
			 
				roleModuleService.getUserRolesList(pageno).then(function (data) {
					
					$timeout(function(){
						$scope.userRoleList = data.Data;
						$scope.totaluserRoleItems =  data.total_records;
						$scope.datauserRolesLoading = false;
					});
					
					
					
				}).catch(function(error){
					$scope.datauserRolesLoading = false;
					$scope.totaluserRoleItems =0;
				});
				$scope.checkStatus= function(user) {
            
					user.userSelected = !user.userSelected;
				};
				$scope.selectedRow = null;
				$scope.setClickedRow = function(index,user){
					$scope.selectedRow = index;
					$scope.selectedRowUser = user;
					
					//console.log($scope.selectedRow);
					if(user.userSelected == true)
					{
						user.userSelected=false;
						
						
					}else{
						user.userSelected=true;
						
					}
					
				};
	};
	$scope.userRoleCall(1);
	$scope.openInfo = function(statusRes,userId,ev){
		 var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
            }})
          .title(CustomMessages.MD_DELETE_ROLE_TITLE)
          .textContent(CustomMessages.MD_DELETE_ROLE_TEXT_CONTENT)
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .cancel(CustomMessages.MD_GENERAL_CANCEL)
          .ok(CustomMessages.MD_GENERAL_OK);
	 $mdDialog.show(confirm).then(function() {
		 var arr = [];
		if(userId != undefined)
		{
			 arr.push(userId);
		}
		roleModuleService.sendRoleRequest(userId,statusRes).then(function(data){
		
		/*if(data.message != undefined){
			$scope.message = data.message;
		};	
		if(data.Data != undefined){
			$scope.message += ": "+data.Data;
		};*/
		
		if(data.Data != undefined && data.message != undefined){
			  $mdDialog.show(
				  $mdDialog.alert()
					.clickOutsideToClose(true)
					.title(data.message+": \n ")
					.textContent(data.Data + " ")
				  //  .textContent(data.message +":-    \n "+ data.Data)
					.ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL_1)
					.ok(CustomMessages.MD_GENERAL_GOT_IT)
					.targetEvent(ev)
				);		
		};	
			//	toaster.pop('info','',$scope.message);
			$scope.userRoleCall($scope.currentuserRolePage);
				
		});
	 });
	
		
	
	};
	$scope.pageChanged = function(){

				//console.log($scope.currentuserRolePage);
				$scope.userRoleCall($scope.currentuserRolePage);
			};
});

roleModule.controller('UserRoleCreateEditCtrl', function ($scope, $rootScope, roleModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,CustomMessages) {
	//console.log($scope.userRoleselectedInfo);
	$rootScope.globals = $cookieStore.get('globals') || {};
	
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.id = $rootScope.globals.currentUser.id;
    }
	$scope.userData = {};
	if($scope.userRoleselectedInfo != undefined && $scope.userRoleselectedInfo != "undefined")
	{	
		$scope.userData.roles = $scope.userRoleselectedInfo.roles;
		$scope.userData.scope = $scope.userRoleselectedInfo.scope;
		$scope.userData.id=$scope.userRoleselectedInfo.id;
		$scope.userData.permissions = $scope.userRoleselectedInfo.permissions;
		//console.log($scope.userData.permissions);
		
	}
	$scope.dataallRolesLoading = true;
	roleModuleService.getAllAPIGroupsPermission($scope.id).then(function (data) {
		$scope.allRoles = data.Data;
			//console.log($scope.allRoles);
			$scope.dataallRolesLoading = false;
			$scope.userData.permissions = $filter('unique')($scope.userData.permissions);
		if($scope.userData.permissions != undefined)
		{
			
			$scope.userrolepermission = $scope.userData.permissions;
			//console.log($scope.allRoles);
			angular.forEach($scope.allRoles, function (userRole) {
			var counter = 0;
			userRole.permissions = $filter('unique')(userRole.permissions);
			for(var k=0;k<userRole.permissions.length;k++)
			{
				
			var apisData =	userRole.permissions[k];
			
			for(var j=0;j<$scope.userrolepermission.length;j++){
				
				if($scope.userrolepermission[j].id == apisData.id){
					
					counter++;
					apisData.checked = true;
					
				}
			}
			//console.log($scope.userrole.length);
			//console.log(userRole.apis.length);
			//console.log(counter);
			
				
			}
			//console.log("k" +  k)
			
			if(counter==userRole.permissions.length)
			{
				//console.log("counter1" + counter);
				
				userRole.checked = true;
			}
			
			});
		}
	}).catch(function(error){
	$scope.dataallRolesLoading = false;
	});
	
	$scope.saveApplication = function(allRoles,userId){
		$scope.dataLoading = true;
		var arr = [];
		for(var i in allRoles){
			var allRolesInner = allRoles[i];
		   var allRolesInnerAPIs= allRolesInner.permissions;
			   if(allRolesInnerAPIs.length>0)
			   {
				   
			   
				for (var j in allRolesInnerAPIs){
					if(allRolesInnerAPIs[j].checked==true){
					arr.push(allRolesInnerAPIs[j].id);
					}
				}
			   } 
		   
		}
		$scope.userData.scope = ["ORG","SYSTEM"];
		$scope.userData.permissions = arr;
		if($scope.userData.permissions.length<=0)
		{
			toaster.pop('error','',CustomMessages.ROLE_PERMISSION_ERROR);
			$scope.dataLoading = false;
			return false;
		}
		if($scope.userData.roles != undefined && $scope.userData.scope != undefined && $scope.userData.permissions.length>0 )
		{
			
		
		roleModuleService.postRoleData($scope.userData,userId).then(function(data){
			
			if(data.status == 400)
			{
				$scope.dataLoading=false;
				//console.log(data);
				toaster.pop('error','',data.data.error.non_field_errors[0]);
			}else{
				$scope.dataLoading=false;
				toaster.pop('success','',data.message);
				$location.path('role');
			}
		
		});
		}
		
	};
	
	
});