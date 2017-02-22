/**
 * Created by wkh on 2017/2/22.
 */
angular.module('myInfoModule')
  .service('sendCardService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function (baseConfig,
              hmsHttp,hmsPopup) {
      var baseUrl = baseConfig.businessPath+"/api_card/";
     this.getCardList=function(success){;
        var params = {
          "params":{
            "p_employee_number": window.localStorage.empno
          }
        };
        hmsHttp.post(baseUrl + 'get_card_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
      //获取个人信息
      this.getEmployeeInfo=function(success){
        var params = {
          "params":{
            "p_employee_number": window.localStorage.empno
          }
        };
        hmsHttp.post(baseUrl + 'get_employee_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
      //获取头像
      this.getHeadPicture=function(success){
        var params = {
          "params":{
            "p_employee_number": window.localStorage.empno
          }
        };
        hmsHttp.post(baseUrl + 'get_head_picture', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
      //上传头像
      this.saveHeadPicture=function(success,p_url){
        var params = {
          "params":{
            "p_employee_number": window.localStorage.empno,
            "p_url":p_url
          }
        };
        hmsHttp.post(baseUrl + 'save_head_picture', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
      //保存和修改名片
      this.updateCardInfo=function(success,param){
        var params = param;
        hmsHttp.post(baseUrl + 'update_card_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
      //获取名片详情
      this.getSingleCard=function(success,cardId){
        var params = {
          "params":{
            "p_card_id": cardId
          }
        };
        hmsHttp.post(baseUrl + 'get_single_card', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
      //删除名片
      this.deleteCardInfo=function(success,param){
        var params = param;
        hmsHttp.post(baseUrl + 'delete_card_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
      //保存寄件地址
      this.updateAddressInfo=function(success,param){
        var params = param;
        hmsHttp.post(baseUrl + 'update_address_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('取消销售计划出现异常，请联系管理员');
          hmsPopup.hideLoading();
        });
      };

      //存储名片详情
      this.cardDetail = {};
      function cloneObj(obj) {
        var o;
        if (obj.constructor == Object) {
          o = new obj.constructor();
        } else {
          o = new obj.constructor(obj.valueOf());
        }
        for (var key in obj) {
          if (o[key] != obj[key]) {
            if (typeof(obj[key]) == 'object') {
              o[key] = cloneObj(obj[key]);
            } else {
              o[key] = obj[key];
            }
          }
        }
        return o;
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };

      this.getCardDetail= function () {
        return this.cardDetail;
      };

      this.setCardDetail = function (cardDetail) {
        this.cardDetail = cloneObj(cardDetail);
      };
}]);
