/**
 * Created by Empire on 2016/8/26.
 */
'use strict';
//--资源查询结果 个人模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.rsDetailPerson', {
          url: 'application/resources/detail/person',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/detail/rs-detail-person.html',
              controller: 'rsDetailPersonCtl'
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
        })
        .state('tab.rsDetailPerson2', {
          url: 'application/resources/detail/person',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/detail/rs-detail-person.html',
              controller: 'rsDetailPersonCtl'
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
        })
        .state('tab.rsDetailPerson3', {
          url: 'application/resources/detail/person',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/detail/rs-detail-person.html',
              controller: 'rsDetailPersonCtl'
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
  .controller('rsDetailPersonCtl', [

    '$scope',
    '$state',
    '$ionicHistory',
    '$ionicModal',
    '$timeout',
    'hmsPopup',
    'hmsHttp',
    'baseConfig',
    '$ionicScrollDelegate',
    '$stateParams',
    '$ionicTabsDelegate',
    '$ionicSlideBoxDelegate',



    function ($scope,
              $state,
              $ionicHistory,
              $ionicModal,
              $timeout,
              hmsPopup,
              hmsHttp,
              baseConfig,
              $ionicScrollDelegate,
              $stateParams,
              $ionicTabsDelegate,
              $ionicSlideBoxDelegate



    ) {


      $scope.employeeList = "";  //初始化人员列表
      $scope.employeeListSlide = []; //初始化3个呈现的人元列表
      $scope.empInfo = "";   //初始化此员工信息
      $scope.subject = "";   //初始化项目列表
      $scope.resourceDetails = "";   //初始化查询结果
      $scope.yearMonth = ""; //初始化日历年月
      $scope.newPage = 1;

      $scope.contactLoading = false; //默认不显示loading加载
      $scope.showContent = false; //默认不显示整体页面
      $scope.resultList = []; //初始化最终呈现的结果
      $scope.resultProList = [];
      $scope.empInfo = [];


      var oSlide = document.getElementById('next-slide');
      // var portraitBackground = oSlide.getElementsByClassName('person-head-image');

      // var date = new Date();
      var year = "";
      var month = "";

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

      //周列表
      $scope.weekTitleList = [
        '日', '一', '二', '三', '四', '五', '六'
      ];

      var postUrl = baseConfig.businessPath + "/api_resources_query/get_personal_resource"; //个人查询结果接口地址
      var postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';

      var empListUrl = baseConfig.businessPath + "/api_resources_query/get_employee_list"; //人员列表接口地址
      var searchInfo = '{"params":{"p_employee_number":"' + employeeCode + '","p_branch_id":"' + unitId +  '","p_project_id":"' + subjectId +  '"}}';

      var empPictureUrl = baseConfig.businessPath + "/api_employee/get_employee_code"; //人员头像接口地址
      var empCode = '{"params":{"p_employee_code":"' + employeeCode +  '"}}';

      // $scope.slideIndex = 0;

      var getEmpList = function (postUrl,postData) { //获取人员列表

        hmsHttp.post(postUrl, postData).success(function (result) {

          // console.log(result.employee_list);
          $scope.employeeList = result.employee_list.sort(function (a, b) {
            return(a.employee_number - b.employee_number);
          });



          console.log('人员列表啊');
          console.log($scope.employeeList);

          for(var i=0; i<$scope.employeeList.length; i++){
            if(employeeCode == $scope.employeeList[i].employee_number){
              $scope.slideIndex = i;
              break;
            }
          }
          $scope.empInfo = $scope.employeeList[i];
          // $scope.employeeListSlide.push($scope.employeeList[$scope.slideIndex]) ;
          // console.log($scope.employeeListSlide);
          // $ionicSlideBoxDelegate.$getByHandle('employee-handle').update();

          if($scope.employeeList[$scope.slideIndex - 1]){
            // $scope.employeeListSlide.reverse().push($scope.employeeList[$scope.employeeIndex - 1]);
            // $scope.employeeListSlide.reverse();
            $scope.lastEmp = $scope.employeeList[$scope.slideIndex - 1];

            $scope.lastArrow = true;
          }else{
            $scope.lastEmp = "";
            $scope.lastArrow = false;
          }
          if($scope.employeeList[$scope.slideIndex + 1]){
            // $scope.employeeListSlide.push($scope.employeeList[$scope.employeeIndex + 1]);
            $scope.nextEmp = $scope.employeeList[$scope.slideIndex + 1];
            $scope.nextArrow = true;
          }else{
            $scope.nextEmp = "";
            $scope.nextArrow = false;
          }


        }).error(function () {
          console.log('人员列表接口异常');
        })
      };

      $scope.lastPerson = function () {
        if($scope.employeeList[$scope.slideIndex - 1]){
          $scope.resultList = []; //初始化最终呈现的结果
          $scope.resultProList = [];
          $scope.slideIndex--;
          $scope.empInfo = $scope.employeeList[$scope.slideIndex];
          if($scope.employeeList[$scope.slideIndex - 1]){
            $scope.lastEmp = $scope.employeeList[$scope.slideIndex - 1];
            $scope.lastArrow = true;
          }else{
            $scope.lastEmp = "";
            $scope.lastArrow = false;
          }
          if($scope.employeeList[$scope.slideIndex + 1]){
            $scope.nextEmp = $scope.employeeList[$scope.slideIndex + 1];
            $scope.nextArrow = true;
          }else{
            $scope.nextEmp = "";
            $scope.nextArrow = false;
          }
          employeeCode = $scope.employeeList[$scope.slideIndex].employee_number;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('init');
        }

      };
      $scope.nextPerson = function () {
        if($scope.employeeList[$scope.slideIndex + 1]){
          $scope.resultList = []; //初始化最终呈现的结果
          $scope.resultProList = [];
          $scope.slideIndex++;
          $scope.empInfo = $scope.employeeList[$scope.slideIndex];
          if($scope.employeeList[$scope.slideIndex - 1]){
            $scope.lastEmp = $scope.employeeList[$scope.slideIndex - 1];
            $scope.lastArrow = true;
          }else{
            $scope.lastEmp = "";
            $scope.lastArrow = false;
          }
          if($scope.employeeList[$scope.slideIndex + 1]){
            $scope.nextEmp = $scope.employeeList[$scope.slideIndex + 1];
            $scope.nextArrow = true;
          }else{
            $scope.nextEmp = "";
            $scope.nextArrow = false;
          }

          employeeCode = $scope.employeeList[$scope.slideIndex].employee_number;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('init');
        }

      };


      // $scope.$on('$ionicView.afterEnter', function () {
      // $timeout(function () {
      //   getEmpList(empListUrl,searchInfo);
      // },200);
      // });


      // $scope.activeSlide=function(index){//点击时候触发
      //   $scope.slectIndex=index;
      //   $ionicSlideBoxDelegate.slide(index);
      // };
      // $scope.slideChanged=function(index){//  上面人员滑动时候触发
      //
      //   $scope.resultList = []; //初始化最终呈现的结果
      //   $scope.resultProList = [];
      //   // $scope.slideIndex=index;
      //   $scope.monthIndex = 0;
      //   $scope.newPage = 1;
      //   if($scope.employeeList[index - 1]){
      //     $scope.lastEmp = $scope.employeeList[index - 1];
      //     $scope.lastArrow = true;
      //
      //   }else{
      //     $scope.lastEmp = "";
      //     $scope.lastArrow = false;
      //   }
      //   if($scope.employeeList[index + 1]){
      //     $scope.nextEmp = $scope.employeeList[index + 1];
      //     $scope.nextArrow = true;
      //   }else{
      //     $scope.nextEmp = "";
      //     $scope.nextArrow = false;
      //   }
      //   employeeCode = $scope.employeeList[index].employee_number;
      //   postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
      //   getData('init');
      //
      // };



      $scope.monthChanged = function (index) {  //下面日历滑动时触发
        $scope.monthIndex=index;
        console.log(index);
        $scope.loadMore(index);
        $scope.projectList = $scope.resultProList[index];

      };


      // var getEmpPicture = function (url,empCode) {   //获取员工头像
      //   hmsHttp.post(url, empCode).success(function (result) {
      //
      //     $scope.empInfo = result.result;
      //     console.log($scope.empInfo);
      //
      //
      //   }).error(function () {
      //     console.log('员工头像接口异常')
      //   })
      // };



      $scope.loadMore = function (index) { //加载下一页

        if($scope.newPage == 1 && index == 1){
          $scope.newPage = 2;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 2 && index == 3){
          $scope.newPage = 3;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 3 && index == 5){
          $scope.newPage = 4;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 4 && index == 7){
          $scope.newPage = 5;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 5 && index == 9){
          $scope.newPage = 6;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 6 && index == 11){
          $scope.newPage = 7;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 7 && index == 13){
          $scope.newPage = 8;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 8 && index == 15){
          $scope.newPage = 9;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 9 && index == 17){
          $scope.newPage = 10;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 10 && index == 19){
          $scope.newPage = 11;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 11 && index == 21){
          $scope.newPage = 12;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 12 && index == 23){
          $scope.newPage = 13;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
      };


      function getData(moreFlag) {
        // $scope.contactLoading = true;
        if (moreFlag === 'init') {
          $scope.contactLoading = true;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + 1 +  '","p_month_page":"' + monthPage + '","p_dismission":"' + dimission +  '"}}';
        }
        hmsHttp.post(postUrl, postData).success(function (result) {

          //年月排序
          $scope.resourceDetails = result.resource_details.sort(function (a, b) {
            return (a.record_date.substring(0,4)+a.record_date.substring(5,7)) - (b.record_date.substring(0,4)+b.record_date.substring(5,7));
          });

          //上颜色
          for(var j=0; j<$scope.resourceDetails.length; j++){

            if($scope.resourceDetails[j].project_list[0]){
              $scope.resourceDetails[j].project_list[0].color = "#86e2d5";
            }
            if($scope.resourceDetails[j].project_list[1]){
              $scope.resourceDetails[j].project_list[1].color = "#6bb9f0";
            }
            if($scope.resourceDetails[j].project_list[2]){
              $scope.resourceDetails[j].project_list[2].color = "#e08283";
            }
            if($scope.resourceDetails[j].project_list[3]){
              $scope.resourceDetails[j].project_list[3].color = "#f8e71c";
            }
            if($scope.resourceDetails[j].project_list[4]){
              $scope.resourceDetails[j].project_list[4].color = "#93408a";
            }
            if($scope.resourceDetails[j].project_list[5]){
              $scope.resourceDetails[j].project_list[5].color = "#fa9e34";
            }
            if($scope.resourceDetails[j].project_list[6]){
              $scope.resourceDetails[j].project_list[6].color = "#e4517b";
            }
            if($scope.resourceDetails[j].project_list[7]){
              $scope.resourceDetails[j].project_list[7].color = "#c9a666";
            }

          }

          //封装resultList，resultProList
          for(var i=0; i<$scope.resourceDetails.length; i++){
            $scope.yearMonth = new Date($scope.resourceDetails[i].record_date);
            year = $scope.yearMonth.getFullYear();
            month = $scope.yearMonth.getMonth();
            $scope.resultList.push(initDate(year,month));
            $ionicSlideBoxDelegate.$getByHandle('month-handle').update();
            $scope.resultProList.push($scope.resourceDetails[i].project_list);
          }

          // $scope.resultList.push($scope.monthSlideList);

          console.log($scope.resultList);
          console.log($scope.resultProList);
          console.log(result);

          if(moreFlag === 'init'){
            $scope.contactLoading = false;
            $scope.projectList = $scope.resultProList[0];
          }


          // console.log($scope.monthSlideList);
          // console.log($scope.yearMonth);
        }).error(function () {
          console.log('个人查询结果异常');
        });


      };


      getData('init');
      // getEmpPicture(empPictureUrl,empCode);
      getEmpList(empListUrl,searchInfo);

      // $timeout(function () {
      //   $scope.showContent = true; //显示整体页面
      // },300);

      $scope.goBackPage = function () {
        $scope.showContent = false; //默认不显示整体页面
        $scope.empInfo = [];
        $ionicHistory.goBack();
      };


      //初始化当前时间
      // var date = new Date($scope.yearMonth);
      // var year = $scope.yearMonth.getFullYear();
      // var month = $scope.yearMonth.getMonth();

      var initDate = function (yea,mont) {
        var EnglishMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        $scope.currentYear = yea;
        $scope.currentMonth = mont + 1;
        $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];
        var recordDate = $scope.currentYear + '-' + $scope.currentMonth;
        if($scope.currentMonth<10){
          recordDate = $scope.currentYear + '-0' + $scope.currentMonth;
        }


        console.log($scope.resourceDetails);

        // $scope.lastMonth = function () {
        //   $scope.currentMonth--;
        //   if ($scope.currentMonth == 0) {
        //     $scope.currentMonth = 12;
        //     $scope.currentYear--;
        //   }
        //   $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];
        //   initCalendar($scope.currentYear, $scope.currentMonth);
        //   if($scope.currentMonth<10){
        //     recordDate = $scope.currentYear + '-0' + $scope.currentMonth;
        //   }else{
        //     recordDate = $scope.currentYear + '-' + $scope.currentMonth;
        //   }
        //
        //   subjectNode(recordDate);
        // };
        // $scope.nextMonth = function () {
        //   $scope.currentMonth++;
        //   if ($scope.currentMonth == 13) {
        //     $scope.currentMonth = 1;
        //     $scope.currentYear++;
        //   }
        //   $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];
        //   initCalendar($scope.currentYear, $scope.currentMonth);
        //   if($scope.currentMonth<10){
        //     recordDate = $scope.currentYear + '-0' + $scope.currentMonth;
        //   }else{
        //     recordDate = $scope.currentYear + '-' + $scope.currentMonth;
        //   }
        //   subjectNode(recordDate);
        // };

        //周列表
        $scope.weekTitleList = [
          '日', '一', '二', '三', '四', '五', '六'
        ];

        var initCalendarArray = [];

        //初始化日历数组
        var initCalendar = function (year, month) {
          var date = new Date();
          try {
            if (year && month) {
              date = new Date(year, parseInt(month) - 1, 1);
            }
            else {
              date = new Date();
            }
          } catch (e) {
            date = new Date();
          }
          date.setDate(1);

          var firstDay = date.getDay();

          date.setMonth(date.getMonth() + 1);
          var lastDate = new Date(date - 3600000 * 24);

          var monthTotalDay = lastDate.getDate();

          initCalendarArray = [];

          var calendarLine = Math.ceil((firstDay + monthTotalDay) / 7);

          for (var i = 0; i < (firstDay + monthTotalDay); i++) {
            if (i < firstDay) {
              initCalendarArray.push('');
            } else {
              initCalendarArray.push(i - firstDay + 1);
            }
          }



          $scope.calendar = [];
          $scope.calendarDayList = [];
          var seq = 0;
          for (i = 0; i < calendarLine; i++) {
            // var style_blank = 'each-day-blank';
            // var style_color = 'day-item';
            // var style_approve = 'each-day-approve';
            // var style_reject = 'each-day-reject';
            // var style_attendance = 'each-day-attendance';
            // var project = '';
            var week = {
              week: i,
              list: []
            };
            for (var j = 0; j < 7; j++) {
              var item;
              if (initCalendarArray[seq]) {
                item = {
                  day: initCalendarArray[seq],
                  isSubject: false,
                  isHoliday: false,
                  subjectID: 0,
                  subjectName: '',
                  subjectColor: '',
                  isSubject1: false,
                  isSubject2: false,
                  isSubject3: false,
                  isSubject4: false
                  // style_outline: style_approve,
                  // style_color: style_color,
                  // project: project
                }
              }
              else {
                item = {
                  day: '',
                  subject: '',
                  isSubject: false,
                  isHoliday: false,
                  subjectID: 0,
                  subjectName: '',
                  isSubject1: false,
                  isSubject2: false,
                  isSubject3: false,
                  isSubject4: false
                  // style_outline: style_blank,
                  // style_color: style_color,
                  // project: project
                };
              }
              week.list.push(item);
              $scope.calendarDayList.push(item);
              seq = seq + 1;
            }
            $scope.calendar.push(week);

          }
        };

        initCalendar($scope.currentYear, $scope.currentMonth);
      // console.log($scope.calendar);


      // for(var a=0; a<$scope.calendar.length; a++){
      //   for(var b=0; b<7; b++){
      //     console.log($scope.calendar[a][b]);
      //   }
      // }
      // console.log($scope.calendarDayList);

        var subjectNode = function(recordDate){

          // for(var x=0; x<$scope.subject.length; x++){
          //
          // }
          // $scope.monthSubjectList = MonthSubjectList.all();
          // $scope.resourceDetails
          $scope.everydaySubjectList = [];

          for(var i=0; i<$scope.resourceDetails.length; i++){
            // console.log($scope.resourceDetails[i].record_date);
            if($scope.resourceDetails[i].record_date == recordDate){
              // console.log($scope.resourceDetails[i].record_date);
              $scope.everydaySubjectList = $scope.resourceDetails[i].timesheet_details;
              $scope.subject = $scope.resourceDetails[i].project_list;

              for(var k=0; k<$scope.everydaySubjectList.length; k++){

                for(var m=0; m<$scope.calendarDayList.length; m++){
                  // console.log($scope.calendar[m]);
                  if($scope.everydaySubjectList[k].record_date.substring(8,10) == $scope.calendarDayList[m].day){
                    $scope.calendarDayList[m].isSubject = $scope.everydaySubjectList[k].is_project;
                    $scope.calendarDayList[m].isHoliday = $scope.everydaySubjectList[k].is_holiday;
                    $scope.calendarDayList[m].subjectID = $scope.everydaySubjectList[k].project_id;
                    $scope.calendarDayList[m].subjectName = $scope.everydaySubjectList[k].project_name;

                    for(var n=0; n<$scope.subject.length; n++){
                      if($scope.calendarDayList[m] && $scope.subject[0] && $scope.calendarDayList[m].subjectID == $scope.subject[0].project_id){
                        $scope.calendarDayList[m].isSubject1 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[1] && $scope.calendarDayList[m].subjectID == $scope.subject[1].project_id){
                        $scope.calendarDayList[m].isSubject2 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[2] && $scope.calendarDayList[m].subjectID == $scope.subject[2].project_id){
                        $scope.calendarDayList[m].isSubject3 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[3] && $scope.calendarDayList[m].subjectID == $scope.subject[3].project_id){
                        $scope.calendarDayList[m].isSubject4 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[4] && $scope.calendarDayList[m].subjectID == $scope.subject[4].project_id){
                        $scope.calendarDayList[m].isSubject5 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[5] && $scope.calendarDayList[m].subjectID == $scope.subject[5].project_id){
                        $scope.calendarDayList[m].isSubject6 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[6] && $scope.calendarDayList[m].subjectID == $scope.subject[6].project_id){
                        $scope.calendarDayList[m].isSubject7 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[7] && $scope.calendarDayList[m].subjectID == $scope.subject[7].project_id){
                        $scope.calendarDayList[m].isSubject8 = true;
                      }
                      if($scope.calendarDayList[m] && $scope.subject[8] && $scope.calendarDayList[m].subjectID == $scope.subject[8].project_id){
                        $scope.calendarDayList[m].isSubject9 = true;
                      }

                    }
                  }
                }
              }
            }
          }
        };
        subjectNode(recordDate);
        $scope.monthSlide = {yearSlide:  $scope.currentYear ,monthSlide: $scope.currentMonth ,monthEnglishSlide: $scope.currentEnglishMonth , calendarDayList: $scope.calendarDayList };
        return($scope.monthSlide);

      };





    }
  ]);



