angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.resources-query', {
          url: '/resources-query',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/resources-query.html',
              controller: 'resourceQueryController'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('resourceQueryController', [ ''+
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicModal',
    '$timeout',
    //'Prompter',
    '$ionicLoading',
    '$ionicScrollDelegate',
    'hmsHttp',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicModal,
              $timeout,
              //Prompter,
              $ionicLoading,
              $ionicScrollDelegate,
              hmsHttp
    ) {
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
    getNowFormatDate = function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + "-" + month + "-" + strDate;
      return currentdate;
    }
    var strDate = getNowFormatDate();
    var dateTo = new Date(strDate.replace(/\-/g, "/"));
    var now = new Date(strDate.replace(/\-/g, "/"));
    var dateFrom = new Date(now.setMonth(now.getMonth() - 1));
    window.localStorage.resourceNewHint = false;


    $scope.tableShow = false;
    $scope.toggleUpDownFlag = true;
    $scope.toggleLeftRightFlag = false;
    $scope.toggleUpDownAnimate = '';
    $scope.toggleLeftRightAnimate = '';
    $scope.queryParams = {
      dateFrom: dateFrom,
      dateTo: dateTo,
      employee: '',
      employeeId: '',
      employeeName: '',
      departmentId: '',
      groupId: ''
    }

    //模态框相关
    $ionicModal.fromTemplateUrl('build/pages/application/resources-query/modal/employee-modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.employeeModal = modal;
    });
    $scope.openEmployeeModal = function () {
      $scope.employeeModal.show();
    };

    //员工查询
    $scope.test = {
      enterEmployeeName: null
    };
    $scope.employeeSearch = function () {
      console.log("输入信息：", $scope.test.enterEmployeeName);
      if ($scope.test.enterEmployeeName == "" || $scope.test.enterEmployeeName == undefined || $scope.test.enterEmployeeName == null) {
        $ionicLoading.show({template: '请输入正确的查询条件!', duration: 2000});
      } else {
        var urlValueList = window.localStorage.wsurl + "/resource_query/get_employee_lists";
        var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_emp_name":"' + $scope.test.enterEmployeeName + '"}}';
        console.log(paramValueList);
        hmsHttp.post(urlValueList, paramValueList, $scope).success(function (response) {
          if (response.status == "S") {
            $scope.employeeItems = response.employeeLists;
            console.log("拉取列表成功" + angular.toJson($scope.employeeItems));
            if (response.employeeLists == "") {
              $ionicLoading.show({template: '工号或姓名有误！请重新输入!', duration: 2000});
            }


          } else {
            console.log("拉取列表失败：" + response.returnMsg);
          }
        }).error(function (response, status) {
          console.log("hmsHttp error ");
        });
      }

    };

    $scope.closeEmployeeModal = function () {
      $scope.employeeModal.hide();
    };
    $ionicModal.fromTemplateUrl('build/pages/application/resources-query/modal/department-modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.departmentModal = modal;
    });

    //部门选择
    $scope.openDepartmentModal = function () {
      $scope.departmentModal.show();
      var urlValueList = window.localStorage.wsurl + "/resource_query/get_department_lists";
      var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_department_name":"' + "" + '"}}';
      console.log(paramValueList);
      hmsHttp.post(urlValueList, paramValueList, $scope).success(function (response) {
        if (response.status == "S") {
          $scope.departmentItems = response.departmentLists;
          console.log("拉取列表成功" + angular.toJson($scope.departmentItems));

        } else {
          console.log("拉取列表失败：" + response.returnMsg);
        }
      }).error(function (response, status) {
        console.log("hmsHttp error ");
      });

    };
    $scope.closeDepartmentModal = function () {
      $scope.departmentModal.hide();
    };
    $ionicModal.fromTemplateUrl('build/pages/application/resources-query/modal/group-modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.groupModal = modal;
    });
    $scope.openGroupModal = function () {
      $scope.groupModal.show();
      if($scope.queryParams.department == "" || $scope.queryParams.department == undefined){
        $ionicLoading.show({template: '请先填写查询部门！', duration: 2000});
        $scope.groupModal.hide();
      }
      if ($scope.groupItems == "") {
        $ionicLoading.show({template: '该部门没有分组！', duration: 2000});
      }
    };
    $scope.closeGroupModal = function () {
      $scope.groupModal.hide();
    };

    //显示隐藏切换
    $scope.toggleQuery = function () {
      if ($scope.toggleUpDownFlag) {
        $scope.toggleUpDownAnimate = 'fadeOutUp';
        $timeout(function () {
          $scope.toggleUpDownFlag = !$scope.toggleUpDownFlag;
        }, 500)
      } else {
        $scope.toggleUpDownAnimate = 'fadeInDown';
        $scope.toggleUpDownFlag = !$scope.toggleUpDownFlag;
      }
    }
    $scope.toggleLeft = function () {
      if ($scope.toggleLeftRightFlag) {
        $scope.toggleLeftRightAnimate = 'fadeOutLeft';
        $scope.toggleLeftRightFlag = !$scope.toggleLeftRightFlag;
      } else {
        $scope.toggleLeftRightAnimate = 'fadeInRight';
        $scope.toggleLeftRightFlag = !$scope.toggleLeftRightFlag;
      }
    }

    //是否包含离职人员
    $scope.dimission = {};
    $scope.dimissionCtrl = {};
    $scope.dimissionCtrl.dimissionInclude = "N";
    $scope.dimissionClick = function () {
      if ($scope.dimission.include) {
        $scope.dimissionCtrl.dimissionInclude = "Y";
      } else {
        $scope.dimissionCtrl.dimissionInclude = "N";
      }
      console.log("====", $scope.dimissionCtrl.dimissionInclude);
    }
