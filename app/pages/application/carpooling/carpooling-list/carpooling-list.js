'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-list', {
          url: '/carpooling-list',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-list/carpooling-list.html',
              controller: 'CarpoolingListCtrl'
            }
          }
        });
    }]);

angular.module('applicationModule')
  .controller('CarpoolingListCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicPopover',
    '$timeout',
    '$ionicScrollDelegate',
    'hmsHttp',
    "hmsPopup",
    "$cordovaDatePicker",
    function (
              $rootScope,
              $scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicPopover,
              $timeout,
              $ionicScrollDelegate,
              hmsHttp,
              hmsPopup,
              $cordovaDatePicker
    ) {
      $scope.showSearchTop = false;//顶部搜索框
      $scope.listLoading = true;//加载logo
      var curPage = 1;
      $scope.showInfinite = false;//上拉加载
      $scope.map = "";
      $scope.filterTime=getNowTime(true);
      $scope.startTimeText=getNowTime(true);
      $scope.endTimeText=getNowTime(false);
      $scope.resultList = [];
      $scope.status = "list";//判断是否在筛选状态
      var filterPage = 1;




      searchCarpoolingList("list","init","还没有人拼车");
      /*
       1.status:list,filter
       2.moreFlag:init(init,doRefresh),loadMore
       3.promtext:showNoData时展示的文字
       */

      function searchCarpoolingList(status,moreFlag,promtext) {
        $scope.promptText = promtext;
        var param;
        if(status == "filter"){//是否筛选状态
          if (moreFlag == 'init') {
            filterPage = 1;
          }
          param = {
             city:"上海",
            "departureTime":$scope.startTimeText+":00",
            "endTime":$scope.endTimeText+":00",
            "startAddr": $scope.start,
            "targetAddr":$scope.end,
            "availableSeats":$scope.seats,
            "page":filterPage,
            "pageSize":5,
          };
        }else {
          param = {"page": curPage, "pageSize": 5};
          if (moreFlag == 'init') {
            curPage = 1;
          }
        }


        var url = baseConfig.queryPath + "/share/filtrateinfo";

        hmsHttp.post(url, param).success(function (response) {
          $scope.listLoading = false;
          if (response.total == 0) {//没有数据
            $scope.showInfinite = false;
            if (moreFlag == 'loadMore') {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {//init
              $scope.showNoData = true;
              $scope.promText = promtext;
              $scope.resultList = [];
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {//total>0
             $scope.showNoData=false;
            if (response.total < 5) {
              $scope.showInfinite = false;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if (moreFlag == 'init' || $scope.page == 1) { //初始化，或者在第一页没满
                $scope.resultList = [];
                angular.forEach(response.returnData, function (data, index) {
                      if (data.shareStatus == 'wait') {
                        data.perferenceColor = false;
                        data.status = "等待成行";
                      } else  {
                        data.statusColor=true;
                        data.status = "已成行";
                      }
                  $scope.resultList.push(data);
                });
              }
            } else {
              angular.forEach(response.returnData, function (data, index) {
                if (data.departurePreference== '准时出发') {
                  data.departurePreferenceColor = "on-time-color";
                } else  if(data.departurePreference=="不要迟到"){
                  data.departurePreferenceColor = "no-delay-color";
                }else{
                  data.departurePreferenceColor = "permit-delay-color";
                }
                $scope.resultList.push(data);
              });
            }
            $scope.showInfinite = true;
          }
        }).error(function (error) {
          $scope.listLoading = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.loadMore = function() {//上拉加载
        if($scope.status == "filter"){
          filterPage++;
          searchCarpoolingList("filter","loadMore","");
        }else{
          curPage++;
          searchCarpoolingList("list","loadMore","");
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };


      $scope.doRefresh = function(){
        $scope.resultList = [];
        curPage = 1;
        searchCarpoolingList("list","init","还没有人拼车");
        $scope.$broadcast('scroll.refreshComplete');
        $scope.status = "list";
        //$timeout(function(){
        //  $scope.moreDataCanBeLoaded= true;
        //},1000);
      }


      $scope.goBack=function(){
        $ionicHistory.goBack();
      };


      $rootScope.$on("RELEASE_SUCCESS", function () {
        $scope.resultList = [];
        curPage = 1;
        searchCarpoolingList("list","init","还没有拼车数据");
        $scope.$broadcast('scroll.refreshComplete');
      });


      //跳转到拼车界面
      $scope.viewListDetail = function (num) {//跳转到拼车详情界面
        var info=$scope.resultList[num];
        var hasJoinedSeats = parseInt(info.carType)- info.availableSeats//已经参与拼车人数
        var param={
          companies:info.companies,//同行
          startAddr:info.startAddr,//起点
          targetAddr:info.targetAddr,//终点
          departureTime:info.departureTime,//出发时间
          departurePreference:info.departurePreference,//出行偏好
          lockSeats:info.lockSeats,//成行人数
          carType:info.carType,//车类型
          feeType:info.feeType,//费用计划
          hasJoinedSeats:hasJoinedSeats,//已经成行人数
          availableSeats:info.availableSeats,//空位
          shareId:info.id,//拼车主键
          startLat:info.startLatitude,//起点经纬度
          endLat:info.endLatitude,//终点经纬度
          empNo:info.empNo//拼车发起人
        };
        $state.go("tab.carpooling-list-detail",{
          'carpoolingListDetailInfo':param
        });
      };




      //上滑
      $scope.watchTopScroll = function () {
        var  position = $ionicScrollDelegate.$getByHandle('watchTopScroll').getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 45) {
            $scope.showSearchTop = false;
          } else if (position >= 45) {
            $scope.showSearchTop = true;
          }
        });
      };


      //弹出筛选框
      $ionicPopover.fromTemplateUrl("build/pages/application/carpooling/popover/carpooling-filter-popover.html", {
        scope: $scope
      }).then(function(popover){
          $scope.popover = popover;
        })
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      $scope.$on("$destroy", function() {
        $scope.popover.remove();
      });
      $scope.$on("popover.hidden", function() {
      });
      $scope.$on("popover.removed", function() {
      });




      //时间选择模块
      $scope.popoverChooseTime = function (index) {
       var index = index;
        if (ionic.Platform.isAndroid()) {
          selectTimeAndroid(index);
        } else {
          selectTimeIOS(index);
        }
      };
      function selectTimeAndroid(index) {
        var date = new Date($scope.filterTime).format('MM/dd/yyyy/hh/mm/ss');
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
          if(index == "1"){
            $scope.startTimeText = timeText(time);
          }else{
            $scope.endTimeText = timeText(time);
          }
          if (!$scope.$$phrese) {
            $scope.$apply();
          }
        });
      }
      function selectTimeIOS(index) {
        var date = new Date($scope.filterTime).format('yyyy/MM/dd hh:mm:ss');
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
              if(index == "1"){
                var time2 = date1+" "+time1;
                $scope.startTimeText = timeText(time2);
              }else{
                var time2 = date1+" "+time1;
                $scope.endTimeText = timeText(time2);
              }
              $scope.$apply();
            });
          },400);
        });
      };



      //exchange
      $scope.exchange = function(){
        $scope.start = document.getElementById("departure").value;
        $scope.end = document.getElementById("destination").value;
        document.getElementById("departure").value =  $scope.end;
        document.getElementById("destination").value = $scope.start;
        $scope.start = [$scope.end,$scope.end=$scope.start][0];
      }



      //发送请求
      $scope.filter=function() {
        $scope.status = "filter";
        $scope.seats = document.getElementById("seats").value;
        if (($scope.seats=="")||(($scope.seats < 8) && ($scope.seats >= 0))) {
          $scope.resultList = [];
          searchCarpoolingList("filter","init","没有符合条件的拼车信息");
          $scope.popover.hide();
        }else {
          hmsPopup.showShortCenterToast("请输入正确的座位数");
        }
      }


      //获取当前时间
        function getNowTime(flag) {
          var date = new Date();
          var seperator1 = "-";
          var seperator2 = ":";
          var month = date.getMonth() + 1;
          var  strDate;
          var minutes="";
          var hours="";

          if(flag){
            minutes = date.getMinutes();
            hours = date.getHours();
            strDate = date.getDate();
          }else{
            minutes = 0;
            hours = 0;
            strDate = date.getDate()+1;
          }


          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }

          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }

          if(minutes < 10){
            minutes = "0"+minutes;
          }
          if(hours<10){
            hours = "0" + hours;
          }
          var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes;
          return currentdate;
        }

      //搜索
      $scope.goSearch = function(){
        $state.go('tab.carpoolingSearch');
      }
      //去除秒
      function timeText(time){
        var index = time.lastIndexOf(":");
        return time.substring(0,index);
      }
      function G(id){
        return  document.getElementById(id).value;
      }
    }]);


