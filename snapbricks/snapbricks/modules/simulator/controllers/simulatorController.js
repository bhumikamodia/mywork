var simulatorModule = angular.module('simulatorModule.controllers', ['ui.bootstrap', 'ngSanitize', 'ngTagsInput', 'elif']);



/*main ctrl that calls when this module clicks.*/
simulatorModule.controller('simulatorCtrl', function($scope, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService) {
    $scope.dataResourceLoading = false;
    $scope.dataSetupLoading = false;
    $scope.dataTestEnvLoading = false;
    $scope.testenvGatewayLoading = false
    $scope.testenvDeviceLoading = false
    $scope.testenvXclLoading = false;
    $scope.deviceFlag = false
    $scope.createBroker = { "broker_ip": ENV.simulatorConnectionUrl, "broker_port": ENV.simulatorConnectionPort, "broker_username": 'ei12@', "broker_password": "ei12@" }
    /*MQTT connection code*/
    client = new Paho.MQTT.Client(ENV.simulatorConnectionUrl, ENV.simulatorConnectionPort, "/ws", "myclientid_" + parseInt(Math.random() * 100, 10));
    console.log("client id :: " + "myclientid_" + parseInt(Math.random() * 100, 10))
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
        useSSL: false,
        userName: "iotuser",
        password: "ei12@",
        onSuccess: onConnect,
        onFailure: doFail
    }
    client.connect(options);

    /*connection success method*/
    function onConnect() {
        console.log("onConnect");
        $scope.client = client
        $rootScope.$broadcast('client', $scope.client)
        var obj = {}
        $scope.dataResourceLoading = true;
        $scope.dataSetupLoading = true;

        /*message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/Resources/Get';
        client.send(message);
        client.subscribe("EI/SimulatorSetup/Resources/Get/Reply", { qos: 1, onFailure: doFail });*/
        //console.log("subscribed on EI/SimulatorSetup/Resources/Get/REp")
        /*message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/Get';
        client.send(message);
        client.subscribe("EI/SimulatorSetup/TestEnvironmentSetup/Get/Reply", { qos: 1, onFailure: doFail });*/
        //console.log("subscribed on EI/SimulatorSetup/TestEnvironmentSetup/Get/Reply")
        client.subscribe("EI/SimulatorSetup/TestEnvironmentSetup/State/Put", { qos: 1, onFailure: doFail });
    }

    //called when client fail to connect
    function doFail(e) {
        console.log(e);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log("msga arricveds", message.destinationName)
        /*for resource messages*/
        if (message.destinationName.match(/^EI\/SimulatorSetup\/Resources\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)

            } catch (e) {}
            $scope.dataResourceLoading = false;

            if (message.responsecode == 200) {

                $scope.deviceList = message.devices
                $rootScope.$broadcast('devicelist', $scope.deviceList)

            } else {
                toaster.pop('error', '', "" + message.message);
            }
            $rootScope.$broadcast('resourceLoading', $scope.dataResourceLoading)
            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironmentSetup\/State\/Put$/)) {

            try {
                message = JSON.parse(message.payloadString)

            } catch (e) {}


            if (message.responsecode == 200) {

                toaster.pop('success', '', "" + message.displayname + " " + message.message);

            } else {
                toaster.pop('error', '', "" + message.message);
            }



        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/Resources\/.*\/Raml\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)

            } catch (e) {}
            console.log("devices raml", JSON.stringify(message))
            if (message.responsecode == 200) {
                $scope.deviceRaml = message.device_json
                $rootScope.$broadcast('deviceraml', { "device_json": message.device_json, "device_name": message.device_name })
            } else {
                toaster.pop('error', '', "" + message.message);
            }

            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/Resources\/Put\/Reply$/)) {
            try {
                message = JSON.parse(message.payloadString)
            } catch (e) {}
            $rootScope.$broadcast('newdevice', message)
        }
        /*complete resource messages*/

        /*testsetup messages*/
        else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironmentSetup\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
            } catch (e) {}
            $scope.dataSetupLoading = false;
            if (message.responsecode == 200) {
                $scope.envSetupList = message.environments
                $rootScope.$broadcast('envSetupList', $scope.envSetupList)
                console.log("devices", JSON.stringify($scope.envSetupList));
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            $rootScope.$broadcast('loadingsetup', $scope.dataSetupLoading)
            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironmentSetup\/Put\/Reply$/)) {
            try {
                message = JSON.parse(message.payloadString)
            } catch (e) {}
            $rootScope.$broadcast('newtestsetup', message)
        }
        /*complete test setupsss*/


        /*start test env*/
        else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironment\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
            } catch (e) {}
            $scope.dataTestEnvLoading = false;

            if (message.responsecode == 200) {
                $scope.envList = message.environments
                $rootScope.$broadcast('envlist', $scope.envList)
                console.log("envlist", JSON.stringify($scope.envList));
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            $rootScope.$broadcast('loadingflag', $scope.dataTestEnvLoading)
            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironment\/.*\/Gateways\/.*\/Devices\/.*\/Properties\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {

                $scope.regprop = message.properties_data
                $rootScope.$broadcast('regprop', $scope.regprop)
                console.log("regprop", JSON.stringify(message));
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironment\/.*\/Gateways\/.*\/Devices\/.*\/Properties\/Put\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {
                toaster.pop('success', '', "" + message.message);
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)
        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironment\/.*\/Gateways\/.*\/Devices\/.*\/Devicestatus\/Put\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {
                toaster.pop('success', '', "" + message.message);
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)
        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironment\/.*\/Gateways\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee gateway list testenv", JSON.stringify(message));
            } catch (e) {}
            $scope.testenvGatewayLoading = false;
            if (message.responsecode == 200) {
                $scope.gatewayList = message.gateways
                $rootScope.$broadcast('envgateway', $scope.gatewayList)
                $rootScope.$broadcast('envgatewayloading', $scope.testenvGatewayLoading)
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)
        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironment\/.*\/Gateways\/.*\/Resources\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee device list testenv", message);
            } catch (e) {}
            $scope.testenvDeviceLoading = false
            if (message.responsecode == 200) {
                $scope.envdevicesList = message.devices
                $rootScope.$broadcast('envdevices', $scope.envdevicesList)
                $rootScope.$broadcast('envdevicesloading', $scope.testenvDeviceLoading)
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)
        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironment\/.*\/Gateways\/.*\/Resources\/.*\/Raml\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {

                $scope.devraml = message
                $rootScope.$broadcast('devraml', $scope.devraml)
                console.log("regprop", JSON.stringify(message));
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/Resources\/Del\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {
                toaster.pop('success', '', "" + message.message);

            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/ActionBot\/Put\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {

                toaster.pop('success', '', "" + message.message);
                $rootScope.$broadcast('actionbot', '');
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)

        }else if (message.destinationName.match(/^EI\/ActionBot\/.*\/Get\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            $scope.testenvXclLoading = false;
            if (message.responsecode == 200) {
                $scope.excelList = message.data;
                toaster.pop('success', '', "" + message.message);

                
              
            } else {
                $scope.excelList = []
                toaster.pop('error', '', "" + message.message);
            } 
            $rootScope.$broadcast('excelList',$scope.excelList);
             $rootScope.$broadcast('excelListLoading',$scope.testenvXclLoading);
            client.unsubscribe(topic)

        } else if (message.destinationName.match(/^EI\/FireActionBot\/Put\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {

                toaster.pop('success', '', "" + message.message);
                $rootScope.$broadcast('fireactionbot', '');
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)

        }
        else if (message.destinationName.match(/^EI\/VerifyFiredActionBot\/Put\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {

                toaster.pop('success', '', "" + message.message);
                $rootScope.$broadcast('verifyactionbot', '');
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)
        }  else if (message.destinationName.match(/^EI\/ActionBot\/Del\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee control", message);
            } catch (e) {}
            if (message.responsecode == 200) {

                toaster.pop('success', '', "" + message.message);
                $rootScope.$broadcast('delactionbot', '');
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)
        }

        else if (message.destinationName.match(/^EI\/ActionBot\/DataFile\/DownloadActionBotXlsx\/Get\/Reply\/.*$/)) {
            var topic = message.destinationName
           console.log(topic)
           console.log(message.payloadBytes)
           var rcode =  topic.substr(topic.length - 3);
           console.log(rcode==200)
        //var sampleBytes = new Int8Array(4096);
            if(rcode==200){
                $rootScope.$broadcast('downloadData',message.payloadBytes)
                
            }else{
                toaster.pop('error','','Error in File download')
            }
           client.unsubscribe('EI/ActionBot/DataFile/DownloadActionBotXlsx/Get/Reply/#')
        }      /*complete test envs*/
    }

    $scope.testenvtab = function() {
        var message;
        var obj = {}
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironment/Get';
        client.send(message);
        client.subscribe("EI/SimulatorSetup/TestEnvironment/Get/Reply", { qos: 1, onFailure: doFail });
        $rootScope.$broadcast('refreshenv', '');
    }
});

/*Explorer tab controller of simulator module*/
simulatorModule.controller('simulatorExplorerCtrl', function($scope, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService) {
    $scope.dataSetupLoading = true;
    $scope.dataResourceLoading = true;
    $scope.deviceList = [];
    $scope.envSetupList = [];

    function doFail(e) {
        console.log(e);
    }

    $scope.$on('loadingsetup', function(e, a) {
        $scope.dataSetupLoading = a;
        $scope.$apply()


    })
    $scope.$on('resourceLoading', function(e, a) {
        $scope.dataResourceLoading = a;
        $scope.$apply()

    })
    /*receive the client object from main ctrl*/
    $scope.$on('client', function(e, a) {
        $scope.client = a;
        console.log("in explore", $scope.client)
    })
    /*receive the device list from main ctrl*/
    $scope.$on('devicelist', function(e, a) {
        $scope.deviceList = a;
        $scope.$apply()

        $scope.currentDevicePage = 1;
        $scope.DevicePerPage = ENV.recordPerPage;
    })
    /*receive the env setup list from main ctrl*/
    $scope.$on('envSetupList', function(e, a) {
        $scope.envSetupList = a;
        $scope.$apply()
        $scope.currentEnvSetupPage = 1;
        $scope.EnvSetupPerPage = ENV.recordPerPage;
        console.log($scope.EnvSetupPerPage)

    })
    $scope.editFlag = false
    $scope.editBrokerDetails = function() {
        $scope.editFlag = true
    }
    $scope.cancelBroker = function() {
        $scope.editFlag = false
    }
    $scope.assignDevicesOption = false
    $scope.assigntestEnvironmentOption = false
    $scope.brokerConfig = false


    /*for setting selected devices buttton*/
    $scope.assignDevices = function() {
        $scope.assignDevicesOption = true
        $scope.assigntestEnvironmentOption = false
        $scope.brokerConfig = false
        var obj = {};
        var message
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/Resources/Get';
        client.send(message);
        client.subscribe("EI/SimulatorSetup/Resources/Get/Reply", { qos: 1, onFailure: doFail });
    }

    /*for setting selected broker config buttton*/
    $scope.brokerConfigdata = function() {
        $scope.assignDevicesOption = false
        $scope.assigntestEnvironmentOption = false
        $scope.brokerConfig = true
    }
    /*for setting selected testsetup buttton*/
    $scope.assigntestEnvironment = function() {
        $scope.assignDevicesOption = false
        $scope.assigntestEnvironmentOption = true
        $scope.brokerConfig = false
        var obj = {}
        var message
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/Get';
        $scope.client.send(message);
        $scope.client.subscribe("EI/SimulatorSetup/TestEnvironmentSetup/Get/Reply", { qos: 1, onFailure: doFail });
    }
    /*for open modal for add new resources*/
    $scope.createDevices = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modaladdDevices.html',
            controller: 'newdevicesCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: { 'client': $scope.client }
            }
        });
    }
    /*called when delete the resource*/
    $scope.deleteResource = function(deviceData) {
        console.log(deviceData)
        var obj = { "device_name": deviceData.device_name }
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/Resources/Del';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/Resources/Del/Reply', { qos: 1, onFailure: doFail });
        var obj = {}
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/Resources/Get';
        $scope.client.send(message);
        $scope.client.subscribe("EI/SimulatorSetup/Resources/Get/Reply", { qos: 1, onFailure: doFail });
    }
    /*called when edit the resource*/
    $scope.editDevice = function(deviceData) {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modaladdDevices.html',
            controller: 'newdevicesCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: { 'client': $scope.client, 'devicedata': deviceData }
            }
        });
    }
    $scope.$on('deviceraml', function(e, a) {
        $scope.seldevice = a;
        console.log($scope.seldevice)

        //$scope.dataLoading = false
        localStorage.setItem('resource', JSON.stringify($scope.seldevice))
        localStorage.setItem('ramlflag', false)
        $location.path('/simulator/resources/raml');
        $scope.$apply()
        $scope.client.disconnect()
    })
    $scope.openRAMLView = function(device) {
        //alert("hello")
        $scope.dataLoading = true;
        $scope.seldeviceName = device.device_name
        $scope.seldevice = []
        message = new Paho.MQTT.Message(JSON.stringify({ "device_name": device.device_name }));
        message.destinationName = 'EI/SimulatorSetup/Resources/' + device.device_name + '/Raml/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/Resources/' + device.device_name + '/Raml/Get/Reply', { qos: 1, onFailure: doFail });

    }
    /*called when adding new test setup*/
    $scope.createTestSetup = function() {
        localStorage.setItem('client', JSON.stringify($scope.client))
        $scope.client.disconnect()
        $location.path('/simulator/addtestsetup')
    }

    /*called when edit existing test setup*/
    $scope.edittestSetup = function(setupdata) {
        $scope.client.disconnect()
        localStorage.setItem('client', JSON.stringify($scope.client))
        localStorage.setItem('devicelist', JSON.stringify($scope.deviceList))
        localStorage.setItem('setupdata', JSON.stringify(setupdata))
        $location.path('/simulator/' + setupdata.environmentid + '/edittestsetup')
    }

    /*called when deleting test setup*/
    $scope.deletetestsetup = function(testenv) {
        var obj = { "displayname": testenv.displayname, "environmentid": testenv.environmentid }
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/' + testenv.environmentid + '/Del';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/TestEnvironmentSetup/' + testenv.environmentid + '/Del/Reply', { qos: 1, onFailure: doFail });
        var obj = {}
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/Get';
        client.send(message);
        client.subscribe("EI/SimulatorSetup/TestEnvironmentSetup/Get/Reply", { qos: 1, onFailure: doFail });
    }
});

