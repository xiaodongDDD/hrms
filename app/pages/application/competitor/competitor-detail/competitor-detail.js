/**
 * Created by ZaraNengap on 2016/11/18.
 */
angular.module('competitorModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.competitor-detail', {
          url: '/competitor-detail',
          params:{
            param:{}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/competitor/competitor-detail/competitor-detail.html',
              controller: 'CompetitorDetailCtrl'
            }
          }
        })
    }]);

angular.module('competitorModule')
  .controller('CompetitorDetailCtrl', [
    '$scope',
    '$state',
    'publicMethod',
    '$ionicHistory',
    '$timeout',
    '$stateParams',
    'competitorDetailService',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$rootScope',
    function($scope,
             $state,
             publicMethod,
             $ionicHistory,
             $timeout,
             $stateParams,
             competitorDetailService,
             hmsPopup,
             $ionicScrollDelegate,
             $rootScope) {
      $rootScope.$broadcast("REFRESH_CUSTOMER_HISTORY");
      $scope.goBack = function(){
        $ionicHistory.goBack();
      };
      console.log($ionicHistory.viewHistory().backView);
      $scope.subHeaders = [{
        title:"详细信息",
        icon:"icon_letter"
      },{
        title:"主力产品",
        icon:"icon_product"
      },{
        title:"关联商机",
        icon:"icon_business"
      }];

      $scope.showMenuFlag = -1;
      $scope.subHeadersSelect = [true];

      $scope.selectSubHeader = function($index){
        console.log($index);
        $ionicScrollDelegate.$getByHandle('detailScroll').scrollTop(true);
        $scope.transformButton($index);
        if($index==0){
          $scope.chooseThis=function(){
            $state.go("tab.competitors-add",{competitors: $scope.updateData});
          };
        }
        if($scope.subHeadersSelect[$index])
          return 0;
        else{
          $scope.subHeadersSelect = [];
          $scope.subHeadersSelect[$index] = true;
        }
      };


      $scope.isEdit = true;
      $scope.buttonImg = "build/img/application/customer/detail/edit@3x.png";
      $scope.transformButton = function(index){
        $scope.isEdit = index != 1;
        $timeout(function(){
          $scope.buttonImg = $scope.isEdit ? "build/img/application/customer/detail/edit@3x.png" : "build/img/application/customer/detail/edit_add@3x_5.png";
        },500)
      };
      $scope.selectSubHeader(0);
      $scope.transformButton(0);
      $scope.updateCompetitor=function(){
        $state.go("tab.competitors-add",{competitors: $scope.updateData});
      };
      ///////////////////数据相关/////////////////////

      Array.prototype.clone=function(){
        return [].concat(this);
      };

      Array.prototype.remove = function(index) {
        this.splice(index, 1);
      };
     console.log( $stateParams.param);
      $scope.competitorId = $stateParams.param.competitorId;

      $scope.competitorDetail = {};
      $scope.competitorOpportunity = [];
      hmsPopup.showLoading();

      function getCompetitorSuccess(response){
        hmsPopup.hideLoading();
        if(response.returnCode == "S"){
          $scope.competitorDetail = response.competitor_detail;
          $scope.competitorOpportunity = response.compertitor_opportunity;
          $scope.competitorProduct =  response.competitor_product;
          $scope.updateData =  {
            "competitorId": $scope.competitorId,
            "competitorCode":  $scope.competitorDetail.competitorCode,
            "shortName": $scope.competitorDetail.shortName,
            "fullName": $scope.competitorDetail.fullName,
            "areaProperty": $scope.competitorDetail.areaProperty,
            "areaPropertyName": $scope.competitorDetail.areaPropertyName,
            "dataStatus": $scope.competitorDetail.dataStatus,
            "dataStatusName": $scope.competitorDetail.dataStatusName,
            "competitorAdvDesc": $scope.competitorDetail.competitorAdvDesc,
            "competitorDisadvDesc": $scope.competitorDetail.competitorDisadvDesc,
            "competitorProducts": $scope.competitorProduct
          };
        }
      }

      competitorDetailService.getCompetitorDetail(getCompetitorSuccess, $scope.competitorId);
      $rootScope.$on("REFRESH_COMPETITOR_ADD", function () {
        competitorDetailService.getCompetitorDetail(getCompetitorSuccess, $scope.competitorId);
      });
      $scope.nowProduct = {};
      $scope.nowIndexProduct = -1;
      $scope.showEditProduct = false;
/*
      $scope.showEditProductDiv = function($index){
        $scope.nowIndexProduct = $index;
        $scope.nowProduct = {
          productId :  $scope.competitorProduct[$index].productId,
          competitorId : $scope.competitorProduct[$index].competitorId,
          productName : $scope.competitorProduct[$index].productName,
          productAdvDesc : $scope.competitorProduct[$index].productAdvDesc,
          productOtherDesc : $scope.competitorProduct[$index].productOtherDesc
        };
        $scope.showEditProduct = !$scope.showEditProduct;
      };
*/

      $scope.cancel = function(){
        $scope.showEditProduct = false;
      };

      function deleteProductSuccess(response){
        hmsPopup.hideLoading();
        $scope.competitorProduct.remove($scope.nowIndexProduct);
      }

      $scope.deleteProduct = function(){
        var params = {
          "productId":$scope.competitorProduct[$scope.nowIndexProduct].productId,
          "competitorId":$scope.competitorId
        };
        competitorDetailService.deleteProduct(deleteProductSuccess, params);
        hmsPopup.showLoading();
      };

      function updateCompetitorProductSuccess(response){
        hmsPopup.hideLoading();
        $scope.showEditProduct = false;
        $scope.competitorProduct = $scope.updateData.competitorProducts.clone();
      }

      $scope.updateProduct = function(){
        $scope.competitorProduct[$scope.nowIndexProduct] = $scope.nowProduct;
        competitorDetailService.updateCompetitorDetail(updateCompetitorProductSuccess, $scope.updateData);
        hmsPopup.showLoading();
      };

    }]);

angular.module('competitorModule')
  .service('competitorDetailService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$http',
    function(hmsHttp,
             hmsPopup,
             baseConfig,
             $http) {

      var baseUrl = baseConfig.basePath;

      this.getCompetitorDetail = function(success, id) {
        var params = {
          competitorId : id
        };
        console.log(params);
        hmsHttp.post(baseUrl + 'query_competitor_detail', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

      this.updateCompetitorDetail = function(success, params) {
        hmsHttp.post(baseUrl + 'competitor_update', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

      this.deleteProduct = function(success, params) {
        hmsHttp.post(baseUrl + 'delete_product', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

    }
  ]);
