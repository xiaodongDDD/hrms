/**
 * Created by Empire on 2016/8/26.(Sun Bohao)
 */
'use strict';
//--资源查询 个人搜索模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.resourcesSearchPerson', {
          url: 'application/resources/resourcesSearchPerson',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/search/resources-search-person.html',
              controller: 'resourcesSearchPersonCtl'
            }
          },
          params: {
            page: "",
            employeeCode: "",
            unitId: "",
            branchId: "",
            subjectId: ""
          }
        });
    }]);

angular.module('applicationModule')
  .controller('resourcesSearchPersonCtl',[
    '$scope',
    '$state',
    '$ionicHistory',
    '$stateParams',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsPopup',
    '$ionicActionSheet',
    'contactService',
    '$timeout',
    'hmsHttp',
    'commonContactService',
    '$rootScope',
    '$cordovaActionSheet',
    '$sce',
    '$q',
    function ($scope,
              $state,
              $ionicHistory,
              $stateParams,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsPopup,
              $ionicActionSheet,
              contactService,
              $timeout,
              hmsHttp,
              commonContactService,
              $rootScope,
              $cordovaActionSheet,
              $sce,
              $q

              ){




      //接收到要搜索的数据类型page
      //接收数据
      var page = $stateParams.page;
      var employeeCode = $stateParams.employeeCode;
      var unitId = $stateParams.unitId;
      var branchId = $stateParams.branchId;
      var subjectId = $stateParams.subjectId;


      {
        $scope.showInfinite = false; //默认隐藏无限滚动的标签
        $scope.contactLoading = false; //默认不显示loading加载
        $scope.showHistory = true; //默认显示搜索历史
        $scope.showEmployee = false; //默认不显示部门或者项目中的员工
        $scope.showClear = false; //默认隐藏搜索框的清楚按钮
        $scope.resultList = []; //存储搜索结果
        $scope.contactKey = {getValue: ''}; //绑定输入的关键字
        $scope.historys = []; //存储搜索历史的关键字
        $scope.newPage = 0;
        var DB_NAME = 'key_history11';
        var getEmployeeUrl = baseConfig.queryPath + '/staff/query';
        var employeeParams = {"key": "", "page": 1, "pageSize": "10"};
        var LINK_MAN = 'common_linkman2';
        var item = document.getElementById("employeeInputSearch");
        $scope.historys = unique_better(storedb(DB_NAME).find(), 'historyItem');
        if ($scope.historys.length > 10) {
          $scope.historys = $scope.historys.slice(0, 10);
        }
      }

      var searchInfo = '{"params":{"p_employee_number":"' + employeeCode + '","p_branch_id":"' + unitId +  '","p_project_id":"' + subjectId +  '"}}';
      var getBranchEmpUrl = baseConfig.businessPath + "/api_resources_query/query_branch_emp"; //部门员工接口地址
      var getSubjectEmpUrl = baseConfig.businessPath + "/api_resources_query/query_project_emp"; //项目员工接口地址

      var getBranchEmp = function () {
        hmsHttp.post(getBranchEmpUrl, searchInfo).success(function (result) {
          // console.log(unitId);
          // console.log(subjectId);
          // console.log(result);
          $scope.employeeList = result.employee_list;

        }).error(function () {
          console.log('部门员工接口异常')
        })
      };

      var getSubjectEmp = function () {
        hmsHttp.post(getSubjectEmpUrl, searchInfo).success(function (result) {
          // console.log(unitId);
          // console.log(subjectId);
          // console.log(result);
          $scope.employeeList = result.employee_list;

        }).error(function () {
          console.log('部门员工接口异常')
        })
      };

      if(unitId && !subjectId){
        getBranchEmp();
      }
      if(subjectId){
        getSubjectEmp();
      }
      if(subjectId || unitId){
        $scope.showHistory = false;
        $scope.showEmployee = true;
        item.disabled = true; //禁用搜索框
      }else{
        $scope.showHistory = true;
        $scope.showEmployee = false;
        item.disabled = false; //启用搜索框
      }

      //返回部门或项目的员工信息
      $scope.getEmployee = function (newEmp) {
        $rootScope.$broadcast("EMP_NAME",newEmp.employee_name);
        $rootScope.$broadcast("EMP_CODE",newEmp.employee_number);
        $ionicHistory.goBack();
      };


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
        $rootScope.$broadcast("EMP_NAME","");
        $rootScope.$broadcast("EMP_CODE","");
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


      $scope.selectEmployeeItem = function (newEmp) { //把个人信息返回
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
          // $scope.authorize = function(){
            $rootScope.$broadcast("EMP_NAME",newEmp.emp_name);
            $rootScope.$broadcast("EMP_CODE",newEmp.emp_code);
            $ionicHistory.goBack();
          // };
          // $state.go('tab.resources-query',
          //   {
          //     employeeNumber: newEmp.emp_code,
          //     employeeName: newEmp.emp_name
          //   }
          // );
        }
      };


    }
  ]);
