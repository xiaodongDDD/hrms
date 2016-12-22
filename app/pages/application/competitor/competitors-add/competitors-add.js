/**
 * Created by wkh on 2016/10/17.
 */
angular.module('competitorModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.competitors-add', {
          url: '/competitors-add',
          params: {
            competitors: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/competitor/competitors-add/competitors-add.html',
              controller: 'addCompetitorsCtrl'
            }
          }

        })
    }]);
angular.module('competitorModule')
  .controller('addCompetitorsCtrl',
  ['$scope',
    '$state',
    '$ionicHistory',
    'history',
    'hmsPopup',
    '$timeout',
    'contactLocal',
    'CloneData',
    '$ionicModal',
    'hmsHttp',
    'baseConfig',
    'addCompetitorsService',
    '$rootScope',
    'addLinkmanService',
    '$stateParams',
    'competitorDetailService',
    function ($scope,
              $state,
              $ionicHistory,
              history,
              hmsPopup,
              $timeout,
              contactLocal,
              CloneData,
              $ionicModal,
              hmsHttp,
              baseConfig,
              addCompetitorsService,
              $rootScope,
              addLinkmanService,
              $stateParams,
              competitorDetailService) {
      $rootScope.img = "";
      $scope.showSmallCrmLoading = false;
      $scope.$on('$ionicView.enter', function (e) {
        console.log($stateParams.competitors);
        if (isNotNullObj($stateParams.competitors)) {
          $scope.value = $stateParams.competitors;
          if($stateParams.competitors.areaProperty=="HCRM_GLOBAL"){
            $scope.num = 0;
          }else{
            $scope.num = 1;
          }
          if($stateParams.competitors.dataStatus=="HCRM_ENABLE"){
            $scope.numStatus=0;
          }else{
            $scope.numStatus=1;
          }
          $scope.showStatus=true;

        } else {
          $scope.value = {
            "competitorId": "-9999",
            "competitorCode": "",
            "shortName": "",
            "fullName": "",
            "areaProperty": "",
            "areaPropertyName": "",
            "dataStatus": "HCRM_ENABLE",
            "dataStatusName": "有效",
            "competitorAdvDesc": "",
            "competitorDisadvDesc": "",
            "competitorProducts": []
          };
          $scope.showStatus=false;
          $scope.num = 0;
          $scope.numStatus=0;
        }
      });
      $scope.title = {
        name: "产品名称",
        adv: "优势说明",
        other: "其他优势"
      };

      $scope.product = {
        productName: "",
        productAdvDesc: "",
        productOtherDesc: "",
        productId: "",
        competitorId: "-9999"
      };
      $scope.hideAreaFlag = [];
      $scope.inputItem = [{
        text: "客户全称",
        input: "",
        placeholder: "请输入",
        important: true
      }, {
        text: "客户简称",
        input: "",
        placeholder: "请输入",
        important: true
      }];
      /*  $scope.competitorProducts=[];//对手优势产品列表*/
      $scope.goBack = function () {
        if ($ionicHistory.viewHistory().backView) {
          $ionicHistory.goBack();

        } else {
          $state.go('tab.application');
        }
      };
      $scope.hideArea = function (num) {
        $scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
      };

      $scope.clickThis = function (num, item) {
        $scope.num = num;
        $scope.value.areaProperty = item.value;
      };
      $scope.clickThisStatus = function (num, item) {
        $scope.numStatus = num;
        $scope.value.dataStatus = item.value;
      };
      $ionicModal.fromTemplateUrl('build/pages/application/competitor/competitors-add/product-add/product-add.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function () {
        $scope.product = {
          productName: "",
          productAdvDesc: "",
          productOtherDesc: "",
          productId: "",
          competitorId: "-9999"
        };
        $scope.modal.show();
      };
      $scope.goCancel = function () {
        $scope.modal.hide();
      };
      //保存新添产品
      $scope.saveProduct = function (product) {
        product.productId = "";
        product.competitorId = "-9999";
        product.objectVersionNumber = "";
        console.log($scope.value.competitorProducts);
        console.log(product);
        if (product.productName == "") {
          hmsPopup.showPopup("产品名称不能为空");
        } else {
          $scope.value.competitorProducts.push(product);
          console.log($scope.value.competitorProducts);
          $scope.modal.hide();
        }

      };
      $scope.deleteProduct = function (item, index) {
        console.log(item);

        $scope.value.competitorProducts.splice(index, 1);
        if (item.productId != "") {
          var deleteProuctDes = {
            "productId": item.productId,
            "competitorId": item.competitorId
          };
          var initDeletSuccess = function (data) {
            console.log(data);
            console.log(angular.toJson($scope.value.competitorProducts));
          };
          addCompetitorsService.deleteProduct(initDeletSuccess, deleteProuctDes);
        }
      };
      function insertText(obj, str) {
        if (document.selection) {
          var sel = document.selection.createRange();
          sel.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
          obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
          cursorPos += str.length;
          obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
          obj.value += str;
        }
      }
      $scope.voiceToAdvantage1 = function () {
        $scope.holdText1 = true;
        cordova.plugins.pluginIflytek.startRecorerRecognize(
          function (msg) {
          }, function (msg) {
          });
      };
      $scope.onReleaseAdvantage1 = function () {
        $scope.showSmallCrmLoading = true;
        $scope.holdText1 = false;
        $timeout(function () {
          console.log("timeout");
          $scope.showSmallCrmLoading = false;
        }, 5000);
        cordova.plugins.pluginIflytek.stopRecorderRecognize(
          function (msg) {
            $scope.showSmallCrmLoading = false;
            hmsPopup.showPopup(msg);
          }, function (msg) {
            $timeout(function () {
              insertText(document.getElementById('advantage1'), msg);
              $scope.$apply();
              $scope.showSmallCrmLoading = false;
            }, 0);
          });
      };
      $scope.voiceToAdvantage2 = function () {
        $scope.holdText = true;
        cordova.plugins.pluginIflytek.startRecorerRecognize(
          function (msg) {

          }, function (msg) {

          });
      };
      $scope.onReleaseAdvantage2 = function () {
        $scope.showSmallCrmLoading = true;
        $scope.holdText = false;
        $timeout(function () {
          console.log("timeout");
          $scope.showSmallCrmLoading = false;
        }, 5000);
        cordova.plugins.pluginIflytek.stopRecorderRecognize(
          function (msg) {
            $scope.showSmallCrmLoading = false;
            hmsPopup.showPopup(msg);
          }, function (msg) {
            $timeout(function () {
              insertText(document.getElementById('advantage2'), msg);
              $scope.$apply();
              $scope.showSmallCrmLoading = false;
            }, 0);
          });
      };
      var upData = [
        {
          "code": "HCRM.COMPETITOR_DATA_STATUS",
          "lastUpdateDate": "COMPETITOR_DATA_STATUS_DATE",
          localList: 'COMPETITOR_DATA_STATUS'
        },{
          "code": "HCRM.COMPETITOR_AREA_PROPERTY",
          "lastUpdateDate": "COMPETITOR_AREA_PROPERTY_DATE",
          localList: 'COMPETITOR_AREA_PROPERTY'
        }
      ];
      var getValueObjByCode = function (code) {
        for (var i = 0; i < upData.length; i++) {
          if (code == upData[i].code) {
            return upData[i];
          }
        }
      };
      $scope.items = [];
      var valueListSuccess = function (response) {
        if (response.returnCode == 'S') {
          var code = response.lookup_detail[0].lookup_code;
          var lastUpdateDate = response.lookup_detail[0].last_update_date;
          var valueObj = getValueObjByCode(code);
          console.log(valueObj);
          if (lastUpdateDate == window.localStorage[valueObj.lastUpdateDate]) {
            console.log("====一样");
            console.log(valueObj);
            $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
            console.log($scope.items);
            /* $scope.$apply();*/
          } else {
            console.log("====bu一样");
            console.log(valueObj);
            window.localStorage[valueObj.lastUpdateDate] = lastUpdateDate;
            window.localStorage[valueObj.localList] = JSON.stringify(response.lookup_detail[0].lookup_value_list);
            $scope.items = $scope.items.concat(response.lookup_detail[0].lookup_value_list);
            /* $scope.$apply();*/
          }
        }
      };
      $scope.statusData=[];
      function valueStatusListSuccess(response){
        if (response.returnCode == 'S') {
          var code = response.lookup_detail[0].lookup_code;
          var lastUpdateDate = response.lookup_detail[0].last_update_date;
          var valueObj = getValueObjByCode(code);
          console.log(valueObj);
          if (lastUpdateDate == window.localStorage[valueObj.lastUpdateDate]) {
            console.log("====一样");
            console.log(valueObj);
            $scope.statusData = $scope.statusData.concat(JSON.parse(window.localStorage[valueObj.localList]));
            console.log($scope.statusData);
            /* $scope.$apply();*/
          } else {
            console.log("====bu一样");
            console.log(valueObj);
            window.localStorage[valueObj.lastUpdateDate] = lastUpdateDate;
            window.localStorage[valueObj.localList] = JSON.stringify(response.lookup_detail[0].lookup_value_list);
            $scope.statusData = $scope.statusData.concat(response.lookup_detail[0].lookup_value_list);
            /* $scope.$apply();*/
          }
        }
      }
      addLinkmanService.getValueList(valueListSuccess, 'HCRM.COMPETITOR_AREA_PROPERTY', window.localStorage.COMPETITOR_AREA_PROPERTY_DATE);
      addLinkmanService.getValueList(valueStatusListSuccess, 'HCRM.COMPETITOR_DATA_STATUS', window.localStorage.COMPETITOR_DATA_STATUS_DATE);
      $scope.saveCompetitor = function (value) {
        $scope.value.competitorAdvDesc= $('#advantage1').val();
        $scope.value.competitorDisadvDesc= $('#advantage2').val();
        /*  console.log(valYuyin);*/
        console.log("=====");
        console.log( $scope.value.competitorAdvDesc);
        hmsPopup.showLoading("正在保存");
        console.log(value);
        if ($scope.num == 0) {
          value.areaProperty = "HCRM_GLOBAL";
        } else {
          value.areaProperty = "HCRM_LOCAL";
        }
        if ($scope.numStatus == 0) {
          value.dataStatusName ="HCRM_ENABLE";
        } else {
          value.dataStatusName = "HCRM_DISABLE";
        }
        /*       if (value.competitorProducts.length == 0) {
         value.competitorProducts.push($scope.product);
         }*/
        console.log(value);
        var competitor = {
          competitorId: "-9999",
          shortName: value.shortName,
          fullName: value.fullName
        };
        var initSaveSuccess = function (data) {
          hmsPopup.hideLoading();
          if (data.returnCode == "S") {
            $rootScope.$broadcast("REFRESH_COMPETITOR_ADD");
            hmsPopup.showShortCenterToast(data.returnMsg);
            $timeout(function () {
              if ($ionicHistory.viewHistory().backView) {
                $ionicHistory.goBack();
              } else {
                $state.go('tab.application');
              }
            }, 400);
            $scope.value = {
              "competitorId": "-9999",
              "competitorCode": "",
              "shortName": "",
              "fullName": "",
              "areaProperty": "",
              "areaPropertyName": "",
              "dataStatus": "",
              "dataStatusName": "",
              "competitorAdvDesc": "",
              "competitorDisadvDesc": "",
              "competitorProducts": []
            };
          } else {
            $scope.value.competitorProducts = [];
            hmsPopup.showShortCenterToast(data.returnMsg);
          }
        };
        var initCheckSuccess = function (result) {

          if (result.returnCode == "S") {
            console.log($stateParams.competitors);
            /*  if(isNotNullObj($stateParams.competitors)){
             competitorDetailService.updateCompetitorDetail(initSaveSuccess, value);
             }else{*/
            addCompetitorsService.saveCompetitorFn(initSaveSuccess, value);
            /*   }

             /!* console.log($ionicHistory.viewHistory().backView.stateName);*!/
             } else {
             $scope.value. competitorProducts= [];
             hmsPopup.showShortCenterToast(result.returnMsg);
             }*/
          }else{
            hmsPopup.hideLoading();
            hmsPopup.showPopup(result.returnMsg);
          }
        };
        if (!isNotNullObj($stateParams.competitors)) {
          if (competitor.shortName == "") {
            $scope.value.competitorProducts = [];
            hmsPopup.hideLoading();
            hmsPopup.showPopup("竞争对手简称不能为空");
          } else {
            addCompetitorsService.checkCompetitor(initCheckSuccess, competitor);
          }
        } else {
          console.log(angular.toJson(value));
          if (value.shortName == "") {
            hmsPopup.showPopup("竞争对手简称不能为空");
          } else {
            competitorDetailService.updateCompetitorDetail(initSaveSuccess, value);
          }
        }
      }
    }]);
angular.module('competitorModule')
  .service('addCompetitorsService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {
      var baseUrlTest = baseConfig.basePath;
      this.saveCompetitorFn = function (success, key) {
        hmsHttp.post(baseUrlTest + 'add_competitor', key).success(function (result) {
          success(result);
        }).error(function (response, status) {
          // hmsPopup.showPopup(response);
        });
      };
      this.checkCompetitor = function (success, key) {
        hmsHttp.post(baseUrlTest + 'competitor_valid_name', key).success(function (result) {
          success(result);
        }).error(function (response, status) {
          // hmsPopup.showPopup(response);
        });
      };
      this.deleteProduct = function (success, key) {
        hmsHttp.post(baseUrlTest + 'delete_product', key).success(function (result) {
          success(result);
        }).error(function (response, status) {
          // hmsPopup.showPopup(response);
        });
      };
    }
  ]);
