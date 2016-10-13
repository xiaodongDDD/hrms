/** Author      : joshua.shi
 *
 *  History:
 *      1.00    2016-7-05   joshua.shi   Creation
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage-detail', {
          url: '/time-off-manage',
          params: {timeOffData: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/time-off-manage/time-off-manage-detail.html',
              controller: 'TimeOffManageDetailCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')

  .controller('TimeOffManageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    '$ionicModal',
    '$ionicHistory',
    '$cordovaDatePicker',
    '$timeout',
    'timeOffManageService',
    'HmsDateFormat',
    '$cordovaCamera',
    function ($scope,
              $state,
              $stateParams,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicModal,
              $ionicHistory,
              $cordovaDatePicker,
              $timeout,
              timeOffManageService,
              HmsDateFormat,
              $cordovaCamera) {

      $ionicModal.fromTemplateUrl('build/pages/myInfo/modal/choose-picture.html', {//定义图片选择方法modal
        scope: $scope
      }).then(function (modal2) {
        $scope.choosePictureMethodPopup = modal2;
      });//初始化选择图片上传方式类型的modal
      $scope.pictureAppearance = "";//显示大图
      $scope.imageList=[];//图片列表
      var objectUrl=[];//收集每次调用图片上传接口时返回的ObjectUrl，最终在传文字接口时以数组形式发送过去
      var imageTotalLength=0;//选择了的图片总长度
      $scope.matrix=[[true,false,false],[false,false,false],[false,false,false],[false]];//四行三列，共10个
      var currentPictureNumber=0;//图片上传到第几张，0-9
      var currentRow=0;//matrix的下标一维
      var currentCol=0;//matrix的下标二维
      var maxNumber=0;//图片最大上传数量
      var pictureNumber=0;//控制在图片上传完成时判断是否调用文字传入接口
      for(maxNumber;maxNumber<10;maxNumber++){
        var param={
          selected:false,
          uri:"",
          num:maxNumber+1,
          deleteMode:false
        };
        $scope.imageList.push(param);
      }
      $scope.pictureType=['拍照','相册'];//图片选择方式值列表
      $scope.extensionPicture="";//放大图片Url
      $scope.showPictureModal=function(num){//显示图片选择的Modal
        currentPictureNumber=num;
        $scope.choosePictureMethodPopup.show();
      };
      $scope.choosePictureType=function(param){
        var selectedMethod=param;
        //$scope.imageList[currentPictureNumber].uri="build/img/navigate3@3x.png";
        if(selectedMethod == "拍照"){
          var cameraoptions = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            correctOrientation:true
          };
          $cordovaCamera.getPicture(cameraoptions).then(function(imageURI) {
            $scope.imageList[currentPictureNumber].uri=imageURI;//获取相机图片Uri
            $scope.imageList[currentPictureNumber].selected=true;
            if(($scope.imageList[currentPictureNumber].num%3)!=0){
              if(currentRow < 3){
                currentCol=currentCol+1;
                $scope.matrix[currentRow][currentCol]=true;
                $scope.imageList[currentPictureNumber].selected=true;
              }else if(currentRow == 3){
                $scope.imageList[currentPictureNumber].selected=true;
              }
            }else if(($scope.imageList[currentPictureNumber].num%3)==0){
              currentCol=0;
              currentRow=currentRow+1;
              $scope.matrix[currentRow][currentCol]=true;
              $scope.imageList[currentPictureNumber].selected=true;
            }
            $scope.$apply();
          }, function(err) {
            // error
          });
        }else if(selectedMethod == "相册"){
          window.imagePicker.getPictures(function(results){
            if(results[0]!==undefined && results[0]!=""){
              $scope.imageList[currentPictureNumber].uri=results[0];//获取相册图片Uri
              $scope.imageList[currentPictureNumber].selected=true;
              if(($scope.imageList[currentPictureNumber].num%3)!=0){
                if(currentRow < 3){
                  currentCol=currentCol+1;
                  $scope.matrix[currentRow][currentCol]=true;
                  $scope.imageList[currentPictureNumber].selected=true;
                }else if(currentRow == 3){
                  $scope.imageList[currentPictureNumber].selected=true;
                }
              }else if(($scope.imageList[currentPictureNumber].num%3)==0){
                currentCol=0;
                currentRow=currentRow+1;
                $scope.matrix[currentRow][currentCol]=true;
                $scope.imageList[currentPictureNumber].selected=true;
              }
              $scope.$apply();
            }
          },function(error){

          },{
            maximumImagesCount: 1,
            width: 480,
            height: 480,
            quality: 60
          });
        }
        $scope.choosePictureMethodPopup.hide();
      };

      $scope.judgeRow=function(num){
        if(num==0){
          if($scope.matrix[0][0]==true){
            return true;
          }else{
            return false;
          }
        }else if(num==1){
          if($scope.matrix[1][0]==true){
            return true;
          }else{
            return false;
          }
        }else if(num==2){
          if($scope.matrix[2][0]==true){
            return true;
          }else{
            return false;
          }
        }else if(num==3){
          if($scope.matrix[3][0]==true){
            return true;
          }else{
            return false;
          }
        }
      };

      $scope.deleteImage=function(num){
        $scope.imageList.splice(num,1);
        angular.forEach($scope.imageList,function(data,index,array){//先重置imageList列表
          array[index].num=index+1;
        });
        $scope.imageList.push({
          selected:false,
          uri:"",
          num:$scope.imageList.length+1,
          deleteMode:false
        });
        //再重置matrix
        for(var row=0;row<4;row++){
          for(var col=0;col<3;col++){
            if(row<3){
              if($scope.imageList[parseInt(row)*3+parseInt(col)].selected==true){
                $scope.matrix[row][col]=true;
                //console.log("row:"+row+" col:"+col+" 数字："+(parseInt(row)*3+parseInt(col)));
              }else if($scope.imageList[parseInt(row)*3+parseInt(col)].selected==false){
                $scope.matrix[row][col]=false;
                //console.log("row:"+row+" col:"+col+" 数字："+(parseInt(row)*3+parseInt(col)));
              }
            }else if(row==3){
              if($scope.imageList[9].selected==true){
                $scope.matrix[3][0]=true;
              }else if($scope.imageList[9].selected==false){
                $scope.matrix[3][0]=false;
              }
            }
          }
        }
        //拿到最后一个显示的图片，将其后一个变为增加按钮
        var k=0;
        var l=0;
        for(k;k<$scope.imageList.length;k++){
          if($scope.imageList[k].selected==true){
            l++;
          }
        }
        l=l+1;
        var j = l%3;
        var i = ( l - j ) / 3;
        if(j>0){
          j=j-1;
        }else if(j==0){
          j=2;
          i=i-1;
        }
        currentRow = i;
        currentCol = j;
        $scope.matrix[i][j]=true;
      };

      $scope.showBigPicture=function(num){//显示大图
        $scope.pictureAppearance=true;
        $scope.extensionPicture=$scope.imageList[num].uri;
        $timeout(function(){
          var bigPicture=document.getElementById('my-big-picture');
          var screenWidth = window.screen.width;
          var screenHeight = window.screen.height;
          bigPicture.style.height=screenHeight+"px";
        },100);
      };

      $scope.hideBigPicture=function(){//隐藏大图
        $scope.pictureAppearance=false;
      };

      $scope.isIOSPlatform = ionic.Platform.isIOS();//判断平台,留出iOS的statusBar
      $scope.descriptionFlag = '';
      $scope.timeLeaveFlag = false;
      $scope.pageTitle = '创建休假';
      $scope.readOnly = ''; // 界面是否可以编辑
      $scope.buttonModeClass = 'submit-mode';//submit-mode,revoke-mode,transparent-mode
      $scope.requestUrl =  '';              //请求地址
      $scope.requestParams = {};            //请求参数
      $scope.operationTypeMeaning = '';
      $scope.operation = {
        createMode: true,
        revokeMode: false,
        queryMode: false
      };

      //设置界面模式
      var setOperationMode = function (modeType) {
        if (modeType == 'create') {
          $scope.operation.createMode = true;
          $scope.operation.revokeMode = false;
          $scope.operation.queryMode = false;
          $scope.operationTypeMeaning = '提交';
          $scope.readOnly = false;
          $scope.timeOffData.timeOffTypeMeaning = '带薪年假'; //add by senlin 20161008
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidHoliday; //add by senlin 20161008
          $scope.pageTitle = '创建休假';
        } else if (modeType == 'revoke') {
          $scope.operation.createMode = false;
          $scope.operation.revokeMode = true;
          $scope.operation.queryMode = false;
          $scope.operationTypeMeaning = '撤回';
          $scope.readOnly = true;
          $scope.pageTitle = '撤回休假';
        } else if (modeType == 'query') {
          $scope.operation.createMode = false;
          $scope.operation.revokeMode = false;
          $scope.operation.queryMode = true;
          $scope.readOnly = true;
          $scope.pageTitle = '休假详情';
        }
      };

      //定义创建休假申请数据结构
      $scope.timeOffData = {
        operationType: '',
        timeOffTypeMeaning: '',
        dateFromMeaning: '',
        dateToMeaning: '',
        unusedPaidHoliday: '',
        unusedPaidSickLeave: '',
        unusedExtPaidHoliday: '',
        unusedHoliday: '',
        timeLeave: '',
        applyReason: '',
        approveStatus: '',
        revokeReason:''
      };

      //初始化假期类型数组
      $scope.timeOffTypeRecord = ["带薪年假", "额外福利年假", "事假", "带薪病假", "病假", "婚嫁", "产假", "丧假", "陪产假"];

      $scope.timeOffType = {
        "带薪年假": "100000",
        "额外福利年假": "100060",
        "事假": "100001",
        "带薪病假": "100002",
        "病假": "100020",
        "婚嫁": "100003",
        "产假": "100004",
        "丧假": "100040",
        "陪产假": "100041"
      };

      //记录传入日志
      if (baseConfig.debug) {
        console.log('$stateParams.timeOffData ' + angular.toJson($stateParams.timeOffData));
      }

      //modify by gusenlin 2016-10-08
      var getOffTime = function (startDate, endDate) {
        var mmSec = (endDate.realDate.getTime() - startDate.realDate.getTime());
        return mmSec;
      };

      var getLeaveDays = function () {

        if(baseConfig.debug) {
          console.log('in getLeaveDays $scope.timeOffData.timeOffTypeMeaning ' + $scope.timeOffData.timeOffTypeMeaning);
        }

        if (getOffTime($scope.datetimeFrom, $scope.datetimeTo) > 0) {
          if ($scope.timeOffData.timeOffTypeMeaning && $scope.timeOffData.timeOffTypeMeaning != '') {
            var policyitemId = $scope.timeOffType[$scope.timeOffData.timeOffTypeMeaning];
            var start = HmsDateFormat.getDateTimeString($scope.datetimeFrom.realDate);
            var end = HmsDateFormat.getDateTimeString($scope.datetimeTo.realDate);

            if(baseConfig.debug){
              console.log('in getLeaveDays policyitemId ' + policyitemId);
              console.log('in getLeaveDays start ' + start);
              console.log('in getLeaveDays end ' + end);
            }
            timeOffManageService.getLeaveDays($scope, policyitemId, start, end);
          }
        } else {
          $scope.timeOffData.timeLeave = 0;
        }
      };

      //init data
      {
        $scope.timeOffData = $stateParams.timeOffData;
        //create,revoke,update,query
        //当前还不支持草稿类型,所以不存在update操作
        setOperationMode($scope.timeOffData.operationType);
        $stateParams.timeOffData.revokeReason = "";
        //设置初始化时间
        var todayDate = new Date();//今天日期
        var month = todayDate.getMonth() + 1;
        var day = todayDate.getDate();
        $scope.datetimeFrom = {//开始日期
          realDate: new Date(),
          year: todayDate.getFullYear(),
          month: "",
          day: ""
        };
        $scope.datetimeTo = {//结束日期
          realDate: new Date(),
          year: "",
          month: "",
          day: ""
        };

        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        $scope.datetimeFrom.month = month;
        $scope.datetimeFrom.day = day;

        var myDate = $scope.datetimeFrom;
        $scope.datetimeFrom.realDate = new Date(myDate.year, myDate.month - 1, myDate.day, '08', '30', '00');

        //初始化结束时间
        refreshEndDate(1);

        if($scope.timeOffData.operationType == 'create'){
          getLeaveDays();
        }

        var initURL = baseConfig.businessPath + "/api_holiday/get_holiday_history";
        var initParams = {
          "params": {
            "p_employee_number": window.localStorage.empno
          }
        };
        $scope.approveDTimeOffId = "";
        hmsHttp.post(initURL, initParams).success(function (response) {

          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.con_status)) {
            for ( var i = 0; i < response.holiday_history_list.length; i++ ){
              var holiday = response.holiday_history_list[i];
              var type = holiday.holiday_history_display.slice(0, holiday.holiday_history_display.indexOf(','));
              var from = holiday.holiday_history_display.substr(holiday.holiday_history_display.indexOf('从') + 1, 10);
              var to = holiday.holiday_history_display.substr(holiday.holiday_history_display.indexOf('到') + 2, 10);
              if( type === $scope.timeOffData.timeOffTypeMeaning && from === $scope.timeOffData.datetimeFrom.substr(0, 10) && to === $scope.timeOffData.datetimeTo.substr(0, 10)) {
                $scope.approveDTimeOffId = holiday.time_offid;
              }
            }
          } else {
            if (response.con_status === 'E' || response.con_status == 'e') {
              hmsPopup.showShortCenterToast("查询休假记录出错!请检查相关数据！" /*+ response.errorMsg*/);
            } else {
              hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
            }
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("查询休假记录失败");
        });
      }


      $scope.getdateFromMeaning = function () {
        if ($scope.readOnly) { // add by ciwei 只读模式下,直接读取列表信息
          return $scope.timeOffData.datetimeFrom;
        } else {
          return HmsDateFormat.getDateTimeString($scope.datetimeFrom.realDate);
          //$scope.datetimeFrom.year + '-' + $scope.datetimeFrom.month + '-' + $scope.datetimeFrom.day + ' 08:30:00';
        }

      };

      $scope.getdateToMeaning = function () {
        if ($scope.readOnly) { // add by ciwei 只读模式下,直接读取列表信息
          return $scope.timeOffData.datetimeTo;
        } else {
          return HmsDateFormat.getDateTimeString($scope.datetimeTo.realDate);
          //return $scope.datetimeTo.year + '-' + $scope.datetimeTo.month + '-' + $scope.datetimeTo.day + ' 18:00:00';
        }
      };

      //初始化假期类型弹窗
      $ionicModal.fromTemplateUrl('build/pages/application/time-off-manage/modal/new-time-off-type.html', {
        scope: $scope
      }).then(function (modal1) {
        $scope.timeOffTypePopup = modal1;
      });


      //显示假期类型
      $scope.selectTimeOffType = function () {

        if ($scope.readOnly) {
          return;
        }

        $scope.timeOffTypePopup.show();
      };
      //假期类型结束事件
      $scope.timeOffTypeSelected = function (param) {
        $scope.timeOffData.timeOffTypeMeaning = param;

        //将当前剩余假期设置为所选假期,此处如果PC和app并发存在脏数据可能
        //需要在服务器生成休假记录时进行二次校验
        if ($scope.timeOffData.timeOffTypeMeaning == '带薪年假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidHoliday;
        } else if ($scope.timeOffData.timeOffTypeMeaning == '带薪病假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidSickLeave;
        } else if ($scope.timeOffData.timeOffTypeMeaning == '额外福利年假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.extPaidHoliday;
        } else {
          $scope.timeOffData.unusedHoliday = '0';
        }
        $scope.timeOffTypePopup.hide();
        $timeout(function () {
          getLeaveDays();
        },200);
      };

      //假期说明信息
      $scope.showDescription = function () {
        $scope.descriptionFlag = true;
      };
      $scope.hideDescription = function () {
        $scope.descriptionFlag = false;
      };


      $scope.chooseStartDate = function () {//选择开始日期

        if ($scope.readOnly) {
          return;
        }

        var myDate = $scope.datetimeFrom.realDate;

        //var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: myDate,
          mode: 'datetime',
          titleText: '请选择开始日期',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale: "zh_cn"
        };
        $cordovaDatePicker.show(options).then(function (date) {
          var month = date.getMonth() + 1;
          var day = date.getDate();

          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          $scope.datetimeFrom.year = date.getFullYear();
          $scope.datetimeFrom.month = month;
          $scope.datetimeFrom.day = day;
          $scope.datetimeFrom.realDate = date;

          //$scope.$apply();
          getLeaveDays();

          /*var offDays = getOffDays($scope.datetimeFrom, $scope.datetimeTo) + 1;
           if (offDays > 0) {
           $scope.timeOffData.timeLeave = offDays;
           } else {
           $scope.timeOffData.timeLeave = '';
           }*/
        });
      };

      $scope.chooseEndDate = function () {//选择结束

        if ($scope.readOnly) {
          return;
        }

        var myDate = $scope.datetimeTo.realDate;
        //var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: myDate,
          mode: 'datetime',
          titleText: '请选择结束日期',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale: "zh_cn"
        };
        $cordovaDatePicker.show(options).then(function (date) {
          var month = date.getMonth() + 1;
          var day = date.getDate();

          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          $scope.datetimeTo.year = date.getFullYear();
          $scope.datetimeTo.month = month;
          $scope.datetimeTo.day = day;
          $scope.datetimeTo.realDate = date;

          //$scope.$apply();
          getLeaveDays();
          /*var offDays = getOffDays($scope.datetimeFrom, $scope.datetimeTo) + 1;

           if (offDays > 0) {
           $scope.timeOffData.timeLeave = offDays;
           } else {
           $scope.timeOffData.timeLeave = '';
           }*/


        });
      };

      function refreshEndDate(num) {
        var myDate = $scope.datetimeFrom;
        var todayDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var tomorrowDate = new Date(myDate.year, myDate.month - 1, myDate.day);

        num = parseInt(num);
        tomorrowDate.setDate(todayDate.getDate() + num);
        tomorrowYear = tomorrowDate.getFullYear();
        tomorrowDay = tomorrowDate.getDate();
        tomorrowMonth = tomorrowDate.getMonth() + 1;

        if (tomorrowMonth < 10) {
          tomorrowMonth = "0" + tomorrowMonth;
        }
        if (tomorrowDay < 10) {
          tomorrowDay = "0" + tomorrowDay;
        }
        $scope.datetimeTo.year = tomorrowYear;
        $scope.datetimeTo.month = tomorrowMonth;
        $scope.datetimeTo.day = tomorrowDay;

        var myDate = $scope.datetimeTo;
        $scope.datetimeTo.realDate = new Date(myDate.year, myDate.month - 1, myDate.day, '18', '00', '00');

      };

      var uploadImage=function(){//上传图片
        hmsPopup.showLoadingWithoutBackdrop('上传信息中，请稍候');
        for(var i=0;i<$scope.imageList.length;i++){
          if($scope.imageList[i].uri!=""){
            var nowDates = Date.parse(new Date()) / 1000;
            var fileName = window.localStorage.empno + nowDates +'.jpg';
            var urlname="";
            var myParam={
              filename:fileName,
              url:urlname//图片在服务器的路径
            };
            var options = new FileUploadOptions();
            options.filekey = "file";
            options.fileName = $scope.imageList[i].uri.substr($scope.imageList[i].uri.lastIndexOf('/')+1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            var trustAllHosts = true;
            //myParam.filename="";
            options.params = myParam;
            var fileTransfer = new FileTransfer();
            fileTransfer.upload(
              $scope.imageList[i].uri,
              //encodeURI(baseConfig.queryPath+"/objectUpload?access_token="+window.localStorage.token),//上传服务器的接口地址
              encodeURI(baseConfig.queryPath+"/objectUpload?access_token="+window.localStorage.token),
              win,
              fail,
              options,
              trustAllHosts
            );
          }
        }
      };
      var win=function(response){//图片上传成功
        //如果有Loading的话记得隐藏loading
        var data=JSON.parse(response.response);
        var objectParam={
          "objectName":data.returnData.objectUrl
        };
        objectUrl.push(objectParam);
        pictureNumber++;
        if(pictureNumber == imageTotalLength){
          $scope.requestParams.params.objects = objectUrl;
        }
      };
      var fail=function(error){//图片上传失败
        //如果有Loading的话记得隐藏loading
        hmsPopup.hideLoading();
        hmsPopup.showPopup("图片上传失败");
      };

      //创建休假申请
      $scope.submitTimeOff = function () {

        if ($scope.timeOffData.timeOffTypeMeaning == '' ||
          $scope.getdateFromMeaning() == '' ||
          $scope.getdateToMeaning() == ''
        ) {
          hmsPopup.showPopup('请填写必要的申请信息!');
          return;
        }

        //if ($scope.timeOffData.timeLeave == '' || parseInt($scope.timeOffData.timeLeave <=0)) {
        //  hmsPopup.showPopup('请输出正确的休假区间!!');
        //  return;
        //}

        //--add by senlin 20161008
        var offDays = getOffTime($scope.datetimeFrom, $scope.datetimeTo);
        if (offDays < 0) {
          hmsPopup.showPopup('起始时间不能小于结束时间');
          return;
        }

        /*if ($scope.timeOffData.unusedHoliday &&
         $scope.timeOffData.timeOffTypeMeaning == '带薪年假' &&
         offDays > $scope.timeOffData.unusedHoliday) {
         hmsPopup.showPopup('申请带薪年假不能超过本年度可用年假');
         return;
         }*/
        //--add by senlin 20161008

        if ($scope.timeOffData.timeOffTypeMeaning == '带薪病假' && $scope.timeOffData.timeLeave > 1) {
          hmsPopup.showPopup('超过1天的病假需要上传三甲医院证明,请从PC端进行提交');
          return;
        }

        if ($scope.operation.createMode) {

          $scope.requestUrl = baseConfig.businessPath + "/api_holiday/submit_holiday_apply";
          $scope.requestParams = {
            "params": {
              "p_employeecode": window.localStorage.empno,
              "p_timeofftypemeaning": $scope.timeOffData.timeOffTypeMeaning,
              "p_datetimefrom": $scope.getdateFromMeaning(),
              "p_datetimeto": $scope.getdateToMeaning(),
              "p_timeleave": '',//$scope.timeOffData.timeLeave
              "p_applyreason": $scope.timeOffData.applyReason
            }
          };

        } else if ($scope.operation.revokeMode) {
          if ($scope.timeOffData.approveStatus == 'APPROVED') {
            if( !$scope.timeOffData.revokeReason.trim() ){
              hmsPopup.showVeryShortCenterToast('请输入撤回原因!');
              return;
            } else {
              $scope.requestUrl = baseConfig.businessPath + "/api_holiday/get_holiday_cancel";
              $scope.requestParams = {
                "params": {
                  "p_employee_number": window.localStorage.empno,
                  "p_timeoffid": $scope.approveDTimeOffId,
                  'p_description': $scope.timeOffData.revokeReason
                }
              }
            }
          } else {
            $scope.requestUrl = baseConfig.businessPath + "/api_holiday/get_holiday_apply_back";
            $scope.requestParams = {
              "params": {
                "p_employee_code": window.localStorage.empno,
                "p_timeoffid": $scope.timeOffData.timeOffId
              }
            }
          }
        }

        //记录调用日志参数
        if (baseConfig.debug) {
          console.log('requestParams ' + angular.toJson($scope.requestParams));
        }

        hmsPopup.showLoading("处理请求中");

        // uploadImage();
        hmsHttp.post($scope.requestUrl, $scope.requestParams).success(function (response) {

          hmsPopup.hideLoading();
          var status;
          if( response.status ){
            status = response.status;
          } else if ( response.returnCode ){
            status = response.returnCode;
          } else {
            status = response.con_status;
          }
          if (hmsHttp.isSuccessfull(status)) {

            //跳转回列表界面
            timeOffManageService.setRefreshTimeOffList(true);
            $ionicHistory.goBack();

          } else {
            if (status === 'E' || status == 'e') {
              if( response.returnMsg ){
                hmsPopup.showShortCenterToast(response.returnMsg);
              } else {
                hmsPopup.showShortCenterToast("处理请求出错!请检查相关数据！" /*+ response.errorMsg*/);
              }
            } else {
              hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
            }
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("处理请求失败");
        });
      }

    }]);
