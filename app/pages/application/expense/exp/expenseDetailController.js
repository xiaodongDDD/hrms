/**
 * Created by huchaoliang on 15-5-7.
 */

appModuleExpense
  .controller('expenseDetailController', ['$scope', 'expenseApply', 'keepAccount', 'dialog', 'expenseObject', '$state', '$http', '$ionicLoading', '$q', function ($scope, expenseApply, keepAccount, dialog, expenseObject, $state, $http, $ionicLoading, $q) {

    $scope.isshow=true;
    if(window.localStorage.AlertPage=="" || window.localStorage.AlertPage==undefined )
    {
      $scope.navBar = true;
      window.localStorage.AlertPage="exist";
    }
    else
    {
      $scope.navBar = false;
      $scope.isshow=false;
    }
    $scope.hide=function()
    {
      $scope.isshow=false;
      $scope.navBar = false;
    };
    //expenseDetail 缓冲图片added by heLiu

    expenseObject.businessType = 'EXP';
    $scope.canEdit = expenseApply.canEdit;
    //  expenseApply.dateFmtForSave();
    $scope.canUpload = expenseApply.canUpload;
    console.log($scope.canUpload);
    $scope.detailData = expenseApply.data;
    //console.log("参数数据为：" + angular.toJson( $scope.detailData));
    $scope.currentQueryTypeDesc = expenseApply.currentQueryTypeDesc;
    //  $scope.detailData=expenseApply.getDataFromTravel(globalNavigator.getCurrentPage().options.travelDataPara);

    $scope.canSubmit = expenseApply.canSubmit;

    /*创建明细行*/
    $scope.openCreateDetail = function () {
      keepAccount.operation = "INSERT";
      keepAccount.canEdit = true;
      keepAccount.sourceFrom = "EXPENSE";
      keepAccount.initData();
      if (expenseApply.canEditObjectType == true) {
        $scope.valueChange();
        $state.go('tab.acc_detail');
        // globalNavigator.pushPage('html/acc/accountDetail.html', { animation : 'slide' });
      }
    };


    /*从记一笔选择明细行*/
    $scope.openSelectDetail = function () {
      console.log("expenseApply.data.lines: " + angular.toJson(expenseApply.data.lines));
      console.log("canEditObjectType="+expenseApply.canEditObjectType);
      console.log("expenseObject_desc="+$scope.detailData.expenseObject_desc);
      expenseApply.canUpload = false;
      if (expenseApply.canEditObjectType == true && ($scope.detailData.expenseObject_desc) != null) {
        $scope.valueChange();
        $state.go('tab.exp_SelectDetail');
        // globalNavigator.pushPage('html/exp/interfaceReportList.html', { animation : 'slide' });
      }
    };

    /*保存数据*/
    $scope.saveData = function () {
      expenseApply.data = $scope.detailData;
      if (expenseApply.data.description == undefined) {
        expenseApply.data.description = " ";
      }

      if (expenseApply.data.lines.length == 0) {
        dialog.showAlert("I", "请先从记一笔选择");
        // showMessage("请先从记一笔选择");
      }
      else {
        $ionicLoading.show({
          template: "正在保存..."
        });

        if (expenseApply.operation == "INSERT") {
          var promise = expenseApply.insert($scope.detailData);
          promise.then(
            function (response) {
              //console.log("接口返回参数： " + angular.toJson(response));
              if (response["status"] == "S") {
                $ionicLoading.hide();
                expenseApply.data.expHeaderId = response["ra_id"];
                //console.log("新增返回参数： " + angular.toJson(response));
                //console.log("参数数据：" + angular.toJson(expenseApply.data));
                $scope.detailData.lines = response.expense_list;
                //console.log("更新后参数数据：" + angular.toJson($scope.detailData.lines));
                expenseApply.selectedLineId = [];

                //showMessage("保存成功");
                dialog.showAlert("I", "保存成功");
                expenseApply.operation = "UPDATE";
                //  expenseApply.canUpload=true;
                $scope.canUpload = true;
              }
              else {
                // showMessage("未知错误:"+angular.toJson(response));
                dialog.showAlert("E", "获取信息错误");
                $ionicLoading.hide();

              }
            },
            function (err) {  // 处理错误 .reject
              // showMessage("网络连接错误:"+angular.toJson(err));
              dialog.showAlert("E", "网络连接错误");
              $ionicLoading.hide();
            });
        } else if (expenseApply.operation == "UPDATE") {
          var promise = expenseApply.update($scope.detailData);
          promise.then(function (response) {
            if (response["status"] == "S") {
              //console.log("接口返回参数： " + angular.toJson(response));
              $scope.detailData.lines = response.expense_list;
              //console.log("更新后参数数据：" + angular.toJson($scope.detailData.lines));
              expenseApply.selectedLineId = [];
              $ionicLoading.hide();
              expenseApply.operation = "UPDATE";
              expenseApply.saveAfterSubmit = true;
              dialog.showAlert("I", "更新成功");
              //  expenseApply.canUpload=true;
              $scope.canUpload = true;
              //showMessage("更新成功");
            }
            else {
              // showMessage("未知错误:"+angular.toJson(response));
              dialog.showAlert("E", "获取信息错误");
              $ionicLoading.hide();

            }
          }, function (err) {  // 处理错误 .reject
            //showMessage("网络连接错误:"+angular.toJson(err));
            dialog.showAlert("E", "网络连接错误");
            $ionicLoading.hide();
          });
        }
      }
    };

    // 判断是否可删除
    $scope.canToRemove = function () {
      /*
       if (loanApply.data.status ==  'NEW' ||  loanApply.data.status == 'REJECTED') {
       return true;
       }else {
       return false;
       }
       */
      //return (expenseApply.data.status ==  'NEW' ||  expenseApply.data.status == 'REJECTED');
      return (expenseApply.data.status == 'NEW' );
    };

    //打开报销单明细
    $scope.openReportLines = function (index) {
      //根据index做相应处理
      expenseApply.tempLine = expenseApply.data.lines[index];
      $state.go('tab.exp_expenseLines');
    };

    $scope.valueChange = function () {
      expenseApply.canSubmit = false;
      $scope.canSubmit = false;
      expenseApply.canUpload = false;
      $scope.canUpload = false;
    };

    /*提交报销数据*/
    $scope.submitData = function () {
      expenseApply.data = $scope.detailData;

      $ionicLoading.show({
        template: "正在提交..."
      });
      var expHeaderId = $scope.detailData.expHeaderId;
      var Url = window.localStorage.wsurl + "/expense_account/submit_expense";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '"}}';
      $http.post(Url, PostData).success(function (response) {
        if (response["status"] == "S") {
          $ionicLoading.hide();
          // showMessage("提交成功");
          dialog.showAlert("I", "提交成功");
          $state.go('tab.exp_main');
          var promise = expenseApply.queryTabList('toSubmit')
          promise.then(function (response) {
            if (response["status"] == "S") {
              $("#toSubmit").addClass("button-positive")
              $scope.expList = response["expense_list"];
              var length = $scope.expList.length;
              console.log(length);
              for (var i = 0; i < length; i++) {
                if ($scope.expList[i].descrpt == 'undefined') {
                  $scope.expList[i].descrpt = "";
                }
              }
            }
            else {
              //  showMessage("未知错误:"+angular.toJson(response));
              dialog.showAlert("E", "获取信息错误");
              $ionicLoading.hide();
            }

          }, function (error) {
            // showMessage("网络连接错误...."+angular.toJson(error));
            dialog.showAlert("E", "网络连接错误");
            $ionicLoading.hide();
          });


          $scope.canEdit = false;
        }
        else {
          // showMessage("未知错误:"+angular.toJson(response));
          dialog.showAlert("E", "获取信息错误");
          $ionicLoading.hide();

        }
      }).error(function (data) {
        //  $ionicLoading.hide();
        $ionicLoading.show({
          template: '网络连接错误'

        });
        $ionicLoading.hide();
      })
    }

    $scope.openExpenseObjectList = function () {
      console.log($scope.canEdit);
      console.log($scope.detailData.expHeaderId);
      if ($scope.detailData.lines.length == 0 && $scope.detailData.expHeaderId == undefined) {
        $scope.valueChange();
        $state.go("tab.acc_expenseObjectList");
      }
    }

    $scope.removeLine = function (canDeleteLine, index) {
      var amount = $scope.detailData.lines[index].amount;
      console.log($scope.detailData.lines[index].amount);
      console.log(expenseApply.data.lines.length);
      if (canDeleteLine == true) {
        $ionicLoading.show({
          template: "正在删除..."
        });
        var deferred = $q.defer();
        var lineId = $scope.detailData.lines[index].lineId;
        var expHeaderId = $scope.detailData.expHeaderId;
        //console.log("+++++++++++++++++++++++++++++" +　lineId);
        var Url = window.localStorage.wsurl + "/expense_account/delete_expense_line";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '","p_ra_line_id":"' + lineId + '"}}';

        $http.post(Url, PostData).success(function (response) {
          if (response["status"] == "S") {
            console.log(expenseApply.data.lines.length);
            // dialog.showAlert("I", "删除成功"); // mod by ciwei
            console.log(expenseApply.data.lines.length);
            for (var i = 0; i < expenseApply.selectedLineId.length; i++) {
              if (expenseApply.selectedLineId[i] == lineId) {
                expenseApply.selectedLineId = removeElement(i, expenseApply.selectedLineId);
              }
            }
            expenseApply.data.sum = expenseApply.data.sum - amount;
            $scope.detailData.lines.splice(index, 1);
            expenseApply.data = $scope.detailData;
            $ionicLoading.hide(); // move by ciwei
          }
          else {
            //showMessage("未知错误:"+angular.toJson(response));
            dialog.showAlert("E", "获取信息错误");
            $ionicLoading.hide();

          }
        }).error(function (data) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: '网络连接错误'

          });
        })
      }

      else if (canDeleteLine == false) {
        dialog.showAlert("I", "不能删除");
      }
    }
    function removeElement(index, array) {
      if (index >= 0 && index < array.length) {
        for (var i = index; i < array.length; i++) {
          array[i] = array[i + 1];
        }
        array.length = array.length - 1;
      }
      return array;
    }

  }]);
