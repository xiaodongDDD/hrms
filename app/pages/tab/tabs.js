/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('loginModule').controller('TabsCtrl',
  ['$scope', '$rootScope', '$state', 'baseConfig', 'TabsService','hmsCacheService','messageService',
    function ($scope, $rootScope, $state, baseConfig, TabsService,hmsCacheService,messageService) {

      $scope.cacheImgList = [];
      $scope.cacheImgList.push({"url": "build/img/application/carpooling/Bar@3x.png"});
      $scope.cacheImgList.push({"url": "build/img/tabs/message-G@3x.png"});
      $scope.cacheImgList.push({"url": "build/img/tabs/message-f@3x.png"});
      $scope.cacheImgList.push({"url": "build/img/tabs/application-F@3x.png"});
      $scope.cacheImgList.push({"url": "build/img/tabs/contact-B@3x.png"});
      $scope.cacheImgList.push({"url": "build/img/tabs/mine-B@3x.png"});
      $scope.cacheImgList.push({"url": "build/img/myInfo/background.png"});
      $scope.cacheImgList.push({"url": "build/img/myInfo/man-portrait.png"});
      $scope.cacheImgList.push({"url": "build/img/myInfo/woman-portrait.png"});
      if (window.localStorage.myInfoImg && window.localStorage.myInfoImg != '') {
        $scope.cacheImgList.push({"url": window.localStorage.myInfoImg + ""});
        hmsCacheService.loadImageCache(window.localStorage.myInfoImg, function () {
          messageService.setMyInfoImageCacheFlag(true);
        });
      }

      $scope.hasCrm = !baseConfig.appStoreFlag;

      $scope.showGuideFlag;

      $scope.buttonTapped = function () {
        $scope.showGuideFlag = false;
      }

      if(baseConfig){
        console.log('window.localStorage.neeGuideHelp ' + window.localStorage.neeGuideHelp);
        console.log('window.localStorage.guideHelpAuto ' + window.localStorage.guideHelpAuto);
      }

      if(!window.localStorage.neeGuideHelp || window.localStorage.neeGuideHelp == "true" || window.localStorage.guideHelpAuto == "true"){
        window.localStorage.neeGuideHelp = "false";
        $scope.showGuideFlag = true;
      }else{
      }

      $scope.$on('$ionicView.beforeEnter', function () {
        var statename = $state.current.name;
        if (baseConfig.debug) {
          console.log('$ionicView.beforeEnter statename ' + statename);
        }
        //tabs中存在的主页面不需要隐藏，hidetabs=false
        if (statename != 'tab.message' && statename != 'tab.application' &&
          statename != 'tab.contact' && statename != 'tab.myInfo' && statename != 'tab.contactCrm') {
          $scope.hideTabs = true;
        } else {
          if (TabsService.getManualReturnFlag() === true) {
            $scope.hideTabs = false;
          }
        }
        TabsService.setManualReturnFlag(false);
      });

      $scope.$on('$ionicView.afterEnter', function () {
        var statename = $state.current.name;
        if (baseConfig.debug) {
          console.log('$ionicView.afterEnter statename ' + statename);
        }
        //tabs中存在的主页面不需要隐藏，hidetabs=false
        if (statename === 'tab.message' || statename === 'tab.application' ||
          statename === 'tab.contact' || statename === 'tab.myInfo' || statename === 'tab.contactCrm') {
          $scope.hideTabs = false;
        }
      });
    }]);
