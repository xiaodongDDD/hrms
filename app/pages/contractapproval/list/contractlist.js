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
    '$ionicSlideBoxDelegate',
    function($scope,
      $state,
      $stateParams,
      $ionicModal,
      $timeout,
      hmsPopup,
      baseConfig,
      contractListService,
      $ionicScrollDelegate,
      $ionicSlideBoxDelegate) {

      $scope.list = [];
      $scope.slideIndex = 0;
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
      $scope.pageNum = 0;

      var filterOption = {
        "currentSelectType": "ALL",
        "currentSubmitterFilter": "",
        "submitterFilter": []
      };

      var defaultIcon = 'build/img/application/profile@3x.png';
      var startTime = '开始时间';
      var author = '发起人';
      var desc = '说明';

      $scope.listHandle = {
        myStart_undo: 'myStart_undoHandle',
        myStart_do: 'myStart_doHandle',
        myTask_todo: 'myTask_todoHandle',
        myTask_unfin: 'myTask_unfinHandle',
        myTask_fin: 'myTask_finHandle'
      };
      $scope.loadMoreDataFlags = {
        myStart_undo: true,
        myStart_do: false,
        myTask_todo: false,
        myTask_unfin: false,
        myTask_fin: false
      };
      $scope.setLoadMoreDataFlags = function(key) {
        for (var i in $scope.loadMoreDataFlags) {
          $scope.loadMoreDataFlags[i] = false;
        }
        if (key) {
          $scope.loadMoreDataFlags[key] = true;
        }
      }

      var initLists = function() {
        $scope.lists = {
          myStart_undo: [],
          myStart_do: [],
          myTask_todo: [],
          myTask_unfin: [],
          myTask_fin: []
        }
      }
      initLists();

      $scope.fadeStyle = function(index) {
        if ($scope.pageNum > 1) {
          if (index >= $scope.pageNumLimit * ($scope.pageNum - 1)) {
            return {
              '-webkit-animation': 'fadeIn 0.5s forwards',
              '-webkit-animation-delay': (index - $scope.pageNumLimit * ($scope.pageNum - 1) - 1) * 90 + 'ms',
              '-webkit-animation-duration': '0'
            }
          } else {
            return {
              'opacity': 1
            }
          }
        } else {
          return {
            '-webkit-animation': 'fadeIn 0.5s forwards',
            '-webkit-animation-delay': index * 90 + 'ms',
            '-webkit-animation-duration': '0'
          }
        }

      }
      $scope.ngClass = true;

      $scope.subheaderTitleKey = ['myStart_undo', 'myStart_do', 'myTask_todo', 'myTask_unfin', 'myTask_fin'];
      $scope.type = $scope.subheaderTitleKey[0];
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

      $scope.ifShow = function(index) {
        return index < $scope.pageNum * $scope.pageNumLimit;
      }

      $scope.clickSubheader = function(title) {
        initLists();
        for (i in $scope.subheaderSelectFlag) {
          $scope.subheaderSelectFlag[i] = false;
        }
        $scope.subheaderSelectFlag[title] = true;
        var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
        for (var i = 0; i < $scope.subheaderTitleKey.length; i++) {
          if ($scope.subheaderTitleKey[i] == title) {
            var scroll = subheaderTitles[i].offsetLeft - document.getElementById('contractSubheader').clientWidth / 2 + subheaderTitles[i].clientWidth / 2;
            $ionicScrollDelegate.$getByHandle('subheaderHandle').scrollTo(scroll, 0, true);

            $ionicSlideBoxDelegate.slide(i);
          }
        }
        $scope.list = [];
        $scope.slideIndex = 0;
        $scope.listBackup = []; //备份列表数据，在筛选时使用。
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
        $scope.pageNum = 0;
        var filterOption = {
          "currentSelectType": "ALL",
          "currentSubmitterFilter": "",
          "submitterFilter": [],
        };
        $scope.type = title;

        getTodoList(false);
      }

      var refreshTodoList = function() {
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
            $ionicScrollDelegate.scrollTo(0, 0, false);
            var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
            for (var i = 0; i < $scope.subheaderTitleKey.length; i++) {
              if ($scope.subheaderTitleKey[i] == $scope.type) {
                var scroll = subheaderTitles[i].offsetLeft - document.getElementById('contractSubheader').clientWidth / 2 + subheaderTitles[i].clientWidth / 2;
                $ionicScrollDelegate.$getByHandle('subheaderHandle').scrollTo(scroll, 0, false);
              }
            }
          }, 100
        );
      };

      //处理获取到的数据列表
      var processTodoList = function(result) {
        if (result.status == 'S') {
          $scope.list = [];
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
          $scope.lists[$scope.type] = $scope.list;
          if ($scope.list.length > $scope.pageNumLimit * $scope.pageNum) {
            $scope.loadMoreDataFlag = true;
            $scope.setLoadMoreDataFlags[$scope.type];
            console.log('processTodoList $scope.loadMoreDataFlag = true;');
          }
          dataFilterUtil().query();
          $scope.fetchTodoList(true);
          showList();
        } else {
          hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
          showList();
        }
      };

      //获取数据列表
      var getTodoList = function(pullRefresh) {
        $scope.firstLoadFlag = true;
        $scope.loadMoreDataFlag = false;
        $scope.setLoadMoreDataFlags();
        $scope.pageNum = 0;

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
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          processTodoList(result);
          console.log('todo var success = function(result) {');
        };
        var error = function(result) {
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          showList();
        };

        var filterCondition = dataFilterUtil().fetchFilterCondition();
        contractListService.getTodoList('N', filterCondition.workflowId, $scope.type, $scope.pageNum, success, error);

      };

      // 筛选列表，每次先从备份数据中深度拷贝一份，然后进行删除操作
      $scope.fetchTodoList = function(refreshFlag) {
        $scope.loadMoreDataFlag = false;
        $scope.setLoadMoreDataFlags();
        $scope.pageNum = 1;
        $scope.firstLoadFlag = true;

        if (baseConfig.debug) {
          console.log('$scope.fetchTodoList ');
        }
        if (!refreshFlag) {
          dataFilterUtil().clearFilterCondition();
        }

        if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
          $scope.listStatus.todo.selected = true;
          //getTodoList(false);
          $scope.list = $scope.listBackup.concat();
          $scope.lists[$scope.type] = $scope.list;
          if (filterOption.currentSelectType == 'PERSON' && filterOption.currentSubmitterFilter != '全部' && filterOption.currentSubmitterFilter != '_default') {
            for (var i = $scope.list.length - 1; i >= 0; i--) {
              console.log($scope.list[i].nodeValue + ' vs ' + dataFilterUtil().fetchFilterCondition().itemDesc);
              if ($scope.list[i].nodeValue != dataFilterUtil().fetchFilterCondition().itemDesc) {
                $scope.list.splice(i, 1);
              }
            }
          }
          if ($scope.list.length > $scope.pageNumLimit * $scope.pageNum) {
            $scope.loadMoreDataFlag = true;
            $scope.setLoadMoreDataFlags[$scope.type];
            console.log('processTodoList $scope.loadMoreDataFlag = true;');
          }
          if (!refreshFlag) {
            dataFilterUtil().query();
          }

        }
        $ionicScrollDelegate.scrollTo(0, 0, false);
        var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
        for (var i = 0; i < $scope.subheaderTitleKey.length; i++) {
          if ($scope.subheaderTitleKey[i] == $scope.type) {
            var scroll = subheaderTitles[i].offsetLeft - document.getElementById('contractSubheader').clientWidth / 2 + subheaderTitles[i].clientWidth / 2;
            $ionicScrollDelegate.$getByHandle('subheaderHandle').scrollTo(scroll, 0, false);
          }
        }
        showList();

        /////////////////

      };

      // 下拉加载更多数据，这里只是变了限数，
      var loadMoreFetchTodoList = function() {
        var success = function(result) {
          console.log('var loadMoreFetchTodoList = function() {');
          if ($scope.list.length < $scope.pageNumLimit * $scope.pageNum) {
            $scope.loadMoreDataFlag = false;
            $scope.setLoadMoreDataFlags();
            console.log('$scope.loadMoreDataFlag = false;');
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $timeout(function() {
          success();
        }, 2000);
      };

      $scope.loadMoreData = function() {
        console.log('$scope.loadMoreData = function() {');
        if ($scope.loadMoreDataFlag) {
          console.log('has load flag');
          console.log('can log');
          $scope.pageNum = $scope.pageNum + 1;
          loadMoreFetchTodoList();
        }
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
          $scope.$apply();
          $timeout(function() {
            $scope.clickSubheader($scope.type);
            $scope.$broadcast('scroll.refreshComplete');
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
            console.log('$scope.dataFilterHandle = { $scope.fetchTodoList(true);');
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
          console.log($ionicScrollDelegate.$getByHandle('hmsFilterCondition'));
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
              filterOption.currentSubmitterFilter = '_default';
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

      $scope.changeSlide = function(index) {
        $scope.clickSubheader($scope.subheaderTitleKey[index]);
      }

      $scope.enterWorkflowDetail = function(detail) {
        console.log(detail.originData);
        $state.go('tab.contractDetail', { data: detail.originData })
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

    this.getTodoCount = function(success) {
      var user = (user) ? user : window.localStorage.empno;
      var url = baseUrlInner + '/' + user + '/getMyToDoSize';

      hmsHttp.get(url).success(function(result) {
        success(result);
      }).error(function(response, status) {
        error(response);
      });
    };
  }
]);