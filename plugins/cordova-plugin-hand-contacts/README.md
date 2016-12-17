#Name：ContactsPlugin
-----------
### ID: cordova-plugin-hand-contacts
### Version： 0.0.1
### Platform: Android;iOS
-----------------
说明： 闹钟插件


## 接口列表

###ContactsPlugin.pickContact(successCallback, errorCallback)
说明：获取联系人信息

* successCallback：function 成功回调
* errorCallback: function 失败回调


Example:
<pre><code> ContactsPlugin.pickContact(getContactSuccess, getContactError);

{		"orgName":"",		"name":"",		"phoneList":[{"type":"","value":""},{"type":"","value":""}],		"emailList":[{"type":"","value":""},{"type":"","value":""}],	}
</code></pre>

返回值：
<pre><code>
{	"orgName":"",	"name":"",	"phoneList":[{"type":"","value":""},{"type":"","value":""}],	"emailList":[{"type":"","value":""},{"type":"","value":""}]}
</code></pre>




<br/>
## iOS Quirks
无

  
    


<br/>
## Android Quirks

