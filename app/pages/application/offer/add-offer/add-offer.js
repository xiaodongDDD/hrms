
angular.module('offerModule')
  .controller('addOfferCtrl', [
    '$scope',
    '$rootScope',
    '$ionicModal',
    'offerListService',
    '$ionicScrollDelegate',
    'hmsPopup',
    '$timeout',
    'competitorListService',
    function($scope,$rootScope,$ionicModal,offerListService,$ionicScrollDelegate,hmsPopup,$timeout,competitorListService) {
    var vm = this;
    console.log("addOfferCtrl");
      $scope.searchModel={
        searchValueKey:""
      };
      $scope.offerTypeCode='';
      $scope.nowPage=1; $scope.pageSize=20;
      $scope.addEstimateData=[];
      $scope.productType=[];
     var INIT_OFFER= $rootScope.$on('INIT_OFFER',function(){
        $scope.title="新建投标报价";
        console.log("INIT_OFFER");
        $scope.searchModel={
          searchValueKey:""
        };

        $scope.nowPage=1; $scope.pageSize=20;
        $scope.addEstimateData=[];
        $scope.eidtFlag="new";
        $scope.data={
          offerHeaderCode:"-999",
          offerHeaderId:"-9999",
          offerStage:"OFFER_STAGE_BID",//报价阶段
          dataStatus:"OFFER_STATUS_UNCOMMITTED",
          offerMark:"",//备注
          customerId:"",
          opportunityId:"",
          amount:"",
          saleId:"",
          preSaleId:"",
          currency:"",
          exchangeRate:"",
          "version":"1",
          offerLines:[]
        };
        $scope.showData={
          dataStatus:"OFFER_STATUS_UNCOMMITTED",
          offerStage:"OFFER_STAGE_BID",//报价阶段
          dataStatusName:"未提交",
          offerLines:[]
        };
       $scope.showData.promptFlag=false;
       $scope.showData.showDisable=false;
      });
      var promptFlagConfirm=function(flag){
        if(flag){
          $scope.data={
            offerHeaderCode:"-999",
            offerHeaderId:"-99999",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerMark:"",//备注
            customerId:"",
            opportunityId:"",
            amount:"",
            saleId:"",
            preSaleId:"",
            currency:"",
            exchangeRate:"",
            "version":"1",
            offerLines:[]
          };
          $scope.showData={
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatusName:"未提交",
            offerLines:[]
          };
          $scope.addOfferModal.hide();
        }
      };
      $scope.goBackList=function(){
        if($scope.showData.promptFlag){
          hmsPopup.confirmNoTitle("当前报价单已经失效，确认退出吗？", promptFlagConfirm);
        }else{
          $scope.data={
            offerHeaderCode:"-999",
            offerHeaderId:"-99999",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerMark:"",//备注
            customerId:"",
            opportunityId:"",
            amount:"",
            saleId:"",
            preSaleId:"",
            currency:"",
            exchangeRate:"",
            "version":"1",
            offerLines:[]
          };
          $scope.showData={
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatusName:"未提交",
            offerLines:[]
          };
          $scope.addOfferModal.hide();
        }
      };
      var EDIT_OFFER_BID_DETAIL=$rootScope.$on('EDIT_OFFER_BID_DETAIL',function(){
        $scope.title="编辑投标报价";
        $scope.eidtFlag="edit";

        $scope.data=offerListService.getOfferDetailService();
        $scope.showData=offerListService.getOfferDetailService();
        $scope.showData.showDisable=false;
        $scope.showData.promptFlag=false;
        $scope.showData.preSaleEmployeeName=offerListService.getOfferDetailService().preSaleName;
        getEstimateListParam.opportunityId=$scope.showData.opportunityId;
        console.log(offerListService.getOfferDetailService());
      });

      //创建新版投标报价
      var CREATE_NEW_OFFER_BID_DETAIL=$rootScope.$on('CREATE_NEW_OFFER_BIDED_DETAIL',function(){
        $scope.title="创建新版投标报价";
        $scope.eidtFlag="newVersionBid";
        $scope.data=offerListService.getOfferDetailService();
        $scope.showData=offerListService.getOfferDetailService();
        $scope.showData.preSaleEmployeeName=offerListService.getOfferDetailService().preSaleName;
        getEstimateListParam.opportunityId=$scope.showData.opportunityId;
        console.log(offerListService.getOfferDetailService());
      });
      //创建新版定标报价
      var CREATE_NEW_BIDED_DETAIL=$rootScope.$on('CREATE_NEW_BIDED_DETAIL',function(){
        $scope.title="创建新版定标报价";
        $scope.eidtFlag="newVersionBided";
        $scope.data=offerListService.getOfferDetailService();
        $scope.showData=offerListService.getOfferDetailService();
        $scope.showData.preSaleEmployeeName=offerListService.getOfferDetailService().preSaleName;
        getEstimateListParam.opportunityId=$scope.showData.opportunityId;
        console.log(offerListService.getOfferDetailService());
      });

      //创建定标报价 选择否的时候
      var CREATE_OFFER_BIDEDED_CHANGE_DETAIL=$rootScope.$on('CREATE_OFFER_BIDEDED_CHANGE_DETAIL',function(){
        $scope.title="创建定标报价";
        $scope.eidtFlag="bidedChange";
        $scope.data=offerListService.getOfferDetailService();
        $scope.showData=offerListService.getOfferDetailService();
        $scope.showData.preSaleEmployeeName=offerListService.getOfferDetailService().preSaleName;
        getEstimateListParam.opportunityId=$scope.showData.opportunityId;
        console.log(offerListService.getOfferDetailService());
      });

      //创建定标报价 选择是的时候
      var CREATE_OFFER_BIDEDED_NO_CHANGE_DETAIL=$rootScope.$on('CREATE_OFFER_BIDEDED_NO_CHANGE_DETAIL',function(){
        $scope.title="创建定标报价";
        $scope.eidtFlag="bidedNoChange";
        $scope.data=offerListService.getOfferDetailService();
        $scope.showData=offerListService.getOfferDetailService();
        $scope.showData.preSaleEmployeeName=offerListService.getOfferDetailService().preSaleName;
        getEstimateListParam.opportunityId=$scope.showData.opportunityId;
        console.log(offerListService.getOfferDetailService());
      });
      var upData = [
        {
          "code": "HOM.SYSTEM_SERVICE_TYPE",
          "lastUpdateDate": "SYSTEM_SERVICE_TYPE_DATE",
          localList: 'SYSTEM_SERVICE_TYPE'
        },
        {
          "code": "HOM.INCIDENT_SHEET_TYPE",
          "lastUpdateDate": "INCIDENT_SHEET_TYPE_DATE",
          localList: 'INCIDENT_SHEET_TYPE'
        }
      ];
      var getValueObjByCode = function (code) {
        console.log(code);
        for (var i = 0; i < upData.length; i++) {
          if (code == upData[i].code)
            return cloneObj(upData[i]);
        }

      };
      var listInitSuccess = function (response) {
        console.log("--------");
        console.log(response);
        $scope.showCrmLoading=false;
        hmsPopup.hideLoading();
        if (response.returnCode == 'S') {
          console.log(response);
          for (var i = 0; i < response.lookup_detail.length; i++) {
            var code = response.lookup_detail[i].lookup_code;
            var lastUpdateDate = response.lookup_detail[i].last_update_date;
            var valueObj = getValueObjByCode(code);
            if (lastUpdateDate != window.localStorage[valueObj.lastUpdateDate]) {
              window.localStorage[valueObj.lastUpdateDate] = lastUpdateDate;
              window.localStorage[valueObj.localList] = JSON.stringify(response.lookup_detail[i].lookup_value_list);
            }
          }
        }else{
          if(response.returnMsg){
            $scope.showContent=true;
            hmsPopup.showShortCenterToast(response.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      };
      /*  console.log(upData);*/
      competitorListService.getValueList(listInitSuccess, upData);

      //===============
      $scope.checkSaveAfter=function(){
        $scope.addOfferDetailModel.hide();
        $scope.showData.offerLines[$scope.addDetailIndex].offerDetails.push($scope.offerDetailSaveDataObj);  $scope.data.offerLines[$scope.addDetailIndex].offerDetails.push($scope.offerDetailSaveDataObj);
        console.log( $scope.showData.offerLines[$scope.addDetailIndex].offerDetails.length+"====lenght?????");
        $scope.showData.offerLines[$scope.addDetailIndex].offerDetails=distinctArrayAll($scope.showData.offerLines[$scope.addDetailIndex].offerDetails);
        $scope.data.offerLines[$scope.addDetailIndex].offerDetails=distinctArrayAll($scope.showData.offerLines[$scope.addDetailIndex].offerDetails);
        console.log(distinctArrayAll($scope.showData.offerLines[$scope.addDetailIndex].offerDetails));
        console.log($scope.showData.offerLines[$scope.addDetailIndex].offerDetails.length);
        console.log($scope.data.offerLines[$scope.addDetailIndex].offerDetails.length+"=====?????data的长度");
        var result=0;
        function getSum(arr){
          for (var i=0; i<arr.length;i++){
            result +=Number(arr[i].totalCost);
            console.log(arr[i].totalCost);
          }
          return result;
        }
        var resultSum=0;
        function getAllSum(arr){
          for (var i=0; i<arr.length;i++){
            resultSum +=Number(arr[i].amount);
            console.log(arr[i].amount);
          }
          return resultSum;
        }
        $timeout(function(){
          $scope.test=getSum($scope.data.offerLines[$scope.addDetailIndex].offerDetails);
          //alert($scope.test);
          $scope.data.offerLines[$scope.addDetailIndex].amount=$scope.test;
          $scope.showData.offerLines[$scope.addDetailIndex].amount=$scope.test;
          console.log( $scope.showData.offerLines[$scope.addDetailIndex].amount+"===总金额");
          console.log( angular.toJson($scope.showData)+"=======加了总金额之后的 $scope.showData");
          $scope.testAll=getAllSum($scope.data.offerLines);
          console.log($scope.testAll);
          $scope.data.amount=$scope.testAll;
        });
      };
      $scope.goCheckPassenger=function(){
        $scope.offerDetailSaveDataObj.offerType=$scope.offerTypeCode;
        $scope.offerDetailSaveDataObj.taxRate=$scope.taxRate;
        console.log("===goCheckPassenger"+angular.toJson($scope.offerDetailSaveDataObj));
        console.log(angular.toJson($scope.showData)+"showData====保存明细时");
        $scope.offerDetailSaveDataObj.soleId=new Date().getTime();
        console.log( $scope.estimate.offerDetails);
        if($scope.offerTypeCode=='AGENT'){
          $scope.offerDetailSaveDataObj.totalCost=$scope.offerDetailSaveDataObj.discountedAmount.toFixed(2);
          if( $scope.offerDetailSaveDataObj.productType==""){
            hmsPopup.showPopup("请选择产品");
          }else if($scope.offerDetailSaveDataObj.discountedAmount==""){
            hmsPopup.showPopup("请填写软件总价");
          }else if($scope.offerDetailSaveDataObj.cost==""){
            hmsPopup.showPopup("请填写软件下单成本");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='OWN'){
          $scope.offerDetailSaveDataObj.totalCost=$scope.offerDetailSaveDataObj.discountedAmount.toFixed(2);
          if( $scope.offerDetailSaveDataObj.productType==""){
            hmsPopup.showPopup("请选择产品");
          }else if($scope.offerDetailSaveDataObj.discountedAmount==""){
            hmsPopup.showPopup("请填写软件总价");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='FIXED'){
          //平均单价
          $scope.offerDetailSaveDataObj.unitPrice=$scope.offerDetailSaveDataObj.discountedAmount/$scope.offerDetailSaveDataObj.peopleDays.toFixed(2);
          $scope.offerDetailSaveDataObj.totalCost=$scope.offerDetailSaveDataObj.discountedAmount.toFixed(2);
          //折扣率
          $scope.offerDetailSaveDataObj.discountRate= (($scope.offerDetailSaveDataObj.amount- $scope.offerDetailSaveDataObj.discountedAmount)/ $scope.offerDetailSaveDataObj.amount).toFixed(2);
          if( $scope.offerDetailSaveDataObj.productType==""){
            hmsPopup.showPopup("请选择子报价类型");
          }else if($scope.offerDetailSaveDataObj.peopleDays==""){
            hmsPopup.showPopup("请填写人天总数");
          }else if($scope.offerDetailSaveDataObj.amount==""){
          hmsPopup.showPopup("请填写列表价总金额");
        }else if($scope.offerDetailSaveDataObj.discountedAmount==""){
            hmsPopup.showPopup("请填写优惠后总金额");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='TM'){
          //优惠后金额
          $scope.offerDetailSaveDataObj.discountedAmount= $scope.offerDetailSaveDataObj.disUnitPrice* $scope.offerDetailSaveDataObj.peopleDays.toFixed(2);
          $scope.offerDetailSaveDataObj.totalCost=$scope.offerDetailSaveDataObj.discountedAmount.toFixed(2);
          //折扣率
          $scope.offerDetailSaveDataObj.discountRate= (($scope.offerDetailSaveDataObj.unitPrice- $scope.offerDetailSaveDataObj.disUnitPrice)/ $scope.offerDetailSaveDataObj.unitPrice).toFixed(2);
          if( $scope.offerDetailSaveDataObj.constructorName==""){
            hmsPopup.showPopup("请选择顾问类型");
          }else if($scope.offerDetailSaveDataObj.disUnitPrice==""){
            hmsPopup.showPopup("请填写优惠后人天单价");
          }else if($scope.offerDetailSaveDataObj.peopleDays==""){
            hmsPopup.showPopup("请填写预计人天数");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='REMOTE_FIXED'){
          $scope.offerDetailSaveDataObj.discountedAmount=$scope.offerDetailSaveDataObj.disUnitPrice*$scope.offerDetailSaveDataObj.peopleDays*$scope.offerDetailSaveDataObj.coefficient.toFixed(2);
          //合计
          //折扣率
          $scope.offerDetailSaveDataObj.discountRate= (($scope.offerDetailSaveDataObj.unitPrice- $scope.offerDetailSaveDataObj.disUnitPrice)/ $scope.offerDetailSaveDataObj.unitPrice).toFixed(2);
          $scope.offerDetailSaveDataObj.totalCost= $scope.offerDetailSaveDataObj.discountedAmount*(1+$scope.taxRate).toFixed(2);
          if( $scope.offerDetailSaveDataObj.constructorName==""){
            hmsPopup.showPopup("请选择顾问类型");
          }else if($scope.offerDetailSaveDataObj.disUnitPrice==""){
            hmsPopup.showPopup("请填写优惠后人天单价");
          }else if($scope.offerDetailSaveDataObj.peopleDays==""){
            hmsPopup.showPopup("请填写预计人天数");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='REMOTE_TM'){
          $scope.offerDetailSaveDataObj.discountedAmount=$scope.offerDetailSaveDataObj.peopleDays*$scope.offerDetailSaveDataObj.disUnitPrice*$scope.offerDetailSaveDataObj.coefficient.toFixed(2);
          //折扣率
          $scope.offerDetailSaveDataObj.discountRate= (($scope.offerDetailSaveDataObj.unitPrice- $scope.offerDetailSaveDataObj.disUnitPrice)/ $scope.offerDetailSaveDataObj.unitPrice).toFixed(2);
          $scope.offerDetailSaveDataObj.totalCost=$scope.offerDetailSaveDataObj.discountedAmount*(1+$scope.taxRate).toFixed(2);
          if( $scope.offerDetailSaveDataObj.constructorName==""){
            hmsPopup.showPopup("请选择顾问类型");
          }else if($scope.offerDetailSaveDataObj.disUnitPrice==""){
            hmsPopup.showPopup("请填写优惠后人天单价");
          }else if($scope.offerDetailSaveDataObj.peopleDays==""){
            hmsPopup.showPopup("请填写预计人天数");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='REMOTE_HOURS'){
          $scope.offerDetailSaveDataObj.discountedAmount=($scope.offerDetailSaveDataObj.peopleDays*$scope.offerDetailSaveDataObj.disUnitPrice*$scope.offerDetailSaveDataObj.coefficient).toFixed(2);
          //折扣率
          $scope.offerDetailSaveDataObj.discountRate= (($scope.offerDetailSaveDataObj.unitPrice- $scope.offerDetailSaveDataObj.disUnitPrice)/ $scope.offerDetailSaveDataObj.unitPrice).toFixed(2);
          $scope.offerDetailSaveDataObj.totalCost=($scope.offerDetailSaveDataObj.discountedAmount*(1+$scope.taxRate)).toFixed(2);
          if( $scope.offerDetailSaveDataObj.constructorName==""){
            hmsPopup.showPopup("请选择顾问类型");
          }else if($scope.offerDetailSaveDataObj.disUnitPrice==""){
            hmsPopup.showPopup("请填写优惠后人天单价");
          }else if($scope.offerDetailSaveDataObj.peopleDays==""){
            hmsPopup.showPopup("请填写预计人天数");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='REMOTE_INCIDENT_TIMES'){
          $scope.offerDetailSaveDataObj.discountedAmount= ($scope.offerDetailSaveDataObj.months*$scope.offerDetailSaveDataObj.monthEvent*$scope.offerDetailSaveDataObj.disUnitPrice).toFixed(2);
          $scope.offerDetailSaveDataObj.totalCost=($scope.offerDetailSaveDataObj.discountedAmount*(1+$scope.taxRate)).toFixed(2);
          if( $scope.offerDetailSaveDataObj.category1Name==""){
            hmsPopup.showPopup("请选择系统服务类型");
          }else if($scope.offerDetailSaveDataObj.category2Name==""){
            hmsPopup.showPopup("请选择事件单类型");
          }else if($scope.offerDetailSaveDataObj.disUnitPrice==""){
            hmsPopup.showPopup("请填写事件单单价");
          }else if($scope.offerDetailSaveDataObj.monthEvent==""){
            hmsPopup.showPopup("请填写事件单数量");
          }else if($scope.offerDetailSaveDataObj.months==""){
            hmsPopup.showPopup("请填写月数");
          }else{
            $scope.checkSaveAfter();
          }
        }else if($scope.offerTypeCode=='OPERATION_IMPLEMENT_FEE'){
          $scope.offerDetailSaveDataObj.discountedAmount=($scope.offerDetailSaveDataObj.implementationCost*$scope.offerDetailSaveDataObj.implementationRatio+$scope.offerDetailSaveDataObj.maintainCost).toFixed(2);
          $scope.offerDetailSaveDataObj.totalCost=($scope.offerDetailSaveDataObj.discountedAmount*(1+$scope.taxRate)).toFixed(2);
       if($scope.offerDetailSaveDataObj.implementationCost==""){
            hmsPopup.showPopup("请填写项目实施费");
          }else if($scope.offerDetailSaveDataObj.implementationRatio==""){
            hmsPopup.showPopup("请填写实施费折价比例");
          }else if($scope.offerDetailSaveDataObj.maintainCost==""){
            hmsPopup.showPopup("请填写维护费");
          }else{
            $scope.checkSaveAfter();
          }
        }

        //$scope.$apply();
        //$scope.data.offerLines[$scope.addDetailIndex].offerDetails.push($scope.offerDetailSaveDataObj);
      };
      //失焦检验远程系数
      $scope.validCoefficient=function(){
        if($scope.offerDetailSaveDataObj.coefficient<1){
          hmsPopup.showPopup("远程系数必须>=1");
          $scope.offerDetailSaveDataObj.coefficient="";
        }
      };
      var offerTypeSuccess=function(result){
        console.log(result);
        $scope.productType=result.offer_type;
      };
      var offerTypeParam={};
      offerListService.offerType(offerTypeSuccess,offerTypeParam);
      $scope.showEstimate=true;
      $scope.title='';
      $ionicModal.fromTemplateUrl('build/pages/application/offer/model/estimate-model.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.estimateModel = modal;
      });
      //产品类别
      $ionicModal.fromTemplateUrl('build/pages/application/offer/model/productTypeModel.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.productTypeModel = modal;
      });
      //顾问类型
      $ionicModal.fromTemplateUrl('build/pages/application/offer/model/counselorTypeModel.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.counselorTypeModel = modal;
      });

      $scope.items=[];
      var getCustomerSuccess=function(result){
        $scope.showCrmLoading = false;
        console.log(result);
        if(result.returnCode == 'S'){
          $scope.moreDataCanBeLoaded = result.offer_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(result.offer_list);
          console.log(angular.toJson($scope.items));
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      Array.prototype.clone = function () {
        return [].concat(this);
      };
      $scope.clearInputContent = function () {
        $scope.searchParam.keyWord = "";
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };
      var getCustomerSearchSuccess=function(result){
        console.log(result);
        $scope.showCrmLoading = false;
        if(result.returnCode == 'S'){
          $scope.moreDataCanBeLoaded = result.offer_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(result.offer_list);
          console.log(angular.toJson($scope.items));
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      var getProductTypeSuccess=function(result){
        console.log(result);
        $scope.showCrmLoading = false;
        if(result.returnCode == 'S'){
          $scope.majorIndustrys =result.product_defines;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      var getQueryProductTypeSuccess=function(result){
        $scope.showCrmLoading = false;
        if(result.returnCode == 'S'){
          $scope.showSubIndustry=true;
          $scope.subIndustrys =result.product_type;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      $scope.industryBack = function(){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        //当目录在一级时，返回
        if(!$scope.showSubIndustry){
          $scope.productTypeModel.hide();
        }
        //否则跳到一级,并清空第二级数据
        else{
          $scope.showSubIndustry = false;
          $scope.subIndustrys = [];
          $scope.offerDetailSaveDataObj={
            offerLineId:"-999",
            offerHeaderId:"-999",
            offerDetailId:"-999",
            amount:0,
            totalCost:"",
            maintainCost:"",
            peopleDays:"",
            coefficient:"",
            unitPrice:"",
            disUnitPrice:"",
            monthEvent:"",
            months:"",
            implementationCost:"",
            implementationRatio:"",
            cost:"",
            profitRate:"",//利润率
            discountedAmount:"",//优惠后总金额
            offertype:''

          };
        }
      };

      //$scope.offerDetailSaveDataObj={
      //  offerLineId:"-999",
      //  offerHeaderId:"-999",
      //  offerDetailId:"-999",
      //  amount:"0",
      //  offertype:'',
      //  cost:"",
      //  profitRate:"",//利润率
      //  discountedAmount:""//优惠后总金额
      //};
      $scope.selectMajor=function(item){
        console.log(angular.toJson(item)+"====选择的售前预估行的");
        $scope.showSubIndustry=false;
        $scope.offerDetailSaveDataObj.category1=item.defCode;
        $scope.offerDetailSaveDataObj.category1Name=item.defName;
        //
        offerListService.getQueryProductType(getQueryProductTypeSuccess,item.defCode);
      };
      $scope.selectSub=function(item){
        $scope.offerDetailSaveDataObj.category2Name=item.defName;
        $scope.offerDetailSaveDataObj.productType= $scope.offerDetailSaveDataObj.category1Name+'-'+ $scope.offerDetailSaveDataObj.category2Name;
        //$scope.offerDetailSaveDataObj.=item.defCode;
        $scope.offerDetailSaveDataObj.category2=item.defCode;
        console.log($scope.offerDetailSaveDataObj);
        $scope.productTypeModel.hide();
        $scope.addOfferDetailModel.show();
        console.log("售前预估的"+angular.toJson($scope.estimate));
      };
      $scope.showProductSelect = function(item){
        $scope.showSubIndustry=false;
        $scope.addOfferDetailModel.hide();
        $scope.productTypeModel.show();
        offerListService.getProductType(getProductTypeSuccess,item);
      };
      var getCounselorTypeListSucces=function(result){
        console.log(result);
        console.log(result.counselors);
        $scope.counselors=result.counselors;
        $scope.loadMoreCounselorFlag=true;
      };
      //选择顾问类型级联
      $scope.getCounselorTypeListParam={
        page:1,
        pageSize:20,
        keyWord:"",
        offerType:""
      };
      //顾问人天单价
      $scope.getResourcePriceParam={
        counselorType:"",
        counselorLevel:"",
        offerType:""
      };
      $scope.showCounselorTpye=false;
      $scope.searchCounselorValue=function(){
        $scope.getCounselorTypeListParam.page=1;
        offerListService.getCounselorTypeList(getCounselorTypeListSucces, $scope.getCounselorTypeListParam);
      };
      var getCounselorTypeMoreListSucces=function(result){
        console.log(result);
        console.log(result.counselors);
        console.log(":" + $scope.loadMoreCounselorFlag);
        $scope.showLoading = false;
        if (result.returnCode == 'S') {
          $scope.counselors= $scope.counselors.concat(result.counselors);
          $scope.loadMoreCounselorFlag = result.counselors.length == $scope.pageSize;
        } else {
          $scope.loadMoreCounselorFlag = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      $scope.loadMoreCounselor=function(){
        $scope.getCounselorTypeListParam.page++;
        offerListService.getCounselorTypeList(getCounselorTypeMoreListSucces, $scope.getCounselorTypeListParam);
      };
      $scope.counselorLevelParam={
        counselorType:"",
        offerType:""
      };
      $scope.showCounselorType=function(){
        $scope.getCounselorTypeListParam.page=1;
        $scope.counselorTypeModel.show();
        console.log("选择顾问类型级联");
        $scope.showCounselorTpye=false;
        $scope.addOfferDetailModel.hide();
        $scope.showSelect=true;
        offerListService.getCounselorTypeList(getCounselorTypeListSucces, $scope.getCounselorTypeListParam);
      };
      $scope.counselorsType=[];
      //选择顾问列表
      var getCounselorLevelSuccess=function(result){
        console.log(result);
        $scope.counselorsType=result.counselor_levels;
        console.log($scope.counselorsType);
      };
      //顾问人天单价
      var getResourcePriceSuccess=function(result){
        console.log(result);
        //$scope.offerDetailSaveDataObj.unitPrice=result.resource_price.price;
      };
      //选择顾问级别
      $scope.selectCounselorTpye=function(item){
        console.log(item);
        $scope.offerDetailSaveDataObj.category2Name=item.counselorLevelName;
        $scope.offerDetailSaveDataObj.constructorLevel=item.counselorLevelName;
        $scope.offerDetailSaveDataObj.constructorName=$scope.offerDetailSaveDataObj.constructorType+"-" + $scope.offerDetailSaveDataObj.constructorLevel;
        $scope.getResourcePriceParam.counselorLevel=item.counselorType;
        $scope.offerDetailSaveDataObj.category2=item.counselorLevel;
        $scope.offerDetailSaveDataObj.unitPrice=item.price;
        offerListService.getResourcePrice(getResourcePriceSuccess,$scope.getResourcePriceParam);
        $scope.addOfferDetailModel.show();
        $scope.counselorTypeModel.hide();
      };
      //从顾问类型列表返回
      $scope.goCounselorBack=function(){
        $scope.showSelect=false;
        $scope.addOfferDetailModel.show();
        $scope.counselorTypeModel.hide();
      };
      //选择顾问类型
      $scope.selectCounselorsItem=function(item){
        console.log(item);
        $scope.offerDetailSaveDataObj.category1Name=item.counselorTypeName;
        $scope.offerDetailSaveDataObj.constructorType=item.counselorTypeName;
        $scope.showCounselorTpye=true;
        $scope.counselorLevelParam.counselorType=item.counselorType;
        $scope.getResourcePriceParam.counselorType=item.counselorType;
        $scope.offerDetailSaveDataObj.category1=item.counselorType;
        offerListService.getCounselorLevel(getCounselorLevelSuccess,$scope.counselorLevelParam);
      };
      //值列表
      var showValueInList = function (code) {
        $scope.showCrmLoading = false;
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'OpportunitiesList',
        'interface': offerListService.getOpportunitiesList,  //选择商机
        'params': [getCustomerSuccess, $scope.searchModel.searchValueKey,$scope.nowPage, $scope.pageSize],  //获得选择项时接口所需参数
        'showKey': 'opportunityName',            //选择界面显示的数据
        'dataKey': 'opportunityId',      //对象内最终操作提交所需的数据变量
        'dataModel': '$scope.data.opportunityId',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.opportunityName', //显示在界面上的ng-model
        'searchInterface': offerListService.getOpportunitiesList,
        'searchParams': getCustomerSearchSuccess,
        'needShowMore': true
      },
        {
          'key': 'systemServiceType',
          'interface': showValueInList,  //选择商机
          'params': ['HOM.SYSTEM_SERVICE_TYPE'],  //获得选择项时接口所需参数
          'showKey': 'description',            //选择界面显示的数据
          'dataKey': 'value',      //对象内最终操作提交所需的数据变量
          'dataModel': '$scope.offerDetailSaveDataObj.category1',  //最终操作提交所需的数据变量
          'showDataModel': '$scope.offerDetailSaveDataObj.category1Name' //显示在界面上的ng-model
        }
        , {
          'key': 'incidentSheetType',
          'interface': showValueInList,
          'params': ['HOM.INCIDENT_SHEET_TYPE'],
          'showKey': 'description',
          'dataKey': 'value',
          'dataModel': '$scope.offerDetailSaveDataObj.category2',
          'showDataModel': '$scope.offerDetailSaveDataObj.category2Name'
        }
      ];


      $scope.loadMore = function() {
        console.log('loadMore ...');
        $scope.nowPage++;
        for(var i = 0; i < $scope.nowSelectTarget.params.length; i++){
          if($scope.nowSelectTarget.params[i] == $scope.nowPage - 1){
            $scope.nowSelectTarget.params[i] = $scope.nowPage;
            break;
          }
        }
        if($scope.nowSelectTarget['searchInterface'] && $scope.searchModel.searchValueKey != ''){
          $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
        } else
          $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      };
      var getEstimateListParam={
        page:1,
        pagesize:20,
        opportunityId: ""
      };
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.crmSelectModal = modal;
      });

      $scope.showSelectDiv = function (key) {
        $scope.moreDataCanBeLoaded = false;
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        //打开模态框
        if ($scope.showSelect) {
          $scope.showCrmLoading = false;
          $scope.crmSelectModal.hide();
        } else {
          $scope.crmSelectModal.show();
          $scope.showCrmLoading = true;
        }
        $scope.showSelect = !$scope.showSelect;

        $scope.moreDataCanBeLoaded = false;

        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);

        if(!$scope.showSelect){
          return ;
        }

        for(var i = 0; i < $scope.selectTargets.length; i++){
          if(key == $scope.selectTargets[i].key){
            $scope.nowSelectTarget = cloneObj($scope.selectTargets[i]);
            break;
          }
        }
        var showKey = $scope.nowSelectTarget['showKey'];
        var dataKey = $scope.nowSelectTarget['dataKey'];
        eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
        $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
        if ($scope.nowSelectTarget['key'] == 'systemServiceType') {
          $scope.addOfferDetailModel.hide();
        }
        if ($scope.nowSelectTarget['key'] == 'incidentSheetType') {
          $scope.addOfferDetailModel.hide();
        }
        console.log('showSelectDiv nowSelectTarget ' + angular.toJson($scope.nowSelectTarget));
        //if($scope.nowSelectTarget.interface != showValueInList)
          $scope.showCrmLoading = true;
        $scope.nowPage = 1;
        $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      };
      //克隆对象
      function cloneObj(obj) {
        function Clone() {
        }

        Clone.prototype = obj;
        var o = new Clone();
        for (var a in o) {
          if (typeof o[a] == "object") {
            o[a] = cloneObj(o[a]);
          }
        }
        return o;
      }

      $scope.selectItem = function ($index) {
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        showKey = (showKey == '空') ? "" : showKey;
        console.log(angular.toJson($scope.items[$index])+"=====");
        if ($scope.nowSelectTarget['key'] == 'OpportunitiesList') {
        $scope.showData.customerName=$scope.items[$index].customerName;
          $scope.showData.opportunityName=$scope.items[$index].opportunityName;
          $scope.showData.preSaleEmployee=$scope.items[$index].preSaleEmployee;
          $scope.showData.currencyName=$scope.items[$index].currencyName;
          $scope.showData.currency=$scope.items[$index].currency;
        $scope.data.customerId=$scope.items[$index].customerId;
        $scope.data.opportunityId=$scope.items[$index].opportunityId;
        $scope.data.preSaleId=$scope.items[$index].preSaleEmployeeId;
          $scope.showData.preSaleName=$scope.items[$index].preSaleEmployeeName;
          $scope.data.saleId=$scope.items[$index].saleId;
          $scope.showData.saleName=$scope.items[$index].saleName;
        //$scope.data.preSaleId=$scope.items[$index].preSaleEmployeeId;//少销售的id
        $scope.data.exchangeRate=$scope.items[$index].exchangeRate;
        $scope.data.currency=$scope.items[$index].currency;
        getEstimateListParam.opportunityId=$scope.items[$index].opportunityId;
        var getVailedLineSuccess=function(result){
          $scope.showCrmLoading=false;
          console.log(result);
          if(result.returnCode=='S'){
              var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
              var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
              eval(dataModel + " = data");
              eval(showDataModel + " = showKey");
              $scope.showSelectDiv();
          }else{
            hmsPopup.showPopup(result.returnMsg);
          }
        };
          $scope.showCrmLoading=true;
        offerListService.getVailedLine(getVailedLineSuccess,$scope.data.opportunityId);
        }
        if ($scope.nowSelectTarget['key'] == 'AGENT') {
          //$scope.addOfferDetailModel.show();
        }
        if ($scope.nowSelectTarget['key'] == 'systemServiceType') {
          $scope.addOfferDetailModel.show();
          $scope.offerDetailSaveDataObj.category1=$scope.items[$index].value;
          $scope.offerDetailSaveDataObj.category1Name=$scope.items[$index].description;
          console.log(angular.toJson($scope.items[$index])+"=====systemServiceType");
          $scope.showSelectDiv();
        }
        if ($scope.nowSelectTarget['key'] == 'incidentSheetType') {
          $scope.offerDetailSaveDataObj.category2=$scope.items[$index].value;
          $scope.offerDetailSaveDataObj.category2Name=$scope.items[$index].description;
          console.log(angular.toJson($scope.items[$index])+"=====incidentSheetType");
          $scope.addOfferDetailModel.show();
          $scope.showSelectDiv();
        }
      };
      $scope.clearSelectFilter = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
        $ionicScrollDelegate.scrollTop();
      };
      //删除行信息
      $scope.deleteLine=function(arr,item){
        console.log(item);
        var deleteDetail=function(result){
          console.log(result);
          if(result){
            arr.splice(arr.indexOf(item),1);
            console.log(arr);
          }
        };
        hmsPopup.confirm('确定删除该行信息吗?', '', deleteDetail);
      };
      $scope.searchSelectValue = function(){
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if($scope.nowSelectTarget['searchInterface']){
          //需要接口搜索的
          $scope.showCrmLoading = true;
          $scope.moreDataCanBeLoaded = false;
          $scope.items = [];
          $scope.nowPage = 1;
          $scope.pageSize = 15;
          $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
          /* }*/
        } else {
          //本地字段搜索的
          $scope.nowPage = 1;
          $scope.pageSize = 15;
          var notShowNum = 0;
          if($scope.searchModel.searchValueKey == ''){
            $scope.noDataFlag = false;
            $scope.items = $scope.sourceItems.clone();
          }
          else{
            for(var i = 0; i < $scope.sourceItems.length; i++){
              if(isContains($scope.sourceItems[i][$scope.nowSelectTarget['showKey']],$scope.searchModel.searchValueKey))
                $scope.items[i] = $scope.sourceItems[i];
              else{
                $scope.items[i] = '';
                notShowNum++;
              }
            }
            $scope.noDataFlag = notShowNum == $scope.sourceItems.length;
          }
        }
      };
      //报价明细
      $ionicModal.fromTemplateUrl('build/pages/application/offer/add-offer/add-offer-detail/add-offer-detail.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.addOfferDetailModel = modal;
      });
      var getEstimateListSuccess=function(result){
        console.log(result);
        if(result.returnCode=="S"){
          $scope.addEstimateData=result.opp_product
        }
      };
      function inArrayProduct(array, value) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].productId === value||array[i].opportunityProductId === value)
            return true;
        }
        return false;
      }
      $scope.addEstimate=function(){
        $scope.showEstimate=true;
        $scope.title='';
        $scope.estimateModel.show();
        console.log(getEstimateListParam);
        offerListService.getEstimateList(getEstimateListSuccess,getEstimateListParam);
       };
      $scope.estimateData={};//售前预估行数据
      $scope.estimate={};//售前预估行显示
      $scope.chooseEstimate=function(item){
        var checkSameOfferSuccess=function(result){
          console.log(result);
          if(result.returnCode=="S"){
            console.log($scope.showData.offerLines);
            console.log(inArrayProduct($scope.showData.offerLines,item.productId));
            if($scope.showData.offerLines.length!=0&&inArrayProduct($scope.showData.offerLines,item.productId)){
              hmsPopup.showPopup("同一个售前预估只能关联一种报价类型。");
            }else{
              $scope.estimateData.opportunityProductId=item.productId;
              $scope.estimate=item;
              $scope.estimate.opportunityProductId=item.productId;
              $scope.title=item.estimate;
              $scope.showEstimate=false;
            }
          }else{
            hmsPopup.showPopup("该售前预估行已生成报价，请先取消历史报价单；也可通过历史报价单创建新版本");
          }
        };
        var checkSameOfferParam={
          offerHeaderCode:$scope.data.offerHeaderCode,
          offerStage:$scope.data.offerStage,
          opportunityProductId:item.productId
        };
        offerListService.checkSameOffer(checkSameOfferSuccess,checkSameOfferParam);
        console.log(angular.toJson(item)+'=======售前预估行');
      };
      $scope.chooseSecond=function(item){
        $scope.title="";
        $scope.showEstimate=true;
        console.log(angular.toJson(item)+'=======chooseSecond===第二个');

        console.log(item);

    };
     $scope.estimateSaveData={};
      $scope.chooseProductType=function(item){
        console.log(angular.toJson(item)+"======选择产品estimateSaveData========");
        $scope.title="";
        $scope.showEstimate=true;
        $scope.estimate.offerDetails=[];
        $scope.estimate.offerTypeCode=item.offerTypeCode;
        $scope.estimate.offerTypeName=item.offerTypeName;
        $scope.estimate.offerType=item.offerTypeCode;
        $scope.estimate.taxRate=item.taxRate;
        $scope.estimate.soleId=new Date().getTime();
        $scope.estimateSaveData.offerDetails=[];
        $scope.estimate.offerHeaderId="-9999";
        $scope.estimate.amount=0;
        $scope.estimateData.offerType=item.offerTypeCode;
        //$scope.estimateSaveData.offerHeaderId="";
        //$scope.estimateSaveData.opportunityProductId=;
        //$scope.estimateSaveData.offerType=;
        //$scope.estimateSaveData.amount=;
        //$scope.estimateSaveData.taxRate=;
        $scope.estimateData.taxRate=item.taxRate;
        console.log(angular.toJson($scope.showData)+"======$scope.showData");
        $scope.showData.offerLines.push( $scope.estimate);
        console.log(angular.toJson($scope.estimate)+"======选择产品estimateSaveData========");
        $scope.data.offerLines.push( $scope.estimate);
        console.log( angular.toJson($scope.showData.offerLines));
        $scope.showData.offerLines=distinctArrayAll($scope.showData.offerLines);
        $scope.data.offerLines=distinctArrayAll( $scope.data.offerLines);
        $scope.estimateModel.hide();
      };
      $scope.estimateModelHide=function(){
        $scope.estimateModel.hide();
      };

      $scope.addDetail=function(item,index){
        console.log(angular.toJson($scope.showData)+"=====showData");
        $scope.addDetailIndex=index;
        console.log(index);
        console.log(item);
        $scope.taxRate=item.taxRate;
        $scope.offerTypeCode=item.offerType;
        console.log($scope.offerTypeCode);
        $scope.offerDetailSaveDataObj={
          offerLineId:"-999",
          offerHeaderId:"-999",
          offerDetailId:"-999",
          amount:0,
          totalCost:"",
          maintainCost:"",
          peopleDays:"",
          coefficient:"",
          unitPrice:"",
          disUnitPrice:"",
          monthEvent:"",
          months:"",
          implementationCost:"",
          implementationRatio:"",
          cost:"",
          profitRate:"",//利润率
          discountedAmount:"",//优惠后总金额
          offertype: $scope.offerTypeCode
        };
        $scope.getCounselorTypeListParam.offerType=item.offerType;
        $scope.getResourcePriceParam.offerType=item.offerType;
        $scope.counselorLevelParam.offerType=item.offerType;
        $scope.addOfferDetailModel.show();
      };
      console.log(angular.toJson($scope.offerDetailSaveDataObj)+"===== $scope.offerDetailSaveDataObj");
      $scope.addOfferDetailHide=function(){
        $scope.addOfferDetailModel.hide();
        console.log(angular.toJson(  $scope.offerDetailSaveDataObj)+"====添加的报价明细");
      };
      //删除行明细Button
      $scope.showDeleteButton=function(arr,item){
        console.log('删除行明细');
        //确认删除
        var deleteDetail=function(result){
          console.log(result);
          if(result){
            arr.splice(arr.indexOf(item),1);
            console.log(arr);
          }
        };
        hmsPopup.confirm('确定删除该明细吗?', '', deleteDetail);
      };
      var offerSubmitSuccess=function(result){
         hmsPopup.hideLoading();
        if(result.returnCode=="S"){
          $scope.data={
            offerHeaderCode:"-999",
            offerHeaderId:"-99999",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerMark:"",//备注
            customerId:"",
            opportunityId:"",
            amount:"",
            saleId:"",
            preSaleId:"",
            currency:"",
            exchangeRate:"",
            "version":"3",
            offerLines:[]
          };
          $scope.showData={
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatusName:"未提交",
            offerLines:[]
          };
          $rootScope.$broadcast('DO_REFRESH');
        }
        hmsPopup.showShortCenterToast(result.returnMsg);
      };
      var createBidSuccess=function(result){
        console.log(result);
      };

      var offerEditSuccess=function(result){
        hmsPopup.hideLoading();
        if(result.returnCode=="S"){
          $scope.data={
            offerHeaderCode:"-999",
            offerHeaderId:"-99999",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerMark:"",//备注
            customerId:"",
            opportunityId:"",
            amount:"",
            saleId:"",
            preSaleId:"",
            currency:"",
            exchangeRate:"",
            "version":"3",
            offerLines:[]
          };
          $scope.showData={
            dataStatus:"OFFER_STATUS_UNCOMMITTED",
            offerStage:"OFFER_STAGE_BID",//报价阶段
            dataStatusName:"未提交",
            offerLines:[]
          };
          $rootScope.$broadcast('DO_REFRESH');
        }
        hmsPopup.showShortCenterToast(result.returnMsg);
      };
      var createBidedCopySuccess=function(result){
        console.log(result);
        $rootScope.$broadcast('DO_REFRESH');
      };
      var createAwardSuccess=function(result){
        console.log(result);
        $rootScope.$broadcast('DO_REFRESH');
      };
      $scope.save=function(){
        console.log("保存");
        //$scope.data.exchangeRate=
        console.log(angular.toJson($scope.data)+"======保存的数据");
        if($scope.data.offerLines.length==0){
          hmsPopup.showPopup("至少要添加一条报价行");
        }else{
          if($scope.eidtFlag=='edit'){
            $scope.addOfferModal.hide();
            hmsPopup.showLoading("正在保存");
            offerListService.offerEdit(offerEditSuccess,$scope.data);
          }else if($scope.eidtFlag=='new'){//完全新建
            $scope.addOfferModal.hide();
            hmsPopup.showLoading("正在保存");
            offerListService.offerSubmit(offerSubmitSuccess,$scope.data);
          }else if($scope.eidtFlag=='bidedNoChange'){//定标报价选择是的时候
            $scope.addOfferModal.hide();
            hmsPopup.showLoading("正在保存");
            //offerListService.offerSubmit(offerSubmitSuccess,$scope.data);
            offerListService.createBidedCopy(createBidedCopySuccess,$scope.data);
          }else if($scope.eidtFlag=='bidedChange'){//定标报价选择否的时候
            $scope.addOfferModal.hide();
            hmsPopup.showLoading("正在保存");
            offerListService.createAward(createAwardSuccess,$scope.data);
          }else if($scope.eidtFlag=='newVersionBid'){//创建新版投标报价(新接口)
            $scope.addOfferModal.hide();
            hmsPopup.showLoading("正在保存");
            offerListService.createBid(createBidSuccess,$scope.data);
          }else if($scope.eidtFlag=='newVersionBided'){//创建新版定标报价(新接口)
            $scope.addOfferModal.hide();
            hmsPopup.showLoading("正在保存");
            offerListService.createAward(createAwardSuccess,$scope.data);
          }

        }
      };
      //销毁广播
      $scope.$on('$destroy',function(){//controller回收资源时执行
        INIT_OFFER();//回收广播
        EDIT_OFFER_BID_DETAIL();
        //CREATE_OFFER_BIDED_DETAIL();
        CREATE_NEW_OFFER_BID_DETAIL();
        CREATE_NEW_BIDED_DETAIL();
        CREATE_OFFER_BIDEDED_CHANGE_DETAIL();
        CREATE_OFFER_BIDEDED_NO_CHANGE_DETAIL();
      });
  }
]);