/*controller for adding new resources*/
simulatorModule.controller('newdevicesCtrl', function($scope, dsparam, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService, $uibModalInstance) {

    $scope.client = dsparam.client
    if (dsparam.devicedata != undefined) {
        $scope.createDevice = dsparam.devicedata
        console.log(JSON.stringify($scope.createDevice))
    }
    /*receive new resource add response*/
    $scope.$on('newdevice', function(e, a) {
        console.log("messgae in new device", a)
        if (message.responsecode == 200) {} else {}
        $scope.clearDevicemodal()
    })

    function doFail(e) {
        console.log(e);
    }
    /*called when close the modal*/
    $scope.clearDevicemodal = function() {
        $uibModalInstance.close();
        $scope.client.unsubscribe('EI/SimulatorSetup/Resources/Put/Reply')
    }

    /*called when save the resource information*/
    $scope.saveDeviceData = function(deviceData) {
        var obj;
        if (deviceData.device_raml == undefined) {
            obj = { "device_name": deviceData.device_name, "device_json": deviceData.device_json }
        } else if (deviceData.device_json == undefined) {
            obj = { "device_name": deviceData.device_name, "device_raml": deviceData.device_raml }
        } else {
            obj = { "device_name": deviceData.device_name, "device_raml": deviceData.device_raml }
        }
        console.log(JSON.stringify(deviceData))
        $scope.client.subscribe("EI/SimulatorSetup/Resources/Put/Reply", { qos: 1, onFailure: doFail });
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/Resources/Put';
        $scope.client.send(message);
        message = new Paho.MQTT.Message(JSON.stringify('{}'));
        message.destinationName = 'EI/SimulatorSetup/Resources/Get';
        $scope.client.send(message);
        $scope.client.subscribe("EI/SimulatorSetup/Resources/Get/Reply", { qos: 1, onFailure: doFail });
    }
});

