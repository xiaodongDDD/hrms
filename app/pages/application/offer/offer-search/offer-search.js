/**
 * Created by wkh on 2017/2/28.
 */
/**
 * Created by wangkaihua on 16/9/30.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        //全局搜索
        .state('tab.offerSearch', {
          url: '/globelSearch',
          /*cache:false,*/
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/offer/offer-search/offer-search.html',
              controller: 'offerSearchCtrl'
            }
          },
          params:{
            flag:''
          }
        })
    }]);
angular.module('offerModule')
  .controller('offerSearchCtrl',['$scope', '$state', '$ionicHistory', 'historyOpportunity', 'hmsPopup', '$timeout', 'offerListService', '$rootScope','$stateParams',
    function ($scope, $state, $ionicHistory, historyOpportunity, hmsPopup, $timeout, offerListService, $rootScope,$stateParams) {
      $scope.showContent = true;
      var item = $('#opportunityInputSearch');
      var offerListParam={
        "opportunityName": "",
        //"sortname":"",
        //"sortorder":"",
        //"offerStageD":"",//定标
        //"offerStage":"",//投标
        //"dataStatus":"",//未提交状态
        //"dataStatusApproving":"",//审批中状态
        //"dataStatusApproved":"",//已审批
        //"dataStatusRefuse":"",//拒绝状态
        //"dataStatusInvalid":"",//失效状态
        "page":"1",
        "pageSize":"20"
      };
      $scope.type = $stateParams.data;

      $scope.moreDataCanBeLoaded = false;

      $scope.$on('$ionicView.afterEnter', function () { //初始化input框-自动聚焦
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 0);
        }
      });

      $scope.historys = [];
      //显示更多
      $scope.showMore = function (item) {
        console.log(item);
        item.flag = !item.flag;
        var heightItem = $("#repeat-item").height();
        console.log(heightItem);
      };

      $scope.searchData = [];
      $scope.page = 1;
      $scope.pageSize = 20;
      $scope.searchParam = {
        keyWord: "",
        page: $scope.page,
        pageSize: $scope.pageSize,
        opportunityType: $scope.type
      };

      var searchMoreSuccess = function (result) {
        console.log(":" + $scope.moreDataCanBeLoaded);
        $scope.showLoading = false;
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          $scope.searchData[0].data = $scope.searchData[0].data.concat(result.opportunity_list);
          $scope.moreDataCanBeLoaded = result.opportunity_list.length == $scope.pageSize;
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var searchSuccessInit = function (result) {
        $scope.showLoading = false;
        console.log("success");
        $scope.searchData = [
          {
            typeName: "商机",
            type: "HCRM_OPPORTUNITY",
            data: []
          }
        ];
        console.log("==========");
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          for (var i = 0; i < result.opportunity_list.length; i++) {
            var tem = result.opportunity_list[i];
            $scope.searchData[0].data.push(tem);
          }
          $timeout(function(){
            $scope.moreDataCanBeLoaded = result.opportunity_list.length == $scope.pageSize;
          }, 500)
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
      };
      var getOfferListSuccess=function(result){
        console.log(result);
        console.log("success");
        $scope.searchData = [
          {
            typeName: "商机",
            type: "HCRM_OPPORTUNITY",
            data: []
          }
        ];
        console.log("==========");
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          for (var i = 0; i <result.offer_list.length; i++) {
            var tem =result.offer_list[i];
            $scope.searchData[0].data.push(tem);
          }
          $timeout(function(){
            $scope.moreDataCanBeLoaded = result.offer_list.length == $scope.pageSize;
          }, 500)
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
        hmsPopup.hideLoading();
      };
      $scope.searchWholeData = function () {
        $scope.showContent = false;
        $scope.moreDataCanBeLoaded = false;
        $scope.searchData = [];
        $scope.searchParam.page = 1;
        offerListService.getOfferList(getOfferListSuccess,offerListParam)
      };

      $scope.loadMore = function(){
        $scope.searchParam.page++;
        offerListService.getOfferList(getOfferListSuccess,offerListParam)
      };

      $scope.clearInputContent = function () {
        $scope.searchParam.keyWord = "";
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };
      $scope.history = {};//临时存放历史记录
      //删除单条记录
      $scope.deleteItem = function (item, index) {
        console.log(item);
        historyOpportunity.removeHistory(item);
        $scope.historys.splice(index, 1);
      };
      //初始化历史记录
      $scope.init = function () {
        historyOpportunity.getAllHistory(function (data) {
          console.log(data);    //还没保存数据目前打印的是空数组
          $scope.historys = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].type == "HCRM_OPPORTUNITY" || data[i].type == "HCRM_CLUE") {
              $scope.historys.push(data[i]);
            }
          }
          $scope.$apply();
          /* $scope.birthdays = data;*/
        })
      };
      $scope.init();
      $rootScope.$on("REFRESH_CUSTOMER_HISTORY", function () {
        $scope.init();
      });
      $scope.hideSearch = function () {
        $ionicHistory.goBack();
      };
      //清除历史记录
      $scope.deleteHistory = function () {
        console.log($scope.historys);
        for (var i = 0; i < $scope.historys.length; i++) {
          historyOpportunity.removeHistory($scope.historys[i]);
          console.log($scope.historys[i])
        }
        console.log($scope.historys);
        $scope.historys = [];
      };
    }]);

