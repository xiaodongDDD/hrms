#插件调用方法
wei.weiLogin(success,error)

返回值 是一个Json字符串，里面包括用户昵称，头像URL

调用示例

 <button onclick="wei.weiLogin(function(msg){
                  alert(msg);
               },function(msg){
                  alert(msg);
                })">Login</button>

主要事项：
此插件应用于指定的包名com.hand_china.hrms和指定的签名，不然就弹不出微信登录授权页面