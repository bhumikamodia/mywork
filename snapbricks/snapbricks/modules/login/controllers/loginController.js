'use strict';
//	Login Angular Module Controller
var loginModule = angular.module('loginModule.controllers', ['toaster','ngCookies']);
	//	Controller Function	:	indexCtrl
	//	Parameters			:	$scope, $rootScope, $location
    loginModule.controller('indexCtrl', function($scope, $rootScope, $location, $cookieStore,$timeout,$state,AclService,allDataStorage,WebMqtt){
		$scope.can = AclService.can;
		/* $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
			 
		 });*/
		
		
		$scope.menuClass = function (viewLocation) {
			  var current = $location.path().substring(1);
			  
			 return $location.path().indexOf(viewLocation) > -1 ? "active_opt" : "";
		};
        
		
        $scope.$on('$locationChangeStart', function () {
            
            var o1 = $location.path();
            var o2 = '/login';
            var o3 = '/password-recovery';
			var o4 = '/userinfo/';
			var o5 = '/changepassword/';
            if(o1.match(o2)){
                
                $scope.loginTopMenu = function() {
                    return true;
                };
                $scope.dashboardTopMenu = function() {
                    return false;
                };
				
                //hide top-left and right menu
                $scope.topLeftMenu = function() {
                    return false;
                };
                $scope.dashboardContainer = function() {
                    return false;
                };                                
                $scope.loginContainer = function() {
                    return true;
                };
                                
            }else if(o1.match(o3)){
                
                $scope.loginTopMenu = function() {
                    return true;
                };
                $scope.dashboardTopMenu = function() {
                    return false;
                };
				
                //hide top-left and right menu
                $scope.topLeftMenu = function() {
                    return false;
                };
                $scope.dashboardContainer = function() {
                    return false;
                };                                
                $scope.loginContainer = function() {
                    return true;
                };
            }else if(o1.match(o4)){
               
                 $scope.loginTopMenu = function() {
                    return true;
                };
                $scope.dashboardTopMenu = function() {
                    return false;
                };
                //hide top-left and right menu
                $scope.topLeftMenu = function() {
                    return false;
                };
                
                //hide admin dashboard header
                $scope.adminDashboardTopMenu = function(){
                    return false;
                }
                $scope.dashboardContainer = function() {
                        return false;
                };
                $scope.loginContainer = function() {
                        return true;
                };
            }
			else if(o1.match(o5)){
               
                 $scope.loginTopMenu = function() {
                    return true;
                };
                $scope.dashboardTopMenu = function() {
                    return false;
                };
                //hide top-left and right menu
                $scope.topLeftMenu = function() {
                    return false;
                };
                
                //hide admin dashboard header
                $scope.adminDashboardTopMenu = function(){
                    return false;
                }
                $scope.dashboardContainer = function() {
                        return false;
                };
                $scope.loginContainer = function() {
                        return true;
                };
            }
			
			/*else if($location.absUrl().split('?')[0].match(o4)) {
                
                //show 'container' class for admin pages
                $scope.loginContainer = function() {
                    return true;
                };
                
                //show 'content-wrapper' class for admin pages
                $scope.dashboardContainer = function() {
                    return false;
                };
                
            }else if (o1.match(o5)) {

                $scope.loginTopMenu = function () {
                    return false;
                };
                $scope.dashboardTopMenu = function () {
                    return false;
                };

                //hide top-left and right menu
                $scope.topLeftMenu = function () {
                    return false;
                };
                $scope.dashboardContainer = function () {
                
                    return true;
                };
                $scope.loginContainer = function () {
                    return false;
                };
            }   */else {
               
                $scope.loginTopMenu = function() {
                    return false;
                };
                $scope.dashboardTopMenu = function() {
                    return true;
                };
                //hide top-left and right menu
                $scope.topLeftMenu = function() {
                    return true;
                };
                
                //hide admin dashboard header
                $scope.adminDashboardTopMenu = function(){
                    return false;
                }
                $scope.dashboardContainer = function() {
                        return true;
                };
                $scope.loginContainer = function() {
                        return false;
                };
            }
			//console.log("indexCtrl");
			
			$rootScope.globals = $cookieStore.get('globals') || {};
			
			if (!$rootScope.globals.currentUser) {
			if($location.path().indexOf("userinfo") > -1 || $location.path().indexOf("changepassword") > -1)
			{
				return false;
			}else{
				
				$location.path('/login');
				return false;
			}
				
			} else {
				//console.log($rootScope.globals.currentUser.firstname);
				//console.log($rootScope.globals.currentUser.lastname);
				//console.log($rootScope.globals.currentUser.username);
				//console.log($rootScope.globals.currentUser);
				
				$scope.username = $rootScope.globals.currentUser.username;
				$scope.userFullName = $rootScope.globals.currentUser.user;
				//console.log(SocketData);
				
				$scope.WebMqtt = WebMqtt;
				
			}
		
        });

    });
	//	Controller Function	:	loginCtrl
	//	Parameters			:	$scope, $rootScope, $cookieStore, $location, AuthenticationServiceLogin, FlashService, toaster, $http, $controller
    loginModule.controller('loginCtrl', function ($scope, $rootScope, $cookieStore, $location, AuthenticationServiceLogin, FlashService, toaster, $http, $controller,CustomMessages,$timeout,AclService,$filter,ENV,$cookies) {
		
        //redirect user to dashboard if already logged in
        $rootScope.globals = $cookieStore.get('globals') || {};

            if ($rootScope.globals.currentUser) {
                $location.path('/home');
						
         }
		 
		//	Captcha Usage uncomment the code if enable on Login Page.
		/*$scope.response = null;
        $scope.widgetId = null;

        $scope.model = {
            key: '6LceOiATAAAAAFV51Cr7LMYlnFAViqxUndT46eiQ'
        };

        $scope.setResponse = function (response) {
           // console.info('Response available');

            $scope.response = response;
        };
		$scope.setWidgetId = function (widgetId) {
          //  console.info('Created widget ID: %s', widgetId);

            $scope.widgetId = widgetId;
        };

        $scope.cbExpiration = function() {
            console.info('Captcha expired. Resetting response object');

            vcRecaptchaService.reload($scope.widgetId);

            $scope.response = null;
         };    */  
		 //	End of Captcha Usage uncomment the code if enable on Login Page.
		//	Function Name :	forget password
		$scope.forgetPassword = function(){
			$scope.dataLoading = true;
			AuthenticationServiceLogin.forgetPassword($scope.username, function (response) {
			//	console.log(response);
			if (response.status==200) {
			 toaster.pop('success', "", CustomMessages.FORGET_PASSWORD_EMAIL_SUCCESS);
			 $scope.dataLoading = false;
			}else{
			toaster.pop('error', "", response.statusText);
			$scope.dataLoading = false;
			}
				
			});
				 
		};	
        //AuthenticationService.ClearCredentials();
		//	Function Name :	login
        $scope.login = function (){
            $scope.dataLoading = true;
			 
        /*    var response;
            if($scope.username == 'admin' && $scope.password =='admin'){
                response = {success: true};
            } else {
                response = {success: false, message: 'Username or password is incorrect'};
            }*/
           //callback(response);
		  
				if(ENV.WSO2Mode == false){
					AuthenticationServiceLogin.userLogin($scope.username,$scope.password, function (response) {
					
					
					//console.log(response);
					$timeout(function(){
					//console.log(response.status);
					
					if (response.status==200) {
						
							
						
						var token = response.data.Data.token;
						
                     
					  
					  
					  
						AuthenticationServiceLogin.SetCredentials(token, function (response) {
						//console.log(response);
						//return false;
						AclService.flushRoles();
						var permission = response.data.permissions;
						if(permission != undefined)
						{
							
						
						permission = $filter('unique')(permission); 
						//console.log(permission);
						for(var per =0;per<permission.length;per++)
						{
							AclService.addAbility('admin',permission[per]);
							//console.log(permission[per]);
						}
						AclService.attachRole('admin');
						}
						if (response.status==200) {
						toaster.pop('success', "", CustomMessages.GATEWAY_LOGIN_SUCCESS);
                        $location.path('/home');
						}else{
						toaster.pop('error', "", CustomMessages.TOKEN_ERROR);
						$scope.dataLoading = false;
						}
						
						});
						
						
						
						
						
						
                		
				    }
					else if(response.status == -1)
					{
						 toaster.pop('error', CustomMessages.LOGIN_ERROR);
						 $scope.dataLoading = false;
					}
					
					else {
                        toaster.pop('error', response.data.message);
                        $scope.dataLoading = false;
                    }
					});
           });
				}else{
					AuthenticationServiceLogin.userLoginWSO2($scope.username,$scope.password, function (response) {
						//alert(JSON.stringify(response));
				//		console.log($cookies); // return {}
					//console.log(response.data.length); // return {}
					
				
					
				
					
				
						if((response.data == undefined || response.data.length === 1 || response.status != 200) || response.data.length <=0)
						{
							  toaster.pop('error', "Not Getting Response - User not subscribe !!!");
							  $scope.dataLoading = false;
						}else{
							if(response.data.error ==false)
						{	
							$scope.access_token = response.data.access_token;
							$scope.token_type = response.data.token_type;
							AuthenticationServiceLogin.userSubscribeWSO2($scope.username,$scope.password,response.data.access_token,response.data.token_type,function(response){
								
								//alert(token);
								if(response.Data == undefined){
									toaster.pop('error', "Not Connected (Timeout) - Please try again for login!!!");
									$scope.dataLoading = false;
								}else{
									var token = response.Data.token;
									AuthenticationServiceLogin.SetCredentialsWSO2(token,$scope.access_token,$scope.token_type, function (response) {
										//console.log(response);
										//return false;
										AclService.flushRoles();
										var permission = response.data.permissions;
										if(permission != undefined)
										{
											
										
										permission = $filter('unique')(permission); 
										//console.log(permission);
										for(var per =0;per<permission.length;per++)
										{
											AclService.addAbility('admin',permission[per]);
											//console.log(permission[per]);
										}
										AclService.attachRole('admin');
										}
										if (response.status==200) {
										toaster.pop('success', "", CustomMessages.GATEWAY_LOGIN_SUCCESS);
										$location.path('/home');
										}else{
										toaster.pop('error', "", CustomMessages.TOKEN_ERROR);
										$scope.dataLoading = false;
										}
								
									});
								}
								
								
							});
							 
							
						}else{
							  toaster.pop('error', response.data.message);
							  $scope.dataLoading = false;
						}
						}
						
					}).catch(function(error){
							$scope.dataLoading = false;
					});
				}
                
			
        };

    });