angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flybackApply', {
          url: '/flyback-apply',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/apply/apply.html',
              controller: 'FlyBackApplyCtrl'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('FlyBackApplyCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    'flaybackService',
    'hmsPopup',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory,
      $timeout, HttpAppService, $ionicModal, fbService,
      Prompter){
      $scope.viewtitle = "机票申请";
      $scope.pageParam = fbService.getPageStatusCreate();  //JSON.parse($stateParams.param);
      console.log(" $scope.pageParam =" + $scope.pageParam);
      $scope.canEdit = $scope.pageParam.canEdit;// 页面是否可编辑
      var dataSource = $scope.pageParam.dataSource;//页面数据来源

      fbService.setLines($scope.flybacklines);
      //数据
      function init() {
        if (dataSource == "create") {
          $scope.flybackHeader = {
            "applyId": "",
            "projName": "",
            "projCode": ""
          };
          fbService.clearLines();
          $scope.flybacklines = fbService.getLines();
        } else if (dataSource == "query") {
          var applyId = $scope.pageParam.applyId;
          Prompter.showLoading("请稍候");
          var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_flyback_detail";
          var paramValueList = '{"params":{"p_apply_id":"' + applyId + '"}}';
          HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
            console.log("get_flyback_detail =" + angular.toJson(response));
            if (response.status == "S") {
              $scope.flybackHeader = response["flybackHeader"];
              $scope.flybacklines = response["flybacklines"];
              fbService.setLines($scope.flybacklines);
              Prompter.hideLoading("");
            } else {
              console.log("获取机票申请信息失败：" + response.returnMsg);
              Prompter.hideLoading("");
            }
          }).error(function (response, status) {
            console.log("HttpAppService error ");
            Prompter.hideLoading("");
          });
        }
      }

      init();

      //
      $scope.$on("$ionicView.enter", function () {
        console.log("fbService.getLines()");
        $scope.flybacklines = fbService.getLines();
        console.log(angular.toJson($scope.flybacklines));
        $scope.$apply();
      });


      // 获取值列表数据
      if ($scope.canEdit) {
        Prompter.showLoading("请稍候");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_value_list";
        var paramValueList={
          "params":{
            p_employee:window.localStorage.empno
          }
        };
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          if (response.status == "S") {
            $scope.projectList = response.projectList;
            fbService.setTicketTypeList(response.ticketTypeList);// 订票类型
            fbService.setRouteTypeList(response.routeTypeList);//行程类别
            fbService.setPassenger(response.passengerList);//乘机人列表
            fbService.setPassenger(response.passenger);//默认乘机人
            fbService.setCertification(response.certification);//默认身份证
            Prompter.hideLoading("");
          } else {
            console.log("获取值列表失败：" + response.returnMsg);
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          Prompter.hideLoading("");
        });
      }

      // 项目值列表
      $ionicModal.fromTemplateUrl('build/pages/application/flyback/apply/model/project-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal
      });
      $scope.openProjectList = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function (proj) {
        $scope.modal.hide();
        //若更换项目则清空订票行
        if (proj !== undefined) {
          if ((typeof($scope.flybackHeader.projCode) !== "undefined") && ($scope.flybackHeader.projCode !== null)) {
            if ($scope.flybackHeader.projCode !== proj.value) {
              $scope.flybacklines = [];
              fbService.clearLines();
            }
          }
          $scope.flybackHeader.projName = proj.name;
          $scope.flybackHeader.projCode = proj.value;
          fbService.setProjName($scope.flybackHeader.projName);
          fbService.setProjCode($scope.flybackHeader.projCode);
        }
      };
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });


      $scope.goDetail = function (detail, index) {
        var param = {
          "canEdit": $scope.canEdit,
          "dataSource": dataSource,
          "status": "update",
          "detail": detail,
          "index": index,
          "applyId": $scope.flybackHeader.applyId
        };
        $state.go("tab.flybackDetail", {param: angular.toJson(param)});
      };

    //添加更多订票信息
      $scope.addFlightInfo = function () {
        fbService.setProjName($scope.flybackHeader.projName);
        fbService.setProjCode($scope.flybackHeader.projCode);
        var param = {"canEdit": $scope.canEdit, "status": "new"};
        $state.go("tab.flybackDetail", {param: angular.toJson(param)});
      };
    //保存 baseConfig.businessPath   baseConfig.businessPath
      $scope.save = function () {
        Prompter.showLoading("请稍候");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/save_flyback";
        var jsonData = JSON.stringify($scope.flybacklines);
        var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno
          + '","p_apply_id":"' + $scope.flybackHeader.applyId
          + '","p_project_code":"' + $scope.flybackHeader.projCode
          + '","p_fb_lines":' + jsonData + '}}';
        console.log(paramValueList);
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          console.log("save_flyback = " + angular.toJson(response));
          if (response.status == "S") {
            $scope.flybackHeader.applyId = response["applyId"];
            $scope.flybacklines = response["flybackLines"];
            fbService.setLines($scope.flybacklines);
            Prompter.hideLoading("");
            Prompter.showPopup("保存成功!");
          } else {
            console.log("保存失败：" + response["returnMsg"]);
            Prompter.hideLoading("");
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          Prompter.hideLoading("");
        });
      };
    //提交
      $scope.submit = function () {
        Prompter.showLoading("请稍候");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/flyback_submit";
        var jsonData = JSON.stringify($scope.flybacklines);
        var paramValueList = {
          'params':{
            'p_employee':window.localStorage.empno,
            'p_apply_id':$scope.flybackHeader.applyId,
            'p_project_code':$scope.flybackHeader.projCode,
            'p_fb_lines':jsonData
          }
        }
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          console.log("flyback_submit = " + angular.toJson(response));
          if (response.status == "S") {
            Prompter.hideLoading("");
            Prompter.showPopup("提交成功!");
            $scope.canEdit = false;
          } else {
            Prompter.hideLoading("");
            Prompter.showPopup("提交失败：" + response["returnMsg"]);
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          Prompter.hideLoading("");
        });
      };

      // 删除fyback
      $scope.deleteFB = function () {
        console.log(angular.toJson($scope.flybackHeader));
        if ($scope.flybackHeader.applyId == "") {
          $state.go("tab.flyback");
        } else {
          if ($scope.canEdit) {
            Prompter.showLoading("请稍候");
            var urlValueList = baseConfig.businessPath + "/create_ticket_apply/delete_flyback_all";
            var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_apply_id":"' + $scope.flybackHeader.applyId + '"}}';
            console.log(paramValueList);
            HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
              if (response.status == "S") {
                Prompter.hideLoading("");
                Prompter.showPopup("删除成功!");
                $state.go("tab.flybackQuery");
                dataSource = "create";
                init();
              } else {
                console.log("删除失败：" + response.returnMsg);
                Prompter.hideLoading("");
                Prompter.showPopup("删除失败,请重新查询后再操作!");
              }
            }).error(function (response, status) {
              console.log("HttpAppService error ");
              Prompter.hideLoading("");
            });
          } else {
            Prompter.showPopup("已提交数据无法删除!");
          }

        }
      }
    }]);
