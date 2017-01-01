/**
 * Created by gusenlin on 2016/12/15.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.upload-aliyun', {
        url: '/myInfo/upload-aliyun',
        params: {},
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/upload-aliyun/upload-aliyun.html',
            controller: 'uploadALiYunCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('uploadALiYunCtrl', uploadALiYunCtrl);

  function uploadALiYunCtrl($scope,
                              $stateParams,
                              baseConfig,
                              hmsPopup) {
    var vm = this;


    var accessid = ''
    var accesskey = ''
    var host = ''
    var policyBase64 = ''
    var signature = ''
    var callbackbody = ''
    var filename = ''
    var key = ''
    var expire = 0
    var g_object_name = ''
    var g_object_name_type = ''
    var timestamp;
    var now = timestamp = Date.parse(new Date()) / 1000;

    function send_request()
    {
      var xmlhttp = null;
      if (window.XMLHttpRequest)
      {
        xmlhttp=new XMLHttpRequest();
      }
      else if (window.ActiveXObject)
      {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }

      if (xmlhttp!=null)
      {
        var severUrl = 'xxx'
        xmlhttp.open( "GET", severUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
      }
      else
      {
        alert("Your browser does not support XMLHTTP.");
      }
    };

    function check_object_radio() {
      var tt = document.getElementsByName('myradio');
      for (var i = 0; i < tt.length ; i++ )
      {
        if(tt[i].checked)
        {
          g_object_name_type = tt[i].value;
          break;
        }
      }
    }

    function get_signature()
    {
      //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲

      host = 'http://handbk.img-cn-shanghai.aliyuncs.com'
      policyBase64 = 'eyJleHBpcmF0aW9uIjoiMjAxNy0wMS0wMVQxMDo1OToyOS4yNTRaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJpbWcvIl1dfQ=='
      accessid = 'LTAIf20TU2Tdb8jz'
      signature = '73OB/RZ3NJgFCHcMGidd68Wh/RI='
      expire = parseInt('1482494307')
      key = 'img/'
      return true;

    };

    function random_string(len) {
      len = len || 32;
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      var maxPos = chars.length;
      var pwd = '';
      for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }

    function get_suffix(filename) {
      var pos = filename.lastIndexOf('.')
      var suffix = ''
      if (pos != -1) {
        suffix = filename.substring(pos)
      }
      return suffix;
    }

    function calculate_object_name(filename)
    {
      if (g_object_name_type == 'local_name')
      {
        g_object_name += "${filename}"
      }
      else if (g_object_name_type == 'random_name')
      {
        var suffix = get_suffix(filename)
        g_object_name = key + random_string(10) + suffix
      }
      return ''
    }

    function get_uploaded_object_name(filename)
    {
      if (g_object_name_type == 'local_name')
      {
        var tmp_name = g_object_name
        var tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
      }
      else if(g_object_name_type == 'random_name')
      {
        return g_object_name
      }
    }

    function set_upload_param(up, filename, ret)
    {
      if (ret == false)
      {
        ret = get_signature()
      }
      g_object_name = key;
      if (filename != '') {
        var suffix = get_suffix(filename)
        calculate_object_name(filename)
      }
      var new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : callbackbody,
        'signature': signature,
      };

      up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
      });

      up.start();
    }

    var uploader = new plupload.Uploader({
      runtimes : 'html5,flash,silverlight,html4',
      browse_button : 'selectfiles',
      //multi_selection: false,
      container: document.getElementById('container'),
      flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
      silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
      url : 'http://oss.aliyuncs.com',

      filters: {
        mime_types : [ //只允许上传图片和zip,rar文件
          { title : "Image files", extensions : "jpg,gif,png,bmp" },
          { title : "Zip files", extensions : "zip,rar" }
        ],
        max_file_size : '10mb', //最大只能上传10mb的文件
        prevent_duplicates : true //不允许选取重复文件
      },

      init: {
        PostInit: function() {
          document.getElementById('ossfile').innerHTML = '';
          document.getElementById('postfiles').onclick = function() {
            set_upload_param(uploader, '', false);
            return false;
          };
        },

        FilesAdded: function(up, files) {
          plupload.each(files, function(file) {
            document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
              +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
              +'</div>';
          });
        },

        BeforeUpload: function(up, file) {
          check_object_radio();
          set_upload_param(up, file.name, true);
        },

        UploadProgress: function(up, file) {
          var d = document.getElementById(file.id);
          d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
          var prog = d.getElementsByTagName('div')[0];
          var progBar = prog.getElementsByTagName('div')[0]
          progBar.style.width= 2*file.percent+'px';
          progBar.setAttribute('aria-valuenow', file.percent);
        },

        FileUploaded: function(up, file, info) {
          if (info.status == 200)
          {
            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
          }
          else
          {
            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
          }
        },

        Error: function(up, err) {
          if (err.code == -600) {
            document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
          }
          else if (err.code == -601) {
            document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
          }
          else if (err.code == -602) {
            document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
          }
          else
          {
            document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
          }
        }
      }
    });

    uploader.init();

  }
})();
