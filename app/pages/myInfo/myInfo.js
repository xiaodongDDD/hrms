/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup) {

      if(baseConfig.debug){
        console.log('myInfoCtrl.enter');
      }

      //var url=baseConfig.businessPath + "/get_empinfo/get_emp_detail";//获取用户信息
      //var param={
      //   "params":{
      //     "p_emp_code":window.localStorage.empno
      //   }
      //};
      //hmsHttp.post(url,param).success(function (result) {
      //  console.log(angular.toJson(result));
      //}).error(function(err,status){
      //
      //});
      $scope.logout = function(){//注销登录
        window.localStorage.token = "";
        window.localStorage.password = "";
        window.localStorage.timesheetAuto="";
        window.localStorage.messagePush="";
        $state.go('login');
      };

      $scope.setup=function(){//进入设置界面
        $state.go('tab.setup');
      };

      $scope.feedback=function(){//进入反馈界面
        $state.go('tab.feedback');
      };

      $scope.checkMyInfo=function(){//进入查看我的信息界面
        $state.go('tab.my-info-detail');
      };

      $scope.$on('$ionicView.enter', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$destroy');
        }
      });
    }]);
