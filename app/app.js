// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('myApp', [
  'ionic',
  'ionic-datepicker',
  'ngCordova',
  'loginModule',
  'baseConfig',
  'messageModule',
  'contactModule',
  'applicationModule',
  'myInfoModule',
  'utilModule',
  'tsApproveModule',
  'HmsModule'
]);

angular.module('myApp')
  .run([
    '$ionicPlatform',
    '$timeout',
    'baseConfig',
    'checkVersionService',
    '$state',
    'imService',
    'hmsJpushService',
    'sqliteService',
    'hmsPopup',
    '$cordovaTouchID',
    '$location',
    '$rootScope',
    '$ionicHistory',
    function ($ionicPlatform,
              $timeout,
              baseConfig,
              checkVersionService,
              $state,
              imService,
              hmsJpushService,
              sqliteService,
              hmsPopup,
              $cordovaTouchID,
              $location,
              $rootScope,
              $ionicHistory) {

      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }

        // if(ThreeDeeTouch){}
        // ThreeDeeTouch.configureQuickActions([
        //   {
        //     type: 'checkin', // optional, but can be used in the onHomeIconPressed callback
        //     title: 'timesheet填写', // mandatory
        //     subtitle: '快速填写timesheet', // optional
        //     iconType: 'compose' // optional
        //   }
        // ]);
        //
        // ThreeDeeTouch.isAvailable(function (avail) {
        //   // alert("avail? " + avail)
        //   ThreeDeeTouch.onHomeIconPressed = function(payload) {
        //     if(baseConfig.debug){
        //       console.log("Icon pressed. Type: " + payload.type + ". Title: " + payload.title + ".");
        //     }
        //     if (payload.type == 'checkin') {
        //       $state.go('tab.myTimesheet');
        //     } else if (payload.type == 'saved') {
        //       $state.go('tab.tsApproveList');
        //     } else {
        //       // wrapping in a timeout, otherwise it collides with the splashscreen
        //       setTimeout(function() {
        //         // alert(JSON.stringify(payload));
        //       }, 500);
        //     }
        //   }
        // });

        /*var analyze = function (currentState) {
         if (currentState.views) {
         if (currentState.views['tab-application']) {
         return 'tab.tab-application-';
         } else if (currentState.views['tab-message']) {
         return 'tab.tab-message-';
         } else if (currentState.views['tab-contact']) {
         return 'tab.tab-contact-';
         } else if (currentState.views['tab-myInfo']) {
         return 'tab.tab-myInfo-';
         }
         }
         return '';
         };

         var goToPushDetail = function () {
         $state.go(analyze($state.current) + 'pushDetail', {content: {"stateName": $state.current}});
         };
         $timeout(function () {
         goToPushDetail();
         },10000);
         */

        hmsJpushService.init($state);
        sqliteService.buildExpenseSql();

        $timeout(function () {
          if (baseConfig.debug) {
            hmsPopup.showPopup('window.localStorage.token ' + window.localStorage.token);
            hmsPopup.showPopup('window.localStorage.access_token ' + window.localStorage.access_token);
          }
          if (!window.localStorage.token || window.localStorage.token == '') {
          } else {
            checkVersionService.checkAppVersion();
          }

          var initImChatList = function () {
            var newImParams = {
              "userId": window.localStorage.empno,
              "access_token": window.localStorage.token,
              "RCToken": window.localStorage.access_token,
              "businessUrl": baseConfig.pluginBusinessPath
            };
            if (baseConfig.debug) {
              hmsPopup.showPopup('newImParams ' + angular.toJson(newImParams));
            }
            if (HandIMPlugin) {
              HandIMPlugin.getChatList(function success(msg) {
                if (baseConfig.debug) {
                  console.log('HandIMPlugin.getChatList success!');
                }
                return msg;
              }, function error(error) {
                if (baseConfig.debug) {
                  console.log('HandIMPlugin.getChatList error!');
                }
              }, newImParams);
            }
          };

          if (!window.localStorage.access_token || window.localStorage.access_token == '' || !window.localStorage.token || window.localStorage.token == '') {
          } else {
            if (ionic.Platform.isWebView()) {
              initImChatList();
            }
          }
        });

        var rootConfig = {
          dbName: baseConfig.dbName,
          dbLocation: 0,
          appRootFile: 'helloCordova'
        };

        if (ionic.Platform.isWebView()) {
        }
      });

      $ionicPlatform.registerBackButtonAction(function (e) {
        //判断处于哪个页面时双击退出,袁梦添加
        if ($location.path() == '/tab/message'||$location.path() == '/tab/application'||$location.path() == '/tab/contact'||
          $location.path() == '/tab/myInfo'||$location.path() == '/login'||$location.path() == '/gesture-lock') {
          if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            hmsPopup.showVeryShortCenterToast('再次点击返回键退出应用!');
            setTimeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 1500);
          }
        }
        else if ($ionicHistory.backView()) {
          $ionicHistory.goBack();
        }
        e.preventDefault();
        return false;
      }, 101);
    }]);

