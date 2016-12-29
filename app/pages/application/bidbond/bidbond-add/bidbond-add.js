/**
 * Created by leiyu on 2016/12/13.
 */
angular.module('bidbondModule')
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('tab.bidbond-add', {
					url: '/bidbond-add',
					params: {
						param: {}
					},
					views: {
						'tab-application': {
							prefetchTemplate: false,
							templateUrl: 'build/pages/application/bidbond/bidbond-add/bidbond-add.html',
							controller: 'addbidbondCtrl'
						}
					}
				})
		}
	]);

angular.module('bidbondModule')
	.controller('addbidbondCtrl', [
		'$scope',
		'baseConfig',
		'$ionicHistory',
		'$state',
		'addbidbondService',
		'hmsPopup',
		'$rootScope',
		'ionicDatePicker',
		'$ionicScrollDelegate',
		'$ionicModal',
		'T',
		'$stateParams',
		'opportunityAddService',
		'customerService',
		'$cordovaDatePicker',
		function($scope,
			baseConfig,
			$ionicHistory,
			$state,
			addbidbondService,
			hmsPopup,
			$rootScope,
			ionicDatePicker,
			$ionicScrollDelegate,
			$ionicModal,
			T,
			$stateParams,
			opportunityAddService,
			customerService,
			$cordovaDatePicker) {
				
			console.log("保证金ctrl");
			
			$rootScope.img = "";
			
			$scope.readonly = {
				readonlyFlag: false
			};

			$scope.showDisable = false;
			var getToday = function() {
				var date = new Date();
				return date.Format("yyyy-MM-dd hh:mm:ss");

			};
			$scope.$on('$ionicView.enter', function(e) {
				console.log($stateParams.param);
				if(isNotNullObj($stateParams.param)) {
					//	$scope.data = $stateParams.param;
					$scope.data = {
						bondId: $stateParams.param.bondId,
						opportunityId: $stateParams.param.opportunityId,
						opportunityCode: $stateParams.param.opportunityCode,
						customerCode: $stateParams.param.customerCode,
						customerId: $stateParams.param.customerId,
						companyId: $stateParams.param.companyId,
						projectId: $stateParams.param.projectId,
						unitId: $stateParams.param.unitId,
						occurredDate: $stateParams.param.occurredDate,
						paymentAmount: $stateParams.param.paymentAmount,
						currency: $stateParams.param.currency,
						expectPaymentType: "HCRM_TRANSFER",
						transferEndDate: $stateParams.param.transferEndDate,
						latestPaymentDate: $stateParams.param.latestPaymentDate,
						expectRetrieveDate: $stateParams.param.expectRetrieveDate,
						retrieveCondition: $stateParams.param.retrieveCondition,
						payeeName: $stateParams.param.payeeName,
						dueBanck: $stateParams.param.dueBanck,
						fromBasicAccount: "HCRM_YES",
						dueBanckAccount: $stateParams.param.dueBanckAccount,
						paymentContent: $stateParams.param.paymentContent,
						applicationBy: $stateParams.param.applicationBy,
						applicationDate: $stateParams.param.applicationDate,
						workflowStatus: $stateParams.param.workflowStatus,
						attachments: [],
					};

					//界面显示的数据
					$scope.showData = {
						bondId: $stateParams.param.bondId,
						opportunityName: $stateParams.param.fullName,
						fullName: $stateParams.param.customerName,
						companyName: $stateParams.param.companyName,
						projectName: $stateParams.param.projectName,
						occurredDate: $stateParams.param.occurredDate,
						paymentAmount: $stateParams.parampaymentAmount,
						currency: $stateParams.param.currency,
						currencyName: $stateParams.param.currencyName,
						expectPaymentTypeValue: "转账",
						transferEndDate: $stateParams.param.transferEndDate,
						latestPaymentDate: $stateParams.param.latestPaymentDate,
						expectRetrieveDate: $stateParams.param.expectRetrieveDate,
						retrieveCondition: $stateParams.param.retrieveCondition,
						payeeName: $stateParams.param.payeeName,
						dueBanck: $stateParams.param.dueBanck,
						fromBasicAccountValue: "是",
						dueBanckAccount: $stateParams.param.dueBanckAccount,
						paymentContent: $stateParams.param.paymentContent,
						applicationBy: $stateParams.param.applicationBy,
						applicationDate: $stateParams.param.applicationDate,
						attachments: $stateParams.param.attachments,
						hrFullUnitName: $stateParams.param.hrFullUnitName,
						workflowStatusName: $stateParams.param.workflowStatusName
					};
					if($stateParams.param.workflowStatus == 0 || $stateParams.param.workflowStatus == -1 || !$stateParams.param.workflowStatus) {

					} else {
						$scope.showDisable = true;
						/*    hmsPopup.showPopup($stateParams.param.workflowStatusName+"，不可编辑");*/
						document.getElementById("saveBtn").style.display="none";
					}
				} else {

					$scope.data = {
						opportunityId: "",
						opportunityCode: "",
						customerCode: "",
						customerId: "",
						projectId: "",
						occurredDate: "",
						paymentAmount: "",
						currency: "",
						expectPaymentType: "HCRM_TRANSFER",
						transferEndDate: "",
						latestPaymentDate: "",
						expectRetrieveDate: "",
						retrieveCondition: "",
						payeeName: "",
						dueBanck: "",
						fromBasicAccount: "HCRM_YES",
						dueBanckAccount: "",
						paymentContent: "",
						applicationBy: "",
						applicationDate: getToday(),
						attachments: [],
						unitId: "",
						companyId: "",
						workflowStatus: "0"
					};

					//界面显示的数据
					$scope.showData = {
						fullName: "",
						projectId: "",
						occurredDate: "",
						paymentAmount: "",
						currencyName: "",
						expectPaymentTypeValue: "转账",
						transferEndDate: "",
						latestPaymentDate: "",
						expectRetrieveDate: "",
						retrieveCondition: "",
						payeeName: "",
						dueBanck: "",
						fromBasicAccountValue: "是",
						dueBanckAccount: "",
						paymentContent: "",
						projectName: "",
						hrFullUnitName: "",
						companyName: "",
						workflowStatusName: '新建'
					};
				}
			});

			$scope.titleList = {
				oppotunityName: T.T('BIDBOND_ADD.OPPOTUNITY'),
				customer: T.T('BIDBOND_ADD.CUSTOMER'),
				company: T.T('BIDBOND_ADD.COMPANY'),
				project: T.T('BIDBOND_ADD.PROJECT'),
				unitId: T.T('BIDBOND_ADD.UNITID'),
				occurredDate: T.T('BIDBOND_ADD.OCCURRED_DATE'),
				paymentType: T.T('BIDBOND_ADD.PAYMENT_TYPE'),
				bidBidbond: T.T('BIDBOND_ADD.BID_BIDBOND'),
				paymentAmount: T.T('BIDBOND_ADD.PAYMENT_AMOUNT'),
				currency: T.T('BIDBOND_ADD.CURRENCY'),
				expectPaymentType: T.T('BIDBOND_ADD.EXPECT_PAYMENTTYPE'),
				transferEndDate: T.T('BIDBOND_ADD.TRANSFEREND_DATE'),
				latestPaymentDate: T.T('BIDBOND_ADD.LATESTPAYMENT_DATE'),
				fromBasicAccount: T.T('BIDBOND_ADD.FROMBASIC_ACCOUNT'),
				expectRetrieveDate: T.T('BIDBOND_ADD.EXPECTRETRIEVE_DATE'),
				retrieveCondition: T.T('BIDBOND_ADD.RETRIEVE_CONDITION'),
				payeeName: T.T('BIDBOND_ADD.PAYEE_NAME'),
				dueBanck: T.T('BIDBOND_ADD.BANK'),
				dueBanckAccount: T.T('BIDBOND_ADD.ACCOUNT'),
				paymentContent: T.T('BIDBOND_ADD.PAY_CONTENT'),
				chooseOppotunity: T.T('BIDBOND_ADD.CHOOSE_OPPO')
			};

			//屏蔽有输入框的元素
			$scope.inputItemReadOnlyFlag = true;

			//返回
			$scope.goBack = function() {
				if($ionicHistory.viewHistory().backView) {
					$ionicHistory.goBack();
				} else {
					$state.go('tab.application');
				}
			};
			var getEmployeeDetailSuccess = function(response) {
				if(response.returnCode == 'S') {
					$scope.personalInfo = response.employee_detail;
				}
			};
			customerService.getEmployeeDetail(getEmployeeDetailSuccess);
			$scope.hideAreaFlag = [];

			$scope.hideArea = function(num) {
				$scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
				$ionicScrollDelegate.$getByHandle("slide-img").resize();
			};

			$scope.showSelect = false;

			//设置日期相关选项
			$scope.selectDate = function(key) {
				if(ionic.Platform.isWebView()) {
					var options = {
						date: new Date(),
						mode: 'date',
						titleText: '请选择时间',
						okText: '确定',
						cancelText: '取消',
						doneButtonLabel: '确认',
						cancelButtonLabel: '取消',
						locale: 'zh_cn',
						androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
					};

					if(key == 'occurredDate') {
						$cordovaDatePicker.show(options).then(function(dateNo) {
							if(dateNo) {
								var year = dateNo.getFullYear();
								var month = dateNo.getMonth() + 1;
								var date = dateNo.getDate();
								$scope.data.occurredDate = year + '-' + month + '-' + date;
								console.log($scope.data.occurredDate);
							}
							$scope.$apply();
						});
					} else if(key == 'transferEndDate') {
						$cordovaDatePicker.show(options).then(function(dateNo) {
							if(dateNo) {
								var year = dateNo.getFullYear();
								var month = dateNo.getMonth() + 1;
								var date = dateNo.getDate();
								$scope.data.transferEndDate = year + '-' + month + '-' + date;
								console.log($scope.data.transferEndDate);
							}
							$scope.$apply();
						});
					} else if(key == 'latestPaymentDate') {
						$cordovaDatePicker.show(options).then(function(dateNo) {
							if(dateNo) {
								var year = dateNo.getFullYear();
								var month = dateNo.getMonth() + 1;
								var date = dateNo.getDate();
								$scope.data.latestPaymentDate = year + '-' + month + '-' + date;
								console.log($scope.data.latestPaymentDate);
							}
							$scope.$apply();
						});
					} else if(key == 'expectRetrieveDate') {
						$cordovaDatePicker.show(options).then(function(dateNo) {
							if(dateNo) {
								var year = dateNo.getFullYear();
								var month = dateNo.getMonth() + 1;
								var date = dateNo.getDate();
								$scope.data.expectRetrieveDate = year + '-' + month + '-' + date;
								console.log($scope.data.expectRetrieveDate);
							}
							$scope.$apply();
						});
					}
				} else {
					if(key == 'occurredDate')
						ionicDatePicker.openDatePicker(occurredDate);
					else if(key == 'transferEndDate')
						ionicDatePicker.openDatePicker(transferEndDate);
					else if(key == 'latestPaymentDate')
						ionicDatePicker.openDatePicker(latestPaymentDate);
					else if(key == 'expectRetrieveDate')
						ionicDatePicker.openDatePicker(expectRetrieveDate);
				}

			};

			var occurredDate = {
				callback: function(val) {
					var selectedDate = new Date(val);
					var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
					console.log(dateText);
					$scope.data.occurredDate = dateText;
				},
				from: new Date(2012, 1, 1),
				to: new Date(2017, 10, 30),
				inputDate: new Date(),
				mondayFirst: true,
				closeOnSelect: false,
				templateType: 'popup'
			};

			var transferEndDate = {
				callback: function(val) {
					var selectedDate = new Date(val);
					var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
					console.log(dateText);
					$scope.data.transferEndDate = dateText;
				},
				from: new Date(2012, 1, 1),
				to: new Date(2017, 10, 30),
				inputDate: new Date(),
				mondayFirst: true,
				closeOnSelect: false,
				templateType: 'popup'
			};

			var latestPaymentDate = {
				callback: function(val) {
					var selectedDate = new Date(val);
					var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
					console.log(dateText);
					$scope.data.latestPaymentDate = dateText;
				},
				from: new Date(2012, 1, 1),
				to: new Date(2017, 10, 30),
				inputDate: new Date(),
				mondayFirst: true,
				closeOnSelect: false,
				templateType: 'popup'
			};

			var expectRetrieveDate = {
				callback: function(val) {
					var selectedDate = new Date(val);
					var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
					console.log(dateText);
					$scope.data.expectRetrieveDate = dateText;
				},
				from: new Date(2012, 1, 1),
				to: new Date(2017, 10, 30),
				inputDate: new Date(),
				mondayFirst: true,
				closeOnSelect: false,
				templateType: 'popup'
			};

			//===========================================================================================

			function cloneObj(obj) {
				var o, obj;
				if(obj.constructor == Object) {
					o = new obj.constructor();
				} else {
					o = new obj.constructor(obj.valueOf());
				}
				for(var key in obj) {
					if(o[key] != obj[key]) {
						if(typeof(obj[key]) == 'object') {
							o[key] = cloneObj(obj[key]);
						} else {
							o[key] = obj[key];
						}
					}
				}
				o.toString = obj.toString;
				o.valueOf = obj.valueOf;
				return o;
			}

			$scope.initData = function() {

				$scope.searchModel = {
					searchValueKey: ''
				};

				$scope.nowPage = 1;
				$scope.pageSize = 15;

				$scope.items = [];
				$scope.nowSelectTarget = {};

				$scope.moreDataCanBeLoaded = false;

				$scope.sourceItems = [];
				$scope.noDataFlag = false;

				$scope.validNameFlag = true;

				$scope.editFlag = false;

			};

			$scope.initData();

			var saveBidbondSuccess = function(response) {
				hmsPopup.hideLoading();
				if(response.returnCode == "S") {
					if($scope.editFlag) {
						hmsPopup.showPopup("添加修改成功");
						$scope.$emit('BIDBOND_EDIT_SUCCESS');
					} else {
						$scope.initData();

						var confirmPopup = function(index) {
							console.log(index);
							if(index) {
								console.log("确认审核");
								console.log(response);
								/*   addbidbondService.validName(validNameSuccess, $scope.data.fullName);*/
								var submitSuccess = function(result) {
									console.log(result);
									if(result.returnCode == "S") {
										hmsPopup.showPopup(result.returnMsg);
										$state.go('tab.bidbond');
									} else {
										hmsPopup.showPopup(result.returnMsg);
									}

								};
								addbidbondService.bidbondSubmit(submitSuccess, response.bidbond);
								/*    addbidbondService.validbidbond(validBidbondSuccess);*/

							}
						};
						var onBack = function(index) {
							console.log("onback" + index);
							if(!index) {
								$state.go('tab.bidbond');
							}
						};
						if(isNotNullObj($stateParams.param)) {
							hmsPopup.confirmDIY("请问是否现在提交保证金申请？", "编辑成功", "提交申请", "暂不提交", confirmPopup, onBack);
						} else {
							hmsPopup.confirmDIY("请问是否现在提交保证金申请？", "保存成功", "提交申请", "暂不提交", confirmPopup, onBack);
						}

						$scope.$emit('BIDBOND_ADD_SUCCESS');

					}
				} else {
					hmsPopup.showPopup("保存失败");
				}
			};

			//保存新建保证及申请验证
			$scope.saveBidbond = function() {

				console.log($scope.data);

				if($scope.showData.opportunityName == '') {
					hmsPopup.showPopup("商机名称不能为空！");
					return;
				}
				if($scope.showData.fullName == '') {
					hmsPopup.showPopup("所属客户不能为空！");
					return;
				}
				if($scope.showData.companyName == '') {
					hmsPopup.showPopup("费用所属公司不能为空！");
					return;
				}
				if($scope.data.projectId == '') {
					hmsPopup.showPopup("费用所属项目不能为空！");
					return;
				}
				if($scope.showData.projectName == '') {
					hmsPopup.showPopup("费用所属项目不能为空！");
					return;
				}
				if($scope.showData.hrFullUnitName == '') {
					hmsPopup.showPopup("费用所属部门不能为空！");
					return;
				}
				if($scope.data.hrUnitId == '') {
					hmsPopup.showPopup("费用所属部门不能为空！");
					return;
				}
				if($scope.data.unitId == '') {
					hmsPopup.showPopup("费用所属部门不能为空！");
					return;
				}
				if($scope.data.occurredDate == '') {
					hmsPopup.showPopup("费用发生日期不能为空！");
					return;
				}
				if($scope.data.paymentAmount == '') {
					hmsPopup.showPopup("付款金额不能为空！");
					return;
				}
				if($scope.data.currency == '') {
					hmsPopup.showPopup("币种不能为空！");
					return;
				}
				if($scope.showData.currencyName == '') {
					hmsPopup.showPopup("币种不能为空！");
					return;
				}
				if($scope.data.expectPaymentType == '') {
					hmsPopup.showPopup("期望付款方式不能为空！");
					return;
				}
				if($scope.data.latestPaymentDate == '') {
					hmsPopup.showPopup("最晚支付时间不能为空！");
					return;
				}
				if($scope.data.fromBasicAccount == '') {
					hmsPopup.showPopup("要求基本户转出不能为空！");
					return;
				}
				if($scope.data.expectRetrieveDate == '') {
					hmsPopup.showPopup("预计取回日期不能为空！");
					return;
				}
				if($scope.data.retrieveCondition == '') {
					hmsPopup.showPopup("保证金取回条件不能为空！");
					return;
				}
				if($scope.data.payeeName == '') {
					hmsPopup.showPopup("收款人姓名不能为空！");
					return;
				}
				if($scope.data.dueBanck == '') {
					hmsPopup.showPopup("收款人银行不能为空！");
					return;
				}
				if($scope.data.dueBanckAccount == '') {
					hmsPopup.showPopup("收款人账号不能为空！");
					return;
				}
				if($scope.data.paymentContent == '') {
					hmsPopup.showPopup("付款内容不能为空！");
					return;
				}
				
				$scope.data.applicationBy = $scope.personalInfo.userId;
				
				if(!$stateParams.param.workflowStatus) {
					hmsPopup.showLoading();
					addbidbondService.SaveBidbonds(saveBidbondSuccess, $scope.data);
				} else if($stateParams.param.workflowStatus == 0 || $stateParams.param.workflowStatus == -1) {
					hmsPopup.showLoading();
					addbidbondService.EditBidbonds(saveBidbondSuccess, $scope.data);
				} else {
					/* $scope.showDisable=true;*/
					hmsPopup.showPopup($stateParams.param.workflowStatusName + "，不可编辑");
				}

			};

			//设置值列表
			var bidbond_value_list = [{
				code: "HCRM.DEPOSIT_PAYMENT",
				lastUpdateDate: "DEPOSIT_PAYMENT_DATE",
				localList: 'DEPOSIT_PAYMENT'
			}, {
				code: "HCRM.CURRENCY",
				lastUpdateDate: "CURRENCY_DATE",
				localList: 'CURRENCY'
			}, {
				code: "HCRM.YES_NO",
				lastUpdateDate: "YES_NO_DATE",
				localList: 'YES_NO'
			}];

			//=====================================================================================

			var getValueObjByCode = function(code) {
				for(var i = 0; i < bidbond_value_list.length; i++) {
					if(code == bidbond_value_list[i].code)
						return cloneObj(bidbond_value_list[i]);
				}
			};

			var getValueListSuccess = function(response) {
				if(response.returnCode == 'S') {
					for(var i = 0; i < response.lookup_detail.length; i++) {
						var code = response.lookup_detail[i].lookup_code;
						var lastUpdateDate = response.lookup_detail[i].last_update_date;
						var valueObj = getValueObjByCode(code);
						console.log("valueObj:" + valueObj);
						if(lastUpdateDate != window.localStorage[valueObj.lastUpdateDate]) {
							window.localStorage[valueObj.lastUpdateDate] = lastUpdateDate;
							window.localStorage[valueObj.localList] = JSON.stringify(response.lookup_detail[i].lookup_value_list);
						}
					}
				}
			};

			var showValueInList = function(code) {
				var valueObj = getValueObjByCode(code);
				console.log(valueObj);
				$scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
				$scope.sourceItems = $scope.items.clone();
			};

			//=====================================================================================

			var getCustomerSuccess = function(response) {
				$scope.showCrmLoading = false;
				if(response.returnCode == 'S') {
					$scope.moreDataCanBeLoaded = response.customer_list.length == $scope.pageSize;
					$scope.items = $scope.items.concat(response.customer_list);
					$scope.sourceItems = $scope.items.clone();
				} else {
					$scope.moreDataCanBeLoaded = false;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};

			var getCustomerSearchSuccess = function(response) {
				$scope.moreDataCanBeLoaded = false;
				$scope.showCrmLoading = false;
				if(response.returnCode == 'S') {
					$scope.items = response.customer_list;
					$scope.moreDataCanBeLoaded = response.customer_list.length == $scope.pageSize;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};

			var getOpportunitySearchSuccess = function(response) {
				$scope.showCrmLoading = false;
				$scope.moreDataCanBeLoaded = response.opportunity_list.length == $scope.pageSize;
				if(response.returnCode == 'S') {
					$scope.items = $scope.items.concat(response.opportunity_list);
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};

			var getOpportunitySuccess = function(response) {
				$scope.showCrmLoading = false;
				console.log(response);
				if(response.returnCode == 'S') {
					$scope.moreDataCanBeLoaded = response.opportunity_list.length == $scope.pageSize;
					$scope.items = $scope.items.concat(response.opportunity_list);
					$scope.sourceItems = $scope.items.clone();
				} else {
					$scope.moreDataCanBeLoaded = false;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};

			var getCompanySuccess = function(response) {
				$scope.showCrmLoading = false;
				console.log(response);
				if(response.returnCode == 'S') {
					$scope.moreDataCanBeLoaded = response.company_list.length == $scope.pageSize;
					$scope.items = $scope.items.concat(response.company_list);
					$scope.sourceItems = $scope.items.clone();
				} else {
					$scope.moreDataCanBeLoaded = false;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};

			var getProjectSuccess = function(response) {
				$scope.showCrmLoading = false;
				console.log(response);
				if(response.returnCode == 'S') {
					$scope.moreDataCanBeLoaded = response.project_list.length == $scope.pageSize;
					$scope.items = $scope.items.concat(response.project_list);
					$scope.sourceItems = $scope.items.clone();
				} else {
					$scope.moreDataCanBeLoaded = false;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};

			var getUnitIdSuccess = function(response) {
				$scope.showCrmLoading = false;
				console.log(response);
				if(response.returnCode == 'S') {
					$scope.moreDataCanBeLoaded = response.unit_list.length == $scope.pageSize;
					$scope.items = $scope.items.concat(response.unit_list);
					$scope.sourceItems = $scope.items.clone();
				} else {
					$scope.moreDataCanBeLoaded = false;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};

			//=====================================================================================

			//根据时间戳刷新页面值列表
			addbidbondService.getValueList(getValueListSuccess, bidbond_value_list);

			//通用选择弹窗
			$scope.selectTargets = [{
				'key': 'business',
				'interface': addbidbondService.getOpportunity, //获得选择项的接口
				'params': [getOpportunitySuccess, $scope.nowPage, $scope.pageSize, $scope.data.customerId], //获得选择项时接口所需参数
				'showKey': 'opportunityName', //选择界面显示的数据
				'dataKey': 'opportunityId', //对象内最终操作提交所需的数据变量
				'dataModel': '$scope.data.opportunityId', //最终操作提交所需的数据变量
				'showDataModel': '$scope.showData.opportunityName', //显示在界面上的ng-model,
				'searchInterface': addbidbondService.searchOpportunity,
				'searchParams': getOpportunitySearchSuccess,
				'needShowMore': true
			}, {
				'key': 'customer',
				'interface': addbidbondService.getCustomers, //获得选择项的接口
				'params': [getCustomerSuccess, $scope.nowPage, $scope.pageSize, 'MY_CUSTOMER'], //获得选择项时接口所需参数
				'dataKey': 'customerId', //对象内最终操作提交所需的数据变量
				'showKey': 'fullName', //选择界面显示的数据
				'dataModel': '$scope.data.customerId', //最终操作提交所需的数据变量
				'showDataModel': '$scope.showData.fullName', //显示在界面上的ng-model
				'searchInterface': addbidbondService.searchCustomer,
				'searchParams': getCustomerSearchSuccess,
				'needShowMore': true
			}, {
				'key': 'company',
				'interface': addbidbondService.getCompany,
				'params': [getCompanySuccess, $scope.nowPage, $scope.pageSize],
				'showKey': 'companyName',
				'dataKey': 'theCompany',
				'dataModel': '$scope.data.companyId',
				'showDataModel': '$scope.showData.companyName'
			}, {
				'key': 'project',
				'interface': addbidbondService.getProject,
				'params': [getProjectSuccess, $scope.nowPage, $scope.pageSize],
				'dataKey': 'projectId',
				'showKey': 'projectName',
				'dataModel': '$scope.data.projectId',
				'showDataModel': '$scope.showData.projectName'
			}, {
				'key': 'unitId',
				'interface': addbidbondService.getUnitId,
				'params': [getUnitIdSuccess, $scope.nowPage, $scope.pageSize],
				'dataKey': 'hrUnitId',
				'showKey': 'hrFullUnitName',
				'dataModel': '$scope.data.unitId',
				'showDataModel': '$scope.showData.hrFullUnitName'
			}, {
				'key': 'currency',
				'interface': showValueInList,
				'params': ['HCRM.CURRENCY'],
				'showKey': 'description',
				'dataKey': 'value',
				'dataModel': '$scope.data.currency',
				'showDataModel': '$scope.showData.currencyName'
			}, {
				'key': 'expectPaymentType',
				'interface': showValueInList,
				'params': ['HCRM.DEPOSIT_PAYMENT'],
				'showKey': 'description',
				'dataKey': 'value',
				'dataModel': '$scope.data.expectPaymentType',
				'showDataModel': '$scope.showData.expectPaymentTypeValue'
			}, {
				'key': 'fromBasicAccount',
				'interface': showValueInList,
				'params': ['HCRM.YES_NO'],
				'showKey': 'description',
				'dataKey': 'value',
				'dataModel': '$scope.data.fromBasicAccount',
				'showDataModel': '$scope.showData.fromBasicAccountValue'
			}];
			
			
			$scope.$watch('data.customerId', function(newValue, oldValue) {
				$scope.nowPage = 1;
				$scope.selectTargets[6].params = [getOpportunitySuccess, $scope.nowPage, $scope.pageSize, newValue];
				if($scope.firstInEdit) {
					$scope.firstInEdit = false;
					return;
				}
				$scope.data.opportunityId = "";
				$scope.showData.opportunityName = "";
			});

			//通用选择框
			$ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
				scope: $scope,
				animation: 'slide-in-right'
			}).then(function(modal) {
				$scope.crmSelectModal = modal;
			});

			$scope.showSelectDiv = function(key) {

				console.log('showSelectDiv key ' + key);

				$scope.searchModel.searchValueKey = '';
				$scope.nowPage = 1;

				if(key == 'product_type' || key == 'business_unit') {
					if($scope.showSelect) {

					} else {
						$scope.addPresalesSelectModal.show();
					}

				} else if(key == 'competitor') {
					if($scope.showSelect) {

					} else {
						$scope.addCompetitorSelectModal.show();
					}
				} else {
					if($scope.showSelect) {} else {
						$scope.crmSelectModal.show();
					}
				}

				if($scope.showSelect) {
					if($scope.crmSelectModal) {
						$scope.crmSelectModal.hide();
						$scope.showCrmLoading = false;
					}
					if($scope.addPresalesSelectModal) {
						$scope.addPresalesSelectModal.hide();
					}
					if($scope.addCompetitorSelectModal) {
						$scope.addCompetitorSelectModal.hide();
					}
				} else {}

				$scope.showSelect = !$scope.showSelect;

				$scope.moreDataCanBeLoaded = false;

				$ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);

				if(!$scope.showSelect) {
					return;
				}

				for(var i = 0; i < $scope.selectTargets.length; i++) {
					if(key == $scope.selectTargets[i].key) {
						$scope.nowSelectTarget = cloneObj($scope.selectTargets[i]);
						break;
					}
				}
				var showKey = $scope.nowSelectTarget['showKey'];
				var dataKey = $scope.nowSelectTarget['dataKey'];
				eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
				$scope.sourceTargetData = cloneObj($scope.nowSelectTarget);

				console.log('showSelectDiv nowSelectTarget ' + angular.toJson($scope.nowSelectTarget));
				if($scope.nowSelectTarget.interface != showValueInList)
					$scope.showCrmLoading = true;
				$scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
			};

			$scope.loadMore = function() {
				console.log('loadMore ...');
				$scope.nowPage++;
				for(var i = 0; i < $scope.nowSelectTarget.params.length; i++) {
					if($scope.nowSelectTarget.params[i] == $scope.nowPage - 1) {
						$scope.nowSelectTarget.params[i] = $scope.nowPage;
						break;
					}
				}
				if($scope.nowSelectTarget['searchInterface'] && $scope.searchModel.searchValueKey != '') {
					$scope.nowSelectTarget.searchInterface.call(null, $scope.nowSelectTarget.searchParams, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize);
				} else
					$scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
			};

			$scope.selectItem = function($index) {
				var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']]; //接口所需数据
				//				if($scope.nowSelectTarget['key'] == 'business') {
				//					for(var i = 0; i < $scope.competitors.length; i++) {
				//						if($scope.competitors[i].oppotunityId == data) {
				//							hmsPopup.showPopup('已添加过该商机！请重新选择');
				//							return;
				//						}
				//					}
				//				}
				var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
				showKey = (showKey == '空') ? "" : showKey;
				var dataModel = $scope.nowSelectTarget['dataModel']; //最终操作提交所需的数据变量
				var showDataModel = $scope.nowSelectTarget['showDataModel']; //显示用的数据变量ng-model
				eval(dataModel + " = data");
				eval(showDataModel + " = showKey");
				
				if($scope.nowSelectTarget['key'] == 'customer') {
					/*   $scope.data.customerId = '';
					 $scope.showData.fullName = '';*/
					console.log($scope.items[$index]);
					$scope.showData.opportunityName = $scope.items[$index].opportunityName;
					$scope.data.opportunityId = $scope.items[$index].opportunityId;
				}
				$scope.showSelectDiv();
			};

			function isContains(str, substr) {
				return new RegExp(substr).test(str);
			}

			Array.prototype.clone = function() {
				return [].concat(this);
			};

			$scope.searchSelectValue = function() {
				$ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
				if($scope.nowSelectTarget['searchInterface']) {
					//需要接口搜索的
					$scope.showCrmLoading = true;
					$scope.moreDataCanBeLoaded = false;
					if($scope.searchModel.searchValueKey == '') {
						$scope.items = [];
						$scope.nowPage = 1;
						$scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
						$scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
					} else {
						$scope.items = [];
						$scope.nowPage = 1;
						$scope.pageSize = 15;
						$scope.nowSelectTarget.searchInterface.call(null, $scope.nowSelectTarget.searchParams, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize);
					}
				} else {
					//本地字段搜索的
					$scope.nowPage = 1;
					$scope.pageSize = 15;
					var notShowNum = 0;
					if($scope.searchModel.searchValueKey == '') {
						$scope.noDataFlag = false;
						$scope.items = $scope.sourceItems.clone();
					} else {
						for(var i = 0; i < $scope.sourceItems.length; i++) {
							if(isContains($scope.sourceItems[i][$scope.nowSelectTarget['showKey']], $scope.searchModel.searchValueKey))
								$scope.items[i] = $scope.sourceItems[i];
							else {
								$scope.items[i] = '';
								notShowNum++;
							}
						}
						$scope.noDataFlag = notShowNum == $scope.sourceItems.length;
					}
				}
			};

			$scope.clearSelectFilter = function() {
				$scope.searchModel.searchValueKey = '';
				$scope.searchSelectValue();
			};

			//校验名称
			$scope.validNameFlag = true;
			var validNameSuccess = function(response) {
				$scope.validNameFlag = response.returnFlag;
				if(!$scope.validNameFlag)
					hmsPopup.showPopup('商机名称重复！请重新输入');
			};

			$scope.validName = function() {
				if($scope.editFlag && $scope.nameBeforeEdit == $scope.data.fullName) {
					$scope.validNameFlag = true;
					return;
				}
				addbidbondService.validName(validNameSuccess, $scope.data.fullName);
			};

		}
	]);

//============================================================================================

angular.module('bidbondModule')
	.service('addbidbondService', ['hmsHttp',
		'hmsPopup',
		'baseConfig',
		function(hmsHttp,
			hmsPopup,
			baseConfig) {

			var baseUrl = baseConfig.basePath;

			//	新增保证金
			this.SaveBidbonds = function(success, data) {

				var params = data;

				console.log(JSON.stringify(params));

				hmsHttp.post(baseUrl + 'add_bidbond', params).success(function(result) {
					console.log(result);
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});
			};
			
			//	编辑保证金
			this.EditBidbonds = function(success, data) {

				var params = data;

				console.log(JSON.stringify(params));

				hmsHttp.post(baseUrl + 'save_bidbond', params).success(function(result) {
					console.log(result);
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});
			};


			//获取商机
			this.getOpportunity = function(success, page, pageSize, customerId) {
				var params = {
		          page: page,
		          pageSize: pageSize,
		          customerId: customerId
				};
				hmsHttp.post(baseUrl + 'query_opportunity_list', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});
			};

			//搜索商机
			this.searchOpportunity = function(success, keyWord, page, pageSize) {
				var params = {
					keyWord: keyWord,
					page: page,
					pageSize: pageSize,
					customerId: ""
				};
				hmsHttp.post(baseUrl + 'search_opportunity', params).success(function(result) {
					hmsPopup.hideLoading();
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});
			}

			//获取客户
			this.getCustomers = function(success, page, pageSize, queryType) {
				var params = {
					page: page,
					pageSize: pageSize,
					queryType: queryType
				};
				hmsHttp.post(baseUrl + 'query_customer_list', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};

			//搜索客户
			this.searchCustomer = function(success, keyWord, page, pageSize) {
				var params = {
					keyWord: keyWord,
					page: page,
					pageSize: pageSize
				};
				hmsHttp.post(baseUrl + 'select_customers', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};

			//获取费用所属公司（公司属性）
			this.getCompany = function(success, page, pageSize) {
				var params = {
					"page": 1,
					"pageSize": 10,
					"keyWord": ""
				};
				hmsHttp.post(baseUrl + 'inside_company', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};

			//获取费用所属项目
			this.getProject = function(success, page, pageSize, queryType) {
				var params = {
					"page": 1,
					"pageSize": 10,
					"keyWord": ""
				};
				hmsHttp.post(baseUrl + 'query_projects', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};

			//获取费用所属部门
			this.getUnitId = function(success, keyWord, page, pageSize) {
				var params = {
					"page": 1,
					"pageSize": 10,
					"keyWord": ""
				};
				hmsHttp.post(baseUrl + 'query_units', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};

			//得到值列表
			this.getValueList = function(success, list) {
				var params = {
					lookupList: []
				};
				for(var i = 0; i < list.length; i++) {
					if(!window.localStorage[list[i].lastUpdateDate])
						window.localStorage[list[i].lastUpdateDate] = "";
					params.lookupList.push({
						code: list[i].code,
						lastUpdateDate: window.localStorage[list[i].lastUpdateDate]
					})
				}
				console.log(JSON.stringify(params));
				hmsHttp.post(baseUrl + 'query_lookup', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};

			//校验商机名称
			this.validName = function(success, fullName) {
				var params = {
					fullName: fullName
				};
				hmsHttp.post(baseUrl + 'opportunity_valid_name', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};
			this.validbidbond = function(success, id) {
				var params = {
					opportunityId: id
				};
				hmsHttp.post(baseUrl + 'valid_bidbond', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};
			this.bidbondSubmit = function(success, params) {
				hmsHttp.post(baseUrl + 'bidbond_submit', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
				});
			};

		}
	]);