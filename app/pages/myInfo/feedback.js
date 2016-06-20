/**
 * Created by LeonChan on 2016/6/17.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.feedback', {
          url: '/feedback',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/feedback.html',
              controller: 'FeedbackCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('FeedbackCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup) {

      $scope.qualityIssue=[false,false,false,false];//反馈问题类型样式
      $scope.feedbackInfo={//反馈信息
        info:""
      }
      $scope.selectQualityIssue=function(num){//选择反馈问题类型
        angular.forEach($scope.qualityIssue,function(data,index,array){
          array[index]=false;
        });
        $scope.qualityIssue[num]=true;
      }
      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      }

      $scope.commit=function(){//提交反馈
        var i=0;
        angular.forEach($scope.qualityIssue,function(data,index,array){
          if(array[index]==false){
            i++;
          }
        });
        if(i==$scope.qualityIssue.length){
          hmsPopup.showShortCenterToast('请选择反馈问题类型');
        }else if($scope.feedbackInfo.info==""){
          hmsPopup.showShortCenterToast('请填写产品质量问题反馈');
        }
      }
    }])
