/**
 * Created by gusenlin on 2016/10/16.
 */
angular.module('applicationModule')
  .service('applicationService', [
    'baseConfig',
    'hmsHttp',
    function (baseConfig,
              hmsHttp) {

      var appData = {
        "returnStatus": "S",
        "returnDesc": "获取菜单信息成功",
        "returnData": {
          "officeApp": [{
            "menuCode": "FLIGHT_BOOKING",
            "menuType": "OFFICE",
            "menuName": "机票预订",
            "imageUrl": "build/img/application/flight-ticke@3x.png",
            "destUrl": "tab.flight-ticket-list",
            "hasWorkflowNum": "N",
            "menuSequence": 1,
            "userPrivileges": "N"
          }, {
            "menuCode": "SCHEDULE",
            "menuType": "OFFICE",
            "menuName": "工作流",
            "imageUrl": "build/img/application/schedule@3x.png",
            "destUrl": "tab.workflow-list",
            "hasWorkflowNum": "Y",
            "menuSequence": 2,
            "userPrivileges": "N"
          }, {
            "menuCode": "BLANK",
            "menuType": "",
            "menuName": "",
            "imageUrl": "",
            "destUrl": "",
            "hasWorkflowNum": "",
            "menuSequence": ""
          }, {
            "menuCode": "BLANK",
            "menuType": "",
            "menuName": "",
            "imageUrl": "",
            "destUrl": "",
            "hasWorkflowNum": "",
            "menuSequence": ""
          }],
          "projectApp": [{
            "menuCode": "TIMESHEET",
            "menuType": "PROJECT",
            "menuName": "TS填写",
            "imageUrl": "build/img/application/timesheet@3x.png",
            "destUrl": "tab.timesheet",
            "hasWorkflowNum": "N",
            "menuSequence": 1,
            "userPrivileges": "N"
          }, {
            "menuCode": "TIMESHEET_APPROVE",
            "menuType": "PROJECT",
            "menuName": "TS审批",
            "imageUrl": "build/img/application/timesheet-approval@3x.png",
            "destUrl": "tab.tsApproveList",
            "hasWorkflowNum": "N",
            "menuSequence": 2,
            "userPrivileges": "N"
          }, {
            "menuCode": "HOUSINGRENTAL",
            "menuType": "PROJECT",
            "menuName": "房屋转租",
            "imageUrl": "build/img/application/house@3x.png",
            "destUrl": "tab.houses-tab",
            "hasWorkflowNum": "N",
            "menuSequence": 3,
            "userPrivileges": "N"
          }, {
            "menuCode": "SEARCH",
            "menuType": "PROJECT",
            "menuName": "资源查询",
            "imageUrl": "build/img/application/resource@3x.png",
            "destUrl": "tab.resources-query",
            "hasWorkflowNum": "N",
            "menuSequence": 4,
            "userPrivileges": "N"
          }],
          "employeeApp": [{
            "menuCode": "HOLIDAY_MANAGE",
            "menuType": "EMPLOYEE",
            "menuName": "假期管理",
            "imageUrl": "build/img/application/vacation@3x.png",
            "destUrl": "tab.time-off-manage",
            "hasWorkflowNum": "N",
            "menuSequence": 1,
            "userPrivileges": "N"
          }, {
            "menuCode": "DORMAPPLY",
            "menuType": "EMPLOYEE",
            "menuName": "住宿申请",
            "imageUrl": "build/img/application/dorm@3x.png",
            "destUrl": "tab.dorm-apply",
            "hasWorkflowNum": "N",
            "menuSequence": 2,
            "userPrivileges": "N"
          }, {
            "menuCode": "CARPOOLING",
            "menuType": "EMPLOYEE",
            "menuName": "拼车",
            "imageUrl": "build/img/application/carpooling@3x.png",
            "destUrl": "tab.carpooling",
            "hasWorkflowNum": "N",
            "menuSequence": 3,
            "userPrivileges": "N"
          }, {
            "menuCode": "BUS",
            "menuType": "EMPLOYEE",
            "menuName": "班车信息",
            "imageUrl": "build/img/application/bus@3x.png",
            "destUrl": "tab.bus-information",
            "hasWorkflowNum": "N",
            "menuSequence": 4,
            "userPrivileges": "N"
          }, {
            "menuCode": "PERSONNEL_POLICY",
            "menuType": "EMPLOYEE",
            "menuName": "人事政策",
            "imageUrl": "build/img/application/HR@3x.png",
            "destUrl": "tab.personnel-policy",
            "hasWorkflowNum": "N",
            "menuSequence": 5,
            "userPrivileges": "N"
          }, {
            "menuCode": "BLANK",
            "menuType": "",
            "menuName": "",
            "imageUrl": "",
            "destUrl": "",
            "hasWorkflowNum": "",
            "menuSequence": ""
          }, {
            "menuCode": "BLANK",
            "menuType": "",
            "menuName": "",
            "imageUrl": "",
            "destUrl": "",
            "hasWorkflowNum": "",
            "menuSequence": ""
          }, {
            "menuCode": "BLANK",
            "menuType": "",
            "menuName": "",
            "imageUrl": "",
            "destUrl": "",
            "hasWorkflowNum": "",
            "menuSequence": ""
          }]
        },
        "con_status": "S"
      };

      this.getAppData = function () {
        return appData;
      };

      this.analysisMenuList = function (menuType) {
        var menuList = [];
        var menu4List = [];
        angular.forEach(menuType, function (data, index) {

          var hasWorkflowNum = false;
          var localMenuFlag = 'Y';
          if (data.hasWorkflowNum == 'Y') {
            hasWorkflowNum = true;
          }

          if (data.localMenuFlag) {
            localMenuFlag = data.localMenuFlag;
          }

          var menuItem = {
            appName: data.menuName,
            imageUrl: data.imageUrl,
            destUrl: data.destUrl,
            hasWorkflowNum: hasWorkflowNum,
            localMenuFlag: data.localMenuFlag,
            count: 0
          }

          menu4List.push(menuItem);

          if ((index + 1) % 4 == 0) {
            menuList.push({"list": menu4List});
            menu4List = [];
          }
        });

        return menuList;
      };

      this.fetchMenuList = function (success, error) {
        var url = baseConfig.businessPath + "/common_info/get_user_menu_list_v2";
        var params = {
          "params": {
            "p_user_code": window.localStorage.empno
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          error(response);
        });
      };

    }]);

angular.module('applicationModule')
  .service('crmEmployeeService', [
    'baseConfig',
    'hmsPopup',
    'opportunityAddService',
    function (baseConfig,
              hmsPopup,
              opportunityAddService) {

      this.crmEmployeeDetail = null;

      this.initDetail = function (success) {
        var that = this;
        opportunityAddService.getEmployeeDetail(function (response) {
          if (response.returnCode == 'S') {
            if (response.employee_detail.saleArea != '')
              response.employee_detail.saleBelong = response.employee_detail.saleArea;
            if (response.employee_detail.saleTeam != '')
              response.employee_detail.saleBelong += " | " + response.employee_detail.saleTeam;
            that.crmEmployeeDetail = response.employee_detail;
            success();
          } else {
            if (response.returnCode == 'E')
              hmsPopup.showPopup(response.returnMsg);
            else
              hmsPopup.showPopup('crm数据获取失败，请检查网络或联系管理员');
          }
        });
      };

      this.getEmployeeDetail = function () {
        return this.crmEmployeeDetail;
      }

    }]);

