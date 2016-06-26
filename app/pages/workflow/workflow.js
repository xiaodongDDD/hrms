/**
 * Created by gusenlin on 16/6/21.
 */
angular.module('applicationModule')
  .service('workFLowListService', ['hmsHttp',
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
          hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
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

      this.getTransmitPerson = function (success,error,value) {
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

      this.submitAction = function (success,error,params) {
        var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/wfl_workflow_action";
        hmsHttp.post(url, params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response) {
          hmsPopup.hideLoading();
          error(response);
        });
      };
    }]);