angular.module('myApp')
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider', 'baseConfig',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, baseConfig) {
      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

      $httpProvider.interceptors.push('httpRequestHeader');//注册过滤器
      //$httpProvider.interceptors[0] = $httpProvider.interceptors[0] + "access_token=" + window.localStorage.token;
      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('standard');

      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('center');

      //$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');

      $stateProvider
      // setup an abstract state for the tabs directive
        .state('tab', {
          url: '/tab',
          caches: true,
          abstract: true,
          templateUrl: 'build/pages/tab/tabs.html',
          controller: 'TabsCtrl'
        })

        // Each tab has its own nav history stack:
        .state('tab.message', {
          url: '/message',
          views: {
            'tab-message': {
              templateUrl: 'build/pages/message/message.html',
              controller: 'messageCtrl'
            }
          }
        })

        .state('tab.messageDetail', {
          url: '/messageDetail',
          params: {message: {}},
          views: {
            'tab-message': {
              templateUrl: 'build/pages/message/detail/messageDetail.html',
              controller: 'messageDetailCtrl'
            }
          }
        })

        .state('tab.myTimesheet', {
          url: '/myTimesheet',
          views: {
            'tab-message': {
              templateUrl: 'build/pages/application/timesheet/query/query.html',
              controller: 'TimeSheetQueryCtrl'
            }
          }
        })

        .state('tab.contact', {
          url: '/contact',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/contact.html',
              controller: 'ContactCtrl'
            }
          }
        })

        .state('tab.application', {
          url: '/application',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/application.html',
              controller: 'applicationCtrl'
            }
          }
        })

        .state('tab.myInfo', {
          url: '/myInfo',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/myInfo.html',
              controller: 'myInfoCtrl'
            }
          }
        })

        .state('guide', {
          url: '/guide',
          templateUrl: 'build/pages/guide/guide.html',
          controller: 'guideCtrl'
        })

        .state('pushDetail', {
          url: '/pushDetail',
          cache: false,
          params: {"detail": {}, "processedFlag": {}, "type": ""},
          templateUrl: 'build/pages/workflow/detail/detail.html',
          controller: 'WorkFLowDetailCtrl'
        })

        .state('login', {
          url: '/login',
          templateUrl: 'build/pages/login/login.html',
          controller: 'loginCtrl'
        });

      if (!window.localStorage.needGuid || window.localStorage.needGuid == "true") {
        $urlRouterProvider.otherwise('/guide');
      } else {
        if (window.localStorage.token && window.localStorage.token != "") {
          if( window.localStorage.getItem('gesturePassword') &&window.localStorage.getItem('gesturePassword') != ''){
            $urlRouterProvider.otherwise('/gesture-lock');
          } else {
            $urlRouterProvider.otherwise('/tab/message');
          }
        } else {
          $urlRouterProvider.otherwise('/login');
        }
      }

    }]);
