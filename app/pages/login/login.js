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
    '$ionicScrollDelegate',
    'checkVersionService',
    'hmsPopup',
    'imService',
    '$rootScope',
    function ($scope,
              $state,
              baseConfig,
              $ionicLoading,
              $http,
              $timeout,
              $ionicHistory,
              $ionicPlatform,
              $ionicScrollDelegate,
              checkVersionService,
              hmsPopup,
              imService,
              $rootScope) {

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
      /////////////////////////////////////
      $timeout(function () {
        $scope.loginScroll = $ionicScrollDelegate.$getByHandle('loginScroll');
        $scope.lockScroll(true);
      }, 300);
      $scope.loginInfo = {
        username: "",
        password: ""
      };//登录信息
      $scope.showBigPortrait = true;//显示打头像图片
      $scope.showLittlePortrait = false;//显示小头像图标
      $scope.rememberPassword = false;//是否记住密码
      $scope.littlePortrait = "build/img/login/login-username.png";//大头像图片
      $scope.bigPortrait = "build/img/login/login-hand.png"//小头像图片
      $scope.passwordChecked = "build/img/login/login-unchecked.png";//是否记住密码图片
      $scope.fillUsername = false;//填写了用户名内容
      $scope.fillPassword = false;//填写了密码内容
      $scope.focusUsername = false;//控制用户名span上浮与下沉
      $scope.focusPassword = false;//控制密码span上浮与下沉
      $scope.buttonStyle = [true, false];//登录按钮的两种样式
      $scope.disableButton = true;//禁用登录按钮
      $scope.showButtonIcon = false;//显示按钮中的对号
      $scope.showLoginButton = false;//显示最终的icon按钮
      $scope.showUserClearButton = false;//显示用户名删除按钮
      $scope.showPasswordClearButton = false;//显示密码删除按钮
      if (window.localStorage.empno) {
        $scope.focusUsername = true;
        $scope.fillUsername = true;
        $scope.showUserClearButton = true;
        $scope.loginInfo.username = window.localStorage.empno;
      }
      if (window.localStorage.checkboxSavePwd == "") {
        $scope.rememberPassword = false;
        $scope.passwordChecked = "build/img/login/login-unchecked.png";
      }

      if (window.localStorage.checkboxSavePwd == "true") {
        $scope.rememberPassword = true;
        $scope.passwordChecked = "build/img/login/login-checked.png";
        $scope.loginInfo.password = window.localStorage.password;
        if ((typeof($scope.loginInfo.password) !== "undefined") && ($scope.loginInfo.password != "")) {//如果拿到的密码是undefined的话，则默认为没有存密码
          $scope.focusPassword = true;
          $scope.fillPassword = true;
          $scope.buttonStyle[0] = false;
          $scope.buttonStyle[1] = true;
          $scope.disableButton = false;
          $scope.showPasswordClearButton = true;
        } else if (typeof($scope.loginInfo.password) === "undefined") {
          $scope.loginInfo.password = "";
          $scope.focusPassword = false;
          $scope.fillPassword = false;
          $scope.buttonStyle[0] = true;
          $scope.buttonStyle[1] = false;
        }
      } else {
        $scope.rememberPassword = false;
        $scope.passwordChecked = "build/img/login/login-unchecked.png";
      }
      $scope.lockScroll = function (bool) {
        $scope.loginScroll.freezeScroll(bool);//锁死Android平台上的滚动条
      };
      $scope.backTop = function () {
        $scope.loginScroll.scrollTop(false);
      };

      $scope.usernameFocus = function () {//聚焦用户名
        $scope.lockScroll(false);
        $scope.showBigPortrait = false;
        $scope.showLittlePortrait = true;
        $scope.littlePortrait = "build/img/login/login-username.png";
        if ($scope.loginInfo.username == "") {
          $scope.focusUsername = true;
        }
      };
      $scope.usernameBlur = function () {//用户名失去焦点
        $scope.lockScroll(true);
        $scope.backTop();
        if ($scope.loginInfo.username == "") {
          $scope.focusUsername = false;
          $scope.showUserClearButton = false;
        } else if ($scope.loginInfo.username != "") {
          $scope.showUserClearButton = true;
        }
      };

      $scope.usernameChange = function () {//用户名改变
        if ($scope.loginInfo.username != "") {
          $scope.fillUsername = true;
          $scope.showUserClearButton = true;
          if ($scope.fillPassword == true) {
            $scope.disableButton = false;
            $scope.buttonStyle[0] = false;
            $scope.buttonStyle[1] = true;
          }
        } else if ($scope.loginInfo.username == "") {
          $scope.showUserClearButton = false;
          $scope.fillUsername = false;
          $scope.disableButton = true;
          $scope.buttonStyle[0] = true;
          $scope.buttonStyle[1] = false;
        }
      };
      $scope.passwordChange = function () {//密码改变
        if ($scope.loginInfo.password != "") {
          $scope.fillPassword = true;
          $scope.showPasswordClearButton = true;
          if ($scope.fillUsername == true) {
            $scope.disableButton = false;
            $scope.buttonStyle[0] = false;
            $scope.buttonStyle[1] = true;
          }
        } else if ($scope.loginInfo.password == "") {
          $scope.fillPassword = false;
          $scope.showPasswordClearButton = false;
          $scope.disableButton = true;
          $scope.buttonStyle[0] = true;
          $scope.buttonStyle[1] = false;
        }
      };
      $scope.passwordFocus = function () {//聚焦密码
        $scope.lockScroll(false);
        $scope.showBigPortrait = false;
        $scope.showLittlePortrait = true;
        $scope.littlePortrait = "build/img/login/login-password.png";
        if ($scope.loginInfo.password == "") {
          $scope.focusPassword = true;
        }
      };
      $scope.passwordBlur = function () {//密码失去焦点
        $scope.lockScroll(true);
        $scope.backTop();
        if ($scope.loginInfo.password == "") {//密码span下移
          $scope.focusPassword = false;
          $scope.showPasswordClearButton = false;
        } else if ($scope.loginInfo.password != "") {
          $scope.showPasswordClearButton = true;
        }
      };

      $scope.clearUsername = function () {//清空用户名
        $scope.loginInfo.username = "";
        $scope.showUserClearButton = false;
        $scope.disableButton = true;
        $scope.buttonStyle[0] = true;
        $scope.buttonStyle[1] = false;
        if ($scope.focusUsername == true) {
          $scope.focusUsername = false;
          $scope.fillUsername = false;
        }
      };

      $scope.clearPassword = function () {//清空密码
        $scope.loginInfo.password = "";
        $scope.showPasswordClearButton = false;
        $scope.disableButton = true;
        $scope.buttonStyle[0] = true;
        $scope.buttonStyle[1] = false;
        if ($scope.focusPassword == true) {
          $scope.focusPassword = false;
          $scope.fillPassword = false;
        }
      };

      $scope.savePassword = function () {//记住密码
        $scope.rememberPassword = !$scope.rememberPassword;
        if (baseConfig.debug) {
          console.log("此时密码框的状态为 :", angular.toJson($scope.rememberPassword));
        }
        if ($scope.rememberPassword == true) {
          $scope.passwordChecked = "build/img/login/login-checked.png"
          window.localStorage.checkboxSavePwd = "true";
        } else if ($scope.rememberPassword == false) {
          $scope.passwordChecked = "build/img/login/login-unchecked.png"
          window.localStorage.checkboxSavePwd = "";
        }
        if ($scope.loginInfo.password !== "") {
          if ($scope.rememberPassword == true) {
            window.localStorage.password = $scope.loginInfo.password;
          } else {
            window.localStorage.password = "";
          }
        }
      };

      $scope.login = function () {//登录功能
        if(window.localStorage.empno != $scope.loginInfo.username) {
          localStorage.removeItem('key_history');
          localStorage.removeItem('common_linkman');
        }
        $scope.showLittlePortrait = false;
        $scope.showLoginButton = true;
        $scope.showButtonIcon = true;
        $scope.showBigPortrait = true;
        $scope.bigPortrait = "build/img/login/login-portrait.png";
        $timeout(function () {
          window.localStorage.empno = $scope.loginInfo.username;
          if ($scope.rememberPassword == true) {
            window.localStorage.password = $scope.loginInfo.password;
          } else if ($scope.rememberPassword == false) {
            window.localStorage.password = "";
          }

          if (!$scope.loginInfo.username || $scope.loginInfo.username == '') {
            hmsPopup.showPopup('用户名不能为空');
            return;
          }
          if (!$scope.loginInfo.password || $scope.loginInfo.password == '') {
            hmsPopup.showPopup('密码不能为空');
            return;
          }

          var url = baseConfig.loginPath + "/appLogin/user_login/login";
          var params = {
            "params": {
              "p_user_name": +$scope.loginInfo.username,
              "p_password": $scope.loginInfo.password
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
              window.localStorage.empno = $scope.loginInfo.username;
              window.localStorage.checkboxSavePwd = $scope.rememberPassword;
              $scope.bigPortrait = "build/img/login/login-hand.png";
              $scope.showLoginButton = false;
              $scope.showButtonIcon = false;
              checkVersionService.checkAppVersion();
              //if (ionic.Platform.isWebView()) {
                imService.initImData();
              //}
              $state.go("tab.message");
            } else {
              $scope.bigPortrait = "build/img/login/login-hand.png";
              $scope.showLoginButton = false;
              $scope.showButtonIcon = false;
              hmsPopup.showPopup('登陆失败,请确认密码');
            }
          }).error(function (response, status) {
            $scope.bigPortrait = "build/img/login/login-hand.png";
            $scope.showLoginButton = false;
            $scope.showButtonIcon = false;
            hmsPopup.hideLoading();
            hmsPopup.showPopup('网络连接出错');
            if (baseConfig.debug) {
              console.log("response error " + angular.toJson(response));
            }
          });
        }, 700);
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
      $rootScope.$on("REFRESH_LOGIN",function(){
        $scope.loginInfo = {
          username: "",
          password: ""
        };//登录信息
        $scope.showBigPortrait = true;//显示打头像图片
        $scope.showLittlePortrait = false;//显示小头像图标
        $scope.rememberPassword = false;//是否记住密码
        $scope.littlePortrait = "build/img/login/login-username.png";//大头像图片
        $scope.bigPortrait = "build/img/login/login-hand.png"//小头像图片
        $scope.passwordChecked = "build/img/login/login-unchecked.png";//是否记住密码图片
        $scope.fillUsername = false;//填写了用户名内容
        $scope.fillPassword = false;//填写了密码内容
        $scope.focusUsername = false;//控制用户名span上浮与下沉
        $scope.focusPassword = false;//控制密码span上浮与下沉
        $scope.buttonStyle = [true, false];//登录按钮的两种样式
        $scope.disableButton = true;//禁用登录按钮
        $scope.showButtonIcon = false;//显示按钮中的对号
        $scope.showLoginButton = false;//显示最终的icon按钮
        $scope.showUserClearButton = false;//显示用户名删除按钮
        $scope.showPasswordClearButton = false;//显示密码删除按钮
        if (window.localStorage.empno) {
          $scope.focusUsername = true;
          $scope.fillUsername = true;
          $scope.showUserClearButton = true;
          $scope.loginInfo.username = window.localStorage.empno;
        }
        if (window.localStorage.checkboxSavePwd == "") {
          $scope.rememberPassword = false;
          $scope.passwordChecked = "build/img/login/login-unchecked.png";
        }

        if (window.localStorage.checkboxSavePwd == "true") {
          $scope.rememberPassword = true;
          $scope.passwordChecked = "build/img/login/login-checked.png";
          $scope.loginInfo.password = window.localStorage.password;
          if ((typeof($scope.loginInfo.password) !== "undefined") && ($scope.loginInfo.password != "")) {//如果拿到的密码是undefined的话，则默认为没有存密码
            $scope.focusPassword = true;
            $scope.fillPassword = true;
            $scope.buttonStyle[0] = false;
            $scope.buttonStyle[1] = true;
            $scope.disableButton = false;
            $scope.showPasswordClearButton = true;
          } else if (typeof($scope.loginInfo.password) === "undefined") {
            $scope.loginInfo.password = "";
            $scope.focusPassword = false;
            $scope.fillPassword = false;
            $scope.buttonStyle[0] = true;
            $scope.buttonStyle[1] = false;
          }
        } else {
          $scope.rememberPassword = false;
          $scope.passwordChecked = "build/img/login/login-unchecked.png";
        }
      });
    }]);
