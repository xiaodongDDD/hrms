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
  .run(function ($ionicPlatform, $timeout, baseConfig, $http, $ionicPopup) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.plugins.jPushPlugin) {
        var getRegistrationID = function () {
          window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
        };
        var onGetRegistrationID = function (data) {
          try {
            alert("JPushPlugin:registrationID is " + angular.toJson(data));
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
        initiateUI();
      }

      if (ionic.Platform.isWebView()) {
        // alert(".....  "+window.sqlitePlugin);
        // alert(window.sqlitePlugin.openDatabase);
        // alert(LocalFileSystem);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
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
        });

        var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: 0});

        db.transaction(function (tx) {
          tx.executeSql(' CREATE TABLE IF NOT EXISTS MOBILE_EXP_REPORT_LINE \
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

    //var url = baseConfig.businessPath + '/common_info/get_last_version',
    var url = 'http://wechat.hand-china.com/hmbms_hand/api/dataEngine/common_info/get_last_version',
      checkVersionParams = {'params': {'p_platform': ionic.Platform.isAndroid() ? 'Android' : 'iPhone'}};
    var serveVersionParams = {
      minVersion: '',
      bigVersion: '',
      minUpdateUrl: '',
      bigUpdateUrl: '',
      updateContent: ''
    };

    function checkAppVersion() {
      var promise = $http.post(url, checkVersionParams).success(function (response) {
        serveVersionParams.bigVersion = response.version_num;
        serveVersionParams.bigUpdateUrl = response.download_url;
        serveVersionParams.minVersion = response.sub_version_num;
        serveVersionParams.minUpdateUrl = response.sub_download_url; //for temp test!!
        try {
          serveVersionParams.updateContent = response.sub_download_desc.replace(/\\n/g, '<br>');
        } catch (e){
          serveVersionParams.updateContent = '';
        }
        if (serveVersionParams.bigVersion > baseConfig.version.currentVersion) {
          // update from pgy
          var confirmPopup = $ionicPopup.confirm({
            title: '大版本更新',
            template: '<div>' + serveVersionParams.updateContent + '</div>',
            okText: '确定',
            cancelText: '取消'
          });
          confirmPopup.then(function (res) {
            if (res) {
              window.open(serveVersionParams.bigUpdateUrl, '_system', 'location=yes');
              return;
            } else {
              return;
            }
          });
        } else {
          if (serveVersionParams.minVersion > baseConfig.version.currentSubVersion) {
            // update from hotpatch
            var confirmPopupSamll = $ionicPopup.confirm({
              title: '小版本更新',
              template: '<div>' + serveVersionParams.updateContent + '</div>',
              okText: '确定',
              cancelText: '取消'
            });
            confirmPopupSamll.then(function (res) {
              if (res) {
                hotpatch.updateNewVersion(serveVersionParams.minUpdateUrl);
                return;
              } else {
                return;
              }
            });
          }
        }
      }).error(function () {
      });
    }

    checkAppVersion();
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

        .state('tab.contact', {
          url: '/contact',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/contact.html',
              controller: 'contactCtrl'
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

      // if none of the above states are matched, use this as the fallback
      if (window.localStorage.token && window.localStorage.token != "") {
        //$urlRouterProvider.otherwise('/tab/message');
        $urlRouterProvider.otherwise('/tab/message');
      } else {
        if (!window.localStorage.needGuide || window.localStorage.needGuide == 'Y') {
          $urlRouterProvider.otherwise('/guide');
          window.localStorage.needGuide = 'N'
        } else {
          $urlRouterProvider.otherwise('/login');
        }
      }
    }]);
