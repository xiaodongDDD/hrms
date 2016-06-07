/**
 * Created by LeonChan on 2016/6/4.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-detail-b', {
          url: '/dorm-apply-detail-b',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-detail-b.html',
              controller: 'DormApplyDetailSecondCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailSecondCtrl', [
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
      $scope.checkIn=false;//审批中状态标志位
      $scope.checkOut=false;//已拒绝状态标识位
      $scope.buttonText=""//按钮上显示的文字
      if(applyType == "checkIn"){//已入住
        $scope.checkIn=true;
        $scope.checkOut=false;
        $scope.buttonText="续住";
      }else if(applyType == "checkOut"){//已退房
        $scope.checkIn=false;
        $scope.checkOut=true;
        $scope.buttonText="再次预定";
      }
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };

    }]);
