/**
 * Created by Empire on 2016/8/30.(Sun Bohao)
 */
'use strict';
//--资源查询结果 部门模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.rsDetailSubject', {
          url: 'application/resources/detail/subject',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/resources-query/detail/rs-detail-subject.html',
              controller: 'rsDetailSubjectCtl'
            }
          },
          params: {
            dateFrom: "",
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
  .controller('rsDetailSubjectCtl', [

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
    '$ionicPopup',


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
              $q,
              $ionicPopup) {
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
      $scope.showInfinite = [false]; //默认隐藏无限滚动的标签
      $scope.contactLoading = false; //默认不显示loading加载
      $scope.showContent = false; //默认不显示整体页面
      $scope.subjectName = subjectName;
      $scope.resultList = [];//存储结果
      $scope.toggleCount = false;  //是否只显示异常项目开关，默认为关

      var postUrl = baseConfig.businessPath + "/api_resources_query/get_personal_resource"; //个人查询结果接口地址
      var postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId + '","p_page_number":"' + pageNumber + '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission + '"}}';


      $scope.goBack = function () {
        $scope.resultList = [];//存储结果
        $scope.newPage = [1];
        $scope.newMonthPage = 1;
        $scope.showContent = false; //默认不显示整体页面
        $scope.toggleCount = false;
        $ionicHistory.goBack();
      };


      var getBranchData = function (moreFlag) {
        if(baseConfig.debug){
          console.log(moreFlag);
        }
        // $scope.contactLoading = true;
        var q = $q.defer();
        if (moreFlag === 'init') {
          $scope.contactLoading = true;
        }
        hmsHttp.post(postUrl, postData).success(function (result) {

          $scope.contactLoading = false;

          if(baseConfig.debug) {
            console.log('result');
            console.log(result);
          }

          $scope.branchResourceList = result.project_resource_list;
          // $scope.branchResourceList = result.project_resource_list.sort(function (a, b) {
          //   return (a.record_date.substring(0,4)+a.record_date.substring(5,7)) - (b.record_date.substring(0,4)+b.record_date.substring(5,7));
          // });
          $scope.count = $scope.branchResourceList[0].timesheet_details.length;

          if ($scope.toggleCount) {  //开
            for (var i = 0; i < $scope.count; i++) {
              if ($scope.branchResourceList[0].timesheet_details[i].exception_project_days) { //异常天数>0时,为1
                $scope.branchResourceList[0].timesheet_details[i].isException = 1;
              } else { //异常天数=0时，为0
                $scope.branchResourceList[0].timesheet_details[i].isException = 0;
              }
            }
          } else {   //关
            for (var i = 0; i < $scope.count; i++) {
              if ($scope.branchResourceList[0].timesheet_details[i].exception_project_days) { //异常天数>0时,为2
                $scope.branchResourceList[0].timesheet_details[i].isException = 2;
              } else { //异常天数=0时，为1
                $scope.branchResourceList[0].timesheet_details[i].isException = 1;
              }
            }
          }

          if ($scope.count == 0) {
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
                if(baseConfig.debug){
                  console.log("第一次加载完成");
                }
              } else {
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
              } else {
                for (var n = 0; n < $scope.count; n++) {
                  $scope.resultList[$scope.monthIndex].timesheet_details.push($scope.branchResourceList[0].timesheet_details[n]);
                }
              }
              q.resolve($scope.resultList);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

            //在此拼接
            if(baseConfig.debug) {
              console.log('hello');
              console.log($scope.resultList);
            }
            if (moreFlag === 'init') {
              $scope.newMonthPage = 2;
              $scope.loadMoreMonth();
              $scope.showContent = true; //显示整体页面
            }
          }
          return q.promise;


        }).error(function () {
          if(baseConfig.debug){
            console.log('部门查询结果异常');
          }
          $scope.contactLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      var getBranchMonth = function () {
        hmsHttp.post(postUrl, postData).success(function (result) {

          $scope.branchMonthList = result.project_resource_list[0];

          if ($scope.toggleCount) {  //开
            for (var i = 0; i < $scope.branchMonthList.timesheet_details.length; i++) {
              if ($scope.branchMonthList.timesheet_details[i].exception_project_days) { //异常天数>0时,为2
                $scope.branchMonthList.timesheet_details[i].isException = 1;
              } else { //异常天数=0时，为1
                $scope.branchMonthList.timesheet_details[i].isException = 0;
              }
            }
          } else {   //关
            for (var i = 0; i < $scope.branchMonthList.timesheet_details.length; i++) {
              if ($scope.branchMonthList.timesheet_details[i].exception_project_days) { //异常天数>0时,为2
                $scope.branchMonthList.timesheet_details[i].isException = 2;
              } else { //异常天数=0时，为1
                $scope.branchMonthList.timesheet_details[i].isException = 1;
              }
            }
          }

          if ($scope.branchMonthList) {
            $scope.resultList.push($scope.branchMonthList);
          }
          $ionicSlideBoxDelegate.$getByHandle('branch-handle').update();
          if(baseConfig.debug){
            console.log($scope.resultList);
          }
          // console.log($scope.yearMonth);
        }).error(function () {
          if(baseConfig.debug){
            console.log('部门查询结果下一月份异常');
          }
        });
      };

      $scope.newMonthPage = 1;
      getBranchData('init');
      // $scope.newMonthPage += 1;
      // $scope.loadMoreMonth();

      // $timeout(function () {
      //   $scope.showContent = true; //显示整体页面
      // },300);


      $scope.loadMore = function (monthIndex) { //加载下一页

        if(baseConfig.debug) {
          console.log('横向页数');
          console.log(monthIndex);
        }

        $scope.newPage[monthIndex] += 1;
        if(baseConfig.debug) {
          console.log($scope.newPage);
          console.log($scope.showInfinite);
        }
        postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId + '","p_page_number":"' + $scope.newPage[monthIndex] + '","p_month_page":"' + $scope.monthPage + '","p_dismission":"' + dimission + '"}}';
        if(baseConfig.debug){
          console.log("hahahahhahahaahha");
        }
        getBranchData('loadMore');

      };

      $scope.loadMoreMonth = function () { //加载下一个月份的数据
        $scope.newPage.push(1);
        $scope.showInfinite.push(true);
        postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId + '","p_page_number":"' + 1 + '","p_month_page":"' + $scope.newMonthPage + '","p_dismission":"' + dimission + '"}}';
        getBranchMonth();
      };

      $scope.monthChanged = function (index) {  //下面日历滑动时触发

        $scope.monthIndex = index;
        $scope.monthPage = index + 1;
        if(baseConfig.debug){
          console.log(index);
        }
        // console.log($scope.newPage);
        // console.log($scope.newMonthPage);
        if ($scope.monthIndex == $scope.newMonthPage - 1) {
          if(baseConfig.debug){
            console.log('3123123123123');
          }
          $scope.newMonthPage += 1;
          $scope.loadMoreMonth();
        }

      };

      $scope.goEmployeeDetail = function (employeeCode, employeeName, currentMonth) {
        var currentDate = new Date(currentMonth);
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth();
        var newYear = year;
        var newMonth = month + 1;
        if (newMonth > 12) {
          newYear++;
          newMonth = 1;
        }
        var newDate = new Date(newYear, newMonth, 1);
        var lastDate = new Date(newDate - 3600000 * 24).getDate();
        var dateFromCurrent = currentMonth + '-01';
        var dateToCurrent = currentMonth + '-' + lastDate;

        if ($scope.toggleCount) { //开
          var empList = $scope.resultList[$scope.monthIndex].timesheet_details;
          var exceptionEmpList = [];
          for (var i = 0; i < empList.length; i++) {
            if (empList[i].exception_project_days) {
              exceptionEmpList.push(empList[i]);
            }
          }
        }

        $state.go('tab.rsDetailPerson3',
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
            dimission: dimission,
            exceptionEmpList: exceptionEmpList
          }
        );
      };

      // 定义弹窗
      $scope.showPopup = function (word) {
        $scope.data = {};
        // 一个精心制作的自定义弹窗
        var myPopup = $ionicPopup.show({
          title: word
        });
        myPopup.then(function (res) {
          if(baseConfig.debug){
            console.log('Tapped!', res);
          }
        });
        $timeout(function () {
          myPopup.close(); //由于某种原因2秒后关闭弹出
        }, 2000);
      };


      $scope.toggle = function () {
        if(baseConfig.debug){
          console.log($scope.resultList);
        }
        $scope.toggleCount = !$scope.toggleCount;
        if ($scope.toggleCount) {
          if(baseConfig.debug){
            console.log('只显示异常项目');
          }
          $scope.showPopup('只显示异常项目人员！');
          for (var i = 0; i < $scope.resultList.length; i++) {
            for (var j = 0; j < $scope.resultList[i].timesheet_details.length; j++) {
              $scope.resultList[i].timesheet_details[j].isException--;
            }
          }
        } else {
          if(baseConfig.debug){
            console.log('显示所有项目');
          }
          $scope.showPopup('显示所有项目人员！');
          for (var i = 0; i < $scope.resultList.length; i++) {
            for (var j = 0; j < $scope.resultList[i].timesheet_details.length; j++) {
              $scope.resultList[i].timesheet_details[j].isException++;
            }
          }
        }
      }

    }
  ]);
