// created by yufei.lu 2016-08-15
// 修改selectedUrl变量以更换调用地址
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
    '$ionicHistory',
    function($scope,
      $state,
      $stateParams,
      $ionicModal,
      $timeout,
      hmsPopup,
      baseConfig,
      contractListService,
      $ionicScrollDelegate,
      $ionicSlideBoxDelegate,
      $ionicHistory) {

      $scope.list = []; //用于显示列表的列表数据
      $scope.listBackup = []; //备份列表数据，在筛选时使用。
      $scope.isIos = false; //平台
      var slideToChangePage = true; //是否是滑动来换页的
      $scope.enteringIndex = 0;
      $scope.subheadereAnimaFlag = false;

      $scope.hasBouncing = 'false';
      $scope.fetchDataFlag = true;
      $scope.pullRefreshDataFlag = false;
      $scope.showDetailArrow = true;

      $scope.listStatus = {
        todo: {
          selected: true
        }
      };

      $scope.pageNumLimit = 10; //默认显示数目 & 每次上拉加载增多的最大数目
      $scope.loadMoreDataFlag = false; //是否允许'上拉加载更多'
      $scope.pageNum = 0; //上拉(成功执行的)次数

      var filterOption = {
        "currentSelectType": "ALL",
        "currentSubmitterFilter": "",
        "submitterFilter": []
      };

      var defaultIcon = 'build/img/application/profile@3x.png'; //默认头像
      var startTime = '开始时间'; //各项数据标题
      var author = '发起人';
      var desc = '说明';

      $scope.loadMoreDataFlags = { //是否可以上拉加载
        myStart_undo: true,
        myStart_do: false,
        myTask_todo: false,
        myTask_unfin: false,
        myTask_fin: false
      };
      $scope.setLoadMoreDataFlags = function(key) { //设置是否可以上拉加载
        for (var i in $scope.loadMoreDataFlags) {
          $scope.loadMoreDataFlags[i] = false;
        }
        if (key) {
          $scope.loadMoreDataFlags[key] = true;
        }
      }

      $scope.fadeStyle = function(index) { //循序出现，循序fadein
        if (contractListService.IsFromParent()) { //如果是从上级页面进入的
          if ($scope.pageNum > 1) { //如果是上拉加载出来的
            return {
              'opacity': 1
            }
          } else {
            return {
              'animation': 'contract-fadeIn forwards 0.5s',
              '-webkit-animation': 'contract-fadeIn forwards 0.5s',
              'animation-delay': (index + 1) * 90 + 'ms',
              '-webkit-animation-delay': (index + 1) * 90 + 'ms',
              'animation-duration': '0',
              '-webkit-animation-duration': '0'
            }
          }
        } else { //如果是从子级页面返回的
          return {
            'opacity': 1
          }
        }
      }

      //导航栏各项分页按钮对应的键
      $scope.subheaderTitleKey = ['myStart_undo', 'myStart_do', 'myTask_todo', 'myTask_unfin', 'myTask_fin'];
      $scope.type = $scope.subheaderTitleKey[0]; //当前应该在哪个分页下
      $scope.subheaderTitleValue = { //分页按钮的显示文本
        myStart_undo: '我发起的未完成',
        myStart_do: '我发起的已完成',
        myTask_todo: '待处理',
        myTask_unfin: '待办已处理',
        myTask_fin: '待办已完成'
      };

      $scope.subheaderSelectFlag = { //分页的状态（选中与未选中）
        myStart_undo: true,
        myStart_do: false,
        myTask_todo: false,
        myTask_unfin: false,
        myTask_fin: false
      };
      $scope.subheaderDeselectAnimaFlag = { //前一个被选中的项的收缩动画
        myStart_undo: false,
        myStart_do: false,
        myTask_todo: false,
        myTask_unfin: false,
        myTask_fin: false
      };

      //按了导航栏的按钮
      $scope.clickSubheader = function(title) {
        if (!contractListService.IsFromParent()) {
          contractListService.setIsFromParent(true);
        }
        slideToChangePage = false;

        //设置分页的状态（选中与未选中）
        for(k in $scope.subheaderSelectFlag){
          $scope.subheaderDeselectAnimaFlag[k] = $scope.subheaderSelectFlag[k];
        }
        for (k in $scope.subheaderSelectFlag) {
          $scope.subheaderSelectFlag[k] = false;
        }
        $scope.subheaderSelectFlag[title] = true;
        //设置偏移
        var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
        for (var i = 0; i < $scope.subheaderTitleKey.length; i++) {
          if ($scope.subheaderTitleKey[i] == title) {
            var scroll = subheaderTitles[i].offsetLeft - document.getElementById('contractSubheader').clientWidth / 2 + subheaderTitles[i].clientWidth / 2;
            $ionicScrollDelegate.$getByHandle('subheaderHandle').scrollTo(scroll, 0, true);

            $ionicSlideBoxDelegate.slide(i); //滑动换页
          }
        }
        //重新初始化一些变量
        $scope.list = [];
        $scope.listBackup = [];
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
        var filterOption = { //筛选器
          "currentSelectType": "ALL",
          "currentSubmitterFilter": "",
          "submitterFilter": [],
        };
        //选中的分页
        $scope.type = title;
        //这个选中的分页在从详情页中回来时，刷新选中页的数据（例如提交动作之后，这一项应该从这个分页移动到另一个分页了，因此从这个分页中移除
        contractListService.setListType($scope.type);

        getTodoList(false);
      }

      var showList = function() {
        $timeout(
          function() {
            $scope.fetchDataFlag = false;
            var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
            var scroll = 0;
            for (var i = 0; i < $scope.subheaderTitleKey.length; i++) {
              if ($scope.subheaderTitleKey[i] == $scope.type) {
                scroll = subheaderTitles[i].offsetLeft - document.getElementById('contractSubheader').clientWidth / 2 + subheaderTitles[i].clientWidth / 2;
              }
            }
            $ionicScrollDelegate.scrollTo(scroll, 0, false);
            $scope.$apply();
          }, 100
        );
      };

      //处理获取到的数据列表
      var processTodoList = function(result) {
        if (result.status == 'S') {
          $scope.list = [];
          var list = result.unprocessedWorkflowList;
          angular.forEach(list, function(data) {
            //头像，合同工作流中没有头像
            var employeeImg = data.employee_img;
            if (!employeeImg || employeeImg == "") {
              employeeImg = defaultIcon;
            }
            //这个item被<hms-workflow-list>所使用
            var item = {
              title1: data.procDescr,
              icon: employeeImg,
              type: startTime,
              typeValue: data.startDate.split('.')[0],
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
            //处理的每一项压进显示用的数组中
            $scope.list.push(item);
          });
          $scope.listBackup = $scope.list.concat();
          //是否可以上拉加载更多
          if ($scope.list.length > $scope.pageNumLimit * $scope.pageNum) {
            $scope.loadMoreDataFlag = true;
            $scope.setLoadMoreDataFlags($scope.type);
          }
          //生成筛选器
          dataFilterUtil().query();
          $scope.fetchTodoList(true);
          showList();
        } else {
          //hmsPopup.showShortCenterToast('获取合同列表失败,请退出页面重试获取或联系管理员!');
          showList();
        }
      };

      //获取数据列表
      var getTodoList = function(pullRefresh) {
        //重置一些变量
        $scope.firstLoadFlag = true;
        $scope.loadMoreDataFlag = false;
        $scope.setLoadMoreDataFlags();
        $scope.pageNum = 0;
        //重置筛选器中数据
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
        };
        var error = function(result) {
          $timeout(function() {
            if (pullRefresh) {
              $scope.pullRefreshDataFlag = false;
              $scope.$broadcast('scroll.refreshComplete');
            }
            showList();
          }, 1000);
        };

        var filterCondition = dataFilterUtil().fetchFilterCondition();
        //post请求
        $timeout(function() {
          contractListService.getTodoList('N', filterCondition.workflowId, $scope.type, $scope.pageNum, success, error);
        }, 550);
      };

      // 筛选列表，每次先从备份数据中拷贝一份，然后进行删除操作
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
          $scope.list = $scope.listBackup.concat();
          //筛选人的时候，且不是选择全部，也不是没选筛选项，则进行筛选
          if (filterOption.currentSelectType == 'PERSON' && filterOption.currentSubmitterFilter != '全部' && filterOption.currentSubmitterFilter != '_default') {
            for (var i = $scope.list.length - 1; i >= 0; i--) {
              if ($scope.list[i].nodeValue != dataFilterUtil().fetchFilterCondition().itemDesc) {
                $scope.list.splice(i, 1);
              }
            }
          }
          if (!refreshFlag) {
            dataFilterUtil().query();
          }

        }
        //能否上拉加载更多
        if ($scope.list.length > $scope.pageNumLimit * $scope.pageNum) {
          $scope.loadMoreDataFlag = true;
          $scope.setLoadMoreDataFlags($scope.type);
        }

        var subheaderTitles = document.getElementsByClassName('contractSubheaderMarker');
        var scroll = 0;
        for (var i = 0; i < $scope.subheaderTitleKey.length; i++) {
          if ($scope.subheaderTitleKey[i] == $scope.type) {
            scroll = subheaderTitles[i].offsetLeft - document.getElementById('contractSubheader').clientWidth / 2 + subheaderTitles[i].clientWidth / 2;
          }
        }
        $ionicScrollDelegate.scrollTo(scroll, 0, false);

        showList();

        /////////////////

      };

      // 上拉加载更多数据
      var loadMoreFetchTodoList = function() {
        var success = function(result) {
          if ($scope.list.length < $scope.pageNumLimit * $scope.pageNum) {
            $scope.loadMoreDataFlag = false;
            $scope.setLoadMoreDataFlags();
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $timeout(function() {
          success();
        }, 2000);
      };
      $scope.loadMoreData = function() {
        if ($scope.loadMoreDataFlag) {
          $scope.pageNum = $scope.pageNum + 1;
          loadMoreFetchTodoList();
        }
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

      // 筛选上拉菜单模型
      $ionicModal.fromTemplateUrl('build/pages/public/modal/hms-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function(modal) {
        $scope.filterModal = modal;
      });

      $scope.filterWorkFlowInfo = function() { //响应筛选按钮的方法
        $scope.filterModal.show();
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
            }
          };
          var error = function(response) {};
          var processedFlag = 'N';
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
        //iOS的时候，top:0px在状态栏内部
        if (ionic.Platform.isIOS()) {
          $scope.isIos = true;
          $scope.shouldDisableBouncing = true;
          $scope.hasBouncing = 'true';
          document.getElementById('contractlist-div-subheader').style.top = '63px';
          document.getElementById('contractlist-div-slidebox').style.top = '63px';
        }
        //应该显示哪个分页
        $scope.type = contractListService.getListType();
        //从上级页面进入的
        if (contractListService.IsFromParent()) {
          $scope.subheadereAnimaFlag = true;
        }
        //从子页面返回时进入的
        else {
          if (baseConfig.debug) {
            console.log('从子页面返回时进入的');
          }
          if (contractListService.getItemRemoveFlag()) {//如果在详情页操作了待处理项，则应该把它从待处理页移除掉
            $scope.list.splice($scope.enteringIndex, 1);
          }
          if ($scope.type != contractListService.getListType()) { //如果详情页要求返回时跳到别的分页里
            $scope.clickSubheader(contractListService.getListType());
          }
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
      $scope.$on('$ionicView.afterLeave', function() {
        if (baseConfig.debug) {
          console.log('contractListCtrl.$ionicView.afterLeave');
        }
        $scope.subheadereAnimaFlag = false;
      });

      $scope.$on('$destroy', function(e) {
        if (baseConfig.debug) {
          console.log('contractListCtrl.$destroy');
        }
      });

      //滑动换页时
      $scope.changeSlide = function(index) {
        //如果是按了导航按钮，那么会调用$scope.clickSubheader，然后代码控制换页，进入这个函数，但不会进入这个if，
        //如果是滑动换页，则进入这个if，来调用$scope.clickSubheader。因为if中的$scope.clickSubheader会设slideToChangePage = false;
        //这样是防止按导航按钮时调用两次$scope.clickSubheader。
        if (slideToChangePage) {
          $scope.clickSubheader($scope.subheaderTitleKey[index]);
        }
        slideToChangePage = true;
      }

      $scope.enterWorkflowDetail = function(detail, index) {
        contractListService.setIsFromParent(false);
        $scope.enteringIndex = index;
        contractListService.initRemoveItemFlag();
        $state.go('tab.contractDetail', { data: detail.originData })
      }

      $scope.goBack = function() {
        contractListService.setIsFromParent(true); //当做没进来过这个页面
        contractListService.setListType('myStart_undo'); //如果回到上一级，那么下次进来就进第一分页
        $ionicHistory.goBack();
      }

    }
  ])

