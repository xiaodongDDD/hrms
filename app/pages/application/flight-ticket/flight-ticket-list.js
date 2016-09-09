/**
 * Created by LeonChan on 2016/8/19.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flight-ticket-list', {
          url: '/flight-ticket-list',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flight-ticket/flight-ticket-list.html',
              controller: 'FlightTicketListCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('FlightTicketListCtrl', [
    '$scope',
    '$ionicHistory',
    '$http',
    'hmsPopup',
    '$state',
    '$ionicScrollDelegate',
    '$ionicListDelegate',
    '$timeout',
    'hmsHttp',
    'baseConfig',
    'passengerService',
    '$rootScope',
    function($scope,
             $ionicHistory,
             $http,
             hmsPopup,
             $state,
             $ionicScrollDelegate,
             $ionicListDelegate,
             $timeout,
             hmsHttp,
             baseConfig,
             passengerService,
             $rootScope){
        $scope.showLoading = true;//默认开始加载数据
        $scope.showData=true;//默认有数据
        $scope.scrollBusy = false;//控制加载更多
        var todayDate = new Date();//今天日期
        var month=todayDate.getMonth()+1;
        var day=todayDate.getDate();
        if(month<10){
         month="0"+month;
        }
        if(day<10){
          day="0"+day;
        }
        var pageNumber = 1;//分页请求数据中的页号,初始化时用第一页的
        var projectList = [];
        initApplyList();
        function initApplyList(){//初始化数据
          $scope.showLoading = true;
          $scope.items=[];
          pageNumber = 1;
          var url=baseConfig.businessPath+"/ticket_apply_info/get_tickets_list";
          var param={
            "params":{
              p_employee_number: window.localStorage.empno,
              p_page_number:pageNumber
            }
          };
          hmsHttp.post(url,param).success(function(result){
           if(result.status == "S"){
             $scope.showLoading = false;//数据加载完成
             console.log(angular.toJson(result,true));
             $scope.items = result.applyResult.result;
             projectList = result.projectResult.result;
             passengerService.setPassengerList(result.passengerResult.result);
             if($scope.items.length == 0){//申请列表为空
               $scope.showData = false;
             }else if($scope.items.length>0 && $scope.items.length<5){//申请数量初始化时小于5则为全部加载完毕
               $scope.showData = true;
               $scope.scrollBusy = false;
             }else if($scope.items.length==5){//申请条目满5条则可以加载下一页
               $scope.showData = true;
               $scope.scrollBusy = true;
             }
           }else if(result.status == "E"){
             $scope.showLoading = false;
             hmsPopup.showVeryShortCenterToast("查询失败，机票查询接口异常");
           }
          }).error(function(err){
            $scope.showLoading = false;//数据加载完成
          });
        }
        $scope.createNewFlightApply=function(){//跳转到新建申请界面
          $state.go('tab.flight-ticket-search',{
            'projectList':projectList
          });
        };
        $scope.checkDetail=function(num){//跳转到申请详情界面
          $state.go('tab.flight-ticket-detail',{
            'detailInfo':$scope.items[num],
            'projectList':projectList
          });
        };
        $scope.loadMore=function(){//加载更多数据
          console.debug("触发加载更多");
          pageNumber++;
          var url=baseConfig.businessPath+"/ticket_apply_info/get_tickets_list";
          var param={
            "params":{
              p_employee_number: window.localStorage.empno,
              p_page_number:pageNumber
            }
          };
          hmsHttp.post(url,param).success(function(result){
            if(result.status == "S"){
              console.log(angular.toJson(result,true));
              var items = result.applyResult.result;
              if(items.length == 0){
                $scope.scrollBusy = false;
                hmsPopup.showVeryShortCenterToast("申请记录已全部加载完成");
              }else if(items.length>0){
                angular.forEach(items,function(data,index,array){//将后几页的新数据加入到列表数组中
                  $scope.items.push(array[index]);
                });
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');//无限滚动完成标志必须放在异步里，防止无限加载!
            }else if(result.status == "E"){
              hmsPopup.showVeryShortCenterToast("查询失败，机票查询接口异常");
            }
          }).error(function(err){
            $scope.scrollBusy = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        };
        $scope.judgeDepartureType=function(num){//将接口的single转为单程，double转为往返
          var type = $scope.items[num].departure_type;
          var result={
            text:"",
            double:""
          };
          if(type=="single"){
           result.text = "单程";
           result.double = false;
          }else if(type=="double"){
           result.text = "往返";
           result.double=true;
          }
          return result;
        };
        $scope.judgeFlightType = function(num){//判断是flyback机票/项目内机票，布尔型
          var type = $scope.items[num].flight_type;
          var result = {
            projectType:""
          };
          if(type == "项目内机票"){
            result.projectType = true;
          }else if(type == "flyback机票"){
            result.projectType = false;
          }
          return result;
        };
        $scope.judgeStatusIcon=function(num){//判断icon图标路径
         var param = $scope.items[num].apply_status;
         var result = "";
         if(param == "applied"){
           result = "build/img/application/flight-ticket/stamp-applied.png";
         }else if(param == "approved"){
           result = "build/img/application/flight-ticket/stamp-approved.png";
         }else if(param == "rejected"){
           result = "build/img/application/flight-ticket/stamp-rejected.png";
         }else if(param == "confirming"){
           result = "build/img/application/flight-ticket/stamp-confirming.png";
         }else if(param == "confirmed"){
           result = "build/img/application/flight-ticket/stamp-confirmed.png";
         }else if(param == "finished"){
           result = "build/img/application/flight-ticket/stamp-finished.png";
         }else if(param == "endorsing"){
           result = "build/img/application/flight-ticket/stamp-endorsing.png";
         }else if(param == "returned"){
           result = "build/img/application/flight-ticket/stamp-returned.png";
         }else if(param == "canceled"){
           result = "build/img/application/flight-ticket/stamp-canceled.png";
         }
          return result;
        };
        $scope.judgeOptionButton=function(num){//根据申请类型处理是否可以出现选项按钮，和控制选项按钮个数以及样式的function
          var param = $scope.items[num].apply_status;
          var result={
            swipeable:"",
            doubleButton:"",
            optionButtonStyle:{

            }
          }
          if(param == "applied" ){
            result.swipeable = true;
            result.doubleButton = true;
          }else if(param == "confirmed" || param == "approved"){
            result.swipeable = true;
            result.doubleButton = false;
            result.optionButtonStyle.height="100%";
            result.optionButtonStyle.top="0px";
          }else if(param=="rejected" || param=="confirming" || param == "finished" || param == "endorsing" || param == "returned" || param == "canceled"){
            result.swipeable = false;
            result.doubleButton = false;
          }
          return result;
        };
        $scope.getBack=function($event,num){//撤销申请
          $scope.scrollBusy = false;
          $event.stopPropagation(); //阻止事件冒泡
          $ionicListDelegate.closeOptionButtons();
          $timeout(function(){
            hmsPopup.confirm("确认撤销本条申请？","提示",function(){
              $scope.showLoading=true;
              var url=baseConfig.businessPath+"/ticket_apply_info/wfl_flyback_back";
              var param={
                "params":{
                 p_employee_number:window.localStorage.empno,
                 p_apply_detail_id:$scope.items[num].apply_detail_id
                }
              };
              hmsHttp.post(url,param).success(function(result){
                 $scope.showLoading=false;
                 if(result.status=="S"){
                   $ionicScrollDelegate.$getByHandle('applyScroll').scrollTop(false);
                   initApplyList();
                 }else if(result.status=="E"){

                 }
                 hmsPopup.showVeryShortCenterToast(result.returnMsg);
              }).error(function(err){
                $scope.showLoading=false;
              });
            });
          },200);
        };
        $scope.hurryDone=function($event,num){//催办
          $event.stopPropagation(); //阻止事件冒泡
          $ionicListDelegate.closeOptionButtons();
          $scope.showLoading=true;
          var url=baseConfig.queryPath+"/pushSms";
          var param={
            p_apply_detail:$scope.items[num].apply_detail_id
          };
          hmsHttp.post(url,param).success(function(result){
            $scope.showLoading=false;
            if(result.rows[0]=="success"){//success为调用成功
              hmsPopup.showVeryShortCenterToast("催办成功");
            }else if(result.rows[0]!="success"){//不为success则失败
              hmsPopup.showVeryShortCenterToast("催办失败，"+result.rows[0]);
            }
          }).error(function(err){
            $scope.showLoading=false;
          });
        };

        $scope.goCheckPassenger=function(){//跳转到乘机受益人界面
          $state.go("tab.flight-passenger-list");
        };
        $scope.goBack=function(){//返回按钮
          $ionicHistory.goBack();
        };
        $rootScope.$on("TICKET_APPLY_CREATED",function(){//新建成功后收到广播，自动刷新列表
          $scope.scrollBusy = false;//控制加载更多
          initApplyList();
          $timeout(function(){
              $ionicScrollDelegate.$getByHandle('applyScroll').scrollTop(false);
          },200);
        });
    }])
