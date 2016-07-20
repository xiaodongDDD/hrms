/**
 * Created by xuchengcheng on 2016/7/11.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.release-record', {
          url: '/release-record',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/houses-sublease/release-record.html',
              controller: 'releaseRecordCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('releaseRecordCtrl', [
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

      $scope.releaseRecordInfo = [
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseSubject": "",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathRoom": "两卫",
          "square": "",
          "trafficInfo": "",
          "rent": "8500元/月",
          "expireDate": "11月到期",
          "publishDate": "2016-07-06",
          "publishEmp": "",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "imgs": [
            {"img_url": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png"}
          ]
        },
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseSubject": "",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathRoom": "两卫",
          "square": "",
          "trafficInfo": "",
          "rent": "8500元/月",
          "expireDate": "11月到期",
          "publishDate": "2016-07-06",
          "publishEmp": "",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "imgs": [
            {"img_url": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png"}
          ]
        },
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseSubject": "",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathRoom": "两卫",
          "square": "",
          "trafficInfo": "",
          "rent": "8500元/月",
          "expireDate": "11月到期",
          "publishDate": "2016-07-06",
          "publishEmp": "",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "imgs": [
            {"img_url": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png"}
          ]
        },
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseSubject": "",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathRoom": "两卫",
          "square": "",
          "trafficInfo": "",
          "rent": "8500元/月",
          "expireDate": "11月到期",
          "publishDate": "2016-07-06",
          "publishEmp": "",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "imgs": [
            {"img_url": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png"}
          ]
        },
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseSubject": "",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathRoom": "两卫",
          "square": "",
          "trafficInfo": "",
          "rent": "8500元/月",
          "expireDate": "11月到期",
          "publishDate": "2016-07-06",
          "publishEmp": "",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "imgs": [
            {"img_url": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png"}
          ]
        },
        {
          "houseTitle": "悠和家园三室一厅一厨两卫",
          "houseSubject": "",
          "houseTypeRoom": "三室",
          "houseTypeHall": "一厅",
          "houseTypeBathRoom": "两卫",
          "square": "",
          "trafficInfo": "",
          "rent": "8500元/月",
          "expireDate": "11月到期",
          "publishDate": "2016-07-06",
          "publishEmp": "",
          "city": "",
          "area": "闸北区",
          "houseId": "",
          "imgs": [
            {"fileUrl": "build/img/application/houses-sublease/IMG_2201 Copy@3x.png"}
          ]
        }
      ];

      var nowRecordPage = 0;
      $scope.moreDataCanBeLoaded = true;
      $scope.releaseRecordInfos = [];

      //serchHousesRecordInfo();//自动获取房屋发布信息
      function serchHousesRecordInfo() {
        $scope.releaseRecordInfo = [];
        var url = baseConfig.queryPath + "/house/myHouse";
        //var url = 'http://10.211.103.145:9090/hrmsv2/v2/api/house/myHouse';
        var param = {
          "empNo": window.localStorage.empno,
          "page": nowRecordPage,
          "pageSize": "5"
        };
        //hmsPopup.showLoading('请稍候');
        hmsHttp.post(url, param).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          $scope.releaseRecordInfo = result.returnData;
          angular.forEach($scope.releaseRecordInfo, function(data, index, array){
            $scope.releaseRecordInfos.push(array[index]);
          });
          //console.log("11111111:" + angular.toJson($scope.releaseRecordInfos));
          if($scope.releaseRecordInfo.length == 0){
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

      $scope.loadMore = function () {//下拉加载
        nowRecordPage++;
        serchHousesRecordInfo();
        //$scope.$broadcast('scroll.infiniteScrollComplete');
      };
      //$scope.$on('$stateChangeSuccess', function () {
      //  $scope.loadMore();
      //});
      $scope.housesEdit = function (param) {
        $state.go("tab.houses-release", {'housesReleaseInfo': param, 'flag': "EDIT"});
      };

      $rootScope.$on("RELEASEEDIT_SUCCESS", function(event){//空房间申请成功时，返回查询界面自动刷新历史申请数据
        //console.log("1111111111111111");
        nowRecordPage = 1;
        $scope.moreDataCanBeLoaded = true;
        $scope.releaseRecordInfos = [];
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('recordScroll').scrollTop(false);
        },200);
        serchHousesRecordInfo();//自动刷新数据
        $scope.loadMore = function () {//下拉加载
          nowRecordPage++;
          serchHousesRecordInfo();
        };
      });
    }]);