/*controller for edit test setup data*/
simulatorModule.controller('modaledittestsetupCtrl', function($scope, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService, $uibModal) {
    /*mqtt connection code*/
    client = new Paho.MQTT.Client(ENV.simulatorConnectionUrl, ENV.simulatorConnectionPort, "/ws", "myclientid_" + parseInt(Math.random() * 100, 10));
    console.log("client id :: " + "myclientid_" + parseInt(Math.random() * 100, 10))
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
        useSSL: false,
        userName: "iotuser",
        password: "ei12@",
        onSuccess: onConnect,
        onFailure: doFail
    }
    client.connect(options);

    function onConnect() {
        console.log("onConnect");
        $scope.client = client
        $rootScope.$broadcast('client', $scope.client)
        var obj = {}
        console.log(JSON.stringify(obj))
        client.subscribe("EI/SimulatorSetup/TestEnvironmentSetup/State/Put", { qos: 1, onFailure: doFail });
    }

    function doFail(e) {
        console.log(e);
    }
    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }
    // called when a message arrives
    function onMessageArrived(message) {
        console.log(message.payloadString)
        if (message.destinationName.match(/^EI\/SimulatorSetup\/Resources\/Get\/Reply$/)) {
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee resource", message);
            } catch (e) {}
            if (message.responsecode == 200) {
                $scope.deviceList = message.devices
                $rootScope.$broadcast('devicelist', $scope.deviceList)
                console.log("devices", $scope.deviceList);
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe('EI/SimulatorSetup/Resources/Get/Reply')
        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironmentSetup\/State\/Put$/)) {

            try {
                message = JSON.parse(message.payloadString)

            } catch (e) {}


            if (message.responsecode == 200) {

                toaster.pop('success', '', "" + message.displayname + " " + message.message);

            } else {
                toaster.pop('error', '', "" + message.message);
            }
            // $rootScope.$broadcast('resourceLoading', $scope.dataResourceLoading)


        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironmentSetup\/.*\/Gateways\/.*\/Del\/Reply$/)) {
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee resource", message);
            } catch (e) {}
            if (message.responsecode == 200) {
                $scope.getDataGateway($scope.currentGatewayPage)
            }
        }
    }

    function doFail(e) {
        console.log(e);
    }
    $scope.gatewaydata = $scope.setupdata.gateways;
    $scope.flag = false
    $scope.firstWizard = true;
    $scope.secondWizard = false;
    $scope.gatewayTestSetupArray = []
    $scope.deleteflag = false
    $scope.gwflag = false
    $scope.dvflag = false;
    /*for getting gatewat list from api comparing it to already added gateway to testsetup*/
    $scope.getDataGateway = function(pageno, params) {
        console.log("alert", "in here")
        $scope.arrgwid = []
        $scope.gatewayList = [];
        $scope.currentPage = 1;
        $scope.gatewayPerPage = ENV.recordPerPage;
        $scope.dataLoading = true;
        simulatorModuleService.getGatewayList().then(function(data) {
            $timeout(function() {
                $scope.dataLoading = false;
                if (data.Data != undefined) {
                    $scope.gatewayList = data.Data;
                    $scope.totalItems = data.total_records;
                    for (var i = 0; i < $scope.gatewaydata.length; i++) {
                        for (var j = 0; j < $scope.gatewayList.length; j++) {
                            if ($scope.gatewaydata[i].gatewayid == $scope.gatewayList[j].id) {
                                $scope.arrgwid.push($scope.gatewayList[j])
                                var index = $scope.gatewayList.indexOf($scope.gatewayList[j]);
                                $scope.gatewayList.splice(index, 1)
                            }
                        }
                    }
                } else {
                    $scope.totalItems = 0;
                }

            });
        }).catch(function(error) {
            $scope.totalItems = 0;
            $scope.dataLoading = false;
        });
    };
    $scope.getDataGateway()
    $scope.gwPerPage = ENV.recordPerPage;
    $scope.cPage = 1;
    /*called when user selects checkbox for gateway.*/
    $scope.checkedGateway = function(obj) {
        var gwobj;
        if ($scope.arrgwid.length == 0) {
            $scope.arrgwid.push(obj)
            var index = $scope.gatewayList.indexOf(obj);
            $scope.gatewayList.splice(index, 1);
        } else {
            if ($scope.arrgwid.indexOf(obj) == -1) {
                $scope.arrgwid.push(obj)
                var index = $scope.gatewayList.indexOf(obj);
                $scope.gatewayList.splice(index, 1);
            } else {
                var index = $scope.arrgwid.indexOf(obj);
                $scope.arrgwid.splice(index, 1);
                $scope.gatewayList.push(obj)
            }
        }
        console.log($scope.arrgwid)
    }
    /*receive gateway list from gateway modal*/
    $scope.$on('gatewayfromModal', function(e, a) {
        $scope.gwflag = true
        for (var i = 0; i < a.length; i++) {
            $scope.arrgwid.push(a[i]);
            var index = $scope.gatewayList.indexOf(a[i])
            $scope.gatewayList.splice(index, 1)
        }
        var gwobj;
        console.log($scope.arrgwid)
        for (var i = 0; i < $scope.arrgwid.length; i++) {
            gwobj = { "gatewayid": $scope.arrgwid[i].id, "orgid": $scope.arrgwid[i].orgid, "displayname": $scope.arrgwid[i].displayname, "devices": [] }
            $scope.gatewayTestSetupArray.push(gwobj)
        }
    })
    /*receive devices data for gateay from devices modal*/
    $scope.$on('gatewayTestSetup', function(e, a) {
        $scope.dvflag = true;
        $scope.deviceTestSetupArray = a;
        var gwobj;
        for (var i = 0; i < $scope.arrgwid.length; i++) {
            gwobj = { "gatewayid": $scope.arrgwid[i].id, "orgid": $scope.arrgwid[i].orgid, "displayname": $scope.arrgwid[i].displayname, "devices": [] }
            $scope.gatewayTestSetupArray.push(gwobj)
        }
        for (var i = 0; i < $scope.gatewayTestSetupArray.length; i++) {
            if ($scope.selectedgateway.id == $scope.gatewayTestSetupArray[i].gatewayid) {
                $scope.gatewayTestSetupArray[i]['devices'] = $scope.deviceTestSetupArray
            }
        }
    });

    $scope.$on('selectedGateway', function(e, a) {
        $scope.selectedgateway = a

    });
    $scope.saveTestSetup = function(testsetup) {
        console.log(JSON.stringify(testsetup))
        var id, data, message;
        data = testsetup.gateways
        if ($scope.gwflag == false && $scope.dvflag == false) {
            for (var i = 0; i < $scope.gatewayTestSetupArray.length; i++) {

                testsetup.push($scope.gatewayTestSetupArray[i])
            }
        } else {
            testsetup.gateways = $scope.gatewayTestSetupArray
        }



        for (var i = 0; i < testsetup.gateways.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (testsetup.gateways[i].gatewayid == data[j].gatewayid) {
                    if (testsetup.gateways[i].devices.length == 0) {
                        testsetup.gateways[i].devices = data[j].devices
                    }
                }
            }
        }
        console.log(JSON.stringify(testsetup))

        message = new Paho.MQTT.Message(JSON.stringify(testsetup));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/' + testsetup.environmentid + '/Put';
        client.send(message);
        client.subscribe('EI/SimulatorSetup/TestEnvironmentSetup/' + testsetup.environmentid + '/Put/Reply', { qos: 1, onFailure: doFail });
        $location.path('/simulator');
    }

    $scope.deletetestsetupGateway = function(gateway) {
        $scope.selectedGateway = gateway
        var index = $scope.setupdata.gateways.indexOf(gateway)
        $scope.setupdata.gateways.splice(index, 1);
        message = new Paho.MQTT.Message(JSON.stringify({ "environmentid": $scope.setupdata.environmentid, "gatewayid": gateway.id }));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/' + $scope.setupdata.environmentid + '/Gateways/' + gateway.id + '/Del';
        client.send(message);
        client.subscribe('EI/SimulatorSetup/TestEnvironmentSetup/' + $scope.setupdata.environmentid + '/Gateways/' + gateway.id + '/Del/Reply', { qos: 1, onFailure: doFail });
        //$scope.getDataGateway($scope.currentGatewayPage, $scope.params);
    }
    $scope.clearDevicemodal = function() {
        $uibModalInstance.close();
        //client.unsubscribe('EI/SimulatorSetup/TestEnvironmentSetup/Put/Reply')
    }
    $scope.openGatewayModal = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalgateway.html',
            controller: 'gatewayenvCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: { 'gateway': $scope.gatewayList }
            }
        });
    }
    $scope.openDeviceModal = function(gateway) {
        for (var i = 0; i < $scope.gatewaydata.length; i++) {
            if ($scope.gatewaydata[i].gatewayid == gateway.id) {
                $scope.devicesforGateway = $scope.gatewaydata[i].devices
            }
        }

        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalnoofDevices.html',
            controller: 'noofdevicesCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: { 'gateway': gateway, 'client': client, 'devicesforGateway': $scope.devicesforGateway }
            }
        });
    }
});
simulatorModule.controller('gatewayenvCtrl', function($scope, dsparam, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModalInstance, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService) {
    $scope.arrgwid = []
    $scope.gatewayTestSetupArray = []
    $scope.gatewayList = dsparam.gateway
    $scope.currentPage = 1;
    $scope.gatewayPerPage = ENV.recordPerPage
    console.log($scope.gatewayList)
    $scope.clearDevicemodal = function() {
        $uibModalInstance.close()
    }
    $scope.checkedGateway = function(obj) {

        var gwobj;
        if ($scope.arrgwid.length == 0) {
            $scope.arrgwid.push(obj)

        } else {
            if ($scope.arrgwid.indexOf(obj) == -1) {
                $scope.arrgwid.push(obj)

            } else {
                var index = $scope.arrgwid.indexOf(obj);
                $scope.arrgwid.splice(index, 1);
            }
        }

    }
    $scope.savegatewayData = function() {

        $rootScope.$broadcast('gatewayfromModal', $scope.arrgwid)
        $scope.clearDevicemodal()
    }
});
simulatorModule.controller('simulatorTestSetupCtrl', function($scope, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService) {

    client = new Paho.MQTT.Client(ENV.simulatorConnectionUrl, ENV.simulatorConnectionPort, "/ws", "myclientid_" + parseInt(Math.random() * 100, 10));
    console.log("client id :: " + "myclientid_" + parseInt(Math.random() * 100, 10))
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
        useSSL: false,
        userName: "iotuser",
        password: "ei12@",
        onSuccess: onConnect,
        onFailure: doFail
    }
    client.connect(options);

    function onConnect() {
        console.log("onConnect");
        $scope.client = client
        $rootScope.$broadcast('client', $scope.client)
        var obj = {}
        console.log(JSON.stringify(obj))
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/Resources/Get';
        client.send(message);
        client.subscribe("EI/SimulatorSetup/Resources/Get/Reply", { qos: 1, onFailure: doFail });
        client.subscribe("EI/SimulatorSetup/TestEnvironmentSetup/State/Put", { qos: 1, onFailure: doFail });
    }

    function doFail(e) {
        console.log(e);
    }
    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }
    // called when a message arrives
    function onMessageArrived(message) {
        console.log(message.payloadString)
        if (message.destinationName == 'EI/SimulatorSetup/Resources/Get/Reply') {
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee resource", message);
            } catch (e) {}

            if (message.responsecode == 200) {

                $scope.deviceList = message.devices
                $rootScope.$broadcast('devicelist', $scope.deviceList)
                console.log("devices", $scope.deviceList);

            } else {
                toaster.pop('error', '', "" + message.message);

            }
            $scope.datadevicemodalloading = false
            $rootScope.$broadcast('datadevicemodalloading', $scope.datadevicemodalloading)
            client.unsubscribe('EI/SimulatorSetup/Resources/Get/Reply')

        } else if (message.destinationName.match(/^EI\/SimulatorSetup\/TestEnvironmentSetup\/State\/Put$/)) {

            try {
                message = JSON.parse(message.payloadString)

            } catch (e) {}


            if (message.responsecode == 200) {

                toaster.pop('success', '', "" + message.displayname + " " + message.message);

            } else {
                toaster.pop('error', '', "" + message.message);
            }
            // $rootScope.$broadcast('resourceLoading', $scope.dataResourceLoading)


        }



    }

    function doFail(e) {
        console.log(e);
    }
    $scope.firstWizard = true;
    $scope.secondWizard = false;
    $scope.deviceTestSetupArray = []
    $scope.gatewayTestSetupArray = []
    $scope.arrgwid = [];

    console.log(JSON.stringify($scope.selectedSetup))

    $scope.getDataGateway = function(pageno, params) {

        $scope.gatewayList = [];
        $scope.cugwPage = pageno;
        $scope.gatewayPerPage = ENV.recordPerPage;
        $scope.dataLoading = true;
        simulatorModuleService.getGatewaypageviseList(pageno, params).then(function(data) {

            $timeout(function() {
                $scope.dataLoading = false;
                if (data.Data != undefined) {
                    $scope.gatewayList = data.Data;
                    $scope.totalItems = data.total_records;

                } else {
                    $scope.totalItems = 0;
                }



                $scope.selectedRow = null;
                $scope.setClickedRow = function(index, gatewayInfo) {
                    $scope.selectedRow = index;
                    $scope.selectedRowGateway = gatewayInfo;

                };
                $scope.pageChanged = function() {
                    $scope.getDataGateway($scope.cugwPage, $scope.params);
                };

            });
        }).catch(function(error) {
            $scope.totalItems = 0;
            $scope.dataLoading = false;
        });
    };

    $scope.getDataGateway(1)




    $scope.checkedGateway = function(obj) {

        var gwobj;
        if ($scope.arrgwid.length == 0) {
            $scope.arrgwid.push(obj)

        } else {
            if ($scope.arrgwid.indexOf(obj) == -1) {
                $scope.arrgwid.push(obj)

            } else {
                var index = $scope.arrgwid.indexOf(obj);
                $scope.arrgwid.splice(index, 1);

            }
        }


    }

    $scope.$on('gatewayTestSetup', function(e, a) {
        $scope.deviceTestSetupArray = a;
        for (var i = 0; i < $scope.gatewayTestSetupArray.length; i++) {
            if ($scope.selectedgateway.id == $scope.gatewayTestSetupArray[i].gatewayid) {
                $scope.gatewayTestSetupArray[i]['devices'] = $scope.deviceTestSetupArray
            }
        }

    });
    $scope.$on('selectedGateway', function(e, a) {
        $scope.selectedgateway = a

    });

    $scope.savegatewayData = function() {
        var gwobj;
        for (var i = 0; i < $scope.arrgwid.length; i++) {
            gwobj = { "gatewayid": $scope.arrgwid[i].id, "orgid": $scope.arrgwid[i].orgid, "displayname": $scope.arrgwid[i].displayname }
            $scope.gatewayTestSetupArray.push(gwobj)
        }


    }
    $scope.saveTestSetup = function(testsetup) {
        var id, data, message;
        for (var i = 0; i < $scope.gatewayTestSetupArray.length; i++) {
            if (!$scope.gatewayTestSetupArray[i].hasOwnProperty('devices')) {
                $scope.gatewayTestSetupArray[i]['devices'] = []
            }
        }

        data = { "displayname": testsetup.displayname, "createdby": testsetup.createdby, "gateways": $scope.gatewayTestSetupArray }
        console.log("responsesee", JSON.stringify(data))
        message = new Paho.MQTT.Message(JSON.stringify(data));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/Put';
        $scope.client.send(message);
        $scope.client.subscribe("EI/SimulatorSetup/TestEnvironmentSetup/Put/Reply", { qos: 1, onFailure: doFail });
        $location.path('/simulator');
    }


    $scope.openDeviceModal = function(gateway) {

        client.subscribe("EI/SimulatorSetup/Resources/Get/Reply", { qos: 1, onFailure: doFail });
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalnoofDevices.html',
            controller: 'noofdevicesCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: { 'gateway': gateway, 'client': client }
            }
        });
    }
});




