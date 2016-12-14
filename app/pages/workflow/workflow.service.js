/**
 * Created by gusenlin on 16/6/21.
 */
angular.module('applicationModule')
  .service('workFLowListService',
    ['hmsHttp',
      'baseConfig',
      'hmsPopup',
      '$http',
      '$timeout',
      function (hmsHttp,
                baseConfig,
                hmsPopup,
                $http,
                $timeout) {

        // add by luyufei
        var paramData = {};

        this.saveParamData = function(d) {
          // alert(angular.toJson(d.detail));
          paramData = d;
        }

        this.getParamData = function() {
          return paramData;
        }

        this.getSubmitFlag = function(success, error, id) {
          var url = baseConfig.businessPath + 'get_submit_flag';
          var param = {params: {p_instance_id: id, p_employee_code: window.window.localStorage.empno}};
          // alert(url + "----" + angular.toJson(param));
          hmsHttp.post(url, param).success(function(response){
            // alert('success' + angular.toJson(response));
            success(response);
          }).error(function(){
            // alert('error' + angular.toJson(response));
            if(error){
              error(response);
            }
          })
        }
        //end add

        var pageNumLimit = 10;
        var workflowDefaultIcon = 'build/img/application/profile@3x.png';
        var workflowType = '申请名称';
        var workflowNode = '当前节点';
        var workflowPerson = '提交人';

        var refreshWorkflowList = {
          flag: false
        };

        this.wxLogin = function(codeWx, dataFilterUtil, getTodoListQuery, scope, pageNum, cashList) {
          var callback = function(){
            getTodoListQuery(scope, pageNum, cashList, false, dataFilterUtil());
            dataFilterUtil().query();
          }
          if(hmsHttp.wxLogin){
            hmsHttp.wxLogin(codeWx, callback);
          }
        }

        var showList = function (myscope) {
          $timeout(
            function () {
              myscope.fetchDataFlag = false;
            }, 100
          );
        };

        var processTodoList = function (myscope, result) {
          if (result.status == 'S') {
            var list = result.unprocessedWorkflowList;
            angular.forEach(list, function (data) {
              var employeeImg = data.employee_img;
              if (!employeeImg || employeeImg == "") {
                employeeImg = workflowDefaultIcon;
              }else{
                employeeImg = employeeImg + '64';
              }
              var item = {
                selectedFlag: false,
                showCheckedFlag: myscope.batchProcessFlag,
                title1: data.workflow_name,
                icon: employeeImg,
                type: workflowType,
                typeValue: data.instance_desc,
                node: workflowNode,
                nodeValue: data.current_node,
                submit: workflowPerson,
                submitPerson: data.employee_name,
                workflowId: data.workflow_id,
                instanceId: data.instance_id,
                recordId: data.record_id,
                nodeId: data.node_id,
                canApprove: data.approve,
                canBackTo: data.backTo,
                canGoBack: data.goBack,
                canRefuse: data.refuse,
                canTransmit: data.toOther,
                employeeCode: data.employee_code
              };
              myscope.list.push(item);
            });
          }
          else {
            hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
          }
        };

        var processDoneList = function (myscope, result) {
          if (result.status == 'S') {
            var list = result.processedWorkflowList;
            angular.forEach(list, function (data) {
              var employeeImg = data.employee_img;
              if (!employeeImg || employeeImg == "") {
                employeeImg = workflowDefaultIcon;
              }else{
                employeeImg = employeeImg + '64';
              }
              var item = {
                selectedFlag: false,
                showCheckedFlag: false,
                title1: data.workflow_name,
                icon: employeeImg,
                type: workflowType,
                typeValue: data.instance_desc,
                node: workflowNode,
                nodeValue: data.status_name,
                submit: workflowPerson,
                submitPerson: data.created_by_name,
                workflowId: data.workflow_id,
                instanceId: data.instance_id,
                employeeCode: data.employee_code
              };
              myscope.list.push(item);
            });
          } else {
            hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
          }
        };

        var processMineList = function (myscope, result) {
          if (result.returncode == 'S') {
            var list = result.returndata;
            angular.forEach(list, function (data) {
              var employeeImg = '';// data.employee_img;
              if (!employeeImg || employeeImg == "") {
                employeeImg = workflowDefaultIcon;
              }else{
                employeeImg = employeeImg + '64';
              }
              var item = {
                selectedFlag: false,
                showCheckedFlag: false,
                title1: data.workflow_name,
                icon: employeeImg,
                type: workflowType,
                typeValue: data.instance_desc,
                node: workflowNode,
                nodeValue: data.node_name,
                submit: '处理者',
                submitPerson: data.employee_name,
                key1: '最后审批人',
                value1: data.last_update_by_name,
                key2: '申请时间',
                value2: data.creation_date,
                key3: '状态',
                value3: data.status_name,
                showExtraFlag: true,
                workflowId: data.workflow_id,
                instanceId: data.instance_id,
                employeeCode: window.localStorage.empno,
                allow_cancel: data.allow_cancel,
                status: data.status
              };
              myscope.list.push(item);
            });
          } else {
            hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
          }
        };

        var getTodoListService = function (flag, worklfowId, submitterId, page, success, error) {
          var url = baseConfig.businessPath + "get_instance_list_v2";
          var params = {
            'params': {
              "p_employee_code": window.localStorage.empno,
              "p_flag": flag + "",
              "p_submitter_key": submitterId,
              "p_workflow_key": worklfowId,
              "p_page": page
            }
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result)
          }).error(function (response, status) {
            //hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
            error(response);
          });
        };

        var getMineListService = function (worklfowId, submitterId, page, success, error) {
          var url = baseConfig.businessPath + "get_personal_applications";
          var params = {
            'params': {
              "p_employee_number": window.localStorage.empno,
              "p_page": page,
              "p_page_size": 10
            }
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result)
          }).error(function (response, status) {
            //hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
            error(response);
          });
        };

        this.setRefreshWorkflowList = function (flag) {
          refreshWorkflowList.flag = flag;
        };

        this.getRefreshWorkflowList = function () {
          return refreshWorkflowList;
        };

        this.getTodoListQuery = function (myscope, pageNum, cashList, pullRefresh, dataFilterUtil) {
          myscope.loadMoreDataFlag = false;
          pageNum = 1;
          myscope.list = [];
          if (pullRefresh) {
            myscope.fetchDataFlag = false;
            myscope.pullRefreshDataFlag = true;
          } else {
            myscope.fetchDataFlag = true;
          }
          var success = function (result) {
            processTodoList(myscope, result);
            if (pullRefresh) {
              myscope.pullRefreshDataFlag = false;
              myscope.$broadcast('scroll.refreshComplete');
            }
            myscope.fetchDataFlag = false;
            if (!result.unprocessedWorkflowList || result.unprocessedWorkflowList.length == pageNumLimit) {
              myscope.loadMoreDataFlag = true;
            }
            //showList(myscope);
          };
          var error = function (result) {
            if (pullRefresh) {
              myscope.pullRefreshDataFlag = false;
              myscope.$broadcast('scroll.refreshComplete');
            }
            showList(myscope);
          };
          $timeout(function () {
            var filterCondition = dataFilterUtil.fetchFilterCondition();
            getTodoListService('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
          }, 0);
        };

        this.getDoneListQuery = function (myscope, pageNum, cashList, pullRefresh, dataFilterUtil) {
          myscope.loadMoreDataFlag = false;
          pageNum = 1;
          myscope.list = [];
          cashList = [];
          if (pullRefresh) {
            myscope.fetchDataFlag = false;
            myscope.pullRefreshDataFlag = true;
          } else {
            myscope.fetchDataFlag = true;
          }
          var success = function (result) {
            processDoneList(myscope, result);
            if (pullRefresh) {
              myscope.pullRefreshDataFlag = false;
              myscope.$broadcast('scroll.refreshComplete');
            }
            if (!result.processedWorkflowList || result.processedWorkflowList.length == pageNumLimit) {
              $timeout(function () {
                myscope.loadMoreDataFlag = true;
              },6000);
            }
            showList(myscope);
          };
          var error = function (result) {
            if (pullRefresh) {
              myscope.pullRefreshDataFlag = false;
              myscope.$broadcast('scroll.refreshComplete');
            }
            showList(myscope);
          }
          $timeout(function () {
            var filterCondition = dataFilterUtil.fetchFilterCondition();
            getTodoListService('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
          }, 0);
        };

        this.getMineListQuery = function (myscope, pageNum, cashList, pullRefresh, dataFilterUtil) {
          myscope.loadMoreDataFlag = false;
          pageNum = 1;
          myscope.list = [];
          cashList = [];
          if (pullRefresh) {
            myscope.fetchDataFlag = false;
            myscope.pullRefreshDataFlag = true;
          } else {
            myscope.fetchDataFlag = true;
          }
          var success = function (result) {
            processMineList(myscope, result);
            if (pullRefresh) {
              myscope.pullRefreshDataFlag = false;
              myscope.$broadcast('scroll.refreshComplete');
            }
            if (!result.processedWorkflowList || result.processedWorkflowList.length == pageNumLimit) {
              myscope.loadMoreDataFlag = true;
            }
            showList(myscope);
          };
          var error = function (result) {
            if (pullRefresh) {
              myscope.pullRefreshDataFlag = false;
              myscope.$broadcast('scroll.refreshComplete');
            }
            showList(myscope);
          }
          $timeout(function () {
            var filterCondition = dataFilterUtil.fetchFilterCondition();
            getMineListService(filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
          }, 0);
        };

        this.loadMoreFetchTodoList = function (myscope, dataFilterUtil, pageNum) {
          var success = function (result) {
            processTodoList(myscope, result);
            if (result.unprocessedWorkflowList.length < pageNumLimit) {
              myscope.loadMoreDataFlag = false;
            }
            myscope.$broadcast('scroll.infiniteScrollComplete');
          };
          var error = function (result) {
            myscope.$broadcast('scroll.infiniteScrollComplete');
          };
          var filterCondition = dataFilterUtil.fetchFilterCondition();
          getTodoListService('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
        };

        this.loadMoreFetchDoneList = function (myscope, dataFilterUtil, pageNum) {
          var success = function (result) {
            processDoneList(myscope,result);
            if (result.processedWorkflowList.length < pageNumLimit) {
              myscope.loadMoreDataFlag = false;
            }
            myscope.$broadcast('scroll.infiniteScrollComplete');

          };
          var error = function (result) {
            myscope.$broadcast('scroll.infiniteScrollComplete');
          };
          var filterCondition = dataFilterUtil.fetchFilterCondition();
          getTodoListService('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
        };

        this.loadMoreFetchMineList = function (myscope, dataFilterUtil, pageNum) {
          var success = function (result) {
            processMineList(myscope, result);
            if (result.returndata.length < pageNumLimit) {
              myscope.loadMoreDataFlag = false;
            }
            myscope.$broadcast('scroll.infiniteScrollComplete');

          };
          var error = function (result) {
            myscope.$broadcast('scroll.infiniteScrollComplete');
          };
          var filterCondition = dataFilterUtil.fetchFilterCondition();
          getMineListService(filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
        };

        this.getWorkflowDetail = function (success, workflowId, recordId, submitFlag) {
          var url = baseConfig.businessPath + "get_workflow_detail";
          var params = {
            "params": {
              "p_workflow_id": workflowId,
              "p_instance_id": recordId,
              "p_employee_code": window.localStorage.empno,
              "p_submit_flag": submitFlag
            }
          };
          hmsHttp.post(url, params).success(function (data) {
            success(data);
          }).error(function (data) {
          });
        };

        this.getTransmitPerson = function (success, error, value) {
          var url = baseConfig.businessPath + "get_trans_employee";
          var params = {
            "params": {
              "p_modual": value + ""
            }
          };
          hmsHttp.post(url, params).success(function (data) {
            success(data);
          }).error(function (data) {
            error(data);
          });
        };

        this.submitAction = function (success, error, params) {
          var url = baseConfig.businessPath + "wfl_workflow_action";
          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        this.contractRenewalQuery = function (success, error, instanceId) {
          var url = baseConfig.businessPath + "contract_renewal_query";
          var params = {
            "params": {
              "p_employee_number": window.localStorage.empno,
              "p_instance_id": instanceId + "",
            }
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        this.contractRenewalSubmit = function (success, error, params) {
          var url = baseConfig.businessPath + "contract_renewal_submit";
          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        // 获取部门信息（转正审批工作流）
        this.getUnitData = function (success, error, unitId) {
          var url = baseConfig.businessPath + "get_unit_data";
          var params = '{"params":{"p_unit_id":"' + unitId + '"}}';
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        // 获取职位信息（转正审批工作流）
        this.getPositionData = function (success, error, unitId) {
          var url = baseConfig.businessPath + "get_position_data";
          var params = '{"params":{"p_unit_id":"' + unitId + '"}}';

          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        // 获取上层部门信息（转正审批工作流）
        this.getParentUnitData = function (success, error, unitId) {
          var url = baseConfig.businessPath + "get_parent_unit_data";
          var params = '{"params":{"p_unit_id":"' + unitId + '"}}';
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        // 保存转正信息（转正审批工作流）
        this.savePositiveBlock1 = function (success, error, params) {
          var url = baseConfig.businessPath + "save_positive_block1_data";
          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        // 保存考评结果（转正审批工作流）
        this.savePositiveBlock2 = function (success, error, instanceId, record) {

          var url = baseConfig.businessPath + "save_positive_block2_data";
          var params = {
            "params": {
              "p_instance_id": instanceId,
              "p_record": JSON.stringify({"record": record})
            }
          };

          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        // 保存试用期总结（转正审批工作流）
        this.savePositiveBlock3 = function (success, error, instanceId, fieldId, fieldValue) {

          var url = baseConfig.businessPath + "save_positive_block3_data";
          var params = {
            "params": {
              "p_instance_id": instanceId,
              "p_field_id": fieldId,
              "p_field_value": fieldValue
            }
          };
          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        this.getDetailBase = function (success, error, recordId, workflowId, instanceId, nodeId) {
          var url = baseConfig.businessPath + "get_detail_base";
          var params = {
            "params": {
              "p_record_id": recordId + "",
              "p_workflow_id": workflowId + "",
              "p_instance_id": instanceId + "",
              "p_node_id": nodeId + ""
            }
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        this.getNoticeListCount = function (success, error) {
          var url = baseConfig.businessPath + "get_instance_list_count";
          var params = {"params": {"p_employee_code": window.localStorage.empno}};
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        //获取回退列表 added by Ethan
        this.getBackList = function (success, error, nodeId) {
          var url = baseConfig.businessPath + "get_back_list";
          var params = '{"params":{"p_node_id":"' + nodeId + '"}}';

          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        this.backTo = function (success, error, recordId, actionId, comment) {
          var url = baseConfig.businessPath + "wfl_back_to_action";
          var params = '{"params":{"p_record_id":"' + recordId + '","p_action_id":"' + actionId + '","p_comment":"' + comment + '"}}';

          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        // 获取项目信息（新开项目申请工作流）
        this.getProjectData = function (success, error, condition) {
          var url = baseConfig.businessPath + "get_project_data";
          var params = '{"params":{"p_param":"' + condition + '"}}';

          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        // 保存新开项目申请信息（新开项目申请工作流）
        this.saveNewProjectApplyData = function (success, error, instanceId, pactCode, projectName, expenses, mergeFlag) {
          var url = baseConfig.businessPath + "save_new_project_apply_data";
          var params = '{"params":{"p_instance_id":"' + instanceId + '","p_pact_code":"' + pactCode + '","p_project_name":"' + projectName + '","p_expenses":"' + expenses + '","p_merge_flag":"' + mergeFlag + '"}}';

          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        // 保存新开项目申请信息（新开项目申请工作流）
        this.get_workflow_filter = function (success, error, processedFlag) {
          var url = baseConfig.businessPath + "get_workflow_filter";
          var params = {
            "params": {
              "p_employee": window.localStorage.empno,
              "p_processed_flag": processedFlag
            }
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        //批量处理工作流
        this.batchProcessWorkflow = function (success, error, params) {
          var url = baseConfig.businessPath + "wfl_batch_approve";
          var params = params;
          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        //退回我的申请
        this.cancelMyWorkflow = function (p_instance_id,detail) {
          var url = baseConfig.businessPath + "wfl_batch_back";
          var backList = {
            "p_back_list": [{"p_instance_id": p_instance_id + ""}]
          };
          var params = {
            "params": {
              "p_employee_number": window.localStorage.empno,
              "p_param_json": JSON.stringify(backList)
            }
          };
          hmsPopup.showLoading('退回我的申请中');
          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            if(result.returnCode  == 'S'){
              detail.status = -1000;
              detail.value3 = "取消";
              hmsPopup.showPopup('个人申请撤回成功!');
            }
            else{
              hmsPopup.showPopup('个人申请撤回失败!');
            }
          }).error(function (response) {
            hmsPopup.hideLoading();
          });
        };
      }]);
