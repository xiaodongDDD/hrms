/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    'checkVersionService',
    '$ionicHistory',
    '$rootScope',
    '$http',
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup,
              checkVersionService,
              $ionicHistory,
              $rootScope,
              $http) {
      if(baseConfig.debug){
        console.log('myInfoCtrl.enter');
      }
      $scope.currentVersion =  baseConfig.version.currentversionName || '-' || baseConfig.version.currentSubVersion; // 获得当前版本号
      $scope.personalInfo="";
      $scope.showLoading=true;//默认显示loading
      var portraitBackground = document.getElementById('portrait-image');
      //$scope.defaultPortrait="build/img/myInfo/man-portrait.png";
      $scope.defaultPortrait="";
      var url=baseConfig.businessPath + "/api_employee/get_employee_code";//获取用户信息
      var param={
         "params":{
           "p_employee_code":window.localStorage.empno
         }
      };
      hmsHttp.post(url,param).success(function (result) {
        $scope.showLoading=false;
        var message=result.message;
        if(result.status=="S"){
          $scope.personalInfo=result.result;
          if($scope.personalInfo.avatar!=""){
            $scope.defaultPortrait=$scope.personalInfo.avatar;
            portraitBackground.style.backgroundImage="url('"+$scope.personalInfo.avatar+"')";
          }else if($scope.personalInfo.avatar==""){
            if($scope.personalInfo.gender=="男"){//根据性别判定头像男女
              $scope.defaultPortrait="build/img/myInfo/man-portrait.png";
            }else if($scope.personalInfo.gender=="女"){
              $scope.defaultPortrait="build/img/myInfo/woman-portrait.png";
            }
          }
        }else if(result.status=="E"){
          hmsPopup.showShortCenterToast(message);
        }
        if (baseConfig.debug) {
          console.log("result success " + angular.toJson(result));
        }
      }).error(function(err,status){
        $scope.showLoading=false;
        //hmsPopup.showShortCenterToast("网络连接出错");
      });
      $scope.logout = function(){//注销登录
        window.localStorage.token = "";
        window.localStorage.password = "";
        window.localStorage.checkboxSavePwd = "";
        window.localStorage.timesheetAuto="";
        window.localStorage.messagePush="";
        window.localStorage.access_token = "";
        $state.go('login');
      };

      $scope.setup=function(){//进入设置界面
        $state.go('tab.setup');
      };

      $scope.feedback=function(){//进入反馈界面
        $state.go('tab.feedback');
      };

      $scope.checkCertificate=function(){
        $state.go('tab.my-certificate');
      };

      $scope.checkVersion=function(){//点击版本信息
        var param="MY_INFO";
        checkVersionService.checkAppVersion(param);
      };

      $scope.nextTime=function(){
        hmsPopup.showPopup("本功能下一版本上线");
      };

      $scope.checkHelp=function(){
        var helpUrl="http://g.eqxiu.com/s/sRGxXCQn";
        var ref = window.open(helpUrl, '_system', 'location=yes');
      };

      $scope.checkMyInfo=function(){//进入查看我的信息界面
        var info=$scope.personalInfo;
        var param={
          employeeNumber:info.employee_number,
          name:info.name,
          englishName:info.english_name,
          department:info.department,
          position:info.position,
          level:info.level,
          email:info.email,
          baseland:info.baseland,
          socialToolNumber:info.social_tool_number,
          telephoneNumber:info.telephone_number,
          phoneNumber:info.phone_number,
          passport:info.passport,
          drivingLicense:info.driving_license,
          healthInsuranceNumber:info.health_insurance_number,
          publicReserveFundsNumber:info.public_reserve_funds_number,
          regularDate:info.regular_date,
          internshipStartDate:info.internship_start_date,
          entryDate:info.entry_date,
          probationaryPeriod:info.probationary_period,
          firstWorkingDay:info.first_working_day,
          stuffStatus:info.stuff_status,
          nextProject:info.next_project,
          gender:info.gender,
          avatar:info.avatar
        };
        $state.go('tab.my-info-detail',{
          'myDetailInfo':param
        });
      };

      $scope.$on('$ionicView.enter', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$ionicView.loaded',function(e){
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$ionicView.loaded');
        }
      });

      $scope.$on('$destroy', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$destroy');
        }
      });
    }]);