simulatorModule.controller('noofdevicesCtrl', function($scope, dsparam, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModalInstance, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService) {
    $scope.noofdevices = {}

    $scope.gateway = dsparam.gateway
    $scope.client = dsparam.client;
    var obj = {};
    var message
    message = new Paho.MQTT.Message(JSON.stringify(obj));
    message.destinationName = 'EI/SimulatorSetup/Resources/Get';
    $scope.client.send(message);
    $scope.client.subscribe("EI/SimulatorSetup/Resources/Get/Reply", { qos: 1, onFailure: doFail });
    // $scope.dataLoading = true;
    //$scope.deviceList = dsparam.devicelist
    $scope.devPerPage = ENV.recordPerPage;
    $scope.cudevPage = 1;
    $scope.gatewayname = $scope.gateway.displayname;

    $scope.$on('devicelist', function(e, a) {
        $scope.deviceList = a; // body...
    })
    if (dsparam.devicesforGateway != undefined) {
        $scope.devicesforGateway = dsparam.devicesforGateway
        for (var i = 0; i < $scope.devicesforGateway.length; i++) {
            $scope.noofdevices[$scope.devicesforGateway[i].displayname] =
                $scope.devicesforGateway[i].quantity

        }
    }

    function doFail(e) {
        console.log(e);
    }


    $scope.clearDevicemodal = function() {
        $uibModalInstance.close();


    }

    $scope.saveDeviceCount = function(gateway, countarray) {
        var obj, gwobj;
        var deviceArray = []
        $rootScope.$broadcast('selectedGateway', gateway)
        for (var i = 0; i < Object.keys(countarray).length; i++) {
            obj = { "displayname": Object.keys(countarray)[i], "quantity": countarray[Object.keys(countarray)[i]] }
            deviceArray.push(obj)
        }



        $rootScope.$broadcast('gatewayTestSetup', deviceArray)

        $scope.clearDevicemodal()

    }
});


