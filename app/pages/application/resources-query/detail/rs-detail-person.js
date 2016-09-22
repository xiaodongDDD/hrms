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
              $stateParams


    ) {

      $scope.employeeList = "";  //初始化人员列表
      $scope.empInfo = "";   //初始化此员工信息
      $scope.subject = "";   //初始化项目列表

      var oSlide = document.getElementById('next-slide');
      var portraitBackground = oSlide.getElementsByClassName('person-head-image');


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


      var postUrl = baseConfig.businessPath + "/api_resources_query/get_personal_resource"; //个人查询结果接口地址
      var postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber + '","p_dismission":"' + dimission +  '"}}';

      var empListUrl = baseConfig.businessPath + "/api_resources_query/get_employee_list"; //人员列表接口地址
      var searchInfo = '{"params":{"p_employee_number":"' + employeeCode + '","p_branch_id":"' + unitId +  '","p_project_id":"' + subjectId +  '"}}';

      var empPictureUrl = baseConfig.businessPath + "/api_employee/get_employee_code"; //人员列表接口地址
      var empCode = '{"params":{"p_employee_code":"' + employeeCode +  '"}}';



      var getEmpList = function () { //获取人员列表
        hmsHttp.post(empListUrl, searchInfo).success(function (result) {

          $scope.employeeList = result.employee_list;
          console.log($scope.employeeList);
        }).error(function () {
          console.log('人员列表接口异常');
        })
      };
      getEmpList();

      $scope.index = 0;

      //有问题
      for(var i=0; i++; i<$scope.employeeList.length){
        if(employeeCode == $scope.employeeList[i].employee_number){
          $scope.index = i;
          // console.log(i);
          // console.log(employeeCode);
          // console.log($scope.employeeList[i].employee_number);
        }
      }
      // console.log($scope.index);

      var getEmpPicture = function (url,empCode) {   //获取员工头像
        hmsHttp.post(url, empCode).success(function (result) {
          // console.log(result);
          $scope.empInfo = result.result;

          portraitBackground[0].style.backgroundImage="url('"+$scope.empInfo.avatar+"')";
          portraitBackground[1].style.backgroundImage="url('"+$scope.empInfo.avatar+"')";
          portraitBackground[2].style.backgroundImage="url('"+$scope.empInfo.avatar+"')";

        }).error(function () {
          console.log('员工头像接口异常')
        })
      };
      getEmpPicture(empPictureUrl,empCode);

      var getData = function () {
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


          if(result.project_list[0]){
            result.project_list[0].color = "blue";
          }
          if(result.project_list[1]){
            result.project_list[1].color = "yellow";
          }
          if(result.project_list[2]){
            result.project_list[2].color = "red";
          }
          if(result.project_list[3]){
            result.project_list[3].color = "yellow";
          }

          $scope.subject = result.project_list;
          $scope.resourceDetails = result.resource_details;

        }).error(function () {
          console.log('个人查询结果异常');
        })
      };
      getData();




      // var oSlide = $('#next-slide').offset();
      // $scope.current1 = 0;
      $scope.goNextPerson = function () {
        // $scope.current1 = $scope.current1 - 100;

        $('#next-slide').animate({
          left:'-=100vw'
        },400).animate({
          left:'-100vw'
        },0);

        $scope.index++;
        if($scope.index >= $scope.employeeList.length){
          $scope.index = 0;
        }

        // for(var i=0; i++; i<$scope.employeeList.length) {
          employeeCode = $scope.employeeList[$scope.index].employee_number;

        // console.log($scope.index);
        // console.log(employeeCode);
        empCode = '{"params":{"p_employee_code":"' + employeeCode +  '"}}';
        $timeout(function () {
          getEmpPicture(empPictureUrl,empCode);
        },200);

        // // oSlide = $('#next-slide').offset();
        // if(oSlide1.offsetLeft < -810){
        //   console.log(oSlide1.offsetLeft);
        //   oSlide1.style.left = "-100px";
        //   console.log(oSlide1.offsetLeft+'ghddg');
        // }


        // oSlide.animate({left: "$scope.current1+'vw'"},"slow");

        // oSlide.style = "transition: all 1s";
        // oSlide.style.transform = 'translateX('+$scope.current1+'vw)';
        // console.log(oSlide.offsetWidth);
        // console.log(oSlide.left);
        // console.log(screen.width);

        // oPerson.style.webkitTransform = 'rotateY('+current1+'deg)';
      };
      $scope.goLastPerson = function () {
        // $scope.current1 = $scope.current1 +100;
        $('#next-slide').animate({
          left:'+=100vw'
        },400).animate({
          left:'-100vw'
        },0);

        $scope.index--;
        if($scope.index < 0){
          $scope.index = $scope.employeeList.length - 1;
        }

          employeeCode = $scope.employeeList[$scope.index].employee_number;

        // console.log($scope.index);
        // console.log(employeeCode);
        empCode = '{"params":{"p_employee_code":"' + employeeCode +  '"}}';
        $timeout(function () {
          getEmpPicture(empPictureUrl,empCode);
        },200);
        // oSlide = $('#next-slide').offset();
        //
        // if(oSlide.left > -screen.width){
        //   console.log(oSlide.left);
        //   $('#next-slide').css({"left":"-100vw"});
        // }


        // oSlide.animate({left: "$scope.current1+'vw'"},"slow");
        // oSlide.style = "transition: all 1s";
        // oSlide.style.transform = 'translateX('+$scope.current1+'vw)';
        // console.log(oSlide.offsetWidth);
        // console.log(oSlide.left);
        // oPerson.style.webkitTransform = 'rotateY('+current1+'deg)';
      };






      $scope.goBackPage = function () {
        $ionicHistory.goBack();
      };


      //月份英文简写
      var EnglishMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      var date = new Date();

      var year = date.getFullYear();
      var month = date.getMonth();
      $scope.currentYear = year;
      $scope.currentMonth = month + 1;
      $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];


      $scope.lastMonth = function () {
        $scope.currentMonth--;
        if ($scope.currentMonth == 0) {
          $scope.currentMonth = 12;
          $scope.currentYear--;
        }
        $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];
        initCalendar($scope.currentYear, $scope.currentMonth);
        subjectNode();
      };
      $scope.nextMonth = function () {
        $scope.currentMonth++;
        if ($scope.currentMonth == 13) {
          $scope.currentMonth = 1;
          $scope.currentYear++;
        }
        $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];
        initCalendar($scope.currentYear, $scope.currentMonth);
        subjectNode();
      };

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

      var subjectNode = function(){

        for(var x=0; x<$scope.subject.length; x++){

        }
        $scope.monthSubjectList = MonthSubjectList.all();

        $scope.everydaySubjectList = [];

        for(var i=0; i<$scope.monthSubjectList.length; i++){
          if($scope.monthSubjectList[i].year == $scope.currentYear && $scope.monthSubjectList[i].month == $scope.currentMonth){

            $scope.everydaySubjectList = $scope.monthSubjectList[i].everydaySubjectList;

            for(var k=0; k<$scope.everydaySubjectList.length; k++){

              for(var m=0; m<$scope.calendarDayList.length; m++){
                // console.log($scope.calendar[m]);
                if($scope.everydaySubjectList[k].day == $scope.calendarDayList[m].day){
                  $scope.calendarDayList[m].isSubject = $scope.everydaySubjectList[k].isSubject;
                  $scope.calendarDayList[m].isHoliday = $scope.everydaySubjectList[k].isHoliday;
                  $scope.calendarDayList[m].subjectID = $scope.everydaySubjectList[k].subjectID;
                  $scope.calendarDayList[m].subjectName = $scope.everydaySubjectList[k].subjectName;

                  for(var n=0; n<$scope.subject.length; n++){
                    if($scope.calendarDayList[m].subjectID == $scope.subject[0].id){
                      $scope.calendarDayList[m].isSubject1 = true;
                    }
                    if($scope.calendarDayList[m].subjectID == $scope.subject[1].id){
                      $scope.calendarDayList[m].isSubject2 = true;
                    }
                    if($scope.calendarDayList[m].subjectID == $scope.subject[2].id){
                      $scope.calendarDayList[m].isSubject3 = true;
                    }
                    if($scope.calendarDayList[m].subjectID == $scope.subject[3].id){
                      $scope.calendarDayList[m].isSubject4 = true;
                    }

                  }
                }
              }
            }
          }
        }
      };
      subjectNode();




      // var search = function () {
      //
      // };









      $scope.list = [];
      var cashList = [];
      $scope.fetchDataFlag = true;
      $scope.pullRefreshDataFlag = false;
      $scope.showDetailArrow = true;
      $scope.listStatus = {
        todo: {
          selected: true
        },
        done: {
          selected: false
        }
      };

      var pageNumLimit = 10;

      $scope.loadMoreDataFlag = false;

      var pageNum = 1;

      var filterOption = {
        "currentSelectType": "ALL",
        "currentSubmitterFilter": "",
        "currentWorkflowFilter": "",
        "submitterFilter": [],
        "workflowNameFilter": []
      };

      var workflowDefaultIcon = 'build/img/application/profile@3x.png';
      var workflowType = '申请名称';
      var workflowNode = '当前节点';
      var workflowPerson = '提交人';

      var refreshTodoList = function () {
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $scope.fetchDataFlag = true;
        $scope.pullRefreshDataFlag = false;
        $scope.listStatus.todo.selected = true;
        $scope.listStatus.done.selected = false;
        $timeout(function () {
          getTodoList(false);
        }, 500);
      };

      var showList = function () {
        $timeout(
          function () {
            $scope.fetchDataFlag = false;
          }, 100
        );
      };

      var processTodoList = function (result) {
        if (result.status == 'S') {
          var list = result.unprocessedWorkflowList;
          angular.forEach(list, function (data) {
            var employeeImg = data.employee_img;
            if (!employeeImg || employeeImg == "") {
              employeeImg = workflowDefaultIcon;
            }
            var item = {
              title1: data.workflow_name,
              icon: employeeImg,
              type: workflowType,
              typeValue: data.instance_desc,
              node: workflowNode,
              nodeValue: data.current_node,
              submit: workflowPerson,
              submitPerson: data.employee_name,
              workflowId: data.workflow_id,
              instanceId: data.instance_id,
              recordId: data.record_id,
              nodeId: data.node_id,
              canApprove: data.approve,
              canBackTo: data.backTo,
              canGoBack: data.goBack,
              canRefuse: data.refuse,
              canTransmit: data.toOther,
              employeeCode: data.employee_code
            };
            $scope.list.push(item);
          });
        }
        else {
          hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
        }
      };

      var processDoneList = function (result) {
        if (result.status == 'S') {
          var list = result.processedWorkflowList;
          angular.forEach(list, function (data) {
            var employeeImg = data.employee_img;
            if (!employeeImg || employeeImg == "") {
              employeeImg = workflowDefaultIcon;
            }
            var item = {
              title1: data.workflow_name,
              icon: employeeImg,
              type: workflowType,
              typeValue: data.instance_desc,
              node: workflowNode,
              nodeValue: data.status_name,
              submit: workflowPerson,
              submitPerson: data.created_by_name,
              workflowId: data.workflow_id,
              instanceId: data.instance_id,
              employeeCode: data.employee_code
            };
            $scope.list.push(item);
          });
        } else {
          hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
        }
      };

      var getTodoList = function (pullRefresh) {
        $scope.loadMoreDataFlag = false;
        pageNum = 1;
        $scope.list = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          processTodoList(result);
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          if (!result.unprocessedWorkflowList || result.unprocessedWorkflowList.length == pageNumLimit) {
            $scope.loadMoreDataFlag = true;
          }
          showList();
        };
        var error = function (result) {
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          showList();
        };
        $timeout(function () {
          var filterCondition = dataFilterUtil().fetchFilterCondition();
          workFLowListService.getTodoList('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
        }, 0);
      };

      var getDoneList = function (pullRefresh) {
        $scope.loadMoreDataFlag = false;
        pageNum = 1;
        $scope.list = [];
        cashList = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          processDoneList(result);
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          if (!result.processedWorkflowList || result.processedWorkflowList.length == pageNumLimit) {
            $scope.loadMoreDataFlag = true;
          }
          showList();
        };
        var error = function (result) {
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          showList();
        }
        $timeout(function () {
          var filterCondition = dataFilterUtil().fetchFilterCondition();
          workFLowListService.getTodoList('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
        }, 0);
      };

      $scope.fetchTodoList = function (refreshFlag) {
        if (baseConfig.debug) {
          console.log('$scope.fetchTodoList ');
        }
        if (!refreshFlag) {
          dataFilterUtil().clearFilterCondition();
        }
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $timeout(function () {

          if ($scope.listStatus.todo.selected && !refreshFlag) {
          } else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.todo.selected = true;
              $scope.listStatus.done.selected = false;
              getTodoList(false);
              if (!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      $scope.fetchDoneList = function (refreshFlag) {
        if (!refreshFlag) {
          dataFilterUtil().clearFilterCondition();
        }
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $timeout(function () {
          if ($scope.listStatus.done.selected && !refreshFlag) {
          } else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.done.selected = true;
              $scope.listStatus.todo.selected = false;
              getDoneList(false);
              if (!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      var loadMoreFetchTodoList = function () {
        var success = function (result) {
          processTodoList(result);
          if (result.unprocessedWorkflowList.length < pageNumLimit) {
            $scope.loadMoreDataFlag = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        var error = function (result) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        var filterCondition = dataFilterUtil().fetchFilterCondition();
        workFLowListService.getTodoList('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      };

      var loadMoreFetchDoneList = function () {
        var success = function (result) {
          processDoneList(result);
          if (result.processedWorkflowList.length < pageNumLimit) {
            $scope.loadMoreDataFlag = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

        };
        var error = function (result) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        var filterCondition = dataFilterUtil().fetchFilterCondition();
        workFLowListService.getTodoList('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      };

      $scope.loadMoreData = function () {
        pageNum = pageNum + 1;
        if ($scope.listStatus.done.selected) {
          loadMoreFetchDoneList();
        } else {
          loadMoreFetchTodoList();
        }
      };

      $scope.enterWorkflowDetail = function (detail) {
        var processedFlag = {value: false};
        if ($scope.listStatus.done.selected) {
          processedFlag.value = true;
        }
        $state.go('tab.workflow-detail', {
          "detail": detail,
          "processedFlag": processedFlag,
          "type": "WORKFLOWDETAIL"
        })
      }

      $ionicModal.fromTemplateUrl('build/pages/public/modal/hms-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.workflowFilterModal = modal;
      });

      $scope.filterWorkFlowInfo = function () { //响应筛选按钮的方法
        $scope.workflowFilterModal.show();
      };

      $scope.refresh = function () {
        if (!$scope.fetchDataFlag) {
          dataFilterUtil().clearFilterCondition();
          $scope.list = [];
          $scope.$apply();
          $timeout(function () {
            if ($scope.listStatus.todo.selected) {
              getTodoList(true);
            } else {
              getDoneList(true);
            }
          }, 0);
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      };

      var submitAction = function (actionType, item) {
        var params = {
          "params": {
            p_action_type: actionType + "",
            p_attr1: "",
            p_attr2: "",
            p_attr3: "",
            p_attr4: "",
            p_attr5: "",
            p_comment: "",
            p_desc: "",
            p_employee_code: window.localStorage.empno,
            p_record_id: item.recordId + ""
          }
        };
        var success = function (result) {
          if (result.status == 'S') {
            var index = $scope.list.indexOf(item);
            console.log('submitAction.success.index ' + index)
            $scope.list.splice(index, 1);
            hmsPopup.showPopup('处理工作流成功!');
          }
          else {
            hmsPopup.showPopup('处理工作流失败,请进入详细界面填写完整信息!');
          }
        };
        var error = function (response) {
        };

        var submit = function (buttonIndex) {
          if (baseConfig.debug) {
            console.log('You selected button ' + buttonIndex);
          }
          if (buttonIndex == 1) {
            hmsPopup.showLoading('处理工作流中');
            workFLowListService.submitAction(success, error, params);
          } else {
          }
        }
        hmsPopup.confirm("是否确认提交工作流?", "", submit);
      }

      $scope.workflowActionHandle = {
        approveWorkflow: function (item) {
          submitAction('0', item);
        },
        rejectWorkflow: function (item) {
          submitAction('-1', item);
        }
      };

      $scope.dataFilterHandle = {
        cancelDataFilter: function () {
          $scope.workflowFilterModal.hide();
        },
        clearDataFilterParams: function () {
          $scope.workflowFilterModal.hide();
        },
        confirmDataFilter: function () {
          if (baseConfig.debug) {
            console.log('dataFilterUtil.filterOption ' + angular.toJson(filterOption));
          }
          $scope.workflowFilterModal.hide();

          if (baseConfig.debug) {
            console.log('$scope.listStatus.todo.selected ' + $scope.listStatus.todo.selected)
          }

          if ($scope.listStatus.todo.selected) {
            $scope.fetchTodoList(true);
          } else {
            $scope.fetchDoneList(true);
          }

        },
        selectFilterType: function (type) {
          if (baseConfig.debug) {
            console.log('type ' + angular.toJson(type));
            console.log('dataFilterUtil().filterOption.workflowNameFilter ' +
              angular.toJson(filterOption.workflowNameFilter));
            //console.log('dataFilterUtil().filterOption.submitterFilter ' +
            //angular.toJson(filterOption.submitterFilter));
          }
          angular.forEach($scope.selectFilterTypeList, function (data) {
            data.selected = false;
          });
          type.selected = true;
          $scope.filterItemList = [];

          $ionicScrollDelegate.$getByHandle('hmsFilterCondition').scrollTop();

          if (type.code == 'ALL') {
            filterOption.currentSelectType = 'ALL';
            $scope.filterItemList = filterOption.noConditionFilter;

          } else if (type.code == 'PERSON') {
            filterOption.currentSelectType = 'PERSON';
            $scope.filterItemList = filterOption.submitterFilter;
          } else if (type.code == 'WORKFLOWNODE') {
            filterOption.currentSelectType = 'WORKFLOWNODE';
            $scope.filterItemList = filterOption.workflowNameFilter;
          }
        },
        selectFilterItem: function (filterItem) {
          if (baseConfig.debug) {
            console.log('filterItem ' + angular.toJson(filterItem));
          }
          angular.forEach($scope.filterItemList, function (data) {
            data.selected = false;
          });
          filterItem.selected = true;
          if (filterOption.currentSelectType == 'PERSON') {
            filterOption.currentSubmitterFilter = filterItem.itemCode;
          }
          if (filterOption.currentSelectType == 'WORKFLOWNODE') {
            filterOption.currentWorkflowFilter = filterItem.itemCode;
          }
          if (baseConfig.debug) {
            console.log('filterOption.currentSubmitterFilter ' + filterOption.currentSubmitterFilter);
            console.log('filterOption.currentWorkflowFilter ' + filterOption.currentWorkflowFilter);
          }
        }
      };

      var dataFilterUtil = function () {
        var self = {};

        self.clearFilterCondition = function () {
          filterOption.currentSelectType = 'ALL'
          filterOption.currentWorkflowFilter = '';
          filterOption.currentSubmitterFilter = '';
        };

        self.fetchFilterCondition = function () {
          var condition = {
            "workflowId": "",
            "submitterId": ""
          };
          if (filterOption.currentSelectType == 'ALL') {
            return condition;
          } else {
            condition.workflowId = filterOption.currentWorkflowFilter;
            condition.submitterId = filterOption.currentSubmitterFilter;
            return condition;
          }
        };

        self.query = function () {
          var success = function (result) {
            if (result.returnStatus == 'S') {
              if (baseConfig.debug) {
                console.log('result ' + angular.toJson(result));
              }
              $scope.selectFilterTypeList = [
                {
                  "code": "ALL",
                  "name": "部门成员",
                  "selected": true
                },
                {
                  "code": "PERSON",
                  "name": "部门名称",
                  "selected": false
                },
                {
                  "code": "WORKFLOWNODE",
                  "name": "项目名称",
                  "selected": false
                }
              ];
              if (baseConfig.debug) {
                console.log('dataFilterUtil.cashList ' + angular.toJson(cashList));
              }
              filterOption.submitterFilter = [];
              filterOption.workflowNameFilter = [];
              filterOption.noConditionFilter = [];
              $scope.filterItemList = [];
              filterOption.currentSubmitterFilter = '';
              filterOption.currentWorkflowFilter = '';
              var noCondition = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.noConditionFilter.push(noCondition);
              var workflowF = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.workflowNameFilter.push(workflowF);
              angular.forEach(result.returnData.workflowList, function (data) {
                var workflowNode = {
                  "itemCode": data.workflowId,
                  "itemDesc": data.workflowName,
                  "selected": false
                };
                filterOption.workflowNameFilter.push(workflowNode);
              });
              var submitterF = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.submitterFilter.push(submitterF);
              angular.forEach(result.returnData.personList, function (data) {
                var person = {
                  "itemCode": data.submitterId,
                  "itemDesc": data.submitterName,
                  "selected": false
                };
                filterOption.submitterFilter.push(person);
              });
              $scope.filterItemList = filterOption.noConditionFilter;

              if (baseConfig.debug) {
                console.log('self.filterOption.workflowNameFilter ' + angular.toJson(filterOption.workflowNameFilter));
                console.log('self.filterOption.submitterFilter ' + angular.toJson(filterOption.submitterFilter));
              }

              //$scope.$apply();
            }
          };
          var error = function (response) {
          };
          var processedFlag = 'N';
          if ($scope.listStatus.done.selected) {
            processedFlag = 'Y';
          }
          workFLowListService.get_workflow_filter(success, error, processedFlag);

        };
        return self;
      };

      $timeout(function () {
        getTodoList(false);
        dataFilterUtil().query();
      }, 400);

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$ionicView.beforeEnter', function () {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$ionicView.beforeEnter');
        }
        if (workFLowListService.getRefreshWorkflowList().flag == true) {
          workFLowListService.setRefreshWorkflowList(false);
          if (baseConfig.debug) {
            console.log('refresh workflow list');
          }
          refreshTodoList();
        }
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$ionicView.beforeLeave');
        }
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$destroy');
        }
      });

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