//时间格式转换
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    };
    //执行查询
    $scope.doQuery = function () {
      // $scope.toggleQuery(); // mod by ciwei

      //判断输入信息
      if ($scope.queryParams.dateFrom == "" || $scope.queryParams.dateFrom == undefined ||
        $scope.queryParams.dateTo == "" || $scope.queryParams.dateTo == undefined) {
        $ionicLoading.show({template: '请输入开始时间和结束时间！', duration: 2000});
      } else {
        if ($scope.queryParams.dateFrom > $scope.queryParams.dateTo) {
          $ionicLoading.show({template: '结束时间早于开始时间！', duration: 2000});
        } else {
          if ($scope.queryParams.employeeId == "" &&
            $scope.queryParams.departmentId == "" &&
            $scope.queryParams.groupId == "") {
            $ionicLoading.show({template: '请至少输入一项查询条件！', duration: 2000});
          } else {
            $scope.toggleQuery();// add by ciwei
            //Prompter.showLoading("Loading...");
            var dateForm = formatDate($scope.queryParams.dateFrom);
            var dateTo = formatDate($scope.queryParams.dateTo);
            var urlValueList = window.localStorage.wsurl + "/resource_query/get_resource_result";
            var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '",' +
              '"p_department_id":"' + $scope.queryParams.departmentId + '",' +
              '"p_sub_dept_id ":"' + $scope.queryParams.groupId + '",' +
              '"p_emp_id":"' + $scope.queryParams.employeeId + '",' +
              '"p_date_from":"' + dateForm + '",' +
              '"p_date_to":"' + dateTo + '",' +
              '"p_dimission_include":"' + $scope.dimissionCtrl.dimissionInclude + '"}}';
            console.log(paramValueList);
            hmsHttp.post(urlValueList, paramValueList, $scope).success(function (response) {
              if (response.status == "S") {

                $scope.headerItems = response.headerItems;
                $scope.lineItems = response.lineItems;
                console.log("拉取列表成功" + angular.toJson(response));
                $scope.tableShow = true;
                //Prompter.hideLoading("");
              } else {
                console.log("拉取列表失败：" + response.returnMsg);
                //Prompter.hideLoading("");
                $ionicLoading.show({template: response.returnMsg, duration: 2000});
              }
            }).error(function (response, status) {
              console.log("hmsHttp error ");
              //Prompter.hideLoading("");
            });
          }
        }
      }

    }
    //滑动定位
    $scope.scroll = function () {
      var scrollLeft = $ionicScrollDelegate.$getByHandle('tableBody').getScrollPosition().left;
      $ionicScrollDelegate.$getByHandle('tableHeader').scrollTo(scrollLeft, 0);
    }

    //自适应列宽
    $scope.resetWidth = function (index, str) {
      var newWidth = str.length * 0.875 + 0.5;
      if (newWidth > 3.5) {
        var className = "column-" + index;
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.width = newWidth + 'rem';
        }
      }
    }

    //员工、部门、分组、项目选择与清选
    $scope.employeeChoose = function (item) {
      $scope.queryParams.employeeId = item.value;
      $scope.queryParams.employeeName = item.name;
      $scope.queryParams.employee = item.name;
      $scope.employeeModal.hide();
    }
    $scope.clearEmployeeChoose = function () {
      $scope.queryParams.employeeId = '';
      $scope.queryParams.employeeName = '';
      $scope.queryParams.employee = '';
      $scope.employeeModal.hide();
    }

    $scope.departmentChoose = function (item) {
      $scope.queryParams.departmentId = item.value;
      $scope.queryParams.department = item.name;
      $scope.departmentModal.hide();

      var urlValueList = window.localStorage.wsurl + "/resource_query/get_sub_dept_lists";
      var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_department_id":"' + item.value + '"}}';
      console.log(paramValueList);
      hmsHttp.post(urlValueList, paramValueList, $scope).success(function (response) {
        if (response.status == "S") {
          $scope.groupItems = response.subDeptLists;
          console.log("拉取列表成功" + angular.toJson($scope.groupItems));
          if ($scope.groupItems == "") {
            console.log("该部门没有分组");
            //$ionicLoading.show({template: 'aaaaaaaaaaaaaaaaaaaaa！', duration: 2000});
          }
        } else {
          console.log("拉取列表失败：" + response.returnMsg);
        }
      }).error(function (response, status) {
        console.log("hmsHttp error ");
      });

    }
    //部门清选
    $scope.clearDepartmentChoose = function () {
      $scope.queryParams.department = '';
      $scope.queryParams.departmentId = '';
      $scope.queryParams.departmentName = '';
      $scope.queryParams.group = '';
      $scope.queryParams.groupId = '';
      $scope.queryParams.groupName = '';
      $scope.departmentModal.hide();
    }

    $scope.groupChoose = function (item) {
      $scope.queryParams.groupId = item.value;
      $scope.queryParams.group = item.name;
      $scope.groupModal.hide();
    }
    //分组清选
    $scope.clearGroupChoose = function () {
      $scope.queryParams.group = '';
      $scope.queryParams.groupId = '';
      $scope.queryParams.groupName = '';
      $scope.groupModal.hide();
    }
  }
]);





