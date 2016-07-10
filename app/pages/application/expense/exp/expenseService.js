/**
 * Created by huchaoliang on 15/5/6.
 */

/*报销服务*/
angular.module("applicationModule")
.factory('expenseApply', function ($http, $q, $window, $ionicLoading, baseConfig,hmsHttp) {

  // 上传附件
  function doPostHttp(form, deferred) {
    //showMessage("doPostHttp");
    hmsHttp.post(baseConfig.basePath + 'EXP/EXP5010/exp_upload_line_photos.svc', form, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
      .success(function (response) {
        //showMessage("上传成功");

        deferred.resolve(response);
      })
      .error(function (err) {
        showMessage("上传失败");

        deferred.reject(err);
      });
  }

  function createBlob(data, type) {
    var r;
    try {
      r = new $window.Blob([data], {type: type});
    }
    catch (e) {
      // TypeError old chrome and FF
      $window.BlobBuilder = $window.BlobBuilder ||
        $window.WebKitBlobBuilder ||
        $window.MozBlobBuilder ||
        $window.MSBlobBuilder;
      // consider to use crosswalk for android

      if (e.name === 'TypeError' && window.BlobBuilder) {
        var bb = new BlobBuilder();
        bb.append([data.buffer]);
        r = bb.getBlob(type);
      }
      else if (e.name == "InvalidStateError") {
        // InvalidStateError (tested on FF13 WinXP)
        r = new $window.Blob([data.buffer], {type: type});
      }
      else {
        throw e;
      }
    }
    return r;
  }

  var service = {

    data: {},
    dataBuffer: {},
    canEdit: '',
    tempLine: {},
    tempAttachment: {},
    projectList: [],
    selectedLineId: [],
    currentQueryType: "",
    canEditObjectType: true,
    canSelectProject: "",
    canUpload: '',
    photoData: {},
    currentQueryTypeDesc: '',
    sourceFrom: '',
    ListItem: {},
    canSubmit: '',
    expenseObject_id: '',
    queryDetail: function (expHeaderId) {
      //请求服务器，查询操作
      var deferred = $q.defer();
      console.log(1122);
      var Item = [];
      var Url = baseConfig.businessPath + "/expense_account/fetch_expense_detail";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '"}}';
      hmsHttp.post(Url, PostData).success(function (response) {
        //console.log("返回数据：" + angular.toJson(response));
        deferred.resolve(response);

      }).error(function (err) {

        deferred.reject(err);
      });
      return deferred.promise;
    },
    // 查询tab列表
    queryTabList: function (queryType) {

      var deferred = $q.defer();
      var expStatues
      if (queryType == 'toSubmit') {
        expStatues = 'SAVE';
      }
      else if (queryType == 'submitted') {
        expStatues = 'SUBMIT';
      }
      var Url = baseConfig.businessPath + "/expense_account/fetch_expense_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_expense_type":"' + expStatues
        + '","p_page_num":"' + "1" + '"}}';

      hmsHttp.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(err);
      });
      return deferred.promise;
    },

    getDataFromTravel: function (travelDataPara) {
      if (travelDataPara != undefined) {
        this.canEditObjectType = false;
        this.data.travelApplicationNumber = travelDataPara.travelNo;
        this.data.objectType = travelDataPara.objectType;
        this.data.expenseObject = travelDataPara.expenseObject;
        this.data.expenseObjectName = travelDataPara.expenseObjectName;
      } else {
        //showMessage("没有差旅申请�?)
      }
      return this.data;

    },

    insert: function (detailData) {
      //请求数据库服务器
      /* console.log("response:" +  "进入");
       console.log(angular.toJson(this.data));*/
      console.log(detailData);
      console.log("lineId=" + detailData.lines[0].lineId);
      console.log("detailData.lines.length=" + detailData.lines.length);
      var linesId
      if (detailData.lines.length == 1)
        linesId = detailData.lines[0].lineId;
      else if (detailData.lines.length > 1) {
        linesId = detailData.lines[0].lineId + "#";
        for (var i = 1; i < detailData.lines.length; i++) {
          linesId = linesId + detailData.lines[i].lineId;
          if (i != detailData.lines.length - 1)
            linesId = linesId + "#";
        }
      }
      console.log(linesId);
      var deferred = $q.defer();
      var Url = baseConfig.businessPath + "/expense_account/create_expense";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + "" + '","p_description":"'
        + detailData.description + '","p_line":"' + linesId + '"}}';

      hmsHttp.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(err);
      });
      return deferred.promise;
    },

    remove: function (expHeaderId) {
      var dataPara = {
        expHeaderId: expHeaderId
      };
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseConfig.basePath + "EXP/EXP5010/app_reimbursement_delete.svc",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {

          return 'para=' + JSON.stringify(data);
        },
        data: dataPara
      })
        .success(function (response) {
          console.log("response:" + "成功返回" + angular.toJson(response));
          deferred.resolve(response);
        })
        .error(function (err) {
          console.log("失败返回:" + angular.toJson(err));
          deferred.reject(err);
        });
      return deferred.promise;
    },

    submit: function (expHeaderIdToSubmit) {
      //请求数据库服务器，进行存储操�?
      console.log("response:" + "进入");

      console.log(angular.toJson(this.data));
      this.data.userId = window.localStorage.empno;
      var datatemp = {
        userId: window.localStorage.empno,
        expHeaderId: expHeaderIdToSubmit
      };

      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseConfig.basePath + 'EXP/EXP5010/exp_reimbursement_hd_submit.svc',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {
          return 'para=' + JSON.stringify(data);
        },
        data: datatemp
      })
        .success(function (response) {
          //login
          console.log("response:" + "成功返回");
          console.log("response:" + angular.toJson(response));
          deferred.resolve(response);
        }).error(function (response, status) {
          // login
          console.log("response:" + "失败返回");
          console.log("response:" + response + ",status:" + status);
          deferred.reject(response);
        });
      return deferred.promise;
    },

    initDataForAddAttachment: function () {
      this.photoData = {
        photos: []
      }
    },

    initData: function () {
      this.data = {
        userId: window.localStorage.empno,
        companyId: baseConfig.companyId,
        lines: []
      };
    },

    addData: function (record) {
      this.data.push(record);
    },
    uploadData: function (form, photos) {    // 以formdatade 形式上传文件
      console.log("进入");

      showMessage("photos.length" + photos.length);

      var deferred = $q.defer();
      //showMessage("photos.length" +photos.length);
      //deferred.reject("error");
      if (photos.length > 0) {

        var count = 0;
        for (var i = 0; i < photos.length; i++) {
          //这里是异步调用cordova 的文件操作，给form 增加
          window.resolveLocalFileSystemURL(photos[i].photo_src, function (fileEntry) {
            fileEntry.file(function (file) {
              var reader = new FileReader();
              reader.onloadend = function (fileReadResult) {
                var data = new Uint8Array(fileReadResult.target.result);
                var blob = createBlob(data, "image/jpeg");
                form.append(file.name, blob, file.name);
                count++;
                if (count == photos.length) {
                  doPostHttp(form, deferred);
                }
              };
              reader.onerror = function (fileReadResult) {
                //如果失败也算完成的话，这里也加上就行
                //count ++
                //if(count == photos.length()){
                //doPostHttp(form);
                //}
              };
              reader.readAsArrayBuffer(file);
            });
          });
        }
      } else {

        //  showMessage("上传无照�?);

        doPostHttp(form, deferred);
      }

      return deferred.promise;
    },
    update: function (detailData) {
      //请求数据库服务器，进行存储操作
      /*  var length=detailData.lines.length;
       var linesId=detailData.lines[length-1].lineId;
       */
      console.log(detailData.lines);
      var linesId;
      // console.log(detailData.lines[0].lineId)
      /*   if(detailData.lines.length==1)
       linesId=detailData.lines[0].lineId;
       else if(detailData.lines.length>1){*/
      // linesId=detailData.lines[0].lineId+"#";
      if (detailData.lines.length == 1)
        linesId = detailData.lines[0].lineId;
      else if (detailData.lines.length > 1) {
        linesId = detailData.lines[0].lineId + "#";
        for (var i = 1; i < detailData.lines.length; i++) {
          linesId = linesId + detailData.lines[i].lineId;
          if (i != detailData.lines.length - 1)
            linesId = linesId + "#";
        }
      }
      console.log(linesId);

      var deferred = $q.defer();
      var Url = baseConfig.businessPath + "/expense_account/create_expense";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + detailData.expHeaderId
        + '","p_description":"' + detailData.description + '","p_line":"' + linesId + '"}}';
      hmsHttp.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    // 删除报销行信息
    removeLine: function (expLineId) {
      console.log('expLineId' + expLineId);
      var dataPara = {
        expLineId: expLineId
      };
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseConfig.basePath + 'EXP/EXP5010/app_reimbursement_ln_delete.svc',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {
          return 'para=' + JSON.stringify(data);
        },
        data: dataPara
      })
        .success(function (response) {
          console.log("response:" + "成功返回" + angular.toJson(response));
          deferred.resolve(response);
        })
        .error(function (err) {
          console.log("失败返回:" + angular.toJson(err));
          deferred.reject(err);
        });

      return deferred.promise;
    },


    dateFmtForSave: function () {
      // 日期格式处理
      for (var i = 0; i < this.dataBuffer.lines.length; i++) {
        this.dataBuffer.lines[i].dateFrom = getFormatDate(new Date(this.dataBuffer.lines[i].dateFrom));
        this.dataBuffer.lines[i].dateTo = getFormatDate(new Date(this.dataBuffer.lines[i].dateTo));
      }
    },
    dateFmtForUI: function () {
      for (var i = 0; i < this.data.lines.length; i++) {
        this.data.lines[i].dateFrom = new Date(this.data.lines[i].dateFrom);
        this.data.lines[i].dateTo = new Date(this.data.lines[i].dateTo);
      }
    }

  }

  return service;
});


