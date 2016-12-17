/**
 * Created by ZaraNengap on 2016/10/9.
 */
'use strict';
angular.module('customerModule')
  .controller('CustomerDetailStateCtrl', [
    '$scope',
    '$state',
    'customerDetailStateService',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    '$rootScope',
    'customerDetailService',
    function ($scope,
              $state,
              customerDetailStateService,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              $rootScope,
              customerDetailService) {
      console.log('CustomerDetailStateCtrl');

      customerDetailService.setTabNumber(0);
      $scope.value =  {
        page: 1,
        pageSize: 10,
        customerId: window.localStorage.customerId
      };
      $scope.showLoading = true;
      $scope.loadMoreDataFlag = false;
      $scope.states = [];
      var error = function (response) {
      };


      var querySaleStatesSuccess = function(response){
        //hmsPopup.hideLoading();
        $scope.showLoading = false;
        if(response.returnCode == "S"){
          if(response.dynamics.length===0){
            hmsPopup.showPopup('未找到数据');
            $scope.loadMoreDataFlag = false;
          }
          $scope.states = response.dynamics;
          $scope.loadMoreDataFlag = true;
       /*   console.log($scope.customers.length)*/
        } else {
          alert(response.returnMsg);
        }
      };
      customerDetailStateService.querySaleStates(querySaleStatesSuccess,error,$scope.value);
      //下拉刷新
      $scope.doRefresh = function () {
        $scope.value.page= 1;
        $scope.states = [];
        var error = function (response) {
          $scope.$broadcast('scroll.refreshComplete');
        };
        customerDetailStateService.querySaleStates(querySaleStatesSuccess,error,$scope.value);
        $scope.$broadcast('scroll.refreshComplete');
      };

      var loadMoreListSuccess = function (result) {
        if (result.returnCode == "S") {
          $scope.states = $scope.states.concat(result.dynamics);
          if (result.dynamics.length == 0) {
            console.log("没有数据了" + $scope.loadMoreDataFlag);
            $scope.loadMoreDataFlag = false;
          }
        } else {
          $scope.loadMoreDataFlag = false;
          hmsPopup.showPopup(result.returnMsg);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      //上啦加载
      $scope.loadMoreData = function () {
        console.log("上拉加载" + $scope.loadMoreDataFlag);
        $scope.value.page++;
        var error = function (response) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        customerDetailStateService.querySaleStates(loadMoreListSuccess,error,$scope.value);
        //$ionicScrollDelegate.$getByHandle("slideimgs").resize();
      };

      $rootScope.$on("REFRESH_ADD_PLAN", function () {
        console.log(  $scope.value);
        $scope.doRefresh();

      });
      $rootScope.$on('$ionicView.beforeEnter', function (e) {
       $scope.value =  {
         page: 1,
         pageSize: 10,
         customerId: window.localStorage.customerId
       };
       console.log("销售动态页面的ID==="+window.localStorage.customerId)
        $scope.$apply();
     })
    }]);

angular.module('customerModule')
  .service('customerDetailStateService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;

      this.querySaleStates = function (success,error,param) {
        var params = param;
        hmsHttp.post(baseUrl + 'customer_dynamics', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          error(response);
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      }


    }]);
