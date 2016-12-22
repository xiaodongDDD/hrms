// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('myApp', [
  'ionic',
  'pascalprecht.translate',
  'ionic-datepicker',
  'ngCordova',
  'ngSanitize',
  'loginModule',
  'baseConfig',
  'messageModule',
  'contactModule',
  'applicationModule',
  'myInfoModule',
  'utilModule',
  'tsApproveModule',
  'HmsModule',
  'competitorModule',
  'serviceModule',
  'addModule',
  'customerModule',
  'opportunityModule',
  'clueModule'
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
    'TabsService',
    'hmsCacheService',
    'messageService',
    'history',
    'historyContact',
    'historyCompetitor',
    'historyOpportunity',
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
              $ionicHistory,
              TabsService,
              hmsCacheService,
              messageService,
              history,
              historyContact,
              historyCompetitor,
              historyOpportunity
    ) {

      $ionicPlatform.ready(function () {
        history.initDB();//初始化客户数据库
        historyContact.initDB();//初始化客户常用联系人数据库
        historyCompetitor.initDB();//初始化竞争对手查询数据库
        historyCompetitor.initDB();//初始化竞争对手查询数据库
        historyOpportunity.initDB();//初始化商机查询数据库
        try{
          navigator.splashscreen.hide();
        }catch(e){
        }

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }

        //全局的返回上一个页面的函数
        $rootScope.$hmsGoBack = function(backCount) {
          if(baseConfig.debug){
            console.log('TabsService.getManualReturnFlag()' + TabsService.getManualReturnFlag())
          }
          TabsService.setManualReturnFlag(true);
          if(baseConfig.debug){
            console.log('TabsService.getManualReturnFlag()' + TabsService.getManualReturnFlag())
          }
          $ionicHistory.goBack(backCount);
        };

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
    }]);

angular.module('myApp')
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider',
    '$translateProvider', '$translateStaticFilesLoaderProvider','baseConfig',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider,
              $translateProvider, $translateStaticFilesLoaderProvider,baseConfig) {
      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

      //$ionicConfigProvider.templates.maxPrefetch(15);
      //$ionicConfigProvider.views.swipeBackEnabled(true);

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
      var lang = window.localStorage.lang || 'zh';
      $translateProvider.preferredLanguage(lang);
      $translateProvider.useStaticFilesLoader({
        prefix: 'build/common/i18n/',
        suffix: '.json'
      });
      $stateProvider
      // setup an abstract state for the tabs directive
        .state('login', {
          url: '/login',
          templateUrl: 'build/pages/login/login.html',
          controller: 'loginCtrl'
        })

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

        .state('tab.application', {
          url: '/application',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/application.html',
              controller: 'applicationCtrl'
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
        .state('tab.contactCrm', {
          url: '/contactCrm',
          views: {
            'tab-contactCrm': {
              templateUrl: 'build/pages/contactCrm/contact.html',
              controller: 'contactCrmCtrl'
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

        .state('tab.messageDetail', {
          url: '/messageDetail',
          params: {message: {}},
          views: {
            'tab-message': {
              templateUrl: 'build/pages/message/detail/message-detail.html',
              controller: 'messageDetailCtrl'
            }
          }
        })
        .state('tab.carpooling-create', {
          url: '/carpooling-create',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-create/carpooling-create.html',
              controller: 'CarpoolingCreateCtrl'
            }
          }
        })

        .state('pushDetail', {
          url: '/pushDetail',
          cache: false,
          params: {"detail": {}, "processedFlag": {}, "type": ""},
          templateUrl: 'build/pages/workflow/detail/detail.html',
          controller: 'WorkFLowDetailCtrl'
        })

        .state('tab.myTimesheet', {
          url: '/myTimesheet',
          views: {
            'tab-message': {
              templateUrl: 'build/pages/application/timesheet/query/query.html',
              controller: 'TimeSheetQueryCtrl'
            }
          }
        });

      if (baseConfig.debug) {
        console.log('app.js window.localStorage.appCacheVersion ' + window.localStorage.appCacheVersion);
        console.log('app.js !window.localStorage.appCacheVersion ' + !window.localStorage.appCacheVersion);
        console.log('app.js baseConfig.version.currentVersion ' + baseConfig.version.currentVersion);
      }

      //$xhrFactory('GET','http://localhost:8100/build/pages/application/application.html');

      //$templateRequest('build/pages/application/application.html',true);
      //$urlRouterProvider.otherwise('/guide'); return;

      if (!window.localStorage.needGuid || window.localStorage.needGuid == "true"
        || !window.localStorage.appCacheVersion || window.localStorage.appCacheVersion != baseConfig.version.currentVersion
        ) {
        if (baseConfig.debug) {
          console.log('app.js into guide ');
        }

        $urlRouterProvider.otherwise('/guide');
        window.localStorage.appCacheVersion = baseConfig.version.currentVersion;


      } else {
        if (window.localStorage.token && window.localStorage.token != "") {
          if (window.localStorage.getItem('gesturePassword') && window.localStorage.getItem('gesturePassword') != '') {
            $urlRouterProvider.otherwise('/gesture-lock');
          } else {
            $urlRouterProvider.otherwise('/tab/message');
          }
        } else {
          $urlRouterProvider.otherwise('/login');
        }
      }

    }]);

