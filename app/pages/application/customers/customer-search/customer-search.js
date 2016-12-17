/**
 * Created by wangkaihua on 16/9/30.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        //全局搜索
        .state('tab.customerSearch', {
          url: '/customerSearch',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/customers/customer-search/customer-search.html',
              controller: 'customerSearchCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('customerSearchCtrl', ['$scope', '$state', '$ionicHistory', 'history', 'hmsPopup', '$timeout', '$rootScope', 'customerSearchService',
    function ($scope, $state, $ionicHistory, history, hmsPopup, $timeout, $rootScope, customerSearchService) {
      var item = $('#employeeInputSearch');
      $scope.showContent = true;
      function blurInput() { //初始化input框-自动聚焦
        console.log("$ionicView.afterEnter");
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 0);
        }
      }
      $timeout(function () {
        blurInput();
      },400);
/*      $scope.$on('$ionicView.afterEnter', function () { //初始化input框-自动聚焦
        console.log("$ionicView.afterEnter");
        if (ionic.Platform.isWebView()) {
          console.log("web");
          cordova.plugins.Keyboard.show();
        }
        if (ionic.Platform.isAndroid()) {
          console.log("android");
          console.log(item);
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 400);
        } else {
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 400);
          /!*  $scope.$apply();*!/
        }
      });*/
      $scope.historys = [];
      //显示更多
      $scope.showMore = function (item) {
        console.log(item);
        console.log("测试");
        item.flag =  !item.flag;
        var heightItem = $("#repeat-item").height();
      };
      $scope.searchData = [
        {
          typeName:"客户",
          type: "HCRM_CUSTOMER",
          flag:false,
          data:[]
        },{
          typeName:"线索",
          flag:false,
          type: "HCRM_CLUE",
          data:[]
        },{
          typeName:"商机",
          flag:false,
          type: "HCRM_OPPORTUNITY",
          data:[]
        }
      ];
      $scope.searchParam = {
        keyWord: "",
        page:1,
        pageSize:10
      };
      $scope.showLoading = false;
      var searchSuccessInit = function (result) {
        $scope.showLoading = false;
        $scope.searchData = [
          {
            typeName:"客户",
            type: "HCRM_CUSTOMER",
            data:[]
          }
        ];
        console.log("==========");
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          /* $scope.searchData = result.search_result;*/
          for (var i = 0; i < result.customer_list.length; i++) {
              var tem=result.customer_list[i];
              $scope.searchData[0].data.push(tem);

          }
          console.log($scope.searchData);
        }else{
          $scope.showContent = true;
        }
      };
      $scope.goDetail=function(item){
        console.log(item+"  客户ID "+item.customerId);
        $scope.history.fullname = item.fullName;
        $scope.history.typeName = '客户';
        $scope.history.type = "HCRM_CUSTOMER";
        $scope.history.value = item.customerId;
        console.log($scope.history);
        console.log("临时存放");
        //存放历史记录
        console.log(!inArrayVaule($scope.historys, $scope.history.value));
        if(!inArrayVaule($scope.historys, $scope.history.value)){//判断是否已经存储
          history.addHistory($scope.history);
        }
        console.log(item);
          window.localStorage.customerId = item.customerId;
          $state.go('tab.customer-detail',{
            customerDetail:item
          });
      };

      $scope.goDetail2=function(item){
        console.log(item+"  客户ID "+item.value);
        $scope.history.fullname = item.fullName;
        $scope.history.typeName = '客户';
        $scope.history.type = "HCRM_CUSTOMER";
        $scope.history.value = item.value;
        console.log($scope.history);
        console.log("临时存放");
        //存放历史记录
        console.log(!inArrayVaule($scope.historys, $scope.history.value));
        if(!inArrayVaule($scope.historys, $scope.history.value)){//判断是否已经存储
          history.addHistory($scope.history);
        }
        console.log(item);
        window.localStorage.customerId = item.value;
        $state.go('tab.customer-detail',{
          customerDetail:item
        });
      };

      $scope.searchWholeData = function () {
        $scope.showContent = false;
        customerSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
      };
      $scope.clearInputContent = function () {
        $scope.searchParam.keyWord = "";
        blurInput();
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
          for(var i=0;i<data.length;i++){
            if(data[i].type=='HCRM_CUSTOMER'){
              $scope.historys.push(data[i]);
            }
          }

          $scope.$apply();
          /* $scope.birthdays = data;*/
        })
      };
      $scope.init();
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
  }).directive('scrollHeight2', function ($window) {
    return {
      restrict: 'AE',
      link: function (scope, element, attr) {
        element[0].style.height = ($window.innerHeight - 44) + 'px';
      }
    }
  })
  .service('customerSearchService', ['hmsHttp',
    'hmsPopup',
    'baseConfig', function (hmsHttp, hmsPopup, baseConfig) {
      //hmsPopup.showLoading()
      console.log(baseConfig.crmPath);
      var baseUrl = baseConfig.crmPath + "select_customers";
      console.log(baseUrl);
      this.getSearchData = function (success, key) {
        hmsHttp.post(baseUrl, key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup(response.error_description);
        });
      }
    }]);
