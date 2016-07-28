/**
 *  modify by shellWolf on 16/06/28.
 */
'use strict';
angular.module('contactModule')
  .controller('ContactCtrl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsPopup',
    '$state',
    '$ionicActionSheet',
    'contactService',
    'getInitStructureInfo',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsPopup,
              $state,
              $ionicActionSheet,
              contactService,
              getInitStructureInfo) {
      /**
       * var section
       */
      {
        $scope.customContactsInfo = [];
        $scope.showTopInput = false; // 默认不显示bar上的搜索框
        $scope.structureName = ''; //当前员工所属层级的名字
        $scope.currentStructure = {};
        var CONTACT_TAG = 'contact:\n';
        var position = ''; //记录滚动条的位置--
        var LINK_MAN = 'common_linkman2';
      }

      function getCurrentDepartInfo(result) {
        try {
          if (Object.keys(result).length !== 0) { //枚举
            $scope.currentStructure = result;
            for (var i = 1; i < result.deptInfo.length; i++) {
              if (i === (result.deptInfo.length - 1)) {
                $scope.structureName += result.deptInfo[i].name;
              } else {
                $scope.structureName += result.deptInfo[i].name + '-';
              }
            }
          }
        } catch (e) {
        }
      };

      getInitStructureInfo.getCurrentStructure(getCurrentDepartInfo);

      function getCommonLinkMan() { //获取常用联系人
        $scope.customContactsInfo = unique_better(storedb(LINK_MAN).find(), 'employeeNumber');
        if ($scope.customContactsInfo.length > 15) {
          $scope.customContactsInfo = $scope.customContactsInfo.slice(0, 15);
        }
      };

      $scope.$on('$ionicView.beforeEnter', function (e) {
        getCommonLinkMan();
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('ContactCtrl.$destroy');
        }
      });

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 33) {
            $scope.showTopInput = false;
          } else if (position >= 33) {
            $scope.showTopInput = true;
          }
        });
      };

      function dealScanData(msg) { //处理名片扫描插件的返回数据
        // alert("msg " + jsonFormat(JSON.parse(msg)));
        try {
          if (JSON.parse(msg)) {
            var manInfo = {
              emp_name: '',
              mobil: '',
              email: ''
            };
            msg = JSON.parse(msg);
            try {
              manInfo.emp_name = msg.formatted_name[0].item;
            } catch (e) {
              try {
                manInfo.emp_name = msg.name[0].item.family_name + msg.name[0].item.given_name;
              } catch (e) {
                manInfo.emp_name = '';
              }
            }
            try {
              var phones = msg.telephone;
              if (phones.length > 0) {
                manInfo.mobil = phones[0].item.number;
              } else {
                manInfo.mobil = ""; //待测 --需要测试一个数据情况的json format
              }
            } catch (e) {
              manInfo.mobil = '';
            }
            try {
              var emails = msg.email;
              if (emails.length > 0) {
                manInfo.email = emails[0].item;
              }
            } catch (e) {
              manInfo.email = '';
            }
            try {
              $scope.$apply();
              contactService.contactLocal(manInfo);
            } catch (e) {
            }
          }
          hmsPopup.hideLoading();
        } catch (e) {
          hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
          hmsPopup.hideLoading();
        }
      };

      $scope.scanBusinessCard = function () { //名片扫描添加联系人到通讯录
        if (ionic.Platform.isWebView()) {
          try {
            $ionicActionSheet.show({
              buttons: [
                {text: '拍照'},
                {text: '从相册中选择'},
              ],
              cancelText: 'Cancel',
              buttonClicked: function (index) {
                if (index == 0) {
                  // hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.takePicturefun(function (msg) {
                    dealScanData(msg);
                  }, function (error) {
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                }
                if (index == 1) {
                  // hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.choosePicturefun(function (msg) {
                    dealScanData(msg);
                  }, function (error) {
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                }
              }
            });
          } catch (e) {
            // alert(e);
          }
        } else {
          hmsPopup.showShortCenterToast('暂不支持网页端的名片扫描!');
        }
      };


      $scope.telNumber = function (event, baseInfo) { //拨打电话按钮的响应事件
        event.stopPropagation(); //阻止事件冒泡
        //常用联系人拨打电话
        window.location.href = "tel:" + baseInfo.replace(/\s+/g, "");
      };

      $scope.goInputSearch = function () { //去搜索界面
        $state.go('tab.contactSearch');
      };

      $scope.goStructure = function (flag) {
        if (angular.equals(flag, 'current')) {
          $state.go('tab.contactStructure', {
            routeId: "currentDepartment",
            structureId: "1",
            currentDepartInfo: $scope.currentStructure
          });
        } else {
          $state.go('tab.contactStructure');
        }
      };

      $scope.goDetailInfo = function (newEmployeeNumber) {
        $state.go('tab.employeeDetail', {employeeNumber: newEmployeeNumber});
      };

    }])
  .service('getInitStructureInfo', ['hmsHttp', 'baseConfig', function (hmsHttp, baseConfig) {
    var _currentStructureUrl = baseConfig.queryPath + '/dept/getStaffDeptInfo';
    var _structureUrl = baseConfig.queryPath + '/dept/getDetail';
    this._returnData = {};
    return {
      getCurrentStructure: function (callback) {
        hmsHttp.post(_currentStructureUrl).success(function (response) {
          if (response.returnData) {
          } else {
            response.returnData = {};
          }
          callback(response.returnData);
        }).error(function (error) {
        });
      },
      getStructure: function (callback, newId) {
        var params = {
          "id": newId
        };

        hmsHttp.post(_structureUrl, params).success(function (response) {
          try {
            this._returnData = response.returnData;
          } catch (e) {
            this._returnData = {};
          }
          callback(this._returnData);
        }.bind(this)).error(function (error) {
        });
      }
    }
  }])
  .factory('commonContactService',[function () {
    var _pageName = '';
    var _newEmp = {};

    return{
      setGoContactFlg: function (newPage) {
        _pageName = newPage;
      },
      getContactFlag: function () {
        return _pageName;
      },
      setEmpInfo:function (newEmp) {
        _newEmp = newEmp;
      },
      getEmpInfo: function () {
        return _newEmp;
      }
    }
  }]);


