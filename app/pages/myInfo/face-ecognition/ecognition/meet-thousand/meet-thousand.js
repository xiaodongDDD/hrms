/**
 * Created by bobo on 2016/12/27.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);
  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition-meetThousand', {
        url: '/myInfo/face-ecognition-meetThousand',
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/ecognition/meet-thousand/meet-thousand.html',
            controller: 'faceEcognitionMeetThousandCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }
  angular
    .module('myInfoModule')
    .controller('faceEcognitionMeetThousandCtrl', faceEcognitionMeetThousandCtrl);
    function faceEcognitionMeetThousandCtrl($scope,
                                            $state,
                                            $ionicHistory,
                                            baseConfig,
                                            $stateParams,
                                            hmsPopup,
                                            hmsReturnView,
                                            hmsHttp,
                                            $ionicScrollDelegate) {
      var vm = this;
      vm.isStart=true;//年会是否开始---默认false
      vm.headPortrait='';//头像
      vm.isTopScorll=false;//排行榜是否上滑 默认false
      vm.isRank=true; //点击 排行榜true 我的互粉false
      vm.fansStatus=0;//区分粉 状态 0：互粉  1：粉我的
      //界面元素属性设置
      vm.colorFansTabArr=['active-color','un-active-color','un-active-color',0];
      vm.colorTabsArr=['active-color','un-active-color',0];
      vm.colorAddressArr=[
        'active-color',
        'un-active-color',
        'un-active-color',
        'un-active-color',
        'un-active-color',
        'un-active-color',
        'un-active-color',0];
      vm.top={
       'top':'239px'
      };
      vm.titleClass='default-title';
      vm.addressClass='default-address';


      var intersectionArr=[];//互粉
      var followerArr=[];//粉我的
      var followingArr=[];//我的关注
      /*---界面展示信息--*/
      vm.summaryInfo=null;
      vm.headPortrait=window.localStorage.myInfoImg;//头像
      vm.fansList=[];
      vm.topInfo=null;
      vm.topOtherInfo=[];//非前三

      /*--请求初始参数信息--*/
      //follower我的粉丝    following我的关注    intersection我的互粉
      var queryRelationParams={
          page:1,
          pageSize:10,
          type:''
      };

      var topInfoParams={
          pageSize:20,
          area:''
      };

      /*--请求--*/
      vm.getSummaryInfo=getSummaryInfo;//获取概要信息
      vm.getTopInfo=getTopInfo;//获取总排行榜
      vm.queryRelation=queryRelation;//根据关注关系获取信息


      vm.goBack=goBack;
      vm.rankUp=rankUp;
      vm.rankDown=rankDown;
      vm.rankingMutualFans=rankingMutualFans;
      vm.fansTab=fansTab;
      vm.addressTab=addressTab;
      vm.faceScanner=faceScanner;


      getSummaryInfo();
      addressTab(0);
      fansTab(0);//默认互粉
      rankingMutualFans(0);//界面默认 我的互粉


     //获取概要信息
      function getSummaryInfo() {
        var param='';
        var url=baseConfig.queryPath +'/annualMeeting/summary';
        console.log(url);
        hmsHttp.post(url,param).success(function (result) {
          console.log(result.rows[0])
          vm.summaryInfo=result.rows[0];
        }).error(function (err,status) {
          console.log(err);
          console.log(status)
        })
      }

      //获取总排行榜
      function getTopInfo(area) {
        topInfoParams.area=area;
        var url=baseConfig.queryPath +'/annualMeeting/top';
        console.log(url);
        hmsHttp.post(url,topInfoParams).success(function (result) {
          // console.log('总排行前20:'+angular.toJson(result));
          vm.topInfo=result.rows[0];
          vm.topOtherInfo=result.rows[0].topList.slice(3);
          console.log(vm.topInfo)
        }).error(function (err,status) {
          console.log(err);
          console.log(status)
        })
      }

      //根据不同的关注关系获取详细列表
      function queryRelation(type) {
        console.log(type);
        queryRelationParams.type=type;
        console.log(queryRelationParams);
        var url=baseConfig.queryPath +'/annualMeeting/queryRelation';
        hmsHttp.post(url,queryRelationParams).success(function (result) {
          console.log(url)
          console.log(result);
          vm.fansList= result.rows
        }).error(function (err,status) {
          console.log(err);
          console.log(status)
        })
      }





      //返回上级菜单
      function goBack() {
        hmsReturnView.returnToState('tab.face-ecognition-setting');
      }

      //点击我的互粉 排行榜
      function rankingMutualFans(num) {

        var index=vm.colorTabsArr[2];
        if(num!=vm.colorTabsArr[2]){
          vm.colorTabsArr[num]='active-color';
          vm.colorTabsArr[index]='un-active-color';
          vm.colorTabsArr[2]=num;
        }
        if(num==0){
          vm.isRank=true;
          vm.isTopScorll=false;

          vm.headHeight='default-height';
          vm.top={
            'top':'239px'
          };
          vm.addressClass='default-address';
          $ionicScrollDelegate.resize();
        }else {
          vm.isRank=false;
          vm.isTopScorll=false;
          vm.headHeight='fans-height';
          vm.titleClass='default-title';
          vm.top={
            'top':'186px'
          };
          $ionicScrollDelegate.resize();
        }


      }

      function fansTab(num) {
        var index=vm.colorFansTabArr[3];
        if(num!=vm.colorFansTabArr[3]){
          vm.colorFansTabArr[num]='active-color';
          vm.colorFansTabArr[index]='un-active-color';
          vm.colorFansTabArr[3]=num;
        }
        vm.fansStatus=num;
        if(num==0){

          queryRelation('intersection');
        }else if(num==1){
          queryRelation('follower');
        }else{
          queryRelation('following');
        }
      }

      function addressTab(num) {
        console.log(num);
        var address=['ALL','SH','BJ','GZ','CD','WH','XA'];
        var index=vm.colorAddressArr[7];
        if(num!=vm.colorAddressArr[7]){
          vm.colorAddressArr[num]='active-color';
          vm.colorAddressArr[index]='un-active-color';
          vm.colorAddressArr[7]=num;
        }
        getTopInfo(address[num]);

      }

      function rankUp() {
        if(vm.isRank&&vm.isStart){
          vm.isTopScorll=true;
          vm.top='up-scroll-top';
          vm.headHeight='rank-up-height';
          vm.top={
            'top':'0px'
          };
          vm.titleClass='active-title';
          vm.addressClass='active-address';
        }
        $ionicScrollDelegate.resize();
      }
      function rankDown() {
        if(vm.isRank){
          vm.isTopScorll=false;
          vm.top='default-top';
          vm.headHeight='default-height';
          vm.top={
            'top':'239px'
          };
          vm.titleClass='default-title';
          vm.addressClass='default-address';
        }
        $ionicScrollDelegate.resize();
      }

      function faceScanner() {
        // $state.go('tab.face-ecognition-face-affirm')
        hmsPopup.showShortCenterToast('等等。。。');
      }
    }
})();
