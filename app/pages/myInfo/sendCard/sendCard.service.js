/**
 * Created by wkh on 2017/2/22.
 */
angular.module('myInfoModule')
  .service('sendCardService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    '$http',
    function (baseConfig,
              hmsHttp,hmsPopup,$http) {
      var baseUrl = baseConfig.businessPath+"/api_card/";
     this.getCardList=function(success){
        var params = {
          "params":{
            "p_employee_number": window.localStorage.empno
          }
        };
        hmsHttp.post(baseUrl + 'get_card_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
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
        console.log(params);
        hmsHttp.post(baseUrl + 'get_single_card', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //删除名片
      this.deleteCardInfo=function(success,cardId){
        var params = {
          "params":{
            "p_card_id": cardId
          }
        };
        hmsHttp.post(baseUrl + 'delete_card_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
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
          hmsPopup.hideLoading();
        });
      };
      this.getCompanyInfo=function(success){
        var params = {
          "params":{
            "p_company_id": "10000"
          }
        };
        hmsHttp.post(baseUrl + 'get_company_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //获取收货地址列表
      this.getAddressInfo=function(success){
        var params = {
          "params":{
            "p_employee_number": window.localStorage.empno
          }
        };
        hmsHttp.post(baseUrl + 'get_address_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //删除地址
      this.deleteAddressInfo=function(success,addressId){
        var params = {
          "params":{
            "p_address_id":addressId
          }
        };
        hmsHttp.post(baseUrl + 'delete_address_info', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //提交名片申请
      this.printCardApply=function(success,param){
        var params = param;
        hmsHttp.post(baseUrl + 'print_card_apply', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //设置默认地址
      this.setDefaultAddress=function(success,addressId){
        var params = {
          "params":{
            "p_address_id":addressId,
            "p_employee_number": window.localStorage.empno
          }
        };
        hmsHttp.post(baseUrl + 'set_default_address', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //存储名片详情
      this.cardDetail = {};
      this.mailAddress={};
      this.editAddress={};
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
     //储存地址
      this.getMailAddress= function () {
        return this.mailAddress;
      };

      this.setMailAddres = function (mailAddress) {
        this.mailAddress = cloneObj(mailAddress);
      };
      //储存地址信息
      this.getEditAddress= function () {
        return this.editAddress;
      };

      this.setEditAddress= function (editAddress) {
        this.editAddress = cloneObj(editAddress);
      };
}]);
