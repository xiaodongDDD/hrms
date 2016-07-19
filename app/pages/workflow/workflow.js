/**
 * Created by gusenlin on 16/6/21.
 */
angular.module('applicationModule')
  .service('workFLowListService',
    ['hmsHttp',
      'baseConfig',
      'hmsPopup',
      function (hmsHttp,
                baseConfig,
                hmsPopup) {
        var refreshWorkflowList = {
          flag: false
        };

        this.setRefreshWorkflowList = function (flag) {
          refreshWorkflowList.flag = flag;
        };

        this.getRefreshWorkflowList = function () {
          return refreshWorkflowList;
        };

        this.getTodoList = function (flag, success, error) {
          var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_instance_list";
          var params = {'params': {'p_employee_code': window.localStorage.empno, 'p_flag': flag + ''}};
          hmsHttp.post(url, params).success(function (result) {
            success(result)
          }).error(function (response, status) {
            //hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
            error(response);
          });
        };

        this.getWorkflowDetail = function (success, workflowId, recordId, submitFlag) {
          var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_workflow_detail";
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
          var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_trans_employee";
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
          var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/wfl_workflow_action";
          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        };

        this.contractRenewalQuery = function (success, error, instanceId) {
          var url = baseConfig.businessPath + "/api_contract_renewal/contract_renewal_query";
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
          var url = baseConfig.businessPath + "/api_contract_renewal/contract_renewal_submit";
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
          var url = baseConfig.businessPath + "/get_workflow_data/get_unit_data";
          var params = '{"params":{"p_unit_id":"' + unitId + '"}}';
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };
        // 获取职位信息（转正审批工作流）
        this.getPositionData = function (success, error, unitId) {
          var url = baseConfig.businessPath + "/get_workflow_data/get_position_data";
          var params = '{"params":{"p_unit_id":"' + unitId + '"}}';

          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };
        // 获取上层部门信息（转正审批工作流）
        this.getParentUnitData = function (success, error, unitId) {
          var url = baseConfig.businessPath + "/get_workflow_data/get_parent_unit_data";
          var params = '{"params":{"p_unit_id":"' + unitId + '"}}';
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };


        // 保存转正信息（转正审批工作流）
        this.savePositiveBlock1 = function (success, error, params) {
          var url = baseConfig.businessPath + "/wfl_save_action/save_positive_block1_data";
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

          var url = baseConfig.businessPath + "/wfl_save_action/save_positive_block2_data";
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

          var url = baseConfig.businessPath + "/wfl_save_action/save_positive_block3_data";
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
          var url = baseConfig.businessPath + "/api_workflow_common/get_detail_base";
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
          var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_instance_list_count";
          var params = {"params": {"p_employee_code": window.localStorage.empno}};
          hmsHttp.post(url, params).success(function (result) {
            success(result);
          }).error(function (response) {
            error(response);
          });
        };

        //获取回退列表 added by Ethan
        this.getBackList = function (success, error, nodeId) {
          var url = baseConfig.businessPath + "/get_workflow_data/get_back_list";
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
          var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/wfl_back_to_action";
          var params = '{"params":{"p_record_id":"' + recordId + '","p_action_id":"' + actionId + '","p_comment":"' + comment + '"}}';

          hmsHttp.post(url, params).success(function (result) {
            hmsPopup.hideLoading();
            success(result);
          }).error(function (response) {
            hmsPopup.hideLoading();
            error(response);
          });
        }
      }]);
