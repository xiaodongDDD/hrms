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
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp) {
      $scope.items=[];//历史列表中的数据
      $scope.noData = true;//默认是有数据的，无数据时显示无数据提示
      $scope.map = "";
      $scope.resultList = [];
      $scope.historyLoading  = true;
      $scope.showNoData = false;
      $scope.showLocation = false;//

      var curPage = 1;
      var  mapUrl = {
        baseUrl: "http://restapi.amap.com/v3/staticmap?scale=2&size=300*100",
        baseStyle:"&markers=-1,http://www.daxuequan.org/hrms-img/start@3x.png,0:",
        baseStyle1:"|-1,http://www.daxuequan.org/hrms-img/end@3x.png,0:",
        markey:"&key=ae514ce54a0fb9c009334423b9ab3f9a",
      }

      searchCarpoolingHistory("init");
      locCity();
      function searchCarpoolingHistory(moreFlag) {
        if (moreFlag === 'init') {
          curPage = 1;
        }
        var carpoolingSearchUrl = baseConfig.queryPath + "/share/infobyEmpNo";
        var carpoolingSearchParams = {
          "page": curPage,
          "pageSize":5
        };
        hmsHttp.post(carpoolingSearchUrl, carpoolingSearchParams).success(function (response) {
          $scope.historyLoading = false;
          if (response.total == 0) {//没有数据
            $scope.showInfinite = false;
            if (moreFlag === 'loadMore') {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {//init初始化
              $scope.showNoData = true;
              $scope.resultList = [];
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {//有数据
            if (response.total < 5) {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if (moreFlag === 'init' || $scope.page === 1) {
                $scope.resultList = [];
                angular.forEach(response.returnData, function (data, index) {
                    for(var i =0;i<data.companies.length;i++){
                      if(data.companies[i].avatar == null){//设置默认头像
                        if(data.companies[i].genderId=="1"){
                          data.companies[i].avatar="build/img/myInfo/man-portrait.png";
                        }else if(data.companies[i].genderId=="2"){
                          data.companies[i].avatar="build/img/myInfo/woman-portrait.png";
                        }
                      }
                    }

                    //标志颜色
                    if (data.shareStatus == 'wait') {
                      data.statusColor = false;
                      data.status = "等待成行";
                    } else  {
                      data.statusColor=true;
                      data.status = "已成行";
                    }

                  if(data.startLatitude && data.endLatitude){
                    data.listMapUrl =mapUrl.baseUrl+mapUrl.baseStyle+data.startLatitude +mapUrl.baseStyle1+data.endLatitude+mapUrl.markey;
                  }
                  $scope.resultList.push(data);
                });
              }
              $scope.showInfinite = false;
            } else {
              $scope.showInfinite = true;
              angular.forEach(response.returnData, function (data, index) {
                for(var i =0;i<data.companies.length;i++){
                  if(data.companies[i].avatar == null){//设置默认头像
                    if(data.companies[i].genderId=="1"){
                      data.companies[i].avatar="build/img/myInfo/man-portrait.png";
                    }else if(data.companies[i].genderId=="2"){
                      data.companies[i].avatar="build/img/myInfo/woman-portrait.png";
                    }
                  }
                }

                //标志颜色
                if (data.shareStatus == 'wait') {
                  data.statusColor = false;
                  data.status = "等待成行";
                } else  {
                  data.statusColor=true;
                  data.status = "已成行";
                }
                if(data.startLatitude && data.endLatitude){
                  data.listMapUrl =mapUrl.baseUrl+mapUrl.baseStyle+data.startLatitude +mapUrl.baseStyle1+data.endLatitude+mapUrl.markey;
                }
                $scope.resultList.push(data);
              });
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        }).error(function (error) {
          $scope.historyLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };


      $scope.viewHistoryDetail = function (num) {//跳转到申请详情界面
        var info=$scope.resultList[num];
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
          map:info.listMapUrl,                 //地图地址
          companies:info.companies,     //同行人数
          lockSeats:info.lockSeats,//锁定座位数量
          availableSeats:info.availableSeats,//空位数量
          empNo:info.empNo,//拼车发起人
        };
          $state.go("tab.carpooling-history-detail",{
            'carpoolingHistoryDetailInfo':param
          });
      };
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      $scope.loadMore = function() {//上拉加载
        curPage++;
        searchCarpoolingHistory("loadMore");
      }
      //定位城市
      function  locCity(){
        if(window.localStorage && window.localStorage.searchCity){
          $scope.showLocation = true;
          $scope.cityCode = window.localStorage.locCity;
        }
      }
    }]
);


