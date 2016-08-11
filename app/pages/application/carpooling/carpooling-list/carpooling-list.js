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
      $scope.fetchServerFlag = true;//加载logo
      var curPage = 1;
      $scope.moreDataCanBeLoaded = true;
      $scope.items= [];
      $scope.map = "";
      $scope.filterTime="2016-08-09 17:00";
      $scope.startTime=getNowTime();
      $scope.endTime=getNowTime();

      searchCarpoolingList();
      function searchCarpoolingList(promptText) {
        var  param = {"page": curPage, "pageSize": "5"};
        if(promptText == null){
          $scope.promptText="还没有人拼车";
        }else{
          $scope.promptText=promptText;
        }

        $scope.item = [];

        var url = baseConfig.queryPath + "/share/filtrateinfo";
          hmsHttp.post(url, param).success(function (result) {
              $scope.item = result.returnData;
              if( $scope.item.length > 0){
                $scope.noData=false;
                angular.forEach($scope.item, function(data, index, array){
                  $scope.items.push(array[index]);
                  if (array[index].shareStatus == 'wait') {
                    array[index].perferenceColor = false;
                    array[index].status = "等待成行";
                  } else  {
                    array[index].statusColor=true;
                    array[index].status = "已成行";
                  }
                });
              }else{
                if($scope.items.length == 0){
                  $scope.noData=true;
                }
              }
              if($scope.item.length == 0){
                  $scope.moreDataCanBeLoaded=false;
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
            })
            .error(function (error, status) {
              hmsPopup.showShortCenterToast("网络连接出错");
            })
            .finally(function(){
              $scope.fetchServerFlag = false;
            });
      };

      $scope.loadMore = function() {//上拉加载
        curPage++;
        searchCarpoolingList();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };


      $scope.doRefresh = function(){
        $scope.items = [];
        curPage = 1;
        $scope.moreDataCanBeLoaded= true;
        searchCarpoolingList();
        $scope.$broadcast('scroll.refreshComplete');
      }


      $scope.goBack=function(){
        $ionicHistory.goBack();
      };


      $rootScope.$on("RELEASE_SUCCESS", function () {
        $scope.items = [];
        curPage = 1;
        $scope.moreDataCanBeLoaded = true;
        searchCarpoolingList();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.moreDataCanBeLoaded = true;
      });


      //跳转到拼车界面
      $scope.viewListDetail = function (num) {//跳转到拼车详情界面
        var info=$scope.items[num];
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
            $scope.startTime = time;
          }else{
            $scope.endTime = time;
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
                $scope.startTime = "";
                $scope.startTime = date1+" "+time1;
              }else{
                $scope.endTime = "";
                $scope.endTime = date1+" "+time1;
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
        var seats = document.getElementById("seats").value;
        var param = {
          city:"上海",
          departureTimeTo:$scope.startTime,
          endTime:$scope.startTime,
          "startAddr": $scope.start,
          "targetAddr":$scope.end,
          "availableSeats":seats,
          "page":"1",
          "pageSize":"5",
        };

        if ((seats=="")||((seats < 8) && (seats >= 0))) {
          $scope.items = [];
          searchCarpoolingList("没有符合条件的拼车信息");
          $scope.popover.hide();
        }else {
          hmsPopup.showShortCenterToast("请输入正确的座位数");
        }
      }
      //获取当前时间
        function getNowTime() {
          var date = new Date();
          var seperator1 = "-";
          var seperator2 = ":";
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes();
          return currentdate;
        }
      //搜索
      $scope.goSearch = function(){
        $state.go('tab.carpoolingSearch');
      }
    }]);


