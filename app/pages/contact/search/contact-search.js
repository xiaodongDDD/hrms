/**
 * Created by wolf on 2016/7/6. (-wen.dai-)
 */
'use strict';
//--通讯录搜索模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.contactSearch', {
          url: 'contact/contactSearch',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/search/contact-search.html',
              controller: 'employeeSearchCtl'
            }
          }
        });
    }]);

angular.module('contactModule')
  .controller('employeeSearchCtl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsPopup',
    '$state',
    '$ionicActionSheet',
    'contactService',
    '$timeout',
    'hmsHttp',
    '$ionicHistory',
    'commonContactService',
    '$rootScope',
    '$cordovaActionSheet',
    '$sce',
    '$q',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsPopup,
              $state,
              $ionicActionSheet,
              contactService,
              $timeout,
              hmsHttp,
              $ionicHistory,
              commonContactService,
              $rootScope,
              $cordovaActionSheet,
              $sce,
              $q) {
      /**
       * var section
       */

      {
        $scope.showInfinite = false; //默认隐藏无限滚动的标签
        $scope.contactLoading = false; //默认不显示loading加载
        $scope.showHistory = true; //默认显示搜索历史
        $scope.showClear = false; //默认隐藏搜索框的清楚按钮
        $scope.resultList = []; //存储搜索结果
        $scope.contactKey = {getValue: ''}; //绑定输入的关键字
        $scope.historys = []; //存储搜索历史的关键字
        $scope.newPage = 0;
        var DB_NAME = 'key_history1';
        var getEmployeeUrl = baseConfig.queryPath + '/staff/query';
        var employeeParams = {"key": "", "page": 1, "pageSize": "10"};
        var LINK_MAN = 'common_linkman2';
        var item = document.getElementById("employeeInputSearch");
        $scope.historys = unique_better(storedb(DB_NAME).find(), 'historyItem');
        if ($scope.historys.length > 10) {
          $scope.historys = $scope.historys.slice(0, 10);
        }
      }

      $scope.$on('$ionicView.afterEnter', function () { //初始化input框-自动聚焦
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        if (ionic.Platform.isAndroid()) {
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 400);
        } else {
          item.focus();
          $scope.$apply();
        }
      });

      function dealHistory(newEmployee) { //存储成功搜索历史记录的方法
        storedb(DB_NAME).remove({historyItem: newEmployee}, function (err) {
          if (!err) {
          } else {
            hmsPopup.showShortCenterToast(err);
          }
        });
        storedb(DB_NAME).insert({historyItem: newEmployee}, function (err) {
          if (!err) {
            $scope.historys = unique_better(storedb(DB_NAME).find(), 'historyItem');
          } else {
            hmsPopup.showShortCenterToast(err);
          }
        });
        if ($scope.historys.length > 10) {
          $scope.historys = $scope.historys.slice(0, 10);
        }
      };

      function dealCommonLinkMan(newObject) { //存储常用联系人最多15个
        storedb(LINK_MAN).insert(newObject, function (err) {
          if (!err) {
            $scope.customContactsInfo = unique_better(storedb(LINK_MAN).find(), 'employeeNumber');
          } else {
            hmsPopup.showShortCenterToast(err);
          }
        });
        if ($scope.customContactsInfo.length > 15) {
          $scope.customContactsInfo = $scope.customContactsInfo.slice(0, 15);
        }
      };

      $scope.hideContactSearch = function () {
        $scope.showHistory = true;
        $scope.showClear = false;
        $scope.resultList = [];
        $scope.contactKey.getValue = '';
        $ionicHistory.goBack();
      };

      $scope.getEmployeeData = function (moreFlag) { //获取搜索关键字的数据
        var q = $q.defer();
        if (moreFlag === 'init') {
          employeeParams.page = 1;
        }
        hmsHttp.post(getEmployeeUrl, employeeParams).success(function (response) {
          $scope.contactLoading = false;
          if (response.total == 0) {
            $scope.showInfinite = false;
            if (moreFlag === 'loadMore') {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.resultList = [];
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            if (response.total < 10) {
              //hmsPopup.showShortCenterToast('加载完毕!');
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if (moreFlag === 'init' || $scope.page === 1) {
                $scope.resultList = [];
                angular.forEach(response.rows, function (data, index) {
                  $scope.resultList.push(data);
                });
              }
              // $scope.resultList = $sce.trustAsHtml($scope.resultList);
              q.resolve($scope.resultList);
              $scope.showInfinite = false;
            } else {
              $scope.showInfinite = true;
              angular.forEach(response.rows, function (data, index) {
                $scope.resultList.push(data);
              });
              // $scope.resultList = $sce.trustAsHtml($scope.resultList);
              q.resolve($scope.resultList);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          return q.promise;
        }).error(function (error) {
          $scope.contactLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.loadMore = function () { //加载下一页
        $scope.newPage += 1;
        employeeParams.key = $scope.contactKey.getValue;
        employeeParams.page = $scope.newPage;
        $scope.getEmployeeData('loadMore');
      };

      $scope.clearInputContent = function () { //响应清除输入框文字按钮的方法
        $scope.contactKey.getValue = '';
        $scope.searchContacts();
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };

      $scope.searchContacts = function () { //响应搜索输入框的方法
        $scope.showHistory = false;
        if ($scope.contactKey.getValue === '') {
          $scope.showHistory = true;
          $scope.showClear = false;
          $timeout(function () {
            $scope.resultList = [];
          }, 251); //防止过快啦 --凸凸凸
        } else {
          $scope.showClear = true;
        }
        $scope.newPage = 1;
        employeeParams.key = $scope.contactKey.getValue;
        employeeParams.page = $scope.newPage;
        $scope.contactLoading = true;
        $scope.resultList = [];
        //$timeout(function () {
        $scope.getEmployeeData('init');
        //}, 200);
      };

      $scope.getHistoryItem = function (values) { //响应搜素历史记录点击的方法
        $scope.contactKey.getValue = values.historyItem;
        employeeParams.key = $scope.contactKey.getValue;
        employeeParams.page = 1;
        $scope.contactLoading = true;
        $scope.showHistory = false;
        $scope.showClear = true;
        $scope.resultList = [];
        dealHistory(values.historyItem);
        $scope.getEmployeeData('init');
      };

      $scope.deleteHistory = function (values) { //清空历史数据
        $scope.historys = [];
        localStorage.removeItem(DB_NAME);
      };


      $scope.selectEmployeeItem = function (newEmp) { //跳到个人详情界面
        dealHistory(newEmp.emp_name);
        $scope.showHistory = true;
        $scope.showClear = false;
        $scope.resultList = [];
        $scope.contactKey.getValue = '';
        if (commonContactService.getContactFlag() === 'carpooling-new-contactSearch') {
          commonContactService.setEmpInfo(newEmp);
          $rootScope.$broadcast("SEND_EMP_INFO");
          $ionicHistory.goBack();
        } else {
          $state.go('tab.employeeDetail', {employeeNumber: newEmp.emp_code});
        }
      };

      $scope.telSaveNumber = function (event, baseInfo) { //拨打电话按钮的响应事件
        event.stopPropagation(); //阻止事件冒泡

        var options = {
          buttonLabels: ['拨打电话', '增加到通讯录'],
          addCancelButtonWithLabel: '取消',
          androidEnableCancelButton: true,
          androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
        };

        document.addEventListener("deviceready", function () {
          $cordovaActionSheet.show(options)
            .then(function (btnIndex) {
              if (baseConfig.debug) {
                warn(btnIndex);
              }
              if (btnIndex == 1) {
                window.location.href = "tel:" + 88888888888; //不明觉厉--
                window.location.href = "tel:" + baseInfo.mobil.replace(/\s+/g, "");
                var imgUrl = baseInfo.avatar;
                if (baseInfo.avatar != '' || baseInfo.avatar) {
                } else {
                  if (baseInfo.gender == "男") {//根据性别判定头像男女
                    imgUrl = "build/img/myInfo/man-portrait.png";
                  } else if (baseInfo.gender == "女") {
                    imgUrl = "build/img/myInfo/woman-portrait.png";
                  }
                }

                var employeeBaseInfo = {
                  tel: baseInfo.mobil.replace(/\s+/g, ""),
                  name: baseInfo.emp_name,
                  employeeNumber: baseInfo.emp_code,
                  imgUrl: imgUrl
                };
                if (employeeBaseInfo.name) {
                  dealCommonLinkMan(employeeBaseInfo);
                }
                return true;
              } else if (btnIndex == 2) {
                contactService.contactLocal(baseInfo);
                return true;
              }
            });
        }, false);
      };
    }
  ])
  .factory('contactService', ['hmsPopup', function (hmsPopup) {
    //for contact
    function onSaveContactSuccess(scanCardModal) {
      hmsPopup.showShortCenterToast('添加成功!');
      try {
        if (scanCardModal) {
          scanCardModal.hide();
        }
      } catch (e) {
      }
    };
    //for contact
    function onSaveContactError(contactError) {
      hmsPopup.showShortCenterToast('添加失败,请重新操作!');
    };
    return {  //联系人保存到本地--
      contactLocal: function (baseInfo, scanCardModal) {
        if (ionic.Platform.isWebView()) {
          var newContact = navigator.contacts.create();
          var phoneNumbers = [];
          phoneNumbers[0] = new ContactField('work', baseInfo.mobil2, false);
          phoneNumbers[1] = new ContactField('mobile', baseInfo.mobil, true);
          var emails = [];
          emails[0] = new ContactField('email', baseInfo.email, true);
          var organization = [];
          organization[0] = new ContactField('organization', baseInfo.organization, true);
          if (ionic.Platform.isAndroid()) {
            newContact.displayName = baseInfo.emp_name; // ios 不支持 displayName
          }
          if (ionic.Platform.isIOS()) {
            var name = new ContactName();
            name.givenName = baseInfo.emp_name.substring(1, baseInfo.emp_name.length);
            name.familyName = baseInfo.emp_name.substring(0, 1);
            newContact.name = name;
          }
          newContact.phoneNumbers = phoneNumbers;
          newContact.emails = emails;
          newContact.organizations = organization;
          newContact.save(onSaveContactSuccess(scanCardModal), onSaveContactError);
        }
      }
    }
  }]);
