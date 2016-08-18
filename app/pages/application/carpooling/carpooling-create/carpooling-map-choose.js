'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-map-choose', {
          url: '/carpooling-map-choose',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-create/carpooling-map-choose.html',
              controller: 'mapChooseCtrl'
            }
          }
        })
    }]);


angular.module('applicationModule')
  .controller('mapChooseCtrl', [
    '$rootScope',
    '$scope',
    'hmsHttp',
    'hmsPopup',
    '$ionicHistory',
    'carpoolingCreateService',
    '$timeout',
    function ($rootScope,$scope,hmsHttp,hmsPopup,$ionicHistory,carpoolingCreateService,$timeout) {
      $scope.$on('$ionicView.enter', function () {
      });

      $scope.status = "";
      $scope.departure = "";
      $scope.destination = "";
      $scope.departure = "";
      $scope.depaLocLng = "";
      $scope.depaLocLat = "";
      $scope.destLocLat = "";
      $scope.destLocLng = "";
      $scope.exchangeFlag = false;


      init();//载入时判断是否有数据

      var windowsArr = [];
      //var marker = [];
      var mapObj = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: [121.473562,31.230312],
        zoom: 10,
        keyboardEnable: false
      });

      AMap.plugin(['AMap.Autocomplete','AMap.Geocoder','AMap.Driving'],function(){
        var marker = new AMap.Marker({
          map:mapObj,
          bubble:true
        });
        var driving = new AMap.Driving({
          map: mapObj,
        });

        var departure = {
          city: "",
          input:"departure"
        };
        departureComplete= new AMap.Autocomplete(departure);

        AMap.event.addListener(departureComplete, "select", function(e){
          if(e.poi.location == undefined){//提示没有经纬度不管，提示输入不合法
            //geocoder(e.poi.name);
            hmsPopup.showShortCenterToast("该地址不合法，请重新选择!");
          }else {//如果提示带着地址，直接用提示的地址
            marker.setPosition(e.poi.location);
            $scope.depaLocLng = e.poi.location.lng;
            $scope.depaLocLat = e.poi.location.lat;
            mapObj.setCenter(marker.getPosition());
            $scope.departure = e.poi.name;
            if($scope.destLocLng&&$scope.destLocLat){
              $timeout(function() {
                driving.search([$scope.depaLocLng,$scope.depaLocLat], [$scope.destLocLng,$scope.destLocLat], function(status, result){});
              },500);
            }
          }
        });

        var destination = {
          city: "",
          input:"destination"
        };
        destinationComplete= new AMap.Autocomplete(destination);
        AMap.event.addListener(destinationComplete, "select", function(e){  //坑爹的API必须写两套fuck！
          if(e.poi.location == undefined || e.poi.location==""){
            //geocoder(e.poi.name);
            hmsPopup.showShortCenterToast("该地址不合法，请重新选择!");
          }else if(e.poi.location){
            marker.setPosition(e.poi.location);
            $scope.destLocLng = e.poi.location.lng;
            $scope.destLocLat = e.poi.location.lat;
            mapObj.setCenter(marker.getPosition());
            $scope.destination = e.poi.name;
            if($scope.depaLocLng && $scope.depaLocLat){
              $timeout(function() {
                driving.search([$scope.depaLocLng,$scope.depaLocLat], [$scope.destLocLng,$scope.destLocLat], function(status, result){});
              },500);
            }
          }
        });



        //function geocoder(address){//提示值没有带经纬度
        //    var geocoder = new AMap.Geocoder({
        //      city: ""
        //    });
        //    geocoder.getLocation(address,function(status,result){
        //      if(status=='complete'&&result.geocodes.length){
        //        marker.setPosition(result.geocodes[0].location);
        //        mapObj.setCenter(marker.getPosition());
        //        if ($scope.status == "departure"){
        //          $scope.departure = e.poi.name;
        //        }else{
        //          $scope.destination = e.poi.name;
        //        }
        //      }else{
        //        hmsPopup.showShortCenterToast("无法定位该地点，请重新选择!");
        //      }
        //    })
        //}
        //init



        //exchange
        $scope.exchange = function() {
          var departure   = G("departure").value;
          var destination = G("destination").value;
          G("departure").value = destination;
          G("destination").value = departure;

          if (($scope.departure != "") && ($scope.destination != "")) {
            if (!$scope.exchangeFlag) {
              $scope.exchangeFlag = true;
              exchangeStartEnd();
              driving.search([$scope.depaLocLng,$scope.depaLocLat], [$scope.destLocLng,$scope.destLocLat], function(status, result){});
            } else {
              $scope.exchangeFlag = false;
              exchangeStartEnd();
              driving.search([$scope.depaLocLng,$scope.depaLocLat], [$scope.destLocLng,$scope.destLocLat], function(status, result){});
            }
          }
        }
    });

      //myCallback
      $scope.myCallback = function(){
        $scope.createLocation={
          startLng:$scope.depaLocLng,
          startLat:$scope.depaLocLat,
          endLng:  $scope.destLocLng,
          endLat:  $scope.destLocLat,
          start:   $scope.departure,
          end:     $scope.destination
        }
        carpoolingCreateService.setLocation($scope.createLocation);
        $rootScope.$broadcast("SET_LOCATION");
        $ionicHistory.goBack();
        //}
      }

      function init(){
        var location = carpoolingCreateService.getLocation();
        $scope.depaLocLng = location.startLng;
        $scope.depaLocLat = location.startLat;
        $scope.destLocLng=location.endLng;
        $scope.destLocLat=location.endLat;
        $scope.departure=location.start;
        $scope.destination = location.end;
        if(($scope.departure != undefined) && ($scope.destination != undefined) ){
          document.getElementById("departure").value =  $scope.departure;
          document.getElementById("destination").value =  $scope.destination;
        }else if(($scope.departure != undefined)&&($scope.destination == undefined)){
          document.getElementById("departure").value =  $scope.departure;
        }else if (($scope.destination != undefined)&&($scope.departure == undefined)){
          document.getElementById("destination").value =  $scope.destination;
        }
      }



      function G(id){
        return  document.getElementById(id);
      }
      function exchangeStartEnd(){
        $scope.depaLocLat = [$scope.destLocLat,$scope.destLocLat=$scope.depaLocLat][0];
        $scope.depaLocLng = [$scope.destLocLng,$scope.destLocLng=$scope.depaLocLng][0];
        $scope.departure = [$scope.destination,$scope.destination=$scope.departure][0];
      }

    }])
    .factory('carpoolingCreateService',[function () {
      var createLocation = {};
      return{
      getLocation:function () {
        return createLocation;
      },
      setLocation:function(location){
        createLocation = location;
      },
      clear:function(){
        createLocation = {};
      }
    }
    }]);
