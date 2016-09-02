var exec = require('cordova/exec');

var HandIMPlugin = {
    //创建讨论组 panxu add
    createDiscussion: function (successCallback, errorCallback, options) {
        if (errorCallback == null) {
            errorCallback = function () {
            }
        }
        if (typeof errorCallback != "function") {

            return
        }
        if (typeof successCallback != "function") {

            return
        }
        //alert("要创建讨论组了");
        exec(successCallback, errorCallback, "HandIMPlugin", "createDiscussion", [options]);
    },
    //打开讨论组 panxu add

    /*
     {"discussionId":""}
     */
    //打开讨论组,传递讨论组Id
    openDiscussion: function (successCallback, errorCallback, options) {
        if (errorCallback == null) {
            errorCallback = function () {
            }
        }
        if (typeof errorCallback != "function") {

            return
        }
        if (typeof successCallback != "function") {

            return
        }
        //alert("打开讨论组");
        exec(successCallback, errorCallback, "HandIMPlugin", "openDiscussion", [options]);
    },

    //获取会话列表
    /*返回内容
     android:
     {
     "isTrusted": false,
     "message": [
     {
     "message": {
     "messageNum": "0",
     "sortTime": "20160902093601",
     "content": "111\n",
     "sendId": "1cc44fef-5a7d-45af-a4ee-672bddca210a",
     "conversationType": "discussion",
     "userIcon": "http://zhouzybk.img-cn-shanghai.aliyuncs.com/discussionGroupImage1472535269374.png",
     "sendTime": "2016-09-02 09:36:01",
     "userName": "瞿达林 瞿孟南 "
     }
     },
     {
     "message": {
     "messageNum": "0",
     "sortTime": "20160902091330",
     "content": "1\n\n",
     "sendId": "9406",
     "conversationType": "private",
     "userIcon": "http://shp.qpic.cn/bizmp/A3gUw79X8ZvaODHfSA8lRncXLmWvKGQmeicPCXyknBAMVicNmj05cicZw/",
     "sendTime": "2016-09-02 09:13:30",
     "userName": "王凯华"
     }
     }
     ]
     }
     */
    getChatList: function (successCallback, errorCallback, options) {
        //alert("1");
        if (errorCallback == null) {
            errorCallback = function () {
            }
        }
        if (typeof errorCallback != "function") {
            //alert("2");
            return
        }
        if (typeof successCallback != "function") {
            //alert("3");
            return
        }
        exec(successCallback, errorCallback, "HandIMPlugin", "getChatList", [options]);

    },


    //跳转到单人聊天会话界面
    toChatAct: function (successCallback, errorCallback, options) {
        if (errorCallback == null) {
            errorCallback = function () {
            }
        }
        if (typeof errorCallback != "function") {

            return
        }
        if (typeof successCallback != "function") {

            return
        }
        exec(successCallback, errorCallback, "HandIMPlugin", "toChatAct", [options]);
    },

    //js主动调用原生代码获取消息列表数据
    returnConversationList: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, "HandIMPlugin", "returnConversationList", []);
    },


    /*var optsList = {
     "friendId": "",
     "conversationType": ""
     };*/
    //删除讨论组或者聊天纪录
    deleteConversationList: function (successCallback, errorCallback, optsList) {
        exec(successCallback, errorCallback, "HandIMPlugin", "deleteConversationList", [optsList]);
    },

    //原生调用js代码返回消息列表数据
    openNotificationInAndroidCallback: function (data) {
        try {
            data = JSON.stringify(data);
            var bToObj = JSON.parse(data);
            this.openNotification = bToObj;
            cordova.fireDocumentEvent('IMPush.openNotification', this.openNotification);
        } catch (exception) {
            console.log(exception);
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HandIMPlugin;
}
