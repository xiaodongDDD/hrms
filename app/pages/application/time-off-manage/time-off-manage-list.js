/** Author      : joshua.shi
 *
 *  History:
 *      1.00    2016-5-28   joshua.shi   Creation
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage', {
          url: '/time-off-manage',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/time-off-manage/time-off-manage-list.html',
              controller: 'TimeOffManageCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')

  .controller('TimeOffManageCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    '$ionicHistory',
    'timeOffManageService',
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicHistory,
              timeOffManageService) {
      //只支持iOS和Android
      $scope.circleAnimationFlag = false;//数据未加载

      //为iOS平台增加status bar
      /*if (ionic.Platform.isIOS()) {
        angular.element('.platform-status-bar').css('height','20px');
        angular.element('.time-off-content').css('height','200px');
      }*/

      $scope.fetchDataFlag       = true;
      $scope.timeOffHeader       = {
        /*userId                 : 999,
        paidHoliday            : 9,
        paidSickLeave          : 9,
        extPaidHoliday         : 9,
        usedPaidHoliday        : 3,
        usedPaidSickLeave      : 3,
        usedExtPaidHoliday     : 3*/
      };

      $scope.timeOffHistoryList  =[{
     /* holidayIcon          : 'build/img/application/time-off-manage/PaidHoliday@3x.png',
        timeOffId            : '1231231',
        timeOffTypeClass     : 'paid-holiday',
        timeOffTypeMeaning   : '带薪年假',
        datetimeFrom         : '2016-6-16',
        datetimeTo           : '2016-6-18',
        timeLeave            : '2天',
        approveStatus        : 'APPROVED',
        approveStatusClass   : 'approved',
        approveStatusMeaning : '已审批',
        applyReason          : '陪老婆去迪斯尼玩',
        reason_image         : [
          {
            image_url1       : '',
            image_url2       : '',
            image_url3       : '',
            image_url4       : '',
            image_url5       : '',
            image_url6       : '',
            image_url7       : '',
            image_url8       : '',
            image_url9       : ''
          }
        ]*/
      }];

      function getServeData() {

        //hmsPopup.showPopup(window.screen.width);

        var requestUrl = baseConfig.businessPath + "/api_holiday/get_holidays_data";
        var requestParams = {
          "params": {
            "p_employee_code": window.localStorage.empno
          }
        };

        hmsHttp.post(requestUrl, requestParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {

            var baseImgUrl = 'build/img/application/time-off-manage/';

            //处理前置结构
            if(response.result[0]) {
              var responseData = response.result[0];
            }else{
              hmsPopup.showShortCenterToast("服务器返回结构解析错误!");
              return;
            }

            //将获取到的数据绑定到页面
            //赋值头数据
            $scope.timeOffHeader.paidHoliday        = responseData.paidHoliday;
            $scope.timeOffHeader.paidSickLeave      = responseData.paidSickLeave;
            $scope.timeOffHeader.extPaidHoliday     = responseData.extPaidHoliday;
            $scope.timeOffHeader.usedPaidHoliday    = responseData.usedPaidHoliday;
            $scope.timeOffHeader.usedPaidSickLeave  = responseData.usedPaidSickLeave;
            $scope.timeOffHeader.usedExtPaidHoliday = responseData.usedExtPaidHoliday;
            //赋值行数据
            $scope.timeOffHistoryList  = [];
            $scope.timeOffHistoryList = responseData.timeOffHistory;

            //1:带薪年假，2,额外福利年假，3:事假，4.带薪病假，5.病假，6.婚嫁，7.产假，8.丧假，9.陪产假
            angular.forEach($scope.timeOffHistoryList, function (data, index) {
              if ('带薪年假' == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'PaidHoliday@3x.png';
                data.timeOffTypeClass    = 'paid-holiday';
              } else if ('额外福利年假' == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'ExtPaidHoliday@3x.png';
                data.timeOffTypeClass    = 'ext-paid-holiday';
              } else if ('事假'    == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'CasualLeave@3x.png';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('带薪病假' == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'SickLeave@3x.png';
                data.timeOffTypeClass    = 'paid-sick-leave';
              } else if ('病假'    == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'SickLeave@3x.png';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('婚假'    == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'HoneyMood@3x.png';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('产假'    == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'MaternityLeave@3x.png';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('丧假'    == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'ExtPaidHoliday@3x.png';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('陪产假'  == data.timeOffTypeMeaning) {
                data.holidayIcon         = baseImgUrl + 'PaternityLeave@3x.png';
                data.timeOffTypeClass    = 'default-holiday';
              }

              //1.审批通过：APPROVED,2.审批中：APPROVING,3：审批拒绝：REJECTED,4.草稿：DRAFT
              if ('APPROVED'         == data.approveStatus) {
                data.approveStatusMeaning = '通过';
                data.approveStatusClass   = 'approved';
              } else if ('APPROVING' == data.approveStatus) {
                data.approveStatusMeaning = '审批中';
                data.approveStatusClass   = 'approving';
              } else if ('REJECTED'  == data.approveStatus) {
                data.approveStatusMeaning = '拒绝';
                data.approveStatusClass   = 'rejected';
              } else if ('DRAFT'     == data.approveStatus) {
                data.approveStatusMeaning = '草稿';
                data.approveStatusClass   = 'draft';
              } else if ('REVOKING'     == data.approveStatus) {
                data.approveStatusMeaning = '撤销中';
                data.approveStatusClass   = 'revoking';
              } else if ('REVOKED'     == data.approveStatus) {
                data.approveStatusMeaning = '已撤销';
                data.approveStatusClass   = 'revoked';
              }

              //加上'天'后缀
              data.timeLeave = data.timeLeave + '天';
            });

            $scope.circleAnimationFlag = true;//数据加载完成标志,触发进度圈动画
            $scope.fetchDataFlag       = false;//数据加载完成,设置数据加载标记隐藏

          } else {
            if (response.status === 'E' || response.status == 'e') {
              hmsPopup.showShortCenterToast("没有相关数据!");
            } else {
              hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
            }
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };

      //处理休假信息,根据审批状态来判断对应操作
      $scope.processTimeOff = function (item) {

        var timeOffData = {};

        if (item.approveStatus == 'APPROVING' || item.approveStatus == 'APPROVED') {
          timeOffData.operationType       = 'revoke';
        } else if(item.approveStatus == 'DRAFT') {
          timeOffData.operationType       = 'update';
        } else {
          timeOffData.operationType       = 'query';
        }

        timeOffData.paidHoliday    = $scope.timeOffHeader.paidHoliday;
        timeOffData.paidSickLeave  = $scope.timeOffHeader.paidSickLeave;
        timeOffData.extPaidHoliday = $scope.timeOffHeader.extPaidHoliday;

        if (item.timeOffTypeMeaning == '带薪年假') {
          timeOffData.unusedHoliday = timeOffData.unusedPaidHoliday
        } else if (item.timeOffTypeMeaning == '带薪病假') {
          timeOffData.unusedHoliday = timeOffData.unusedPaidSickLeave
        } else if (item.timeOffTypeMeaning == '额外福利年假') {
          timeOffData.unusedHoliday = timeOffData.unusedExtPaidHoliday;
        } else {
          timeOffData.unusedHoliday = '0';
        }

        timeOffData.timeOffId           = item.timeOffId;
        timeOffData.timeOffTypeMeaning  = item.timeOffTypeMeaning;
        timeOffData.datetimeFrom        = item.datetimeFrom;
        timeOffData.datetimeTo          = item.datetimeTo;
        timeOffData.timeLeave           = item.timeLeave;
        timeOffData.applyReason         = item.applyReason;
        timeOffData.approveStatus       = item.approveStatus;

        $state.go("tab.time-off-manage-detail", {timeOffData : timeOffData});
      };

      //执行创建休假动作
      $scope.timeOffCreate = function(){

        var timeOffData = {};

        timeOffData.operationType  = 'create';

        timeOffData.paidHoliday    = $scope.timeOffHeader.paidHoliday;
        timeOffData.paidSickLeave  = $scope.timeOffHeader.paidSickLeave;
        timeOffData.extPaidHoliday = $scope.timeOffHeader.extPaidHoliday;
        timeOffData.unusedHoliday = '0';

        timeOffData.timeOffTypeMeaning  = '';
        timeOffData.datetimeFrom         = '';
        timeOffData.datetimeTo           = '';
        timeOffData.timeLeave            = '';
        timeOffData.applyReason          = '';

        $state.go("tab.time-off-manage-detail", {timeOffData : timeOffData});
      };

      $scope.$on('$ionicView.beforeEnter', function () {

        if (timeOffManageService.getRefreshWorkflowList().flag == true) {
          timeOffManageService.setRefreshTimeOffList(false);
          if (baseConfig.debug) {
            console.log('refresh time off list');
          }
          getServeData();
        }
      });

      getServeData();
    }]);


angular.module('applicationModule')
  .service('timeOffManageService',
  ['hmsHttp',
    'baseConfig',
    'hmsPopup',
    function (hmsHttp,
              baseConfig,
              hmsPopup) {
      var refreshTimeOffList = {
        flag: false
      };

      this.setRefreshTimeOffList = function (flag) {
        refreshTimeOffList.flag = flag;
      };

      this.getRefreshWorkflowList = function () {
        return refreshTimeOffList;
      };

      this.getLeaveDays = function (myscope,policyitemId,dateFrom,dateTo) {
        hmsPopup.showLoading("处理休假申请中");

        var url = baseConfig.businessPath + "/api_holiday/get_holiday_days";
        var params = {
          "params": {
            "p_policyitem_id": policyitemId,
            "p_date_from": dateFrom,
            "p_date_to": dateTo
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          hmsPopup.hideLoading();
          if(result.returnCode == 'S') {
            myscope.timeOffData.timeLeave = result.holiday_days;
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
    }]);
