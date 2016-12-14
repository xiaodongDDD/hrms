
// 费用申请
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.cst_list', {
          url: '/expense/acc/costList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costList.html',
              controller: 'costListController',
              cache: false
            }
          }
        });
  }]);

angular.module("applicationModule")
  .controller('costListController', function ($scope, $http, $q, dialog, costApply, $state, $ionicLoading, baseConfig,hmsHttp) {

    var statusType = {
      new: "NEW",
      submit: "SUBMIT"
    };

    var currentListStatusType = statusType.new;

    $scope.canClickButton = {
      toSubmit: false,
      submitted: true,
      approved: true
    };

    var noApprove = document.getElementById("noApprove");// add by ciwei
    var alreadyApprove = document.getElementById("alreadyApprove");// add by ciwei

      $scope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {
            if (toState.name == 'tab.cst_list' && fromState.name == 'tab.cst_costDetail') {
              queryCostApplyList(currentListStatusType);
            }
          });

    $scope.changeTabButton = function (type) {

      switch (type) {
        case 'toSubmit':
          $scope.canClickButton = {
            toSubmit: false,
            submitted: true,
            approved: true
          };
          currentListStatusType = statusType.new;
          noApprove.style.backgroundColor = "#D1F4F6";
          noApprove.style.color = "#20CBD3";
          alreadyApprove.style.backgroundColor = "#20CBD3";
          alreadyApprove.style.color = "white";
          break;

        case 'submitted':
          $scope.canClickButton = {
            toSubmit: true,
            submitted: false,
            approved: true
          };

          currentListStatusType = statusType.submit;
          alreadyApprove.style.backgroundColor = "#D1F4F6";
          alreadyApprove.style.color = "#20CBD3";
          noApprove.style.backgroundColor = "#20CBD3";
          noApprove.style.color = "white";
          break;
        case 'approved':
          $scope.canClickButton = {
            toSubmit: true,
            submitted: true,
            approved: false
          };

          currentListStatusType = statusType.submit;

          break;
        default :
          showMessage("未知按钮");
          break;
      }
      queryCostApplyList(currentListStatusType);

    };


    /***************
     *  功能： 查询指定状态的 预报销申请列表
     * @param statusType: NEW ,SUBMIT
     * @returns {*}
     */
    function queryListData(statusType) {

      var deferred = $q.defer();

      var Url = baseConfig.businessPath + "get_apply_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_status":"' + statusType + '","p_project_id":"' + "" + '"}}';


      console.log(PostData);
      showMessage(PostData);
     hmsHttp.post(Url, PostData).success(function (data) {

        //showMessage(angular.toJson(data));
        deferred.resolve(data);

      }).error(function (data) {
        showMessage("error:" + angular.toJson(data));

        deferred.reject(data);

      });


      return deferred.promise;
    }

    function queryCostApplyList(statusType) {

      $ionicLoading.show({
        template: 'Loading...',
        duration: 1000
      });

      var promise = queryListData(statusType);
      promise.then(
        function (response) {
          var detailData = [];
          console.log(angular.toJson(response));
          var code = response.status;
          if (code == "S") {

            var list_tmp = response["apply_list"];
            $.each(list_tmp, function (i, value) {
              var item = {

                cost_apply_id: value.apply_id,
                cost_place: value.location,
                cost_date: value.apply_date,
                cost_type_id: '',
                cost_type_code: value.apply_type_code,
                cost_type_name: value.apply_type_name,
                cost_subject_code: value.subject_code,
                cost_project_code: value.project_code,
                cost_project_id: value.project_id,
                cost_project_name: value.project_name,
                cost_full_name: value.full_name,
                cost_amount: value.apply_money,
                description: value.reason,
                apply_by: value.apply_by,
                status: value.status
              };


              detailData.push(item);

            });


            $scope.applyList = detailData;
            costApply.appLyList = detailData;

          }
          else {
            dialog.showAlert("E", "查询失败");
            //dialog.showAlert("E","查询失败"+angular.toJson(response));

            showMessage("error :" + angular.toJson(response));
          }

          //console.log(angular.toJson($scope.expenseItemList));

          $ionicLoading.hide();

        },
        function (err) {  // 处理错误 .reject

          dialog.showAlert("E", "网络连接错误...." + angular.toJson(err));

          showMessage("网络连接错误...." + angular.toJson(err));

        });


      $ionicLoading.hide();
      //queryCostApplyList(type);

    }

    queryCostApplyList(currentListStatusType);

    /**************
     * 新建费用申请
     *
     * ********/
    $scope.createCostApply = function () {
      costApply.canEdit = true;
      costApply.initData();

      costApply.data.status = "";
      $state.go('tab.cst_costDetail');
    };

    /***********
     *
     *  下拉刷新
     * ******/

    $scope.doRefresh = function () {
      console.log('Refreshing!');
      showMessage('Refreshing!');

      queryCostApplyList(currentListStatusType);

      $scope.$broadcast('scroll.refreshComplete');


    };

    // 删除记一笔
    $scope.removeData = function (e) {

      var target = e.target;
      var lineId = target.getAttribute('lineId');

      showMessage("delete clicked lineid " + lineId);

      $ionicLoading.show({
        template: 'Loading...',
        duration: 1000
      });
      var promise = keepAccount.remove(lineId);
      promise.then(
        function (response) {  // 调用承诺API获取数据 .resolve

          showMessage("数据删除成功");

          removePhotoFiles();

        },
        function (err) {  // 处理错误 .reject
          showMessage("删除失败...." + angular.toJson(err));
        }
      )
    };


    function groupJSON(jsons) {
      var newJson = [];
      loop1:for (var i = 0; i < jsons.length; i++) {
        var t1 = jsons[i].expense_date_from;
        var arr = {time: t1, list: []};
        arr.list.push(jsons[i]);
        for (var j = i + 1; j < jsons.length; j++) {
          var t2 = jsons[j].expense_date_from;
          if (t2 == t1) {
            arr.list.push(jsons[j]);
          } else {
            i = j - 1;
            break;
          }
          if (j == jsons.length - 1) {
            newJson.push(arr);
            break loop1;
          }
        }
        newJson.push(arr);
      }
      return newJson;
    }


    /**************
     *
     * 说明 打开费用申请明细
     * @param index
     */
    $scope.openCostDetail = function (status, index) {
      showMessage("查询明细 index: " + index);


      costApply.canEdit = false;
      costApply.canSubmit = false;


      if (status == 'NEW') {
        //showMessage("New");
        costApply.canSubmit = true;

        costApply.canEdit = true;

      }

      //showMessage(angular.toJson(costApply.appLyList));


      costApply.data = costApply.appLyList[index];
      //showMessage(angular.toJson(costApply.data));
      $state.go('tab.cst_costDetail');


    };


    // 删除照片
    function removePhotoFiles() {
      showMessage("删除照片操作 begin");

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
    }

    function onSuccess(fileSystem) {
      console.log(fileSystem.name);
      showMessage(fileSystem.name);

      //showMessage(keepAccount.tempPhoto.photo_src);
      var myFolderApp = baseConfig.appRootFile;


      // 数据删除完成 开始删除图片
      var length = keepAccount.data.photos.length;
      showMessage("总长度 " + keepAccount.data.photos.length);

      var count = 0;
      //keepAccount.tempDeleteIndex =0;
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          /*插数据库*/
          count = i;
          showMessage("删除 " + i + " name " + keepAccount.data.photos[i].photo_name);
          fileSystem.root.getFile(myFolderApp + '/' + keepAccount.data.photos[i].photo_name, null, onGetFileSuccess, onGetFileError);

        }
      } else {
        deferred.resolve(lineID);
      }
      //showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
      //fileSystem.root.getFile(myFolderApp+'/'+data.photo[this.tempDeleteIndex].photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
      showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
      console.log("File Name: " + fileEntry.name);
      //showMessage("File Name: " + fileEntry.name);

      // remove the file
      fileEntry.remove(onRemoveSuccess, onRemoveFail);

    }

    function onGetFileError(error) {
      showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
      console.log("Removal succeeded");
      showMessage("Removal succeeded");
      //showMessage(keepAccount.tempPhotoIndex);
      showMessage(angular.toJson(keepAccount.data.photos));

      keepAccount.data.photos.splice(keepAccount.tempPhotoIndex, 1);
      //showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));

      //$ionicLoading.hide();


      var promise = queryAccountList();
      promise.then(function (list) {  // 调用承诺API获取数据 .resolve
        $scope.accountList = groupJSON(list);
        showMessage($scope, accountList);
        $ionicLoading.hide();

      }, function (response) {  // 处理错误 .reject
        showMessage("查询数据库错误");
      });


    }

    function onRemoveFail(error) {
      showMessage('Error removing file: ' + error.code);
    }

  });
