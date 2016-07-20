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
 ​ *  @3：更好的  --推荐
  *  @4：更复杂，适应性更广的
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

//@4: 更高级和复杂的去重法
Array.prototype.arrUniq = function () {
  var temp, arrVal,
    array = this,
    arrClone = array.concat(),//克隆数组
    typeArr = {//数组原型
      'obj': '[object Object]',
      'fun': '[object Function]',
      'arr': '[object Array]',
      'num': '[object Number]'
    },
    ent = /(\u3000|\s|\t)*(\n)+(\u3000|\s|\t)*/gi;//空白字符正则

  //把数组中的object和function转换为字符串形式
  for (var i = arrClone.length; i--;) {
    arrVal = arrClone[i];
    temp = Object.prototype.toString.call(arrVal);

    if (temp == typeArr['num'] && arrVal.toString() == 'NaN') {
      arrClone[i] = arrVal.toString();
    }

    if (temp == typeArr['obj']) {
      arrClone[i] = JSON.stringify(arrVal);
    }

    if (temp == typeArr['fun']) {
      arrClone[i] = arrVal.toString().replace(ent, '');
    }
  }

  //去重关键步骤
  for (var i = arrClone.length; i--;) {
    arrVal = arrClone[i];
    temp = Object.prototype.toString.call(arrVal);

    if (temp == typeArr['arr']) arrVal.arrUniq();//如果数组中有数组，则递归
    if (arrClone.indexOf(arrVal) != arrClone.lastIndexOf(arrVal)) {//如果有重复的，则去重
      array.splice(i, 1);
      arrClone.splice(i, 1);
    }
    else {
      if (Object.prototype.toString.call(array[i]) != temp) {
        //检查现在数组和原始数组的值类型是否相同，如果不同则用原数组中的替换，原因是原数组经过了字符串变换
        arrClone[i] = array[i];
      }
    }
  }
  return arrClone;
};

Date.prototype.format = function(format){
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(), //day
    "h+" : this.getHours(), //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter
    "S" : this.getMilliseconds() //millisecond
  }
  if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }

  for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
  }
  return format;
};
