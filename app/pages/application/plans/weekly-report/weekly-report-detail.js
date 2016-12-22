/**
 * Created by gusenlin on 2016/12/13.
 */
(function () {
  'use strict';
  angular
    .module('planModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.weekly-report-detail', {
        url: '/plans/weekly-report-detail',
        params: {
          type: "",
          authority: "",
          params: {},
          detail: {}
        },
        views: {
          'tab-application': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/application/plans/weekly-report/weekly-report-detail.html',
            controller: 'weeklyReportDetailCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('planModule')
    .controller('weeklyReportDetailCtrl', weeklyReportDetailCtrl);

  function weeklyReportDetailCtrl($scope,
                                  $stateParams,
                                  $ionicHistory,
                                  baseConfig,
                                  plansAddService,
                                  hmsPopup,
                                  plansService,
                                  $ionicModal,
                                  $timeout) {
    var vm = this;
    $scope.showSmallCrmLoading = false;
    vm.showLoading = true;
    vm.weeklyReport = {};

    vm.icon = 'build/img/plans/icon_plan@3x.png';
    vm.title = '请选择';

    vm.weeklyDetail = {
      "summaryId": "",
      "employee": "",
      "employeeName": "",
      "beginDate": "",
      "endDate": "",
      "period": "",
      "content": ""
    };

    var param = {
      type: $stateParams.type,
      authority: $stateParams.authority,
      params: $stateParams.params,
      detail: $stateParams.detail
    };

    vm.authority = $stateParams.authority;


    console.log('$stateParams.type ' + angular.toJson($stateParams.type));
    console.log('$stateParams.detail ' + angular.toJson($stateParams.detail));

    vm.selectDate = selectDate;
    //保存周报
    vm.saveWeekReport = saveWeekReport;
    vm.onDragScroll = onDragScroll;
    vm.onReleaseScroll = onReleaseScroll;
    vm.getWeekString = getWeekString;
    vm.onReleaseYear = onReleaseYear;
    vm.selectWeek = selectWeek;
    vm.showDateSelect = showDateSelect;
    vm.goBack = goBack;
    vm.voiceTo = voiceTo;
    vm.onRelease = onRelease;

    $ionicModal.fromTemplateUrl('build/pages/modals/crm-time-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      vm.opportunityAddModel = modal;
    });

    loadData();

    //////////////////////////转盘//////////////////////////////
    vm.rotates = [];
    vm.sourceDeg = 180;
    vm.weeksIndex = [];
    var weekNum = 16; // 定义滚轮的数量
    vm.nowIndex = weekNum / 2;
    vm.stageRotate = {
      "transform": "rotateX(" + vm.sourceDeg + "deg)",
      "-webkit-transform": "rotateX(" + vm.sourceDeg + "deg)"
    };
    for (var i = 0; i < weekNum; i++) {
      vm.weeksIndex.push(i);
    }

    vm.baseDeg = 360 / vm.weeksIndex.length;

    for (var i = (weekNum - 1); i >= 0; i--) {
      var deg = 360 / weekNum * (weekNum - i);
      vm.rotates[i] = {
        "transform": "rotateX(" + deg + "deg) translateZ(90px)",
        "-webkit-transform": "rotateX(" + deg + "deg) translateZ(90px)"
      };
    }

    function showDateSelect() {
      vm.opportunityAddModel.show();
    }

    function goBack() {
      vm.opportunityAddModel.hide();
    }

    /*滚轮*/
    function getLastDeg(deg) {
      return Math.round(deg / vm.baseDeg) * vm.baseDeg;
    }

    function getNextIndex(nowIndex) {
      var temp = nowIndex + 1;
      if (temp > weekNum - 1)
        temp = 0;
      return temp;
    }

    function getPrevIndex(nowIndex) {
      var temp = nowIndex - 1;
      if (temp < 0)
        temp = weekNum - 1;
      return temp;
    }

    function refreshData() {
      vm.nowIndex = Math.round(vm.nowIndex);
      if (vm.nowIndex >= weekNum)
        vm.nowIndex = weekNum - 1;
      vm.year = vm.weeks[vm.nowIndex].getFullYear();
      var needChangeUpIndex = vm.nowIndex - (weekNum / 4);
      if (needChangeUpIndex < 0)
        needChangeUpIndex = weekNum + needChangeUpIndex;
      var UpDate = new Date(vm.weeks[getNextIndex(needChangeUpIndex)]);
      UpDate.setDate(UpDate.getDate() - 7);
      vm.weeks[needChangeUpIndex] = UpDate;

      var needChangeDownIndex = vm.nowIndex + (weekNum / 4);
      if (needChangeDownIndex >= weekNum)
        needChangeDownIndex = needChangeDownIndex - weekNum;
      var DownDate = new Date(vm.weeks[getPrevIndex(needChangeDownIndex)]);
      DownDate.setDate(DownDate.getDate() + 7);
      vm.weeks[needChangeDownIndex] = DownDate;
    }

    function getNowIndex(deg) {
      var temp = deg / vm.baseDeg % weekNum;
      vm.nowIndex = temp < 0 ? (weekNum + temp) : temp;
      refreshData();
    }

    function onDragScroll($event) {
      vm.sourceDeg -= $event.gesture.deltaY / 10;
      vm.stageRotate = {
        "transform": "rotateX(" + vm.sourceDeg + "deg)",
        "-webkit-transform": "rotateX(" + vm.sourceDeg + "deg)"
      };
      getNowIndex(vm.sourceDeg);
    };
    function onReleaseScroll($event) {
      if ($event.gesture.deltaY > 0)
        vm.sourceDeg = getLastDeg(vm.sourceDeg) - vm.baseDeg;
      else
        vm.sourceDeg = getLastDeg(vm.sourceDeg);
      vm.stageRotate = {
        "transform": "rotateX(" + vm.sourceDeg + "deg)",
        "-webkit-transform": "rotateX(" + vm.sourceDeg + "deg)"
      };
      getNowIndex(vm.sourceDeg);
    };

    vm.today = new Date();
    vm.year = vm.today.getFullYear();

    function formatDate(value) {
      if (parseInt(value) < 10) {
        return '0' + value;
      }
      return value;
    }

    function getWeekString(date) {
      var day = date.getDay();
      var weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - (day - 1));
      var weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + (7 - day));
      return formatDate(weekStart.getMonth() + 1) + '月' + formatDate(weekStart.getDate()) + '日 ~ ' +
        formatDate(weekEnd.getMonth() + 1) + '月' + formatDate(weekEnd.getDate()) + '日';
    }

    function initWeeks(year) {
      vm.weeks = [];
      var listDate = new Date();
      listDate.setFullYear(year);
      listDate.setDate(vm.today.getDate() - 6 * 7);
      for (var i = 0; i < weekNum; i++) {
        var tempDate = new Date(listDate);
        vm.weeks[i] = tempDate;
        listDate.setDate(listDate.getDate() + 7);
      }
    }

    initWeeks(vm.today.getFullYear());

    function onReleaseYear($event) {
      var slideLeft = $event.gesture.deltaX < 0;
      if (slideLeft)
        vm.year++;
      else
        vm.year--;
      initWeeks(vm.year);
    }

    function formatDateInit(begin, to) {
      return begin.substr(0, 4) + '年 ' + begin.substr(5, 5) + '~' + to.substr(5, 5);
    }

    function selectWeek(nowIndex) {
      if (baseConfig.debug) {
        console.log('selectWeek vm.year ' + vm.year);
        console.log('selectWeek vm.nowIndex ' + nowIndex);
        console.log('selectWeek vm.weeks ' + angular.toJson(vm.weeks));
        console.log('selectWeek vm.weeks(nowIndex) ' + vm.getWeekString(vm.weeks[nowIndex]));
      }

      var period = plansService.getWeekPeriod(vm.weeks[nowIndex]);
      console.log('selectWeek .period ' + angular.toJson(period));
      vm.chooseWeek = vm.getWeekString(vm.weeks[nowIndex]);

      vm.weeklyDetail.endDate = period.dateTo;
      vm.weeklyDetail.beginDate = period.dateFrom;
      vm.weeklyDetail.period = formatDateInit(period.dateFrom, period.dateTo);
      vm.opportunityAddModel.hide();
    }

    /*滚轮*/

    function loadData() {
      if (param.type == 'QUERY') {
        fetchFromServe();
      } else {
        fetchFromParams();
      }
    }

    function selectDate() {

    }

    function insertText(obj, str) {
      if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
      } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
          endPos = obj.selectionEnd,
          cursorPos = startPos,
          tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
      } else {
        obj.value += str;
      }
    }

    //开始录音
    function voiceTo() {

      vm.holdText = true;
      cordova.plugins.pluginIflytek.startRecorerRecognize(
        function (msg) {
          $('#voice-img').addClass('big-img');
        }, function (msg) {
          $('#voice-img').addClass('big-img');
        });
    }

    //结束录音
    function onRelease() {
      vm.holdText = false;
      vm.showVoiceFlag = false;
      $scope.showSmallCrmLoading = true;
      $timeout(function () {
        console.log("timeout");
        $scope.showSmallCrmLoading = false;
        /*  hmsPopup.showPopup("识别失败，请重新尝试！");*/
      }, 5000);
      cordova.plugins.pluginIflytek.stopRecorderRecognize(
        function (msg) {
          hmsPopup.hideLoading();
          $scope.showSmallCrmLoading = false;
          $('#voice-img').removeClass('big-img');
          hmsPopup.showPopup(msg);
          /*  $scope.$apply();*/
        }, function (msg) {
          $('#voice-img').removeClass('big-img');
          /* $scope.$apply();*/
          $timeout(function () {
            insertText(document.getElementById('weeklyReportDetail'), msg);
            $scope.$apply();
            $scope.showSmallCrmLoading = false;
          }, 0);
        });
    }

    function saveWeekReport() {
      var saveWeeklySuccessInit = function (result) {
        if (result.returnCode == 'S') {
          if (param.type == 'DETAIL') {
            plansService.setRefreshDataFlag(true);
          }
          $ionicHistory.goBack();
        }
        else {
          if (result.returnMsg) {
            hmsPopup.showPopup('提交周报中报错， ' + result.returnMsg);
          }
          else {
            hmsPopup.showPopup('提交周报中报错，请联系管理员！');
          }
        }
      };

      var params = {
        "summaryId": vm.weeklyDetail.summaryId,
        "beginDate": vm.weeklyDetail.beginDate,
        "endDate": vm.weeklyDetail.endDate,
        "summaryContent": vm.weeklyDetail.content
      };

      if (vm.weeklyDetail.period == "") {
        hmsPopup.showPopup("请选择日期");
      } else if (vm.weeklyDetail.content == "") {
        hmsPopup.showPopup("周报内容不能为空");
      } else {
        hmsPopup.showLoading('提交周报中');
        plansAddService.saleWeeklyAdd(saveWeeklySuccessInit, params);
      }
    }

    function fetchFromServe() {
      var success = function (result) {
        vm.showLoading = false;
        if (result.returnCode == 'S' && result.weeklys[0]) {
          vm.weeklyDetail.summaryId = result.weeklys[0].summaryId;
          vm.weeklyDetail.employee = result.weeklys[0].userId;
          vm.weeklyDetail.employeeName = result.weeklys[0].name;
          vm.weeklyDetail.endDate = result.weeklys[0].endDate;
          vm.weeklyDetail.beginDate = result.weeklys[0].beginDate;
          vm.weeklyDetail.period = formatDateInit(result.weeklys[0].beginDate, result.weeklys[0].endDate);
          vm.weeklyDetail.content = result.weeklys[0].summaryContent;
        }
        console.log('vm.weeklyDetail ' + angular.toJson(vm.weeklyDetail));
      };
      plansService.queryWeekReport(
        success,
        param.authority,
        param.params.date,
        param.params.date,
        vm.showLoading);
    }

    function fetchFromParams() {
      vm.showLoading = false;
      vm.weeklyDetail = angular.copy(param.detail);
      vm.weeklyDetail.period = formatDateInit(vm.weeklyDetail.beginDate, vm.weeklyDetail.endDate);
    }
  }
})();
