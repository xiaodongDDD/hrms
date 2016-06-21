angular.module("applicationModule")
.factory('flaybackService', ['$ionicLoading', function ($ionicLoading) {
  var projName = "";
  var projCode = "";
  var ticketTypeList = [];
  var routeTypeList = [];
  var passengerList = [];
  var passenger = "";
  var certification = "";
  var fbLines = [];
  var pageStatusCreate = {};// var param = {"canEdit": true,"dataSource":"create"}
  function getFormatDate(date) {
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate;
  }
  return {
    getFormatDate: getFormatDate,
    getNowFormatDate: function () {
      var date = new Date();
      var seperator = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator + month + seperator + strDate;
      return currentdate;
    },
    setPageStatusCreate: function (obj) {
      pageStatusCreate = obj;
    },
    getPageStatusCreate: function (obj) {
      return pageStatusCreate;
    },
    setProjName: function (obj) {
      projName = obj;
    },
    getProjName: function (obj) {
      return projName;
    },
    setProjCode: function (obj) {
      projCode = obj;
    },
    getProjCode: function (obj) {
      return projCode;
    },
    setTicketTypeList: function (obj) {
      ticketTypeList = obj;
    },
    getTicketTypeList: function (obj) {
      return ticketTypeList;
    },
    setRouteTypeList: function (obj) {
      routeTypeList = obj;
    },
    getRouteTypeList: function (obj) {
      return routeTypeList;
    },
    setPassengerList: function (obj) {
      passengerList = obj;
    },
    getPassengerList: function (obj) {
      return passengerList;
    },
    setPassenger: function (obj) {
      passenger = obj;
    },
    getPassenger: function (obj) {
      return passenger;
    },
    setCertification: function (obj) {
      certification = obj;
    },
    getCertification: function (obj) {
      return certification;
    },
    addLine: function (obj) {
      /* var flight_date = getFormatDate(new Date(obj.flight_date));
       obj.flight_date = flight_date;*/
      fbLines.push(obj);
    },
    updateLine: function (obj, index) {
      var flight_date = getFormatDate(new Date(obj.flight_date));
      obj.flight_date = flight_date;
      fbLines[index] = obj;
    },
    getLines: function () {
      return fbLines;
    },
    setLines: function (obj) {
      fbLines = obj;
    },
    /* deleteLine: function (item) {
     //  fbLines.splice(index, 1);
     console.log("fbLines.indexOf(item) = " + fbLines.indexOf(item));
     console.log("fbLines  = " + angular.toJson(fbLines));
     console.log("item  = " + angular.toJson(item));
     fbLines.splice(fbLines.indexOf(item), 1);
     },*/
    deleteLine: function (index) {
      fbLines.splice(index, 1);
    },
    clearLines: function () {
      fbLines = [];
    }

  }

}])
;
