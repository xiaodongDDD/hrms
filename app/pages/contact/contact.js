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
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $state) {
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
        var getEmployeeUrl = baseConfig.businessPath + '/get_empinfo/get_employees';
        var employeeParams = {params: {p_token: '', p_page: ''}};
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

      $scope.$on('$ionicView.enter', function (e) {
        getCommonLinkMan();
      });

      $scope.$on('REFRESH_LINKMAN', function (e) {
        getCommonLinkMan();
      });

      $scope.$on('$destroy', function (e) {
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
        //fadeInRightBig/fadeInUp
      $ionicModal.fromTemplateUrl('build/pages/contact/modal/contact-search.html', {
        scope: $scope,
        animation: 'animated fadeInRightBig'
      }).then(function (modal) {
        $scope.contactInputModal = modal;
      });
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
        hmsHttp.post(getEmployeeUrl, employeeParams).success(function (response) {
          $scope.contactLoading = false;
          if (response.token == 0) {
            $scope.showInfinite = false;
            if (moreFlag === 'loadMore' && $scope.newPage > 2) {
              hmsPopup.showShortCenterToast('数据加载完毕!');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.resultList = [];
              //hmsPopup.showShortCenterToast('没有查到相关数据!');
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            if (response.count <= 7) {
              $scope.showInfinite = false;
              angular.forEach(response.token, function (data, index) {
                $scope.resultList.push(data);
              });
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.showInfinite = true;
              angular.forEach(response.token, function (data, index) {
                $scope.resultList.push(data);
              });
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          }
        }).error(function (error) {
          hmsPopup.showShortCenterToast('请检查网络连接,稍后重试!');
          $scope.contactLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };
      $scope.loadMore = function () {
        $scope.newPage += 1;
        employeeParams.params.p_token = $scope.contactKey.getValue;
        employeeParams.params.p_page = $scope.newPage;
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
        employeeParams.params.p_token = $scope.contactKey.getValue;
        employeeParams.params.p_page = $scope.newPage;
        $scope.contactLoading = true;
        $scope.resultList = [];
        $scope.getEmployeeData('init');
      };

      $scope.getHistoryItem = function (values) {
        $scope.contactKey.getValue = values.historyItem;
        employeeParams.params.p_token = $scope.contactKey.getValue;
        employeeParams.params.p_page = 1;
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
        $scope.contactInputModal.hide();
        $state.go('tab.employeeDetail', {employeeNumber: newEmployeeNumber});
      };

      $scope.goStructure = function () {
      };

      $scope.goDetailInfo = function (newEmployeeNumber) {
        $scope.contactInputModal.hide();
        $state.go('tab.employeeDetail', {employeeNumber: newEmployeeNumber});
      };

      $scope.telNumber = function (event, newNumber, newName, newEmpNumber, flag) {
        event.stopPropagation(); //阻止事件冒泡
        window.location.href = "tel:" + newNumber;
        if (flag === 'search') {
          var employeeBaseInfo = {
            tel: newNumber,
            name: newName,
            employeeNumber: newEmpNumber
          };
          dealCommonLinkMan(employeeBaseInfo);
        }
      };

    }]);
