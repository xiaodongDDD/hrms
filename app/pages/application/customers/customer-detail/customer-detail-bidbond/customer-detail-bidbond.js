/**
 * Created by leiyu on 2016/12/28.
 */
'use strict';
angular.module('customerModule')
	.controller('CustomerDetailBidbondCtrl', [
		'$scope',
		'$state',
		'hmsPopup',
		'$timeout',
		'customerBidbondService',
		'$ionicScrollDelegate',
		function($scope,
			$state,
			hmsPopup,
			$timeout,
			customerBidbondService,
			$ionicScrollDelegate) {

			$scope.page = 1;
			$scope.pageSize = 10;
			$scope.customerId = window.localStorage.customerId;

			$scope.showLoading = true;

		      var initBidbondSuccess = function(response){
		        $scope.showLoading = false;
		        $scope.$broadcast('scroll.refreshComplete');
		        $scope.bidbond = [];
		        if(response.returnCode == "S"){
		          $scope.bidbond = response.bidbond;
		          var length = response.bidbond.length;
		          $scope.moreOpportunityCanBeLoaded = length == $scope.pageSize
		        } else {
//		          hmsPopup.showPopup(response.returnMsg);
		        }
		      };			

			$scope.goEditBidbond = function(result) {
				$state.go("tab.bidbond-add", {
					param: result
				});
				hmsPopup.showLoading();
			}

			customerBidbondService.getBidbond(initBidbondSuccess, {
				page: $scope.page,
				pageSize: $scope.pageSize,
				customerId: $scope.customerId
			});

			$scope.doRefresh = function() {
				$scope.page = 1;
				$scope.pageSize = 10;
				$scope.showLoading = true;
				customerBidbondService.getBidbond(initBidbondSuccess, {
					page: $scope.page,
					pageSize: $scope.pageSize,
					customerId: $scope.customerId
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
//					hmsPopup.showPopup(response.returnMsg);
				}
			};

			$scope.loadMoreBidbond = function() {
				$scope.page++;
				customerBidbondService.getBidbond(getMoreBidbondSuccess, {
					page: $scope.page,
					pageSize: $scope.pageSize,
					customerId: $scope.customerId
				});
			};

			$scope.$on('REFRESH_BIDBOND', function() {
				$scope.doRefresh();
			});

		}
	]);

angular.module('customerModule')
	.service('customerBidbondService', ['hmsHttp',
		'hmsPopup',
		'baseConfig',
		'$http',
		function(hmsHttp,
			hmsPopup,
			baseConfig,
			$http) {

			var baseUrl = baseConfig.basePath;

			this.getBidbond = function(success, key) {
				hmsHttp.post(baseUrl + 'customer_bidbond', key).success(function(result) {
					success(result);
				}).error(function(response, status) {
//					hmsPopup.showPopup(response);
					hmsPopup.hideLoading();
				});

			};

		}
	]);