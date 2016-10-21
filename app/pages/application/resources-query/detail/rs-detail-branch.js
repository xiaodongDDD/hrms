/**
 * Created by Empire on 2016/8/30.(sunbohao)
 */
'use strict';
//--资源查询结果 部门模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.rsDetailBranch', {
          url: 'application/resources/detail/branch',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/detail/rs-detail-branch.html',
              controller: 'rsDetailBranchCtl'
            }
          },
          params: {
            dateFrom:"",
            dateTo: "",
            employeeName: "",
            employeeCode: "",
            branchName: "",
            branchId: "",
            unitId: "",
            subjectName: "",
            subjectId: "",
            dimission: false
          }
        });
    }]);

angular.module('applicationModule')
  .controller('rsDetailBranchCtl', [

    '$scope',
    '$state',
    '$ionicHistory',
    '$ionicModal',
    '$timeout',
    'hmsPopup',
    'hmsHttp',
    'baseConfig',
    '$stateParams',
    '$ionicScrollDelegate',
    '$ionicSlideBoxDelegate',
    '$q',




    function ($scope,
              $state,
              $ionicHistory,
              $ionicModal,
              $timeout,
              hmsPopup,
              hmsHttp,
              baseConfig,
              $stateParams,
              $ionicScrollDelegate,
              $ionicSlideBoxDelegate,
              $q
    ) {

      $scope.goBack = function () {
        $scope.resultList = [];//存储结果
        $scope.newPage = [1];
        $scope.newMonthPage = 1;
        $scope.showContent = false;
        $ionicHistory.goBack();
      };

      var dateFrom = $stateParams.dateFrom;
      var dateTo = $stateParams.dateTo;
      var employeeName = $stateParams.employeeName;
      var employeeCode = $stateParams.employeeCode;
      var branchName = $stateParams.branchName;
      var branchId = $stateParams.branchId;
      var unitId = $stateParams.unitId;
      var subjectName = $stateParams.subjectName;
      var subjectId = $stateParams.subjectId;
      var dimission = $stateParams.dimission;
      var pageNumber = 1;
      var monthPage = 1;
      $scope.newPage = [1];
      $scope.newMonthPage = 1;
      $scope.monthPage = 1;
      $scope.monthIndex = 0;
      $scope.branchName = branchName;
      $scope.showInfinite = [false]; //默认隐藏无限滚动的标签
      $scope.contactLoading = false; //默认不显示loading加载
      $scope.showContent = false; //默认不显示整体页面

      //计算月份差
      // var date1 = dateFrom.split('-');
      // date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
      // var date2 = dateTo.split('-');
      // date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
      // var m = Math.abs(date2 - date1);

      $scope.resultList = [];//存储结果

      var postUrl = baseConfig.businessPath + "/api_resources_query/get_personal_resource"; //个人查询结果接口地址
      var postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';

      // $scope.run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行

      var getBranchData = function (moreFlag) {
        console.log(moreFlag);
        $scope.contactLoading = true;
        var q = $q.defer();
        if (moreFlag === 'init') {
          $scope.contactLoading = true;
        }
        hmsHttp.post(postUrl, postData).success(function (result) {

          $scope.contactLoading = false;

          console.log('result');
          console.log(result);

          $scope.branchResourceList = result.branch_resource_list;
            // $scope.branchResourceList = result.branch_resource_list.sort(function (a, b) {
            //   return (a.record_date.substring(0,4)+a.record_date.substring(5,7)) - (b.record_date.substring(0,4)+b.record_date.substring(5,7));
            // });
          $scope.count = $scope.branchResourceList[0].timesheet_details.length;


          if ($scope.count  == 0) {
            $scope.showInfinite[$scope.monthIndex] = false;
            if (moreFlag === 'loadMore') {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.resultList = [];
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            if ($scope.count < 10) {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if (moreFlag == 'init') {
                $scope.resultList = $scope.branchResourceList;
                console.log("第一次加载完成");
              }else{
                for (var j = 0; j < $scope.count; j++) {
                  $scope.resultList[$scope.monthIndex].timesheet_details.push($scope.branchResourceList[0].timesheet_details[j]);
                }
              }
              q.resolve($scope.resultList);
              $scope.showInfinite[$scope.monthIndex] = false;
              // $ionicSlideBoxDelegate.$getByHandle('subject-handle').update();
            } else {
              $scope.showInfinite[$scope.monthIndex] = true;
              if ($scope.newPage[$scope.monthIndex] == 1) {
                $scope.resultList = $scope.branchResourceList;
              }else {
                for (var n = 0; n < $scope.count; n++) {
                  $scope.resultList[$scope.monthIndex].timesheet_details.push($scope.branchResourceList[0].timesheet_details[n]);
                }
              }
              q.resolve($scope.resultList);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

            //在此拼接
            console.log('hello');
            console.log($scope.resultList);
            if(moreFlag === 'init'){
              $scope.newMonthPage = 2;
              $scope.loadMoreMonth();
              $scope.showContent = true;
            }
          }
          return q.promise;


        }).error(function () {
          console.log('部门查询结果异常');
          $scope.contactLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      var getBranchMonth = function () {
        hmsHttp.post(postUrl, postData).success(function (result) {

          $scope.branchMonthList = result.branch_resource_list[0];
          if($scope.branchMonthList){
            $scope.resultList.push($scope.branchMonthList);
          }
          $ionicSlideBoxDelegate.$getByHandle('branch-handle').update();
          console.log($scope.resultList);
          // console.log($scope.yearMonth);
        }).error(function () {
          console.log('部门查询结果下一月份异常');
        });
      };

      $scope.newMonthPage = 1 ;
      getBranchData('init');
      // $scope.newMonthPage += 1;
      // $scope.loadMoreMonth();

      // $timeout(function () {
      //   $scope.showContent = true;
      // },300);


      $scope.loadMore = function (monthIndex) { //加载下一页

        console.log('横向页数');
        console.log(monthIndex);

        $scope.newPage[monthIndex] += 1;
        console.log($scope.newPage);
        console.log($scope.showInfinite);
        postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage[monthIndex] + '","p_month_page":"' + $scope.monthPage + '","p_dismission":"' + dimission +  '"}}';
        console.log("hahahahhahahaahha");
        getBranchData('loadMore');

      };

      $scope.loadMoreMonth = function () { //加载下一个月份的数据
        $scope.newPage.push(1);
        $scope.showInfinite.push(true);
        postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + 1 + '","p_month_page":"' + $scope.newMonthPage + '","p_dismission":"' + dimission +  '"}}';
        getBranchMonth();
      };

      $scope.monthChanged = function (index) {  //下面日历滑动时触发

        $scope.monthIndex=index;
        $scope.monthPage = index + 1;
        console.log(index);
        // console.log($scope.newPage);
        // console.log($scope.newMonthPage);
        if($scope.monthIndex == $scope.newMonthPage - 1){
          console.log('3123123123123');
          $scope.newMonthPage += 1;
          $scope.loadMoreMonth();
        }
      };

      $scope.goEmployeeDetail = function (employeeCode,employeeName,currentMonth) {
        var currentDate = new Date(currentMonth);
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth();
        var newYear = year;
        var newMonth = month+1;
        if(newMonth>12){
          newYear++;
          newMonth = 1;
        }
        var newDate = new Date(newYear,newMonth,1);

        var lastDate = new Date(newDate - 3600000 * 24).getDate();

        var dateFromCurrent = currentMonth + '-01';
        var dateToCurrent = currentMonth + '-' +lastDate;


        $state.go('tab.rsDetailPerson2',
          {
            dateFrom: dateFromCurrent,
            dateTo: dateToCurrent,
            employeeName: employeeName,
            employeeCode: employeeCode,
            branchName: branchName,
            branchId: branchId,
            unitId: unitId,
            subjectName: subjectName,
            subjectId: subjectId,
            dimission: dimission
          }
        );
      };


    }
  ]);
