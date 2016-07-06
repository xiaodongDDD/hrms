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
  .run(function ($ionicPlatform, $timeout, baseConfig, checkVersionService, $state) {
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
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

      if (window.plugins.jPushPlugin) {
        var getRegistrationID = function () {
          window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
        };
        var onGetRegistrationID = function (data) {
          try {
            //alert("JPushPlugin:registrationID is " + angular.toJson(data));
            if (data.length == 0) {
              var t1 = window.setTimeout(getRegistrationID, 1000);
            }
          } catch (exception) {
            console.log(exception);
          }
        };
        var initiateUI = function () {
          try {
            window.plugins.jPushPlugin.init();
            getRegistrationID();
            if (device.platform != "Android") {
              window.plugins.jPushPlugin.setDebugModeFromIos();
              window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
            } else {
              window.plugins.jPushPlugin.setDebugMode(true);
              window.plugins.jPushPlugin.setStatisticsOpen(true);
            }
          } catch (exception) {
            console.log(exception);
          }
          try {
            var alias = '3705';
            var tags = [];
            tags.push('3705');
            window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
          } catch (exception) {
            console.log(exception);
          }
        };

        var onOpenNotification = function (event) {
          try {
            var alertContent;
            if (device.platform == "Android") {
              alertContent = window.plugins.jPushPlugin.openNotification.alert;
            } else {
              alertContent = event.aps.alert;
            }
            //alert("open Notification:" + alertContent);
            $state.go('tab.myTimesheet');

          } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
          }
        };
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
        initiateUI();
      }
      var rootConfig = {
        dbName: baseConfig.dbName,
        dbLocation: 0,
        appRootFile: 'helloCordova'
      };
      if (ionic.Platform.isWebView()) {

        // alert(".....  "+window.sqlitePlugin);
        // alert(window.sqlitePlugin.openDatabase);
        // alert(LocalFileSystem);
        /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
         // 获取路径
         baseConfig.appRootPath = fileSys.root.toURL() + '/' + baseConfig.appRootFile + '/';
         //showMessage(baseConfig.appRootPath+' - '+ fileSys.root.toURL() );
         //The folder is created if doesn't exist
         fileSys.root.getDirectory(baseConfig.appRootFile, {create: true, exclusive: false},
         function (directory) {
         },
         function (error) {
         alert(error);
         });
         });*/

        var db = window.sqlitePlugin.openDatabase({
          name: baseConfig.dbName,
          createFromLocation: 1,
          location: baseConfig.dbLocation
        });
        db.transaction(function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS MOBILE_EXP_REPORT_LINE \
                    (line_id integer primary key AUTOINCREMENT,\
                    expenseObject_id INTEGER,\
                    expenseObject_code TEXT,\
                    expenseObject_desc TEXT,\
                    expenseObject_type TEXT,\
                    costObject_id TEXT,\
                    costObject_desc TEXT,\
                    expense_type_id INTEGER,  \
                    expense_type_desc TEXT,   \
                    expense_item_id INTEGER,\
                    expense_item_code TEXT,\
                    expense_item_desc TEXT,\
                    expense_apply_id TEXT,\
                    expense_apply_desc TEST,\
                    expense_price INTEGER,\
                    expense_quantity INTEGER,\
                    currency_code TEXT,\
                    currency_code_desc text,\
                    invoice_quantity INTEGER,\
                    exchange_rate INTEGER,\
                    total_amount INTEGER,\
                    expense_date_from TEXT,\
                    expense_date_to TEXT,\
                    expense_place Text ,\
                    description TEXT,\
                    local_status TEXT,\
                    service_id INTEGER,\
                    creation_date  TEXT ,\
                    created_by TEXT,\
                    timestamp TEXT,\
                    segment_1 INTEGER,\
                    segment_2 INTEGER,\
                    segment_3 INTEGER,\
                    segment_4 INTEGER,\
                    segment_5 INTEGER,\
                    segment_6 TEXT,\
                    segment_7 TEXT,\
                    segment_8 TEXT ,\
                    segment_9 TEXT,\
                    segment_10 TEXT )'
          );
          tx.executeSql('CREATE TABLE IF NOT EXISTS MOBILE_EXP_LINE_PHOTOS (' +
            'photo_id integer primary key, ' +
            'line_id integer, ' +
            'photo_name text,' +
            'photo_src text,' +
            'creation_date text,' +
            'created_by integer)'
          );
        });
      }
    });
  });

angular.module('myApp')
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider', 'baseConfig',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, baseConfig) {
      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

      $httpProvider.interceptors.push('httpRequestHeader');//注册过滤器
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

        .state('login', {
          url: '/login',
          templateUrl: 'build/pages/login/login.html',
          controller: 'loginCtrl'
        });

      $urlRouterProvider.otherwise('/guide');
    }]);
