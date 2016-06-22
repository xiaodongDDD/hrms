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
    '$ionicScrollDelegate',
    '$timeout',
    'hmsPopup',
    function ($scope,
              $state,
              baseConfig,
              $ionicLoading,
              $http,
              $timeout,
              $ionicHistory,
              $ionicPlatform,
              hmsPopup,
              $ionicScrollDelegate,
              $timeout,
              hmsPopup) {

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
      /////////////////////////////////////
      //$timeout(function(){
      //  $ionicScrollDelegate.$getByHandle('loginScroll').freezeScroll(true);//锁死Android平台上的滚动条
      //},300);
      //$scope.loginInfo={
      //  username:"请输入用户名",
      //  password:"请输入密码"
      //};//登录信息
      //$scope.showBigPortrait=true;
      //$scope.showLittlePortrait=false;
      //$scope.rememberPassword=false;
      //$scope.littlePortrait="build/img/login/login-username.png";//大头像图片
      //$scope.bigPortrait="build/img/login/login-hand.png"//小头像图片
      //$scope.passwordChecked="build/img/login/login-unchecked.png";//是否记住密码图片
      //$scope.fillUsername=false;
      //$scope.fillPassword=false;
      //$scope.buttonStyle=[true,false];//登录按钮的两种样式
      //$scope.disableButton=true;//禁用登录按钮
      //$scope.showButtonIcon=false;
      //$scope.showLoginButton=false;
      //
      //$scope.usernameFocus=function(){//聚焦用户名
      //  $scope.showBigPortrait=false;
      //  $scope.showLittlePortrait=true;
      //  $scope.littlePortrait="build/img/login/login-username.png";
      //  if($scope.loginInfo.username=="请输入用户名"){
      //    $scope.loginInfo.username="";
      //  }
      //};
      //$scope.usernameBlur=function(){//用户名失去焦点
      //  $scope.showBigPortrait=true;
      //  $scope.showLittlePortrait=false;
      //  if($scope.loginInfo.username==""){
      //    $scope.loginInfo.username="请输入用户名";
      //  }else{
      //
      //  }
      //};
      //$scope.usernameChange=function(){//用户名改变
      //  if($scope.loginInfo.username!=""){
      //    $scope.fillUsername=true;
      //  }else if($scope.loginInfo.username==""){
      //    $scope.fillUsername=false;
      //  }
      //};
      //$scope.passwordChange=function(){//密码改变
      //  if($scope.loginInfo.password!=""){
      //    $scope.fillPassword=true;
      //    $scope.disableButton=false;
      //    $scope.buttonStyle[0]=false;
      //    $scope.buttonStyle[1]=true;
      //  }else if($scope.loginInfo.password==""){
      //    $scope.fillPassword=false;
      //    $scope.disableButton=true;
      //    $scope.buttonStyle[0]=true;
      //    $scope.buttonStyle[1]=false;
      //  }
      //};
      //$scope.passwordFocus=function(){//聚焦密码
      //    $scope.showBigPortrait=false;
      //    $scope.showLittlePortrait=true;
      //    $scope.littlePortrait="build/img/login/login-password.png";
      //    if($scope.loginInfo.password=="请输入密码"){
      //      $scope.loginInfo.password="";
      //    }
      //};
      //$scope.passwordBlur=function(){//密码失去焦点
      //  $scope.showBigPortrait=true;
      //  $scope.showLittlePortrait=false;
      //  if($scope.loginInfo.password==""){
      //    $scope.loginInfo.password="请输入密码";
      //  }else{
      //
      //  }
      //};
      //$scope.savePassword=function(){//记住密码
      // $scope.rememberPassword=!$scope.rememberPassword;
      // if($scope.rememberPassword==true){
      //   $scope.passwordChecked="build/img/login/login-checked.png"
      // }else if($scope.rememberPassword==false){
      //   $scope.passwordChecked="build/img/login/login-unchecked.png"
      // }
      //};
      //
      //$scope.login=function(){
      //  $scope.showLoginButton=true;
      //  $scope.showButtonIcon=true;
      //  $scope.showBigPortrait=true;
      //  $scope.bigPortrait="build/img/login/login-portrait.png"
      //}

      ////////////////////////////
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
