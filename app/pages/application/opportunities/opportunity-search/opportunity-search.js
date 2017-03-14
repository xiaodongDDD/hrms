/**
 * Created by zaranengap on 2016/12/5.
 */
'use strict';
angular.module('opportunityModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.opportunities-search', {
          url: '/opportunities-search',
          /*   cache:false,*/
          params: {
            data: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/opportunities/opportunity-search/opportunity-search.html',
              controller: 'opportunitySearchCtrl'
            }
          }
        })
    }]);
angular.module('competitorModule')
  .controller('opportunitySearchCtrl',
    ['$scope', '$state', '$ionicHistory', 'historyOpportunity', 'hmsPopup', '$timeout', 'OpportunitySearchService', '$rootScope','$stateParams',
      function ($scope, $state, $ionicHistory, historyOpportunity, hmsPopup, $timeout, OpportunitySearchService, $rootScope,$stateParams) {
        $scope.showContent = true;
        var item = $('#opportunityInputSearch');

        $scope.type = $stateParams.data;

        $scope.moreDataCanBeLoaded = false;

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
        $scope.page = 1;
        $scope.pageSize = 20;
        $scope.searchParam = {
          keyWord: "",
          page: $scope.page,
          pageSize: $scope.pageSize,
          opportunityType: $scope.type
        };

        var searchMoreSuccess = function (result) {
          console.log(":" + $scope.moreDataCanBeLoaded);
          $scope.showLoading = false;
          if (result.returnCode == 'S') {
            $scope.showContent = true;
            $scope.searchData[0].data = $scope.searchData[0].data.concat(result.opportunity_list);
            $scope.moreDataCanBeLoaded = result.opportunity_list.length == $scope.pageSize;
          } else {
            $scope.moreDataCanBeLoaded = false;
            $scope.showContent = true;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        var searchSuccessInit = function (result) {
          $scope.showLoading = false;
          console.log("success");
          $scope.searchData = [
            {
              typeName: "商机",
              type: "HCRM_OPPORTUNITY",
              data: []
            }
          ];
          console.log("==========");
          if (result.returnCode == 'S') {
            $scope.showContent = true;
            for (var i = 0; i < result.opportunity_list.length; i++) {
              var tem = result.opportunity_list[i];
              $scope.searchData[0].data.push(tem);
            }
            $timeout(function(){
              $scope.moreDataCanBeLoaded = result.opportunity_list.length == $scope.pageSize;
            }, 500)
          } else {
            $scope.moreDataCanBeLoaded = false;
            $scope.showContent = true;
          }
        };

        $scope.goDetail = function (item) {
          console.log(item);
          $scope.history.fullname = item.opportunityName;
          $scope.history.typeName = item.opportunityTypeName;
          $scope.history.customerName=item.customerName;
          $scope.history.type = item.opportunityType;
          $scope.history.value = item.opportunityId;
          console.log(!inArrayVaule($scope.historys, $scope.history.value));
          if (!inArrayVaule($scope.historys, $scope.history.value)) {//判断是否已经存储
            historyOpportunity.addHistory($scope.history);
          }
          console.log(item);
          if(item.opportunityType == "HCRM_CLUE" || item.type == "HCRM_CLUE") {
            if (item.value)
              $state.go('tab.clue-detail', {data: item.value});//线索详情
            else
              $state.go('tab.clue-detail', {data: item.opportunityId});//线索详情
          }
          else{
            if (item.value) {
              item.opportunityId = item.value;
              $state.go('tab.opportunity-detail', {data: item});//商机详情
            }
            else
              $state.go('tab.opportunity-detail', {data: item});//商机详情
          }

        };

        $scope.searchWholeData = function () {
          $scope.showContent = false;
          $scope.moreDataCanBeLoaded = false;
          $scope.searchData = [];
          $scope.searchParam.page = 1;
          OpportunitySearchService.getSearchData(searchSuccessInit, $scope.searchParam)
        };

        $scope.loadMore = function(){
          $scope.searchParam.page++;
          OpportunitySearchService.getSearchData(searchMoreSuccess, $scope.searchParam);
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
          historyOpportunity.removeHistory(item);
          $scope.historys.splice(index, 1);
        };

        //初始化历史记录
        $scope.init = function () {
          historyOpportunity.getAllHistory(function (data) {
            console.log(data);    //还没保存数据目前打印的是空数组
            $scope.historys = [];
            for (var i = 0; i < data.length; i++) {
              if (data[i].type == "HCRM_OPPORTUNITY" || data[i].type == "HCRM_CLUE") {
                $scope.historys.push(data[i]);
              }
            }

            $scope.$apply();
            /* $scope.birthdays = data;*/
          })
        };

        $scope.init();
        $rootScope.$on("REFRESH_CUSTOMER_HISTORY", function () {
          $scope.init();
        });

        $scope.hideSearch = function () {
          $ionicHistory.goBack();
        };
        //清除历史记录
        $scope.deleteHistory = function () {
          console.log($scope.historys);
          for (var i = 0; i < $scope.historys.length; i++) {
            historyOpportunity.removeHistory($scope.historys[i]);
            console.log($scope.historys[i])
          }
          console.log($scope.historys);
          $scope.historys = [];
        };
      }])
  .service('OpportunitySearchService', ['hmsHttp',
    'hmsPopup',
    'baseConfig', function (hmsHttp, hmsPopup, baseConfig) {
      console.log(baseConfig.basePath);
      var baseUrl = baseConfig.basePath;
      console.log(baseUrl);
      this.getSearchData = function (success, key) {
        hmsHttp.post(baseUrl + 'search_opportunity', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      }
    }]);
