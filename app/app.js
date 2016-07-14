// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('myApp', [
  'ionic',
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
    function ($ionicPlatform,
              $timeout,
              baseConfig,
              checkVersionService,
              $state,
              imService,
              hmsJpushService,
              sqliteService) {

      if (window.localStorage.token === '' || angular.isUndefined(window.localStorage.token)) {
      } else {
        checkVersionService.checkAppVersion();
      }

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
        $timeout(function () {
          goToPushDetail();
        },20000);
        $timeout(function () {
          goToPushDetail();
        },30000);
        $timeout(function () {
          goToPushDetail();
        },40000);*/

        hmsJpushService.init($state);
        sqliteService.buildExpenseSql();

        if (window.localStorage.access_token === '' || angular.isUndefined(window.localStorage.access_token)) {
        } else {
          if (ionic.Platform.isWebView()) {
            imService.getImChatList();
          }
        }

        var rootConfig = {
          dbName: baseConfig.dbName,
          dbLocation: 0,
          appRootFile: 'helloCordova'
        };

        if (ionic.Platform.isWebView()) {

        }
      });
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

      if(!window.localStorage.needGuid || window.localStorage.needGuid =="true"){
        $urlRouterProvider.otherwise('/guide');
      }else{
        if (window.localStorage.token && window.localStorage.token != "") {
          $urlRouterProvider.otherwise('/tab/message');
        } else {
          $urlRouterProvider.otherwise('/login');
        }
      }

    }]);
