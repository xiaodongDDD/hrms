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
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/flight-ticket/flight-ticket-search.html',
              controller: 'FlightTicketSearchCtrl'
            }
          },
          params:{
            projectList:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('FlightTicketSearchCtrl', [
    '$scope',
    '$ionicHistory',
    '$http',
    'citiesService',
    'hmsPopup',
    '$ionicModal',
    '$timeout',
    '$ionicScrollDelegate',
    '$cordovaDatePicker',
    '$stateParams',
    'passengerService',
    'hmsHttp',
    'baseConfig',
    '$rootScope',
    function($scope,
             $ionicHistory,
             $http,
             citiesService,
             hmsPopup,
             $ionicModal,
             $timeout,
             $ionicScrollDelegate,
             $cordovaDatePicker,
             $stateParams,
             passengerService,
             hmsHttp,
             baseConfig,
             $rootScope){
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/cities-select-modal.html', {//定义省市modal
        scope: $scope
      }).then(function (modal1) {
        $scope.chooseCitiesModal = modal1;
      });
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/flight-type-select-modal.html', {//机票类型modal
        scope: $scope
      }).then(function (modal2) {
        $scope.chooseFlightTypeModal = modal2;
      });
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/project-select-modal.html', {//项目名称modal
        scope: $scope
      }).then(function (modal3) {
        $scope.chooseProjectModal = modal3;
      });
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/passenger-select-modal.html', {//乘机人选择modal
        scope: $scope
      }).then(function (modal4) {
        $scope.choosePassengerModal = modal4;
      });
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/flyback-number-select-modal.html', {//flyback选择modal
        scope: $scope
      }).then(function (modal5) {
        $scope.chooseFlybackModal = modal5;
      });
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/project-type-select-modal.html', {//项目类型选择modal
        scope: $scope
      }).then(function (modal6) {
        $scope.chooseProjectTypeModal = modal6;
      });
      $timeout(function () {//获取省份列表滚动条
        $scope.provinceScroll = $ionicScrollDelegate.$getByHandle('provinceScroll');
      }, 300);
      $scope.showLoading=false;//默认不显示loading
      $scope.citiesInfo=citiesService;//从factory中拿到中国省市信息
      $scope.citiesDetailInfo=citiesService[0].city;//默认城市信息列表为北京
      $scope.colorList=[];//记录选择省份，选择就变颜色
      $scope.flightTypeList=["项目内机票","flyback机票"];
      $scope.projectTypeList=["客户项目","预销售","内部项目"];//项目类型列表
      $scope.passengerList=passengerService.getPassengerList();//乘客列表
      $scope.flybackList=[];//flyback编号列表
      var flybackStatus="";//标志flyback获取状态的，因为flyback列表获取为单独接口
      var wholeProjectList=$stateParams.projectList;//获取项目列表
      $scope.projectList=[];//项目列表默认为空
      for(var i=0;i<$scope.citiesInfo.length;i++){
        $scope.colorList.push(false);
      }
      $scope.mapFinished=false;//地图还未定位
      $scope.colorVariable={
        color:"#24559c"
      };
      $scope.fontVariable={
        color:"#4a4a4a"
      };
      $scope.weatherInfo={
        cityName:"定位中",
        weatherName:"",
        temperature:"",
        backUrl:"build/img/application/flight-ticket/bg-cloud.png",
        iconUrl:"build/img/application/flight-ticket/cloudy.png"
      };
      var todayDate = new Date();//今天日期
      $scope.applyInfo={//关于申请的全部信息全在这里
        fromCity:"上海",//出发城市
        fromProvince:"上海，中国",//出发省
        toCity:"北京",//到达城市
        toProvince:"北京，中国",//到达省
        departureDate:{//去程时间
          year:todayDate.getFullYear(),
          month:"",
          day:"",
          weekday:""
        },
        comeBackDate:{//返程时间
          year:"",
          month:"",
          day:"",
          weekday:""
        },
        flightType:"项目内机票",//机票类型
        projectFlightFlag:true,//项目内机票flag
        projectName:"请选择项目名称",//项目名称
        projectId:"",//所选择项目的ID
        projectType:"请选择项目类型",//项目类型
        departureFlybackNumber:"去程flyback号码",//去程flyback号码,显示用
        comeBackFlybackNumber:"回程flyback号码",//回程flyback号码，显示用
        departureFlybackCode:"",//去程flybackCode，传值用
        comeBackFlybackCode:"",//回程flybackCode，传值用
        departureFlightNumber:"",//去程航班号码
        comeBackFlightNumber:"",//回程航班号码
        passengerName:"请选择乘机人",//乘机人姓名
        passengerId:"",//乘机人身份证号
        passengerPassport:"",//乘机人护照
        customerPay:false,//客户承担
        ticketSupplement:false,//机票补录
        backupDescription:""//备注信息
      };
      initialDepartureDate();//初始化去程日期,默认今天
      refreshEndDate(1);//结束日期默认比开始日期晚一天
      $scope.buttonTabs=[true,false];//单程,往返的滚动条
      var departureType=0;//0为点击了出发城市，1为点击了返回城市
      var flybackType=0;//0为点击了去程flyback,1为点击了回程flyback
      var backCityInfo={//得到返回的省份序号和城市序号
        provinceNum:0,
        cityNum:0
      };
      try{
        var mapObj = new AMap.Map('iCenter');//高的地图自动定位城市,高德定位是一个异步
        var getCityName="";
        mapObj.plugin(["AMap.CitySearch"], function() {
          //实例化城市查询类
          var citysearch = new AMap.CitySearch();
          //自动获取用户IP，返回当前城市
          citysearch.getLocalCity(function(status,result){
            if(status=="complete"){
              getCityName=result.city;
              getCityName=getCityName.substring(0,getCityName.length-1);
            }else{
              getCityName="上海";
              hmsPopup.showVeryShortCenterToast("定位失败，自动定位到上海");
            }
            $scope.mapFinished=true;
          });
        });
      }
      catch(e){
        hmsPopup.showShortCenterToast("定位失败，请重新进入App应用");
      }

      $scope.$watch('mapFinished',function(){//正由于高德的定位是一个异步，这里用监听的形式检测是否定位完成，完成后在查看定位城市的天气
       if($scope.mapFinished == true){
         $scope.weatherInfo.cityName=getCityName;
         var url="http://op.juhe.cn/onebox/weather/query?cityname="+$scope.weatherInfo.cityName+"&key=33b41a19cc6c1d3ef68ca1a629546d4e";
         $http.post(url)//获取上海当天天气
           .success(function(result){
             var currentWeather = result.result.data.realtime.weather.info;
             var currentTemperature = result.result.data.realtime.weather.temperature;
             $scope.weatherInfo.temperature = currentTemperature+"℃";
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
             $scope.weatherInfo.cityName="无法获取天气信息";
             hmsPopup.showVeryShortCenterToast("天气查询失败");
           });
       }
      })
      function initialDepartureDate(){
        var todayDate = new Date();//今天日期
        var weekday=todayDate.getDay();
        var month=todayDate.getMonth()+1;
        var day=todayDate.getDate();
        if(weekday==0){
          $scope.applyInfo.departureDate.weekday="周日";
        }else if(weekday==1){
          $scope.applyInfo.departureDate.weekday="周一";
        }else if(weekday==2){
          $scope.applyInfo.departureDate.weekday="周二";
        }else if(weekday==3){
          $scope.applyInfo.departureDate.weekday="周三";
        }else if(weekday==4){
          $scope.applyInfo.departureDate.weekday="周四";
        }else if(weekday==5){
          $scope.applyInfo.departureDate.weekday="周五";
        }else if(weekday==6){
          $scope.applyInfo.departureDate.weekday="周六";
        }
        if(month<10){
          month="0"+month;
        }
        if(day<10){
          day="0"+day;
        }
        $scope.applyInfo.departureDate.month=month;
        $scope.applyInfo.departureDate.day=day;
      }
      function refreshEndDate(num){//刷新结束日期
        var myDate=$scope.applyInfo.departureDate;
        var todayDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowYear="";
        var tomorrowDay="";
        var tomorrowMonth="";
        var tomorrowWeekDay="";
        num=parseInt(num);
        tomorrowDate.setDate(todayDate.getDate()+num);
        tomorrowYear=tomorrowDate.getFullYear();
        tomorrowDay=tomorrowDate.getDate();
        tomorrowMonth=tomorrowDate.getMonth()+1;
        tomorrowWeekDay=tomorrowDate.getDay();
        if(tomorrowWeekDay==0){
          $scope.applyInfo.comeBackDate.weekday="周日";
        }else if(tomorrowWeekDay==1){
          $scope.applyInfo.comeBackDate.weekday="周一";
        }else if(tomorrowWeekDay==2){
          $scope.applyInfo.comeBackDate.weekday="周二";
        }else if(tomorrowWeekDay==3){
          $scope.applyInfo.comeBackDate.weekday="周三";
        }else if(tomorrowWeekDay==4){
          $scope.applyInfo.comeBackDate.weekday="周四";
        }else if(tomorrowWeekDay==5){
          $scope.applyInfo.comeBackDate.weekday="周五";
        }else if(tomorrowWeekDay==6){
          $scope.applyInfo.comeBackDate.weekday="周六";
        }
        if(tomorrowMonth<10){
          tomorrowMonth="0"+tomorrowMonth;
        }
        if(tomorrowDay<10){
          tomorrowDay="0"+tomorrowDay;
        }
        $scope.applyInfo.comeBackDate.year=tomorrowYear;
        $scope.applyInfo.comeBackDate.month=tomorrowMonth;
        $scope.applyInfo.comeBackDate.day=tomorrowDay;
      };
      function createNewApply(param){//将数据发送到创建申请接口，成功后返回上一界面，失败则提示
        $scope.showLoading = true;
        var usedParam=param;
        var realParam = {
          params:usedParam
        };
        //console.debug(angular.toJson(realParam,true));
        var url = baseConfig.businessPath+"/ticket_apply_info/flyback_submit";
        hmsHttp.post(url,realParam).success(function(result){
          $scope.showLoading = false;
          if(result.status=="S"){
            $rootScope.$broadcast("TICKET_APPLY_CREATED");
            $ionicHistory.goBack();
          }else if(result.status=="E"){
            hmsPopup.showVeryShortCenterToast(result.returnMsg);
          }
        }).error(function(err){
          $scope.showLoading = false;
        });
      }
      $scope.chooseDepartureDate=function(){//选择去程日期
        var myDate=$scope.applyInfo.departureDate;
        var previousDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var options={
          date: previousDate,
          mode: 'date',
          titleText:'请选择去程日期',
          okText:'确定',
          cancelText:'取消',
          doneButtonLabel:'确认',
          cancelButtonLabel:'取消',
          androidTheme : window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
          locale:"zh_cn"
        };
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          var weekday=date.getDay();
          if(weekday==0){
            $scope.applyInfo.departureDate.weekday="周日";
          }else if(weekday==1){
            $scope.applyInfo.departureDate.weekday="周一";
          }else if(weekday==2){
            $scope.applyInfo.departureDate.weekday="周二";
          }else if(weekday==3){
            $scope.applyInfo.departureDate.weekday="周三";
          }else if(weekday==4){
            $scope.applyInfo.departureDate.weekday="周四";
          }else if(weekday==5){
            $scope.applyInfo.departureDate.weekday="周五";
          }else if(weekday==6){
            $scope.applyInfo.departureDate.weekday="周六";
          }
          if(month<10){
            month="0"+month;
          }
          if(day<10){
            day="0"+day;
          }
          $scope.applyInfo.departureDate.year=date.getFullYear();
          $scope.applyInfo.departureDate.month=month;
          $scope.applyInfo.departureDate.day=day;
          $scope.$apply();
        });
      };
      $scope.chooseComeBackDate=function() {//选择回程日期
        var myDate=$scope.applyInfo.comeBackDate;
        var previousDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var options={
          date: previousDate,
          mode: 'date',
          titleText:'请选择回程日期',
          okText:'确定',
          cancelText:'取消',
          doneButtonLabel:'确认',
          cancelButtonLabel:'取消',
          androidTheme : window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale:"zh_cn"
        };
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          var weekday=date.getDay();
          if(weekday==0){
            $scope.applyInfo.comeBackDate.weekday="周日";
          }else if(weekday==1){
            $scope.applyInfo.comeBackDate.weekday="周一";
          }else if(weekday==2){
            $scope.applyInfo.comeBackDate.weekday="周二";
          }else if(weekday==3){
            $scope.applyInfo.comeBackDate.weekday="周三";
          }else if(weekday==4){
            $scope.applyInfo.comeBackDate.weekday="周四";
          }else if(weekday==5){
            $scope.applyInfo.comeBackDate.weekday="周五";
          }else if(weekday==6){
            $scope.applyInfo.comeBackDate.weekday="周六";
          }
          if(month<10){
            month="0"+month;
          }
          if(day<10){
            day="0"+day;
          }
          $scope.applyInfo.comeBackDate.year=date.getFullYear();
          $scope.applyInfo.comeBackDate.month=month;
          $scope.applyInfo.comeBackDate.day=day;
          $scope.$apply();
        });
      };
     $scope.clickButtonTabs=function(num){//单程与往返间切换
       if(num == 0){//选择了单程
         $scope.buttonTabs[0]=true;
         $scope.buttonTabs[1]=false;
       }else if(num == 1){//选择了往返
         $scope.buttonTabs[0]=false;
         $scope.buttonTabs[1]=true;
       }
     };
     $scope.switchPlaces=function(){//出发地与到达地交换
       var tempCity = $scope.applyInfo.fromCity;
       var tempProvince = $scope.applyInfo.fromProvince;
       $scope.applyInfo.fromCity = $scope.applyInfo.toCity;
       $scope.applyInfo.fromProvince = $scope.applyInfo.toProvince;
       $scope.applyInfo.toCity = tempCity;
       $scope.applyInfo.toProvince = tempProvince;
     };
     $scope.switchCustomerPay=function(num){//点击切换客户承担状态
      if(num == 0){
       $scope.applyInfo.customerPay = true;
      }else if(num == 1){
        $scope.applyInfo.customerPay = false;
      }
     };
     $scope.switchTicketSupplement=function(num){
       if(num == 0){
         $scope.applyInfo.ticketSupplement = true;
       }else if(num == 1){
         $scope.applyInfo.ticketSupplement = false;
       }
     };
     $scope.showCityModal=function(num){//显示城市选择modal
       departureType = num;
       for(var i=0;i<$scope.citiesInfo.length;i++){//再次点击地点Modal时，上次选定的颜色要淡掉
        $scope.colorList[i]=false;
       }
       $scope.provinceScroll.scrollTop(false);//省份滚动条重新回到顶部
       $scope.citiesDetailInfo=citiesService[0].city;//城市列表重新默认为北京
       $scope.chooseCitiesModal.show();
     };
     $scope.showFlightTypeModal=function(){//显示机票类型选择modal
       $scope.chooseFlightTypeModal.show();
     };
     $scope.showProjectListModal=function(){//显示项目选择modal
       if($scope.applyInfo.projectType=="客户项目"){
         $scope.projectList=wholeProjectList.customer_project;
       }else if($scope.applyInfo.projectType=="预销售"){
         $scope.projectList=wholeProjectList.pre_sale;
       }else if($scope.applyInfo.projectType=="内部项目"){
         $scope.projectList=wholeProjectList.internal_project;
       }
       if($scope.projectList.length==0 && $scope.applyInfo.projectType=="请选择项目类型"){
         hmsPopup.showVeryShortCenterToast("请选择项目类型");
       }else if($scope.projectList.length==0 && $scope.applyInfo.projectType!="请选择项目类型"){
         hmsPopup.showVeryShortCenterToast("此类型无可选择项目");
       }else if($scope.projectList.length>0){
         $scope.chooseProjectModal.show();
       }
     };
     $scope.showPassengerListModal=function(){//显示乘客的modal
       $scope.choosePassengerModal.show();
     };

     $scope.showProjectTypeListModal=function(){//显示项目类型的modal
       $scope.chooseProjectTypeModal.show();
     };

     $scope.showFlybackListModal=function(num){//显示flyback选择modal
       flybackType = num;
       if($scope.applyInfo.projectName == "请选择项目名称"){
         hmsPopup.showVeryShortCenterToast("请选择项目名称以获取可用flyback列表");
       }else if($scope.applyInfo.projectName != "请选择项目名称"){
         if($scope.flybackList.length==0 && flybackStatus=="查询中"){
           hmsPopup.showVeryShortCenterToast("获取flyback列表中，请稍候");
         }else if($scope.flybackList.length==0 && flybackStatus=="无法使用"){
           hmsPopup.showVeryShortCenterToast("该项目无法使用flyback，请更换项目或联系项目经理");
         }else if($scope.flybackList.length>0 && flybackStatus=="正常使用"){
           $scope.chooseFlybackModal.show();
         }
       }
     };
     $scope.finishChoosingProvince=function(num){//选择省份
       for(var i=0;i<$scope.citiesInfo.length;i++){
         $scope.colorList[i]=false;
       }
       $scope.colorList[num]=true;//选择完省份，要记录下来
       backCityInfo.provinceNum = num;
       $scope.citiesDetailInfo=$scope.citiesInfo[num].city;
     };
     $scope.finishChoosingCity=function(num){//选择城市
       backCityInfo.cityNum = num;
       var temp="";
       if(departureType == 0){
          $scope.applyInfo.fromProvince=$scope.citiesInfo[backCityInfo.provinceNum].name+"，中国";
          temp = $scope.citiesDetailInfo[backCityInfo.cityNum].name;
          $scope.applyInfo.fromCity = temp.substring(0,temp.length-1);
       }else if(departureType == 1){
         $scope.applyInfo.toProvince=$scope.citiesInfo[backCityInfo.provinceNum].name+"，中国";
         temp = $scope.citiesDetailInfo[backCityInfo.cityNum].name;
         $scope.applyInfo.toCity = temp.substring(0,temp.length-1);
       }
       $scope.chooseCitiesModal.hide();
     };
     $scope.finishChoosingFlightType=function(param){//选择完成机票类型
       if($scope.applyInfo.flightType!=param){
         $scope.applyInfo.flightType=param;
         if(param == "项目内机票"){
           $scope.applyInfo.projectName="请选择项目名称";//项目名称和id是唯一一个在切换单程往返状态时重置的字段，主要为了防止项目机票中选了项目，但是改成flyback机票，点击modal后无法获取flyback列表
           $scope.applyInfo.projectId="";
           $scope.applyInfo.projectFlightFlag = true;
         }else if(param == "flyback机票"){
           $scope.applyInfo.projectName="请选择项目名称";
           $scope.applyInfo.projectId="";
           $scope.applyInfo.projectFlightFlag = false;
         }
       }
       $scope.chooseFlightTypeModal.hide();
     };
     $scope.finishChoosingProject=function(num){//选择项目完毕
       $scope.applyInfo.projectName=$scope.projectList[num].project_name;
       $scope.applyInfo.projectId=$scope.projectList[num].project_id;
       if($scope.applyInfo.projectFlightFlag == false){//如果是flyback机票
         //自动查询该项目可用的flyback列表
         flybackStatus="查询中";
         var url=baseConfig.businessPath+"/ticket_apply_info/get_flyback_num";
         var param={
           "params":{
             p_employee_number:window.localStorage.empno,
             p_project_id:$scope.applyInfo.projectId
           }
         };
         hmsHttp.post(url,param).success(function(result){
            if(result.status=="S"){
              var flybackList = result.returnData;
              console.log(angular.toJson(result,true));
              if(flybackList.length == 0){//获取到的flyback列表为空列表
                flybackStatus="无法使用";
                hmsPopup.showVeryShortCenterToast("该项目无法使用flyback，请更换项目或联系项目经理");
              }else if(flybackList.length>0){//获取到的flyback列表有值
                flybackStatus="正常使用";
                $scope.flybackList=flybackList;
              }
            }else if(result.status=="E"){
              hmsPopup.showVeryShortCenterToast("获取flyback列表失败");
            }
         }).error(function(err){

         });
       }
       $scope.chooseProjectModal.hide();
     };
     $scope.finishChoosingPassenger=function(num){//选择乘机人完毕
       $scope.applyInfo.passengerName = $scope.passengerList[num].passenger_name;
       $scope.applyInfo.passengerId = $scope.passengerList[num].passenger_id;
       //$scope.applyInfo.passengerPassport = $scope.passengerList[num].passenger_passport;
       $scope.choosePassengerModal.hide();
     };
     $scope.finishChoosingProjectType=function(param){//完成选择项目类型
       if($scope.applyInfo.projectType!=param){
         $scope.applyInfo.projectType=param;
         $scope.applyInfo.projectName="请选择项目名称";
         $scope.applyInfo.projectId="";
       }
       $scope.chooseProjectTypeModal.hide();
     };
     $scope.finishChoosingFlybackNumber=function(num){//flyback号码选择完毕
       if(flybackType == 0){
         $scope.applyInfo.departureFlybackNumber=$scope.flybackList[num].flyback_number;
         $scope.applyInfo.departureFlybackCode=$scope.flybackList[num].flyback_code;
       }else if(flybackType == 1){
         $scope.applyInfo.comeBackFlybackNumber=$scope.flybackList[num].flyback_number;
         $scope.applyInfo.comeBackFlybackCode=$scope.flybackList[num].flyback_code;
       }
       $scope.chooseFlybackModal.hide();
     };
     $scope.commit=function(){//提交申请
       var postParam={//传递参数
        P_apply_id:"",
        p_employee_number:window.localStorage.empno,
        p_project_id:"",
        p_departure_type:"",
        p_departure_place:$scope.applyInfo.fromCity,
        p_destination_place:$scope.applyInfo.toCity,
        p_departure_date:$scope.applyInfo.departureDate.year+"-"+$scope.applyInfo.departureDate.month+"-"+$scope.applyInfo.departureDate.day,
        p_back_date:"",
        p_flight_type:"",
        p_departure_flyback_number:"",
        p_back_flyback_number:"",
        p_departure_flight_number:"",
        p_back_flight_number:"",
        p_passenger_name:"",
        p_passenger_id:"",
        p_backup_description:$scope.applyInfo.backupDescription,
        p_ticket_supplement:"",
        p_customer_pay:"",
        p_route_type:""
       };
       if($scope.applyInfo.customerPay==true){//是否客户承担
         postParam.p_customer_pay=1;
       }else if($scope.applyInfo.customerPay==false){
         postParam.p_customer_pay=0;
       }
       if($scope.applyInfo.ticketSupplement==true){//是否机票补录
         postParam.p_ticket_supplement=1;
       }else if($scope.applyInfo.ticketSupplement==false){
         postParam.p_ticket_supplement=0;
       }
       if($scope.applyInfo.flightType == "项目内机票"){
         postParam.p_flight_type=15;
       }else if($scope.applyInfo.flightType == "flyback机票"){
         postParam.p_flight_type=10;
       }
       if($scope.buttonTabs[0]==true){
         postParam.p_departure_type="single";//传值-单程
         var startYear=$scope.applyInfo.departureDate.year;//开始日期年份
         var startMonth=$scope.applyInfo.departureDate.month;//开始日期月份
         var startDay=$scope.applyInfo.departureDate.day;//开始日期
         var presentDate = new Date();
         var presentYear = presentDate.getFullYear();//当前年
         var presentMonth = presentDate.getMonth()+1;//当前月
         var presentDay = presentDate.getDate();//当前日
         startMonth=parseInt(startMonth);
         startDay=parseInt(startDay);

         if($scope.applyInfo.flightType == "项目内机票"){
           if($scope.applyInfo.projectName == "请选择项目名称"){
            hmsPopup.showVeryShortCenterToast("请选择项目");
           }else if($scope.applyInfo.departureFlightNumber == ""){
             hmsPopup.showVeryShortCenterToast("请填写去程航班号");
           }else if($scope.applyInfo.passengerName == "请选择乘机人"){
             hmsPopup.showVeryShortCenterToast("请选择乘机人");
           }else if( ($scope.applyInfo.ticketSupplement == false) && ((startYear<presentYear) || ( (startYear==presentYear)&&(startMonth<presentMonth) ) || ( (startYear==presentYear)&&(startMonth==presentMonth)&&(startDay<presentDay) )) ){
             hmsPopup.showVeryShortCenterToast("出发日期不能早于今天");
           }else{
             /////校验完毕,开始提交
             postParam.p_project_id = $scope.applyInfo.projectId;
             postParam.p_passenger_name = $scope.applyInfo.passengerName;
             postParam.p_passenger_id = $scope.applyInfo.passengerId;
             postParam.p_departure_flight_number = $scope.applyInfo.departureFlightNumber;
             postParam.p_route_type=1;
             createNewApply(postParam);
             //console.log("提交成功");
             //console.log("行程类型为单程");
             //console.log("去程日期为："+$scope.applyInfo.departureDate.year+"-"+$scope.applyInfo.departureDate.month+"-"+$scope.applyInfo.departureDate.day);
             //console.log("从"+$scope.applyInfo.fromCity+"飞往"+$scope.applyInfo.toCity);
             //console.log("机票类型为项目内机票");
             //console.log("项目名称："+$scope.applyInfo.projectName);
             //console.log("去程航班号为："+$scope.applyInfo.departureFlightNumber);
             //console.log("乘机人为："+$scope.applyInfo.passengerName);
             //console.log("乘机人身份证号为："+$scope.applyInfo.passengerId);
           }
         }else if($scope.applyInfo.flightType == "flyback机票"){//单程flyback类型机票，可以用回程定去程，如果用了去程的传1，用了回程的传2
           if($scope.applyInfo.projectName == "请选择项目名称"){
             hmsPopup.showVeryShortCenterToast("请选择项目");
           }else if($scope.applyInfo.departureFlybackNumber == "去程flyback号码"){
             hmsPopup.showVeryShortCenterToast("请选择去程flyback编号");
           }else if($scope.applyInfo.departureFlightNumber == ""){
             hmsPopup.showVeryShortCenterToast("请填写去程航班号");
           }else if($scope.applyInfo.passengerName == "请选择乘机人"){
             hmsPopup.showVeryShortCenterToast("请选择乘机人");
           }else if( ($scope.applyInfo.ticketSupplement == false) && ((startYear<presentYear) || ( (startYear==presentYear)&&(startMonth<presentMonth) ) || ( (startYear==presentYear)&&(startMonth==presentMonth)&&(startDay<presentDay) )) ){
             hmsPopup.showVeryShortCenterToast("出发日期不能早于今天");
           }else{
             postParam.p_project_id = $scope.applyInfo.projectId;
             postParam.p_departure_flyback_number = $scope.applyInfo.departureFlybackCode;
             postParam.p_departure_flight_number = $scope.applyInfo.departureFlightNumber;
             postParam.p_passenger_name = $scope.applyInfo.passengerName;
             postParam.p_passenger_id = $scope.applyInfo.passengerId;
             var routeType=$scope.applyInfo.departureFlybackNumber.substring($scope.applyInfo.departureFlybackNumber.length-2,$scope.applyInfo.departureFlybackNumber.length);
             if(routeType == "去程"){
               postParam.p_route_type=1;
             }else if(routeType == "回程"){
               postParam.p_route_type=2;
             }
             createNewApply(postParam);
             /////校验完毕,开始提交
             //console.log("提交成功");
             //console.log("行程类型为单程");
             //console.log("去程日期为："+$scope.applyInfo.departureDate.year+"-"+$scope.applyInfo.departureDate.month+"-"+$scope.applyInfo.departureDate.day);
             //console.log("从"+$scope.applyInfo.fromCity+"飞往"+$scope.applyInfo.toCity);
             //console.log("机票类型为flyback机票");
             //console.log("去程flyback编号为："+$scope.applyInfo.departureFlybackCode);
             //console.log("去程航班号为："+$scope.applyInfo.departureFlightNumber);
             //console.log("乘机人为："+$scope.applyInfo.passengerName);
             //console.log("乘机人身份证号为："+$scope.applyInfo.passengerId);
           }
         }
       }else if($scope.buttonTabs[1]==true){
         var startYear=$scope.applyInfo.departureDate.year;//开始日期年份
         var startMonth=$scope.applyInfo.departureDate.month;//开始日期月份
         var startDay=$scope.applyInfo.departureDate.day;//开始日期
         var endYear=$scope.applyInfo.comeBackDate.year;//结束日期年份
         var endMonth=$scope.applyInfo.comeBackDate.month;//结束日期月份
         var endDay=$scope.applyInfo.comeBackDate.day;//结束日期
         var presentDate = new Date();
         var presentYear = presentDate.getFullYear();//当前年
         var presentMonth = presentDate.getMonth()+1;//当前月
         var presentDay = presentDate.getDate();//当前日
         startMonth=parseInt(startMonth);
         startDay=parseInt(startDay);
         endMonth=parseInt(endMonth);
         endDay=parseInt(endDay);
         postParam.p_departure_type="double";//传值-往返行程
         if($scope.applyInfo.flightType == "项目内机票"){
           if($scope.applyInfo.projectName == "请选择项目名称"){
             hmsPopup.showVeryShortCenterToast("请选择项目");
           }else if($scope.applyInfo.departureFlightNumber == ""){
             hmsPopup.showVeryShortCenterToast("请填写去程航班号");
           }else if($scope.applyInfo.comeBackFlightNumber == ""){
             hmsPopup.showVeryShortCenterToast("请填写回程航班号");
           }else if($scope.applyInfo.passengerName == "请选择乘机人"){
             hmsPopup.showVeryShortCenterToast("请选择乘机人");
           }else if( ($scope.applyInfo.ticketSupplement == false) && ((startYear<presentYear) || ( (startYear==presentYear)&&(startMonth<presentMonth) ) || ( (startYear==presentYear)&&(startMonth==presentMonth)&&(startDay<presentDay) )) ){
             hmsPopup.showVeryShortCenterToast("出发日期不能早于今天");
           }else if( (startYear>endYear) ||((startYear==endYear)&&(startMonth>endMonth)) || ((startYear==endYear)&&(startMonth==endMonth)&&(startDay>endDay))){
             hmsPopup.showShortCenterToast('去程日期不能晚于回程日期');
           }else{
             postParam.p_project_id = $scope.applyInfo.projectId;
             postParam.p_back_date=$scope.applyInfo.comeBackDate.year+"-"+$scope.applyInfo.comeBackDate.month+"-"+$scope.applyInfo.comeBackDate.day;
             postParam.p_passenger_name = $scope.applyInfo.passengerName;
             postParam.p_passenger_id = $scope.applyInfo.passengerId;
             postParam.p_departure_flight_number = $scope.applyInfo.departureFlightNumber;
             postParam.p_back_flight_number = $scope.applyInfo.comeBackFlightNumber;
             createNewApply(postParam);
             /////校验完毕,开始提交
             //console.log("提交成功");
             //console.log("行程类型为往返");
             //console.log("去程日期为："+$scope.applyInfo.departureDate.year+"-"+$scope.applyInfo.departureDate.month+"-"+$scope.applyInfo.departureDate.day);
             //console.log("从"+$scope.applyInfo.fromCity+"飞往"+$scope.applyInfo.toCity);
             //console.log("回程日期为："+$scope.applyInfo.comeBackDate.year+"-"+$scope.applyInfo.comeBackDate.month+"-"+$scope.applyInfo.comeBackDate.day);
             //console.log("从"+$scope.applyInfo.toCity+"飞回"+$scope.applyInfo.fromCity);
             //console.log("机票类型为项目内机票");
             //console.log("项目名称："+$scope.applyInfo.projectName);
             //console.log("去程航班号为："+$scope.applyInfo.departureFlightNumber);
             //console.log("回程航班号为："+$scope.applyInfo.comeBackFlightNumber);
             //console.log("乘机人为："+$scope.applyInfo.passengerName);
             //console.log("乘机人身份证号为："+$scope.applyInfo.passengerId);
           }
         }else if($scope.applyInfo.flightType == "flyback机票"){
           if($scope.applyInfo.projectName == "请选择项目名称"){
             hmsPopup.showVeryShortCenterToast("请选择项目");
           }else if($scope.applyInfo.departureFlybackNumber == "去程flyback号码"){
             hmsPopup.showVeryShortCenterToast("请选择去程flyback编号");
           }else if($scope.applyInfo.comeBackFlybackNumber == "回程flyback号码"){
             hmsPopup.showVeryShortCenterToast("请选择回程flyback编号");
           }else if($scope.applyInfo.departureFlybackNumber.substring($scope.applyInfo.departureFlybackNumber.length-2,$scope.applyInfo.departureFlybackNumber.length)!="去程"){
             hmsPopup.showVeryShortCenterToast("回程flyback号码不能用在去程上");
           }else if($scope.applyInfo.comeBackFlybackNumber.substring($scope.applyInfo.comeBackFlybackNumber.length-2,$scope.applyInfo.comeBackFlybackNumber.length)!="回程"){
             hmsPopup.showVeryShortCenterToast("去程flyback号码不能用在回程上");
           }else if($scope.applyInfo.departureFlightNumber == ""){
             hmsPopup.showVeryShortCenterToast("请填写去程航班号");
           }else if($scope.applyInfo.comeBackFlightNumber == ""){
             hmsPopup.showVeryShortCenterToast("请填写回程航班号");
           }else if($scope.applyInfo.passengerName == "请选择乘机人"){
             hmsPopup.showVeryShortCenterToast("请选择乘机人");
           }else if( ($scope.applyInfo.ticketSupplement == false) && ((startYear<presentYear) || ( (startYear==presentYear)&&(startMonth<presentMonth) ) || ( (startYear==presentYear)&&(startMonth==presentMonth)&&(startDay<presentDay) )) ){
             hmsPopup.showVeryShortCenterToast("出发日期不能早于今天");
           }else if( (startYear>endYear) ||((startYear==endYear)&&(startMonth>endMonth)) || ((startYear==endYear)&&(startMonth==endMonth)&&(startDay>endDay))){
             hmsPopup.showShortCenterToast('去程日期不能晚于回程日期');
           }else{
             postParam.p_project_id = $scope.applyInfo.projectId;
             postParam.p_back_date=$scope.applyInfo.comeBackDate.year+"-"+$scope.applyInfo.comeBackDate.month+"-"+$scope.applyInfo.comeBackDate.day;
             postParam.p_departure_flyback_number = $scope.applyInfo.departureFlybackCode;
             postParam.p_back_flyback_number = $scope.applyInfo.comeBackFlybackCode;
             postParam.p_departure_flight_number = $scope.applyInfo.departureFlightNumber;
             postParam.p_back_flight_number = $scope.applyInfo.comeBackFlightNumber;
             postParam.p_passenger_name = $scope.applyInfo.passengerName;
             postParam.p_passenger_id = $scope.applyInfo.passengerId;
             createNewApply(postParam);
             /////校验完毕,开始提交
             //console.log("提交成功");
             //console.log("行程类型为往返");
             //console.log("去程日期为："+$scope.applyInfo.departureDate.year+"-"+$scope.applyInfo.departureDate.month+"-"+$scope.applyInfo.departureDate.day);
             //console.log("从"+$scope.applyInfo.fromCity+"飞往"+$scope.applyInfo.toCity);
             //console.log("回程日期为："+$scope.applyInfo.comeBackDate.year+"-"+$scope.applyInfo.comeBackDate.month+"-"+$scope.applyInfo.comeBackDate.day);
             //console.log("从"+$scope.applyInfo.toCity+"飞回"+$scope.applyInfo.fromCity);
             //console.log("机票类型为flyback机票");
             //console.log("去程flyback编号为："+$scope.applyInfo.departureFlybackCode);
             //console.log("回程flyback编号为："+$scope.applyInfo.comeBackFlybackCode);
             //console.log("去程航班号为："+$scope.applyInfo.departureFlightNumber);
             //console.log("回程航班号为："+$scope.applyInfo.comeBackFlightNumber);
             //console.log("乘机人为："+$scope.applyInfo.passengerName);
             //console.log("乘机人身份证号为："+$scope.applyInfo.passengerId);
           }
         }
       }
       //console.log(angular.toJson(postParam,true));
     };
     $scope.goBack=function(){//返回按钮
       $ionicHistory.goBack();
     };
  }]);
