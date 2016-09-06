/**
 * Created by LeonChan on 2016/8/24.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flight-passenger-list', {
          url: '/flight-passenger-list',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flight-ticket/flight-passenger-list.html',
              controller: 'FlightPassengerListCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('FlightPassengerListCtrl', [
    '$scope',
    '$ionicHistory',
    '$http',
    'hmsPopup',
    '$state',
    '$timeout',
    'hmsHttp',
    'baseConfig',
    'passengerService',
    function($scope,
             $ionicHistory,
             $http,
             hmsPopup,
             $state,
             $timeout,
             hmsHttp,
             baseConfig,
             passengerService){
      $scope.editMode = false;//编辑模式
      $scope.createMode = false;//创建模式
      $scope.showData = false;//默认有数据
      $scope.showLoading=false;//默认加载数据
      $scope.editItem=[];//编辑选项
      $scope.createItem=[];//创建选项
      //$scope.passengerList=[//乘客列表
      //  {
      //    passenger_name:"刘亦菲",
      //    passenger_gender:"female",
      //    passenger_id:"898876780129092109",
      //    passenger_passport:"CU7897"
      //  },
      //  {
      //    passenger_name:"朱丽叶",
      //    passenger_gender:"female",
      //    passenger_id:"7816289009812892",
      //    passenger_passport:"NH8719"
      //  },
      //  {
      //    passenger_name:"尚文",
      //    passenger_gender:"male",
      //    passenger_id:"890129309182987654",
      //    passenger_passport:"LK9012"
      //  }
      //];
      $scope.passengerList=[];
      $scope.passengerList=passengerService.getPassengerList().concat();//拿到受益人列表
      $scope.passengerList.splice(0,1);
      console.log(angular.toJson($scope.passengerList));
      if($scope.passengerList.length == 0){//申请列表为空
        $scope.showData = false;
      }else if($scope.passengerList.length>0){
        $scope.showData = true;
      }
      function initPassengerList(){//当编辑，删除，增加乘机人时，重新调用接口刷新数据，然后把新数据存在本地passengerService中
        $scope.showLoading=true;
        $scope.passengerList=[];
        var url=baseConfig.businessPath+"/ticket_apply_info/get_tickets_list";
        var param={
          "params":{
            p_employee_number: window.localStorage.empno,
            p_page_number:1
          }
        };
        hmsHttp.post(url,param).success(function(result){
          $scope.showLoading = false;//数据加载完成
          if(result.status == "S"){
            console.log(angular.toJson(result,true));
            var resultList = result.passengerResult.result;
            $scope.passengerList = resultList.concat();
            $scope.passengerList.splice(0,1);
            if($scope.passengerList.length==0){
              $scope.showData=false;
            }else if($scope.passengerList.length>0){
              $scope.showData=true;
            }
            passengerService.setPassengerList(resultList);
          }else if(result.status == "E"){
            hmsPopup.showVeryShortCenterToast("查询失败，乘机人查询接口异常");
          }
        }).error(function(err){
          $scope.showLoading = false;//数据加载完成
          console.log(angular.toJson(err,true));
        });
      }
      $scope.judgeMaleGender=function(param){//判断乘机人性别为男
        var result="";
        if(param == "male"){
          result=true;
        }else if(param == "female"){
          result=false;
        }
        return result;
      };
      $scope.judgeFemaleGender=function(param){//判断乘机人性别为女
        var result="";
        if(param == "male"){
          result=false;
        }else if(param == "female"){
          result=true;
        }
        return result;
      };
      $scope.judgePassengerGender=function(num){
        var param=$scope.passengerList[num].passenger_gender;
        var result="";
        if(param == "male"){
          result="男";
        }else if(param == "female"){
          result="女";
        }
        return result;
      }
      $scope.switchEditGender=function(param){//编辑模式下切换性别
        if(param == "female"){
          $scope.editItem[0].passenger_gender = "female";
        }else if(param == "male"){
          $scope.editItem[0].passenger_gender = "male";
        }
      };
      $scope.switchCreateGender=function(param){//创建模式下切换性别
        if(param == "female"){
          $scope.createItem[0].passenger_gender = "female";
        }else if(param == "male"){
          $scope.createItem[0].passenger_gender = "male";
        }
      };
      $scope.editPassenger=function(num){//编辑乘机受益人
        $scope.editMode = true;
        var chosenItem = $scope.passengerList[num];
        var param={
          passenger_name:chosenItem.passenger_name,
          passenger_gender:chosenItem.passenger_gender,
          passenger_id:chosenItem.passenger_id,
          passenger_passport:chosenItem.passenger_passport
        };
        $scope.editItem.push(param);
      };
      $scope.cannotEditId=function(){//提示乘机人身份证号不可以编辑
       hmsPopup.showVeryShortCenterToast("乘机人身份证号是不可编辑字段");
      };
      $scope.deletePassenger=function(num){//删除乘机受益人或取消编辑模式
          hmsPopup.confirm("确认删除本乘机受益人？","提示",function(){
            //在这里调用删除接口，然后在删除接口的异步中再调用initPassengerList()
            $scope.showLoading=true;
            var url=baseConfig.businessPath+"/ticket_apply_info/create_beneficiaris";
            var param={
              params:{
                p_employee_number:window.localStorage.empno,
                p_passenger_name:$scope.passengerList[num].passenger_name,
                p_passenger_id:$scope.passengerList[num].passenger_id,
                p_passenger_passport:$scope.passengerList[num].passenger_passport,
                p_passenger_gender:"",
                p_cancel_code:3
              }
            };
            if($scope.passengerList[num].passenger_gender=="male"){
              param.params.p_passenger_gender=0;
            }else if($scope.passengerList[num].passenger_gender=="female"){
              param.params.p_passenger_gender=1;
            }
            hmsHttp.post(url,param).success(function(result){
              console.log(angular.toJson(result,true));
              $scope.showLoading=false;
              hmsPopup.showLongCenterToast(result.returnMsg);
              if(result.status == "S"){
                initPassengerList();

              }else if(result.status == "E"){

              }

            }).error(function(err){
              $scope.showLoading=false;
            });
          });
      };
      $scope.cancelEdit=function(){//取消编辑模式
        $scope.editMode=false;
        $scope.editItem=[];
      };
      $scope.createPassenger=function(){//创建乘机受益人
        $scope.showData=true;
        $scope.createMode=true;
        var param={
          passenger_name:"",
          passenger_gender:"male",//默认男
          passenger_id:"",
          passenger_passport:""
        };
        $scope.createItem.push(param);
      };
      $scope.cancelCreate=function(){//取消创建
        $scope.createMode=false;
        $scope.createItem=[];
        if($scope.passengerList.length==0){
         $scope.showData=false;
        }
      };
      $scope.confirm=function(){//确认创建或者确认更改
       if($scope.editMode == true){//编辑
         var editValue =  $scope.editItem[0];
         if(editValue.passenger_name == ""){
           hmsPopup.showVeryShortCenterToast("乘机人姓名不能为空");
         }else if(editValue.passenger_id == ""){
           hmsPopup.showVeryShortCenterToast("乘机人身份证号不能为空");
         }else if(editValue.passenger_name!="" && editValue.passenger_id!=""){
           $scope.showLoading=true;
           var url=baseConfig.businessPath+"/ticket_apply_info/create_beneficiaris";
           var param={
             params:{
               p_employee_number:window.localStorage.empno,
               p_passenger_name:$scope.editItem[0].passenger_name,
               p_passenger_id:$scope.editItem[0].passenger_id,
               p_passenger_passport:$scope.editItem[0].passenger_passport,
               p_passenger_gender:"",
               p_cancel_code:2
             }
           };
           if($scope.editItem[0].passenger_gender=="male"){
             param.params.p_passenger_gender=0;
           }else if($scope.editItem[0].passenger_gender=="female"){
             param.params.p_passenger_gender=1;
           }
           hmsHttp.post(url,param).success(function(result){
             console.log(angular.toJson(result,true));
             $scope.showLoading=false;
             hmsPopup.showLongCenterToast(result.returnMsg);
             if(result.status == "S"){
               $scope.editMode=false;
               initPassengerList();
             }else if(result.status == "E"){

             }

           }).error(function(err){
             $scope.showLoading=false;
           });
           //编辑完成后自动在创建接口异步中调用initPassengerList()
         }
       }else if($scope.createMode == true){//创建
         var createValue = $scope.createItem[0];
         if(createValue.passenger_name == ""){
           hmsPopup.showVeryShortCenterToast("乘机人姓名不能为空");
         }else if(createValue.passenger_id == ""){
           hmsPopup.showVeryShortCenterToast("乘机人身份证号不能为空");
         }else if(createValue.passenger_name!="" && createValue.passenger_id!=""){//创建完成
           $scope.showLoading=true;
           var url=baseConfig.businessPath+"/ticket_apply_info/create_beneficiaris";
           var param={
             params:{
               p_employee_number:window.localStorage.empno,
               p_passenger_name:$scope.createItem[0].passenger_name,
               p_passenger_id:$scope.createItem[0].passenger_id,
               p_passenger_passport:$scope.createItem[0].passenger_passport,
               p_passenger_gender:"",
               p_cancel_code:1
             }
           };
           if($scope.createItem[0].passenger_gender=="male"){
             param.params.p_passenger_gender=0;
           }else if($scope.createItem[0].passenger_gender=="female"){
             param.params.p_passenger_gender=1;
           }
           hmsHttp.post(url,param).success(function(result){
             console.log(angular.toJson(result,true));
             $scope.showLoading=false;
             hmsPopup.showLongCenterToast(result.returnMsg);
             if(result.status == "S"){
               $scope.createMode=false;
               initPassengerList();
             }else if(result.status == "E"){

             }

           }).error(function(err){
             $scope.showLoading=false;
           });
           //创建完成后自动在创建接口异步中调用initPassengerList()
         }
       }
      };
      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };

    }]);
