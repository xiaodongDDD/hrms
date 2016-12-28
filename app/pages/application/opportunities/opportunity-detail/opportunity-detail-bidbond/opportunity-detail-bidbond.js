/**
 * Created by leiyu on 2016/12/28.
 */
'use strict';
angular.module('opportunityModule')
	.controller('OpportunityDetailBidbondCtrl', [
		'$scope',
		'$state',
		'hmsPopup',
		'$timeout',
		'opportunityBidbondService',
		'$ionicScrollDelegate',
		function($scope,
			$state,
			hmsPopup,
			$timeout,
			opportunityBidbondService,
			$ionicScrollDelegate) {

			$scope.page = 1;
			$scope.pageSize = 10;
			$scope.opportunityId = window.localStorage.opportunityId;

			$scope.showLoading = true;

			var initBidbondSuccess = function(response) {
				$scope.showLoading = false;
				$scope.$broadcast('scroll.refreshComplete');
				$scope.bidbond = [];
				if(response.returnCode == "S") {
					$scope.bidbond = response.bidbond;
					var length = response.bidbond.length;
					$scope.moreOpportunityCanBeLoaded = length == $scope.pageSize
				} else {
					hmsPopup.showPopup(response.returnMsg);
				}
			};

			$scope.goEditBidbond = function(result) {
				$state.go("tab.bidbond-add", {
					param: result
				});
			}

			opportunityBidbondService.getBidbond(initBidbondSuccess, {
				page: $scope.page,
				pageSize: $scope.pageSize,
				opportunityId: $scope.opportunityId
			});

			$scope.doRefresh = function() {
				$scope.page = 1;
				$scope.pageSize = 10;
				$scope.showLoading = true;
				opportunityBidbondService.getBidbond(initBidbondSuccess, {
					page: $scope.page,
					pageSize: $scope.pageSize,
					opportunityId: $scope.opportunityId
				});
			};

			$scope.moreDataCanBeLoaded = false;

			var getMoreBidbondSuccess = function(response) {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(response.returnCode == "S") {
					$scope.bidbond = $scope.bidbond.concat(response.bidbond);
					var length = response.bidbond.length;
					$scope.moreDataCanBeLoaded = length == $scope.pageSize;
				} else {
					hmsPopup.showPopup(response.returnMsg);
				}
			};

			$scope.loadMoreOpportunity = function() {
				$scope.page++;
				opportunityBidbondService.getBidbond(getMoreBidbondSuccess, {
					page: $scope.page,
					pageSize: $scope.pageSize,
					opportunityId: $scope.opportunityId
				});
			};

			$scope.$on('REFRESH_OPPORTUNITY', function() {
				$scope.doRefresh();
			});

		}
	]);

angular.module('opportunityModule')
	.service('opportunityBidbondService', ['hmsHttp',
		'hmsPopup',
		'baseConfig',
		'$http',
		function(hmsHttp,
			hmsPopup,
			baseConfig,
			$http) {

			var baseUrl = baseConfig.basePath;

			this.getBidbond = function(success, key) {
				hmsHttp.post(baseUrl + 'opportunity_bidbond', key).success(function(result) {
					success(result);
				}).error(function(response, status) {
					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});

			};

		}
	]);