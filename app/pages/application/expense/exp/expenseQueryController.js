angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.expense', {
          url: '/expenseQueryTabList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseQueryTabList.html',
              controller: 'expenseQueryController'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('expenseQueryController', [
    '$scope', 'expenseApply', 'dialog',
    '$http', '$q', '$state', '$ionicLoading',
    'hmsHttp', 'hmsPopup', "baseConfig",
    function ($scope, expenseApply, dialog,
      $http, $q, $state, $ionicLoading,
              hmsHttp, hmsPopup, baseConfig) {

    $scope.newPage = 0;
    $scope.isshow = true;
    $scope.canClickButton = {
      toSubmit: true,
      submitted: false
    };
    var statusType = {
      new: "toSubmit",
      submit: "submitted"
    };
    var currentListStatusType = statusType.new;

    var noApprove = document.getElementById("noApprove");// add by ciwei
    var alreadyApprove = document.getElementById("alreadyApprove");// add by ciwei
    $scope.changeButton = function (type) {
      switch (type) {
        case 'toSubmit':
          $scope.canClickButton = {
            toSubmit: false,
            submitted: true
          };
          //  $("#toSubmit").addClass("button-positive")
          // $("#submitted").removeClass("button-positive")
          noApprove.style.backgroundColor = "#D1F4F6";
          noApprove.style.color = "#20CBD3";
          alreadyApprove.style.backgroundColor = "#20CBD3";
          alreadyApprove.style.color = "white";
          currentListStatusType = statusType.new;
          break;
        case 'submitted':
          $scope.canClickButton = {
            toSubmit: true,
            submitted: false
          };
          //  $("#submitted").addClass("button-positive")
          //  $("#toSubmit").removeClass("button-positive")
          alreadyApprove.style.backgroundColor = "#D1F4F6";
          alreadyApprove.style.color = "#20CBD3";
          noApprove.style.backgroundColor = "#20CBD3";
          noApprove.style.color = "white";
          currentListStatusType = statusType.submit;
          break;
      }
      queryTabList(type);
    };

    $scope.$on('$stateChangeSuccess', // add by jiangzuoyong
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == 'tab.exp_main' && fromState.name == 'tab.expenseDetail') {
          var promise = queryList();
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
              $ionicLoading.hide();
            } else if (response["status"] == "ETOKEN") {// add by ciwei
              dialog.showAlert("E", response["returnMsg"]);
              $ionicLoading.hide();
              $state.go('login');
            }
            else {
              // showMessage("未知错误:"+angular.toJson(response));
              dialog.showAlert("E", "获取信息错误");
              $ionicLoading.hide();
            }
          }, function (error) {
            // showMessage("网络连接错误...."+angular.toJson(error));
            dialog.showAlert("E", "网络连接错误");
            $ionicLoading.hide();
          });
        }
      });

    // add by ciwei
    $scope.showHelp = function () {
      var template = 'Step1：“新建记一笔”，填写待报销记录，保存并上传。' + '<br> ' +
        'Step2：在“报销”功能中，创建报销单，选择项目，再选择已经上传的“记一笔”作为报销行信息，保存提交。' + '<br><br> ' +
        '**“记一笔”保存，是保存在手机本地，只有上传后，才能在报销单处选到。另，如若要卸载app，需先将所有记一笔“上传”，否则会丢失。';

      var alertPopup = hmsPopup.showPopup(template, "报销功能使用说明");
    };

    $scope.show = function () {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hide = function () {
      $ionicLoading.hide();
    };
    //初始化列表
    function queryList() {
      // $scope.expList.splice(0, $scope.expList.length);
      // // baseConfig.businessPath   baseConfig.businessPath
      $ionicLoading.show({
        template: "Loading..."
      });
      var expStatues = 'SAVE';
      var deferred = $q.defer();
      var Url = baseConfig.businessPath + "fetch_expense_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_expense_type":"' + expStatues
        + '","p_page_num":"' + "1" + '"}}';

      hmsHttp.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    var promise = queryList();
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
        $ionicLoading.hide();
      } else if (response["status"] == "ETOKEN") {// add by ciwei
        dialog.showAlert("E", response["returnMsg"]);
        $ionicLoading.hide();
        $state.go('login');
      }
      else {
        // showMessage("未知错误:"+angular.toJson(response));
        dialog.showAlert("E", "获取信息错误");
        $ionicLoading.hide();
      }
    }, function (error) {
      // showMessage("网络连接错误...."+angular.toJson(error));
      dialog.showAlert("E", "网络连接错误");
      $ionicLoading.hide();
    });

    function queryTabList(statues) {
      $scope.isshow = false;
      console.log("helloworld");
      $scope.expList = new Array();
      // $scope.expList.splice(0, $scope.expList.length);
      $scope.newPage = $scope.newPage + 1;

      console.log($scope.newPage);

      var expStatues
      if (statues == 'toSubmit') {
        expStatues = 'SAVE';
      }
      else if (statues == 'submitted') {
        expStatues = 'SUBMIT';
      }
      //  console.log("queryList");
      var Url = baseConfig.businessPath + "fetch_expense_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_expense_type":"' + expStatues + '","p_page_num":"' + $scope.newPage + '"}}';
      $scope.show();
      hmsHttp.post(Url, PostData).success(function (response) {
        if (response["status"] == "S") {
          //  $scope.isshow = true;
          console.log(123);
          console.log($scope.newPage);
          console.log(456);
          $scope.expenseList = response["expense_list"];
          //  console.log(expenseList);
          $.each($scope.expenseList, function (n, value) {
            $scope.expList.push(value);
          });
          //$scope.expList=Item;
          var length = $scope.expList.length;
          //console.log(length);
          for (var i = 0; i < length; i++) {
            //  console.log($scope.expList[i].descrpt);
            if ($scope.expList[i].descrpt == 'undefined') {
              $scope.expList[i].descrpt = "";
            }
          }
          //  $scope.isshow = false;
          $scope.hide();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else if (response["expense_list"].length == 0) {
          // alert(123);
          $scope.isshow = false;
          $ionicLoading.show({template: '没有更多的数据了....', noBackdrop: true, duration: 1000});
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      }).error(function (data) {
        $scope.isshow = false;
        //$scope.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
      });
    }

    /*打开申请创建页面*/
    $scope.openCreateExpense = function () {
      //初始化数据
      expenseApply.initData();
      expenseApply.operation = "INSERT";
      //expenseApply.initData();
      expenseApply.selectedLineId = [];
      //prepareForReturn();
      // prepareForReturn();
      expenseApply.canEdit = true;
      expenseApply.canSubmit = false;
      expenseApply.canUpload = false;
      expenseApply.canEditObjectType = true;// add by ciwei
      $state.go('tab.expenseDetail');
      // globalNavigator.pushPage(moduleHtmlPath.EXP+'expenseDetail.html', { animation: 'slide' });


    };

    //明细打开,更新可编辑
    function openUpdate() {
      //初始化数据，
      expenseApply.canEdit = true;
      expenseApply.operation = "UPDATE";
      expenseApply.canEditObjectType = true;
      expenseApply.canSubmit = true;
      $state.go('tab.expenseDetail');
    }

    //明细打开,只读方式
    function openReadOnly() {
      //初始化数据
      expenseApply.canEdit = false;
      expenseApply.canEditObjectType = false;
      expenseApply.canSubmit = false;
      $state.go('tab.expenseDetail');
    }


    $scope.openExpenseDetail = function (status, index) {
      // expenseApply.data.splice(0, expenseApply.data.length);
      // expenseApply.data.lines=[];
      //设置标志，保存后才能提交
      // expenseApply.saveAfterSubmit=false;

      expenseApply.selectedLineId = [];
      $ionicLoading.show({
        template: "Loading..."

      });
      var expHeaderId;
      expHeaderId = $scope.expList[index].ra_id;

      console.log("明细打开：" + expHeaderId);
      var promise = expenseApply.queryDetail(expHeaderId);
      promise.then(
        function (response) {
          if (response["status"] == "S") {
            var Item1 = [];
            //expenseApply.dateFmtForUI();
            var detailData = response["expense_list"];
            var head = response["expense_heaeder"];
            console.log(head);
            console.log(detailData);
            // Item1.push(detailData[0].ra_id);
            // expenseApply.data.expHeaderId=detailData[0].ra_id,
            expenseApply.data.expHeaderId = head.ra_id;
            expenseApply.data.description = head.description;
            expenseApply.canUpload = true;

            if (expenseApply.data.description == 'undefined') {
              expenseApply.data.description = "";
            }
            expenseApply.data.expenseObject_id = head.project_id
            expenseApply.data.expenseObject_desc = head.project_name;
            expenseApply.data.sum = head.amount;
            console.log(expenseApply.data.sum);
            // expenseApply.data.sum=head.amount;
            //  expenseApply.data.sum=0;
            $.each(detailData, function (n, value) {
              var item = {
                dateFrom: value.date_from,
                dateTo: value.date_to,
                place: value.place,
                memo: value.abstract,
                expenseItemName: value.ra_name,
                expObject_desc: value.fee_item_name,
                price: value.unit_price,
                quantity: value.quantity,
                amount: value.amount,
                lineId: value.ra_line_id,
                original_currency: value.original_currency,
                exchange_rate: value.exchange_rate,
                attach_number: value.attach_number,
                rentals_infor: value.rentals_infor

              };

              Item1.push(item);
              console.log(Item1);
              // this.date.head=Item;
              //console.log(this.date.head);
              $ionicLoading.hide();
            });

            expenseApply.data.lines = Item1;

            for (var i = 0; i < expenseApply.data.lines.length; i++) {
              expenseApply.selectedLineId.push(expenseApply.data.lines[i].lineId);
            }
            console.log(8888);
            console.log(expenseApply.selectedLineId);
            console.log(9999);

            /*  var length=expenseApply.data.lines.length;
             for(var i=0;i<length;i++)
             {
             expenseApply.data.sum+=expenseApply.data.lines[i].amount;
             }
             */

            $ionicLoading.hide();
            //  expenseApply.data = response["expense_list"];
            if (status == "已经保存") {
              openUpdate();
            }
            else if (status == "已经审批" || status == "已提交") {
              console.log("SUBMITTED Query");
              openReadOnly();

            }
          }
        },
        function (err) {
          // showMessage('网络连接错误:'+angular.toJson(err));
          dialog.showAlert("E", "网络连接错误");
          $ionicLoading.hide();
        });
    }
    $scope.removeData = function (status, index) {
      if (status == "已经保存") {
        $ionicLoading.show({
          template: "正在删除报销单"

        });
        var deferred = $q.defer();
        var expHeaderId = $scope.expList[index].ra_id;
        console.log(expHeaderId);
        var Url = baseConfig.businessPath + "delete_expense";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '"}}';
        hmsHttp.post(Url, PostData).success(function (response) {
          if (response["status"] == "S") {
            $scope.expList.splice(index, 1);
            $ionicLoading.hide();
            // dialog.showAlert("I", "删除成功");// mod by ciwei
          }
          else {
            dialog.showAlert("E", "获取信息错误");

          }
        }).error(function (data) {

          $ionicLoading.show({
            template: '网络连接错误'

          });
          $ionicLoading.hide();
        })
      }

      else if (status == "已提交" || status == "已经审批") {
        // showMessage("不能删除");
        dialog.showAlert("I", "不能删除");
      }
    }

    $scope.doRefresh = function () {
      console.log('Refreshing!');
      // showMessage('Refreshing!');

      queryTabList(currentListStatusType);

      $scope.$broadcast('scroll.refreshComplete');


    };

  }]);
