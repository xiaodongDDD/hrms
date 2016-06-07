/**
 * Created by LeonChan on 2016/5/31.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-detail-a', {
          url: '/dorm-apply-detail-a',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-detail-a.html',
              controller: 'DormApplyDetailFirstCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailFirstCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'dormApplyTypeService',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplyTypeService) {
      var applyType=dormApplyTypeService.getInfo();
      $scope.approving=false;//审批中状态标志位
      $scope.rejected=false;//已拒绝状态标识位
      $scope.approvedResult="";
      if(applyType == "approving"){
        $scope.approving=true;
        $scope.rejected=false;
        $scope.approvedResult="";
      }else if(applyType == "rejected"){
        $scope.approving=false;
        $scope.rejected=true;
        $scope.approvedResult="已拒绝";
      }
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
    }]);