.service('contractListService', ['hmsHttp',
  'baseConfig',
  'hmsPopup',
  function(hmsHttp,
    baseConfig,
    hmsPopup) {
    var fromParentFlag = {
      flag: true
    };

    var removeItemFlag = {
      flag: false
    }

    var checkUserFlag = {
      flag: false
    };

    var listType = {
      data: 'myStart_undo'
    };

    this.setListType = function(type) {
      if (type) { //
        listType.data = type;
      }
    }

    //合同详情页中如果操作了这项合同，直接调用 contractListService.removeItem() 就可以告知合同列表这项合同已经被移到别的分类下了。
    this.removeItem = function() {
      removeItemFlag.flag = true;
    }

    this.initRemoveItemFlag = function() {
      removeItemFlag.flag = false;
    }

    this.getItemRemoveFlag = function() {
      return removeItemFlag.flag;
    }

    this.getListType = function() {
      return listType.data;
    }

    this.setIsFromParent = function(flag) {
      fromParentFlag.flag = flag;
    };

    this.IsFromParent = function() {
      return fromParentFlag.flag;
    };

    //现在如果checkUser不通过，则getTodoList和getTodoCount不会被执行post请求。
    this.check = function(success) {
      if (baseConfig.debug) {
        console.log('check user');
      }
      var url = '';
      var params = {};

      url = baseConfig.queryPath + '/handcontract';

      params = {
        userId: window.localStorage.empno,
        method: 'checkUser'
      };

      hmsHttp.post(url, params).success(function(result) {
        if (baseConfig.debug) {
          console.log('check user success');
        }
        if (result.result == 'S') {
          checkUserFlag.flag = true;
        } else {
          checkUserFlag.flag = false;
        }
        success(result);
      }).error(function(response, status) {
        if (baseConfig.debug) {
          console.log('check user error');
          console.log(response);
        }
      });
      if (baseConfig.debug) {
        console.log('调用地址：' + url);
        console.log('调用参数：');
        console.log(params);
      }
    }

    this.getCheckFlag = function() {
      return checkUserFlag.flag;
    }

    this.getTodoList = function(flag, user, type, page, success, error) {
      if (this.getCheckFlag()) {
        var url = '';
        var params = {};
        var user = (user) ? user : window.localStorage.empno;
        var type = (type) ? type : 'myStart_undo';

        url = baseConfig.queryPath + '/handcontract';

        params = {
          userId: window.localStorage.empno,
          method: 'processes',
          type: type
        };
        hmsHttp.post(url, params).success(function(result) {
          if (result.result == 'E') {
            result.unprocessedWorkflowList = [];
          } else {
            result.status = result.result;
            result.unprocessedWorkflowList = result.procList.detail;
          }
          success(result);
        }).error(function(response, status) {
          if (baseConfig.debug) {
            console.log('post: getTodoList() error');
          }
        });
        if (baseConfig.debug) {
          console.log('调用地址：' + url);
          console.log('调用参数：');
          console.log(params);
        }
      } else {
        if (baseConfig.debug) {
          console.log('不应该被调用getTodoList()');
        }
        error();
      }
    };

    this.getTodoCount = function(success) {
      if (this.getCheckFlag()) {
        var user = (user) ? user : window.localStorage.empno;
        var url = ''
        var params = {};

        url = baseConfig.queryPath + '/handcontract';

        params = {
          userId: window.localStorage.empno,
          method: 'getMyToDoSize'
        }
        hmsHttp.post(url, params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          if (baseConfig.debug) {
            console.log('post: getTodoCount() error');
          }
        });
      } else {
        if (baseConfig.debug) {
          console.log('不应该被调用getTodoCount()');
        }
      }
    };
  }
]);

