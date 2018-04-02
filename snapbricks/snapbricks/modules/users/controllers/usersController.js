var userModule = angular.module('userModule.controllers', ['ui.bootstrap','ngSanitize','ngMaterial']);
userModule.controller('userCtrl', function ($scope, $rootScope, userModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,$mdDialog,CustomMessages) {

    /*	Data Attribute Initialize Function of Users
     Dynamic Generic Function for Initialize Data Attributes
     */
	$rootScope.globals = $cookieStore.get('globals') || {};
	
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
    }
	$scope.refreshFunc = function(){
		$state.reload();
	};
	$scope.create = function(user){
		if(user != ""){
			
				localStorage.setItem('userselectedInfo',JSON.stringify(user));
			
		}
			$location.path('users/adduser');
	};
	$scope.role = function(){
		
			$location.path('users/role');
	};
	$scope.userCall = function(pageno){
			$scope.datausersLoading = true;
			$scope.userList = [];
			$scope.currentuserPage=pageno;
			 $scope.userPerPage=10;
			 
				userModuleService.getUsersList(pageno).then(function (data) {
					
					$timeout(function(){
						$scope.userList = data.Data;
						$scope.totaluserItems =  data.total_records;
						
						$scope.datausersLoading = false;
						$scope.checkAll = function (selectedAll) {
							$scope.selectedAll = selectedAll;
							if ($scope.selectedAll) {
								$scope.selectedAll = true;
							} else {
								$scope.selectedAll = false;
							}
							 $scope.arrCheckboxSelection = [];
						   angular.forEach($scope.userList, function (user) {
							   if($scope.selectedAll== true){
								  $scope.arrCheckboxSelection.push(user.id);
							   }else{
								   $scope.arrCheckboxSelection.splice(user.id,1);
							   }
								user.userSelected = $scope.selectedAll;
						   });
						};	
					});
					
					
					
				}).catch(function(error){
					$scope.datausersLoading = false;
					$scope.totaluserItems =0;
				});
				$scope.checkStatus= function(user) {
            
			 user.userSelected = !user.userSelected;
        };
				$scope.selectedRow = null;$scope.arrCheckboxSelection = [];
				$scope.setClickedRow = function(index,user){
					$scope.selectedRow = index;
					$scope.selectedRowUser = user;
					
					
					//console.log($scope.selectedRow);
					if(user.userSelected == true)
					{
						user.userSelected=false;
						$scope.arrCheckboxSelection.splice(user.id,1);
						
					}else{
						user.userSelected=true;
						$scope.arrCheckboxSelection.push(user.id);
					}
					
				};
	};
	$scope.userCall(1);
	//------------------------------------------------------------------------------------------------
	
		var data4UserObject = 'user';
		var data4UserDesignation = {"fields":"designation","orgid_id":$scope.orgid};
		var data4Username={"fields":"username","orgid_id":$scope.orgid,"is_deleted":"false"};


		userModuleService.getAllDesignation(data4UserObject,data4Username).then(function (data) {
			$scope.username_all = data.Data;
			
			if($scope.username_all != undefined || $scope.username_all != ""){
				
			
			var arr = JSON.stringify($scope.username_all);
			
			var arr2 = JSON.parse(arr);
			for (var i = 0; i<arr2.length; i++) {
				arr2[i].label = arr2[i].username;
				
				delete arr2[i].username;
				
			}
			//console.log(arr2);
			$scope.jsonFormatData = arr2;
			}
			
		});


		$scope.completeUnameSearch=function(){
		
		//console.log($scope.jsonFormatData);
		
			$( "#unameSearch" ).autocomplete({
			appendTo: "#myModal",    // <-- do this
			open:function(event){

				var target = $(event.target); 
				var widget = target.autocomplete("widget");
				widget.zIndex(target.zIndex() + 1); 

			},
			close: function (event, ui){
				$(this).autocomplete("option","appendTo","#myModal");  // <-- and do this  
			},	
			source: $scope.jsonFormatData,
			autoFocus: false,
			select: function(event,ui){
			  $timeout(function(){
				  event.preventDefault();
				//console.log(ui.item);
				var UIvalue = ui.item.value;
				var UIlabel = ui.item.label;
				//console.log(ui.item);
				
				 $( "#unameSearch"  ).val(UIlabel);
				 
				
				
				
				 });
				
				
				return false;
				},
			});
		   
		};
		userModuleService.getAllDesignation(data4UserObject,data4UserDesignation).then(function (data) {
			$scope.designation_all = data.Data;
		});
		


		$scope.searchFeaturesSubmit = function(){
			
			$scope.params={};
			if($scope.unameSearch != undefined && $scope.unameSearch != "" && $scope.unameSearch != null)
			{
				
				$scope.params.username=$scope.unameSearch;
				
				
			}
			if($scope.designationSearch != undefined && $scope.designationSearch != "" && $scope.designationSearch != null)
			{
				
				
				$scope.params.designation=$scope.designationSearch;
				
			}
			//console.log($scope.params);
			$scope.getDataUser(1,$scope.params);
			
		};	
		$scope.getDataUser = function(pageno,params){
	//	console.log("params in fun")
			$scope.userList = [];
			$scope.currentuserPage = pageno;

			$scope.userPerPage = ENV.recordPerPage;
			$scope.dataLoading = true;
			userModuleService.getUserList(pageno,params).then(function (data) {
				
				$timeout(function(){
				$scope.dataLoading = false;	
				
			   
				
				
				//console.log(data.Data);
				if(data.Data != undefined){
						$scope.userList = data.Data;
						$scope.totalItems =  data.total_records;
						//console.log($scope.gatewayList);
						
				}else{
						$scope.totalItems = 0;
				}
				
				//$scope.totalItems = data.content.length;
				// function to Sort NotificationList By Created Date
				/*$scope.gatewayList.sort(function (a, b) {
					var dateA = new Date(a.last_event_time), dateB = new Date(b.last_event_time);
					return dateB - dateA;
				});*/
				});
		 }).catch(function(error){
			 $scope.totalItems = 0;
			 $scope.dataLoading = false;	
		 });
		};





	//=-------------------------------------------------------------------------------------------------------------------
	$scope.openInfo = function(statusRes,user,userId,ev){
		var arr = [];
		
var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
            }})

			 
          .title(CustomMessages.MD_DELETE_USER_TITLE)
          .textContent(CustomMessages.MD_DELETE_USER_TEXT_CONTENT)
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .ok(CustomMessages.MD_GENERAL_OK)
          .cancel(CustomMessages.MD_GENERAL_CANCEL);


	 $mdDialog.show(confirm).then(function() {
		
		if(userId != undefined && userId != '')
		{
			
			 arr.push(userId);
			 
		}else{
			
		
		
		for(var i in user){
			
		   if(user[i].userSelected==true){
			 
				
			   arr.push(user[i].id);
		   }
		}
		
		}
		
		userModuleService.sendRequest(arr,statusRes).then(function(data){
			
			if(statusRes =='activate')
			{
				toaster.pop('success','',data.message);
			}
			else if(statusRes =='deactivate')
			{
				toaster.pop('info','',data.message);
			}
			else{
				toaster.pop('info','',data.message);
			}
			$state.reload();
		});
	 });
		
		
		
		
		
		
	};
	$scope.pageChanged = function(){

				//console.log($scope.currentgroupPage);
				$scope.userCall($scope.currentuserPage);
			};
			
});
userModule.controller('UserCreateEditCtrl', function ($scope, $rootScope, userModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster) {
	//console.log($scope.userselectedInfo);
	$rootScope.globals = $cookieStore.get('globals') || {};
	
    if (!$rootScope.globals.currentUser) {
		//console.log($rootScope.globals);
	    $location.path('/login');
    } else {
		//console.log($rootScope.globals.currentUser);
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
		$scope.logginId =  $rootScope.globals.currentUser.id;
    }
	
	
	$scope.userData = {};
	if($scope.userselectedInfo != undefined && $scope.userselectedInfo != "undefined")
	{
	
		$scope.userData.email = $scope.userselectedInfo.email;
		$scope.userData.role = $scope.userselectedInfo.role;
		$scope.userData.isactive = $scope.userselectedInfo.isactive;
		$scope.userData.username = $scope.userselectedInfo.username;
		$scope.userData.designation = $scope.userselectedInfo.designation;
		$scope.userData.permissions = $scope.userselectedInfo.permissions;
		$scope.userData.orgid = $scope.userselectedInfo.orgid;
	}
	
	userModuleService.getAllRoles().then(function (data) {
		$scope.allRoles = data.Data;
		$scope.allRolesCount=$scope.allRoles.length;
		if($scope.userData.role != undefined)
		{
			$scope.userrole = $scope.userData.role;
			
			angular.forEach($scope.allRoles, function (userRole) {
			for(var j=0;j<$scope.userrole.length;j++){
				if($scope.userrole[j] == userRole.id){
					userRole.checked = true;
				}
			}
			});
		}
	}).catch(function(error){
	$scope.allRolesCount=0;
	});
	if($scope.userData.isactive == undefined){
		$scope.userData.isactive=true;
	}
	
	
	
	$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
	$scope.saveApplication = function(allRoles,userId){
		//console.log(allRoles);return false;
		$scope.dataLoading = true;
		var arr = [];
		for(var i in allRoles){
			
		   if(allRoles[i].checked==true){
			 
			 
			   arr.push(allRoles[i].id);
		   }
		}
		if(userId == undefined || userId == ""){
			$scope.userData.orgid = $scope.orgid;
		}
		//console.log(arr);return false;
		$scope.userData.role = arr;
		
		
		//$scope.userData.clientname ="N/A";
		//$scope.userData.ipaddresslist =["127.0.0.1","127.1.1.0"];
		//$scope.userData.createdby ="N/A";
		//$scope.userData.modifiedby = "N/A";
		//$scope.userData.is_deleted = false;
		if($scope.userData.email != undefined)
		{
			
		
		userModuleService.postUserData($scope.userData,userId).then(function(data){
				
				//return false;
			//	console.log(data);
				$scope.dataLoading=false;
				if(data.status ==400 )
				{
					if(data.data.error.email != undefined){
							if(data.data.error.email.length ==1)
							{
								toaster.pop('error','',"Email :: "+data.data.error.email);
							}
					}else{
						toaster.pop('error','',data.data.error);
					}
					
					
				}
				else{
					
				$scope.dataLoading=false;
				toaster.pop('success','',data.message);
				$location.path('users');
				}
		})/*.catch(function(response){
			if(response.status ==400){
			toaster.pop('error','',"Email :: "+response.data.error.email);	
			return false;
			}
		
		})*/;
		}
		
	};
	
	
});