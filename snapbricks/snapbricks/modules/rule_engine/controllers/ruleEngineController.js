var ruleEngineModule = angular.module('ruleEngineModule.controllers', ['ui.bootstrap', 'ngSanitize', 'ngTagsInput', 'elif']);

ruleEngineModule.controller('ruleengineCtrl', function($scope, $rootScope, ruleengineModuleService, ENV, $cookieStore, $location, $filter, $timeout, $window, $state, toaster, $mdDialog, CustomMessages, WebMqtt) {

    /*	Data Attribute Initialize Function of Camera Id, Camera IP, Camera PTZ
     Dynamic Generic Function for Initialize Data Attributes
     */
    $rootScope.globals = $cookieStore.get('globals') || {};
    $scope.showCreateNewRule = false;


    if (!$rootScope.globals.currentUser) {
        $location.path('/login');
    } else {
        $scope.username = $rootScope.globals.currentUser.username;
    }

    $scope.createNewRule = function() {
        $scope.showCreateNewRule = true;
    };
    $scope.refreshFunc = function() {
        $state.reload();
    };
    $scope.checkStatus = function(ruleEngine) {

        ruleEngine.Selected = !ruleEngine.Selected;
    };
    $scope.create = function(ruleEngine) {
        if (ruleEngine != "") {
            localStorage.setItem('ruleEngineselectedInfo', JSON.stringify(ruleEngine));
        }
        $location.path('ruleengine/createrule');
    };
    $scope.editData = function(ruleEngine) {
        if (ruleEngine != "") {
            localStorage.setItem('ruleEngineselectedInfo', JSON.stringify(ruleEngine));
        }
        $location.path('ruleengine/editrule');
    }

    $scope.deleteData = function(ruleEngine, ev) {
        $scope.deletedata = { "metadata": { "processedby": ruleEngine.metadata.processedby, "appid": ruleEngine.metadata.appid } };
        var confirm = $mdDialog.confirm({
                onComplete: function afterShowAnimation() {
                    var $dialog = angular.element(document.querySelector('md-dialog'));
                    var $actionsSection = $dialog.find('md-dialog-actions');
                    var $cancelButton = $actionsSection.children()[0];
                    var $confirmButton = $actionsSection.children()[1];
                    angular.element($confirmButton).removeClass('md-focused');
                    angular.element($cancelButton).addClass('md-focused');
                    $cancelButton.focus();
                }
            })
            .title("Are you sure you want to delete this item?")
            .textContent("It can't be retrieved.")
            .ariaLabel(CustomMessages.MD_GENERAL_ARIA_LABEL)
            .targetEvent(ev)
            .cancel(CustomMessages.MD_GENERAL_CANCEL)
            .ok(CustomMessages.MD_GENERAL_OK);
        $mdDialog.show(confirm).then(function() {

            ruleengineModuleService.deleteRules(ruleEngine.id, $scope.deletedata).then(function(data) {
                if (data.message != undefined) {
                    $scope.message = data.message;
                    $scope.rulecall(1);
                    toaster.pop('success', '', $scope.message);
                } else {
                    toaster.pop('error', '', data.message);
                }
            });
        }); //complete dialog box

    }
    $scope.mode = "all"
    $scope.getDataList = function(mode) {
        $scope.dataList = []
        $scope.mode = mode
        if (mode == 'Mesh') {
            ruleengineModuleService.getMeshlist().then(function(data) {
                if (data.Data != undefined) {
                    $scope.meshlist = data.Data;
                    for (var i = 0; i < $scope.meshlist.length; i++) {
                        $scope.dataList.push({ "id": $scope.meshlist[i].id, "name": $scope.meshlist[i].name })
                    }
                } else {
                    $scope.meshlist = []
                }


                console.log($scope.meshlist)
            });
        } else if (mode == 'Standalone') {
            ruleengineModuleService.getStandaloneGateway().then(function(response) {
                if (response.Data != undefined) {
                    $scope.meshlist = response.Data
                    for (var i = 0; i < $scope.meshlist.length; i++) {
                        $scope.dataList.push({ "id": $scope.meshlist[i].id, "name": $scope.meshlist[i].displayname })
                    }
                } else {
                    $scope.meshlist = []
                }

            })
        }

    }

    $scope.getRuleList = function(id, pageno) {
        $scope.currentruleEnginePage = pageno;
        $scope.ruleEnginePerPage = 10;
       
        $scope.ruleEngineList = [];
        console.log(id)
        if($scope.mode=='all'){
        	$scope.rulecall(1);
        }else{
        if(id!=undefined){
        	 $scope.dataRuleEngineLoading = true;
        ruleengineModuleService.getRuleEngineList(pageno, $scope.mode, id).then(function(data) {

            $timeout(function() {
                if (data != "") {
                    $scope.ruleEngineList = data.Data;
                    $scope.dataRuleEngineLoading = false;
                    $scope.totalruleEngineItems = data.total_records;

                } else {
                    $scope.dataRuleEngineLoading = false;
                    $scope.totalruleEngineItems = 0;
                }
                $scope.checkAll = function(selectedAll) {
                    $scope.selectedAll = selectedAll;
                    if ($scope.selectedAll) {
                        $scope.selectedAll = true;
                    } else {
                        $scope.selectedAll = false;
                    }
                    angular.forEach($scope.ruleEngineList, function(ruleEngine) {
                        ruleEngine.Selected = $scope.selectedAll;
                    });
                };
            }, 100);
        }).catch(function(error) {
            $scope.totalruleEngineItems = 0;
            $scope.dataRuleEngineLoading = false;
        });
}

}        $scope.selectedRow = null;
        $scope.setClickedRow = function(index, ruleEngine) {
            $scope.selectedRow = index;
            $scope.selectedRowruleEngine = ruleEngine;
            if (ruleEngine.Selected == true) {
                ruleEngine.Selected = false;
            } else {
                ruleEngine.Selected = true;
            }
        };

    }
    $scope.rulecall = function(pageno) {
        $scope.ruleEngineList = [];
        $scope.currentruleEnginePage = pageno;
        $scope.ruleEnginePerPage = 10;
        $scope.dataRuleEngineLoading = true;
        ruleengineModuleService.getRuleEngineList(pageno).then(function(data) {

            $timeout(function() {
                if (data != "") {
                    $scope.ruleEngineList = data.Data;
                    $scope.dataRuleEngineLoading = false;
                    $scope.totalruleEngineItems = data.total_records;

                } else {
                    $scope.dataRuleEngineLoading = false;
                    $scope.totalruleEngineItems = 0;
                }
                $scope.checkAll = function(selectedAll) {
                    $scope.selectedAll = selectedAll;
                    if ($scope.selectedAll) {
                        $scope.selectedAll = true;
                    } else {
                        $scope.selectedAll = false;
                    }
                    angular.forEach($scope.ruleEngineList, function(ruleEngine) {
                        ruleEngine.Selected = $scope.selectedAll;
                    });
                };
            }, 100);
        }).catch(function(error) {
            $scope.totalruleEngineItems = 0;
            $scope.dataRuleEngineLoading = false;
        });

        $scope.selectedRow = null;
        $scope.setClickedRow = function(index, ruleEngine) {
            $scope.selectedRow = index;
            $scope.selectedRowruleEngine = ruleEngine;
            if (ruleEngine.Selected == true) {
                ruleEngine.Selected = false;
            } else {
                ruleEngine.Selected = true;
            }
        };
    }
    $scope.pageChanged = function() {
        $scope.rulecall($scope.currentruleEnginePage);
    };
    $scope.rulecall(1);

});