'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-create', {
          url: '/carpooling-create',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-create/carpooling-create.html',
              controller: 'CarpoolingCreateCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('CarpoolingCreateCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsPopup',
    'hmsHttp',
    '$ionicPopover',
    '$ionicModal',
    '$cordovaDatePicker',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsPopup,
              hmsHttp,
              $ionicPopover,
              $ionicModal,
              $cordovaDatePicker) {

      //选择座位
      //默认四人座情况
      $scope.departureTime = "请选择";
      var feeTypes = "";
      $scope.fourSeat = true;
      $scope.carTypes = 4;
      $scope.availableSeats;
      $scope.fourSeatBg = "build/img/application/carpooling/car-B@3x.png";
      $scope.servenSeatBg = "build/img/application/carpooling/BusinessVehicle-G@3x.png";
      $scope.timePreference = "选择偏好";
      $scope.createCarSeven  = function(){
          var objbg=document.getElementById("createCarColor");
          objbg.style.transition="-webkit-transform 100ms ease-out";
          objbg.style.webkitTransform="translate(60px,0px) scale(1) translateZ(0px)";
         $scope.fourSeatBg = "build/img/application/carpooling/car-g@3x.png";
         $scope.servenSeatBg = "build/img/application/carpooling/BusinessVehicle-B@3x.png";
         $scope.fourSeat = false;
         $scope.carTypes = 7;
       }
      $scope.createCarFour = function(){
        var objbg=document.getElementById("createCarColor");
        objbg.style.transition="-webkit-transform 100ms ease-out";
        objbg.style.webkitTransform="translate(0px,0px) scale(1) translateZ(0px)";
        $scope.fourSeatBg = "build/img/application/carpooling/car-B@3x.png";
        $scope.servenSeatBg = "build/img/application/carpooling/BusinessVehicle-G@3x.png";
        $scope.fourSeat = true;
        $scope.carTypes = 4;
      }

      //费用计划选择
      $scope.point = 0;
      $scope.inputReadOnly = false;
      $scope.choose = function(cost,point){
        var costPoint = document.getElementById(cost);
        var costFree =  document.getElementById("costFree");
        var costAA =  document.getElementById("costAA");
        var costOne =  document.getElementById("costOne");
        if($scope.point == point){
           losed(costPoint);
           $scope.point = 0;
          document.getElementById("inputOther").removeAttribute("readOnly");
          feeTypes = "";
        }else{
          switch (point){
            case 1:
              clicked(costFree);
              losed(costAA);
              losed(costOne);
              $scope.point =point;
              feeTypes = "免费";
              break;
            case 2:
              losed(costFree);
              clicked(costAA);
              losed(costOne);
              $scope.point =point;
              feeTypes = "AA";
              break;
            case 3:
              losed(costFree);
              losed(costAA);
              clicked(costOne);
              $scope.point =point;
              feeTypes = "一口价";
              break;
          }
           document.getElementById("inputOther").setAttribute("readOnly",'true');
        }
      }

      function clicked(obj){
        obj.style.background = "#24559C";
        obj.style.color = "white";
        obj.style.border = " 1px solid rgb(36, 85, 156)";
      }
      function losed(obj){
        obj.style.background = "transparent";
        obj.style.color = "#9B9B9B";
        obj.style.border = " 1px solid #9B9B9B";
      }

      $scope.createInfo = {
        "empNo": window.localStorage.empno,
        "city": "上海",
        "startAddr":"上海汉得信息技术股份有限公司",
        "targetAddr": "天安门广场",
        "carType": "",
        "startLatitude":"121.156627,31.168082",
        "endLatitude":"116.397571,39.906049",
        "feeType":"",
        "departureTime": "2016-7-15 10:02:22",
        "departurePreference": "",
        "empNoList": [],
        "lockSeats":1,
        "availableSeats":"",
        "otherDesc":""
      };


       $scope.createCarpooling = function() {//调用发布接口
        console.log("插入信息：" + angular.toJson($scope.createInfo));

         //费用类型
         var fee =  document.getElementById("inputOther").value;
         var explain =  document.getElementById("inputExplain").value;
         if(feeTypes == ""){
           $scope.createInfo.feeType = fee;
         }else{
           $scope.createInfo.feeType = feeTypes;
         }
         $scope.createInfo.carType = $scope.carTypes;//车类型
         $scope.createInfo.otherDesc = explain//其他说明
         $scope.createInfo.departurePreference= $scope.timePreference;//时间偏好选择，需要判断
         $scope.createInfo.departureTime = $scope.departureTime;//出行时间
         $scope.createInfo.availableSeats =  $scope.carTypes - 2;//允许座位数

         console.log($scope.createInfo.availableSeats);


         var url = baseConfig.queryPath + "/share/info";
         hmsHttp.post(url, $scope.createInfo).success(function (result) {
             hmsPopup.hideLoading();
             console.log("result success " + angular.toJson(result));
          if (result.status == "S") {
             hmsPopup.showShortCenterToast("发布成功");
          } else if (result.status == "E") {
             hmsPopup.showShortCenterToast("发布失败");
          } else if(result.status == "N"){
            hmsPopup.showShortCenterToast(result.message);
          }
        }).error(function (error, status) {
            hmsPopup.hideLoading();
            hmsPopup.showShortCenterToast("网络连接出错");
        });
      }



      //时间选择
      $scope.selectTime = function () {
        if (ionic.Platform.isAndroid()) {
          selectTimeAndroid();
        } else {
          selectTimeIOS();
        }
      };
      function selectTimeIOS() {
        var date = new Date($scope.createInfo.departureTime).format('yyyy/MM/dd hh:mm:ss');
        selectTimeBasic(date);
      }
      function selectTimeAndroid() {
        var date = new Date($scope.createInfo.departureTime).format('MM/dd/yyyy/hh/mm/ss');
        selectTimeBasic(date);
      }
      function selectTimeBasic(date) {
        $cordovaDatePicker.show({
          date: date,
          allowOldDates: true,
          allowFutureDates: true,
          mode: 'datetime',
          titleText: '',
          okText: '确定',               //android
          cancelText: '取消',           //android
          doneButtonLabel: '确认',      // ios
          cancelButtonLabel: '取消',    //ios
          //todayText: '此时',            //android
          //nowText: '现在',              //android
          //is24Hour: true,              //android
          androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT, // android： 3
          popoverArrowDirection: 'UP',
          locale: 'zh_cn'
        }).then(function (returnDate) {
          var time = returnDate.format("yyyy-MM-dd hh:mm:ss"); //__getFormatTime(returnDate);
          $scope.departureTime = time;
          if (!$scope.$$phrese) {
            $scope.$apply();
          }
        });
      };









      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };
      //时间偏好选择
      $scope.choosePerferences = function(index){
        $scope.timePreference = index;
        $scope.modal.hide();
      }
      $scope.perferences = ["准时出发","不要迟到","稍等十分钟之内"];
      $ionicModal.fromTemplateUrl('build/pages/application/carpooling/modal/carpooling-preference.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
    }
  ]);

