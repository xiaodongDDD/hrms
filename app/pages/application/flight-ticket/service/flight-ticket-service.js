/**
 * Created by LeonChan on 2016/8/24.
 */
angular.module('HmsModule')
  .factory('passengerService',['$state',function($state){
     var passengerList="";
     return{
       setPassengerList:function(param){
          passengerList=param;
       },
       getPassengerList:function(){
          return passengerList;
       }
     }
  }])
