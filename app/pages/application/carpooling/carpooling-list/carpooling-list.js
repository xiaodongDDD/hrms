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
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicPopover',
    '$timeout',
    '$ionicScrollDelegate',
    'hmsHttp',
    "hmsPopup",
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicPopover,
              $timeout,
              $ionicScrollDelegate,
              hmsHttp,
              hmsPopup
    ) {
      //顶部搜索栏
      $scope.showSearchTop = false;
      $scope.fetchServerFlag = true;

      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      $scope.watchTopScroll = function () {
        position = $ionicScrollDelegate.$getByHandle('watchTopScroll').getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 45) {
            $scope.showSearchTop = false;
          } else if (position >= 45) {
            $scope.showSearchTop = true;
          }
        });
      };
      searchCarpoolingList();
      function searchCarpoolingList() {
        $scope.items=[];
        var url = baseConfig.queryPath + "/share/filtrateinfo";
        var param = {
          "page": 1,
          "pageSize":5
        };
        //hmsPopup.showLoading('请稍候');

        hmsHttp.post(url, param).success(function (result) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }

          $scope.items = result.returnData;

           //"id":"49dc96af-5e14-4463-84ef-465b9667cb60",
           // "empNo":"4040",
           // "shareNo":"SI2016071416164083",
           // "city":"上海",
           // "startAddr":"青浦园区",
           // "targetAddr":"上海虹桥",
           // "carType":"7",
           // "departureTime":"2016-07-15 08:22:22",
           // "departurePreference":"准时出发",
           // "feeType":"AA",
           // "availableSeats":6,
           // "lockSeats":1,
           // "otherDesc":null,
           // "startLatitude":null,
           // "startLongitude":null,
           // "endLatitude":null,
           // "endlongitude":null,
           // "shareStatus":"wait"

          if ($scope.items.length == 0) {
            $scope.noData=false;
          } else if ($scope.items.length > 0) {
            angular.forEach($scope.items, function (data, index, array) {
              if (array[index].shareStatus == 'wait') {
                array[index].perferenceColor = false;
                array[index].status = "等待成行";
              } else  {
                array[index].statusColor=true;
                array[index].status = "已成行";
              }
              console.log($scope.statusColor);
            });
          }
        }).error(function (error, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      }
      $scope.fetchServerFlag = false;

      $scope.viewListDetail = function (num) {//跳转到拼车详情界面
        var info=$scope.items[num];
        var param={
          startAddr:info.startAddr,//起点
          targetAddr:info.targetAddr,//终点
          departureTime:info.departureTime,//出发时间
          departurePreference:info.departurePreference,//出行偏好
          lockSeats:info.lockSeats,//成行人数
          carType:info.carType,//车类型
          room_type:info.room_type,//费用计划
        };
        $state.go("tab.carpooling-list-detail",{
          'carpoolingListDetailInfo':param
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

    }]
);


