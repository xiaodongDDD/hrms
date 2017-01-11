/**
 * Created by ZaraNengap on 2016/10/9.
 */
'use strict';
angular.module('customerModule')
  .controller('CustomerDetailDetailCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    'T',
    'CloneData',
    'baseConfig',
    '$ionicScrollDelegate',
    'customerDetailService',
    function ($scope,
              $rootScope,
              $state,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              T,
              CloneData,
              baseConfig,
              $ionicScrollDelegate,
              customerDetailService) {

      customerDetailService.setIsEdit(false)
      customerDetailService.setTabNumber(1)
      $scope.customerId =  customerDetailService.getCustomerId();
      var baseUrl = baseConfig.basePath;
      $scope.showFlag=[false,false,false,false,false,false,false];
      $scope.bilingual=CloneData.getCustomer_information();

      //$scope.customer = {};
      //$scope.informationStatus = [];
      $scope.showLoading = true;
      $scope.location = '';
      //多语言字段
      $scope.bilingual=CloneData.getCustomer_information();
      $scope.statusBilingual=CloneData.getApplicaion_add();

      var getCustomerDetailSuccess= function (response) {
        $scope.showLoading = false;
        if (response.returnCode == "S") {
          $scope.customer = response.customer_detail;
          $scope.location =  $scope.customer.countryName;
          $scope.basicInformation=[{
            text: $scope.bilingual.english_name,
            input:"",
            placeholder:"请输入",
            important:false
          },{
            text: $scope.bilingual.simple_name,
            input:"",
            placeholder:"请输入",
            important:false
          },{
            text: $scope.bilingual.register_id,
            input:"",
            placeholder:"请输入",
            important:false
          }];
          $scope.creditCode={
            text: $scope.bilingual.credit_code,
            input:"",
            placeholder:"对于中国区域，二选一必输",
            important:false,
            readonlyFlag:false
          }
          $scope.dutyParagraph = {
            text: $scope.bilingual.duty_paragraph,
            input:"",
            placeholder:"对于中国区域，二选一必输",
            important:false,
            readonlyFlag: false
          }
          //联系人输入信息
          $scope.contact =[{
            text: $scope.bilingual.zip_code,
            input:"",
            placeholder:"请输入",
            important:false,
            showLine:false
          },{
            text: $scope.bilingual.fax,
            input:"",
            placeholder:"请输入",
            important:false,
            showLine:false
          },{
            text: $scope.bilingual.website,
            input:"",
            placeholder:"请输入",
            important:false,
            showLine:true
          }];
          $scope.phone = {
            text: $scope.bilingual.phone,
            input:"",
            placeholder:"请输入",
            important:false,
            showLine:false
          }

          //其他输入信息
          $scope.others =  [{
            text:'其他信息化建设状况',
            input:"",
            placeholder:"请输入",
            important:false,
            showLine:true
          },{
            text:'其他描述',
            input:"",
            placeholder:"请输入",
            important:false,
            showLine:true
          }];

          //上级客户选择
          $scope.parentCustomer={
            text:$scope.bilingual.parent_customers,
            placeholder:'请选择',
            important:false,
            showLine:false
          }
          //国家省市区选择
          $scope.address={
            text:$scope.bilingual.address,
            placeholder:'请选择',
            important:true,
            showLine:false
          }
          //所属大区、团队选择
          $scope.longBelong={
            text:$scope.bilingual.long_belong,
            placeholder:'请选择',
            important:true,
            showLine:false
          }
          //企业信息选择
          $scope.business=[{
            text:$scope.bilingual.enterprise_nature,
            placeholder:'请选择',
            important:false,
            showLine:false,
            lastLine:false
          },{
            text:$scope.bilingual.major_industry,
            placeholder:'请选择',
            important:false,
            showLine:false,
            lastLine:false
          },{
            text:$scope.bilingual.is_listed,
            placeholder:'请选择',
            important:false,
            showLine:false,
            lastLine:false
          },{
            text:$scope.bilingual.income_scale,
            placeholder:'请选择',
            important:false,
            showLine:false,
            lastLine:false
          },{
            text:$scope.bilingual.worker_scale,
            placeholder:'请选择',
            important:false,
            showLine:false,
            lastLine:false
          },]
          if($scope.customer.provinceName!==''&&$scope.customer.countryName==='中国'){
            $scope.location = $scope.location+'-'+$scope.customer.provinceName;
          }
          if($scope.customer.cityName!==''&&$scope.customer.countryName==='中国'){
            $scope.location = $scope.location+'-'+$scope.customer.cityName;
          }
          if($scope.customer.zoneName!==''&&$scope.customer.countryName==='中国'){
            $scope.location = $scope.location+'-'+$scope.customer.zoneName;
          }
          if(response.situtions.length!==0){
            $scope.informationStatus = response.situtions;
          }else{
            $scope.informationStatus =[];
          }
          console.log($scope.customer);
        }
        else {
          if(response.returnMsg){
            hmsPopup.showShortCenterToast(response.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      }
      customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);

      $rootScope.$on('$ionicView.beforeEnter', function (e) {
        $scope.customerId =  customerDetailService.getCustomerId();
        console.log('详情页面的详情'+$scope.customerId);
      /*  $ionicScrollDelegate.$getByHandle("detailScroll").scrollTop(false);*/
        if(customerDetailService.getIsCustomerAdd()){
          customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
        /*  $scope.$apply();*/
        }

      })


      $scope.show = function (val) {
        $scope.showFlag[val] = !$scope.showFlag[val];
        $ionicScrollDelegate.$getByHandle("detailScroll").resize();
      }

    }]);
