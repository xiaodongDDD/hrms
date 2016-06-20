/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    function ($scope,
              $state,
              baseConfig) {

      if(baseConfig.debug){
        console.log('myInfoCtrl.enter');
      }

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
