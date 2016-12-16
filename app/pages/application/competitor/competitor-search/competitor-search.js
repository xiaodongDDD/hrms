'use strict';
angular.module('competitorModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.competitor-search', {
          url: '/competitor-search',
          /*   cache:false,*/
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/competitor/competitor-search/competitor-search.html',
              controller: 'competitorSearchCtrl'
            }
          }
        })
    }]);
angular.module('competitorModule')
  .controller('competitorSearchCtrl',
    ['$scope', '$state', '$ionicHistory', 'history', 'hmsPopup', '$timeout', 'CompetitorSearchService', '$rootScope',
      function ($scope, $state, $ionicHistory, history, hmsPopup, $timeout, CompetitorSearchService, $rootScope) {
        $scope.showContent = true;
        var item = $('#competitorInputSearch');

        $scope.$on('$ionicView.afterEnter', function () { //初始化input框-自动聚焦
          if (ionic.Platform.isWebView()) {
            cordova.plugins.Keyboard.show();
            $timeout(function () {
              item.focus();
              $scope.$apply();
            }, 0);
          }
        });

        $scope.historys = [];
        //显示更多
        $scope.showMore = function (item) {
          console.log(item);
          item.flag = !item.flag;
          var heightItem = $("#repeat-item").height();
          console.log(heightItem);
        };
        $scope.searchData = [];
        $scope.searchParam = {
          keyWord: ""
        };
        var searchSuccessInit = function (result) {

          $scope.showLoading = false;
          $scope.searchData = [
            {
              typeName: "竞争对手",
              type: "HCRM_COMPETITOR",
              data: []
            }
          ];
          console.log("==========");
          if (result.returnCode == 'S') {
            $scope.showContent = true;
            /* $scope.searchData = result.search_result;*/
            for (var i = 0; i < result.search_result.length; i++) {
              if (result.search_result[i].type == "HCRM_COMPETITOR") {
                var tem = result.search_result[i];
                $scope.searchData[0].data.push(tem);
                /*  $scope.$apply();*/
              }
            }
            console.log($scope.searchData);
          } else {
            $scope.showContent = true;
          }
        };
        $scope.goDetail = function (item) {
          console.log(item);
          $scope.history.fullname = item.fullName;
          $scope.history.typeName = item.typeName;
          $scope.history.type = item.type;
          $scope.history.value = item.value;
          $scope.history.competitorId=item.competitorId;
          console.log($scope.history);
          console.log("临时存放");
          //存放历史记录
          console.log( $scope.history.value);
          console.log(!inArrayVaule($scope.historys, $scope.history.value));
          if (!inArrayVaule($scope.historys, $scope.history.value)) {//判断是否已经存储
            history.addHistory($scope.history);
          }
          console.log(item);
          if (item.type == "HCRM_OPPORTUNITY") {
            item.opportunityId = item.value;
            $state.go('tab.opportunity-detail', {data: item});//商机详情
          } else if (item.type == "HCRM_CLUE") {
            $state.go('');
          } else if (item.type == "HCRM_PRODUCT") {
            $state.go('');
          } else if (item.type == "HCRM_CUSTOMER") {
            window.localStorage.customerId = item.value;
            $state.go('tab.customer-detail');
          } else if (item.type == "HCRM_COMPETITOR") {
            item.competitorId = item.value;
            $state.go('tab.competitor-detail', {param: item});
          }
        };
        $scope.searchWholeData = function () {
          $scope.showContent = false;
          CompetitorSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
        };
        $scope.clearInputContent = function () {
          $scope.searchParam.keyWord = "";
          if (ionic.Platform.isWebView()) {
            cordova.plugins.Keyboard.show();
          }
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 400);
        };
        $scope.history = {};//临时存放历史记录
        //删除单条记录
        $scope.deleteItem = function (item, index) {
          console.log(item);
          history.removeHistory(item);
          $scope.historys.splice(index, 1);
        };
        //初始化历史记录
        $scope.init = function () {
          history.getAllHistory(function (data) {
            console.log(data);    //还没保存数据目前打印的是空数组
            for (var i = 0; i < data.length; i++) {
              if (data[i].type == "HCRM_COMPETITOR") {
                $scope.historys.push(data[i]);
              }
            }

            $scope.$apply();
            /* $scope.birthdays = data;*/
          })
        };
        $scope.init();
        $rootScope.$on("REFRESH_CUSTOMER_HISTORY", function () {
          $scope.historys=[];
          $scope.init();
        });
        //选择客户
        $scope.selectCustomer = function (item) {
          console.log(item);
          $scope.history.fullname = item.fullname;
          $scope.history.historyItem = item.historyItem;
          $scope.history.img = item.img;
          console.log($scope.history);
          console.log("临时存放");
          //存放历史记录
          history.addHistory($scope.history);
        };
        $scope.hideSearch = function () {
          $ionicHistory.goBack();
        };
        //清除历史记录
        $scope.deleteHistory = function () {
          console.log($scope.historys);
          for (var i = 0; i < $scope.historys.length; i++) {
            history.removeHistory($scope.historys[i]);
            console.log($scope.historys[i])
          }
          console.log($scope.historys);
          $scope.historys = [];
        };
      }])
  .service('CompetitorSearchService', ['hmsHttp',
    'hmsPopup',
    'baseConfig', function (hmsHttp, hmsPopup, baseConfig) {
      console.log(baseConfig.crmPath);
      var baseUrl = baseConfig.crmPath;
      console.log(baseUrl);
      this.getSearchData = function (success, key) {
        hmsHttp.post(baseUrl + 'search_competitor', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup(response.error_description);
        });
      }
    }]);
