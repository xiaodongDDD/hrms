/**
 * Created by wkh on 2016/10/25.
 */
'use strict';
angular.module('myInfoModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.lockSetting', {
          url: '/lockSetting',
          cache: false,
          params: {
            'Operation': ''
          },
          views: {
            'tab-myInfo': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/myInfo/lock/lockSetting.html',
              controller: 'lockSettingCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('lockSettingCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$stateParams',
    'storageSettingLock',
    '$timeout',
    '$state',
    '$ionicModal',
    '$http',
    'storageSetting',
    'imService',
    'hmsJpushService',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $stateParams,
              storageSettingLock,
              $timeout,
              $state,
              $ionicModal,
              $http,
              storageSetting,
              imService,
              hmsJpushService) {
      $scope.goBack = function () {
        $ionicHistory.goBack();
      };
      /*  $scope.changeCheck= window.localStorage.changeCheck;*/
      $scope.$on('$ionicView.enter', function () {
        console.log("进入设置页面");
        $scope.operation = $stateParams.Operation;
        if (!storageSettingLock.getLock()) {
          var w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
          var config = {
            height: w * 8 / 10,
            width: w * 8 / 10,
            miniHeight: w / 11 * 3,
            miniWidth: w / 11 * 3,
            operation: $scope.operation,
            canvasID: 'setting-container',
            descID: 'setting-description',
            resetID: 'setting-reset',
            miniCanvasID: 'mini-container',
            fillStyle: '#fe9073',
            strokeStyle: '#fe9073',
            miniFillStyle: '#fe9073',
            miniStrokeStyle: '#fe9073',
            outFillStyle: "rgba(254, 144, 115, 0.4)",
            haveDelta: true,
            successInitCallback: function () {
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $rootScope.$broadcast('INIT_GESTURE_PASSWORD');
              hmsPopup.showLongCenterToast("手势密码设置成功！");
              $timeout(function () {
                $ionicHistory.goBack();
              }, 500)
            },
            successChangeCallback: function () {
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $timeout(function () {
                $ionicHistory.goBack();
              }, 500)
            },
            successRmLockCallback: function () {
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $rootScope.$broadcast('REMOVE_GESTURE_PASSWORD');
              var onConfirm = function (res) {
                $ionicHistory.goBack();
              };
              hmsPopup.confirmNoTitle('确认关闭手势密码吗', onConfirm);

              /*   $timeout(function(){
               $ionicHistory.goBack();
               }, 500)*/
            },
            errorCallback: function () {
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $timeout(function () {
                desc.className = 'error-description';
              }, 20);
            }
          };
          storageSettingLock.initLock(config);
        } else {
          $scope.lock = storageSettingLock.getLock();
          $scope.lock.operation = $scope.operation;
          $scope.lock.init();
        }
      });

      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };
      /*      $scope.changeCheck=function(){
       $state.go('tab.lock');
       window.localStorage.changeCheck="true";
       };*/
      $ionicModal.fromTemplateUrl('build/pages/myInfo/modal/changeLock.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });
      $scope.showchangeCheck = function () {
        /* console.log(operation);*/

        $scope.modal.show();
        /*   if(operation==3){
         $scope.operation=4;
         }*/
      };
      $scope.closeModel = function () {
        $scope.modal.hide();
      };
      $scope.loginData = {};
      $scope.loginData.password = "";
      $scope.loginData.username = window.localStorage.empno;
      $scope.clearPassWord=function(){
        $scope.loginData.password = "";
      };
      function loginSuccess(result) {
        if ($scope.operation == 3) {
          window.localStorage.removeItem('gesturePassword');
          $rootScope.$broadcast('REMOVE_GESTURE_PASSWORD');
          $ionicHistory.goBack();
        } else {
          if (!storageSettingLock.getLock()) {
            var w = window.innerWidth
              || document.documentElement.clientWidth
              || document.body.clientWidth;
            var config = {
              height: w * 8 / 10,
              width: w * 8 / 10,
              miniHeight: w / 10 * 3,
              miniWidth: w / 10 * 3,
              operation: 0,
              fillStyle: '#fe9073',
              strokeStyle: '#fe9073',
              miniFillStyle: '#fe9073',
              miniStrokeStyle: '#fe9073',
              outFillStyle: "rgba(254, 144, 115, 0.4)",
              canvasID: 'setting-container',
              descID: 'setting-description',
              resetID: 'setting-reset',
              miniCanvasID: 'mini-container',
              haveDelta: true,
              successInitCallback: function () {
                var desc = document.getElementById('setting-description');
                desc.className = '';
                $rootScope.$broadcast('INIT_GESTURE_PASSWORD');
                $timeout(function () {
                  $ionicHistory.goBack();
                }, 500)
              },
              successChangeCallback: function () {
                var desc = document.getElementById('setting-description');
                desc.className = '';
                $timeout(function () {
                  $ionicHistory.goBack();
                }, 500)
              },
              successRmLockCallback: function () {
                var desc = document.getElementById('setting-description');
                desc.className = '';
                $rootScope.$broadcast('REMOVE_GESTURE_PASSWORD');
                $timeout(function () {
                  $ionicHistory.goBack();
                }, 500)
              },
              errorCallback: function () {
                var desc = document.getElementById('setting-description');
                desc.className = '';
                $timeout(function () {
                  desc.className = 'error-description';
                }, 20);
              }
            };
            storageSettingLock.initLock(config);
          } else {
            $scope.lock = storageSettingLock.getLock();
            $scope.lock.operation = 0;
            $scope.lock.init();
          }
        }

      }

   /*   $scope.changeCheck = function () {
        loginService.login(loginSuccess, $scope.loginData.username, $scope.loginData.password);
        $scope.modal.hide();
        /!*  window.localStorage.removeItem('gesturePassword');*!/


      }*/
      function toIPhoneModel(model) {
        var dictionary = {
          "i386"    :"Simulator",
          "x86_64"  :"Simulator",
          "iPod1,1":"iPod Touch",         // (Original)
          "iPod2,1":"iPod Touch 2",       // (Second Generation)
          "iPod3,1":"iPod Touch 3",       // (Third Generation)
          "iPod4,1":"iPod Touch 4",       // (Third Generation)
          "iPod7,1":"iPod Touch 6",       // (6th Generation)
          "iPhone1,1":"iPhone",           // (Original)
          "iPhone1,2":"iPhone 3G",        // (3G)
          "iPhone2,1":"iPhone 3GS",       // (3GS)
          "iPad1,1":"iPad",               // (Original)
          "iPad2,1":"iPad 2",             // (2nd Generation)
          "iPad3,1":"new iPad",           // (3rd Generation)
          "iPhone3,1":"iPhone 4",         // (GSM)
          "iPhone3,3":"iPhone 4",         // (CDMA/Verizon/Sprint)
          "iPhone4,1":"iPhone 4S",
          "iPhone5,1":"iPhone 5",         // (model A1428, AT&T/Canada)
          "iPhone5,2":"iPhone 5",         // (model A1429, everything else)
          "iPad3,4":"iPad 4th Generation",// (4th Generation)
          "iPad2,5":"iPad Mini",          // (Original)
          "iPhone5,3":"iPhone 5c",        // (model A1456, A1532 | GSM)
          "iPhone5,4":"iPhone 5c",        // (model A1507, A1516, A1526 (China), A1529 | Global)
          "iPhone6,1":"iPhone 5s",        // (model A1433, A1533 | GSM)
          "iPhone6,2":"iPhone 5s",        // (model A1457, A1518, A1528 (China), A1530 | Global)
          "iPhone7,1":"iPhone 6 Plus",
          "iPhone7,2":"iPhone 6",
          "iPhone8,1":"iPhone 6S",
          "iPhone8,2":"iPhone 6S Plus",
          "iPhone8,4":"iPhone SE",
          "iPhone9,1":"iPhone 7",
          "iPhone9,3":"iPhone 7",
          "iPhone9,2":"iPhone 7 Plus",
          "iPhone9,4":"iPhone 7 Plus",
          "iPad4,1":"iPad Air",           // 5th Generation iPad (iPad Air) - Wifi
          "iPad4,2":"iPad Air",           // 5th Generation iPad (iPad Air) - Cellular
          "iPad4,4":"iPad Mini",          // (2nd Generation iPad Mini - Wifi)
          "iPad4,5":"iPad Mini",          // (2nd Generation iPad Mini - Cellular)
          "iPad4,7":"iPad Mini",          // (3rd Generation iPad Mini - Wifi (model A1599))
          "iPad6,7":"iPad Pro (12.9\")",  // iPad Pro 12.9 inches - (model A1584)
          "iPad6,8":"iPad Pro (12.9\")",  // iPad Pro 12.9 inches - (model A1652)
          "iPad6,3":"iPad Pro (9.7\")",   // iPad Pro 9.7 inches - (model A1673)
          "iPad6,4":"iPad Pro (9.7\")"    // iPad Pro 9.7 inches - (models A1674 and A1675)
        };
        if(dictionary[model]){
          return dictionary[model];
        } else {
          return "Unknown IOS model";
        }
      }
      function loginPost(){//后台采用HAP后更改成包含Content-type的方式，账号密码采用encodeURIComponent()转换，这样可以传特殊符号
        var deviceInfo="";
        if(ionic.Platform.isAndroid()){
          deviceInfo="Android"
        }else if(ionic.Platform.isIOS()){
          deviceInfo="iOS";
        }else{
          deviceInfo="PC";
        }

        try{
          if( deviceInfo == 'iOS' ){
            var model = toIPhoneModel(device.model);
          } else {
            model  = device.model;
          }
          var url=baseConfig.loginPath+"username=" + encodeURIComponent(window.localStorage.empno) + "&password=" +
            encodeURIComponent($scope.loginData.password) + "&device_info=" + deviceInfo + "&device_model=" + encodeURIComponent(model) +
            "&device_version=" + encodeURIComponent(device.version) + "&device_uuid=" + encodeURIComponent(device.uuid);
        } catch (e) {
          alert('No device!');
          url=baseConfig.loginPath+"username=" + encodeURIComponent(window.localStorage.empno) + "&password=" +
            encodeURIComponent($scope.loginData.password) + "&device_info=" + deviceInfo;
        }
        if(baseConfig.debug){
          console.log('loginPost.url ' + url);
        }

        return $http({
          method:'POST',
          headers:{
            'Content-type':"application/x-www-form-urlencoded"
          },
          url:url
        })
      }
      $scope.changeCheck=function(){
        $scope.login = function () {//登录功能
          $timeout(function () {
            hmsPopup.showLoading('登录中...');
            loginPost().success(function (result) {
              hmsPopup.hideLoading();
              $scope.modal.hide();
              if (baseConfig.debug) {
                console.log("result success " + angular.toJson(result));
              }
              //绑定推送服务
              hmsJpushService.bind(window.localStorage.empno);

              if (result.access_token && result.access_token != '') {
                window.localStorage.token = result.access_token;
                $scope.bigPortrait = "build/img/login/login-hand.png";
                //imService.initImData();
                if (ionic.Platform.isWebView()) {
                  imService.initImData();
                }
                //检查crm权限
                var url = baseConfig.basePath + "user_role";
                hmsHttp.post(url, {}).success(function (response) {
                  $scope.showLoginButton = false;
                  $scope.showButtonIcon = false;
                  if(response.returnCode == 'S')
                    window.localStorage.crm = response.message == 'Y';
                  if ($scope.operation == 3) {
                    window.localStorage.removeItem('gesturePassword');
                    $rootScope.$broadcast('REMOVE_GESTURE_PASSWORD');
                    $ionicHistory.goBack();
                  } else {
                    if (!storageSettingLock.getLock()) {
                      var w = window.innerWidth
                        || document.documentElement.clientWidth
                        || document.body.clientWidth;
                      var config = {
                        height: w * 8 / 10,
                        width: w * 8 / 10,
                        miniHeight: w / 10 * 3,
                        miniWidth: w / 10 * 3,
                        operation: 0,
                        fillStyle: '#fe9073',
                        strokeStyle: '#fe9073',
                        miniFillStyle: '#fe9073',
                        miniStrokeStyle: '#fe9073',
                        outFillStyle: "rgba(254, 144, 115, 0.4)",
                        canvasID: 'setting-container',
                        descID: 'setting-description',
                        resetID: 'setting-reset',
                        miniCanvasID: 'mini-container',
                        haveDelta: true,
                        successInitCallback: function () {
                          var desc = document.getElementById('setting-description');
                          desc.className = '';
                          $rootScope.$broadcast('INIT_GESTURE_PASSWORD');
                          $timeout(function () {
                            $ionicHistory.goBack();
                          }, 500)
                        },
                        successChangeCallback: function () {
                          var desc = document.getElementById('setting-description');
                          desc.className = '';
                          $timeout(function () {
                            $ionicHistory.goBack();
                          }, 500)
                        },
                        successRmLockCallback: function () {
                          var desc = document.getElementById('setting-description');
                          desc.className = '';
                          $rootScope.$broadcast('REMOVE_GESTURE_PASSWORD');
                          $timeout(function () {
                            $ionicHistory.goBack();
                          }, 500)
                        },
                        errorCallback: function () {
                          var desc = document.getElementById('setting-description');
                          desc.className = '';
                          $timeout(function () {
                            desc.className = 'error-description';
                          }, 20);
                        }
                      };
                      storageSettingLock.initLock(config);
                    } else {
                      $scope.lock = storageSettingLock.getLock();
                      $scope.lock.operation = 0;
                      $scope.lock.init();
                    }
                  }
                 /* $state.go("tab.message");*/
                }).error(function (response, status) {
                  $scope.showLoginButton = false;
                  $scope.showButtonIcon = false;
                  window.localStorage.crm = false;
                /*  $state.go("tab.message");*/
                });

              } else {
                $scope.bigPortrait = "build/img/login/login-hand.png";
                $scope.showLoginButton = false;
                $scope.showButtonIcon = false;
                hmsPopup.showPopup('登录失败,请确认密码是否正确!');
              }
            }).error(function (response, status) {
              hmsPopup.hideLoading();
              if (status && status == '401') {
                $scope.bigPortrait = "build/img/login/login-hand.png";
                $scope.showLoginButton = false;
                $scope.showButtonIcon = false;
                hmsPopup.showPopup('登录失败,请确认密码是否正确!');
              } else {
                $scope.bigPortrait = "build/img/login/login-hand.png";
                $scope.showLoginButton = false;
                $scope.showButtonIcon = false;
                hmsPopup.showPopup('登录失败,请确认网络连接是否正常,或者联系管理员');
                if (baseConfig.debug) {
                  console.log("response error " + angular.toJson(response));
                }
              }
            });
          }, 700);
        };
        $scope.login();
      }
    }])
  .factory('storageSettingLock', function () {
    var lock;
    return {
      initLock: function (config) {
        lock = new H5lock(config);
        lock.init();
      },
      getLock: function () {
        return lock;
      }
    }
  }).factory('storageSetting', function () {
    var lock;
    return {
      initLock: function (config) {
        lock = new H5lock(config);
        console.log("测试");
        console.log(config);
        lock.init();
      },
      getLock: function () {
        return lock;
      }
    }
  });
