/**
 * Created by leiyu on 2016/12/13.
 */
'use strict';
angular.module('bidbondModule')
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('tab.bidbond', {
					url: '/bidbond',
					params: {
						param: {}
					},
					/*  cache:false,*/
					views: {
						'tab-application': {
							prefetchTemplate: false,
							templateUrl: 'build/pages/application/bidbond/bidbond.html',
							controller: 'bidbondCtrl'
						}
					}
				})
		}
	]);

angular.module('bidbondModule')
	.controller('bidbondCtrl', ['$scope',
		'$ionicHistory',
		'bidbondListService',
		'hmsPopup',
		'$state',
		'addLinkmanService',
		'$ionicModal',
		'opportunityAddService',
		'addbidbondService',
		'$ionicScrollDelegate',
		'$rootScope',
		'$stateParams',
		'bidbondEditService',

		function($scope,
			$ionicHistory,
			bidbondListService,
			hmsPopup,
			$state,
			addLinkmanService,
			$ionicModal,
			opportunityAddService,
			addbidbondService,
			$ionicScrollDelegate,
			$rootScope,
			$stateParams,
			bidbondEditService) {
			$scope.showContent = false;
			$scope.showShift = false;
			$scope.showHead = true;
			$scope.showData = {
				fullName: "",
				currencyName: "",
				workflowStatusName: "",
				customerName: "",
				applicationId: ""
			};

			$scope.data = {
				dataStatus: "",
				currency: "",
				page: 1,
				pageSize: "10",
				fullName: "",
				shortName: "",
				workflowStatus: "",
				applicationId: ""
			};

			$scope.items = [];

			$scope.onDrag = function($event) {
				var deltaY = $event.gesture.deltaY;
				$scope.showHead = deltaY > 0;
			};

			$scope.showShiftDiv = function() {
				console.log("打开搜索框");
				$scope.showShift = !$scope.showShift;
			};

			$scope.goBack = function() {
				if($ionicHistory.viewHistory().backView) {
					$ionicHistory.goBack();

				} else {
					$state.go('tab.application');
				}
			};

			$rootScope.$on("REFRESH_ADD_BIDBOND", function() {
				$scope.doRefresh();
			});

			//			$rootScope.$on("REFRESH_BIDBOND_ADD", function() {
			//				$scope.doRefresh();
			//			});

			//			$scope.$on('$ionicView.beforeEnter', function(e) {
			//					$scope.doRefresh();
			//			})

			//=====================================新增保证金（开始）===================================

			var getMoreDataFailure = function() {
				$scope.moreOpportunityCanBeLoaded = false;
			};

			var initBidbondSuccess = function(response) {
				$scope.showLoading = false;
				$scope.bidbond = [];
				$ionicScrollDelegate.$getByHandle('bidbondScroll').scrollTop(false);
				if(response.returnCode == "S") {
					$scope.bidbond = response.bidbond_list;
					$timeout(function() {
						$scope.moreOpportunityCanBeLoaded = response.bidbond_list.length == $scope.siftingKey.pageSize;
					}, 500)
				} else {
					hmsPopup.showPopup(response.returnMsg);
				}
			};

			$ionicModal.fromTemplateUrl('build/pages/application/bidbond/bidbond-add/bidbond-add.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.addbidbondModel = modal;
			});

			$scope.$on('CLOSE_BIDBOND_ADD', function() {
				$scope.addbidbondModel.hide();
			});

			$scope.$on('BIDBOND_ADD_SUCCESS', function() {
				$scope.addbidbondModel.hide();
				$ionicScrollDelegate.$getByHandle('bidbondScroll').scrollTop(false);

				$scope.bidond = [];
				$scope.siftingKey = {
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
					applicationBy: "25835",
					applicationDate: getToday(),
					attachments: [],
					unitId: "",
					companyId: "",
					workflowStatus: "0"
				};
				$scope.siftingShowData = {
					applicationDate: getToday(),
					fullName: "",
					paymentAmount: "",
					workflowStatusName: '新建',

				};
				$scope.lastSelectSortIndex = -1;
				$scope.showHead = true;
				bidbondListService.getbidbondList(initBidbondSuccess, $scope.siftingKey, getMoreDataFailure);
			});

			$scope.showaddBidbond = function() {
				$ionicScrollDelegate.$getByHandle('slide-img').scrollTop(false);
				$scope.addbidbondModel.show();
			};

			//======================================新增保证金（结束）======================================

			Array.prototype.clone = function() {
				return [].concat(this);
			};

			Array.prototype.remove = function(index) {
				this.splice(index, 1);
			};
			console.log($stateParams.param);
			$scope.bondId = $stateParams.param.bondId;
			$scope.bidbondDetail = {};

			//======================================编辑保证金（开始）======================================

			$scope.goEditBidbond = function(result) {
				$state.go("tab.bidbond-add", {
					param: result
				});
				//				hmsPopup.showLoading();
			};

			function getBidbondSuccess(response) {
				hmsPopup.hideLoading();
				if(response.returnCode == "S") {
					$scope.bidbondDetail = response.bidbond_detail;

					$scope.updateData = {

						"bondId": $scope.bidbondDetail.bondId,
						"customerId": $scope.bidbondDetail.customerId,
						"opportunityId": $scope.bidbondDetail.opportunityId,
						"applicationBy": $scope.bidbondDetail.applicationBy,
						"fullName": $scope.bidbondDetail.fullName,
						"applicationDate": $scope.bidbondDetail.applicationDate,
						"currency": $scope.bidbondDetail.currency,
						"transferEndDate": $scope.bidbondDetail.transferEndDate,
						"latestPaymentDate": $scope.bidbondDetail.latestPaymentDate,
						"expectRetrieveDate": $scope.bidbondDetail.expectRetrieveDate,
						"retrieveCondition": $scope.bidbondDetail.retrieveCondition,
						"name": $scope.bidbondDetail.name,
						"paymentAmount": $scope.bidbondDetail.paymentAmount,
						"paymentContent": $scope.bidbondDetail.paymentContent,
						"langCode": $scope.bidbondDetail.langCode,
						"currencyName": $scope.bidbondDetail.currencyName,
						"workflowStatus": $scope.bidbondDetail.workflowStatus,
						"workflowStatusName": $scope.bidbondDetail.workflowStatusName,
						"occurredDate": $scope.bidbondDetail.occurredDate

					};
				}
			}

			/*	bidbondEditService.getBidbondDetail(getBidbondSuccess, $scope.bondId);*/

			$rootScope.$on("REFRESH_BIDBOND_ADD", function() {
				bidbondEditService.getBidbondDetail(getBidbondSuccess, $scope.bondId);
			});

			//=========================================编辑保证金（结束）==========================================

			$scope.goSearch = function() {
				$state.go('tab.bidbond-search');
			};

			$scope.goState = function() {
				$state.go('tab.bidbond-add');
			};

			$scope.Global = "HCRM_GLOBAL";

			$scope.bidbond = []; //保证金列表

			var getListSuccessInit = function(result) {
				$scope.showContent = true;
				if(result.returnCode == "S") {
					$scope.moreDataCanBeLoaded = true;
					$scope.bidbond = result.bidbond_list;
					if(result.bidbond_list.length <= 0) {
						$scope.moreDataCanBeLoaded = false;
					}
				} else {}
			};
			var error = function(response) {};
			bidbondListService.getbidbondList(getListSuccessInit, error, $scope.data);

			var getListSuccessInitConcat = function(result) {
				$scope.showContent = true;
				if(result.returnCode == "S") {
					$scope.bidbond = result.bidbond_list;
				}
				$scope.$broadcast('scroll.refreshComplete');
			};

			$scope.doRefresh = function() {
				$scope.data.page = 1;
				$scope.moreDataCanBeLoaded = true;
				var error = function(response) {};
				bidbondListService.getbidbondList(getListSuccessInitConcat, error, $scope.data);
				$scope.$broadcast('scroll.refreshComplete');
			};
			//			$rootScope.$on("REFRESH_BIDBOND_ADD", function() {
			//				$scope.doRefresh();
			//			});
			$scope.moreDataCanBeLoaded = true;
			var getMoreListSuccessInitConcat = function(result) {
				if(result.returnCode == "S") {
					$scope.bidbond = $scope.bidbond.concat(result.bidbond_list);
					if(result.bidbond_list.length == 0) {
						console.log("没有数据了" + $scope.moreDataCanBeLoaded);
						$scope.moreDataCanBeLoaded = false;
					}
				} else {
					$scope.moreDataCanBeLoaded = false;
					hmsPopup.showPopup(result.returnMsg);
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			};
			$scope.loadMore = function() {
				console.log("上拉加载" + $scope.moreDataCanBeLoaded);
				$scope.data.page++;
				var error = function(response) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
				};
				bidbondListService.getbidbondList(getMoreListSuccessInitConcat, error, $scope.data);
				//$ionicScrollDelegate.$getByHandle("slideimgs").resize();
			};

			//设置值列表
			var upData = [{
				code: "HCRM.CURRENCY",
				lastUpdateDate: "CURRENCY_DATE",
				localList: 'CURRENCY'
			}, {
				code: "HCRM.BIDBOND_WLFSTATUS",
				lastUpdateDate: "BIDBOND_WLFSTATUS_DATE",
				localList: 'BIDBOND_WLFSTATUS'
			}];

			//克隆对象
			function cloneObj(obj) {
				function Clone() {}

				Clone.prototype = obj;
				var o = new Clone();
				for(var a in o) {
					if(typeof o[a] == "object") {
						o[a] = cloneObj(o[a]);
					}
				}
				return o;
			}

			var getValueObjByCode = function(code) {
				console.log(code);
				for(var i = 0; i < upData.length; i++) {
					if(code == upData[i].code)
						return cloneObj(upData[i]);
				}
			};

			var listInitSuccess = function(response) {
				hmsPopup.hideLoading();
				if(response.returnCode == 'S') {
					console.log(response);
					for(var i = 0; i < response.lookup_detail.length; i++) {
						var code = response.lookup_detail[i].lookup_code;
						var lastUpdateDate = response.lookup_detail[i].last_update_date;
						var valueObj = getValueObjByCode(code);
						if(lastUpdateDate != window.localStorage[valueObj.lastUpdateDate]) {
							window.localStorage[valueObj.lastUpdateDate] = lastUpdateDate;
							window.localStorage[valueObj.localList] = JSON.stringify(response.lookup_detail[i].lookup_value_list);
						}
					}
				};
			};

			/*  console.log(upData);*/
			addbidbondService.getValueList(listInitSuccess, upData);
			var showValueInList = function(code) {
				var valueObj = getValueObjByCode(code);
				$scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
				$scope.sourceItems = $scope.items.clone();
			};
			//通用选择弹窗
			$scope.selectTargets = [{
				'key': 'currency',
				'interface': showValueInList,
				'params': ['HCRM.CURRENCY'],
				'showKey': 'description',
				'dataKey': 'value',
				'dataModel': '$scope.data.currency',
				'showDataModel': '$scope.showData.currencyName'
			}, {
				'key': 'status',
				'interface': showValueInList,
				'params': ['HCRM.BIDBOND_WLFSTATUS'],
				'showKey': 'description',
				'dataKey': 'value',
				'dataModel': '$scope.data.workflowStatus',
				'showDataModel': '$scope.showData.workflowStatusName'
			}];

			function isContains(str, substr) {
				return new RegExp(substr).test(str);
			}

			Array.prototype.clone = function() {
				return [].concat(this);
			};
			$scope.searchModel = {
				searchValueKey: ""
			};
			$scope.sourceItems = [];
			$scope.noDataFlag = false;
			$scope.clearSelectFilter = function() {
				console.log("clear");
				$scope.searchModel.searchValueKey = '';
				$scope.searchSelectValue();
				$ionicScrollDelegate.scrollTop();
				/* $scope.items = $scope.data.clone();*/
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
			$ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
				scope: $scope,
				animation: 'slide-in-right'
			}).then(function(modal1) {
				$scope.crmSelectModal = modal1;
			});
			$scope.showSelect = false;
			$scope.showSelectDiv = function(key) {
				$scope.searchModel.searchValueKey = '';
				$scope.nowPage = 1;
				//打开模态框
				if($scope.showSelect) {
					console.log("隐藏");
					$scope.crmSelectModal.hide();
				} else {
					console.log("打开");
					$scope.crmSelectModal.show();
				}
				$scope.showSelect = !$scope.showSelect;
				if(!$scope.showSelect)
					return;
				if(!$scope.showSelect) {
					$scope.items = [];
					return 0;
				}
				$ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
				for(var i = 0; i < $scope.selectTargets.length; i++) {
					if(key == $scope.selectTargets[i].key) {
						$scope.nowSelectTarget = cloneObj($scope.selectTargets[i]);
						break;
					}
				}
				if($scope.showSelect) {
					var showKey = $scope.nowSelectTarget['showKey'];
					var dataKey = $scope.nowSelectTarget['dataKey'];
					eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
				}
				console.log($scope.nowSelectTarget.params);
				$scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
				$scope.showLoading = true;
				$scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
			};
			$scope.selectItem = function($index) {
				var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']]; //接口所需数据
				var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
				showKey = (showKey == '空') ? "" : showKey;
				var dataModel = $scope.nowSelectTarget['dataModel']; //最终操作提交所需的数据变量
				var showDataModel = $scope.nowSelectTarget['showDataModel']; //显示用的数据变量ng-model
				eval(dataModel + " = data");
				eval(showDataModel + " = showKey");
				$scope.showSelectDiv();
			};
			$scope.clearSifting = function() {
				$scope.showData = {
					statusName: "",
					currencyName: ""
				};
				$scope.data = {
					dataStatus: "",
					currency: "",
					page: 1,
					pageSize: "10",
					fullName: "",
					shortName: ""
				};
			};
			$scope.sifting = function() {
				$scope.showContent = false;
				$scope.data.page = 1;
				$scope.showShift = !$scope.showShift;
				var error = function(response) {};
				$ionicScrollDelegate.scrollTop();
				bidbondListService.getbidbondList(getListSuccessInit, error, $scope.data);
			};

		}
	]).service('bidbondListService', ['hmsHttp',
		'hmsPopup',
		'baseConfig',
		function(hmsHttp,
			hmsPopup,
			baseConfig) {
			var baseUrl = baseConfig.basePath;
			//查询商机列表
			this.getbidbondList = function(success, error, params) {
				hmsHttp.post(baseUrl + 'bidbond_list', params).success(function(result) {

					success(result);
				}).error(function(response, status) {
					error(response);
					//					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});
			};

		}
	]);

angular.module('bidbondModule')
	.service('bidbondEditService', [
		'hmsHttp',
		'hmsPopup',
		'baseConfig',
		'$http',
		function(hmsHttp,
			hmsPopup,
			baseConfig,
			$http) {

			var baseUrl = baseConfig.basePath;

			this.getBidbondDetail = function(success, id) {
				var params = {
					bondId: id
				};
				console.log(params);
				hmsHttp.post(baseUrl + 'bidbond_detail', params).success(function(result) {
					success(result);
				}).error(function(response, status) {
					//					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});

			};

		}
	]);