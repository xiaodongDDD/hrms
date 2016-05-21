angular.module("baseConfig", [])
.constant("baseConfig", {"debug":false,"isMobilePlatform":false,"clearTable":true,"nativeScreenFlag":false,"basePath":"http://wechat.hand-china.com/hmbms_hand/api","currentVersion":"2.0.0","url":"","pkgIdentifier":"","versionName":"此版本为UAT测试环境 2.0.0","appEnvironment":"UAT"});

/**
 * Created by gusenlin on 16/5/16.
 */
'use strict';
//注册请求过滤器
angular.module('utilModule',[]).factory('httpRequestHeader', function () {
  var interceptor = {
    'request': function (config) {
      if (window.localStorage.token && window.localStorage.userName) {
        var timestamp = new Date().getTime();
        var token = CryptoJS.MD5(window.localStorage.token + timestamp);
        config.headers.timestamp = timestamp;
        config.headers.token     = token;
        config.headers.loginName = window.localStorage.userName;
      }
      return config;
    }
  };

  return interceptor;
});

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var loginModule = angular.module('loginModule', []);
var messageModule = angular.module('messageModule', []);
var contactModule = angular.module('contactModule', []);
var applicationModule = angular.module('applicationModule', []);
var myInfoModule = angular.module('myInfoModule', []);
var tsApproveModule = angular.module('tsApproveModule', []);

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
  'tsApproveModule'
]);

angular.module('myApp')
  .run(function ($ionicPlatform) {
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

    });
  });

angular.module('myApp')
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
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
          templateUrl: 'build/pages/tab/tabs.html'
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
          url: '/guide',
          templateUrl: 'build/pages/login/login.html',
          controller: 'loginCtrl'
        })

        .state('tab.tsApproveList', {
          url: 'application/tsApproveList',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timeSheet-approve/list/tsApproveList.html',
              controller: 'tsApproveListCtrl'
            }
          }
        })
        .state('tab.tsApproveDetail', {
          url: 'application/tsApproveDetail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timeSheet-approve/detail/tsApproveDetail.html',
              controller: 'tsApproveDetailCtrl'
            }
          }
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/guide');

    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
//应用模块
angular.module('applicationModule')

  .controller('applicationCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    function ($scope,
              $state,
              baseConfig) {

      //个人办公
      $scope.officeApp = [
        {
          appName: "会议管理",
          imageUrl: "build/img/application/meetingManage@3x.png",
          destUrl: "",
        },
        {
          appName: "个人申请",
          imageUrl: "build/img/application/meetingManage@3x.png",
          destUrl: "",
        },
        {
          appName: "报表分析",
          imageUrl: "build/img/application/meetingManage@3x.png",
          destUrl: "",
        },
        {
          appName: "人事政策",
          imageUrl: "build/img/application/meetingManage@3x.png",
          destUrl: "",
        },
        {
          appName: "假期管理",
          imageUrl: "build/img/application/holidayManage@3x.png",
          destUrl: "",
        },
        {
          appName: "Timesheet填写",
          imageUrl: "build/img/application/timesheet@3x.png",
          destUrl: "",
        },{
          appName: "Timesheet填写",
          imageUrl: "build/img/application/timesheet@3x.png",
          destUrl: "",
        },
        {
          appName: "Timesheet审批",
          imageUrl: "build/img/application/timesheetExamine@3x.png",
          destUrl: "tab.tsApproveList",
        },
        {
          appName: "",
          imageUrl: "",
          destUrl: "",
        }
      ];

      //项目门户
      $scope.projectApp = [
        {
          appName: "机票预定",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "代办事项",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "报销单查询",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "首款查询",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "外勤汇报",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "",
          imageUrl: "",
          destUrl: "",
        },
        {
          appName: "",
          imageUrl: "",
          destUrl: "",
        },
        {
          appName: "",
          imageUrl: "",
          destUrl: "",
        }
      ];

      //员工社区
      $scope.employeeApp = [
        {
          appName: "在线培训",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "知识门户",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "新闻",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        },
        {
          appName: "分享社区",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
        }
      ];

      $scope.goPage = function (appItem) {
        if (baseConfig.debug) {
          console.log("appItem " + angular.toJson(appItem));
        }
        $state.go(appItem.destUrl);
      };

      console.log('applicationCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('applicationCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('applicationCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('contactModule')

  .controller('contactCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {
      console.log('contactCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('contactCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('contactCtrl.$destroy');
      });
    }]);

/**
<<<<<<< HEAD
=======
 * Created by gusenlin on 16/5/16.
 */
