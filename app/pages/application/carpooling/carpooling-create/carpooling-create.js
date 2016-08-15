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
        .state('tab.carpooling-create-contactSearch', {
          url: 'contact/carpooling-create-contactSearch',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/contact/search/contact-search.html',
              controller: 'employeeSearchCtl'
            }
          }
        })
        .state('tab.carpooling-map-myChoose', {
          url: '/carpooling-map-choose',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-create/carpooling-map-choose.html',
              controller: 'mapChooseCtrl'
            }
          }
        });
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
    'commonContactService',
    'carpoolingCreateService',
    '$rootScope',
    '$timeout',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsPopup,
              hmsHttp,
              $ionicPopover,
              $ionicModal,
              $cordovaDatePicker,
              commonContactService,
              carpoolingCreateService,
              $rootScope,
              $timeout
    ) {
      //选择座位
      //默认四人座情况
      $scope.departureTime = "请选择";
      var feeTypes = "";
      $scope.fourSeat = true;
      $scope.carTypes = 4;
      $scope.lockSeatNumber = 0;//记录锁定座位数量
      $scope.contactSeatNumber = 1;//记录联系人人数
      $scope.fourSeatBg = "build/img/application/carpooling/car-B@3x.png";
      $scope.servenSeatBg = "build/img/application/carpooling/BusinessVehicle-G@3x.png";
      $scope.timePreference = "选择偏好";
      $scope.carpoolingJoin = [];
      $scope.availableSeats = $scope.carTypes - ($scope.lockSeatNumber + $scope.contactSeatNumber);
      $scope.startLng = "";
      $scope.startLat = "";
      $scope.endLng="";
      $scope.endLat="";
      $scope.start="";
      $scope.end = "";
      $scope.fetchFlag = false;
      var emp_codes = [];
      var emp_index = [];

      var empty = {
        flag: false,
        locked: false,
        empName: "空位",
        empCode:"",
        empFont: "create-name-empty",
        avatar: "build/img/application/carpooling/seat-2@3x.png",
        lock: "占位",
        lockIcon: "build/img/application/carpooling/lock@3x.png",
        lockFont: "create-locked-empty"
      };
      var locked = {
        flag: false,
        locked: true,
        empName: "已占位",
        empCode:"",
        empFont: "create-name-enjoy",
        avatar: " build/img/application/carpooling/locked seat@3x.png",
        lock: "解除",
        lockIcon: "build/img/application/carpooling/unlock@3x.png",
        lockFont: "create-locked-enjoy"
      };
      getLoginInfo();
      addSeats($scope.carTypes);//增加座位
      function addSeats(carTypes) {
        for (var i = 1; i < carTypes; i++) {
          $scope.carpoolingJoin.push(empty);
        }
      };
      function getLoginInfo() {  //获取个人信息
        var url = baseConfig.queryPath + "/staff/detail";
        var param =
        {
          "key": window.localStorage.empno,
          "page": "1",
          "pageSize": "1"
        };
        hmsHttp.post(url, param).success(function (result) {
          $scope.items = result.rows;
          if (result.success == true) {//默认图片
            if( $scope.items[0].thumbnail == null){//设置默认头像
              if( $scope.items[0].gender=="男"){
                $scope.items[0].thumbnail="build/img/myInfo/man-portrait.png";
              }else if( $scope.items[0].gender=="女"){
                $scope.items[0].thumbnail="build/img/myInfo/woman-portrait.png";
              }
            }
            var myInfo = {
              flag: true,
              locked: false,
              empCode:$scope.items[0].emp_code,
              empName: $scope.items[0].emp_name,
              empFont: "create-name-enjoy",
              avatar: $scope.items[0].thumbnail,
            };
            if ($scope.carpoolingJoin.length != 0) {
              $scope.carpoolingJoin.unshift(myInfo);
            }
          } else {
            hmsPopup.showShortCenterToast("获取信息失败");
          }
        }).error(function (error, status) {
          hmsPopup.showShortCenterToast("网络连接出错");
        });
      }
      //跳转地图选择
      $scope.goMap = function (){
        $state.go("tab.carpooling-map-myChoose");
      }


      //切换四人座七人座
      $scope.createCarSeven = function () {
        var objbg = document.getElementById("createCarColor");
        objbg.style.transition = "-webkit-transform 100ms ease-out";
        objbg.style.webkitTransform = "translate(60px,0px) scale(1) translateZ(0px)";
        $scope.fourSeatBg = "build/img/application/carpooling/car-g@3x.png";
        $scope.servenSeatBg = "build/img/application/carpooling/BusinessVehicle-B@3x.png";
        $scope.fourSeat = false;
        $scope.carTypes = 7;
        addSeats(4);
        $scope.availableSeats = $scope.carTypes - ($scope.lockSeatNumber + $scope.contactSeatNumber);
      }
      $scope.createCarFour = function () {
        var objbg = document.getElementById("createCarColor");
        objbg.style.transition = "-webkit-transform 100ms ease-out";
        objbg.style.webkitTransform = "translate(0px,0px) scale(1) translateZ(0px)";
        $scope.fourSeatBg = "build/img/application/carpooling/car-B@3x.png";
        $scope.servenSeatBg = "build/img/application/carpooling/BusinessVehicle-G@3x.png";
        $scope.fourSeat = true;
        $scope.carTypes = 4;
        $scope.carpoolingJoin.splice(4, 3);
        $scope.availableSeats = $scope.carTypes - ($scope.lockSeatNumber + $scope.contactSeatNumber);
      }


      //解锁和锁定
      $scope.goLock = function (index) {
        if (!$scope.carpoolingJoin[index].locked) {
          $scope.carpoolingJoin.splice(index, 1);
          $scope.carpoolingJoin.splice(index, 0, locked);
          $scope.lockSeatNumber++;
        } else {
          $scope.carpoolingJoin.splice(index, 1);
          $scope.carpoolingJoin.splice(index, 0, empty);
          $scope.lockSeatNumber--;
        }
        $scope.availableSeats = $scope.carTypes - ($scope.lockSeatNumber + $scope.contactSeatNumber);
      }

      //时间选择
      $scope.selectTime = function () {
        if (ionic.Platform.isAndroid()) {
          selectTimeAndroid();
        } else {
          selectTimeIOS();
        }
      };
      function selectTimeAndroid() {
        var date = new Date($scope.createInfo.departureTime).format('MM/dd/yyyy/hh/mm/ss');
        $cordovaDatePicker.show({
          date: date,
          allowOldDates: true,
          allowFutureDates: true,
          mode: 'datetime',
          titleText: '',
          okText: '确定',               //android
          cancelText: '取消',           //android
          androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT, // android： 3
          popoverArrowDirection: 'UP',
          locale: 'zh_cn'
        }).then(function (returnDate) {
          var time = returnDate.format("yyyy-MM-dd hh:mm:ss");
          $scope.departureTime = time;
          if (!$scope.$$phrese) {
            $scope.$apply();
          }
        });
      }
      function selectTimeIOS() {
        var date = new Date($scope.createInfo.departureTime).format('yyyy/MM/dd hh:mm:ss');
        $cordovaDatePicker.show({
          date: new Date(),
          allowOldDates: true,
          allowFutureDates: true,
          mode: 'date',
          titleText: '',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          popoverArrowDirection: 'UP',
          locale: 'zh_cn'
        }).then(function (returnDate) {
          var date1 = "";
          var time1 ="";
          date1 = returnDate.format("yyyy-MM-dd");
          $timeout(function(){
            $cordovaDatePicker.show({
              date: new Date(),
              allowOldDates: true,
              allowFutureDates: true,
              mode: 'time',
              titleText: '',
              doneButtonLabel: '确认',
              cancelButtonLabel: '取消',
              popoverArrowDirection: 'UP',
              locale: 'zh_cn'
            }).then(function (returnDate) {
              time1 = returnDate.format("hh:mm:ss");
              $scope.departureTime = "";
              $scope.departureTime = date1+" "+time1;
              $scope.$apply();
            });
          },400);
        });
      };


      //回调位置信息
      $rootScope.$on("SET_LOCATION", function () {
        var location = carpoolingCreateService.getLocation();
        $scope.startLng = location.startLng;
        $scope.startLat = location.startLat;
        $scope.endLng=location.endLng;
        $scope.endLat=location.endLat;
        $scope.start=location.start;
        $scope.end = location.end;
        document.getElementById("create-departure").value =  $scope.start;
        document.getElementById("create-destination").value =  $scope.end;
      });


      //添加通讯录人员
      $scope.addContact = function () {
        if($scope.availableSeats > 0 ){//如果通讯录人员未满的话
          commonContactService.setGoContactFlg('carpooling-new-contactSearch');
          $state.go("tab.carpooling-create-contactSearch");
        }else{
          hmsPopup.showShortCenterToast("座位已满");
        }
      }
      $rootScope.$on("SEND_EMP_INFO", function () {
        emp_index = [];
        emp_codes = [];
        var contact = commonContactService.getEmpInfo();
        angular.forEach($scope.carpoolingJoin, function(data,index,array){
          emp_codes.push(data.empCode);
          //获取空位索引先
          if (data.locked || data.flag) {
          }else{
            emp_index.push(index);//记录空位的索引
          }
        });
        if(contact.avatar == "") {
          if (contact.gender == "男") {
            contact.avatar = "build/img/myInfo/man-portrait.png";
          } else if (contact.gender == "女") {
            contact.avatar = "build/img/myInfo/woman-portrait.png";
          }
        }
        var obj = {
          flag: true,
          locked: false,
          empCode:contact.emp_code,
          empName: contact.emp_name,
          empFont: "create-name-enjoy",
          avatar: contact.avatar,
        };
        if(!contains(emp_codes,contact.emp_code)){//如果不在索引才能加入
          $scope.carpoolingJoin.splice( emp_index[0],1);
          $scope.carpoolingJoin.splice( emp_index[0],0,obj);
          $scope.contactSeatNumber++;
          $scope.availableSeats = $scope.carTypes - ($scope.lockSeatNumber + $scope.contactSeatNumber);
        }else{
          hmsPopup.showShortCenterToast("选择的乘客已经加入拼车");
        }
      });

      //删除通讯录人员
      $scope.deleteContact = function(index){
        $scope.contactSeatNumber--;
        $scope.availableSeats = $scope.carTypes - ($scope.lockSeatNumber + $scope.contactSeatNumber);
        $scope.carpoolingJoin.splice( index,1);
        $scope.carpoolingJoin.splice( index,0,empty);
      }

      //时间偏好选择
      $scope.choosePerferences = function (index) {
        $scope.timePreference = index;
        $scope.modal.hide();
      }
      $scope.perferences = ["准时出发", "不要迟到", "稍等十分钟之内"];
      $ionicModal.fromTemplateUrl('build/pages/application/carpooling/modal/carpooling-preference.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      //费用计划选择
      $scope.point = 0;
      $scope.inputReadOnly = false;
      $scope.choose = function (cost, point) {
        var costPoint = document.getElementById(cost);
        var costFree = document.getElementById("costFree");
        var costAA = document.getElementById("costAA");
        var costOne = document.getElementById("costOne");
        if ($scope.point == point) {
          losed(costPoint);
          $scope.point = 0;
          document.getElementById("inputOther").removeAttribute("readOnly");
          feeTypes = "";
        } else {
          switch (point) {
            case 1:
              clicked(costFree);
              losed(costAA);
              losed(costOne);
              $scope.point = point;
              document.getElementById("inputOther").value = "";
              feeTypes = "免费";
              break;
            case 2:
              losed(costFree);
              clicked(costAA);
              losed(costOne);
              $scope.point = point;
              document.getElementById("inputOther").value = "";
              feeTypes = "AA";
              break;
            case 3:
              losed(costFree);
              losed(costAA);
              clicked(costOne);
              $scope.point = point;
              document.getElementById("inputOther").value = "";
              feeTypes = "一口价";
              break;
          }
          document.getElementById("inputOther").setAttribute("readOnly", 'true');
        }
      }
      function clicked(obj) {
        obj.style.background = "#24559C";
        obj.style.color = "white";
        obj.style.border = " 1px solid rgb(36, 85, 156)";
      }
      function losed(obj) {
        obj.style.background = "transparent";
        obj.style.color = "#9B9B9B";
        obj.style.border = " 1px solid #9B9B9B";
      }
      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };
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
      //exchange
      $scope.exchange = function(){
        var departure = document.getElementById("create-departure").value;
        var destination = document.getElementById("create-destination").value;
        document.getElementById("create-departure").value = destination;
        document.getElementById("create-destination").value = departure;
        exchangeStartEnd();
      }
      function exchangeStartEnd(){
        $scope.start = [$scope.end,$scope.end=$scope.start][0];
        $scope.startLat = [$scope.endLat,$scope.endLat=$scope.startLat][0];
        $scope.startLng = [$scope.endLng,$scope.endLng=$scope.startLng][0];
      }

      //发布
      $scope.createInfo = {
        "empNo": window.localStorage.empno,
        "city": "上海",
        "startAddr": "",
        "targetAddr": "",
        "carType": "",
        "startLatitude": "",
        "endLatitude": "",
        "feeType": "",
        "departureTime": "2016-8-3 10:02:22",
        "departurePreference": "",
        "empNoList": [],
        "lockSeats": "",
        "availableSeats": "",
        "otherDesc": ""
      };
      $scope.createCarpooling = function () {
        var fee = document.getElementById("inputOther").value;
        var explain = document.getElementById("inputExplain").value;
        if (feeTypes == "") {
          $scope.createInfo.feeType = fee;
        } else {
          $scope.createInfo.feeType = feeTypes;
        }
        $scope.createInfo.carType = $scope.carTypes;//车类型
        $scope.createInfo.otherDesc = explain//其他说明
        $scope.createInfo.departurePreference = $scope.timePreference;//时间偏好选择，需要判断
        $scope.createInfo.departureTime = $scope.departureTime;//出行时间
        $scope.createInfo.empNoList = [];
        angular.forEach($scope.carpoolingJoin, function(data,index,array){  //加入座位列表
          if(data.empCode != ""){
            if(data.empCode != window.localStorage.empno){//创建人不加入列表
              $scope.createInfo.empNoList.push(data.empCode);
            }
          }
        });
        $scope.createInfo.availableSeats = $scope.availableSeats;//允许座位数量
        $scope.createInfo.lockSeats  =   $scope.lockSeatNumber;//锁定座位数
        $scope.createInfo.startAddr = $scope.start ;
        $scope.createInfo.targetAddr= $scope.end;
        $scope.createInfo.startLatitude = $scope.startLng+","+$scope.startLat;
        $scope.createInfo.endLatitude = $scope.endLng+","+$scope.endLat;
        if( ($scope.createInfo.startAddr != "") && ($scope.createInfo.endAddr != "") ){
          if($scope.createInfo.departureTime != "请选择"){
            if($scope.createInfo.departurePreference != "选择偏好"){
              if( $scope.createInfo.feeType!=""){
                if($scope.createInfo.startLat != ""){
                  if($scope.createInfo.endLat != ""){
                    $scope.fetchFlag = true;
                  }else{
                    hmsPopup.showShortCenterToast("终点错误，请重新输入");
                  }
                }else{
                  hmsPopup.showShortCenterToast("出发点错误，请重新输入");
                }
              }else{
                hmsPopup.showShortCenterToast("费用类型错误，请重新输入");
              }
            }else{
              hmsPopup.showShortCenterToast("请输入时间偏好");
            }
          }else{
            hmsPopup.showShortCenterToast("请输入出发时间");
          }
        }else{
          hmsPopup.showShortCenterToast("请输入出发点和终点");
        }


        console.log($scope.createInfo);
        var url = baseConfig.queryPath + "/share/info";
        if($scope.fetchFlag){
          hmsHttp.post(url, $scope.createInfo).success(function (result) {
            hmsPopup.hideLoading();
            console.log("result success " + angular.toJson(result));
            if (result.status == "S") {
              hmsPopup.showShortCenterToast("发布成功");
              commonContactService.setGoContactFlg("");
              for (var i = 0; i < $scope.$parent.tabs.length; i++) {
                $scope.$parent.tabs[i].isActive = false;
              }
              $scope.$parent.tabs[0].isActive = true;
            } else if (result.status == "E") {
              hmsPopup.showShortCenterToast("发布失败");
            } else if (result.status == "N") {
              //hmsPopup.showShortCenterToast(result.message);
            }
          }).error(function (error, status) {
            hmsPopup.hideLoading();
            hmsPopup.showShortCenterToast("网络连接出错");
          });
        }
      }
    }
  ]);

