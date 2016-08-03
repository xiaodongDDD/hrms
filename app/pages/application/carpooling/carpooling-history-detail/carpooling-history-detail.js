'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-history-detail', {
          url: '/carpooling-history-detail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-history-detail/carpooling-history-detail.html',
              controller: 'HistoryDetailCtrl'
            }
          },
          params:{
            carpoolingHistoryDetailInfo:''
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
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsPopup,
              $stateParams) {
          $scope.historyInfo = $stateParams.carpoolingHistoryDetailInfo;
          $scope.sevenSeat =($scope.historyInfo.carType == 7);
          var joinNumber = $scope.historyInfo.companies.length;//参与人数
          var lockNumber = $scope.historyInfo.lockSeats;//锁定人数
          var availableSeats = $scope.historyInfo.availableSeats;



          $scope.cp_number = [];
          angular.forEach( $scope.historyInfo.companies, function (data, index, array) {
            $scope.cp_number.push({"empName":array[index].empName,"avatar":array[index].avatar,"font":"detail-img-people-name"});
          });
          for(var i=0;i < lockNumber;i++){
            $scope.cp_number.push({"empName":"锁定","avatar":"build/img/application/carpooling/locked seat@3x.png","font":"detail-img-people-name"});
          }
          for(var i= 0;i <availableSeats;i++ ){
            $scope.cp_number.push({"empName":"空位","avatar":"build/img/application/carpooling/seat-2@3x.png","font":"detail-img-people-empty"});
          }


          var starts =  $scope.historyInfo.startLatitude.split(",");
          var ends = $scope.historyInfo.endLatitude.split(",");
          var map = new BMap.Map("allmap");
          map.centerAndZoom(new BMap.Point(starts[0],starts[1]), 14);
          var p1 = new BMap.Point(starts[0],starts[1]);
          var p2 = new BMap.Point(ends[0],ends[1]);
          var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
          driving.search(p1, p2);
    }]);


