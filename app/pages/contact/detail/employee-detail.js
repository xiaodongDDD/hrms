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
        var LINK_MAN = 'common_linkman';
        var employeeBaseInfo = {
          tel: '',
          name: '',
          employeeNumber: ''
        };
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

      function storeCommonLinkman(newObject) { //存储为常用联系人
        //storedb(LINK_MAN).remove(newObject, function (err) {
        //});
        storedb(LINK_MAN).insert(newObject, function (err) {
        });
      };
      $scope.telPhone = function () {
         employeeBaseInfo = {
          tel: $scope.employeeInfo.mobil,
          name: $scope.employeeInfo.emp_name,
          employeeNumber: $scope.employeeInfo.emp_code
        };
        storeCommonLinkman(employeeBaseInfo);
        window.location.href = "tel:" + $scope.employeeInfo.mobil;
      };

      $scope.goImTalk = function () {
         employeeBaseInfo = {
          tel: $scope.employeeInfo.mobil,
          name: $scope.employeeInfo.emp_name,
          employeeNumber: $scope.employeeInfo.emp_code
        };
        storeCommonLinkman(employeeBaseInfo);
        hmsPopup.showShortCenterToast('敬请期待!');
      };
    }])
;
