/**
 * Created by xuchengcheng on 2016/7/11.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.houses-sublease-detail', {
          url: '/houses-sublease-detail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/houses-sublease/houses-sublease-detail.html',
              controller: 'HousesSubleaseDetailCtrl'
            }
          },
          params:{
            housesSubId: ''
          }
        })
    }]);

angular.module('applicationModule')
  .controller('HousesSubleaseDetailCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicSlideBoxDelegate',
    '$timeout',
    '$stateParams',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicSlideBoxDelegate,
              $timeout,
              $stateParams) {
      $scope.housesId = $stateParams.housesSubId;
      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };

      //$scope.housesPhoto = [
      //  {
      //    "imgUrl": 'build/img/application/houses-sublease/IMG_2201 Copy@3x.png'
      //  },
      //  {
      //    "imgUrl": 'build/img/application/houses-sublease/IMG_2202@3x.png'
      //  },
      //  {
      //    "imgUrl": 'build/img/application/houses-sublease/default@3x.png'
      //  }
      //];
      $scope.housesSubDetail = {
        "houseTitle": "悠和家园三室一厅一厨两卫",
        "houseSubject": "悠和家园，距地铁一号线延长路站10分钟的路程，周围超市、餐饮、医院、休闲设施一应俱全，靠近大宁国际，租金8500元/月，三室一厅一厨两卫，面积110平左后，小区24小时门禁，租期到11月份，可续租。",
        "houseTypeRoom": "三室",
        "houseTypeHall": "一厅",
        "houseTypeBathRoom": "两卫",
        "square": "100",
        "trafficInfo": "",
        "rent": "8500",
        "expireDate": "11月到期",
        "publishDate": "2016-07-06",
        "publishEmp": "",
        "city": "",
        "area": "闸北区",
        "houseId": "",
        "imgs": [],
        "publishUrl": ""
      };

      serchHousesSubleaseDetailInfo();//自动获取房屋转租信息
      function serchHousesSubleaseDetailInfo() {
        $scope.housesSubDetail = [];
        var url = baseConfig.queryPath + "/house/query";
        //var url = 'http://10.211.103.145:9090/hrmsv2/v2/api/house/query';
        var param = {
          "houseId": $scope.housesId,
          "page": "1",
          "pageSize": "1"
        };
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url, param).success(function (result) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          $scope.housesSubDetail = result.returnData;

          $ionicSlideBoxDelegate.update();

          //console.log("result success111111111111 " + angular.toJson($scope.housesSubDetail));
        }).error(function (error, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      };

      $scope.slideChanged = function(index) {

      };
      $scope.goHourseSubDetail = function(){
        $state.go("tab.houses-sublease-detail");
      };
    }]);
