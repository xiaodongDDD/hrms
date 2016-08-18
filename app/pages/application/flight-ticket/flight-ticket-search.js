/**
 * Created by LeonChan on 2016/8/15.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flight-ticket-search', {
          url: '/flight-ticket-search',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flight-ticket/flight-ticket-search.html',
              controller: 'FlightTicketSearchCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('FlightTicketSearchCtrl', [
    '$scope',
    '$ionicHistory',
    '$http',
    function($scope,
             $ionicHistory,
             $http){
        $scope.colorVariable={
          color:"#24559c"
        };
        $scope.fontVariable={
          color:"#4a4a4a"
        };
        $scope.weatherInfo={
          cityName:"南宁",
          weatherName:"获取中",
          temperature:"获取中",
          backUrl:"build/img/application/flight-ticket/bg-cloud.png",
          iconUrl:"build/img/application/flight-ticket/cloudy.png"
        };
        $scope.buttonTabs=[true,false];
        var cityName=$scope.weatherInfo.cityName;
        var url="http://op.juhe.cn/onebox/weather/query?cityname="+cityName+"&key=33b41a19cc6c1d3ef68ca1a629546d4e";
        $http.post(url)//获取上海当天天气
        .success(function(result){
          var currentWeather = result.result.data.realtime.weather.info;
          var currentTemperature = result.result.data.realtime.weather.temperature;
            console.log(angular.toJson(result,true));
            $scope.weatherInfo.temperature = currentTemperature;
          if(currentWeather == "晴"){
           $scope.colorVariable.color="#24559c";
           $scope.fontVariable.color="#4a4a4a";
           $scope.weatherInfo.weatherName="晴";
           $scope.weatherInfo.backUrl = "build/img/application/flight-ticket/bg-sun.png";
            $scope.weatherInfo.iconUrl = "build/img/application/flight-ticket/sunny.png";
          }else if(currentWeather == "阵雨" || currentWeather == "大雨" || currentWeather == "中雨" || currentWeather == "小雨"){
            $scope.colorVariable.color="#ffffff";
            $scope.fontVariable.color="#ffffff";
            $scope.weatherInfo.weatherName="雨";
            $scope.weatherInfo.backUrl = "build/img/application/flight-ticket/bg-rain.png";
            $scope.weatherInfo.iconUrl = "build/img/application/flight-ticket/rainy.png";
          }else if(currentWeather == "阵雪" || currentWeather == "大雪" || currentWeather == "中雪" || currentWeather == "小雪"){
            $scope.colorVariable.color="#ffffff";
            $scope.fontVariable.color="#ffffff";
            $scope.weatherInfo.weatherName="雪";
            $scope.weatherInfo.backUrl = "build/img/application/flight-ticket/bg-snow.png";
            $scope.weatherInfo.iconUrl = "build/img/application/flight-ticket/snowy.png";
          }else if(currentWeather == "多云"){
            $scope.colorVariable.color="#24559c";
            $scope.fontVariable.color="#4a4a4a";
            $scope.weatherInfo.weatherName="多云";
            $scope.weatherInfo.backUrl = "build/img/application/flight-ticket/bg-cloud.png";
            $scope.weatherInfo.iconUrl = "build/img/application/flight-ticket/cloudy.png";
          }
        }).error(function(error){

        });
     $scope.clickButtonTabs=function(num){//单程与往返间切换
       if(num == 0){
         $scope.buttonTabs[0]=true;
         $scope.buttonTabs[1]=false;
       }else if(num == 1){
         $scope.buttonTabs[0]=false;
         $scope.buttonTabs[1]=true;
       }
     }
     $scope.goBack=function(){//返回按钮
       $ionicHistory.goBack();
     };
  }]);
