/**
 * Created by wolf on 2016/6/13. (_wen.dai_)
 */
"use strict";
//根据日期获取星期
HmsModule.filter('weekDay', function () {
  return function (data) {
    if (data == "") {
      return data;
    } else {
      var d = new Date(data);
      var day = d.getDay();
      switch (day) {
        case  0:
          data = data + "　" + "星期天";
          break;
        case  1:
          data = data + "　" + "星期一";
          break;
        case  2:
          data = data + "　" + "星期二";
          break;
        case  3:
          data = data + "　" + "星期三";
          break;
        case  4:
          data = data + "　" + "星期四";
          break;
        case  5:
          data = data + "　" + "星期五";
          break;
        case  6:
          data = data + "　" + "星期六";
          break;
      }
      return data;
    }
  }
});

HmsModule.filter('filterImg', function () {
  return function (data) {
    if (data) {
      return data;
    } else {
      data = 'build/img/application/profile@3x.png';
      return data;
    }
  }
});

