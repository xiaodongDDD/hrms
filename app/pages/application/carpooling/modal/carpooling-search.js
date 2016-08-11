'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpoolingSearch', {
          url: '/carpooling/modal',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/modal/carpooling-search.html',
              controller: 'carpoolingSearchCtl'
            }
          }
        });
    }]);

angular.module('applicationModule')
  .controller('carpoolingSearchCtl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsPopup',
    '$state',
    '$timeout',
    'hmsHttp',
    '$ionicHistory',
    '$rootScope',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsPopup,
              $state,
              $timeout,
              hmsHttp,
              $ionicHistory,
              $rootScope) {


        $scope.showInfinite = false; //默认隐藏无限滚动的标签
        $scope.contactLoading = false; //默认不显示loading加载
        $scope.contactKey = {getValue: ''}; //绑定输入的关键字
        $scope.newPage = 0;
        var searchUrl = baseConfig.queryPath + '/staff/query';
        var searchParams = {"key": "", "page": 1, "pageSize": "30"};


      $scope.$on('$ionicView.enter', function () { //初始化input框-自动聚焦
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        var item = document.getElementById("employeeInputSearch");
        if(ionic.Platform.isAndroid()) {
          $timeout(function () {
            item.focus();
            $scope.$apply();
          },400);
        } else {
          item.focus();
          $scope.$apply();
        }
      });



      $scope.getEmployeeData = function (moreFlag) { //获取搜索关键字的数据
        if (moreFlag === 'init') {
          employeeParams.page = 1;
        }
        hmsHttp.post(getEmployeeUrl, employeeParams).success(function (response) {
          $scope.contactLoading = false;
          if (response.total == 0) {
            $scope.showInfinite = false;
            if (moreFlag === 'loadMore') {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.resultList = [];
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            if (response.total < 30) {
              //hmsPopup.showShortCenterToast('加载完毕!');
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if (moreFlag === 'init' || $scope.page === 1) {
                $scope.resultList = [];
                angular.forEach(response.rows, function (data, index) {
                  $scope.resultList.push(data);
                });
              }
              $scope.showInfinite = false;
            } else {
              $scope.showInfinite = true;
              angular.forEach(response.rows, function (data, index) {
                $scope.resultList.push(data);
              });
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        }).error(function (error) {
          $scope.contactLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };



      //goBack
      $scope.goListPg = function(){
        $ionicHistory.goBack();
      }
  }]);
