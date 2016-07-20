/**
 * Created by xuchengcheng on 2016/7/11.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.houses-sublease', {
          url: '/houses-sublease',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/houses-sublease/houses-sublease.html',
              controller: 'HousesSubleaseCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('HousesSubleaseCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$timeout',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicScrollDelegate,
              $timeout) {
      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };

      $scope.housesSubInfo = [//测试模拟数据
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathroom": "两卫",
          "trafficInfo": "三室-延长路-1号线",
          "rent": "8500元/月",
          "expireData": "2016-07-31",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "houseImg": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png",
          "houseStatus": ""
        },
        {
          "houseTitle": "沁春园三村一室一厅",
          "houseTypeRoom": "一室",
          "houseTypeHall": "一厅",
          "houseTypeBathroom": "",
          "trafficInfo": "一室-莘庄-1号线",
          "rent": "2000元/月",
          "expireData": "10月到期",
          "city": "",
          "area": "闵行区",
          "houseId": "",
          "houseImg": "build/img/application/houses-sublease/IMG_2202@3x.png",
          "houseStatus": ""
        },
        {
          "houseTitle": "共富新村两室一厅",
          "houseTypeRoom": "两室",
          "houseTypeHall": "一厅",
          "houseTypeBathroom": "",
          "trafficInfo": "二室-共富新村-1号线",
          "rent": "3500元/月",
          "expireData": "8月到期",
          "city": "",
          "area": "宝山区",
          "houseId": "",
          "houseImg": "build/img/application/houses-sublease/default@3x.png",
          "houseStatus": ""
        },
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathroom": "两卫",
          "trafficInfo": "三室-延长路-1号线",
          "rent": "8500元/月",
          "expireData": "2016-07-31",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "houseImg": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png",
          "houseStatus": ""
        },
        {
          "houseTitle": "沁春园三村一室一厅",
          "houseTypeRoom": "一室",
          "houseTypeHall": "一厅",
          "houseTypeBathroom": "",
          "trafficInfo": "一室-莘庄-1号线",
          "rent": "2000元/月",
          "expireData": "10月到期",
          "city": "",
          "area": "闵行区",
          "houseId": "",
          "houseImg": "build/img/application/houses-sublease/IMG_2202@3x.png",
          "houseStatus": ""
        },
        {
          "houseTitle": "共富新村两室一厅",
          "houseTypeRoom": "两室",
          "houseTypeHall": "一厅",
          "houseTypeBathroom": "",
          "trafficInfo": "二室-共富新村-1号线",
          "rent": "3500元/月",
          "expireData": "8月到期",
          "city": "",
          "area": "宝山区",
          "houseId": "",
          "houseImg": "build/img/application/houses-sublease/default@3x.png",
          "houseStatus": ""
        }
      ];

      var nowPage = 0;
      $scope.moreDataCanBeLoaded = true;
      $scope.housesSubInfos = [];
      //serchHousesSubleaseInfo();//自动获取房屋转租信息
      function serchHousesSubleaseInfo() {
        $scope.housesSubInfo = [];
        var url = baseConfig.queryPath + "/house/list";
        //var url = 'http://10.211.103.145:9090/hrmsv2/v2/api/house/list';
        var param = {
          "page": nowPage,
          "pageSize": "10"
        };
        //hmsPopup.showLoading('请稍候');
        hmsHttp.post(url, param).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          $scope.housesSubInfo = result.returnData;
          angular.forEach($scope.housesSubInfo, function(data, index, array){
            $scope.housesSubInfos.push(array[index]);
          });
          //console.log("11111111:" + angular.toJson($scope.housesSubInfos));
          if($scope.housesSubInfo.length == 0){
            $scope.moreDataCanBeLoaded=false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }).error(function (error, status) {
          //hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      };

      $scope.loadMore = function() {//下拉加载
        nowPage++;
        serchHousesSubleaseInfo();
      };
      //$scope.$on('$stateChangeSuccess', function() {
      //  $scope.loadMore();
      //});

      $scope.goHourseSubDetail = function (housesId) {//房屋详情页面
        $state.go("tab.houses-sublease-detail", {'housesSubId': housesId});
      };
      $scope.goReleaseRecord = function () {//发布记录页面
        $state.go("tab.release-record");
      };
      $scope.goHousesRelease = function () {//房屋信息发布页面
        $state.go("tab.houses-release", {'flag': "ADD"});
      };

      $rootScope.$on("RELEASE_SUCCESS",function(){//空房间申请成功时，返回查询界面自动刷新历史申请数据
        nowPage = 1;
        $scope.moreDataCanBeLoaded = true;
        $scope.housesSubInfos = [];
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('subleaseScroll').scrollTop(false);
        },200);
        serchHousesSubleaseInfo();//自动刷新数据
        $scope.loadMore = function() {//下拉加载
          nowPage++;
          serchHousesSubleaseInfo();
        };
      });
    }]);