angular.module('loginModule')

  .controller('guideCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {

      console.log('loginCtrl.enter');

      $scope.toLogin = function () {
        console.log("跳过导航页到登陆页");
        $state.go("login");
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('guideCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('guideCtrl.$destroy');
      });
    }]);

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
    function ($scope,
              $state,
              baseConfig,
              $ionicLoading,
              $http) {

      $scope.loginData = {};
      $scope.currentVersionNum = baseConfig.currentVersion;

      console.log('loginCtrl.enter');

      $scope.savePassword = function () {
        $scope.checkbox_savePwd = !$scope.checkbox_savePwd;//取反 记住密码框的状态
        console.log("此时密码框的状态为 :", angular.toJson($scope.checkbox_savePwd));
        if ($scope.loginData.password !== "") {
          if ($scope.checkbox_savePwd === true) {
            window.localStorage.password = $scope.loginData.password;
          } else {
            window.localStorage.password = "";
          }
        }
      };

      $scope.doLogin = function () {
        window.localStorage.empno = $scope.loginData.username;
        if ($scope.checkbox_savePwd) {
          window.localStorage.password = $scope.loginData.password;
        } else {
          window.localStorage.password = "";
        }
        $ionicLoading.show({
          template: 'Loading...'
        });

        var url = baseConfig.basePath + "/appLogin/user_login/login";
        var params = '{"params":{"p_user_name":"' + $scope.loginData.username +
          '","p_password":"' + $scope.loginData.password + '"}}';

        $http.post(url, params).success(function (result) {
          $ionicLoading.hide();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }

          if (result.con_status == "S") {
            window.localStorage.token = result.pre_token + result.token_key;
            window.localStorage.empno = $scope.loginData.username;
            $state.go("tab.message");
          }

        }).error(function (response, status) {
          $ionicLoading.hide();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('loginCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('loginCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    function ($scope,
              $state,
              $timeout) {

      $scope.messageList = [
        {
          user: "模版1",
          content: "内容1"
        },
        {
          user: "模版2",
          content: "内容2"
        },
        {
          user: "模版3",
          content: "内容3"
        },
        {
          user: "模版4",
          content: "内容4"
        },
        {
          user: "模版5",
          content: "内容5"
        },
        {
          user: "模版6",
          content: "内容6"
        },
        {
          user: "模版7",
          content: "内容7"
        },
        {
          user: "模版8",
          content: "内容8"
        },
        {
          user: "模版9",
          content: "内容9"
        },
        {
          user: "模版10",
          content: "内容10"
        }
      ];

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function(){
        $timeout(function(){
          $scope.$broadcast("scroll.refreshComplete");
        },2000);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });

    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {

      console.log('myInfoCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('myInfoCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('myInfoCtrl.$destroy');
      });
    }]);

/**
>>>>>>> daiwen-1.0.0
 * Created by gusenlin on 16/4/24.
 */

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    function ($scope,
              $state,
              $stateParams,
              $ionicHistory) {

      var message = $stateParams.message;
      console.log('message : ' + angular.toJson(message));

      $scope.message = message;

      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageDetailCtrl.$ionicView.enter');
      });
      console.log('messageDetailCtrl.enter');

      $scope.$on('$destroy', function (e) {
        console.log('messageDetailCtrl.$destroy');
      });
    }]);

/**
 * Created by wolf on 2016/5/21. (_wen.dai_)
 */
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {

      console.log('myInfoCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('myInfoCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('myInfoCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    function ($scope,
              $state,
              $timeout) {

      $scope.messageList = [
      ];

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function(){
        $timeout(function(){
          $scope.$broadcast("scroll.refreshComplete");
        },2000);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });

    }]);

/**
 * Created by gusenlin on 16/4/24.
 */

/**
 * Created by gusenlin on 16/5/16.
 */
angular.module('loginModule')

  .controller('guideCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {

      console.log('loginCtrl.enter');

      $scope.toLogin = function () {
        console.log("跳过导航页到登陆页");
        $state.go("login");
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('guideCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('guideCtrl.$destroy');
      });
    }]);

'use strict';
//应用-timeSheet审批模块-详情
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory) {

    $scope.$on('$ionicView.enter', function (e) {
      console.log('tsApproveListCtrl.$ionicView.enter');
    });

    $scope.$on('$destroy', function (e) {
      console.log('tsApproveListCtrl.$destroy');
    });
  }]);


/**
 * Created by wolf on 2016/5/19.
 * @author: wen.dai@hand-china.com
 *
 */
'use strict';
//应用-timeSheet审批模块-列表
angular.module('tsApproveModule')
  .controller('tsApproveListCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {

      $scope.goApproveDetail = function () {
          $state.go('tab.tsApproveDetail');
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('tsApproveListCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('tsApproveListCtrl.$destroy');
      });

    }]);
