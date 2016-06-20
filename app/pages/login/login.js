/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('loginModule')

  .controller('loginCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicLoading',
    '$http',
    '$timeout',
    '$ionicHistory',
    '$ionicPlatform',
    'hmsPopup',
    function ($scope,
              $state,
              baseConfig,
              $ionicLoading,
              $http,
              $timeout,
              $ionicHistory,
              $ionicPlatform,
              hmsPopup) {

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

      $scope.loginData = {};
      $scope.currentVersionNum = baseConfig.versionName;

      if (window.localStorage.empno) {
        $scope.loginData.username = window.localStorage.empno;
      }

      if (!window.localStorage.checkboxSavePwd) {
        $scope.checkboxSavePwd = true;
        window.localStorage.checkboxSavePwd = "true";
      }

      if (window.localStorage.checkboxSavePwd == "true") {
        $scope.checkboxSavePwd = true;
        $scope.loginData.password = window.localStorage.password;
      } else {
        $scope.checkboxSavePwd = false;
      }

      if (baseConfig.debug) {
        console.log('loginCtrl.enter');
      }

      $scope.savePassword = function () {
        $scope.checkboxSavePwd = !$scope.checkboxSavePwd;//取反 记住密码框的状态
        if (baseConfig.debug) {
          console.log("此时密码框的状态为 :", angular.toJson($scope.checkboxSavePwd));
        }
        if ($scope.loginData.password !== "") {
          if ($scope.checkboxSavePwd === true) {
            window.localStorage.password = $scope.loginData.password;
          } else {
            window.localStorage.password = "";
          }
        }
      };

      $scope.clearUser = function () {
        $scope.loginData.username = '';
      }
      $scope.clearPassword = function () {
        $scope.loginData.password = '';
      }

      //login
      $scope.doLogin = function () {
        window.localStorage.empno = $scope.loginData.username;
        if ($scope.checkboxSavePwd) {
          window.localStorage.password = $scope.loginData.password;
        } else {
          window.localStorage.password = "";
        }

        if (!$scope.loginData.username || $scope.loginData.username == '') {
          hmsPopup.showPopup('用户名不能为空');
          return;
        }
        if (!$scope.loginData.password || $scope.loginData.password == '') {
          hmsPopup.showPopup('密码不能为空');
          return;
        }

        var url = baseConfig.basePath + "/appLogin/user_login/login";
        var params = {
          "params": {
            "p_user_name": +$scope.loginData.username,
            "p_password": $scope.loginData.password
          }
        };
        hmsPopup.showLoading('登陆中...');
        $http.post(url, params).success(function (result) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          if (!result.status && result.con_status == 'S') {
            window.localStorage.token = result.pre_token + result.token_key;
            window.localStorage.empno = $scope.loginData.username;
            window.localStorage.checkboxSavePwd = $scope.checkboxSavePwd;
            $state.go("tab.message");
          } else {
            hmsPopup.showPopup('登陆失败,可能是密码不对!');
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('loginCtrl.$ionicView.enter');
        }

        $timeout(function () {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
        }, 400);
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('loginCtrl.$destroy');
        }
      });
    }]);
