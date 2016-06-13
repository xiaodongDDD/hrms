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
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'dormApplySearchResultService',
    'hmsHttp',
    'hmsPopup',
    '$timeout',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplySearchResultService,
              hmsHttp,
              hmsPopup,
              $timeout) {

     var resultInfo=dormApplySearchResultService.getInfo();//从service中拿到查询界面得到的查询结果
     $scope.roomlist=resultInfo.result;
     $scope.goBack=function(){//返回上一界面
       $ionicHistory.goBack();
     };
     $scope.applyRoom=function(num){
       var url=baseConfig.businessPath+"/wfl_apply_room/apply_room";
       var param={
         "params": {
           p_employee_number:window.localStorage.empno,
           p_checkin_date:resultInfo.checkinDate,
           p_checkout_date:resultInfo.checkoutDate,
           p_room_number:$scope.roomlist[num].room_number,
           p_bed_number:$scope.roomlist[num].bed_number,
           p_apply_type:resultInfo.applyType,
           p_reason:""
         }
       };
       hmsPopup.showLoading('请稍候');
       hmsHttp.post(url,param).success(function(result){
         hmsPopup.hideLoading();
         var message=result.message;
         hmsPopup.showShortCenterToast(message);
         if(result.status=="S"){//如果申请成功的话
             $ionicHistory.goBack(-2);//返回住宿申请界面
             $rootScope.$broadcast("APPLY_SUCCESS");//自动触发刷新历史申请数据
         }
         if (baseConfig.debug) {
           console.log("result success " + angular.toJson(result));
         }
       }).error(function(error,status){
         hmsPopup.hideLoading();
         if (baseConfig.debug) {
           console.log("response error " + angular.toJson(error));
         }
       });
     };
    }])
