angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flybackQuery', {
          url: '/flyback-query',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/query/query.html',
              controller: 'FlyBackQueryCtrl'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('FlyBackQueryCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicModal',
    '$ionicScrollDelegate',
    'hmsHttp',
    'flaybackService',
    'hmsPopup',
    'hmsHttp',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory, 
      $timeout, $ionicModal, $ionicScrollDelegate, hmsHttp, 
      flaybackService, hmsPopup, HttpAppService){

        var strDate = flaybackService.getNowFormatDate();
        var dateTo = new Date(strDate.replace(/\-/g, "/"));
        var now = new Date(strDate.replace(/\-/g, "/"));
        var dateFrom = new Date(now.setMonth(now.getMonth() - 1));
        $scope.param = {
          "projectCode": "",
          "projectName": "",
          "filter": "",
          "reqDateFrom": dateFrom,//默认最近一个月
          "reqDateTo": dateTo
        };
        $scope.flybackList = [];

        // 查询按钮
        $scope.query = function () {
          if ($scope.param.reqDateFrom == "" || $scope.param.reqDateTo == "") {
            hmsPopup.showPopup("请输入查询日期范围！");
          } else {
            var dateFrom = flaybackService.getFormatDate(new Date($scope.param.reqDateFrom));
            var dateTo = flaybackService.getFormatDate(new Date($scope.param.reqDateTo));
            hmsPopup.showLoading("Loading...");
            var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_flyback_lists";
            var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno
              + '","p_project_code":"' + $scope.param.projectCode
              + '","p_apply_date_from":"' + dateFrom
              + '","p_apply_date_to":"' + dateTo
              + '"}}';
            HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
              //console.log("get_flyback_lists =" + angular.toJson(response));
              if (response.status == "S") {
                $scope.flybackList = response.flybackList;
                hmsPopup.hideLoading("");
              } else {
                console.log("查询机票申请失败：" + response.returnMsg);
                hmsPopup.hideLoading("");
              }
            }).error(function (response, status) {
              console.log("HttpAppService error ");
              hmsPopup.hideLoading("");
            });
          }
        };

        $scope.query();
        // 进入页面自动查询。
        $scope.$on("$ionicView.enter", function () {
          $scope.query();
        });

        //获取项目列表
        hmsPopup.showLoading("Loading...");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_project_list";
        var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          //console.log("get_project_list =" + angular.toJson(response));
          if (response.status == "S") {
            $scope.projectList = response.projectList;
            hmsPopup.hideLoading("");
          } else {
            console.log("获取项目列表失败：" + response.returnMsg);
            hmsPopup.hideLoading("");
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          hmsPopup.hideLoading("");
        });


        // 值列表
        $ionicModal.fromTemplateUrl('build/pages/application/flyback/query/model/select-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal
        });
        $scope.openModal = function (type) {
          if (type == "project") {
            $scope.listType = "project";
            $scope.lists = $scope.projectList;
          }
          $scope.modal.show();
        };
        $scope.chooseModal = function (item) {
          $scope.modal.hide();
          if ($scope.listType == "project") {
            $scope.param.projectName = item.name;
            $scope.param.projectCode = item.value;
            $scope.param.filter = "";
          }
        };
        $scope.closeModal = function () {
          $scope.modal.hide();
        };
        $scope.clearChoose = function (type) {
          $scope.modal.hide();
          if ($scope.listType == "project") {
            $scope.param.projectName = "";
            $scope.param.projectCode = "";
            $scope.param.filter = "";
          }
        };
        $scope.$on('$destroy', function () {
          $scope.modal.remove();
        });


        $scope.goDetail = function (data) {
          if (data.isSubmitted == "0") {
            var canEdit = true;
          } else if (data.isSubmitted == "1") {
            var canEdit = false;
          }
          var param = {"canEdit": canEdit, "dataSource": "query", "applyId": data.applyId};
          flaybackService.setPageStatusCreate(param);
          $state.go("tab.flybackApply");
        }

        // 删除fyback
        $scope.deleteFB = function (applyId, index) {
          hmsPopup.showLoading("Loading...");
          var urlValueList = baseConfig.businessPath + "/create_ticket_apply/delete_flyback_all";
          var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_apply_id":"' + applyId + '"}}';
          HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
            if (response.status == "S") {
              $scope.flybackList.splice(index, 1);
              hmsPopup.hideLoading("");
            } else {
              console.log("删除失败：" + response.returnMsg);
              hmsPopup.hideLoading("");
            }
          }).error(function (response, status) {
            console.log("HttpAppService error ");
            hmsPopup.hideLoading("");
          });
        }

    }]);