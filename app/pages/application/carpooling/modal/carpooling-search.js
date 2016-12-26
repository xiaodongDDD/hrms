'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpoolingSearch', {
          url: '/carpooling/modal',
          views: {
            'tab-application': {
              prefetchTemplate: false,
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
        var url = baseConfig.queryPath + "/share/searchinfo";
        var params = {"key":"", "page": 1, "pageSize": 5};



      //搜索事件
      $scope.searchCarpooling=function(){
        $scope.contactLoading = true;
        $scope.resultList = [];
        $scope.getCarpoolingSearch("init");
      }



      //获取搜索关键字的数据
      $scope.getCarpoolingSearch  = function (moreFlag) {
        if (moreFlag == 'init') {
          params.page = 1;
        }
        params.key = $scope.key;
        hmsHttp.post(url, params).success(function (response) {
          $scope.contactLoading = false;
          if (response.total == 0) {//总数为0
            $scope.showInfinite = false;
            if (moreFlag == 'loadMore') {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.resultList = [];
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            if (response.total < 5) {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if (moreFlag === 'init' || $scope.page === 1) {
                $scope.resultList = [];
                angular.forEach(response.returnData, function (data, index) {
                  $scope.resultList.push(data);
                });
              }
              $scope.showInfinite = false;
            } else {
              $scope.showInfinite = true;
              angular.forEach(response.returnData, function (data, index) {
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

      //初始化input框-自动聚焦
      $scope.$on('$ionicView.enter', function () {
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        var item = document.getElementById("carpoolingInputSearch");
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

      //跳转到拼车界面
      $scope.viewListDetail = function (num) {//跳转到拼车详情界面
        var info=$scope.resultList[num];
        var hasJoinedSeats = parseInt(info.carType)- info.availableSeats//已经参与拼车人数
        var param={
          companies:info.companies,//同行
          startAddr:info.startAddr,//起点
          targetAddr:info.targetAddr,//终点
          departureTime:info.departureTime,//出发时间
          departurePreference:info.departurePreference,//出行偏好
          lockSeats:info.lockSeats,//成行人数
          carType:info.carType,//车类型
          feeType:info.feeType,//费用计划
          hasJoinedSeats:hasJoinedSeats,//已经成行人数
          availableSeats:info.availableSeats,//空位
          shareId:info.id,//拼车主键
          startLat:info.startLatitude,//起点经纬度
          endLat:info.endLatitude,//终点经纬度
          empNo:info.empNo//拼车发起人
        };
        $state.go("tab.carpooling-list-detail",{
          'carpoolingListDetailInfo':param
        });
      };


      $scope.loadMore = function() {//上拉加载
        params.page++;
        $scope.getCarpoolingSearch("loadMore");
      };
      //goBack
      $scope.goListPg = function(){
        $ionicHistory.goBack();
      }
  }]);
