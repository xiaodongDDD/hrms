/**
 * Created by leiyu on 2016/12/15.
 */
'use strict';
angular.module('bidbondModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.bidbond-search', {
          url: '/bidbond-search',
          /*   cache:false,*/
          params: {
            data: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/bidbond/bidbond-search/bidbond-search.html',
              controller: 'bidbondSearchCtrl'
            }
          }
        })
    }
  ]);
angular.module('bidbondModule')
  .controller('bidbondSearchCtrl', ['$scope', '$state', '$ionicHistory', 'historyBidbond', 'hmsPopup', '$timeout', 'bidbondSearchService', '$rootScope', '$stateParams',
    function ($scope, $state, $ionicHistory, historyBidbond, hmsPopup, $timeout, bidbondSearchService, $rootScope, $stateParams) {
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
      };

      var searchMoreSuccess = function (result) {
        console.log(":" + $scope.moreDataCanBeLoaded);
        $scope.showLoading = false;
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          $scope.searchData[0].data = $scope.searchData[0].data.concat(result.bidbond_list);
          $scope.moreDataCanBeLoaded = result.bidbond_list.length == $scope.pageSize;
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var searchSuccessInit = function (result) {
        $scope.showLoading = false;
        console.log("success");
        $scope.searchData = [{
          typeName: "商机",
          type: "HCRM_OPPORTUNITY",
          data: []
        }];
        console.log("==========");
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          for (var i = 0; i < result.bidbond_list.length; i++) {
            console.log(result.bidbond_list);
            var tem = result.bidbond_list[i];
            $scope.searchData[0].data.push(tem);
          }
          ;
          console.log($scope.searchData);
          $timeout(function () {
            $scope.moreDataCanBeLoaded = result.bidbond_list.length == $scope.pageSize;
          }, 500)
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
      };

      $scope.goDetail = function (item) {
        console.log(item);
        $scope.history.bondId=item.bondId;
        $scope.history.fullname = item.fullName;
        $scope.history.value = item.opportunityId;
        $scope.history.typeName = item.customerName;
        $scope.history.type = item.customerId;
        console.log(!inArrayBondIdVaule($scope.historys, $scope.history.bondId));
        if (!inArrayBondIdVaule($scope.historys, $scope.history.bondId)) { //判断是否已经存储
          historyBidbond.addHistory($scope.history);
        }
        console.log(item);
        item.opportunityId=item.value;
        console.log("===="+item.value);
        var getDetailSuccess=function(result){
          console.log(result);
          $scope.init();
          $state.go('tab.bidbond-add', {
            param: result.bidbond_detail
          }); //保证金详情
        };
        bidbondSearchService.getBidbond(getDetailSuccess,item.bondId);
  /*      item.opportunityId = item.value;*/

      };

      $scope.searchWholeData = function () {
        $scope.showContent = false;
        $scope.moreDataCanBeLoaded = false;
        $scope.searchData = [];
        $scope.searchParam.page = 1;
        bidbondSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
      };

      $scope.loadMore = function () {
        $scope.searchParam.page++;
        bidbondSearchService.getSearchData(searchMoreSuccess, $scope.searchParam);
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

      $scope.history = {}; //临时存放历史记录

      //删除单条记录
      $scope.deleteItem = function (item, index) {
        console.log(item);
        historyBidbond.removeHistory(item);
        $scope.historys.splice(index, 1);
      };

      //初始化历史记录
      $scope.init = function () {
        historyBidbond.getAllHistory(function (data) {
          console.log(data); //还没保存数据目前打印的是空数组
          $scope.historys = data;
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
    }
  ])
  .service('bidbondSearchService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp, hmsPopup, baseConfig) {
      console.log(baseConfig.basePath);
      var baseUrl = baseConfig.basePath;
      console.log(baseUrl);
      this.getSearchData = function (success, key) {
        hmsHttp.post(baseUrl + 'search_bidbond', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup(response.error_description);
        });
      }
      this.getBidbond = function (success, key) {
        var param={
          "page":1,
          "pageSize":1,
          "bondId":key
        };
        hmsHttp.post(baseUrl + 'bidbond_detail', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup(response.error_description);
        });
      }
    }
  ]);
