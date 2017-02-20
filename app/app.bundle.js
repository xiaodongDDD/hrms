// Ionic Starter App
alert('app.ionic');
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'northGas' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('northGas', [
  'ionic',
  'ionicLazyLoad',
  'ngCordova',
  'ngSanitize',
  'base.config',
  'northGas.login',
  'northGas.gas',
  'northGas.customDirective',
  'northGas.customService',
  'northGas.customFilter',
  'northGas.store',
  'northGas.classify',
  'northGas.shoppingCart',
  'northGas.mine',
  'northGas.message',
  'northGas.gasStop',
  'northGas.nearby',
  'northGas.navigation'
]);

angular.module('northGas')

.run(['$ionicPlatform', '$state', '$rootScope', 'bjgasJpush', '$ionicHistory', '$ionicTemplateCache', '$timeout', '$cordovaKeyboard', 'switchUser', 'checkVersion', 'bjgasPopup',
  function($ionicPlatform, $state, $rootScope, bjgasJpush, $ionicHistory, $ionicTemplateCache, $timeout, $cordovaKeyboard, switchUser, checkVersion, bjgasPopup) {

    // 双击返回键退出app
    $rootScope._exitClickFlag = false;
    $ionicPlatform.registerBackButtonAction(function(e) {
      var statename = $state.current.name;
      e.preventDefault();

      function showConfirm() {
        if ($rootScope._exitClickFlag !== true) {
          $rootScope._exitClickFlag = true;
          bjgasPopup.showVeryShortCenterToast('再按一次退出程序');
          $timeout(function() {
            $rootScope._exitClickFlag = false;
          }, 500);
        } else {
          ionic.Platform.exitApp();
        }
      }

      if (statename == 'tab.gas' || statename == 'tab.store' ||
        statename == 'tab.classify' || statename == 'tab.shoppingCart' || statename == 'tab.mine') {
        showConfirm();
      } else {
        if ($ionicHistory.backView()) {
          if ($cordovaKeyboard.isVisible()) {
            $cordovaKeyboard.close();
          } else {
            $ionicHistory.goBack();
          }
        }
      }

      return false;
    }, 101);

    $ionicPlatform.ready(function() {
      try {
        navigator.splashscreen.hide();
      } catch (e) {}

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

      bjgasJpush.init();
    });

    function successInfo(res) {
      if (res && res.rows && res.rows.legnth === 0) {
        window.localStorage.currentUserInfoGas = JSON.stringify({
          'userId': '',
          'userCode': '',
          'label': '',
          'meterType': '',
          'address': ''
        });
      } else {
        try {
          window.localStorage.currentUserInfoGas = JSON.stringify(res.rows[res.rows.length - 1]);
        } catch (e) {}
      }
      try {
        switchUser.setUserCount(res.rows.length);
      } catch (e) {}
    }

    function errorInfo() {}

    /**
     * @description:初始化一些基础服务
     */

    if (typeof window.localStorage.currentUserInfoGas === 'object') {
      // console.log(window.localStorage.currentUserInfoGas)
      if (JSON.parse(window.localStorage.currentUserInfoGas).userCode !== '') {} else {
        switchUser.getUserInfoList(successInfo, errorInfo);
      }
    } else {
      if (window.localStorage.userInfo) {
        switchUser.getUserInfoList(successInfo, errorInfo);
      }
    }
    checkVersion.checkAppVersion('INIT');

    $timeout(function() {
      $ionicTemplateCache("pages/mine/tab-mine.html");
      $ionicTemplateCache("pages/classify/tab-classify.html");
    }, 300);

  }
])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // $ionicConfigProvider.scrolling.jsScrolling(false);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    //禁止全部的template
    $ionicConfigProvider.templates.maxPrefetch(0);

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
      templateUrl: 'pages/tab/tabs.html',
      controller: 'TabsCtrl',
    })

    .state('guide', {
      url: '/guide',
      templateUrl: 'pages/guide/guide.html',
      controller: 'FirstGuideCtrl',
      controllerAs: 'FirstGuide'
    })

    // Each tab has its own nav history stack:

    .state('tab.gas', {
      url: '/gas',
      views: {
        'tab-gas': {
          templateUrl: 'pages/gas/tab-gas.html',
          controller: 'GasCtrl',
          controllerAs: 'gas'
        }

      }
    })

    // .state('stop', {
    //     url: '/tab/stop',
    //     templateUrl: 'pages/gas/gas-stop-announce/gas-stop-main.html',
    //     controller: 'gasStopCtrl',
    //     controllerAs: 'gasStop'
    //
    //   })
    .state('tab.nearbyStore', {
        url: '/gas/nearbyStore',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/nearby-store/nearby-stores.html',
            controller: 'nearbyCtrl',
            controllerAs: 'nearbyStore'
          }
        }
      })
      .state('tab.nearbyNavigation', {
        url: '/gas/nearbyStore/Navigation',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/nearby-store/navigation.html',
            controller: 'navigationCtrl',
            controllerAs: 'Navigation'
          }
        }
      })



    .state('tab.store', {
      url: '/store',
      views: {
        'tab-store': {
          templateUrl: 'pages/store/tab-store.html',
          controller: 'StoreCtrl',
          controllerAs: 'store'
        }
      }
    })

    .state('tab.classify', {
      url: '/classify',
      views: {
        'tab-classify': {
          templateUrl: 'pages/classify/tab-classify.html',
          controller: 'ClassifyCtrl',
          controllerAs: 'classify'
        }
      }
    })

    .state('tab.shoppingCart', {
      url: '/shoppingCart',
      views: {
        'tab-shopping-cart': {
          templateUrl: 'pages/shopping-cart/tab-shopping-cart.html',
          controller: 'ShoppingCartCtrl',
          controllerAs: 'shopCart'
        }
      }
    })

    .state('tab.mine', {
      url: '/mine',
      views: {
        'tab-mine': {
          templateUrl: 'pages/mine/tab-mine.html',
          controller: 'MineCtrl',
          controllerAs: 'mine'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    if (window.localStorage.needGuide !== 'false') {
      window.localStorage.needGuide = 'false';
      $urlRouterProvider.otherwise('/guide');
    } else {
      $urlRouterProvider.otherwise('/tab/gas');
    }

  }
]);

(function() {
  'use strict';
  angular.module('northGas.message',[]);
  angular.module('northGas.mine', []);
  angular.module('northGas.login', []);
  angular.module('northGas.store', []);
  angular.module('northGas.shoppingCart', []);
  angular.module('northGas.customService',[]);
  angular.module('northGas.customFilter',[]);
})();

angular.module("base.config", [])
.constant("baseConfig", {"debug":false,"isMobilePlatform":true,"clearTable":true,"nativeScreenFlag":false,"appStoreFlag":false,"basePath":"http://zttest.bjgas.com/bjgas-server/","baseRPath":"http://zttest.bjgas.com/bjgas-server/r/api?sysName=CRM&apiName=","client_id":"a8117f61-0643-43ba-a172-bca68f497051","client_secret":"a376a615-1ba6-453f-8e30-f68ae0b1b3f9","aes_key":"0102030405060708","aes_iv":"0102030405060708","pkgIdentifier":"","appEnvironment":"UAT","dbName":"","dbLocation":0,"appRootPath":"","appRootFile":"","appUpId":"com.bjgas.shop","version":{"currentVersion":"1.0.5","currentversionName":"此版本为内测版本1.0.2","currentSourceVersion":"1.0.5","currentSubVersionName":""}});

(function() {
  'use strict';
  angular.module('northGas.customFilter').filter('defaultImg', function() {
    return function(data) {
      data = data || 'img/gas-p@3x.png';
      return data;
    };
  });
})();

(function() {
  'use strict';
  angular.module('northGas.customFilter').filter('switchUserImg', function() {
    return function(data) {
      try {
        switch (data % 4) {
          case 0:
            data = 'img/gas-b@3x.png';
            break;
          case 1:
            data = 'img/gas-g@3x.png';
            break;
          case 2:
            data = 'img/gas-o@3x.png';
            break;
          case 3:
            data = 'img/gas-p@3x.png';
            break;
          default:
            data = 'img/gas-b@3x.png';
            break;
        }
      } catch (e) {
        data = 'img/gas-b@3x.png';
      }
      return data;
    };
  });
})();

(function() {
  'use strict';
  angular.module('northGas.customFilter').
  filter('meterType', function() {
    return function(data) {
      if (data) {
        data = data === 'R' ? '普表 (后付费)' : '卡表 (预付费)';
      } else {
        data = '暂无';
      }
      return data;
    };
  });
}());

/*
 * @author: daiwen(-shellWolf-)
 * @description: 关于滚动条的一些相关处理
 */
(function() {
  'use strict';
  angular.module('northGas.customDirective', [])
    .directive('scrollHeight', scrollHeight);

  /* @ngInject */
  //动态获取屏幕的高度
  function scrollHeight($window) {
    return {
      restrict: 'AE',
      link: function(scope, element, attr) {
        element[0].style.height = ($window.innerHeight - 2 * 46) + 'px';
      }
    };
  }
})();

// 2016-11-17 created by yufei.lu
// 支持指定样式的backdrop，默认样式同$ionicBackdrop，与默认backdrop是两个不同元素
// 扩展自$ionicBackdrop源码，（Ionic-v1.3.0 ionic.bundle.js line:53493）
(function() {
  "use strict";
  angular.module('northGas.customService')
    .factory('bjgasBackdrop', bjgasBackdrop);

  function bjgasBackdrop($document, $timeout, $$rAF, $rootScope, $ionicClickBlock) {
    var func = {
      /**
       * @ngdoc method
       * @name bjgasBackdrop#setClass
       * @description 通过某个类，覆盖的backdrop的样式，在$ionicView.beforeEnter调用以确保样式生效
       * @param {string} 类名.
       * @returns {boolean} 成功失败
       */
      setClass: setClass,
      /**
       * @ngdoc method
       * @name bjgasBackdrop#setCss
       * @description 通过某个样式对象，覆盖的backdrop的样式，在$ionicView.beforeEnter调用以确保样式生效
       * @param {object} 样式对象.
       * @returns {boolean} 成功失败
       */
      setCss: setCss,
      /**
       * @ngdoc method
       * @name bjgasBackdrop#bindClickCallback
       * @description 绑定backdrop的点击回调.
       * @param {function} .
       */
      bindClickCallback: bindClickCallback,
      /**
       * @ngdoc method
       * @name bjgasBackdrop#unbindClickCallback
       * @description 解绑backdrop的点击回调.
       * @param {function} .
       */
      unbindClickCallback: unbindClickCallback,
      /**
       * @ngdoc method
       * @name bjgasBackdrop#enableClick
       * @description 设定的backdrop是否支持点击消失.
       * @param {boolean} 是否支持点击.
       * @returns {boolean} 成功失败
       */
      enableClick: enableClick,
      /**
       * @ngdoc method
       * @name bjgasBackdrop#retain
       * @description 是否应该显示backdrop。最后，需要显式地调用release来隐藏backdrop
       */
      retain: retain,
      /**
       * @ngdoc method
       * @name bjgasBackdrop#release
       * @description 是否应该隐藏backdrop。由于只存在一个backdrop(单例)，并且用引用计数的方式
       * 去管理backdrop的显示和消失，因此只有当引用计数归零后，才会真正的隐藏。
       * 同理，由于只存在一个backdrop，路由跳转时需要在$ionicView.beforeEnter指定backdrop样式
       * 以免子页面的中设置backdrop样式覆盖掉父级页面。
       */
      release: release
    };

    var _clickFlag = false; //是否允许点击消失。默认值（点击之后消失）
    var _element = angular.element('<div class="backdrop">');
    var _backdropHolds = 0;
    var _cb;

    $ionicClickBlock.show(); //ionic提供的点击事件遮罩
    $document[0].body.appendChild(_element[0]);
    _element.on('click', function() {
      if (_cb && typeof(_cb) === 'function'){
        _cb();
      }
      if (_clickFlag) {
        release();
      }
    });

    return func;

    function bindClickCallback(cb) {
      _cb = cb;
    }

    function unbindClickCallback() {
      _cb = undefined;
    }

    function setClass(className) {
      if (typeof(className) == 'string') {
        _element.addClass(className);
        return true;
      }
      if (baseConfig.debug) {
        console.log('bjgasBackdrop.setClass(): string expected.');
      }
      return false;
    }

    function setCss(styleObject) {
      if (typeof(styleObject) == 'object') {
        for (var i in styleObject) {
          // console.log(i + ':' + styleObject[i]);
          _element.css(i, styleObject[i]);
        }
        return true;
      }
      if (baseConfig.debug) {
        console.log('bjgasBackdrop.setClass(): object expected.');
      }
      return false;
    }

    // backdrop是否支持点击隐藏
    function enableClick(flag) {
      if (typeof(flag) == 'boolean') {
        _clickFlag = flag;
        return true;
      }
      if (baseConfig.debug) {
        console.log('bjgasBackdrop.setClass(): boolean expected.');
      }
      return false;
    }

    function retain() {
      _backdropHolds++;
      if (_backdropHolds === 1) {
        _element.addClass('visible');
        $rootScope.$broadcast('backdrop.shown');
        $$rAF(function() {
          // If we're still at >0 _backdropHolds after async...
          if (_backdropHolds >= 1) _element.addClass('active');
        });
      }
    }

    function release(flag) {
      if (_backdropHolds === 1) {
        _element.removeClass('active');
        if('noBroadcast'===flag){
        }else{
          $rootScope.$broadcast('backdrop.hidden');
        }
        $timeout(function() {
          // If we're still at 0 _backdropHolds after async...
          if (_backdropHolds === 0) {
            _element.removeClass('visible');
            $ionicClickBlock.hide();
          }
        }, 400);
      }
      _backdropHolds = Math.max(0, _backdropHolds - 1);
    }

    function getElement() {
      return _element;
    }
  }
}());

(function() {
  'use strict';
  angular.module('northGas.customService')
    .factory('checkVersion', checkVersion);

  /* @ngInject */
  function checkVersion(baseConfig, bjgasPopup, bjgasHttp) {
    var checkVersionUrl = baseConfig.basePath + 'c/api/getAppVersion/' + (ionic.Platform.isAndroid() ? 'Android' : 'iOS');
    var localVersion = baseConfig.version.currentVersion;
    var serveVersionParams = {
      minVersion: '',
      maxVersion: '',
      appUrl: '',
      sourceVersion: '',
      sourceUrl: '',
      updateContent: ''
    };

    function updateFromAppUrl(buttonIndex) { // update from 北燃网页平台
      if (buttonIndex === 1) { //确认按钮
        window.open(serveVersionParams.appUrl, '_system', 'location=yes');
      } else { //取消按钮
        return;
      }
    }

    //进行本地版本与service各类版本的对比
    function dealVersionUtil(serveVersion, newName) {
      if (localVersion < serveVersion.minVersion) {
        //大版本强制更新
        window.open(serveVersion.appUrl, '_system', 'location=yes');
      } else if (serveVersion.minVersion <= localVersion &&
        localVersion < serveVersion.maxVersion) {
        //大版本选择更新
        if (ionic.Platform.isWebView()) {
          bjgasPopup.confirm(serveVersion.updateContent, updateFromAppUrl);
        } else {
          alert(serveVersion.updateContent);
        }
      } else if (localVersion === serveVersion.maxVersion &&
        localVersion > serveVersion.minVersion) {
        if (baseConfig.version.currentSourceVersion < serveVersion.sourceVersion) {
          //小版本热更新
          try {
            hotpatch.updateNewVersion(serveVersion.sourceUrl);
          } catch (e) {} finally {}
        } else {
          if (newName === 'MY_INFO')
            if (ionic.Platform.isWebView()) {
              bjgasPopup.showShortCenterToast('当前为最新版本');
            } else {
              alert('当前为最新版本');
            }
        }
      } else {
        if (newName === 'MY_INFO')
          if (ionic.Platform.isWebView()) {
            bjgasPopup.showShortCenterToast('当前为最新版本');
          } else {
            alert('当前为最新版本');
          }
      }
    }

    function checkAppVersion(nameFlag) {
      bjgasHttp.get(checkVersionUrl).success(function(res) {
        try {
          serveVersionParams.minVersion = res.rows[0].minVersion;
          serveVersionParams.appUrl = res.rows[0].appUrl;
          serveVersionParams.maxVersion = res.rows[0].maxVersion;
          serveVersionParams.sourceUrl = res.rows[0].sourceUrl;
          serveVersionParams.sourceVersion = res.rows[0].sourceVersion;
          serveVersionParams.updateContent = res.rows[0].description.replace(/\\n/g, '\r\n');
        } catch (e) {}

        dealVersionUtil(serveVersionParams, nameFlag);
      });
    }

    return {
      checkAppVersion: checkAppVersion
    };

  }
}());

(function() {
  'use strict';
  angular.module('northGas.customService')
    .factory('bjgasHttp', bjgasHttp);

  /* @ngInject */
  function bjgasHttp($http, $state, baseConfig, bjgasPopup, $rootScope) {
    var destUrl = '';
    var netRequest = {
      goBackLogin: goBackLogin,
      isSuccessfull: isSuccessfull,
      postNoToken: postNoToken,
      post: post,
      getNoToken: getNoToken,
      get: get
    };
    return netRequest;

    //如果登录令牌失效，跳转回登录界面
    function goBackLogin(state) {
      bjgasPopup.hideLoading();
      $rootScope.$broadcast('REFRESH_LOGIN');
      // state.go('login');
    }

    function isSuccessfull(status) {
      if (status == 'S' || status == 'SW') {
        return true;
      } else {
        return false;
      }
    }

    function errorInfoPrompt(response, status) {
      bjgasPopup.hideLoading();
      //
      if(response && typeof(response) === 'object' && response.error === 'invalid_token'){
        bjgasPopup.showShortCenterToast('登录失效，请尝试重新登录');
      } else if (status == '401') {

      } else if (status == '404') {
        bjgasPopup.showShortCenterToast('后端服务器请求失败,请联系管理员!');
      } else {
        bjgasPopup.showShortCenterToast('处理请求失败,请确认网络连接是否正常!');
      }
    }

    function postNoToken(url, paramter) {
      destUrl = url;
      var postNoAuth = $http.post(destUrl, paramter).success(function(response) {}).error(errorInfoPrompt);
      return postNoAuth;
    }

    function post(url, paramter) {
      destUrl = url;
      if (destUrl.indexOf('/c/api') !== -1) {
        return postNoToken(destUrl, paramter);
      } else {
        var post = $http.post(destUrl, paramter, {
          headers: {
            'Content-type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + window.localStorage.token
          }
        }).success(function(response) {}).error(errorInfoPrompt);
        return post;
      }
    }

    function getNoToken(url) {
      destUrl = url;
      var getNoAuth = $http.get(destUrl).success(function(response) {}).error(errorInfoPrompt);
      return getNoAuth;
    }

    function get(url) {
      destUrl = url;
      if (destUrl.indexOf('/c/api') !== -1) {
        return getNoToken(destUrl);
      } else {
        var get = $http({
          method: 'GET',
          headers: {
            'Content-type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + window.localStorage.token
          },
          url: destUrl
        }).success(function(response) {}).error(errorInfoPrompt);
        return get;
      }
    }
  }
})();

(function() {
  'use strict';
  angular.module('northGas.customService')
    .factory('bjgasJpush', bjgasJpush);

  /* @ngInject */
  function bjgasJpush(baseConfig, bjgasHttp) {

    var jpushBox = {
      init: initiateUI,
      setTagAlias: setTagAlias,
      stopPush: stopPush,
      resumePush: resumePush
    };

    var __getRegistrationID = function() {
      window.plugins.jPushPlugin.__getRegistrationID(__onGetRegistrationID);
    };

    var __onGetRegistrationID = function(data) {
      try {
        if (data.length === 0) {
          var t1 = window.setTimeout(__getRegistrationID, 1000);
        }
        if (baseConfig.debug) {
          alert('测试--注册成功--ID为:', data);
        }
      } catch (exception) {}
    };

    var __changeBadgeNumber = function() {
      window.plugins.jPushPlugin.getApplicationIconBadgeNumber(function(data) {
        var badgeNumber;
        if (parseInt(data) > 0) {
          badgeNumber = parseInt(data) - 1;
        } else {
          badgeNumber = 0;
        }
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(badgeNumber);
        window.plugins.jPushPlugin.setBadge(badgeNumber);
      });
    };

    var __callMessageSuccess = function(result) {
      if (result.returnCode == 'S') {
        if (ionic.Platform.isIOS()) {
          __changeBadgeNumber();
        }
      }
    };

    var __callMessageError = function(response) {};

    var __readMessage = function(messageId) {
      var url = baseConfig.basePath + '';
      var messageList = [{
        'messageId': messageId,
        'actionCode': 'change'
      }];
      var params = {
        'employeeCode': window.localStorage.empno,
        'interfaceCode': 'process',
        'messageList': messageList
      };
      bjgasHttp.post(url, params).success(function(result) {
        __callMessageSuccess(result);
      }).error(function(response, status) {
        __callMessageError(response);
      });
    };

    var __onOpenNotification = function(event) {
      try {
        var alertContent;
        var result;
        var detail;
        var messageId = '';
        var messageType = '';

        if (device.platform === 'Android') {
          messageId = window.plugins.jPushPlugin.openNotification.extras.message_id;
          messageType = window.plugins.jPushPlugin.openNotification.extras.message_type;

          alertContent = window.plugins.jPushPlugin.openNotification.alert;
          result = {
            'type': typeof(window.plugins.jPushPlugin),
            'value': window.plugins.jPushPlugin
          };
          detail = {
            'notifyId': window.plugins.jPushPlugin.openNotification.extras.notifyId
          };
        } else {

          messageId = event.message_id;
          messageType = event.message_type;

          alertContent = event.aps.alert;
          result = {
            'type': typeof(event),
            'value': event
          };
          detail = {
            'recordId': event.notifyId
          };
        }

        if (messageType === 'messageDetail') {
          if (window.localStorage.getItem('gesturePassword') && window.localStorage.getItem('gesturePassword') !== '') {
            self.localStorage = {
              'stateCurrent': state.current + 'pushDetail',
              'detail': detail,
              'processedFlag': {
                value: true
              },
              'type': 'PUSHDETAIL',
              'readMessage': __readMessage,
              'messageId': messageId
            };
          } else {
            state.go(state.current + 'pushDetail', {
              'detail': detail,
              'processedFlag': {
                value: true
              },
              'type': 'PUSHDETAIL'
            });

            if (ionic.Platform.isIOS()) {
              __readMessage(messageId);
            }
          }
        }

      } catch (exception) {
        if (baseConfig.debug) {
          alert('JPushPlugin:onOpenNotification' + exception);
        }
      }
    };

    function initiateUI() {
      try {
        window.plugins.jPushPlugin.init();
        window.setTimeout(__getRegistrationID, 1000);
        if (device.platform != 'Android') {
          window.plugins.jPushPlugin.setDebugModeFromIos();
          window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0); //应用角标设为0
        } else {
          window.plugins.jPushPlugin.setDebugMode(true);
          window.plugins.jPushPlugin.setStatisticsOpen(true);
        }
        document.addEventListener('jpush.openNotification', __onOpenNotification, false);
      } catch (exception) {}
    }

    function setTagAlias(userName) {
      try {
        var alias = userName;
        var tags = [];
        tags.push(userName);
        window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
      } catch (exception) {
        if (baseConfig.debug) {
          alert(exception);
        }
      }
    }

    //not recommend call
    function stopPush() {
      window.plugins.jPushPlugin.stopPush();
    }

    function resumePush() {
      window.plugins.jPushPlugin.resumePush();
    }

    return jpushBox;
  }
}());

// created by yufei.lu
(function() {
  "use strict";
  angular.module('northGas.customService')
    .factory('bjgasLoadImage', bjgasLoadImage);
    /* @ngInject */
    function bjgasLoadImage(baseConfig) {
      var loader = {
        /**
         * @ngdoc method
         * @name bjgasLoadImage#load
         * @description 无公害预加载图片
         * @param {string} 图片的绝对路径.
         * @param {function} 加载成功后的回调.
        */
        load: load
      };
      return loader;

      function load (url, callback) {
        if(typeof(url) === 'string') {
          var img = new Image();
          img.src = url;
          img.onerror = function () {
            if(baseConfig.debug) {
              console.log('loadImage error');
            }
            img = img.onload = img.onerror = null;
          };
          img.onload = function () {
            img.onload = null;
            if(baseConfig.debug){
              console.log('load img success');
            }
            if(typeof(callback) === 'function'){
              callback.call(img);
            }
          };
        } else {
          if(baseConfig.debug){
            console.log('invalid img url');
          }
        }
      }
    }
})();

// created by yufei.lu
(function() {
  "use strict";
  angular.module('northGas.customService')
    .factory('bjgasPopup', bjgasPopup);
    // bjgasPopup.$inject = ['$ionicLoading', '$cordovaToast', '$ionicPopup', 'baseConfig'];
    /* @ngInject */
    function bjgasPopup($ionicLoading, $cordovaToast, $ionicPopup, baseConfig) {
      var popup = {
        showLoading: showLoading,
        showLoadingWithoutBackdrop: showLoadingWithoutBackdrop,
        hideLoading: hideLoading,
        showShortCenterToast: showShortCenterToast,
        showVeryShortCenterToast: showVeryShortCenterToast,
        showLongCenterToast: showLongCenterToast,
        showPopup: showPopup,
        confirm: confirm
      };
      return popup;

      function showLoading (content) {
        $ionicLoading.show({
          template: '<ion-spinner icon="ios" class="spinner spinner-ios spinner-stable"></ion-spinner>' +
          '<div style="color: white;font-size: 12px;text-align: center;height:25px;line-height: 25px;">' + content + '</div>'
        });
      }
      function showLoadingWithoutBackdrop (content) {
        $ionicLoading.show({
          template: '<ion-spinner icon="ios" class="spinner spinner-ios spinner-stable"></ion-spinner>' +
          '<div style="color: white;font-size: 12px;text-align: center;height:25px;line-height: 25px;">' + content + '</div>',
          noBackdrop: true
        });
      }
      function hideLoading () {
        $ionicLoading.hide();
      }
      function showShortCenterToast (content) {//长时间底部提示toast
        if (!baseConfig.nativeScreenFlag) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 1500
          });
        } else {
          $cordovaToast.showLongBottom((angular.isDefined(content) ? content : "操作失败")).then(function (success) {
          }, function (error) {
          });
        }
      }
      function showVeryShortCenterToast (content) {
        if (!baseConfig.nativeScreenFlag) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 1000
          });
        } else {
          $cordovaToast.showShortBottom((angular.isDefined(content) ? content : "操作失败")).then(function (success) {
          }, function (error) {
          });
        }
      }
      function showLongCenterToast (content) {
        if (!baseConfig.nativeScreenFlag) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 3000
          });
        } else {
          $cordovaToast.showLongBottom((angular.isDefined(content) ? content : "操作失败")).then(function (success) {
          }, function (error) {
          });
        }
      }
      //确认弹出框
      function showPopup (template, callback, text) {
        var label = text ? text: '确定';
        if (!baseConfig.nativeScreenFlag || ionic.Platform.isAndroid()) {
          $ionicPopup.show({
            template: typeof(template) == "undefined" ? '提示' : template,
            buttons: [{
              text: label,
              type: 'button button-cux-popup-confirm',
              onTap: function(e) {
                if(typeof(callback) === 'function'){
                  callback();
                }
              }
            }]
          });
        } else {
          navigator.notification.alert(
            template, // message
            (typeof(callback) === 'function') ? callback : function(){}, // callback
            '', // title
            label
          );
        }
      }
      //确认取消弹出框 onConfirm(0)表示点击取消 onConfirm(1)表示点击确认
      function confirm (message, onConfirm, texts) {
        var label = {
          cancel: '取消',
          sure: '确定'
        };
        if(texts && texts.cancel) label.cancel = texts.cancel;
        if(texts && texts.sure) label.sure = texts.sure;
        if (!baseConfig.nativeScreenFlag || ionic.Platform.isAndroid()) {
          var confirmPopup = $ionicPopup.confirm({
            template: typeof(message) === "undefined" ? '提示' : message,
            cancelText: label.cancel,
            cancelType: 'button-cux-popup-cancel',
            okText: label.sure,
            okType: 'button-cux-popup-confirm'
          });
          confirmPopup.then(function (res) {
            var index = 0;
            if (res) {
              index = 1;
            }
            if(typeof(onConfirm) === "function"){
              onConfirm(index);
            }
          });
        } else {
          navigator.notification.confirm(
            message,
            function (index) {
              if(typeof(onConfirm) === "function"){
                onConfirm(index - 1);
              }
            },
            '',
            [label.cancel, label.sure]
          );
        }
      }
    }
})();

// created by yufei.lu
(function() {
  "use strict";
  angular.module('northGas.customService')
    .factory('verifyCode', verifyCode);
    // bjgasPopup.$inject = ['$ionicLoading', '$cordovaToast', '$ionicPopup', 'baseConfig'];
    /* @ngInject */
    function verifyCode(baseConfig) {
      var func = {
        drawPic: drawPic,
      };

      // test begin
        // drawPic(document.getElementById("canvas"), 'abcd', 20, 40);
        // document.getElementById("changeImg").onclick = function(e) {
        //   e.preventDefault();
        //   drawPic(document.getElementById("canvas"), 'ABCD', 20, 40);
        // }
      // test end

      // 验证码绘制函数 begin
      // element: canvas DOM节点
      // drawing: 需要绘制的文本
      // numMinFontSize：最小字体大小（数字）
      // numMaxFontSize：最大字体大小（数字）
      // 间距在源代码改
      function drawPic(element, drawing, numMinFontSize, numMaxFontSize) {
        drawing = (drawing ? drawing: 'lifi');
        numMinFontSize = numMinFontSize ? numMinFontSize: 12;
        numMaxFontSize = numMaxFontSize ? numMaxFontSize: 18;
        var canvas = element;
        var width = canvas.width;
        var height = canvas.height;
        var lyf = canvas.getContext('2d');
        lyf.textBaseline = 'bottom';
        lyf.fillStyle = randomColor(180, 240);
        lyf.fillRect(0, 0, width, height);
        for (var i = 0; i < drawing.length; i++) {
          var txt = drawing[i];
          lyf.fillStyle = randomColor(50, 160);
          lyf.font = 'italic small-caps bold ' + randomNum(numMinFontSize, numMaxFontSize) + 'px arial';
          //间距
          var x = i * numMinFontSize;
          var y = randomNum(25, 45);
          var deg = randomNum(-25, 25);
          // lifi rewrited (ahort circuit
          (!lyf.translate(x, y) &&!lyf.rotate(deg * Math.PI / 180) &&!lyf.fillText(txt, 0, 0) &&!lyf.rotate(-deg * Math.PI / 180) &&!lyf.translate(-x, -y));
        }
        for (var i = 0; i < 8; i++) {
          lyf.strokeStyle = randomColor(40, 180);
          // lifi rewrited (ahort circuit
          (!lyf.beginPath() &&!lyf.moveTo(randomNum(0, width), randomNum(0, height)) &&!lyf.lineTo(randomNum(0, width), randomNum(0, height)) &&!lyf.stroke());
        }
        for (var i = 0; i < 100; i++) {
          lyf.fillStyle = randomColor(0, 255);
          // lifi rewrited (ahort circuit
          (!lyf.beginPath() &&!lyf.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI) &&!lyf.fill());
        }
      }
      function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }
      function randomColor(min, max) {
        var r = randomNum(min, max);
        var g = randomNum(min, max);
        var b = randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
      }

      return func;
    }
})();

// 紧急赶制，暂时不写scss

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initCheckNumberSureRoute);

  /* @ngInject */
  function initCheckNumberSureRoute($stateProvider) {
    $stateProvider
      .state('tab.gasBindMainSure', {
        url: '/gasCancelMain/gasBindMainSure',
        params: {data: '', number: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/bind-gas-new/check-addr.html',
            controller: 'bindCheckNumberSureCtrl',
            controllerAs: 'bindCheckNumberSure'
          }
        }
      })
      .state('tab.gasBindSure', {
        url: '/gasBindSure',
        params: {data: '', number: ''},
        views: {
          'tab-mine': {
            templateUrl: 'pages/gas/bind-gas-new/check-addr.html',
            controller: 'bindCheckNumberSureCtrl',
            controllerAs: 'bindCheckNumberSure'
          }
        }
      })
      .state('tab.gasBindFromRepairSure', {
        url: '/gasBindFromRepairSure',
        params: {data: '', number: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/bind-gas-new/check-addr.html',
            controller: 'bindCheckNumberSureCtrl',
            controllerAs: 'bindCheckNumberSure'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('bindCheckNumberSureCtrl', bindCheckNumberSureCtrl);

  function bindCheckNumberSureCtrl($scope, $stateParams, $state, $ionicHistory, bjgasPopup, bjgasHttp, verifyTimerService, baseConfig) {
    if (baseConfig.debug) {
      console.log('bindCheckNumberSureCtrl');
      console.log($stateParams.data);
      console.log($stateParams.number);
    }

    var bindCheckNumberSure = this;

    bindCheckNumberSure.phone = '';
    bindCheckNumberSure.hasContact = '';
    if(window.localStorage.userInfo){
      bindCheckNumberSure.phone = JSON.parse(window.localStorage.userInfo).mobile;
    }

    bindCheckNumberSure.inputModel = {
      number: '',
      label: '',
      addr: '',
      contact: ''
    };
    if(JSON.parse(window.localStorage.userInfo).contacts){
      bindCheckNumberSure.hasContact = true;
      bindCheckNumberSure.inputModel.contact = JSON.parse(window.localStorage.userInfo).contacts;
    }
    bindCheckNumberSure.inputModel.number = $stateParams.number;
    bindCheckNumberSure.inputModel.addr = $stateParams.data;

    bindCheckNumberSure.title = '确认绑定用户编号';
    bindCheckNumberSure.verifyLabel = '获取验证码';
    bindCheckNumberSure.verifyDisableFlag = false;

    verifyTimerService.on(function(label, flag) {
      bindCheckNumberSure.verifyLabel = label;
      bindCheckNumberSure.verifyDisableFlag = flag;
    });

    bindCheckNumberSure.prePage = function() {
      $ionicHistory.goBack();
    };
bindCheckNumberSure.checkoutAdress= function() {

      $state.go("tab.inquiryForm6",{data:1});
    };
    function onSubmit(resp){
      bindCheckNumberSure.inputModel = {
        number: '',
        label: '',
        addr: '',
        contact: ''
      };
      bindCheckNumberSure.verifyLabel = '获取验证码';
      bindCheckNumberSure.verifyDisableFlag = false;
      if(resp.success){
        bjgasPopup.showPopup('绑定用户编号成功', function(){
          $ionicHistory.goBack(-2);
        });
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    bindCheckNumberSure.submit = function() {
      var addr = bindCheckNumberSure.inputModel.addr;
      var label = bindCheckNumberSure.inputModel.label;
      var number = bindCheckNumberSure.inputModel.number;

      if (!addr) {
        bjgasPopup.showPopup('请确认地址');
      } else if (!number) {
        bjgasPopup.showPopup('请确认用户编号');
      } else if(!label) {
        bjgasPopup.showPopup('请输入标签');
      } else {
        if(baseConfig.debug){
          console.log('bindCheckNumberSure');
          console.log(bindCheckNumberSure.inputModel);
        }
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        var url = baseConfig.basePath + 'i/api/confirmBindUserGas';
        var param = {
          userId: JSON.parse(window.localStorage.userInfo).id,
          userCode: bindCheckNumberSure.inputModel.number,
          contacts: bindCheckNumberSure.inputModel.contact,
          label: bindCheckNumberSure.inputModel.label,
          address: addr
        };
        bjgasHttp.post(url, param).success(function(response) {
          onSubmit(response);
        }).error(function(response, status) {
          bjgasPopup.showPopup('请求确认绑定用户编号失败');
        }).finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    };

    $scope.$on('$destroy', function() {
      if(!$scope.__modal){
        verifyTimerService.off();
      }
    });
  }
}());

// 紧急赶制，暂时不写scss

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initCheckNumberRoute);

  /* @ngInject */
  function initCheckNumberRoute($stateProvider) {
    $stateProvider
      .state('tab.gasBindMain', {
        url: '/gasCancelMain/gasBindMain',
        params: {data: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/bind-gas-new/check-number.html',
            controller: 'bindCheckNumberCtrl',
            controllerAs: 'bindCheckNumber'
          }
        }
      })
      .state('tab.gasBind', {
        url: '/gasBind',
        params: {data: ''},
        views: {
          'tab-mine': {
            templateUrl: 'pages/gas/bind-gas-new/check-number.html',
            controller: 'bindCheckNumberCtrl',
            controllerAs: 'bindCheckNumber'
          }
        }
      })
      .state('tab.gasBindFromRepair', {
        url: '/gasBindFromRepair',
        params: {data: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/bind-gas-new/check-number.html',
            controller: 'bindCheckNumberCtrl',
            controllerAs: 'bindCheckNumber'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('bindCheckNumberCtrl', bindCheckNumberCtrl);

  function bindCheckNumberCtrl($scope, $stateParams, $state, $ionicModal, $ionicHistory, bjgasPopup, bjgasHttp, verifyTimerService, baseConfig) {
    if (baseConfig.debug) {
      console.log('bindCheckNumberCtrl');
      console.log($stateParams.data);
    }

    var bindCheckNumber = this;

    bindCheckNumber.phone = '';
    if(window.localStorage.userInfo){
      bindCheckNumber.phone = JSON.parse(window.localStorage.userInfo).mobile;
    }

    bindCheckNumber.inputModel = {
      number: '',
      verify: ''
    };

    bindCheckNumber.title = '添加用户编号';
    bindCheckNumber.verifyLabel = '获取验证码';
    bindCheckNumber.verifyDisableFlag = false;

    // verifyTimerService.on(function(label, flag) {
    //   bindCheckNumber.verifyLabel = label;
    //   bindCheckNumber.verifyDisableFlag = flag;
    // });

    bindCheckNumber.prePage = function() {
      $ionicHistory.goBack();
    };

    $ionicModal.fromTemplateUrl('pages/gas/prompt.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.prompt = modal;
    });

    bindCheckNumber.show = function () {
      $scope.prompt.show();
    }
    bindCheckNumber.hide =function(){
      $scope.prompt.hide();
    }

    bindCheckNumber.reminderStyle = {
      'width': window.screen.width + 'px',
      'height': window.screen.width + 'px'
    };
    bindCheckNumber.reminderStyle2 = {
      'width': window.screen.width + 'px',
    };
    bindCheckNumber.tozixunda =function(){
        $state.go("tab.inquiryForm6",{data:0});
    }
    bindCheckNumber.promptText="识别用户编号";

    function onVerify(resp) {
      if(resp.success){
        var res = verifyTimerService.clock();
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    bindCheckNumber.verify = function() { // 获取短信验证码
      if (baseConfig.debug) {
        console.log('bindCheckNumber.verify');
      }
      if(bindCheckNumber.inputModel.number.length === 11){
        if (!bindCheckNumber.verifyDisableFlag) {
          var regPhone = new RegExp("[0-9]{11}");
          if (!regPhone.test(bindCheckNumber.phone)){
            bjgasPopup.showPopup('您输入的是一个无效的手机号');
          }
          else {
            bjgasPopup.showLoadingWithoutBackdrop('请求中');
            var url = baseConfig.basePath + 'i/api/getVerificationCode';
            var param = {
              mobile: bindCheckNumber.phone,
              type: 'bindUserGas'
            };
            bjgasHttp.post(url, param).success(function(response) {
              verifyTimerService.on(function(label, flag) {
                bindCheckNumber.verifyLabel = label;
                bindCheckNumber.verifyDisableFlag = flag;
              });
              onVerify(response);
            }).error(function(response, status) {
              bjgasPopup.showPopup('请求短信验证码失败');
            }).finally(function() {
              bjgasPopup.hideLoading();
            });
          }
        }
      } else {
        bjgasPopup.showPopup('请输入11位用户编号');
      }
    };

    function onSubmit(resp){
      var number = bindCheckNumber.inputModel.number;
      bindCheckNumber.inputModel = {
        number: '',
        verify: '',
      };
      bindCheckNumber.verifyLabel = '获取验证码';
      bindCheckNumber.verifyDisableFlag = false;
      if(resp.success){
        var addr = resp.rows[0].address;
        if ($state.current.name === 'tab.gasBindMain'){
          $state.go('tab.gasBindMainSure', {data: addr, number: number});
        } else if ($state.current.name === 'tab.gasBind'){
          $state.go('tab.gasBindSure', {data: addr, number: number});
        } else if ($state.current.name === 'tab.gasBindFromRepair'){
          $state.go('tab.gasBindFromRepairSure', {data: addr, number: number});
        }
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    bindCheckNumber.submit = function() {
      var id = bindCheckNumber.phone;
      var verify = bindCheckNumber.inputModel.verify;

      var reg = new RegExp("([A-Z]|[a-z]|[0-9])$");
      var regPhone = new RegExp("[0-9]{11}");

      if (!id) {
        bjgasPopup.showPopup('请输入手机号');
      } else if (!regPhone.test(id)) {
        bjgasPopup.showPopup('您输入的是一个无效的手机号');
      } else if(!bindCheckNumber.inputModel.number) {
        bjgasPopup.showPopup('请输入用户编号');
      } else if(bindCheckNumber.inputModel.number.length !== 11) {
        bjgasPopup.showPopup('请输入11位用户编号');
      } else if (!verify) {
        bjgasPopup.showPopup('请输入验证码');
      } else {
        if(baseConfig.debug){
          console.log('bindCheckNumber');
          console.log(bindCheckNumber.inputModel);
        }
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        var url = baseConfig.basePath + 'i/api/checkUserGas';
        var param = {
          mobile: id,
          userCode: bindCheckNumber.inputModel.number,
          code: verify
        };
        bjgasHttp.post(url, param).success(function(response) {
          onSubmit(response);
        }).error(function(response, status) {
          bjgasPopup.showPopup('请求校验用户编号失败');
        }).finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    };

    $scope.$on('$destroy', function() {
      if(!$scope.__modal){
        verifyTimerService.off();
      }
    });
  }
}());

/**
 * Created by linlong on 2016/12/16.
 */

(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRouteMain);

    /* @ngInject */
    function initBindNumberRouteMain($stateProvider) {
        $stateProvider
            .state('tab.inquiryForm6', {
                url: '/gasCancelMain/inquiryForm6',
                params: { data: '0' },
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/bind-gas-new/inquiry-form.html',
                        controller: 'inquiryFormCtrl',
                        controllerAs: 'inquiryFormVM'
                    }
                }
            })
            .state('tab.inquiryForm66', {
                url: '/inquiryForm66',
                params: { data: 0 },
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/gas/bind-gas-new/inquiry-form.html',
                        controller: 'inquiryFormCtrl',
                        controllerAs: 'inquiryFormVM'
                    }
                }
            })
            .state('tab.inquiryFormFromRepair666', {
                url: '/inquiryFormFromRepair666',
                params: { data: '0' },
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/bind-gas-new/inquiry-form.html',
                        controller: 'inquiryFormCtrl',
                        controllerAs: 'inquiryFormVM'
                    }
                }
            });
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('inquiryFormCtrl', inquiryFormNumberCtrl);

    function inquiryFormNumberCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, $stateParams, $cordovaDatePicker, $filter, $ionicModal, switchUser) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }
 console.log('CheckStaffInputCtrl');
        var inquiryFormVM = this;
         inquiryFormVM.flag1 =   $stateParams.data;
        if($stateParams.data == 0){

            inquiryFormVM.title = "用户编号咨询单";
        }else{
            inquiryFormVM.title = "地址咨询单";
        }

inquiryFormVM.returnedData = [{"value":"质量问题","code":""},
                                {"value":"大小/尺寸与商品描述不符","code":""},
                                {"value":"无法使用商品规格型号","code":""},
                                {"value":"卖家发错货","code":""},
                                {"value":"未按约定时间发货","code":""},
                                {"value":"发票问题","code":""},
                                {"value":"我不想要了","code":""},
                                {"value":"其他","code":""}];
   $.ajax({
                type: 'GET',
                url: baseConfig.basePath + 'c/api/codeValueList/BG_ADDRESS_AREA',
                contentType: 'application/json',
                success: function(data) {
                    var tempSelectElement = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        tempSelectElement.push(data.rows[i]);
                    }
                    $scope.tempSelect = tempSelectElement;


                },
                error: function(xhr, type) {

                }
            });

        $ionicModal.fromTemplateUrl('pages/gas/prompt.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.prompt = modal;
        });
        inquiryFormVM.promptStyle = {
            'width': window.screen.width + 'px',
            'height': (window.screen.height - window.screen.width) / 2 - 60 + 'px'
        };
        inquiryFormVM.reminderStyle = {
            'width': window.screen.width + 'px',
            'height': window.screen.width + 'px'
        };
        inquiryFormVM.reminderStyle2 = {
            'width': window.screen.width + 'px',
        };

        if ($stateParams.data == "R") {
            inquiryFormVM.promptText = "识别用户编号(普表)";
            inquiryFormVM.flag = false;
            inquiryFormVM.placeholder = {
                inputOne: "请输入计费日期",
                inputTwo: "请输入金额"
            }

        } else {
            inquiryFormVM.promptText = "识别用户编号(卡表)";
            inquiryFormVM.flag = true;
            inquiryFormVM.placeholder = {
                inputOne: "请输入充值日期",
                inputTwo: "请输入充值金额"
            }
        }
        $scope.$on('$ionicView.beforeEnter', function() {
            var info = switchUser.getUserInfo();
            var cancelUserInfo = JSON.parse(window.localStorage.userInfo);
            inquiryFormVM.item = {
                "userId": cancelUserInfo.userId,
                "userCode": "",
                "contacts": cancelUserInfo.contacts,
                "meterType": $stateParams.data,
                "label": "",
                "date": "",
                "amount": ""
            }

        });
        inquiryFormVM.type = $stateParams.data
        var info = switchUser.getUserInfo();
        var cancelUserInfo = JSON.parse(window.localStorage.userInfo);
        inquiryFormVM.item = {
            "userId": cancelUserInfo.userId,
            "userCode": "",
            "contacts": cancelUserInfo.contacts,
            "meterType": $stateParams.data,
            "label": "",
            "date": "",
            "amount": ""
        }

        if (cancelUserInfo.contacts == "" || cancelUserInfo.contacts == null) {
            bjgasPopup.confirm('你没有填写姓名，无法绑定燃气户号', function(index) {
                if (index == 0) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('tab.changeName');
                }
            });
        }

        //console.log("$stateparams:" + $stateParams.data);

        inquiryFormVM.data = {
            'moble': cancelUserInfo.mobile
        }
        inquiryFormVM.item = {
            "userId": cancelUserInfo.userId,
            "userCode": cancelUserInfo.userCode,
            "contacts": cancelUserInfo.contacts,
            "meterType": $stateParams.data,
            "label": "",
            "date": "",
            "amount": ""
        }
        inquiryFormVM.prePage = function() {
            $ionicHistory.goBack();
        };
        inquiryFormVM.gasSub = function() {
            // con
            var data = {
    "uniUserCode":"",
    "detailAddress":"",
    "appContactName":inquiryFormVM.item.contacts,
    "appUserPH":inquiryFormVM.data.moble,
    "region":inquiryFormVM.item.userCode,
    "detailAdd":inquiryFormVM.item.label,
    "uniAppContactid":"1-LA89N"
}
                //console.log("inquiryFormVM.item.userCode" + inquiryFormVM.item.userCode.length);


            //console.log(angular.toJson(data));
            var userUrl =
            // baseConfig.basePath +
            "http://10.211.108.164.:8080/bjgas-server/"+
             'i/api/consulting/addConsulting';
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            try {
                bjgasHttp.post(userUrl, data).success(function(response) {
                    console.log(angular.toJson(response));

                }).error(function(error) {
                    // canGasVM.userList = [];
                }).finally(function() {
                    bjgasPopup.hideLoading();
                });
            } catch (e) {
                bjgasPopup.showPopup("请连接网络!");
            }
        }
        inquiryFormVM.showTime = function() {
            try {
                var options = {
                    date: new Date(),
                    mode: 'date',
                    titleText: '请选择时间',
                    okText: '确定',
                    cancelText: '取消',
                    doneButtonLabel: '确认',
                    cancelButtonLabel: '取消',
                    locale: 'zh_cn',
                    androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
                };

                $cordovaDatePicker.show(options).then(function(date) {
                    inquiryFormVM.item.date = $filter('date')(date, 'yyyy/MM/dd');
                });
            } catch (error) {

            }
        }

        inquiryFormVM.totabReset = function() {
            // $state.go("tab.reset")
            $scope.prompt.show();
        }
        inquiryFormVM.hide = function() {
            $scope.prompt.hide();
            // $scope.prompt.close();

        }

        function onGetInfo(resp) {
            if (resp.success) {
                resp.rows[0].userId = resp.rows[0].id;
                window.localStorage.userInfo = JSON.stringify(resp.rows[0]);
                inquiryFormVM.prePage();
            } else {
                bjgasPopup.showPopup('刷新用户信息异常', inquiryFormVM.prePage);
            }
        }

        function getInfo() {
            var url = baseConfig.basePath + 'i/api/getUserInfo/' + JSON.parse(window.localStorage.userInfo).userId + '';
            if (baseConfig.debug) {
                //console.log(url);
            }
            bjgasHttp.get(url)
                .success(function(resp) {
                    if (baseConfig.debug) {
                        //console.log(resp);
                    }
                    onGetInfo(resp);
                })
                .error(function(resp) {
                    // bjgasPopup.showShortCenterToast('请求刷新用户信息失败');
                    bjgasPopup.showPopup('请求刷新用户信息失败', inquiryFormVM.prePage);
                    if (baseConfig.debug) {
                        //console.log(resp);
                    }
                });
        }
    }

}());
/**
 * Created by linlong on 2016/12/16.
 */

(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.gasCancelMain', {
                url: '/gasCancelMain',
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/bind-gas-no/bind-gas-cancel.html',
                        controller: 'gasCancelCtrl',
                        controllerAs: 'canGasVM'
                    }
                }
            })
            .state('tab.gasCancel', {
                url: '/gasCancel',
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/gas/bind-gas-no/bind-gas-cancel.html',
                        controller: 'gasCancelCtrl',
                        controllerAs: 'canGasVM'
                    }
                }
            })
            .state('tab.noGasFromRepair', {
                url: '/noGasFromRepair',
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/bind-gas-no/bind-gas-cancel.html',
                        controller: 'gasCancelCtrl',
                        controllerAs: 'canGasVM'
                    }
                }
            });
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('gasCancelCtrl', gasCancelNumberCtrl);

    function gasCancelNumberCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser,$ionicPopup) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }
        var canGasVM = this;

        canGasVM.data = {
            "parmCancelFlag": "",
            "parmCanceli": ""
        }
        $scope.$on('$ionicView.beforeEnter', function() {
            initData();
        });
        canGasVM.popup = {
            "myPopupContainer1": false,
            "myPopupContainer2": false,
            "myPopupContainer3": false
        }
        canGasVM.goBack = function() {
            //console.log("goback");
            //console.log("$ionicHistory:"+angular.toJson($ionicHistory));
            //console.log("$ionicHistory"+$ionicHistory);
            $ionicHistory.goBack();
        };
        canGasVM.addBind = function() {
            // console.log("tab.gasBind");
            var data = '';
            if ($state.current.name == 'tab.gasCancelMain') {
                $state.go('tab.gasBindMain', { data: data });
            } else if ($state.current.name == 'tab.gasCancel') {
                $state.go('tab.gasBind', { data: data });
            } else if ($state.current.name == 'tab.noGasFromRepair') {
                $state.go('tab.gasBindFromRepair', { data: data });
            }
            // canGasVM.popup.myPopupContainer3 = true;
            // $state.go('tab.gasBind');
        }

        function initData() {
            var userUrl = baseConfig.basePath + 'i/api/getUserGasList/' + JSON.parse(window.localStorage.userInfo).userId;
            canGasVM.userList = [];
            canGasVM.data.parmCancelFlag = "";

            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            bjgasHttp.get(userUrl).success(function(response) {
                canGasVM.code = response.code;
                if (response.rows.length !== 0) {
                    var item = {
                        'userId': response.rows[response.rows.length - 1].userId,
                        'userCode': response.rows[response.rows.length - 1].userCode,
                        'label': response.rows[response.rows.length - 1].label,
                        'meterType': response.rows[response.rows.length - 1].meterType,
                        'address': response.rows[response.rows.length - 1].address
                    };
                    switchUser.setUserInfo(item);
                } else {
                    var item = {
                        'userId': "",
                        'userCode': "",
                        'label': "",
                        'meterType': "",
                        'address': ""
                    };
                    switchUser.setUserInfo(item);
                }
                switchUser.setUserCount(response.rows.length);


                canGasVM.userList = response.rows;
            }).error(function(error) {
                canGasVM.userList = [];
            }).finally(function() {
                bjgasPopup.hideLoading();
            });
        }



        canGasVM.choseList = function(data) {
            console.log(canGasVM.data.parmCancelFlag);
            var itemTwo = document.getElementsByClassName('user-item');
            if (canGasVM.data.parmCancelFlag === "") {

            } else {
                itemTwo[canGasVM.data.parmCancelFlag].style.border = "none";
            }
            canGasVM.data.parmCanceli = canGasVM.userList[data];
            canGasVM.data.parmCancelFlag = data;
            itemTwo[canGasVM.data.parmCancelFlag].style.border = "1px solid #ffd5d2";
        }
        canGasVM.canBind = function() {
            if (canGasVM.data.parmCanceli == "") {
                bjgasPopup.showPopup('请选择户号!');
            } else {

              confirm("您将取消绑定本用户编号?","否","是",function(i){
                if(i== 0)return;
                var userUrl = baseConfig.basePath + 'i/api/unbindUserGas/' + canGasVM.data.parmCanceli.id;
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                bjgasHttp.get(userUrl).success(function(response) {
                  //console.log(angular.toJson(response));

                  if (response.success == true) {
                    bjgasPopup.showPopup(response.message);
                    initData();
                  } else {
                    bjgasPopup.showPopup(response.message);
                  }
                  // bjgasPopup.showPopup('取消失败');
                }).error(function(error) {
                  // canGasVM.userList = [];
                }).finally(function() {
                  bjgasPopup.hideLoading();
                });
              });
            }
        }
        canGasVM.closeDialogS = function(url, data) {
            canGasVM.popup.myPopupContainer3 = false;
            if (data == "R" || data == "C") {
                //console.log($state.current.name);
                if ($state.current.name == 'tab.gasCancelMain') {
                    $state.go('tab.gasBindMain', { data: data });
                } else if ($state.current.name == 'tab.gasCancel') {
                    $state.go('tab.gasBind', { data: data });
                } else if ($state.current.name == 'tab.noGasFromRepair') {
                    $state.go('tab.gasBindFromRepair', { data: data });
                } else {

                }

            } else {

            }

        }
        canGasVM.cancal = function() {
            canGasVM.popup.myPopupContainer3 = false;
        }

               //确认取消弹出框 onConfirm(0)表示点击取消 onConfirm(1)表示点击确认
        function confirm(message, falseMess, trueMess, onConfirm) {
            if (!baseConfig.nativeScreenFlag || ionic.Platform.isAndroid()) {
                var confirmPopup = $ionicPopup.confirm({
                    template: typeof(message) === "undefined" ? '提示' : message,
                    cancelText: falseMess,
                    cancelType: 'button-cux-popup-cancel',
                    okText: trueMess,
                    okType: 'button-cux-popup-confirm'
                });
                confirmPopup.then(function(res) {
                    var index = 0;
                    if (res) {
                        index = 1;
                    }
                    if (typeof(onConfirm) === "function") {
                        onConfirm(index);
                    }
                });
            } else {
                navigator.notification.confirm(
                    message,
                    function(index) {
                        if (typeof(onConfirm) === "function") {
                            onConfirm(index - 1);

                        }
                    },
                    '', [falseMess, trueMess]
                );
            }
        }
    }
}());
/**
 * Created by linlong on 2016/12/16.
 */

(function () {
  // "use strict";
  angular.module("northGas")
    .config(initBindNumberRouteMain);

  /* @ngInject */
  function initBindNumberRouteMain($stateProvider) {
    $stateProvider
      .state('tab.gasBindMain6', {
        url: '/gasCancelMain/gasBindMain6',
        params: {data: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/bind-gas-no/bind-gas-main.html',
            controller: 'gasBindCtrl',
            controllerAs: 'gasBindVM'
          }
        }
      })
      .state('tab.gasBind66', {
        url: '/gasBind66',
        params: {data: ''},
        views: {
          'tab-mine': {
            templateUrl: 'pages/gas/bind-gas-no/bind-gas-main.html',
            controller: 'gasBindCtrl',
            controllerAs: 'gasBindVM'
          }
        }
      })
      .state('tab.gasBindFromRepair666', {
        url: '/gasBindFromRepair666',
        params: {data: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/bind-gas-no/bind-gas-main.html',
            controller: 'gasBindCtrl',
            controllerAs: 'gasBindVM'
          }
        }
      });
  }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('gasBindCtrl', gasBindNumberCtrl);

    function gasBindNumberCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, $stateParams, $cordovaDatePicker, $filter, $ionicModal, switchUser) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }

        var gasBindVM = this;
        $ionicModal.fromTemplateUrl('pages/gas/prompt.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.prompt = modal;
        });
        gasBindVM.promptStyle = {
            'width': window.screen.width + 'px',
            'height': (window.screen.height - window.screen.width) / 2 - 60 + 'px'
        };
        gasBindVM.reminderStyle = {
            'width': window.screen.width + 'px',
            'height': window.screen.width + 'px'
        };
        gasBindVM.reminderStyle2 = {
            'width': window.screen.width + 'px',
        };

        if ($stateParams.data == "R") {
            gasBindVM.promptText = "识别用户编号(普表)";
            gasBindVM.flag = false;
            gasBindVM.placeholder = {
                inputOne: "请输入计费日期",
                inputTwo: "请输入金额"
            }

        } else {
            gasBindVM.promptText = "识别用户编号(卡表)";
            gasBindVM.flag = true;
            gasBindVM.placeholder = {
                inputOne: "请输入充值日期",
                inputTwo: "请输入充值金额"
            }
        }
        $scope.$on('$ionicView.beforeEnter', function() {
            var info = switchUser.getUserInfo();
            var cancelUserInfo = JSON.parse(window.localStorage.userInfo);
            gasBindVM.item = {
                "userId": cancelUserInfo.userId,
                "userCode": "",
                "contacts": cancelUserInfo.contacts,
                "meterType": $stateParams.data,
                "label": "",
                "date": "",
                "amount": ""
            }

        });
        gasBindVM.type = $stateParams.data
        var info = switchUser.getUserInfo();
        var cancelUserInfo = JSON.parse(window.localStorage.userInfo);
        gasBindVM.item = {
            "userId": cancelUserInfo.userId,
            "userCode": "",
            "contacts": cancelUserInfo.contacts,
            "meterType": $stateParams.data,
            "label": "",
            "date": "",
            "amount": ""
        }

        if (cancelUserInfo.contacts == "" || cancelUserInfo.contacts == null) {
            bjgasPopup.confirm('你没有填写姓名，无法绑定燃气户号', function(index) {
                if (index == 0) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('tab.changeName');
                }
            });
        }

        //console.log("$stateparams:" + $stateParams.data);

        gasBindVM.data = {
            'moble': cancelUserInfo.mobile
        }
        gasBindVM.item = {
            "userId": cancelUserInfo.userId,
            "userCode": cancelUserInfo.userCode,
            "contacts": cancelUserInfo.contacts,
            "meterType": $stateParams.data,
            "label": "",
            "date": "",
            "amount": ""
        }
        gasBindVM.prePage = function() {
            $ionicHistory.goBack();
        };
        gasBindVM.gasBindSub = function() {
            // con
            var data = {
                    "userId": cancelUserInfo.userId,
                    "userCode": gasBindVM.item.userCode,
                    "contacts": gasBindVM.item.contacts,
                    "meterType": $stateParams.data,
                    "label": gasBindVM.item.label,
                    "date": gasBindVM.item.date,
                    "amount": gasBindVM.item.amount
                }
                //console.log("gasBindVM.item.userCode" + gasBindVM.item.userCode.length);
            if (gasBindVM.item.userCode.length == 11) {

            } else {
                bjgasPopup.showPopup('请输入11位燃气户号，不足11位的请在燃气户号前加9');
                return;
            }

            //console.log(angular.toJson(data));
            var userUrl = baseConfig.basePath + 'i/api/bindUserGas';
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            try {
                bjgasHttp.post(userUrl, data).success(function(response) {
                    if (response.success == true) {
                        // getInfo();
                        bjgasPopup.showPopup(response.message, getInfo);
                    } else {
                        bjgasPopup.showPopup(response.message);
                    }

                }).error(function(error) {
                    // canGasVM.userList = [];
                }).finally(function() {
                    bjgasPopup.hideLoading();
                });
            } catch (e) {
                bjgasPopup.showPopup("请连接网络!");
            }
        }
        gasBindVM.showTime = function() {
            try {
                var options = {
                    date: new Date(),
                    mode: 'date',
                    titleText: '请选择时间',
                    okText: '确定',
                    cancelText: '取消',
                    doneButtonLabel: '确认',
                    cancelButtonLabel: '取消',
                    locale: 'zh_cn',
                    androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
                };

                $cordovaDatePicker.show(options).then(function(date) {
                    gasBindVM.item.date = $filter('date')(date, 'yyyy/MM/dd');
                });
            } catch (error) {

            }
        }

        gasBindVM.totabReset = function() {
            // $state.go("tab.reset")
            $scope.prompt.show();
        }
        gasBindVM.hide = function() {
            $scope.prompt.hide();
            // $scope.prompt.close();

        }

        function onGetInfo(resp) {
            if (resp.success) {
                resp.rows[0].userId = resp.rows[0].id;
                window.localStorage.userInfo = JSON.stringify(resp.rows[0]);
                gasBindVM.prePage();
            } else {
                bjgasPopup.showPopup('刷新用户信息异常', gasBindVM.prePage);
            }
        }

        function getInfo() {
            var url = baseConfig.basePath + 'i/api/getUserInfo/' + JSON.parse(window.localStorage.userInfo).userId + '';
            if (baseConfig.debug) {
                //console.log(url);
            }
            bjgasHttp.get(url)
                .success(function(resp) {
                    if (baseConfig.debug) {
                        //console.log(resp);
                    }
                    onGetInfo(resp);
                })
                .error(function(resp) {
                    // bjgasPopup.showShortCenterToast('请求刷新用户信息失败');
                    bjgasPopup.showPopup('请求刷新用户信息失败', gasBindVM.prePage);
                    if (baseConfig.debug) {
                        //console.log(resp);
                    }
                });
        }
    }

}());

(function() {
  "use strict";
  angular.module("northGas.customService")
    .factory('checkStaffService', checkStaffService);

  /* @ngInject */
  function checkStaffService(bjgasHttp, bjgasPopup, baseConfig) {
    var func = {
      checkCode: checkCode
    };

    function _onFail(msg, callback){
      callback({
        success: false,
        message: msg
      });
    }
    function _onSuccess(name, code, org, callback){
      // alert('onSuccess');
      callback({
        success: true,
        name: name,
        code: code,
        org: org
      });
    }
    function _onCheckCode(resp, callback, code){
      if(resp){
        if(window.debug){
          console.log(resp);
        }
        if(resp['SOAP-ENV:Envelope'] && resp['SOAP-ENV:Envelope']['SOAP-ENV:Body'] && resp['SOAP-ENV:Envelope']['SOAP-ENV:Body']['rpc:QueryEmployeeResponse']){
          var data = resp['SOAP-ENV:Envelope']['SOAP-ENV:Body']['rpc:QueryEmployeeResponse'];
          if(data.ErrCode !== 'S'){
            // openDialog('找不到该员工：' + code);
            _onFail('此工号未备案，请与北京燃气核实', callback);
          } else {
            // $('#label').append(data.EmployeeName + '-' + data.Org);
            // alert(JSON.stringify(data));
            _onSuccess(data.EmployeeName, code, data.Org, callback);
          }
        } else {
          _onFail('后台获取到的员工信息异常', callback);
        }
      } else {
        _onFail('获取员工信息后台时出现异常', callback);
      }
    }

    function checkCode(code, callback){
      // 不传入回调的话，获取到员工信息也没有意义，故强制要求回调函数
      if(typeof(callback) === 'function' && code){
        var url = baseConfig.baseRPath + 'QueryEmployee';
        var param = {
          "QueryEmployee": {
            "EmployeeId": code
          }
        };
        bjgasPopup.showLoadingWithoutBackdrop('检验中');
        bjgasHttp.post(url, param)
        .success(function(resp){
          if(baseConfig.debug){
            // console.log(resp);
          }
          _onCheckCode(resp, callback, code);
        })
        .error(function(resp){
          if(baseConfig.debug){
            console.log('error');
          }
        })
        .finally(function(){
          bjgasPopup.hideLoading();
        });
      }
    }

    return func;

  }
})();

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initCheckStaffInputRoute);

  /* @ngInject */
  function initCheckStaffInputRoute($stateProvider) {
    $stateProvider
      .state('tab.checkStaffInput', {
        url: '/checkStaffInput',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/check-staff/input.html',
            controller: 'CheckStaffInputCtrl',
            controllerAs: 'CheckStaffInput'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('CheckStaffInputCtrl', CheckStaffInputCtrl);

  function CheckStaffInputCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, checkStaffService) {
    if(baseConfig.debug) {
      console.log('CheckStaffInputCtrl');
    }

    var CheckStaffInput = this;

    CheckStaffInput.inputModel = {
      number: ''
    };

    CheckStaffInput.backdrop = false;
    CheckStaffInput.pass = false;
    CheckStaffInput.showCheckResult = false;
    CheckStaffInput.passClass = 'pass';
    CheckStaffInput.passBtnClass = 'pass';
    CheckStaffInput.res = {
      btnLabel: '',
      title: '',
      name: '',
      code: '',
      org: '',
      message: ''
    };
    CheckStaffInput.backdropTop = {};

    if(ionic.Platform.isIOS()){
      CheckStaffInput.backdropTop = {
        top: '64px'
      };
    }
    CheckStaffInput.prePage = function() {
      $ionicHistory.goBack();
    };

    CheckStaffInput.submit = function(){
      if(CheckStaffInput.inputModel.number){
        checkStaffService.checkCode(CheckStaffInput.inputModel.number, onCheck);
      } else {
        bjgasPopup.showPopup('请输入员工号');
      }
    };
    CheckStaffInput.onBtn = function() {
      reset();
    };

    function reset() {
      CheckStaffInput.showCheckResult = false;
      CheckStaffInput.backdrop = false;
      CheckStaffInput.pass = false;
      CheckStaffInput.passClass = 'pass';
      CheckStaffInput.passBtnClass = 'pass';
      CheckStaffInput.res = {
        btnLabel: '',
        title: '',
        name: '',
        code: '',
        org: '',
        message: ''
      };
    }

    function onCheck(data){
      if(data.success){
        CheckStaffInput.res = {
          btnLabel: '我知道了',
          title: '检验成功',
          name: data.name,
          code: data.code,
          org: data.org,
          message: ''
        };
        CheckStaffInput.backdrop = true;
        CheckStaffInput.pass = true;
        CheckStaffInput.passClass = 'pass';
        CheckStaffInput.passBtnClass = 'pass';
        CheckStaffInput.showCheckResult = true;
      } else if(!data.success) {
        CheckStaffInput.res = {
          btnLabel: '我知道了',
          title: '检验失败',
          name: '',
          code: '',
          org: '',
          message: data.message
        };
        CheckStaffInput.backdrop = true;
        CheckStaffInput.pass = false;
        CheckStaffInput.passClass = 'wrong';
        CheckStaffInput.passBtnClass = 'wrong-bg';
        CheckStaffInput.showCheckResult = true;
      }
    }
  }
}());

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initCheckStaffMainRoute);

  /* @ngInject */
  function initCheckStaffMainRoute($stateProvider) {
    $stateProvider
      .state('tab.checkStaffMain', {
        url: '/checkStaffMain',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/check-staff/main.html',
            controller: 'CheckStaffMainCtrl',
            controllerAs: 'CheckStaffMain'
          }
        }
      });
  }
}());

(function(){
  "use strict";
  angular.module('northGas')
  .controller('CheckStaffMainCtrl', CheckStaffMainCtrl);
  function CheckStaffMainCtrl($scope, $state, $ionicHistory, baseConfig){
    if(baseConfig.debug){
      console.log('CheckStaffMainCtrl');
    }

    var CheckStaffMain = this;

    CheckStaffMain.topStyle = {};

    if(ionic.Platform.isIOS()){
      CheckStaffMain.topStyle = {"top": "65px"};
    }

    CheckStaffMain.prePage = function(){
      $ionicHistory.goBack();
    };
    CheckStaffMain.scan = function(){
      if(baseConfig.debug){
        console.log('scan');
      }
      $state.go('tab.checkStaffScan');
    };
    CheckStaffMain.inputNumber = function(){
      if(baseConfig.debug){
        console.log('input');
      }
      $state.go('tab.checkStaffInput');
    };
  }
}());
(function() {
  // "use strict";
  angular.module("northGas")
    .config(initCheckStaffScanRoute);

  /* @ngInject */
  function initCheckStaffScanRoute($stateProvider) {
    $stateProvider
      .state('tab.checkStaffScan', {
        url: '/checkStaffScan',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/check-staff/scan.html',
            controller: 'CheckStaffScanCtrl',
            controllerAs: 'CheckStaffScan'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('CheckStaffScanCtrl', CheckStaffScanCtrl);

  function CheckStaffScanCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, checkStaffService) {
    if(baseConfig.debug) {
      console.log('CheckStaffScanCtrl');
    }

    var CheckStaffScan = this;

    CheckStaffScan.backdrop = false;
    CheckStaffScan.pass = false;
    CheckStaffScan.showCheckResult = false;
    CheckStaffScan.passClass = 'pass';
    CheckStaffScan.passBtnClass = 'pass';
    CheckStaffScan.res = {
      btnLabel: '',
      title: '',
      name: '',
      code: '',
      org: '',
      message: ''
    };
    CheckStaffScan.backdropTop = {};

    if(ionic.Platform.isIOS()){
      CheckStaffScan.backdropTop = {
        top: '64px'
      };
    }
    CheckStaffScan.prePage = function() {
      $ionicHistory.goBack();
    };

    function reset() {
      CheckStaffScan.showCheckResult = false;
      CheckStaffScan.backdrop = true;
      CheckStaffScan.pass = false;
      CheckStaffScan.passClass = 'pass';
      CheckStaffScan.passBtnClass = 'pass';
      CheckStaffScan.res = {
        btnLabel: '',
        title: '',
        name: '',
        code: '',
        org: '',
        message: ''
      };
    }

    CheckStaffScan.onBtn = function() {
      scan();
    };
    function onScan(data){
      // alert('onScan');
      if(data.success){
        // alert(data.name);
        CheckStaffScan.res = {
          btnLabel: '再次扫描',
          title: '检验成功',
          name: data.name,
          code: data.code,
          org: data.org,
          message: ''
        };
        CheckStaffScan.backdrop = true;
        CheckStaffScan.pass = true;
        CheckStaffScan.passClass = 'pass';
        CheckStaffScan.passBtnClass = 'pass';
        CheckStaffScan.showCheckResult = true;
      } else if(!data.success) {
        CheckStaffScan.res = {
          btnLabel: '重新扫描',
          title: '检验失败',
          name: '',
          code: '',
          org: '',
          message: data.message
        };
        CheckStaffScan.backdrop = true;
        CheckStaffScan.pass = false;
        CheckStaffScan.passClass = 'wrong';
        CheckStaffScan.passBtnClass = 'wrong-bg';
        CheckStaffScan.showCheckResult = true;
      }
    }

    function onScanErrorIOS() {
      CheckStaffScan.prePage();
      if(typeof(cordova.plugins.achieveAuthority) !== 'undefined'){
        cordova.plugins.achieveAuthority.getAuthority();
      }
    }
    function onScanErrorOther() {
      CheckStaffScan.prePage();
    }
    function scan(){
      if(baseConfig.debug){
        console.log('scan');
      }
      if(typeof(cordova) !== "undefined" &&
          typeof(cordova.plugins) !== "undefined" &&
          typeof(cordova.plugins.barcodeScanner) !== "undefined" &&
          typeof(cordova.plugins.barcodeScanner.scan) !== "undefined") {
        reset();
        cordova.plugins.barcodeScanner.scan(
          function(result) {
            if(baseConfig.debug){
              console.log('scan success');
              if(baseConfig.debug){
                console.log(JSON.stringify(result));
              }
            }
            CheckStaffScan.backdrop = true;
            // 2016-12-21 12:34:10.737149 北京燃气测试版[3087:917248] {"format":"sdf","text":"cancel","cancelled":1}
            // android   result.cancelled === true
            if(result.text !== "cancel" && result.cancelled !== true){
              if(baseConfig.debug){
                console.log('check code');
              }
              checkStaffService.checkCode(result.text, onScan);
            } else {
              if(baseConfig.debug){
                console.log('go back');
              }
              onScanErrorOther();
            }
          },
          function(error) {
            if(baseConfig.debug){
              console.log('scan error');
              console.log(error);
            }
            CheckStaffScan.backdrop = true;
            // bjgasPopup.showLoadingWithoutBackdrop("扫描失败: " + error);
            if(ionic.Platform.isIOS()){
              if(error === 'noAuthorization'){
                bjgasPopup.confirm('北京燃气需要访问你的相机，以便提供员工检验服务', function (index) {
                  if(index === 0){
                    $ionicHistory.goBack();
                  } else {
                    onScanErrorIOS();
                  }
                }, { cancel: '取消', sure: '去设置'});
              }
            } else {
              // 6.0 失败 Illegal access
              if(error === 'Illegal access'){
                bjgasPopup.showPopup('扫描失败，请尝试设置北京燃气的相机访问权限', function () {
                  onScanErrorOther();
                });
              }
            }
          }
        );
      } else {
        if(baseConfig.debug){
          console.log('scan failed');
        }
        CheckStaffScan.backdrop = false;
        bjgasPopup.showPopup('扫描插件初始化失败', function(){
          CheckStaffScan.prePage();
        });
      }
    }
    $scope.$on('$ionicView.afterEnter', function() {
      scan();
    });
  }
}());

(function(){
  angular.module('northGas')
  .config(initCutOffRoute);
  function initCutOffRoute($stateProvider){
    $stateProvider
    .state('tab.cutOffNotice', {
      url: '/cutOffNotice',
      views: {
        "tab-gas": {
          templateUrl: 'pages/gas/cut-off-notice/cut-off-notice.html',
          controller: 'CutOffNoticeCtrl',
          controllerAs: 'CutOffNotice'
        }
      }
    });
  }
}());

(function(){
  angular.module('northGas')
  .controller('CutOffNoticeCtrl', CutOffNoticeCtrl);

  /* @ngInject */
  function CutOffNoticeCtrl($scope, $ionicHistory, $timeout, $ionicScrollDelegate, bjgasHttp, bjgasPopup, baseConfig){
    if(baseConfig.debug){
      console.log('CutOffNoticeCtrl');
    }

    var CutOffNotice = this;
    CutOffNotice.notices = [];
    CutOffNotice.selected = [];
    CutOffNotice.selectedIndex = '';

    CutOffNotice.bodyLines = [
      {label: '停气区域', key: 'stopGasArea'},
      {label: '影响范围', key: 'reach'},
      {label: '起始时间', key: 'startDate'},
      {label: '结束时间', key: 'endDate'},
      {label: '停气类型', key: 'stopGasType'},
      {label: '停气原因', key: 'stopGasCauses'}
    ];

    var page = 1;
    var pagesize = 10;
    var total = 0;
    var itemHeight = 76;
    var itemDownHeight = 140;
    var scrollHandle = $ionicScrollDelegate.$getByHandle('cutOffHandle');
    CutOffNotice.noMorePage = true;

    CutOffNotice.timeoutHandle = '';

    function onGetNotice(resp){
      if(resp.success){
        total = resp.total;
        if(total <= page * pagesize){
          CutOffNotice.noMorePage = true;
        } else {
          CutOffNotice.noMorePage = false;
        }
        if(page === 1){
          CutOffNotice.notices = resp.rows;
          CutOffNotice.selected = [false, false, false, false, false, false, false, false, false, false];
        } else {
          for(var i = 1; i < resp.rows.length; i++){
            CutOffNotice.notices.push(resp.rows[i]);
            CutOffNotice.selected.push(false);
          }
        }
        page = page + 1;
        if(resp.rows.length === 0){
          bjgasPopup.showVeryShortCenterToast('近期没有停气计划');
        }
      }
    }
    CutOffNotice.getNotice = function(){
      bjgasPopup.showLoadingWithoutBackdrop('加载中');
      var url = baseConfig.basePath + 'c/api/app/notice/query';
      var params = {
        page: page
      };

      bjgasHttp.post(url, params).success(function(response) {
        onGetNotice(response);
        if(baseConfig.debug){
          console.log(response);
        }
      }).error(function(error) {

      }).finally(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        bjgasPopup.hideLoading();
      });
    };

    CutOffNotice.clickItem = function(index, event){
      var e = event || window.event;
      var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      var x = e.pageX || e.clientX + scrollX;
      var y = e.pageY || e.clientY + scrollY;

      for(var i = 0; i < CutOffNotice.selected.length; i++ ){
        CutOffNotice.selected[i] = false;
      }
      // 不是按的同一个，因此要显示内容
      if(CutOffNotice.selectedIndex !== index){
        CutOffNotice.selected[index] = true;
        CutOffNotice.noMorePage = true;
        CutOffNotice.selectedIndex = index;
        // 先resize，再去计算要不要滚动
        scrollHandle.resize();
        CutOffNotice.timeoutHandle = $timeout(function(){
          //判断滚上去的偏移
          if(scrollHandle.getScrollPosition().top > (index) * itemHeight){
            scrollHandle.scrollTo(0, (index) * itemHeight + (index === 0 ? 5 : 15), true);
            if(baseConfig.debug){
              console.log('need scroll : top');
            }
          // 点了下面一部分区域时，判断当前滚下去的偏移，
          } else if (window.screen.height - y < itemDownHeight + itemHeight) {
            if(scrollHandle.getScrollView().__maxScrollTop - scrollHandle.getScrollView().__scrollTop > (CutOffNotice.notices.length - index - 1) * itemHeight){
              scrollHandle.scrollTo(0, (index) * itemHeight - window.screen.height + itemDownHeight + itemHeight + itemHeight + 5, true);
            }
          }
        }, 10);
      } else {
        //按的同一个
        scrollHandle.resize();
        CutOffNotice.timeoutHandle = $timeout(function(){
          //这个时候的page已经只loadmore里+1过了，因此需要-1
          if(total > (page - 1) * pagesize){
            CutOffNotice.noMorePage = false;
          }
        }, 10);
        CutOffNotice.selectedIndex = '';
      }
    };

    CutOffNotice.loadMore = function(){
      CutOffNotice.getNotice();
    };

    CutOffNotice.prePage = function(){
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.afterEnter', function(){
      CutOffNotice.getNotice();
    });

    $scope.$on('$destroy', function() {
      $timeout.cancel(CutOffNotice.timeoutHandle);
    });
  }
}());

/**
 * Created by linlong on 2017/1/9.
 */



(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRouteRecharge);

    /* @ngInject */
    function initBindNumberRouteRecharge($stateProvider) {
        $stateProvider
            .state('tab.ctRecharge', {
                url: '/ctRecharge',
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/ct-recharge/ct-recharge.html',
                        controller: 'ctRechargeCtrl',
                        controllerAs: 'ctRechargeVM'
                    }
                }
            })
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('ctRechargeCtrl', ctRecharge);

    function ctRecharge($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }
        var ctRechargeVM = this;
        ctRechargeVM.goBack = function() {
            //console.log('111');
            $ionicHistory.goBack();
        };


        ctRechargeVM.openN = function() {
            console.log(baseConfig.nativeScreenFlag == true);
            console.log(baseConfig.nativeScreenFlag);
            if (ionic.Platform.isIOS()) {
                bjgasPopup.showPopup('ios没有nfc功能');
            } else
            if (baseConfig.nativeScreenFlag == false) {
                localStorage.nfcInfo = JSON.stringify(JSON.stringify({
                    "userNumber": "F952431719579000",
                    "cardNumber": "00000000000001799000",
                    "gasNumber": "F949855976109000",
                    "1A": "0102030405060709009300000000000000000179201612050000000000009000",
                    "1B": "FFFFF94985597610F95243171957011000050005000100012C0008010520121212000000000000009000",
                    "remaining": "0000012C9000"
                }));
                $state.go('tab.mobileRecharge');
            } else {
                cordova.plugins.nfc.getnfc(success, fail,
                    "00A4040010D1560000014343422F47475359030000",
                    "00B08A0806",
                    "00B0950C08",
                    "00B08A0206",
                    "00B095001E",
                    "00B08A0028",
                    "805C000204");
            }


            function success(data) {
                console.log(JSON.stringify(data));
                console.log(data);
                if(data ==""){
                    bjgasPopup.showPopup('没有读到数据,请重试');
                    return;
                }
                localStorage.nfcInfo = JSON.stringify(data);
                $state.go('tab.mobileRecharge');

            }

            function fail(data) {
                console.log(angular.toJson(data));
            }
            // $state.go('tab.nfcRecharge');
        };
        ctRechargeVM.toCRecharge = function() {
            //console.log("agaalfla");
            $state.go('tab.nfcRecharge');

        };

    }
}());
/**
 * Created by linlong on 2017/1/9.
 */


(function () {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRouteMobile);

    /* @ngInject */
    function initBindNumberRouteMobile($stateProvider) {
        $stateProvider
            .state('tab.mobileRecharge', {
                url: '/mobileRecharge',
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/ct-recharge/mobile-recharge.html',
                        controller: 'mobileRechargeCtrl',
                        controllerAs: 'mobileRechargeVM'
                    }
                }
            })
    }
}());

(function () {
    "use strict";
    angular.module('northGas')
        .controller('mobileRechargeCtrl', mobileRecharge);

    function mobileRecharge($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser,$ionicPopup) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }
sessionStorage.payOrigin = "recharge";

        var mobileRechargeVM = this;
        //    $scope.$broadcast('to-child', 'child');
        // 	$scope.$on('to-child', function(){

        //     });
        var obileRechargeUserInfo = JSON.parse(window.localStorage.userInfo);
        var flagdatazhiv = -1;
        var aaa = JSON.parse(localStorage.nfcInfo);
    console.log(JSON.parse(localStorage.nfcInfo));
        console.log(localStorage.nfcInfo);
    var parmper = [];
        try {
           parmper  = JSON.parse(aaa);
        } catch (e) { }
        mobileRechargeVM.datazhi = ["50m³", "100m³", "150m³", "200m³", "350m³", "1850m³"];
        mobileRechargeVM.datazhiv = [50, 100, 150, 200, 350, 1850];
        mobileRechargeVM.goBack = function () {
            $ionicHistory.goBack();
        };
        mobileRechargeVM.toreChargeListMain = function () {
            $state.go('tab.rechargeList');
        }

       $scope.$on('$ionicView.afterEnter', function() {
           console.log(sessionStorage.payFlag);
           if(sessionStorage.payFlag == "true"){
            // confirm("支付成功?","继续支付","成功",writeCard);
            console.log(parseInt(sessionStorage.aparmchoseNumber))
                   mobileRechargeVM.data.gasRemain = parseInt(mobileRechargeVM.data.gasRemain) + parseInt(sessionStorage.aparmchoseNumber);
           }
             sessionStorage.payFlag = "false";
        });

        function writeCard(){
          cordova.plugins.nfc.rechargenfc(success, fail,
                    "00A4040010D1560000014343422F47475359030000",
                    "0020000003000000", //PIN命令
                    mobileRechargeVM.data.initInstruct, //充值初始化命令
                    "http://zttest.bjgas.com/bjgas-server/i/api/nfcBuyConfirm/" + mobileRechargeVM.data.infoId + "/");
        }
        $scope.$on('$destroy', function () {
            bjgasPopup.hideLoading();
        });
        mobileRechargeVM.choseNumber == "";
        mobileRechargeVM.paycharge = function () {
            var aparmchoseNumber = 0;
            if (mobileRechargeVM.choseNumber == "" && flagdatazhiv == -1) {
                bjgasPopup.showPopup('请选择充值选项或输入充值数据');
                return;
            }
            if (mobileRechargeVM.choseNumber == "") {
                aparmchoseNumber = mobileRechargeVM.datazhiv[flagdatazhiv];
            } else {
                aparmchoseNumber = mobileRechargeVM.choseNumber;
            }
            sessionStorage.aparmchoseNumber = aparmchoseNumber;
            var userUrl = baseConfig.basePath + 'i/api/nfcGetPrice';
            var parm = {
                "userNumber": parmper.userNumber,
                "gasNumber": parmper.gasNumber,
                "cardNumber": parmper.cardNumber,
                "userId": obileRechargeUserInfo.userId,
                "gasBuyCnt": aparmchoseNumber,
                "cardType": "CPUMETER",
                "str1A": parmper['1A'],
                "str1B": parmper['1B']
            }
            console.log(angular.toJson(parm));
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            bjgasHttp.post(userUrl, parm).success(function (response) {
                console.log("angular.toJson(response):" + angular.toJson(response))
                console.log(response.rows[0].infoId);
 sessionStorage.mobileRechargeVMData = JSON.stringify(response.rows[0]);
                console.log({
                    "orderNo": response.rows[0].serailNum,
                    "payType": "WX",
                    "businessType": "nfc"
                })
                console.log(response.rows[0].amout);
                $state.go('tab.appPay',
                    {
                        count:response.rows[0].amout,
                        order: {
                            "orderNo": response.rows[0].serailNum,
                            "payType": "WX",
                            "businessType": "nfc"
                        }
                    }
                )
                // cordova.plugins.nfc.rechargenfc(success, fail,
                //     "00A4040010D1560000014343422F47475359030000",
                //     "0020000003000000", //PIN命令
                //     response.rows[0].initInstruct, //充值初始化命令
                //     "http://zttest.bjgas.com/bjgas-server/i/api/nfcBuyConfirm/" + response.rows[0].infoId + "/");


                //                 {
                //     "rows": [
                //         {
                //             "infoId": "7b41eed2-ba57-4be5-9cff-9d5f18f5a8cd",
                //             "gasNumber": "94985597610",
                //             "accountRemainAmount": "",
                //             "amout": "780.0",
                //             "gasBuyAmount": "780.00",
                //             "userNumber": "95243171957",
                //             "cardNumber": "0000000000000179"
                //         }
                //     ],
                //     "success": true,
                //     "total": 1
                // }
                if (response.rows[0]) {

                }
            }).error(function (error) {

            }).finally(function () {
                bjgasPopup.hideLoading();
            });

        }
             function success(data) {
                    // alert(angular.toJson(data));
                    // alert("写卡成功");
                    var data1 = JSON.parse(data)
                    if (data1.recharge == undefined) {
                        bjgasPopup.showPopup('写卡失败');
                    } else {
                        bjgasPopup.showPopup('写卡成功');
                        mobileRechargeVM.data.gasRemain = parseInt(mobileRechargeVM.data.gasRemain) + parseInt(mobileRechargeVM.datazhiv[flagdatazhiv]);

                    }


                }

                function fail(data) {
                    // alert(angular.toJson(data));
                    bjgasPopup.showPopup('写卡失败');
                    // alert("写卡失败." + data.recharge);
                }
        var rechargeValueEle = document.getElementsByClassName("item-zhi");
        console.log(rechargeValueEle);
        console.log(rechargeValueEle[0]);


        mobileRechargeVM.choseValue = function (id) {
            if (rechargeValueEle[id].style.border == "none") {
                rechargeValueEle[id].style.backgroundColor = "white";
                rechargeValueEle[id].style.color = "black";
                rechargeValueEle[id].style.border = "1px solid #000000";
                flagdatazhiv = -1
                return;
            }
            for (var i = 0; i < 6; i++) {
                if (i == id) {
                    rechargeValueEle[i].style.backgroundColor = "rgb(37,166,247)";
                    rechargeValueEle[i].style.color = "white";
                    rechargeValueEle[i].style.border = "none";
                } else {
                    rechargeValueEle[i].style.backgroundColor = "white";
                    rechargeValueEle[i].style.color = "black";
                    rechargeValueEle[i].style.border = "1px solid #000000";
                }

            }
            mobileRechargeVM.choseNumber = "";
            console.log(mobileRechargeVM.choseNumber);
            flagdatazhiv = id;

        }



        mobileRechargeVM.changeValue = function () {
            console.log("11");
            flagdatazhiv = -1;
            for (var i = 0; i < 6; i++) {
                rechargeValueEle[i].style.backgroundColor = "white";
                rechargeValueEle[i].style.color = "black";
                rechargeValueEle[i].style.border = "1px solid #000000";
            }
        }
        var userUrl = baseConfig.basePath + 'i/api/nfcInfo';
        var parm = {
            "userNumber": parmper.userNumber,
            "gasNumber": parmper.gasNumber,
            "cardNumber": parmper.cardNumber,
            "userId": obileRechargeUserInfo.userId,
            "gasRemain": parmper.remaining
        }
        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl, parm).success(function (response) {
            console.log(angular.toJson(response));
            mobileRechargeVM.data = response.rows[0];

            // {
            //     "rows": [
            //         {
            //             "infoId": "f54a8177-5406-46e6-90db-057548afad1b",//数据ID
            //             "gasCompName": "",//分公司名称
            //             "subsidyGas": "",//补贴气量
            //             "cardTypeDesc": "",//卡类型描述
            //             "gasNumber": "94985597610",//用气点编码
            //             "gasCompCode": "",//分公司代码
            //             "gasBuyMax": "",//最大购气量
            //             "cardType": "CPUMETER",//卡类型
            //             "userNumber": "95243171957",//用户编码
            //             "cardNumber": "0000000000000179",//卡编码
            //             "cardStatus": "Y"//卡状态
            //         }
            //     ],
            //     "success": true,//错误标识
            //     "total": 1//数量
            // }
        }).error(function (error) {

        }).finally(function () {
            bjgasPopup.hideLoading();
        });

            //确认取消弹出框 onConfirm(0)表示点击取消 onConfirm(1)表示点击确认
        function confirm(message, falseMess, trueMess, onConfirm) {
            if (!baseConfig.nativeScreenFlag || ionic.Platform.isAndroid()) {
                var confirmPopup = $ionicPopup.confirm({
                    template: typeof(message) === "undefined" ? '提示' : message,
                    cancelText: falseMess,
                    cancelType: 'button-cux-popup-cancel',
                    okText: trueMess,
                    okType: 'button-cux-popup-confirm'
                });
                confirmPopup.then(function(res) {
                    var index = 0;
                    if (res) {
                        index = 1;
                    }
                    if (typeof(onConfirm) === "function") {
                        onConfirm(index);
                    }
                });
            } else {
                navigator.notification.confirm(
                    message,
                    function(index) {
                        if (typeof(onConfirm) === "function") {
                            onConfirm(index - 1);
                        }
                    },
                    '', [falseMess, trueMess]
                );
            }
        }


    }
}());
/**
 * Created by linlong on 2017/1/9.
 */


(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRouteMobile);

    /* @ngInject */
    function initBindNumberRouteMobile($stateProvider) {
        $stateProvider
            .state('tab.nfcRecharge', {
                url: '/nfcRecharge',
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/ct-recharge/nfc-recharge.html',
                        controller: 'nfcRechargeCtrl',
                        controllerAs: 'nfcRechargeVM'
                    }
                }
            })
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('nfcRechargeCtrl', nfcRechargeCtrl);

    function nfcRechargeCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser, $ionicPopup) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }


        var nfcRechargeVM = this;
        nfcRechargeVM.datazhi = [50, 100, 150, 200, 350, 1850];
        nfcRechargeVM.goBack = function() {
            $ionicHistory.goBack();
        };

        // confirm("已获取卡信息", "返回", "前往充值", function(index) {

        //         if (index == 0) {

        //         } else {
        //             $state.go('tab.mobileRecharge');
        //         }
        //     })
        // confirm("您尚未开启NFC功能,请先前往设置开启NFC", "返回", "前往设置", function(index) {

        //     if (index == 0) {

        //     } else {
        //         $state.go('tab.mobileRecharge');
        //     }
        // });

        nfcRechargeVM.toreChargeListMain = function() {
                $state.go('tab.rechargeList');

            }
            //确认取消弹出框 onConfirm(0)表示点击取消 onConfirm(1)表示点击确认
        function confirm(message, falseMess, trueMess, onConfirm) {
            if (!baseConfig.nativeScreenFlag || ionic.Platform.isAndroid()) {
                var confirmPopup = $ionicPopup.confirm({
                    template: typeof(message) === "undefined" ? '提示' : message,
                    cancelText: falseMess,
                    cancelType: 'button-cux-popup-cancel',
                    okText: trueMess,
                    okType: 'button-cux-popup-confirm'
                });
                confirmPopup.then(function(res) {
                    var index = 0;
                    if (res) {
                        index = 1;
                    }
                    if (typeof(onConfirm) === "function") {
                        onConfirm(index);
                    }
                });
            } else {
                navigator.notification.confirm(
                    message,
                    function(index) {
                        if (typeof(onConfirm) === "function") {
                            onConfirm(index - 1);
                        }
                    },
                    '', [falseMess, trueMess]
                );
            }
        }

        if (baseConfig.nativeScreenFlag == true) {
            cordova.plugins.nfc.getnfc(success, fail,
                "00A4040010D1560000014343422F47475359030000",
                "00B08A0806",
                "00B0950C08",
                "00B08A0206",
                "00B095001E",
                "00B08A0028",
                "805C000204");
        } else {
            sessionStorage.nfcInfo = JSON.stringify({
                "userNumber": "F952431719579000",
                "cardNumber": "00000000000001799000",
                "gasNumber": "F949855976109000",
                "1A": "0102030405060709009300000000000000000179201612050000000000009000",
                "1B": "FFFFF94985597610F95243171957011000050005000100012C0008010520121212000000000000009000",
                "remaining": "0000012C9000"
            });
            confirm("您尚未开启NFC功能,请先前往设置开启NFC", "返回", "前往设置", function(index) {
                if (index == 0) {} else {
                    $state.go('tab.mobileRecharge');
                }
            });
        }


        function success(data) {
            console.log(data);
            console.log(JSON.parse(data));
            console.log(JSON.stringify(data));
            localStorage.nfcInfo = JSON.stringify(data);
            confirm("已获取卡信息", "返回", "前往充值", function(index) {

                if (index == 0) {

                } else {
                    $state.go('tab.mobileRecharge');
                }
            })
        }

        function fail(data) {
            console.log(angular.toJson(data));
        }
        //         Example:
        // <pre><code>
        // cordova.plugins.nfc.getnfc(success,fail,
        // "00A4040010D1560000014343422F47475359030000",
        // "00B08A0806",
        // "00B0950C08",
        // "00B08A0206",
        // "00B095001E",
        // "00B08A0028",
        // "805C000204");
        // </code></pre>

        // <pre><code>
        // {"userNumber":"F952431719579000",
        // "cardNumber":"00000000000001799000",
        // "gasNumber":"F949855976109000",
        // "1A":"0102030405060709009300000000000000000179201612050000000000009000",
        // "1B":"FFFFF94985597610F95243171957011000050005000100012C0008010520121212000000000000009000",
        // "remaining":"0000012C9000"}
        // </code></pre>


        // ### 说明：充值nfc卡

        // * successCallback：function 成功回调
        // * errorCallback: function 失败回调
        // * 三个参数，第一个对应是的选择应用命令
        //   ，第二个是PIN命令，第三个是充值初始化命令，参数的个数不能错。

        // cordova.plugins.nfc.rechargenfc(success,fail,
        // "00A4040010D1560000014343422F47475359030000",
        // "0020000003000000", //PIN命令
        // "805000020B010000006400000000000110");  //充值初始化命令


    }
}());

/**
 * Created by USER on 2017/1/11.
 */

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initBindNumberRouteList);

  /* @ngInject */
  function initBindNumberRouteList($stateProvider) {
    $stateProvider
      .state('tab.rechargeListDetail', {
        url: '/rechargeListDetail',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/ct-recharge/recharge-list-detail.html',
            controller: 'rechargeListDetailCtrl',
            controllerAs: 'rechargeListDetailVM'
          }
        }
      })
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('rechargeListDetailCtrl', rechargeListDetail);
  function rechargeListDetail($scope, $state, $ionicHistory, bjgasPopup, baseConfig,bjgasHttp,switchUser) {
    if(baseConfig.debug) {
      console.log('CheckStaffInputCtrl');
    }


    var rechargeListDetailVM = this;
    rechargeListDetailVM.goBack = function() {
      $ionicHistory.goBack();
    };
    rechargeListDetailVM.list=[{"name":"燃气户号","value":"92348934"}      ,
      {"name":"充值金额","value":"100.00"},
      {"name":"当前状态","value":"n"},
      {"name":"支付方式","value":"支付宝支付"},
      {"name":"支付时间","value":"2015-12-12 12:12:12"},
      {"name":"支付单号","value":"amdhaf-3323908080192"}
    ];

  }
}());

/**
 * Created by USER on 2017/1/11.
 */

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initBindNumberRouteRechargeList);

  /* @ngInject */
  function initBindNumberRouteRechargeList($stateProvider) {
    $stateProvider
      .state('tab.rechargeList', {
        url: '/rechargeList',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/ct-recharge/recharge-list.html',
            controller: 'rechargeListCtrl',
            controllerAs: 'rechargeListVM'
          }
        }
      })
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('rechargeListCtrl', rechargeList);

  function rechargeList($scope, $state, $ionicHistory, bjgasPopup, baseConfig,bjgasHttp,switchUser) {
    if(baseConfig.debug) {
      console.log('CheckStaffInputCtrl');
    }


    var rechargeListVM = this;
    rechargeListVM.goBack = function() {
      $ionicHistory.goBack();
    };
    rechargeListVM.toDetail =function(){
      $state.go('tab.rechargeListDetail');
    }

    rechargeListVM.list=[{"listid":"1000002348934","bill":"100.00","date":"2012-12-12 12:12:12","state":"s"}
    ,
      {"listid":"1000002348935","bill":"150.00","date":"2012-02-12 12:12:12","state":"y"},
      {"listid":"1000002348936","bill":"100.00","date":"2012-09-12 12:12:12","state":"c"}
      ];

  }
}());

(function () {
  'use strict';
  angular.module('northGas.customFilter').filter('stateData', function () {
    return function (data, flag) {
      try {
        if (data == "y") {
          return "已退款";
        } else if(data == "s"){
          return "已支付待写卡";
        }else if(data == "c"){
          return "充值成功";
        }
      } catch (e) {
        return data;
      }

    };
  });
})();

/**
 * Created by linlong on 2016/12/15.
 */
(function() {
    // "use strict";
    angular.module("northGas")
        .config(initGasBillRoute);

    /* @ngInject */
    function initGasBillRoute($stateProvider) {
        $stateProvider
            .state('tab.gasBillMain', {
                url: '/gas/gasBillMain',
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/gas-bills/gas-bills-main.html',
                        controller: 'gasBillsMainCtrl',
                        controllerAs: 'gasBillsMainVM'
                    }
                }

            })
            .state('tab.gasBillMainMine', {
                url: '/gas/gasBillMainMine',
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/gas/gas-bills/gas-bills-main.html',
                        controller: 'gasBillsMainCtrl',
                        controllerAs: 'gasBillsMainVM'
                    }
                }

            });
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('gasBillsMainCtrl', gasBillsMainCtrl);

    function gasBillsMainCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, checkStaffService, switchUser, bjgasHttp) {
sessionStorage.payOrigin = "bills";
        var gasBillsMainVM = this;
        var info = switchUser.getUserInfo();
        $scope.$on('$ionicView.beforeEnter', function() {
            var info = switchUser.getUserInfo();
            //console.log(info);
            //console.log(info.meterType);
            gasBillsMainVM.meterType = info.meterType;
            if (info.userId == "") {
                bjgasPopup.confirm('尚未绑定户号，请先绑定', function(index) {
                    if (index == 0) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('tab.gasCancelMain');
                    }
                });
            } else {
                gasBillsMainVM.axis = {
                    month: [],
                    data: [],
                    year:[]
                };




                var userUrl = baseConfig.basePath + 'r/api?sysName=CCB&apiName=CM-MOB-IF06';
                var data = {
                    "CM-MOB-IF06": {
                        "input": { "UniUserCode": info.userCode }
                    }
                };
                //console.log(data);
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                bjgasHttp.post(userUrl, data).success(function(response) {
                    //console.log("充值" + angular.toJson(response));
                    var dataTemp = [];
                    if (gasBillsMainVM.chong = response["soapenv:Envelope"]["soapenv:Body"]["CM-MOB-IF06"].output.billHis == undefined) {

                        gasBillsMainVM.chong = response["soapenv:Envelope"]["soapenv:Body"]["CM-MOB-IF06"].output.chargeHis;
                        if (gasBillsMainVM.chong.length == undefined) {
                            gasBillsMainVM.chong = [];
                            gasBillsMainVM.chong.push(response["soapenv:Envelope"]["soapenv:Body"]["CM-MOB-IF06"].output.chargeHis);
                        }
                        if (gasBillsMainVM.chong == undefined) {
                            bjgasPopup.showPopup("未获取到数据!", gasBillsMainVM.prePage);
                            return;
                        } else {
                            for (var i = 0; i < gasBillsMainVM.chong.length; i++) {
                                dataTemp.push({
                                    "BillDate": gasBillsMainVM.chong[i].PayDate,
                                    "BillAmt": gasBillsMainVM.chong[i].PayAmt,
                                    "BillSq": gasBillsMainVM.chong[i].PaySq
                                });

                            }
                            gasBillsMainVM.chong = dataTemp;
                        }

                    } else {
                        gasBillsMainVM.chong = response["soapenv:Envelope"]["soapenv:Body"]["CM-MOB-IF06"].output.billHis;
                        if (gasBillsMainVM.chong.length == undefined) {
                            gasBillsMainVM.chong = [];
                            gasBillsMainVM.chong.push(response["soapenv:Envelope"]["soapenv:Body"]["CM-MOB-IF06"].output.billHis);
                        }
                    }

                    for (var i = 0; i < gasBillsMainVM.chong.length; i++) {
                        var flag = 0;
                        for (var j = 0; j < gasBillsMainVM.axis.month.length; j++) {
                            if (gasBillsMainVM.axis.month[j] == gasBillsMainVM.chong[i].BillDate.substring(2, 7) + '月'
                             && gasBillsMainVM.axis.year[j]==  gasBillsMainVM.chong[i].BillDate.substring(1, 4)) {
                                gasBillsMainVM.axis.data[j] = JSON.parse(gasBillsMainVM.axis.data[j]) + JSON.parse(gasBillsMainVM.chong[i].BillSq);
                                flag = 1;
                            }
                        }
                        if (flag == 0) {
                            gasBillsMainVM.axis.month.push(gasBillsMainVM.chong[i].BillDate.substring(2, 7) + '月');
                            gasBillsMainVM.axis.year.push(gasBillsMainVM.chong[i].BillDate.substring(1, 4) );
                            gasBillsMainVM.axis.data.push(gasBillsMainVM.chong[i].BillSq);
                            //console.log(gasBillsMainVM.chong[i].BillDate.substring(5, 7));
                            //console.log(gasBillsMainVM.chong[i].BillAmt);
                        }


                    }
                    var myChart = echarts.init(document.getElementById('mainzhu'));
                    // 指定图表的配置项和数据
                    var option = {
                        color: ['#3398DB'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'category',
                            data: gasBillsMainVM.axis.month,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }],
                        yAxis: [{
                            type: 'value'
                        }],
                        series: [{
                            name: '用气量',
                            type: 'bar',
                            barWidth: '60%',
                            data: gasBillsMainVM.axis.data
                        }]
                    };

                    // 最近12个月充值记录
                    // 最近12个月充值气量分析
                    // 使用刚指定的配置项和数据显示图表。

                    myChart.setOption(option);
                    gasBillsMainVM.data = {
                        "userAddre": info.label,
                        "userNumber": info.userCode,
                        "addrMess": info.address,
                        "metertype": info.meterType,
                        "billsDate": "2016年09月账单",
                        "money": "283.08元",
                        "curShowAmount": "4566.000",
                        "lastShowAmount": "4389.000",
                        "lastGasAmount": "56.000m³",
                        "curGasAmount": "49.000m³",
                        "GasAmount": "101.000m³",
                        "firstGasAmount": "78.000m³",
                        "secondGasAmount": "0",
                        "thirdGasAmount": "0",
                        "firstBillsAmount": "128.000元",
                        "secondBillsAmount": "0",
                        "thirdBillsAmount": "0",
                        "phone": "62330208",
                        "payBills": "---",
                        items: gasBillsMainVM.chong
                    }
                    var userUrl = baseConfig.basePath + 'i/api/shdPayAmt';
                    var parm = {
                        "userCode": info.userCode
                    }
                    bjgasHttp.post(userUrl, parm).success(function(response) {
                            gasBillsMainVM.data.payBills = response.code;
                        })
                        //console.log(angular.toJson(gasBillsMainVM));

                    if (response.success == true) {

                    } else {

                    }
                }).error(function(error) {}).finally(function() {
                    bjgasPopup.hideLoading();
                });
            }


        });

        gasBillsMainVM.payMoney = function(){

    bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            //console.log("$stateParams+" + angular.toJson($stateParams));
            var userUrl = baseConfig.basePath + 'i/api/addGasPayOrder';
            var data =
            {
	"userId": info.userId,
	"userCode": info.userCode,
	"payAmount": gasBillsMainVM.data.payBills
};
            bjgasHttp.post(userUrl, data).success(function(response) {
                console.log(angular.toJson(response));
                // {"rows":[{"orderNo":"APP1486708688537",
                // "id":"5643218d-1220-454f-846f-109119b95214"}],"success":true,"total":1}

                $state.go('tab.appPay',
                    {
                        count:gasBillsMainVM.data.payBills,
                        order: {
                            "orderNo": response.rows[0].orderNo,
                    "payType": "WX",
                    "businessType": "pay"
                        }
                    }
                )

            }).error(function(error) {}).finally(function() {
                bjgasPopup.hideLoading();
            });
        }
        if (baseConfig.debug) {
            //console.lo('CheckStaffInputCtrl');
        }
        $scope.$on('$destroy', function() {
            bjgasPopup.hideLoading();
        });
        gasBillsMainVM.prePage = function() {
            $ionicHistory.goBack();
        };
        gasBillsMainVM.togasCancelMain = function() {

            if ($state.current.name == 'tab.gasBillMain') {
                $state.go('tab.switchUser');
            } else if ($state.current.name == 'tab.gasBillMainMine') {
                $state.go('tab.switchUserMine');
            } else {}

        }
        gasBillsMainVM.tobBillsDetail = function(item) {
            // console.log("item:" + angular.toJson(item));
            if ($state.current.name == 'tab.gasBillMainMine') {
                if (gasBillsMainVM.data.metertype == "C") {

                } else {
                    $state.go('tab.gasBillMine', { data: item });
                }
            } else if ($state.current.name == 'tab.gasBillMain') {
                if (gasBillsMainVM.data.metertype == "C") {

                } else {
                    $state.go('tab.gasBill', { data: item });
                }
            }
        }
    }
}());

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('billsOneFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {

                    return "最近12个月充值记录";
                } else {
                    return "最近12个月账单";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('billsTwoFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {

                    return "最近12个月充值气量分析";
                } else {
                    return "最近12个月用气量分析";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('payOrBillDateFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {
                    return "充值日期";
                } else {
                    return "时间";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();
(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('payOrBillMoneyFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {
                    return "充值金额";
                } else {
                    return "本次金额";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();
(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('payOrBillQuatityFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {
                    return "充值气量";
                } else {
                    return "当期用量";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();



(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('billsTitleFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {

                    return "充值记录";
                } else {
                    return "气费账单";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();
/**
 * Created by linlong on 2016/12/15.
 */
(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindBillRoute);

    /* @ngInject */
    function initBindBillRoute($stateProvider) {
        $stateProvider
            .state('tab.gasBill', {
                url: '/gasBill',
                params: { data: '' },
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/gas-bills/gas-bill.html',
                        controller: 'gasBillsCtrl',
                        controllerAs: 'gasBillsVM'
                    }
                }
            })
            .state('tab.gasBillMine', {
                url: '/gasBillMine',
                params: { data: '' },
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/gas/gas-bills/gas-bill.html',
                        controller: 'gasBillsCtrl',
                        controllerAs: 'gasBillsVM'
                    }
                }
            });
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('gasBillsCtrl', gasBillsCtrl);

    function gasBillsCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, checkStaffService, $stateParams, switchUser, bjgasHttp) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }

        var gasBillsVM = this;

        console.log(angular.toJson($stateParams));
        $scope.$on('$ionicView.beforeEnter', function() {
            var info = switchUser.getUserInfo();
            gasBillsVM.data = {
                "userAddre": info.label,
                "userNumber": info.userCode,
                "addrMess": info.address,
                "billsDate": $stateParams.data.BillDate.substring(0, 4) + "年" + $stateParams.data.BillDate.substring(5, 7) + "月账单",
                // $stateParams.data.BillDate.substring(0, 4) + "年" + $stateParams.data.BillDate.substring(6, 8) + "月账单"
                "money": "283.08元",
                "curShowAmount": "4566.000",
                "lastShowAmount": "4389.000",
                "lastGasAmount": "56.000m³",
                "curGasAmount": "49.000m³",
                "GasAmount": "101.000m³",
                "firstGasAmount": "78.000m³",
                "secondGasAmount": "0",
                "thirdGasAmount": "0",
                "firstBillsAmount": "128.000元",
                "secondBillsAmount": "0",
                "thirdBillsAmount": "0",
                "phone": "62330208"
            }

            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            //console.log("$stateParams+" + angular.toJson($stateParams));
            var userUrl = baseConfig.basePath + 'r/api?sysName=CCB&apiName=CM-MOB-IF16';
            var data = {
                "CM-MOB-IF16": {
                    "input": {
                        "BillID": $stateParams.data.BillId
                            //   "234596945584"
                    }
                }
            };
            // $stateParams.data.BillId+''
            //console.log(angular.toJson(data));
            // BillId
            bjgasHttp.post(userUrl, data).success(function(response) {
                //console.log(angular.toJson(response));
                if (response["soapenv:Envelope"]["soapenv:Body"]["CM-MOB-IF16"] == undefined) {

                    bjgasPopup.confirm('未能获取数据', function(index) {
                        if (index == 0) {
                            $ionicHistory.goBack();
                        } else {
                            $ionicHistory.goBack();
                            // $state.go('tab.noGasFromRepair');
                        }
                    });


                } else {
                    gasBillsVM.chong = response["soapenv:Envelope"]["soapenv:Body"]["CM-MOB-IF16"].output;
                    console.log("gasBillsVM.chong" + $stateParams);
                    gasBillsVM.data = {
                        "userAddre": info.label,
                        "userNumber": info.userCode,
                        "addrMess": info.address,
                        "billsDate": $stateParams.data.BillDate.substring(0, 4) + "年" + $stateParams.data.BillDate.substring(5, 7) + "月账单",
                        "money": "283.08元",
                        "curShowAmount": "4566.000",
                        "lastShowAmount": "4389.000",
                        "lastGasAmount": "56.000m³",
                        "curGasAmount": "49.000m³",
                        "GasAmount": "101.000m³",
                        "firstGasAmount": gasBillsVM.chong,
                        "Step2Qty": gasBillsVM.chong.StepPriceInfo.Step2Qty, //第二阶梯气量
                        "Step3Charge": gasBillsVM.chong.StepPriceInfo.Step3Charge, //第三阶梯气费
                        "Step1Charge": gasBillsVM.chong.StepPriceInfo.Step1Charge, //第一阶梯气费
                        "Step1Qty": gasBillsVM.chong.StepPriceInfo.Step1Qty, //第一阶梯气量
                        "Step2Charge": gasBillsVM.chong.StepPriceInfo.Step2Charge, //第二阶梯气费
                        "Step3Qty": gasBillsVM.chong.StepPriceInfo.Step3Qty,
                        "CurntQty": gasBillsVM.chong.MRInfo.CurntQty, //当期用量
                        "PreNum": gasBillsVM.chong.MRInfo.PreNum, //上次抄表数
                        "PreQty": gasBillsVM.chong.MRInfo.PreQty, //往期用
                        "MeterNum": gasBillsVM.chong.MRInfo.MeterNum, //本抄表数
                        "PhNum": gasBillsVM.chong.PhNum, //联系电话
                        "BillAmt": gasBillsVM.chong.BillAmt, //本次金额s
                        "Qty": gasBillsVM.chong.Qty,
                        "secondGasAmount": "0",
                        "thirdGasAmount": "0",
                        "firstBillsAmount": "128.000元",
                        "secondBillsAmount": "0",
                        "thirdBillsAmount": "0",
                        "phone": "62330208",
                        "payBills": "283.08",
                        items: gasBillsVM.chong
                    }
                }


                if (response.success == true) {

                } else {

                }
            }).error(function(error) {}).finally(function() {
                bjgasPopup.hideLoading();
            });
        });


        gasBillsVM.prePage = function() {
            $ionicHistory.goBack();
        };
        gasBillsVM.togasCancelMain = function() {

            if ($state.current.name == 'tab.gasBill') {
                $state.go('tab.switchUser');
            } else if ($state.current.name == 'tab.gasBillMine') {
                $state.go('tab.switchUserMine');
            } else {}
        }
    }
}());
/**
 * Created by linlong on 2016/11/7.
 */
(function() {
  "use strict";
  angular.module('northGas.gasStop', [])
    .controller('gasStopCtrl', gasStopCtrl);
  /* @ngInject */
  function gasStopCtrl($scope, $ionicScrollDelegate, $ionicPopup,$ionicHistory,$state) {
    var shopCart = this;
    init();


    /*初始化点击事件*/
    function init() {
      var timestamp = new Date().getTime();
      //为了获取默认门店需要添加openID参数

      // $scope.data=[{"stopGasId":"053e299bee7a4a7dbaad0baa7263cef4","stopGasArea":"海淀区","reach":"西至永定路，北至北太平路，南至莲石路，东至西四环，涉及民用4398户，公服26户","startDate":"2016-11-04 12:30:00","endDate":"2016-11-04 15:00:00","stopGasType":"计划停气","stopGasCauses":"燃气工程施工","noticeDate":"2016-11-01","page":0,"pagesize":0}
      //         ,{"stopGasId":"053e299bee7a4a7dbaad0baa7263cef4","stopGasArea":"海淀区","reach":"西至永定路，北至北太平路，南至莲石路，东至西四环，涉及民用4398户，公服26户","startDate":"2016-11-04 12:30:00","endDate":"2016-11-04 15:00:00","stopGasType":"计划停气","stopGasCauses":"燃气工程施工","noticeDate":"2016-11-01","page":0,"pagesize":0}
      // ]
      var bannerUrl = baseConfig.basePath + 'c/api/app/notice/query';
      bjgasHttp.post(bannerUrl).success(function(response) {
              console.log(angular.toJson(response));
      });

    }
    $scope.GoBack = function(){

      $state.go("tab.gas");
    }
    var contentBody = document.getElementsByClassName('contentBody');
    var contentIconLeft1 = document.getElementsByClassName('contentIconLeft1');
    var contentIconLeft2 = document.getElementsByClassName('contentIconLeft2');
   $scope.addDiv = function (i){
      // console.log(i);

      if(contentBody[i].style.display == "none"){
        contentBody[i].style.display = "block";
        contentIconLeft1[i].style.display = "none";
        contentIconLeft2[i].style.display = "block";
      }else{
        contentBody[i].style.display = "none";
        contentIconLeft1[i].style.display = "block";
        contentIconLeft2[i].style.display = "none";
      }

    }
    function removeDiv(i){
      //// console.log(i);
      var contentBody = document.getElementsByClassName('contentBody');
      var contentIconLeft1 = document.getElementsByClassName('contentIconLeft1');
      var contentIconLeft2 = document.getElementsByClassName('contentIconLeft2');
    }
  }
})();

(function(){
  angular.module('northGas')
   .config(initKnowledgeDetailRoute);

   function initKnowledgeDetailRoute($stateProvider){
     $stateProvider
     .state('tab.KnowledgeDetail', {
       url: '/knowledge-detail',
       params: {detail: ''},
       views: {
         'tab-gas': {
           templateUrl: 'pages/gas/knowledge-lib/detail.html',
           controller: 'KnowledgeDetailCtrl',
           controllerAs: 'KnowledgeDetail'
         }
       }
     });
   }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('KnowledgeDetailCtrl', KnowledgeDetailCtrl);

  function KnowledgeDetailCtrl($scope, $stateParams, $timeout, $ionicHistory, $sce, bjgasHttp, bjgasPopup, baseConfig) {
    var KnowledgeDetail = this;

    KnowledgeDetail.needBind = false;
    KnowledgeDetail.title = '';
    KnowledgeDetail.content = '';
    KnowledgeDetail.date = '';
    KnowledgeDetail.author = '';
    KnowledgeDetail.initTouchHandle = '';
    KnowledgeDetail.touchHandle = '';
    KnowledgeDetail.onGet = false;

    $scope.$on('$ionicView.afterEnter', function(){
      if($stateParams.detail){
        getContentById($stateParams.detail.id);
      }
    });

    $scope.$on('$destroy', function () {
      $timeout.cancel(KnowledgeDetail.initTouchHandle);
      $timeout.cancel(KnowledgeDetail.touchHandle);
    });

    function onContent(resp){
      if(resp.success){
        KnowledgeDetail.needBind = true;
        var detail = resp.rows[0];
        KnowledgeDetail.author = detail.author;
        KnowledgeDetail.date = detail.date;
        KnowledgeDetail.title = detail.title;
        KnowledgeDetail.content = $sce.trustAsHtml(detail.content);
        if(baseConfig.debug){
          console.log(detail.content);
        }
        KnowledgeDetail.onGet = true;
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    function getContentById (id){
      if(id){
        bjgasPopup.showLoadingWithoutBackdrop('加载中');
        var url = baseConfig.basePath + 'c/api/getKnowledgeById/' + id;
        bjgasHttp.post(url)
        .success(function(resp){
          onContent(resp);
        })
        .error(function(){
          bjgasPopup.showShortCenterToast('请求知识库详情失败');
        })
        .finally(function(){
          bjgasPopup.hideLoading();
        });
      } else {
        bjgasPopup.showShortCenterToast('知识库详情参数错误');
      }
    }

    KnowledgeDetail.prePage = function(){
      $ionicHistory.goBack();
    };
  }
}());

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initKnowledgeRoute);

  /* @ngInject */
  function initKnowledgeRoute($stateProvider) {
    $stateProvider
      .state('tab.KnowledgeList', {
        url: '/knowledge-list',
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/knowledge-lib/list.html',
            controller: 'KnowledgeListCtrl',
            controllerAs: 'KnowledgeList'
          }
        }
      });
  }
}());

(function(){
  "use strict";
  angular.module('northGas')
    .controller('KnowledgeListCtrl', KnowledgeListCtrl);
  function KnowledgeListCtrl($scope, $state, $ionicHistory, bjgasHttp, bjgasPopup, baseConfig){
    var KnowledgeList = this;

    if(baseConfig.debug){
      console.log('KnowledgeListCtrl');
    }
    KnowledgeList.title = '燃气知识库';

    KnowledgeList.list = []; //
    var page  = 1;           // 页号
    var pageSize = 10;       // 每页大小
    var total = 0;           // 一共有多少项
    var clickIndex = 0;      // 点了哪一项
    KnowledgeList.noMorePage = false;

    // header有1px的border-bottom，所以list的top属性需要多1px。
    KnowledgeList.logoStyle = {
      "top": "44px",
    };
    KnowledgeList.listStyle = {
      "top": "calc(18% + 45px)"
    };

    if(ionic.Platform.isIOS()){
      KnowledgeList.logoStyle = {
        "top": "64px",
      };
      KnowledgeList.listStyle = {
        "top": "calc(18% + 65px)"
      };
    }

    function onGetData(resp){
      if(resp.success){
        total = resp.total;
        if (total > page * pageSize) {
          page = page + 1;
          KnowledgeList.noMorePage = false;
          if(baseConfig.debug){
            console.log('KnowledgeList.noMorePage = false;');
          }
        } else {
          if(baseConfig.debug){
            console.log('KnowledgeList.noMorePage = true;');
          }
          KnowledgeList.noMorePage = true;
        }

        if(KnowledgeList.list.length > 0){
          for(var i = 0; i < resp.rows.length; i++){
            resp.rows[i].subjectLabel = (resp.rows[i].subject ? resp.rows[i].subject.split('\n') : []);
            KnowledgeList.list[KnowledgeList.list.length] = resp.rows[i];
          }
        } else {
          for(var i = 0; i < resp.rows.length; i++){
            resp.rows[i].subjectLabel = (resp.rows[i].subject ? resp.rows[i].subject.split('\n') : []);
          }
          KnowledgeList.list = resp.rows;
        }
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    function getData(page, pageSize){
      var url = baseConfig.basePath + 'c/api/getKnowledgeList';
      var param = {
        "page": page,
        "pagesize": pageSize
      };
      bjgasHttp.post(url, param)
      .success(function(resp){
        if(baseConfig.debug){
          // console.log(resp);
        }
        onGetData(resp);
      })
      .error(function(resp){
        if(baseConfig.debug){
          console.log('error');
        }
        KnowledgeList.noMorePage = true;
      })
      .finally(function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        bjgasPopup.hideLoading();
      });
    }

    KnowledgeList.clickItem = function(item){
      $state.go('tab.KnowledgeDetail', {detail: item});
    };

    KnowledgeList.loadMore = function(){
      if(baseConfig.debug){
        console.log('loadMore');
      }
      bjgasPopup.showLoadingWithoutBackdrop('加载中');
      getData(page, pageSize);
    };

    KnowledgeList.prePage = function(){
      $ionicHistory.goBack();
    };

    function init(){
      getData(page, pageSize);
    }
    var inited = false;
    $scope.$on('$ionicView.afterEnter', function() {
      if(!inited){
        inited = true;
        bjgasPopup.showLoadingWithoutBackdrop('加载中');
        init();
      }
    });
  }
}());

(function() {
    "use strict";
    angular.module('northGas.navigation', [])
        .controller('navigationCtrl', navigation1Ctrl);
    navigation1Ctrl.$inject = ['$scope', '$ionicHistory'];
    /* @ngInject */
    function navigation1Ctrl($scope, $ionicHistory) {
        var Navigation = this;
        // 百度地图API功能
        var dept;
        var city;
        window.sessionStorage.refreshNearby = "false";
        init();
        var opts = {
            width: 270, // 信息窗口宽度
            height: 110, // 信息窗口高度
            title: "<div style='text-align: center'>" + "类型:定位" + "</div>", // 信息窗口标题
            enableMessage: false //设置允许信息窗发送短息
        };
        /*初始化点击事件*/
        function init() {
            /*sessionStorage存在值，则将值存入localStorage；否则将localStorage中的值存入sessionStorage*/
            // var mapId = document.getElementsByClassName("map");
            // var mapIdA = document.getElementById("allmap");
            // // if()
            // //console.log(!ionic.Platform.isIOS())
            // if (ionic.Platform.isIOS()) {
            //   mapId[0].style.height =  (window.screen.height - 100)+'px';
            //   // mapIdA.style.height =  (window.screen.height - 100)+'px';
            // }else{
            //   mapId[0].style.height =  (window.screen.height - 120)+'px';
            //   // mapIdA.style.height =  (window.screen.height - 120)+'px';
            // }

            var position = JSON.parse(window.localStorage.position);
            var myposition = JSON.parse(window.localStorage.myposition);
            //console.log(position);
            //console.log( JSON.parse(window.localStorage.myposition));
            $scope.dept = position;
            dept = position;

            $scope.telephoneOn = function() {
                if (dept.tel == null) {
                    //openDialog("暂无联系方式");
                } else if (dept.tel2 == null) {
                    window.location.href = "tel://" + dept.tel;
                } else {
                    var doc = document;
                    doc.getElementById("myPopupTele2").style.display = "block";
                    doc.getElementById("content1").innerHTML = dept.tel;
                    doc.getElementById("content2").innerHTML = dept.tel2;
                }
            }

            var ggPoint = new BMap.Point(position.lng, position.lat);
            var pointArr = [];
            pointArr.push(ggPoint);
            var convertor = new BMap.Convertor();
            //console.log("position.lat:" + position.lat);
            //console.log("position.lng:" + position.lng);
            $scope.goNavigation = function() {
                if (myposition.flag == true) {
                    var url = "https://api.map.baidu.com/direction?" +
                        "origin=latlng:" + myposition.lat + "," + myposition.lng + "|name:当前地点" +
                        "&destination=latlng:" + dept.lat + "," + dept.lng + "|name:目的地" +
                        "&mode=driving&origin_region=" + "北京市" + "&destination_region=" + "北京市" + "&output=html";
                    window.open(encodeURI(url), '_system', 'location=yes');
                } else {
                    var url = "https://api.map.baidu.com/direction?" +
                        "origin=" + "|name:请输入当前地点" +
                        "&destination=latlng:" + dept.lat + "," + dept.lng + "|name:目的地" +
                        "&mode=driving&origin_region=" + "北京市" + "&destination_region=" + "北京市" + "&output=html";
                    window.open(encodeURI(url), '_system', 'location=yes');
                }
            };
            //百度地图API功能
            //console.log("初始化地图");
            var map = new BMap.Map("allmap");
            map.enableScrollWheelZoom(true);
            map.centerAndZoom(new BMap.Point(dept.lng, dept.lat), 11);
            //console.log("初始化地图");
            //清除原先的覆盖物
            map.clearOverlays();
            //设置marker图标为水滴
            var myIcon = new BMap.Icon("img/location@2x.png", new BMap.Size(20, 30));
            var vectorMarker = new BMap.Marker(new BMap.Point(dept.lng, dept.lat), {
                // 指定Marker的icon属性为Symbol
                icon: myIcon
            });
            // 将标注添加到地图中
            map.addOverlay(vectorMarker);
            map.setViewport({ center: new BMap.Point(dept.lng, dept.lat), zoom: 13 });
        }
        $scope.GoBack = function() {
            // var historyId = $ionicHistory.currentHistoryId();
            // var history = $ionicHistory.viewHistory().histories[historyId];
            // //console.log(angular.toJson(history));
            $ionicHistory.goBack();
        }
        $scope.closeDialogT = function(ele, data) {
            var doc = document;
            if (data == "content1") {
                doc.getElementById("myPopupTele2").style.display = "none";
                window.location.href = "tel://" + dept.tel;
            } else {
                doc.getElementById("myPopupTele2").style.display = "none";
                window.location.href = "tel://" + dept.tel2;
            }
        }
    }
})();
/**
 * Created by linlong on 2016-09-22.
 */
(function() {
    "use strict";
    angular.module('northGas.nearby', [])
        .controller('nearbyCtrl', nearbyCtrl);
    // nearbyCtrl.$inject = ['$scope', '$ionicScrollDelegate', '$ionicPopup', '$state', '$ionicHistory'];
    /* @ngInject */
    function nearbyCtrl($scope, $ionicScrollDelegate, $ionicPopup, $state, $ionicHistory, bjgasPopup, baseConfig) {

        var nearbyStore = this;
        var tempAddr = [];
        var tempCompany;

        var origin_region;
        var pageNum = 1; //初始化页码
        var nearbyData = [];
        var is_default_shop = "N"; //初始化是否存在默认门店
        var default_shop_id; //保存默认门店id
        $scope.search = "";
        $scope.tempSelect = [];
        $scope.tempSelectCompany = [];
        /*附近门店信息*/
        var pageCount = 2; //初始化总页码
        var personInfo;
        bjgasPopup.showLoadingWithoutBackdrop('加载中...');

        var request = { //请求的json对象
            "head": {
                "subname": "附近门店",
                "subid": "7108"
            },
            "body": {
                "Latitude": "",
                "Longitude": "",
                "provinceName": "",
                "cityName": "",
                "areaName": "",
                "searchModel": "",
                "keyword": "",
                "searchType": "",
                "pageNo": ""
            }
        };
        var request1 = {
                body: {
                    "searchKey": "",
                    "addressArea": "",
                    "addressCompany": ""
                }

            }
            /*地理位置信息*/
        var position = {};
        $scope.$on('$ionicView.beforeEnter', function() {
            var statename = $state.current.name;
            // position.lat = "116.232934";
            // position.lng = "39.542637";
            // position.flag = false;
            // console.log("position.flag = false0")
            window.localStorage.myposition = angular.toJson(position);
            //
            console.log("bjgasPopup");
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            console.log(window.sessionStorage.refreshNearby === "true");
            console.log(angular.toJson(window.sessionStorage.nearbyData));
            if (window.sessionStorage.refreshNearby === "true") {
                initStore("Y");
                nearbyStore.itemdatas = [];


            } else {
                nearbyData = JSON.parse(window.sessionStorage.nearbyData);
                // $scope.$apply();
                bjgasPopup.hideLoading();
            }

            /*将附近门店信息存储到sessionStorage中*/


        });

        showSearchBar();

        select();
        $scope.GoBack = function() {
            $state.go("tab.gas");
        }

        //打开加载框
        function showLoading() {
            document.getElementById("loadingToast").style.display = "block";
        }

        // bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        // bjgasPopup.hideLoading();
        //关闭加载框
        function closeLoading() {
            document.getElementById("loadingToast").style.display = "none";
        }

        function select() { //初始化城市和公司选择
            var timestamp = new Date().getTime();
            $.ajax({
                type: 'GET',
                url: baseConfig.basePath + 'c/api/codeValueList/BG_ADDRESS_AREA',
                contentType: 'application/json',
                success: function(data) {
                    tempAddr = data;
                    console.log(angular.toJson(data));
                    var tempSelectElement = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        tempSelectElement.push(data.rows[i]);
                    }
                    $scope.tempSelect = tempSelectElement;


                },
                error: function(xhr, type) {

                }
            });

            $.ajax({
                type: 'GET',
                url: baseConfig.basePath + 'c/api/codeValueList/BG_ADDRESS_COMPANY',
                contentType: 'application/json',
                success: function(data) {
                    console.log(angular.toJson(data));
                    tempCompany = data;
                    var tempSelectCompany = [];

                    ////console.log(data.reponse.length);
                    for (var i = 0; i < data.rows.length; i++) {
                        tempSelectCompany.push(data.rows[i]);
                    }
                    $scope.tempSelectCompany = tempSelectCompany;

                },
                error: function(xhr, type) {

                }
            });
        }

        /*初始化主题信息*/
        function initTheme() {
            var doc = document;
            var theme = JSON.parse(window.sessionStorage.theme);
            doc.getElementById("logo").src = theme.logo;
            doc.getElementById("headBar").style.background = theme.color;
        }

        /*修改地点*/
        function changeLocation() {
            var doc = document;
            var location = doc.getElementById("city-picker").value.trim();
            var locations = location.split(" "); //根据空格获取省、市、区信息
            if (locations.length == 2) { //如果是直辖市，那么省份信息会忽略，提交信息时加上
                locations.unshift(locations[0].replace(/市/, ""));
            }
            pageNum = 1;
            nearbyData = [];
            request.body = {
                "searchType": "1",
                "keyword": "",
                "searchModel": "",
                "pageNo": pageNum + "",
                "Latitude": "",
                "Longitude": "",
                "cityName": locations[1],
                "areaName": locations[2],
                "provinceName": locations[0]
            };

            position.province = locations[0];
            position.city = locations[1];
            position.district = locations[2];
            $scope.loadRecord("Y");
        }

        function initStore(param) {
            position.lat = "116.232934";
            position.lng = "39.542637";
            position.flag = false;
            console.log("position.flag = false1")
            window.localStorage.myposition = angular.toJson(position);
            /*使用百度地图进行定位*/
            var onSuccess = function(position1) {
                bjgasPopup.hideLoading();
                console.log("百度地图" + angular.toJson(position1));
                position.lat = position1.coords.latitude;
                position.lng = position1.coords.longitude;
                position.flag = true;
                console.log("position.flag = ture2")
                window.localStorage.myposition = angular.toJson(position);
                request.body = {
                    "Latitude": position1.coords.latitude,
                    "Longitude": position1.coords.longitude,
                    "cityName": "",
                    "areaName": "",
                    "searchType": "0",
                    "pageNo": pageNum + "",
                    "provinceName": "",
                    "searchModel": "",
                    "keyword": ""
                };
                /*默认使用用户当前地点经纬度*/
                request.body = {
                    "Latitude": position.lat,
                    "Longitude": position.lng,
                    "cityName": "",
                    "areaName": "",
                    "searchType": "0",
                    "pageNo": pageNum + "",
                    "provinceName": "",
                    "searchModel": "",
                    "keyword": ""
                };
                // bjgasPopup.confirm('是否切换到当前地点?', function(index) {
                //   if (index === 1) {
                //     pageNum = 1;
                //     bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                //     $scope.isshow = true;
                //     $scope.$broadcast('scroll.infiniteScrollComplete');
                //     // $scope.loadRecord("");


                //   } else {
                pageNum = 1;
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                $scope.isshow = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                // $scope.loadRecord("");
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');

                // }
                // });

            };

            //
            function onError(error) {
                position.lat = "116.232934";
                position.lng = "39.542637";
                position.flag = false;
                console.log("position.flag = false2")
                window.localStorage.myposition = angular.toJson(position);
                pageNum = 1;
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                $scope.isshow = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                // $scope.loadRecord("");
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            }
            if (!ionic.Platform.isIOS()) {
                console.log("1221");
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            } else {
                /**/
                console.log("222");
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        var geoc = new BMap.Geocoder();
                        geoc.getLocation(r.point, function(rs) {
                            console.log(angular.toJson(rs));
                            console.log(r);
                            var point = r.point;
                            position.lat = point.lat;
                            position.lng = point.lng;
                            position.flag = true;
                            console.log("position.flag = true3")
                            window.localStorage.myposition = angular.toJson(position);
                            var result = rs.addressComponents;
                            var temp = result.province;
                            var province = temp.substring(0, temp.length - 1);
                            var flag = result.city;
                            var rCity = flag.substring(0, flag.length - 1); //去除最后一个字符，防止出现注册信息中不带“市”，但是百度地图查询到的带
                            origin_region = flag;
                            /*默认使用用户当前地点经纬度*/
                            request.body = {
                                "Latitude": point.lat,
                                "Longitude": point.lng,
                                "cityName": "",
                                "areaName": "",
                                "searchType": "0",
                                "pageNo": pageNum + "",
                                "provinceName": "",
                                "searchModel": "",
                                "keyword": ""
                            };

                            /*如果用户已经注册，将用户注册地点保存到position*/
                            if (province !== position.province || (rCity !== position.city && flag !== position.city) || result.district !== position.district) {
                                bjgasPopup.hideLoading();
                                // if (confirm("是否切换到当前地点?")) {
                                bjgasPopup.confirm('是否切换到当前地点?', function(index) {
                                    if (index === 0) {
                                        request.body = {
                                            "Latitude": "",
                                            "Longitude": "",
                                            "cityName": position.city,
                                            "areaName": position.district,
                                            "searchType": "1",
                                            "pageNo": pageNum + "",
                                            "provinceName": position.province,
                                            "searchModel": "",
                                            "keyword": ""
                                        };


                                    } else {
                                        pageNum = 1;
                                        position.province = province;
                                        position.city = flag;
                                        position.district = result.district;
                                        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                                        $scope.loadRecord();

                                    }
                                });
                            } else {}
                        });
                    } else {
                        alert('failed' + this.getStatus());
                        /*默认使用注册地点*/
                        if (personInfo) {
                            position.province = personInfo.province;
                            position.city = personInfo.city;
                            position.district = personInfo.county;
                            request.body = {};
                        } else {
                            request.body = {};
                        }
                        position.flag = false;
                        console.log("position.flag = false3");
                        window.localStorage.myposition = angular.toJson(position);
                    }
                }, { enableHighAccuracy: true });


            }
        }

        //动态显示隐藏搜索栏
        function showSearchBar() {
            var doc = document;
            var beforeSearch = doc.getElementById("beforeSearch");
            var afterSearch = doc.getElementById("afterSearch");
            //var searchSure = doc.getElementById("searchSure");
            var inputText = doc.getElementById("inputText");
            var selectItem1 = doc.getElementById("selectItem1");
            var selectItem2 = doc.getElementById("selectItem2");
            //点击输入框时
            beforeSearch.addEventListener('click', function() {
                beforeSearch.style.display = "none";
                afterSearch.style.display = "block";
                inputText.focus();
            });
            //点击确定时
            $scope.searchSure = function() {
                pageNum = 1;
                nearbyData = [];
                nearbyStore.itemdatas = [];
                request1.body.searchKey = inputText.value;
                console.log(request1);
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                // $scope.isshow = true;
                // $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.loadRecord("");
            }
        }

        //动态dom操作


        //跳转到门店导航页面
        $scope.goNavigation = function(dept) {
            position.dept = dept;
            position.origin_region = origin_region;
            window.localStorage.position = angular.toJson(position);
            /*设置页面刷新*/
            window.sessionStorage.refreshNearby = "true";
            /*将附近门店信息存储到sessionStorage中*/
            window.sessionStorage.nearbyData = angular.toJson(nearbyData);
            //console.log(angular.toJson(window.sessionStorage.nearbyData));
            /*将页码存储到sessionStorage中*/
            window.sessionStorage.pageNum = pageNum;
            /*将页数存储到sessionStorage中*/
            window.sessionStorage.pageCount = pageCount;
            /*将请求数据存储到sessionStorage中*/
            window.sessionStorage.request = angular.toJson(request);
            /*将是否默认门店存储到sessionStorage中*/
            window.sessionStorage.defaultShop = is_default_shop;
            window.localStorage.position = angular.toJson({
                "lat": dept.latitude,
                "lng": dept.longitude,
                "deptName": dept.addressName,
                "dept": dept.addressDetail,
                tel: dept.telephone,
                tel2: dept.telephone2,
                tel3: "111"
            });
            setTimeout(10000);
            $state.go("tab.nearbyNavigation");
        }


        //动态加载记录
        $scope.loadRecord = function(param) {
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            console.log("loard");
            /*请求开始时隐藏表示空列表数据的信息*/
            var timestamp = new Date().getTime();
            //为了获取默认门店需要添加openID参数
            request.body.openID = "111";
            console.log(request1);
            console.log({
                "searchKey": request1.body.searchKey == undefined ? "" : request1.body.searchKey,
                "addressArea": (request1.body.addressArea == "搜索城区" || request1.body.addressArea == "全部" || request1.body.addressArea == undefined) ? "" : request1.body.addressArea,
                "addressCompany": (request1.body.addressCompany == "搜索公司" || request1.body.addressCompany == "全部" || request1.body.addressArea == undefined) ? "" : request1.body.addressCompany,
                "page": pageNum,
                "pagesize": 10
            })


            $.ajax({
                type: 'POST',
                url: baseConfig.basePath + '/c/api/addrList',
                //url: window.apiDemoUrl2 + 'bjgas/beiran',
                contentType: 'application/json',
                data: angular.toJson({
                    "searchKey": request1.body.searchKey == undefined ? "" : request1.body.searchKey,
                    "addressArea": (request1.body.addressArea == "全部" || request1.body.addressArea == undefined) ? "" : request1.body.addressArea,
                    "addressCompany": (request1.body.addressCompany == "全部" || request1.body.addressArea == undefined) ? "" : request1.body.addressCompany,
                    "page": pageNum,
                    "pagesize": 10
                }),
                success: function(data) {
                    window.sessionStorage.refreshNearby = "false"
                    var headData = data;
                    if (headData.success && headData.success == true) {
                        var respdata = data;
                        bjgasPopup.hideLoading();
                        /*将数据存入数组中*/
                        // nearbyData = nearbyData.concat(data.rows);
                        if (pageNum == 1) {
                            nearbyStore.itemdatas = data.rows;
                            if (data.rows.length < 10) {
                                $scope.isshow = false;
                            } else {
                                $scope.isshow = true;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }
                        } else {
                            for (var i = 0; i < data.rows.length; i++) {
                                nearbyStore.itemdatas.push(data.rows[i]);
                            }
                            if (data.rows.length < 10) {
                                $scope.isshow = false;
                            } else {
                                $scope.isshow = true;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }
                        }
                        pageNum++;


                    } else {
                        bjgasPopup.hideLoading();
                        // bjgasPopup.showPopup('提交失败');
                        bjgasPopup.showPopup("附近门店查询失败!"); //附近门店查询失败
                    }

                },
                error: function(xhr, type) {
                    $scope.isshow = false;
                    bjgasPopup.hideLoading();
                    bjgasPopup.showPopup('发送请求出错!');
                }
            });

        }
        $scope.Loadmore = function() {

        }

        $scope.changeReach1 = function(item) {

            pageNum = 1;
            nearbyData = [];
            nearbyStore.itemdatas = [];
            // request1.body = {
            //   "searchKey": inputText.value,
            //   "addressArea": "",
            //   "addressCompany":""
            // };
            console.log(item);
            request1.body.addressArea = (item.value == null ? "" : item.value);
            request1.body.addressCompany = "";
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            // $scope.isshow = true;
            // $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.loadRecord("reach");

        }
        $scope.changeReach2 = function(item) {

            pageNum = 1;
            nearbyData = [];
            nearbyStore.itemdatas = [];
            console.log(item);
            request1.body.addressCompany = (item.value == null ? "" : item.value);
            // console.log(angular.toJson(request1));
            request1.body.addressArea = ""
                // request1.body = {
                //   "searchKey": inputText.value,
                //   "addressArea": selectItem1.value,
                //   "addressCompany":selectItem2.value
                // };
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            // $scope.isshow = true;
            // $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.loadRecord("reach");

        }

        /*获取当前时间xx:xx*/
        function getFormatTimeStr() {
            var date = new Date();
            var hour = date.getHours();
            var minute = date.getMinutes();
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }
            return hour + ":" + minute;
        }
    }
})();
(function(){
  angular.module('northGas')
  .config(initCheckMainRoute);
  function initCheckMainRoute($stateProvider){
    $stateProvider
    .state('tab.checkMain', {
      url: '/checkMain',
      views: {
        "tab-gas": {
          templateUrl: 'pages/gas/repair/check-main.html',
          controller: 'CheckMainCtrl',
          controllerAs: 'CheckMain'
        }
      }
    });
  }
}());

(function(){
  angular.module('northGas')
  .controller('CheckMainCtrl', CheckMainCtrl);

  /* @ngInject */
  function CheckMainCtrl($scope, $state, $ionicHistory, $timeout, LoginService, baseConfig){
    if(baseConfig.debug){
      console.log('CheckMainCtrl');
    }

    var CheckMain = this;
    CheckMain.bottomLogoStyle = {display: 'none'};
    CheckMain.info = '';
    CheckMain.loginCallbackHandle = '';

    CheckMain.prePage = function(){
      if(baseConfig.debug){
        console.log('goback');
      }
      $ionicHistory.goBack();
    };

    CheckMain.onAppointment = function() {
      if(baseConfig.debug){
        console.log('onAppointment');
      }
      CheckMain.CheckMainClick(function(){
        $state.go('tab.newReapir', {type: '燃气预约巡检'});
      });
    };
    CheckMain.onMyRepair = function(){
      if(baseConfig.debug){
        console.log('onMyrepair');
      }
      CheckMain.CheckMainClick(function(){
        $state.go('tab.myRepairList', {type: '巡检'});
      });
    };
    CheckMain.CheckMainClick = function(callback, state, params){
      if(CheckMain.info){
        if(typeof(callback) === 'function'){
          callback();
        } else {
          if(baseConfig.debug){
            console.log('CheckMain.CheckMainClick; callback is not a function');
          }
        }
      } else {
        LoginService.showLogin({
          onSuccess: typeof(callback) === 'function' ? function(){
            CheckMain.loginCallbackHandle = $timeout(function(){
              callback();
            }, 300);
          } : ''
        });
      }
    };

    $scope.$on('$destroy', function() {
      $timeout.cancel(CheckMain.loginCallbackHandle);
    });

    $scope.$on('$ionicView.beforeEnter', function() {
      var headerbar = 45;
      if(ionic.Platform.isIOS()) {
        headerbar = 65;
      }
      var top = ((window.screen.height - headerbar) * 0.82 - 315 - 60);
      CheckMain.bottomLogoStyle = {
        'margin-top': (top > 30 ? top : 30) + 'px',
        'display': 'block'
      };
      if($scope.isLogin()){
        CheckMain.info = true;
      }
    });
  }
}());

(function(){
  angular.module('northGas')
  .config(initRepairMainRoute);
  function initRepairMainRoute($stateProvider){
    $stateProvider
    .state('tab.repairMain', {
      url: '/gas/repairMain',
      views: {
        "tab-gas": {
          templateUrl: 'pages/gas/repair/main.html',
          controller: 'RepairMainCtrl',
          controllerAs: 'RepairMain'
        }
      }
    });
  }
}());

(function(){
  angular.module('northGas')
  .controller('RepairMainCtrl', RepairMainCtrl);

  /* @ngInject */
  function RepairMainCtrl($scope, $state, $ionicHistory, $timeout, LoginService, baseConfig){
    if(baseConfig.debug){
      console.log('RepairMainCtrl');
    }

    var RepairMain = this;
    RepairMain.bottomLogoStyle = {display: 'none'};
    RepairMain.info = '';
    RepairMain.loginCallbackHandle = '';

    RepairMain.prePage = function(){
      if(baseConfig.debug){
        console.log('goback');
      }
      $ionicHistory.goBack();
    };

    RepairMain.onTap = function(){
      if(baseConfig.debug){
        console.log('onTap');
      }
      RepairMain.repairMainClick(function(){
        $state.go('tab.newReapir', {type: '管道阀门报修'});
      });
    };
    RepairMain.onTool = function(){
      if(baseConfig.debug){
        console.log('onTool');
      }
      RepairMain.repairMainClick(function(){
        $state.go('tab.newReapir', {type: '燃气表报修'});
      });
    };
    RepairMain.onMeter = function(){
      if(baseConfig.debug){
        console.log('onMeter');
      }
      RepairMain.repairMainClick(function(){
        $state.go('tab.newReapir', {type: '燃气具报修'});
      });
    };
    RepairMain.modify = function(){
      if(baseConfig.debug){
        console.log('modify');
      }
      RepairMain.repairMainClick(function(){
        $state.go('tab.newReapir', {type: '拆改迁'});
      });
    };
    RepairMain.onOther = function(){
      if(baseConfig.debug){
        console.log('onOther');
      }
      RepairMain.repairMainClick(function(){
        $state.go('tab.newReapir', {type: '其他报修'});
      });
    };
    RepairMain.onMyRepair = function(){
      if(baseConfig.debug){
        console.log('onMyrepair');
      }
      RepairMain.repairMainClick(function(){
        $state.go('tab.myRepairList', {type: '报修'});
      });
    };
    RepairMain.repairMainClick = function(callback, state, params){
      if(RepairMain.info){
        if(typeof(callback) === 'function'){
          callback();
        } else {
          if(baseConfig.debug){
            console.log('RepairMain.repairMainClick; callback is not a function');
          }
        }
      } else {
        LoginService.showLogin({
          onSuccess: typeof(callback) === 'function' ? function(){
            RepairMain.loginCallbackHandle = $timeout(function(){
              callback();
            }, 300);
          } : ''
        });
      }
    };

    $scope.$on('$destroy', function() {
      $timeout.cancel(RepairMain.loginCallbackHandle);
    });

    $scope.$on('$ionicView.beforeEnter', function() {
      var headerbar = 45;
      if(ionic.Platform.isIOS()) {
        headerbar = 65;
      }
      var top = ((window.screen.height - headerbar) * 0.82 - 315 - 60);
      RepairMain.bottomLogoStyle = {
        'margin-top': (top > 30 ? top : 30) + 'px',
        'display': 'block'
      };
      if($scope.isLogin()){
        RepairMain.info = true;
      }
    });
  }
}());

(function() {
  angular.module('northGas')
    .config(initMyRepairDetailRoute);

  function initMyRepairDetailRoute($stateProvider) {
    $stateProvider
      .state('tab.myRepairDetail', {
        url: '/myRepairDetail',
        params: {detail: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/repair/my-repair-detail.html',
            controller: 'MyRepairDetailCtrl',
            controllerAs: 'MyRepairDetail'
          }
        }
      })
      .state('tab.myRepairDetailMine', {
      url: '/myRepairDetailMine',
      params: {detail: ''},
      views: {
        'tab-mine': {
          templateUrl: 'pages/gas/repair/my-repair-detail.html',
          controller: 'MyRepairDetailCtrl',
          controllerAs: 'MyRepairDetail'
        }
      }
    });
  }
}());

(function(){
  "use strict";
  angular.module('northGas')
  .controller('MyRepairDetailCtrl', MyRepairDetailCtrl);

  function MyRepairDetailCtrl($scope, $stateParams, $ionicModal, bjgasPopup, bjgasHttp, $ionicHistory, baseConfig) {
    if(baseConfig.debug){
      console.log('MyRepairDetailCtrl');
    }

    var MyRepairDetail = this;

    // $stateParams.detail.canFeedback = 'Y';
    (baseConfig.debug && console.log($stateParams.detail));

    MyRepairDetail.detail = {};

    MyRepairDetail.feedBack = {
      feedBack: {
        key: '请选择',
        value: ''
      },
      feedBackDetail: {
        key: '请选择',
        value: ''
      }
    };

    MyRepairDetail.feedBackCN = '';
    MyRepairDetail.feedBackDetailCN = '';
    MyRepairDetail.feedBackList = [
      {
        key: '满意',
        value: 'BJG VerySatis'
      },
      {
        key: '一般',
        value: 'BJG Satis'
      },
      {
        key: '不满意',
        value: 'BJG UnSatis'
      }
    ];
    MyRepairDetail.feedBackDetailList = [
      {
        key: '态度不满意',
        value: 'BJG Attitude'
      },
      {
        key: '收费满意',
        value: 'BJG Fee'
      },
      {
        key: '时间不满意',
        value: 'BJG Time'
      },
      {
        key: '服务不满意',
        value: 'BJG Service'
      },
      {
        key: '技术不满意',
        value: 'BJG Tech'
      },
      {
        key: '其他不满意',
        value: 'BJG OtherUnSatis'
      }
    ];
    MyRepairDetail.showingList = MyRepairDetail.feedBackList;
    var showingListName = 'feedBackList';

    MyRepairDetail.keys = [
      {key: 'serviceNumber', keyLabel: '服务编号'},
      {key: 'createDate', keyLabel: '创建时间'},
      {key: 'repairState', keyLabel: '状态'},
      {key: 'repairCall', keyLabel: '联系电话'},
      {key: 'detailedAddress', keyLabel: '详细地址'},
      {key: 'repairTypeChina', keyLabel: '报修类型'}
    ];
    MyRepairDetail.addrName = '';
    MyRepairDetail.userNote = '';

    if($stateParams.detail){
      (baseConfig.debug && console.log($stateParams.detail));
      MyRepairDetail.detail = $stateParams.detail;
      MyRepairDetail.feedBack.srnum = MyRepairDetail.detail.serviceNumber;
      MyRepairDetail.userNote = $stateParams.detail.userNote;

      if(MyRepairDetail.detail.feedBack){
        for (var index = 0; index < MyRepairDetail.feedBackList.length; index++) {
          if(MyRepairDetail.feedBackList[index].value === MyRepairDetail.detail.feedBack){
            MyRepairDetail.feedBackCN = MyRepairDetail.feedBackList[index].key;
          }
        }
      }
      if(MyRepairDetail.detail.feedBackDetail){
        for (var index = 0; index < MyRepairDetail.feedBackDetailList.length; index++) {
          if(MyRepairDetail.feedBackDetailList[index].value === MyRepairDetail.detail.feedBackDetail){
            MyRepairDetail.feedBackDetailCN = MyRepairDetail.feedBackDetailList[index].key;
          }
        }
      }
      (baseConfig.debug && console.log(MyRepairDetail.feedBackDetailCN));
    }

    // select modal
    $ionicModal.fromTemplateUrl('pages/gas/repair/modal-my-repair-detail.html', {
      scope: $scope
    }).then(function(modal) {
      MyRepairDetail.selectModal = modal;
    });

    MyRepairDetail.onSelectItems = function (item) {
      if(showingListName === 'feedBackList'){
        MyRepairDetail.feedBack.feedBack = item;
      } else {
        MyRepairDetail.feedBack.feedBackDetail = item;
      }
      MyRepairDetail.selectModal.hide();
    };
    MyRepairDetail.showList = function (params) {
      if(params === 'feedBackList'){
        MyRepairDetail.showingList = MyRepairDetail.feedBackList;
        showingListName = 'feedBackList';
      } else {
        MyRepairDetail.showingList = MyRepairDetail.feedBackDetailList;
        showingListName = 'feedBackDetailList';
      }
      MyRepairDetail.selectModal.show();
    }

    MyRepairDetail.submit = function () {
      (baseConfig.debug && console.log(MyRepairDetail.feedBack.feedBack));
      (baseConfig.debug && console.log(MyRepairDetail.feedBack.feedBackDetail));
      if(!MyRepairDetail.feedBack.feedBack.value){
        bjgasPopup.showPopup('请选择满意度');
      } else if(MyRepairDetail.feedBack.feedBack.key === '不满意' && !MyRepairDetail.feedBack.feedBackDetail.value){
        bjgasPopup.showPopup('请选择不满意原因');
      } else {
        var url = baseConfig.basePath + 'i/api/repairs/evaluate';;
        var param = {
          srnum: MyRepairDetail.feedBack.srnum,
          feedback: MyRepairDetail.feedBack.feedBack.value,
          feedbackDetail: MyRepairDetail.feedBack.feedBackDetail.value
        };
        if(MyRepairDetail.feedBack.feedBack.key !== '不满意'){
          param.feedbackDetail = ''
        }
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        bjgasHttp.post(url, param)
        .success(function (resp) {
          if(resp.success){
            $stateParams.detail.canFeedback = 'N';
            MyRepairDetail.feedBackCN = MyRepairDetail.feedBack.feedBack.key;
            MyRepairDetail.feedBackDetailCN = MyRepairDetail.feedBack.feedBackDetail.key;
            window.sessionStorage.needFreshRepairList = 'true';
          }
          bjgasPopup.showPopup((resp.message ? resp.message: '返回数据异常'));
        })
        .error(function (resp) {
          bjgasPopup.showPopup('请求评价异常');
        })
        .finally(function () {
          bjgasPopup.hideLoading();
        });
      }
    };

    MyRepairDetail.prePage = function(){
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.afterEnter', function(){
      if($stateParams.detail.canFeedback === 'Y'){
        bjgasPopup.showPopup('请提交维修服务评价');
      }
    });
  }
}());

(function() {
  angular.module('northGas')
    .config(initMyRepairRoute);

  /* @ngInject */
  function initMyRepairRoute($stateProvider) {
    $stateProvider
      .state('tab.myRepairList', {
        url: '/myRepairList',
        params: {info: '', type: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/repair/my-repair-list.html',
            controller: 'MyRepairListCtrl',
            controllerAs: 'MyRepairList'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('MyRepairListCtrl', MyRepairListCtrl);

  function MyRepairListCtrl($scope, $state, $stateParams, $ionicHistory, $timeout, $ionicModal, bjgasHttp, bjgasPopup, baseConfig) {
    var MyRepairList = this;
    if(baseConfig.debug){
      console.log($stateParams.type);
    }
    MyRepairList.type = $stateParams.type;
    MyRepairList.title = undefined;
    MyRepairList.noMorePage = false;
    MyRepairList.listStyle = {"top":"84px"};
    MyRepairList.selectsStyle = {"top": "44px"};
    MyRepairList.repairList = [];
    var totalList = [];
    var pages = 1;
    var total = 0;
    var size = 10;

    MyRepairList.selectNumbers = [
      {'key':'全部','value':'全部'}
    ];
    MyRepairList.selectTypes = [];
    if($stateParams.type === '巡检'){
      MyRepairList.title = '我的预约巡检';
      MyRepairList.selectTypes = [
        {'key':'全部','value':'BG_GAS_INSPECTSUB'},
        {'key':'巡检记录','value':'BG_GAS_INSPECTSUB'}
      ];
    } else {
      MyRepairList.title = '我的报修';
      MyRepairList.selectTypes = [
        {'key':'全部','value':'all'},
        {'key':'管道阀门报修','value':'BG_GAS_PIPE'},
        {'key':'燃气表报修','value':'BG_GAS_METER'},
        {'key':'燃气具报修','value':'BG_GAS_STOVE'},
        {'key':'拆改迁','value':'BG_GAS_MODIFY'},
        {'key':'其他报修','value':'BG_GAS_OTHER'}
      ];
    }

    MyRepairList.selectTimes = [
      {'key':'最近1个月','value':'1'},
      {'key':'最近3个月','value':'3'},
      {'key':'最近1年','value':'12'}
    ];
    MyRepairList.showSelects = MyRepairList.selectNumbers;
    MyRepairList.showing = '';
    MyRepairList.contactID = JSON.parse(window.localStorage.userInfo).appContactId ? JSON.parse(window.localStorage.userInfo).appContactId : '';
    MyRepairList.selectNumber = '全部';
    MyRepairList.selectType = '全部';
    MyRepairList.selectTime = '最近1个月';

    // select modal
    $ionicModal.fromTemplateUrl('pages/gas/repair/modal-repair-list.html', {
      scope: $scope
    }).then(function(modal) {
      MyRepairList.selectModal = modal;
    });
    MyRepairList.showSelectItems = function(items) {
      if(items === 'number'){
        MyRepairList.showing = 'number';
        MyRepairList.showSelects = MyRepairList.selectNumbers;
      } else if(items === 'type'){
        MyRepairList.showing = 'type';
        MyRepairList.showSelects = MyRepairList.selectTypes;
      } else{
        MyRepairList.showing = 'time';
        MyRepairList.showSelects = MyRepairList.selectTimes;
      }
      MyRepairList.selectModal.show();
    };
    MyRepairList.clickItem = function(item){
      if(MyRepairList.showing === 'time'){
        MyRepairList.selectTime = item.key;
      } else if(MyRepairList.showing === 'type'){
        MyRepairList.selectType = item.key;
      } else if(MyRepairList.showing === 'number'){
        MyRepairList.selectNumber = item.value;
      } else {

      }
      MyRepairList.repairList = [];
      var totalList = [];
      var pages = 1;
      var total = 0;
      var size = 10;
      MyRepairList.noMorePage = false;
      MyRepairList.getData();
      MyRepairList.selectModal.hide();
    };
    $scope.$on('$destroy', function() {
      MyRepairList.selectModal.remove();
    });
    //  select modal

    if(ionic.Platform.isIOS()){
      MyRepairList.selectsStyle = {"top": "64px"};
      MyRepairList.listStyle = {"top": "104px"};
    }

    function onGetData (resp) {
      if(baseConfig.debug){
        console.log(resp);
      }
      if(resp.success){
        processData(resp.rows);
        if(resp.rows.length === 0){
          bjgasPopup.showVeryShortCenterToast('没有此类报修记录');
          if(baseConfig.debug){
            console.log('没有此类报修记录');
          }
        }
        // MyRepairList.repairList = resp.rows;
      } else {
        bjgasPopup.showVeryShortCenterToast(resp.message);
      }
    }
    function processData(rows){
      totalList = rows;
      total = totalList.length;

      if(total <= 10){
        MyRepairList.noMorePage = true;
        MyRepairList.repairList = totalList;
      } else {
        MyRepairList.repairList = totalList.slice(0,10);
      }
    }
    MyRepairList.loadMore = function(){
      if(baseConfig.debug){
        console.log('MyRepairList.loadMore');
      }

      pages = pages + 1;
      var max = (pages * size <= total) ? pages * size : totalList.length;
      for(var i = (pages - 1) * size; i < max; i++){
        MyRepairList.repairList[i] = totalList[i];
      }
      if(pages * size >= total){
        MyRepairList.noMorePage = true;
      }

      $timeout(function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$apply();
      }, 1000);
    };
    MyRepairList.getData = function(){
      bjgasPopup.showLoadingWithoutBackdrop('加载中');
      var url = baseConfig.basePath + 'i/api/repairs/query';
      if(!MyRepairList.contactID){
        bjgasPopup.showPopup('缺失appContactId', function(){
          $ionicHistory.goBack();
        });
        return;
      }

      var param = {
        "appContactId": MyRepairList.contactID,
        "userId": JSON.parse(window.localStorage.userInfo).userId
      };
      param.gasUserNumber = (MyRepairList.selectNumber === '全部') ? 'all': MyRepairList.selectNumber;

      for(var y = 0;y < MyRepairList.selectTypes.length; y++){
        if(MyRepairList.selectTypes[y].key === MyRepairList.selectType){
          param.type = MyRepairList.selectTypes[y].value;
        }
      }
      for(var z = 0;z < MyRepairList.selectTimes.length; z++){
        if(MyRepairList.selectTimes[z].key === MyRepairList.selectTime){
          param.time = MyRepairList.selectTimes[z].value;
        }
      }
      if(baseConfig.debug){
        console.log(param);
      }
      bjgasHttp.post(url, param)
      .success(function(resp){
        if(baseConfig.debug){
          console.log(resp);
        }
        onGetData(resp);
      })
      .error(function(resp){
        if(baseConfig.debug){
          console.log('error');
        }
        MyRepairList.noMorePage = true;
      })
      .finally(function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        bjgasPopup.hideLoading();
      });
    };


    MyRepairList.getData();

    function onGetNumberList(resp){
      if(resp.success){
        for(var i = 0; i < resp.rows.length; i++){
          MyRepairList.selectNumbers.push({
            key: resp.rows[i].label,
            value: resp.rows[i].userCode
          });
        }
        if(baseConfig.debug) {
          console.log(resp.rows);
        }
      }
    }
    function getNumberList(){
      var userUrl = baseConfig.basePath + 'i/api/getUserGasList/' + JSON.parse(window.localStorage.userInfo).userId;

      bjgasHttp.get(userUrl).success(function(response) {
        onGetNumberList(response);
      }).error(function(error) {

      }).finally(function() {

      });
    }
    getNumberList();


    MyRepairList.goDetail = function (item){
      $state.go('tab.myRepairDetail', {detail: item});
    };

    MyRepairList.prePage = function(){
      $ionicHistory.goBack();
    };

    if (baseConfig.debug) {
      console.log('MyRepairListCtrl');
    }

    $scope.$on('$ionicView.afterEnter', function () {
      if(window.sessionStorage.needFreshRepairList){
        MyRepairList.clickItem();
        window.sessionStorage.needFreshRepairList = '';
      }
    });
  }
}());

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initNewrepairRoute);

  /* @ngInject */
  function initNewrepairRoute($stateProvider) {
    $stateProvider
      .state('tab.newReapir', {
        url: '/gas/repairMain/newReapir',
        params: { type: ''},
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/repair/new-repair.html',
            controller: 'NewRepairCtrl',
            controllerAs: 'NewRepair'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('NewRepairCtrl', NewRepairCtrl);

  function NewRepairCtrl($scope, $state, $stateParams, $http, $timeout, $ionicModal, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, $ionicHistory, bjgasPopup, bjgasHttp, baseConfig) {
    var NewRepair = this;

    // 卡表的标志
    NewRepair.cardChar = 'C';
    NewRepair.meterType = false;

    var maxPic = 2;
    NewRepair.timeoutHandle = '';
    NewRepair.canAdd = true;
    NewRepair.inputModel = {
      repairName: '',
      repairCall: '',
      gasUserNumber: '',
      detailedAddress: '',
      repairType: '',
      repairTypeChina: '',
      userNote: '',
      type: $stateParams.type ? $stateParams.type : '燃气预约巡检',
      appContactId: '',
      userId: ''
    };
    NewRepair.typeMap = {
      '管道阀门报修': 'BG_GAS_PIPE',
      '燃气表报修': 'BG_GAS_METER',
      '燃气具报修': 'BG_GAS_STOVE',
      '其他报修': 'BG_GAS_OTHER',
      '燃气预约巡检': 'BG_GAS_INSPECTSUB',
      '拆改迁': 'BG_GAS_MODIFY'
    };

    NewRepair.meterTypeChina = '';
    NewRepair.meterTypes = [
      '泰科',
      '思凯',
      '天庆',
      '其他'
    ];
    NewRepair.repairTypes = [];
    NewRepair.gasUserNumbers = [];
    NewRepair.showingModelArray = [];
    NewRepair.showingKey = '';

    NewRepair.photos = [{ url: "img/repair/add@3x.png" }];
    NewRepair.smallPhotosShowFlag = [];
    NewRepair.smallPhotosSize = ['100% 100%'];
    NewRepair.showingPhotoIndex = -1;
    NewRepair.showingPhoto = {
      url: ''
    };
    NewRepair.photoHight = {};
    NewRepair.isShowing = false;
    NewRepair.blobCount = 0;

    NewRepair.realHideCount = 0;

    for (var i = 0; i < maxPic; i++) {
      NewRepair.smallPhotosShowFlag[i] = true;
    }
    NewRepair.smallPhotosShowFlag[maxPic] = false;

    function realHide(){
      //第一次进入
      if(NewRepair.realHideCount < 1){
        NewRepair.realHideCount = NewRepair.realHideCount + 1;
        if(baseConfig.debug){
          console.log(NewRepair.realHideCount);
        }
      //第二次进入
      } else {
        NewRepair.realHideCount = 0;
        bjgasPopup.hideLoading();
        if(NewRepair.inputModel.gasUserNumber === '没有户号'){
          if(baseConfig.debug){
            console.log('尚未绑定户号，请先绑定');
          }
          bjgasPopup.confirm('尚未绑定户号，请先绑定', function(index){
            if(index === 0){
              $ionicHistory.goBack();
            } else {
              $state.go('tab.noGasFromRepair');
            }
          });
        }
      }
    }

    // select modal
    $ionicModal.fromTemplateUrl('pages/gas/repair/modal-new-repair.html', {
      scope: $scope
    }).then(function(modal) {
      NewRepair.selectModal = modal;
    });
    NewRepair.showItems = function(type) {
      if(type === 'repair'){
        NewRepair.showingModelArray = NewRepair.repairTypes;
        NewRepair.showingKey = 'repair';
      } else if(type === 'number') {
        NewRepair.showingModelArray = NewRepair.gasUserNumbers;
        NewRepair.showingKey = 'number';
      } else if(type === 'meter'){
        NewRepair.showingModelArray = NewRepair.meterTypes;
        NewRepair.showingKey = 'meter';
      }
      NewRepair.selectModal.show();
    };
    NewRepair.onSelectItems = function(item, type) {
      if(baseConfig.debug){
        console.log(item);
      }
      if(type === 'repair'){
        NewRepair.inputModel.repairType = item.value;
        NewRepair.inputModel.repairTypeChina = item.meaning;
      } else if(type === 'number') {
        NewRepair.inputModel.gasUserNumber = item.userCode;
        NewRepair.inputModel.detailedAddress = item.address;
        NewRepair.meterType = (item.meterType == NewRepair.cardChar);
        if(baseConfig.debug){
          console.log(NewRepair.meterType);
        }
      } else if(type === 'meter'){
        NewRepair.meterTypeChina = item;
      }
      NewRepair.selectModal.hide();
    };

    $ionicModal.fromTemplateUrl('pages/gas/repair/modal-detail-photo-zoom.html', {
      scope: $scope
    }).then(function(modal) {
      NewRepair.detailModal = modal;
    });
    NewRepair.showPhoto = function() {
      NewRepair.isShowing = true;
      NewRepair.detailModal.show();
    };
    $scope.$on('$destroy', function() {
      NewRepair.selectModal.remove();
      NewRepair.detailModal.remove();
      $timeout.cancel(NewRepair.timeoutHandle);
    });
    //  select modal

    try {
      var optionsCamera = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 1080,
        targetHeight: 1080,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true
      };
      var optionsAlbum = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 1080,
        targetHeight: 1080,
        popoverOptions: CameraPopoverOptions,
        correctOrientation:true
      };
    } catch (error) {

    }

    var optionsAs = {
      title: '选择照片来源',
      buttonLabels: ['拍照', '相册'],
      addCancelButtonWithLabel: '取消',
      androidEnableCancelButton : true
    };
    var optionsPicker = {
      maximumImagesCount: 1,
      width: 1080,
      height: 1080,
      quality: 100
    };
    function onCameraErrorIOS() {
      if(typeof(cordova.plugins.achieveAuthority) !== 'undefined'){
        cordova.plugins.achieveAuthority.getAuthority();
      }
    }
    NewRepair.clickPhoto = function(index) {
      if (index === NewRepair.photos.length - 1) {
        // add photo
        $cordovaActionSheet.show(optionsAs)
          .then(function(btnIndex) {
            var index = btnIndex;
            if (index === 1) {
              navigator.camera.getPicture(function(imageData) {
                NewRepair.photos.splice(NewRepair.photos.length - 1, 0, {
                  url: "data:image/jpeg;base64," + imageData,
                  type: "base64"
                });
                NewRepair.smallPhotosSize.splice(NewRepair.smallPhotosSize.length - 1, 0, 'cover');
                $timeout(function () {
                  $scope.$apply();
                }, 300);
              }, function(error) {
                // error
                // cordova.plugins.achieveAuthority.getAuthority();
                if(baseConfig.debug){
                  console.log('camera error');
                  console.log(JSON.stringify(error));
                }
                if(ionic.Platform.isIOS()){
                  if(error === 'noAuthorization'){
                    bjgasPopup.confirm('北京燃气需要访问你的相机，以便提供更便捷的燃气服务', function (index) {
                      if(index === 0){

                      } else {
                        onCameraErrorIOS();
                      }
                    }, { cancel: '取消', sure: '去设置'});
                  }
                } else {
                  if(parseInt(error) === 20){
                    bjgasPopup.showPopup('调取相机失败，请尝试设置北京燃气的相机访问权限');
                  } else if(error === "Camera cancelled."){
                    if(baseConfig.debug){
                      console.log('取消相机');
                    }
                  }
                }
              }, optionsCamera);
            } else if(index === 2){
              navigator.camera.getPicture(function(results) {
                NewRepair.photos.splice(NewRepair.photos.length - 1, 0, {
                  url: results,
                  type: "uri"
                });
                NewRepair.smallPhotosSize.splice(NewRepair.smallPhotosSize.length - 1, 0, 'cover');
                $timeout(function () {
                  $scope.$apply();
                }, 300);
              }, function(error) {
                // error getting photo
                if(baseConfig.debug){
                  console.log('Album error');
                  console.log(JSON.stringify(error));
                }
                if(ionic.Platform.isIOS()){
                  if(error === 'noAuthorization'){
                    bjgasPopup.confirm('北京燃气需要访问你的相册，以便提供更便捷的燃气服务', function (index) {
                      if(index === 0){

                      } else {
                        onCameraErrorIOS();
                      }
                    }, { cancel: '取消', sure: '去设置'});
                  }
                } else {
                  if(error === 'Selection cancelled.'){
                    if(baseConfig.debug){
                      console.log('取消相册');
                    }
                  }
                  // bjgasPopup.showPopup('调取相册失败，请尝试设置北京燃气的相机访问权限');
                }
              }, optionsAlbum);
            }
          });
      } else {
        // show big photo
        NewRepair.photoHight = {
          "height": window.screen.height - 87 + "px"
        };
        NewRepair.showingPhotoIndex = index;
        NewRepair.showingPhoto.url = NewRepair.photos[index].url;
        NewRepair.showPhoto();
      }
    };
    NewRepair.hidePhoto = function() {
      NewRepair.detailModal.hide();
      NewRepair.timeoutHandle = $timeout(function() {
        NewRepair.isShowing = false;
      }, 300);
    };
    NewRepair.deletePhoto = function() {
      NewRepair.photos.splice(NewRepair.showingPhotoIndex, 1);
      NewRepair.smallPhotosSize.splice(NewRepair.showingPhotoIndex, 1);
    };

    function onSend(resp) {
      if (resp && typeof(resp.success) !== "undefined") {
        if (resp.success) {
          bjgasPopup.showPopup('创建报修单成功', function(){
            $ionicHistory.goBack();
          });
        } else {
          if(baseConfig.debug){
            console.log(resp);
          }
          bjgasPopup.showPopup(resp.message);
        }
      }
    }
    function onBolb(formData){ // send
      NewRepair.blobCount = NewRepair.blobCount + 1;
      if(NewRepair.blobCount >= NewRepair.photos.length - 1){
        NewRepair.blobCount = 0;
        $http({
          method: 'POST',
          headers: {
            'Content-type': undefined,
            'Authorization': 'Bearer ' + window.localStorage.token
          },
          data: formData,
          url: baseConfig.basePath + 'i/api/repairs/addrepairs'
        })
        .success(function(resp) {
          if (baseConfig.debug) {
            console.log('success');
          }
          onSend(resp);
        })
        .error(function(resp, states) {
          if (baseConfig.debug) {
            console.log(resp);
          }
          bjgasPopup.showPopup('创建报修单请求错误');
        })
        .finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    }
    NewRepair.submit = function() {
      if (baseConfig.debug) {
        console.log('NewRepair.submit');
      }
      if (!NewRepair.inputModel.gasUserNumber || NewRepair.inputModel.gasUserNumber === '没有户号') {
        bjgasPopup.showPopup('请选择户号');
      } else if (!NewRepair.inputModel.repairType) {
        bjgasPopup.showPopup('请选择报修类型');
      } else if (!NewRepair.inputModel.userNote) {
        bjgasPopup.showPopup('请填写备注信息');
      } else if (NewRepair.inputModel.userNote && NewRepair.inputModel.userNote.indexOf('|') > -1) {
        bjgasPopup.showPopup('备注中不能包含“|”符号');
      } else {
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        if(baseConfig.debug){
          console.log(NewRepair.inputModel);
        }
        NewRepair.inputModel.userNote = NewRepair.inputModel.userNote + ((NewRepair.meterType && NewRepair.meterTypeChina) ? ('（卡表厂家：' + NewRepair.meterTypeChina + '）') : '');
        var formData = new FormData();
        for (var i in NewRepair.inputModel) {
          formData.append(i, NewRepair.inputModel[i]);
        }
        if(NewRepair.inputModel.type !== '燃气预约巡检' && NewRepair.photos.length > 1){
          for (var i = 0; i < NewRepair.photos.length - 1; i++){
            convertImgToBase64(NewRepair.photos[i].url, function (url){
              b64toBlob(url, function (blob){
                formData.append("file", blob, NewRepair.inputModel.repairName + "-报修-.jpg"); // 文件对象bl
                onBolb(formData);
              });
            }, 1);
          }
        } else {
          onBolb(formData);
        }
      }
    };

    function b64toBlob(b64, onsuccess, onerror) {
      var img = new Image();
      img.onerror = onerror;
      img.onload = function onload() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var width = img.width;
        var height = img.height;
        var ctx = canvas.getContext('2d');
        // 按比例压缩2.5倍
        var big = (img.width > img.height) ? img.width : img.height;
        var rate = 960 / big;
        //ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
        canvas.toBlob(onsuccess);
      };
      img.src = b64;
    }

    function convertImgToBase64(url, callback, r) {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.src = url;
      if (r <= 0) {
        r = 2;
      }
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        var width = img.width;
        var height = img.height;
        // 按比例压缩r倍
        var rate = 1;
        canvas.width = width * rate;
        canvas.height = height * rate;
        ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
        var dataURL = canvas.toDataURL('image/png');
        callback.call(this, dataURL);
        canvas = null;
      };
    }

    NewRepair.goBack = function() {
      if (baseConfig.debug) {
        console.log('goback');
      }
      $ionicHistory.goBack();
    };

    if (baseConfig.debug) {
      console.log('newrepair Ctrl');
    }

    function onGetNumberList(resp){
      if(resp.success){
        if(resp.rows.length > 0){
          for(var i = 0; i < resp.rows.length; i++){
            NewRepair.gasUserNumbers.push(resp.rows[i]);
          }
          NewRepair.inputModel.gasUserNumber = NewRepair.gasUserNumbers[0].userCode;
          NewRepair.inputModel.detailedAddress= NewRepair.gasUserNumbers[0].address;
          NewRepair.meterType = (NewRepair.gasUserNumbers[0].meterType == NewRepair.cardChar);
          if(baseConfig.debug){
            console.log(NewRepair.meterType);
          }
          if(baseConfig.debug){
            console.log(NewRepair.gasUserNumbers[0]);
          }
        } else {
          NewRepair.inputModel.gasUserNumber = '没有户号';
        }
        if(baseConfig.debug) {
          console.log(resp.rows);
        }
        realHide();
      } else {
        realHide();
      }
    }
    function getNumberList(){
      var userUrl = baseConfig.basePath + 'i/api/getUserGasList/' + JSON.parse(window.localStorage.userInfo).userId;

      bjgasHttp.get(userUrl).success(function(response) {
        onGetNumberList(response);
      }).error(function(error) {

      }).finally(function() {

      });
    }

    function onGetRepairType(resp){
      realHide();
      if(resp.success){
        if(baseConfig.debug){
          console.log(resp);
        }
        for(var i = 0; i < resp.rows.length; i++){
          NewRepair.repairTypes[i] = resp.rows[i];
        }
      }
    }
    function getRepairType(){
      var url = baseConfig.basePath + 'c/api/codeValueList/' + NewRepair.typeMap[NewRepair.inputModel.type];
      ///c/api/codeValueList/{code}
      bjgasHttp.get(url).success(function(response) {
        onGetRepairType(response);
      }).error(function(response, status) {
        bjgasPopup.showPopup('请求报修类型失败');
      }).finally(function() {

      });
    }

    function onGetInfo(resp){
      if(resp.success){
        resp.rows[0].userId = resp.rows[0].id;
        window.localStorage.userInfo = JSON.stringify(resp.rows[0]);
        bjgasPopup.showPopup('获取联系人id成功，请尝试重新进入页面', function(){
          $ionicHistory.goBack();
        });
      } else {
        bjgasPopup.showPopup('获取联系人id失败，请尝试重新进入页面，或联系客服', function(){
          $ionicHistory.goBack();
        });
      }
    }
    function getInfo(){
      var url = baseConfig.basePath + 'i/api/getUserInfo/' + JSON.parse(window.localStorage.userInfo).userId + '';
      if(baseConfig.debug){
        console.log(url);
      }
      bjgasHttp.get(url)
      .success(function(resp){
        if(baseConfig.debug){
          console.log(resp);
        }
        onGetInfo(resp);
      })
      .error(function(resp){
        bjgasPopup.showShortCenterToast('请求获取联系人id失败');
        if(baseConfig.debug){
          console.log(resp);
        }
      });
    }

    $scope.$on('$ionicView.beforeEnter', function() {

    });
    $scope.$on('$ionicView.afterEnter', function() {
      if(window.localStorage.userInfo){
        NewRepair.info = JSON.parse(window.localStorage.userInfo);
        NewRepair.inputModel.repairCall= NewRepair.info.mobile ? NewRepair.info.mobile : '';
        var missing = '';
        if(!NewRepair.info.contacts){
          bjgasPopup.confirm('缺失联系人，请补充填写', function(index){
            if(index === 0){
              $ionicHistory.goBack();
            } else {
              $state.go('tab.changeNameRepair');
            }
          });
        } else if(!NewRepair.info.appContactId){
          bjgasPopup.showPopup('缺失联系人id，即将尝试重新获取', function(){
            getInfo();
            // $ionicHistory.goBack();
          });
        } else if(!NewRepair.info.userId){
          bjgasPopup.showPopup('缺失用户id，请尝试重新登录', function(){
            $ionicHistory.goBack();
          });
        } else {
          bjgasPopup.showLoadingWithoutBackdrop('加载中');

          getNumberList();
          NewRepair.inputModel.repairName= NewRepair.info.contacts;
          NewRepair.inputModel.appContactId= NewRepair.info.appContactId;
          NewRepair.inputModel.userId= NewRepair.info.userId;
          getRepairType();
        }
      } else {
        bjgasPopup.showPopup('未取到用户数据，请尝试重新登录', function(){
          $ionicHistory.goBack();
        });
      }
    });
  }
}());

/**
 * Created by linlong on 2016/12/15.
 */
(function() {

    // "use strict";
    angular.module("northGas")
        .config(initSelfReadRoute);

    /* @ngInject */
    function initSelfReadRoute($stateProvider) {
        $stateProvider
            .state('tab.selfRead', {
                url: '/gas/selfRead/',
                params: { data: '' },
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/self-readding/readding-main.html',
                        controller: 'readdingMainCtrl',
                        controllerAs: 'selfReadVM'
                    }
                }
            });
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('readdingMainCtrl', selfReadCtrl);

    function selfReadCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, $stateParams, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, switchUser) {


        var selfReadVM = this;
        var info = [];
        $scope.$on('$ionicView.beforeEnter', function() {
             info = switchUser.getUserInfo();
            console.log(info);
            //console.log(info.userId == "")
            if (info.userId == "") {
                bjgasPopup.confirm('尚未绑定户号，请先绑定', function(index) {
                    if (index == 0) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('tab.gasCancelMain');
                        // $state.go('tab.noGasFromRepair');
                    }
                });
                selfReadVM.data = {
                    "userAddre": "",
                    "userNumber": "先去绑定户号",
                    "addrMess": "",
                    "billsDate": "2016年09月账单",
                    "money": "283.08元",
                    "curShowAmount": "4566.000",
                    "lastShowAmount": "4389.000",
                    "lastGasAmount": "56.000m³",
                    "curGasAmount": "49.000m³",
                    "GasAmount": "101.000m³",
                    "firstGasAmount": "78.000m³",
                    "secondGasAmount": "0",
                    "thirdGasAmount": "0",
                    "firstBillsAmount": "128.000元",
                    "secondBillsAmount": "0",
                    "thirdBillsAmount": "0",
                    "phone": "62330208"
                }
            } else {
                selfReadVM.data = {
                    "userAddre": info.label,
                    "userNumber": info.userCode,
                    "addrMess": info.address,
                    "billsDate": "2016年09月账单",
                    "money": "283.08元",
                    "curShowAmount": "4566.000",
                    "lastShowAmount": "4389.000",
                    "lastGasAmount": "56.000m³",
                    "curGasAmount": "49.000m³",
                    "GasAmount": "101.000m³",
                    "firstGasAmount": "78.000m³",
                    "secondGasAmount": "0",
                    "thirdGasAmount": "0",
                    "firstBillsAmount": "128.000元",
                    "secondBillsAmount": "0",
                    "thirdBillsAmount": "0",
                    "phone": "62330208"
                }
            }
        });



        selfReadVM.prePage = function() {
            // $state.go("takePhoto",{data:""});
            $ionicHistory.goBack();
        }

        selfReadVM.toPhone = function() {
            // $state.go("takePhoto",{data:""});
        }
        selfReadVM.toManual = function() {
              if(info.meterType == "C" ){
                      bjgasPopup.showPopup("该功能仅对普表-后付费用户开放");
                      return;
                  }else {

              }
            $state.go("tab.manualDial", { data: "" });
        }
        selfReadVM.toNuan = function() {
            if(info.meterType == "R" ){
                      bjgasPopup.showPopup("该功能仅对卡表-预付费用户开放");
                      return;
                  }else {

              }
            $state.go('tab.heating');
        }
        selfReadVM.togassSitchUser = function() {
            $state.go('tab.switchUser');
        }

        try {
            var optionsCamera = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 1080,
                targetHeight: 1080,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation: true
            };
            var optionsAlbum = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 1080,
                targetHeight: 1080,
                popoverOptions: CameraPopoverOptions,
                correctOrientation: true
            };
        } catch (error) {

        }
        var optionsAs = {
            title: '选择照片来源',
            buttonLabels: ['拍照', '相册'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true
        };
        var optionsPicker = {
            maximumImagesCount: 1,
            width: 1080,
            height: 1080,
            quality: 100
        };
        $scope.$on('$destroy', function() {
            bjgasPopup.hideLoading();
        });
        selfReadVM.openPhoto = function() {
           if(info.meterType == "C" ){
                      bjgasPopup.showPopup("该功能仅对普表-后付费用户开放");
                      return;
                  }else {

              }
            //console.log("openPhoto");
            // add photo
            // img/repair/96777@2x.png
            try {
                $cordovaActionSheet.show(optionsAs)
                    .then(function(btnIndex) {
                        var index = btnIndex;
                        if (index == 1) {
                            $cordovaCamera.getPicture(optionsCamera).then(function(imageData) {
                                    //console.log(angular.toJson(imageData))
                                    console.log(1);
                                    bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                                    console.log(1);
                                    Tesseract.recognize(imageData, {
                                            lang: 'spa',
                                            tessedit_char_blacklist: 'e'
                                        })
                                        .then(function(result) {
                                            console.log(1);
                                            bjgasPopup.hideLoading();
                                            if (result.text.length == 8) {

                                            } else {
                                                result.text += "0000000";
                                                result.text = result.text.substring(0, 8);
                                            }
                                            // document.getElementById("picker").value = JSON.parse(result.text);
                                            console.log(result.text);
                                            $state.go("tab.manualDial", { data: result.text });
                                            //console.log('result is: ', result)
                                        })
                                })
                                //   Tesseract.recognize(imageData)
                                //     .then(function(result){//console.log('result is: ', result)})
                                // }, function(err) {
                                //   // error
                                // });
                        } else if (index == 2) {
                            navigator.camera.getPicture(function(results) {
                                console.log(1);
                                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                                //console.log(angular.toJson(results))
                                console.log(1);
                                Tesseract.recognize(results, {
                                        lang: 'spa',
                                        tessedit_char_blacklist: 'e'
                                    })
                                    .then(function(result) {
                                        console.log(1);
                                        bjgasPopup.hideLoading();
                                        if (result.text.length == 8) {

                                        } else {
                                            result.text += "0000000";
                                            result.text = result.text.substring(0, 8);
                                        }
                                        // document.getElementById("picker").value = JSON.parse(result.text);
                                        console.log(result.text);
                                        $state.go("tab.manualDial", { data: result.text });
                                        //console.log('result is: ', result)
                                    })

                                // Tesseract.recognize(results)
                                //   .then(function(result){//console.log('result is: ', result)});

                                $scope.$apply();
                            }, function(error) {
                                // error getting photos
                            }, optionsAlbum);
                        }
                    });
            } catch (error) {
                //console.log(angular.toJson(error));
                //console.log(error);
            }
        };
    }
}());
(function() {
  // "use strict";
  angular.module("northGas")
    .config(initChangeMobile);

  /* @ngInject */
  function initChangeMobile($stateProvider) {
    $stateProvider
      .state('tab.changeMobile', {
        url: '/mine/changeMobile',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/change-mobile/change-mobile.html',
            controller: 'ChangeMobileCtrl',
            controllerAs: 'ChangeMobile'
          }
        }
      });
  }
}());

(function(){
  "use strict";
  angular.module('northGas.mine')
    .controller('ChangeMobileCtrl', ChangeMobileCtrl);
  function ChangeMobileCtrl($scope, $ionicHistory, $timeout, LoginService, bjgasPopup, bjgasHttp, verifyTimerService, baseConfig){
    if(baseConfig.debug){
      console.log('ChangeMobileCtrl');
    }

    var ChangeMobile = this;
    ChangeMobile.timeoutHandle = '';
    ChangeMobile.noUser = true;
    ChangeMobile.mobile = undefined;
    ChangeMobile.userInfo = '';
    ChangeMobile.inputModel = {
      mobile: '',
      code: ''
    };
    ChangeMobile.top = {top: "44px"};

    if(ionic.Platform.isIOS()){
      ChangeMobile.top = {top: "64px"};
    }

    verifyTimerService.on(function(label, flag) {
      ChangeMobile.verifyLabel = label;
      ChangeMobile.verifyDisableFlag = flag;
    });

    function onGetInfo(resp){
      if(resp.success){
        resp.rows[0].userId = resp.rows[0].id;
        window.localStorage.userInfo = JSON.stringify(resp.rows[0]);
        bjgasPopup.showPopup('用户手机号已更换为<br/>' + ChangeMobile.inputModel.mobile, function () {
          ChangeMobile.prePage();
        });
      }
    }
    function getInfo(){
      var url = baseConfig.basePath + 'i/api/getUserInfo/' + JSON.parse(window.localStorage.userInfo).userId + '';
      if(baseConfig.debug){
        console.log(url);
      }
      bjgasHttp.get(url)
      .success(function(resp){
        if(baseConfig.debug){
          console.log(resp);
        }
        onGetInfo(resp);
      })
      .error(function(resp){
        bjgasPopup.showShortCenterToast('请求刷新用户信息失败');
        if(baseConfig.debug){
          console.log(resp);
        }
      });
    }

    function onSubmit (resp){
      if(resp && resp.success){
        getInfo();
      } else if(resp && resp.message) {
        bjgasPopup.showPopup(resp.message);
      }
    }
    ChangeMobile.submit = function() {
      if(baseConfig.debug){
        console.log('click');
      }
      var regPhone = /[0-9]{11}/;
      var url = baseConfig.basePath + 'i/api/replaceMobile';
      var param = {
        userId: ChangeMobile.userInfo.id,
        mobile: ChangeMobile.inputModel.mobile,
        code: ChangeMobile.inputModel.code
      };
      if(!ChangeMobile.noUser){
        if(ChangeMobile.inputModel.mobile && ChangeMobile.inputModel.code && regPhone.test(ChangeMobile.inputModel.mobile)) {
          bjgasPopup.showLoadingWithoutBackdrop('提交中');
          bjgasHttp.post(url, param).success(function(resp){
            if(resp){
              onSubmit(resp);
            }
          })
          .error(function(resp){

          })
          .finally(function(resp){
            bjgasPopup.hideLoading();
          });
        } else if(ChangeMobile.inputModel.mobile === '') {
          bjgasPopup.showPopup('请输入手机号');
        } else if(!regPhone.test(ChangeMobile.inputModel.mobile)){
          bjgasPopup.showPopup('您输入的是无效的手机号');
        } else if(ChangeMobile.inputModel.code === '') {
          bjgasPopup.showPopup('请输入验证码');
        }
      }
    };

    function onVerify(resp){
      if(resp.success){
        if (!ChangeMobile.verifyDisableFlag) {
          verifyTimerService.clock();
        }
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    ChangeMobile.verify = function() {
      if (baseConfig.debug) {
        console.log('ChangeMobile.verify');
      }
      if(!ChangeMobile.noUser){
        var regPhone = /[0-9]{11}/;
        if(ChangeMobile.inputModel.mobile) {
          if(ChangeMobile.inputModel.mobile !== ChangeMobile.mobile && regPhone.test(ChangeMobile.inputModel.mobile)){
            bjgasPopup.showLoadingWithoutBackdrop('提交中');
            var url = baseConfig.basePath + 'i/api/getVerificationCode';
            var param = {
              mobile: ChangeMobile.inputModel.mobile ,
              type: "replace"
            };
            bjgasHttp.post(url, param).success(function(resp){
              onVerify(resp);
            }).error(function(resp){

            }).finally(function(){
              bjgasPopup.hideLoading();
            });
          } else {
            var tips = regPhone.test(ChangeMobile.inputModel.mobile) ? '新手机号和旧手机号相同' : '您输入的是无效的手机号';
            bjgasPopup.showPopup(tips);
          }
        } else {
          bjgasPopup.showPopup('请输入手机号');
        }
      }
    };

    ChangeMobile.prePage = function(){
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      if(window.localStorage.userInfo){
        ChangeMobile.userInfo = JSON.parse(window.localStorage.userInfo);
        ChangeMobile.mobile = ChangeMobile.userInfo.mobile;
        ChangeMobile.noUser = false;
      }
    });

    $scope.$on('$ionicView.afterEnter', function() {
      if(!$scope.isLogin()){
        LoginService.showLogin({
          onSuccess: function(){
            ChangeMobile.timeoutHandle = $timeout(function(){
              ChangeMobile.prePage();
            }, 300);
            $timeout(function(){
              document.getElementsByClassName('modal-backdrop')[0].style['pointer-events'] = 'none';
            }, 300);
          }
        });
      }
    });

    $scope.$on('$destroy', function() {
      verifyTimerService.off();
      $timeout.cancel(ChangeMobile.timeoutHandle);
    });
  }
}());

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initAppsettingRoute);

  /* @ngInject */
  function initAppsettingRoute($stateProvider) {
    $stateProvider
      .state('tab.appSetting', {
        url: '/app-setting',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/app-setting.html',
            controller: 'AppSettingCtrl',
            controllerAs: 'AppSetting'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.mine')
    .controller('AppSettingCtrl', AppSettingCtrl);

  function AppSettingCtrl($scope, $state, $ionicHistory, $timeout, LoginService, bjgasPopup, baseConfig) {
    var AppSetting = this;

    AppSetting.timeoutHandle = '';
    AppSetting.showLogout = LoginService.isLogin();

    function settingClick(callback){
      if(LoginService.isLogin()){
        if(typeof(callback) === 'function'){
          callback();
        } else {
          if(baseConfig.debug){
            console.log('mineClick(callback); callback is not a function.');
          }
        }
      } else {
        LoginService.showLogin({
          onSuccess: function(){
            AppSetting.showLogout = LoginService.isLogin();
            if(baseConfig.debug){
              console.log(LoginService.isLogin());
            }
          }
        });
      }
    }

    AppSetting.onReset = function() {
      if (baseConfig.debug) {
        console.log('click reset');
      }
      settingClick(function () {
        $state.go('tab.reset');
      });
    };
    AppSetting.onProblem = function() {
      if (baseConfig.debug) {
        console.log('click problem');
      }
      settingClick(function () {
        $state.go('tab.security');
      });
    };
    AppSetting.onAbout = function() {
      if(baseConfig.debug){
        console.log('click about');
      }
      // bjgasPopup.showVeryShortCenterToast('暂未开放');
      $state.go('tab.appAbout');
    };
    AppSetting.goBack = function() {
      if(baseConfig.debug){
        console.log('goback');
      }
      $ionicHistory.goBack();
    };
    if (baseConfig.debug) {
      console.log('AppSettingCtrl');
    }
    AppSetting.logout = function() {
      if(baseConfig.debug){
        console.log('logout');
      }
      window.localStorage.token = '';
      window.localStorage.userInfo = '';
      window.localStorage.currentUserInfoGas = '';
      window.localStorage.currentUserInfoGasLength = '';
      bjgasPopup.showPopup('已退出登录', function(){
        AppSetting.showLogout = false;
        $ionicHistory.goBack();
      });
    };
  }
}());

(function(){
  angular.module('northGas')
  .config(initChangeName);
  function initChangeName($stateProvider){
    $stateProvider
    .state('tab.changeName', {
      url: '/changeName',
      views: {
        'tab-mine': {
          templateUrl: 'pages/mine/change-name/change-name.html',
          controller: 'ChangeNameCtrl',
          controllerAs: 'ChangeName'
        }
      }
    })
    .state('tab.changeNameRepair', {
      url: '/changeNameRepair',
      views: {
        'tab-gas': {
          templateUrl: 'pages/mine/change-name/change-name.html',
          controller: 'ChangeNameCtrl',
          controllerAs: 'ChangeName'
        }
      }
    });
  }
}());

(function(){
  "use strict";
  angular.module('northGas.mine')
    .controller('ChangeNameCtrl', ChangeNameCtrl);
  function ChangeNameCtrl($scope, $ionicHistory, $timeout, LoginService, bjgasPopup, bjgasHttp, baseConfig){
    if(baseConfig.debug){
      console.log('ChangeNameCtrl');
    }
    var ChangeName = this;

    ChangeName.timeoutHandle = '';
    ChangeName.noUser = true;
    ChangeName.userInfo = '';
    ChangeName.inputModel = {
      name: ''
    };
    ChangeName.top = {top: "44px"};

    if(ionic.Platform.isIOS()){
      ChangeName.top = {top: "64px"};
    }

    ChangeName.prePage = function(){
      $ionicHistory.goBack();
    };

    function onGetInfo(resp){
      if(resp.success){
        resp.rows[0].userId = resp.rows[0].id;
        window.localStorage.userInfo = JSON.stringify(resp.rows[0]);
        bjgasPopup.showPopup('设置成功', function(){
          ChangeName.prePage();
        });
      }
    }
    function getInfo(){
      var url = baseConfig.basePath + 'i/api/getUserInfo/' + JSON.parse(window.localStorage.userInfo).userId + '';
      if(baseConfig.debug){
        console.log(url);
      }
      bjgasHttp.get(url)
      .success(function(resp){
        if(baseConfig.debug){
          console.log(resp);
        }
        onGetInfo(resp);
      })
      .error(function(resp){
        bjgasPopup.showShortCenterToast('请求刷新用户信息失败');
        if(baseConfig.debug){
          console.log(resp);
        }
      });
    }

    function onSubmit(resp){
      if(resp && resp.success){
        getInfo();
      } else if(resp && resp.message) {
        bjgasPopup.showPopup(resp.message);
      } else {
        bjgasPopup.showPopup('设置失败');
      }
    }
    ChangeName.submit = function(){
      if(!ChangeName.noUser && ChangeName.inputModel.name){
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        var url = baseConfig.basePath + 'i/api/bindContacts';
        var param = {
          userId: ChangeName.userInfo.id,
          contacts: ChangeName.inputModel.name
        };
        bjgasHttp.post(url, param).success(function(resp){
          if(baseConfig.debug){
            console.log(resp);
          }
          onSubmit(resp);
        }).error(function(resp){

        }).finally(function(){
          bjgasPopup.hideLoading();
        });
      } else {
        bjgasPopup.showPopup('请输入名字');
      }
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      if(window.localStorage.userInfo){
        ChangeName.userInfo = JSON.parse(window.localStorage.userInfo);
        ChangeName.inputModel.name = (ChangeName.userInfo.contacts ? ChangeName.userInfo.contacts : '');
        ChangeName.noUser = false;
      }
    });

    $scope.$on('$ionicView.afterEnter', function() {
      if(!$scope.isLogin()){
        LoginService.showLogin({
          onSuccess: function(){
            ChangeName.timeoutHandle = $timeout(function(){
              ChangeName.prePage();
            }, 300);
            $timeout(function(){
              document.getElementsByClassName('modal-backdrop')[0].style['pointer-events'] = 'none';
            }, 300);
          }
        });
      }
    });

    $scope.$on('$destroy', function() {
      $timeout.cancel(ChangeName.timeoutHandle);
    });
  }
}());

/**
 * Created by linlong on 2017/1/9.
 */



(function () {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.addGift', {
                url: '/addGift',
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/integral-card/add-gift.html',
                        controller: 'addGiftCtrl',
                        controllerAs: 'addGiftVM'
                    }
                }
            })
    }
}());

(function () {
    "use strict";
    angular.module('northGas')
        .controller('addGiftCtrl', addGiftCtrl);

    function addGiftCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, verifyCode, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }
        var addGiftVM = this;
        addGiftVM.addGiftNo = "";
        addGiftVM.goBack = function () {

            $ionicHistory.goBack();
        };
        var info = switchUser.getUserInfo();

        addGiftVM.openMyIntegral = function () {

            //   $state.go('tab.mobileRecharge');
        };
        addGiftVM.addGift = function () {

        };
        addGiftVM.toMyintegral = function () {

        };

        var code; //在全局 定义验证码
        addGiftVM.createCode = function () {
            code = "";
            var codeLength = 6; //验证码的长度
            var checkCode = document.getElementById("checkCode");
            var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的

            for (var i = 0; i < codeLength; i++) {
                var charIndex = Math.floor(Math.random() * 36);
                code += selectChar[charIndex];
            }
            //alert(code);
            if (checkCode) {
                checkCode.className = "code";
                checkCode.value = code;
            }
            verifyCode.drawPic(document.getElementById("canvasVerify"), code, 20, 30);
        }
        addGiftVM.createCode();

        function validate() {
            console.log(code);
            console.log(document.getElementById("input1").value);
            var inputCode = document.getElementById("input1").value;
            if (inputCode.length <= 0) {
                bjgasPopup.showPopup("请输入验证码！");
                return 0;
            } else if (inputCode.toLowerCase() != code.toLowerCase()) {
                bjgasPopup.showPopup("验证码输入错误！");
                return 0;
                addGiftVM.createCode(); //刷新验证码
            } else {
                return 1;
            }
        }

        addGiftVM.addinte = function () {
            if (addGiftVM.addGiftNo == "") {
                bjgasPopup.showPopup("请输入礼品劵！");
                return;
            }
            if (validate() === 1) { } else {
                return;
            }

            console.log("addGiftVM.addGiftNo:" + addGiftVM.addGiftNo);
            var userUrl = baseConfig.basePath + 'i/api/coupons/get';
            console.log(info);
            var temp = { "userId": info.userId, "serialNumber": addGiftVM.addGiftNo }
            // "um287181hw"

            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            bjgasHttp.post(userUrl, temp).success(function (response) {
                console.log(angular.toJson(response));
                if(response.success == true)
                bjgasPopup.showPopup(response.message,$ionicHistory.goBack);
            }).error(function (error) {

            }).finally(function () {
                bjgasPopup.hideLoading();
            });
        }

    }
}());
(function() {
  'use strict';
  angular.module('base.config').
  factory('myGift', myGiftc);

  /* @ngInject */
  function myGiftc(baseConfig, bjgasHttp, bjgasPopup) {
  var giftData;
    var myGift = {
       setData:function(item){
        giftData = JSON.stringify(item);
       } ,
       getData:function(){
        try {
             return JSON.parse(giftData);
             } catch (e) {
             return [];
           }
       }
    }
    return myGift;

  }
}());




/**
 * Created by linlong on 2017/1/9.
 */



(function() {
  // "use strict";
  angular.module("northGas")
    .config(initBindNumberRoute);

  /* @ngInject */
  function initBindNumberRoute($stateProvider) {
    $stateProvider
      .state('tab.integralCard', {
        url: '/integralCard',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/integral-card/integral-card-main.html',
            controller: 'integralCardCtrl',
            controllerAs: 'integralCardVM'
          }
        }
      })
  }
}());

(function() {
  "use strict";
  angular.module('northGas')
    .controller('integralCardCtrl', integralCard);

  function integralCard($scope, $state, $ionicHistory, bjgasPopup, baseConfig,bjgasHttp,switchUser) {
    if(baseConfig.debug) {
      console.log('CheckStaffInputCtrl');
    }
    var integralCardVM = this;
    integralCardVM.goBack = function() {
      console.log('111');
      $ionicHistory.goBack();
    };

    integralCardVM.openMyIntegral=function(){

      $state.go('tab.myIntegral');
    };
    integralCardVM.addGift = function(){
      $state.go('tab.addGift');
    };
    integralCardVM.toMyGift = function(){
      $state.go('tab.myGift',{flag:'1'});
    };
  }
}());

/**
 * Created by linlong on 2017/1/9.
 */



(function () {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.myGift', {
                url: '/myGift',
                params: { data: '', flag: "" },
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/integral-card/my-gift.html',
                        controller: 'myGiftCtrl',
                        controllerAs: 'myGiftVM'
                    }
                }
            })
            .state('tab.myGiftFromSpCart', {
                url: 'accessOrder/myGift',
                params: { data: '' },
                views: {
                    'tab-shopping-cart': {
                        templateUrl: 'pages/mine/integral-card/my-gift.html',
                        controller: 'myGiftCtrl',
                        controllerAs: 'myGiftVM'
                    }
                }
            })
    }
}());

(function () {
    "use strict";
    angular.module('northGas')
        .controller('myGiftCtrl', myGiftCtrl);

    function myGiftCtrl($scope, $state, $stateParams, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser, myGift) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }
        var myGiftVM = this;
        console.log(angular.toJson($stateParams));
        if ($stateParams.flag || $stateParams.data) {
            myGiftVM.chooseFlag = true;
        } else {
            myGiftVM.chooseFlag = false;
        }
        console.log(myGiftVM.chooseFlag);
        myGiftVM.data = [];
        if ($stateParams.data == "") {
            var info = switchUser.getUserInfo();
            console.log(info)
            var parm = info.userId;
            var userUrl = baseConfig.basePath + 'i/api/coupons/getMyCoupons/' + parm;


            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            bjgasHttp.post(userUrl).success(function (response) {
                console.log(angular.toJson(response));
                if (response.success == false) {
                    bjgasPopup.showPopup(response.message, $ionicHistory.goBack);
                } else {
                    myGiftVM.data = response.rows;
                }

            }).error(function (error) {

            }).finally(function () {
                bjgasPopup.hideLoading();
            });
        } else {
            myGiftVM.data =
                [{
                    "id": null, "couponsId": $stateParams.data[0].id,
                    "serialNumber": null, "userName": null, "contacts": null, "status": "N",
                    "couponsName": $stateParams.data[0].couponsName, "couponsValue": $stateParams.data[0].couponsAmount, "startDate": "--",
                    "endDate": "--"
                }];
            // [{"objectVersionNumber":null,
            // "id":"1949efbc48864b988e2c4887219e7363",
            // "couponsId":"01bae5c25e2c4c309aa9c1f0367ab34c",
            // "couponsSerialNumber":"myi4hw1jm8","couponsName":"双12",
            // "couponsAmount":100,"useAmount":100}]
        }

        myGiftVM.itemChose = function (item) {
            if (myGiftVM.chooseFlag == false) {
                myGift.setData(item);
                $ionicHistory.goBack();
            }

        }


        myGiftVM.goBack = function () {
            console.log('111');
            $ionicHistory.goBack();
        };

        myGiftVM.openMyIntegral = function () {

            //   $state.go('tab.mobileRecharge');
        };
        myGiftVM.addGift = function () {

        };
        myGiftVM.toMyintegral = function () {

        };
    }
}());

/**
 * Created by linlong on 2017/1/9.
 */



(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.myIntegral', {
                url: '/myIntegral',
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/integral-card/my-integral.html',
                        controller: 'myIntegralCtrl',
                        controllerAs: 'myIntegralVM'
                    }
                }
            })
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('myIntegralCtrl', myIntegralCtrl);

    function myIntegralCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }
        var myIntegralVM = this;
        myIntegralVM.data = {
            "money": "100",
            "text": "双十一促销品券",
            "date": "使用期限：2016.11.11-2016.11.12"
        }
        myIntegralVM.goBack = function() {
            console.log('111');
            $ionicHistory.goBack();
        };
        myIntegralVM.data = [];
        var userUrl = baseConfig.basePath + 'i/api/integral/getMyIntegral';
        // var userUrl = "http://10.211.108.164:8080/bjgas-server/" + 'i/api/integral/getMyIntegral?userId=' + JSON.parse(window.localStorage.userInfo).userId;
        // var userUrl = "http://10.211.108.164:8080/bjgas-server/" + 'i/api/integral/getMyIntegral';
        var temp = {
            //  "userId":JSON.parse(window.localStorage.userInfo).userId
            "userId": "85ef40401715477d830e044621f72d5f",
            "page": "1",
            "pagesize": "10"
        }

        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl, temp).success(function(response) {
            console.log(angular.toJson(response));
            myIntegralVM.data = response.rows;
            if (myIntegralVM.data.length == 0) {
                myIntegralVM.totalIntegral = 0;
            } else {
                myIntegralVM.totalIntegral = (myIntegralVM.data.pop()).totalIntegral;
                // console.log(angular.toJson(myIntegralVM.totalIntegral));
            }
            console.log(angular.toJson(myIntegralVM.totalIntegral));
        }).error(function(error) {

        }).finally(function() {
            bjgasPopup.hideLoading();
        });

        myIntegralVM.openMyIntegral = function() {

            //   $state.go('tab.mobileRecharge');
        };
        myIntegralVM.addGift = function() {

        };
        myIntegralVM.toMyintegral = function() {

        };
    }
}());
/**
 * Created by USER on 2017/1/11.
 */

(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);
    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.myOrderDetail', {
                url: '/myOrderDetail',
                 params: { data: '' },
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/my-order/my-order-detail.html',
                        controller: 'myOrderDetailCtrl',
                        controllerAs: 'myOrderDetailVM'
                    }
                }
            })
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('myOrderDetailCtrl', myOrderDetailCtrl);

    function myOrderDetailCtrl($scope, $state, $ionicHistory,$stateParams, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }


        var myOrderDetailVM = this;
        myOrderDetailVM.logisticsNoFlag = true;
        myOrderDetailVM.goCustomerService = function () {
            $state.go('tab.customServiceList');
        }
        myOrderDetailVM.service= function () {
            console.log("121231");
            $state.go('tab.saledService');
        }
        myOrderDetailVM.goBack = function() {
            $ionicHistory.goBack();
        };
        myOrderDetailVM.toDetail = function() {
            $state.go('tab.rechargeListDetail');
        }
         myOrderDetailVM.execute = function() {//确认收货
            http://localhost:8080/bjgas-server/i/api/confirmReceipt

        var parm = {
	        "orderNo":myOrderDetailVM.mess.orderNo
        }
 var userUrl = baseConfig.basePath + 'i/api/confirmReceipt';


        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl,parm).success(function(response) {
            console.log(angular.toJson(response));
            // [{"objectVersionNumber":1,"couponsId":"1634dca6a73947a6803e89c47bd130b9","couponsName":"新年","couponsValue":90,"startDate":"2017-01-19","endDate":"2017-01-19","count":3},{"objectVersionNumber":1,"couponsId":"2a497215e6724e5eb0b557d7989dda8d","couponsName":"超爽礼品劵","couponsValue":2000,"startDate":"2017-01-21","endDate":"2017-02-07","count":5}]
        if(response.success == true){
// {"message":"取消订单成功","success":true}
      bjgasPopup.showPopup(response.message);
      initData();
    }else{
      bjgasPopup.showPopup(response.message);
    }
        }).error(function(error) {

        }).finally(function() {
            bjgasPopup.hideLoading();
        });

        }
         myOrderDetailVM.cancel = function() {//评价
            http://localhost:8080/bjgas-server/i/api/cancelOrder
var parm ={
	"orderNo":myOrderDetailVM.mess.orderNo,
	"reason":"不想买了"
}
 var userUrl = baseConfig.basePath + 'i/api/cancelOrder' ;


        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl,parm).success(function(response) {
            console.log(angular.toJson(response));
            // [{"objectVersionNumber":1,"couponsId":"1634dca6a73947a6803e89c47bd130b9","couponsName":"新年","couponsValue":90,"startDate":"2017-01-19","endDate":"2017-01-19","count":3},{"objectVersionNumber":1,"couponsId":"2a497215e6724e5eb0b557d7989dda8d","couponsName":"超爽礼品劵","couponsValue":2000,"startDate":"2017-01-21","endDate":"2017-02-07","count":5}]
    if(response.success == true){
// {"message":"取消订单成功","success":true}
      bjgasPopup.showPopup(response.message);
      initData();
    }else{
      bjgasPopup.showPopup(response.message);
    }
        }).error(function(error) {

        }).finally(function() {
            bjgasPopup.hideLoading();
        });

        }
         myOrderDetailVM.result = function() {//结算
           $state.go('tab.appPayInvo',
                    {
                        count:myOrderDetailVM.mess.orderAmount,
                        order: {
                            "orderNo": myOrderDetailVM.mess.orderNo,
                            "payType": "WX",
                            "businessType": "commodity"
                        }
                    }
                )
        }
//  <div class="footer-one" ng-click="myOrderDetailVM.execute()">确认收货</div>
//             <div class="footer-four" ng-click="myOrderDetailVM.review()">评价</div>
//              <div class="footer-five" ng-click="myOrderDetailVM.result()">结算</div>

        myOrderDetailVM.coupon = " 无";
  myOrderDetailVM.data = [{ "name": "待付款", "code": "y" },
                        { "name": "已付款", "code": "w" },
                         { "name": "已发货", "code": "w" },
                         { "name": "已收货", "code": "w" }];
        myOrderDetailVM.list = [{ "src": "img/mine/my-order/test.png", "money": "100.00", "quatity": "100", "date": "2012-12-12 ", "state": "y" },
            { "src": "img/mine/my-order/test.png", "money": "150.00", "quatity": "150", "date": "2012-02-12 ", "state": "y" },
            { "src": "img/mine/my-order/test.png", "money": "200.00", "quatity": "100", "date": "2012-09-12 ", "state": "c" }
        ];

        myOrderDetailVM.mess = {
            number: "3330239203293",
            src: "img/mine/my-order/yunda.png",
            mailName: "韵达快递",
            "orderNumber": "2323423423423",
            "orderDate": "2016-12-12",
            "recevor": "",
            "tel": "1387989382",
            "address": "北京市海淀区西直门南小街回风花园4号",
            "saleName": "华帝极客i110084+10043侧吸式自动抽洗油烟机套装",
            "saleState": "免费上门服务安装",
            "saleNumber": "1",
            "saleMoney": "5080.00",
            "coupon": "您有一张优惠劵可以使用",
            "integral": "您现有700积分，可抵用7元",
            "invoice": "不开发票",
            "freight": "北京市内免费",
            "freightN": "0",
            "price": "2097",
            "off": "7",
            "totol": "2090"
        }

        // console.log(angular.toJson($stateParams));
        // console.log(angular.toJson($stateParams.id));
        myOrderDetailVM.src = "img/mine/my-order/yunda.png";
        myOrderDetailVM.src1 = "img/mine/my-order/yunda.png";

        var parm = $stateParams.data.id;
        $scope.$on('$ionicView.beforeEnter', function() {
  initData();
        });

        function initData(){
        var userUrl = baseConfig.basePath + 'i/api/getOrderDetail/' + parm ;
        // var userUrl = "http://10.211.108.164:8080/bjgas-server/" + 'i/api/integral/getMyIntegral?userId=' + JSON.parse(window.localStorage.userInfo).userId;
        myOrderDetailVM.review = function() {
            console.log(111111);
            $state.go("tab.productReview",{data:myOrderDetailVM.mess});

        }


        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl).success(function(response) {
            console.log(angular.toJson(response));

    myOrderDetailVM.src1 =response.rows[0].commodityList[0].commodityPic;
            switch(response.rows[0].state){
                case "WAIT_PAY":
                        // myOrderDetailVM.data = [{ "name": "下单", "code": "y" },
                        // { "name": "付款", "code": "w" },
                        //  { "name": "配货", "code": "w" },
                        //  { "name": "出库", "code": "w" },
                        //  { "name": "完成", "code": "w" }];
                        // 等待付款=>已付款=>已发货=>已收货
                      myOrderDetailVM.data = [{ "name": "待付款", "code": "y" },
                        { "name": "已付款", "code": "w" },
                         { "name": "已发货", "code": "w" },
                         { "name": "已收货", "code": "w" }];
                break;
                case "PAY_FINISH":
                        myOrderDetailVM.data = [{ "name": "待付款", "code": "n" },
                        { "name": "已付款", "code": "y" },
                         { "name": "已发货", "code": "w" },
                         { "name": "已收货", "code": "w" }];
                break;
                case "DELIVERED":
                    myOrderDetailVM.data = [{ "name": "待付款", "code": "n" },
                        { "name": "已付款", "code": "n" },
                         { "name": "已发货", "code": "y" },
                         { "name": "已收货", "code": "w" }];
                break;
                case "RECEIVING":
                      myOrderDetailVM.data = [{ "name": "待付款", "code": "n" },
                        { "name": "已付款", "code": "n" },
                         { "name": "已发货", "code": "n" },
                         { "name": "已收货", "code": "y" }];
                break;
                case "EVALUATE":
                   myOrderDetailVM.data = [{ "name": "待付款", "code": "n" },
                        { "name": "已付款", "code": "n" },
                         { "name": "已发货", "code": "n" },
                         { "name": "已收货", "code": "y" }];break;
                case "CANCELED":
                 myOrderDetailVM.data = [{ "name": "退换中", "code": "y" },
                        { "name": "已退货", "code": "w" },
                         { "name": "已退款", "code": "w" },
                         { "name": "已关闭", "code": "w" }];
                break;
                case "RETURNING":
                 myOrderDetailVM.data = [{ "name": "退换中", "code": "n" },
                        { "name": "已退货", "code": "y" },
                         { "name": "已退款", "code": "w" },
                         { "name": "已关闭", "code": "w" }];
                break;
                case "RETURNED":
                 myOrderDetailVM.data = [{ "name": "退换中", "code": "n" },
                        { "name": "已退货", "code": "n" },
                         { "name": "已退款", "code": "y" },
                         { "name": "已关闭", "code": "w" }];
                break;
                case "COLSED":
                         myOrderDetailVM.data = [{ "name": "退换中", "code": "n" },
                        { "name": "已退货", "code": "n" },
                         { "name": "已退款", "code": "n" },
                         { "name": "已关闭", "code": "y" }];
                break;
            }
            myOrderDetailVM.mess = response.rows[0];
            if(myOrderDetailVM.mess.logisticsNo == undefined){
                myOrderDetailVM.logisticsNoFlag = false;
            }
            if(myOrderDetailVM.mess.couponsList.length == 0){
                myOrderDetailVM.coupon = " 无";
            }else{
                myOrderDetailVM.coupon = "您有一张优惠劵可以使用";
            }



        }).error(function(error) {

        }).finally(function() {
            bjgasPopup.hideLoading();
        });
    }
      myOrderDetailVM.couponFunction =  function() {
          if(myOrderDetailVM.mess.couponsList.length == 0){
            return;
          }
          console.log(angular.toJson(myOrderDetailVM.mess.couponsList));
          $state.go("tab.myGift",{data:myOrderDetailVM.mess.couponsList});
      }
      myOrderDetailVM.detailInvoiceFunction=  function() {
          $state.go("tab.myShow",{data:[{
                 "isInvoice": "Y",								//是否需要开发票
      "invoiceType": "company",						//发票类型（公司：company，个人：person）
      "invoiceTitle": "上海汉得信息科技股份有限公司",	//发票抬头
      "invoiceState": "N",							//是否已开发票
          }]});
      }

    }
}());


(function() {
    'use strict';
    angular.module('northGas.customFilter').filter("stateDataMyOrder", function() {
        return function(data, flag) {
            try {
                if (data == "c") {

                    return "等待付款";
                } else if (data == "y") {
                    return "已付款";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter("stateIsInvoice", function() {
        return function(data, flag) {
            try {
                if (data == "Y") {

                    return "发票信息";
                } else if (data == "N") {
                    return "无发票";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

/**
 * Created by USER on 2017/1/11.
 */

(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.myOrderList', {
                url: '/myOrderList',
                params: { data: '' },
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/my-order/my-order-list.html',
                        controller: 'myOrderListCtrl',
                        controllerAs: 'myOrderListVM'
                    }
                }
            })
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('myOrderListCtrl', myOrderListCtrl);

    function myOrderListCtrl($scope, $state, $ionicHistory, $stateParams, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }

        // console.log("237983719823" + angular.toJson($stateParams));
        var myOrderListVM = this;
        var info = switchUser.getUserInfo();
        myOrderListVM.goBack = function() {
            $ionicHistory.goBack();
        };
        myOrderListVM.toDetail = function(i) {
            console.log("toDetail");
            console.log(myOrderListVM.list[i]);
            $state.go('tab.myOrderDetail',{data:myOrderListVM.list[i]});
        }
        myOrderListVM.flagState = $stateParams.data;
        myOrderListVM.list = [
        ];
        $scope.$on('$ionicView.beforeEnter', function() {
  initData();
        });
        function initData(){
   var userUrl = baseConfig.basePath + 'i/api/getOrderListByUserId';
        // var userUrl = "http://10.211.108.164:8080/bjgas-server/" + 'i/api/integral/getMyIntegral?userId=' + JSON.parse(window.localStorage.userInfo).userId;
        var temp = {
            "userId": info.userId,
            "page": "1",
            "pageSize": "10"
        }

        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl, temp).success(function(response) {
            console.log(angular.toJson(response));
            // myIntegralVM.data = response.rows;
            // if (response.rows.length == 0) {
            //     myOrderListVM.list = response.rows;
            // } else {
            //     bjgasPopup.showPopup("未获取到数据!");
            // }
            myOrderListVM.list = response.rows;
            if (myOrderListVM.flagState == "all") {
                if (response.rows.length == 0) {
                    bjgasPopup.showPopup("未获取到数据!",$ionicHistory.goBack);
                } else {

                }
            } else {
                var j = 0;
                for (var i = 0; i < response.rows.length; i++) {
                    if (response.rows[i].state == myOrderListVM.flagState) {
                        j++
                    }
                }
                if (j == 0) {
                    bjgasPopup.showPopup("未获取到数据!",$ionicHistory.goBack);
                }
            }
        }).error(function(error) {

        }).finally(function() {
            bjgasPopup.hideLoading();
        });
        }


    }
}());


(function() {
    'use strict';
    angular.module('northGas.customFilter').filter("stateDataMyOrder", function() {
        return function(data, flag) {
            try {
                if (data == "WAIT_PAY") {
                    return "等待付款";
                } else if (data == "PAY_FINISH") {
                    return "已付款";
                } else if (data == "DELIVERED") {
                    return "已发货";
                } else if (data == "RECEIVING") {
                    return "已收货";
                } else if (data == "EVALUATE") {
                    return "已评价";
                } else if (data == "CANCELED") {
                    return "已取消";
                } else if (data == "RETURNING") {
                    return "退货中";
                } else if (data == "RETURNED") {
                    return "已退货";
                } else if (data == "COLSED") {
                    return "已关闭";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter("suoDate", function() {
        return function(data, flag) {
            try {
                if (data.length > 10) {
                    return data.substr(0, 10);
                }
            } catch (e) {
                return data;
            }

        };
    });
})();
/**
 * Created by USER on 2017/1/11.
 */

(function () {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.productReview', {
                url: '/productReview',
                params: { data: '' },
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/my-order/product-review.html',
                        controller: 'productReviewCtrl',
                        controllerAs: 'productReviewVM'
                    }
                }
            })
    }
}());

(function () {
    "use strict";
    angular.module('northGas')
        .controller('productReviewCtrl', productReviewCtrl);

    function productReviewCtrl($scope, $state, $ionicHistory, $stateParams, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }

        // console.log("237983719823" + angular.toJson($stateParams));
        var productReviewVM = this;
        productReviewVM.remark = "";

        var info = switchUser.getUserInfo();
        productReviewVM.list2 = $stateParams.data.commodityList;
        productReviewVM.imgFlag = true;
        productReviewVM.changeFlag = function () {
            if (productReviewVM.imgFlag == true) {
                productReviewVM.imgFlag = false;
            } else {
                productReviewVM.imgFlag = true;
            }

        };
        productReviewVM.starFlag = [];
        productReviewVM.goBack = function () {
            $ionicHistory.goBack();
        };
        productReviewVM.toDetail = function () {
            console.log("toDetail");
            $state.go('tab.myOrderDetail');
        }
        productReviewVM.flagx = true;
        productReviewVM.selectChange = function () {
            if (productReviewVM.flagx == true) {
                productReviewVM.flagx = false;
            } else {
                productReviewVM.flagx = true;
            }

        }
        var startEle = document.getElementsByClassName("fa");
        productReviewVM.changeColor = function (id, j) {

            for (var i = 0 + j * 5; i < 5 + j * 5; i++) {
                if (i < id + j * 5) {
                    startEle[i].style.color = "rgb(253,177,70)";
                } else {
                    startEle[i].style.color = "rgb(170,170,170)";
                }

            }
            productReviewVM.starFlag[j] = id;
        }
        productReviewVM.productName = "华帝极客i110084+10043侧吸式自动抽洗油烟机套装";
        productReviewVM.flagState = $stateParams.data;
        productReviewVM.list = [{ "src": "img/mine/my-order/test.png", "money": "100.00", "quatity": "100", "date": "2012-12-12 ", "state": "y" },
        { "src": "img/mine/my-order/test.png", "money": "150.00", "quatity": "150", "date": "2012-02-12 ", "state": "y" },
        { "src": "img/mine/my-order/test.png", "money": "200.00", "quatity": "100", "date": "2012-09-12 ", "state": "c" }
        ];

        productReviewVM.comment = function () {
            if(productReviewVM.starFlag.length < $stateParams.data.commodityList.length){
                 bjgasPopup.showPopup("请先完成评价！");
                 return;
            }
            var userUrl = baseConfig.basePath + '/i/api/addEvas';
            var temp =
                {
                    "evaList": [],
                    "orderId": $stateParams.data.id
                }
            for (var i = 0; i < productReviewVM.list2.length; i++) {
                temp.evaList.push({
                    "userId": info.userId,
                    "commodityId": productReviewVM.list2[i].commodityId,
                    "orderCommodityId": productReviewVM.list2[i].id,
                    "comment": productReviewVM.list2[i].remark == undefined ? "" : productReviewVM.list2[i].remark,
                    "satifiedRank": productReviewVM.starFlag[i],
                    "anonymousFlag": (productReviewVM.flagx == true) ? "N" : "Y"
                }

                );
            }

            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            bjgasHttp.post(userUrl, temp).success(function (response) {
                console.log(angular.toJson(response));
                if (response.success == true) {

                    bjgasPopup.showPopup(response.message);
                    $ionicHistory.goBack();
                } else {
                    bjgasPopup.showPopup(response.message);
                }


            }).error(function (error) {

            }).finally(function () {
                bjgasPopup.hideLoading();
            });
        }

    }
}());
/**
 * Created by USER on 2017/1/11.
 */

(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);
    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.saledService', {
                url: '/saledService',
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/my-order/saled-service.html',
                        controller: 'saledServiceCtrl',
                        controllerAs: 'saledServiceVM'
                    }
                }
            })
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('saledServiceCtrl', saledServiceCtrl);

    function saledServiceCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }


        var saledServiceVM = this;
        saledServiceVM.goBack = function() {
            $ionicHistory.goBack();
        };


saledServiceVM.returnedData = [{"value":"质量问题","code":""},
                                {"value":"大小/尺寸与商品描述不符","code":""},
                                {"value":"无法使用商品规格型号","code":""},
                                {"value":"卖家发错货","code":""},
                                {"value":"未按约定时间发货","code":""},
                                {"value":"发票问题","code":""},
                                {"value":"我不想要了","code":""},
                                {"value":"其他","code":""}]
        saledServiceVM.data = [{ "name": "下单", "code": "n" }, { "name": "付款", "code": "n" }, { "name": "配货", "code": "y" }, { "name": "出库", "code": "w" }, { "name": "完成", "code": "w" }]
        saledServiceVM.mess = {
            number: "3330239203293",
            src: "img/mine/my-order/yunda.png",
            mailName: "韵达快递",
            "orderNumber": "2323423423423",
            "orderDate": "2016-12-12",
            "recevor": "",
            "tel": "1387989382",
            "address": "北京市海淀区西直门南小街回风花园4号",
            "saleName": "华帝极客i110084+10043侧吸式自动抽洗油烟机套装",
            "saleState": "免费上门服务安装",
            "saleNumber": "1",
            "saleMoney": "5080.00",
            "coupon": "您有一张优惠劵可以使用",
            "integral": "您现有700积分，可抵用7元",
            "invoice": "不开发票",
            "freight": "北京市内免费",
            "freightN": "0",
            "price": "2097",
            "off": "7",
            "totol": "2090"
        }
        saledServiceVM.service = function() {


        }
        saledServiceVM.src = "img/mine/my-order/yunda.png";
        var parm = "c6fdf1d7-6fa5-46dd-8ed6-cd83007a3e44";
        var userUrl = baseConfig.basePath + 'i/api/getOrderDetail/' + parm ;
        // var userUrl = "http://10.211.108.164:8080/bjgas-server/" + 'i/api/integral/getMyIntegral?userId=' + JSON.parse(window.localStorage.userInfo).userId;
        saledServiceVM.review = function() {
            console.log(111111);
            $state.go("tab.productReview");

        }

        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl).success(function(response) {
            console.log(angular.toJson(response));
            // myIntegralVM.data = response.rows;
            // if (myIntegralVM.data.length == 0) {

            // } else {

            // }
            // myOrderListVM.list = response.rows;

        }).error(function(error) {

        }).finally(function() {
            bjgasPopup.hideLoading();
        });

    }
}());
/**
 * Created by linlong on 2017/1/9.
 */



(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider
            .state('tab.myShow', {
                url: '/myShow',
                 params: { data: '' },
                views: {
                    'tab-mine': {
                        templateUrl: 'pages/mine/my-order/show.html',
                        controller: 'showCtrl',
                        controllerAs: 'showVM'
                    }
                }
            })
    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('showCtrl', showCtrl);

    function showCtrl($scope, $state,$stateParams, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            console.log('CheckStaffInputCtrl');
        }
        var showVM = this;
        console.log(angular.toJson($stateParams));

        showVM.data = [];
          if($stateParams.data == ""){
              var parm = "85ef40401715477d830e044621f72d5f";
        var userUrl = baseConfig.basePath + 'i/api/coupons/getMyCoupons/' + parm;


        bjgasPopup.showLoadingWithoutBackdrop('加载中...');
        bjgasHttp.post(userUrl).success(function(response) {
            console.log(angular.toJson(response));
            showVM.data = response.rows;
        }).error(function(error) {

        }).finally(function() {
            bjgasPopup.hideLoading();
        });
        }else{
showVM.data  = $stateParams.data;
//    "isInvoice": "Y",								//是否需要开发票
//       "invoiceType": "company",						//发票类型（公司：company，个人：person）
//       "invoiceTitle": "上海汉得信息科技股份有限公司",	//发票抬头
//       "invoiceState": "N",							//是否已开发票

// [{"objectVersionNumber":null,
// "id":"1949efbc48864b988e2c4887219e7363",
// "couponsId":"01bae5c25e2c4c309aa9c1f0367ab34c",
// "couponsSerialNumber":"myi4hw1jm8","couponsName":"双12",
// "couponsAmount":100,"useAmount":100}]
        }


        showVM.goBack = function() {
            console.log('111');
            $ionicHistory.goBack();
        };

        showVM.openMyIntegral = function() {

            //   $state.go('tab.mobileRecharge');
        };
        showVM.addGift = function() {

        };
        showVM.toMyintegral = function() {

        };
    }
}());

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter("invoiceType", function() {
        return function(data, flag) {
            try {
                if (data == "company") {

                    return "公司";
                } else if (data == "person") {
                    return "个人";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();
/**
 * Created by linlong on 2016/12/16.
 */


(function() {
    // "use strict";
    angular.module("northGas")
        .config(initBindNumberRoute);

    /* @ngInject */
    function initBindNumberRoute($stateProvider) {
        $stateProvider

            .state('tab.panoramicView', {
            url: '/panoramicView',
            views: {
                'tab-mine': {
                    templateUrl: 'pages/mine/panoramic-view/panoramic-view.html',
                    controller: 'panoramicViewCtrl',
                    controllerAs: 'panoramicViewVM'
                }
            }
        });
    }

}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('panoramicViewCtrl', panoramicViewCtrl);

    function panoramicViewCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, bjgasHttp, switchUser) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }
        var panoramicViewVM = this;
        var info = switchUser.getUserInfo();
        var info1 = JSON.parse(window.localStorage.userInfo);
        var data;
        panoramicViewVM.data = {
            "userAddre": info.label,
            "userNumber": info.userCode,
            "addrMess": info.address,
            "meterType": info.meterType,
            "billsDate": "2016年09月账单",
            "money": "283.08元",
            "curShowAmount": "4566.000",
            "lastShowAmount": "4389.000",
            "lastGasAmount": "56.000m³",
            "curGasAmount": "49.000m³",
            "GasAmount": "101.000m³",
            "firstGasAmount": "78.000m³",
            "secondGasAmount": "0",
            "thirdGasAmount": "0",
            "firstBillsAmount": "128.000元",
            "secondBillsAmount": "0",
            "thirdBillsAmount": "0",
            "phone": "62330208"
        }


        panoramicViewVM.data.repair = {
            "num": "876000001",
            "time": "2016-09-22",
            "linkMain": "李冰",
            "tel": "121323112321",
            "status": "已报修"
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            initData();
        });
        panoramicViewVM.popup = {
            "myPopupContainer1": false,
            "myPopupContainer2": false,
            "myPopupContainer3": false
        }

        function initData() {


            var info = switchUser.getUserInfo();
            var info1 = JSON.parse(window.localStorage.userInfo);
            //console.log(info);

            panoramicViewVM.data = {
                "userAddre": info.label,
                "userNumber": info.userCode,
                "addrMess": info.address,
                "meterType": info.meterType,
                'contacts': info.contacts,
                "userType": info.userType,
                "billsDate": "2016年09月账单",
                "money": "283.08元",
                "curShowAmount": "4566.000",
                "lastShowAmount": "4389.000",
                "lastGasAmount": "56.000m³",
                "curGasAmount": "49.000m³",
                "GasAmount": "101.000m³",
                "firstGasAmount": "78.000m³",
                "secondGasAmount": "0",
                "thirdGasAmount": "0",
                "firstBillsAmount": "128.000元",
                "secondBillsAmount": "0",
                "thirdBillsAmount": "0",
                "phone": "62330208"
            }
            panoramicViewVM.aa = {
                    a2: true,
                    a3: false,
                    a4: false,
                    a5: false,
                    a6: false,
                    a7: false,
                    a8: false,
                    a9: false,
                    a10: false,
                    a11: false
                }
                //


            //阶梯用气量
            var userUrl = baseConfig.basePath + 'r/api?sysName=CCB&apiName=CM-MOB-IF07';
            var data = {
                "CM-MOB-IF07": {
                    "input": { "UniUserCode": info.userCode }
                }
            };
            //console.log(data);
            bjgasPopup.showLoadingWithoutBackdrop('加载中...');
            try {
                bjgasHttp.post(userUrl, data).success(function(response) {
                    //console.log("用气量" + angular.toJson(response));
                    var respData = response['soapenv:Envelope']['soapenv:Body']['CM-MOB-IF07'].output;
                    //console.log(angular.toJson(respData));
                    panoramicViewVM.data.TotalSq = respData.TotalSq;
                    panoramicViewVM.data.Step1LeftoverQty = respData.Step1LeftoverQty;
                    panoramicViewVM.data.Step2LeftoverQty = respData.Step2LeftoverQty;
                    if (respData.TotalSq == 0) {
                        panoramicViewVM.aa = {

                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: true,
                            a12: false
                        }
                    } else if (respData.TotalSq <= 50) {
                        panoramicViewVM.aa = {
                            a2: true,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 50 && respData.TotalSq <= 100) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: true,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 100 && respData.TotalSq <= 150) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: true,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 150 && respData.TotalSq <= 200) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: false,
                            a5: true,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 200 && respData.TotalSq <= 250) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: true,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 250 && respData.TotalSq <= 300) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: true,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 300 && respData.TotalSq <= 350) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: true,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 350 && respData.TotalSq <= 400) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: true,
                            a10: false,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq > 400 && respData.TotalSq <= 500) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: true,
                            a11: false,
                            a12: false
                        }
                    } else if (respData.TotalSq == 500 || respData.TotalSq > 500) {
                        panoramicViewVM.aa = {
                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: false,
                            a12: true
                        }
                    } else {
                        panoramicViewVM.aa = {

                            a2: false,
                            a3: false,
                            a4: false,
                            a5: false,
                            a6: false,
                            a7: false,
                            a8: false,
                            a9: false,
                            a10: false,
                            a11: true,
                            a12: false
                        }
                    }
                    if (response.success == true) {

                    } else {

                    }
                }).error(function(error) {}).finally(function() {
                    bjgasPopup.hideLoading();
                });
            } catch (e) {
                bjgasPopup.hideLoading();
            }
            //气费s
            // http://zttest.bjgas.com/bjgas-server/i/api/repairs/queryInspection/92390081000
            if (info.userCode == null || info.userCode == undefined || info.userCode == "") {} else {
                var userUrl = baseConfig.basePath + 'i/api/repairs/queryInspection/' + info.userCode; //周期巡检信息
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                bjgasHttp.post(userUrl).success(function(response) {
                    //console.log("周" + angular.toJson(response));

                    if (response.success == true) {
                        panoramicViewVM.data1 = response;
                    } else {

                    }
                }).error(function(error) {}).finally(function() {
                    bjgasPopup.hideLoading();
                });
            }

            var data
                //console.log(angular.toJson(info));
                //console.log(angular.toJson(info1));
                //console.log(info.appContactId == null);
                //console.log(info.appContactId);
            panoramicViewVM.data2 = '';
            if (info1.appContactId == null || info1.appContactId == undefined) {

            } else {
                data = {
                    "appContactId": info1.appContactId,
                    "gasUserNumber": info.userCode,
                    "type": "all",
                    "time": "1"
                };
                var userUrl = baseConfig.basePath + 'i/api/repairs/query';
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                bjgasHttp.post(userUrl, data).success(function(response) {
                    //console.log("报修" + angular.toJson(response));
                    if (response.success == true) {
                        panoramicViewVM.data.repair = response.rows[0];
                        panoramicViewVM.data2 = '1';
                    } else {

                    }
                }).error(function(error) {}).finally(function() {
                    bjgasPopup.hideLoading();
                });
            }

            //


        }

        panoramicViewVM.goBack = function() {
            //console.log("goback");
            //console.log("$ionicHistory:" + angular.toJson($ionicHistory));
            //console.log("$ionicHistory" + JSON.stringify($ionicHistory));
            $ionicHistory.goBack();
        };

        panoramicViewVM.toqifei = function() {
            $state.go("tab.gasBillMainMine");
        }
        panoramicViewVM.torepair = function() {
            if (panoramicViewVM.data2 = '') {
                bjgasPopup.showPopup('没有数据！');
            } else {
                $state.go("tab.myRepairDetailMine", { detail: panoramicViewVM.data.repair });
            }


        }


        panoramicViewVM.toswitchUserMine = function() {
            $state.go('tab.switchUserMine');
        }

        panoramicViewVM.choseList = function(data) {
            var itemTwo = document.getElementsByClassName('user-item');
            if (panoramicViewVM.data.parmCancelFlag === "") {

            } else {
                itemTwo[panoramicViewVM.data.parmCancelFlag].style.border = "none";
            }
            panoramicViewVM.data.parmCanceli = panoramicViewVM.userList[data];
            panoramicViewVM.data.parmCancelFlag = data;
            itemTwo[panoramicViewVM.data.parmCancelFlag].style.border = "1px solid #ffd5d2";
        }
        panoramicViewVM.canBind = function() {
            if (panoramicViewVM.data.parmCanceli === "") {
                bjgasPopup.showPopup('请选择户号!');
            } else {
                var userUrl = baseConfig.basePath + 'i/api/unbindUserGas/' + panoramicViewVM.data.parmCanceli.id;
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                bjgasHttp.get(userUrl).success(function(response) {
                    //console.log(angular.toJson(response));

                    if (response.success == true) {
                        bjgasPopup.showPopup(response.message);
                    } else {
                        bjgasPopup.showPopup(response.message);
                    }
                    // bjgasPopup.showPopup('取消失败');
                }).error(function(error) {
                    // panoramicViewVM.userList = [];
                }).finally(function() {
                    bjgasPopup.hideLoading();
                });
            }
        }
        panoramicViewVM.closeDialogS = function(url, data) {
            panoramicViewVM.popup.myPopupContainer3 = false;
            if (data === "R" || data === "C") {
                //console.log($state.current.name);
                if ($state.current.name == 'tab.gasCancelMain') {
                    $state.go('tab.gasBindMain', { data: data });
                } else if ($state.current.name == 'tab.gasCancel') {
                    $state.go('tab.gasBind', { data: data });
                } else {

                }

            } else {

            }

        }
    }
}());

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('switchROC', function() {
        return function(data) {
            try {
                if (data == "C") {
                    return "卡表（预付费）";
                } else {
                    return "普表（后付费）";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();


(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('chongFilter', function() {
        return function(data) {
            try {
                if (data == "C") {
                    return "充值记录";
                } else {
                    return "账单及缴费记录";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('biaoFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {

                    return "充值日期";
                } else {
                    return "缴费单计费日期";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();
(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('payFilter', function() {
        return function(data, flag) {
            try {
                if (data == "C") {

                    return "充值金额";
                } else {
                    return "缴费单应缴金额";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('douPersonFilter', function() {
        return function(data, flag) {
            try {
                if (data == "Y") {
                    return "六人以上";
                } else {
                    return "六人以下";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('enterStatusFilter', function() {
        return function(data, flag) {
            try {
                if (data == "到访不遇") {
                    return "到访不遇";
                } else if (data == "到访拒绝") {
                    return "用户拒绝";
                } else if (data == "完成") {
                    return "到访入户";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();

// 普通家庭=1027、燃气壁挂炉=1028、大用气量=1054
(function() {
    'use strict';
    angular.module('northGas.customFilter').filter('userMeterFilter', function() {
        return function(data, flag) {
            try {
                if (data == "1027") {
                    return "普通家庭";
                } else if (data == "1028") {
                    return "燃气壁挂炉";
                } else if (data == "1054") {
                    return "大用气量";
                } else {
                    return "";
                }
            } catch (e) {
                return data;
            }

        };
    });
})();
(function() {
  'use strict';
  angular.module('northGas')
    .config(initAccessOrder);

  /* @ngInject */
  function initAccessOrder($stateProvider) {
    $stateProvider
      .state('tab.accessOrder', {
        url: '/shopping-cart/access-order',
        params: {
          ordersAboutInfo:{
            'cartIds': [],
            'commodityId': '',
            'totalPrice':'',
            'totalCount':'1'
          }
        },
        views: {
          'tab-shopping-cart': {
            templateUrl: 'pages/shopping-cart/access-order/access-order.html',
            controller: 'AccessOrderCtl',
            controllerAs: 'accessOrder'
          }
        }
      })
      .state('tab.accessOrderFromClassify', {
        url: '/classify/access-order',
        params: {
          ordersAboutInfo:{
            'cartIds': [],
            'commodityId': '',
            'totalPrice':'',
            'totalCount':'1'
          }
        },
        views: {
          'tab-classify': {
            templateUrl: 'pages/shopping-cart/access-order/access-order.html',
            controller: 'AccessOrderCtl',
            controllerAs: 'accessOrder'
          }
        }
      })
      .state('tab.accessOrderFromStore', {
        url: '/store/access-order',
        params: {
          ordersAboutInfo:{
            'cartIds': [],
            'commodityId': '',
            'totalPrice':'',
            'totalCount':'1'
          }
        },
        views: {
          'tab-store': {
            templateUrl: 'pages/shopping-cart/access-order/access-order.html',
            controller: 'AccessOrderCtl',
            controllerAs: 'accessOrder'
          }
        }
      })
      .state('tab.invoice', {
        url: '/shopping-cart/invoice',
        params: {
          'invoice': ''
        },
        views: {
          'tab-shopping-cart': {
            templateUrl: 'pages/shopping-cart/access-order/invoice.html',
            controller: 'InvoiceCtl',
            controllerAs: 'invoice'
          }
        }
      });
  }
}());

(function() {
  'use strict';
  angular.module('northGas.shoppingCart')
    .controller('AccessOrderCtl', AccessOrderCtl);

  /* @ngInject */
  function AccessOrderCtl($scope, $state, bjgasPopup, $stateParams, shoppingCartManagerServ, addressManagerServ, $ionicHistory, myGift) {
    var accessOrder = this;
    var createOrderParams = {
      'userId': JSON.parse(window.localStorage.userInfo).userId, //用户ID
      'consignee': '', //收货人
      'address': '', //收货地址
      'consigneePhone': '', //联系方式
      'orderAmount': '', //订单金额
      'expressCharge': '0', //运费
      'useIntegral': '0', //使用积分
      'isInvoice': 'N', //是否开具发票
      'invoiceType': '', //发票类型
      'invoiceTitle': '', //发票抬头
      'remark': '', //备注说明
      'commodityList': [], //订单商品列表
      'couponsList': [], //订单优惠券列表
      'cardIds': [] //购物车id列表
    };
    var commodityList = []; //存储商品列表信息
    var commodityIdS = []; //存储商品id
    accessOrder.showSvgLoading = true; // 默认显示loading
    accessOrder.selectUseIntegral = false; //默认不勾选使用积分
    accessOrder.transitOrdersInfo = $stateParams.ordersAboutInfo;
    accessOrder.dealShopCartArray = []; //处理购物车id状态清空
    accessOrder.accessOrderInfo = [];
    accessOrder.couponsArriveInfo = {}; //优惠券抵用价格
    accessOrder.invoiceTitleInfo = '不开发票';
    accessOrder.comment = ''; //默认没有备注
    accessOrder.lastTotalPrice = accessOrder.transitOrdersInfo.totalPrice; //最终合计价格初始值
    accessOrder.goManagerAddress = goManagerAddress; //去查看操作收货地址
    accessOrder.toCommodityDetail = toCommodityDetail; //去查看商品详情
    accessOrder.discountCoupon = discountCoupon; //优惠券服务
    accessOrder.useIntegral = useIntegral; //使用积分服务
    accessOrder.invoiceInfo = invoiceInfo; //查看发票信息
    accessOrder.carriage = carriage; //运费信息
    accessOrder.commitOrder = commitOrder; //提交订单
    accessOrder.goBackPage = function() {
      addressManagerServ.setSelectAddressItem({
        'id': 'init_address',
        'receivingPhone': '',
        'receivingName': '',
        'receivingAddress': '',
        'isDefault': 'N'
      });
      // addressManagerServ.setSelectInvoiceItem({
      //   'isInvoice': 'N',
      //   'invoiceType': '',
      //   'invoiceTitle': ''
      // });
      $ionicHistory.goBack();
    };

    window.StatusBar && StatusBar.styleDefault();
    if (ionic.Platform.isIOS()) {
      $('#accessOrderHeader').css({
        'marginBottom': '49px'
      });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
      if (addressManagerServ.getSelectAddressItem().id === 'init_address') {} else {
        accessOrder.accessOrderInfo[0] = addressManagerServ.getSelectAddressItem();
      }
      console.log(myGift.getData());
      if (addressManagerServ.getSelectInvoiceItem().isInvoice === 'N') {
        accessOrder.invoiceTitleInfo = '不开发票';
        createOrderParams.isInvoice = 'N';
      } else if(addressManagerServ.getSelectInvoiceItem().isInvoice === 'Y'){
        if (addressManagerServ.getSelectInvoiceItem().invoiceType === 'person') {
          accessOrder.invoiceTitleInfo = '个人纸质发票';
          createOrderParams.isInvoice = 'Y';
          createOrderParams.invoiceType = 'person';
          createOrderParams.invoiceTitle = '';
        } else if (addressManagerServ.getSelectInvoiceItem().invoiceType === 'company') {
          accessOrder.invoiceTitleInfo = '单位纸质发票';
          createOrderParams.isInvoice = 'Y';
          createOrderParams.invoiceType = 'company';
          createOrderParams.invoiceTitle = addressManagerServ.getSelectInvoiceItem().invoiceTitle;
        }
      }
    });

    /**
     * @description: 数据请求--各种状态回调处理函数
     * @method 1: successData | successDataFromCreate
     * @method 2: errorData
     * @method 3: finallData
     */
    function successData(res) {
      try {
        if (res && res.rows && res.rows.length >= 0) {
          accessOrder.accessOrderInfo = res.rows;
          if(accessOrder.accessOrderInfo[1].money - accessOrder.lastTotalPrice >=0){
            accessOrder.canUseIntegral = false;
          } else {
            accessOrder.canUseIntegral = true;
          }

          if(res.message) {
            bjgasPopup.showPopup(res.message);
          }
        }
      } catch (e) {} finally {}
    }

    function successDataFromCreate(res){
      try {
        if (res && res.success) {
          accessOrder.dealShopCartArray = shoppingCartManagerServ.getStorageSelectStatus();
          angular.forEach(commodityIdS, function(item, index) {
            delete accessOrder.dealShopCartArray[item]; //删除字符串key数组的条目（亲测pop不行）
          });

          shoppingCartManagerServ.setStorageSelectStatus(accessOrder.dealShopCartArray);
          $state.go('tab.appPayFromSpCart', { //去付款界面
            count: accessOrder.lastTotalPrice,
            order: {
              "orderNo": res.rows[0].orderNo,
              "payType": "WX",
              "businessType": "commodity"
            }
          });
        } else if (res && !res.success && res.message) {
          bjgasPopup.showPopup(res.message);
        }
      } catch (e) {} finally {}
    }

    function errorData(res) { //处理失败回调
    }

    function finallData() { //最终状态综合管理
      accessOrder.showSvgLoading = false;
      bjgasPopup.hideLoading();
    }

    bjgasPopup.showLoading('加载中...');
    shoppingCartManagerServ.writeOrder(successData, errorData, finallData, {
      'userId': JSON.parse(window.localStorage.userInfo).userId,
      'cartIds': accessOrder.transitOrdersInfo.cartIds,
      'commodityId': accessOrder.transitOrdersInfo.commodityId
    });

    function goManagerAddress() {
      $state.go('tab.addressList');
    }

    function toCommodityDetail(commodityId) {
      $state.go('tab.goodsDetailFromShopCart', {
        'commodityId': commodityId
      });
    }

    function discountCoupon() {
      $state.go('tab.myGiftFromSpCart');
    }

    function useIntegral() {
      accessOrder.selectUseIntegral = !accessOrder.selectUseIntegral;
      if (accessOrder.selectUseIntegral) {
        accessOrder.lastTotalPrice -= accessOrder.accessOrderInfo[1].money;
        accessOrder.lastTotalPrice = Number(accessOrder.lastTotalPrice).toFixed(2);
      } else {
        accessOrder.lastTotalPrice += accessOrder.accessOrderInfo[1].money;
        accessOrder.lastTotalPrice = Number(accessOrder.lastTotalPrice).toFixed(2);
      }
    }

    function invoiceInfo() {
      $state.go('tab.invoice',{'invoice': accessOrder.accessOrderInfo[2].invoice});
    }

    function carriage() {

    }

    function commitOrder() {
      createOrderParams.consignee = accessOrder.accessOrderInfo[0].receivingName;
      createOrderParams.address = accessOrder.accessOrderInfo[0].receivingAddress;
      createOrderParams.consigneePhone = accessOrder.accessOrderInfo[0].receivingPhone;
      createOrderParams.orderAmount = accessOrder.transitOrdersInfo.totalPrice;
      createOrderParams.remark = accessOrder.comment;
      commodityList = [];
      commodityIdS = [];
      angular.forEach(accessOrder.accessOrderInfo[4].commodityDetail, function(item, index) {
        commodityIdS[index] = item.id;
        commodityList.push({
          'commodityId': item.id,
          'buyNumber': item.buyNumber
        });
      });
      createOrderParams.commodityList = commodityList;
      createOrderParams.cardIds = accessOrder.transitOrdersInfo.cartIds;
      bjgasPopup.showLoading('加载中...');
      shoppingCartManagerServ.createOrder(successDataFromCreate, errorData, finallData, createOrderParams);
    }
  }
})();

(function() {
  'use strict';
  angular.module('northGas.shoppingCart')
    .controller('InvoiceCtl', InvoiceCtl);

  /* @ngInject */
  function InvoiceCtl($scope, $state, bjgasPopup, $ionicHistory, addressManagerServ, $stateParams) {
    var invoice = this;
    var invoiceParams = {
      'isInvoice': 'N',
      'invoiceType': '',
      'invoiceTitle': ''
    };
    invoice.selectInvoice = ['none', 'person', 'company']; //发票选取状态容器
    invoice.selectInvoice['none'] = true; //默认是不开发票
    invoice.companyTitle = ''; //单位抬头信息
    invoice.invoiceManager = invoiceManager; //发票选取状态管理集函数
    invoice.affirm = affirm; //确定按钮响应

    $scope.$on('$ionicView.beforeEnter', function() {
      if (addressManagerServ.getSelectInvoiceItem().isInvoice === 'N') {
        clearInoviceState();
        invoice.selectInvoice['none'] = true;
      } else {
        if (addressManagerServ.getSelectInvoiceItem().invoiceType === 'person') {
          clearInoviceState();
          invoice.selectInvoice['person'] = true;
        } else if (addressManagerServ.getSelectInvoiceItem().invoiceType === 'company') {
          clearInoviceState();
          invoice.selectInvoice['company'] = true;
          invoice.companyTitle = addressManagerServ.getSelectInvoiceItem().invoiceTitle;
        }
      }
    });

    function clearInoviceState() {
      angular.forEach(invoice.selectInvoice, function(item, index) {
        invoice.selectInvoice[item] = false;
      });
    }

    function invoiceManager(name) {
      switch (name) {
        case 'none':
          clearInoviceState();
          invoice.selectInvoice['none'] = true;
          invoiceParams.isInvoice = 'N';
          invoiceParams.invoiceType = '';
          invoice.companyTitle = '';
          invoiceParams.invoiceTitle = '';
          break;
        case 'person':
          clearInoviceState();
          invoice.selectInvoice['person'] = true;
          invoiceParams.isInvoice = 'Y';
          invoiceParams.invoiceType = 'person';
          invoice.companyTitle = '';
          invoiceParams.invoiceTitle = '';
          break;
        case 'company':
          clearInoviceState();
          invoice.selectInvoice['company'] = true;
          invoiceParams.isInvoice = 'Y';
          invoiceParams.invoiceType = 'company';
          invoice.companyTitle = $stateParams.invoice;
          invoiceParams.invoiceTitle = invoice.companyTitle;
          break;
        default:
          break;
      }
    }

    function affirm() {
      if(invoice.selectInvoice['company']){
          invoiceParams.invoiceTitle = invoice.companyTitle;
      }
      addressManagerServ.setSelectInvoiceItem(invoiceParams);
      $ionicHistory.goBack();
    }
  }
})();

;
(function() {
  'use strict';
  angular.module('northGas')
    .config(initAddressManager);

  /* @ngInject */
  function initAddressManager($stateProvider) {
    $stateProvider
      .state('tab.addressList', {
        url: '/shopping-cart/address-list',
        views: {
          'tab-shopping-cart': {
            templateUrl: 'pages/shopping-cart/address-manager/address-list.html',
            controller: 'AddressListCtl',
            controllerAs: 'addressList'
          }
        }
      })
      .state('tab.addressListFromMine', {
        url: '/mine/address-list',
        views: {
          'tab-mine': {
            templateUrl: 'pages/shopping-cart/address-manager/address-list.html',
            controller: 'AddressListCtl',
            controllerAs: 'addressList'
          }
        }
      })
      .state('tab.addressManager', {
        url: '/shopping-cart/address-manager',
        params: {
          'actionName': ''
        },
        views: {
          'tab-shopping-cart': {
            templateUrl: 'pages/shopping-cart/address-manager/add-address.html',
            controller: 'AddressManagerCtl',
            controllerAs: 'addressMang'
          }
        }
      })
      .state('tab.addressManagerFromMine', {
        url: '/mine/address-manager',
        params: {
          'actionName': ''
        },
        views: {
          'tab-mine': {
            templateUrl: 'pages/shopping-cart/address-manager/add-address.html',
            controller: 'AddressManagerCtl',
            controllerAs: 'addressMang'
          }
        }
      });
  }
}());

(function() {
  'use strict';
  angular.module('northGas.shoppingCart')
    .controller('AddressManagerCtl', AddressManagerCtl);

  /* @ngInject */
  function AddressManagerCtl($state, bjgasPopup, $scope, $stateParams, addressManagerServ, $ionicHistory) {
    var addressMang = this;
    var addressItemInfo = $stateParams.actionName;
    var regPhone = /[0-9]{11}/;

    addressMang.consignee = ''; //收货地址
    addressMang.linkTel = ''; //收货地址
    addressMang.addressInfo = ''; //所在地区
    addressMang.detailAddress = ''; //详细地址

    addressMang.choiceAddress = choiceAddress; //选择地区
    addressMang.saveEdit = saveEdit; //保存地址
    if (addressItemInfo.stateTitleName === 'ADD_NEW_ADDRESS') {
      addressMang.titleName = '新建收货地址';
    } else {
      addressMang.titleName = '编辑收货地址';
      addressMang.consignee = addressItemInfo.receivingName;
      addressMang.linkTel = addressItemInfo.receivingPhone;
      // addressMang.addressInfo = addressItemInfo.receivingAddress;
      addressMang.detailAddress = addressItemInfo.receivingAddress;
    }

    function choiceAddress() {
      if (ionic.Platform.isWebView()) {
        bjgasPopup.showShortCenterToast('敬请期待');
      } else {
        alert('敬请期待');
      }
      return;
      $("#city-address-picker").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
          <button class="button button-link pull-right close-picker">确定</button>\
          <h1 class="title">选择收货地址</h1>\
          </header>'
      });
    }

    /**
     * @description: 数据请求--各种状态回调处理函数
     * @method 1: successData
     * @method 2: errorData
     * @method 3: finallData
     */
    function successData(res) {
      try {
        if (res.message === '成功新增' && res.success) {
          bjgasPopup.showPopup(res.message);
          $ionicHistory.goBack();
        } else if (res.message === '成功修改' && res.success) {
          bjgasPopup.showPopup(res.message);
          $ionicHistory.goBack();
        }
      } catch (e) {
        bjgasPopup.hideLoading();
      } finally {}
    }

    function errorData() { //处理失败回调
      bjgasPopup.hideLoading();
    }

    function finallData() { //最终状态综合管理
      bjgasPopup.hideLoading();
    }

    function saveEdit() {
      if (addressMang.consignee) {} else {
        bjgasPopup.showPopup('请添加收货人!');
        return;
      }
      if (addressMang.linkTel) {
        if (regPhone.test(addressMang.linkTel)) {} else {
          bjgasPopup.showPopup('您输入的是无效的手机号!');
          return;
        }
      } else {
        bjgasPopup.showPopup('请输入手机号!');
        return;
      }

      if (addressMang.detailAddress) {} else {
        bjgasPopup.showPopup('请输入详细收货地址!');
        return;
      }
      var addressParam = {
        'id': null,
        'userId': JSON.parse(window.localStorage.userInfo).userId,
        'receivingPhone': addressMang.linkTel,
        'receivingName': addressMang.consignee,
        'receivingAddress': addressMang.detailAddress
      };

      if (addressItemInfo.stateTitleName !== 'ADD_NEW_ADDRESS') {
        addressParam.id = addressItemInfo.id;
      }
      bjgasPopup.showLoading('加载中...');
      addressManagerServ.addOrUpdateAddress(successData, errorData, finallData, addressParam);
    }
  }
})();

(function() {
  'use strict';
  angular.module('northGas.shoppingCart')
    .controller('AddressListCtl', AddressListCtl);

  /* @ngInject */
  function AddressListCtl($scope, $state, addressManagerServ, bjgasPopup, bjgasBackdrop, $ionicHistory) {
    var addressList = this;

    addressList.showLoading = false;
    addressList.selectAddress = selectAddress; //设置当前收货地址
    addressList.setDefaultAddress = setDefaultAddress; //设置默认收货地址
    addressList.updateAddress = updateAddress; //更新地址
    addressList.delAddress = delAddress; //删除地址
    addressList.addNewAddress = addNewAddress; //新建地址

    $scope.$on('$ionicView.beforeEnter', function() {
      bjgasPopup.showLoading('加载中...');
      addressManagerServ.getAddressList(successData, errorData, finallData);
    });

    /**
     * @description: 数据请求--各种状态回调处理函数
     * @method 1: successData
     * @method 2: errorData
     * @method 3: finallData
     */
    function successData(res) {
      try {
        if (res.message === '设为默认成功' && res.success) {
          bjgasPopup.showPopup(res.message);
          bjgasPopup.showLoading('加载中...');
          addressManagerServ.getAddressList(successData, errorData, finallData);
          return;
        }
        if (res.message === '成功删除' && res.success) {

          if (ionic.Platform.isWebView()) {
            bjgasPopup.confirm(res.message, function(buttonIndex) {
              if (buttonIndex === 1) { //确认按钮
                bjgasPopup.showLoading('加载中...');
                addressManagerServ.getAddressList(successData, errorData, finallData);
              } else { //取消按钮
                return;
              }
            });
          } else {
            bjgasPopup.showPopup(res.message);
            bjgasPopup.showLoading('加载中...');
            addressManagerServ.getAddressList(successData, errorData, finallData);
          }
          return;
        }
        if (res && res.rows && res.rows.length >= 0) {
          addressList.addressListInfo = [];
          addressList.addressListInfo = res.rows;
        }
      } catch (e) {
        bjgasPopup.hideLoading();
      } finally {}
    }

    function errorData() { //处理失败回调
      bjgasPopup.hideLoading();
    }

    function finallData() { //最终状态综合管理
      addressList.showLoading = false;
      bjgasPopup.hideLoading();
    }

    function selectAddress(newItemAddress, event) {
      addressManagerServ.setSelectAddressItem(newItemAddress);
      $ionicHistory.goBack();
    }

    function setDefaultAddress(addressId, event) {
      bjgasPopup.showLoading('加载中...');
      addressManagerServ.setDefaultAddress(successData, errorData, finallData, {
        'id': addressId,
        'userId': JSON.parse(window.localStorage.userInfo).userId,
        'isDefault': 'Y'
      });
    }

    function updateAddress(itemAddressInfo, event) {
      var statename = $state.current.name;
      if (statename === 'tab.addressListFromMine') {
        $state.go('tab.addressManagerFromMine', {
          'actionName': itemAddressInfo
        });
      } else if (statename === 'tab.addressList') {
        $state.go('tab.addressManager', {
          'actionName': itemAddressInfo
        });
      }
    }

    function delAddress(addressId, event) {
      bjgasPopup.showLoading('删除中...');
      addressManagerServ.delAddress(successData, errorData, finallData, {
        'id': addressId,
      });
    }

    function addNewAddress() {
      var statename = $state.current.name;
      if (statename === 'tab.addressListFromMine') {
        $state.go('tab.addressManagerFromMine', {
          'actionName': {
            stateTitleName: 'ADD_NEW_ADDRESS'
          }
        });
      } else if (statename === 'tab.addressList') {
        $state.go('tab.addressManager', {
          'actionName': {
            stateTitleName: 'ADD_NEW_ADDRESS'
          }
        });
      }
    }
  }
})();

;
(function() {
  'use strict';
  angular.module('northGas').
  factory('addressManagerServ', addressManagerServ);

  /* @ngInject */
  function addressManagerServ(baseConfig, bjgasHttp, bjgasPopup) {
    var receivingAddressUrl = baseConfig.basePath + 'i/api/receiving/queryByUerId?userId=' + JSON.parse(window.localStorage.userInfo).userId; //收货地址查询--列表
    var addOrUpdateAddressUrl = baseConfig.basePath + 'i/api/receiving/addOrUpdate'; //新增或更新收货地址
    var updateDefaultAddressUrl = baseConfig.basePath + 'i/api/receiving/updateDefault'; //设为默认地址
    var delAddressUrl = baseConfig.basePath + 'i/api/receiving/del'; //新增或更新收货地址
    var addressItem = {
      'id': 'init_address',
      'receivingPhone': '',
      'receivingName': '',
      'receivingAddress': '',
      'isDefault': 'N'
    }; //存储选中的地址

    var inovoiceItem = {
      'isInvoice': 'N',
      'invoiceType': '',
      'invoiceTitle': ''
    }; //存储选中的发票类型信息
    /**
     * @ngdoc method
     * @name addressManagerServ
     * @description 操作收货地址管理接口集合,暴露六个接口出去
     * @param {function} 加载成功后的回调.
     * @param {function} 加载失败后的回调.
     * @param {function} 加载最终执行的回调.
     * @param {object}  post请求需要传入的参数.
     */

    var addressManager = {
      getAddressList: getAddressList,
      addOrUpdateAddress: addOrUpdateAddress,
      setDefaultAddress: setDefaultAddress,
      delAddress: delAddress,
      setSelectAddressItem: setSelectAddressItem,
      getSelectAddressItem: getSelectAddressItem,
      setSelectInvoiceItem: setSelectInvoiceItem,
      getSelectInvoiceItem: getSelectInvoiceItem
    };

    var getData = function(dealSuccess, dealError, dealFinally, url, params) {
      if (typeof dealSuccess === 'function' &&
        typeof dealError === 'function' && typeof dealFinally === 'function') {
        bjgasHttp.post(url, params).success(function(res) {
          return dealSuccess(res);
        }).error(function(err) {
          return dealError();
        }).finally(function() {
          bjgasPopup.hideLoading();
          return dealFinally();
        });
      }
    };

    function getAddressList(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, receivingAddressUrl, params);
    }

    function addOrUpdateAddress(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, addOrUpdateAddressUrl, params);
    }

    function setDefaultAddress(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, updateDefaultAddressUrl, params);
    }

    function delAddress(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, delAddressUrl, params);
    }

    function setSelectAddressItem(address) {
      addressItem = address;
    }

    function getSelectAddressItem() {
      return addressItem;
    }

    function setSelectInvoiceItem(inovice) {
      inovoiceItem = inovice;
    }

    function getSelectInvoiceItem() {
      return inovoiceItem;
    }

    return addressManager;
  }
}());

;(function () {
  angular.module("northGas")
    .config(initCustomServiceChatRoute);

  /* @ngInject */
  function initCustomServiceChatRoute($stateProvider) {
    $stateProvider
      .state('tab.customServiceChat', {
        url: '/customServiceChat',
        params: {title: ''},
        views: {
          'tab-mine': {
            templateUrl: 'pages/store/custom-service/chat.html',
            controller: 'CSChatCtrl',
            controllerAs: 'CSChat'
          }
        }
      });
  }
}());

;(function () {
  angular.module('northGas.mine')
    .controller('CSChatCtrl', CSChatCtrl);

  function CSChatCtrl($scope, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $timeout, bjgasHttp, bjgasPopup, baseConfig) {
    (baseConfig.debug && console.log('CSChatCtrl'));

    var CSChat = this;

    CSChat.title = $stateParams.title.meaning;

    CSChat.input = {
      msg: ''
    };

    CSChat.screenWidth = {
      "width": (window.screen.width - 80) + 'px'
    };

    __onChatFocus = function () {
      (baseConfig.debug && console.log('focus'));
      $timeout(function(){
        $ionicScrollDelegate.resize();
        $timeout(function () {
          $ionicScrollDelegate.scrollBottom(true);
        }, 100);
      }, 500);
    }
    __onChatBlur = function () {
      (baseConfig.debug && console.log('blur'));
      $timeout(function(){
        $ionicScrollDelegate.resize();
        $timeout(function () {
          $ionicScrollDelegate.scrollBottom(true);
        }, 100);
      }, 500);
    }

    var pageSize = 10;
    var page = 1;
    CSChat.list = [];

    function onChatHistory(resp) {
      if(resp.success){
        CSChat.list = resp.rows;
        if(page === 1){
          $timeout(function(){
            $ionicScrollDelegate.scrollBottom(true);
          }, 300);
        }
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }

    CSChat.getChatHistory = function() {
      (baseConfig.debug && console.log(JSON.parse(window.localStorage.userInfo).userId));
      var id = JSON.parse(window.localStorage.userInfo).userId;
      var url = baseConfig.basePath + 'i/api/service/getHistory';
      var param = {
        pageSize: pageSize,
        page: page,
        userId: id,
        serviceType: $stateParams.title.value
      };
      bjgasPopup.showLoadingWithoutBackdrop('加载中');
      bjgasHttp.post(url, param)
      .success(function(resp) {
        if(page !== 1){
          resp.rows = resp.rows.concat(CSChat.list);
          onChatHistory(resp);
        } else {
          onChatHistory(resp);
        }
        page = page + 1;
      })
      .error(function (resp) {
        bjgasPopup.showPopup('请求聊天信息失败');
      })
      .finally(function(){
        $scope.$broadcast('scroll.refreshComplete')
        $scope.$broadcast('scroll.infiniteScrollComplete');
        bjgasPopup.hideLoading();
      });
    };

    function onSendMsg(resp) {
      var x = $('#chat_input').eq(0)[0].textContent;
      if(resp.success){
        (baseConfig.debug && console.log('insert'));
        CSChat.list[CSChat.list.length] = {
          userOrCus: "user",
          question: x
        };
        $('#chat_input').eq(0)[0].textContent = '';
        $ionicScrollDelegate.scrollBottom(true);
      }
      (baseConfig.debug && console.log(CSChat.list));
    }
    CSChat.sendMsg = function() {
      (baseConfig.debug && console.log(JSON.parse(window.localStorage.userInfo).userId));
      var id = JSON.parse(window.localStorage.userInfo).userId;
      var url = baseConfig.basePath + 'i/api/service/question';
      var param = {
        question: $('#chat_input').eq(0)[0].textContent,
        userId: id,
        serviceType: $stateParams.title.value
      };
      // 这个div模拟的input行为比较古怪，初始化的时候是个长度为9的字符串，第一个为换行符(10)，后8个为空格
      // 当输入1个汉字或者字符时，这个汉字是头插到初始字符串中（第一个为所输入，第二个为换行符，后8个为空格）
      // 当输入两个时，字符串即为所见
      // 当任何时候进行退格时，字符串也为所见
      if(param.question.charCodeAt(0) != '10' && param.question.length !== 0){
        bjgasPopup.showLoadingWithoutBackdrop('发送中');
        bjgasHttp.post(url, param)
        .success(function(resp) {
          (baseConfig.debug && console.log(resp));
          onSendMsg(resp);
        })
        .error(function (resp) {
          bjgasPopup.showPopup('请求发送聊天信息失败');
        })
        .finally(function(){
          bjgasPopup.hideLoading();
        });
      } else {
        bjgasPopup.showPopup('请输入聊天信息');
      }
    }

    $scope.$on('$ionicView.afterEnter', function(){
      CSChat.getChatHistory();
    });

    CSChat.prePage = function () {
      $ionicHistory.goBack();
    };
  }
}());

;(function () {
  angular.module("northGas")
    .config(initCustomServiceRoute);

  /* @ngInject */
  function initCustomServiceRoute($stateProvider) {
    $stateProvider
      .state('tab.customServiceList', {
        url: '/customServiceList',
        views: {
          'tab-mine': {
            templateUrl: 'pages/store/custom-service/list.html',
            controller: 'CSListCtrl',
            controllerAs: 'CSList'
          }
        }
      });
  }
}());

;(function () {
  angular.module('northGas.mine')
    .controller('CSListCtrl', CSListCtrl);

  function CSListCtrl($scope, $state, $ionicHistory, $timeout, bjgasHttp, bjgasPopup, baseConfig) {
    (baseConfig.debug && console.log('CSListCtrl'));

    var CSList = this;

    CSList.list = [];

    var inited = false;

    CSList.onClick = function (param) {
      $state.go('tab.customServiceChat', {title: param});
      (baseConfig.debug && console.log(param));
    }

    function onChatTypeList(resp) {
      if(resp.success){
        inited = true;
        CSList.list = resp.rows;
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }

    $scope.$on('$ionicView.afterEnter',function () {
      if(!inited){
        var url = baseConfig.basePath + 'c/api/codeValueList/Official_Customer_Service';
        bjgasPopup.showLoadingWithoutBackdrop('加载中');
        bjgasHttp.get(url)
        .success(function(resp) {
          onChatTypeList(resp);
        })
        .error(function (resp) {
          bjgasPopup.showPopup('请求客服列表失败');
        })
        .finally(function () {
          bjgasPopup.hideLoading();
        });
      }
    });

    CSList.prePage = function () {
      $ionicHistory.goBack();
    };
  }
}());

;
(function() {
  'use strict';
  angular.module('northGas')
    .config(initGoodsPart);

  /* @ngInject */
  function initGoodsPart($stateProvider) {
    $stateProvider
      .state('tab.goodsList', {
        url: '/classify/goodsList',
        params: {
          'classId': ''
        },
        views: {
          'tab-classify': {
            templateUrl: 'pages/store/goods/list.html',
            controller: 'GoodsListCtl',
            controllerAs: 'goodsList'
          }
        }
      })
      .state('tab.goodsListFromStore', {
        url: '/store/goodsList',
        params: {
          'classId': ''
        },
        views: {
          'tab-store': {
            templateUrl: 'pages/store/goods/list.html',
            controller: 'GoodsListCtl',
            controllerAs: 'goodsList'
          }
        }
      })
      .state('tab.goodsCommentListFromStore', {
        url: '/store/goodsList/goodsCommentList',
        params: {
          'commodityId': ''
        },
        views: {
          'tab-store': {
            templateUrl: 'pages/store/goods/comment-list.html',
            controller: 'CommentListCommodityCtl',
            controllerAs: 'goodsCommentList'
          }
        }
      })
      .state('tab.goodsCommentList', {
        url: '/classify/goodsList/goodsCommentList',
        params: {
          'commodityId': ''
        },
        views: {
          'tab-classify': {
            templateUrl: 'pages/store/goods/comment-list.html',
            controller: 'CommentListCommodityCtl',
            controllerAs: 'goodsCommentList'
          }
        }
      })
      .state('tab.goodsDetail', {
        url: '/classify/goodsList/goodsDetail',
        params: {
          'commodityId': ''
        },
        views: {
          'tab-classify': {
            templateUrl: 'pages/store/goods/detail.html',
            controller: 'GoodsDetailCtl',
            controllerAs: 'goodsDetail'
          }
        }
      })
      .state('tab.goodsDetailFromStore', {
        url: '/store/goodsDetail',
        params: {
          'commodityId': ''
        },
        views: {
          'tab-store': {
            templateUrl: 'pages/store/goods/detail.html',
            controller: 'GoodsDetailCtl',
            controllerAs: 'goodsDetail'
          }
        }
      })
      .state('tab.goodsDetailFromShopCart', {
        url: '/shoppingCart/goodsDetail',
        params: {
          'commodityId': ''
        },
        views: {
          'tab-shopping-cart': {
            templateUrl: 'pages/store/goods/detail.html',
            controller: 'GoodsDetailCtl',
            controllerAs: 'goodsDetail'
          }
        }
      })
      .state('tab.goShoppingCartFromClassify', {
        url: '/classify/shoppingCart',
        params: {'viewName':'FROM_STORE'},
        views: {
          'tab-classify': {
            templateUrl: 'pages/shopping-cart/tab-shopping-cart.html',
            controller: 'ShoppingCartCtrl',
            controllerAs: 'shopCart'
          }
        }
      });
  }
}());

;
(function() {
  'use strict';
  angular.module('northGas.store')
    .controller('CommentListCommodityCtl', CommentListCommodityCtl);

  /* @ngInject */
  function CommentListCommodityCtl($scope, baseConfig, $state, bjgasPopup, bjgasHttp, $stateParams) {
    var goodsCommentList = this;
    var url = baseConfig.basePath + 'c/api/showEva';
    var commentListParams = {
      'commodityId': $stateParams.commodityId,
      'page': 1,
      'pagesize': 100
    };
    goodsCommentList.goodsCommentListInfo = {};
    goodsCommentList.commentsStar = []; //总评论星星装载容器
    goodsCommentList.commentListStar = []; //评论列表星星装载容器
    window.StatusBar && StatusBar.styleDefault();

    bjgasPopup.showLoadingWithoutBackdrop('加载中...');
    bjgasHttp.post(url, commentListParams).success(function(response) {
      goodsCommentList.goodsCommentListInfo = response.rows[0];
      if(goodsCommentList.goodsCommentListInfo.rank == 0) {
        goodsCommentList.goodsCommentListInfo.rank =5;
      }
      if (Math.ceil(goodsCommentList.goodsCommentListInfo.rank) > goodsCommentList.goodsCommentListInfo.rank) {
        goodsCommentList.showHalfStar = true;
      }
      goodsCommentList.commentsStar = new Array(Math.floor(goodsCommentList.goodsCommentListInfo.rank));
      angular.forEach(goodsCommentList.goodsCommentListInfo.list, function(item, index) {
        item.satifiedRank = Math.floor(item.satifiedRank);
        goodsCommentList.commentListStar[index] = new Array(item.satifiedRank);
      });
    }).error(function(response, status) {}).finally(function() {
      bjgasPopup.hideLoading();
    });
  }
}());

;
(function() {
  'use strict';
  angular.module('northGas.store')
    .controller('GoodsDetailCtl', GoodsDetailCtl);

  /* @ngInject */
  function GoodsDetailCtl($scope, baseConfig, $stateParams, goodsServ, $ionicSlideBoxDelegate, $state, shoppingCartManagerServ, LoginService, bjgasPopup, $ionicModal) {
    var goodsDetail = this;
    var goodsDetailUrl = baseConfig.basePath + 'c/api/getCommodityById/' + $stateParams.commodityId;
    // for develop test url
    // var goodsDetailUrl = baseConfig.basePath + 'c/api/getCommodityById/8b2e1f3d-7297-49a6-9289-60a318b16604';
    goodsDetail.slideIndex = 0; //默认显示第一张图片
    goodsDetail.showSvgLoading = true;
    goodsDetail.showHalfStar = false; //默认不显示半颗星
    goodsDetail.goodsListInfo = {}; //存储详情的对象容器
    goodsDetail.commentsStar = []; //总评论星星装载容器
    goodsDetail.commentListStar = []; //评论列表星星装载容器
    goodsDetail.toCarouselModal = toCarouselModal; //去轮播图放大modal
    goodsDetail.toComment = toComment; //去评论列表
    goodsDetail.goShoppingCart = goShoppingCart; //去购物车界面
    goodsDetail.addShoppingCart = addShoppingCart; //添加到购物车
    goodsDetail.immediateBuy = immediateBuy; //立即购买

    goodsDetail.goodsDetailHeader = {
      'marginBottom': '47px'
    };
    goodsDetail.serveSection = {
      'width': window.screen.width + 'px'
    };

    window.StatusBar && StatusBar.styleDefault();
    (function() {
      goodsServ.getGoodsDetail(successData, errorData, finallData, goodsDetailUrl);
    }());

    /**
     * @description: 数据请求--各种状态回调处理函数
     * @method 1: successData
     * @method 2: errorData
     * @method 3: finallData
     */
    function successData(res) {
      try {
        if (res.message === '添加购物车成功' && res.success) {
          bjgasPopup.showPopup(res.message);
          return;
        }
        if (res && res.rows && res.rows.length >= 0) {
          goodsDetail.goodsListInfo = res.rows[0];
          if(goodsDetail.goodsListInfo.rank == 0) {
            goodsDetail.goodsListInfo.rank =5;
          }
          if (Math.ceil(goodsDetail.goodsListInfo.rank) > goodsDetail.goodsListInfo.rank) {
            goodsDetail.showHalfStar = true;
          }
          goodsDetail.commentsStar = new Array(Math.floor(goodsDetail.goodsListInfo.rank));
          angular.forEach(goodsDetail.goodsListInfo.evaList, function(item, index) {
            item.satifiedRank = Math.floor(item.satifiedRank);
            goodsDetail.commentListStar[index] = new Array(item.satifiedRank);
          });
          $ionicSlideBoxDelegate.update(); //用于刷新box
          $ionicSlideBoxDelegate.loop(true);
        }
      } catch (e) {} finally {}
    }

    function errorData(res) { //处理失败回调
      try {
        bjgasPopup.showPopup(res.message);
      } catch (e) {}
    }

    function finallData() { //最终状态综合管理
      goodsDetail.showSvgLoading = false;
      bjgasPopup.hideLoading();
    }

    //显示carousel大图--方法区
    goodsDetail.closeModal = function() {
      goodsDetail.modalCarousel.hide();
      goodsDetail.modalCarousel.remove();
    };

    goodsDetail.slideChanged = function(index) {
      goodsDetail.slideIndex = index;
    };

    function toCarouselModal(index) {
      goodsDetail.photoHight = {
        "height": window.screen.height + "px"
      };
      goodsDetail.activeSlide = index;
      $ionicModal.fromTemplateUrl('pages/store/goods/detail-commodity-modal.html', {
        scope: $scope
      }).then(function(modal) {
        goodsDetail.modalCarousel = modal;
        goodsDetail.modalCarousel.show();
      });
    }

    function toComment(id){
      $state.go('tab.goodsCommentList', {
        'commodityId': id
      });
    }

    function onSuccessLogin(flag) {
      $state.go('tab.goShoppingCartFromClassify');
    }

    function onHideLogin() {}

    function goShoppingCart() {
      if (!LoginService.isLogin()) {
        LoginService.showLogin({
          onSuccess: onSuccessLogin,
          onHide: onHideLogin,
        });
      } else {
        $state.go('tab.goShoppingCartFromClassify');
      }
    }

    function addShoppingCart(id) {
      if (!LoginService.isLogin()) {
        LoginService.showLogin();
      } else {
        bjgasPopup.showLoading('添加中...');
        shoppingCartManagerServ.addToShoppingCart(successData, errorData, finallData, {
          'userId': JSON.parse(window.localStorage.userInfo).userId,
          'commodityId': id
        });
      }
    }

    function immediateBuy() {
      if (!LoginService.isLogin()) {
        LoginService.showLogin();
      } else {
        if('tab.goodsDetail' === $state.current.name){
          $state.go('tab.accessOrderFromClassify', {
            'ordersAboutInfo': {
              'cartIds': [],
              'commodityId':goodsDetail.goodsListInfo.id,
              'totalPrice': goodsDetail.goodsListInfo.commodityPrice,
              'totalCount': '1'
            }
          });
        } else if('tab.goodsDetailFromShopCart' === $state.current.name){
          $state.go('tab.accessOrder', {
            'ordersAboutInfo': {
              'cartIds': [],
              'commodityId':goodsDetail.goodsListInfo.id,
              'totalPrice': goodsDetail.goodsListInfo.commodityPrice,
              'totalCount': '1'
            }
          });
        } else if ('tab.goodsDetailFromStore' === $state.current.name) {
          $state.go('tab.accessOrderFromStore', {
            'ordersAboutInfo': {
              'cartIds': [],
              'commodityId':goodsDetail.goodsListInfo.id,
              'totalPrice': goodsDetail.goodsListInfo.commodityPrice,
              'totalCount': '1'
            }
          });
        }

        console.log($state.current.name);

      }
    }
  }
}());

;
(function() {
  'use strict';
  angular.module('base.config').
  factory('goodsServ', goodsServ);

  /* @ngInject */
  function goodsServ(baseConfig, bjgasHttp, bjgasPopup) {
    var goodsListUrl = baseConfig.basePath + 'c/api/queryCommodity'; //列表
    var goodsStoreUrl = baseConfig.basePath + 'c/api/getMallHomeInfo'; //商城

    /**
     * @ngdoc method
     * @name goodsSer
     * @description 获取商品数据接口集合,暴露三个接口出去
     * @param {function} 加载成功后的回调.
     * @param {function} 加载失败后的回调.
     * @param {function} 加载最终执行的回调.
     * @param {object|string|undefined}  post请求需要传入的参数.
    */

    var goodsList = {
      getGoodsList: getGoodsList,
      getStoreInfo: getIndexStoreInfo,
      getGoodsDetail: getGoodsDetail
    };

    var getData = function(dealSuccess, dealError, dealFinally, url, params) {
      if (typeof dealSuccess === 'function' &&
        typeof dealError === 'function' && typeof dealFinally === 'function') {
        bjgasHttp.postNoToken(url, params).success(function(res) {
          return dealSuccess(res);
        }).error(function(err) {
          return dealError();
        }).finally(function() {
          bjgasPopup.hideLoading();
          return dealFinally();
        });
      }
    };

    function getGoodsList(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, goodsListUrl, params);
    }

    function getIndexStoreInfo(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, goodsStoreUrl, params);
    }

    function getGoodsDetail(dealSuccess, dealError, dealFinally, goodsDetailUrl, params) {
      getData(dealSuccess, dealError, dealFinally, goodsDetailUrl, params);
    }

    return goodsList;
  }
}());

;
(function() {
  'use strict';
  angular.module('northGas.store')
    .controller('GoodsListCtl', GoodsListCtl);

  /* @ngInject */
  function GoodsListCtl($scope, $rootScope, $state, bjgasBackdrop, goodsServ, $stateParams, $timeout) {
    var goodsList = this;
    // 筛选条目数组
    var stateNameArray = ['sales', 'comment', 'price', 'screen'];
    var goodsListParams = { //商品列表参数--默认按销售量降续排列查询
      'page': 1,
      'pageSize': 100,
      'bigClassId': '',
      'smallClassId': $stateParams.classId,
      'commodityName': '',
      'minPrice': '',
      'maxPrice': '',
      'sortObject': 'sale',
      'sortRule': 'desc' //默认销量按降续排列
    };
    var screenBackdropFlag = false; //筛选空白处遮罩点击释放标记
    window.StatusBar && StatusBar.styleDefault();
    goodsList.commentListStar = []; //商品列表星星装载容器
    goodsList.keyGen = ''; //搜索关键字初始为空
    goodsList.stateArray = []; //选中状态管理map对象
    goodsList.stateArray['sales'] = true; //默认显示按销量排序
    goodsList.screenSelect = false; //筛选 选中颜色flag
    goodsList.priceUp = false; //默认第一次点击价格时 按升续排列
    goodsList.showLoading = true; //默认显示loading svg 图标
    goodsList.showNoMessageImg = false; //默认不显示无数据图片
    goodsList.showHalfStar = false; //默认不显示半颗星
    goodsList.goMessagePage = goMessagePage; //去消息界面
    goodsList.changeKeyInput = changeKeyInput; //头部输入框响应方法
    goodsList.upRefresh = upRefresh; //上拉刷新
    goodsList.sales = sales; //销量排序
    goodsList.comment = comment; //评价排序
    goodsList.price = price; //价格排序
    goodsList.screen = screen; //筛选排序
    goodsList.reset = reset; //重置价格区间
    goodsList.affirm = affirm; //确认 -- 按钮
    goodsList.toDetail = toDetail; //去商品详情界面
    goodsList.goodsListInfo = []; //存储商品列表数据

    $timeout(function() { //适当延迟一下
      if (ionic.Platform.isIOS()) { //兼容ios高度
        $(".filter-head").css({
          'marginTop': '64px'
        });
        $("#goodsListHeader").css({
          'top': '110px!important'
        });
      } else {}
    }, 0);

    var styleBackdrop = {
      'top': '197px', //筛选框的高度
      'backgroundColor': 'rgba(0, 0, 0, 0.2)',
      'webkitTransition': 'none',
      'transition': 'none'
    };
    if (ionic.Platform.isIOS()) {
      styleBackdrop.top = '217px';
    }

    $scope.$on('$ionicView.beforeEnter', function() { //修改 global backdrop的样式设置
      bjgasBackdrop.setCss(styleBackdrop);
      bjgasBackdrop.enableClick(true);
      goodsServ.getGoodsList(successData, errorData, finallData, goodsListParams);
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      // bjgasBackdrop.release('noBroadcast');
    });

    var stateManager = function(name) { // 选中颜色状态管理集合
      angular.forEach(stateNameArray, function(val, key) {
        if (val !== name) {
          goodsList.stateArray[val] = false;
        }
      });
      if (goodsList.stateArray[name] === undefined) {
        goodsList.stateArray[name] = false;
      }

      if (name !== 'screen') {
        goodsList.stateArray[name] = true;
        goodsList.screenSelect = false;
        bjgasBackdrop.release('noBroadcast');
      } else {
        goodsList.stateArray[name] = !goodsList.stateArray[name];
      }
      if (name !== 'price') {
        goodsList.stateArray['price_up'] = false;
      }
    };

    /**
     * @description: 数据请求--各种状态回调处理函数
     * @method 1: successData
     * @method 2: errorData
     * @method 3: finallData
     */
    function successData(res) {
      try {
        if (res && res.rows && res.rows.length >= 0) {
          goodsList.goodsListInfo = [];
          goodsList.goodsListInfo = res.rows;
          angular.forEach(goodsList.goodsListInfo, function(item, index) {
            if (Math.ceil(item.rank) > item.rank) { //判断有没有半颗星
              goodsList.showHalfStar = true;
            }
            item.rank = Math.floor(item.rank);
            if (item.rank == 0) { //判断为0条评价的时候显示5颗星
              item.rank = 5;
            }
            goodsList.commentListStar[index] = new Array(item.rank);
          });
        }
      } catch (e) {} finally {}
    }

    function errorData() { //处理失败回调
    }

    function finallData() { //最终状态综合管理
      goodsList.showLoading = false;
      if (goodsList.goodsListInfo.length === 0) {
        goodsList.showNoMessageImg = true;
      }
    }

    function goMessagePage() { // 去消息界面
      // $state.go('');
    }

    function changeKeyInput() { //搜索输入框
      goodsList.showLoading = true;
      goodsListParams.commodityName = goodsList.keyGen;
      goodsServ.getGoodsList(successData, errorData, finallData, goodsListParams);
    }

    function upRefresh() { //上拉刷新响应

    }

    function sales() { // 按销量降续排序
      if (goodsList.stateArray['sales']) { // 当条件选中之后再次点击不请求serve
        goodsList.showLoading = false;
      } else {
        goodsList.showLoading = true;
        goodsListParams.sortObject = 'sale';
        goodsListParams.sortRule = 'desc';
        goodsServ.getGoodsList(successData, errorData, finallData, goodsListParams);
      }
      stateManager('sales');
    }

    function comment() { // 按评论排序
      if (goodsList.stateArray['comment']) { // 当条件选中之后再次点击不请求serve
        goodsList.showLoading = false;
      } else {
        goodsList.showLoading = true;
        goodsListParams.sortObject = 'evaluation';
        goodsListParams.sortRule = 'desc';
        goodsServ.getGoodsList(successData, errorData, finallData, goodsListParams);
      }
      stateManager('comment');
    }

    function price() { // 按价格排序
      stateManager('price');
      goodsList.stateArray['price_up'] = !goodsList.stateArray['price_up'];
      goodsListParams.sortObject = 'price';
      goodsList.showLoading = true;
      if (goodsList.stateArray['price_up']) { //商品按价格升续排列
        goodsListParams.sortRule = 'asc';
        goodsServ.getGoodsList(successData, errorData, finallData, goodsListParams);
      } else { //商品按价格降续排列
        goodsListParams.sortRule = 'desc';
        goodsServ.getGoodsList(successData, errorData, finallData, goodsListParams);
      }
    }

    function screen() { // 弹出按价格区间的筛选框
      stateManager('screen');
      goodsList.screenSelect = !goodsList.screenSelect;
      if (goodsList.screenSelect) {
        bjgasBackdrop.retain();
      } else {
        bjgasBackdrop.release('noBroadcast');
      }
    }

    $scope.$on('backdrop.hidden', function() { //监听 drop 点击消失
      try {
        $scope.$apply(function() {
          stateManager('screen');
          goodsList.screenSelect = !goodsList.screenSelect;
        });
      } catch (e) {}

    });

    function reset() { //重置按钮响应方法
      goodsList.lowest = '';
      goodsList.highest = '';
    }

    function affirm() { //确认按钮响应方法
      goodsList.showLoading = true;
      goodsListParams.minPrice = goodsList.lowest;
      goodsListParams.maxPrice = goodsList.highest;
      goodsServ.getGoodsList(successData, errorData, finallData, goodsListParams);
      reset();
      screen();
    }

    function toDetail(commodityId) {
      if ($state.current.name === 'tab.goodsListFromStore') {
        $state.go('tab.goodsDetailFromStore', {
          'commodityId': commodityId
        });
      } else {
        $state.go('tab.goodsDetail', {
          'commodityId': commodityId
        });
      }
    }
  }
}());

;
(function() {
  'use strict';
  angular.module('northGas')
    .config(initCommonCommoditySearch);

  /* @ngInject */
  function initCommonCommoditySearch($stateProvider) {
    $stateProvider
      .state('tab.storeCommodityCommonSearch', {
        url: '/store/storeCommoditySearch',
        views: {
          'tab-store': {
            templateUrl: 'pages/store/search/commodity-search.html',
            controller: 'StoreCommodityCtl',
            controllerAs: 'storeComSearch'
          }
        }
      });
  }
}());

(function() {
  'use strict';
  angular.module('northGas.store')
    .controller('StoreCommodityCtl', StoreCommodityCtl);

  /* @ngInject */
  function StoreCommodityCtl($scope, baseConfig, goodsServ, $ionicSlideBoxDelegate, $state, $ionicScrollDelegate, $timeout) {
    var storeComSearch = this;
    var item = document.getElementById('employeeInputSearch');

    storeComSearch.getValue = ''; //绑定关键字输入
    storeComSearch.showCloseIcon = false; //默认不显示清楚输入icon
    storeComSearch.onHold = onHold; //长按事件
    storeComSearch.delItemsArray = [false, false, false]; //删除容器
    storeComSearch.goCommodityList = goCommodityList; //输入框失去焦点
    storeComSearch.inputChange = inputChange; //输入框改变内容响应事件
    storeComSearch.clearInputContent = clearInputContent; //清除输入框内容
    storeComSearch.delItem = delItem; //删除每一条
    storeComSearch.delAll = delAll; //删除全部

    $scope.$on('$ionicView.afterEnter', function() { //初始化input框-自动聚焦
      if (ionic.Platform.isWebView()) {
        cordova.plugins.Keyboard.show();
        $timeout(function() {
          item.focus();
          $scope.$apply();
        }, 0);
      }
    });

    function onHold(index) {
      storeComSearch.delItemsArray[index] = true;
    }

    function goCommodityList() {
      // $state.go();
    }

    function inputChange() {
      if (storeComSearch.getValue === '') {
        storeComSearch.showCloseIcon = false;
      } else {
        storeComSearch.showCloseIcon = true;
      }
    }

    function clearInputContent() {
      storeComSearch.getValue = '';
      storeComSearch.showCloseIcon = false;
      if (ionic.Platform.isWebView()) {
        cordova.plugins.Keyboard.show();
        $timeout(function() {
          item.focus();
          $scope.$apply();
        }, 0);
      }
    }

    function delItem(index) {
      storeComSearch.delItemsArray[index] = false;
    }

    function delAll() {

    }

  }
})();

;(function () {
  angular.module("northGas")
    .config(initHeatingRoute);

  /* @ngInject */
  function initHeatingRoute($stateProvider) {
    $stateProvider
      .state('tab.heating', {
        url: '/heating',
        params: {
          "number": '123456',
          "subNumber": '789'
        },
        views: {
          'tab-gas': {
            templateUrl: 'pages/gas/self-readding/heating-allowance/heating.html',
            controller: 'HeatingCtrl',
            controllerAs: 'Heating'
          }
        }
      });
  }
}());

;(function () {
  angular.module('northGas.mine')
    .controller('HeatingCtrl', HeatingCtrl);

  function HeatingCtrl($scope, $state, $stateParams, $ionicHistory, $timeout, $http, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, $ionicModal, switchUser, bjgasPopup, baseConfig) {
    (baseConfig.debug && console.log('HeatingCtrl'));

    var Heating = this;

    var preNumber = $stateParams.number;

    Heating.title = $stateParams.title;
    var meterShowing = false;
    Heating.currentCol = 0;
    /////////////////////////////////////////////////////////////
    // 拨盘插件最多能拨动的列数不受限，但是会拥挤；简单测试iPhone5下9列为不拥挤情况下最大列数
    var maxCol = 8;
    // 拨盘图片位数：iPhone4、5最高总和11位，iPhone6最高14位，6plus 15位
    // black表示绿框内数字，hdBlack表示第一位，ftBlack最后一位，bdBlack表示剩余中间位。red类似
    Heating.meterNumber = {
      hdBlack: 1,
      bdBlack: [2,3,4,5,6,7],
      ftBlack: 8,
      hdRed: 1,
      bdRed: [2,3]
    };
    /////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////
    //测试代码
    Heating.logText = '';

    Heating.subLen = 0;
    var initedHeating = false;
    Heating.__changeMaxCol = function (col, defaultValue) {
      defaultValue = defaultValuesTest[col + ''];
      var s = defaultSubValuesTest[col + ''];
      Heating.subLen = s.length;
      initMeter(col, defaultValue, s);
    };
    initMeter(6, $stateParams.number, $stateParams.subNumber);
    Heating.__show = function () {
      show();
    };

    //测试代码end
    /////////////////////////////////////////////////////////////

    ////////////
    //业务代码
    var maxPic = 1;
    Heating.canAdd = true;

    Heating.photos = [{ url: "img/repair/add@3x.png" }];
    Heating.smallPhotosShowFlag = [];
    Heating.smallPhotosSize = ['100% 100%'];
    Heating.showingPhotoIndex = -1;
    Heating.showingPhoto = {
      url: ''
    };
    Heating.photoHight = {};
    Heating.isShowing = false;
    Heating.blobCount = 0;
    Heating.userNumberInfo = {
      label: '',
      userCode: '',
      address: ''
    };
    Heating.inputModal = {
      meterNumber: $stateParams.number,
      meterBalance: '',
      cardBalance: ''
    };

    for (var i = 0; i < maxPic; i++) {
      Heating.smallPhotosShowFlag[i] = true;
    }
    Heating.smallPhotosShowFlag[maxPic] = false;

    var dateNowDefault = new Date();
    Heating.dateNow = {
      data: dateNowDefault.getFullYear() + '-' + (dateNowDefault.getMonth()+1) + '-' + dateNowDefault.getDate()
    }
    function checkDate() {
      var d = new Date(Heating.dateNow.data);
      (baseConfig.debug && console.log(d));
      //不是3.16～4.15
      if((d.getMonth() + 1 === 3 && d.getDate() >= 16) || (d.getMonth() + 1 === 4 && d.getDate() <= 15) || (d.getMonth() + 1 === 10 && d.getDate() >= 15) || (d.getMonth() + 1 === 11 && d.getDate() <= 14)){
        (baseConfig.debug && console.log('日期对'));
        return true;
      }
      return false;
    }

    $ionicModal.fromTemplateUrl('pages/gas/self-readding/heating-allowance/modal-detail-photo-zoom.html', {
      scope: $scope
    }).then(function(modal) {
      Heating.detailModal = modal;
    });
    Heating.showPhoto = function() {
      Heating.isShowing = true;
      Heating.detailModal.show();
    };
    $scope.$on('$destroy', function() {
      Heating.detailModal.remove();
      $timeout.cancel(Heating.timeoutHandle);
    });
    //  select modal

    try {
      var optionsCamera = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 1080,
        targetHeight: 1080,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true
      };
      var optionsAlbum = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 1080,
        targetHeight: 1080,
        popoverOptions: CameraPopoverOptions,
        correctOrientation:true
      };
    } catch (error) {

    }

    var optionsAs = {
      title: '选择照片来源',
      buttonLabels: ['拍照', '相册'],
      addCancelButtonWithLabel: '取消',
      androidEnableCancelButton : true
    };
    var optionsPicker = {
      maximumImagesCount: 1,
      width: 1080,
      height: 1080,
      quality: 100
    };
    function onCameraErrorIOS() {
      if(typeof(cordova.plugins.achieveAuthority) !== 'undefined'){
        cordova.plugins.achieveAuthority.getAuthority();
      }
    }
    Heating.clickPhoto = function(index) {
      if (index === Heating.photos.length - 1) {
        // add photo
        $cordovaActionSheet.show(optionsAs)
          .then(function(btnIndex) {
            var index = btnIndex;
            if (index === 1) {
              navigator.camera.getPicture(function(imageData) {
                Heating.photos.splice(Heating.photos.length - 1, 0, {
                  url: "data:image/jpeg;base64," + imageData,
                  type: "base64"
                });
                Heating.smallPhotosSize.splice(Heating.smallPhotosSize.length - 1, 0, 'cover');
                $timeout(function () {
                  $scope.$apply();
                }, 300);
              }, function(error) {
                // error
                // cordova.plugins.achieveAuthority.getAuthority();
                if(baseConfig.debug){
                  console.log('camera error');
                  console.log(JSON.stringify(error));
                }
                if(ionic.Platform.isIOS()){
                  if(error === 'noAuthorization'){
                    bjgasPopup.confirm('北京燃气需要访问你的相机，以便提供更便捷的燃气服务', function (index) {
                      if(index === 0){

                      } else {
                        onCameraErrorIOS();
                      }
                    }, { cancel: '取消', sure: '去设置'});
                  }
                } else {
                  if(parseInt(error) === 20){
                    bjgasPopup.showPopup('调取相机失败，请尝试设置北京燃气的相机访问权限');
                  } else if(error === "Camera cancelled."){
                    if(baseConfig.debug){
                      console.log('取消相机');
                    }
                  }
                }
              }, optionsCamera);
            } else if(index === 2){
              navigator.camera.getPicture(function(results) {
                Heating.photos.splice(Heating.photos.length - 1, 0, {
                  url: results,
                  type: "uri"
                });
                Heating.smallPhotosSize.splice(Heating.smallPhotosSize.length - 1, 0, 'cover');
                $timeout(function () {
                  $scope.$apply();
                }, 300);
              }, function(error) {
                // error getting photo
                if(baseConfig.debug){
                  console.log('Album error');
                  console.log(JSON.stringify(error));
                }
                if(ionic.Platform.isIOS()){
                  if(error === 'noAuthorization'){
                    bjgasPopup.confirm('北京燃气需要访问你的相册，以便提供更便捷的燃气服务', function (index) {
                      if(index === 0){

                      } else {
                        onCameraErrorIOS();
                      }
                    }, { cancel: '取消', sure: '去设置'});
                  }
                } else {
                  if(error === 'Selection cancelled.'){
                    if(baseConfig.debug){
                      console.log('取消相册');
                    }
                  }
                  // bjgasPopup.showPopup('调取相册失败，请尝试设置北京燃气的相机访问权限');
                }
              }, optionsAlbum);
            }
          });
      } else {
        // show big photo
        Heating.photoHight = {
          "height": window.screen.height - 87 + "px"
        };
        Heating.showingPhotoIndex = index;
        Heating.showingPhoto.url = Heating.photos[index].url;
        Heating.showPhoto();
      }
    };
    Heating.hidePhoto = function() {
      Heating.detailModal.hide();
      Heating.timeoutHandle = $timeout(function() {
        Heating.isShowing = false;
      }, 300);
    };
    Heating.deletePhoto = function() {
      Heating.photos.splice(Heating.showingPhotoIndex, 1);
      Heating.smallPhotosSize.splice(Heating.showingPhotoIndex, 1);
    };

    function onSend(resp) {
      if (resp && typeof(resp.success) !== "undefined") {
        if (resp.success) {
          bjgasPopup.showPopup('采暖补贴申报成功', function(){
            $ionicHistory.goBack();
          });
        } else {
          if(baseConfig.debug){
            console.log(resp);
          }
          bjgasPopup.showPopup((resp.message ? resp.message: '采暖补贴申报失败'));
        }
      } else {
        bjgasPopup.showPopup('数据异常');
      }
    }
    function onBolb(formData){ // send
      Heating.blobCount = Heating.blobCount + 1;
      if(Heating.blobCount >= Heating.photos.length - 1){
        Heating.blobCount = 0;
        (baseConfig.debug && console.log('httping'));
        $http({
          method: 'POST',
          headers: {
            'Content-type': undefined,
            'Authorization': 'Bearer ' + window.localStorage.token
          },
          data: formData,
          url: baseConfig.basePath + 'i/api/heating/subsidies'
        })
        .success(function(resp) {
          if (baseConfig.debug) {
            console.log('success');
          }
          onSend(resp);
        })
        .error(function(resp, states) {
          if (baseConfig.debug) {
            console.log(resp);
          }
          bjgasPopup.showPopup('创建报修单请求错误');
        })
        .finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    }
    Heating.submit = function() {
      if(!checkDate()){
        bjgasPopup.showPopup('当前不在采暖补贴申报时间内');
      } else {
        (baseConfig.debug && console.log('当前在采暖补贴申报时间内~'));
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        var formData = new FormData();
        for (var i in Heating.inputModal) {
          formData.append(i, Heating.inputModal[i]);
        }
        formData.append('uniUserCode', Heating.userNumberInfo.userCode);
        var dateS = '';
        if(dateNowDefault){
          var yS = (dateNowDefault.getMonth() + '');
          if(yS.length === 1){
            yS = '0' + yS;
          }
          var dS = (dateNowDefault.getDate() + '');
          if(dS.length === 1){
            dS = '0' + dS;
          }
          dateS = dateNowDefault.getFullYear() + '-' + yS + '-' + dS;
          dateS = dateS + ' ' + (dateNowDefault.toTimeString().substring(0,8));
        }
        formData.append('rdDate', dateS);

        if(Heating.photos.length > 1){
          for (var i = 0; i < Heating.photos.length - 1; i++){
            convertImgToBase64(Heating.photos[i].url, function (url){
              b64toBlob(url, function (blob){
                formData.append("file", blob, Heating.inputModal.repairName + "-采暖申报-.jpg"); // 文件对象bl
                onBolb(formData);
              });
            }, 1);
          }
        } else {
          onBolb(formData);
        }
      }
    };

    function b64toBlob(b64, onsuccess, onerror) {
      var img = new Image();
      img.onerror = onerror;
      img.onload = function onload() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var width = img.width;
        var height = img.height;
        var ctx = canvas.getContext('2d');
        // 按比例压缩2.5倍
        var big = (img.width > img.height) ? img.width : img.height;
        var rate = 960 / big;
        //ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
        canvas.toBlob(onsuccess);
      };
      img.src = b64;
    }

    function convertImgToBase64(url, callback, r) {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.src = url;
      if (r <= 0) {
        r = 2;
      }
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        var width = img.width;
        var height = img.height;
        // 按比例压缩r倍
        var rate = 1;
        canvas.width = width * rate;
        canvas.height = height * rate;
        ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
        var dataURL = canvas.toDataURL('image/png');
        callback.call(this, dataURL);
        canvas = null;
      };
    }

    Heating.goBack = function() {
      if (baseConfig.debug) {
        console.log('goback');
      }
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.beforeEnter', function(event) {
      Heating.userNumberInfo = switchUser.getUserInfo();
      (baseConfig.debug && console.log(Heating.userNumberInfo));
    });
    ///////////

    /////////////////////////////////////////////////////////////
    // 需要提供 id=picker_heating_holder，display:none;的div。图片拨盘略
    // logic, 封装再议，和业务一个文件了
    /**
       * @ngdoc method
       * @name
       * @description 初始化拨盘拨动元素和拨盘图片，建议传入合法参数`
       * @param {number} 列数.
       * @param {string} 数字字符串，拨盘图片左边那部分，后续可变
       * @param {number} 数字字符串，拨盘图片右边那部分，后续不可变
       */
    function initMeter(col, value, subValue) {
      if(meterShowing === false){
        // 屏蔽默认显示
        // meterShowing = true;
        __initAndShowPicker(col, __canverMeterValue(value, 'string', ' '));
        __showMeterImg(col, __canverMeterValue(value, 'object'));
        __setSubValue(subValue);
        Heating.currentCol = col;//用于遍历改变拨盘图片上文本时的循环依据
      } else {
        meterShowing = false;
        $("#picker_heating").picker("close");
      }
    }
    /**
       * @ngdoc method
       * @name
       * @description 显示/隐藏拨盘
       */
    function show() {
      (baseConfig.debug && console.log($('.taobao-sm').eq(0)));
      if(!$('.taobao-sm').eq(0).length){
        meterShowing = false;
      }
      if($('#picker_heating').length > 0){
        if(!meterShowing){
          meterShowing = true;
          $timeout(function () {
            $("#picker_heating").picker("open");
            $("#picker_heating").picker("setValue", Heating.inputModal.meterNumber);
            $('.taobao-sm').eq(0).css('background', 'white');
            $('.taobao-sm').eq(0).children().eq(0).css('padding', '0');
            $scope.$apply();
          }, 100);
        } else {
          meterShowing = false;
          $("#picker_heating").picker("close");
        }
      } else {
        (baseConfig.debug && console.log('未初始化拨盘，无法显示'));
      }
    }

    /**
       * @ngdoc method
       * @name
       * @description 变化回调，暂时不封装了
       */
    function onChangeCb(code) {
      // your onchange code
      Heating.inputModal.meterNumber = code;
    }

    Heating.prePage = function () {
      $ionicHistory.goBack();
    };
    /////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////
    //private
    //转换文本字符串（隔断字符串或者数组）
    function __canverMeterValue(value, type, joinString) {
      if(!type) type = 'string';
      if(!joinString) joinString = '';
      if(type === 'string'){
        var s = '';
        for (var index = 0; index < value.length; index++) {
          s = s + (index === 0 ? '': joinString) + value[index];
        }
        return s;
      } else if(type === 'object'){
        var l = [];
        for (var index = 0; index < value.length; index++) {
          l[l.length] = value[index];
        }
        return l;
      }
    }
    //返回拨盘图片上的数据（数组或隔断字符串）,
    //在快速滑动并且松手的减速滑动过程中调用，可能并不能返回最终的准确数据，但是，拨盘图片上的(双向绑定)是准确的～。
    function __getMeterValue (type, joinString) {
      if(!type) type = 'string';
      if(!joinString) joinString = '';
      if(type === 'string'){
        var s = '';
        s = s + Heating.meterNumber.hdBlack;
        for (var index = 0; index < Heating.currentCol - 2; index++) {
          s = s + (index === 0 ? '': joinString) + Heating.meterNumber.bdBlack[index];
        }
        s = s + Heating.meterNumber.ftBlack;
        return s;
      } else if(type === 'object'){
        var l = [];
        l[l.length] = Heating.meterNumber.hdBlack;
        for (var index = 0; index < Heating.currentCol - 2; index++) {
          l[l.length] = Heating.meterNumber.bdBlack[index];
        }
        l[l.length] = Heating.meterNumber.ftBlack;
        return l;
      }
    }
    function __meterDataItem () {
      var data = {
        textAlign: 'center',
        values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      };
      return data;
    }
    function __meterData(meterLength) {
      var l = [];
      for (var index = 0; index < (typeof(meterLength) === 'number' && meterLength > 0 ? meterLength: 0); index++) {
        l[l.length] = __meterDataItem();
        if(index === maxCol - 1) return l;
      }
      return l;
    }
    //需要col用于遍历改变拨盘图片上文本时的循环依据
    function __initAndShowPicker(cols, defaultValue) {
      (baseConfig.debug && console.log('__initAndShowPicker defaultValue: ' + defaultValue));
      $("#picker_heating_holder").empty();
      $("#picker_heating_holder").append('<input id="picker_heating" type="text" value="' + defaultValue + '" onchange="bjgas_change_heating_meter()" style="display:none;">');
      $("#picker_heating").picker({
        toolbarTemplate: '<header class="bar bar-nav">' +
        '<button class="button button-link pull-left" style="background-color: white"></button>' +
        '<button class="button button-link pull-right close-picker" ' +
        'style="position:absolute; height:42px; margin-right:10px; ' +
        'margin-top:1px; font-size:16px;" onclick="heating_sure()">确认</button>' +
        '<div class="title" style="font-size:16px;">表数</div>' +
        '</header>',
        cols: __meterData(cols)
      });
      // show
      // $timeout(function () {
      //   $("#picker_heating").picker("open");
      //   $('.taobao-sm').eq(0).css('background', 'white');
      //   $('.taobao-sm').eq(0).children().eq(0).css('padding', '0');
      //   $scope.$apply();
      // }, 100);
    }
    //不需要col，因为初始化之后就不会改变了
    function __setSubValue(value) {
      Heating.meterNumber.hdRed = value[0];
      Heating.meterNumber.bdRed = [];
      for (var index = 0; index < value.length - 1; index++) {
        Heating.meterNumber.bdRed[index] = value[index + 1];
      }
    }
    function __showMeterImg(cols, defaultValueObject) {
      var l = [];
      for (var index = 0; index < cols - 2; index++) {
        l[l.length] = defaultValueObject[index + 1] ? defaultValueObject[index + 1] :0;
      }
      Heating.meterNumber.hdBlack = defaultValueObject[0];
      Heating.meterNumber.bdBlack = l;
      Heating.meterNumber.ftBlack = defaultValueObject[defaultValueObject.length - 1];
    }

    // 起一个不会翻车的函数名称
    window.bjgas_change_heating_meter = function () {
      var l = $('#picker_heating').val().split(' ');
      // 这段代码改变图片文本
      // Heating.meterNumber.hdBlack = l[0];
      // Heating.meterNumber.ftBlack = l[l.length - 1];
      // for (var index = 0; index < Heating.currentCol - 2; index++) {
      //   Heating.meterNumber.bdBlack[index] = l[index + 1];
      // }
      var c = '';
      for(var i = 0; i < l.length; i++){
        c = c + l[i];
      }
      onChangeCb(c);
      $scope.$apply();
    };
    window.heating_sure = function () {
      (baseConfig.debug && console.log('window.heating_sure'));
      if(Heating.inputModal.meterNumber < preNumber){
        Heating.inputModal.meterNumber = preNumber;
        bjgasPopup.showPopup('表底数不能小于示意图中读数');
      }
    }
  }
}());

/**
 * Created by linlong on 2016/12/15.
 */

(function() {
    // "use strict";
    angular.module("northGas")
        .config(initManualDialRoute);

    /* @ngInject */
    function initManualDialRoute($stateProvider) {
        $stateProvider
            .state('tab.manualDial', {
                url: '/selfRead/manualDial',
                params: { data: '' },
                views: {
                    'tab-gas': {
                        templateUrl: 'pages/gas/self-readding/manual-dial/manual-dial.html',
                        controller: 'manualDialCtrl',
                        controllerAs: 'manualDialVM'
                    }
                }
            });

    }
}());

(function() {
    "use strict";
    angular.module('northGas')
        .controller('manualDialCtrl', manualDialCtrl);

    function manualDialCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, checkStaffService, $stateParams, switchUser, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, $timeout, bjgasHttp, $rootScope) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }
        var manualDialVM = this;
        // //console.log(angular.toJson($stateParams));
        $scope.$on('$ionicView.beforeEnter', function() {
            var info = switchUser.getUserInfo();

            manualDialVM.data = {
                "userAddre": info.label,
                "userNumber": info.userCode,
                "addrMess": info.address,
                "billsDate": "2016年09月账单",
                "money": "283.08元",
                "curShowAmount": "4566.000",
                "lastShowAmount": "4389.000",
                "lastGasAmount": "56.000m3",
                "curGasAmount": "49.000m3",
                "GasAmount": "101.000m3",
                "firstGasAmount": "78.000m3",
                "secondGasAmount": "0",
                "thirdGasAmount": "0",
                "firstBillsAmount": "128.000元",
                "secondBillsAmount": "0",
                "thirdBillsAmount": "0",
                "phone": "62330208"
            }
            var Compared = '0';
            var tempddd = [{
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                        //如果你希望显示文案和实际值不同，可以在这里加一个displayValues: [.....]
                },
                {
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                },
                {
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                },
                {
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                },
                {
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                },

                {
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                },
                {
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                },
                {
                    textAlign: 'center',
                    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                }
            ]
            if (window.localStorage.PreNum == undefined) {
                window.localStorage.PreNum = "7 5 4 7 9 0 0 0";
            } else {

            }

            manualDialVM.prePage = function() {
                $ionicHistory.goBack();
            };

            var data = {
                    "CM-MOB-IF14": {
                        "input": { "UniUserCode": manualDialVM.data.userNumber }
                    }
                }
                //console.log(angular.toJson(data));
            var userUrl = baseConfig.basePath + 'r/api?sysName=CCB&apiName=CM-MOB-IF14';
            //console.log(userUrl);
            try {
                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                bjgasHttp.post(userUrl, data).success(function(response) {
                    console.log(angular.toJson(response));

                    var temp = response['soapenv:Envelope']['soapenv:Body']['CM-MOB-IF14'].output.PreNum;
                    manualDialVM.PreNum = temp;
                    if (temp == '-') {
                        Compared = '0';
                    } else {
                        Compared = temp;
                    }

                    manualDialVM.Range = response['soapenv:Envelope']['soapenv:Body']['CM-MOB-IF14'].output.Range;
                    var tempa = temp.substring(0, temp.indexOf('.'));
                    var tempb = temp.substring(temp.indexOf('.') + 1, temp.indexOf('.') + 4);
                    var lastdata = getFiveData(JSON.parse(manualDialVM.Range), tempa) + getThreeData(3, tempb);
                    switch (JSON.parse(manualDialVM.Range)) {
                        // switch (4) {
                        case 1:
                            tempddd.pop();
                            tempddd.pop();
                            tempddd.pop();
                            tempddd.pop();
                            break;
                        case 2:
                            tempddd.pop();
                            tempddd.pop();
                            tempddd.pop();
                            break;
                        case 3:
                            tempddd.pop();
                            tempddd.pop();
                            break;
                        case 4:
                            tempddd.pop();
                            break;
                        case 5:
                            break;
                    }

                    // $("#picker").picker({
                    //   toolbarTemplate: '<header class="bar bar-nav">' +
                    //   '<button class="button button-link pull-left" style="background-color: white"></button>' +
                    //   '<button class="button button-link pull-right close-picker" ' +
                    //   'style="position:absolute; background-color:white;top:0px; height:42px; margin-right:10px; ' +
                    //   'margin-top:1px;" onclick="readfunc()" id="submit_reading">提交</button>' +
                    //   '<h1 class="title">本月抄表数</h1>' +
                    //   '</header>',
                    //   cols:tempddd
                    // });
                    //
                    // $timeout(function () {
                    //   // $('#submit_reading').on('click tap', subread);
                    //   $("#picker").picker("open");
                    // }, 500);
                    //console.log(lastdata.length == 3);
                    //console.log(lastdata);
                    if (lastdata.length == 3) {
                        document.getElementById('picker').value = dealdata(window.localStorage.PreNum);
                    } else {
                        document.getElementById('picker').value = dealdata(lastdata);
                        console.log(angular.toJson(lastdata));
                    }

                    bjgasPopup.hideLoading();



                    var subread = function() {
                        //console.log('normal func');
                    }

                    window.readfunc = function() {
                        if (parseInt(Compared.substr(0, 2)) >= 96 && JSON.parse(manualDialVM.Range) == 4) {

                        } else if (parseInt(Compared.substr(0, 3)) >= 996 && JSON.parse(manualDialVM.Range) == 5) {

                        } else
                        if (Compared.replace(/\s+/g, "") >= document.getElementById("picker").value.replace(/\s+/g, "")) {
                            bjgasPopup.showPopup("请输入正确的度数！");
                            $timeout(function() {
                                // $('#submit_reading').on('click tap', subread);
                                $("#picker").picker("open");
                            });
                            return;
                        }


                        var date = getNowFormatDate();
                        //console.log(angular.toJson(date));
                        var tempValue = document.getElementById("picker").value.replace(/\s+/g, "");
                        var curnum

                        curnum = tempValue.substring(0, JSON.parse(manualDialVM.Range));

                        var data = {
                            "CM-MOB-IF15": {
                                "input": {
                                    "UniUserCode": manualDialVM.data.userNumber,
                                    "MeterNum": curnum,
                                    "RdDate": date
                                }
                            }
                        }
                        bjgasPopup.confirm('您报数为' + curnum + '，确认提交吗', function(index) {
                            $timeout(function() {
                                // $('#submit_reading').on('click tap', subread);
                                $("#picker").picker("open");
                            }, 500);
                            if (index === 0) {

                            } else {
                                var userUrl = baseConfig.basePath + 'r/api?sysName=CCB&apiName=CM-MOB-IF15';
                                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                                try {
                                    bjgasHttp.post(userUrl, data).success(function(response) {
                                        //console.log(angular.toJson(response));
                                        if (response['soapenv:Envelope']['soapenv:Body']['CM-MOB-IF15'] == undefined) {
                                            bjgasPopup.showPopup("提交失败！", manualDialVM.prePage);
                                        } else {
                                            if (response['soapenv:Envelope']['soapenv:Body']['CM-MOB-IF15'].output.Code == 'E') {
                                                bjgasPopup.showPopup(response['soapenv:Envelope']['soapenv:Body']['CM-MOB-IF15'].output.ErrMessage, manualDialVM.prePage);
                                                return;
                                            }
                                            //console.log('kais');
                                            window.localStorage.PreNum = document.getElementById("picker").value;
                                            bjgasPopup.showPopup(response['soapenv:Envelope']['soapenv:Body']['CM-MOB-IF15'].output.ErrMessage, manualDialVM.prePage);
                                        }
                                    }).error(function(error) {
                                        // canGasVM.userList = [];
                                    }).finally(function() {
                                        bjgasPopup.hideLoading();
                                    });
                                } catch (e) {
                                    bjgasPopup.showPopup("未获取到数据!");
                                    bjgasPopup.hideLoading();
                                }
                            }
                        });




                    }

                    $("#picker").picker({
                        toolbarTemplate: '<header class="bar bar-nav">' +
                            '<button class="button button-link pull-left" style="background-color: white"></button>' +
                            '<button class="button button-link pull-right close-picker" ' +
                            'style="position:absolute; background-color:white;top:0px; height:42px; margin-right:10px; ' +
                            'margin-top:1px;" onclick="readfunc()" id="submit_reading">提交</button>' +
                            '<h1 class="title">本月抄表数</h1>' +
                            '</header>',
                        cols: tempddd
                    });

                    $timeout(function() {
                        $('#submit_reading').on('click tap', subread);
                        $("#picker").picker("open");
                    }, 500);


                    function getFiveData(n, tempax) {

                        var temp = "0";
                        while (tempax.length < n) {
                            tempax = "0" + tempax;
                        }
                        return tempax;
                        // if (tempax.length != n) {
                        //     if (tempax.length < n) {

                        //         tempax = '0' + tempax;

                        //         getFiveData(n, tempax);
                        //     } else {
                        //         console.log(n);
                        //         console.log(tempax);
                        //         // tempax = tempax.substring(0, tempax.length);
                        //         console.log(tempax);
                        //         getFiveData(n, tempax);
                        //     }
                        // } else {
                        //     console.log(tempax);

                        // }

                    }

                    function getThreeData(n, tempa) {
                        if (tempa.length != n) {
                            if (tempa.length < n) {
                                tempa = tempa + '0';
                                getFiveData(n, tempa);
                            } else {
                                tempa = tempa.substring(0, tempa.length - 1);
                                getFiveData(n, tempa);
                            }
                        } else {}
                        return tempa;
                    }

                    function dealdata(temp) {
                        for (var i = temp.length - 1; i > 0; i--) {
                            temp = temp.substring(0, i) + " " + temp.substring(i, temp.length)
                                //console.log(temp);
                        }
                        return temp;
                    }

                    // if (response.success == true) {
                    //   bjgasPopup.showPopup(response.message);
                    // } else {
                    //   bjgasPopup.showPopup(response.message);
                    // }
                }).error(function(error) {
                    // canGasVM.userList = [];
                }).finally(function() {
                    bjgasPopup.hideLoading();
                });
            } catch (e) {
                bjgasPopup.showPopup("未获取到数据!");
            }
        })
        $scope.$on('$ionicView.afterEnter', function() {
            $('#readBarId').on('click', function() {
                //console.log("clickbyrad");
            })


        });
        $scope.$on('$ionicView.leave', function() {
            $("#picker").picker("close");


        });
        try {
            var optionsCamera = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 1080,
                targetHeight: 1080,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation: true
            };
            var optionsAlbum = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 1080,
                targetHeight: 1080,
                popoverOptions: CameraPopoverOptions,
                correctOrientation: true
            };
        } catch (error) {

        }
        var optionsAs = {
            title: '选择照片来源',
            buttonLabels: ['拍照', '相册'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true
        };
        var optionsPicker = {
            maximumImagesCount: 1,
            width: 1080,
            height: 1080,
            quality: 100
        };
        manualDialVM.openPhoto = function() {
            //console.log("openPhoto");
            // add photo
            try {
                $cordovaActionSheet.show(optionsAs)
                    .then(function(btnIndex) {
                        var index = btnIndex;
                        if (index === 1) {
                            $cordovaCamera.getPicture(optionsCamera).then(function(imageData) {
                                    //console.log(angular.toJson(imageData))
                                    bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                                    Tesseract.recognize(imageData, {
                                            lang: 'spa',
                                            tessedit_char_blacklist: 'e'
                                        })
                                        .then(function(result) {
                                            bjgasPopup.hideLoading();
                                            if (!isNaN(result.text)) {

                                            } else {

                                                if (result.text.length == 8) {

                                                } else {
                                                    result.text += "0000000";
                                                    result.text.substring(0, 8);
                                                }
                                                document.getElementById("picker").value = dealdata(result.text);

                                            }
                                        })
                                })
                                //   Tesseract.recognize(imageData)
                                //     .then(function(result){//console.log('result is: ', result)})
                                // }, function(err) {
                                //   // error
                                // });
                        } else if (index == 2) {
                            navigator.camera.getPicture(function(results) {
                                bjgasPopup.showLoadingWithoutBackdrop('加载中...');
                                //console.log(angular.toJson(results))
                                Tesseract.recognize(results, {
                                        lang: 'spa',
                                        tessedit_char_blacklist: 'e'
                                    })
                                    .then(function(result) {
                                        bjgasPopup.hideLoading();
                                        if (!isNaN(result.text)) {

                                        } else {
                                            if (result.text.length == 8) {

                                            } else {
                                                result.text += "0000000";
                                                result.text.substring(0, 8);
                                            }
                                            document.getElementById("picker").value = dealdata(result.text);
                                        }
                                    })


                                $scope.$apply();
                            }, function(error) {
                                // error getting photos
                            }, optionsAlbum);
                        }
                    });
            } catch (error) {
                //console.log(angular.toJson(error));
                //console.log(error);
            }
        };
        manualDialVM.togassSitchUser = function() {
            $state.go('tab.switchUser');
        }

        function getNowFormatDate() {

            var d = new Date();
            var year = d.getYear();
            var month = d.getMonth() + 1;
            var date = d.getDate();
            var day = d.getDay();
            var hours = d.getHours();
            var minutes = d.getMinutes();
            var seconds = d.getSeconds();
            var ms = d.getMilliseconds();
            var curDateTime = year + 1900;
            if (month > 9)
                curDateTime = curDateTime + "-" + month;
            else
                curDateTime = curDateTime + "-0" + month;
            if (date > 9)
                curDateTime = curDateTime + "-" + date;
            else
                curDateTime = curDateTime + "-0" + date;
            if (hours > 9)
                curDateTime = curDateTime + "-" + hours;
            else
                curDateTime = curDateTime + "-0" + hours;
            if (minutes > 9)
                curDateTime = curDateTime + "." + minutes;
            else
                curDateTime = curDateTime + ".0" + minutes;
            if (seconds > 9)
                curDateTime = curDateTime + "." + seconds;
            else
                curDateTime = curDateTime + ".0" + seconds;
            return curDateTime;

        }
    }
}());
/**
 * Created by USER on 2016/12/20.
 */

/**
 * Created by linlong on 2016/12/15.
 */

(function() {
    // "use strict";
    angular.module("northGas")
        .config(initSelfReadRoute);

    /* @ngInject */
    function initSelfReadRoute($stateProvider) {
        $stateProvider
            .state('takePhoto', {
                url: '/selfRead/takePhone',
                params: { data: '' },
                // views: {
                //   'tab-self': {
                templateUrl: 'pages/gas/self-readding/take-photo/take-photo.html',
                controller: 'takePhoneCtrl',
                controllerAs: 'takePhoneVM'
                    // }
                    // }
            });
    }
}());


(function() {
    "use strict";
    angular.module('northGas')
        .controller('takePhoneCtrl', takePhoneCtrl);

    function takePhoneCtrl($scope, $state, $ionicHistory, bjgasPopup, baseConfig, checkStaffService, $stateParams) {
        if (baseConfig.debug) {
            //console.log('CheckStaffInputCtrl');
        }

        var takePhoneVM = this;
        takePhoneVM.data = {
            "userAddre": "  我家",
            "userNumber": "90102200815",
            "addrMess": "北京市海淀区西直门南小街回风花园12栋22号",
            "billsDate": "2016年09月账单",
            "money": "283.08元",
            "curShowAmount": "4566.000",
            "lastShowAmount": "4389.000",
            "lastGasAmount": "56.000m³",
            "curGasAmount": "49.000m³",
            "GasAmount": "101.000m³",
            "firstGasAmount": "78.000m³",
            "secondGasAmount": "0",
            "thirdGasAmount": "0",
            "firstBillsAmount": "128.000元",
            "secondBillsAmount": "0",
            "thirdBillsAmount": "0",
            "phone": "62330208"
        }



        takePhoneVM.prePage = function() {
            $ionicHistory.goBack();
        };

    }
}());
(function() {
  // "use strict";
  angular.module("northGas")
    .config(initAboutRoute);

  /* @ngInject */
  function initAboutRoute($stateProvider) {
    $stateProvider
      .state('tab.appAbout', {
        url: '/appAbout',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/about/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'About'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.mine')
    .controller('AboutCtrl', AboutCtrl);

  function AboutCtrl($scope, $state, $ionicHistory, bjgasPopup, checkVersion, baseConfig) {
    var About = this;

    About.topStyle = {};
    About.ver = baseConfig.version.currentVersion;

    About.checkVersion = function () {
      if(baseConfig.debug){
        console.log('check version');
      }
      checkVersion.checkAppVersion('MY_INFO');
    };

    About.goBack = function() {
      if(baseConfig.debug){
        console.log('goback');
      }
      $ionicHistory.goBack();
    };
    if (baseConfig.debug) {
      console.log('About Ctrl');
    }

    $scope.$on('$ionicView.beforeEnter', function () {
      About.topStyle.height = window.screen.height * 0.18 + 'px';
    });
  }
}());

(function() {
  angular.module('northGas')
    .config(initProblemVerifyResult);

  function initProblemVerifyResult($stateProvider) {
    $stateProvider
      .state('tab.problemVerifyResult', {
        url: '/app-setting/problemVerifyResult',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/reset-password/problem-verify-result.html',
            controller: 'ProblemVerifyResultCtrl',
            controllerAs: 'ProblemVerifyResult'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.login')
    .controller('ProblemVerifyResultCtrl', ProblemVerifyResultCtrl);

  function ProblemVerifyResultCtrl($scope, $ionicHistory, bjgasHttp, bjgasPopup, baseConfig) {
    if (baseConfig.debug) {
      console.log('ProblemVerifyResultCtrl');
    }

    var ProblemVerifyResult = this;

    ProblemVerifyResult.title = '验证结果';
    ProblemVerifyResult.path = 'pages/mine/app-setting/reset-password/problem-verify-result.html';
    ProblemVerifyResult.pass = {
      flag: (parseInt(window.sessionStorage.problemsVerifyPass) === 1)
    };
    ProblemVerifyResult.inputModel = {
      pw: '',
      pw2: ''
    };

    if(ProblemVerifyResult.pass.flag){
      ProblemVerifyResult.submitLabel = '提交密码';
    } else {
      ProblemVerifyResult.submitLabel = '重新回答';
    }

    ProblemVerifyResult.prePage = function() {
      if (baseConfig.debug) {
        console.log('ProblemVerifyResult.prePage');
      }
      if ($scope.__modal) {
        if($scope.canSafeClick()) {
          $scope.prePage();
        }
      } else {
        $ionicHistory.goBack();
      }
    };

    function onSubmit(resp){
      if(resp.success){
        bjgasPopup.showPopup('重置密码成功', function(){
          if($scope.__modal){
            if($scope.canSafeClick()) {
              $scope.prePage(0);//回到第一页
            }
          } else {
            $ionicHistory.goBack(-4);//回退4页
          }
        });
      } else {
        bjgasPopup.showPopup('重置密码失败：' + resp.message);
      }
    }
    ProblemVerifyResult.submit = function() {
      if (baseConfig.debug) {
        console.log('ProblemVerifyResult.submit');
      }
      if(ProblemVerifyResult.pass.flag){
        var _pw = ProblemVerifyResult.inputModel.pw;
        var reg = new RegExp("([A-Z]|[a-z]|[0-9])$");
        if(!_pw){
          bjgasPopup.showPopup('请输入新密码');
        } else if(!reg.test(_pw)){
          bjgasPopup.showPopup('不能使用特殊字符');
        } else if(_pw.length < 6){
          bjgasPopup.showPopup('新密码长度不足6位');
        } else if(_pw != ProblemVerifyResult.inputModel.pw2) {
          bjgasPopup.showPopup('两次密码不一致');
        } else {
          bjgasPopup.showLoadingWithoutBackdrop('提交中');
          var url = baseConfig.basePath + 'c/api/resetPwd';
          var param = {
            mobile: window.sessionStorage.checkMobileValue,
            password: _pw,
            code: window.sessionStorage.resetCode
          };
          bjgasHttp.post(url, param).success(function(response) {
            onSubmit(response);
          }).error(function(response, status) {
            bjgasPopup.showPopup('请求设置新密码失败');
          }).finally(function() {
            bjgasPopup.hideLoading();
          });
        }
      } else {
        ProblemVerifyResult.prePage();
      }
    };


  }
}());

(function() {
  angular.module('northGas')
    .config(initProblemVerify);

  function initProblemVerify($stateProvider) {
    $stateProvider
      .state('tab.problemVerify', {
        url: '/app-setting/problemVerify',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/reset-password/problem-verify.html',
            controller: 'ProblemVerifyCtrl',
            controllerAs: 'ProblemVerify'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.login')
    .controller('ProblemVerifyCtrl', ProblemVerifyCtrl);

  function ProblemVerifyCtrl($scope, $state, $ionicHistory, bjgasHttp, bjgasPopup, baseConfig) {
    if (baseConfig.debug) {
      console.log('ProblemVerifyCtrl');
    }

    var ProblemVerify = this;

    ProblemVerify.inputModel = {
      prob: ['','','']
    };

    ProblemVerify.title = '验证密保问题';
    ProblemVerify.path = 'pages/mine/app-setting/reset-password/problem-verify.html';

    ProblemVerify.problems = [ // 问题容器
      { "questionContent": '', },
      { "questionContent": '', },
      { "questionContent": '', }
    ];
    ProblemVerify.problems = JSON.parse(window.sessionStorage.checkMobileProblems);

    if(baseConfig.debug){
      console.log(ProblemVerify.problems);
    }

    ProblemVerify.prePage = function() {
      if (baseConfig.debug) {
        console.log('ProblemVerify.prePage');
      }
      window.sessionStorage.checkMobileValue = '';
      window.sessionStorage.checkMobileProblems = '';
      if ($scope.__modal) {
        if($scope.canSafeClick()) {
          $scope.prePage();
        }
      } else {
        $ionicHistory.goBack();
      }
    };

    function onSubmit(resp){
      if(resp.success){
        window.sessionStorage.resetCode = resp.message;
        window.sessionStorage.problemsVerifyPass = '1';
        if ($scope.__modal) {
          if($scope.canSafeClick()) {
            $scope.nextPage('verifyResult');
          }
        } else {
          $state.go('tab.problemVerifyResult');
        }
      } else {
        window.sessionStorage.problemsVerifyPass = '0';
        if ($scope.__modal) {
          if($scope.canSafeClick()) {
            $scope.nextPage('verifyResult');
          }
        } else {
          $state.go('tab.problemVerifyResult');
        }
      }
    }
    ProblemVerify.submit = function() {
      if (baseConfig.debug) {
        console.log('ProblemVerify.submit');
        console.log(ProblemVerify.inputModel);
      }
      if(!ProblemVerify.inputModel.prob[0]){
        bjgasPopup.showPopup('请输入问题1的答案');
      } else if(!ProblemVerify.inputModel.prob[1]){
        bjgasPopup.showPopup('请输入问题2的答案');
      } else if(!ProblemVerify.inputModel.prob[2]){
        bjgasPopup.showPopup('请输入问题3的答案');
      } else {
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        var url = baseConfig.basePath + 'c/api/checkUserSecurityQuestion';
        var param = {
          mobile: window.sessionStorage.checkMobileValue,
          answerArray:[
            {
              id: ProblemVerify.problems[0].id,
              answer: ProblemVerify.inputModel.prob[0]
            },
            {
              id: ProblemVerify.problems[1].id,
              answer: ProblemVerify.inputModel.prob[1]
            },
            {
              id: ProblemVerify.problems[2].id,
              answer: ProblemVerify.inputModel.prob[2]
            }
          ]
        };
        bjgasHttp.post(url, param).success(function(response) {
          onSubmit(response);
        }).error(function(response, status) {
          bjgasPopup.showPopup('请求校验密保失败');
        }).finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    };
  }
}());

(function() {
  angular.module('northGas')
    .config(initResetByProblem);
  /* @ngInject */
  function initResetByProblem($stateProvider) {
    $stateProvider
      .state('tab.resetByProblem', {
        url: '/app-setting/resetByProblem',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/reset-password/reset-by-problem.html',
            controller: 'ResetByProblemCtrl',
            controllerAs: 'ResetByProblem'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.login')
    .controller('ResetByProblemCtrl', ResetByProblemCtrl);

  function ResetByProblemCtrl($scope, $state, $ionicHistory, bjgasHttp, bjgasPopup, baseConfig) {
    if (baseConfig.debug) {
      console.log('ResetByProblemCtrl');
    }

    var ResetByProblem = this;

    ResetByProblem.inputModel = {
      id: ''
    };

    ResetByProblem.path = 'pages/mine/app-setting/reset-password/reset-by-problem.html';
    ResetByProblem.title = '校验手机号';

    if(window.localStorage.userInfo){
      ResetByProblem.inputModel.id = parseInt(JSON.parse(window.localStorage.userInfo).mobile);
    }

    ResetByProblem.prePage = function() {
      if (baseConfig.debug) {
        console.log('ResetByProblem.prePage');
      }
      if ($scope.__modal) {
        if($scope.canSafeClick()) {
          $scope.prePage();
        }
      } else {
        $ionicHistory.goBack();
      }
    };

    function onSubmit(resp){
      if (baseConfig.debug) {
        console.log('ResetByProblem.submit');
        console.log(resp);
      }
      if(resp.success && resp.rows && resp.rows.length > 0){
        // 存在sessionStorage是因为，找回密码页面既可能出现在modal中也可能出现在app的路由中，保证两种情况都能被下一页取到。
        window.sessionStorage.checkMobileValue = ResetByProblem.inputModel.id;
        window.sessionStorage.checkMobileProblems = JSON.stringify(resp.rows);
        if ($scope.__modal) {
          if($scope.canSafeClick()) {
            $scope.nextPage('verify');
          }
        } else {
          $state.go('tab.problemVerify');
        }
      } else if (resp.success && resp.rows && resp.rows.length === 0) {
        bjgasPopup.showPopup('该账户未设置密保问题');
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    ResetByProblem.submit = function() {
      // onSubmit({success:true});
      var id = ResetByProblem.inputModel.id;

      var regPhone = new RegExp("[0-9]{11}");

      if (!id) {
        bjgasPopup.showPopup('请输入手机号');
      } else if (!regPhone.test(id)) {
        bjgasPopup.showPopup('您输入的是一个无效的手机号');
      } else {
        if(baseConfig.debug){
          console.log('check mobile');
        }
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        var url = baseConfig.basePath + 'c/api/getUserSecurityQuestion/' + id;
        bjgasHttp.get(url).success(function(response) {
          onSubmit(response);
        }).error(function(response, status) {
          bjgasPopup.showPopup('请求手机校验失败');
        }).finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    };
  }
}());

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initResetRoute);

  /* @ngInject */
  function initResetRoute($stateProvider) {
    $stateProvider
      .state('tab.reset', {
        url: '/app-setting/reset',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/reset-password/reset-by-sms.html',
            controller: 'ResetBySmsCtrl',
            controllerAs: 'ResetBySms'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.login')
    .controller('ResetBySmsCtrl', ResetBySmsCtrl);

  function ResetBySmsCtrl($scope, $state, $ionicHistory, bjgasPopup, bjgasHttp, verifyTimerService, baseConfig) {
    if (baseConfig.debug) {
      console.log('ResetBySmsCtrl');
    }

    var ResetBySms = this;

    ResetBySms.inputModel = {
      id: '',
      verify: '',
      pw: '',
      pw2: ''
    };

    ResetBySms.path = 'pages/mine/app-setting/reset-password/reset-by-sms.html';
    ResetBySms.title = '登录密码重置';
    ResetBySms.verifyLabel = '获取验证码';
    ResetBySms.verifyDisableFlag = false;

    // verifyTimerService.on(function(label, flag) {
    //   ResetBySms.verifyLabel = label;
    //   ResetBySms.verifyDisableFlag = flag;
    // });

    ResetBySms.prePage = function() {
      if (baseConfig.debug) {
        console.log('ResetBySms.prePage');
      }
      if ($scope.__modal) {
        if (baseConfig.debug) {
          console.log('$scope.prePage();');
        }
        if($scope.canSafeClick()) {
          $scope.prePage(0);
        }
      } else {
        $ionicHistory.goBack();
      }
    };

    function onVerify(resp) {
      if(resp.success){
        var res = verifyTimerService.clock();
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    ResetBySms.verify = function() { // 获取短信验证码
      if (baseConfig.debug) {
        console.log('ResetBySms.verify');
      }
      if (!ResetBySms.verifyDisableFlag) {
        var regPhone = new RegExp("[0-9]{11}");
        if (!regPhone.test(ResetBySms.inputModel.id)){
          bjgasPopup.showPopup('您输入的是一个无效的手机号');
        }
        else {
          bjgasPopup.showLoadingWithoutBackdrop('请求中');
          var url = baseConfig.basePath + 'c/api/getVerificationCode';
          var param = {
            mobile: ResetBySms.inputModel.id,
            type: 'reset'
          };
          bjgasHttp.post(url, param).success(function(response) {
            verifyTimerService.on(function(label, flag) {
              ResetBySms.verifyLabel = label;
              ResetBySms.verifyDisableFlag = flag;
            });
            onVerify(response);
          }).error(function(response, status) {
            bjgasPopup.showPopup('请求短信验证码失败');
          }).finally(function() {
            bjgasPopup.hideLoading();
          });
        }
      }
    };

    function onSubmit(resp){
      ResetBySms.inputModel = {
        id: '',
        verify: '',
        pw: '',
        pw2: ''
      };
      ResetBySms.verifyLabel = '获取验证码';
      ResetBySms.verifyDisableFlag = false;
      if(resp.success){
        bjgasPopup.showPopup("重置密码成功", function(){
          if($scope.__modal) {
            if($scope.canSafeClick()) {
              $scope.closeModal();
            }

          } else {
            $ionicHistory.goBack();
          }
        });
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    ResetBySms.submit = function() {
      var id = ResetBySms.inputModel.id;
      var verify = ResetBySms.inputModel.verify;
      var pw = ResetBySms.inputModel.pw;
      var pw2 = ResetBySms.inputModel.pw2;

      var reg = new RegExp("([A-Z]|[a-z]|[0-9])$");
      var regPhone = new RegExp("[0-9]{11}");

      if (!id) {
        bjgasPopup.showPopup('请输入手机号');
      } else if (!regPhone.test(id)) {
        bjgasPopup.showPopup('您输入的是一个无效的手机号');
      } else if (!verify) {
        bjgasPopup.showPopup('请输入验证码');
      } else if (!pw) {
        bjgasPopup.showPopup('请输入密码');
      } else if (!reg.test(pw)) {
        bjgasPopup.showPopup('不能使用特殊字符');
      } else if (pw.length < 6) {
        bjgasPopup.showPopup('密码长度不足6位');
      } else if (pw != pw2) {
        bjgasPopup.showPopup('请确认两次输入的密码');
      } else {
        if(baseConfig.debug){
          console.log('ResetBySms');
          console.log(ResetBySms.inputModel);
        }
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        var url = baseConfig.basePath + 'c/api/resetPwd';
        var param = {
          mobile: id,
          password: pw,
          code: verify
        };
        bjgasHttp.post(url, param).success(function(response) {
          onSubmit(response);
        }).error(function(response, status) {
          bjgasPopup.showPopup('请求重置密码失败');
        }).finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    };

    ResetBySms.resetByProb = function() {
      if (baseConfig.debug) {
        console.log('ResetBySms.resetByProb');
      }
      if ($scope.__modal) {
        if($scope.canSafeClick()) {
          $scope.nextPage('resetByProblem');
        }
      } else {
        $state.go('tab.resetByProblem');
      }
    };

    $scope.$on('$destroy', function() {
      if(!$scope.__modal){
        verifyTimerService.off();
      }
    });
  }
}());

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initSecurityFillinRoute);

  /* @ngInject */
  function initSecurityFillinRoute($stateProvider) {
    $stateProvider
      .state('tab.securityFillin', {
        url: '/app-setting/security-fillin',
        params: {
          "hasProb": false,
          "problems": [
            { "questionContent": '', },
            { "questionContent": '', },
            { "questionContent": '', }
        ]},
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/security/security-fillin.html',
            controller: 'SecurityFillinCtrl',
            controllerAs: 'SecuFillCtrl'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.mine')
    .controller('SecurityFillinCtrl', SecurityFillinCtrl);

  function SecurityFillinCtrl($scope, $ionicHistory, $stateParams, $ionicModal, bjgasPopup, bjgasHttp, baseConfig) {
    // 密保问题：表示用户需要选来作为密保的3个问题
    // 可选问题：有若干个问题，可以被选作为密保问题
    var SecuFillCtrl = this;
    SecuFillCtrl.currentMobile = undefined;
    SecuFillCtrl.currentProblemIndex = 0; //当前选中哪个密保
    SecuFillCtrl.problems = $stateParams.problems;
    SecuFillCtrl.availableProlems = []; // 可供选择的可选问题
    SecuFillCtrl.inputModel = {
      answer: ['','','']
    };
    SecuFillCtrl.isCheckProb = $stateParams.hasProb;
    if(!SecuFillCtrl.isCheckProb){
      SecuFillCtrl.title = '设置密保问题';
    } else {
      SecuFillCtrl.title = '验证密保问题';
    }

    if(window.localStorage.userInfo){
      SecuFillCtrl.currentMobile = JSON.parse(window.localStorage.userInfo).mobile;
    }

    if (baseConfig.debug) {
      console.log('SecurityFillinCtrl');
    }
    // select modal
    $ionicModal.fromTemplateUrl('pages/mine/app-setting/select-modal.html', {
      scope: $scope
    }).then(function(modal) {
      SecuFillCtrl.selectModal = modal;
    });
    SecuFillCtrl.showProblems = function(index) {
      if(!SecuFillCtrl.isCheckProb){
        SecuFillCtrl.currentProblemIndex = index;
        SecuFillCtrl.selectModal.show();
      }
    };
    $scope.$on('$destroy', function() {
      SecuFillCtrl.selectModal.remove();
    });
    //  select modal

    // 在modal选中了某个问题
    SecuFillCtrl.onSelectProblem = function(problem, availableIndex) {
      if (baseConfig.debug) {
        console.log(problem);
      }
      // 现在是对哪个密保问题进行选择
      var index = SecuFillCtrl.currentProblemIndex;
      // 如果这个密保问题之前是选择过了可选问题的，把这个可选问题放出来
      if (typeof(SecuFillCtrl.problems[index].availableIndex) !== 'undefined') {
        SecuFillCtrl.availableProlems[SecuFillCtrl.problems[index].availableIndex].showFlag = true;
      }
      // 设置这个密保的问题的‘可选问题文本’和‘可选问题下标’
      SecuFillCtrl.problems[index] = {
        questionContent: problem.questionContent,
        availableIndex: availableIndex
      };
      SecuFillCtrl.selectModal.hide();
      // 隐藏这个问题，以防其他密保选择它
      SecuFillCtrl.availableProlems[availableIndex].showFlag = false;
    };

    function onAvailableProblems(data) {
      if (baseConfig.debug) {
        console.log(data);
      }
      if (data.success) {
        for (var i = 0; i < data.rows.length; i++) {
          data.rows[i].showFlag = true;
        }
        SecuFillCtrl.availableProlems = data.rows;
      } else {
        bjgasPopup.showPopup('获取问题列表失败');
      }
    }
    // 获取可选问题
    function getAvailableProblems() {
      bjgasPopup.showLoadingWithoutBackdrop('加载中');
      bjgasHttp.get(baseConfig.basePath + 'i/api/getSecurityQuestion')
        .success(function(data) {
          onAvailableProblems(data);
        })
        .error(function(data) {
          if (baseConfig.debug) {
            console.log(data);
          }
          bjgasPopup.showPopup('获取问题列表请求失败');
        })
        .finally(function() {
          bjgasPopup.hideLoading();
        });
    }

    SecuFillCtrl.prePage = function() {
      if (baseConfig.debug) {
        console.log('SecuFillCtrl.prePage');
      }
      $ionicHistory.goBack(-2);
    };

    function onSubmit(resp){
      if(baseConfig.debug){
        console.log(resp);
      }
      if(resp.success){
        if(!SecuFillCtrl.isCheckProb){
          bjgasPopup.showPopup('密保设置成功', function(){
            $ionicHistory.goBack(-2);
          });
        } else  {
          bjgasPopup.showPopup('密保问题回答正确', function(){
            $ionicHistory.goBack(-2);
          });
        }
      } else {
        if(!SecuFillCtrl.isCheckProb){
          bjgasPopup.showPopup(resp.message);
        } else {
          bjgasPopup.showPopup('密保问题回答错误');
        }
      }
    }
    SecuFillCtrl.submit = function() {
      if (baseConfig.debug) {
        console.log('提交');
      }
      var answ1 = SecuFillCtrl.inputModel.answer[0];
      var answ2 = SecuFillCtrl.inputModel.answer[1];
      var answ3 = SecuFillCtrl.inputModel.answer[2];
      if(!answ1){
        bjgasPopup.showPopup('请输入第一个问题的答案');
      } else if(answ1.indexOf(' ') > -1){
        bjgasPopup.showPopup('第一个问题的答案有空格存在');
      } else if(!answ2){
        bjgasPopup.showPopup('请输入第二个问题的答案');
      } else if(answ2.indexOf(' ') > -1){
        bjgasPopup.showPopup('第二个问题的答案有空格存在');
      } else if(!answ3){
        bjgasPopup.showPopup('请输入第三个问题的答案');
      } else if(answ3.indexOf(' ') > -1){
        bjgasPopup.showPopup('第三个问题的答案有空格存在');
      } else {
        bjgasPopup.showLoadingWithoutBackdrop('提交中');
        if(!SecuFillCtrl.isCheckProb){
          var url = baseConfig.basePath + 'i/api/setUserSecurityQuestion';
          var param = {
            userId: JSON.parse(window.localStorage.userInfo).id,
            securityArray: [
              {
                questionContent: SecuFillCtrl.problems[0].questionContent,
                answer: answ1
              },
              {
                questionContent: SecuFillCtrl.problems[1].questionContent,
                answer: answ2
              },
              {
                questionContent: SecuFillCtrl.problems[2].questionContent,
                answer: answ3
              }
            ]
          };
          bjgasHttp.post(url, param).success(function(response) {
            onSubmit(response);
          }).error(function(response, status) {
            bjgasPopup.showPopup('请求设置密保失败');
          }).finally(function() {
            bjgasPopup.hideLoading();
          });
        } else {
          var url = baseConfig.basePath + 'i/api/checkUserSecurityQuestion';
          var param = {
            mobile: JSON.parse(window.localStorage.userInfo).mobile,
            answerArray: [
              {
                id: SecuFillCtrl.problems[0].id,
                answer: answ1
              },
              {
                id: SecuFillCtrl.problems[1].id,
                answer: answ2
              },
              {
                id: SecuFillCtrl.problems[2].id,
                answer: answ3
              }
            ]
          };
          if(baseConfig.debug){
            console.log(param);
          }
          bjgasHttp.post(url, param).success(function(response) {
            onSubmit(response);
          }).error(function(response, status) {
            bjgasPopup.showPopup('请求校验密保失败');
          }).finally(function() {
            bjgasPopup.hideLoading();
          });
        }
      }
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      getAvailableProblems();
    });
  }
}());
(function() {
  // "use strict";
  angular.module("northGas")
    .config(initSecurityRoute);

  /* @ngInject */
  function initSecurityRoute($stateProvider) {
    $stateProvider
      .state('tab.security', {
        url: '/app-setting/security',
        views: {
          'tab-mine': {
            templateUrl: 'pages/mine/app-setting/security/security.html',
            controller: 'SecurityCtrl',
            controllerAs: 'SecuCtrl'
          }
        }
      });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.mine')
    .controller('SecurityCtrl', SecurityCtrl);

  function SecurityCtrl($scope, $state, $timeout, $ionicHistory, LoginService, bjgasPopup, bjgasHttp, baseConfig) {
    var SecuCtrl = this;

    SecuCtrl.mobile = undefined;
    SecuCtrl.timeoutHandle = '';

    if (baseConfig.debug) {
      console.log('SecurityCtrl');
    }

    SecuCtrl.prePage = function() {
      if (baseConfig.debug) {
        console.log('SecurityCtrl prePage()');
      }
      $ionicHistory.goBack();
    };

    function onProblems(resp){
      if(resp.success && resp.rows.length > 0){
        // 存在sessionStorage是因为，找回密码页面既可能出现在modal中也可能出现在app的路由中，保证两种情况都能被下一页取到。
        window.sessionStorage.checkMobileProblems = JSON.stringify(resp.rows);
        bjgasPopup.confirm('已设置密保问题，进行验证？', function(index) {
          if (index === 0) {
            if (baseConfig.debug) {
              console.log('取消了');
            }
            $ionicHistory.goBack();
          } else if (index === 1) {
            if (baseConfig.debug) {
              console.log('确认了');
            }
            $state.go('tab.securityFillin', {
              hasProb: true,
              problems: resp.rows
            });
          }
        });
      } else if (resp.rows.length === 0) {
        bjgasPopup.confirm('还未设置密保问题，进行设置？', function(index) {
          if (index === 0) {
            if (baseConfig.debug) {
              console.log('取消了');
            }
            $ionicHistory.goBack();
          } else if (index === 1) {
            if (baseConfig.debug) {
              console.log('确认了');
            }
            $state.go('tab.securityFillin');
          }
        });
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    function getProblems(){
      if(LoginService.isLogin()){
        SecuCtrl.mobile = JSON.parse(window.localStorage.userInfo).mobile;
        bjgasPopup.showLoadingWithoutBackdrop('加载中');
        var url = baseConfig.basePath + 'i/api/getUserSecurityQuestion/' + SecuCtrl.mobile;
        bjgasHttp.get(url).success(function(response) {
          onProblems(response);
        }).error(function(response, status) {
          bjgasPopup.showPopup('请求密保问题失败');
        }).finally(function() {
          bjgasPopup.hideLoading();
        });
      } else {
        LoginService.showLogin({
          onSuccess: function(){
            SecuCtrl.timeoutHandle = $timeout(function(){
              SecuCtrl.prePage();
            }, 300);
            $timeout(function(){
              document.getElementsByClassName('modal-backdrop')[0].style['pointer-events'] = 'none';
            }, 300);
          }
        });
      }
    }

    function init(){
      getProblems();
    }
    $scope.$on('$ionicView.afterEnter',function(){
      init();
    });
    $scope.$on('$destroy', function() {
      $timeout.cancel(SecuCtrl.timeoutHandle);
    });
  }
}());
(function() {
  'use strict';
  angular.module('northGas.gasService', [])

    .factory('GasFactory', GasFactory);


  /* @ngInject */
  function GasFactory() {
    var bootImgs = [{
      'name': '卡表充值',
      'picUrl': 'img/cardPay@3x.png',
      'stateUrl': 'tab.ctRecharge'
      // tab.ctRecharge
    }, {
      'name': '自助抄表',
      'picUrl': 'img/selfMeterReading@3x.png',
      'stateUrl': 'tab.selfRead'
    }, {
      "name": "气费账单",
      "picUrl": "img/gasBill@3x.png",
      "stateUrl": "tab.gasBillMain"
    }, {
      'name': '员工检验',
      'picUrl': 'img/staffCheck@3x.png',
      'stateUrl': 'tab.checkStaffMain'
    }, {
      'name': '燃气报修',
      'picUrl': 'img/gasRepair@3x.png',
      'stateUrl': 'tab.repairMain'
    }, {
      'name': '预约巡检',
      'picUrl': 'img/safeCheck@3x.png',
      'stateUrl': 'tab.checkMain'
    }, {
      'name': '停气公告',
      'picUrl': 'img/stopGasMessage@3x.png',
      'stateUrl': 'tab.cutOffNotice'
    }, {
      'name': '附近网点',
      'picUrl': 'img/nearByNet@3x.png',
      'stateUrl': 'tab.nearbyStore'
    }, {
      'name': '燃气知识库',
      'picUrl': 'img/gasKnowledge@3x.png',
      'stateUrl': 'tab.KnowledgeList'
    }, ];

    var gasService = {
      getBootImg: getBootImg
    };

    return gasService;


    function getBootImg() {
      return bootImgs;

    }
  }
})();

(function() {
    'use strict';
    angular.module('northGas.gas', ['northGas.gasService'])
        .controller('GasCtrl', GasCtrl);

    /* @ngInject */
    function GasCtrl($scope, $state, $timeout, $ionicSlideBoxDelegate, GasFactory, baseConfig, bjgasHttp, bjgasPopup, switchUser, LoginService) {
        var gas = this;
        var bannerUrl = baseConfig.basePath + 'c/api/getHomePagePic';
        var net = window.onlinenetwork();
        gas.tm1 = $timeout(function() {
            var textTooLong = document.getElementsByClassName('name-dscription');
            for (var i = 0, len = textTooLong.length; i < len; i++) {
                textTooLong[i].style.width = window.screen.width * 0.88 + 'px';
            }
        }, 0);

        $scope.$on('$ionicView.beforeEnter', function() {
            window.sessionStorage.refreshNearby = "true";
            gas.hadLogin = LoginService.isLogin(); // 获取用户是否登录
            gas.showSpinnerNotic = false;
            gas.reStartNet = false; // 是否重新刷新数据的标志
            gas.showUserInfo = false; // 默认未登录+未绑定用户不显示用户信息
            gas.userInfo = {};
            gas.userInfo = switchUser.getUserInfo();
            if (gas.userInfo.userCode !== '') {
                gas.showUserInfo = true;
            }
        });

        //登录页modal取消时刷新燃气户列表
        $scope.$on('modal.hidden', function() {
            gas.userInfo = {};
            gas.userInfo = switchUser.getUserInfo();
            if (gas.userInfo.userCode !== '') {
                gas.showUserInfo = true;
            }
        });

        gas.banners = [];
        gas.bootImgItems = GasFactory.getBootImg(); //获取菜单资源
        gas.goDiffStateRoute = goDiffStateRoute;

        gas.goSwitchuser = goSwitchuser;
        gas.goLogin = goLogin;
        gas.goBindNumber = goBindNumber;
        gas.showSpinnerBox = true;

        (function() {
            if (ionic.Platform.isIOS()) {
                if (navigator.onLine) {
                    bjgasHttp.get(bannerUrl).success(function(response) {
                        getGasBanner(response);
                    });
                } else {
                    //在真机上是有效的
                    gas.showSpinnerBox = false;
                    gas.reStartNet = true;
                    bjgasPopup.showLongCenterToast('请检查网络连接!');
                }
            } else {
                bjgasHttp.get(bannerUrl).success(function(response) {
                    getGasBanner(response);
                });
            }

        }());

        if (ionic.Platform.isIOS()) {
            net.onLineHandler(function() { //监测联网时的处理
                // bjgasPopup.showVeryShortCenterToast('恢复网络连接!');
                if (gas.reStartNet) {
                    if (navigator.onLine) {
                        gas.showSpinnerBox = true;
                        bjgasHttp.get(bannerUrl).success(function(response) {
                            getGasBanner(response);
                        });
                    }
                }
            });
        }

        net.offLineHandler(function() { //监测断网时的处理
            // bjgasPopup.showVeryShortCenterToast('您的网络已经断开连接!');
        });

        function getGasBanner(rs) {
            gas.banners = rs.rows;
            $ionicSlideBoxDelegate.update(); //用于刷新box
            $ionicSlideBoxDelegate.loop(true);
            gas.showSpinnerBox = false;
            $timeout(function() {
                var gasSlideBox = document.getElementById('gas_slide');
                gasSlideBox.style.height = '34.5%';
                if (gasSlideBox.style.height == '0') {
                    gasSlideBox.style.height = '185px';
                }
            }, 0);
        }

        function onSuccessLogin() {
            gas.hadLogin = true;
        }

        function onHideLogin() {}

        function goDiffStateRoute(gasImgDetail, event) {
            try {
                if (gasImgDetail.stateUrl === "tab.selfRead" || gasImgDetail.stateUrl === "tab.gasBillMain" || gasImgDetail.stateUrl === "tab.ctRecharge") {
                    if (!LoginService.isLogin()) {
                        LoginService.showLogin({
                            onSuccess: onSuccessLogin,
                            onHide: onHideLogin,
                        });
                    } else {
                           var userInfo = switchUser.getUserInfo();
            if( gasImgDetail.stateUrl === "tab.ctRecharge"){
                if(userInfo.meterType == "R" ){
                      bjgasPopup.showPopup("该功能仅对卡表-预付费用户开放!");
                  }else {
                $state.go(gasImgDetail.stateUrl);
              }
            }else if(gasImgDetail.stateUrl === "tab.gasBillMain" ) {
                 if(userInfo.meterType == "C" ){
                 bjgasPopup.showPopup("该功能仅对普表-后付费用户开放");
                  }else {
                $state.go(gasImgDetail.stateUrl);
              }
            }else {
                $state.go(gasImgDetail.stateUrl);
            }


                    }
                    return;
                }
                $state.go(gasImgDetail.stateUrl);
            } catch (e) {
                if ('safeCheck' === gasImgDetail.stateUrl) {
                    if (!LoginService.isLogin()) {
                        LoginService.showLogin({
                            onSuccess: onSuccessLogin,
                            onHide: onHideLogin,
                        });
                    } else {
                        $state.go('tab.newReapir');
                    }
                    return;
                }
                bjgasPopup.showShortCenterToast('敬请期待');
            }
        }

        function goSwitchuser() {
            $state.go('tab.switchUser');
        }

        function goBindNumber() {
            $state.go('tab.gasCancelMain');

        }

        function goLogin() {
            if (!LoginService.isLogin()) {
                LoginService.showLogin({
                    onSuccess: onSuccessLogin,
                    onHide: onHideLogin,
                });
            }
        }

        $scope.$on('$ionicView.beforeLeave', function(event) {
            $timeout.cancel(gas.tm1);
        });

    }
})();
;
(function() {
  'use strict';
  angular.module('northGas.classify', [])
    .controller('ClassifyCtrl', ClassifyCtrl);

  /* @ngInject */
  function ClassifyCtrl($ionicScrollDelegate, bjgasHttp, $state, baseConfig, bjgasPopup) {
    var classify = this;
    var selectScroll = $ionicScrollDelegate.$getByHandle('classifyItemsScroll');
    var url = baseConfig.basePath + 'c/api/goods/selectById';
    // var url = 'http://10.211.108.164:8080/bjgas-server/c/api/goods/selectById'; //for test
    var requestParams = {}; //初始化 大类数据 id
    var netClassify = onlinenetwork();
    var scrollLeftTop = '';
    var rememberPositionLeft = [];
    var contentHeight = -92 + document.body.scrollHeight;

    if (ionic.Platform.isIOS()) { //获取出去tab+head的文本内容的高度（ios上要额外去掉一个status-bar：20px）
      contentHeight = -20 + contentHeight;
      classify.scrollHeight = {
        'height': -112 + document.body.scrollHeight + 'px'
      };
    } else {
      classify.scrollHeight = {
        'height': -92 + document.body.scrollHeight + 'px'
      };
    }
    classify.selectItem = [true];
    classify.bigType = []; //左侧大类的数据
    classify.goodsItems = []; //存储商品信息
    classify.switchType = switchType;
    classify.goMessagePage = goMessagePage;
    classify.goGoodsList = goGoodsList;
    classify.reStartNet = false;
    classify.showBgWhite = false;

    //init data info
    var getInitData = function(response) {
      try {
        // for (var i in [1]) { //这里的代码构建是为了方便测试--加倍数据量而方便的
        classify.bigType = [];
        classify.bigType = classify.bigType.concat(response.rows);
        // }
        if (classify.bigType.length > 0) {
          classify.showBgWhite = true;
        }
        classify.goodsItems = response.rows[0].second;
      } catch (e) {}
    };

    netClassify.offLineHandler(function() { //监测断网时的处理
      classify.reStartNet = true;
    });

    if (ionic.Platform.isIOS()) {
      if (navigator.onLine) {
        bjgasPopup.showLoadingWithoutBackdrop('加载中');
        bjgasHttp.post(url).success(function(response) {
          getInitData(response);
        }).error(function(response, status) {}).finally(function() {
          bjgasPopup.hideLoading();
        });
      } else {
        bjgasPopup.showLongCenterToast('请检查网络连接!');
      }
    } else {
      bjgasPopup.showLoadingWithoutBackdrop('加载中');
      bjgasHttp.post(url).success(function(response) {
        getInitData(response);
      }).error(function(response, status) {}).finally(function() {
        bjgasPopup.hideLoading();
      });
    }

    if (ionic.Platform.isIOS()) {
      netClassify.onLineHandler(function() { //监测联网时的处理
        if (classify.reStartNet) {
          if (navigator.onLine && classify.selectItem[0] === true) {
            bjgasPopup.showLoadingWithoutBackdrop('加载中');
            bjgasHttp.post(url).success(function(response) {
              getInitData(response);
            }).error(function(response, status) {}).finally(function() {
              bjgasPopup.hideLoading();
            });
          }
        }
      });
    }
    var dataDeal = function(response, index) {
      classify.goodsItems = [];
      index = index || 0;
      index === 0 ? (classify.goodsItems = response.rows[0].second) : (classify.goodsItems = response.rows);
    };

    //大类切换函数
    function switchType(index, newId, event) {
      var currentClickPosition = event || window.event;
      scrollLeftTop = $ionicScrollDelegate.$getByHandle('classifyItemsScroll').getScrollPosition().top;
      rememberPositionLeft[index] = 48 * Math.ceil(document.getElementById("classifyLeftItems" + index).offsetTop / 48);

      if (document.getElementById("classifyLeftItems" + index).offsetTop > scrollLeftTop) {
        rememberPositionLeft[index] = document.getElementById("classifyLeftItems" + index).offsetTop - scrollLeftTop;
      }

      if (classify.selectItem[index] === true) {} else {
        //--时实计算点击位置距离中间点的偏移量--
        var offsetPosition = 48 * (Math.ceil((currentClickPosition.clientY - contentHeight / 1.7) / 48));

        classify.selectItem = [];
        classify.selectItem[index] = true;
        index === 0 ? (requestParams = '') : ((requestParams = {}) && (requestParams.classId = newId));
        bjgasPopup.showLoadingWithoutBackdrop('加载中');
        bjgasHttp.post(url, requestParams).success(function(response) {
          dataDeal(response, index);
        }).error(function(response, status) {}).finally(function() {
          bjgasPopup.hideLoading();
        });

        if (currentClickPosition.clientY >= contentHeight / 1.8) { //当前点击位置的y坐标大于等于中点位置
          selectScroll.scrollBy(0, offsetPosition, true);
        } else {
          selectScroll.resize();
          selectScroll.scrollBy(0, offsetPosition, true);
        }
      }
    }

    //go 消息列表界面
    function goMessagePage() {
      $state.go('tab.message');
      // if (ionic.Platform.isWebView()) {
      //   bjgasPopup.showShortCenterToast('敬请期待');
      // } else {
      //   alert('敬请期待');
      // }
      // return;
    }

    //go 商品列表界面
    function goGoodsList(classId) {
      $state.go('tab.goodsList', {
        'classId': classId
      });
    }
  }
})();

/**
 * Created by yufei on 16/5/16.
 */

(function() {
  "use strict";
  angular.module('northGas')
    .controller('FirstGuideCtrl', FirstGuideCtrl);

  function FirstGuideCtrl($scope, $state, baseConfig) {
    var FirstGuide = this;

    window.localStorage.needGuide = "false";

    var getHeight = function () {

      var height = document.body.scrollHeight + "";
      if (height == "0") {
      }
      else {
        return height + 'px';
      }

      height = document.body.clientHeight + "";
      if (height == "0") {
      }
      else {
        return height + 'px';
      }

      return '100%';
    };

    FirstGuide.actualHeight = {
      "height": getHeight()
    };

    FirstGuide.clientHeight = 'height: ' + document.body.clientHeight + 'px';

    FirstGuide.skipGuide = function () {
      if (baseConfig.debug) {
        console.log("跳过导航页到登陆页");
      }
      goToMain();
    };

    FirstGuide.toLogin = function () {
      if (baseConfig.debug) {
        console.log("跳过导航页到登陆页");
      }
      goToMain();
    };

    var goToMain = function () {
      $state.go("tab.gas");
    };
}
}());

(function() {
  "use strict";
  angular.module('northGas.login')
    .controller('LoginModalCtrl', LoginModalCtrl);
  /* @ngInject */
  function LoginModalCtrl($scope, $timeout, $ionicSlideBoxDelegate, LoginService, baseConfig) {
    $scope.__modal = true;
    $scope.__modalData = {};

    $scope._handleUpdate = '';
    $scope._handleNextPage = '';
    $scope._handleClose = '';
    $scope._handleChangePage = '';

    // 伪路由，key为伪路由名，value为templateUrl
    $scope.pages = {
      login: 'pages/login-modal/login.html',
      register: 'pages/login-modal/register.html',
      forget: 'pages/mine/app-setting/reset-password/reset-by-sms.html',
      resetByProblem: 'pages/mine/app-setting/reset-password/reset-by-problem.html',
      verify: 'pages/mine/app-setting/reset-password/problem-verify.html',
      verifyResult: 'pages/mine/app-setting/reset-password/problem-verify-result.html',
    };
    $scope.pagesIndex = {
      login: 0,
      register: 1,
      forget: 2,
      resetByProblem: 3,
      verify: 4,
      verifyResult: 5,
    };


    var _loginSlider = $ionicSlideBoxDelegate.$getByHandle('loginModalHd');
    $scope._preIndex = 0;
    $scope._currentIndex = 0;
    $scope._nextIndex = 0;
    $scope._isChangingPage = false;
    $scope._boxStyle = {}; // slideBox需要指定高度，通过ng-style赋予它屏幕高度

    $timeout(function() {
      _loginSlider.enableSlide(false);  // 禁用slidebox
      $scope._boxStyle = { // slideBox需要指定高度，通过ng-style赋予它屏幕高度
        "height": window.screen.height + 'px'
      };
    }, 0);

    if (baseConfig.debug) {
      console.log('LoginModalCtrl modal');
    }

    // 后退，默认后退一页，可后退到合法的指定页。非登录页存在，在左上角
    $scope.prePage = function(index) {
      if (typeof(index) === 'number') { // 是个数字
        if (index % 1 === 0 && index >= 0) { // 是个整数
          if (index < $scope._currentIndex) { // 是个合法的下标
            _loginSlider.slide(index); // 后退到指定页
          } else {
            if (baseConfig.debug) {
              console.log('LoginModalCtrl.prePage: index should be smaller than $scope._currentIndex');
            }
          }
        } else {
          if (baseConfig.debug) {
            console.log('LoginModalCtrl.prePage: index should be a integer');
          }
        }
      } else {
        _loginSlider.previous();
      }
    };

    // 伪路由跳转
    $scope.nextPage = function(stateName) {
      if (typeof(stateName) == 'string') { // 如果传入了字符串
        if ($scope.pages[stateName]) { // 如果这个字符串是一个路由名
          //提前把下一页放出来
          $scope._nextIndex = $scope._currentIndex + 1;
          //重绘slidebox
          $scope._handleUpdate = $timeout(function() {
            _loginSlider.update();
          }, 50);
          //如果进入下一页时，出现一小段时间的白页，原因是在slide的过程中不会渲染页面
          //因为silde的过程需要300毫秒，而延迟100ms甚至10ms都可以避免空白页。注意在update之后
          $scope._handleNextPage = $timeout(function() {
            _loginSlider.slide($scope.pagesIndex[stateName]);
          }, 100);
        } else {
          if (baseConfig.debug) {
            console.log('LoginModalCtrl.nextPage: state name can\'t be find');
          }
        }
      } else {
        if (baseConfig.debug) {
          console.log('LoginModalCtrl.nextPage: invalid typeof state name');
        }
      }
    };

    // 关闭按钮（登录页在左上角，其他页在右上角）
    $scope.closeModal = function() {
      if (baseConfig.debug) {
        console.log('LoginModalCtrl.closeModal. close login modal');
      }
      //当前就是黑色的，所以之前是白色菜需要重新设置颜色
      if($scope.__statusBarColor == 'white') {
        $scope.changeStatusBarColor('black');
      }
      document.getElementsByClassName('modal-backdrop')[0].style['pointer-events'] = 'auto';
      $scope.loginModal.hide();
      $scope._handleClose = $timeout(function() {
        _loginSlider.slide(0, 0);
        $scope._preIndex = 0;
        $scope._currentIndex = 0;
        $scope._nextIndex = 0;
        $scope._isChangingPage = false;
        _loginSlider.update();

        $scope._onLoginRedirUrl = '';
        $scope._onLoginRedirState = '';
        $scope._onLoginRedirStateParams = '';
        $scope._onLoginRedirDelay = 0;
      }, 300);
    };

    // 页面切换监听
    $scope.onSlideChange = function(index) {
      $scope._preIndex = $scope._currentIndex;
      $scope._currentIndex = index;
      $scope._nextIndex = $scope._currentIndex;
      $scope._isChangingPage = true;
      $scope._handleChangePage = $timeout(function(){
        $scope._isChangingPage = false;
      }, 500);
    };

    // 防止连续点击造成多次进栈生成多页
    $scope.canSafeClick = function(){
      if(!$scope._isChangingPage){
        $scope._isChangingPage = true;
        return true;
      } else {
        return false;
      }
    };

    $scope.$on('$destroy', function() {
      $timeout.cancel($scope._handleUpdate);
      $timeout.cancel($scope._handleNextPage);
      $timeout.cancel($scope._handleClose);
      $timeout.cancel($scope._handleChangePage);
    });
  }
}());

// 2016-12-15 created by yufei.lu

(function() {
  "use strict";
  angular.module('northGas.customService')
    .factory('LoginService', LoginService);

  function LoginService(baseConfig) {
    var func = {
      // 略
      bindModal: bindModal,
      // 是否已经登录
      isLogin: isLogin,
      // 显示登录modal。接受一个对象参数
      // {
      //    onSuccess: 登录成功后的回调，modal隐藏动画持续300ms
      //    onHide: modal隐藏后的回调，必定会执行。
      // }
      showLogin: showLogin,
      // modal是否是现实状态
      isShow: isShow,
      //
      hideCallback: hideCallback,
      // 给注册页使用
      bindLoginPageLoginCb: bindLoginPageLoginCb,
      loginPageLogin: loginPageLogin
    };

    var _modal = '';

    var onSuccess = '';
    var onHide = '';
    var showing = false;
    var _loginCb = undefined;

    function bindModal(modal) {
      _modal = modal;
    }

    function bindLoginPageLoginCb(cb){
      if(typeof(cb) === 'function'){
        _loginCb = cb;
      }
    }
    function loginPageLogin(id, pw) {
      if(typeof(_loginCb) === 'function'){
        _loginCb(id, pw);
      } else {
        _loginCb = undefined;
      }
    }

    function getRedir(){
      return {
        onSuccess: onSuccess,
        onHide: onHide
      };
    }

    function resetRedir(){
      onSuccess = '';
      onHide = '';
      showing = false;
    }

    function setRedir(redir){
      if(typeof(redir) === 'object'){
        onSuccess = redir.onSuccess ? redir.onSuccess : '';
        onHide = redir.onHide ? redir.onHide : '';
      } else {
        if(baseConfig.debug){
          console.log('function setRedir(redir) redir is not a object');
        }
      }
    }

    function isLogin(){
      if(window.localStorage.token && window.localStorage.userInfo){
        return true;
      } else {
        window.localStorage.token = '';
        window.localStorage.userInfo = '';
        return false;
      }
    }

    function isShow(){
      return showing;
    }

    function showLogin(redir){
      _modal.show();
      showing = true;
      if(typeof(redir) === 'object'){
        setRedir({
          onSuccess: redir.onSuccess,
          onHide: redir.onHide
        });
      }
    }

    function hideCallback(){
      if(baseConfig.debug){
        console.log('hideCallback');
      }
      if(typeof(onHide) === 'function'){
        onHide();
      }
      if(isLogin()){
        if(typeof(onSuccess) === 'function'){
          onSuccess();
        }
      }
      resetRedir();
    }

    return func;
  }
}());

(function() {
  "use strict";
  angular.module('northGas.login')
    .controller('LoginPageCtrl', LoginPageCtrl);

  function LoginPageCtrl($scope, $state, $timeout, $http, bjgasPopup, bjgasHttp, LoginService, baseConfig, switchUser) {
    if (baseConfig.debug) {
      console.log('LoginPageCtrl');
    }
    var LoginPage = this;

    LoginPage.timeoutHandle = '';

    LoginPage.inputModel = {
      id: '',
      pw: ''
    };
    LoginPage._bgStyle = {
      "height": window.screen.height + 'px'
    };
    var userId = '';

    LoginPage.path = 'pages/login-modal/login.html';
    LoginPage.loginCloseStyle = { "top": "0px" ,"left": "10px"}; // 登录页没有header，因此需要手动布局关闭键

    if (ionic.Platform.isIOS()) { // 登录页没有header，因此需要手动定位关闭键
      LoginPage.loginCloseStyle = { "top": "20px", "left": "10px"};
    }

    LoginPage.forget = function() { // 忘记密码键
      if (baseConfig.debug) {
        console.log('LoginPage.forget');
      }
      if ($scope.__modal) {
        if($scope.canSafeClick()) {
          $scope.nextPage('forget');
        }
      }
    };

    function onLogin(resp){
      if(resp.access_token){
        window.localStorage.token = resp.access_token;
        getId();
      } else {
        bjgasPopup.showPopup('登录失败');
      }
    }
    LoginPage.login = function(id, pw) { // 登录键
      if (baseConfig.debug) {
        console.log('LoginPage.login');
      }
      if(!LoginPage.inputModel.id && !id){
        bjgasPopup.showPopup('请输入手机号');
      } else if(!LoginPage.inputModel.pw && !id) {
        bjgasPopup.showPopup('请输入密码');
      } else {
        bjgasPopup.showLoadingWithoutBackdrop('登录中');
        var _id = LoginPage.inputModel.id + '';
        var _pw = LoginPage.inputModel.pw;

        if(id && pw){
          _id = id + '';
          _pw = pw + '';
        }

        var key = CryptoJS.enc.Utf8.parse(baseConfig.aes_key);
        var iv = CryptoJS.enc.Utf8.parse(baseConfig.aes_iv);
        var encodeId = CryptoJS.AES.encrypt(_id, key, {iv: iv,mode: CryptoJS.mode.CBC});
        var encodePw = CryptoJS.AES.encrypt(_pw, key, {iv: iv,mode: CryptoJS.mode.CBC});

        var str = '?client_id=' + encodeURIComponent(baseConfig.client_id) + '&client_secret=' + encodeURIComponent(baseConfig.client_secret) +
                  '&grant_type=password&username=' + encodeURIComponent(encodeId) + '&password=' + encodeURIComponent(encodePw);
        var url = baseConfig.basePath + 'oauth/token' + str;
        $http({
          method: 'POST',
          headers:{
            'Content-type':"application/x-www-form-urlencoded"
          },
          url: url
        })
        .success(function(resp){
          onLogin(resp);
        })
        .error(function(resp, states){
          if(states == '403'){
            bjgasPopup.showPopup('登录被拒绝');
          } else if(states == '-1') {
            bjgasPopup.showPopup('请检查网络');
          } else if(states == '400') {
            if (resp && typeof(resp) === 'object' && resp.error === 'invalid_grant'){
              if(resp.error_description === 'badCredentials'){
                bjgasPopup.showPopup('用户名或密码错误');
              } else if(resp.error_description.indexOf('ip') !== -1) {
                bjgasPopup.showPopup('密码错误次数过多,ip已被禁用');
              }
            }
          } else {
            bjgasPopup.showPopup('登录失败：' + states);
          }
          $timeout(function(){
            bjgasPopup.hideLoading();
          },1000);
        })
        .finally(function(){

        });
      }
    };
    LoginService.bindLoginPageLoginCb(LoginPage.login);

    function onGetId(resp){
      if(resp.success){
        getInfo(resp.rows[0].userId);
      } else {
        bjgasPopup.showShortCenterToast('获取用户信息失败');
      }
    }
    function getId(){
      var url = baseConfig.basePath + 'i/api/getUserId/' + window.localStorage.token + '';
      if(baseConfig.debug){
        console.log(url);
      }
      bjgasHttp.get(url)
      .success(function(resp){
        if(baseConfig.debug){
          console.log(resp);
        }
        onGetId(resp);
      })
      .error(function(resp){
        bjgasPopup.showShortCenterToast('请求用户id失败');
        if(baseConfig.debug){
          console.log(resp);
        }
        $timeout(function(){
          bjgasPopup.hideLoading();
        },1000);
      });
    }

    function onGetInfo(resp){
      if(resp.success){
        resp.rows[0].userId = userId;
        window.localStorage.userInfo = JSON.stringify(resp.rows[0]);
        userId = '';
        getUserGasListInfo();
      }
    }
    function getInfo(id){
      userId = id;
      var url = baseConfig.basePath + 'i/api/getUserInfo/' + id + '';
      if(baseConfig.debug){
        console.log(url);
      }
      bjgasHttp.get(url)
      .success(function(resp){
        if(baseConfig.debug){
          console.log(resp);
        }
        onGetInfo(resp);
      })
      .error(function(resp){
        bjgasPopup.showShortCenterToast('请求用户信息失败');
        if(baseConfig.debug){
          console.log(resp);
        }
        $timeout(function(){
          bjgasPopup.hideLoading();
        },1000);
      });
    }
    function getUserGasListInfo(){
      switchUser.getUserInfoList(function(res){
        try{
          if (res.rows.legnth === 0) {
            window.localStorage.currentUserInfoGas = JSON.stringify({
              'userId': '',
              'userCode': '',
              'label': '',
              'meterType': '',
              'address': ''
            });
          } else {
            window.localStorage.currentUserInfoGas = JSON.stringify(res.rows[res.rows.length - 1]);
            switchUser.setUserCount(res.rows.length);
          }
        } catch(e) {

        }

        LoginPage.inputModel = {
          id: '',
          pw: ''
        };
        $scope.closeModal();
      },function(){
        $scope.closeModal();
      });
    }

    LoginPage.register = function() { // 注册键
      if (baseConfig.debug) {
        console.log('LoginPage.register');
      }
      if ($scope.__modal) {
        if($scope.canSafeClick()) {
          $scope.nextPage('register');
        }
      }
    };

    $scope.$on('modal.hidden', function(){
      LoginPage.timeoutHandle = $timeout(function(){
        LoginPage.inputModel = {
          id: '',
          pw: ''
        };
        userId = '';
      }, 300);
    });

    $scope.$on('$destroy', function() {
      $timeout.cancel(LoginPage.timeoutHandle);
    });
  }
}());

(function() {
  "use strict";
  angular.module('northGas.login')
    .controller('RegisterCtrl', RegisterCtrl);

  function RegisterCtrl($scope, bjgasPopup, bjgasHttp, baseConfig, LoginService, verifyTimerService) {
    if (baseConfig.debug) {
      console.log('RegisterCtrl');
    }

    var Register = this;

    Register.inputModel = {
      id: '',
      verify: '',
      pw: '',
      pw2: ''
    };

    Register.path = 'pages/login-modal/register.html';
    Register.title = '注册';

    verifyTimerService.on(function(label, flag) { // 绑定计时器的回调，用于获取短信验证码的计时
      Register.verifyLabel = label;
      Register.verifyDisableFlag = flag;
    });

    Register.prePage = function() { // 前一页
      if ($scope.__modal) {
        if($scope.canSafeClick()) {
          $scope.prePage();
        }
      }
    };

    function onSubmit(resp){
      if(resp.success){
        Register.prePage();
        LoginService.loginPageLogin(Register.inputModel.id, Register.inputModel.pw);
        // $scope.closeModal();
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    Register.submit = function() { // 提交注册
      var id = Register.inputModel.id;
      var verify = Register.inputModel.verify;
      var pw = Register.inputModel.pw;
      var pw2 = Register.inputModel.pw2;

      var reg = new RegExp("([A-Z]|[a-z]|[0-9])$");
      var regPhone = new RegExp("[0-9]{11}");

      if (!id) {
        bjgasPopup.showPopup('请输入手机号');
      } else if (!regPhone.test(id)) {
        bjgasPopup.showPopup('您输入的是一个无效的手机号');
      } else if (!verify) {
        bjgasPopup.showPopup('请输入验证码');
      } else if (!pw) {
        bjgasPopup.showPopup('请输入密码');
      } else if (!reg.test(pw)) {
        bjgasPopup.showPopup('不能使用特殊字符');
      } else if (pw.length < 6) {
        bjgasPopup.showPopup('密码长度不足6位');
      } else if (pw != pw2) {
        bjgasPopup.showPopup('请确认两次输入的密码');
      } else {
        if(baseConfig.debug){
          console.log('register');
          console.log(Register.inputModel);
        }
        bjgasPopup.showLoadingWithoutBackdrop('注册中');
        var url = baseConfig.basePath + 'c/api/registerUser';
        var param = {
          mobile: id,
          password: pw,
          code: verify
        };
        bjgasHttp.post(url, param).success(function(response) {
          onSubmit(response);
        }).error(function(response, status) {
          bjgasPopup.showPopup('请求注册失败');
        }).finally(function() {
          bjgasPopup.hideLoading();
        });
      }
    };

    function onVerify(resp) {
      if(resp.success){
        var res = verifyTimerService.clock();
      } else {
        bjgasPopup.showPopup(resp.message);
      }
    }
    Register.verify = function() { // 获取短信验证码
      if (baseConfig.debug) {
        console.log('Register.verify');
      }
      if (!Register.verifyDisableFlag) {
        var regPhone = new RegExp("[0-9]{11}");
        if (!regPhone.test(Register.inputModel.id)){
          bjgasPopup.showPopup('您输入的是一个无效的手机号');
        }
        else {
          bjgasPopup.showLoadingWithoutBackdrop('请求中');
          var url = baseConfig.basePath + 'c/api/getVerificationCode';
          var param = {
            mobile: Register.inputModel.id,
            type: 'register'
          };
          bjgasHttp.post(url, param).success(function(response) {
            onVerify(response);
          }).error(function(response, status) {
            bjgasPopup.showPopup('请求短信验证码失败');
          }).finally(function() {
            bjgasPopup.hideLoading();
          });
        }
      }
    };

    $scope.$on('$destroy', function() {
      if(baseConfig.debug){
        console.log('destroy');
      }
      if(!$scope.__modal){
        verifyTimerService.off();
      }
    });
  }
}());

// 2016-11-18 created by yufei.lu
// 短信验证码计时器，1秒回调一次
(function() {
  "use strict";
  angular.module('northGas')
    .factory('verifyTimerService', verifyTimerService);

  function verifyTimerService($timeout, baseConfig) {
    var func = {
      /**
       * @ngdoc method
       * @name verifyTimerService#on
       * @description 绑定一个接收两个参数(a, b)的回调，a表示计时标签，b表示是否计时中，最多同时绑定一个回调
       * @param {function(timingLabel, isTiming)} 回调函数
       * @returns {boolean} 成功失败
       */
      on: on,
      /**
       * @ngdoc method
       * @name verifyTimerService#off
       * @description 解绑on()所绑定的函数，建议在$destroy事件中解绑
       */
      off: off,
      /**
       * @ngdoc method
       * @name verifyTimerService#clock
       * @description 开始计时
       * @returns {boolean} 失败时返回false
       */
      clock: clock,
      /**
       * @ngdoc method
       * @name verifyTimerService#reset
       * @description 重置
       */
      reset: reset
    };

    var max = 60; // 倒计时时长
    var defaultLabel = '获取验证码'; // 非计时的时候，传给回调的字符串
    var timingLabel = 's'; // 计时的时候，传给回调的字符串形式为：数字 + timingLabel

    var _current = max;
    var _timing = false;
    var _callback;

    function on(c) { // 用于绑定_on()所调用的回调函数
      if (baseConfig.debug) {
        console.log('verifyTimerService.on(). bind a callback.');
      }
      if (typeof(c) === 'function') {
        _callback = c;
        if (!_timing) {
          _on(defaultLabel, _timing);
        } else {
          _on(_current + timingLabel, _timing);
        }
        return true;
      }
      if (baseConfig.debug) {
        console.log('verifyTimerService.on(). can only bind a function.');
      }
      return false;
    }

    function _on(label, timing) { // 每一次clock执行_on()
      if (typeof(_callback) === 'function') {
        _callback(label, timing);
      }
    }


    function off() { // 解绑
      if (baseConfig.debug) {
        console.log('verifyTimerService.off(). unbind that callback.');
      }
      $timeout(function(){
        _on(defaultLabel, _timing);
        _callback = undefined;
      },0);
    }

    function reset() { // 重置计时器
      _current = max;
      _timing = false;
      off();
      return true;
    }

    function clock() { // 启动计时器接口
      if (!_timing) {
        _timing = true;
        _clock();
      }
      if (baseConfig.debug) {
        console.log('verifyTimerService.clock(). Is timing.');
      }
      return false;
    }

    function _clock() { // 启动计时器
      _on(_current + timingLabel, _timing);
      $timeout(function() {
        _current = _current - 1;
        // if (baseConfig.debug) {
        //   console.log(_current);
        // }
        _on(_current + timingLabel, _timing);
        if (_current === 0) {
          _current = max;
          _timing = false;
          _on(defaultLabel, _timing);
        } else {
          _clock();
        }
      }, 1000);
    }

    return func;
  }
}());
(function() {
    'use strict';
    angular.module('northGas.mine')
        .controller('MineCtrl', MineCtrl);

    /* @ngInject */
    function MineCtrl($scope, $state, $timeout, LoginService, switchUser, baseConfig) {
        var mine = this;
        mine.settings = {
            enableFriends: true
        };
        mine.info = {
            'contacts': '',
            'gasCount': '',
            'mobile': '',
        };
        mine.hasInfo = false;
        mine.timeoutHandle = '';

        mine.clickChangeMobile = function() {
            mineClick(function() {
                $state.go('tab.changeMobile');
            });
        };

        mine.clickChangeName = function() {
            mineClick(function() {
                $state.go('tab.changeName');
            });
        };

        mine.clickSetting = function() {
            // mineClick(function(){
            $state.go('tab.appSetting');
            // });
        };
        mine.clickToView = function() {
            mineClick(function() {
                $state.go('tab.panoramicView');
            });
        }
        mine.clickToBind = function() {
            mineClick(function() {
                // console.log('tab.gasCancel');
                $state.go('tab.gasCancel');
            });
        };
        mine.toReceivingAddress = function(){
          mineClick(function() {
              $state.go('tab.addressListFromMine');
          });
        }
        mine.toIntegral = function() {
            $state.go('tab.integralCard');
        }
        mine.toOrder = function(parm) {
            $state.go('tab.myOrderList', { data: parm });
        }


        function mineClick(callback) {
            if (mine.hasInfo) {
                if (typeof(callback) === 'function') {
                    callback();
                } else {
                    if (baseConfig.debug) {
                        console.log('mineClick(callback); callback is not a function.');
                    }
                }
            } else {
                LoginService.showLogin({
                    onSuccess: function() {
                        mine.timeoutHandle = $timeout(function() {
                            // callback();
                        }, 300);
                    }
                });
            }
        }

        function init() {
            if (window.localStorage.userInfo) {
                mine.info = JSON.parse(window.localStorage.userInfo);
                mine.info.gasCount = (typeof(parseInt(switchUser.getUserCount())) === 'number') ? parseInt(switchUser.getUserCount()) : 0;
                mine.hasInfo = true;
                if (baseConfig.debug) {
                    console.log(mine.info);
                }
            } else {
                mine.info = {
                    'contacts': '',
                    'gasCount': '',
                    'mobile': '',
                };
                mine.hasInfo = false;
            }
        }
        $scope.$on('$ionicView.beforeEnter', function() {
            //会出现退出登录后再进入的情景
            init();
        });
        $scope.$on('modal.hidden', function() {
            if (baseConfig.debug) {
                console.log('modal.hidden in tab-mine');
            }
            if ($state.current.name === 'tab.mine') {
                init();
            }
        });
        $scope.$on('$destroy', function() {
            $timeout.cancel(mine.timeoutHandle);
        });
    }
})();

(function (){
  'use strict';
  angular.module('northGas.message')
  .controller('MessageDetailCtrl',MessageDetailCtrl);

  /* @ngInject */
  function MessageDetailCtrl(){
      var msgD = this;
  }

})();

(function() {
  'use strict';
  angular.module('northGas.message')
    .controller('MessageListCtrl', MessageListCtrl);

  /* @ngInject */
  function MessageListCtrl($state) {
    var msgL = this;
    msgL.goDetail = goDetail;

    function goDetail() {
      $state.go('tab.messageDetail');
    }

  }
})();

(function() {
  // 'use strict';
  angular.module('northGas')
    .config(initMessageRoute);

  /* @ngInject */
  function initMessageRoute($stateProvider) {
    $stateProvider
    .state('tab.message', {
      url: '/messageList',
      views: {
        'tab-classify': {
          templateUrl: 'pages/message/list.html',
          controller: 'MessageListCtrl',
          controllerAs: 'msgL'
        }
      }
    })
    .state('tab.messageDetail', {
      url: '/messageList/messageDetail',
      views: {
        'tab-classify': {
          templateUrl: 'pages/message/detail.html',
          controller: 'MessageDetailCtrl',
          controllerAs: 'msgD'
        }
      }
    });
  }
})();

(function() {
  // "use strict";
  angular.module("northGas")
    .config(initAppPayRoute);

  /* @ngInject */
  function initAppPayRoute($stateProvider) {
    $stateProvider
      .state('tab.appPay', {
        url: '/appPay',
        params: {
          goback: -1,
          count:"-",
          payType: "-",
          order:{
            "orderNo": "-",
            "businessType": "-"
          },
          style: {}
        },
        views: {
          'tab-gas': {
            templateUrl: 'pages/pay/pay.html',
            controller: 'AppPayCtrl',
            controllerAs: 'AppPay'
          }
        }
      })
      .state('tab.appPayInvo', {
        url: '/appPayInvo',
        params: {
          goback: -1,
          count:"-",
          payType: "-",
          order:{
            "orderNo": "-",
            "businessType": "-"
          },
          style: {}
        },
        views: {
          'tab-mine': {
            templateUrl: 'pages/pay/pay.html',
            controller: 'AppPayCtrl',
            controllerAs: 'AppPay'
          }
        }
      })
      .state('tab.appPayFromSpCart', {
        url: 'accessOrder/appPay',
        params: {
          goback: -2,
          count:"-",
          payType: "-",
          order:{
            "orderNo": "-",
            "businessType": "-"
          },
          style: {}
        },
        views: {
          'tab-shopping-cart': {
            templateUrl: 'pages/pay/pay.html',
            controller: 'AppPayCtrl',
            controllerAs: 'AppPay'
          },
          style: {}
        }
      })
      .state('tab.appPayFromTabClassify', {
        url: 'appPayFromTabClassify',
        params: {
          goback: -2,
          count:"-",
          payType: "-",
          order:{
            "orderNo": "-",
            "businessType": "-"
          },
          style: {}
        },
        views: {
          'tab-classify': {
            templateUrl: 'pages/pay/pay.html',
            controller: 'AppPayCtrl',
            controllerAs: 'AppPay'
          }
        }
      })
      .state('tab.appPayFromTabStore', {
        url: 'appPayFromTabStore',
        params: {
          goback: -2,
          count:"-",
          payType: "-",
          order:{
            "orderNo": "-",
            "businessType": "-"
          },
          style: {}
        },
        views: {
          'tab-store': {
            templateUrl: 'pages/pay/pay.html',
            controller: 'AppPayCtrl',
            controllerAs: 'AppPay'
          }
        }
      })
      ;
  }
}());

(function() {
  "use strict";
  angular.module('northGas.mine')
    .controller('AppPayCtrl', AppPayCtrl);

  function AppPayCtrl($scope, $state, $stateParams, $ionicHistory, bjgasHttp, bjgasPopup, baseConfig,$ionicPopup) {
    var AppPay = this;

    var paramKey = ['head', 'title', 'subTitleFront', 'subTitleFrontStyle', 'subTitle', 'subTitleStyle', 'count', 'countStyle', 'subCount', 'subCountStyle', 'scrollStyle', 'scrollTitle', 'scrollTitleBarStyle', 'scrollTitleStyle' , 'scrollLineStyle'];
    var paramStyleDefault = {
      "head":{
        "background": "#14a4fa",
      },
      "title": '充值付款',
      "subTitleFront": '订单编号：',
      "subTitleFrontStyle": {
        "padding-top": "40px",
        "text-align": "center",
        "color": "white",
        "font-size": '14px'
      },
      "subTitle": '您需要支付金额',
      "subTitleStyle": {
        "padding-top": "10px",
        "text-align": "center",
        "color": "white",
        "font-size": '14px'
      },
      "count": "0",
      "countStyle": {
        "text-align": 'center',
        "color": "white",
        'margin-top': '14px',
        "font-size": '42px',
        "padding-bottom": "40px"
      },
      "subCount": '元',
      "subCountStyle": {
        "color": "white",
        "font-size": '14px'
      },
      "scrollStyle": {

      },
      "scrollTitle": '选择充值方式',
      "scrollTitleBarStyle": {
        "height":"40px",
        "line-height":"40px",
        "padding-left":"12px",
        "margin-left":"0",
        "margin-right":"0",
        "width":"100%",
        "border-top":"0"
      },
      "scrollTitleStyle": {
        "color": "gray",
        "line-height": '50px'
      },
      "scrollLineStyle": {
        "height": '54px',
        "margin-left": "12px"
      }
    };
    for (var index = 0; index < paramKey.length; index++) {
      $stateParams.style[paramKey[index]] = $stateParams.style[paramKey[index]] ? $stateParams.style[paramKey[index]] : paramStyleDefault[paramKey[index]];
    }

    (baseConfig.debug && console.log($stateParams));
    sessionStorage.payFlag= "false";
    AppPay.ParamStyle = $stateParams.style;
    AppPay.ParamStyle.count = $stateParams.count;
    AppPay.goBackDepth = $stateParams.goback ? $stateParams.goback : -1;

    AppPay.goBack = function() {
      if(baseConfig.debug){
        console.log('goback');
      }
      $ionicHistory.goBack(AppPay.goBackDepth);
    };

    AppPay.headStyle = {};
    if(ionic.Platform.isIOS()){
      AppPay.headStyle = {
        'padding-top': '20px'
      };
    }

    AppPay.order = $stateParams.order;

    AppPay.goPay = function (payType) {
      var url = baseConfig.basePath + 'i/api/orderPay';
      var param = AppPay.order;
      AppPay.order.payType = payType;
      bjgasPopup.showLoadingWithoutBackdrop('支付中');
      bjgasHttp.post(url, param)
      .success(function(resp){
        if(baseConfig.debug){
          console.log(resp);
        }
        if(resp.success){
          if(payType === 'WX'){
            WeixinPay.wxpay(paySuccess, paySuccess, resp.rows[0]);
          } else if(payType === 'ZFB'){
            Alipay.appPay(paySuccess, paySuccess, {"param": resp.rows[0].orderInfo, "appScheme": "alisdkdemo"});
          }
        } else {
          bjgasPopup.showPopup('支付失败：' + (resp.message ? resp.message: '接口异常'));
        }
      })
      .error(function(resp){
        bjgasPopup.showShortCenterToast('请求支付失败');
        if(baseConfig.debug){
          console.log(resp);
        }
      })
      .finally(function(){
        bjgasPopup.hideLoading();
      });
    }

    function paySuccess() {
      // 支付不应该相信本地的回调结果，因此并不关心结果
      (baseConfig.debug && console.log('paySuccess'));
      if( sessionStorage.payOrigin == "recharge"){
        confirm("支付成功?","继续支付","成功",writeCard);
      }else if(sessionStorage.payOrigin == "bills"){
        bjgasPopup.showPopup('支付成功',$ionicHistory.goBack());
      }
    }
    function payFailed() {
      // 支付不应该相信本地的回调结果，因此并不关心结果
      (baseConfig.debug && console.log('payFailed'));
      paySuccess();
    }

    $scope.$on('$ionicView.beforeEnter', function () {

    });

         function writeCard(i){
          //  window.localStorage.token
          if(i == 0){
            return;
          }
           var AppPayVMData =   JSON.parse(sessionStorage.mobileRechargeVMData)
          //  console.log(sessionStorage.mobileRechargeVMData);
          // console.log(AppPayVMData.initInstruct);
          // console.log(AppPayVMData.infoId);


          cordova.plugins.nfc.rechargenfc(success, fail,
                    "00A4040010D1560000014343422F47475359030000",
                    "0020000003000000", //PIN命令
                    AppPayVMData.initInstruct, //充值初始化命令
                    "http://zttest.bjgas.com/bjgas-server/i/api/nfcBuyConfirm/" + AppPayVMData.infoId + "/",window.localStorage.token);
        }
               function success(data) {
                    // console.log(data);
                    // alert("写卡成功");
                    var data1 = JSON.parse(data)
                    if (data1.recharge == undefined) {
                        bjgasPopup.showPopup('写卡失败');
                        confirm("写卡失败","取消","继续写卡",writeCard);
                    } else {
                        bjgasPopup.showPopup('写卡成功');
                 sessionStorage.payFlag = "true";
// console.log(sessionStorage.payFlag);
                    }


                }

                function fail(data) {
                    // console.log(data)
                    bjgasPopup.showPopup('写卡失败');
                    // alert("写卡失败." + data.recharge);
                }
  function confirm(message, falseMess, trueMess, onConfirm) {
            if (!baseConfig.nativeScreenFlag || ionic.Platform.isAndroid()) {
                var confirmPopup = $ionicPopup.confirm({
                    template: typeof(message) === "undefined" ? '提示' : message,
                    cancelText: falseMess,
                    cancelType: 'button-cux-popup-cancel',
                    okText: trueMess,
                    okType: 'button-cux-popup-confirm'
                });
                confirmPopup.then(function(res) {
                    var index = 0;
                    if (res) {
                        index = 1;
                    }
                    if (typeof(onConfirm) === "function") {
                        onConfirm(index);
                    }
                });
            } else {
                navigator.notification.confirm(
                    message,
                    function(index) {
                        if (typeof(onConfirm) === "function") {
                            onConfirm(index - 1);
                        }
                    },
                    '', [falseMess, trueMess]
                );
            }
        }

  }
}());

;
(function() {
  'use strict';
  angular.module('northGas.shoppingCart')
    .controller('ShoppingCartCtrl', ShoppingCartCtrl);

  /* @ngInject */
  function ShoppingCartCtrl($scope, $state, $timeout, bjgasPopup, LoginService, shoppingCartManagerServ, $ionicScrollDelegate, $stateParams) {
    var shopCart = this;
    var getShoppingCartListParams = {
      'page': 1,
      'pagesize': 100,
      'userId': ''
    };
    var editAmountParams = {
      'id': '',
      'editAmount': ''
    };

    var dealShopCartArrayId = []; //存储需要操作的ID数组
    var tempCount = 0; //临时计数变量
    var regCount = /[0-9]/; //购物车数量的正则
    var delCommodityIdArray = []; //删除的购物车id数组
    shopCart.showNoCartImg = false; //默认不显示购物车为空的图片
    shopCart.isFromStore = false; //默认不从商品详情进购物车
    shopCart.isLogin = false; //默认未登录
    shopCart.isEdit = false; //默认是不编辑的
    shopCart.showSvgLoading = false; //默认不显示加载按钮
    shopCart.settleChoiceAll = false; //默认结算不选中全部
    shopCart.editDelChoiceAll = false; //默认编辑不选中全部
    shopCart.actionName = '编辑';
    shopCart.toCommodityDetail = toCommodityDetail;
    shopCart.totalPrice = 0; //默认总价
    shopCart.totalCount = 0; //默认总量
    shopCart.shoppingCartList = [];
    shopCart.dealShopCartArray = []; //需要操作的购物车勾选按钮（☑️）容器
    shopCart.calculateCartCounts = []; //操作购物车每条数据的数量容器
    shopCart.labelSub = []; //左边减号➖按钮样式容器
    shopCart.cartListInfo = {};
    window.StatusBar && StatusBar.styleDefault();

    if ('FROM_STORE' === $stateParams.viewName) {
      shopCart.isFromStore = true; //从商品详情过来
      shopCart.shoppingCartImgLogin = { //设置购物车没有物品时背景区域的高度--从商品跳过来
        'height': window.screen.height - 47 + 'px'
      };
      shopCart.buttonsFooter = {
        'bottom': '0px'
      };
      dealContentBottomFromStore();
    } else {
      shopCart.shoppingCartImgLogin = { //设置未登录状态时与购物车没有物品时背景区域的高度
        'height': window.screen.height - 91 + 'px'
      };
    }

    $ionicScrollDelegate.scrollTop(true);
    shopCart.editOperation = editOperation; //编辑按钮
    shopCart.goLogin = function() {
      if (!LoginService.isLogin()) {
        LoginService.showLogin({
          onSuccess: onSuccessLogin,
          onHide: onHideLogin,
        });
      } else {}
    };

    shopCart.selectCommodityToDel = selectCommodityToDel; //勾选按钮点击方法
    shopCart.selectAll = selectAll;
    shopCart.settle = settle; //结算按钮响应方法
    shopCart.delFromShoppingCart = delFromShoppingCart; //删除按钮响应方法
    shopCart.subCartNumber = subCartNumber; //购物车减号减商品数量
    shopCart.inputCartNumber = inputCartNumber; //输入框失去焦点时改变商品数量
    shopCart.addCartNumber = addCartNumber; //购物车加号增加商品数量

    function dealContentBottomFromStore() {
      if (ionic.Platform.isIOS()) {
        $('.shopping-cart-wrapper').css({
          'bottom': '49px'
        });
      } else {
        $('.shopping-cart-wrapper').css({
          'bottom': '0px'
        });
      }
    }

    function dealContentBottom() {
      if (ionic.Platform.isIOS()) {
        $('.shopping-cart-wrapper').css({
          'bottom': '97px'
        });
      } else {
        $('.shopping-cart-wrapper').css({
          'bottom': '49px'
        });
      }
    }

    function onSuccessLogin() {
      shopCart.isLogin = true; //登录成功
      shopCart.showSvgLoading = true;
      getShoppingCartListParams.userId = JSON.parse(window.localStorage.userInfo).userId;
      shoppingCartManagerServ.getShoppingCartList(successData, errorData, finallData, getShoppingCartListParams);
      dealContentBottom();
    }

    function onHideLogin() {
      shopCart.isLogin = false; //未登录
    }

    function initSelectWrapper() { //初始化购物车勾选按钮的状态
      shopCart.dealShopCartArray = new Array(shopCart.shoppingCartList.length); // 为了创建字符串key数组的length长度
      angular.forEach(shopCart.shoppingCartList, function(item, index) {
        shopCart.dealShopCartArray[item.commodityId] = {
          flag: false,
          money: 0,
          count: item.amount,
          id: 'INIT_STATUS',
          commodityId: 'NONE_SELECT'
        };
        if (item.amount === 1) {
          shopCart.labelSub[item.commodityId] = true;
        } else {
          shopCart.labelSub[item.commodityId] = false;
        }
      });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
      shopCart.isLogin = LoginService.isLogin();
      if (shopCart.isLogin) {
        if ('FROM_STORE' === $stateParams.viewName) {} else {
          dealContentBottom();
        }
        shopCart.showSvgLoading = true;
        getShoppingCartListParams.userId = JSON.parse(window.localStorage.userInfo).userId;
        shoppingCartManagerServ.getShoppingCartList(successData, errorData, finallData, getShoppingCartListParams);
      } else {
        dealContentBottomFromStore();
        $ionicScrollDelegate.scrollTop(true);
      }
    });

    /**
     * @description: 数据请求--各种状态回调处理函数
     * @method 1: successData
     * @method 2: errorData
     * @method 3: finallData
     */
    function successData(res) {
      try {
        if (res.message === '更新成功' && res.success) {
          shopCart.showSvgLoading = true;
          return;
        }
        if (res.message === '删除成功' && res.success) {
          bjgasPopup.showPopup(res.message);
          shopCart.dealShopCartArray = shoppingCartManagerServ.getStorageSelectStatus();
          //清除购物车存service里面删除商品的状态
          angular.forEach(delCommodityIdArray, function(item, index) {
            delete shopCart.dealShopCartArray[item]; //删除字符串key数组的条目
          });
          // shoppingCartManagerServ.setStorageSelectStatus(shopCart.dealShopCartArray);
          calculateStatus();
          shopCart.showSvgLoading = true;
          getShoppingCartListParams.userId = JSON.parse(window.localStorage.userInfo).userId;
          shoppingCartManagerServ.getShoppingCartList(successData, errorData, finallData, getShoppingCartListParams);
          $ionicScrollDelegate.scrollTop(true);
          return;
        }
        if (res && res.rows && res.rows.length >= 0) {
          shopCart.cartListInfo = res.rows[0];
          shopCart.shoppingCartList = [];
          shopCart.shoppingCartList = res.rows[0].cartList;
          angular.forEach(shopCart.shoppingCartList, function(item, index) {
            shopCart.calculateCartCounts[item.commodityId] = Math.floor(item.amount);
          });
          initSelectWrapper();
          if (shoppingCartManagerServ.getStorageSelectStatus().length !== 0 && !shopCart.isEdit) {
            var tempArrayStatus = shoppingCartManagerServ.getStorageSelectStatus();
            for (var i in tempArrayStatus) {
              shopCart.dealShopCartArray[tempArrayStatus[i].commodityId] = tempArrayStatus[i];
            }
            calculateStatus();
          }
        }
      } catch (e) {} finally {}
    }

    function errorData() { //处理失败回调
    }

    function finallData() { //最终状态综合管理
      shopCart.showSvgLoading = false;
      bjgasPopup.hideLoading();
      if (shopCart.shoppingCartList.length === 0) {
        shopCart.showNoCartImg = true;
        shopCart.isEdit = false;
        $('.shopping-cart-wrapper').css({
          'bottom': '0px'
        });
      }
    }

    //重新计算勾选状态
    function calculateStatus() {
      shopCart.totalPrice = 0;
      shopCart.totalCount = 0;
      shopCart.totalPrice = Number(shopCart.totalPrice);
      shopCart.totalCount = Number(shopCart.totalCount);
      for (var i in shopCart.dealShopCartArray) {
        if (shopCart.dealShopCartArray[i].flag) {
          shopCart.totalPrice += Number(shopCart.dealShopCartArray[i].money * shopCart.dealShopCartArray[i].count);
          shopCart.totalCount += Number(shopCart.dealShopCartArray[i].count);
        } else {}
      }
      shopCart.totalPrice = shopCart.totalPrice.toFixed(2);
    }

    function judgeSelectAll() { // 循环查询是否全选
      for (var i in shopCart.dealShopCartArray) {
        if (!shopCart.dealShopCartArray[i].flag) {
          tempCount = 0;
          break;
        } else {
          tempCount++;
          if (tempCount === shopCart.dealShopCartArray.length) {
            if (shopCart.isEdit) {
              shopCart.editDelChoiceAll = true;
            } else {
              shopCart.settleChoiceAll = true;
            }
            tempCount = 0;
          }
        }
      }
    }

    function selectCommodityToDel(index, cartId, commodityId, commodityPrice) {
      shopCart.dealShopCartArray[commodityId].flag = !shopCart.dealShopCartArray[commodityId].flag;
      shopCart.totalPrice = Number(shopCart.totalPrice);
      shopCart.totalCount = Number(shopCart.totalCount);
      if (shopCart.dealShopCartArray[commodityId].flag) { //判断当前勾选框是否选中
        shopCart.dealShopCartArray[commodityId].id = cartId;
        shopCart.dealShopCartArray[commodityId].commodityId = commodityId;
        shopCart.dealShopCartArray[commodityId].money = commodityPrice;
        if (shopCart.actionName === '编辑') {
          shopCart.totalCount += Number(shopCart.dealShopCartArray[commodityId].count);
          shopCart.totalPrice += Number(shopCart.dealShopCartArray[commodityId].money * shopCart.dealShopCartArray[commodityId].count);
          shopCart.totalPrice = shopCart.totalPrice.toFixed(2);
        } else {}
        judgeSelectAll();
      } else {
        shopCart.dealShopCartArray[commodityId].id = 'INIT_STATUS';
        shopCart.dealShopCartArray[commodityId].commodityId = 'NONE_SELECT';
        if (shopCart.actionName === '编辑') {
          shopCart.totalCount -= Number(shopCart.dealShopCartArray[commodityId].count);
          shopCart.totalPrice -= Number(shopCart.dealShopCartArray[commodityId].money * shopCart.dealShopCartArray[commodityId].count);
          shopCart.totalPrice = shopCart.totalPrice.toFixed(2);
        } else {}
        shopCart.editDelChoiceAll = false;
        shopCart.settleChoiceAll = false;
      }

      if (shopCart.actionName === '编辑') {
        shoppingCartManagerServ.setStorageSelectStatus(shopCart.dealShopCartArray);
      } else {}
    }

    function editOperation() {
      shopCart.isEdit = !shopCart.isEdit;
      if (shopCart.isEdit) {
        shopCart.actionName = '完成';
        shopCart.editDelChoiceAll = false;
        initSelectWrapper();
      } else {
        shopCart.actionName = '编辑';
        shopCart.dealShopCartArray = shoppingCartManagerServ.getStorageSelectStatus();
      }
    }

    function toCommodityDetail(commodityId) {
      $state.go('tab.goodsDetailFromShopCart', {
        'commodityId': commodityId
      });
    }

    function selectAll(name) {
      shopCart.totalPrice = Number(shopCart.totalPrice);
      shopCart.totalCount = Number(shopCart.totalCount);
      if (name === 'settle') {
        shopCart.settleChoiceAll = !shopCart.settleChoiceAll;
        if (shopCart.settleChoiceAll) {
          angular.forEach(shopCart.shoppingCartList, function(item, index) {
            shopCart.dealShopCartArray[item.commodityId].flag = true;
            shopCart.dealShopCartArray[item.commodityId].id = item.id;
            shopCart.dealShopCartArray[item.commodityId].commodityId = item.commodityId;
            shopCart.dealShopCartArray[item.commodityId].money = item.commodityPrice;
            shopCart.dealShopCartArray[item.commodityId].count = item.amount;
            shopCart.totalPrice += Number(shopCart.dealShopCartArray[item.commodityId].money * shopCart.dealShopCartArray[item.commodityId].count);
            shopCart.totalCount += Number(shopCart.dealShopCartArray[item.commodityId].count);
          });
          shopCart.totalPrice = shopCart.totalPrice.toFixed(2);
        } else {
          shopCart.totalPrice = 0;
          shopCart.totalCount = 0;
          initSelectWrapper();
        }
        shoppingCartManagerServ.setStorageSelectStatus(shopCart.dealShopCartArray);

      } else if (name === 'editDel') {
        shopCart.editDelChoiceAll = !shopCart.editDelChoiceAll;
        if (shopCart.editDelChoiceAll) {
          angular.forEach(shopCart.shoppingCartList, function(item, index) {
            shopCart.dealShopCartArray[item.commodityId].flag = true;
            shopCart.dealShopCartArray[item.commodityId].id = item.id;
            shopCart.dealShopCartArray[item.commodityId].commodityId = item.commodityId;
          });
        } else {
          initSelectWrapper();
        }
      }
    }

    function settle() {
      dealShopCartArrayId = [];
      for (var k in shopCart.dealShopCartArray) {
        if (shopCart.dealShopCartArray[k].id !== 'INIT_STATUS') {
          dealShopCartArrayId.push(shopCart.dealShopCartArray[k].id);
        }
      }

      if (dealShopCartArrayId.length === 0) {
        bjgasPopup.showPopup('请先选择需要操作的商品!');
        return;
      }

      // 待扩展
      $state.go('tab.accessOrder', {
        'ordersAboutInfo': {
          'cartIds': dealShopCartArrayId,
          'commodityId': '',
          'totalPrice': shopCart.totalPrice,
          'totalCount': shopCart.totalCount
        }
      });
    }

    function actionDelCart(buttonIndex) {
      if (buttonIndex === 1) { //确认按钮
        bjgasPopup.showLoading('正在删除...');
        shoppingCartManagerServ.delFromShoppingCart(successData, errorData, finallData, {
          'ids': dealShopCartArrayId
        });
      } else { //取消按钮
        return;
      }
    }

    function delFromShoppingCart() {
      dealShopCartArrayId = [];
      delCommodityIdArray = [];
      for (var j in shopCart.dealShopCartArray) {
        if (shopCart.dealShopCartArray[j].id !== 'INIT_STATUS') {
          dealShopCartArrayId.push(shopCart.dealShopCartArray[j].id);
        }
        if (shopCart.dealShopCartArray[j].commodityId !== 'NONE_SELECT') {
          delCommodityIdArray.push(shopCart.dealShopCartArray[j].commodityId);
        }
      }

      if (dealShopCartArrayId.length === 0) {
        bjgasPopup.showPopup('请先选择需要操作的商品!');
        return;
      }

      if (ionic.Platform.isWebView()) {
        bjgasPopup.confirm('确认要删除这' + dealShopCartArrayId.length + '条商品吗？', actionDelCart);
      } else {
        bjgasPopup.showLoading('正在删除...');
        shoppingCartManagerServ.delFromShoppingCart(successData, errorData, finallData, {
          'ids': dealShopCartArrayId
        });
      }
    }

    function initCartAmountDeal(id, money) { //初始化购物车每条数据的状态集
      shopCart.totalPrice = Number(shopCart.totalPrice);
      shopCart.totalCount = Number(shopCart.totalCount);
      shopCart.dealShopCartArray[id].money = money;
      shopCart.dealShopCartArray[id].flag = true;
    }

    /**
     * @description: 这里的三个操作购物车数量的函数存在一个bug,(需要响应速度很快)如果失败的话表面上的数量和钱就不对了
     */
    function subCartNumber(commodityId, money, cartId) {
      var newCount = Math.floor(shopCart.dealShopCartArray[commodityId].count); //避免带小数和字符过来
      if (newCount > 1) {
        --newCount;
        initCartAmountDeal(commodityId, money);
        shopCart.calculateCartCounts[commodityId] = newCount;
        shopCart.dealShopCartArray[commodityId].count = newCount;
        if (shopCart.dealShopCartArray[commodityId].id === 'INIT_STATUS') { //未勾选中该条条目时
          shopCart.dealShopCartArray[commodityId].id = cartId;
          shopCart.dealShopCartArray[commodityId].commodityId = commodityId;

          if (shopCart.totalCount === 0) { //如果没有任何其他条目勾选☑️
            shopCart.totalCount = newCount;
            shopCart.totalPrice = Number(shopCart.dealShopCartArray[commodityId].money * newCount);
          } else { //如果有任何一条其他条目勾选中了
            shopCart.totalCount += newCount;
            shopCart.totalPrice += Number(shopCart.dealShopCartArray[commodityId].money * newCount);
          }
        } else {
          shopCart.totalCount--;
          shopCart.totalPrice -= Number(shopCart.dealShopCartArray[commodityId].money);
        }

        editAmountParams.id = cartId;
        editAmountParams.editAmount = '-1';
        shoppingCartManagerServ.updataCartNumber(successData, errorData, finallData, editAmountParams);
        shopCart.totalPrice = shopCart.totalPrice.toFixed(2);
        if (newCount === 1) {
          newCount = 1;
          shopCart.labelSub[commodityId] = true;
        }
      } else if (newCount === 1) {
        shopCart.labelSub[commodityId] = true;
      }

      if (shopCart.actionName === '编辑') {
        judgeSelectAll();
        shoppingCartManagerServ.setStorageSelectStatus(shopCart.dealShopCartArray);
      } else {}
      // newCount > 1 && newCount-- === 1 && (newCount = 1); //这里是极简的短路写法
    }

    function inputCartNumber(commodityId, money, cartId) {
      var currentCount = Math.floor(shopCart.dealShopCartArray[commodityId].count); //避免带小数和字符过来
      shopCart.calculateCartCounts[commodityId] = Math.floor(shopCart.calculateCartCounts[commodityId]);
      if (regCount.test(shopCart.calculateCartCounts[commodityId])) {
        if (shopCart.calculateCartCounts[commodityId] === 0 || shopCart.calculateCartCounts[commodityId] === 1) {
          shopCart.calculateCartCounts[commodityId] = 1;
          shopCart.labelSub[commodityId] = true;
        } else {
          shopCart.labelSub[commodityId] = false;
        }
      } else {
        bjgasPopup.showPopup('您输入的是无效的购物车数量!');
        shopCart.calculateCartCounts[commodityId] = '';
        return;
      }

      initCartAmountDeal(commodityId, money);
      shopCart.dealShopCartArray[commodityId].id = cartId;
      shopCart.dealShopCartArray[commodityId].commodityId = commodityId;

      editAmountParams.id = cartId;
      editAmountParams.editAmount = shopCart.calculateCartCounts[commodityId] - currentCount;
      shoppingCartManagerServ.updataCartNumber(successData, errorData, finallData, editAmountParams);

      shopCart.dealShopCartArray[commodityId].count = shopCart.calculateCartCounts[commodityId];
      if (shopCart.actionName === '编辑') {
        judgeSelectAll();
        shoppingCartManagerServ.setStorageSelectStatus(shopCart.dealShopCartArray);
      } else {}
    }

    function addCartNumber(commodityId, money, cartId) {
      editAmountParams.id = cartId;
      editAmountParams.editAmount = '1';
      var newCount = Math.floor(shopCart.dealShopCartArray[commodityId].count); //避免带小数和字符过来
      initCartAmountDeal(commodityId, money);
      if (shopCart.dealShopCartArray[commodityId].id === 'INIT_STATUS') { //未勾选中任何条目时
        shopCart.totalCount += newCount;
        shopCart.totalPrice += Number(shopCart.dealShopCartArray[commodityId].money * newCount);
      }
      shopCart.dealShopCartArray[commodityId].id = cartId;
      shopCart.dealShopCartArray[commodityId].commodityId = commodityId;
      shopCart.calculateCartCounts[commodityId] = ++newCount;
      shopCart.dealShopCartArray[commodityId].count = newCount;
      shopCart.labelSub[commodityId] = false;
      shopCart.totalCount++;
      shopCart.totalPrice += Number(shopCart.dealShopCartArray[commodityId].money);
      shopCart.totalPrice = shopCart.totalPrice.toFixed(2);
      shoppingCartManagerServ.updataCartNumber(successData, errorData, finallData, editAmountParams);
      if (shopCart.actionName === '编辑') {
        judgeSelectAll();
        shoppingCartManagerServ.setStorageSelectStatus(shopCart.dealShopCartArray);
      } else {}
    }
  }
}());

;
(function() {
  'use strict';
  angular.module('northGas').
  factory('shoppingCartManagerServ', shoppingCartManagerServ);

  /* @ngInject */
  function shoppingCartManagerServ(baseConfig, bjgasHttp, bjgasPopup) {
    var listCartUrl = baseConfig.basePath + 'i/api/listCart'; //购物车列表
    var addCartUrl = baseConfig.basePath + 'i/api/addCart'; //添加到购物车
    var delCartUrl = baseConfig.basePath + 'i/api/delCart'; //删除购物车
    var updataCartNumberUrl = baseConfig.basePath + 'i/api/editAmount'; //更新每个商品在购物车的数量
    var writeOrderUrl = baseConfig.basePath + 'i/api/order/sureOrder'; //填写订单信息
    var createOrderUrl = baseConfig.basePath + 'i/api/createOrder'; //创建订单信息
    var delShopCartArray = []; //存储购物车选中状态

    /**
     * @ngdoc method
     * @name shoppingCartManagerServ
     * @description 操作购物车接口集合,暴露六个接口出去
     * @param {function} 加载成功后的回调.
     * @param {function} 加载失败后的回调.
     * @param {function} 加载最终执行的回调.
     * @param {object}  post请求需要传入的参数.
     */

    var shoppingCartManager = {
      getShoppingCartList: getList,
      addToShoppingCart: addToShoppingCart,
      delFromShoppingCart: delFromShoppingCart,
      setStorageSelectStatus: setStorageSelectStatus,
      getStorageSelectStatus: getStorageSelectStatus,
      updataCartNumber: updataCartNumber,
      writeOrder: writeOrder,
      createOrder: createOrder
    };

    var getData = function(dealSuccess, dealError, dealFinally, url, params) {
      if (typeof dealSuccess === 'function' &&
        typeof dealError === 'function' && typeof dealFinally === 'function') {
        bjgasHttp.post(url, params).success(function(res) {
          return dealSuccess(res);
        }).error(function(err) {
          return dealError();
        }).finally(function() {
          bjgasPopup.hideLoading();
          return dealFinally();
        });
      }
    };

    function getList(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, listCartUrl, params);
    }

    function addToShoppingCart(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, addCartUrl, params);
    }

    function delFromShoppingCart(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, delCartUrl, params);
    }

    function setStorageSelectStatus(newStatusArray) {
      delShopCartArray = newStatusArray;
    }

    function getStorageSelectStatus() {
      return delShopCartArray;
    }

    function updataCartNumber(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, updataCartNumberUrl, params);
    }

    function writeOrder(dealSuccess, dealError, dealFinally, params) {
      getData(dealSuccess, dealError, dealFinally, writeOrderUrl, params);
    }

    function createOrder(dealSuccess, dealError, dealFinally, params){
      getData(dealSuccess, dealError, dealFinally, createOrderUrl, params);
    }

    return shoppingCartManager;
  }
}());

(function() {
  'use strict';
  angular.module('northGas.store')
    .controller('StoreCtrl', StoreCtrl);

  /* @ngInject */
  function StoreCtrl($scope, baseConfig, goodsServ, $ionicSlideBoxDelegate, $state, $ionicScrollDelegate, $timeout) {
    var store = this;

    store.showLoading = true;
    store.showSpinnerBox = true;

    store.toCommonSearchPage = toCommonSearchPage; //去公共的搜索页面🔍
    store.goCommodityDetail = goCommodityDetail; //去商品详情界面
    store.goCommodityList = goCommodityList; //去商品小类列表界面
    store.scrollWatch = scrollWatch; //y轴位置检测函数

    (function() {
      goodsServ.getStoreInfo(successData, errorData, finallData);
    }());

    function scrollWatch() {
      try {
        var actualYPostion = $ionicScrollDelegate.$getByHandle('mainStoreScroll').getScrollPosition().top;
        if (actualYPostion < 30) {
          window.StatusBar && StatusBar.styleLightContent();
          $('.store-header').css({
            'background': 'transparent',
            'boxShadow': 'none'
          });
        } else if (actualYPostion >= 30 && actualYPostion < 45) {
          window.StatusBar && StatusBar.styleLightContent();
          $('.store-header').css({
            'background': 'rgba(255,255,255,0.8)',
            'boxShadow': 'none'
          });
        } else if (actualYPostion >= 45 && actualYPostion <= 60) {
          window.StatusBar && StatusBar.styleLightContent();
          $('.store-header').css({
            'background': 'rgba(255,255,255,0.9)',
            'boxShadow': 'none'
          });
        } else {
          window.StatusBar && StatusBar.styleDefault();
          $('.store-header').css({
            'background': 'rgba(255,255,255,0.95)',
            'boxShadow': 'rgb(221, 221, 221) 1px 1px 30px'
          });
        }
      } catch (e) {}
    }

    /**
     * @description: 数据请求--各种状态回调处理函数
     * @method 1: successData
     * @method 2: errorData
     * @method 3: finallData
     */
    function successData(res) {
      try {
        if (res && res.rows && res.rows.length >= 0) {
          store.bannerList = res.rows[0].picList;
          store.classList = res.rows[0].classList;
          store.classCommodityList = res.rows[0].classCommodityList;
          $ionicSlideBoxDelegate.update(); //用于刷新box
          $ionicSlideBoxDelegate.loop(true);

          $timeout(function() {
            var storeSlideBox = document.getElementById('store_slide');
            storeSlideBox.style.height = '34.5%';
            if (storeSlideBox.style.height == '0') {
              storeSlideBox.style.height = '190px';
            }
          }, 0);
        }
      } catch (e) {} finally {}
    }

    function errorData() { //处理失败回调
    }

    function finallData() { //最终状态综合管理
      store.showLoading = false;
      store.showSpinnerBox = false;
    }

    function toCommonSearchPage() {
      $state.go('tab.storeCommodityCommonSearch');
    }

    function goCommodityDetail(commodityId) {
      //ps: 后面轮播图只有2张的时候需要做特殊的处理
      $state.go('tab.goodsDetailFromStore', {
        'commodityId': commodityId
      });
    }

    function goCommodityList(classId) {
      $state.go('tab.goodsListFromStore', {
        'classId': classId
      });
    }
  }
})();

(function() {
  'use strict';
  angular.module('northGas')
    .config(initSwitchUser);

  /* @ngInject */
  function initSwitchUser($stateProvider) {
    $stateProvider
    .state('tab.switchUser', {
      url: '/gas/switchUser',
      views: {
        'tab-gas': {
          templateUrl: 'pages/switch-user/user-switch.html',
          controller: 'SwitchUserCtl',
          controllerAs: 'swUr'
        }
      }
    })
  .state('tab.switchUserMine', {
      url: '/mine/switchUserMine',
      views: {
        'tab-mine': {
          templateUrl: 'pages/switch-user/user-switch.html',
          controller: 'SwitchUserCtl',
          controllerAs: 'swUr'
        }
      }
    });
  }
})();

(function() {
  'use strict';
  angular.module('base.config').
  factory('switchUser', switchUser);

  /* @ngInject */
  function switchUser(baseConfig, bjgasHttp, bjgasPopup) {
    var userUrl = baseConfig.basePath + 'i/api/getUserGasList/';
    var switchUserItem = {
      'userId': '',
      'userCode': '',
      'label': '',
      'meterType': '',
      'address': ''
    };
    var userInfo = {
      getUserInfoList: getUserInfoList,
      setUserInfo: setUserInfo,
      getUserInfo: getUserInfo,
      setUserCount: setUserCount,
      getUserCount: getUserCount
    };
    return userInfo;

    function getUserInfoList(dealUserInfo, errorUserInfo) {
      if (window.localStorage.userInfo) {
        userUrl = baseConfig.basePath + 'i/api/getUserGasList/';
        userUrl += JSON.parse(window.localStorage.userInfo).userId;
      } else {}
      bjgasHttp.get(userUrl).success(function(response) {
        return dealUserInfo(response);
      }).error(function(error) {
        return errorUserInfo();
      }).finally(function() {
        bjgasPopup.hideLoading();
      });
    }

    function setUserInfo(item) {
      window.localStorage.currentUserInfoGas = JSON.stringify(item);
    }

    function getUserInfo() {
      try {
        return JSON.parse(window.localStorage.currentUserInfoGas);
      } catch (e) {
        return switchUserItem;
      }
    }

    function setUserCount(num) {
      window.localStorage.currentUserInfoGasLength = num;
    }

    function getUserCount() {
      if (window.localStorage.currentUserInfoGasLength) {} else {
        window.localStorage.currentUserInfoGasLength = 0;
      }
      return window.localStorage.currentUserInfoGasLength;
    }
  }
}());

(function() {
  'use strict';

  angular.module('base.config').
  controller('SwitchUserCtl', SwitchUserCtl);

  /* @ngInject */
  function SwitchUserCtl($scope, baseConfig, bjgasPopup, $ionicHistory, switchUser) {

    var swUr = this;
    swUr.userList = [];
    swUr.goSwitchUser = goSwitchUser;

    function goSwitchUser(index) {
      switchUser.setUserInfo(swUr.userList[index]);
      $ionicHistory.goBack();
    }

    function dealUserInfo(res) {
      swUr.userList = res.rows;
    }

    function errorUserInfo(){
      swUr.userList = [];
    }

    bjgasPopup.showLoadingWithoutBackdrop('加载中...');
    switchUser.getUserInfoList(dealUserInfo,errorUserInfo);

    //用于销毁不必要的timer|监听器
    $scope.$on('$destroy', function(event) {});
  }

}());

/**
 * Created by daiwen on 16/8/30.
 */
(function() {
  "use strict";
  angular.module('base.config').controller('TabsCtrl', TabsCtrl);
  /* @ngInject */
  function TabsCtrl($scope, $rootScope, $ionicModal, $state, $ionicHistory, $timeout, bjgasLoadImage, LoginService, baseConfig) {
    // 敬请期待modal
    $ionicModal.fromTemplateUrl('pages/tab/lock-modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.lockModal = modal;
    });
    $scope.holder = {
      'width': window.screen.width + 'px',
      'height': (window.screen.height - window.screen.width) / 2 - 60 + 'px'
    };
    $scope.reminderStyle = {
      'width': window.screen.width + 'px',
      'height': window.screen.width + 'px'
    };

    $scope.timeoutHandle = '';
    // login modal 因为登录modal需要在各个地方调用，那么应该作为一个’单例‘，因此放在TabsCtrl，只会创建出一个
    $ionicModal.fromTemplateUrl('pages/login-modal/login-modal.html', {
      scope: $scope,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.loginModal = modal;
      LoginService.bindModal(modal);
    });
    $scope.$on('modal.shown', function() {
      $scope.timeoutHandle = $timeout(function() {
        if (LoginService.isShow()) {
          if ($scope.__statusBarColor === 'white') {
            $scope.changeStatusBarColor('black');
          }
          document.getElementsByClassName('modal-backdrop')[0].style['pointer-events'] = 'none';
        }
      }, 500);
    });
    $scope.$on('modal.hidden', function() {
      LoginService.hideCallback();
    });
    $scope.$on('$destroy', function() {
      $timeout.cancel($scope.timeoutHandle);
      $scope.loginModal.remove();
    });
    //  $scope.isLogin()是否已经登陆
    $scope.isLogin = function() {
      return LoginService.isLogin();
    };

    // load img
    var needLoads = [
      'img/login-modal/BG@2x.png',
      'img/reminder@3x.png',
      'img/gas@3x.png',
      'img/gas-press@3x.png',
      'img/store@3x.png',
      'img/store-press@3x.png',
      'img/classify@3x.png',
      'img/classify-press@3x.png',
      'img/shop-cart@3x.png',
      'img/shop-cart-press@3x.png',
      'img/mine@3x.png',
      'img/mine-press@3x.png'
    ];
    for (var iNeed = 0; iNeed < needLoads.length; iNeed++) {
      bjgasLoadImage.load(needLoads[iNeed]);
    }

    // 变换状态栏颜色（black or white
    $scope.changeStatusBarColor = function(color) {
      if (window.StatusBar && color) {
        if (color === 'white') {
          // 颜色记录下来时因为登陆modal需要设置黑色，当登陆modal收起来时，需要把颜色恢复回来
          $scope.__statusBarColor = 'white';
          StatusBar.styleLightContent();
        } else if (color === 'black') {
          $scope.__statusBarColor = 'black';
          StatusBar.styleDefault();
        }
      }
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.beforeEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename != 'tab.gas' && statename != 'tab.store' &&
        statename != 'tab.classify' && statename != 'tab.shoppingCart' && statename != 'tab.mine') {
        $scope.hideTabs = true;
      }
      // 各tabs状态栏颜色
      if (statename == 'tab.gas') {
        $scope.changeStatusBarColor('black');
      }
      if (statename == 'tab.store') {
        $scope.changeStatusBarColor('white');
      }
      if (statename == 'tab.classify') {
        $scope.changeStatusBarColor('black');
      }
      if (statename == 'tab.shoppingCart') {
        $scope.changeStatusBarColor('black');
      }
      if (statename == 'tab.mine') {
        $scope.changeStatusBarColor('black');
      }
      // 各tabs状态栏颜色 end
    });

    $scope.$on('$ionicView.afterEnter', function() {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.afterEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename === 'tab.gas' || statename === 'tab.store' ||
        statename === 'tab.classify' || statename === 'tab.shoppingCart' || statename === 'tab.mine') {
        $ionicHistory.clearHistory();
        $scope.hideTabs = false;
      }
    });
  }
})();
