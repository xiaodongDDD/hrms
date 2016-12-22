angular.module('serviceModule')
  //竞争对手
  .service('competitorListService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {
      var baseUrl = baseConfig.basePath;
      console.log(baseUrl);
      //查询竞争对手列表
      this.getCompetitorList = function (success, error, params) {
        hmsHttp.post(baseUrl + 'query_competitor_list', params).success(function (result) {

          success(result);
        }).error(function (response, status) {
          error(response);
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };
      //得到值列表
      this.getValueList = function(success, list) {
        var params = {lookupList : []};
        for(var i = 0; i < list.length; i++){
          params.lookupList.push({
            code : list[i].code,
            lastUpdateDate: window.localStorage[list[i].lastUpdateDate]
          })
        }
        hmsHttp.post(baseUrl + 'query_lookup', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };
    }])
.service('CompetitorSearchService', ['hmsHttp',
  'hmsPopup',
  'baseConfig', function (hmsHttp, hmsPopup, baseConfig) {
    console.log(baseConfig.basePath);
    var baseUrl = baseConfig.basePath;
    console.log(baseUrl);
    this.getSearchData = function (success, key) {
      hmsHttp.post(baseUrl + 'search_competitor', key).success(function (result) {
        hmsPopup.hideLoading();
        success(result);
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        hmsPopup.showPopup(response.error_description);
      });
    }
  }])
.service('competitorDetailService', ['hmsHttp',
  'hmsPopup',
  'baseConfig',
  '$http',
  function(hmsHttp,
           hmsPopup,
           baseConfig,
           $http) {

    var baseUrl = baseConfig.basePath;

    this.getCompetitorDetail = function(success, id) {
      var params = {
        competitorId : id
      };
      console.log(params);
      hmsHttp.post(baseUrl + 'query_competitor_detail', params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
        hmsPopup.hideLoading();
      });

    };

    this.updateCompetitorDetail = function(success, params) {
      hmsHttp.post(baseUrl + 'competitor_update', params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
        hmsPopup.hideLoading();
      });

    };

    this.deleteProduct = function(success, params) {
      hmsHttp.post(baseUrl + 'delete_product', params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
        hmsPopup.hideLoading();
      });

    };

  }
])
  //联系人
  .service('customerLinkman', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;
      this.getCustomer = function (success, key) {
        hmsHttp.post(baseUrl + 'parent_customer', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('网络连接错误');
        });
      };
      this.getSearchResult = function (success, key) {
        hmsHttp.post(baseUrl + 'query_contacts', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('网络连接错误');
        });
      };
      this.getGetContactsList = function (success, key) {
        hmsHttp.post(baseUrl + 'customer_contact_list', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('网络连接错误');
        });
      };
    }]);
angular.module('contactModule')
  .service('addLinkmanService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;
      this.getCustomer = function (success, key) {
        hmsHttp.post(baseUrl + 'parent_customer', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('网络连接错误');
        });
      };
      this.addContact = function (success, key) {
        hmsHttp.post(baseUrl + 'add_contact', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('网络连接错误');
        });

      };
      //得到值列表
      this.getValueList = function (success, code, lastUpdateDate) {
        var params = {
          "lookupList": [{
            code: code,
            lastUpdateDate: lastUpdateDate
          }]
        };
        hmsHttp.post(baseUrl + 'query_lookup', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('网络连接错误');
          hmsPopup.hideLoading();
        });
      };

      //得到客户列表
      this.getCustomers = function (success, page, pageSize) {
        var params = {
          page: page,
          pageSize: pageSize,
          queryType: 'MY_CUSTOMER'
        };
        hmsHttp.post(baseUrl + 'query_customer_list', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup('网络连接错误');
          hmsPopup.hideLoading();
        });
      };
      this.searchCustomer = function (success, keyWord, page, pageSize) {
        var params = {
          keyWord: keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'saleplan_customers', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
        });
      };
    }
  ]);
