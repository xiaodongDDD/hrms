/**
 * Created by LeonChan on 2016/5/30.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.new-dorm-apply', {
          url: '/new-dorm-apply',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/new-dorm-apply.html',
              controller: 'NewDormApplyCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('NewDormApplyCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicModal',
    'hmsHttp',
    'hmsPopup',
    'dormApplySearchResultService',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicModal,
              hmsHttp,
              hmsPopup,
              dormApplySearchResultService) {
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-apply-type.html', {//定义modal
        scope: $scope
      }).then(function (modal1) {
        $scope.chooseTypePopup = modal1;
      });//初始化选择申请类型的modal
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-room-type.html', {//定义modal
        scope: $scope
      }).then(function (modal2) {
        $scope.chooseRoomPopup = modal2;
      });//初始化选择房间类型的modal
      $scope.defaultApplyType="常驻申请";//默认申请类型
      $scope.defaultRoomType="单人间";//默认房间类型
      $scope.applytype=["常驻申请","加班申请","临时申请","项目申请"];//项目申请选项
      $scope.roomtype=["单人间","四人间"];//房间申请
      $scope.showNumButton=true;//显示数字按钮，隐藏图片按钮
      $scope.inputinfo={
        floornum:"",//输入楼层号
        roomnum:""//输入房间号
      }
      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };

      $scope.chooseApplyType=function(){//显示申请类型modal
        $scope.chooseTypePopup.show();
      };

      $scope.chooseRoomType=function(){//显示房间类型modal
        $scope.chooseRoomPopup.show();
      };

      $scope.finishChoosingApplyType=function(param){//选择完成申请类型
        $scope.defaultApplyType=param;
        $scope.chooseTypePopup.hide();
      };

      $scope.finishChoosingRoomType=function(param){//选择完成房间类型
        $scope.defaultRoomType=param;
        $scope.chooseRoomPopup.hide();
      };

      $scope.chooseDays=function(){//选择入住天数以及取消入住天数
        if($scope.defaultApplyType=="常驻申请"){
          $scope.showNumButton=!$scope.showNumButton;
        }
      };

      $scope.searchVacantRoom=function(){//查询空闲房间
        var url=baseConfig.businessPath+"/wfl_apply_room/query_free_room_list";
        var param={
          "params": {
            p_employee_number: window.localStorage.empno,
            p_check_in_date:"20160615",
            p_check_out_date:"20160820",
            p_apply_type:$scope.defaultApplyType,
            p_room_type:$scope.defaultRoomType,
            p_room_number:$scope.inputinfo.roomnum,
            p_floor_number:$scope.inputinfo.floornum
          }
        };
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url,param).success(function(result){
          var message=result.message;
          hmsPopup.hideLoading();
          if( result.status=="S" && result.result.length>0 ) {
            var resultlist = result.result;//查询结果列表
            var info = {//要放入到service中的信息
              applyType: param.params.p_apply_type,
              checkinDate: param.params.p_check_in_date,
              checkoutDate: param.params.p_check_out_date,
              result: resultlist
            }
            dormApplySearchResultService.putInfo(info);//查询结果放入service中
            $state.go("tab.dorm-apply-vacant-room");
          }else if(result.status=="E"){
             hmsPopup.showShortCenterToast(message);
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
    }]);
