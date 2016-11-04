/**
 * Created by Empire on 2016/9/1.
 */

//--资源查询 部门搜索模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.resourcesSearchBranch', {
          url: 'application/resources/resourcesSearchBranch',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/search/resources-search-branch.html',
              controller: 'resourcesSearchBranchCtl'
            }
          },
          params: {
            page: "",
            employeeCode: "",
            subjectId: "",
            branchId: ""
          }
        });
    }]);

angular.module('applicationModule')
  .controller('resourcesSearchBranchCtl',[
    '$scope',
    '$state',
    '$ionicHistory',
    '$stateParams',
    'hmsHttp',
    'baseConfig',
    '$timeout',
    '$rootScope',
    '$ionicScrollDelegate',

    function ($scope,
              $state,
              $ionicHistory,
              $stateParams,
              hmsHttp,
              baseConfig,
              $timeout,
              $rootScope,
              $ionicScrollDelegate


              ){

      {
        $scope.showInfinite = false; //默认隐藏无限滚动的标签
        $scope.contactLoading = false; //默认不显示loading加载
        $scope.showMyBranch = true; //默认显示我的部门
        $scope.showClear = false; //默认隐藏搜索框的清楚按钮
        $scope.showBranchList = false; //默认隐藏搜索的结果列表

        $scope.branchKey = {getValue: ''}; //绑定输入的关键字
        $scope.historys = []; //存储搜索历史的关键字
        $scope.newPage = 0;

        $scope.myBranch = '';   //个人部门
        // $scope.myBranchDetail = '';  //个人小组
        $scope.branchList = [];

        var item = document.getElementById('branchInputSearch');
      }

      {
        //接收数据
        var page = $stateParams.page;
        var employeeCode = $stateParams.employeeCode;
        var branchId = $stateParams.branchId;
        var subjectId = $stateParams.subjectId;

        var myNumber = '{"params":{"p_employee_number":"' + window.localStorage.empno + '"}}'; //封装我的工号信息传参
        if(employeeCode){
          myNumber = '{"params":{"p_employee_number":"' + employeeCode + '"}}'; //封装已选择员工工号信息传参
          item.disabled = true;  //禁用输入框
        }



        var getMyBranchUrl = baseConfig.businessPath + "/api_resources_query/get_personal_department"; //我的部门接口地址
        var searchBranchUrl = baseConfig.businessPath + "/api_resources_query/query_departments"; //搜索部门接口地址
        var branchSearch = '{"params":{"p_department_value":"' + $scope.branchKey.getValue + '"}}'; //封装搜索部门信息传参
      }


      var showMyBranch = function () {
        $scope.contactLoading = true;
        hmsHttp.post(getMyBranchUrl, myNumber).success(function (result) {
          $scope.contactLoading = false;

          $scope.myBranch = result.returnData.my_branch_detail;

        }).error(function () {
          console.log('我的部门异常');
        });
      };
      showMyBranch();



      $scope.searchBranch = function () {
        $timeout(function () {
          $ionicScrollDelegate.$getByHandle('contentHandle').scrollTop();
        });
        $scope.showMyBranch = false;
        if ($scope.branchKey.getValue === '') {
          $scope.showBranchList = false;
          $scope.showMyBranch = true;
          $scope.showClear = false;
          $scope.contactLoading = false;
          $timeout(function () {
            $scope.branchList = [];
          }, 251); //防止过快
        } else {
          $scope.showClear = true;
          $scope.showBranchList = true;
          $scope.contactLoading = true;
        }

        branchSearch = '{"params":{"p_department_value":"' + $scope.branchKey.getValue + '"}}';

        hmsHttp.post(searchBranchUrl,branchSearch).success(function (result) {
          $scope.contactLoading = false;
          $scope.branchList = result.returnData;
          console.log($scope.branchList);


        }).error(function () {
          console.log('搜索部门异常');
        })

      };

      $scope.clearInputContent = function () { //响应清除输入框文字按钮的方法
        $scope.branchKey.getValue = '';
        $scope.searchBranch();
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };

      $scope.selectBranchItem = function (newBranch) { //把项目信息返回
        // dealHistory(newSub.sub_name);

        $scope.showMyBranch = true;
        $scope.showClear = false;
        $scope.branchList = [];
        $scope.branchKey.getValue = '';

        $rootScope.$broadcast("BRANCH_NAME",newBranch.unit_name);
        $rootScope.$broadcast("UNIT_ID",newBranch.unit_id);
        $rootScope.$broadcast("BRANCH_ID",newBranch.parent_id);
        $ionicHistory.goBack();
        
        /*if(newBranch.full_unit_name){
          $rootScope.$broadcast("BRANCH_NAME",newBranch.full_unit_name);
          $rootScope.$broadcast("UNIT_ID",newBranch.unit_id);
          $rootScope.$broadcast("BRANCH_ID",newBranch.parent_id);
          $ionicHistory.goBack();
        }else if(newBranch.unit_name && newBranch.unit_detail_list == ""){
          $rootScope.$broadcast("BRANCH_NAME",newBranch.unit_name);
          $rootScope.$broadcast("BRANCH_ID",newBranch.dept_id);
          $ionicHistory.goBack();
        }else if(newBranch == 'myBranchDetail'){
          $rootScope.$broadcast("BRANCH_NAME",$scope.myBranch.my_branch_detail);
          $rootScope.$broadcast("BRANCH_ID",$scope.myBranch.parent_id);
          $rootScope.$broadcast("UNIT_ID",$scope.myBranch.unit_id);
          $ionicHistory.goBack();
        }*/
        // }else if(newBranch == 'myBranch'){
        //   $rootScope.$broadcast("BRANCH_NAME",$scope.myBranch.my_branch);
        //   $rootScope.$broadcast("BRANCH_ID",$scope.myBranch.parent_id);
        //   $ionicHistory.goBack();


        // else{
        //   $rootScope.$broadcast("BRANCH_NAME",newBranch);
        //   $rootScope.$broadcast("BRANCH_ID",newBranch);
        //   $ionicHistory.goBack();
        // }


        // };

        // $state.go('tab.resources-query',
        //   {
        //     branchName: unit.full_unit_name
        //   }
        // );

      };








      $scope.hideBranchSearch = function () {
        $scope.showMyBranch = true;
        $scope.showClear = false;
        $scope.branchList = [];
        $scope.branchKey.getValue = '';
        $rootScope.$broadcast("BRANCH_NAME","");
        $rootScope.$broadcast("BRANCH_ID","");
        $rootScope.$broadcast("UNIT_ID","");
        $ionicHistory.goBack();
      };





    }]);
