'use strict';

var loginModule = angular.module('loginModule.services', []);

loginModule.service('AuthenticationServiceLogin', function ($http, $cookieStore, $rootScope, $timeout, UserService, Base64, ENV,$q,apiConstant,$window,allDataStorage,$cookies) {

    var servicePath = ENV.userapiEndpoint;
	var WSO2Mode = ENV.WSO2Mode;
	var wso2ServerEndpoint = ENV.wso2ServerEndpoint;
    // service.Login = userLogin;
    //service.forgetPassword = forgetPassword;
    // service.SetCredentials = SetCredentials;
    //  service.ClearCredentials = ClearCredentials;


    this.forgetPassword = function (username, callback)
    {
        $timeout(function () {
			 var dataBody = {
						 "username":username,
					   };
       // var authdata = Base64.encode("fooClientIdPassword" + ':' + "secret");
        return $http({
            method: 'POST',
            url: servicePath + apiConstant.forgetPassword,
            data: dataBody, // pass in data as strings
            headers: {
             //   "Authorization": "Basic " + authdata,
                "Content-Type": "application/json"
            }
        }).then(function (response) {
			
			callback(response);
			
			}).catch(function (error) {
					//console.log('Forget Password Error:', error);
					// throw error;
					callback(error);
        });
          /*  var response;
            if (email == 'admin@smartgate.com') {
                response = {success: true};
            }

            else {
                response = {success: false};
            }
            callback(response);*/
        }, 900);
    }
    // return service;
	
	this.userLoginWSO2 = function(username,password,callback){
		 var dataBody = {
						
						 "username":username,
						 "password":password,
						 "apiname":"api",
						 "apiversion":"2.0.0"
					   };
		return	$http({
            method: 'POST',
          //  url: wso2ServerEndpoint + 'store/site/blocks/user/login/ajax/login.jag',
			url: "http://10.107.0.158/auth.php",
            data:$.param(dataBody),
			crossDomain: true,
             headers: {
               
               "Content-Type": "application/x-www-form-urlencoded",
				
            }
		
        }).then(function (response) {
			

					
					
					callback(response);
					
                });
		
		/*
		
		
				
		$.ajax({
    type: "POST",
    url: wso2ServerEndpoint + 'store/site/blocks/user/login/ajax/login.jag',
    data: dataBody,
	xhrFields: { withCredentials: true,HttpOnly:true },
    crossDomain: true,
    success: function(response, status, xhr) {
        console.log("Cookie: " + xhr.getAllResponseHeaders());
	//	console.log(xhr.getResponseHeader('JSESSIONID'));
	//	console.log(document);
	//	console.log($cookies.get('JSESSIONID'));
	$cookieStore.put("cookieheader",xhr.getResponseHeader("Set-Cookie"));
		callback(response);
    }
});*/
		
		
	};
	this.userSubscribeWSO2 = function(username,password,token,type,callback){
		//alert(token);
		//alert(type);
		 var dataBody = {
						 "username":username,
						 "password":password
					   };
		return $.ajax({
            url: wso2ServerEndpoint+'api/users/login/',
		    crossDomain: true,
		    data: {
					username: username,
					password: password
					},
					beforeSend: function(request){
						request.setRequestHeader('Authorization', type+' '+token);
						//request.setRequestHeader('To', "10.107.0.186");
					},
					type: "POST",
					success: function(data) {
					   callback(data);
					},
					error: function(data) {
						//alert('error');
						callback(data);
					}
        });
		
		
		/*$http({
            method: 'POST',
            url: wso2ServerEndpoint + 'users/login',
			 crossDomain: true,
            data:$.param(dataBody),
            headers: {
                "Authorization": type+" " + token,
               // "Content-Type": "application/x-www-form-urlencoded",
				"To":"10.107.0.186"
            }
        }).then(function (response) {
					alert(JSON.stringify(response));
					
					//callback(response);
					
                });*/
	};
    this.userLogin = function (username, password,callback) {
		
		
		
			 var dataBody = {
						 "username":username,
						 "password":password
					   };
       // var authdata = Base64.encode("fooClientIdPassword" + ':' + "secret");
        return $http({
            method: 'POST',
            url: servicePath + apiConstant.login,
            data: dataBody, // pass in data as strings
            headers: {
             //   "Authorization": "Basic " + authdata,
                "Content-Type": "application/json"
            }
        })

                .then(function (response) {
					
					var dataLength = response.data.Data.token;
					
					if(dataLength.length>0)
					{
					//console.log(dataLength);	
					//console.log(dataLength.length);
                   /* var expiredAt = new Date();
                    expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
                    response.expires_at = expiredAt.getTime();
                    //localStorageService.set('token', response);
					*/
                    var authToken = dataLength;
					//alert(authToken);
                   /* $rootScope.globals = {
                        currentUser: {
                           // username: response.data.userName,
                            authToken: authToken,
                          //  tenantId: response.data.tenantId,
                         //   siteId: 1,
                        //    userId: 1
                        }
                    };
					$http.defaults.headers.common['Authorization'] = 'JWT' + ' ' + authToken; // jshint ignore:line
                    $cookieStore.put('globals', $rootScope.globals);
                  */
				  $http.defaults.headers.common['Authorization'] = 'JWT' + ' ' + authToken; // jshint ignore:line
                //  $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                    // console.log(response);
//*********			
                    //return response;
                   callback(response);
//*********			
					}
                }).catch(function (error) {
			//		console.log('Login Error:', error);
					// throw error;
					callback(error);
				});
		
		
		
		
       

 /*
         $timeout(function () {
        
			var response;
         if(username == 'sombabu.gunithi' && password =='reset123'){
         response = {success: true};
         }
         
         else {
        response = {success: false, message: 'Username or password is incorrect'};
         }
         callback(response);
         }, 900);
        
     */

    };
    /*    function Login(username, password, callback) {
     
     $timeout(function () {
     var response;
     if(username == 'admin' && password =='admin'){
     response = {success: true};
     }
     
     else {
     response = {success: false, message: 'Username or password is incorrect'};
     }
     callback(response);
     }, 900);
     */

    /* Dummy authentication for testing, uses $timeout to simulate api call
     ----------------------------------------------*/
    /*$timeout(function () {
     var response;
     UserService.GetByUsername(username)
     .then(function (user) {
     if (user !== null && user.password === password) {
     response = {success: true};
     } else {
     response = {success: false, message: 'Username or password is incorrect'};
     }
     callback(response);
     });
     }, 1000);*/

    /* Use this for real authentication
     ----------------------------------------------*/
    //$http.post('/api/authenticate', { username: username, password: password })
    //    .success(function (response) {
    //        callback(response);
    //    });

    /* }
     
     function SetCredentials(username, password) {
     var authdata = Base64.encode(username + ':' + password);
     
     $rootScope.globals = {
     currentUser: {
     username: username,
     authdata: authdata
     }
     };
     
     $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
     $cookieStore.put('globals', $rootScope.globals);
     }
     */

	this.SetCredentials = function (token,callback) {
			//sessionStorage.permissions =[];
		
		return $http({
            method: 'GET',
            url: servicePath + apiConstant.SetCredentials,
            headers: {
               'Authorization': 'JWT'+' '+token,
               'Content-Type': 'application/json'
            }
        }).then(function (response) {
			//console.log(response);return false;
			//console.log(response.data.permissions);
				$rootScope.globals = {
                        currentUser: {
                            firstname: response.data.firstname,
							lastname: response.data.lastname,
                            email: response.data.email,
							authToken: response.data.auth,
							username: response.data.username,
                            id: response.data.id,
							orgid: response.data.orgid
							//permissions: response.data.permissions
                        }
                    };
				//$window.sessionStorage.setItem("permissions",JSON.stringify(response.data.permissions));
				//localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
				allDataStorage.setData(response.data.permissions);
				//$window.localStorage.setItem('authToken',response.data.auth);
				$cookieStore.put('globals', $rootScope.globals);
				 callback(response);
				}).catch(function (error) {
					//console.log('Credentials Error:', error);
					// throw error;
				 callback(error);
				});
		
      

     
       
    };
   this.SetCredentialsWSO2 = function (token,accessToken,accessType,callback) {
			//sessionStorage.permissions =[];
		
		return $http({
            method: 'GET',
            url: wso2ServerEndpoint + apiConstant.SetCredentials,
            headers: {
			   'Authorization': accessType+' '+accessToken,
               'token': 'JWT'+' '+token,
			 //  'To':"10.107.0.186",
               'Content-Type': 'application/json'
            }
        }).then(function (response) {
			//console.log(response);return false;
			//console.log(response.data.permissions);
				$rootScope.globals = {
                        currentUser: {
                            firstname: response.data.firstname,
							lastname: response.data.lastname,
                            email: response.data.email,
							authToken: response.data.auth,
							username: response.data.username,
                            id: response.data.id,
							orgid: response.data.orgid,
							accessToken:accessToken,
							accessType:accessType,
							//permissions: response.data.permissions
                        }
                    };
				//$window.sessionStorage.setItem("permissions",JSON.stringify(response.data.permissions));
				//localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
				allDataStorage.setData(response.data.permissions);
				//$window.localStorage.setItem('authToken',response.data.auth);
				$cookieStore.put('globals', $rootScope.globals);
				$http.defaults.headers.common['token'] = 'JWT'+' '+response.data.auth;
				$http.defaults.headers.common['Authorization'] = accessType + ' '+ accessToken;
			//	$http.defaults.headers.common['To'] = "10.107.0.186";
				 callback(response);
				}).catch(function (error) {
				//	console.log('Credentials Error:', error);
					// throw error;
				 callback(error);
				});
		
      

     
       
    };


    function ClearCredentials() {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Bearer';
    }

}).service('FlashService', function ($rootScope) {
    var service = {};

    service.Success = Success;
    service.Error = Error;

    initService();

    return service;

    function initService() {
        $rootScope.$on('$locationChangeStart', function () {
            clearFlashMessage();
        });

        function clearFlashMessage() {
            var flash = $rootScope.flash;
            if (flash) {
                if (!flash.keepAfterLocationChange) {
                    delete $rootScope.flash;
                } else {
                    // only keep for a single location change
                    flash.keepAfterLocationChange = false;
                }
            }
        }
    }

    function Success(message, keepAfterLocationChange) {
        $rootScope.flash = {
            message: message,
            type: 'success',
            keepAfterLocationChange: keepAfterLocationChange
        };
    }

    function Error(message, keepAfterLocationChange) {
        $rootScope.flash = {
            message: message,
            type: 'error',
            keepAfterLocationChange: keepAfterLocationChange
        };
    }
}).service('UserService', function ($timeout, $filter, $q) {
    var service = {};

    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByUsername = GetByUsername;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;

    return service;

    function GetAll() {
        var deferred = $q.defer();
        deferred.resolve(getUsers());
        return deferred.promise;
    }

    function GetById(id) {
        var deferred = $q.defer();
        var filtered = $filter('filter')(getUsers(), {id: id});
        var user = filtered.length ? filtered[0] : null;
        deferred.resolve(user);
        return deferred.promise;
    }

    function GetByUsername(username) {
        var deferred = $q.defer();
        var filtered = $filter('filter')(getUsers(), {username: username});
        var user = filtered.length ? filtered[0] : null;
        deferred.resolve(user);
        return deferred.promise;
    }

    function Create(user) {
        var deferred = $q.defer();

        // simulate api call with $timeout
        $timeout(function () {
            GetByUsername(user.username)
                    .then(function (duplicateUser) {
                        if (duplicateUser !== null) {
                            deferred.resolve({success: false, message: 'Username "' + user.username + '" is already taken'});
                        } else {
                            var users = getUsers();

                            // assign id
                            var lastUser = users[users.length - 1] || {id: 0};
                            user.id = lastUser.id + 1;

                            // save to local storage
                            users.push(user);
                            setUsers(users);

                            deferred.resolve({success: true});
                        }
                    });
        }, 900);

        return deferred.promise;
    }

    function Update(user) {
        var deferred = $q.defer();

        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === user.id) {
                users[i] = user;
                break;
            }
        }
        setUsers(users);
        deferred.resolve();

        return deferred.promise;
    }

    function Delete(id) {
        var deferred = $q.defer();

        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.id === id) {
                users.splice(i, 1);
                break;
            }
        }
        setUsers(users);
        deferred.resolve();

        return deferred.promise;
    }

    // private functions

    function getUsers() {
        if (!localStorage.users) {
            localStorage.users = JSON.stringify([]);
        }

        return JSON.parse(localStorage.users);
    }

    function setUsers(users) {
        localStorage.users = JSON.stringify(users);
    }

}).service('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + keyStr.charAt(enc1)
                        + keyStr.charAt(enc2)
                        + keyStr.charAt(enc3)
                        + keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9,
            // +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window
                        .alert("There were invalid base64 characters in the input text.\n"
                                + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
                                + "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});