simulatorModule.controller('simulatortestenvCtrl', function($scope, $rootScope, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, simulatorModuleService) {
    $scope.dataTestEnvLoading = false;
    $scope.testenvGatewayLoading = false;
    $scope.testenvDeviceLoading = false;
    $scope.testenvXclLoading = false;
    $scope.gatewaysWiard = false
    $scope.devicesWiard = false
    $scope.flag = false;
    $scope.btnFlagS = false
    $scope.btnFlagM = false
    $scope.btnFlagH = false
    $scope.testEnvList = []

    function doFail(e) {
        console.log(e);
    }
    $scope.$on('client', function(e, a) {
        $scope.client = a;
        console.log($scope.client)
        var obj = {}
        $scope.dataTestEnvLoading = true;
        $scope.testEnvList = []
        //message = new Paho.MQTT.Message(JSON.stringify(obj));
        //message.destinationName = 'EI/SimulatorSetup/TestEnvironment/Get';
        //$scope.client.send(message);
        //$scope.client.subscribe("EI/SimulatorSetup/TestEnvironment/Get/Reply", { qos: 1, onFailure: doFail });
        //console.log("subscribed on EI/SimulatorSetup/TestEnvironment/Get/Reply")
    })
    $scope.$on('envlist', function(e, a) {
        $scope.testEnvList = a;
        $scope.currentEnvPage = 1;
        $scope.envPerPage = ENV.recordPerPage;

    })
    $scope.$on('loadingflag', function(e, a) {
        $scope.dataTestEnvLoading = false
        $scope.$apply()
    })

    $scope.changeToggle = function(device) {
        console.log($scope.client)
        var status = device.devicestatus
        var devicestatus;
        if (status == true) {
            devicestatus = 'online'
        } else if (status == false) {
            devicestatus = 'offline'
        }
        var obj = { "devicestatus": devicestatus, "deviceid": device.macid, "environmentid": $scope.selectedenv.environmentid, "gatewayid": $scope.selectedgateway.gatewayid }
        console.log(obj, "=======", 'EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/' + $scope.selectedgateway.gatewayid + '/Devices/' + device.macid + '/Devicestatus/Put')
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/' + $scope.selectedgateway.gatewayid + '/Devices/' + device.macid + '/Devicestatus/Put';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/' + $scope.selectedgateway.gatewayid + '/Devices/' + device.macid + '/Devicestatus/Put/Reply', { qos: 1, onFailure: doFail });
    }
    $scope.openRAMLView = function(device) {
        $scope.dataLoading = true;
        var obj = { 'environmentid': $scope.selectedenv.environmentid, 'gatewayid': $scope.selectedgateway.gatewayid, 'deviceid': device.macid, 'device_name': device.displayname }
        console.log(obj)
        $scope.dev = {}
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/' + $scope.selectedgateway.gatewayid + '/Resources/' + device.macid + '/Raml/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/' + $scope.selectedgateway.gatewayid + '/Resources/' + device.macid + '/Raml/Get/Reply', { qos: 1, onFailure: doFail });
    }
    $scope.$on('devraml', function(e, a) {
        $scope.dev = { "device_name": a.device_name, "device_json": JSON.stringify(a.device_json) }
        console.log($scope.dev)
        $scope.dataLoading = false;
        localStorage.setItem('ramlflag', true);
        localStorage.setItem('resource', JSON.stringify($scope.dev))
        $location.path('/simulator/resources/raml');
        $scope.$apply()
        $scope.client.disconnect()
    })
    $scope.$on('envgateway', function(e, a) {
        $scope.gatewayList = a
        $scope.currentGwPage = 1;
        $scope.gwPerPage = ENV.recordPerPage;

    })
    $scope.$on('envgatewayloading', function(e, a) {
        $scope.testenvGatewayLoading = a;
        $scope.$apply()
    });
    $scope.$on('envdevicesloading', function(e, a) {
        $scope.testenvDeviceLoading = a;
        $scope.$apply()
    })
    $scope.$on('excelList',function(e,a){
        $scope.excelList = a;
        $scope.currentxclPage = 1;
        $scope.xclPerPage = ENV.recordPerPage
    })
    $scope.$on('excelListLoading',function(e,a){
        $scope.testenvXclLoading = a;
        $scope.$apply();
    })
    $scope.viewGateway = function(env) {
        $scope.gatewaysWiard = true
        $scope.selectedenv = env;
        $scope.currentDevPage = 1;
        $scope.gatewayList = []
        $scope.devPerPage = ENV.recordPerPage;
        $scope.testenvGatewayLoading = true
        //$scope.getDataGateway(1)
        var obj = { "environmentid": $scope.selectedenv.environmentid }
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/Get/Reply', { qos: 1, onFailure: doFail });

    }
    $scope.deleteTestEnv = function(testenv) {
        // console.log(env)
        var obj = { "displayname": testenv.displayname, "environmentid": testenv.environmentid }
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironmentSetup/' + testenv.environmentid + '/Del';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/TestEnvironmentSetup/' + testenv.environmentid + '/Del/Reply', { qos: 1, onFailure: doFail });
        var obj = {}
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironment/Get';
        client.send(message);
        client.subscribe("EI/SimulatorSetup/TestEnvironment/Get/Reply", { qos: 1, onFailure: doFail });
    }
    $scope.$on('envdevices', function(e, a) {

        $scope.testenvdeviceList = a
        for (var i = 0; i < $scope.testenvdeviceList.length; i++) {
            console.log($scope.testenvdeviceList[i].devicestatus == "online")
            if ($scope.testenvdeviceList[i].devicestatus == "online") {
                $scope.testenvdeviceList[i].devicestatus = true
            } else if ($scope.testenvdeviceList[i].devicestatus == "offline") {
                $scope.testenvdeviceList[i].devicestatus = false
            }
        }
        console.log(JSON.stringify($scope.testenvdeviceList))

    })
    $scope.$on('refreshenv', function(e, a) {
        $scope.backfromGateway()
    })
    $scope.backfromGateway = function() {
        $scope.gatewaysWiard = false;
        $scope.devicesWiard = false;
    }
    $scope.backfromDevice = function() {
        $scope.gatewaysWiard = true;
        $scope.devicesWiard = false
    }
    $scope.viewDevices = function(gateway) {
        $scope.testenvDeviceLoading = true
        $scope.devicesWiard = true
        $scope.gatewaysWiard = false
        $scope.flag = true
        $scope.setDivVal = 'device'
        $scope.selectedgateway = gateway;
        $scope.testenvdeviceList = []
        var obj = { "environmentid": $scope.selectedenv.environmentid, "gatewayid": $scope.selectedgateway.gatewayid }
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/' + $scope.selectedgateway.gatewayid + '/Resources/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/TestEnvironment/' + $scope.selectedenv.environmentid + '/Gateways/' + $scope.selectedgateway.gatewayid + '/Resources/Get/Reply', { qos: 1, onFailure: doFail });
    }
    $scope.viewActionBots = function(gateway) {
        $scope.testenvXclLoading = true
        $scope.devicesWiard = true
        $scope.gatewaysWiard = false
        $scope.flag = true
        $scope.setDivVal = 'actionbots'
        $scope.selectedgateway = gateway;
        //console.log(gateway)
        var obj = { "gatewayid": $scope.selectedgateway.gatewayid}
        //console.log(JSON.stringify(obj))
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/ActionBot/'+$scope.selectedgateway.gatewayid+'/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/ActionBot/'+$scope.selectedgateway.gatewayid+'/Get/Reply', { qos: 1, onFailure: doFail });
    }
    $scope.requestFunc = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modules/simulator/views/viewRequest.html',
            controller: 'requestCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: function() {

                    return { 'gatewayid': $scope.selectedgateway.gatewayid, 'client': $scope.client, 'envid': $scope.selectedenv }
                }
            }
        });
    }
    $scope.abc = function() {
        $scope.gatewaysWiard = true;
        $scope.devicesWiard = false;
        $scope.flag = false;
    }

    $scope.openControlPanelmodal = function(selectedDeviceInformation) {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modules/simulator/views/simulatorControlPanel.html',
            controller: 'simulatorcontrolPanelCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: function() {
                    return { 'gatewayid': $scope.selectedgateway.gatewayid, 'deviceInformation': selectedDeviceInformation, 'client': $scope.client, 'envid': $scope.selectedenv }
                }
            }
        });
    }


    $scope.openConfigPanelmodal = function(selectedDeviceInformation) {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modules/simulator/views/configure.html',
            controller: 'simulatorcontrolPanelCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: function() {
                    return { 'gatewayid': $scope.selectedgateway.gatewayid, 'deviceInformation': selectedDeviceInformation, 'client': $scope.client, 'envid': $scope.selectedenv }
                }
            }
        });
    }
