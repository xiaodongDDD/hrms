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
          params: {
            housesSubId: ''
          }
        })
        .state('tab.tab-application-house-employee', {
          url: '/tab-application-house-employee',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/contact/detail/employee-detail.html',
              controller: 'contactEmployeeDetailCtl'
            }
          },
          params: {
            'employeeNumber': ""
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
    '$ionicScrollDelegate',
    '$timeout',
    '$stateParams',
    '$ionicActionSheet',
    'imService',
    '$ionicModal',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicSlideBoxDelegate,
              $ionicScrollDelegate,
              $timeout,
              $stateParams,
              $ionicActionSheet,
              imService,
              $ionicModal) {
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
        "houseTitle": "房屋信息",
        "houseSubject": "",
        "houseTypeRoom": "",
        "houseTypeHall": "",
        "houseTypeBathRoom": "",
        "square": "",
        "trafficInfo": "",
        "rent": "",
        "expireDate": "",
        "publishDate": "",
        "publishEmp": "",
        "city": "",
        "area": "",
        "houseId": "",
        "imgs": [],
        "publishUrl": ""
      };

      $scope.slideIndex = 0;

      function success(success) {
        if(success.code=='0'){
          //分享成功
        }
      }
      function fail(error) {
        if(error.code=='-1'){
          //分享失败
        }else if(error.code=='-2'){
          //用户取消
        }
      }

      $scope.share = function (){
        //分享显示的图片，默认
        var imgurl = 'http://youtui.mobi/media/image/youtui.png';
        //分享显示的图片，取转租信息中的第一张照片
        if ($scope.housesSubDetail.imgs.length > 0) {
          imgurl = $scope.housesSubDetail.imgs[$scope.slideIndex].objectUrl;
        }

        var youtuiShare = window.plugins.youtuiShare;
          youtuiShare.share(success, fail, [
            '汉得房屋转租',   //标题
            $scope.housesSubDetail.publishUrl, //链接
            $scope.housesSubDetail.houseTitle, //描述
            imgurl  //图片
          ]);
      };

      $timeout(function () {
        serchHousesSubleaseDetailInfo();//自动获取房屋转租信息
      },250);

      function serchHousesSubleaseDetailInfo() {
         //$scope.housesSubDetail = [];
        var url = baseConfig.queryPath + "/house/query";
        //var url = 'http://10.211.103.145:9090/hrmsv2/v2/api/house/query';
        var param = {
          "houseId": $scope.housesId,
          "page": "1",
          "pageSize": "1"
        };
        hmsPopup.showLoading('查询数据中');
        hmsHttp.post(url, param).success(function (result) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          //console.log("result success " + angular.toJson(result));
          $scope.housesSubDetail = result.returnData;

          $ionicSlideBoxDelegate.update();
          getStaffDetails();

        }).error(function (error, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      };

      $scope.slideChanged = function (index) {
        $scope.slideIndex = index;
      };

      $scope.zoomMin = 1;
      $scope.showImages = function(index) {
        $scope.photoHight = {
          "height": window.screen.height + "px"
        };
        $scope.activeSlide = index;
        $scope.showModal('build/pages/application/houses-sublease/modal/houses-detail-photo-zoom.html');
      } ;
      $scope.showModal = function(templateUrl) {//显示原图
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
      };
      //$scope.updateSlideStatus = function(slide) {
      //  var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      //  if(zoomFactor == $scope.zoomMin){
      //    $ionicSlideBoxDelegate.enableSlide(true);
      //  } else {
      //    $ionicSlideBoxDelegate.enableSlide(false) ;
      //  }
      //} ;

      function getStaffDetails() {//拉取员工详情信息
        var url = baseConfig.queryPath + "/staff/detail";
        var param = {
          "key": $scope.housesSubDetail.publishEmp
        };
        hmsHttp.post(url, param).success(function (result) {
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          $scope.staffInfoDetail = result.rows;
          console.log("result success " + angular.toJson($scope.staffInfoDetail));
        }).error(function (error, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      }

      $scope.telNumber = function (event, telNum) { //拨打电话按钮的响应事件
        event.stopPropagation(); //阻止事件冒泡
        try {
          $ionicActionSheet.show({
            buttons: [
              {text: '拨打电话'}
            ],
            cancelText: 'Cancel',
            buttonClicked: function (index) {
              window.location.href = "tel:" + telNum.replace(/\s+/g, "");
              return true;
            }
          });
        } catch (e) {
          alert(e);
        }
      };

      $scope.goEmployeeDetail = function (publishEmployeeNumber) { //跳到个人详情界面
        $state.go('tab.tab-application-house-employee', {employeeNumber: publishEmployeeNumber});
      };

      $scope.goImTalk = function (employeeInfo) {//即使通讯
        //employeeBaseInfo = {
        //  tel: $scope.employeeInfo.mobil.replace(/\s+/g,""),
        //  name: $scope.employeeInfo.emp_name,
        //  employeeNumber: $scope.employeeInfo.emp_code,
        //  imgUrl: $scope.employeeInfo.avatar
        //};
        //if (employeeBaseInfo.name) {
        //  storeCommonLinkman(employeeBaseInfo);
        //}
        //go native page --im talk
        if (ionic.Platform.isWebView()) {
          var emp = {
            "friendId": employeeInfo.emp_code,
            "friendName": employeeInfo.emp_name
          };
          imService.toNativeChatPage(emp);
        } else {
          hmsPopup.showShortCenterToast('不支持网页聊天!');
        }
      };

    }]);
