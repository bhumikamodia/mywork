'use strict';

//	Initialize myApp - define Modules
var myApp = angular.module('myApp', [
    /* Configuration Definitions */
   'api-config',
    'myApp.errorHandler',
	 'myApp.logger',
    /* Angular & Bootstrap Definitions */
  
    'ui.router',
	'angular.filter',
    'ngAnimate',
    'ui.bootstrap',
    /*'ngTouch',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ui.grid.pagination',*/

    /* Modules Definitions */
    'ngCookies',
	'mm.acl',
	'homeModule',
    'gatewayModule',
	'deviceModule',
    'loginModule',
    'commonModule.controllers',
    'ngIdle',
    'applicationModule',
    'userModule',
    'roleModule',
    'groupModule',
    'ruleEngineModule',
    
    'datamanagementModule',
    'lookupModule',
    'meshModule',
    'simulatorModule',
    'dataModule',
    'securityModule',
    'softwareupdateModule',
    'healthModule',
    
    /* Application Features Definitions */
    'ui.multiselect',
	'angularMoment',
    'ncy-angular-breadcrumb',
    'ramlpropertiesModule'
	
]);


myApp.config(['AclServiceProvider', function (AclServiceProvider) {
  var myConfig = {
    storage: 'localStorage',
    storageKey: 'AppAcl'
  };
  AclServiceProvider.config(myConfig);
  //AclServiceProvider.resume();
}]);
myApp.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
	 $httpProvider.defaults.useXDomain = true;
	//$httpProvider.defaults.withCredentials = true;
   delete $httpProvider.defaults.headers.common['X-Requested-With'];
	
}]);
//	Configuration function
//	Parameters :	 $locationProvider, $stateProvider, $urlRouterProvider
myApp.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$provide', '$compileProvider', '$breadcrumbProvider', 'errorHandlerProvider','$cookiesProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider, $provide, $compileProvider, $breadcrumbProvider, errorHandlerProvider,$cookiesProvider) {
        // Decorate the exceptino and error messages of injected service or factory
        errorHandlerProvider.decorate($provide, ['gatewayModuleService', 'AuthenticationServiceLogin','deviceModuleService','groupModuleService','applicationModuleService','userModuleService','roleModuleService','ramlpropertiesModuleService','softwareupdateModuleService']);        
        
       /* $provide.decorator("$exceptionHandler",  function ($delegate) {
            return function (exception, cause) {                
                TraceKit.report(exception);
                $delegate(exception, cause);
            };
        });*/
		 $cookiesProvider['secure'] = true;
		 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
		 var login_html = {
            url: "/login",
            templateUrl: 'modules/login/views/login.html',
            controller: 'loginCtrl',

        };
		var password_recovery_html = {
            url: "/password-recovery",
            templateUrl: 'modules/login/views/forgotpassword.html',
            controller: 'loginCtrl'
        };
		var home_html = {
            url: "/home",
            templateUrl: 'modules/home/views/home.html',
            controller: 'homeCtrl',
            ncyBreadcrumb: {
                label: "Home"
            }
        };

        var powerbi_html = {
            url: "/powerbidevice",
            views: {
                "@": {
                    templateUrl: 'modules/home/views/powerbidevice.html',
					controller: function($scope,$cookieStore) {

					if(localStorage.getItem('powerbilist') != undefined && localStorage.getItem('powerbilist') != 'undefined')
					{
						$scope.powerbiGateway = JSON.parse(localStorage.getItem('powerbigateway'));
						$scope.powerbiDevice = JSON.parse(localStorage.getItem('powerbidevice'));
						$scope.powerbiList = JSON.parse(localStorage.getItem('powerbilist'));
						//console.log($scope.gateway);
					}
					}
                },
				"powerbidevice@home.powerbidevice": {
                    templateUrl: 'modules/home/views/home.html',
                    controller: 'homeCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Powerbi Device",
			 parent: 'home'
            }
        };
		var gateway_html = {
            url: "/gateway",
			
            templateUrl: 'modules/gateway/views/gateway.html',
            controller: 'gatewayCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_gateways')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
            ncyBreadcrumb: {         
			label: "Gateway Management",
			 parent: 'home'
            }
        };
		var userinfo = {
			url: "/userinfo/:id/",
			templateUrl: 'modules/login/views/userinfo.html',
            controller: function($scope,$stateParams){
				if($stateParams.id != undefined || $stateParams.id != ""){
					$scope.id = $stateParams.id;
				}
			},
			ncyBreadcrumb: {         
			 label: "User Information",
            }
		};
		var changepassword_html = {
			url: "/changepassword/",
			templateUrl: 'modules/login/views/changepassword.html',
            controller: function($scope,$stateParams){
				if($stateParams.id != undefined || $stateParams.id != ""){
					$scope.id = $stateParams.id;
				}
			},
			ncyBreadcrumb: {         
			 label: "Change Password",
            }
		};
		var gateway_detail_html = {
            url: "/detail/:id",
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/gateway-description.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('gatewayInfo') != undefined && localStorage.getItem('gatewayInfo') != 'undefined')
					{
						$scope.displayname = localStorage.getItem('displayname');
						$scope.gatewayId = localStorage.getItem('gatewayId');
						$scope.gateway = JSON.parse(localStorage.getItem('gatewayInfo'));
						//console.log($scope.gateway);
					}
					}
                },
				"detail@gateway.detail": {
                    templateUrl: 'modules/gateway/views/gateway.html',
                    controller: 'gatewayCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "{{ displayname | uppercase }}",
			 parent: 'gateway'
            }
        };
		
		var gateway_config_html = {
            url: "/configurations",
			
		
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/configurations.html',
					controller: function($scope) {
						if(localStorage.getItem('selectedgateway') != undefined && localStorage.getItem('selectedgateway') != 'undefined')
						{	
							$scope.gateway = JSON.parse(localStorage.getItem('selectedgateway'));
							//console.log($scope.gatewayInfo);
							$scope.displayname = $scope.gateway.displayname;
							//$scope.displayname = localStorage.getItem('displayname');
							$scope.gatewayId = $scope.gateway.id;
							$scope.selectedRowTask = JSON.parse(localStorage.getItem('selectedtask'))
							console.log("route   ",$scope.selectedRowTask)
						}
					},
					
					
                },
					
				"configurations@detail.configurations": {
                    templateUrl: 'modules/gateway/views/gateway-description.html',
                    controller: 'gatewayDescCtrl'
                }
				
			},	
		
            ncyBreadcrumb: {
                label: "Configurations",
				parent: 'gateway.detail'
				
            }	
        };

		var devices_html = {
            url: "/detail/:id/devices",
			
		
            views: {
                "@": {
                    templateUrl: 'modules/devices/views/device.html',
					controller: function($scope) {
						if(localStorage.getItem('gatewayInfo') != undefined && localStorage.getItem('gatewayInfo') != 'undefined')
						{	
							$scope.gatewayInfo = JSON.parse(localStorage.getItem('gatewayInfo'));
							//console.log($scope.gatewayInfo);
							//$scope.displayname = $scope.gatewayInfo.displayname;
							$scope.displayname = localStorage.getItem('displayname');
							$scope.gatewayId = localStorage.getItem('gatewayId');
							
						}
					},
					
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_devices')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
					
				"devices@detail.devices": {
                    templateUrl: 'modules/gateway/views/gateway-description.html',
                    controller: 'gatewayDescCtrl'
                }
				
			},	
		
            ncyBreadcrumb: {
                label: "Devices",
				parent: 'gateway.detail'
				
            }	
        };
		var gateway_live_html = {
            url: "/live",
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/gateway-live.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('gatewayselectedInfo'));
					if(localStorage.getItem('gatewayselectedInfo') != undefined && localStorage.getItem('gatewayselectedInfo') != 'undefined')
					{
						$scope.gatewayselectedInfo = JSON.parse(localStorage.getItem('gatewayselectedInfo'));
						//console.log($scope.gatewayselectedInfo);
					}
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('create_livedata')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"live@gateway.live": {
                    templateUrl: 'modules/gateway/views/gateway.html',
                    controller: 'gatewayCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Live",
			 parent: 'gateway'
            }
        };
		var gateway_register_html = {
            url: "/register",
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/register_activation.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('gatewayselectedInfo'));
					if(localStorage.getItem('gatewayselectedInfo') != undefined && localStorage.getItem('gatewayselectedInfo') != 'undefined')
					{
						$scope.gatewayselectedInfo = JSON.parse(localStorage.getItem('gatewayselectedInfo'));
						//console.log($scope.gatewayselectedInfo);
					}
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('retrieve_gatewayassignee')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"register@gateway.register": {
                    templateUrl: 'modules/gateway/views/gateway.html',
                    controller: 'gatewayCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Register",
			 parent: 'gateway'
            }
        };
		var gateway_activation_html = {
            url: "/activation",
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/register_activation.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('gatewayselectedInfo') != undefined && localStorage.getItem('gatewayselectedInfo') != 'undefined')
					{
						$scope.gatewayselectedInfo = JSON.parse(localStorage.getItem('gatewayselectedInfo'));
						//console.log($scope.gatewayselectedInfo);
					}
					//console.log($scope.gatewayId);
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('activate_gateway')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"register@gateway.register": {
                    templateUrl: 'modules/gateway/views/gateway.html',
                    controller: 'gatewayCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Activation",
			 parent: 'gateway'
            }
        };
		var gateway_deregister_html = {
            url: "/deregister",
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/register_activation.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('gatewayselectedInfo') != undefined && localStorage.getItem('gatewayselectedInfo') != 'undefined')
					{
						$scope.gatewayselectedInfo = JSON.parse(localStorage.getItem('gatewayselectedInfo'));
						//console.log($scope.gatewayselectedInfo);
					}
					//console.log($scope.gatewayId);
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('retrieve_gatewayassignee')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"register@gateway.register": {
                    templateUrl: 'modules/gateway/views/gateway.html',
                    controller: 'gatewayCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Deregister",
			 parent: 'gateway'
            }
        };
		var gateway_deactivate_html = {
            url: "/deactivate",
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/register_activation.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('gatewayselectedInfo') != undefined && localStorage.getItem('gatewayselectedInfo') != 'undefined')
					{
						$scope.gatewayselectedInfo = JSON.parse(localStorage.getItem('gatewayselectedInfo'));
						//console.log($scope.gatewayselectedInfo);
					}
					//console.log($scope.gatewayId);
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('activate_gateway')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"register@gateway.register": {
                    templateUrl: 'modules/gateway/views/gateway.html',
                    controller: 'gatewayCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Deactivation",
			 parent: 'gateway'
            }
        };
		var gateway_group_html = {
            url: "/groups",
            views: {
                "@": {
                    templateUrl: 'modules/gateway/views/assigngroups.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('gatewayselectedInfo') != undefined && localStorage.getItem('gatewayselectedInfo') != 'undefined')
					{
						$scope.gatewayselectedInfo = JSON.parse(localStorage.getItem('gatewayselectedInfo'));
						//console.log($scope.gatewayselectedInfo);
					}
					//console.log($scope.gatewayId);
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('retrieve_gatewaygroup')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"groups@gateway.groups": {
                    templateUrl: 'modules/gateway/views/gateway.html',
                    controller: 'gatewayCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Assign Groups",
			 parent: 'gateway'
            }
        };
		
		var devices_html = {
            url: "/detail/:id/devices",
			
		
            views: {
                "@": {
                    templateUrl: 'modules/devices/views/device.html',
					controller: function($scope) {
						if(localStorage.getItem('gatewayInfo') != undefined && localStorage.getItem('gatewayInfo') != 'undefined')
						{	
							$scope.gatewayInfo = JSON.parse(localStorage.getItem('gatewayInfo'));
							//console.log($scope.gatewayInfo);
							//$scope.displayname = $scope.gatewayInfo.displayname;
							$scope.displayname = localStorage.getItem('displayname');
							$scope.gatewayId = localStorage.getItem('gatewayId');
							
						}
					},
					
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_devices')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
					
				"devices@detail.devices": {
                    templateUrl: 'modules/gateway/views/gateway-description.html',
                    controller: 'gatewayDescCtrl'
                }
				
			},	
				
		   /* templateUrl: 'modules/devices/views/device.html',
            controller: 'deviceCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_devices')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
				  */
            ncyBreadcrumb: {
                label: "Devices",
				parent: 'gateway.detail'
				
            }	
        };
		/*var devicegroups_html = {
			url: "/devicegroups",
            views: {
                "@": {
                    templateUrl: 'modules/devices/views/devicegroups.html',
					controller: function($scope) {
						if(localStorage.getItem('gatewayInfo') != undefined && localStorage.getItem('gatewayInfo') != 'undefined')
						{	
							$scope.gatewayInfo = JSON.parse(localStorage.getItem('gatewayInfo'));
							//console.log($scope.gatewayInfo);
							$scope.gatewayId = $scope.gatewayInfo.id;
							$scope.displayname = $scope.gatewayInfo.displayname;
						}
					},
					
                },
				"devicegroups@devices.devicegroups": {
                    templateUrl: 'modules/devices/views/device.html',
                    controller: 'deviceCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Device Groups",
			 parent: 'gateway.devices'
            }
		};
		var deviceaddgroup_html = {
			url: "/deviceaddgroup",
            views: {
                "@": {
                    templateUrl: 'modules/devices/views/deviceaddgroup.html',
					controller: function($scope) {
						if(localStorage.getItem('gatewayInfo') != undefined && localStorage.getItem('gatewayInfo') != 'undefined')
						{	
							$scope.gatewayInfo = JSON.parse(localStorage.getItem('gatewayInfo'));
							//console.log($scope.gatewayInfo);
							$scope.gatewayId = $scope.gatewayInfo.id;
							$scope.displayname = $scope.gatewayInfo.displayname;
						}
						if(localStorage.getItem('editDeviceList') != undefined && localStorage.getItem('editDeviceList') != 'undefined')
						{
	
	
						$scope.editDeviceInfo = JSON.parse(localStorage.getItem('editDeviceList'));
						$scope.breadcrumbDisplay="Edit Device Group";
						}else{

						$scope.breadcrumbDisplay="Add Device Group";
						}
					},
					
                },
				"deviceaddgroup@devicegroups.deviceaddgroup": {
                    templateUrl: 'modules/devices/views/device.html',
                    controller: 'deviceGroupsCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "{{breadcrumbDisplay}}",
			 parent: 'gateway.devices.devicegroups'
            }
        };*/
        var devicegroups_addprofile_html = {
            url: "/:id/addprofile",
            views: {
                "@": {
                    templateUrl: 'modules/devices/views/addProfile.html',
                    controller: function($scope) {
                        if (localStorage.getItem('gateway') != undefined && localStorage.getItem('gateway') != 'undefined')
                            $scope.gatewayInfo = JSON.parse(localStorage.getItem('gateway'));
                        $scope.profileInfoId = localStorage.getItem('profileInfo');
                        $scope.deviceGroupId = JSON.parse(localStorage.getItem('grpdeviceinfo'))
                        $scope.grpname = $scope.deviceGroupId.name
                        $scope.gatewayId = $scope.gatewayInfo.id;
                        $scope.displayname = $scope.gatewayInfo.displayname;
                    }
                },
            },
            "addprofile@devicegroups.addprofile": {
                templateUrl: 'modules/devices/views/device.html',
                controller: 'deviceGroupActionProfileCtrl'

            },
            ncyBreadcrumb: {
                label: "{{grpname |uppercase}}",
                parent: 'gateway.devices.devicegroups'
            }
        };
        var gateway_discover_html = {
            url: "/discover",
            views: {
                "@": {
                    templateUrl: 'modules/devices/views/discover.html',
					controller: function($scope) {
						if(localStorage.getItem('gatewayInfo') != undefined && localStorage.getItem('gatewayInfo') != 'undefined')
						{	
							$scope.gatewayInfo = JSON.parse(localStorage.getItem('gatewayInfo'));
							$scope.gatewayId = $scope.gatewayInfo.id;
							$scope.displayname = $scope.gatewayInfo.displayname;
							//console.log($scope.gatewayInfo);return false;
						}
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('device_discovery')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"discover@devices.discover": {
                    templateUrl: 'modules/devices/views/device.html',
                    controller: 'deviceCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Discover",
			 parent: 'gateway.devices'
            }
        };
		var device_live_html = {
			url: "/live",
            views: {
                "@": {
                    templateUrl: 'modules/devices/views/device-live.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('gatewayselectedInfo'));
					if(localStorage.getItem('deviceselectedInfo') != undefined && localStorage.getItem('deviceselectedInfo') != 'undefined')
					{
						$scope.deviceselectedInfo = JSON.parse(localStorage.getItem('deviceselectedInfo'));
						$scope.gatewayInfo = JSON.parse(localStorage.getItem('gatewayInfo'));
						//console.log($scope.gatewayselectedInfo);
						$scope.gatewayId = $scope.gatewayInfo.id;
						$scope.displayname = $scope.gatewayInfo.displayname;
					}
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('device_livedata')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"live@devices.live": {
                    templateUrl: 'modules/devices/views/device.html',
                    controller: 'deviceCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Live",
			 parent: 'gateway.devices'
            }
		};

		var users_html = {
            url: "/users",
            templateUrl: 'modules/users/views/users.html',
            controller: 'userCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_users')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
            ncyBreadcrumb: {
                label: "User Management",
				parent: 'home'
            }
        };
		var applications_html = {
            url: "/applications",
            templateUrl: 'modules/application/views/application.html',
            controller: 'applicationCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_organisations')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
            ncyBreadcrumb: {
                label: "Application Management",
				parent: 'home'
            }
        };
		var groups_html = {
            url: "/groups",
            templateUrl: 'modules/groups/views/groups.html',
            controller: 'groupCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_gatewaygroups')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
            ncyBreadcrumb: {
                label: "Group Management",
				parent: 'home'
            }
        };
		var lookup_html = {
            url: "/lookup",
            templateUrl: 'modules/lookup/views/lookup.html',
            controller: 'lookupCtrl',
			resolve : {						
					  },
            ncyBreadcrumb: {
                label: "Lookup",
				parent: 'home'
            }
        };
        var simulator_html = {
            url: "/simulator",
            templateUrl: 'modules/simulator/views/simulator.html',
            controller: 'simulatorCtrl',
            resolve: {},
            ncyBreadcrumb: {
                label: "Simulator Management",
                parent: 'home'
            }
        }

        var testsetup_simulator_html = {
            url: "/addtestsetup",
            views: {
                "@": {
                    templateUrl: 'modules/simulator/views/testsetup.html',
                    controller: function($scope, $window) {
                        console.log("aaaaaaaaaaaaaaaa", localStorage.getItem('client'))
                        if (localStorage.getItem('client') != undefined && localStorage.getItem('client') != 'undefined') {

                            $scope.client = JSON.parse(localStorage.getItem('client'))



                        }

                    },
                    resolve: {

                    }
                },
                "addtestsetup@simulator.addtestsetup": {
                    templateUrl: 'modules/simulator/views/simulator.html',
                    controller: 'simulatorCtrl'
                }

            },
            ncyBreadcrumb: {
                label: "Create Test Setup",
                parent: 'simulator'
            }
        };

         var resourceRAML_simulator_html = {
            url: "/resources/raml",
            views: {
                "@": {
                    templateUrl: 'modules/simulator/views/resourceraml.html',
                    controller: function($scope, $window) {
                       
                        if (localStorage.getItem('resource') != undefined && localStorage.getItem('resource') != 'undefined') {
                            $scope.resource = JSON.parse(localStorage.getItem('resource'))
                            console.log("deom app route",$scope.resource)
                            $scope.resourceName = $scope.resource.device_name
                            
                            $scope.ramlflag = JSON.parse(localStorage.getItem('ramlflag'))
                            
                        
                        }

                    },
                    resolve: {

                    }
                },
                "resourceraml@simulator.resourceraml": {
                    templateUrl: 'modules/simulator/views/simulator.html',
                    controller: 'simulatorCtrl'
                }

            },
            ncyBreadcrumb: {
                label: "Resources / {{resourceName | uppercase}}",
                parent: 'simulator'
            }
        };

        var edittestsetup_simulator_html = {
            url: "/:id/edittestsetup",
            views: {
                "@": {
                    templateUrl: 'modules/simulator/views/edittestsetup.html',
                    controller: function($scope, $window) {
                        console.log("aaaaaaaaaaaaaaaa", localStorage.getItem('client'))
                        if (localStorage.getItem('client') != undefined && localStorage.getItem('client') != 'undefined') {
                            $scope.setupdata = JSON.parse(localStorage.getItem('setupdata'))
                            $scope.deviceList = JSON.parse(localStorage.getItem('devicelist'))
                            $scope.client = JSON.parse(localStorage.getItem('client'))



                        }

                    },
                    resolve: {

                    }
                },
                "edittestsetup@simulator.edittestsetup": {
                    templateUrl: 'modules/simulator/views/simulator.html',
                    controller: 'simulatorCtrl'
                }

            },
            ncyBreadcrumb: {
                label: "Edit Test Setup",
                parent: 'simulator'
            }
        };




        var mesh_html = {
        	url: "/mesh",
            templateUrl: 'modules/mesh/views/mesh.html',
            controller: 'meshCtrl',
			resolve : {						
					  },
            ncyBreadcrumb: {
                label: "Mesh Management",
				parent: 'home'
            }
        }
        

		var mesh_connections = {
            url: "/:id/connections",
            views: {
                "@": {
                    templateUrl: 'modules/mesh/views/connections.html',
					controller: function($scope,$window) {
						if(localStorage.getItem('meshInfo') != undefined && localStorage.getItem('meshInfo') != 'undefined')
					{
						$scope.displayname = localStorage.getItem('meshname');
						$scope.meshId = localStorage.getItem('meshId');
						$scope.mesh = JSON.parse(localStorage.getItem('meshInfo'));
						console.log($scope.mesh);
					}
					},resolve:{

					}
			   },
				"connections@mesh.connections": {
                    templateUrl: 'modules/mesh/views/connections.html',
                    controller: 'meshConnectionCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "{{displayname |uppercase}} /Connections (Bird Eye View)",
			parent: 'mesh'
            }
		};

		var add_gatewaygroup_html = {
            url: "/addgatewaygroups",
            views: {
                "@": {
                    templateUrl: 'modules/mesh/views/meshaddGatewayGroup.html',
					controller: function($scope,$window) {
						
					},resolve:{

					}
			   },
				"addgatewaygroups@mesh.addgatewaygroups": {
                    templateUrl: 'modules/mesh/views/meshaddGatewayGroup.html',
                    controller: 'meshGatewayGroupCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "Create Gateway Group",
			parent: 'mesh'
            }
		};
		var add_devicegroup_html = {
            url: "/adddevicegroups",
            views: {
                "@": {
                    templateUrl: 'modules/mesh/views/meshaddDeviceGroup.html',
					controller: function($scope,$window) {
						console.log("in app route")
						$scope.displayname = localStorage.getItem('meshname');
						$scope.meshId = localStorage.getItem('meshId');
						$scope.mesh = JSON.parse(localStorage.getItem('meshInfo'));
						if(localStorage.getItem('method')=='edit')
						{
							$scope.editDeviceInfo = JSON.parse(localStorage.getItem('editDeviceList'))
						}else{
							localStorage.removeItem('editDeviceList')
						}
					},resolve:{

					}
			   },
				"adddevicegroups@devgroups.adddevicegroups": {
                    templateUrl: 'modules/mesh/views/meshDeviceGroup.html',
                    controller: 'meshDeviceGroupCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "Create Device Group",
			parent: 'mesh.devgroups'
            }
		};

		var add_meshserver_html = {
            url: "/:id/servers",
            views: {
                "@": {
                    templateUrl: 'modules/mesh/views/meshaddAnsibleServer.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('meshInfo') != undefined && localStorage.getItem('meshInfo') != 'undefined')
					{
						$scope.displayname = localStorage.getItem('meshname');
						$scope.meshId = localStorage.getItem('meshId');
						$scope.mesh = JSON.parse(localStorage.getItem('meshInfo'));
						console.log($scope.mesh);
					}
					}
			   },
				"servers@mesh.servers": {
                    templateUrl: 'modules/mesh/views/meshaddAnsibleServer.html',
                    controller: 'meshCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "{{displayname |uppercase}} /Ansible servers",
			parent: 'mesh'
            }
		};

var add_meshgateway_html = {
            url: "/:id/gateways",
            views: {
                "@": {
                    templateUrl: 'modules/mesh/views/meshaddGateway.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('meshInfo') != undefined && localStorage.getItem('meshInfo') != 'undefined')
					{
						$scope.displayname = localStorage.getItem('meshname');
						$scope.meshId = localStorage.getItem('meshId');
						$scope.mesh = JSON.parse(localStorage.getItem('meshInfo'));
						//console.log(JSON.parse(localStorage.getItem('meshInfo')));
					}
					}
			   },
				"gateways@mesh.gateways": {
                    templateUrl: 'modules/mesh/views/meshaddGateway.html',
                    controller: 'meshCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "{{displayname |uppercase}} /Gateways",
			parent: 'mesh'
            }
		};

var add_meshdevice_html = {
            url: "/:id/devices",
            views: {
                "@": {
                    templateUrl: 'modules/mesh/views/meshDevices.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('meshInfo') != undefined && localStorage.getItem('meshInfo') != 'undefined')
					{
						$scope.displayname = localStorage.getItem('meshname');
						$scope.meshId = localStorage.getItem('meshId');
						$scope.mesh = JSON.parse(localStorage.getItem('meshInfo'));
						//console.log(JSON.parse(localStorage.getItem('meshInfo')));
					}
					}
			   },
				"devices@mesh.devices": {
                    templateUrl: 'modules/mesh/views/meshDevices.html',
                    controller: 'meshCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "{{displayname |uppercase}} /Devices",
			parent: 'mesh'
            }
		};
var add_meshdevicegroup_html = {
            url: "/:id/devicegroups",
            views: {
                "@": {
                    templateUrl: 'modules/mesh/views/meshDeviceGroup.html',
					controller: function($scope,$cookieStore) {
					if(localStorage.getItem('meshInfo') != undefined && localStorage.getItem('meshInfo') != 'undefined')
					{
						$scope.displayname = localStorage.getItem('meshname');
						$scope.meshId = localStorage.getItem('meshId');
						$scope.mesh = JSON.parse(localStorage.getItem('meshInfo'));
						//console.log(JSON.parse(localStorage.getItem('meshInfo')));
					}
					}
			   },
				"devgroups@mesh.devgroups": {
                    templateUrl: 'modules/mesh/views/mesh.html',
                    controller: 'meshCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "{{displayname |uppercase}} /Device Groups",
			parent: 'mesh'
            }
		};
		
		var lookup_create_html = {
            url: "/lookupadd",
            views: {
                "@": {
                    templateUrl: 'modules/lookup/views/lookupAdd.html',
					controller: function($scope,$window) {						
					
					},
					resolve : {						
					  }
                },
				"lookupadd@lookup.lookupadd": {
                    templateUrl: 'modules/lookup/views/lookup.html',
                    controller: 'lookupCtrl'
                }
				
			},		    
            
            ncyBreadcrumb: {         
			label: "Create New",
			parent: 'lookup'
            }
        };
		var rule_engine_html = {
            url: "/ruleengine",
            templateUrl: 'modules/rule_engine/views/ruleEngine.html',
            controller: 'ruleengineCtrl',
			resolve : {
						/*'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_rule')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]*/
					  },
            ncyBreadcrumb: {
                label: "Rule Engine",
				parent: 'home'
            }
        };
		var data_html = {
            url: "/data",
            templateUrl: 'modules/data/views/data.html',
            controller: 'dataCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('sanny_test')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
            ncyBreadcrumb: {
                label: "Data Management",
				parent: 'home'
            }
        };
		var security_html = {
            url: "/security",
            templateUrl: 'modules/security/views/security.html',
            controller: 'securityCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('sanny_test')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
            ncyBreadcrumb: {
                label: "Security Management",
				parent: 'home'
            }
        };
		var software_update_html = {
            url: "/softwareupdate",
            templateUrl: 'modules/softwareupdate/views/softwareupdate.html',
           // controller: 'softwareupdateCtrl',
			resolve : {
						/*'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('sanny_test')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]*/
					  },
            ncyBreadcrumb: {
                label: "Auto Deployment",
				parent: 'home'
            }
        };
		var health_html = {
            url: "/health",
            templateUrl: 'modules/health/views/health.html',
            controller: 'healthCtrl',
			resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('sanny_test')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  },
            ncyBreadcrumb: {
                label: "Health / Diagnostics",
				parent: 'home'
            }
        };
		var application_subscription_html = {
            url: "/subscription",
            views: {
                "@": {
                    templateUrl: 'modules/application/views/subscription.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('applicationselectedInfo'));
						if(localStorage.getItem('applicationselectedInfo') != undefined && localStorage.getItem('applicationselectedInfo') != 'undefined')
						{
							$scope.applicationselectedInfo = JSON.parse(localStorage.getItem('applicationselectedInfo'));
							//console.log($scope.applicationselectedInfo);
							$scope.DisplayName="Subscription";
						}else{
							$scope.DisplayName="Subscription";
						}
					
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('assignsubscription_organisation')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                },
				"subscription@applications.subscription": {
                    templateUrl: 'modules/application/views/application.html',
                    controller: 'applicationCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "{{DisplayName}}",
			parent: 'applications'
            }
        };
		var application_addapplication_html = {
            url: "/addapplication",
            views: {
                "@": {
                    templateUrl: 'modules/application/views/addapplication.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('applicationselectedInfo'));
						if(localStorage.getItem('applicationselectedInfo') != undefined && localStorage.getItem('applicationselectedInfo') != 'undefined')
						{
							$scope.applicationselectedInfo = JSON.parse(localStorage.getItem('applicationselectedInfo'));
							//console.log($scope.applicationselectedInfo);
							$scope.DisplayName="Edit Application";
						}else{
							$scope.DisplayName="Add Application";
						}
					
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						if(localStorage.getItem('applicationselectedInfo') != undefined && localStorage.getItem('applicationselectedInfo') != 'undefined')
						{
							 if(AclService.can('retrieve_organisation')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }
						}else{
							
							 if(AclService.can('create_organisation')){
							// Has proper permissions
							return true;
						  } else {
							// Does not have permission
							return $q.reject('Unauthorized');
						  }
						}	
						 
						}]
					  }
                },
				"addapplication@applications.addapplication": {
                    templateUrl: 'modules/application/views/application.html',
                    controller: 'applicationCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "{{DisplayName}}",
			parent: 'applications'
            }
        };
		var add_user_html = {
            url: "/adduser",
            views: {
                "@": {
                    templateUrl: 'modules/users/views/adduser.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('userselectedInfo'));
						if(localStorage.getItem('userselectedInfo') != undefined && localStorage.getItem('userselectedInfo') != 'undefined')
						{
							$scope.userselectedInfo = JSON.parse(localStorage.getItem('userselectedInfo'));
							//console.log($scope.userselectedInfo);
							$scope.DisplayName="Edit User";
						}else{
							$scope.DisplayName="Add User";
						}
					
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						if(localStorage.getItem('userselectedInfo') != undefined && localStorage.getItem('userselectedInfo') != 'undefined')
						{
							 if(AclService.can('retrieve_user')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }
						}else{
							
							 if(AclService.can('create_user')){
							// Has proper permissions
							return true;
						  } else {
							// Does not have permission
							return $q.reject('Unauthorized');
						  }
						}	
						 
						}]
					  }
                },
				"adduser@users.adduser": {
                    templateUrl: 'modules/users/views/users.html',
                    controller: 'userCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "{{DisplayName}}",
			parent: 'users'
            }
        };
		var role_html = {
            url: "/role",
            views: {
                "@": {
                    templateUrl: 'modules/roles/views/role.html',
					controller: 'userRoleCtrl',
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_roles')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }
                }
				
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Role Management",
			parent: 'home'
            }
        };
		
		var ramlproperties_html = {
			 url: "/ramlproperties",
            views: {
                "@": {
                    templateUrl: 'modules/ramlproperties/views/ramlproperties.html',
					controller: 'ramlpropertiesCtrl'
					/*resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						
							 if(AclService.can('list_roles')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }	
						 
						}]
					  }*/
                }
				
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "RAML Manager",
			parent: 'home'
            }
		};

 		

		var add_ramlproperties_html = {
            url: "/addraml",
            views: {
                "@": {
                    templateUrl: 'modules/ramlproperties/views/addraml.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('userselectedInfo'));
						
							$scope.DisplayName="Add Definition RAML";
						
					
					},
			   },
					
               
				"addraml@ramlproperties.addraml": {
                    templateUrl: 'modules/ramlproperties/views/ramlproperties.html',
                    controller: 'ramladdproCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {      
			label: "{{DisplayName}}",
			parent: 'ramlproperties'
            }
		};
       
		var device_raml_html = {
			url: "/deviceraml",
            views: {
                "@": {
                    templateUrl: 'modules/ramlproperties/views/deviceSetRaml.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('gatewayselectedInfo'));
						$scope.meshId = localStorage.getItem('meshId');
					if(localStorage.getItem('devList') != undefined && localStorage.getItem('devList') != 'undefined')
						{	
							
							$scope.arrDevList = JSON.parse(localStorage.getItem('devList'));
						}
					},
					resolve : {
						
					  }
                },
				"deviceraml@ramlproperties.deviceraml": {
                    templateUrl: 'modules/ramlproperties/views/ramlproperties.html',
                    controller: 'ramladdproCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Device RAML",
			 parent: 'ramlproperties'
            }
		};
	   var add_ramltemplate_html = {
            url: "/addramltemplate",
            views: {
                "@": {
                    templateUrl: 'modules/ramlproperties/views/addramltemplate.html',
					controller: function($scope,$window) {
						$scope.DisplayName="Add RAML Definition Template";
					},
			   },
				"addramltemplate@ramlproperties.addramltemplate": {
                    templateUrl: 'modules/ramlproperties/views/ramlproperties.html',
                    controller: 'ramladdtemplateCtrl'
                }
				
			},	            
            ncyBreadcrumb: {      
			label: "{{DisplayName}}",
			parent: 'ramlproperties'
            }
		};


		var edit_ramlproperties_html = {
            url: "/editramldefinition",
            views: {
                "@": {
                    templateUrl: 'modules/ramlproperties/views/editramltemplate.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('userselectedInfo'));
						if(localStorage.getItem('ramlDevId') != undefined && localStorage.getItem('ramlDevId') != 'undefined')
						{
							$scope.ramlDevId = JSON.parse(localStorage.getItem('ramlDevId'));
							$scope.DisplayName="Edit Definition RAML";
						}
					
					},
			   },
					
               
				"editramldefinition@ramlproperties.editramldefinition": {
                    templateUrl: 'modules/ramlproperties/views/ramlproperties.html',
                    controller: 'ramleditproCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {      
			label: "{{DisplayName}}",
			parent: 'ramlproperties'
            }
		};






		var add_ramlDevices_html = {
            url: "/addramlDevice",
            views: {
                "@": {
                    templateUrl: 'modules/ramlproperties/views/deviceaddraml.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('userselectedInfo'));
						$scope.DisplayName="Add Device RAML ";
					},
			   },
					
               
				"addramlDevice@ramlproperties.addramlDevice": {
                    templateUrl: 'modules/ramlproperties/views/ramlproperties.html',
                    controller: 'ramlDevicepropertiesCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {      
			label: "{{DisplayName}}",
			parent: 'ramlproperties'
            }
		};

       

       var edit_ramlpropertiesDevice_html = {
            url: "/editramldevice",
            views: {
                "@": {
                    templateUrl: 'modules/ramlproperties/views/deviceeditraml.html',
					controller: function($scope,$window) {
						if(localStorage.getItem('ramlDefId') != undefined && localStorage.getItem('ramlDefId') != 'undefined')
						{
							$scope.ramlDefId = localStorage.getItem('ramlDefId');
							$scope.DisplayName="Edit Device RAML";
						}
					
					},
			   },
					
               
				"editramldevice@ramlproperties.editramldevice": {
                    templateUrl: 'modules/ramlproperties/views/ramlproperties.html',
                    controller: 'ramlpropertiesCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {      
			label: "{{DisplayName}}",
			parent: 'ramlproperties'
            }
		};







		
		var role_addrole_html = {
            url: "/addrole",
            views: {
                "@": {
                    templateUrl: 'modules/roles/views/addrole.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('userselectedInfo'));
						if(localStorage.getItem('userRoleselectedInfo') != undefined && localStorage.getItem('userRoleselectedInfo') != 'undefined')
						{
							$scope.userRoleselectedInfo = JSON.parse(localStorage.getItem('userRoleselectedInfo'));
							//console.log($scope.userRoleselectedInfo);
							$scope.DisplayName="Edit Role";
						}else{
							$scope.DisplayName="Add Role";
						}
					
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						if(localStorage.getItem('userRoleselectedInfo') != undefined && localStorage.getItem('userRoleselectedInfo') != 'undefined')
						{
							 if(AclService.can('retrieve_role')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }
						}else{
							
							 if(AclService.can('create_role')){
							// Has proper permissions
							return true;
						  } else {
							// Does not have permission
							return $q.reject('Unauthorized');
						  }
						}	
						 
						}]
					  }
                },
				"addrole@role.addrole": {
                    templateUrl: 'modules/roles/views/role.html',
                    controller: 'userRoleCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "{{DisplayName}}",
			parent: 'role'
            }
        };
		var group_addgroup_html = {
            url: "/addgroup",
            views: {
                "@": {
                    templateUrl: 'modules/groups/views/addgroup.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('groupselectedInfo'));
						if(localStorage.getItem('groupselectedInfo') != undefined && localStorage.getItem('groupselectedInfo') != 'undefined')
						{
							$scope.groupselectedInfo = JSON.parse(localStorage.getItem('groupselectedInfo'));
							//console.log($scope.groupselectedInfo);
							$scope.DisplayName="Edit Group";
						}else{
							$scope.DisplayName="Add Group";
						}
					
					},
					resolve : {
						'acl' : ['$q', 'AclService', function($q, AclService){
						if(localStorage.getItem('groupselectedInfo') != undefined && localStorage.getItem('groupselectedInfo') != 'undefined')
						{
							 if(AclService.can('retrieve_gatewaygroups')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }
						}else{
							
							 if(AclService.can('create_gatewaygroups')){
							// Has proper permissions
							return true;
						  } else {
							// Does not have permission
							return $q.reject('Unauthorized');
						  }
						}	
						 
						}]
					  }
                },
				"addgroup@groups.addgroup": {
                    templateUrl: 'modules/groups/views/groups.html',
                    controller: 'groupCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "{{DisplayName}}",
			parent: 'groups'
            }
        };
		var rule_engine_create_html = {
            url: "/createrule",
            views: {
                "@": {
                    templateUrl: 'modules/rule_engine/views/ruleEngineCreateRule.html',
					controller: function($scope,$window) {
						
					
					},
					resolve : {
						/*'acl' : ['$q', 'AclService', function($q, AclService){
						if(localStorage.getItem('ruleEngineselectedInfo') != undefined && localStorage.getItem('ruleEngineselectedInfo') != 'undefined')
						{
							 if(AclService.can('retrieve_rule')){
								// Has proper permissions
								return true;
							  } else {
								// Does not have permission
								return $q.reject('Unauthorized');
							  }
						}else{
							
							 if(AclService.can('create_rule')){
							// Has proper permissions
							return true;
						  } else {
							// Does not have permission
							return $q.reject('Unauthorized');
						  }
						}	
						 
						}]*/
					  }
                },
				"createrule@ruleengine.createrule": {
                    templateUrl: 'modules/rule_engine/views/ruleEngine.html',
                    controller: 'ruleengineCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Create New Rule",
			parent: 'ruleengine'
            }
        };
		var rule_engine_edit_html = {
            url: "/editrule",
            views: {
                "@": {
                    templateUrl: 'modules/rule_engine/views/ruleEngineEditRule.html',
					controller: function($scope,$window) {
						//console.log(localStorage.getItem('gatewayselectedInfo'));
						if(localStorage.getItem('ruleEngineselectedInfo') != undefined && localStorage.getItem('ruleEngineselectedInfo') != 'undefined')
						{
							$scope.ruleEngineselectedInfo = JSON.parse(localStorage.getItem('ruleEngineselectedInfo'));	
							
						}
					
					},
					resolve : {
					
					  }
                },
				"editrule@ruleengine.editrule": {
                    templateUrl: 'modules/rule_engine/views/ruleEngine.html',
                    controller: 'ruleengineCtrl'
                }
				
			},	
		    
            
            ncyBreadcrumb: {         
			label: "Edit Rule Data",
			parent: 'ruleengine'
            }
        };
		
		
		var datamanagement_html = {
            url: "/datamanagement",
            templateUrl: 'modules/datamanagement/views/datamanagement.html',
            controller: 'datamgtCtrl',
			resolve : {},
            ncyBreadcrumb: {
                label: "Data Management",
				parent: 'home'
            }
		}; 
		
		
        $stateProvider
        //Login Page - Template Url, Controller
		
        .state('login', login_html)
		 //Password Recovery Page - Template Url, Controller
        .state('password-recovery', password_recovery_html)
        //Home (Dashboard) Page - Template Url, Controller
		.state('home', home_html)
		.state('home.powerbidevice',powerbi_html)
		
        //Gateway (Dashboard) Page - Template Url, Controller
        .state('gateway', gateway_html)
		.state('changepassword',changepassword_html)
		.state('userinfo',userinfo)
		.state('gateway.detail', gateway_detail_html)
		.state('gateway.live', gateway_live_html)
		.state('gateway.register', gateway_register_html)
		.state('gateway.activation', gateway_activation_html)
		.state('gateway.deregister', gateway_deregister_html)
		.state('gateway.deactivate', gateway_deactivate_html)
		 .state('gateway.groups', gateway_group_html)
		
		
		 //Devices (Dashboard) Page - Template Url, Controller
        .state('gateway.devices', devices_html)
        .state('gateway.detail.configurations',gateway_config_html)
		.state('gateway.devices.live', device_live_html)
		.state('ramlproperties.device_raml',device_raml_html)
		.state('gateway.devices.discover', gateway_discover_html)
		//.state('gateway.devices.devicegroups',devicegroups_html)
 		.state('gateway.devices.devicegroups.addprofile', devicegroups_addprofile_html)
		//.state('gateway.devices.devicegroups.deviceaddgroup',deviceaddgroup_html)
		 //Users Page - Template Url, Controller
        .state('users',users_html)
		
		 //Application Page - Template Url, Controller
        .state('applications', applications_html)
		
		 //Groups Page - Template Url, Controller
		
        .state('groups', groups_html)
		 //Rule Engine Page - Template Url, Controller
        .state('ruleengine', rule_engine_html)
		
		.state('data', data_html)
		
		.state('security', security_html)
		.state('softwareupdate', software_update_html)
		
		.state('health', health_html)
		
		.state('applications.subscription', application_subscription_html)
		.state('applications.addapplication', application_addapplication_html)
		
		.state('users.adduser', add_user_html)
		.state('ramlproperties',ramlproperties_html)
		.state('ramlproperties.addraml',add_ramlproperties_html)
		.state('ramlproperties.addramltemplate',add_ramltemplate_html)
		.state('ramlproperties.addramlDevice',add_ramlDevices_html)
		.state('ramlproperties.editramldefinition',edit_ramlproperties_html)
		.state('ramlproperties.editramldevice',edit_ramlpropertiesDevice_html)
		
		.state('role', role_html)
		.state('role.addrole', role_addrole_html)
		.state('groups.addgroup',group_addgroup_html)
		.state('ruleengine.createrule',rule_engine_create_html)
		.state('ruleengine.editrule',rule_engine_edit_html)
		.state('lookup',lookup_html)
		.state('simulator', simulator_html)
	        .state('simulator.addtestsetup', testsetup_simulator_html)
	        .state('simulator.edittestsetup',edittestsetup_simulator_html)
	        .state('simulator.resourceraml',resourceRAML_simulator_html)
		.state('mesh',mesh_html)
		.state('mesh.connections',mesh_connections)
		.state('mesh.addgatewaygroups',add_gatewaygroup_html)
		.state('mesh.servers',add_meshserver_html)
		.state('mesh.gateways',add_meshgateway_html)
		.state('mesh.devices',add_meshdevice_html)
		.state('mesh.devgroups',add_meshdevicegroup_html)
		.state('mesh.devgroups.adddevicegroups',add_devicegroup_html)
		.state('lookup.lookupadd',lookup_create_html)
		
		.state('datamanagement',datamanagement_html)			
		;
        
        //	urlRouterProvider otherwise option in case none of selection state.
        $urlRouterProvider.otherwise('/login');

    }]);

myApp.factory('authHttpResponseInterceptor',['$q','$location','$controller','$rootScope','allDataStorage','ENV',function($q,$location,$controller,$rootScope,allDataStorage,ENV){
    return {
        response: function(response){
			
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
			if(ENV.WSO2Mode == true)
			{
				if (rejection.status === 401 || rejection.status === 403) {
                
					
						console.log("Response Error 401",rejection);
						var logoutCtrl = $rootScope.$new();
						$controller('logoutCtrl', {
							$scope: logoutCtrl
						});
						allDataStorage.setData(null);
						logoutCtrl.logout();
					
               
				}
			}else{
				if (rejection.status === 401 || rejection.status === 403) {
                
					if(rejection.statusText == "UNAUTHORIZED")
					{
						console.log("Response Error 401",rejection);
						var logoutCtrl = $rootScope.$new();
						$controller('logoutCtrl', {
							$scope: logoutCtrl
						});
						allDataStorage.setData(null);
						logoutCtrl.logout();
					}
               
				}
			}
            
            return $q.reject(rejection);
        }
    }
}])

myApp.run(['AclService','$rootScope','$cookieStore','allDataStorage','$filter',function(AclService,$rootScope,$cookieStore,allDataStorage,$filter){
	
	
	
	if (!AclService.resume()) {
		 
    // Web storage record did not exist, we'll have to build it from scratch

    // Get the user role, and add it to AclService
	//AclService.addRole('admin');
	
    var permission;
	$rootScope.globals = $cookieStore.get('globals') || {};
	if($rootScope.globals.currentUser != undefined){
	//console.log(allDataStorage.getData());
	if (allDataStorage.getData() != null) {
		
		permission = allDataStorage.getData();
		permission = $filter('unique')(permission);  
		console.log(permission);
		
		for(var per =0;per<permission.length;per++)
		{
			AclService.addAbility('admin',permission[per]);
			//console.log(permission[per]);
		}
		       
		AclService.attachRole('admin');
		
			
	}
	
	}else{
		allDataStorage.setData(null);
	}
	}
}]);
// Application Run
myApp.run(['$rootScope', '$location', '$cookieStore', '$http', '$controller', '$window','ENV',
    function ($rootScope, $location, $cookieStore, $http, $controller, $window,ENV) {
	
	
		// console.log('location',$location.path());
		//console.log($location.absUrl());
		
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
			
			if(ENV.WSO2Mode == true)
			{
				
				$http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.accessType + ' '+ $rootScope.globals.currentUser.accessToken;
				$http.defaults.headers.common['token'] = 'JWT' + ' ' +$rootScope.globals.currentUser.authToken; // jshint ignore:line  
			//	$http.defaults.headers.common['To']= "10.107.0.186";	
			}else{
				$http.defaults.headers.common['Authorization'] = 'JWT' + ' ' +$rootScope.globals.currentUser.authToken;
			}
	    }else{
			$location.path('/login');
		}
		  
		$rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
			if(rejection === 'Unauthorized'){
			  $location.path('/');
			}
		})
		
		  //redirect code for user
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
			
			
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/password-recovery']) === -1;
	//		alert(restrictedPage);
			
			
			//alert(userinfoPage);
			
            var loggedIn = $rootScope.globals.currentUser;
			
            if (loggedIn) {
				
					if(('JWT' + ' ' +loggedIn.authToken !== $http.defaults.headers.common['token']) && (ENV.WSO2Mode == true)){
						
						$window.location.reload();	
					}
					if(('JWT' + ' ' +loggedIn.authToken !== $http.defaults.headers.common['Authorization']) && (ENV.WSO2Mode == false)){
						
						$window.location.reload();	
					}
            }
				if($location.path().indexOf("userinfo") > -1 || $location.path().indexOf("changepassword") > -1)
				{
				//console.log("ssss");
				
				}else{
					
				
            if (restrictedPage && !loggedIn ) {
					$location.path('/login');
			
            }
			}
			 //  homepage refresh to remove all local storage
               
                
        });
    }]);