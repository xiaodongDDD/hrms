'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-history-detail', {
          url: '/carpooling-history-detail',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/carpooling/carpooling-history-detail/carpooling-history-detail.html',
              controller: 'HistoryDetailCtrl'
            }
          },
          params:{
            carpoolingHistoryDetailInfo:''
          }
        })
        .state('tab.tab-application-carpooling-employee', {
          url: '/tab-application-carpooling-employee',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contact/detail/employee-detail.html',
              controller: 'contactEmployeeDetailCtl'
            }
          },
          params: {
            'employeeNumber': ""
          }
        })

    }]);
angular.module('applicationModule')
  .controller('HistoryDetailCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsPopup',
    '$stateParams',
    'hmsHttp',
    '$rootScope',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsPopup,
              $stateParams,
              hmsHttp,
              $rootScope) {
          $scope.historyInfo = $stateParams.carpoolingHistoryDetailInfo;
          $scope.sevenSeat =($scope.historyInfo.carType == 7);
          var joinNumber = $scope.historyInfo.companies.length;//参与人数
          var lockNumber = $scope.historyInfo.lockSeats;//锁定人数
          var availableSeats = $scope.historyInfo.availableSeats;
          $scope.canOut = $scope.historyInfo.departureTime > getNowTime();

      loadSet();
      function loadSet(){
        $scope.cp_number = [];
        angular.forEach( $scope.historyInfo.companies, function (data, index, array) {
          if( $scope.historyInfo.empNo == data.empNo){//发起人
            $scope.cp_number.splice(0,0,{"empName":array[index].empName,"avatar":array[index].avatar,"empNo":data.empNo,"font":"detail-img-people-name"});
          }else {
            $scope.cp_number.push({"empName": array[index].empName,"avatar": array[index].avatar,"empNo":data.empNo,"font": "detail-img-people-name"
            });
          }
        });
        for(var i=0;i < lockNumber;i++){
          $scope.cp_number.push({"empName":"占位","avatar":"build/img/application/carpooling/locked seat@3x.png","font":"detail-img-people-name"});
        }
        for(var i= 0;i <availableSeats;i++ ){
          $scope.cp_number.push({"empName":"空位","avatar":"build/img/application/carpooling/seat-2@3x.png","font":"detail-img-people-empty"});
        }
      }
      loadMap();
      function loadMap(){
        var starts =  $scope.historyInfo.startLatitude.split(",");
        var ends = $scope.historyInfo.endLatitude.split(",");
        var depaLng  = starts[0];
        var depalat = starts[1];
        var destLng = ends[0];
        var destLat = ends[1];

        var map = new AMap.Map("allmap", {
          resizeEnable: true,
          zoom: 13,
        });
        AMap.service(["AMap.Driving"], function() {
          var driving = new AMap.Driving({
            map: map,
          });
          driving.search([depaLng,depalat], [destLng,destLat], function(status, result){});
        });
      }

      $scope.outInfo = {
        shareId: $scope.historyInfo.shareId
      }
      $scope.outCapooling = function(){//退出拼车
        var url = baseConfig.queryPath + "/share/delete";
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url, $scope.outInfo).success(function (result) {
          hmsPopup.hideLoading();
          if (result.status == "S") {
            $rootScope.$broadcast("RELEASE_SUCCESS");
            hmsPopup.showShortCenterToast("退出成功！");
            $ionicHistory.goBack();
          } else if (result.status == "N") {
            hmsPopup.showShortCenterToast("退出失败");
          }else if (result.status == "E") {
            hmsPopup.showShortCenterToast("退出失败");
          }
        }).error(function (error, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
        });
      }

      $scope.companionChat = function(index){
        if( ($scope.cp_number[index].empName != "空位") && ($scope.cp_number[index].empName != "占位")){
          var emp_code =  $scope.cp_number[index].empNo;
          $state.go('tab.tab-application-carpooling-employee', {employeeNumber:emp_code});
        }
      }

      function getNowTime() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var minutes = date.getMinutes();
        if(minutes < 10){
          minutes = "0"+minutes;
        }
        var hours = date.getHours();
        if(hours<10){
          hours = "0" + hours;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + hours + seperator2 + minutes;
        return currentdate;
      }

    }]);


