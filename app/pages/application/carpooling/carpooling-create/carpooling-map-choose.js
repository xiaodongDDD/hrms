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
      $scope.showLocation = false;




      //var windowsArr = [];
      //var marker = [];
      var mapObj = new AMap.Map("mapContainer", {
        resizeEnable: true,
        zoom: 10,
        keyboardEnable: false
      });

      init();//载入时判断是否有数据
      locCity();

      AMap.plugin(['AMap.Autocomplete','AMap.Driving','AMap.PlaceSearch'],function(){
        var marker = new AMap.Marker({
          map:mapObj,
          bubble:true
        });
        var driving = new AMap.Driving({
          map: mapObj,
        });
        var placeSearch = new AMap.PlaceSearch({
          city:'',
          map:mapObj
        });

        var departure = {
          city: "",
          input:"departure"
        };

        var autoOptions = {
          city: ""
        };
        autocomplete= new AMap.Autocomplete(autoOptions);

        departureComplete= new AMap.Autocomplete(departure);

        AMap.event.addListener(departureComplete, "select", function(e){
          if(e.poi.location == undefined || e.poi.location == ""){
            autocomplete.search(e.poi.name, function(status, result){
              if(result.info == "OK" && result.count > 0  && result.tips.length > 1){
                var location = result.tips[1].location;
                marker.setPosition(location);
                mapObj.setCenter(marker.getPosition());

                $scope.depaLocLng = location.lng;
                $scope.depaLocLat = location.lat;
                //$scope.departure = result.tips[1].name;
                $scope.departure = G('departure').value;
                pathPlan();
              }else{
                hmsPopup.showShortCenterToast("地址无效请重新选择");
              }
            });
          }else if(e.poi.location){
            marker.setPosition(e.poi.location);
            $scope.depaLocLng = e.poi.location.lng;
            $scope.depaLocLat = e.poi.location.lat;
            mapObj.setCenter(marker.getPosition());
            $scope.departure = e.poi.name;
            pathPlan();
          }else{
            placeSearch.search(e.poi.name)
          }
        });

        var destination = {
          city: "",
          input:"destination"
        };
        destinationComplete= new AMap.Autocomplete(destination);
        AMap.event.addListener(destinationComplete, "select", function(e){  //坑爹的API必须写两套fuck！
          if(e.poi.location == undefined || e.poi.location==""){
            autocomplete.search(e.poi.name, function(status, result){
              if(result.info == "OK" && result.count > 0  && result.tips.length > 1) {
                  var location = result.tips[1].location;
                  marker.setPosition(location);
                  mapObj.setCenter(marker.getPosition());
                  $scope.destLocLng = location.lng;
                  $scope.destLocLat = location.lat;
                  //$scope.destination = result.tips[1].name;//destination名称跟输入框
                 $scope.destination = G('destination').value;
                  pathPlan();
              }else{
                hmsPopup.showShortCenterToast("地址无效，请重新选择");
              }
            });
          }else if(e.poi.location){
            marker.setPosition(e.poi.location);
            $scope.destLocLng = e.poi.location.lng;
            $scope.destLocLat = e.poi.location.lat;
            mapObj.setCenter(marker.getPosition());
            $scope.destination = e.poi.name;
            pathPlan();
          }else{
            placeSearch.search(e.poi.name)
          }
        });

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
              pathPlan();
            } else {
              $scope.exchangeFlag = false;
              exchangeStartEnd();
              pathPlan();
            }
          }
        }

        function pathPlan(){
          if($scope.depaLocLng && $scope.depaLocLat){
            if(!($scope.destLocLng == $scope.depaLocLng && $scope.destLocLat == $scope.depaLocLat)){
              $timeout(function() {
                driving.search([$scope.depaLocLng,$scope.depaLocLat], [$scope.destLocLng,$scope.destLocLat], function(status, result){});
              },500);
            }else{
              hmsPopup.showShortCenterToast("起点与终点不可重复");
            }
          }
        }

    });

      //myCallback
      $scope.myCallback = function(){
        var departure = G("departure").value;
        var destination = G("destination").value;
        var state = true;



        if(departure == ""){//清掉输入框则清空数据
          $scope.depaLocLng = "";
          $scope.depaLocLat = "";
          $scope.departure = "";
        }else if(departure != $scope.departure){
          $scope.depaLocLng = "";
          $scope.depaLocLat = "";
          $scope.departure = "";
          hmsPopup.showShortCenterToast("请定位起点");
          state = false;
        }
        if(destination == ""){//清掉输入框则清空数据
          $scope.destLocLng = "";
          $scope.destLocLat = "";
          $scope.destination = "";
        }else if(destination != $scope.destination){
          $scope.destLocLng = "";
          $scope.destLocLat = "";
          $scope.destination = "";
          hmsPopup.showShortCenterToast("请定位终点");
          state = false;
        }
        if(state){
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
        }
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
          AMap.service(["AMap.Driving"], function() {
            var driving = new AMap.Driving({
              map: mapObj,
            });
            driving.search([$scope.depaLocLng,$scope.depaLocLat], [$scope.destLocLng,$scope.destLocLat], function(status, result){});
          });
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
      //定位城市
      function locCity(){
        if(window.localStorage && window.localStorage.searchCity){
          $scope.showLocation = true;
          $scope.cityCode = window.localStorage.locCity;
          mapObj.setCity($scope.cityCode);
        }else {
          mapObj.setCity("上海");//如果获取不到当前位置则默认为上海
        }
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
