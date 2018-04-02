var applicationModule = angular.module('applicationModule.controllers', ['ui.bootstrap','ngSanitize','ngMaterial']);

applicationModule.controller('applicationCtrl', function ($scope, $rootScope, applicationModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,$mdDialog,CustomMessages) {

    /*	Data Attribute Initialize Function of Application
     Dynamic Generic Function for Initialize Data Attributes
     */
	$rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
    }
	$scope.refreshFunc = function(){
		$state.reload();
	};
	$scope.create = function(application){
		if(application != ""){
			
				localStorage.setItem('applicationselectedInfo',JSON.stringify(application));
			
		}
			$location.path('applications/addapplication');
	};	
	$scope.deleteApplication = function(applicationId,ev){
		var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
            }})
          .title(CustomMessages.MD_DELETE_APPLICATION_TITLE)
          .textContent(CustomMessages.MD_DELETE_APPLICATION_TEXT_CONTENT)
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .ok(CustomMessages.MD_GENERAL_OK)
          .cancel(CustomMessages.MD_GENERAL_CANCEL);
	 $mdDialog.show(confirm).then(function() {
		 $scope.dataapplicationsLoading = true;
			if(applicationModuleService.DeleteApplication(applicationId))
			{
				$timeout(function(){
				toaster.pop('success', "", CustomMessages.APPLICATION_SUCCESSFULLY_DELETED);
				$state.reload();	
				},2000);
			
				
			}
	 });
	
	};
	$scope.openInfo = function(statusText,application){
		if(application != ""){
			
				localStorage.setItem('applicationselectedInfo',JSON.stringify(application));
			
		}
		$location.path('applications/'+statusText);
	};
	$scope.applicationCall = function(pageno){
			$scope.dataapplicationsLoading = true;
			$scope.applicationList = [];
			$scope.currentapplicationPage=pageno;
			 $scope.applicationPerPage=10;
			 
				applicationModuleService.getApplicationsList(pageno).then(function (data) {
					
					$timeout(function(){
						if(data.Data != undefined){
							$scope.applicationList = data.Data;
							$scope.totalapplicationItems =  data.total_records;
							
							
							$scope.dataapplicationsLoading = false;
							
							$scope.checkAll = function (selectedAll) {
								$scope.selectedAll = selectedAll;
								if ($scope.selectedAll) {
									$scope.selectedAll = true;
								} else {
									$scope.selectedAll = false;
								}
							   angular.forEach($scope.applicationList, function (application) {
									application.applicationSelected = $scope.selectedAll;
							   });
							};	
						}else{
								$scope.dataapplicationsLoading = false;
								$scope.totalapplicationItems =0;
						}
						
					});
					
					
					
				}).catch(function(error){
					$scope.dataapplicationsLoading = false;
					$scope.totalapplicationItems =0;
				});
				
				$scope.selectedRow = null;
				$scope.setClickedRow = function(index,application){
					$scope.selectedRow = index;
					$scope.selectedRowApplication = application;
					
					if(application.applicationSelected == true)
					{
						application.applicationSelected=false;
					}else{
						application.applicationSelected=true;
					}
				};
				
	};
	$scope.changeStatusApplication = function(statusParameter,application,ev){
		var confirm = $mdDialog.confirm()
          .title('Are you sure want to '+statusParameter+' application - '+application.orgname+'?')
          .textContent(CustomMessages.MD_DELETE_APPLICATION_TEXT_CONTENT1)
          .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
          .targetEvent(ev)
          .ok(CustomMessages.MD_GENERAL_OK)
          .cancel(CustomMessages.MD_GENERAL_CANCEL);
	 $mdDialog.show(confirm).then(function() {
		if(statusParameter == 'activate')
		{
			application.is_active = true;
		}else{
			application.is_active = false;
		}
			
		applicationModuleService.statusApplicationChangeRequest(statusParameter,application).then(function (data) {
			
		});
	 });
	};
	$scope.applicationCall(1);
	$scope.pageChanged = function(){

				$scope.applicationCall($scope.currentapplicationPage);
			};		
});
applicationModule.controller('ApplicationCreateEditCtrl', function ($scope, $rootScope, applicationModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,CustomMessages) {
$rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
	    $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
		$scope.orgid = $rootScope.globals.currentUser.orgid;
    }
$scope.organisationData = {};
if($scope.applicationselectedInfo != undefined && $scope.applicationselectedInfo != "undefined")
{
	//console.log($scope.applicationselectedInfo);
	$scope.organisationData.orgname = $scope.applicationselectedInfo.orgname;
	$scope.organisationData.email = $scope.applicationselectedInfo.email;
	$scope.organisationData.address = $scope.applicationselectedInfo.address;
	$scope.organisationData.description = $scope.applicationselectedInfo.description;
	$scope.organisationData.url_server = $scope.applicationselectedInfo.url_server;
	$scope.organisationData.dbdetails = $scope.applicationselectedInfo.dbdetails;
}
$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;


$scope.subscriptionCall = function(pageno){
			
			$scope.subscriptionList = [];
			$scope.currentSubscriptionPage=pageno;
			 $scope.subscriptionPerPage=10;
			 
applicationModuleService.getAPIGroups(pageno).then(function(data){
	$scope.subscriptionList = data.Data;
if($scope.applicationselectedInfo != undefined){
if($scope.applicationselectedInfo.subscription.length>0 && $scope.applicationselectedInfo.subscription != undefined)
{
				var subscriptionData = $scope.applicationselectedInfo.subscription;
				angular.forEach($scope.subscriptionList, function (subscription) {
						for(var i =0; i <subscriptionData.length;i++)
						{
								
								if(subscriptionData[i] == subscription.id)
								{
										subscription.subscriptionSelected = true;
										subscription.checked = true;
								}
						}
				});
	
}
}	
	$scope.totalSubscriptionItems = data.total_records;
	
	
});
};
$scope.checkStatus= function(subscription) {
	
		subscription.subscriptionSelected = !subscription.subscriptionSelected;
		
    };
$scope.checkAll = function (selectedAll) {
							
							$scope.selectedAll = selectedAll;
							if ($scope.selectedAll) {
								$scope.selectedAll = true;
							} else {
								$scope.selectedAll = false;
							}
						   angular.forEach($scope.subscriptionList, function (subscription) {
							//  if(subscription.checked ==undefined)
							//	{
									subscription.subscriptionSelected = $scope.selectedAll;
							//	}
						   });
						};	
	$scope.selectedRow = null;
	$scope.setClickedRow = function(index,subscription){
		$scope.selectedRow = index;
		$scope.selectedRowSubscription = subscription;
	
		if(subscription.subscriptionSelected == true)
		{
			subscription.subscriptionSelected=false;
		}else{
			subscription.subscriptionSelected=true;
		}
		
	};
	$scope.subscriptionCall(1);
	$scope.pageChanged = function(){

					$scope.subscriptionCall($scope.currentSubscriptionPage);
	};				


$scope.saveApplication = function(subscriptionList,applicationId){
	$scope.dataLoading = true;
	 var arr = [];
		for(var i in subscriptionList){
			
		   if(subscriptionList[i].subscriptionSelected==true){
			 
			 
			   arr.push(subscriptionList[i].id);
		   }
		}
	if(arr.length!==0)
		{
			$scope.organisationData.subscription = arr;
		}
	if(applicationId != undefined)
	{
		$scope.organisationData.id = applicationId;
		$scope.organisationData.createdby = "N/A";
		$scope.organisationData.modified_by = "N/A";
		if($scope.organisationData.orgname != undefined && $scope.organisationData.email != undefined && $scope.organisationData.address != undefined && $scope.organisationData.description != undefined) 
		{
		
			applicationModuleService.PostOrgData($scope.organisationData,applicationId).then(function(data){
				
				if(data.status ==400)
				{
					toaster.pop("error","",data.data.message);
					$scope.dataLoading=false;
				}else{
					
				
				toaster.pop("success","",data.message);
				$scope.dataLoading=false;
				$timeout(function(){
				
				$location.path("applications");
				},0);
				}
			});
		}
	}else{
		
	
	if($scope.organisationData.orgname != undefined && $scope.organisationData.email != undefined && $scope.organisationData.address != undefined)
	{
		
		applicationModuleService.PostOrgData($scope.organisationData).then(function(data){
			toaster.pop("success","",data.message);
			$scope.dataLoading=false;
			$timeout(function(){
			$location.path("applications");
			},0);
		});
	}
	}
}

});
applicationModule.controller('ApplicationSubscriptionCtrl', function ($scope, $rootScope, applicationModuleService,  ENV,  $cookieStore,$location,$filter,$timeout, $window,$state,toaster,CustomMessages) {

$scope.refreshFunc = function(){
		$state.reload();
	};
/*if($scope.applicationselectedInfo != undefined && $scope.applicationselectedInfo != "undefined"){
	var subscriptionInfoArray = $scope.applicationselectedInfo.subscription.toString();
	$scope.subscriptionInfo = subscriptionInfoArray.split(',');
	
		
		applicationModuleService.getSubscription($scope.subscriptionInfo[0]).then(function(data){
			
		});
	
}*/	
if($scope.applicationselectedInfo == undefined)
{
	$location.path("applications");
}
if($scope.applicationselectedInfo.id != undefined)
{
		applicationModuleService.getApplicationDetailFromId($scope.applicationselectedInfo.id).then(function(data){
			$scope.applicationselectedInfo = data.Data;
		});
}


$scope.subscriptionCall = function(pageno){
			
			$scope.subscriptionList = [];
			$scope.currentSubscriptionPage=pageno;
			 $scope.subscriptionPerPage=10;
			 
applicationModuleService.getAPIGroups(pageno).then(function(data){
	$scope.subscriptionList = data.Data;

if($scope.applicationselectedInfo.subscription.length>0)
{
				var subscriptionData = $scope.applicationselectedInfo.subscription;
				angular.forEach($scope.subscriptionList, function (subscription) {
						for(var i =0; i <subscriptionData.length;i++)
						{
								
								if(subscriptionData[i] == subscription.id)
								{
										subscription.subscriptionSelected = true;
										subscription.checked = true;
								}
						}
				});
	
}
	
	$scope.totalSubscriptionItems = data.total_records;
	
	$scope.checkAll = function (selectedAll) {
							$scope.selectedAll = selectedAll;
							if ($scope.selectedAll) {
								$scope.selectedAll = true;
							} else {
								$scope.selectedAll = false;
							}
						   angular.forEach($scope.subscriptionList, function (subscription) {
							//  if(subscription.checked ==undefined)
							//	{
									subscription.subscriptionSelected = $scope.selectedAll;
							//	}
						   });
						};	
});
};
$scope.selectedRow = null;
				$scope.setClickedRow = function(index,subscription){
					$scope.selectedRow = index;
					$scope.selectedRowSubscription = subscription;
					
					if(subscription.subscriptionSelected == true)
					{
						subscription.subscriptionSelected=false;
					}else{
						subscription.subscriptionSelected=true;
					}
					//}
				};
$scope.subscriptionCall(1);
$scope.pageChanged = function(){

				$scope.subscriptionCall($scope.currentSubscriptionPage);
			};
			
$scope.updateSubscription = function(appId,orgname,email,subscriptionList){
	$timeout(function(){
		

	$scope.dataLoadingSubscription = true;
	 var arr = [];
		for(var i in subscriptionList){
			var discoverArray = [];
		   if(subscriptionList[i].subscriptionSelected==true){
			 
			 
			   arr.push(subscriptionList[i].id);
		   }
		}
		if(arr.length ==0)
		{
			toaster.pop('error',"",CustomMessages.APPLICATION_SUBSCRIPTION_SELECTED_OPTIONS);
			 $scope.dataLoadingSubscription=false;
			return false;
		}else{
			 applicationModuleService.putSubscriptionForOrg(appId,orgname,email,arr).then(function (data){
				toaster.pop('success',"",CustomMessages.APPLICATION_SUBSCRIPTION_UPDATED_SUCCESS);
			 });
			  $scope.dataLoadingSubscription=false;
		}
		});	
};			
});
