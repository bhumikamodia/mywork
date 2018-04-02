'use strict';
angular.module('myApp.logger', []).provider('appLogger', [function () {
    var isEnabled = true;
    this.enabled = function (_isEnabled) {
        isEnabled = !!_isEnabled;
    };
    this.$get = ['$log', function ($log) {
        var appLogger = function (context) {
            this.context = context;
        };
        appLogger.getInstance = function (context) {
            return new appLogger(context);
        };
        appLogger.supplant = function (str, o) {
            return str.replace(
                /\{([^{}]*)\}/g,
                function (a, b) {
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };
        appLogger.getFormattedTimestamp = function (date) {
            return appLogger.supplant('{0}:{1}:{2}:{3}', [
                 date.getHours(),
                 date.getMinutes(),
                 date.getSeconds(),
                 date.getMilliseconds()
            ]);
        };
        appLogger.prototype = {
            _log: function (originalFn, args) {
                if (!isEnabled) {
                    return;
                }

                var now = appLogger.getFormattedTimestamp(new Date());
                var message = '', supplantData = [];                
                switch (args.length) {                    
                    case 1:
                        message = appLogger.supplant("{0} - {1}: {2}", [now, this.context, args[0]]);
                        break;
                    case 3:
                        supplantData = args[2];
                        message = appLogger.supplant("{0} - {1}::{2}(\'{3}\')", [now, this.context, args[0], args[1]]);
                        break;
                    case 2:
                        if (typeof args[1] === 'string') {
                            message = appLogger.supplant("{0} - {1}::{2}(\'{3}\')", [now, this.context, args[0], args[1]]);
                        } else {
                            supplantData = args[1];
                            message = appLogger.supplant("{0} - {1}: {2}", [now, this.context, args[0]]);
                        }
                        break;
                }

                $log[originalFn].call(null, appLogger.supplant(message, supplantData));
            },
            log: function () {
                this._log('log', arguments);
            },
            info: function () {
                this._log('info', arguments);
            },
            warn: function () {
                this._log('warn', arguments);
            },
            debug: function () {
                this._log('debug', arguments);
            },
            error: function () {
                this._log('error', arguments);
            }
        };
        return appLogger;
    }];
}]);