$scope.$on('delactionbot',function(e,a){
   var obj = { "gatewayid": $scope.selectedgateway.gatewayid}
        //console.log(JSON.stringify(obj))
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/ActionBot/'+$scope.selectedgateway.gatewayid+'/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/ActionBot/'+$scope.selectedgateway.gatewayid+'/Get/Reply', { qos: 1, onFailure: doFail });
})
$scope.$on('verifyactionbot',function(e,a){
    var elem = document.getElementById('status_'+$scope.lastIndex)
        if(elem!=null){
            elem.innerHTML = 'Completed'
        }
        $scope.dataLoadingAction = false
})

$scope.$on('downloadData',function(e,a){
    var data = a;
      toaster.pop('success','','Success in File download')
 var blob = new Blob([data], {type: 'application/vnd.ms-excel'});
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download =  $scope.xclFilename+".xls";
        document.body.appendChild(a);
        a.click();
})

$scope.downloadXcl = function(exceldata){
    $scope.xclFilename = exceldata.xlsx_filename
     var obj = {"xlsx_actionid":exceldata.xlsx_actionid,"gatewayid":$scope.selectedgateway.gatewayid}
     console.log(obj)
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/ActionBot/DataFile/DownloadActionBotXlsx/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/ActionBot/DataFile/DownloadActionBotXlsx/Get/Reply/#', { qos: 1, onFailure: doFail });
        
}
$scope.$on('actionbot',function(e,a){
     var obj = { "gatewayid": $scope.selectedgateway.gatewayid}
        //console.log(JSON.stringify(obj))
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/ActionBot/'+$scope.selectedgateway.gatewayid+'/Get';
        $scope.client.send(message);
        $scope.client.subscribe('EI/ActionBot/'+$scope.selectedgateway.gatewayid+'/Get/Reply', { qos: 1, onFailure: doFail });
})

