/**
 * Created by wkh on 2016/11/22.
 */
angular.module('contactModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.contact-search', {
          url: '/contact-search',
          views: {
            'tab-contactCrm': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contactCrm/contact-search/contact-search.html',
              controller: 'contactSearchCtrl'
            }
          }
        })
    }]);
angular.module('contactModule')
  .controller('contactSearchCtrl', [
    '$scope',
    '$state',
    'publicMethod',
    '$ionicHistory',
    '$stateParams',
    '$ionicActionSheet',
    'contactLocal',
    'CloneData',
    'hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$rootScope',
    '$timeout',
    'historyContact',
    'customerLinkman',
    function ($scope,
              $state,
              publicMethod,
              $ionicHistory,
              $stateParams,
              $ionicActionSheet,
              contactLocal,
              CloneData,
              hmsHttp,
              hmsPopup,
              baseConfig,
              $rootScope,
              $timeout,
              historyContact,
              customerLinkman) {
      $scope.hideSearch = function () {
        $ionicHistory.goBack();
      };
      $scope.showContent = true;
      var item = document.getElementById('customerLinkmaninput');
      $scope.$on('$ionicView.afterEnter', function () { //初始化input框-自动聚焦
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 0);
        }
      });
      //初始化历史记录
      $scope.historyContact = [];
      $scope.init = function () {
        historyContact.getAllHistory(function (data) {
          console.log(data);    //还没保存数据目前打印的是空数组
          $scope.historyContact = data;
          hmsPopup.hideLoading();
          /* $scope.birthdays = data;*/
        })
      };
      $scope.init();
      $rootScope.$on("REFRESH_CONTACT_HISTORY", function () {
        $scope.init();
      });
      $scope.history = {};

      //删除历史记录
      $scope.deleteItem = function (item, index) {
        console.log(item);
        historyContact.removeHistory(item);
        $scope.historyContact.splice(index, 1);
      };
      $scope.deleteHistory = function (item) {
        console.log(item);
        for (var i = 0; i < $scope.historyContact.length; i++) {
          historyContact.removeHistory($scope.historyContact[i]);
          console.log($scope.historyContact[i])
        }
        $scope.historyContact = [];
        $scope.historyContact.splice(index, 1);
      };
      $scope.searched = {
        "page": 1,
        "pageSize": 10,
        "keyWord": ""
      };
      var resultSuccessInit = function (result) {
        $scope.showContent = true;
        if (result.returnCode == 'S') {
          for (var i = 0; i < result.customer_contact_list.length; i++) {
            if (result.customer_contact_list[i].sexName == "男") {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          $scope.searchData = result.customer_contact_list;
        } else {
          hmsPopup.showPopup(result.returnMsg);
        }
        if(result.customer_contact_list.length<$scope.searched.pageSize||result.customer_contact_list.length==0){
          $scope.moreDataCanBeLoaded=false;
        }
      };
      var resultMoreSuccessInit=function(result){
        console.log($scope.searched.pageSize);
        if (result.returnCode == 'S') {
          for (var i = 0; i < result.customer_contact_list.length; i++) {
            if (result.customer_contact_list[i].sexName == "男") {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          $scope.searchData = $scope.searchData.concat(result.customer_contact_list) ;
        } else {
          hmsPopup.showPopup(result.returnMsg);
        }
        if(result.customer_contact_list.length<$scope.searched.pageSize||result.customer_contact_list.length==0){
          $scope.moreDataCanBeLoaded=false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      $scope.searchContacts = function () { //响应搜索输入框的方法
        $scope.showContent = false;
        $scope.searched.page=1;
        $scope.moreDataCanBeLoaded = true;//上拉加载
        customerLinkman.getSearchResult(resultSuccessInit, $scope.searched);
      };
      $scope.loadMore=function(){
        $scope.searched.page++;
        customerLinkman.getSearchResult(resultMoreSuccessInit, $scope.searched);
      };
      $scope.goDetail = function (item) {
        console.log(item);
        $state.go('tab.contactDetail', {contactData: item});
        $scope.history.name = item.name;
        $scope.history.sex = item.sex;
        $scope.history.sexName = item.sexName;
        $scope.history.status = item.status;
        $scope.history.statusName = item.statusName;
        $scope.history.position = item.position;
        $scope.history.department = item.department;
        $scope.history.customerId = item.customerId;
        $scope.history.fullName = item.fullName;
        $scope.history.phone = item.phone;
        $scope.history.contactType = item.contactType;
        $scope.history.contactTypeName = item.contactTypeName;
        $scope.history.contactId = item.contactId;
        $scope.history.sexImg = item.sexImg;
        console.log($scope.history);
        console.log("临时存放");
        //存放历史记录
        if (!inArrayId($scope.historyContact, $scope.history.contactId)) {//判断是否已经存储
          historyContact.addHistory($scope.history);
        }
      };
      $scope.clearInputContent = function () {
        $scope.searched.keyWord = '';
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };
    }]);
