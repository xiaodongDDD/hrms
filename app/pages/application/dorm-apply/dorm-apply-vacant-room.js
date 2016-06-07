/**
 * Created by LeonChan on 2016/6/7.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-vacant-room', {
          url: '/dorm-apply-vacant-room',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-vacant-room.html',
              controller: 'DormApplyVacantRoomCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyVacantRoomCtrl', [
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
     $scope.roomlist=[
       {
        room_number:"116",
        floor_number:"1",
        bed_number:"2",
        dorm_type:"男"
       },
       {
         room_number:"226",
         floor_number:"2",
         bed_number:"1",
         dorm_type:"男"
       },
       {
         room_number:"326",
         floor_number:"3",
         bed_number:"1",
         dorm_type:"男"
       },
       {
         room_number:"338",
         floor_number:"3",
         bed_number:"2",
         dorm_type:"男"
       },
       {
         room_number:"515",
         floor_number:"5",
         bed_number:"1",
         dorm_type:"男"
       }
     ];
     $scope.goBack=function(){//返回上一界面
       $ionicHistory.goBack();
     };

    }])
