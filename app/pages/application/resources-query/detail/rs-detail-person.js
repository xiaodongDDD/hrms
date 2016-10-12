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
    'workFLowListService',
    '$ionicScrollDelegate',
    'Subject',
    'MonthSubjectList',
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
              workFLowListService,
              $ionicScrollDelegate,
              Subject,
              MonthSubjectList,
              $stateParams,
              $ionicTabsDelegate,
              $ionicSlideBoxDelegate



    ) {

      $scope.employeeList = "";  //初始化人员列表
      $scope.empInfo = "";   //初始化此员工信息
      $scope.subject = "";   //初始化项目列表
      $scope.resourceDetails = "";   //初始化查询结果
      $scope.yearMonth = ""; //初始化日历年月
      $scope.newPage = 1;

      $scope.contactLoading = false; //默认不显示loading加载

      $scope.resultList = []; //初始化最终呈现的结果
      $scope.resultProList = [];


      var oSlide = document.getElementById('next-slide');
      var portraitBackground = oSlide.getElementsByClassName('person-head-image');

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

      //周列表
      $scope.weekTitleList = [
        '日', '一', '二', '三', '四', '五', '六'
      ];

      var postUrl = baseConfig.businessPath + "/api_resources_query/get_personal_resource"; //个人查询结果接口地址
      var postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber + '","p_dismission":"' + dimission +  '"}}';

      var empListUrl = baseConfig.businessPath + "/api_resources_query/get_employee_list"; //人员列表接口地址
      var searchInfo = '{"params":{"p_employee_number":"' + employeeCode + '","p_branch_id":"' + unitId +  '","p_project_id":"' + subjectId +  '"}}';

      var empPictureUrl = baseConfig.businessPath + "/api_employee/get_employee_code"; //人员头像接口地址
      var empCode = '{"params":{"p_employee_code":"' + employeeCode +  '"}}';

      $scope.slideIndex = 0;

      var getEmpList = function (postUrl,postData) { //获取人员列表

        hmsHttp.post(postUrl, postData).success(function (result) {

          // console.log(result.employee_list);
          $scope.employeeList = result.employee_list.sort(function (a, b) {
            return(a.employee_number - b.employee_number);
          });
          $ionicSlideBoxDelegate.$getByHandle('employee-handle').update();

          // console.log($scope.employeeList);

          for(var i=0; i<$scope.employeeList.length; i++){
            if(employeeCode == $scope.employeeList[i].employee_number){
              $scope.slideIndex = i;
            }
          }
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


        }).error(function () {
          console.log('人员列表接口异常');
        })
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
      $scope.slideChanged=function(index){//  上面人员滑动时候触发

        $scope.resultList = []; //初始化最终呈现的结果
        $scope.resultProList = [];
        $scope.slideIndex=index;
        $scope.monthIndex = 0;
        $scope.newPage = 1;
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
        postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber + '","p_dismission":"' + dimission +  '"}}';
        getData('init');

      };

      $scope.monthChanged = function (index) {  //下面日历滑动时触发
        $scope.monthIndex=index;
        console.log(index);
        $scope.loadMore(index);
        $scope.projectList = $scope.resultProList[index];

      };


      // var getEmpPicture = function (url,empCode,index) {   //获取员工头像
      //   hmsHttp.post(url, empCode).success(function (result) {
      //     // console.log(result);
      //     $scope.empInfo = result.result;
      //
      //     portraitBackground[index].style.backgroundImage="url('"+$scope.empInfo.avatar+"')";
      //
      //
      //   }).error(function () {
      //     console.log('员工头像接口异常')
      //   })
      // };
      // getEmpPicture(empPictureUrl,$scope.empCode,$scope.slideIndex);
      //

      $scope.loadMore = function (index) { //加载下一页

        if($scope.newPage == 1 && index == 1){
          $scope.newPage = 2;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 2 && index == 3){
          $scope.newPage = 3;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 3 && index == 5){
          $scope.newPage = 4;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 4 && index == 7){
          $scope.newPage = 5;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 5 && index == 9){
          $scope.newPage = 6;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 6 && index == 11){
          $scope.newPage = 7;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 7 && index == 13){
          $scope.newPage = 8;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 8 && index == 15){
          $scope.newPage = 9;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 9 && index == 17){
          $scope.newPage = 10;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 10 && index == 19){
          $scope.newPage = 11;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 11 && index == 21){
          $scope.newPage = 12;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
        if($scope.newPage == 12 && index == 23){
          $scope.newPage = 13;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + $scope.newPage + '","p_dismission":"' + dimission +  '"}}';
          getData('loadMore');
        }
      };


      function getData(moreFlag) {
        // $scope.contactLoading = true;
        if (moreFlag === 'init') {
          $scope.contactLoading = true;
          postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + 1 + '","p_dismission":"' + dimission +  '"}}';
        }
        hmsHttp.post(postUrl, postData).success(function (result) {

          // console.log(dateFrom);
          // console.log(dateTo);
          // console.log(employeeName);
          // console.log(branchName);
          // console.log(subjectName);
          // console.log(dimission);
          // console.log(result.returnMsg);
          // console.log(postData);
          // console.log(result);
          // $scope.monthSlideList = [];  //初始化拼接显示结果


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

      $timeout(function () {
        getEmpList(empListUrl,searchInfo);
        getData('init');
      },200);






      $scope.goBackPage = function () {
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



          // for(var m=0; m<12; m++){
          //   if($scope.monthSubjectList[m].month == $scope.currentMonth){
          //
          //     // alert($scope.monthSubjectList[m].month);
          //     $scope.everydaySubjectList = $scope.monthSubjectList[m].everydaySubjectList;
          //     console.log($scope.everydaySubjectList);
          //     $scope.calendar = [];
          //     var seq = 0;
          //     for (i = 0; i < calendarLine; i++) {
          //       var style_blank = 'each-day-blank';
          //       var style_color = 'day-item';
          //       var style_approve = 'each-day-approve';
          //       var style_reject = 'each-day-reject';
          //       var style_attendance = 'each-day-attendance';
          //
          //       var project = '';
          //       var week = {
          //         week: i,
          //         list: []
          //       };
          //       for (var j = 0; j < 7; j++) {
          //
          //         var item;
          //
          //         if (initCalendarArray[seq]) {
          //
          //           for(var k=0; k<31;k++){
          //             if($scope.everydaySubjectList[k].day == initCalendarArray[seq]){
          //               if($scope.everydaySubjectList[k].isSubject){
          //                 for(var l=0; l<$scope.subject.length; l++){
          //                   if($scope.everydaySubjectList[k].subjectID == $scope.subject[l].id){
          //                     item = {
          //                       day: initCalendarArray[seq],
          //                       style_outline: $scope.subject[l].style,
          //                       style_color: style_color,
          //                       project: project
          //                     };
          //                   }
          //                 }
          //               }
          //               if($scope.everydaySubjectList[k].isHoliday){
          //                 item = {
          //                   day: initCalendarArray[seq],
          //                   style_outline: style_attendance,
          //                   style_color: style_color,
          //                   project: project
          //                 };
          //               }
          //             }
          //             else {
          //               item = {
          //                 day: '',
          //                 style_outline: style_blank,
          //                 style_color: style_color,
          //                 project: project
          //               };
          //             }
          //           }
          //         }
          //         week.list.push(item);
          //         seq = seq + 1;
          //       }
          //       $scope.calendar.push(week);
          //     }
          //   }
          // }


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



      // var search = function () {
      //
      // };









      // $scope.list = [];
      // var cashList = [];
      // $scope.fetchDataFlag = true;
      // $scope.pullRefreshDataFlag = false;
      // $scope.showDetailArrow = true;
      // $scope.listStatus = {
      //   todo: {
      //     selected: true
      //   },
      //   done: {
      //     selected: false
      //   }
      // };
      //
      // var pageNumLimit = 10;
      //
      // $scope.loadMoreDataFlag = false;
      //
      // var pageNum = 1;
      //
      // var filterOption = {
      //   "currentSelectType": "ALL",
      //   "currentSubmitterFilter": "",
      //   "currentWorkflowFilter": "",
      //   "submitterFilter": [],
      //   "workflowNameFilter": []
      // };
      //
      // var workflowDefaultIcon = 'build/img/application/profile@3x.png';
      // var workflowType = '申请名称';
      // var workflowNode = '当前节点';
      // var workflowPerson = '提交人';
      //
      // var refreshTodoList = function () {
      //   $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
      //   $scope.fetchDataFlag = true;
      //   $scope.pullRefreshDataFlag = false;
      //   $scope.listStatus.todo.selected = true;
      //   $scope.listStatus.done.selected = false;
      //   $timeout(function () {
      //     getTodoList(false);
      //   }, 500);
      // };
      //
      // var showList = function () {
      //   $timeout(
      //     function () {
      //       $scope.fetchDataFlag = false;
      //     }, 100
      //   );
      // };
      //
      // var processTodoList = function (result) {
      //   if (result.status == 'S') {
      //     var list = result.unprocessedWorkflowList;
      //     angular.forEach(list, function (data) {
      //       var employeeImg = data.employee_img;
      //       if (!employeeImg || employeeImg == "") {
      //         employeeImg = workflowDefaultIcon;
      //       }
      //       var item = {
      //         title1: data.workflow_name,
      //         icon: employeeImg,
      //         type: workflowType,
      //         typeValue: data.instance_desc,
      //         node: workflowNode,
      //         nodeValue: data.current_node,
      //         submit: workflowPerson,
      //         submitPerson: data.employee_name,
      //         workflowId: data.workflow_id,
      //         instanceId: data.instance_id,
      //         recordId: data.record_id,
      //         nodeId: data.node_id,
      //         canApprove: data.approve,
      //         canBackTo: data.backTo,
      //         canGoBack: data.goBack,
      //         canRefuse: data.refuse,
      //         canTransmit: data.toOther,
      //         employeeCode: data.employee_code
      //       };
      //       $scope.list.push(item);
      //     });
      //   }
      //   else {
      //     hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
      //   }
      // };
      //
      // var processDoneList = function (result) {
      //   if (result.status == 'S') {
      //     var list = result.processedWorkflowList;
      //     angular.forEach(list, function (data) {
      //       var employeeImg = data.employee_img;
      //       if (!employeeImg || employeeImg == "") {
      //         employeeImg = workflowDefaultIcon;
      //       }
      //       var item = {
      //         title1: data.workflow_name,
      //         icon: employeeImg,
      //         type: workflowType,
      //         typeValue: data.instance_desc,
      //         node: workflowNode,
      //         nodeValue: data.status_name,
      //         submit: workflowPerson,
      //         submitPerson: data.created_by_name,
      //         workflowId: data.workflow_id,
      //         instanceId: data.instance_id,
      //         employeeCode: data.employee_code
      //       };
      //       $scope.list.push(item);
      //     });
      //   } else {
      //     hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
      //   }
      // };
      //
      // var getTodoList = function (pullRefresh) {
      //   $scope.loadMoreDataFlag = false;
      //   pageNum = 1;
      //   $scope.list = [];
      //   if (pullRefresh) {
      //     $scope.fetchDataFlag = false;
      //     $scope.pullRefreshDataFlag = true;
      //   } else {
      //     $scope.fetchDataFlag = true;
      //   }
      //   var success = function (result) {
      //     processTodoList(result);
      //     if (pullRefresh) {
      //       $scope.pullRefreshDataFlag = false;
      //       $scope.$broadcast('scroll.refreshComplete');
      //     }
      //     if (!result.unprocessedWorkflowList || result.unprocessedWorkflowList.length == pageNumLimit) {
      //       $scope.loadMoreDataFlag = true;
      //     }
      //     showList();
      //   };
      //   var error = function (result) {
      //     if (pullRefresh) {
      //       $scope.pullRefreshDataFlag = false;
      //       $scope.$broadcast('scroll.refreshComplete');
      //     }
      //     showList();
      //   };
      //   $timeout(function () {
      //     var filterCondition = dataFilterUtil().fetchFilterCondition();
      //     workFLowListService.getTodoList('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      //   }, 0);
      // };
      //
      // var getDoneList = function (pullRefresh) {
      //   $scope.loadMoreDataFlag = false;
      //   pageNum = 1;
      //   $scope.list = [];
      //   cashList = [];
      //   if (pullRefresh) {
      //     $scope.fetchDataFlag = false;
      //     $scope.pullRefreshDataFlag = true;
      //   } else {
      //     $scope.fetchDataFlag = true;
      //   }
      //   var success = function (result) {
      //     processDoneList(result);
      //     if (pullRefresh) {
      //       $scope.pullRefreshDataFlag = false;
      //       $scope.$broadcast('scroll.refreshComplete');
      //     }
      //     if (!result.processedWorkflowList || result.processedWorkflowList.length == pageNumLimit) {
      //       $scope.loadMoreDataFlag = true;
      //     }
      //     showList();
      //   };
      //   var error = function (result) {
      //     if (pullRefresh) {
      //       $scope.pullRefreshDataFlag = false;
      //       $scope.$broadcast('scroll.refreshComplete');
      //     }
      //     showList();
      //   }
      //   $timeout(function () {
      //     var filterCondition = dataFilterUtil().fetchFilterCondition();
      //     workFLowListService.getTodoList('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      //   }, 0);
      // };
      //
      // $scope.fetchTodoList = function (refreshFlag) {
      //   if (baseConfig.debug) {
      //     console.log('$scope.fetchTodoList ');
      //   }
      //   if (!refreshFlag) {
      //     dataFilterUtil().clearFilterCondition();
      //   }
      //   $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
      //   $timeout(function () {
      //
      //     if ($scope.listStatus.todo.selected && !refreshFlag) {
      //     } else {
      //       if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
      //         $scope.listStatus.todo.selected = true;
      //         $scope.listStatus.done.selected = false;
      //         getTodoList(false);
      //         if (!refreshFlag) {
      //           dataFilterUtil().query();
      //         }
      //       }
      //     }
      //   }, 100);
      // };
      //
      // $scope.fetchDoneList = function (refreshFlag) {
      //   if (!refreshFlag) {
      //     dataFilterUtil().clearFilterCondition();
      //   }
      //   $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
      //   $timeout(function () {
      //     if ($scope.listStatus.done.selected && !refreshFlag) {
      //     } else {
      //       if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
      //         $scope.listStatus.done.selected = true;
      //         $scope.listStatus.todo.selected = false;
      //         getDoneList(false);
      //         if (!refreshFlag) {
      //           dataFilterUtil().query();
      //         }
      //       }
      //     }
      //   }, 100);
      // };
      //
      // var loadMoreFetchTodoList = function () {
      //   var success = function (result) {
      //     processTodoList(result);
      //     if (result.unprocessedWorkflowList.length < pageNumLimit) {
      //       $scope.loadMoreDataFlag = false;
      //     }
      //     $scope.$broadcast('scroll.infiniteScrollComplete');
      //   };
      //   var error = function (result) {
      //     $scope.$broadcast('scroll.infiniteScrollComplete');
      //   };
      //   var filterCondition = dataFilterUtil().fetchFilterCondition();
      //   workFLowListService.getTodoList('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      // };
      //
      // var loadMoreFetchDoneList = function () {
      //   var success = function (result) {
      //     processDoneList(result);
      //     if (result.processedWorkflowList.length < pageNumLimit) {
      //       $scope.loadMoreDataFlag = false;
      //     }
      //     $scope.$broadcast('scroll.infiniteScrollComplete');
      //
      //   };
      //   var error = function (result) {
      //     $scope.$broadcast('scroll.infiniteScrollComplete');
      //   };
      //   var filterCondition = dataFilterUtil().fetchFilterCondition();
      //   workFLowListService.getTodoList('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      // };
      //
      // $scope.loadMoreData = function () {
      //   pageNum = pageNum + 1;
      //   if ($scope.listStatus.done.selected) {
      //     loadMoreFetchDoneList();
      //   } else {
      //     loadMoreFetchTodoList();
      //   }
      // };
      //
      // $scope.enterWorkflowDetail = function (detail) {
      //   var processedFlag = {value: false};
      //   if ($scope.listStatus.done.selected) {
      //     processedFlag.value = true;
      //   }
      //   $state.go('tab.workflow-detail', {
      //     "detail": detail,
      //     "processedFlag": processedFlag,
      //     "type": "WORKFLOWDETAIL"
      //   })
      // }
      //
      // $ionicModal.fromTemplateUrl('build/pages/public/modal/hms-filter-modal.html', { //筛选modal
      //   scope: $scope
      // }).then(function (modal) {
      //   $scope.workflowFilterModal = modal;
      // });
      //
      // $scope.filterWorkFlowInfo = function () { //响应筛选按钮的方法
      //   $scope.workflowFilterModal.show();
      // };
      //
      // $scope.refresh = function () {
      //   if (!$scope.fetchDataFlag) {
      //     dataFilterUtil().clearFilterCondition();
      //     $scope.list = [];
      //     $scope.$apply();
      //     $timeout(function () {
      //       if ($scope.listStatus.todo.selected) {
      //         getTodoList(true);
      //       } else {
      //         getDoneList(true);
      //       }
      //     }, 0);
      //   } else {
      //     $scope.$broadcast('scroll.refreshComplete');
      //   }
      // };
      //
      // var submitAction = function (actionType, item) {
      //   var params = {
      //     "params": {
      //       p_action_type: actionType + "",
      //       p_attr1: "",
      //       p_attr2: "",
      //       p_attr3: "",
      //       p_attr4: "",
      //       p_attr5: "",
      //       p_comment: "",
      //       p_desc: "",
      //       p_employee_code: window.localStorage.empno,
      //       p_record_id: item.recordId + ""
      //     }
      //   };
      //   var success = function (result) {
      //     if (result.status == 'S') {
      //       var index = $scope.list.indexOf(item);
      //       console.log('submitAction.success.index ' + index)
      //       $scope.list.splice(index, 1);
      //       hmsPopup.showPopup('处理工作流成功!');
      //     }
      //     else {
      //       hmsPopup.showPopup('处理工作流失败,请进入详细界面填写完整信息!');
      //     }
      //   };
      //   var error = function (response) {
      //   };
      //
      //   var submit = function (buttonIndex) {
      //     if (baseConfig.debug) {
      //       console.log('You selected button ' + buttonIndex);
      //     }
      //     if (buttonIndex == 1) {
      //       hmsPopup.showLoading('处理工作流中');
      //       workFLowListService.submitAction(success, error, params);
      //     } else {
      //     }
      //   }
      //   hmsPopup.confirm("是否确认提交工作流?", "", submit);
      // }
      //
      // $scope.workflowActionHandle = {
      //   approveWorkflow: function (item) {
      //     submitAction('0', item);
      //   },
      //   rejectWorkflow: function (item) {
      //     submitAction('-1', item);
      //   }
      // };
      //
      // $scope.dataFilterHandle = {
      //   cancelDataFilter: function () {
      //     $scope.workflowFilterModal.hide();
      //   },
      //   clearDataFilterParams: function () {
      //     $scope.workflowFilterModal.hide();
      //   },
      //   confirmDataFilter: function () {
      //     if (baseConfig.debug) {
      //       console.log('dataFilterUtil.filterOption ' + angular.toJson(filterOption));
      //     }
      //     $scope.workflowFilterModal.hide();
      //
      //     if (baseConfig.debug) {
      //       console.log('$scope.listStatus.todo.selected ' + $scope.listStatus.todo.selected)
      //     }
      //
      //     if ($scope.listStatus.todo.selected) {
      //       $scope.fetchTodoList(true);
      //     } else {
      //       $scope.fetchDoneList(true);
      //     }
      //
      //   },
      //   selectFilterType: function (type) {
      //     if (baseConfig.debug) {
      //       console.log('type ' + angular.toJson(type));
      //       console.log('dataFilterUtil().filterOption.workflowNameFilter ' +
      //         angular.toJson(filterOption.workflowNameFilter));
      //       //console.log('dataFilterUtil().filterOption.submitterFilter ' +
      //       //angular.toJson(filterOption.submitterFilter));
      //     }
      //     angular.forEach($scope.selectFilterTypeList, function (data) {
      //       data.selected = false;
      //     });
      //     type.selected = true;
      //     $scope.filterItemList = [];
      //
      //     $ionicScrollDelegate.$getByHandle('hmsFilterCondition').scrollTop();
      //
      //     if (type.code == 'ALL') {
      //       filterOption.currentSelectType = 'ALL';
      //       $scope.filterItemList = filterOption.noConditionFilter;
      //
      //     } else if (type.code == 'PERSON') {
      //       filterOption.currentSelectType = 'PERSON';
      //       $scope.filterItemList = filterOption.submitterFilter;
      //     } else if (type.code == 'WORKFLOWNODE') {
      //       filterOption.currentSelectType = 'WORKFLOWNODE';
      //       $scope.filterItemList = filterOption.workflowNameFilter;
      //     }
      //   },
      //   selectFilterItem: function (filterItem) {
      //     if (baseConfig.debug) {
      //       console.log('filterItem ' + angular.toJson(filterItem));
      //     }
      //     angular.forEach($scope.filterItemList, function (data) {
      //       data.selected = false;
      //     });
      //     filterItem.selected = true;
      //     if (filterOption.currentSelectType == 'PERSON') {
      //       filterOption.currentSubmitterFilter = filterItem.itemCode;
      //     }
      //     if (filterOption.currentSelectType == 'WORKFLOWNODE') {
      //       filterOption.currentWorkflowFilter = filterItem.itemCode;
      //     }
      //     if (baseConfig.debug) {
      //       console.log('filterOption.currentSubmitterFilter ' + filterOption.currentSubmitterFilter);
      //       console.log('filterOption.currentWorkflowFilter ' + filterOption.currentWorkflowFilter);
      //     }
      //   }
      // };
      //
      // var dataFilterUtil = function () {
      //   var self = {};
      //
      //   self.clearFilterCondition = function () {
      //     filterOption.currentSelectType = 'ALL'
      //     filterOption.currentWorkflowFilter = '';
      //     filterOption.currentSubmitterFilter = '';
      //   };
      //
      //   self.fetchFilterCondition = function () {
      //     var condition = {
      //       "workflowId": "",
      //       "submitterId": ""
      //     };
      //     if (filterOption.currentSelectType == 'ALL') {
      //       return condition;
      //     } else {
      //       condition.workflowId = filterOption.currentWorkflowFilter;
      //       condition.submitterId = filterOption.currentSubmitterFilter;
      //       return condition;
      //     }
      //   };
      //
      //   self.query = function () {
      //     var success = function (result) {
      //       if (result.returnStatus == 'S') {
      //         if (baseConfig.debug) {
      //           console.log('result ' + angular.toJson(result));
      //         }
      //         $scope.selectFilterTypeList = [
      //           {
      //             "code": "ALL",
      //             "name": "部门成员",
      //             "selected": true
      //           },
      //           {
      //             "code": "PERSON",
      //             "name": "部门名称",
      //             "selected": false
      //           },
      //           {
      //             "code": "WORKFLOWNODE",
      //             "name": "项目名称",
      //             "selected": false
      //           }
      //         ];
      //         if (baseConfig.debug) {
      //           console.log('dataFilterUtil.cashList ' + angular.toJson(cashList));
      //         }
      //         filterOption.submitterFilter = [];
      //         filterOption.workflowNameFilter = [];
      //         filterOption.noConditionFilter = [];
      //         $scope.filterItemList = [];
      //         filterOption.currentSubmitterFilter = '';
      //         filterOption.currentWorkflowFilter = '';
      //         var noCondition = {
      //           "itemCode": '',
      //           "itemDesc": '全部',
      //           "selected": true
      //         };
      //         filterOption.noConditionFilter.push(noCondition);
      //         var workflowF = {
      //           "itemCode": '',
      //           "itemDesc": '全部',
      //           "selected": true
      //         };
      //         filterOption.workflowNameFilter.push(workflowF);
      //         angular.forEach(result.returnData.workflowList, function (data) {
      //           var workflowNode = {
      //             "itemCode": data.workflowId,
      //             "itemDesc": data.workflowName,
      //             "selected": false
      //           };
      //           filterOption.workflowNameFilter.push(workflowNode);
      //         });
      //         var submitterF = {
      //           "itemCode": '',
      //           "itemDesc": '全部',
      //           "selected": true
      //         };
      //         filterOption.submitterFilter.push(submitterF);
      //         angular.forEach(result.returnData.personList, function (data) {
      //           var person = {
      //             "itemCode": data.submitterId,
      //             "itemDesc": data.submitterName,
      //             "selected": false
      //           };
      //           filterOption.submitterFilter.push(person);
      //         });
      //         $scope.filterItemList = filterOption.noConditionFilter;
      //
      //         if (baseConfig.debug) {
      //           console.log('self.filterOption.workflowNameFilter ' + angular.toJson(filterOption.workflowNameFilter));
      //           console.log('self.filterOption.submitterFilter ' + angular.toJson(filterOption.submitterFilter));
      //         }
      //
      //         //$scope.$apply();
      //       }
      //     };
      //     var error = function (response) {
      //     };
      //     var processedFlag = 'N';
      //     if ($scope.listStatus.done.selected) {
      //       processedFlag = 'Y';
      //     }
      //     workFLowListService.get_workflow_filter(success, error, processedFlag);
      //
      //   };
      //   return self;
      // };
      //
      // $timeout(function () {
      //   getTodoList(false);
      //   dataFilterUtil().query();
      // }, 400);
      //
      // $scope.$on('$ionicView.enter', function (e) {
      //   if (baseConfig.debug) {
      //     console.log('WorkFLowListCtrl.$ionicView.enter');
      //   }
      // });
      //
      // $scope.$on('$ionicView.beforeEnter', function () {
      //   if (baseConfig.debug) {
      //     console.log('WorkFLowListCtrl.$ionicView.beforeEnter');
      //   }
      //   if (workFLowListService.getRefreshWorkflowList().flag == true) {
      //     workFLowListService.setRefreshWorkflowList(false);
      //     if (baseConfig.debug) {
      //       console.log('refresh workflow list');
      //     }
      //     refreshTodoList();
      //   }
      // });
      //
      // $scope.$on('$ionicView.beforeLeave', function () {
      //   if (baseConfig.debug) {
      //     console.log('WorkFLowListCtrl.$ionicView.beforeLeave');
      //   }
      // });
      //
      // $scope.$on('$destroy', function (e) {
      //   if (baseConfig.debug) {
      //     console.log('WorkFLowListCtrl.$destroy');
      //   }
      // });

    }])


  .factory('Subject', function(){
    var subject =  [


      {
        id: 1221,
        name: '移动内部项目',
        color: 'green'

      },
      {
        id: 1222,
        name: '如新ageLOCme app开发',
        color: 'blue'

      },
      {
        name: '周末及法定节假日',
        color: 'yellow'
      },
      {
        name: '无项目',
        color: 'gray'
      }


    ];

    return {
      all: function () {
        return subject;
      }
    }

  })
  .factory('MonthSubjectList', function () {
    var monthSubjectList = [
      {
        year: 2016,
        month: 9,
        everydaySubjectList: [
          {
            day: 1,
            isSubject: true,
            isHoliday: false,
            subjectID: 1221,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 2,
            isSubject: true,
            isHoliday: false,
            subjectID: 1221,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 3,
            isSubject: false,
            isHoliday: true,
            subjectID: 1222,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 4,
            isSubject: false,
            isHoliday: true,
            subjectID: 1223,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 5,
            isSubject: true,
            isHoliday: false,
            subjectID: 1222,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 6,
            isSubject: true,
            isHoliday: false,
            subjectID: 1222,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 7,
            isSubject: true,
            isHoliday: false,
            subjectID: 1221,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 8,
            isSubject: true,
            isHoliday: false,
            subjectID: 1221,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 9,
            isSubject: true,
            isHoliday: false,
            subjectID: 1222,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 10,
            isSubject: false,
            isHoliday: true,
            subjectID: 1221,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 11,
            isSubject: false,
            isHoliday: true,
            subjectID: 1222,
            subjectName: '如新ageLOCme APP开发'
          },
          {
            day: 12,
            isSubject: true,
            isHoliday: false,
            subjectID: 1221,
            subjectName: '如新ageLOCme APP开发'
          }
        ]
      }
    ];

    return {
      all: function () {
        return monthSubjectList;
      }
    }
  });
