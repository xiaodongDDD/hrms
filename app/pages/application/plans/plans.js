/**
 * Created by ZaraNengap on 2016/10/14.
 */
(function () {
  angular
    .module('planModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.plans', {
        url: '/plans',
        views: {
          'tab-application': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/application/plans/plans.html',
            controller: 'PlansCtrl'
          }
        }
      })
  }

  angular
    .module('planModule')
    .controller('PlansCtrl', PlansCtrl);

  function PlansCtrl($scope,
                     $state,
                     publicMethod,
                     $ionicHistory,
                     $ionicScrollDelegate,
                     $timeout,
                     $rootScope,
                     plansService,
                     baseConfig) {
    var vm = $scope;

    vm.planMode = '看周报';
    vm.showAsMonth = true;
    vm.showNew = false;
    vm.lastHeight = 'calc(100vh - 88px)';
    vm.plans = [];
    vm.planGroups = [];
    vm.headHeight = 36;
    vm.noTitleItemHeight = 113;
    vm.itemHeight = 133;
    vm.nowShowDate = '';
    vm.scrollFlag = [];

    var currentCalendarType = 'MONTH';
    var currentCalendarCache;
    var currentCalendarPos;

    //切换我的计划与下属计划的标签
    vm.planSearchIsRunning = false;
    vm.planAuthority = {
      "MY": {
        "selected": true
      },
      "OTHER": {
        "selected": false
      }
    };

    //按区间查看计划 本周 下周
    vm.planPeriodIsRunning = false;
    vm.planPeriod = {
      "current": {
        "selected": true
      },
      "next": {
        "selected": false
      },
      "period": {
        "selected": false
      }
    };

    vm.calendarLoadingFlag = true;
    vm.planListLoadingFlag = true;

    //////////////数据相关/////////////////
    vm.page = 1;
    vm.pageSize = 10;
    vm.searchDate = '';

    vm.groupPage = 1;
    vm.groupPageSize = 10;
    vm.groupStartDate = '';
    vm.groupEndDate = '';

    vm.morePlanCanBeLoaded = false;
    vm.moreGroupPlanCanBeLoaded = false;

    var bigMonth = [1, 3, 5, 7, 8, 10, 12];

    vm.weekdays = ['一', '二', '三', '四', '五', '六','日'];

    vm.days = [];

    vm.lastSelectDay = '';

    vm.timeItems = [
      {
        flag: true,
        text: "上午"
      }, {
        flag: false,
        text: "中午"
      }, {
        flag: false,
        text: "下午"
      }
    ];

    vm.showVoice = false;

    var currentListHeight;

    vm.nowGroupIndex = 0;

    var nowDate = new Date();

    $rootScope.img = "";

    //切换查询计划的权限
    vm.changePlanAuthority = changePlanAuthority;

    //切换本周下周
    vm.changePlanPeriod = changePlanPeriod;

    vm.goWeeklyReport = goWeeklyReport;
    vm.goWeeklyReportList = goWeeklyReportList;

    vm.goDetail = goDetail;
    vm.onRelease = onRelease;
    vm.onDragUp = onDragUp;
    vm.goBack = goBack;
    vm.goState = goState;
    vm.goSetPlan = goSetPlan;

    vm.getDateNumber = getDateNumber;
    vm.getMonthDays = getMonthDays;
    vm.getLastMonthLastDays = getLastMonthLastDays;
    vm.initSelect = initSelect;
    vm.select = select;
    vm.isToday = isToday;
    vm.onGestureCalendar = onGestureCalendar;
    vm.onReleaseYear = onReleaseYear;
    vm.initScrollFlag = initScrollFlag;
    vm.onSwipe = onSwipe;
    vm.onDrag = onDrag;
    vm.onReleaseList = onReleaseList;
    vm.selectThisMonth = selectThisMonth;
    vm.selectRange = selectRange;
    vm.showNewDiv = showNewDiv;
    vm.selectTime = selectTime;
    vm.showVoiceDiv = showVoiceDiv;
    vm.goPlansAdd = goPlansAdd;
    vm.formatDate = formatDate;
    vm.formatDateByDate = formatDateByDate;
    vm.getHasPlanListSuccess = getHasPlanListSuccess;
    vm.getHasPlanList = getHasPlanList;
    vm.getPlanByLastSelectDay = getPlanByLastSelectDay;
    vm.getPlanSuccess = getPlanSuccess;
    vm.getWeekPlan = getWeekPlan;
    vm.getGroupPlanSuccess = getGroupPlanSuccess;
    vm.loadMorePlans = loadMorePlans;
    vm.changeShowModel = changeShowModel;
    vm.getDayString = getDayString;

    function getDayString(thisDate){
      return  '星期' + vm.weekdays[(new Date(thisDate)).getDay()];
    }

    $scope.contentHeight = {};
    $scope.calendarStyle = {};

    var viewHeaderHeight;
    var calendarHideHeight;

    if (ionic.Platform.isIOS()) {
      viewHeaderHeight = 162;
      calendarHideHeight = 114;
    } else {
      viewHeaderHeight = 138;
      calendarHideHeight = 90;
    }

    /*if (!ionic.Platform.isWebView()) {
      viewHeaderHeight = 138;
      calendarHideHeight = 90;
    }*/

    //初始化数据
    init();

    $scope.$on('$ionicView.beforeEnter', function (e) {
      if (baseConfig.debug) {
        console.log('PlansCtrl.$ionicView.afterEnter');
      }
      if (plansService.getRefreshDataFlag()) {
        plansService.setRefreshDataFlag(false);
        if (!$scope.showAsMonth) {
          getWeekPlan(new Date());
        } else {
          $ionicScrollDelegate.$getByHandle('plan-scroll').scrollTop(true);
          getPlanByLastSelectDay();
        }
      }
    });

    //获取当前是什么查询权限
    function getAuthorityType() {
      var authority = 'OTHER';
      if (vm.planAuthority.MY.selected) {
        authority = 'MY';
      }
      return authority;
    }

    //切换查询计划的权限
    function changePlanAuthority(type) {

      if (vm.planSearchIsRunning) {
        return;
      }

      if (vm.planAuthority.MY.selected && type == 'MY') {
        return;
      }

      if (vm.planAuthority.OTHER.selected && type == 'OTHER') {
        return;
      }

      vm.planSearchIsRunning = true;

      vm.planAuthority.OTHER.selected = vm.planAuthority.MY.selected;
      vm.planAuthority.MY.selected = !vm.planAuthority.MY.selected;

      if (!$scope.showAsMonth) {
        if (baseConfig.debug) {
          console.log('changePlanAuthority.getWeekPlan ... ')
        }
        getWeekPlan(new Date());
      } else {
        if (baseConfig.debug) {
          console.log('changePlanAuthority.getPlanByLastSelectDay ... ')
        }
        getHasPlanList($scope.lastSelectDay.year, $scope.lastSelectDay.month);
        getPlanByLastSelectDay();
      }
    }

    function changePlanPeriod(type) {
      if (vm.planPeriodIsRunning) {
        return;
      }

      if (vm.planPeriod.current.selected && type == 'current') {
        return;
      }

      if (vm.planPeriod.next.selected && type == 'next') {
        return;
      }

      vm.planPeriodIsRunning = true;
      vm.planPeriod.current.selected = vm.planPeriod.next.selected;
      vm.planPeriod.next.selected = !vm.planPeriod.next.selected;

      if (vm.planPeriod.current.selected) {
        getWeekPlan(new Date());
      } else if (vm.planPeriod.next.selected) {
        if (baseConfig.debug) {
          console.log('plansService.getNextMondayAndSundayByDate(new Date()) ' + angular.toJson(plansService.getNextMondayAndSundayByDate(new Date())))
        }
        getWeekPlan(plansService.getNextMondayAndSundayByDate(new Date()).monday);
      }
    }

    function goWeeklyReportDetail(date) {
      var dateRange = plansService.getMondayAndSunday(date);

      if (baseConfig.debug) {
        console.log('goWeeklyReportDetail.date ' + angular.toJson(date));
        console.log('goWeeklyReportDetail.dateRange ' + angular.toJson(dateRange));
      }

      //我的周报入口
      /*if (vm.planAuthority.MY.selected) {
       var params = {
       "date": dateRange.mondayStr
       };
       $state.go('tab.weekly-report-detail', {
       "type": "QUERY",
       "authority": getAuthorityType(),
       "params": params,
       "detail": {}
       });
       } else {*/
      //下属的周报入口
      if (baseConfig.debug) {
        console.log('period ' + angular.toJson(period));
      }
      var period = {
        "date": dateRange.mondayStr
      };
      $state.go('tab.weekly-report', {"type": "QUERY", "authority": getAuthorityType(), "period": period})
      //}
    }

    //进入我的或者下属的周报界面，根据权限判断
    function goWeeklyReport() {
      var date = $scope.lastSelectDay;
      var date2 = date.year + '/' + date.month + '/' + date.date;
      goWeeklyReportDetail(date2);
    }

    //进入我的或者下属的周报列表界面，根据权限判断
    function goWeeklyReportList(date) {
      var date2 = date.replace(/-/g, "/");
      goWeeklyReportDetail(date2)
    }

    //进入计划明细界面
    function goDetail(detail) {
      $state.go('tab.plans-detail', {"authority": getAuthorityType(), "planDetail": detail});
    }

    function onRelease($event) {
      if (!$scope.showAsMonth) {
        return;
      }
      //console.log($event);
      //console.log($ionicScrollDelegate.$getByHandle('plan-scroll').getScrollPosition());
      //console.log('onRelease... $event.detail.scrollTop ' + $event.detail.scrollTop);
      if ($ionicScrollDelegate.$getByHandle('plan-scroll').getScrollPosition().top < -30) {

        //$ionicScrollDelegate.$getByHandle('plan-scroll').freezeScroll(true);
        changeWeekAndMonth('MONTH', $scope.days);
        getMonthDays($scope.year, $scope.month, reCalculateViewHeight);
        /*var mineHeight = 138 + $scope.days.length / 7 * 50;
         if (ionic.Platform.isIOS()) {
         $scope.contentHeight.height = 'calc(100vh - ' + (mineHeight + 24) + "px)";
         } else {
         $scope.contentHeight.height = 'calc(100vh - ' + (mineHeight + 0) + "px)";
         }
         $ionicScrollDelegate.$getByHandle('plan-scroll').resize();
         $scope.calendarStyle.height = "300px";
         $ionicScrollDelegate.$getByHandle('plan-scroll').freezeScroll(false);*/
      }
    }

    //日历上拉缩小
    function onDragUp() {
      if (!$scope.showAsMonth) {
        return;
      }
      changeWeekAndMonth('WEEK', $scope.days);
      reCalculateViewHeight(true, $scope.days.length);
    }

    function goBack() {
      $ionicHistory.goBack();
    }

    function goState(url) {
      $state.go(url);
    }

    function goSetPlan() {
      $state.go('tab.plans-add');
    }

    function getDateNumber(year, month) {
      return bigMonth.indexOf(month) >= 0 ? 31 : (month != 2 ? 30 : (year % 4 == 0 ? 29 : 28));
    }

    //获取当月的销售计划分布情况
    function getMonthDays(year, month, reCalculateViewHeight, changeMonth) {
      $scope.days = [];
      var lastDay = getDateNumber(year, month);
      var monthStart = new Date(year, month - 1, 1);
      var monthEnd = new Date(year, month - 1, lastDay);
      var startWeekday = monthStart.getDay();
      if(startWeekday == 0)
        startWeekday = 7;
      var endWeekday = monthEnd.getDay();
      if(endWeekday == 0)
        endWeekday = 7;
      for (var i = 0; i < lastDay; i++) {
        $scope.days[i + startWeekday - 1] = {
          num: i + 1,
          state: 0
        };
        if (isToday(year, month, i + 1)) {
          $scope.days[i + startWeekday - 1].num = i + 1;
          $scope.days[i + startWeekday - 1].state = 2;
        }
      }
      getLastMonthLastDays(year, month, startWeekday);
      for (var j = 1; j <= 7 - endWeekday; j++) {
        $scope.days.push({
          num: j,
          state: -1
        });
      }
      reCalculateViewHeight(true, $scope.days.length);
      initSelect(changeMonth);
      getHasPlanList(year, month);
    }

    function getLastMonthLastDays(year, month, num) {
      var lastMonth = month == 1 ? 12 : month - 1;
      var lastYear = lastMonth == 12 ? year - 1 : year;
      var lastMonthDays = bigMonth.indexOf(lastMonth) >= 0 ? 31 : (lastMonth != 2 ? 30 : (lastYear % 4 == 0 ? 29 : 28));
      for (var i = 0; i < num - 1; i++) {
        $scope.days[i] = {
          num: lastMonthDays - (num - i) + 2,
          state: -1
        };
      }
    }

    //初始化日历控件
    function initSelect(changeMonth) {
      if (baseConfig.debug) {
        console.log('initSelect $scope.lastSelectDay ' + angular.toJson($scope.lastSelectDay));
      }
      if ($scope.lastSelectDay == '') {
        var today = new Date();
        $scope.lastSelectDay = {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          date: today.getDate()
        };

        if (baseConfig.debug) {
          console.log('initSelect $scope.lastSelectDay ' + $scope.lastSelectDay);
        }

        getPlanByLastSelectDay();
      }
      //切换月份时，选中的日期判断
      if (changeMonth) {
        if (baseConfig.debug) {
          console.log('initSelect $scope.year ' + $scope.year);
          console.log('initSelect $scope.month ' + $scope.month);
        }
        var today = new Date();
        if (today.getFullYear() == $scope.year, today.getMonth() + 1 == $scope.month) {
          $scope.lastSelectDay = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            date: today.getDate()
          };
        } else {
          $scope.lastSelectDay = {
            year: $scope.year,
            month: $scope.month,
            date: 1
          };
        }
        if (baseConfig.debug) {
          console.log('initSelect $scope.lastSelectDay ' + angular.toJson($scope.lastSelectDay));
        }
        getPlanByLastSelectDay();
      }
      //初始化日历选中，或者是当天的标记
      for (var i = 0; i < $scope.days.length; i++) {
        if ($scope.days[i].state == 1) {
          $scope.days[i].state = 0;
        }
        if (isToday($scope.year, $scope.month, $scope.days[i].num))
          $scope.days[i].state = 2;
        if (($scope.days[i].state == 0 || $scope.days[i].state == 2) &&
          $scope.days[i].num == $scope.lastSelectDay.date &&
          $scope.year == $scope.lastSelectDay.year &&
          $scope.month == $scope.lastSelectDay.month) {
          $scope.days[i].state = 1;
        }
      }
    }

    function init() {

      vm.year = nowDate.getFullYear();

      vm.month = nowDate.getMonth() + 1;

      getMonthDays(vm.year, vm.month, reCalculateViewHeight);
    }

    function select($index) {
      if ($scope.days[$index].state == -1)
        return 0;

      $ionicScrollDelegate.$getByHandle('plan-scroll').scrollTop(true);

      $scope.days[$index].state = 1;
      $scope.lastSelectDay = {
        year: $scope.year,
        month: $scope.month,
        date: $scope.days[$index].num
      };
      initSelect();
      getPlanByLastSelectDay();
    }

    function isToday(year, month, date) {
      return (year == nowDate.getFullYear()) && (month == (nowDate.getMonth() + 1)) && (date == nowDate.getDate());
    }


    function recalculateYear(offset) {
      if(offset == 1){
        $scope.year =  $scope.month == 12 ? $scope.year + offset : $scope.year;
        $scope.month = $scope.month == 12 ? 1 : $scope.month + offset;
      }
      else{
        $scope.year =  $scope.month == 1 ? $scope.year + offset : $scope.year;
        $scope.month = $scope.month == 1 ? 12 : $scope.month + offset;
      }
    }

    //重新计算日历和列表的高度
    /*calendarFlag 是否包含日历
     fullMonthFlag 是否是整个月
     */
    function reCalculateViewHeight(calendarFlag, length) {
      if (baseConfig.debug) {
        console.log('calendarFlag ' + calendarFlag);
        console.log('length ' + length);
        console.log('length ' + length / 7);
      }

      if (calendarFlag) {
        var listHeight = viewHeaderHeight + length / 7 * 50;
        $scope.contentHeight.height = 'calc(100vh - ' + listHeight + 'px)';
        $scope.calendarStyle.height = 50 + length / 7 * 50;
      } else {
        $scope.contentHeight.height = 'calc(100vh - ' + calendarHideHeight + 'px)';
      }
      $ionicScrollDelegate.$getByHandle('plan-scroll').resize();
    }

    function changeWeekAndMonth(destType, dayList) {
      if (baseConfig.debug) {
        console.log('changeWeekAndMonth destType ' + destType);
        console.log('changeWeekAndMonth currentCalendarType ' + currentCalendarType)
      }
      if (destType == 'WEEK' && currentCalendarType == 'MONTH') {
        currentCalendarType = 'WEEK';
        currentCalendarCache = angular.copy(dayList);
        angular.forEach(currentCalendarCache, function (data, i) {
          if (data.state == 1) {
            var startIndex = i - i % 7;
            currentCalendarPos = startIndex;
            var weekResult = [];
            for (var j = 0; j < 7; j++) {
              weekResult.push(currentCalendarCache[startIndex + j]);
            }
            $scope.days = [];
            for (var k = 0; k < 7; k++) {
              $scope.days.push(weekResult[k]);
            }
          }
        });
      } else if (destType == 'MONTH' && currentCalendarType == 'WEEK') {
        currentCalendarType = 'MONTH';
        var weekCache = angular.copy(dayList);
        $scope.days = angular.copy(currentCalendarCache);
        for (var j = 0; j < 7; j++) {
          $scope.days[currentCalendarPos + j] = weekCache[j];
        }
      }
    }

    //上下左右手势滑动更新日历列表
    function onGestureCalendar(type) {

      if (vm.planSearchIsRunning) {
        return;
      }

      if (type == 'right') {
        currentCalendarType = 'MONTH';
        recalculateYear(-1);
        getMonthDays($scope.year, $scope.month, reCalculateViewHeight, true);

      }
      //向左滑动时显示下一月
      else if (type == 'left') {
        currentCalendarType = 'MONTH';
        recalculateYear(1);
        getMonthDays($scope.year, $scope.month, reCalculateViewHeight, true);

      }
      else if (type == 'up') {
        //向上滑动时缩小至一行

        changeWeekAndMonth('WEEK', $scope.days);
        reCalculateViewHeight(true, $scope.days.length);

      }
      //向下滑动时显示整月
      else {
        changeWeekAndMonth('MONTH', $scope.days);
        reCalculateViewHeight(true, $scope.days.length);
        //getMonthDays($scope.year, $scope.month);
        //$scope.calendarStyle.height = "300px";

      }
    }

    function onReleaseYear($event) {
      if ($event.gesture.deltaX > 0) {
        $scope.year = $scope.year + 1;
        getMonthDays($scope.year, $scope.month);
      }
      else if ($event.gesture.deltaX < 0) {
        $scope.year = $scope.year - 1;
        getMonthDays($scope.year, $scope.month);
      }
    }

    function initScrollFlag() {
      var top = 0;
      $scope.scrollFlag = [];
      for (var i = 0; i < $scope.planGroups.length; i++) {
        var groupHeight = 0;
        for(var j = 0; j < $scope.planGroups[i].plans.length; j++){
          if(($scope.planGroups[i].plans[j].customerFullName && $scope.planGroups[i].plans[j].customerFullName) != '' || ($scope.planGroups[i].plans[j].opportunityFullName && $scope.planGroups[i].plans[j].opportunityFullName) )
            groupHeight += $scope.itemHeight;
          else
            groupHeight += $scope.noTitleItemHeight;
        }
        var height = $scope.headHeight + groupHeight;
        top += height;
        $scope.scrollFlag.push(top);
      }
      console.log($scope.scrollFlag);
    }

    function onSwipe() {
      $timeout(function () {
        var top = $ionicScrollDelegate.$getByHandle('plan-scroll').getScrollPosition().top;
        var lastIndex = 0;
        for (var i = 0; i < $scope.scrollFlag.length - 1; i++)
          if (top >= $scope.scrollFlag[i]) {
            lastIndex = i + 1;
          }
        $scope.nowShowDate = $scope.planGroups[lastIndex].date;
      }, 500);
    }

    function onDrag() {
      var top = $ionicScrollDelegate.$getByHandle('plan-scroll').getScrollPosition().top;
      if (top <= 0)
        return;
      var lastIndex = 0;
      for (var i = 0; i < $scope.scrollFlag.length - 1; i++)
        if (top >= $scope.scrollFlag[i]) {
          lastIndex = i + 1;
        }
      $scope.nowShowDate = $scope.planGroups[lastIndex].date;
    }

    function selectThisMonth() {
      $scope.year = nowDate.getFullYear();
      $scope.month = nowDate.getMonth() + 1;
      getMonthDays($scope.year, $scope.month);
    }

    function onReleaseList() {
      $timeout(function () {
        var top = $ionicScrollDelegate.$getByHandle('plan-scroll').getScrollPosition().top;
        var lastIndex = 0;
        for (var i = 0; i < $scope.scrollFlag.length - 1; i++)
          if (top >= $scope.scrollFlag[i]) {
            lastIndex = i + 1;
          }
        $scope.nowShowDate = $scope.planGroups[lastIndex].date;
      }, 1000);
    }

    function openCalendarPage() { //跳到原生日历界面--获取截止日期
      var success = function (response) {
        try {
          var result = response.result;
          var startDate = result[0];
          var endDate = result[1];
          getWeekPlanByPeriod(startDate,endDate,true)
        } catch (e) {
        }
      };
      var error = function (response) {
      };

      if (ionic.Platform.isWebView()) {
        HmsCalendar.openCalendar(success, error, '1');
      }
    };

    function selectRange() {
      //console.log("Select Range");
      vm.planPeriod.current.selected = false;
      vm.planPeriod.next.selected = false;
      vm.planPeriod.period.selected = true;
      openCalendarPage();
    }

    function showNewDiv() {
      $scope.showNew = !$scope.showNew;
    }

    function selectTime($index) {
      $scope.timeItems[0].flag = false;
      $scope.timeItems[1].flag = false;
      $scope.timeItems[2].flag = false;
      $scope.timeItems[$index].flag = true;
    }

    function showVoiceDiv() {
      $scope.showVoice = !$scope.showVoice;
    }

    function goPlansAdd() {
      var planData=formatDate($scope.lastSelectDay.year, $scope.lastSelectDay.month, $scope.lastSelectDay.date);
      console.log('initSelect $scope.lastSelectDay ' + angular.toJson($scope.lastSelectDay));
      $scope.data = {
        "planDate":planData,
        "customerId": "",
        "opportunityId": "",
        "timeBucket": "",
        "saleContent": "",
        "userId": window.localStorage.empno,
        "planType": "",
        "planSource": null,
        "dataStatus": "HCRM_VALID",
        lastSelectDay:$scope.lastSelectDay
      };
      $state.go('tab.plans-add',{planData:$scope.data});
    }

    function formatDate(year, month, date) {
      return year + '-' +
        ((month < 10) ? ('0' + month) : month) + '-' +
        ((date < 10) ? ('0' + date) : date);
    }

    function formatDateByDate(date) {
      return date.getFullYear() + '-' +
        (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' +
        ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
    }

    //获取日历的分布情况的成功就回调
    function getHasPlanListSuccess(response) {
      if (response.returnCode == "S") {
        var j = 0;
        angular.forEach($scope.days,function (data) {
          data.hasContent = false;
        });
        for (var i = 0; i < response.saleplan_list.length; i++) {
          var date = Number.parseInt(response.saleplan_list[i].planDate.substr(-2, 2));
          for (var k = j; k < $scope.days.length; k++) {
            if ($scope.days[k].num == date && $scope.days[k].state != -1) {
              $scope.days[k].hasContent = true;
              j = k;
              break;
            }
          }
        }
      }
    }

    //获取日历的分布情况
    function getHasPlanList(year, month) {
      var params = {
        planDateFrom: formatDate(year, month, 1),
        planDateTo: formatDate(year, month, getDateNumber(year, month)),
        page: 1,
        pageSize: 31,
        type: getAuthorityType()
      };
      plansService.getHasPlanList(getHasPlanListSuccess, params);
    }

    //根据当前日期查找plan
    function getPlanByLastSelectDay() {
      $scope.morePlanCanBeLoaded = false;
      var dateText = formatDate($scope.lastSelectDay.year, $scope.lastSelectDay.month, $scope.lastSelectDay.date);
      $scope.searchDate = dateText;
      $scope.page = 1;
      $scope.pageSize = 10;
      var params = {
        page: $scope.page,
        pageSize: $scope.pageSize,
        planDateFrom: dateText,
        planDateTo: dateText,
        type: getAuthorityType()
      };
      console.log(params);
      $scope.plans = [];
      vm.calendarLoadingFlag = true;

      function error() {
        vm.calendarLoadingFlag = false;
        vm.planSearchIsRunning = false;
        $scope.morePlanCanBeLoaded = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }

      plansService.getPlanByDate(getPlanSuccess, error, params);
    }

    //得到当日销售计划成功后
    function getPlanSuccess(response) {
      vm.calendarLoadingFlag = false;
      vm.planSearchIsRunning = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if (response.returnCode == "S") {
        $scope.plans = $scope.plans.concat(response.saleplan_list);
        $scope.morePlanCanBeLoaded = (response.saleplan_list.length % $scope.pageSize == 0) && (response.saleplan_list.length != 0);
        //$ionicScrollDelegate.$getByHandle('plan-scroll').scrollTop(true);
      }
    }

    //得到一周的计划
    function getWeekPlan(date) {

      var day = date.getDay();
      if(day == 0){
        day = 7;
      }
      var weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - (day - 1));
      var weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + (7 - day));

      if(baseConfig.debug){
        console.log('getWeekPlan  date.getDay() ' + date.getDay());
        console.log('getWeekPlan  weekStart ' + weekStart);
        console.log('getWeekPlan  weekEnd ' + weekEnd);
      }

      $scope.groupPage = 1;
      $scope.groupPageSize = 10;
      $scope.groupStartDate = formatDateByDate(weekStart);
      $scope.groupEndDate = formatDateByDate(weekEnd);
      var params = {
        planDateFrom: $scope.groupStartDate,
        planDateTo: $scope.groupEndDate,
        page: $scope.groupPage,
        pageSize: $scope.groupPageSize,
        sortname: 'planDate',
        sortorder: 'asc',
        type: getAuthorityType()
      };
      $scope.groupPlans = [];
      $scope.planGroups = [];
      $scope.nowGroupIndex = 0;
      vm.planListLoadingFlag = true;

      function error() {
        vm.planSearchIsRunning = false;
        vm.planPeriodIsRunning = false;
        $scope.morePlanCanBeLoaded = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }

      plansService.getPlanByDate(getGroupPlanSuccess, error, params);
    }


    //根据范围查询计划
    function getWeekPlanByPeriod(dateFrom,dateTo,pluginFlag) {
      $scope.groupPage = 1;
      $scope.groupPageSize = 10;
      $scope.groupStartDate = dateFrom;
      $scope.groupEndDate = dateTo;
      var params = {
        planDateFrom: $scope.groupStartDate,
        planDateTo: $scope.groupEndDate,
        page: $scope.groupPage,
        pageSize: $scope.groupPageSize,
        sortname: 'planDate',
        sortorder: 'asc',
        type: getAuthorityType()
      };
      $scope.groupPlans = [];
      $scope.planGroups = [];
      $scope.nowGroupIndex = 0;
      vm.planListLoadingFlag = true;

      function error() {
        vm.planSearchIsRunning = false;
        vm.planPeriodIsRunning = false;
        $scope.morePlanCanBeLoaded = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }

      plansService.getPlanByDate(getGroupPlanSuccess, error, params);
    }

    //得到时间范围内销售计划成功后
    function getGroupPlanSuccess(response,pluginFlag) {
      if (baseConfig.debug) {
        console.log('getGroupPlanSuccess.response ' + angular.toJson(response));
        console.log('getGroupPlanSuccess $scope.planGroups ' + angular.toJson($scope.planGroups));
      }

      vm.planListLoadingFlag = false;
      vm.planSearchIsRunning = false;
      vm.planPeriodIsRunning = false;

      $scope.$broadcast('scroll.infiniteScrollComplete');

      $ionicScrollDelegate.$getByHandle('plan-scroll').scrollTop(true);
      $ionicScrollDelegate.$getByHandle('plan-scroll').resize();

      if (response.returnCode == "S") {
        for (var i = 0; i < response.saleplan_list.length; i++) {
          var thisDate = response.saleplan_list[i].planDate.substr(0, 10);
          if (!$scope.planGroups[$scope.nowGroupIndex - 1] || $scope.planGroups[$scope.nowGroupIndex - 1].date != thisDate) {
            $scope.planGroups.push({date: thisDate, plans: []});
            $scope.planGroups[$scope.nowGroupIndex].plans.push(response.saleplan_list[i]);
            $scope.nowGroupIndex++;
          } else {
            $scope.planGroups[$scope.nowGroupIndex - 1].plans.push(response.saleplan_list[i]);
          }
        }
        vm.moreGroupPlanCanBeLoaded = (response.saleplan_list.length % $scope.groupPageSize == 0) && (response.saleplan_list.length != 0);
        if ($scope.groupPage == 1 && $scope.planGroups[0]) {
          $scope.nowShowDate = $scope.planGroups[0].date;
        }
        initScrollFlag();
      }
    }

    //加载更多计划
    function loadMorePlans() {
      var params = {};
      if ($scope.showAsMonth) {
        $scope.page++;
        params = {
          planDateFrom: $scope.searchDate,
          planDateTo: $scope.searchDate,
          page: $scope.page,
          pageSize: $scope.pageSize,
          sortname: 'planDate',
          sortorder: 'asc',
          type: getAuthorityType()
        };

        function error() {
          vm.planSearchIsRunning = false;
          $scope.morePlanCanBeLoaded = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        plansService.getPlanByDate(getPlanSuccess, error, params);
      }
      else {
        $scope.groupPage++;
        params = {
          planDateFrom: $scope.groupStartDate,
          planDateTo: $scope.groupEndDate,
          page: $scope.groupPage,
          pageSize: $scope.groupPageSize,
          sortname: 'planDate',
          sortorder: 'asc',
          type: getAuthorityType()
        };

        function error() {
          vm.planSearchIsRunning = false;
          vm.planPeriodIsRunning = false;
          $scope.moreGroupPlanCanBeLoaded = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        plansService.getPlanByDate(getGroupPlanSuccess, error, params);
      }
      console.log($scope.page);
      console.log($scope.groupPage);
      console.log(params);
    }

    function changeShowModel(flag) {
      if (!flag) {
        currentListHeight = $scope.contentHeight.height;
      }
      $scope.showAsMonth = flag;
      if (!flag) {
        reCalculateViewHeight(false, 0);
      } else {
        $scope.contentHeight.height = currentListHeight;
      }
      $ionicScrollDelegate.$getByHandle('plan-scroll').scrollTop(true);
      $ionicScrollDelegate.$getByHandle('plan-scroll').resize();
      if (!$scope.showAsMonth) {
        vm.planPeriod.current.selected = true;
        vm.planPeriod.next.selected = false;
        getWeekPlan(new Date());
      }
    }

  }
}());

