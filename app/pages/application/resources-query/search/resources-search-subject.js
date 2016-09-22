/**
 * Created by Empire on 2016/9/1.
 */

//--资源查询 项目搜索模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.resourcesSearchSubject', {
          url: 'application/resources/resourcesSearchSubject',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/search/resources-search-subject.html',
              controller: 'resourcesSearchSubjectCtl'
            }
          },
          params: {
            page: "",
            employeeCode: "",
            branchId: "",
            subjectId: ""
          }
        });
    }]);

angular.module('applicationModule')
  .controller('resourcesSearchSubjectCtl',[
    '$scope',
    '$state',
    '$ionicHistory',
    '$stateParams',
    '$timeout',
    '$rootScope',
    'hmsHttp',
    'baseConfig',

    function ($scope,
              $state,
              $ionicHistory,
              $stateParams,
              $timeout,
              $rootScope,
              hmsHttp,
              baseConfig


    ){


      {
        $scope.showInfinite = false; //默认隐藏无限滚动的标签
        $scope.contactLoading = false; //默认不显示loading加载
        $scope.showMySubject = true; //默认显示我的项目
        $scope.showClear = false; //默认隐藏搜索框的清除按钮
        $scope.subjectList = []; //存储搜索结果
        $scope.subjectKey = {getValue: ''}; //绑定输入的关键字

        $scope.newPage = 0;

        var item = document.getElementById("subjectInputSearch");
        item.disabled=true;  //禁用输入框
      }

      {
        //接收数据
        var page = $stateParams.page;
        var employeeCode = $stateParams.employeeCode;
        var branchId = $stateParams.branchId;
        var subjectId = $stateParams.subjectId;

        // console.log(employeeCode);
        // console.log(branchId);
        if(employeeCode == ""  && branchId == ""){
          item.disabled=false;  //启用输入框
        }
        if(employeeCode == ""){
          employeeCode = window.localStorage.empno;
        }


        var myNumber = '{"params":{"p_employee_number":"' + employeeCode + '"}}'; //封装已选择员工工号信息传参
        var getMySubjectUrl = baseConfig.businessPath + "/api_resources_query/get_personal_projects"; //我的项目接口地址

        var searchInfo = '{"params":{"p_employee_number":"' + employeeCode + '","p_branch_id":"' + branchId +  '","p_project_id":"' + subjectId +  '"}}';
        var getBranchSubjectUrl = baseConfig.businessPath + "/api_resources_query/query_branch_project"; //部门项目接口地址

        var searchSubjectUrl = baseConfig.businessPath + "/api_resources_query/query_projects"; //搜索项目接口地址
        var subjectSearch = '{"params":{"p_project_value":"' + $scope.subjectKey.getValue + '","p_employee_number":"' + employeeCode +  '","p_project_id":"' + branchId +  '"}}'; //封装搜索项目信息传参
      }

      var showBranchSubject = function () {
        hmsHttp.post(getBranchSubjectUrl, searchInfo).success(function (result) {

          // console.log(branchId);
          // console.log(searchInfo);
          // console.log(getBranchSubjectUrl);
          // console.log(result);
          // console.log(result.returnMsg);
          // console.log(result.returnCode);
          // console.log(result.project_list);

          $scope.mySubject = result.project_list;


        }).error(function () {
          console.log('按部门查项目接口异常')
        })
      };

      var showMySubject = function () {
        hmsHttp.post(getMySubjectUrl, myNumber).success(function (result) {
          // console.log(myNumber);
          // console.log(getMySubjectUrl);
          var returnCode = result.returnCode;
          var returnMsg = result.returnMsg;
          var returnData = result.returnData;

          $scope.mySubject = returnData.my_project_list;
          // console.log(returnCode);
          // console.log(returnMsg);
          // console.log(returnData);
          // console.log($scope.mySubject);
        }).error(function () {
          console.log('我的项目异常');
        });
      };

      if(employeeCode && !branchId){
        showMySubject();
      }
      if(branchId){
        showBranchSubject();
      }





      $scope.searchSubject = function () {

        $scope.showMySubject = false;
        if ($scope.subjectKey.getValue === '') {
          $scope.showMySubject = true;
          $scope.showClear = false;
          $timeout(function () {
            $scope.subjectList = [];
          }, 251); //防止过快
        } else {
          $scope.showClear = true;
        }

        subjectSearch = '{"params":{"p_project_value":"' + $scope.subjectKey.getValue + '"}}';

        hmsHttp.post(searchSubjectUrl,subjectSearch).success(function (result) {

          var subjectData = result.returnData;

          // console.log(subjectData);

          $scope.subjectList = subjectData.project_list;

        }).error(function () {
          console.log('搜索项目异常');
        })

      };


      $scope.clearInputContent = function () { //响应清除输入框文字按钮的方法
        $scope.subjectKey.getValue = '';
        $scope.searchSubject();
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };




      $scope.selectSubjectItem = function (subject) { //把项目信息返回
        // dealHistory(newSub.sub_name);
        $scope.showMySubject = true;
        $scope.showClear = false;
        $scope.resultList = [];
        $scope.subjectKey.getValue = '';
        // if (commonContactService.getContactFlag() === 'carpooling-new-contactSearch') {
        //   commonContactService.setEmpInfo(newEmp);
        //   $rootScope.$broadcast("SEND_EMP_INFO");
        //   $ionicHistory.goBack();
        // } else {
        //   // $scope.authorize = function(){
        $rootScope.$broadcast("SUBJECT_NAME",subject.project_name);
        $rootScope.$broadcast("SUBJECT_ID",subject.project_id);
        $ionicHistory.goBack();
        //   // };
        //   $state.go('tab.resources-query',
        //     {
        //       subjectNumber: newSub.id,
        //       subjectName: newSub.name
        //     }
        //   );
        // }

        // $state.go('tab.resources-query',
        //   {
        //     subjectNumber: newSub.id,
        //     subjectName: newSub.name
        //   }
        // );

      };


      $scope.hideSubjectSearch = function () {
        $scope.showMySubject = true;
        $scope.showClear = false;
        $scope.subjectList = [];
        $scope.subjectKey.getValue = '';
        $rootScope.$broadcast("SUBJECT_NAME","");
        $rootScope.$broadcast("SUBJECT_ID","");
        $ionicHistory.goBack();
      };



    }]);
