/**
 * Created by wolf on 2016/6/12.
 * @author:wen.dai@hand-china.com
 */

'use strict';

/**
 * 打印--console--level
 */
var log = console.log.bind(console);
var warn = console.warn.bind(console);
var error = console.error.bind(console);

//格式化json
function jsonFormat(newParam) {
  var Json = angular.toJson(newParam, true);
  return Json;
};

//获取当前的年月日 日期
function getCurrentDate(now) {
  //eg:获取当前日期 xxxxxxxx(format)
  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日
  month = (month < 10 ? "0" + month : month);
  day = (day < 10 ? "0" + day : day);
  var myCurrentDate = (year.toString() + month.toString() + day.toString());
  return myCurrentDate;
};

//获取上个月的月末
function getLastMonthDate(now) {
  //eg:获取当前日期 xxxxxxxx(format)
  var year = now.getFullYear();       //年
  var month = now.getMonth();     //月
  var newDate = new Date(year, month, 1);
  var day = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate(); //日
  month = (month < 10 ? "0" + month : month);
  day = (day < 10 ? "0" + day : day);
  var myLastMonthDate = (year.toString() + month.toString() + day.toString());
  return myLastMonthDate;
};

//获取当前月的月末
function getCurrentMonthLastDate(now) {
  //eg:获取当前日期 xxxxxxxx(format)
  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var newDate = new Date(year, month, 1);
  var day = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate(); //日
  month = (month < 10 ? "0" + month : month);
  day = (day < 10 ? "0" + day : day);
  var myCurrentMonthLastDate = (year.toString() + month.toString() + day.toString());
  return myCurrentMonthLastDate;
};

//获取月和日
function getMonthDay(newDate) {
  var newMonthDay = newDate.substring(4,6) + "月" + newDate.substring(6,8) + "日";
  return newMonthDay;
};

/**
 ​ *  下面是去重的3个写法
 ​ *  @1：最常规
 ​ *  @2：思路好，但是性能差点
 ​ *  @3：更好的
 ​ */

//@1:
function unique_normal(arr) {
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (ret.indexOf(item) === -1) {
      ret.push(item);
    }
  }
  return ret;
};

//@2:
var indexOf = [].indexOf ?
  function (arr, item) {
    return arr.indexOf(item);
  } :
  function indexOf(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        return i;
      }
    }
    return -1;
  };

function unique(arr) {
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (indexOf(ret, item) === -1) {
      ret.push(item);
    }
  }
  return ret;
};

//@3: 支持数组子条目为对象的去重
function unique_better(arr, newitem) {
  var ret = [];
  var hash = {};
  for (var i = 0; i < arr.length; i++) {
    if (typeof(arr[i]) == 'object') {
      var item = arr[i][newitem];
    } else {
      var item = arr[i];
    }
    var item1 = arr[i]
    var key = typeof(item) + item;
    if (hash[key] !== 1) {
      ret.push(item1);
      hash[key] = 1;
    }
  }
  return ret;
};




