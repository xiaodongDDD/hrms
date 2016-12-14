angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flybackDetail', {
          url: '/flyback-detail/:param',
          params: {
            'param':''
          },
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/detail/detail.html',
              controller: 'FlyBackDetailCtrl'
            }
          }
        });
    }])

angular.module("applicationModule")
  .controller('FlyBackDetailCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    'flaybackService',
    'hmsPopup',
    '$stateParams',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory,
      $timeout, HttpAppService, $ionicModal, fbService,
      Prompter, $stateParams){
        //  $scope.canEdit = true;
        // 获取页面参数
        console.log(angular.toJson($stateParams.param));
        $scope.pageParam = JSON.parse($stateParams.param);
        $scope.canEdit = $scope.pageParam.canEdit;//页面是否可编辑
        var dataSource = $scope.pageParam.dataSource;//页面数据来源
        if ($scope.pageParam.status == "update") {
          $scope.flybackline = $scope.pageParam.detail;
          var flight_date = new Date($scope.flybackline.flight_date);
          $scope.flybackline.flight_date = flight_date;
          var flybacklineOld = $scope.flybackline;
          var index = $scope.pageParam.index;
          var applyId = $scope.pageParam.applyId;
        } else if ($scope.pageParam.status == "new") {

          var flight_date = new Date(fbService.getNowFormatDate().replace(/\-/g, "/"));
          $scope.flybackline = {
            "apply_detail_id": "",
            "projName": "",
            "projCode": "",
            "ticketTypeName": "",
            "ticket_type": "",
            "routeTypeName": "",
            "route_type": "",
            "flyback1": "",
            "flyback1_id": "",
            "flyback2": "",
            "flyback2_id": "",
            "from_place": "",
            "go_place": "",
            "flight_date": flight_date,
            "flight_time": "",
            "place": "",
            // "placeCode": "",
            "passenger": "",
            "certificate_code": "",
            "customer_paid": "0",
            "is_ticket_only_record": "0",
            "description": ""
          };
          $scope.flybackline.projName = fbService.getProjName();
          $scope.flybackline.projCode = fbService.getProjCode();
          $scope.flybackline.passenger = fbService.getPassenger();
          $scope.flybackline.certificate_code = fbService.getCertification();
          console.log(" $scope.flybackline.projName " + $scope.flybackline.projName);
        }


        // 获取值列表
        if ($scope.canEdit) {
          $scope.ticketTypeList = fbService.getTicketTypeList();
          $scope.routeTypeList = fbService.getRouteTypeList();
          $scope.passengerList = fbService.getPassengerList();
          //给默认值
          if ($scope.pageParam.status == "new") {
            if ($scope.ticketTypeList.length > 0) {
              $scope.flybackline.ticketTypeName = $scope.ticketTypeList[0].name;
              $scope.flybackline.ticket_type = $scope.ticketTypeList[0].value;
            }
            if ($scope.routeTypeList.length > 0) {
              $scope.flybackline.routeTypeName = $scope.routeTypeList[0].name;
              $scope.flybackline.route_type = $scope.routeTypeList[0].value;
            }
          }
          Prompter.showLoading("请稍候");
          var urlValueList = baseConfig.businessPath + "get_value_list2";
          var paramValueList={
            'params':{
              'p_employee':window.localStorage.empno,
              'p_project_code':$scope.flybackline.projCode
            }
          };
          console.log("");
          HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
            if (response.status == "S") {
              $scope.placeList = response.placeList;
              $scope.flybackList = response.flybackList;
              $scope.preflybackList = response.preflybackList;
              // 项目地默认取值列表中的第一个
              if ($scope.placeList.length > 0) {
                $scope.flybackline.place = $scope.placeList[0].name;
                //  $scope.flybackline.placeCode = $scope.placeList[0].value;
              }
              Prompter.hideLoading("");
            } else {
              console.log("获取值列表失败：" + response.returnMsg);
              Prompter.hideLoading("");
            }
          }).error(function (response, status) {
            console.log("HttpAppService error ");
            Prompter.hideLoading("");
          });
        }


        //日历插件调用
        $scope.datepickerObject = {};
        $scope.datepickerObject.inputDate = new Date();

        $scope.datepickerObjectPopup = {
          titleLabel: '日期选择',  //Optional
          todayLabel: '今天',  //Optional
          closeLabel: '关闭',  //Optional
          setLabel: '确定',  //Optional
          setButtonType: 'button-assertive',  //Optional
          todayButtonType: 'button',  //Optional
          closeButtonType: 'button',  //Optional
          inputDate: $scope.datepickerObject.inputDate, //Optional
          mondayFirst: true,  //Optional
          disabledDates: [], //Optional
          weekDaysList: ["日", "一", "二", "三", "四", "五", "六"], //Optional
          monthList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], //Optional
          templateType: 'popup', //Optional
          showTodayButton: 'true', //Optional
          modalHeaderColor: 'bar-positive', //Optional
          modalFooterColor: 'bar-positive', //Optional
          from: new Date(1900, 0, 1), //Optional
          to: new Date(2101, 0, 1),  //Optional
          dateFormat: ' yyyy - MM - dd ', //Optional
          closeOnSelect: false, //Optional
          callback: function (val) { //Optional
            datePickerCallbackPopup(val);
          }
        };
        var datePickerCallbackPopup = function (val) {
          if (typeof(val) === 'undefined') {
            console.log('No date selected');
          } else {
            $scope.datepickerObjectPopup.inputDate = val;
            $scope.flybackline.flight_date = val;
            console.log('Selected date is : ', $scope.flybackline.flight_date)
          }
        };


        // 值列表
        $ionicModal.fromTemplateUrl('build/pages/application/flyback/detail/model/select-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal
        });

        $scope.openModal = function (type) {
          if ($scope.canEdit) {
            if (type == "ticketType") {
              $scope.listType = "ticketType";
              $scope.lists = $scope.ticketTypeList;
            } else if (type == "routeType") {
              $scope.listType = "routeType";
              $scope.lists = $scope.routeTypeList;
            } else if (type == "flyback1") {
              $scope.listType = "flyback1";
              if ($scope.flybackline.ticket_type == "10") {
                $scope.lists = $scope.flybackList;
              } else if ($scope.flybackline.ticket_type == "20") {
                $scope.lists = $scope.preflybackList;
              }
            } else if (type == "flyback2") {
              $scope.listType = "flyback2";
              if ($scope.flybackline.ticket_type == "10") {
                $scope.lists = $scope.flybackList;
              } else if ($scope.flybackline.ticket_type == "20") {
                $scope.lists = $scope.preflybackList;
              }
            } else if (type == "place") {
              $scope.listType = "place";
              $scope.lists = $scope.placeList;
            } else if (type == "passenger") {
              $scope.listType = "passenger";
              $scope.lists = $scope.passengerList;
            }
            $scope.modal.show();
          }
        };
        $scope.closeModal = function (item) {
          $scope.modal.hide();
          if (item !== undefined) {
            if ($scope.listType == "ticketType") {
              if ((typeof($scope.flybackline.ticket_type) !== "undefined") && ($scope.flybackline.ticket_type !== null)) {
                if ($scope.flybackline.flybackline !== item.value) {
                  $scope.flybackline.flyback1 = "";
                  $scope.flybackline.flyback1_id = "";
                  $scope.flybackline.flyback2 = "";
                  $scope.flybackline.flyback2_id = "";
                }
              }
              $scope.flybackline.ticketTypeName = item.name;
              $scope.flybackline.ticket_type = item.value;
            } else if ($scope.listType == "routeType") {
              $scope.flybackline.routeTypeName = item.name;
              $scope.flybackline.route_type = item.value;
            } else if ($scope.listType == "flyback1") {
              $scope.flybackline.flyback1 = item.type_name;
              $scope.flybackline.flyback1_id = item.value;
            }
            else if ($scope.listType == "flyback2") {
              $scope.flybackline.flyback2 = item.type_name;
              $scope.flybackline.flyback2_id = item.value;
            } else if ($scope.listType == "place") {
              $scope.flybackline.place = item.name;
              //  $scope.flybackline.placeCode = item.value;
            } else if ($scope.listType == "passenger") {
              $scope.flybackline.passenger = item.name;
              $scope.flybackline.certificate_code = item.value;
            }
          }
        };

        $scope.clearSelect = function () {
          $scope.modal.hide();
          if ($scope.listType == "ticketType") {
            $scope.flybackline.ticketTypeName = "";
            $scope.flybackline.ticket_type = "";
            $scope.flybackline.flyback1 = "";
            $scope.flybackline.flyback1_id = "";
            $scope.flybackline.flyback2 = "";
            $scope.flybackline.flyback2_id = "";
          } else if ($scope.listType == "routeType") {
            $scope.flybackline.routeTypeName = "";
            $scope.flybackline.route_type = "";
          } else if ($scope.listType == "flyback1") {
            $scope.flybackline.flyback1 = "";
            $scope.flybackline.flyback1_id = "";
          }
          else if ($scope.listType == "flyback2") {
            $scope.flybackline.flyback2 = "";
            $scope.flybackline.flyback2_id = "";
          } else if ($scope.listType == "place") {
            $scope.flybackline.place = "";
            //   $scope.flybackline.placeCode = "";
          } else if ($scope.listType == "passenger") {
            $scope.flybackline.passenger = "";
            $scope.flybackline.certificate_code = "";
          }
        };

        var checkbox = {
          checked: "ion-ios-checkmark fb-checkbox",
          unchecked: "ion-ios-circle-outline fb-checkbox"
        }
        // 客户承担
        $scope.customerpaid = {id: 1, selected: 'N', style: "ion-ios-circle-outline fb-checkbox", editable: 'Y'};
        $scope.customerPaid = function () {
          if ($scope.canEdit) {
            if ($scope.customerpaid.editable == "Y") {// add by ciwei
              if ($scope.customerpaid.selected == "Y") {
                $scope.customerpaid.selected = "N";
                $scope.customerpaid.style = checkbox.unchecked;
                $scope.flybackline.customer_paid = "0";
              } else {
                $scope.customerpaid.selected = "Y";
                $scope.customerpaid.style = checkbox.checked;
                $scope.flybackline.customer_paid = "1";
              }
            }
          }
        };
        // 机票补录
        $scope.ticketonly = {id: 1, selected: 'N', style: "ion-ios-circle-outline timesheet-checkbox", editable: 'Y'};
        $scope.ticketOnly = function () {
          if ($scope.canEdit) {
            if ($scope.ticketonly.selected == "Y") {
              $scope.ticketonly.selected = "N";
              $scope.ticketonly.style = checkbox.unchecked;
              $scope.flybackline.is_ticket_only_record = "0";
            } else {
              $scope.ticketonly.selected = "Y";
              $scope.ticketonly.style = checkbox.checked;
              $scope.flybackline.is_ticket_only_record = "1";
            }
          }
        };
        // 初始化数据
        if ($scope.flybackline.customer_paid == "0") {
          $scope.customerpaid.selected = "N";
          $scope.customerpaid.style = checkbox.unchecked;
        } else {
          $scope.customerpaid.selected = "Y";
          $scope.customerpaid.style = checkbox.checked;
        }
        if ($scope.flybackline.is_ticket_only_record == "0") {
          $scope.ticketonly.selected = "N";
          $scope.ticketonly.style = checkbox.unchecked;
        } else {
          $scope.ticketonly.selected = "Y";
          $scope.ticketonly.style = checkbox.checked;
        }


        $scope.$on('$destroy', function () {
          $scope.modal.remove();
        });

        //删除
        $scope.delete = function () {
          if ($scope.canEdit) {
            //  var flight_date = getFormatDate(new Date($scope.flybackline.flight_date));
            //  $scope.flybackline.flight_date = flight_date;
            if ($scope.flybackline.apply_detail_id !== "") {
              Prompter.showLoading("请稍候");
              var urlValueList = baseConfig.businessPath + "delete_flyback_line";
              var paramValueList = '{"params":{"p_apply_id":"' + applyId + '","p_apply_detail_id":"' + $scope.flybackline.apply_detail_id + '"}}';
              console.log("paramValueList =" + paramValueList);
              HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
                if (response.status == "S") {
                  fbService.deleteLine(index);
                  Prompter.hideLoading("");
                } else {
                  console.log("删除失败：" + response.returnMsg);
                  Prompter.hideLoading("");
                }
              }).error(function (response, status) {
                console.log("HttpAppService error ");
                Prompter.hideLoading("");
              });
            } else {
              fbService.deleteLine(index);
            }
            $state.go("tab.flybackApply");
          } else {
            Prompter.showPopup("已提交数据无法删除!");
          }
        }
        //确认
        $scope.confirm = function () {
          console.log("confirm status =" + $scope.pageParam.status);
          if ($scope.pageParam.status == "new") {
            var flight_date = getFormatDate(new Date($scope.flybackline.flight_date));
            $scope.flybackline.flight_date = flight_date;
            fbService.addLine($scope.flybackline);
            $state.go("tab.flybackApply");
          } else if ($scope.pageParam.status == "update") {
            fbService.updateLine($scope.flybackline, index);
            $state.go("tab.flybackApply");
          }

        };
    }]);
