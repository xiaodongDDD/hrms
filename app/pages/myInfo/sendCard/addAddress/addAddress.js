/**
 * Created by wkh on 2017/2/21.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .controller('addAddressCtrl', addAddressCtrl);
  function addAddressCtrl($scope,
                          $rootScope,
                          hmsPopup,
                        sendCardService,
                          $ionicModal,
                          hmsHttp,
                          baseConfig,
                          $ionicScrollDelegate) {
    var vm = this;
    $scope.addFlag=true;
    $scope.title="新建地址";
    $scope.addressDetail={
      name:"",
      phone:"",
      province:"",
      city:"",
      zone:"",
      province_id:"",
      city_id:"",
      zone_id:"",
      address:"",
      addr_details:""
    };
   var ADD_ADDRESS= $rootScope.$on('ADD_ADDRESS',function(){
      console.log("ADD_ADDRESS");
      $scope.addFlag=true;
      $scope.title="新建地址";
      $scope.addressDetail={
        name:"",
        phone:"",
        province:"",
        city:"",
        zone:"",
        province_id:"",
        city_id:"",
        zone_id:"",
        address:"",
        addr_details:""
      };
    });
   var EDIT_ADDRESS= $rootScope.$on('EDIT_ADDRESS',function(){
      console.log(sendCardService.getEditAddress());
      $scope.addressDetail=sendCardService.getEditAddress();
      $scope.addressDetail.addr_details=sendCardService.getEditAddress().details;
      $scope.addressDetail.province_id=sendCardService.getEditAddress().province_id;
      $scope.addressDetail.city_id=sendCardService.getEditAddress().city_id;
      $scope.addressDetail.zone_id=sendCardService.getEditAddress().zone_id;
      $scope.addressDetail.address=sendCardService.getEditAddress().country_name+sendCardService.getEditAddress().province_name+sendCardService.getEditAddress().city_name+sendCardService.getEditAddress().zone_name;
      $scope.title="编辑地址";
      $scope.addFlag=false;
    });
    var pickContact = function () {
      ContactsPlugin.pickContact(function (response) {
        var email = response.emailList.length == 0 ? "" : response.emailList[0].value;
        var phone = response.phoneList.length == 0 ? "" : response.phoneList[0].value;
        $scope.addressDetail.name=response.name;
        $scope.addressDetail.phone=response.phone;
        $scope.$apply();
      }, function () {
        hmsPopup.showPopup('选取错误，请重新选择');
      });
    };
    $scope.pickContactTo=function(){
      pickContact();
    };
    $scope.goBack=function(){
      $scope.$emit('CLOSE_ADDRESS_ADD');
    };
    var updateAddressInfoSuccess=function(result){
      hmsPopup.hideLoading();
      hmsPopup.showShortCenterToast(result.message);
      if(result.status=="S"){
      console.log(result);
      $scope.$emit('UPDATE_ADDRESS_LIST');
      }
    };
    var updateAddressInfoData={
      "params":{
        p_employee_number:window.localStorage.empno,
        p_name: "",
        p_phone:"",
        p_province:"",
        p_city:"",
        p_zone:"",
        p_country:"",
        p_addr_details:$scope.addressDetail.addr_details
      }
    };
    $scope.addAddress=function(){
      hmsPopup.showLoading("正在保存");
      if($scope.addressDetail.name==''){
        hmsPopup.hideLoading();
        hmsPopup.showPopup("请填写收件人姓名");
      }else if($scope.addressDetail.phone==""){
        hmsPopup.hideLoading();
        hmsPopup.showPopup("请填写联系电话");
      }else if($scope.addressDetail.country_id=""){
        hmsPopup.hideLoading();
        hmsPopup.showPopup("请填写所在地区");
      }else if($scope.addressDetail.addr_details=""){
        hmsPopup.hideLoading();
        hmsPopup.showPopup("请填写所在地区详情");
      }else{

      console.log("地址详情"+angular.toJson($scope.addressDetail));
      if($scope.addFlag){
        updateAddressInfoData.params.p_name=$scope.addressDetail.name;
        updateAddressInfoData.params.p_phone=$scope.addressDetail.phone;
        updateAddressInfoData.params.p_addr_details=$scope.addressDetail.addr_details;
        updateAddressInfoData.params.p_province=$scope.addressDetail.province_id;
        updateAddressInfoData.params.p_city=$scope.addressDetail.city_id;
        updateAddressInfoData.params.p_zone=$scope.addressDetail.zone_id;
        updateAddressInfoData.params.p_country=$scope.addressDetail.country_id;
      }else{
        updateAddressInfoData.params.p_name=$scope.addressDetail.name;
        updateAddressInfoData.params.p_phone=$scope.addressDetail.phone;
        updateAddressInfoData.params.p_addr_details=$scope.addressDetail.addr_details;
        updateAddressInfoData.params.p_address_id=$scope.addressDetail.address_id;
        updateAddressInfoData.params.p_province=$scope.addressDetail.province_id;
        updateAddressInfoData.params.p_city=$scope.addressDetail.city_id;
        updateAddressInfoData.params.p_zone=$scope.addressDetail.zone_id;
        updateAddressInfoData.params.p_country=$scope.addressDetail.country_id;
      }
      sendCardService.updateAddressInfo(updateAddressInfoSuccess,updateAddressInfoData)
      }
    };
    //vm.ORCode=ORCode;
    //function ORCode(){
    //  console.log("===");
    //}
    //地址选择
    Array.prototype.clone = function () {
      return [].concat(this);
    };
    $scope.places = [];
    var CHINA_CODE = 1037;
    $scope.selectCity = {
      placeKey: ""
    };
    //省市历史栈
    $scope.selectedPlaces = [{
      "addressId": 1037,
      "addressName": "中国",
      "type": "COUNTRY",
      "parentAddressId": 0
    }];
    $scope.clearFilter = function () {
      $scope.selectCity.placeKey = '';
      getCountry(0);
      /* $scope.items = $scope.data.clone();*/
    };
    var getCountryObjById = function (id) {
      for (var i = 0; i < $scope.places.length; i++)
        if ($scope.places[i].addressId == id)
          return $scope.places[i];
    };

    var getCountry = function (parentAddressId) {
      $scope.showCrmLoading = true;
      $scope.selectCity.placeKey = '';
      var temp = getCountryObjById(parentAddressId);
      var baseUrl = baseConfig.basePath;
      var url = baseUrl + "query_address";
      hmsHttp.post(url, {"parentAddressId": parentAddressId}).success(function (data) {
        $scope.showCrmLoading = false;
        $scope.placeData = data.address_list.clone();
        $ionicScrollDelegate.$getByHandle('countryScroll').scrollTop(false);
        if (data.address_list.length == 0) {
          console.log($scope.selectedPlaces);
          $scope.addressDetail.address = "";
          var str = "";
          if ($scope.inChina) {
            for (var i = 0; i < $scope.selectedPlaces.length; i++) {
              str += $scope.selectedPlaces[i].addressName;
              $scope.addressDetail.address = str;
            }
            //updateAddressInfoData.params.p_city.addressCountry = $scope.selectedPlaces[0].addressId;
            if ($scope.selectedPlaces.length > 2) {
              $scope.addressDetail.province_id = Number($scope.selectedPlaces[1].addressId);
              $scope.addressDetail.city_id = Number($scope.selectedPlaces[2].addressId);
            } else {
              $scope.addressDetail.province_id = "";
              $scope.addressDetail.city_id = "";
            }
            $scope.addressDetail.country_id=1037;
            $scope.addressDetail.zone_id =  Number(temp.addressId);
          } else {
            $scope.addressDetail.country_id  = temp.addressId;
            $scope.addressDetail.province_id = "";
            $scope.addressDetail.city_id = "";
            $scope.addressDetail.zone_id="";
          }
          $scope.addressDetail.address = $scope.addressDetail.address + temp.addressName;
          console.log("last select:" + temp.addressName + ", code is:" + temp.addressId);
          $scope.showCountrySelect();
          return;
        } else {
          if ($scope.inChina && temp != undefined)
            $scope.selectedPlaces.push(temp);
        }
        $scope.places = data.address_list;
        /*  console.log( $scope.places);*/
      }).error(function (data, status) {

      });
    };

    $scope.showCountryFlag = false;
    $ionicModal.fromTemplateUrl('build/pages/modals/crmCityModal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal1) {
      $scope.crmCityModal = modal1;
    });
    $scope.showCountrySelect = function () {
      $scope.inChina = true;
      $scope.showCrmLoading = !$scope.showCrmLoading;
      if ($scope.showCountryFlag) {
        $scope.crmCityModal.hide();
      } else {
        $scope.crmCityModal.show();
      }
      $scope.showCountryFlag = !$scope.showCountryFlag;
      if ($scope.showCountrySelect) {
        $scope.selectedPlaces = [{
          "addressId": 1037,
          "addressName": "中国",
          "type": "COUNTRY",
          "parentAddressId": 0
        }];
        getCountry(CHINA_CODE);
      }
    };

    $scope.inChina = true;

    $scope.changeChina = function (flag) {
      $scope.showCrmLoading = true;
      if (flag == $scope.inChina)
        return;
      $scope.selectedPlaces = [];
      $scope.places = [];
      $scope.inChina = flag;
      if ($scope.inChina) {
        $scope.selectedPlaces = [{
          "addressId": 1037,
          "addressName": "中国",
          "type": "COUNTRY",
          "parentAddressId": 0
        }];
        getCountry(CHINA_CODE);
      } else {
        getCountry(0);
      }
    };
    $scope.changeChina(true);
    $scope.selectPlace = function ($index) {
      getCountry($scope.places[$index].addressId);
    };

    $scope.placeBackTo = function ($index) {
      $scope.selectedPlaces = $scope.selectedPlaces.slice(0, $index + 1);
      getCountry($scope.selectedPlaces[$index].addressId);
    };


    $scope.filterCountry = function () {
      if ($scope.selectCity.placeKey == '')
        $scope.places = $scope.placeData.clone();
      else {
        for (var i = 0; i < $scope.placeData.length; i++) {
          if (isContains($scope.placeData[i].addressName, $scope.selectCity.placeKey))
            $scope.places[i] = $scope.placeData[i];
          else
            $scope.places[i] = '';
        }
      }
    };
    //销毁广播
    $scope.$on('$destroy',function(){//controller回收资源时执行
      ADD_ADDRESS();//回收广播
      EDIT_ADDRESS();
    });
  }
})();

