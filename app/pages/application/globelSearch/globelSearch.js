/**
 * Created by wangkaihua on 16/9/30.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        //全局搜索
        .state('tab.globelSearch', {
          url: '/globelSearch',
          /*cache:false,*/
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/globelSearch/globelSearch.html',
              controller: 'globelSearchCtrl'
            }
          },
          params:{
            flag:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('globelSearchCtrl', ['$scope', '$state', '$ionicHistory', 'history', 'hmsPopup', '$timeout', '$rootScope', 'globelSearchService','$ionicScrollDelegate','$stateParams','T',
    function ($scope, $state, $ionicHistory, history, hmsPopup, $timeout, $rootScope, globelSearchService,$ionicScrollDelegate,$stateParams,T) {
      $scope.showContent=true;
      var item = $('#employeeInputSearch');
      $scope.showLoading=false;
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
        $ionicScrollDelegate.$getByHandle("slideimgs").resize();
      };

      $scope.searchData = [];
      //传入的配置项
      $scope.flag = $stateParams.flag;

      //初始化需要搜索的数据值
      function initSearchData(){
        if($scope.flag == 'SEARCH_OPPORTUNITY'){
          $scope.searchPlaceHolder = T.T('SEARCH_OPPORTUNITY');
          $scope.searchData = [
            {
              typeName: "商机",
              flag: false,
              type: "HCRM_OPPORTUNITY",
              data: []
            }
          ];
        } else {
          $scope.searchPlaceHolder = T.T('SEARCH');
          $scope.searchData = [
            {
              typeName: "客户",
              type: "HCRM_CUSTOMER",
              flag: false,
              data: []
            }, {
              typeName: "线索",
              flag: false,
              type: "HCRM_CLUE",
              data: []
            }, {
              typeName: "商机",
              flag: false,
              type: "HCRM_OPPORTUNITY",
              data: []
            }
          ];
        }
      }

      initSearchData();


      $scope.searchParam = {
        keyWord: ""
      };
      var searchSuccessInit = function (result) {
        $scope.showLoading=false;
        initSearchData();
        if (result.returnCode == 'S') {
          $scope.showContent=true;
          /* $scope.searchData = result.search_result;*/
          for (var i = 0; i < result.result_list.length; i++) {

            for(var j = 0; j < $scope.searchData.length; j++){
              if(result.result_list[i].type == $scope.searchData[j].type){
                var tem = result.result_list[i];
                $scope.searchData[j].data.push(tem);
                break;
              }
            }
          }
          console.log($scope.searchData);
        }else{
          $scope.showContent=true;
        }
      };
      $scope.goDetail = function (item) {
        console.log(item);
        $scope.history.fullname = item.fullName;
        $scope.history.typeName = item.typeName;
        $scope.history.type = item.type;
        $scope.history.value = item.value;
        //存放历史记录
        if (!inArrayVaule($scope.historys, $scope.history.value)) {//判断是否已经存储
          history.addHistory($scope.history);
        }
        console.log(item);
        if (item.type == "HCRM_OPPORTUNITY") {
          item.opportunityId = item.value;
          $state.go('tab.opportunity-detail', {data: item});//商机详情
        } else if (item.type == "HCRM_CLUE") {
    /*      item.clueId = item.value;*/
          $state.go('tab.clue-detail', {data:item.value});
        } else if (item.type == "HCRM_CUSTOMER") {
          window.localStorage.customerId = item.value;
          $state.go('tab.customer-detail');
        }else if(item.type == "HCRM_COMPETITOR"){
          item.competitorId = item.value;
          $state.go('tab.competitor-detail', {param: item});//商机详情
        }
      };
      $scope.searchWholeData = function () {
        $scope.showContent=false;
        globelSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
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
        history.removeHistory(item);
        $scope.historys.splice(index, 1);
      };
      //初始化历史记录
      $scope.init = function () {
        history.getAllHistory(function (data) {
          console.log(data);    //还没保存数据目前打印的是空数组
          $scope.historys = data;
          $scope.$apply();
          /* $scope.birthdays = data;*/
        })
      };
      $scope.init();
      $rootScope.$on("REFRESH_CUSTOMER_HISTORY", function () {
        $scope.init();
      });
      //选择客户
      $scope.selectCustomer = function (item) {
        console.log(item);
        $scope.history.fullname = item.fullname;
        $scope.history.historyItem = item.historyItem;
        $scope.history.img = item.img;
        console.log($scope.history);
        console.log("临时存放");
        //存放历史记录
        history.addHistory($scope.history);
      };
      $scope.hideSearch = function () {
        $ionicHistory.goBack();
      };
      //清除历史记录
      $scope.deleteHistory = function () {
        console.log($scope.historys);
        for (var i = 0; i < $scope.historys.length; i++) {
          history.removeHistory($scope.historys[i]);
          console.log($scope.historys[i])
        }
        console.log($scope.historys);
        $scope.historys = [];
      }
    }])
  //过滤器查询匹配的值
  .filter("highlight", function ($sce) {
    var fn = function (text, search) {
      if (!search) {
        return $sce.trustAsHtml(text);
      }
      text = text.toString();
      if (text.indexOf(search) == -1) {
        return text;
      }
      var regex = new RegExp(search, 'gi');
      var result = text.replace(regex, '<span style="color:red;">$&</span>');
      return $sce.trustAsHtml(result);
    };
    return fn;
  })
  .service('globelSearchService', ['hmsHttp',
    'hmsPopup',
    'baseConfig', function (hmsHttp, hmsPopup, baseConfig) {
      console.log(baseConfig.basePath);
      var baseUrl = baseConfig.basePath;
      console.log(baseUrl);
      this.getSearchData = function (success, key) {
        hmsHttp.post(baseUrl + 'global_search', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup(response.error_description);
        });
      }
    }]);
