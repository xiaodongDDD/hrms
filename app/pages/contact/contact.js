/**
 *  modify by shellWolf on 16/06/28.
 */
'use strict';
angular.module('contactModule')
  .controller('ContactCtrl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    '$state',
    '$ionicActionSheet',
    '$timeout',
    'contactService',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $state,
              $ionicActionSheet,
              $timeout,
              contactService) {
      /**
       * var section
       */
      {
        $scope.customContactsInfo = [];
        $scope.showTopInput = false; // 默认不显示bar上的搜索框
        $scope.showInfinite = false; //默认隐藏无限滚动的标签
        $scope.contactLoading = false; //默认不显示loading加载
        $scope.showHistory = true; //默认显示搜索历史
        $scope.showClear = false; //默认隐藏搜索框的清楚按钮
        $scope.resultList = []; //存储搜索结果
        $scope.contactKey = {getValue: ''}; //绑定输入的关键字
        $scope.historys = []; //存储搜索历史的关键字
        $scope.newPage = 0;
        var CONTACT_TAG = 'contact:\n';
        var DB_NAME = 'key_history';
        var LINK_MAN = 'common_linkman';
        var position = ''; //记录滚动条的位置--
        var getEmployeeUrl = baseConfig.queryPath + '/staff/query';
        var employeeParams = {key: '', page: 1, pageSize: '30'};

        $scope.historys = (storedb(DB_NAME).find()).arrUniq();
        if ($scope.historys.length > 10) {
          $scope.historys = $scope.historys.slice(0, 10);
        }
      }

      function getCommonLinkMan() { //获取常用联系人
        $scope.customContactsInfo = (storedb(LINK_MAN).find()).arrUniq();
        if ($scope.customContactsInfo.length > 15) {
          $scope.customContactsInfo = $scope.customContactsInfo.slice(0, 15);
        }
      };

      $scope.$on('$ionicView.beforeEnter', function (e) {
        getCommonLinkMan();
      });

      $scope.$on('REFRESH_LINKMAN', function (e) {
        getCommonLinkMan();
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('ContactCtrl.$destroy');
        }
        $scope.contactInputModal.remove();
      });

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 33) {
            $scope.showTopInput = false;
          } else if (position >= 33) {
            $scope.showTopInput = true;
          }
        });
      };

      function dealHistory(newEmployee) {
        storedb(DB_NAME).remove({historyItem: newEmployee}, function (err) {
          if (!err) {
          } else {
            hmsPopup.showShortCenterToast(err);
          }
        });
        storedb(DB_NAME).insert({historyItem: newEmployee}, function (err) {
          if (!err) {
            $scope.historys = (storedb(DB_NAME).find()).arrUniq();
          } else {
            hmsPopup.showShortCenterToast(err);
          }
        });
        if ($scope.historys.length > 10) {
          $scope.historys = $scope.historys.slice(0, 10);
        }
      };

      function dealCommonLinkMan(newObject) { //常用联系人最多15个
        storedb(LINK_MAN).insert(newObject, function (err) {
          if (!err) {
            $scope.customContactsInfo = (storedb(LINK_MAN).find()).arrUniq();
          } else {
            hmsPopup.showShortCenterToast(err);
          }
        });
        if ($scope.customContactsInfo.length > 15) {
          $scope.customContactsInfo = $scope.customContactsInfo.slice(0, 15);
        }
      };

      /**
       * modal input 方法区
       */
      function inputModal(){
        $ionicModal.fromTemplateUrl('build/pages/contact/modal/contact-search.html', {
          scope: $scope,
          animation: 'fadeInUp'
        }).then(function (modal) {
          $scope.contactInputModal = modal;
        });
      }
      inputModal();
      $scope.goInputModal = function () {
        $scope.$broadcast('contact-search');
        $scope.contactInputModal.show();
      };

      $scope.hideContactSearch = function () {
        $scope.showHistory = true;
        $scope.showClear = false;
        $scope.resultList = [];
        $scope.contactKey.getValue = '';
        $scope.$emit('REFRESH_LINKMAN');
        $scope.contactInputModal.hide();
      };

      $scope.getEmployeeData = function (moreFlag) { //获取搜索关键字的数据
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
            if (response.total < 30) {
              //hmsPopup.showShortCenterToast('加载完毕!');
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if (moreFlag === 'init' || $scope.page === 1) {
                $scope.resultList = [];
                angular.forEach(response.rows, function (data, index) {
                  $scope.resultList.push(data);
                });
              }
              $scope.showInfinite = false;
            } else {
              $scope.showInfinite = true;
              angular.forEach(response.rows, function (data, index) {
                $scope.resultList.push(data);
              });
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        }).error(function (error) {
          $scope.contactLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };
      $scope.loadMore = function () {
        $scope.newPage += 1;
        employeeParams.key = $scope.contactKey.getValue;
        employeeParams.page = $scope.newPage;
        $scope.getEmployeeData('loadMore');
      };

      $scope.clearInputContent = function () {
        $scope.contactKey.getValue = '';
        $scope.searchContacts();
      };

      $scope.searchContacts = function () { //响应搜索输入框的方法
        $scope.showHistory = false;
        if ($scope.contactKey.getValue === '') {
          $scope.showHistory = true;
          $scope.resultList = [];
          $scope.showClear = false;
        } else {
          $scope.showClear = true;
        }
        $scope.newPage = 1;
        employeeParams.key = $scope.contactKey.getValue;
        employeeParams.page = $scope.newPage;
        $scope.contactLoading = true;
        $scope.resultList = [];
        $timeout(function () {
          $scope.getEmployeeData('init');
        }, 200);
      };

      $scope.getHistoryItem = function (values) {
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

      $scope.selectEmployeeItem = function (newEmployeeName, newEmployeeNumber) {
        dealHistory(newEmployeeName);
        $scope.showHistory = true;
        $scope.showClear = false;
        $scope.resultList = [];
        $scope.contactKey.getValue = '';
        //$scope.contactInputModal.hide();
        $state.go('tab.employeeDetail', {employeeNumber: newEmployeeNumber});
      };

      $scope.goStructure = function () {
        hmsPopup.showPopup("本功能下一版本上线");
      };

      $scope.goDetailInfo = function (newEmployeeNumber) {
        $scope.contactInputModal.hide();
        $state.go('tab.employeeDetail', {employeeNumber: newEmployeeNumber});
      };

      $scope.scanBusinessCard = function () { //名片扫描添加联系人到通讯录
        if (ionic.Platform.isWebView()) {
          scanCard.takePicturefun(function (msg) {
            var manInfo = {
              emp_name: '',
              mobil: '',
              email: ''
            };
            manInfo.emp_name = msg.lastName + msg.firstName;
            try {
              var phones = msg.phones;
              if (phones.length > 0) {
                manInfo.mobil = phones[0].itemInfo;
              }
            } catch (e) {
              manInfo.mobil = '';
            }
            try {
              var emails = msg.emails;
              if (emails.length > 0) {
                manInfo.email = emails[0].itemInfo;
              }
            } catch (e) {
              manInfo.email = '';
            }
            try{
              $scope.$apply();
              contactService.contactLocal(manInfo);
            } catch(e) {}
          }, function (error) {
            hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
          });
        } else {
          hmsPopup.showShortCenterToast('暂不支持网页端的名片扫描!');
        }
      };

      $scope.telNumber = function (event, baseInfo, flag) { //拨打电话按钮的响应事件
        event.stopPropagation(); //阻止事件冒泡
        if (flag === 'search') {
          try {
            $ionicActionSheet.show({
              buttons: [
                {text: '拨打电话'},
                {text: '增加到通讯录'},
              ],
              cancelText: 'Cancel',
              buttonClicked: function (index) {
                if (index == 0) {
                  window.location.href = "tel:" + 88888888888; //不明觉厉--
                  window.location.href = "tel:" + baseInfo.mobil;
                  var employeeBaseInfo = {
                    tel: baseInfo.mobil,
                    name: baseInfo.emp_name,
                    employeeNumber: baseInfo.emp_code,
                    imgUrl: baseInfo.avatar
                  };
                  if (employeeBaseInfo.name) {
                    dealCommonLinkMan(employeeBaseInfo);
                  }
                  return true;
                }
                if (index == 1) {
                  contactService.contactLocal(baseInfo);
                  return true;
                }
              }
            });
          } catch (e) {
            alert(e);
          }
        } else {
          //常用联系人拨打电话
          window.location.href = "tel:" + baseInfo;
        }
      };

    }]).factory('contactService',['hmsPopup', function (hmsPopup) {
    //for contact
    function onSaveContactSuccess(contacts) {
      hmsPopup.showShortCenterToast('添加成功!');
    };
    //for contact
    function onSaveContactError(contactError) {
      hmsPopup.showShortCenterToast('添加失败!');
    };

    return{  //联系人保存到本地--
      contactLocal: function (baseInfo) {
          if (ionic.Platform.isWebView()) {
            var newContact = navigator.contacts.create();
            var phoneNumbers = [];
            phoneNumbers[0] = new ContactField('mobile', baseInfo.mobil, true);
            var emails = [];
            emails[0] = new ContactField('email', baseInfo.email, true);
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
            newContact.save(onSaveContactSuccess, onSaveContactError);
          }
        }
    }
  }]);
