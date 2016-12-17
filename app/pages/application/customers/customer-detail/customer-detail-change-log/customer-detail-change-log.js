/**
 * Created by ZaraNengap on 2016/10/9.
 */
'use strict';
angular.module('customerModule')
  .controller('CustomerDetailChangeLogCtrl', [
    '$scope',
    '$state',
    'customerDetailChangeLogService',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    '$rootScope',
    function ($scope,
              $state,
              customerDetailChangeLogService,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              $rootScope) {
      console.log('CustomerDetailChangeCtrl');
      $scope.value =  {
        page: 1,
        pageSize: 20,
        customerId: window.localStorage.customerId
      }
      $scope.showLoading = true;
      $scope.loadMoreDataFlag = false;
      $scope.status = [];
      var error = function (response) {
      };
      var queryChangeLogSuccess = function(response){
        //hmsPopup.hideLoading();
        $scope.showLoading = false;
        if(response.returnCode == "S"){
          if(response.logs.length===0){
            hmsPopup.showPopup('未找到数据');
            $scope.loadMoreDataFlag = false;
          }
          $scope.status = response.logs;
          $scope.loadMoreDataFlag = true;
          /*   console.log($scope.customers.length)*/
        } else {
          alert(response.returnMsg);
        }
      };
      customerDetailChangeLogService.queryChangeLog(queryChangeLogSuccess,error,$scope.value);
      //下拉刷新
      $scope.doRefresh = function () {
        $scope.value.page= 1;
        $scope.status = [];
        var error = function (response) {
          $scope.$broadcast('scroll.refreshComplete');
        };
        customerDetailChangeLogService.queryChangeLog(queryChangeLogSuccess,error,$scope.value);
        $scope.$broadcast('scroll.refreshComplete');
      };


    }]);
angular.module('customerModule')
  .service('customerDetailChangeLogService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;

      this.queryChangeLog = function (success,error,param) {
        var params = param;
        hmsHttp.post(baseUrl + 'operation_log', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          error(response);
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      }


    }]);
