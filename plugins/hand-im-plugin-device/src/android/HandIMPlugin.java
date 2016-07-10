package com.hand.im;

import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;
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
import com.hand_china.hrms.R;

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
        initRY();
    }
    @Override
    public boolean execute(String action, JSONArray args,CallbackContext callbackContext) throws JSONException {
        context=cordova.getActivity().getApplicationContext();
        mCallbackContext = callbackContext;
        if(ACTION_GET_CHAT_LIST.equals(action)){
            //获取用户的id 这里定义上为进入初始化的操作 但是还是加了判断防止多次进入 如果已经接受过传来的用户数据不用重复获取
            if(userId.isEmpty() || token.isEmpty()){
            if(args!=null && args.length()>0){
                JSONObject obj = args.getJSONObject(0);
                userId = obj.getString("userId");
                token = obj.getString("token");
            }}
            //如果传来的数据是空的做一个判断控制
            if(token.equals("")){
                Toast.makeText(context,"未获取到数据",Toast.LENGTH_SHORT).show();
                return true;
            }
            //如果未连接融云 需要连接并在连接成功后获取会话列表
            if(RongIMClient.getInstance() == null){
                initRY();
            }
            if(!getRmConnect()){
                //获取token 建立连接
                connect(token);
            }else{
                //返回数据
                getChatListInfo();
            }
            return true;
        }else if(ACTION_TO_CHAT_ACT.equals(action)){
            //区分两种入口 一种是会话列表点击进入 一种是联系人列表点击进入 进入到消息界面
            //获取消息发送对象的ID
            //判断连接状态
            if(args!=null && args.length()>0){
                JSONObject obj = args.getJSONObject(0);
            friendId = obj.getString("friendId");}
            if(RongIMClient.getInstance() == null){
                initRY();
            }
            if(!getRmConnect()){
                //获取token 建立连接
                connect(token);
            }
            if(userId.isEmpty()||friendId.isEmpty()||token.isEmpty()){
                Toast.makeText(context,"没有用户数据",Toast.LENGTH_SHORT).show();
                return true;
            }
            if(getRmConnect()){
                Intent intent = new Intent(cordova.getActivity(),HandChatActivity.class);
                intent.putExtra("USERID",userId);
                intent.putExtra("FRIENDID",friendId);
                intent.putExtra("TOKEN",token);
//                cordova.setActivityResultCallback(this);
//                cordova.startActivityForResult(this, intent, RESULT);
                cordova.getActivity().startActivity(intent);
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
        context=cordova.getActivity().getApplicationContext();
        myConversations = new ArrayList<myConversation>();
        //初始化表情数据
        FaceConversionUtil.getInstace().getFileText(cordova.getActivity().getApplication());
        //初始化ImageLoader
        initImageLoader(context);
    }
    public void initRY(){
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
                    getChatListInfo();
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
//                  int totalUnreadCount = integer;
//                    getChatListInfo();
                    //通过注入js的方法 调用前端js
//                    String format = "HandIMPlugin.MessageInAndroidCallback(%s);";
//                    final String js = String.format(format, String.valueOf(integer));
//                    HandIMPlugin.this.webView.loadUrl("javascript:" + js);
                    //解析message
                    MessageContent mc = message.getContent();
                    String ContentText = "";
                    //如果是文本消息获取最后一条消息的文本内容
                    if (mc instanceof TextMessage) {
                        TextMessage tm = (TextMessage) mc;
                        ContentText = tm.getContent();
                    } else {
                        ContentText = "图片";
                    }
                    String targetId = message.getTargetId();
                    Intent intent = new Intent(context,HandChatActivity.class);
                    intent.putExtra("USERID",userId);
                    intent.putExtra("FRIENDID",targetId);
                    intent.putExtra("TOKEN",token);
                    PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
                    //获取目标ID
                    //通知栏提示
                    NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
                    NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context);
                    mBuilder.setContentTitle(targetId)//设置通知栏标题
                            .setContentText(ContentText)
                    .setContentIntent(pendingIntent) //设置通知栏点击意图
                    .setTicker("会话通知") //通知首次出现在通知栏，带上升动画效果的
                    .setWhen(System.currentTimeMillis())//通知产生的时间，会在通知信息里显示，一般是系统获取到的时间
                    .setOngoing(false)//ture，设置他为一个正在进行的通知。他们通常是用来表示一个后台任务,用户积极参与(如播放音乐)或以某种方式正在等待,因此占用设备(如一个文件下载,同步操作,主动网络连接)
                    .setDefaults(Notification.DEFAULT_VIBRATE)//向通知添加声音、闪灯和振动效果的最简单、最一致的方式是使用当前的用户默认设置，使用defaults属性，可以组合
                    .setSmallIcon(R.drawable.header);//设置通知小ICON
                    Notification notification = mBuilder.build();
                    notification.flags = Notification.FLAG_AUTO_CANCEL;
                    mNotificationManager.notify(Integer.valueOf(targetId), mBuilder.build());
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

    @Override
    public void onStart() {
        super.onStart();
        //设置消息监听（需要在连接之前）
        if(RongIMClient.getInstance()!=null){
            RongIMClient.setOnReceiveMessageListener(new MyReceiveMessageListener());
        }else{
            initRY();
            RongIMClient.setOnReceiveMessageListener(new MyReceiveMessageListener());
        }
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    private void getChatListInfo(){
    //拉取会话列表提供给前端刷新数据
    RongIMClient.getInstance().getConversationList(new RongIMClient.ResultCallback<List<Conversation>>() {
        @Override
        public void onSuccess(List<Conversation> conversations) {
            //清空之前列表
            myConversations.clear();
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
            putChatList(myConversations);
        }
        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {
        }
    }, Conversation.ConversationType.PRIVATE);
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
        Log.i("hand", mJson.toString());
        // mCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, obj));
        mCallbackContext.success(mJson.toString());
    }
//    @Override
//    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
//        super.onActivityResult(requestCode, resultCode, intent);
//        if(requestCode == RESULT){
//            myConversations.clear();
//
//        }
//    }

}
