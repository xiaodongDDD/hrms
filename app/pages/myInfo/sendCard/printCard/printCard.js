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
      .state('tab.printCard', {
        url: '/myInfo/sendCard/printCard',
        params: {
          params:{}
        },
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/sendCard/printCard/printCard.html',
            controller: 'printCardCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('printCardCtrl', printCardCtrl);

  printCardCtrl.$inject = [
    '$scope',
    '$state',
  '$stateParams',
    'sendCardService'];

  function printCardCtrl($scope,
                          $state,
                         $stateParams,
                         sendCardService) {
    var vm = this;
    var cardId=$stateParams.params.card_id;
    console.log($stateParams.params);
    var getSingleCardSuccess=function(result){
      $scope.cardDetail=result;
    };

    sendCardService.getSingleCard(getSingleCardSuccess,cardId);
    //减少件数
    $scope.subOty = function (x) {
      //var coefficient = x.coefficient;//吨件系数
      //
      //if (x.qtydun == false) {
      //  if(x.order_qty_unit ==0){
      //    Prompter.showShortCenterToast("件数不能为负数!");
      //    return;
      //  }
      //  x.order_qty_unit = Number(x.order_qty_unit) - 1;
      //  // x.order_qty_dun = (x.order_qty_dun - 1*coefficient).toFixed(2);
      //  x.order_qty_dun =(x.item_width*x.order_qty_unit*parseFloat(coefficient)/1000).toFixed(2);
      //} else {
      //  if(x.order_qty_dun ==0){
      //    Prompter.showShortCenterToast("吨数不能为负数!");
      //    return;
      //  }
      //  x.order_qty_dun = Number(x.order_qty_dun) - 1;
      //  // x.order_qty_unit = Math.ceil(x.order_qty_unit-(1/coefficient));
      //  x.order_qty_unit = ((x.order_qty_dun*1000)/(x.item_width*parseFloat(coefficient))).toFixed(2);
      //}

    };

    $scope.addOty = function (x) {
      //var coefficient = x.coefficient;//吨件系数
      //console.log("coefficient:"+coefficient);
      //
      //if (x.qtydun == false) {
      //  x.order_qty_unit = Number(x.order_qty_unit) + 1;
      //  // x.order_qty_dun =x.order_qty_unit*parseFloat(coefficient);
      //  x.order_qty_dun =(x.item_width*x.order_qty_unit*parseFloat(coefficient)/1000).toFixed(2);
      //  console.log("x.order_qty_dun = "+x.order_qty_dun);
      //  if(x.order_qty_unit>(1+CONTRACT_TOLERANCE)* x.contract_unit_qty){
      //    x.order_qty_unit=1;
      //    Prompter.showShortCenterToast("超过合同余量，请重新选择");
      //  }
      //} else {
      //  x.order_qty_dun = Number(x.order_qty_dun) + 1;
      //  // x.order_qty_unit = Math.ceil(x.order_qty_dun/parseFloat(coefficient));
      //  x.order_qty_unit = ((x.order_qty_dun*1000)/(x.item_width*parseFloat(coefficient))).toFixed(2);
      //  if(x.order_qty_dun>(1+CONTRACT_TOLERANCE)* x.contract_dun_qty){
      //    x.order_qty_dun=1;
      //    Prompter.showShortCenterToast("超过合同余量，请重新选择")
      //  }
      //}
    };
    $scope.chooseAddress=function(){
      //$state.go("tab.myAddress");
      $state.go("tab.myAddress");
    };
    //vm.ORCode=ORCode;
    //function ORCode(){
    //  console.log("===");
    //}
  }
})();
