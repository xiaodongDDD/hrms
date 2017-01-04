/**
 * Created by bobo on 2016/12/30.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);
  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition-face-affirm', {
        url: '/myInfo/face-ecognition-face-affirm',
        params:{
          confidence:'',
          name:'',
          gender:'',
          person_id:''
        },
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/ecognition/face-affirm/face-affirm.html',
            controller: 'faceAffirmCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }
  angular
    .module('myInfoModule')
    .controller('faceAffirmCtrl', faceAffirmCtrl);
    function faceAffirmCtrl($scope,
                            $state,
                            $ionicHistory,
                            baseConfig,
                            $stateParams,
                            hmsPopup,
                            hmsReturnView,
                            hmsHttp,
                            $ionicScrollDelegate) {
      var vm=this;
      vm.info={};

      vm.createNewFocus=createNewFocus;
      vm.goBack=goBack;


      $scope.$on('$ionicView.enter', function (e) {
        vm.info.name=$stateParams.name;
        vm.info.gender=$stateParams.gender;
        vm.info.person_id=$stateParams.person_id;
        vm.info.confidence=$stateParams.confidence;
      });




      function goBack() {
        $ionicHistory.goBack();
      }

      //新增关注
      function createNewFocus(empNo) {
       /* alert(empNo);*/
        var params={
          idolNo:empNo
        };
        var url=baseConfig.queryPath +'/annualMeeting/create';
        hmsHttp.post(url,params).success(function (result) {
          /*  alert(angular.toJson(result));*/
            if(result.success){
              goBack();
            }else{
              hmsPopup.showPopup('不可以粉自己哦~');
              goBack();
            }

        }).error(function (err,status) {
          console.log(err);
          console.log(status)
        })
      }

    }
})();
