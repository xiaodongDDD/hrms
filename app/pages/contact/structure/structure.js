/**
 * Created by daiwen on 16/7/21. (-wen.dai-)
 */

'use strict';
//--通讯录组织架构模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.contactStructure', {
          url: '/contact/contactStructure',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/structure/structure.html',
              controller: 'structureCtl'
            }
          },
          params: {
            routeId: "1",
            structureId: "1",
            currentDepartInfo: {}
          }
        })
    }]);

angular.module('myApp')
  .controller('structureCtl', [
    '$scope',
    'hmsPopup',
    '$state',
    '$stateParams',
    'structureDelegate',
    'getInitStructureInfo',
    '$ionicHistory',
    '$ionicScrollDelegate',
    '$timeout',
    function ($scope,
              hmsPopup,
              $state,
              $stateParams,
              structureDelegate,
              getInitStructureInfo,
              $ionicHistory,
              $ionicScrollDelegate,
              $timeout) {
      /**
       * var section
       */

      {
        var curr_page = ''; //当前组织架构层级的页面
        var curr_department_id = ''; //当前页面所在组织的department ID
        var viewTag = document.getElementsByTagName('ion-view');
        var viewName = viewTag[viewTag.length - 1].attributes[0].value;
        // var screenWidth = document.body.clientWidth;
        var screenWidth = 320; //iphone 5 的宽度
        var structureParams = {
          "id": ""
        };
        $scope.childrenDept = []; //当前组织下一级的信息
        $scope.deptStaff = []; //当前这一级组织用户信息
        $scope.departmentName = ''; //当前组织所属层级的名字
        $scope.totalStaffNumber = ''; //当前组织所属层级的总人数(包括全部下级的人数)
        $scope.currentStackList = [{name: '通讯录', id: ''}]; //页栈列表
      }

      curr_page = $stateParams.routeId;
      curr_department_id = $stateParams.structureId;
      structureParams.id = curr_page;

      function dynamicAddScrollWidth() { //动态增长ion-scroll的宽度
        var newWidth = parseInt(screenWidth);
        var stackListLength = $scope.currentStackList.length;
        if (stackListLength == 2) {
          newWidth = parseInt(screenWidth) + 'px';
        } else if (stackListLength > 2) {
          for (var i = 2; i < stackListLength; i++) {
            newWidth += 15 * ($scope.currentStackList[i].name.length + 1);
          }
          newWidth = newWidth + 'px';
        }
        angular.element('.row-scroll-contact').css('width', newWidth);
      };

      $scope.$on('$ionicView.beforeEnter', function (e) {
        $ionicScrollDelegate.$getByHandle('contactStructureDelegate').scrollTop();
      });

      function getStructureInfo(result) { //获取数据的回调函数
        try {
          if (Object.keys(result).length !== 0) {
            $ionicScrollDelegate.$getByHandle('contactStructureDelegate').scrollBy(1000, 0, true);
            $scope.childrenDept = result.childrenDept;
            $scope.deptStaff = result.deptStaff;
            $scope.departmentName = result.departmentName;
            $scope.totalStaffNumber = result.totalStaffNumber;
            if (curr_page === 'currentDepartment') {
              $scope.currentStackList = [{name: '通讯录', id: ''}];
            }
            angular.forEach(result.deptInfo, function (data, index) {
              $scope.currentStackList.push(data);
            });
            dynamicAddScrollWidth();
          }
        } catch (e) {
        }
      }

      if ($stateParams.routeId === 'currentDepartment') {
        var currentInfo = $stateParams.currentDepartInfo;
        $scope.childrenDept = [];
        $scope.deptStaff = currentInfo.deptStaff;
        for (var i = 1; i < currentInfo.deptInfo.length; i++) {
          if (i === (currentInfo.deptInfo.length - 1)) {
            $scope.departmentName += currentInfo.deptInfo[i].name;
          } else {
            $scope.departmentName += currentInfo.deptInfo[i].name + '-';
          }
        }
        $scope.totalStaffNumber = '';
        angular.forEach(currentInfo.deptInfo, function (data, index) {
          $scope.currentStackList.push(data);
        });
        $timeout(function () {
          $ionicScrollDelegate.$getByHandle('contactStructureDelegate').scrollBy(1000, 0, true);
        }, 300);
        dynamicAddScrollWidth();
      } else {
        getInitStructureInfo.getStructure(getStructureInfo, curr_department_id);
      }


      $scope.goLastPage = function () { //返回按钮的响应
        $scope.currentStackList.pop();
        // warn(jsonFormat($scope.currentStackList));
        dynamicAddScrollWidth();
        $ionicHistory.goBack();
      };

      $scope.goInputSearch = function () { //去搜索界面
        $state.go('tab.contactSearch');
      };

      $scope.goBackStack = function (index, length, newId) {
        if ($stateParams.routeId === 'currentDepartment') {
          getInitStructureInfo.getStructure(getStructureInfo, newId);
          if (index === 0) {
            $ionicHistory.goBack();
          }
        } else {
          index = parseInt(index) - parseInt(length) + 1;
          // $ionicScrollDelegate.$getByHandle('contactStructureDelegate').resize();
          $ionicHistory.goBack(index);
        }
      };
      $scope.nextStructure = function (newDepartmentId) { //到下一级组织架构界面
        try {
          if (curr_page === 'currentDepartment') {
            curr_page = '';
          }
          if (curr_page >= structureDelegate.getStructureId()) {
            curr_page = '';
          }
          structureDelegate.setStructureId(['1', '2']); //provider 在controller中的使用方法
          if ($scope.childrenDept.length != 0 || $scope.childrenDept.length) {
            $state.go("tab.contactStructure" + curr_page, {
              routeId: ++curr_page,
              structureId: newDepartmentId
            });
          }
        } catch (e) {
          warn("update the highest!" + e);
        }
      };

      $scope.goDetailInfo = function (newEmployeeNumber) { //去详情界面
        $state.go('tab.employeeDetail', {employeeNumber: newEmployeeNumber});
      };
    }
  ])
  .provider('structureDelegate', function () {
    this._id = 15;
    this.$get = function () {
      var that = this;
      return {
        getStructureId: function () {
          return that._id;
        },
        setStructureId: function (newIdArray) {
          that._id = newIdArray;
        }
      }
    }
  })
  .config(['$stateProvider', 'structureDelegateProvider',
    function ($stateProvider, structureDelegateProvider) {
      for (var i = 1; i < structureDelegateProvider._id; i++) { //循环路由
        $stateProvider.state('tab.contactStructure' + i, {
          url: '/contact/contactStructure/' + i,
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/structure/structure.html',
              controller: 'structureCtl'
            }
          },
          params: {
            routeId: "",
            structureId: ""
          }
        });
      }
    }]);
