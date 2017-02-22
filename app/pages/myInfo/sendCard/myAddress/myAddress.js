/**
 * Created by wkh on 2017/2/21.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.myAddress', {
        url: '/myInfo/sendCard/printCard/myAddress',
        params: {},
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/sendCard/myAddress/myAddress.html',
            controller: 'myAddressCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('myAddressCtrl', myAddressCtrl);

  myAddressCtrl.$inject = [
    '$scope',
    '$ionicModal',
    '$rootScope'
  ];

  function myAddressCtrl($scope,
                         $ionicModal,
                         $rootScope) {
    var vm = this;
    $scope.data={
      name:"测试",
      title:"测试"
    };
    $scope.myAddress=[
      {
        "name":"叶华",
        "phone":"18335103739",
        "address":'上海市青浦区汇联路33号汉得信息A栋楼407室',
        "isImportant":"Y"
      },
      {
        "name":"白素",
        "phone":"18651432388",
        "address":'天津市东丽区保税区空港国际经济区 神州租车-空港上午园B座E11',
        "isImportant":"N"
      },
      {
        "name":"叶华",
        "phone":"18335103739",
        "address":'上海市青浦区汇联路33号汉得信息A栋楼407室',
        "isImportant":"N"
      }
    ];
    $ionicModal.fromTemplateUrl('build/pages/myInfo/sendCard/addAddress/addAddress.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.addAddressModel = modal;
    });
    $scope.goAddAddress=function(){
      $scope.addAddressModel.show();
    };
    $rootScope.$on('CLOSE_ADDRESS_ADD',function(){
      console.log("CLOSE_ADDRESS_ADD");
      $scope.addAddressModel.hide();
    });
  }
})();

