angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.cst_costDetail', {
          url: '/expense/cst/costDetail',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costDetail.html',
              controller: 'costDetailController',
              cache: false
            }
          }
        });
    }]);


angular.module("applicationModule")
  .controller('costDetailController', ['$scope','dialog','costApply','$location','$http','$q','$state','$ionicHistory','$ionicLoading',function($scope,dialog,costApply,$location, $http,$q,$state, $ionicHistory,$ionicLoading) {

    //初始化数据
     $scope.canEdit=costApply.canEdit;
    //$scope.objectType=loanApply.objectType;
    //$scope.detailData=loanApply.getData();
    //$scope.currentQueryTypeDesc = loanApply.currentQueryTypeDesc;

    $scope.canSubmit = costApply.canSubmit;

    //$scope.detailData=loanApply.getDataFromTravel(globalNavigator.getCurrentPage().options.travelDataPara);


    //$scope.canSubmit = loanApply.canSubmit;


    $scope.detailData = costApply.data;

    if ($scope.detailData.status == '') {
        $scope.showButtonSave = true;
        $scope.showButtonSubmit = false;

    }
    else if ($scope.detailData.status == 'NEW') {

        $scope.showButtonSave = false;
        $scope.showButtonSubmit = true;


    }
    else {
        $scope.showButtonSave = false;
        $scope.showButtonSubmit = false;

    }

    //showMessage(angular.toJson($scope.detailData));
    /********
     * 费用申请 保存
     */
    $scope.saveData = function() {




        costApply.data = $scope.detailData;


        var checkDataValid = true;
        showMessage(costApply.data.cost_type_id );

        if (costApply.data.cost_type_code != 'BX_002'  ) {


            //showMessage(costApply.data.cost_amount);
            // 非 无消费明细 金额 不能为空
            if(costApply.data.cost_amount == "" || costApply.data.cost_amount == undefined ) {

                $ionicLoading.show({
                    template: '请输入金额 ... ',
                    duration: 1000
                });
                //showMessage("请输入金额");
                checkDataValid = false;
            }
        }

        if (checkDataValid == true ) {
            $ionicLoading.show({
                template: '请等待 ... '
                //duration: 1000
            });


            var promise = costApply.save();
            promise.then(
                function(response) {
                    var code = response.status;
                    if (code == "S") {



                        costApply.data.cost_apply_id = response.apply_id;


                        //$scope.canEdit=false;
                        costApply.canSubmit = true;
                        $scope.canSubmit = true;

                        dialog.showAlert("I","保存成功");

                        //showMessage(angular.toJson(response));
                        $ionicLoading.hide();


                    }
                    else {
                        $ionicLoading.hide();
                        dialog.showAlert("E","保存失败"+angular.toJson(response));


                        showMessage("error :"+angular.toJson(response));
                    }
                },
                function (error) {
                    $ionicLoading.hide();
                    dialog.showAlert("E","保存失败"+angular.toJson(error));
                    showMessage(angular.toJson(error));
                }
            )
        }





    };

    /********
     * 费用申请 提交
     */
    $scope.submitData = function() {

       //showMessage("提交数据接口 接口 未实现");

        $ionicLoading.show({
            template: '数据提交中 请稍后 ... '
        });

        var promise = costApply.submit();
        promise.then(
            function(response) {
                var code = response.status;
                if (code == "S") {

                    //costApply.cost_apply_id = response.apply_id;
                    $scope.canEdit=false;

                    dialog.showAlert("I","提交成功");

                    showMessage(angular.toJson(response));


                }
                else {
                    dialog.showAlert("E","提交失败"+angular.toJson(response));

                    showMessage("error :"+angular.toJson(response));
                }

                $ionicLoading.hide();
            },
            function (error) {
                $ionicLoading.hide();
                dialog.showAlert("E","提交失败"+angular.toJson(error));


                showMessage(angular.toJson(error));
            }
        )
    };




    /*********
     * 字段列表 项目
     */
    $scope.openCostProjectItemList = function() {
        if ($scope.canEdit == true)  {
            $scope.valueChange();

            $state.go("tab.cst_costProjectItemList");

        }

    };

    /**********
     * 字段列表 费用类型
     */
    $scope.openCostTypeItemList = function() {
        if ($scope.canEdit == true)  {
            $scope.valueChange();

            $state.go("tab.cst_costTypeItemList");

        }



    };

    $scope.valueChange=function(){
        //showMessage("valueChange");
        costApply.canSubmit=false;
        $scope.canSubmit=false;
    };

    /**********
     * 取消
     */
    $scope.cancel = function () {

        $ionicHistory.goBack();

    };





}]);