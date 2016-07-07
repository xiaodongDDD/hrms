angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.personnel-policy', {
          url: '/personnel-policy',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/personnel-policy/personnel-policy.html',
              controller: 'PersonnelPolicyCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('PersonnelPolicyCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {

      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      $scope.openwin=function($url){
        if(ionic.Platform.isIOS())
        {
          var urls = $url.split("?");
          var pdfurl = urls[0];
          window.open("http://www.daxuequan.org/ceshi/"+pdfurl, '_system', 'location=yes');
        } else if(ionic.Platform.isAndroid())
        {
          var urls = $url.split("?");
          var urlid = urls[1];
          window.open("http://www.daxuequan.org/hrms-pdf/web/viewer.html?"+urlid, '_system', 'location=yes');
        }else
        {
        }
      };

      $scope.filesManagement = [
        {
          shadow:true,
          text: '汉得经营大纲',
          url:'hand business outline.pdf?arg=0',
        }
      ];

      $scope.filesWork = [
        {
          shadow:true,
          text: 'HR工作明细',
          url:'A.HR分工情况/HR工作明细（201605）.pdf?arg=11',
        }
      ];
      $scope.filesStaff = [
        {
          shadow:false,
          text: '员工手册2016年3月',
          url:'B.员工手册/1、员工手册201603月.pdf?arg=21',
        },
        {
          shadow:true,
          text: '上海汉得信息技术股份有限公司商业道德规范及行为准则',
          url:'B.员工手册/1、上海汉得信息技术股份有限公司商业道德规范及行为准则.pdf?arg=22',
        }
      ];
      $scope.filesPersonnel = [
        {
          shadow:false,
          text: '深圳生育报销个人信息登记表',
          url:'C.人事政策/深圳生育报销信息登记表.xlsx?arg=31',
        },
        {
          shadow:false,
          text: '深圳外服-外地生育报销指南',
          url:'C.人事政策/外地生育报销指南.pdf?arg=32',
        },
        {
          shadow:false,
          text: '深圳外服-外地住院医疗报销指南',
          url:'C.人事政策/深圳外服-外地住院医疗报销指南 .pdf?arg=33',
        },
        {
          shadow:false,
          text: '汉得员工宿舍管理制度',
          url:'C.人事政策/汉得员工宿舍管理制度 .pdf?arg=34',
        },
        {
          shadow:false,
          text: 'HRMS系统使用介绍',
          url:'C.人事政策/HRMS系统使用介绍 .pdf?arg=35',
        },
        {
          shadow:false,
          text: '离职流程说明',
          url:'C.人事政策/离职流程说明.pdf?arg=36',
        },
        {
          shadow:false,
          text: '如何办理港澳商务签注手册',
          url:'C.人事政策/如何办理港澳商务签证.pdf?arg=37',
        },
        {
          shadow:true,
          text: '乘机人受益人申请的流程说明201209',
          url:'C.人事政策/乘机人受益人申请的流程说明201209 .pdf?arg=38',
        }
      ];
      $scope.filesWelfare = [
        {
          shadow:false,
          text: '笔记本相关流程',
          url:'D.公司福利/笔记本相关流程.pdf?arg=401',
        },
        {
          shadow:false,
          text: '商业保险说明（医疗理赔报销）',
          url:'D.公司福利/商业保险说明（医疗理赔报销）.pdf?arg=402',
        },
        {
          shadow:false,
          text: '商业保险-友邦理赔申请书(新版)',
          url:'D.公司福利/团险理赔申请书（汉得2016）.doc?arg=403',
        },
        {
          shadow:false,
          text: '常见问题解答',
          url:'D.公司福利/常见问题解答.pdf?arg=404',
        },
        {
          shadow:false,
          text: '员工生日祝贺金',
          url:'D.公司福利/员工生日祝贺金.pdf?arg=405',
        },
        {
          shadow:false,
          text: 'Flyback的政策及机票购买规定',
          url:'D.公司福利/Flyback的政策及机票购买规定.pdf?arg=406',
        },
        {
          shadow:false,
          text: '房屋贷款政策',
          url:'D.公司福利/房屋贷款政策.pdf?arg=407',
        },
        {
          shadow:false,
          text: '机票补贴规定及申请流程-201209',
          url:'D.公司福利/机票补贴规定及申请流程-201209.pdf?arg=408',
        },
        {
          shadow:false,
          text: '差旅及相关费用报销规定-201209',
          url:'D.公司福利/差旅及相关费用报销规定-201209.pdf?arg=409',
        },
        {
          shadow:true,
          text: '旅游福利政策',
          url:'D.公司福利/旅游福利政策.pdf?arg=410',
        },
      ];
      $scope.filesCommon = [
        {
          shadow:false,
          text: '采购流程',
          url:'E.公共类文档/201409公司采购流程.pdf?arg=51',
        },
        {
          shadow:false,
          text: '汉得青浦园区VPN接入手册',
          url:'E.公共类文档/汉得青浦园区VPN接入手册201502.pdf?arg=52',
        },
        {
          shadow:false,
          text: '汉得青浦园区电话使用手册',
          url:'E.公共类文档/汉得青浦园区电话使用手册20140425.pdf?arg=53',
        },
        {
          shadow:false,
          text: '汉得青浦园区网络开通申请及使用流程',
          url:'E.公共类文档/汉得青浦园区网络开通申请及使用流程.pdf?arg=54',
        },
        {
          shadow:false,
          text: '汉得青浦园区A栋5楼打印机使用操作手册',
          url:'E.公共类文档/A栋5楼理光打印机使用手册.docx?arg=55',
        },
        {
          shadow:false,
          text: '关于网上报销的正确填报及发票提交和粘帖方法',
          url:'E.公共类文档/关于网上报销的正确填报及发票提交和粘帖方法.pdf?arg=56',
        },
        {
          shadow:false,
          text: '公司介绍',
          url:'E.公共类文档/公司介绍.pdf?arg=57',
        }
      ];
      $scope.filesPersonnelSys = [
        {
          shadow:false,
          text: '机票系统操作说明',
          url:'F.人事系统手册/机票功能操作说明.doc?arg=61',
        },
        {
          shadow:false,
          text: 'HR系统工作流审批设置',
          url:'F.人事系统手册/HR系统工作流审批设置.doc?arg=62',
        },
        {
          shadow:false,
          text: 'HRMS项目租房使用手册',
          url:'F.人事系统手册/HRMS 项目租房使用手册.zip?arg=63',
        },
        {
          shadow:true,
          text: 'EIP系统 项目租房使用手册',
          url:'F.人事系统手册/EIP系统 项目租房使用手册.zip?arg=64',
        }
      ];
      $scope.filesWuhan = [
        {
          shadow:false,
          text: '武汉分公司员工入职须知v1.0.pdf',
          url:'G.武汉分公司政策/武汉分公司员工入职须知V1.0.pdf?arg=71',
        },
        {
          shadow:false,
          text: '武汉分公司商业道德规范及行为准则v1.0.pdf',
          url:'G.武汉分公司政策/武汉分公司商业道德规范及行为准则V1.0.pdf?arg=72',
        },
        {
          shadow:false,
          text: '武汉分公司员工公寓住宿相关规定v1.0.pdf',
          url:'G.武汉分公司政策/武汉分公司员工公寓住宿相关规定V1.0.pdf?arg=73',
        },
        {
          shadow:false,
          text: '武汉分公司员工手册v1.0.pdf',
          url:'G.武汉分公司政策/201511武汉分公司员工手册V1.1.pdf?arg=74',
        },
        {
          shadow:true,
          text: '上海汉得信息技术股份有限公司武汉分公司离职流程v1.0.pdf',
          url:'G.武汉分公司政策/上海汉得信息技术股份有限公司武汉分公司离职流程V1.0.pdf?arg=75',
        },
      ];
    }]
);


