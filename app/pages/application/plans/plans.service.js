/**
 * Created by gusenlin on 2016/12/9.
 */
(function () {
  'use strict';
  angular
    .module('planModule')
    .factory('plansService', plansService);

  function plansService($filter, hmsHttp, hmsPopup, baseConfig) {

    var baseUrl = baseConfig.basePath;

    var refreshDataFlag = false;

    var service = {
      getWeekString: getWeekString,
      getWeekPeriod: getWeekPeriod,
      getDateString: getDateString,
      getDateTimeString: getDateTimeString,
      getLastDate: getLastDate,
      getDateStringByFormat: getDateStringByFormat,
      cancelPlan: cancelPlan,
      copyPlan: copyPlan,
      updatePlan: updatePlan,
      queryWeekReport: queryWeekReport,
      getPlanByDate: getPlanByDate,
      getHasPlanList: getHasPlanList,
      setRefreshDataFlag: setRefreshDataFlag,
      getRefreshDataFlag: getRefreshDataFlag,
      getMondayAndSunday: getMondayAndSunday,
      getNextMondayAndSundayByDate: getNextMondayAndSundayByDate
    };

    return service;
    ///////////////////

    function setRefreshDataFlag(flag) {
      refreshDataFlag = flag;
    }

    function getRefreshDataFlag() {
      return refreshDataFlag;
    }

    function getWeekString(date) {
      var day = date.getDay();
      var weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - (day - 1));
      var weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + (7 - day));
      return (weekStart.getMonth() + 1) + '月' + weekStart.getDate() + '日 ~ ' +
        (weekEnd.getMonth() + 1) + '月' + weekEnd.getDate() + '日';
    }

    function getWeekPeriod(date) {
      var day = date.getDay();
      var weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - (day - 1));
      var weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + (7 - day));
      return {
        "dateFrom": getDateString(weekStart),
        "dateTo": getDateString(weekEnd)
      }
    }

    function getDateString(date) {
      return $filter('date')(date, 'yyyy-MM-dd');
    }

    function getDateTimeString(date) {
      return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
    }

    function getLastDate(month) {
      var date = new Date();
      date.setDate(date.getDate() - (30 * month));
      return date;
    }

    function getDateStringByFormat(date, format) {
      return $filter('date')(date, format);
    }

    function getMondayAndSunday(date) {
      var now = new Date(date);
      var nowTime = now.getTime();
      var day = now.getDay();
      var oneDayLong = 24 * 60 * 60 * 1000;

      if(day == 0){
        day = 7;
      }

      var MondayTime = nowTime - (day - 1) * oneDayLong;
      var SundayTime = nowTime + (7 - day) * oneDayLong;

      var monday = new Date(MondayTime);
      var sunday = new Date(SundayTime);

      return {
        "monday": monday,
        "sunday": sunday,
        "mondayStr": getDateString(monday),
        "sundayStr": getDateString(sunday)
      }
    }

    function getNextMondayAndSundayByDate(now) {
      var nowTime = now.getTime();
      var day = now.getDay();
      var oneDayLong = 24 * 60 * 60 * 1000;

      var MondayTime = nowTime - (day - 1 - 7 ) * oneDayLong;
      var SundayTime = nowTime + (7 - day + 7) * oneDayLong;

      var monday = new Date(MondayTime);
      var sunday = new Date(SundayTime);

      return {
        "monday": monday,
        "sunday": sunday,
        "mondayStr": getDateString(monday),
        "sundayStr": getDateString(sunday)
      }
    }

    function getNextMondayAndSunday(date) {
      var now = new Date(date);
      return getNextMondayAndSundayByDate(now)
    }

    //取消销售计划
    function cancelPlan(success, planId) {
      var params = {
        "planId": planId
      }
      hmsHttp.post(baseUrl + 'cancel_saleplan', params).success(function (result) {
        hmsPopup.hideLoading();
        success(result);
      }).error(function (response, status) {
        hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
        hmsPopup.hideLoading();
      });
    }

    //复制销售计划
    function copyPlan(success, params) {
      hmsHttp.post(baseUrl + 'copy_saleplan', params).success(function (result) {
        hmsPopup.hideLoading();
        success(result);
      }).error(function (response, status) {
        hmsPopup.showPopup('复制下属销售计划出现异常，请联系管理员');
        hmsPopup.hideLoading();
      });
    }

    //调整销售计划
    function updatePlan(success, params) {
      hmsHttp.post(baseUrl + 'saleplan_update', params).success(function (result) {
        hmsPopup.hideLoading();
        success(result);
      }).error(function (response, status) {
        hmsPopup.showPopup('修改销售计划出现异常，请联系管理员');
        hmsPopup.hideLoading();
      });
    }

    //获取日报//"type": authority,
    function queryWeekReport(success, authority, beginDate, EndDate, showLoading, page) {
      var params = {
        "page": 1,
        "pageSize": 15,
        "type": authority,
        "beginDateFrom": beginDate,
        "beginDateTo": EndDate
      }
      hmsHttp.post(baseUrl + 'weekly_query', params).success(function (result) {
        //hmsPopup.hideLoading();
        success(result);
      }).error(function (response, status) {
        showLoading = false;
        //hmsPopup.showPopup('修改销售计划出现异常，请联系管理员');
        //hmsPopup.hideLoading();
      });
    }

    //
    function getPlanByDate(success, error, params) {
      hmsHttp.post(baseUrl + 'query_plan_list', params).success(function (result) {
        success(result);
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        error(response);
      });
    }

    //
    function getHasPlanList(success, params, planSearchIsRunning) {
      hmsHttp.post(baseUrl + 'plan_list', params).success(function (result) {
        success(result);
      }).error(function (response, status) {
        //hmsPopup.hideLoading();
        planSearchIsRunning = false;
      });
    }
  }
}());
