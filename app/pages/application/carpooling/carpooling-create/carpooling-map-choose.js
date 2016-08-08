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
    function ($rootScope,$scope,hmsHttp,hmsPopup,$ionicHistory,carpoolingCreateService) {
      $scope.$on('$ionicView.enter', function () {
      });
      $scope.items= [];
      $scope.exchangeFlag = false;
      $scope.departureFlag = false;
      $scope.destinationFlag = false;
      $scope.startLng = "";
      $scope.startLat = "";
      $scope.endLng="";
      $scope.endLat="";
      $scope.start="";
      $scope.end = "";

      $scope.search = function(index){
        var location = "";
        $scope.items = [];
        if(index === 1){
          $scope.departureFlag = true;
          $scope.destinationFlag = false;
          location = G("input-departure").value;
        }else{
          $scope.departureFlag = false;
          $scope.destinationFlag = true;
          location = G("input-destination").value;
        }
        var url ="http://map.baidu.com/su?wd="+location+"&callback=BMap._rd._cbk87748&cid=1&type=0&t=1470061417463";
        hmsHttp.get(url).success(function (result) {
          var inSta = result.indexOf("{");
          var inEnd =  result.indexOf("}")+1;
          var datas =  JSON.parse( result.slice(inSta,inEnd)).s;
          angular.forEach(datas,function(data,index,array){
            var objs =  data.replace("$$","").split("$");
            var obj = objs[0]+objs[1];
            $scope.items.push(obj);
          });
        });
      }
      //选中
      $scope.setMyPlace = function(index,addr){//点击
        $scope.departureFlag = false;
        $scope.destinationFlag = false;
        if(index == 1){
          $scope.start=addr;
          G("input-departure").value = addr;
          searchByStationName(addr);
        }else{
          $scope.end=addr;
          G("input-destination").value = addr;
          if(($scope.start!="") &&($scope.startLng!="")){
            pathPlan($scope.start,$scope.end,$scope.startLng, $scope.startLat);
          }else{
            G("input-destination").value="";
            hmsPopup.showShortCenterToast("轻点不正确");
          }
        }
      }

      //exchange
      $scope.exchange = function(){
        var departure =G("input-departure").value;
        var destination =  G("input-destination").value;
        G("input-departure").value = destination;
        G("input-destination").value = departure;

        if(($scope.start!="")&&($scope.end!="")){
          if(!$scope.exchangeFlag){
            pathPlan($scope.end,$scope.start,$scope.startLng,$scope.startLat);
            $scope.exchangeFlag = true;
            exchangeStartEnd();
          }else{
            pathPlan($scope.start,$scope.end,$scope.startLng,$scope.startLat);
            $scope.exchangeFlag = false;
            exchangeStartEnd();
          }
        }
      }
      //地图模块
      function G(id) {
        return document.getElementById(id);
      }
      var map = new BMap.Map("l-map");
      map.centerAndZoom("上海",12);
      map.enableScrollWheelZoom();
      map.enableContinuousZoom();
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.OverviewMapControl());
      var localSearch = new BMap.LocalSearch(map);
      localSearch.enableAutoViewport();



      //起点：在地图中显示这个点
      function searchByStationName(addr) {
        map.clearOverlays();
        var keyword = addr;
        localSearch.setSearchCompleteCallback(function (searchResult) {
          var poi = searchResult.getPoi(0);
          map.centerAndZoom(poi.point, 16);
          $scope.startLng = poi.point.lng;
          $scope.startLat = poi.point.lat;
          var marker = new BMap.Marker(poi.point);
          map.addOverlay(marker);
        });
        localSearch.search(keyword);
      }

    //终点：在地图中显示路径
    function pathPlan(start,end,lng,lat){   //终点显示路径
      map.centerAndZoom(new BMap.Point(lng, lat), 11);
      //先记录经纬度
      localSearch.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0);
        $scope.endLng = poi.point.lng;
        $scope.endLat = poi.point.lat;
      });
      localSearch.search(end);
        map.clearOverlays();
        search(start,end,BMAP_DRIVING_POLICY_LEAST_DISTANCE);
        function search(start,end,route){
          var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: route});
          driving.search(start,end);
        }
    }

    //myCallback
      $scope.myCallback = function(){
        if(($scope.start!="")&&($scope.end!="")){
          $scope.createLocation={
            startLng:$scope.startLng,
            startLat:$scope.startLat,
            endLng:  $scope.endLng,
            endLat:  $scope.endLat,
            start:   $scope.start,
            end:     $scope.end
          }
          console.debug($scope.createLocation);
          carpoolingCreateService.setLocation($scope.createLocation);
          $rootScope.$broadcast("SET_LOCATION");
          $ionicHistory.goBack();
        }
        //else{
        //  hmsPopup.showShortCenterToast("起点或者终点没有填写");
        //}
      }


      //交换起点和终点
      function exchangeStartEnd(){
        $scope.start = [$scope.end,$scope.end=$scope.start][0];
        $scope.startLat = [$scope.endLat,$scope.endLat=$scope.startLat][0];
        $scope.startLng = [$scope.endLng,$scope.endLng=$scope.startLng][0];
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
      }
    }
    }]);
