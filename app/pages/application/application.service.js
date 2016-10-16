/**
 * Created by gusenlin on 2016/10/16.
 */
angular.module('applicationModule')
  .service('applicationService', [
    'baseConfig',
    'hmsHttp',
    function (baseConfig,
              hmsHttp) {

      this.analysisMenuList = function (menuType) {
        var menuList = [];
        var menu4List = [];
        angular.forEach(menuType, function (data, index) {

          var hasWorkflowNum = false;
          if(data.hasWorkflowNum == 'Y'){
            hasWorkflowNum = true;
          }

          var menuItem = {
            appName: data.menuName,
            imageUrl: data.imageUrl,
            destUrl: data.destUrl,
            hasWorkflowNum: hasWorkflowNum,
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
        var url = baseConfig.businessPath + "/common_info/get_user_menu_list";
        var params = {
          "params": {
            "p_user_code": window.localStorage.empno,
          }
        };
        hmsHttp.post(url, params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          error(response);
        });
      };

    }]);
