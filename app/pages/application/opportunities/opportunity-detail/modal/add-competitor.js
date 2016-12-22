/**
 * Created by zaranengap on 2016/12/9.
 */
angular.module('opportunityModule')
  .controller('OpportunityAddCompetitorCtrl', [
    '$scope',
    'baseConfig',
    '$state',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$ionicModal',
    'T',
    'opportunityAddService',
    'opportunityDetailDataService',
    function($scope,
             baseConfig,
             $state,
             hmsPopup,
             $ionicScrollDelegate,
             $ionicModal,
             T,
             opportunityAddService,
             opportunityDetailDataService) {

      $scope.titleList = {
        competitors: T.T('NEW_OPPORTUNITY.COMPETITORS'),
        productName: T.T('NEW_OPPORTUNITY.COMPETITORS_PRODUCT'),
        advantage: T.T('NEW_OPPORTUNITY.COMPETITORS_OPPONENT'),
        otherDescription: T.T('NEW_OPPORTUNITY.OTHER_DESCRIPTION')
      };

      $scope.newCompetitor = {
        fullName : "",
        advantage :	"",
        competitorId :	"",
        description	:	"",
        opportunityId :	-9999,
        productName : ""
      };

      //通用选择框
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.selectModal = modal;
      });

      Array.prototype.clone=function(){
        return [].concat(this);
      };

      function cloneObj(obj){
        var o, obj;
        if (obj.constructor == Object){
          o = new obj.constructor();
        }else{
          o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
          if ( o[key] != obj[key] ){
            if ( typeof(obj[key]) == 'object' ){
              o[key] = cloneObj(obj[key]);
            }else{
              o[key] = obj[key];
            }
          }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
      }

      var getCompetitorSuccess = function(response){
        $scope.showCrmLoading = false;
        $scope.moreDataCanBeLoaded = response.competitor_list.length == $scope.pageSize;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.competitor_list);
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getCompetitorResultSuccess = function(response){
        var flag = false;
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S'){
          $scope.items = [];
          for(var i = 0; i < response.search_result.length; i++){
            if(response.search_result[i].type == "HCRM_COMPETITOR"){
              $scope.items.push(response.search_result[i]);
              flag = true;
            }
          }
          $scope.moreDataCanBeLoaded = ($scope.items.length % $scope.pageSize == 0) && flag;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.nowSelectTarget.showKey = 'fullName';
          $scope.nowSelectTarget.dataKey = 'value';
        }
      };

      $scope.nowPage = 1;
      $scope.pageSize = 15;

      $scope.nowSelectTarget = {
        'key' : 'competitor',
        'interface' :  opportunityAddService.getCompetitor,
        'params' : [getCompetitorSuccess, $scope.nowPage, $scope.pageSize],
        'showKey' : 'fullName',
        'dataKey' : 'competitorId',
        'dataModel' : '$scope.newCompetitor.competitorId',
        'showDataModel' : '$scope.newCompetitor.fullName',
        'searchInterface' : opportunityAddService.searchCompetitor,
        'searchParams' : getCompetitorResultSuccess,
        'needShowMore' : true
      };

      $scope.searchModel = {
        searchValueKey: ''
      };

      $scope.hideModal = function(){
        $scope.$emit('CLOSE_COMPETITOR');
      };

      $scope.showSelect = false;

      $scope.showSelectDiv = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        $scope.moreDataCanBeLoaded = false;
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        $scope.showSelect = !$scope.showSelect;
        if(!$scope.showSelect){
          $scope.selectModal.hide();
          return ;
        }
        $scope.opportunity = opportunityDetailDataService.getOpportunity();
        $scope.competitors = $scope.opportunity.competitors;
        $scope.selectModal.show();
        var showKey = $scope.nowSelectTarget['showKey'];
        var dataKey = $scope.nowSelectTarget['dataKey'];
        eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
        $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
        $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      };

      $scope.loadMore = function() {
        $scope.nowPage++;
        for(var i = 0; i < $scope.nowSelectTarget.params.length; i++){
          if($scope.nowSelectTarget.params[i] == $scope.nowPage - 1){
            $scope.nowSelectTarget.params[i] = $scope.nowPage;
            break;
          }
        }
        if($scope.searchModel.searchValueKey != ''){
          $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
        } else
          $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      };

      $scope.selectItem = function($index){
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        for(var i = 0; i < $scope.competitors.length; i++) {
          if($scope.competitors[i].competitorId == data){
            hmsPopup.showPopup('已添加过该竞争对手！请重新选择');
            return ;
          }
        }
        var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        showKey = (showKey == '空') ? "" : showKey;
        var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
        var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
        eval(dataModel + " = data");
        eval(showDataModel + " = showKey");
        $scope.showSelectDiv();
      };

      $scope.searchSelectValue = function(){
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        $scope.showCrmLoading = true;
        $scope.moreDataCanBeLoaded = false;
        if($scope.searchModel.searchValueKey == ''){
          $scope.items = [];
          $scope.nowPage = 1;
          $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
          $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
        } else{
          $scope.items = [];
          $scope.nowPage = 1;
          $scope.pageSize = 15;
          $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
        }
      };

      $scope.clearSelectFilter = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
      };

      var addCompetitorSuccess = function(response){
        if(response.returnCode == 'S'){
          $scope.newCompetitor = {
            fullName : "",
            advantage :	"",
            competitorId :	"",
            description	:	"",
            opportunityId :	-9999,
            productName : ""
          };
          $scope.$emit('COMPETITOR_ADD_SUCCESS');
        }
        hmsPopup.showPopup(response.returnMsg);
      };

      $scope.addCompetitor = function(){
        if($scope.newCompetitor.competitorId == ''){
          hmsPopup.showPopup('竞争对手名称不能为空');
          return ;
        }
        if($scope.newCompetitor.productName == ''){
          hmsPopup.showPopup('竞争产品不能为空');
          return ;
        }
        if($scope.newCompetitor.advantage == ''){
          hmsPopup.showPopup('对手优势不能为空');
          return ;
        }
        $scope.competitors.push($scope.newCompetitor);
        var params = {
          opportunityId: $scope.opportunity.opportunityId,
          opportunityCode: $scope.opportunity.opportunityCode,
          fullName: $scope.opportunity.opportunityName,
          customerId: $scope.opportunity.customerId,
          customersContactsId: $scope.opportunity.customersContactsId,
          opportunityStatus: $scope.opportunity.opportunityStatus
        };
        opportunityAddService.updateOpportunities(addCompetitorSuccess, params, $scope.competitors);
      }


    }]);
