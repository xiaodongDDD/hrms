'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-list-detail', {
          url: '/carpooling-list-detail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-list-detail/carpooling-list-detail.html',
              controller: 'ListDetailCtrl'
            }
          },
          params:{
            carpoolingListDetailInfo:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('ListDetailCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsPopup',
    '$stateParams',
    'hmsHttp',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsPopup,
              $stateParams,
              hmsHttp) {
        $scope.listInfo = $stateParams.carpoolingListDetailInfo;
        $scope.joinButtonHide = false;//加入按钮隐藏
        var joinNumber = $scope.listInfo.companies.length;//参与人数
        var lockNumber = $scope.listInfo.lockSeats;//锁定人数
        var  availableSeats = $scope.listInfo.availableSeats;//空位
        $scope.sevenSeat =($scope.listInfo.carType == 7);//七人座车
          //打印人员信息，判断是否已经加入
         var joins = [];
         $scope.cp_number = [];
        angular.forEach( $scope.listInfo.companies, function (data, index, array) {
          joins.push(array[index].empNo);
          if(data.avatar == null){//设置默认头像
            if(data.genderId=="1"){
              data.avatar="build/img/myInfo/man-portrait.png";
            }else if(data.genderId=="2"){
              data.avatar="build/img/myInfo/woman-portrait.png";
            }
          }
          if( $scope.listInfo.empNo == data.empNo){
            $scope.cp_number.splice(0,0,{"empName":array[index].empName,"avatar":array[index].avatar,"empNo":data.empNo,"font":"detail-img-people-name"});
          }else{
            $scope.cp_number.push({"empName":array[index].empName,"avatar":array[index].avatar,"empNo":data.empNo,"font":"detail-img-people-name"});
          }
        });
        for(var i=0;i < lockNumber;i++){
          $scope.cp_number.push({"empName":"占位","avatar":"build/img/application/carpooling/locked seat@3x.png","font":"detail-img-people-name"});
        }
        for(var i= 0;i <availableSeats;i++ ){
          $scope.cp_number.push({"empName":"空位","avatar":"build/img/application/carpooling/seat-2@3x.png","font":"detail-img-people-name-empty"});
       }

      if(contains(joins,window.localStorage.empno )  || availableSeats<1){  //没有剩余座位或者没有空座位
        $scope.joinButtonHide = true;
      }

      //加入拼车
      $scope.joinInfo = {
        "id":$scope.listInfo.shareId
      };
      $scope.joinCapooling = function(){
          var url = baseConfig.queryPath + "/share/addShareCompany";
          hmsPopup.showLoading('请稍候');
          hmsHttp.post(url, $scope.joinInfo).success(function (result) {
            hmsPopup.hideLoading();
            if (result.status == "S") {
              $rootScope.$broadcast("RELEASE_SUCCESS");
              hmsPopup.showShortCenterToast("加入成功！");
              $ionicHistory.goBack();
            } else if (result.status == "E") {
            }
          }).error(function (error, status) {
            hmsPopup.hideLoading();
            hmsPopup.showShortCenterToast("网络连接出错");
          });
      }
      //路径地图
      var starts =  $scope.listInfo.startLat.split(",");
      var ends = $scope.listInfo.endLat.split(",");

      var depaLng  = starts[0];
      var depalat = starts[1];
      var destLng = ends[0];
      var destLat = ends[1];

      var map = new AMap.Map("allmap", {
        resizeEnable: true,
      });
      AMap.service(["AMap.Driving"], function() {
        var driving = new AMap.Driving({
          map: map,
          zoom: 13,
        });
        driving.search([depaLng,depalat], [destLng,destLat], function(status, result){});
      });




      //var map = new BMap.Map("allmap");
      //map.centerAndZoom(new BMap.Point(starts[0],starts[1]), 14);
      //var p1 = new BMap.Point(starts[0],starts[1]);
      //var p2 = new BMap.Point(ends[0],ends[1]);
      //var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
      //driving.search(p1, p2);


      //包含
      function contains(arr, obj) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      }

      $scope.chatComp = function(index){
        if( ($scope.cp_number[index].empName != "空位") && ($scope.cp_number[index].empName != "占位")){
          var emp_code = $scope.cp_number[index].empNo;
          $state.go('tab.tab-application-carpooling-employee', {employeeNumber:emp_code});
        }
      }
    }

  ]);

