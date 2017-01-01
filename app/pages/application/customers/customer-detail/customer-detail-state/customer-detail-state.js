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
    '$ionicScrollDelegate',
    '$ionicHistory',
    function ($scope,
              $state,
              customerDetailStateService,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              $rootScope,
              customerDetailService,
              $ionicScrollDelegate,
              $ionicHistory) {
      console.log('CustomerDetailStateCtrl');

      customerDetailService.setTabNumber(0);
      $scope.value =  {
        page: 1,
        pageSize: 15,
        customerId: customerDetailService.getCustomerId()
      };
      $scope.showLoading = true;
      $scope.loadMoreDataFlag = false;
      $scope.states = [];
      var error = function (response) {
      };


      var querySaleStatesSuccess = function(response){
        //hmsPopup.hideLoading();
        $scope.showLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicScrollDelegate.$getByHandle('detailScroll').scrollTop(false);
        if(response.returnCode == "S"){
          if(response.dynamics.length===0){
            //hmsPopup.showPopup('未找到数据');
            $scope.loadMoreDataFlag = false;
          }else{
            $scope.states = response.dynamics;
            $scope.loadMoreDataFlag = response.dynamics.length== $scope.value.pageSize;
            /*   console.log($scope.customers.length)*/
          }

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
          if (result.dynamics.length == 0) {
            console.log("没有数据了" + $scope.loadMoreDataFlag);
            $scope.loadMoreDataFlag = false;
          }else {
            $scope.states = $scope.states.concat(result.dynamics);
            $scope.loadMoreDataFlag = result.dynamics.length== $scope.value.pageSize;
          }
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

      $scope.goDetail = function (detail) {
        if(detail.operationType=='SALE_PLAN'){
          console.log("SALE_PLAN")
          if($ionicHistory.viewHistory().backView.stateName=="tab.contactDetail"){
            console.log("contactDetail")
            $state.go('tab.plans-detail2', {"authority":true,"planId": detail.planId});
          }else{
            console.log("else")
            $state.go('tab.plans-detail', {"authority":true,"planId": detail.planId});
          }

        }
      }

      ////获取当前是什么查询权限
      //function getAuthorityType() {
      //  var authority = 'OTHER';
      //  if (vm.planAuthority.MY.selected) {
      //    authority = 'MY';
      //  }
      //  return authority;
      //}

      $rootScope.$on("REFRESH_ADD_PLAN", function () {
        console.log(  $scope.value);
        $scope.doRefresh();

      });
      $scope.$on('$ionicView.beforeEnter', function (e) {
       $scope.value =  {
         page: 1,
         pageSize: 10,
         customerId: customerDetailService.getCustomerId()
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
          //hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      }


    }]);
