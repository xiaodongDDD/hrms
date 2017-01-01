/**
 * Created by wkh on 2016/10/27.
 */
'use strict';
angular.module('customerModule')
  .controller('CustomerDetailCollaboratorsCtrl', [
    '$scope',
    '$state',
    'hmsPopup',
    'hmsHttp',
    '$ionicActionSheet',
    'contactLocal',
    '$cordovaActionSheet',
    'baseConfig',
    '$ionicModal',
    'opportunityDetailService',
    '$ionicScrollDelegate',
    '$filter',
    'customerDetailService',
    '$timeout',
    'customerDetailCollaborator',
    'customerService',
    '$ionicHistory',
    function ($scope,
              $state,
              hmsPopup,
              hmsHttp,
              $ionicActionSheet,
              contactLocal,
              $cordovaActionSheet,
              baseConfig,
              $ionicModal,
              opportunityDetailService,
              $ionicScrollDelegate,
              $filter,
              customerDetailService,
              $timeout,
              customerDetailCollaborator,
              customerService,
              $ionicHistory) {
      console.log("CustomerDetailContactCtrl");
      customerDetailService.setTabNumber(3);
      var url = baseConfig.basePath + "customer_collaborator";
      $scope.collaboratorData = {
        "page": 1,
        "pageSize": 10,
        "customerId": customerDetailService.getCustomerId()
      };
      $scope.searchModel = {
        searchValueKey: ""
      };
      $scope.data = {
        employeeId: ""
      };
      $scope.showData = {
        name: ""
      };
      $scope.sourceItems = [];
      $scope.noDataFlag = false;
      $scope.empno = window.localStorage.empno;//登陆人
      $scope.collaborators = [];
      $scope.leading_official = {};
      $scope.showCrmLoading = true;
/*      hmsHttp.post(url, data).success(function (data) {
        $scope.showCrmLoading = false;
        $scope.collaborators = data.collaborators;
        for (var i = 0; i < $scope.collaborators.length; i++) {
          if ($scope.collaborators[i].shareType == "HCRM_SHARE_TEAM") {
            $scope.collaborators[i].name = $scope.collaborators[i].saleTeam;
          }
        }
        $scope.leading_official = data.leading_official;
      }).error(function (data) {
        hmsPopup.hideLoading();
        hmsPopup.showPopup(data.returnMsg);
      });*/
      var getCollaboratorList=function(data){
        $scope.showCrmLoading = false;
        if(data.collaborators.length<$scope.collaboratorData.pageSize||data.collaborators.length==0){
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.collaborators = $scope.collaborators.concat(data.collaborators);
        for (var i = 0; i < $scope.collaborators.length; i++) {
          if ($scope.collaborators[i].shareType == "HCRM_SHARE_TEAM"||$scope.collaborators[i].shareType == "TEAM") {
            $scope.collaborators[i].name = $scope.collaborators[i].saleTeam;
          }
        }
        $scope.leading_official = data.leading_official;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      customerDetailCollaborator.getCollaborator(getCollaboratorList, $scope.collaboratorData );
      var invalidSuccess = function (result, index) {
        hmsPopup.hideLoading();
        if (result.returnCode == "S") {
          $scope.collaborators.splice(index, 1);
          hmsPopup.showPopup(result.returnMsg);
        } else {
          if(result.returnMsg){
            hmsPopup.showShortCenterToast(result.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      };
      var doRefreshSuccess=function(data){
        console.log(data);
        $scope.showCrmLoading = false;
        if(data.collaborators.length<$scope.collaboratorData.pageSize||data.collaborators.length==0){
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.collaborators = data.collaborators;
        for (var i = 0; i < $scope.collaborators.length; i++) {
          if ($scope.collaborators[i].shareType == "HCRM_SHARE_TEAM"||$scope.collaborators[i].shareType == "TEAM") {
            $scope.collaborators[i].name = $scope.collaborators[i].saleTeam;
          }
        }
        $scope.leading_official = data.leading_official;
      };
      $scope.doRefresh=function(){
        $scope.data  = {
          "page": 1,
          "pageSize": 10,
          "customerId": customerDetailService.getCustomerId()
        };
        $scope.moreDataCanBeLoaded = true;
        customerDetailCollaborator.getCollaborator(doRefreshSuccess, $scope.data );
        $scope.$broadcast('scroll.refreshComplete');
      };
      $scope.loadMoreColl=function(){
        $scope.collaboratorData .page++;
        var error = function (response) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        customerDetailCollaborator.getCollaborator(getCollaboratorList, $scope.collaboratorData );
      };
      $scope.collaboratorInvalid = function (item, index) {
        //hmsPopup.showLoading("操作协作人");
        /* historyContact.removeHistory(item);*/

        console.log(item);
        var deleteData = {
          shareId: item.shareId,
          customerId:customerDetailService.getCustomerId()
        };
        customerDetailService.collaboratorInvalid(deleteData, invalidSuccess, index);
      };
      $scope.transfer = function (item) {
        $scope.showSelectDiv('transfer');
        /*       var transferParam= {
         "customerId": window.localStorage.customerId,
         "transferBeforEmp": item.employeeCode,
         "transferAfterEmp": "25050",
         "effectiveDate": "2016-10-26",
         "description": "没有原因行吗"
         }*/
      };
      var getCustomerSuccess = function (response) {
        $scope.showCrmLoading = false;
        console.log("more");
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.employee_list.length; i++){
            response.employee_list[i].showModal = response.employee_list[i].name + ' (' + response.employee_list[i].employeeCode + ')   ' + response.employee_list[i].organizationName;
          }
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
        } else {
          if (response.returnMsg) {
            $scope.moreDataCanBeLoaded = false;
            hmsPopup.showShortCenterToast(response.returnMsg)
          }
          else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      var getCustomerSearchSuccess = function () {

      };
      var transferCustomerSuccess = function (reslut) {
        if (reslut.returnCode == 'S') {
          hmsPopup.showPopup(reslut.returnMsg);
        } else {
          if(reslut.returnMsg){
            hmsPopup.showShortCenterToast(reslut.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      };
      //搜索框
      $scope.nowPage = 1;
      $scope.pageSize = 1000;
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'transfer',
        'interface': customerService.getEmployee,  //获得选择项的接口
        'params': [getCustomerSuccess, '',$scope.nowPage, $scope.pageSize],  //获得选择项时接口所需参数
        'showKey': 'showModal',            //选择界面显示的数据
        'dataKey': 'userId',      //对象内最终操作提交所需的数据变量
        'dataModel': '$scope.data.employeeId',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.name', //显示在界面上的ng-model
        'searchInterface': customerService.getEmployee,
        'searchParams': getCustomerSuccess,
        'needShowMore': true
      }
      ];

      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmSelectModal = modal1;
      });

      $scope.showSelectDiv = function(key){
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        if ($scope.showSelect) {
          $scope.crmSelectModal.hide();
          $scope.showLoading = false;
        } else {
          $scope.crmSelectModal.show();
          $scope.showLoading = true;
        }
        $scope.showSelect = !$scope.showSelect;
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if(!$scope.showSelect)
          return ;
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
        $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      };

      //克隆对象
      function cloneObj(obj){
        function Clone(){}
        Clone.prototype = obj;
        var o = new Clone();
        for(var a in o){
          if(typeof o[a] == "object") {
            o[a] = cloneObj(o[a]);
          }
        }
        return o;
      }


      $scope.selectItem = function($index){
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        showKey = (showKey == '空') ? "" : showKey;
        var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
        var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
        eval(dataModel + " = data");
        eval(showDataModel + " = showKey");
        var date = $filter('date')(new Date(), 'yyyy-MM-dd');
        var transferParam = {
          "customerId": customerDetailService.getCustomerId(),
          "transferBeforEmp": window.localStorage.empno,
          "transferAfterEmp": data,
          "effectiveDate": "",
          "description": "转移原因"
        };
        console.log('客户转移值=='+angular.toJson(transferParam));
        customerDetailService.customerTransfer(transferCustomerSuccess, transferParam);
        $scope.showSelectDiv();
      };

      $scope.loadMore = function() {
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

      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone=function(){
        return [].concat(this);
      };



      $scope.searchSelectValue = function(){
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if($scope.nowSelectTarget['searchInterface']){
          //需要接口搜索的
          $scope.showLoading = true;
          $scope.moreDataCanBeLoaded = false;
          if($scope.searchModel.searchValueKey == ''){
            $scope.items = [];
            $scope.nowPage = 1;
            $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
            $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
          } else{
            $scope.items = [];
            $scope.nowPage = 1;
            $scope.pageSize = 1000;
            $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
          }
        } else {
          //本地字段搜索的
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

      $scope.clearSelectFilter = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
      };

      $scope.goEmployeeDetail = function (newEmployeeNumber) {
        if($ionicHistory.viewHistory().backView.stateName=="tab.contactDetail"){
        $state.go('tab.employeeDetailCrm', {employeeNumber: newEmployeeNumber});
        }else{
          $state.go('tab.employeeDetailCrm2', {employeeNumber: newEmployeeNumber});
        }
      };

    }]);
angular.module('customerModule')
.service('customerDetailCollaborator',function(baseConfig,hmsHttp,hmsPopup){
    var baseUrl = baseConfig.basePath;
    this.getCollaborator = function (success, key, index) {
      hmsHttp.post(baseUrl + 'customer_collaborator', key, index).success(function (result) {
        hmsPopup.hideLoading();
        success(result, index);
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        //hmsPopup.showPopup(response.error_description);
      });
    };
  });
