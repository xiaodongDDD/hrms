/**
 * Created by gusenlin on 16/6/21.
 */
angular.module('applicationModule')
  .service('TimeSheetService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function (baseConfig,
              hmsHttp,
              hmsPopup) {

      var needRefreshTimeSheet = false;

      var timeSheetList = [];

      this.processProject = function (projectList, batchFlag) {
        var projectCategory = {};

        if (!batchFlag) {
          var noneProject = {
            approver: "",
            project_id: -1,
            project_name: "我的项目",
            project_type: "客户项目",
            project_type_id: 1,
            selected_flag: ""
          };

          var project = {name: "内部项目", array: [noneProject]};

          projectCategory = {
            "1": project
          }
        }

        angular.forEach(projectList, function (data) {
          if (data.project_type_id && data.project_type_id != "") {
            var project_type_id = data.project_type_id;
            if (projectCategory[project_type_id]) {
              projectCategory[project_type_id].name = data.project_type;
              projectCategory[project_type_id].array.push(data);
            } else {
              projectCategory[project_type_id] = {}
              projectCategory[project_type_id].name = data.project_type;
              projectCategory[project_type_id].array = [data];
            }
          }
        });
        return projectCategory;
      };

      this.getTimeSheetList = function () {
        return timeSheetList;
      };

      this.cacheTimeSheetList = function (list) {
        timeSheetList = list;
      };

      this.getRefreshTimeSheetFlag = function () {
        return needRefreshTimeSheet;
      };

      this.setRefreshTimeSheetFlag = function (flag) {
        needRefreshTimeSheet = flag;
      };

      this.fetchCalendar = function (monthParams) {

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": monthParams + "",
            "p_offset": "0"
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      this.fetchEachDay = function (callback, oneDate) {
        var url = baseConfig.businessPath + '/timesheet_process/fetch_projects';
        var params = {'params': {'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + ""}};
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          //hmsPopup.showPopup('获取状态错误,请检查网络!');
        });
      };

      this.fetchProjectDetailInfo = function (callback, oneDate, projectId) {
        var url = baseConfig.businessPath + "/timesheet_process/project_change"
        var params = {
          'params': {
            'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + "",
            'p_project_id': projectId + ""
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          //hmsPopup.showPopup('获取项目信息错误,请检查网络!');
        });
      };

      this.submitTimesheet = function (callback, params) {
        var url = baseConfig.businessPath + "/timesheet_process/save_timesheet1";
        var params = params;
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          //hmsPopup.showPopup('提交Timesheet错误,请检查网络!');
        });
      };

      this.generateAllowance = function (success, error, generateFlag, month) {
        var url = baseConfig.businessPath + "/timesheet_process/generate_allowance";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_generate_flag": generateFlag + "",
            "p_token": "",
            "p_month": month + ""
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          error(response);
        });
      };

      this.slippingBatch = function (success, error, template, dateArray) {
        var url = baseConfig.businessPath + "/timesheet_process/slipping_batch1";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_ref_date": template + "",
            "p_date_range": dateArray + ""
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          error(response);
        });
      };

      this.unfreezeTimesheet = function (success, error, dateFrom, dateTo) {
        var url = baseConfig.businessPath + "/api_timesheet_unfreeze/timesheet_unfreeze";
        var params = {
          "params": {
            "p_employee_code": window.localStorage.empno,
            "p_freeze_date_from": dateFrom + "",
            "p_freeze_date_to": dateTo + ""
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          error(response);
        });
      };

      this.fetchBatchProjectList = function (success) {
        var url = baseConfig.businessPath + "/timesheet_process/fetch_projects_batch";
        var params = {
          "params": {
            "p_employee_code": window.localStorage.empno
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response) {
          hmsPopup.hideLoading();
        });
      };

      this.submitBatchWrite = function (success, params) {
        var url = baseConfig.businessPath + "/timesheet_process/batch_timesheet1";
        hmsHttp.post(url, params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response) {
          hmsPopup.hideLoading();
        });
      };
    }]);