$scope.deleteExcel = function(exceldata){
    var obj = {"xlsx_actionid":exceldata.xlsx_actionid,"gatewayid":$scope.selectedgateway.gatewayid}
     console.log(obj)
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/ActionBot/Del';
        $scope.client.send(message);
        $scope.client.subscribe('EI/ActionBot/Del/Reply', { qos: 1, onFailure: doFail }); 
}
    $scope.callFirenVerify =function(exceldata,index){
        var elem = document.getElementById('status_'+index)
        if(elem!=null){
            elem.innerHTML = 'In Progress'
        }
        $scope.dataLoadingAction = true;
        $scope.lastIndex = index
        var obj = {"xlsx_actionid":exceldata.xlsx_actionid,"gatewayid":$scope.selectedgateway.gatewayid}
        message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/FireActionBot/Put';
        $scope.client.send(message);
        $scope.client.subscribe('EI/FireActionBot/Put/Reply', { qos: 1, onFailure: doFail });
        $scope.client.subscribe('EI/VerifyFiredActionBot/Put/Reply', { qos: 1, onFailure: doFail });
    }

});
simulatorModule.controller('requestCtrl', function($http, $scope, $rootScope, ENV, deviceModuleService, gatewayModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, imageConstant, dsparam, $uibModalInstance,simulatorModuleService) {

    $scope.gwid = dsparam.gatewayid;
    $scope.client = dsparam.client;
    $scope.envId = dsparam.envid

$scope.getGatewayObj = function(){
    simulatorModuleService.getGatewayById($scope.gwid).then(function(response){
        if(response.Data!=undefined){
            $scope.applist = response.Data.tasks
            console.log($scope.applist)
        }
    })
}
    $scope.getGatewayObj()
    $scope.clearControlPanel = function() {

        $uibModalInstance.close();
    };
    $scope.$on('actionbot', function(e, a) {
        $scope.clearControlPanel()
    })

    function doFail(e) {
        console.log(e);
    }
    $scope.submitRequest = function(action,app) {
        console.log(action)
        $scope.dataAddactionLoading = true;
        if (document.querySelector('input[name="opervalue"]:checked') != null) {
            action.oper = document.querySelector('input[name="opervalue"]:checked').value
        } else {
            action.oper = 'GET'
        }
        if (document.querySelector('input[name="actionvalue"]:checked') != null) {
            action.action = document.querySelector('input[name="actionvalue"]:checked').value
        } else {
            action.action = 'True'
        }

        var arr = [];
        if (action.oper == 'both') {
            arr.push('get');
            arr.push('post');
        }
        if (action.oper == 'get') {
            arr.push('get')
        }
        if (action.oper == 'post') {
            arr.push('post')
        }
        var obj = {"xlsx_filename":action.name, "environmentid": $scope.envId.environmentid, "gatewayid": $scope.gwid, "orgid": "58c3ce458441383a938c5c75", "count": action.actionbotcount, "req_operation": arr, "appid": app.AppName, "per_device_one_property": action.action}
        console.log(JSON.stringify(obj))
       /* message = new Paho.MQTT.Message(JSON.stringify(obj));
        message.destinationName = 'EI/ActionBot/Put';
        $scope.client.send(message);
        $scope.client.subscribe('EI/ActionBot/Put/Reply', { qos: 1, onFailure: doFail });*/
    }
});


