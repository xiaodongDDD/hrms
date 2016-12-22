/**
 * Created by zaranengap on 2016/12/12.
 */
'use strict';
angular.module('clueModule')
  .controller('clueDetailDetailCtrl', [
    '$scope',
    'clueDetailDataService',
    'T',
    '$ionicScrollDelegate',
    function ($scope,
              clueDetailDataService,
              T,
              $ionicScrollDelegate) {

      $scope.titleList = {
        competitors: T.T('NEW_OPPORTUNITY.COMPETITORS'),
        customer: T.T('NEW_OPPORTUNITY.SELECT_CUSTOMER'),
        productTypeName: T.T('NEW_OPPORTUNITY.PRODUCT_TYPE'),
        clueStatus: T.T('NEW_CLUE.CLUE_STATE'),
        ownedIndustry: T.T('NEW_OPPORTUNITY.INDUSTRY'),
        customerContacts: T.T('NEW_OPPORTUNITY.SELECT_CUSTOMER_CONTACTS'),
        businessFrom: T.T('NEW_CLUE.SOURCE'),
        originalFactoryFrom: T.T('NEW_OPPORTUNITY.SOURCE_SOURCE'),
        prjBeginDate: T.T('NEW_OPPORTUNITY.START_DATE'),
        preSignDate: T.T('NEW_OPPORTUNITY.SIGN_DATE'),
        saleBelong: T.T('NEW_OPPORTUNITY.LONG_BELONG'),
        theCompany: T.T('CLUE.COMPANY_PROPERTY'),
        description: T.T('NEW_CLUE.CLUE_DESCRIPTION'),
        productName: T.T('NEW_OPPORTUNITY.COMPETITORS_PRODUCT'),
        advantage: T.T('NEW_OPPORTUNITY.COMPETITORS_OPPONENT'),
        otherDescription: T.T('NEW_OPPORTUNITY.OTHER_DESCRIPTION')
      };


      $scope.hideAreaFlag = [];

      $scope.hideArea = function(num){
        $scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
        $ionicScrollDelegate.$getByHandle("detailScroll").resize();
      };

      $scope.$on('REFRESH_DETAIL',function(){
        $scope.clue = clueDetailDataService.getClue();
        $scope.competitors = clueDetailDataService.getClue().competitors;
      });


      $scope.clue = clueDetailDataService.getClue();
      $scope.competitors = clueDetailDataService.getClue().competitors;


    }]);
