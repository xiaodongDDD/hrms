package com.hand.im;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;
import com.hand.im.R;
import com.nostra13.universalimageloader.cache.memory.impl.LruMemoryCache;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.util.ArrayList;
import java.util.List;

import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.MessageContent;
import io.rong.message.TextMessage;

public class HandIMPlugin extends CordovaPlugin{
    public static final String ACTION_GET_CHAT_LIST = "getChatList";
    public static final String ACTION_TO_CHAT_ACT = "toChatAct";
    public static final int RESULT = 1;
    private Context context;
    private static String userId="";
    private static String friendId="";
    private static String token="";
    private CallbackContext mCallbackContext;
    private List<myConversation> myConversations;
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        //初始化基本数据和界面数据
        init();
    }
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        mCallbackContext = callbackContext;
        if(ACTION_GET_CHAT_LIST.equals(action)){
            //获取用户的id 这里定义上为进入初始化的操作 但是还是加了判断防止多次进入
            if(args!=null && args.length()>0){
            JSONObject obj = args.optJSONObject(0);
            userId = obj.optString("userId");
            token = obj.optString("token");}
//            userId = "9607";
//            token = "jXvXjRT5+sgt7Icek92lwVY2C1hR3dIp9TV04D0Hxc3ZYBt7t353mgUNK016dkd/yTi6v2P+dmIl+PQi0Z39Zw==";
            if(token.equals("")){
                Toast.makeText(context,"未获取到数据",Toast.LENGTH_SHORT).show();
                return true;
            }
            if(!getRmConnect()){
                //初始化融云
                initRY();
                //获取token 建立连接
                connect(token);
            }
            return true;
        }else if(ACTION_TO_CHAT_ACT.equals(action)){
            //区分两种入口 一种是会话列表点击进入 一种是联系人列表点击进入 进入到消息界面
            //获取消息发送对象的ID
            //判断连接状态
            if(args!=null && args.length()>0){
            JSONObject obj = args.optJSONObject(0);
            friendId = obj.optString("friendId");}
//            friendId="9606";
            if(userId.isEmpty()||friendId.isEmpty()||token.isEmpty()){
                Toast.makeText(context,"没有用户数据",Toast.LENGTH_SHORT).show();
                return true;
            }
            if(getRmConnect()){
                Intent intent = new Intent(cordova.getActivity(),HandChatActivity.class);
                intent.putExtra("USERID",userId);
                intent.putExtra("FRIENDID",friendId);
                intent.putExtra("TOKEN",token);
                cordova.setActivityResultCallback(this);
                cordova.startActivityForResult(this, intent, RESULT);
//                cordova.getActivity().startActivity(intent);
            }else{
                Toast.makeText(context,"准备重新连接，请检查网络状态",Toast.LENGTH_SHORT).show();
                if(!getRmConnect()){
                    //获取token 建立连接
                    connect(token);
                }
            }
            return true;
        }
        return false;
    }
    //初始化操作
    public void init(){
        context = cordova.getActivity().getApplicationContext();
        myConversations = new ArrayList<myConversation>();
        //初始化表情数据
        FaceConversionUtil.getInstace().getFileText(cordova.getActivity().getApplication());
        //初始化ImageLoader
        initImageLoader(context);
    }
    public void initRY(){
        context = cordova.getActivity().getApplicationContext();
        //初始化融云
        if (cordova.getActivity().getApplicationInfo().packageName.equals(getCurProcessName(context)) ||
                "io.rong.push".equals(getCurProcessName(context))) {
            RongIMClient.init(cordova.getActivity());
        }
        //设置消息监听（需要在连接之前）
        RongIMClient.setOnReceiveMessageListener(new MyReceiveMessageListener());
    }
    public static void initImageLoader(Context context) {
        DisplayImageOptions defaultOptions = new DisplayImageOptions.Builder()
                .cacheOnDisk(false)
                .cacheInMemory(true)
                .resetViewBeforeLoading(true).build();
        ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(
                context).defaultDisplayImageOptions(defaultOptions)
                .writeDebugLogs() //打印log信息
                .memoryCacheExtraOptions(480, 800) // default = device screen dimensions
                .diskCacheExtraOptions(480, 800, null)
                .memoryCache(new LruMemoryCache(10 * 1024 * 1024))
                .memoryCacheSize(10 * 1024 * 1024)
                .memoryCacheSizePercentage(6) // default
                .diskCacheSize(10 * 1024 * 1024)
                .diskCacheFileCount(100)
                .threadPoolSize(3)
                .threadPriority(Thread.NORM_PRIORITY - 2) // default
                .build();
        ImageLoader.getInstance().init(config);
    }

    public static String getCurProcessName(Context context) {
        int pid = android.os.Process.myPid();
        ActivityManager activityManager = (ActivityManager) context
                .getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningAppProcessInfo appProcess : activityManager
                .getRunningAppProcesses()) {
            if (appProcess.pid == pid) {
                return appProcess.processName;
            }
        }
        return null;
    }
    /**
     * 建立与融云服务器的连接
     * @param token
     */
    private void connect(String token) {
        if (cordova.getActivity().getApplicationInfo().packageName.equals(getCurProcessName(cordova.getActivity().getApplicationContext()))) {
            RongIMClient.connect(token, new RongIMClient.ConnectCallback() {
                @Override
                public void onTokenIncorrect() {
                    Log.d("Login", "--onTokenIncorrect");
                }
                @Override
                public void onSuccess(String userid) {
                    Log.d("Login", "--onSuccess---" + userid);
                    RongIMClient.getInstance().getConversationList(new RongIMClient.ResultCallback<List<Conversation>>() {
                        @Override
                        public void onSuccess(List<Conversation> conversations) {
                            //首次登陆消息为空需要判断
                            if(conversations==null || conversations.size() ==0){
                                return;
                            }
                            for(int i=0;i<conversations.size();i++){
                                Conversation conversation = conversations.get(i);
                                //本回话最后一条消息
                                MessageContent messageContent = conversation.getLatestMessage();
                                String txt = "";
                                //如果是文本消息获取最后一条消息的文本内容
                                if(messageContent instanceof TextMessage){
                                    TextMessage tm = (TextMessage) messageContent;
                                    txt = tm.getContent();
                                }else{
                                    txt = "图片";
                                }
                                //获取消息发送的用户ID
                                //String sendUserId = conversation.getSenderUserId();
                                //获取消息发送的用户姓名
                                //String sendUserName = conversation.getSenderUserName();
                                //获取目标ID
                                String targetId = conversation.getTargetId();
                                myConversation mc = new myConversation(txt,targetId);
                                myConversations.add(mc);
                            }
                            if(myConversations.size()==0){
                                return;
                            }
                            putChatList(myConversations);
                        }
                        @Override
                        public void onError(RongIMClient.ErrorCode errorCode) {
                        }
                    }, Conversation.ConversationType.PRIVATE);
                }
                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    Log.d("Login", "--onError" + errorCode);
                    Toast.makeText(context,"尝试重新连接，请检查网络状态",Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
    private class MyReceiveMessageListener implements RongIMClient.OnReceiveMessageListener {
        /**
         * 收到消息的处理。
         * @param message 收到的消息实体。
         * @param left 剩余未拉取消息数目。
         */
        @Override
        public boolean onReceived(final Message message, int left) {
            //收到消息后 获取未读消息条数 返回
            RongIMClient.getInstance().getTotalUnreadCount(new RongIMClient.ResultCallback<Integer>() {
                @Override
                public void onSuccess(Integer integer) {
//                    int totalUnreadCount = integer;
//                    Toast.makeText(cordova.getActivity(),String.valueOf(totalUnreadCount),Toast.LENGTH_SHORT).show();
                    //拉取会话列表提供给前端刷新数据
                    RongIMClient.getInstance().getConversationList(new RongIMClient.ResultCallback<List<Conversation>>() {
                        @Override
                        public void onSuccess(List<Conversation> conversations) {
                            //消息为空需要判断
                            if(conversations==null || conversations.size() ==0){
                                return;
                            }
                            for(int i=0;i<conversations.size();i++){
                                Conversation conversation = conversations.get(i);
                                //本回话最后一条消息
                                MessageContent messageContent = conversation.getLatestMessage();
                                String txt = "";
                                //如果是文本消息获取最后一条消息的文本内容
                                if(messageContent instanceof TextMessage){
                                    TextMessage tm = (TextMessage) messageContent;
                                    txt = tm.getContent();
                                }else{
                                    txt = "图片";
                                }
                                //获取消息发送的用户ID
                                //String sendUserId = conversation.getSenderUserId();
                                //获取消息发送的用户姓名
                                //String sendUserName = conversation.getSenderUserName();
                                //获取目标ID
                                String targetId = conversation.getTargetId();
                                myConversation mc = new myConversation(txt,targetId);
                                myConversations.add(mc);
                            }
                            if(myConversations.size()==0){
                                return;
                            }
                            putChatList(myConversations);
                        }
                        @Override
                        public void onError(RongIMClient.ErrorCode errorCode) {

                        }
                    },Conversation.ConversationType.PRIVATE);
                }
                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                }
            });
            return false;
        }
    }
    //获取是否连接到融云
    public static final boolean getRmConnect(){
            String msg = RongIMClient.getInstance().getCurrentConnectionStatus().getMessage();
        if(msg.equals("Connect Success.")){
                return true;
            }else{
                return false;
            }
        }
    //内部类 传给前端界面的数据
    public class myConversation{
        private String latestTxt;
        private String targetId;
        public myConversation(){}
        public myConversation(String txt,String id){
            this.latestTxt = txt;
            this.targetId = id;
        }
        public void setLatestTxt(String txt){
            this.latestTxt = txt;
        }
        public void setTargetId(String id){
            this.targetId = id;
        }
        public String getLatestTxt(){
            return latestTxt;
        }
        public String getTargetId(){
            return targetId;
        }
    }
    private void putChatList(List<myConversation> list){
        if(list.size()==0){
            return;
        }
        JSONArray mJson =new JSONArray();
        for(int i=0;i<list.size();i++){
        try {
            JSONObject obj = new JSONObject();
            obj.put("latestTxt",list.get(i).getLatestTxt());
            obj.put("targetId", list.get(i).getTargetId());
            mJson.put(obj);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        }
        Log.i("hand",mJson.toString());
        // mCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, obj));
        mCallbackContext.success(mJson.toString());
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        //拉取会话列表提供给前端刷新数据
        RongIMClient.getInstance().getConversationList(new RongIMClient.ResultCallback<List<Conversation>>() {
            @Override
            public void onSuccess(List<Conversation> conversations) {
                //消息为空需要判断
                if (conversations == null || conversations.size() == 0) {
                    return;
                }
                for (int i = 0; i < conversations.size(); i++) {
                    Conversation conversation = conversations.get(i);
                    //本回话最后一条消息
                    MessageContent messageContent = conversation.getLatestMessage();
                    String txt = "";
                    //如果是文本消息获取最后一条消息的文本内容
                    if (messageContent instanceof TextMessage) {
                        TextMessage tm = (TextMessage) messageContent;
                        txt = tm.getContent();
                    } else {
                        txt = "图片";
                    }
                    //获取消息发送的用户ID
                    //String sendUserId = conversation.getSenderUserId();
                    //获取消息发送的用户姓名
                    //String sendUserName = conversation.getSenderUserName();
                    //获取目标ID
                    String targetId = conversation.getTargetId();
                    myConversation mc = new myConversation(txt, targetId);
                    myConversations.add(mc);
                }
                if (myConversations.size() == 0) {
                    return;
                }
                putChatList(myConversations);
            }
            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
            }
        }, Conversation.ConversationType.PRIVATE);
        super.onActivityResult(requestCode, resultCode, intent);
    }

    }
