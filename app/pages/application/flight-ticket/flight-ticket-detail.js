/**
 * Created by LeonChan on 2016/8/29.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flight-ticket-detail', {
          url: '/flight-ticket-detail',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/flight-ticket/flight-ticket-detail.html',
              controller: 'FlightTicketDetailCtrl'
            }
          },
          params:{
            detailInfo:"",
            projectList:""
          }
        })
    }]);
angular.module('applicationModule')
  .controller('FlightTicketDetailCtrl', [
    '$scope',
    '$ionicHistory',
    '$stateParams',
    '$http',
    'hmsPopup',
    '$state',
    '$timeout',
    'hmsHttp',
    'baseConfig',
    'passengerService',
    'citiesService',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$cordovaDatePicker',
    '$rootScope',
    function($scope,
             $ionicHistory,
             $stateParams,
             $http,
             hmsPopup,
             $state,
             $timeout,
             hmsHttp,
             baseConfig,
             passengerService,
             citiesService,
             $ionicModal,
             $ionicScrollDelegate,
             $cordovaDatePicker,
             $rootScope){
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/cities-select-modal.html', {//定义省市modal
        scope: $scope
      }).then(function (modal1) {
        $scope.chooseCitiesModal = modal1;
      });
      $ionicModal.fromTemplateUrl('build/pages/application/flight-ticket/modal/flight-type-select-modal.html', {//航班类型modal
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
     var wholeProjectList=$stateParams.projectList;//项目列表
     $scope.passengerList=passengerService.getPassengerList();//获取乘机人列表
     var param=$stateParams.detailInfo;
     $scope.detailInfo={//详情信息
      apply_status:param.apply_status,
      apply_id:param.apply_id,
      apply_detail_id:param.apply_detail_id,
      project_id:param.project_id,
      project_type:param.project_type,
      project_name:param.project_name,
      departure_place:param.departure_place,
      destination_place:param.destination_place,
      departure_date:param.departure_date,
      flight_type:param.flight_type,
      passenger_name:param.passenger_name,
      passenger_id:param.passenger_id,
      departure_flight_number:param.departure_flight_number,
      departure_flyback_number:param.departure_flyback_number,
      departure_flyback_code:param.departure_flyback_code,
      customer_pay:param.customer_pay,
      ticket_supplement:param.ticket_supplement,
      backup_description:param.backup_description
     };
     if($scope.detailInfo.project_type=="客户项目"){
       $scope.projectList=wholeProjectList.customer_project;
     }else if($scope.detailInfo.project_type=="预销售"){
       $scope.projectList=wholeProjectList.pre_sale;
     }else if($scope.detailInfo.project_type=="内部项目"){
       $scope.projectList=wholeProjectList.internal_project;
     }
     $scope.dateDetail={//年月日详情拆分
        year:parseInt($scope.detailInfo.departure_date.substring(0,4)),
        month:parseInt($scope.detailInfo.departure_date.substring(5,7)),
        day:parseInt($scope.detailInfo.departure_date.substring(8,10))
      }
      console.log(angular.toJson(param,true));
     console.log(angular.toJson($scope.detailInfo,true));
     console.log(angular.toJson($scope.dateDetail,true));
     $scope.projectTypeList=["客户项目","预销售","内部项目"];
     $scope.flightTypeList=["项目内机票","flyback机票"];//机票类型列表
      $scope.citiesInfo=citiesService;//从factory中拿到中国省市信息
      $scope.citiesDetailInfo=citiesService[0].city;//默认城市信息列表为北京
      $scope.colorList=[];//记录选择省份，选择就变颜色
      $scope.flybackList=[];//flyback列表
      var backCityInfo={//得到返回的省份序号和城市序号
        provinceNum:0,
        cityNum:0
      };
      var flybackStatus="";//flyback是否有可用的标志位
     $scope.showLoading = false;//默认不显示loading
     $scope.editAble=false;//是否可编辑
     $scope.editMode=false;//是否进入编辑模式
     $scope.endorseMode=false;//是否进入改签/退票模式
     $scope.returnMode=false;//显示退票原因和说明
     $scope.changeMode=false;//显示改签原因和说明
     var departureType=0;//0为出发地，1为目的地
     $scope.booleanSet={//客户承担和机票补录的布尔型对象
       ticketSupplement:false,
       customerPay:false,
       changeScheduleReason:[false,false],
       returnReason:[false,false]
     };
     $scope.reasonInputDetail={//退票说明和改签说明
       returnInput:"",
       changeInput:""
     };
     if($scope.detailInfo.apply_status == "applied" || $scope.detailInfo.apply_status == "finished"){//只有已申请和已出票状态的机票申请才可以编辑
       $scope.editAble=true;
     }else{
       $scope.editAble=false;
     }
     if($scope.detailInfo.customer_pay == 0){
       $scope.booleanSet.customerPay=false;
     }else if($scope.detailInfo.customer_pay == 1){
       $scope.booleanSet.customerPay=true;
     }
     if($scope.detailInfo.ticket_supplement == 0){
       $scope.booleanSet.ticketSupplement=false;
     }else if($scope.detailInfo.ticket_supplement == 1){
       $scope.booleanSet.ticketSupplement=true;
     }
      for(var i=0;i<$scope.citiesInfo.length;i++){//用来标记省市modal中选定省份颜色的
        $scope.colorList.push(false);
      }
      getUseableFlyback();
     function getUseableFlyback(){
       flybackStatus="查询中";
       var url=baseConfig.businessPath+"/ticket_apply_info/get_flyback_num";//自动查询相关项目可用flyback
       var param={
         "params":{
           p_employee_number:window.localStorage.empno,
           p_project_id:$scope.detailInfo.project_id
         }
       };
       hmsHttp.post(url,param).success(function(result){
         if(result.status=="S"){
           var flybackList = result.returnData;
           console.log(angular.toJson(result,true));
           if(flybackList.length == 0){//获取到的flyback列表为空列表
             flybackStatus="无法使用";
           }else if(flybackList.length>0){//获取到的flyback列表有值
             flybackStatus="正常使用";
           }
           $scope.flybackList=flybackList;
         }else if(result.status=="E"){
           hmsPopup.showVeryShortCenterToast("获取flyback列表失败");
         }
       }).error(function(err){

       });
     }
     $scope.enterEditMode=function(){//进入编辑模式
       if($scope.editAble==true){
         if($scope.detailInfo.apply_status == "applied"){
           $scope.editMode = true;
           hmsPopup.showVeryShortCenterToast("进入编辑模式");
         }else if($scope.detailInfo.apply_status == "finished"){
           $scope.endorseMode = true;
           hmsPopup.showLongCenterToast("改签请填写改签后出发日期和航班，退票直接点击退票按钮");
         }
         $scope.editAble = false;
       }
     };
     $scope.judgeDetailInfo=function(){//详细信息英文转中文
       var param=$scope.detailInfo;
       var result={
         status:""
       };
       if(param.apply_status == "applied"){
         result.status="已申请";
       }else if(param.apply_status == "approved"){
         result.status="已审批";
       }else if(param.apply_status == "rejected"){
         result.status="已拒绝";
       }else if(param.apply_status == "confirming"){
         result.status="待确认";
       }else if(param.apply_status == "confirmed"){
         result.status="已确认";
       }else if(param.apply_status == "finished"){
         result.status="已出票";
       }else if(param.apply_status == "endorsing"){
         result.status="已改签";
       }else if(param.apply_status == "returned"){
         result.status="已退票";
       }else if(param.apply_status == "canceled"){
         result.status="已撤销";
       }
       return result;
     };
     $scope.judgeProjectType=function(){//判断是项目内机票还是flyback机票
      var result="";
      if($scope.detailInfo.flight_type=="项目内机票"){
       result=true;
      }else if($scope.detailInfo.flight_type=="flyback机票" || $scope.detailInfo.flight_type=="Flyback机票"){
       result=false;
      }
       return result;
     };
     $scope.switchCustomerPay=function(num){//切换客户承担
       if($scope.editMode==true){
         if(num == 0){
           $scope.booleanSet.customerPay = true;
         }else if(num == 1){
           $scope.booleanSet.customerPay = false;
         }
       }
     };
      $scope.switchTicketSupplement=function(num){//切换机票补录
        if($scope.editMode==true){
          if(num == 0){
            $scope.booleanSet.ticketSupplement = true;
          }else if(num == 1){
            $scope.booleanSet.ticketSupplement = false;
          }
        }
      };
      $scope.switchChangeScheduleReason=function(num){//改签原因
       if($scope.endorseMode==true){
         if(num==0){
           $scope.booleanSet.changeScheduleReason[0]=true;
           $scope.booleanSet.changeScheduleReason[1]=false;
         }else if(num==1){
           $scope.booleanSet.changeScheduleReason[1]=true;
           $scope.booleanSet.changeScheduleReason[0]=false;
         }
       }
      };
      $scope.switchReturnReason=function(num){//退票原因,10个人,20项目
        if($scope.endorseMode==true){
          if(num==0){
            $scope.booleanSet.returnReason[0]=true;
            $scope.booleanSet.returnReason[1]=false;
          }else if(num==1){
            $scope.booleanSet.returnReason[1]=true;
            $scope.booleanSet.returnReason[0]=false;
          }
        }
      };
      $scope.chooseDate=function(){//选择出发日期
        if($scope.editMode==true || $scope.endorseMode==true){
          var myDate=$scope.dateDetail;
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
            if(month<10){
              month="0"+month;
            }
            if(day<10){
              day="0"+day;
            }
            $scope.dateDetail.year=date.getFullYear();
            $scope.dateDetail.month=month;
            $scope.dateDetail.day=day;
            $scope.detailInfo.departure_date=$scope.dateDetail.year+"-"+$scope.dateDetail.month+"-"+$scope.dateDetail.day;
            $scope.$apply();
          });
        }
      };
     $scope.changeFlightType=function(){//改变机票类型
      if($scope.editMode==true){
        $scope.chooseFlightTypeModal.show();
      }
     };
     $scope.finishChoosingFlightType=function(param){//选择机票类型完成
        $scope.detailInfo.flight_type=param;
        $scope.chooseFlightTypeModal.hide();
     };
     $scope.changeCity=function(num){//改变城市
       if($scope.editMode==true){
         departureType=num;
         for(var i=0;i<$scope.citiesInfo.length;i++){//再次点击地点Modal时，上次选定的颜色要淡掉
           $scope.colorList[i]=false;
         }
         $scope.provinceScroll.scrollTop(false);//省份滚动条重新回到顶部
         $scope.citiesDetailInfo=citiesService[0].city;//城市列表重新默认为北京
         $scope.chooseCitiesModal.show();
       }
     };
     $scope.finishChoosingProvince=function(num){//选择完省
       for(var i=0;i<$scope.citiesInfo.length;i++){
         $scope.colorList[i]=false;
       }
       $scope.colorList[num]=true;//选择完省份，要记录下来
       backCityInfo.provinceNum = num;
       $scope.citiesDetailInfo=$scope.citiesInfo[num].city;
     };
     $scope.finishChoosingCity=function(num){//选择完市
       backCityInfo.cityNum = num;
       var temp="";
       if(departureType == 0){
         temp = $scope.citiesDetailInfo[backCityInfo.cityNum].name;
         $scope.detailInfo.departure_place = temp.substring(0,temp.length-1);
       }else if(departureType == 1){
         temp = $scope.citiesDetailInfo[backCityInfo.cityNum].name;
         $scope.detailInfo.destination_place = temp.substring(0,temp.length-1);
       }
       $scope.chooseCitiesModal.hide();
     };
     $scope.changeProjectType=function(){//改变项目类型
       if($scope.editMode==true){
         $scope.chooseProjectTypeModal.show();
       }
     };
     $scope.finishChoosingProjectType=function(param){//项目类型选择完毕
        if($scope.detailInfo.project_type!=param){
          $scope.detailInfo.project_type=param;
          $scope.detailInfo.project_name="请选择项目名称";
          $scope.detailInfo.project_id="";
        }
        $scope.chooseProjectTypeModal.hide();
     };
     $scope.changeProject=function(){//改变项目
       if($scope.editMode==true){
         if($scope.detailInfo.project_type=="客户项目"){
           $scope.projectList=wholeProjectList.customer_project;
         }else if($scope.detailInfo.project_type=="预销售"){
           $scope.projectList=wholeProjectList.pre_sale;
         }else if($scope.detailInfo.project_type=="内部项目"){
           $scope.projectList=wholeProjectList.internal_project;
         }
         if($scope.projectList.length==0){
           hmsPopup.showVeryShortCenterToast("此类型无可选择项目");
         }else if($scope.projectList.length>0){
           $scope.chooseProjectModal.show();
         }
       }
     };
     $scope.finishChoosingProject=function(num){//项目选择完毕
       $scope.detailInfo.project_name=$scope.projectList[num].project_name;
       $scope.detailInfo.project_id=$scope.projectList[num].project_id;
       getUseableFlyback();
       $scope.chooseProjectModal.hide();
     };
     $scope.changePassenger=function(){//改变乘机人
       if($scope.editMode==true){
         $scope.choosePassengerModal.show();
       }
     };
     $scope.finishChoosingPassenger=function(num){//乘机人选择完毕
       $scope.detailInfo.passenger_name=$scope.passengerList[num].passenger_name;
       $scope.detailInfo.passenger_id=$scope.passengerList[num].passenger_id;
       $scope.choosePassengerModal.hide();
     };
     $scope.changeFlyback=function(){//显示flyback号码选择modal
       if($scope.editMode==true){
         if($scope.flybackList.length==0 && flybackStatus=="查询中"){
           hmsPopup.showVeryShortCenterToast("获取flyback列表中，请稍候");
         }else if($scope.flybackList.length==0 && flybackStatus=="无法使用"){
           hmsPopup.showVeryShortCenterToast("该项目无法使用flyback，请更换项目或联系项目经理");
         }else if($scope.flybackList.length>0 && flybackStatus=="正常使用"){
           $scope.chooseFlybackModal.show();
         }
       }
     };
     $scope.finishChoosingFlybackNumber=function(num){//选择完成flyback
       $scope.detailInfo.departure_flyback_number=$scope.flybackList[num].flyback_number;
       $scope.detailInfo.departure_flyback_code=$scope.flybackList[num].flyback_code;
       $scope.chooseFlybackModal.hide();
     };

     $scope.goBack=function(){//返回按钮
       $ionicHistory.goBack();
     };
     function postData(url,param){
       console.log(angular.toJson(param.params,true));
       $scope.showLoading=true;
       hmsHttp.post(url,param).success(function(result){
         $scope.showLoading=false;
         if(result.status=="S"){
           $rootScope.$broadcast("TICKET_APPLY_CREATED");
           $ionicHistory.goBack();
         }else if(result.status=="E"){
           hmsPopup.showVeryShortCenterToast(result.returnMsg);
         }
       }).error(function(err){
         $scope.showLoading=true;
       });
     }
     $scope.confirmToChange=function(){//确认更改申请
       if($scope.detailInfo.project_name=="请选择项目名称"){
         hmsPopup.showVeryShortCenterToast("请选择项目名称");
       }else if($scope.detailInfo.project_name!="请选择项目名称") {
         var temp = $scope.detailInfo;
         var url = baseConfig.businessPath + "/ticket_apply_info/flyback_modified";
         var param = {
           "params": {
             p_apply_id: temp.apply_id,
             p_apply_detail_id: temp.apply_detail_id,
             p_employee_number: window.localStorage.empno,
             p_project_id: temp.project_id,
             p_departure_place: temp.departure_place,
             p_destination_place: temp.destination_place,
             p_departure_date: temp.departure_date,
             p_flight_type: "",
             p_departure_flyback_number: "",
             p_departure_flight_number: temp.departure_flight_number,
             p_passenger_name: temp.passenger_name,
             p_passenger_id: temp.passenger_id,
             p_backup_description: temp.backup_description,
             p_ticket_supplement: "",
             p_customer_pay: "",
             p_route_type: 1
           }
         }
         if (temp.flight_type == "项目内机票") {
           param.params.p_flight_type = 15;
         } else if (temp.flight_type == "flyback机票" || temp.flight_type == "Flyback机票") {
           param.params.p_flight_type = 10;
         }
         if ($scope.booleanSet.customerPay == false) {
           param.params.p_customer_pay = 0;
         } else if ($scope.booleanSet.customerPay == true) {
           param.params.p_customer_pay = 1;
         }
         if ($scope.booleanSet.ticketSupplement == false) {
           param.params.p_ticket_supplement = 0;
         } else if ($scope.booleanSet.ticketSupplement == true) {
           param.params.p_ticket_supplement = 1;
         }
         if (temp.flight_type == "flyback机票" || temp.flight_type == "Flyback机票") {
           param.params.p_departure_flyback_number = temp.departure_flyback_code;
           var direction = temp.departure_flyback_number.substring(temp.departure_flyback_number.length - 2, temp.departure_flyback_number.length);
           if (direction == "去程") {
             param.params.p_route_type = 1;
           } else if (direction == "回程") {
             param.params.p_route_type = 2;
           }
           if (temp.departure_flyback_number == "") {
             hmsPopup.showVeryShortCenterToast("flyback机票申请必须输入flyback号码");
           } else if (temp.departure_flyback_number != "") {
             postData(url, param);
           }
         } else if (temp.flight_type == "项目内机票") {
           postData(url, param);
         }
       }
     };
     $scope.returnTicket=function(){//退票
       $scope.returnMode=true;
       $scope.changeMode=false;
       if( ($scope.booleanSet.returnReason[0]==false) && ($scope.booleanSet.returnReason[1]==false) ){
         hmsPopup.showShortCenterToast("请选择退票原因");
       }else{
         if($scope.reasonInputDetail.returnInput==""){
           hmsPopup.showShortCenterToast("请填写退票详细说明");
         }else if($scope.reasonInputDetail.returnInput!=""){
           $scope.showLoading=true;
           var url=baseConfig.businessPath+"/ticket_apply_info/ticket_return_apply";
           var param={
             "params":{
               p_employee_number:window.localStorage.empno,
               p_apply_id:$scope.detailInfo.apply_id,
               p_apply_detail_id:$scope.detailInfo.apply_detail_id,
               p_change_reason_type:"",
               p_backup_description:$scope.reasonInputDetail.returnInput
             }
           };
           if($scope.booleanSet.returnReason[0]==true){
              param.params.p_change_reason_type=10;
           }else if($scope.booleanSet.returnReason[1]==true){
              param.params.p_change_reason_type=20;
           }
           postData(url,param);
         }
       }
     };
     $scope.changeSchedule=function(){//改签
       $scope.changeMode=true;
       $scope.returnMode=false;
       if( ($scope.booleanSet.changeScheduleReason[0]==false) && ($scope.booleanSet.changeScheduleReason[1]==false) ){
         hmsPopup.showShortCenterToast("请选择改签原因,并确认好改签后日期和航班号");
       }else{
         if($scope.reasonInputDetail.changeInput==""){
           hmsPopup.showShortCenterToast("请填写改签详细说明");
         }else if($scope.reasonInputDetail.changeInput!=""){
           var url=baseConfig.businessPath+"/ticket_apply_info/meal_ticket_apply";
           var param={
             "params":{
               p_employee_number:window.localStorage.empno,
               p_apply_detail_id:$scope.detailInfo.apply_detail_id,
               p_change_reason_type:"",
               p_departure_date:$scope.detailInfo.departure_date,
               p_departure_flight_number:$scope.detailInfo.departure_flight_number,
               p_backup_description:$scope.reasonInputDetail.changeInput
             }
           };
           if($scope.booleanSet.changeScheduleReason[0]==true){
             param.params.p_change_reason_type=10;
           }else if($scope.booleanSet.changeScheduleReason[1]==true){
             param.params.p_change_reason_type=20;
           }
           postData(url,param);
         }
       }
     };
    }]);
