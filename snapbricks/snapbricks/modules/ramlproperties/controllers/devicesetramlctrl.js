var ramlpropertiesModule_dev = angular.module('ramlpropertiesModule.controllers');


ramlpropertiesModule_dev.controller('devramlCtrl', function($http, $scope, $rootScope, ENV, ramlpropertiesModuleService, gatewayModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $uibModal, $state, toaster, CustomMessages, AclService, $mdDialog, imageConstant, $uibModal) {
	$scope.selDeviceList=[]
	console.log($scope.selDeviceList.length==0)
    $rootScope.globals = $cookieStore.get('globals') || {};
    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
        $scope.orgid = $rootScope.globals.currentUser.orgid;
    }
    $scope.editrml = { "devicename": "", "deviceDesc": "", "devicekeywords": "", "device_defpro": "", "selectedproperty": '', "orgid": "", "id": "" };
    $scope.Addraml = { "name": "" };
    $scope.editrml.defination = [];
    $scope.maindefpro = [];
    $scope.defaultProperty = [];
    $scope.subdefinition = [];
    var check_flag = 0;

    $scope.addDevices = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modaladddevices.html',
            controller: 'addDevicesCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                dsparam: function() {
                    return { 'deviceList': $scope.deviceList }
                }
            }
        });
    }
 	
    $scope.$on('seldevicelist', function(e, a) {
        $scope.selDeviceList = a;
        console.log("in raml ctrl",$scope.selDeviceList)
    })
    $scope.getRAMLDev = function() {
        $scope.getRAMList = [];
        ramlpropertiesModuleService.getRAMLDeviceTemplate().then(function(data) {
            $scope.getRAMList = data.Data;
            $scope.totalItemsDev = data.total_records;
        });
    };
    $scope.getRAMLDev();
    $scope.funcGetTemplateData = function(template, index) {
        console.log(template, "====", index)
        $scope.editrml.devicename = template.devicename;
        $scope.editrml.devicekeywords = template.keywords.join(",");
        $scope.editrml.deviceDesc = template.description;
        $scope.editrml.orgid = template.orgid;
        $scope.editrml.id = template.id;

        $scope.processData(template);

    }





    $scope.AddPropertyData = function(obj) {
        var selected_val = obj.name;
        r
        //console.log(JSON.stringify(data.Data));
        var row_pr_data = obj;
        var ope_arr = [];
        var enum_opp = [];
        $scope.process_final = [];
        angular.forEach(row_pr_data.properties, function(value, key) {
            $scope.process_data = [];
            value.userpropertyname = value.propertyname;
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
                if (sub_pr.parent == value.propertyname) {
                    angular.forEach(sub_pr.subproperties, function(sub_pr2, su_key2) {


                        if (sub_pr2.propertytype == 'other') {
                            sub_pr2.userpropertyname = sub_pr2.propertyname;
                            if (sub_pr2.enum != undefined || sub_pr2.enum != null) {
                                enum_opp = [];
                                angular.forEach(sub_pr2.enum, function(v3, v3key) {
                                    enum_opp.push({ id: "propertyValue" + (v3key + 1), value: v3 });
                                });
                                delete(sub_pr2.enum);
                                sub_pr2.enum = enum_opp;
                            }
                        } else {
                            sub_pr2.userpropertyname = sub_pr2.subpropertyname;
                            sub_pr2.propertyname = sub_pr2.subpropertyname;
                            delete(sub_pr2.subpropertyname);
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

    }
    $scope.processData = function(Data) {
        var row_pr_data = Data;
        var ope_arr = [];
        var enum_opp = [];
        $scope.process_final = [];
        $scope.item = [];
        angular.forEach(row_pr_data.definitions, function(sub1, key5) {
            sub1.name = sub1.definitionName;
            angular.forEach(sub1.properties, function(value, key) {
                $scope.process_data = [];
                value.userpropertyname = value.propertyname;
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

                angular.forEach(row_pr_data.subdefinitions, function(sub_pr, su_key8) {

                    if (sub_pr.parent == value.propertyname) {
                        angular.forEach(sub_pr.subproperties, function(sub_pr2, su_key2) {


                            if (sub_pr2.propertytype == 'other') {
                                sub_pr2.userpropertyname = sub_pr2.propertyname;
                                if (sub_pr2.enum != undefined || sub_pr2.enum != null) {
                                    enum_opp = [];
                                    angular.forEach(sub_pr2.enum, function(v3, v3key) {
                                        enum_opp.push({ id: "propertyValue" + (v3key + 1), value: v3 });
                                    });
                                    delete(sub_pr2.enum);
                                    sub_pr2.enum = enum_opp;
                                }
                            } else {
                                sub_pr2.userpropertyname = sub_pr2.subpropertyname;
                                sub_pr2.propertyname = sub_pr2.subpropertyname;
                                delete(sub_pr2.subpropertyname);
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
                }); //sub propertied
                $scope.process_final.push({ data: $scope.process_data, "ope_arr": ope_arr, "parentname": sub1.definitionName });

            });
            $scope.item.push({ "name": sub1.definitionName, "properties": $scope.process_final });
            $scope.process_final = [];

        });
        $scope.editrml.defination = $scope.item;
        //	console.log(JSON.stringify($scope.item));		

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
                //	console.log(JSON.stringify($scope.defaultProperty));
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
        $scope.defaultProperty.push({ "ope_arr": ["other"], "data": [{ "propertytype": "other", "propertyname": "", "UserpropertyName": "", "type": "", "operations": [], "enum": [], "minimum": "", "maximum": "", "unit": "" }] });
    }
    $scope.Addproperty = function(index, type) {
        if (type == 'Units') {
            $scope.defaultProperty[index].data.push({ "propertytype": "Units", "propertyName": "Units", "userpropertyname": "Units", "type": "", "operations": [], "sub_property": [] });
            $scope.defaultProperty[index].ope_arr.push("Units");
        } else if (type == 'Interval') {
            $scope.defaultProperty[index].data.push({ "propertytype": "Interval", "propertyname": "Interval", "userpropertyname": "Interval", "type": "", "operations": [], "units": "", "type": "" });
            $scope.defaultProperty[index].ope_arr.push("Interval");
        } else if (type == 'Threshold') {
            $scope.defaultProperty[index].data.push({ "propertytype": "Threshold", "propertyname": "Threshold", "userpropertyname": "Threshold", "type": "", "operations": [], "thresholdValue": "" });
            $scope.defaultProperty[index].ope_arr.push("Threshold");
        } else {
            $scope.defaultProperty[index].data.push({ "propertytype": "other", "propertyname": "", "userpropertyname": "", "type": "", "operations": [], "enum": [], "minimum": "", "maximum": "", "unit": "" });
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
        $scope.defaultProperty[mainindex].data[index].propertyname = prname;
    }
    $scope.editDefinitionPropertiesData = function() {
        //	console.log(JSON.stringify($scope.defaultProperty[0].parentname));


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
    $scope.EditSaveData = function() {
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
                            objprr.push({ "units": subarr.unit, "type": subarr.type, "propertyname": subarr.userpropertyname, "operations": subarr.operations });
                        else if (subarr.type == 'string') {
                            $scope.en_savedata = [];
                            if (subarr.enum.length > 0) {
                                for (var k in subarr.enum) {
                                    $scope.en_savedata.push(subarr.enum[k].value);
                                }
                            }
                            objprr.push({ "units": subarr.unit, "type": subarr.type, "propertyname": subarr.userpropertyname, "operations": subarr.operations, "enum": $scope.en_savedata });
                        } else
                            objprr.push({ "units": subarr.unit, "type": subarr.type, "propertyname": subarr.userpropertyname, "operations": subarr.operations });

                        property_name = subarr.userpropertyname;
                    } else {

                        if (subarr.propertytype == "Units") {
                            obj.push({ "operations": subarr.operations, "units": subarr.sub_property, "type": subarr.type, "subpropertyname": subarr.userpropertyname, "propertytype": subarr.propertytype });
                        } else if (subarr.propertytype == "Interval") {
                            obj.push({ "operations": subarr.operations, "units": subarr.units, "subpropertyname": subarr.userpropertyname, "type": subarr.type, "value": subarr.value, "propertytype": subarr.propertytype });
                        } else if (subarr.propertytype == "Threshold") {
                            obj.push({ "operations": subarr.operations, "value": subarr.thresholdValue, "subpropertyname": subarr.userpropertyname, "type": subarr.type, "propertytype": subarr.propertytype });
                        } else {
                            if (subarr.type == 'boolean')
                                obj.push({ "units": subarr.unit, "type": subarr.type, "propertyname": subarr.userpropertyname, "operations": subarr.operations, "propertytype": subarr.propertytype });
                            else if (subarr.type == 'string') {
                                $scope.en_savedata = [];
                                if (subarr.enum.length > 0) {
                                    for (var k in subarr.enum) {
                                        $scope.en_savedata.push(subarr.enum[k].value);
                                    }
                                }
                                obj.push({ "units": subarr.unit, "type": subarr.type, "propertyname": subarr.userpropertyname, "operations": subarr.operations, "enum": $scope.en_savedata, "propertytype": subarr.propertytype });
                            } else
                                obj.push({ "units": subarr.unit, "type": subarr.type, "propertyname": subarr.userpropertyname, "operations": subarr.operations, "propertytype": subarr.propertytype });
                        }

                    } //else end key

                });
                $scope.savesubproperties.push({ "parentdefinition": defination.name, "parent": property_name, "subproperties": obj });

            });
            $scope.saveproperties.push({ "definitionName": defination.name, "properties": objprr });
        });
        $scope.deviceIds = []
        for(var i=0;i<$scope.arrDevList.length;i++){
        	$scope.deviceIds.push($scope.arrDevList[i].id)
        }
	
        $scope.finalData = {
            
            "orgid": $scope.editrml.orgid,
            "device_raml":{"definitions": $scope.saveproperties,"subdefinitions": $scope.savesubproperties},
            "deviceid": $scope.deviceIds,
            "gwid":$scope.arrDevList[0].gateway.id,
            "appid":$scope.arrDevList[0].appid,
			"meshID":$scope.meshId
        }; //"item":$scope.editrml.defination

        	console.log(JSON.stringify($scope.finalData));
            ramlpropertiesModuleService.setDeviceRaml($scope.finalData).then(function(data) {
                if (data.status == 404 || data.status == 400) {
                    toaster.pop("error", "", data.data.message)
                    //return false;
                } else {
                    $scope.dataLoading = false;
                    toaster.pop('success', '', data.message);
                    $location.path('/ramlproperties');
                }

            });

    }


});

