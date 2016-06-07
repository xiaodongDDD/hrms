/**
 * Created by LeonChan on 2016/5/27.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply', {
          url: '/dorm-apply',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply.html',
              controller: 'DormApplyCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyCtrl', [
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
     $scope.descriptionAppearance=false;
     $scope.items=[
       {
        applyType:"checkIn",
        modeCheckIn:"",
        modeCheckOut:"",
        modeApproving:"",
        modeRejected:""
       },
       {
        applyType:"checkOut",
         modeCheckIn:"",
         modeCheckOut:"",
         modeApproving:"",
         modeRejected:""
       },
       {
        applyType:"approving",
         modeCheckIn:"",
         modeCheckOut:"",
         modeApproving:"",
         modeRejected:""
       },
       {
        applyType:"rejected",
         modeCheckIn:"",
         modeCheckOut:"",
         modeApproving:"",
         modeRejected:""
       }
     ];//测试item数据
     var i=0;
     for(i;i<$scope.items.length;i++){//处理显示某种小戳图片
       if($scope.items[i].applyType=="checkIn"){
         $scope.items[i].modeCheckIn=true;
         $scope.items[i].modeCheckOut=false;
         $scope.items[i].modeApproving=false;
         $scope.items[i].modeRejected=false;
       }else if($scope.items[i].applyType=="checkOut"){
         $scope.items[i].modeCheckIn=false;
         $scope.items[i].modeCheckOut=true;
         $scope.items[i].modeApproving=false;
         $scope.items[i].modeRejected=false;
       }else if($scope.items[i].applyType=="approving"){
         $scope.items[i].modeCheckIn=false;
         $scope.items[i].modeCheckOut=false;
         $scope.items[i].modeApproving=true;
         $scope.items[i].modeRejected=false;
       }else if($scope.items[i].applyType=="rejected"){
         $scope.items[i].modeCheckIn=false;
         $scope.items[i].modeCheckOut=false;
         $scope.items[i].modeApproving=false;
         $scope.items[i].modeRejected=true;
       }
     }
     $scope.goBack=function(){//返回按钮
       $ionicHistory.goBack();
     };

     $scope.createNewDormApply=function(){//跳转到新建申请界面
       $state.go("tab.new-dorm-apply");
     };

     $scope.viewApplyDetail=function(num){//跳转到申请详情界面
       var param=$scope.items[num].applyType;
       dormApplyTypeService.putInfo(param);//将申请状态存储在service中
       if(param=="checkIn" || param=="checkOut"){
         $state.go("tab.dorm-apply-detail-b");
       }else if(param=="approving" || param=="rejected"){
         $state.go("tab.dorm-apply-detail-a");
       }
     };

     $scope.judgeApplyType=function(param){//通过判断申请类型是否显示剩余天数字段
      var internalParam=param.applyType;
      if(internalParam=="checkIn" || internalParam=="checkOut"){
        return true;
      }else if(internalParam=="approving" || internalParam=="rejected"){
        return false;
      }
     };
     $scope.showDescription=function(){//显示住宿说明
       $scope.descriptionAppearance=true;
     };
     $scope.hideDescription=function(){//隐藏住宿说明
       $scope.descriptionAppearance=false;
     };
    }]);
