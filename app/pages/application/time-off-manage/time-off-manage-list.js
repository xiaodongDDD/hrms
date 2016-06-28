/** Author      : joshua.shi
 *
 *  History:
 *      1.00    2016-4-28   joshua.shi   Creation
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage', {
          url: '/time-off-manage',
          views: {
            'tab-application': {
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
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicHistory) {
      //只支持iOS和Android
      $scope.isIOSPlatform = ionic.Platform.isIOS();

      $scope.timeOffHeader       ={
        userId                 : 999,
        paidHoliday            : 9,
        paidSickLeave          : 9,
        extPaidHoliday         : 9,
        usedPaidHoliday        : 9,
        usedPaidSickLeave      : 9,
        usedExtPaidHoliday     : 9
      };

      $scope.timeOffHistoryList  =[{
        holidayIcon          : 'build/img/application/time-off-manage/PaidHoliday@3x.png',
        timeOffType          : '1',
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
            image_url9       : '',
          }
        ]
      }];


      $scope.timeOffCreate = function(){

      }


      function getServeData() {

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
              if ('1' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'PaidHoliday@3x.png';
                data.timeOffTypeMeaning  = '带薪年假';
                data.timeOffTypeClass    = 'paid-holiday';
              } else if ('2' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'ExtPaidHoliday@3x.png';
                data.timeOffTypeMeaning  = '额外福利年假';
                data.timeOffTypeClass    = 'ext-paid-holiday';
              } else if ('3' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'CasualLeave@3x.png';
                data.timeOffTypeMeaning  = '事假';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('4' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'SickLeave@@3x.png';
                data.timeOffTypeMeaning  = '带薪病假';
                data.timeOffTypeClass    = 'paid-sick-leave';
              } else if ('5' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'SickLeave@3x.png';
                data.timeOffTypeMeaning  = '病假';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('6' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'HoneyMood@3x.png';
                data.timeOffTypeMeaning  = '婚假';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('7' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'MaternityLeave@3x.png';
                data.timeOffTypeMeaning  = '产假';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('8' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'ExtPaidHoliday@3x.png';
                data.timeOffTypeMeaning  = '丧假';
                data.timeOffTypeClass    = 'default-holiday';
              } else if ('9' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'PaternityLeave@3x.png';
                data.timeOffTypeMeaning  = '陪产假';
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
              }

              //加上'天'后缀
              data.timeLeave = data.timeLeave + '天';
            });


          } else {
            if (response.status === 'E' || response.status == 'e') {
              hmsPopup.showShortCenterToast("没有相关数据!");
            } else {
              hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
            }
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
        });
      };

      getServeData();
    }]);
