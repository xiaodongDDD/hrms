/**
 * Created by shishun on 16/5/22.
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
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {

      $scope.timeOffRecord ={
        timeOffHeader : {
          userId                 : 2201,
          paidHoliday            : 10,
          paidSickLeave          : 10,
          extPaidHoliday         : 20,
          usedPaidHoliday        : 5,
          usedPaidSickLeave      : 2,
          usedExtPaidHoliday     : 0
        },
        timeOffHistoryList      : [
          {
            holidayIcon          : '',
            timeOffTypeCode      : 'paid-holiday',
            timeOffTypeMeaning   : '带薪年假',
            datetimeFrom         : '2016-6-16',
            datetimeTo           : '2016-6-18',
            timeLeave            : 2,
            approveStatusCode    : 'APPROVED',
            approveStatusMeaning : 'APPROVED',
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
          }
        ]
      };
      $scope.timeOffCreate = function(){

      }

    }]);
