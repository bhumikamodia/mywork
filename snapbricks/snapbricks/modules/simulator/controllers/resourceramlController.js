var simulatorModule1 = angular.module('simulatorModule.controllers');

simulatorModule1.controller('resourceRAMLCtrl', function($scope, $rootScope, simulatorModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, $mdDialog, CustomMessages) {

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
        console.log(JSON.stringify(obj))
        $scope.dataResourceLoading = true;
         $scope.dataSetupLoading = true;
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
        if (message.destinationName.match(/^EI\/SimulatorSetup\/Resources\/Put\/Reply$/)) {
            var topic = message.destinationName
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee resource", message);
            } catch (e) {}
            if (message.responsecode == 200) {
                
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)

        }else if (message.destinationName.match(/^EI\/SimulatorSetup\/Resources\/.*\/Put\/Reply$/)) {
            var topic = message.destinationName
             $location.path('/simulator');
            try {
                message = JSON.parse(message.payloadString)
                console.log("parseeee resource", message);
            } catch (e) {}
            if (message.responsecode == 200) {
               
            } else {
                toaster.pop('error', '', "" + message.message);
            }
            client.unsubscribe(topic)

        }
    }
    $scope.editrml = { "devicename": "", "deviceDesc": "", "devicekeywords": "", "device_defpro": "", "selectedproperty": '', "orgid": "", "id": "" };
    $scope.Addraml = { "name": "" };
    $scope.editrml.defination = [];
    $scope.maindefpro = [];
    $scope.defaultProperty = [];
    $scope.subdefinition = [];
    var check_flag = 0;
    console.log($scope.resource.device_json)
    
    $scope.raml = JSON.parse($scope.resource.device_json)

    $scope.editrml.devicename = $scope.resourceName;
    $scope.editrml.devicekeywords = "";
    $scope.editrml.deviceDesc = "";
    console.log("aaaaaa",$scope.raml)
    //$scope.editrml.orgid = data.Data.orgid;
    // $scope.editrml.id = data.Data.id;
    $scope.newPayload = function() {

        for (var i = 0; i < $scope.raml.subproperties_data.length; i++) {
            for (var j = 0; j < $scope.raml.subproperties_data[i].properties.length; j++) {
                for (var k = 0; k < $scope.raml.subproperties_data[i].properties[j].subproperties.length; k++) {
                    var name = $scope.raml.subproperties_data[i].properties[j].propertyName
                    $scope.raml.subproperties_data[i]['propertyName'] = name;
                    delete $scope.raml.subproperties_data[i].properties[j]['propertyName']
                    if ($scope.raml.subproperties_data[i].properties[j].subproperties[k].subpropertyName.toUpperCase() == 'Interval'.toUpperCase()) {
                        $scope.raml.subproperties_data[i].properties[j].subproperties[k]['propertytype'] = 'Interval';
                    } else if ($scope.raml.subproperties_data[i].properties[j].subproperties[k].subpropertyName.toUpperCase() == 'Units'.toUpperCase()) {
                        $scope.raml.subproperties_data[i].properties[j].subproperties[k]['propertytype'] = 'Units';
                    } else if ($scope.raml.subproperties_data[i].properties[j].subproperties[k].subpropertyName.toUpperCase() == 'Threshold'.toUpperCase()) {
                        $scope.raml.subproperties_data[i].properties[j].subproperties[k]['propertytype'] = 'Threshold';
                    } else {
                        $scope.raml.subproperties_data[i].properties[j].subproperties[k]['propertytype'] = 'other';
                    }
                }
            }
        }
        console.log(JSON.stringify($scope.raml))
    }
    $scope.newPayload();

    $scope.processData = function(Data) {
        var row_pr_data = Data;
        var ope_arr = [];
        var enum_opp = [];
        $scope.process_final = [];
        $scope.item = [];
        angular.forEach(row_pr_data.properties_data, function(sub1, key5) {
            sub1.name = sub1.definitionName;
            angular.forEach(sub1.properties, function(value, key) {
                $scope.process_data = [];
                value.userpropertyname = value.propertyName;
                value.propertytype = "other";
                if (value.enum != undefined || value.enum != null) {
                    enum_opp = [];
                    angular.forEach(value.enum, function(v2, vkey) {
                        enum_opp.push({ id: "propertyValue" + (vkey + 1), value: v2 });
                    });
                    delete(value.enum);
                    value.enum = enum_opp;
                }

                $scope.process_data.push(value);
                ope_arr = [];

                angular.forEach(row_pr_data.subproperties_data, function(sub_pr, su_key8) {
                    console.log(JSON.stringify(sub_pr))
                    if (sub_pr.propertyName == value.propertyName) {
                        angular.forEach(sub_pr.properties, function(propkey, propvalue) {
                            angular.forEach(propkey.subproperties, function(sub_pr2, su_key2) {


                                if (sub_pr2.propertytype == 'other') {
                                    sub_pr2.userpropertyname = sub_pr2.propertyName;
                                    if (sub_pr2.enum != undefined || sub_pr2.enum != null) {
                                        enum_opp = [];
                                        angular.forEach(sub_pr2.enum, function(v3, v3key) {
                                            enum_opp.push({ id: "propertyValue" + (v3key + 1), value: v3 });
                                        });
                                        delete(sub_pr2.enum);
                                        sub_pr2.enum = enum_opp;
                                    }
                                } else {
                                    sub_pr2.userpropertyname = sub_pr2.subpropertyName;
                                    sub_pr2.propertyname = sub_pr2.subpropertyName;
                                    delete(sub_pr2.subpropertyName);
                                }

                                if (sub_pr2.propertytype == 'Threshold') {
                                    sub_pr2.thresholdValue = sub_pr2.value;
                                    delete(sub_pr2.value);
                                }
                                if (sub_pr2.propertytype == 'Units') {
                                    sub_pr2.sub_property = sub_pr2.units;
                                    delete(sub_pr2.units);
                                }
                                $scope.process_data.push(sub_pr2);
                                ope_arr.push(sub_pr2.propertytype);

                            });
                        });

                    }
                }); //sub propertied
                $scope.process_final.push({ data: $scope.process_data, "ope_arr": ope_arr, "parentname": sub1.definitionName });

            });
            $scope.item.push({ "name": sub1.definitionName, "properties": $scope.process_final });
            $scope.process_final = [];

        });
        $scope.editrml.defination = $scope.item;
        //  console.log(JSON.stringify($scope.item));       

    }
    $scope.processData($scope.raml);
    $scope.AddPropertyData = function(obj) {
        var selected_val = obj.name;
        ramlpropertiesModuleService.retrieveRMLFromID(obj.id).then(function(data) {
            //console.log(JSON.stringify(data.Data));
            var row_pr_data = data.Data;
            var ope_arr = [];
            var enum_opp = [];
            $scope.process_final = [];
            angular.forEach(row_pr_data.properties, function(value, key) {
                $scope.process_data = [];
                value.userpropertyname = value.propertyName;
                value.propertytype = "other";
                if (value.enum != undefined || value.enum != null) {
                    enum_opp = [];
                    angular.forEach(value.enum, function(v2, vkey) {
                        enum_opp.push({ id: "propertyValue" + (vkey + 1), value: v2 });
                    });
                    delete(value.enum);
                    value.enum = enum_opp;
                }

                $scope.process_data.push(value);
                ope_arr = [];
                angular.forEach(row_pr_data.subproperties, function(sub_pr, su_key) {
                    if (sub_pr.propertyName == value.propertyName) {
                        angular.forEach(sub_pr.subproperties, function(sub_pr2, su_key2) {


                            if (sub_pr2.propertytype == 'other') {
                                sub_pr2.userpropertyname = sub_pr2.propertyName;
                                if (sub_pr2.enum != undefined || sub_pr2.enum != null) {
                                    enum_opp = [];
                                    angular.forEach(sub_pr2.enum, function(v3, v3key) {
                                        enum_opp.push({ id: "propertyValue" + (v3key + 1), value: v3 });
                                    });
                                    delete(sub_pr2.enum);
                                    sub_pr2.enum = enum_opp;
                                }
                            } else {
                                sub_pr2.userpropertyname = sub_pr2.subpropertyName;
                                sub_pr2.propertyname = sub_pr2.subpropertyName;
                                delete(sub_pr2.subpropertyName);
                            }

                            if (sub_pr2.propertytype == 'Threshold') {
                                sub_pr2.thresholdValue = sub_pr2.value;
                                delete(sub_pr2.value);
                            }
                            if (sub_pr2.propertytype == 'Units') {
                                sub_pr2.sub_property = sub_pr2.units;
                                delete(sub_pr2.units);
                            }
                            $scope.process_data.push(sub_pr2);
                            ope_arr.push(sub_pr2.propertytype);

                        });
                    }
                    //console.log(sub_pr);

                });
                $scope.process_final.push({ data: $scope.process_data, "ope_arr": ope_arr });
            });
            //console.log(JSON.stringify($scope.process_final));
            $scope.editrml.defination.push({ "name": selected_val, "properties": $scope.process_final });
        });
    }

    $scope.delPropertyData = function(index) {
        $scope.editrml.defination.splice(index, 1);

    }
    $scope.showPropertyData = function(selected_val) {
        $scope.defaultProperty = [];
        angular.forEach($scope.editrml.defination, function(value, key) {
            if (value.name == selected_val) {
                angular.forEach(value.properties, function(propertydata) {
                    $scope.defaultProperty.push({ data: propertydata.data, "ope_arr": propertydata.ope_arr, "parentname": value.name });
                });
                $scope.Addraml.name = value.name;
                //  console.log(JSON.stringify($scope.defaultProperty));
            }
        });
    };
    $scope.changePropertytemplate = function(sel_type, mainindex, index) {
        $scope.defaultProperty[mainindex].data[index].enum = [];
        $scope.defaultProperty[mainindex].data[index].minimum = "";
        $scope.defaultProperty[mainindex].data[index].maximum = "";
        $scope.defaultProperty[mainindex].data[index].unit = "";

    }
    $scope.propertyTypeFunctionData = function(value, choice) {
        var propertySelect = -1;
        if (value == "number" || value == "integer" || value == "float")
            propertySelect = 0;
        else if (value == "string")
            propertySelect = 1;
        else if (value == "boolean")
            propertySelect = 2;

        if (choice != undefined && propertySelect == 1) {
            if (choice.length == 0) {
                var newItemNo = choice.length + 1;
                choice.push({ 'id': 'propertyValue' + newItemNo });
            }
        }

        return propertySelect;
    };
    $scope.deletePropertyChoicesData = function(propertyValues, index) {
        propertyValues.splice(index, 1);
    };
    $scope.addNewPropertyChoiceData = function(choice) {
        var newItemNo = choice.length + 1;
        choice.push({ 'id': 'propertyValue' + newItemNo });
    }
    $scope.newAddPropertyNameData = function() {
        $scope.defaultProperty.push({ "ope_arr": ["other"], "data": [{ "propertytype": "other", "propertyName": "", "UserpropertyName": "", "type": "", "operations": [], "enum": [], "minimum": "", "maximum": "", "unit": "" }] });
    }
    $scope.Addproperty = function(index, type) {
        if (type == 'Units') {
            $scope.defaultProperty[index].data.push({ "propertytype": "Units", "propertyName": "Units", "userpropertyname": "Units", "type": "", "operations": [], "sub_property": [] });
            $scope.defaultProperty[index].ope_arr.push("Units");
        } else if (type == 'Interval') {
            $scope.defaultProperty[index].data.push({ "propertytype": "Interval", "propertyName": "Interval", "userpropertyname": "Interval", "type": "", "operations": [], "units": "", "type": "" });
            $scope.defaultProperty[index].ope_arr.push("Interval");
        } else if (type == 'Threshold') {
            $scope.defaultProperty[index].data.push({ "propertytype": "Threshold", "propertyname": "Threshold", "userpropertyname": "Threshold", "type": "", "operations": [], "thresholdValue": "" });
            $scope.defaultProperty[index].ope_arr.push("Threshold");
        } else {
            $scope.defaultProperty[index].data.push({ "propertytype": "other", "propertyName": "", "userpropertyname": "", "type": "", "operations": [], "enum": [], "minimum": "", "maximum": "", "unit": "" });
        }

        //$scope.defaultProperty[index].data = data_Ara;

    }
    $scope.removePropertyNameData = function(propertyIndex) {
        $scope.defaultProperty.splice(propertyIndex, 1);
    }
    $scope.removeProperty = function(index, propertyIndex, type) {
        $scope.defaultProperty[index].data.splice(propertyIndex, 1);
        var idx = $scope.defaultProperty[index].ope_arr.indexOf(type);
        if (idx != -1)
            $scope.defaultProperty[index].ope_arr.splice(idx, 1);

    }
    $scope.addNewSubPropertyChoiceData = function(choice) {
        var newItemNo = choice.length + 1;
        choice.push({ 'id': 'subpropertyValue' + newItemNo });
    }
    $scope.setpropertyOperationsData = function(operation, fieldvalue) {
        var data = operation.indexOf(fieldvalue);

        if (operation.indexOf(fieldvalue) !== -1) {
            operation.splice(data, 1);
        } else {

            operation.push(fieldvalue);
        }
    };
    $scope.deletePropertyChoicesData = function(propertyValues, index) {
        propertyValues.splice(index, 1);
    };
    $scope.checkuniquenameTemp = function(prname, mainindex, index) {
        $scope.defaultProperty[mainindex].data[index].propertyName = prname;
    }
    $scope.editDefinitionPropertiesData = function() {
        //  console.log(JSON.stringify($scope.defaultProperty[0].parentname));


        var selected_val = $scope.defaultProperty[0].parentname;
        angular.forEach($scope.editrml.defination, function(value, key) {
            if (value.name == selected_val) {
                value.properties = $scope.defaultProperty;
                $timeout(function() {
                    $scope.defaultProperty = [];
                }, 100);
            }
        });

    }
    $scope.EditSaveData = function(ev) {
        $scope.saveproperties = [];
        $scope.finalData = {};
        $scope.en_savedata = [];
        $scope.savesubproperties = [];
        var obj = [];
        var objprr = [];

        angular.forEach($scope.editrml.defination, function(defination, skey) {
            objprr = [];
            angular.forEach(defination.properties, function(mainarr, mkey) {
                obj = [];
                angular.forEach(mainarr.data, function(subarr, skey) {

                    if (skey == 0) {
                        if (subarr.type == 'boolean')
                            objprr.push({ "units": subarr.unit, "type": subarr.type, "propertyName": subarr.userpropertyname, "operations": subarr.operations });
                        else if (subarr.type == 'string') {
                            $scope.en_savedata = [];
                            if (subarr.enum.length > 0) {
                                for (var k in subarr.enum) {
                                    $scope.en_savedata.push(subarr.enum[k].value);
                                }
                            }
                            objprr.push({ "units": subarr.unit, "type": subarr.type, "propertyName": subarr.userpropertyname, "operations": subarr.operations, "enum": $scope.en_savedata });
                        } else
                            objprr.push({ "units": subarr.unit, "type": subarr.type, "propertyName": subarr.userpropertyname, "operations": subarr.operations });

                        property_name = subarr.userpropertyname;
                    } else {

                        if (subarr.propertytype == "Units") {
                            obj.push({ "operations": subarr.operations, "units": subarr.sub_property, "type": subarr.type, "subpropertyName": subarr.userpropertyname });
                        } else if (subarr.propertytype == "Interval") {
                            obj.push({ "operations": subarr.operations, "units": subarr.units, "subpropertyName": subarr.userpropertyname, "type": subarr.type, "value": subarr.value });
                        } else if (subarr.propertytype == "Threshold") {
                            obj.push({ "operations": subarr.operations, "value": subarr.thresholdValue, "subpropertyName": subarr.userpropertyname, "type": subarr.type });
                        } else {
                            if (subarr.type == 'boolean')
                                obj.push({ "units": subarr.unit, "type": subarr.type, "subpropertyName": subarr.userpropertyname, "operations": subarr.operations, "propertytype": subarr.propertytype });
                            else if (subarr.type == 'string') {
                                $scope.en_savedata = [];
                                if (subarr.enum.length > 0) {
                                    for (var k in subarr.enum) {
                                        $scope.en_savedata.push(subarr.enum[k].value);
                                    }
                                }
                                obj.push({ "units": subarr.unit, "type": subarr.type,  "subpropertyName": subarr.userpropertyname, "operations": subarr.operations, "enum": $scope.en_savedata });
                            } else
                                obj.push({ "units": subarr.unit, "type": subarr.type,  "subpropertyName": subarr.userpropertyname, "operations": subarr.operations});
                        }

                    } //else end key

                });
                obj2 = {'propertyName':property_name,'subproperties':obj}
                var arr= []
                arr.push(obj2)

                $scope.savesubproperties.push({ "definitionName": defination.name, "properties": arr });

            });
            $scope.saveproperties.push({ "definitionName": defination.name, "properties": objprr });
        });
        $scope.finalData = {
            

            "properties_data": $scope.saveproperties,
            "subproperties_data": $scope.savesubproperties,

        }; //"item":$scope.editrml.defination

        console.log(JSON.stringify($scope.finalData))


    $mdDialog.show({
      controller: 'dialogCtrl',
      templateUrl: 'modalDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.answer = answer;
       var ob;
     console.log($scope.answer,'==new',name)
   
    if($scope.answer=='new'){
        console.log(JSON.stringify(ob))
         ob ={"device_name":$scope.devname,"device_json":JSON.stringify($scope.finalData)}
        client.subscribe("EI/SimulatorSetup/Resources/Put/Reply", { qos: 1, onFailure: doFail });
        message = new Paho.MQTT.Message(JSON.stringify(ob));
        message.destinationName = 'EI/SimulatorSetup/Resources/Put';
        client.send(message);
    }else if($scope.answer=='update'){
        ob ={"device_name":$scope.resourceName,"device_json":JSON.stringify($scope.finalData)}
        client.subscribe('EI/SimulatorSetup/Resources/'+$scope.resourceName+'/Put/Reply', { qos: 1, onFailure: doFail });
        message = new Paho.MQTT.Message(JSON.stringify(ob));
        message.destinationName = 'EI/SimulatorSetup/Resources/'+$scope.resourceName+'/Put';
        client.send(message);
    }
    }, function() {
     
    });
    
    
  };

$scope.$on('devname',function(e,a){
    $scope.devname = a;
})
    

});
simulatorModule1.controller('dialogCtrl', function($scope, $rootScope, simulatorModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, $mdDialog, CustomMessages) {
    $scope.newFlag = false
    $scope.updateFlag = false

$scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        if(answer=='new'){
            $scope.newFlag  = true;
        }else if(answer=='update'){
            $scope.updateFlag=true
        }
      $mdDialog.hide(answer);
    };
    $scope.add = function(name){
        $rootScope.$broadcast('devname',name);
    }
    });