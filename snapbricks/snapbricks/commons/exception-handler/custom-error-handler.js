'use strict';

angular.module('myApp.errorHandler', []).provider('errorHandler', function () {
    // Wrap a single function [func] in another function that handles both synchronous and asynchonous errors.
    function decorate($injector, obj, func) {
        return angular.extend(function () {
            var handler = $injector.get('errorHandler');
            return handler.call(func, obj, arguments);
        }, func);
    }

    // Decorate all functions of the service [$delegate] with error handling. This function should be used as decorator
    // function in a call to $provide.decorator().
    var decorator = ['$delegate', '$injector', function ($delegate, $injector) {
        // Loop over all functions in $delegate and wrap these functions using the [decorate] functions above.
        for (var prop in $delegate) {
            if (angular.isFunction($delegate[prop])) {
                $delegate[prop] = decorate($injector, $delegate, $delegate[prop]);
            }
        }
        return $delegate;
    }];

    // The actual service:
    return {
        // Decorate the mentioned [services] with automatic error handling. See demo.js for an example.
        decorate: function ($provide, services) {
            angular.forEach(services, function (service) {
                $provide.decorator(service, decorator);
            });
        },

        $get: function ($log, httpErrors, toaster, appLogger) {
            
            var handler = {
                // The list of errors.
                errors: [],

                // Report the error [err] in relation to the function [func].
                funcError: function (func, err) {                    
                    var logger = appLogger.getInstance(func.name);
                    // This is a very limited error handler... you would probably want to check for user-friendly error messages
                    // that were returned by the server, etc, etc, etc. Our original code contains a lot of checks and handling
                    // of error messages to create the "perfect" error message for our users, you should probably do the same. :)
                    
                    if (err && !angular.isUndefined(err.status) && err.status != 400) {
                        // A lot of errors occur in relation to HTTP calls... translate these into user-friendly msgs.
                        err = httpErrors[err.status];
						
                    }
					else if (err && !angular.isUndefined(err.status) && err.status == 400) {
						//alert(JSON.stringify(err));
						err = err.data.message;
					}
                    else if (err && err.message) {
                        // Exceptions are unwrapped.
                        err = err.message;
                    }
                    if (!angular.isString(err)) {
                        err = 'An unknown error occurred.';
                    }

                    // Use the context provided by the service.
                    if (func && func.description) {
                        err = 'Unable to ' + func.description + '. ' + err;
                    }
					
                //    logger.error('Caught error: ' + err);
					
                    toaster.pop({
                        type: 'error',
                        title: err,
                        showCloseButton: true,
                        timeout: 3000
                    });
					
                    handler.errors.push(err);
                },

                // Call the provided function [func] with the provided [args] and error handling enabled.
                call: function (func, self, args) {                    
                   // $log.debug('Function called: ', (func.name || func));
                    var result;
                    try {
                        result = func.apply(self, args);
                    } catch (err) {
                        // Catch synchronous errors.
                        handler.funcError(func, err);
                        throw err;
                    }

                    // Catch asynchronous errors.
                    var promise = result && result.$promise || result;
                    if (promise && angular.isFunction(promise.then) && angular.isFunction(promise['catch'])) {
                        // promise is a genuine promise, so we call [handler.async].
                        handler.async(func, promise);
                    }

                    return result;
                },

                // Automatically record rejections of the provided [promise].
                async: function (func, promise) {                    
                    promise['catch'](function (err) {
                        handler.funcError(func, err);
                    });
                    return promise;
                }
            };

            return handler;
        }
    };
});
