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
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicHistory,
              $stateParams) {
      /**
       * var section
       */
      {
        if (ionic.Platform.isIOS()) {
          angular.element('.common-head').css('paddingTop', '20px');
        }
        $scope.employeeInfo = {}; //存储查询员工的详细信息
        $scope.contactLoading = true; //默认显示loading加载
        var getEmployeeDetailUrl = baseConfig.businessPath + '/get_empinfo/get_emp_detail';
        var employeeDetailParams = {params: {p_emp_code: $stateParams.employeeNumber}};
      }

      /**
       *  获取员工的详细信息数据--
       */
      function initEmployeeData() {
        hmsHttp.post(getEmployeeDetailUrl, employeeDetailParams).success(function (response) {
          $scope.employeeInfo = response.token;
          $scope.contactLoading = false;
        }).error(function (error) {
          $scope.contactLoading = false;
          hmsPopup.showShortCenterToast('请检查网络连接,稍后重试!');
          $scope.employeeInfo = {};
        });
      };
      initEmployeeData();

      $scope.goBackPage = function () {
        $ionicHistory.goBack();
      };

      $scope.telPhone = function () {
        window.location.href = "tel:" + $scope.employeeInfo.mobil;
      };

      $scope.goImTalk = function () {
        hmsPopup.showShortCenterToast('敬请期待!');
      };
    }]);