simulatorModule.controller('simulatorcontrolPanelCtrl', function($http, $scope, $rootScope, ENV, deviceModuleService, gatewayModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, imageConstant, dsparam, $uibModalInstance) {
    $scope.gatewayId = dsparam.gatewayid;
    $scope.selectedRowDevice = dsparam.deviceInformation;
    $scope.envid = dsparam.envid.environmentid
    $scope.env = dsparam.envid
    $scope.deviceId = $scope.selectedRowDevice.macid;
    $scope.editingProperty = []
    $scope.finalArray = []
    $scope.regPropsDefinitionArray = []
    $scope.client = dsparam.client
    console.log("client", client)
    $rootScope.selectedRowProp = null;
    $scope.selectedRowProp = null;
    $scope.$on('regprop', function(e, a) {
        $scope.regPropsDefinitionArray = a

    })
    /* $scope.regPropsDefinitionArray = [{
             "definitionName": "Scene Count",
             "properties": [{
                 "operations": [
                     "get",
                     "post"
                 ],
                 "reportedvalue": 0,
                 "propertyName": "Scene Count",
                 "minimum": -2147483648,
                 "maximum": 2147483647
             }]
         },
         {
             "definitionName": "Level",
             "properties": [{
                 "operations": [
                     "get",
                     "post",
                     "notify"
                 ],
                 "reportedvalue": 0,
                 "desiredvalue": 0,
                 "propertyName": "Level",
                 "minimum": 0,
                 "type": "integer",
                 "maximum": 255
             }]
         }
     ]*/

    function doFail(e) {
        console.log(e);
    }
    var obj = { 'environmentid': $scope.envid, 'gatewayid': $scope.gatewayId, 'deviceid': $scope.deviceId }
    //console.log(obj)
    message = new Paho.MQTT.Message(JSON.stringify(obj));
    message.destinationName = 'EI/SimulatorSetup/TestEnvironment/' + $scope.envid + '/Gateways/' + $scope.gatewayId + '/Devices/' + $scope.deviceId + '/Properties/Get';
    $scope.client.send(message);
    $scope.client.subscribe('EI/SimulatorSetup/TestEnvironment/' + $scope.envid + '/Gateways/' + $scope.gatewayId + '/Devices/' + $scope.deviceId + '/Properties/Get/Reply', { qos: 1, onFailure: doFail });


    $scope.clearControlPanel = function() {
        for (var i = 0; i < $scope.finalArray.length; i++) {
            delete $scope.finalArray[i].properties[0]['$$hashKey']
            delete $scope.finalArray[i]['$$hashKey']
            delete $scope.finalArray[i]['Selected']
        }
        console.log(JSON.stringify($scope.finalArray))
        message = new Paho.MQTT.Message(JSON.stringify({ "environmentid": $scope.envid, "displayname": $scope.env.displayname, "gatewayid": $scope.gatewayId, "deviceid": $scope.deviceId, "properties_data": $scope.finalArray }));
        message.destinationName = 'EI/SimulatorSetup/TestEnvironment/' + $scope.envid + '/Gateways/' + $scope.gatewayId + '/Devices/' + $scope.deviceId + '/Properties/Put';
        $scope.client.send(message);
        $scope.client.subscribe('EI/SimulatorSetup/TestEnvironment/' + $scope.envid + '/Gateways/' + $scope.gatewayId + '/Devices/' + $scope.deviceId + '/Properties/Put/Reply', { qos: 1, onFailure: doFail });
        $uibModalInstance.close();
    };



    $scope.refreshSlider = function() {
        $timeout(function() {
            $scope.$broadcast('rzSliderForceRender');
        });
    };

    $scope.getSlider = {
        value: 94, //selectedRowProperty.reported_value,
        options: {
            floor: 0, //selectedRowProperty.operations[i].constrains.minimum,
            ceil: 100, //sectedRowProperty.operations[i].constrains.maximum+10,
            step: 1,
            showSelectionBar: true,
            getPointerColor: function(value) {
                return '#3D6BA9;';
            },
            selectionBarGradient: {
                from: '#33f0ff',
                to: '#3342ff'
            },

            minLimit: 10, //selectedRowProperty.operations[i].constrains.minimum,
            maxLimit: 90, //sectedRowProperty.operations[i].constrains.maximum,
            disabled: true
        }
    };
    $scope.postSlider = {

        options: {
            floor: 0, //selectedRowProperty.operations[i].constrains.minimum,
            ceil: 100, //sectedRowProperty.operations[i].constrains.maximum+10,
            step: 1,
            // onChange:$scope.onSliderChange($scope.defName.value),
            showSelectionBar: true,
            getPointerColor: function(value) {
                return '#3D6BA9;';
            },
            selectionBarGradient: {
                from: '#33f0ff',
                to: '#3342ff'
            },

        }
    };

    $scope.DisabledGetMethod = [];
    $scope.DisabledPostMethod = [];
    $scope.DisabledPushMethod = [];
    $scope.DisabledDeleteMethod = [];
    $scope.DisabledNotifyMethod = [];
    $scope.propDetail = false;

    $scope.LockGetMethod = [];
    $scope.LockWriteMethod = [];
    $scope.LockDeleteMethod = [];
    $scope.LockNotifyMethod = [];

    $scope.edit = function(index) {
        $scope.editingProperty[index] = true
    }
    $scope.delete = function(index) {
        $scope.editingProperty[index] = false
    }
    $scope.saveinfo = function(propdata, index) {
        console.log(JSON.stringify(propdata))
        if (document.querySelector('input[name="intervalvalue"]:checked') != null) {
            $scope.unit = document.querySelector('input[name="intervalvalue"]:checked').value
            var interval = propdata.properties[0].operable_interval
            propdata.properties[0].operable_interval = interval + $scope.unit
            var telemetry = propdata.properties[0].telemetry
            propdata.properties[0].telemetry = JSON.stringify(telemetry)
        }
        var status = propdata.properties[0].status
        propdata.properties[0].status = JSON.stringify(status)

        $scope.finalArray.push(propdata)
        if ($scope.finalArray.length > 0) {
            for (var i = 0; i < $scope.finalArray.length; i++) {

                if ($scope.finalArray[i].definitionName == propdata.definitionName) {
                    $scope.finalArray.splice(i, 1);
                    $scope.finalArray.push(propdata)
                }

            }
        }
        console.log(JSON.stringify($scope.finalArray))
        $scope.editingProperty[index] = false
        $scope.toggleDeviceProperty(propdata, index)
    }


    $scope.checkedFunctionOperations = function(operations, action) {

        var flag = false;
        if (operations.indexOf(action) !== -1) {
            flag = true;
        }
        return flag;
    }

    $scope.setClickedRowProp = function(index) {
        $scope.selectedRowProp = index;
        $rootScope.selectedRowProp = index;

    };

    $scope.toggleDeviceProperty = function(selectedRowProperty, index) {

        changedValueArr = []; //it is for creating value of UI properties Obj array
        $scope.changedValueArr = [];
        $scope.selectedRowProperty = selectedRowProperty;
        $scope.selectedRowProperty.Selected = true;
        // $scope.propDetail = !$scope.propDetail;
        if ($scope.selectedRowProperty != undefined && $scope.selectedRowProperty.Selected == true) {
            $scope.DisabledGetMethod[index] = true;
            $scope.DisabledPostMethod[index] = true;
            $scope.DisabledPushMethod[index] = true;
            $scope.DisabledDeleteMethod[index] = true;
            $scope.DisabledNotifyMethod[index] = true;

            if (selectedRowProperty.properties != undefined)

            {
                for (var i = 0; i < selectedRowProperty.properties.length; i++) {

                    if (selectedRowProperty.properties[i].operations.indexOf("get") !== -1) {
                        $scope.visible = true;
                        if (selectedRowProperty.properties[i].type == 'number' || selectedRowProperty.properties[i].type == 'integer' || selectedRowProperty.properties[i].type == 'string') {
                            $scope.getSlider.options.floor = 0;
                            $scope.getSlider.options.ceil = 125;


                        }
                        if (selectedRowProperty.properties[i].type == 'boolean') {

                        }

                        $scope.DisabledGetMethod[index] = false;
                        $('#chkDisabled').attr('checked', true);

                    }





                    if (selectedRowProperty.properties[i].operations.indexOf("post") !== -1) {
                        //var editingProperty = false
                        // $scope.editingProperty = editingProperty
                        $scope.visible = false;

                        if (selectedRowProperty.properties[i].type == 'number' || selectedRowProperty.properties[i].type == 'integer' || selectedRowProperty.properties[i].type == 'string') {


                            $scope.postSlider.options.minLimit = parseInt(selectedRowProperty.properties[i].minimum);

                            $scope.postSlider.options.ceil = parseInt(selectedRowProperty.properties[i].maximum);

                            $scope.postSlider.options.maxLimit = parseInt(selectedRowProperty.properties[i].maximum);

                            //for setting reported value in slider
                            angular.forEach($scope.shadowArray, function(value, key) {

                                if (key == selectedRowProperty.properties[i].propertyName) {


                                    $scope.postSlider.value = parseInt(value.reported_value);


                                }

                            })

                            $scope.postSlider.options.disabled = false;

                        }
                        if (selectedRowProperty.properties[i].type == 'boolean') {}
                        $scope.DisabledPostMethod[index] = false;
                    }
                    if (selectedRowProperty.properties[i].operations[i] == "put") {
                        $scope.DisabledPushMethod[index] = false;
                    }
                    if (selectedRowProperty.properties[i].operations[i] == "delete") {
                        $scope.DisabledDeleteMethod[index] = false;
                    }

                    if (selectedRowProperty.properties[i].operations.indexOf('notify') != -1) {
                        $scope.DisabledNotifyMethod[index] = false;
                    }
                }


            }
        }
        changedValueArr = []; //it is for creating value of UI properties Obj array
        $scope.changedValueArr = [];
        // $scope.editingProperty = []
    };



    $scope.checkForPostOperation = function(operations) {
        var hasPost = false;
        if (operations.indexOf('post') != (-1)) {

            hasPost = true;
        } else {
            hasPost = false;
        }

        return hasPost;
    }


    $scope.onValueChange = function(changePropValue, pname, arr) {

        $scope.postProp = pname;

        if (changedValueArr.length > 0) {

            var flag = false;

            angular.forEach(changedValueArr, function(value, key) {


                angular.forEach(value, function(valueJson, keyJson) {
                    if (keyJson == pname) {
                        value[keyJson] = changePropValue;
                        flag = true;
                        return false;
                    }
                    if (flag == false) {
                        value[pname] = changePropValue;
                        changedValueArr.push(value);
                    }
                })
            })
        } else {

            var jObj = {};
            jObj[pname] = changePropValue;
            changedValueArr.push(jObj)

            $scope.changedValueArr = changedValueArr;




        }
        //var length = $scope.funLength(arr)
    };

    $scope.checkSelectedValue = function(propName) {

        angular.forEach($scope.shadowArray, function(value, key)

            {

                if (key == propName) {
                    $scope.selectedShadowValue = value.reported_value;

                }

            });
        return $scope.selectedShadowValue;

    }


});