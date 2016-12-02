/**
 *  modify by shellWolf on 16/06/28.
 */
'use strict';
angular.module('contactModule')
  .controller('ContactCtrl', [
    '$scope',
    '$rootScope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsPopup',
    '$state',
    '$cordovaActionSheet',
    'contactService',
    'getInitStructureInfo',
    function ($scope,
              $rootScope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsPopup,
              $state,
              $cordovaActionSheet,
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
            $scope.manInfo = {
              emp_name: '',
              mobil: '',
              email: '',
              organization: ''
            };
            msg = JSON.parse(msg);
            try {
              $scope.manInfo.emp_name = msg.formatted_name[0].item;
            } catch (e) {
              try {
                $scope.manInfo.emp_name = msg.name[0].item.family_name + msg.name[0].item.given_name;
              } catch (e) {
                $scope.manInfo.emp_name = '';
              }
            }
            try {
              var phones = msg.telephone;
              if (phones.length > 0) {
                $scope.manInfo.mobil = phones[0].item.number;
              } else {
                $scope.manInfo.mobil = "";
              }
            } catch (e) {
              $scope.manInfo.mobil = '';
            }
            try {
              var emails = msg.email;
              if (emails.length > 0) {
                $scope.manInfo.email = emails[0].item;
              }
            } catch (e) {
              $scope.manInfo.email = '';
            }
            try {
              var organization = msg.organization;
              if (organization.length > 0) {
                $scope.manInfo.organization = organization[0].item.name;
              }
            } catch (e) {
              $scope.manInfo.organization = '';
            }

            try {
              angular.element('.contact').css({
                'WebkitFilter': 'blur(5px) brightness(1)',
                'filter': 'blur(5px) brightness(1)'
              });
              $scope.$apply();
              $scope.scanCardModal.show();
            } catch (e) {
            }
          }
          hmsPopup.hideLoading();
        } catch (e) {
          hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
          hmsPopup.hideLoading();
        }
      };

      // 创建名片扫描结果的modal现实页面
      (function scanCardModal() {
        $ionicModal.fromTemplateUrl('build/pages/contact/modal/scan-card-result.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.scanCardModal = modal;
        });
      })();

      $scope.$on('modal.hidden', function () {
        angular.element('.contact').css({'WebkitFilter': '', 'filter': ''});
      });

      $scope.set2localContact = function () {
        contactService.contactLocal($scope.manInfo,$scope.scanCardModal);
      };

      $scope.resetScanCard = function () {
        $scope.scanBusinessCard();
      };

      $scope.scanBusinessCard = function () { //名片扫描添加联系人到通讯录
        if (ionic.Platform.isWebView()) {
          var options = {
            buttonLabels: ['拍照', '从相册中选择'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true,
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
          };

          document.addEventListener("deviceready", function () {
            $cordovaActionSheet.show(options)
              .then(function (btnIndex) {
                if (baseConfig.debug) {
                  warn(btnIndex);
                }
                if (btnIndex == 1) {
                  hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.takePicturefun(function (msg) {
                    dealScanData(msg);
                  }, function (error) {
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                } else if (btnIndex == 2) {
                  hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.choosePicturefun(function (msg) {
                    dealScanData(msg);
                  }, function (error) {
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                }
              });
          }, false);
        } else {
          hmsPopup.showShortCenterToast('暂不支持网页端的名片扫描!');
        }
      };

      $scope.telNumber = function (event, baseInfo,employeeNumber,name,imgageUrl) { //拨打电话按钮的响应事件
        //event.stopPropagation(); //阻止事件冒泡
        //常用联系人拨打电话
        var options = {
          buttonLabels: ['拨打电话', '拨打网络电话'],
          addCancelButtonWithLabel: '取消',
          androidEnableCancelButton: true,
          androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
        };

        $cordovaActionSheet.show(options)
          .then(function (btnIndex) {
            if (btnIndex == 1) {
              window.location.href = "tel:" + baseInfo.replace(/\s+/g, "");
            }else if (btnIndex == 2) {
              HandIMPlugin.callNetPhone(function(){},function(){},employeeNumber,name,imgageUrl);
            }
          });
      };

      $scope.goInputSearch = function () { //去搜索界面
        $state.go('tab.contactSearch');
      };

      $scope.goStructure = function (flag) {
        // hmsPopup.showShortCenterToast('下一版本上线!');
        // return;
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
  .factory('commonContactService', [function () {
    var _pageName = '';
    var _newEmp = {};

    return {
      setGoContactFlg: function (newPage) {
        _pageName = newPage;
      },
      getContactFlag: function () {
        return _pageName;
      },
      setEmpInfo: function (newEmp) {
        _newEmp = newEmp;
      },
      getEmpInfo: function () {
        return _newEmp;
      }
    }
  }]);


