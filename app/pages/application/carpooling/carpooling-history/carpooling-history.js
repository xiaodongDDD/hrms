'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-history', {
          url: '/carpooling-history',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-history/carpooling-history.html',
              controller: 'CarpoolingHistoryCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('CarpoolingHistoryCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$timeout',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $timeout) {
      $scope.items=[];//历史列表中的数据
      $scope.fetchServerFlag= true;
      $scope.noData = true;//默认是有数据的，无数据时显示无数据提示
      //高德地图路径
      $scope.map = "";
      var  mapUrl = {
        baseUrl: "http://restapi.amap.com/v3/staticmap?scale=2&zoom=10&size=300*100",
        baseStyle:"&markers=-1,http://www.daxuequan.org/hrms-img/start@3x.png,0:",
        baseStyle1:"|-1,http://www.daxuequan.org/hrms-img/end@3x.png,0:",
        markey:"&key=ae514ce54a0fb9c009334423b9ab3f9a",
      }

      searchHistoryApplyListAutomatically();
      function searchHistoryApplyListAutomatically() {
        $scope.items=[];
        var url = baseConfig.queryPath + "/share/infobyEmpNo";
        var param = {
            "page": 1,
            "pageSize":5
        };
        hmsHttp.post(url, param).success(function (result) {
          $scope.items = result.returnData
          if ($scope.items.length == 0) {
            $scope.noData=false;
          } else if ($scope.items.length > 0) {
            angular.forEach($scope.items, function (data, index, array) {
              if (array[index].shareStatus == 'wait') {
                array[index].statusColor = false;
                array[index].status = "等待成行";
              } else  {
                array[index].statusColor=true;
                array[index].status = "已成行";
              }
              if(array[index].startLatitude && array[index].endLatitude){
                array[index].listMapUrl =mapUrl.baseUrl+mapUrl.baseStyle+array[index].startLatitude +mapUrl.baseStyle1+array[index].endLatitude+mapUrl.markey;
              }
            });
          }
        }).error(function (error, status) {
          //hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
        }).finally(function(){
          $timeout(function () {
            $scope.fetchServerFlag= false;
          },2000)

        });
      }

      $scope.viewHistoryDetail = function (num) {//跳转到申请详情界面
        var info=$scope.items[num];
        var listMapUrl =mapUrl.baseUrl+mapUrl.baseStyle+info.startLatitude +mapUrl.baseStyle1+info.endLatitude+mapUrl.markey;
        var hasJoinedSeats = parseInt(info.carType )- info.availableSeats//已经参与拼车人数

        var param={
          startAddr:info.startAddr,//起点
          targetAddr:info.targetAddr,//终点
          departureTime:info.departureTime,//出发时间
          departurePreference:info.departurePreference,//出行偏好
          hasJoinedSeats:hasJoinedSeats,//成行人数
          carType:info.carType,//车类型
          feeType:info.feeType,//费用计划
          startLatitude:info.startLatitude,//起点经纬度
          endLatitude:info.endLatitude,//终点经纬度
          map:listMapUrl,                 //地图地址
          companies:info.companies,     //同行人数
          lockSeats:info.lockSeats,//锁定座位数量
          availableSeats:info.availableSeats,//空位数量
        };
          $state.go("tab.carpooling-history-detail",{
            'carpoolingHistoryDetailInfo':param
          });
      };
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
    }]
);

