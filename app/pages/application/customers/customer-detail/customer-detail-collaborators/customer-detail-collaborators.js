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
              customerDetailCollaborator) {
      console.log("CustomerDetailContactCtrl");
      var url = baseConfig.basePath + "customer_collaborator";
      $scope.collaboratorData = {
        "page": 1,
        "pageSize": 10,
        "customerId": window.localStorage.customerId
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
          if ($scope.collaborators[i].shareType == "HCRM_SHARE_TEAM") {
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
          hmsPopup.showPopup(result.returnMsg);
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
          if ($scope.collaborators[i].shareType == "HCRM_SHARE_TEAM") {
            $scope.collaborators[i].name = $scope.collaborators[i].saleTeam;
          }
        }
        $scope.leading_official = data.leading_official;
      };
      $scope.doRefresh=function(){
        $scope.data  = {
          "page": 1,
          "pageSize": 10,
          "customerId": window.localStorage.customerId
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
        hmsPopup.showLoading("操作协作人");
        /* historyContact.removeHistory(item);*/
        console.log(item);
        var deleteData = {
          shareId: item.shareId
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
        if (response.returnCode == 'S') {
          $scope.showCrmLoading = false;
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
        }
      };
      var getCustomerSearchSuccess = function () {

      };
      var transferSuccess = function (reslut) {
        hmsPopup.showLoading("正在转移负责人");
        if (reslut.returnCode == 'S') {
          hmsPopup.hideLoading();
          hmsPopup.showPopup(reslut.returnMsg);
        } else {
          hmsPopup.hideLoading();
          hmsPopup.showPopup(reslut.returnMsg);
        }
      };
      //搜索框
      $scope.nowPage = 1;
      $scope.pageSize = 30;
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'transfer',
        'interface': opportunityDetailService.getCustomerEmployee,  //获得选择项的接口
        'params': [getCustomerSuccess, $scope.nowPage, $scope.pageSize, ""],  //获得选择项时接口所需参数
        'showKey': 'name',            //选择界面显示的数据
        'dataKey': 'employeeId',      //对象内最终操作提交所需的数据变量
        'dataModel': '$scope.data.employeeId',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.name', //显示在界面上的ng-model
        'searchInterface': opportunityDetailService.getCustomerEmployee,
        'searchParams': getCustomerSearchSuccess,
        'needShowMore': true
      }
      ];
      $scope.loadMore = function () {
        console.log("上拉加载");
        $scope.nowPage++;
        for (var i = 0; i < $scope.nowSelectTarget.params.length; i++) {
          if ($scope.nowSelectTarget.params[i] == $scope.nowPage - 1) {
            $scope.nowSelectTarget.params[i] = $scope.nowPage;
            break;
          }
        }
        $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
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
          $timeout(function () {
            $scope.showCrmLoading = true;
          }, 100);

        }
        $scope.showSelect = !$scope.showSelect;
        if (!$scope.showSelect)
          return;
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        for (var i = 0; i < $scope.selectTargets.length; i++) {
          if (key == $scope.selectTargets[i].key) {
            $scope.nowSelectTarget = cloneObj($scope.selectTargets[i]);
            break;
          }
        }
        var showKey = $scope.nowSelectTarget['showKey'];
        var dataKey = $scope.nowSelectTarget['dataKey'];
        eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
        $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
        $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
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
        var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
        var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
        eval(dataModel + " = data");
        eval(showDataModel + " = showKey");
        $scope.showSelectDiv();
        var transferParam = {
          "customerId": window.localStorage.customerId,
          "transferBeforEmp": $scope.leading_official.employeeCode,
          "transferAfterEmp": $scope.data.employeeId,
          "effectiveDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
          "description": "转移原因"
        };
        customerDetailService.transferEmployee(transferParam, transferSuccess);
      };

      $scope.clearSelectFilter = function () {
        console.log("clear");
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
        /* $scope.items = $scope.data.clone();*/
      };
      $scope.searchSelectValue = function () {
        if ($scope.nowSelectTarget['searchInterface']) {
          $scope.showCrmLoading = true;
          //需要接口搜索的
          if ($scope.searchModel.searchValueKey == '') {
            $scope.items = [];
            $scope.nowPage = 1;
            $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
            $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
          } else {
            $scope.nowPage = 1;
            $scope.pageSize = 15;
            $scope.nowSelectTarget.searchInterface.call(null, $scope.nowSelectTarget.searchParams, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize);
          }
        } else {
          //本地字段搜索的
          var notShowNum = 0;
          if ($scope.searchModel.searchValueKey == '') {
            $scope.noDataFlag = false;
            $scope.items = $scope.sourceItems.clone();
          }
          else {
            for (var i = 0; i < $scope.sourceItems.length; i++) {
              if (isContains($scope.sourceItems[i][$scope.nowSelectTarget['showKey']], $scope.searchModel.searchValueKey))
                $scope.items[i] = $scope.sourceItems[i];
              else {
                $scope.items[i] = '';
                notShowNum++;
              }
            }
            $scope.noDataFlag = notShowNum == $scope.sourceItems.length;
          }
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
        hmsPopup.showPopup(response.error_description);
      });
    };
  });
