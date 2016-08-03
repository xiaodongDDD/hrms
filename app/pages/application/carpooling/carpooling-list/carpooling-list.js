'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-list', {
          url: '/carpooling-list',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-list/carpooling-list.html',
              controller: 'CarpoolingListCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('CarpoolingListCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicPopover',
    '$timeout',
    '$ionicScrollDelegate',
    'hmsHttp',
    "hmsPopup",
    "$ionicModal",
    function (
              $rootScope,
              $scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicPopover,
              $timeout,
              $ionicScrollDelegate,
              hmsHttp,
              hmsPopup,
              $ionicModal
    ) {
      $scope.showSearchTop = false;//顶部搜索框
      $scope.fetchServerFlag = true;//加载logo
      $scope.fetching = false;//正在加载数据
      var curPage = 0;
      $scope.moreDataCanBeLoaded = true;
      $scope.items= [];
      $scope.map = "";


      function searchCarpoolingList() {
        $scope.item = [];
        var url = baseConfig.queryPath + "/share/filtrateinfo";
        var param = {
          "page": curPage,
          "pageSize": "5"
        };
        hmsHttp.post(url, param).success(function (result) {
          $scope.item = result.returnData;
          if( $scope.item.length > 0){
            $scope.noData=false;
            angular.forEach($scope.item, function(data, index, array){
              $scope.items.push(array[index]);
              if (array[index].shareStatus == 'wait') {
                array[index].perferenceColor = false;
                array[index].status = "等待成行";
              } else  {
                array[index].statusColor=true;
                array[index].status = "已成行";
              }

            });
          }else{
            $scope.noData=true;
          }

          if($scope.item.length == 0){
            $scope.moreDataCanBeLoaded=false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
          .error(function (error, status) {
          hmsPopup.showShortCenterToast("网络连接出错");
           })
          .finally(function(){
              $scope.fetchServerFlag = false;
              $scope.fetching = false;
          });
      };



      $scope.loadMore = function() {//上拉加载
        curPage++;
        searchCarpoolingList();
      };
      $scope.doRefresh = function(){
        $scope.items = [];
        curPage = 1;
        searchCarpoolingList();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.moreDataCanBeLoaded = true;
      }
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      $rootScope.$on("RELEASE_SUCCESS", function () {
        $scope.items = [];
        curPage = 1;
        searchCarpoolingList();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.moreDataCanBeLoaded = true;
      });

      //跳转到拼车界面
      $scope.viewListDetail = function (num) {//跳转到拼车详情界面
        var info=$scope.items[num];
        var hasJoinedSeats = parseInt(info.carType)- info.availableSeats//已经参与拼车人数
        var param={
          companies:info.companies,
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
          endLat:info.endLatitude//终点经纬度
        };
        $state.go("tab.carpooling-list-detail",{
          'carpoolingListDetailInfo':param
        });
      };




      //上滑
      $scope.watchTopScroll = function () {
        var  position = $ionicScrollDelegate.$getByHandle('watchTopScroll').getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 45) {
            $scope.showSearchTop = false;
          } else if (position >= 45) {
            $scope.showSearchTop = true;
          }
        });
      };
      /**
       * modal-input
       */
      //function modalInput(){
      //  $ionicModal.fromTemplateUrl('build/pages/application/carpooling/modal/carpooling-modal-search.html', {
      //    scope: $scope,
      //    animation: 'fadeInUp'
      //  }).then(function (modal) {
      //    $scope.contactInputModal = modal;
      //  });
      //}
      //modalInput();
      //$scope.goModalInput = function () {
      //  $scope.contactInputModal.show();
      //};

      //弹出筛选框
      $ionicPopover.fromTemplateUrl("build/pages/application/carpooling/popover/carpooling-filter-popover.html", {
        scope: $scope
      }).then(function(popover){
          $scope.popover = popover;
        })
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      $scope.$on("$destroy", function() {
        $scope.popover.remove();
      });
      $scope.$on("popover.hidden", function() {
      });
      $scope.$on("popover.removed", function() {
      });

      /**
       * modal input 方法区
       */
      function inputModal() {
        $ionicModal.fromTemplateUrl('build/pages/carpooling/modal/carpooling-modal-search.html', {
          scope: $scope,
          animation: 'fadeInUp'
        }).then(function (modal) {
          $scope.carpoolingInputModal = modal;
        });
      }

      inputModal();
      $scope.goInputModal = function () {
        $scope.$broadcast('carpooling-search');
        $scope.carpoolingInputModal.show();
      };
    }]);


