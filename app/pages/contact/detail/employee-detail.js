/**
 * Created by wolf on 2016/7/5.
 * -wen.dai-
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.employeeDetail', {
          url: 'contact/employeeDetail',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/detail/employee-detail.html',
              controller: 'contactEmployeeDetailCtl'
            }
          },
          params: {
            'employeeNumber': ""
          }
        });
    }]);
angular.module('contactModule')
  .controller('contactEmployeeDetailCtl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    '$ionicHistory',
    '$stateParams',
    'imService',
    '$ionicActionSheet',
    'contactService',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicHistory,
              $stateParams,
              imService,
              $ionicActionSheet,
              contactService) {
      /**
       * var section
       */
      {
        if (ionic.Platform.isIOS()) {
          angular.element('.common-head').css('paddingTop', '20px');
        }
        $scope.employeeInfo = {}; //存储查询员工的详细信息
        $scope.contactLoading = true; //默认显示loading加载
        var LINK_MAN = 'common_linkman';
        var employeeBaseInfo = {
          tel: '',
          name: '',
          employeeNumber: '',
          imgUrl: ''
        };
        var getEmployeeDetailUrl = baseConfig.queryPath + '/staff/detail';
        var employeeDetailParams = {key: $stateParams.employeeNumber};
      }

      /**
       *  获取员工的详细信息数据--
       */
      function initEmployeeData() {
        hmsHttp.post(getEmployeeDetailUrl, employeeDetailParams).success(function (response) {
          $scope.employeeInfo = response.rows[0];
          if (!$scope.employeeInfo.avatar) {
            $scope.employeeInfo.avatar = 'build/img/contact/BG-profile.png'
          }

          angular.element('.human-head-image').css({
            'backgroundImage': 'url(' + $scope.employeeInfo.avatar + ')',
            'backgroundRepeat': 'no-repeat', 'backgroundSize': 'cover', 'backgroundPosition': 'center'
          });
          $scope.contactLoading = false;
        }).error(function (error) {
          $scope.contactLoading = false;
          $scope.employeeInfo = {};
        });
      };
      initEmployeeData();

      $scope.goBackPage = function () {
        $ionicHistory.goBack();
      };

      function storeCommonLinkman(newObject) { //存储为常用联系人
        //storedb(LINK_MAN).remove(newObject, function (err) {
        //});
        storedb(LINK_MAN).insert(newObject, function (err) {
        });
      };

      $scope.telPhone = function () { //响应拨打电话按钮的方法
        try {
          $ionicActionSheet.show({
            buttons: [
              {text: '拨打电话'},
              {text: '增加到通讯录'},
            ],
            cancelText: 'Cancel',
            buttonClicked: function (index) {
              if (index == 0) {
                window.location.href = "tel:" + 88888888888; //不明觉厉-!
                window.location.href = "tel:" + $scope.employeeInfo.mobil;
                employeeBaseInfo = {
                  tel: $scope.employeeInfo.mobil,
                  name: $scope.employeeInfo.emp_name,
                  employeeNumber: $scope.employeeInfo.emp_code,
                  imgUrl: $scope.employeeInfo.avatar
                };
                if (employeeBaseInfo.name) {
                  storeCommonLinkman(employeeBaseInfo);
                }
                return true;
              }
              if (index == 1) {
                var baseInfo = {
                  mobil: $scope.employeeInfo.mobil,
                  email: $scope.employeeInfo.email,
                  emp_name: $scope.employeeInfo.emp_name
                };
                contactService.contactLocal(baseInfo);
                return true;
              }
            }
          });
        } catch (e) {
          alert(e);
        }
      };

      $scope.goImTalk = function () {
        employeeBaseInfo = {
          tel: $scope.employeeInfo.mobil,
          name: $scope.employeeInfo.emp_name,
          employeeNumber: $scope.employeeInfo.emp_code
        };
        if (employeeBaseInfo.name) {
          storeCommonLinkman(employeeBaseInfo);
        }
        //go native page --im talk
        if (ionic.Platform.isWebView()) {
          imService.toNativeChatPage({friendId: $scope.employeeInfo.emp_code});
        } else {
          hmsPopup.showShortCenterToast('不支持网页聊天!');
        }
      };
    }])
;
