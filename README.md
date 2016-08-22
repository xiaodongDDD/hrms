# HRMSv2研发项目

一个基于 ionic v1 + angular v2 的 Hybrid app环境

>建议: 推荐 Cordova 5.4.1以及以上 + gulp + bower

# 环境搭建

```
# 下载源代码
$ git clone http://hpm.hand-china.com/diffusion/HRMSTWO/hrms.git

# 切换到根目录
$ cd hrms

# 切换到develop 分支下载最新代码
$ git checkout develop

# 安装gulp构建环境
$ npm install

# 安装js依赖库
$ bower install

# 构建测试环境开发目录
$ gulp run-dev

# 浏览器运行app程序
$ ionic serve
```

# Git 操作规范
```
st=>start: 开始
e=>end: 结束
clone=>operation: git clone url
pullA=>operation: git pull origin develop:develop
checkoutA=>operation: git checkout -b feature/A
code=>operation: 编写代码/修改代码
add=>operation: git add
commit=>operation: git commit
checkoutB=>operation: git checkout develop
pullB=>operation: git pull origin develop:develop
merge=>operation: git merge feature/A
conflict=>operation: 如果有冲突，解决冲突
push=>operation: git push origin develop:develop

st->clone->pullA->checkoutA->code->add->commit->checkoutB->pullB->merge->conflict->push->e
```

# IDE
WebStorm
Android Studio
Xcode


# 开发规范

*所有文件名，文件夹都以中划线分隔 ,全部小写 比如 contact-us
*html 尽量不要有style=“”
*javascript代码变量第二个单词首字母大写  比如 timeOffManagment
*javascript代码字符串定义用单引号  比如 var target=''
*angular的对象里面不要使用闭包
*angular的controller和service 用注入的时候，都要进行申明，目的是为了压缩混淆，如 angular.modal.controller('TabCtrl’,[‘$scope’,function($scope){}]);
*尽量谨慎使用$rootScope.$broadcast  因为$rootScope 不会在controller销毁的时候被回收
*scss的规范写法
   approve-list {
     ##
     .approve-item{
     ##
     }
   }
*代码里面一定要有注释
*angularJS项目 逻辑功能不要全部写在controller里面，因该写在service里面
*在一个controller 里面，变量都在最上面，函数在下面，因为js执行的时候，他也会自动先去执行变量的定义