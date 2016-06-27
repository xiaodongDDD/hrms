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
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup) {

      if(baseConfig.debug){
        console.log('myInfoCtrl.enter');
      }
      $scope.personalInfo="";
      $scope.defaultPortrait="build/img/myInfo/man-portrait.png";
      var url=baseConfig.businessPath + "/api_employee/get_employee_code";//获取用户信息
      var param={
         "params":{
           "p_employee_code":window.localStorage.empno
         }
      };
      hmsPopup.showLoading('请稍候');
      hmsHttp.post(url,param).success(function (result) {
        hmsPopup.hideLoading();
        var message=result.message;
        if(result.status=="S"){
          $scope.personalInfo=result.result;
          if($scope.personalInfo.gender=="男"){//根据性别判定头像男女
            $scope.defaultPortrait="build/img/myInfo/man-portrait.png";
          }else if($scope.personalInfo.gender=="女"){
            $scope.defaultPortrait="build/img/myInfo/woman-portrait.png";
          }
        }else if(result.status=="E"){
          hmsPopup.showShortCenterToast(message);
        }
        if (baseConfig.debug) {
          console.log("result success " + angular.toJson(result));
        }
      }).error(function(err,status){
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast("网络连接出错");
      });
      $scope.logout = function(){//注销登录
        window.localStorage.token = "";
        window.localStorage.password = "";
        window.localStorage.timesheetAuto="";
        window.localStorage.messagePush="";
        $state.go('login');
      };

      $scope.setup=function(){//进入设置界面
        $state.go('tab.setup');
      };

      $scope.feedback=function(){//进入反馈界面
        $state.go('tab.feedback');
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
          nextProject:info.next_project
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

      $scope.$on('$destroy', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$destroy');
        }
      });
    }]);
