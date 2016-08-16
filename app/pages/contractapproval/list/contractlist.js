angular.module('myApp')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('tab.contractlist', {
          url: '/contractlist',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/contractapproval/list/contractlist.html',
              controller: 'contractlistCtrl'
            }
          }
        });
    }
  ]);
// created by yufei.lu 2016-08-15
// 整个contractList实质上是由workflow改过来的
angular.module('applicationModule')
  .controller('contractlistCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    'hmsPopup',
    'baseConfig',
    'contractListService',
    '$ionicScrollDelegate',
    function($scope,
      $state,
      $stateParams,
      $ionicModal,
      $timeout,
      hmsPopup,
      baseConfig,
      contractListService,
      $ionicScrollDelegate) {

      $scope.list = [];
      $scope.listBackup = []; //备份列表数据，在筛选时使用。
      var cashList = [];
      $scope.fetchDataFlag = true;
      $scope.pullRefreshDataFlag = false;
      $scope.showDetailArrow = true;
      $scope.listStatus = {
        todo: {
          selected: true
        }
      };

      $scope.pageNumLimit = 10;
      $scope.loadMoreDataFlag = false;
      $scope.pageNum = 1;

      var filterOption = {
        "currentSelectType": "ALL",
        "currentSubmitterFilter": "",
        "submitterFilter": [],
      };

      var defaultIcon = 'build/img/application/profile@3x.png';
      var startTime = '开始时间';
      var author = '发起人';
      var desc = '说明';

      var refreshTodoList = function() {
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $scope.fetchDataFlag = true;
        $scope.pullRefreshDataFlag = false;
        $scope.listStatus.todo.selected = true;
        $timeout(function() {
          getTodoList(false);
        }, 500);
      };

      var showList = function() {
        $timeout(
          function() {
            $scope.fetchDataFlag = false;
          }, 100
        );
      };

      //处理获取到的数据列表
      var processTodoList = function(result) {
        if (result.status == 'S') {
          var list = result.unprocessedWorkflowList;
          angular.forEach(list, function(data) {
            var employeeImg = data.employee_img;
            if (!employeeImg || employeeImg == "") {
              employeeImg = defaultIcon;
            }
            var item = {
              title1: data.procDescr,
              icon: employeeImg,
              type: startTime,
              typeValue: data.startDate,
              node: author,
              nodeValue: data.author,
              submit: desc,
              submitPerson: data.description,
              originData: data
            };
            //这时顺便把筛选的选项生成
            if (!$scope.filterPersonList.returnData.personList[data.author]) {
              $scope.filterPersonList.returnData.personList[data.author] = true;
            }
            $scope.list.push(item);
          });
          $scope.listBackup = $scope.list.concat();
          dataFilterUtil().query();
        } else {
          hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
        }
      };

      //获取数据列表
      var getTodoList = function(pullRefresh) {
        $scope.firstLoadFlag = true;
        $scope.loadMoreDataFlag = false;
        $scope.pageNum = 1;
        $scope.list = [];
        $scope.listBackup = [];
        $scope.filterPersonList = {
          returnStatus: 'S',
          returnData: {
            personList: {}
          }
        };
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function(result) {
          processTodoList(result);
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          console.log('todo var success = function(result) {');
          if (result.unprocessedWorkflowList.length > $scope.pageNumLimit * $scope.pageNum) {
            $scope.loadMoreDataFlag = true;
            console.log('getTodoList $scope.loadMoreDataFlag = true;');
          }
          showList();
        };
        var error = function(result) {
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          showList();
        };
        $timeout(function() {
          var filterCondition = dataFilterUtil().fetchFilterCondition();
          contractListService.getTodoList('N', filterCondition.workflowId, $scope.type, $scope.pageNum, success, error);
        }, 0);
      };

      // 筛选列表，每次先从备份数据中深度拷贝一份，然后进行删除操作
      $scope.fetchTodoList = function(refreshFlag) {
        $scope.loadMoreDataFlag = false;
        $scope.pageNum = 1;

        if (baseConfig.debug) {
          console.log('$scope.fetchTodoList ');
        }
        if (!refreshFlag) {
          dataFilterUtil().clearFilterCondition();
        }
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();

        $timeout(function() {
          if ($scope.listStatus.todo.selected && !refreshFlag) {} else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.todo.selected = true;
              //getTodoList(false);
              $scope.list = $scope.listBackup.concat();
              if (filterOption.currentSelectType == 'PERSON' && filterOption.currentSubmitterFilter != '全部') {
                for (var i = $scope.list.length - 1; i >= 0; i--) {
                  console.log($scope.list[i].nodeValue + ' vs ' + dataFilterUtil().fetchFilterCondition().itemDesc);
                  if ($scope.list[i].nodeValue != dataFilterUtil().fetchFilterCondition().itemDesc) {
                    $scope.list.splice(i, 1);
                  }
                }
              }
              if ($scope.list.length > $scope.pageNumLimit * $scope.pageNum) {
                $scope.loadMoreDataFlag = true;
                console.log('fetchTodoList $scope.loadMoreDataFlag = true;');
              }
              if (!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      // 下拉加载更多数据，这里只是变了限数，
      var loadMoreFetchTodoList = function() {
        var success = function(result) {
          console.log('var loadMoreFetchTodoList = function() {');
          if ($scope.list.length < $scope.pageNumLimit * $scope.pageNum) {
            $scope.loadMoreDataFlag = false;
            console.log('$scope.loadMoreDataFlag = false;');
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        success();
      };

      $scope.loadMoreData = function() {
        console.log('$scope.loadMoreData = function() {');
        if (!$scope.firstLoadFlag) {
          $scope.pageNum = $scope.pageNum + 1;
        } else {
          $scope.firstLoadFlag = false;
        }
        loadMoreFetchTodoList();
      };

      // 筛选上拉菜单模型
      $ionicModal.fromTemplateUrl('build/pages/public/modal/hms-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function(modal) {
        $scope.filterModal = modal;
      });

      $scope.filterWorkFlowInfo = function() { //响应筛选按钮的方法
        $scope.filterModal.show();
      };

      $scope.refresh = function() {
        if (!$scope.fetchDataFlag) {
          dataFilterUtil().clearFilterCondition();
          $scope.list = [];
          $scope.listBackup = [];
          $scope.$apply();
          $timeout(function() {
            if ($scope.listStatus.todo.selected) {
              getTodoList(true);
            } else {
              getDoneList(true);
            }
          }, 0);
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      };

      // 筛选上拉菜单句柄
      $scope.dataFilterHandle = {
        cancelDataFilter: function() {
          $scope.filterModal.hide();
        },
        clearDataFilterParams: function() {
          $scope.filterModal.hide();
        },
        confirmDataFilter: function() {
          if (baseConfig.debug) {
            console.log('dataFilterUtil.filterOption ' + angular.toJson(filterOption));
          }
          $scope.filterModal.hide();

          if (baseConfig.debug) {
            console.log('$scope.listStatus.todo.selected ' + $scope.listStatus.todo.selected)
          }

          if ($scope.listStatus.todo.selected) {
            $scope.fetchTodoList(true);
          } else {
            $scope.fetchDoneList(true);
          }

        },
        selectFilterType: function(type) {
          if (baseConfig.debug) {
            console.log('type ' + angular.toJson(type));
          }
          angular.forEach($scope.selectFilterTypeList, function(data) {
            data.selected = false;
          });
          type.selected = true;
          $scope.filterItemList = [];

          $ionicScrollDelegate.$getByHandle('hmsFilterCondition').scrollTop();

          if (type.code == 'ALL') {
            filterOption.currentSelectType = 'ALL';
            $scope.filterItemList = filterOption.noConditionFilter;

          } else if (type.code == 'PERSON') {
            filterOption.currentSelectType = 'PERSON';
            $scope.filterItemList = filterOption.submitterFilter;
          }
        },
        selectFilterItem: function(filterItem) {
          if (baseConfig.debug) {
            console.log('filterItem ' + angular.toJson(filterItem));
          }
          angular.forEach($scope.filterItemList, function(data) {
            data.selected = false;
          });
          filterItem.selected = true;
          if (filterOption.currentSelectType == 'PERSON') {
            filterOption.currentSubmitterFilter = filterItem.itemDesc;
          }
          if (baseConfig.debug) {
            console.log('filterOption.currentSubmitterFilter ' + filterOption.currentSubmitterFilter);
          }
        }
      };

      var dataFilterUtil = function() {
        var self = {};

        self.clearFilterCondition = function() {
          filterOption.currentSelectType = 'ALL'
          filterOption.currentSubmitterFilter = '';
        };

        self.fetchFilterCondition = function() {
          var condition = {
            "workflowId": "",
            "submitterId": ""
          };
          if (filterOption.currentSelectType == 'ALL') {
            return condition;
          } else {
            condition.itemDesc = filterOption.currentSubmitterFilter;
            return condition;
          }
        };

        self.query = function() {
          var success = function(result) {
            if (result.returnStatus == 'S') {
              if (baseConfig.debug) {
                console.log('result ' + angular.toJson(result));
              }
              $scope.selectFilterTypeList = [{
                "code": "ALL",
                "name": "全部",
                "selected": true
              }, {
                "code": "PERSON",
                "name": "提交人",
                "selected": false
              }];
              if (baseConfig.debug) {
                console.log('dataFilterUtil.cashList ' + angular.toJson(cashList));
              }
              filterOption.submitterFilter = [];
              filterOption.noConditionFilter = [];
              $scope.filterItemList = [];
              filterOption.currentSubmitterFilter = '';
              var noCondition = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.noConditionFilter.push(noCondition);
              var submitterF = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.submitterFilter.push(submitterF);
              for (i in result.returnData.personList) {
                if (i == '') i = '(没有填写)';
                var person = {
                  "itemDesc": i,
                  "selected": false
                };
                filterOption.submitterFilter.push(person);
              }
              $scope.filterItemList = filterOption.noConditionFilter;

              if (baseConfig.debug) {
                console.log('self.filterOption.submitterFilter ' + angular.toJson(filterOption.submitterFilter));
              }

              //$scope.$apply();
            }
          };
          var error = function(response) {};
          var processedFlag = 'N';
          console.log('ready to function success()');
          console.log($scope.filterPersonList);
          success($scope.filterPersonList);
        };
        return self;
      };

      $timeout(function() {
        getTodoList(false);
      }, 400);

      $scope.$on('$ionicView.enter', function(e) {
        if (baseConfig.debug) {
          console.log('contractListCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$ionicView.beforeEnter', function() {
        if (baseConfig.debug) {
          console.log('contractListCtrl.$ionicView.beforeEnter');
        }
        if (contractListService.getRefreshWorkflowList().flag == true) {
          contractListService.setRefreshWorkflowList(false);
          if (baseConfig.debug) {
            console.log('refresh contract list');
          }
          refreshTodoList();
        }
      });

      $scope.$on('$ionicView.afterEnter', function() {
        if (baseConfig.debug) {
          console.log('contractListCtrl.$ionicView.afterEnter');
        }

        //设置头部导航按钮宽度
        var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
        var subheadereWidth = 0;
        for (var i = 0; i < subheaderTitles.length; i++) {
          subheadereWidth += subheaderTitles[i].clientWidth;
        }
        document.getElementById('contractSubheaderScroll').style.width = subheadereWidth + 'px';
      });

      $scope.$on('$ionicView.beforeLeave', function() {
        if (baseConfig.debug) {
          console.log('contractListCtrl.$ionicView.beforeLeave');
        }
      });

      $scope.$on('$destroy', function(e) {
        if (baseConfig.debug) {
          console.log('contractListCtrl.$destroy');
        }
      });


      $scope.subheaderTitleKey = ['myStart_undo', 'myStart_do', 'myTask_todo', 'myTask_unfin', 'myTask_fin'];
      $scope.subheaderTitleValue = {
        myStart_undo: '我发起的未完成',
        myStart_do: '我发起的已完成',
        myTask_todo: '待办已签收',
        myTask_unfin: '待办已处理',
        myTask_fin: '待办已完成'
      };

      $scope.subheaderSelectFlag = {
        myStart_undo: true,
        myStart_do: false,
        myTask_todo: false,
        myTask_unfin: false,
        myTask_fin: false
      };

      $scope.clickSubheader = function(title) {
        console.log('click' + title);
        $scope.type = title;
        getTodoList(false);

        for (i in $scope.subheaderSelectFlag) {
          $scope.subheaderSelectFlag[i] = false;
        }
        $scope.subheaderSelectFlag[title] = true;
        var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
        for (var i = 0; i < $scope.subheaderTitleKey.length; i++) {
          if ($scope.subheaderTitleKey[i] == title) {
            var scroll = subheaderTitles[i].offsetLeft - document.getElementById('contractSubheader').clientWidth / 2 + subheaderTitles[i].clientWidth / 2;
            $ionicScrollDelegate.scrollTo(scroll, 0, true);
          }
        }
      }

      $scope.enterWorkflowDetail = function(detail) {
        console.log(detail.originData);
        //$state.go('详情页路由', { "键": detail.originData})
      }


    }
  ])

.service('contractListService', ['hmsHttp',
  'baseConfig',
  'hmsPopup',
  function(hmsHttp,
    baseConfig,
    hmsPopup) {
    var refreshWorkflowList = {
      flag: false
    };

    this.setRefreshWorkflowList = function(flag) {
      refreshWorkflowList.flag = flag;
    };

    this.getRefreshWorkflowList = function() {
      return refreshWorkflowList;
    };

    var baseUrlInner = 'http://172.20.0.206:8080/webportal/urlInterface/mobile/handcontract_mobile';
    var baseUrlOuter = 'http://edb.hand-china.com:8080/webportal/urlInterface/mobile/handcontract_mobile';
    this.check = function(success) {
      var url = baseUrlInner + '/' + window.localStorage.empno + '/checkUser';

      var params = {
        userId: window.localStorage.empno,
      };

      hmsHttp.get(url, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
        console.log(response);
      });
    }

    this.getTodoList = function(flag, user, type, page, success, error) {
      var user = (user) ? user : window.localStorage.empno;
      var type = (type) ? type : 'myStart_undo';
      var url = baseUrlInner + '/' + user + '/processes/' + type;

      var params = {
        type: type,
      };

      hmsHttp.get(url, params).success(function(result) {
        result.status = result.result;
        result.unprocessedWorkflowList = result.procList.detail;
        success(result);
      }).error(function(response, status) {
        //hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
        error(response);
      });
    };
  }
]);