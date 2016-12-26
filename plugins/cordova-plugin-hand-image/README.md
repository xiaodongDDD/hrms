#Name：cordova-plugin-hand-image
-----------
### ID: cordova-plugin-hand-contacts
### Version： 0.1.4
### Platform: Android;iOS
-----------------
说明： 图像插件


## 接口列表

###cordova.plugins.ImageExt.cropimage(successCallback, errorCallback)
说明：头像裁剪

* successCallback：function 成功回调
* errorCallback: function 失败回调


Example:
<pre><code>
var imageParam = {	imagePath: cordova.file.documentsDirectory + "imageTest.png",	radius: 200};          cordova.plugins.ImageExt.cropimage(initSuccess, initError, imageParam.imagePath);

</code></pre>

返回值： 裁剪后的图片url


###cordova.plugins.ImageExt.cropdrawable(successCallback, errorCallback，url, width, height)
说明：矩形裁剪

* successCallback：function 成功回调
* errorCallback: function 失败回调
* url: string 图片路径
* width: string  宽度
* height: string  高度


Example:
<pre><code>
var imageParam = {	imagePath: cordova.file.documentsDirectory + "imageTest.png",	width: 200,	height: 200};cordova.plugins.ImageExt.cropdrawable(initSuccess, initError, imageParam.imagePath, imageParam.width, imageParam.height);

</code></pre>

返回值： 裁剪后的图片url



###cordova.plugins.ImageExt.rotatedrawable(successCallback, errorCallback,url)
说明：图像旋转

* successCallback：function 成功回调
* errorCallback: function 失败回调
* url: string 图片路径



Example:
<pre><code>
var imageParam = {	imagePath: cordova.file.documentsDirectory + "imageTest.png",}cordova.plugins.ImageExt.rotatedrawable(initSuccess, initError, imageParam.imagePath);
</code></pre>

返回值： 裁剪后的图片url






<br/>
## iOS Quirks


###cordova.plugins.ImageExt.cropCircleDrawable(successCallback, errorCallback,, url, radius))
说明：圆形裁剪   
平台：ios

* successCallback：function 成功回调
* errorCallback: function 失败回调
* url: string 图片路径
* radius: string 圆半径


Example:
<pre><code>
var imageParam = {
    imagePath: cordova.file.documentsDirectory + "imageTest.png",
    radius: 200
};
cordova.plugins.ImageExt.cropCircleDrawable(initSuccess, initError, imageParam.imagePath, imageParam.radius);</code></pre>

返回值： 裁剪后的图片url



  
    


<br/>
## Android Quirks

