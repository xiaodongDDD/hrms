package com.hand.im;

import android.app.ActivityManager;
import android.app.KeyguardManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Parcelable;
import android.os.PowerManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;

import io.rong.imlib.model.Discussion;

import com.hand.im.DBhelper;
import com.hand.im.FaceConversionUtil;
import com.hand.im.HandChatActivity;
import com.hand.im.HandMulChatActivity;
import com.hand.im.LoginInfo;
import com.hand.im.activity.CallActivity;
import com.hand.im.activity.MulCallActivity;
import com.hand.im.contact.ContactActivity;
import com.nostra13.universalimageloader.cache.memory.impl.LruMemoryCache;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import io.rong.calllib.IRongReceivedCallListener;
import io.rong.calllib.RongCallClient;
import io.rong.calllib.RongCallSession;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.MessageContent;
import io.rong.imlib.model.UserInfo;
import io.rong.message.ImageMessage;
import io.rong.message.TextMessage;
import io.rong.message.VoiceMessage;


public class HandIMPlugin extends CordovaPlugin implements IRongReceivedCallListener {

    public static final String ACTION_GET_CHAT_LIST = "getChatList";
    public static final String ACTION_TO_CHAT_ACT = "toChatAct";
    public static final String ACTION_DELETE_CHAT = "deleteConversationList";
    public static final String ACTION_RETURN_CONVERSATION = "returnConversationList";
	public static final String ACTION_LOG_OUT = "exitApp";
	
    public static final int RESULT = 1;
    private static Context context;
    //用户信息
    private static String userId = "";
    private static String token = "";
    private static String access_token = "";
    private static String userName = "";
    //讨论组信息
    private static String targetId = "";
    private static String groupName = "";
    private static String groupIcon = "";
    //头像url
    private static String iconUrl = "";
    //聊天对象信息
    private static String friendId = "";
    private static String friendName = "";
    private static String friendIcon = "";
    private CallbackContext mCallbackContext;
    private List<myConversation> myConversations;
    private DBhelper dBhelper;

    //锁屏、唤醒相关
    private KeyguardManager km;
    private KeyguardManager.KeyguardLock kl;
    private PowerManager pm;
    private PowerManager.WakeLock wl;
    private SharedPreferences sp;

    private String token_url;

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        sp = cordova.getActivity().getSharedPreferences("config", Context.MODE_PRIVATE);
        //初始化基本数据和界面数据
        init();
        initRY();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        mCallbackContext = callbackContext;
        if (ACTION_GET_CHAT_LIST.equals(action)) {

//            JSONObject jsonObject = new JSONObject(args.getString(0));
//            userId = jsonObject.getString("userId");
//            token = jsonObject.getString("RCToken");
//            access_token = jsonObject.getString("access_token");
//            token_url = jsonObject.getString("token_url");
//            sp.edit().putString("access_token", access_token).commit();
            //获取用户的id 这里定义上为进入初始化的操作 但是还是加了判断防止多次进入 如果已经接受过传来的用户数据不用重复获取
            if (args != null && args.length() > 0) {
                JSONObject obj = args.getJSONObject(0);
                userId = obj.getString("userId");
                token = obj.getString("RCToken");
                access_token = obj.getString("access_token");
                token_url = obj.getString("businessUrl");
                LoginInfo.userId = userId;//px
                LoginInfo.access_token = access_token;//px
                LoginInfo.baseUrl = token_url;
                sp.edit().putString("access_token", access_token).commit();
            }

            if (!access_token.isEmpty()) {
                //开启线程 获取信息写入缓存
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
//                            URL url = new URL(LoginInfo.baseUrl+"/hrmsv2/v2/api/staff/detail?access_token=" + access_token);
                            URL url = new URL(token_url+"/hrmsv2/v2/api/staff/detail?access_token=" + access_token);
                            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                            connection.setRequestMethod("POST");
                            connection.setConnectTimeout(5000);
                            connection.setReadTimeout(30000);
                            connection.setDoOutput(true);// 是否输入参数
                            connection.setDoInput(true);
                            connection.setRequestProperty("Content-Type", "application/json");
                            connection.connect();
                            DataOutputStream out = new DataOutputStream(connection.getOutputStream());
                            JSONObject obj = new JSONObject();
                            obj.put("key", userId);
                            out.writeBytes(obj.toString());
                            out.flush();
                            out.close();
                            //读取响应
                            BufferedReader reader = new BufferedReader(new InputStreamReader(
                                    connection.getInputStream()));
                            String lines;
                            StringBuffer sb = new StringBuffer("");
                            while ((lines = reader.readLine()) != null) {
                                lines = new String(lines.getBytes(), "utf-8");
                                sb.append(lines);
                            }
                            System.out.println(sb);
                            reader.close();
                            // 断开连接
                            connection.disconnect();
                            JSONObject jsobj = new JSONObject(sb.toString());
                            JSONArray jarry = (JSONArray) jsobj.get("rows");
                            JSONObject empObj = (JSONObject) jarry.get(0);
                            userName = (String) empObj.get("emp_name");
                            iconUrl = (String) empObj.get("avatar");
                            LoginInfo.userName = userName;//px
                            LoginInfo.userIcon = iconUrl;//px
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
            //如果传来的数据是空的做一个判断控制
            if (token.equals("")) {
                Toast.makeText(context, "未获取到数据", Toast.LENGTH_SHORT).show();
                return true;
            }
            //如果未连接融云 需要连接并在连接成功后获取会话列表
            if (RongIMClient.getInstance() == null) {
                initRY();
            }
            if (!getRmConnect()) {
                //获取token 建立连接
                connect(token);
            } else {
                //返回数据
                try {
                    getChatListInfo();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return true;
        } else if (ACTION_TO_CHAT_ACT.equals(action)) {
            //获取消息发送对象的ID
            //判断连接状态
            if (args != null && args.length() > 0) {
                JSONObject obj = args.getJSONObject(0);
                friendId = obj.getString("friendId");
                friendName = obj.getString("friendName");
                friendIcon = obj.getString("friendIcon");
				String telephoneNumbers = obj.optString("telephoneNumbers");
				if(telephoneNumbers!=null&&!telephoneNumbers.equals("")) {
					sp.edit().putString("telephoneNumbers", telephoneNumbers).commit();
				}
            }
            if (RongIMClient.getInstance() == null) {
                initRY();
            }
            if (!getRmConnect()) {
                //获取token 建立连接
                connect(token);
            }
            if (userId.isEmpty() || friendId.isEmpty() || token.isEmpty()) {
                Toast.makeText(context, "没有用户数据", Toast.LENGTH_SHORT).show();
                return true;
            }
            dBhelper.addUserInfo(friendId, friendName, friendIcon);
            if (getRmConnect()) {
                Intent intent = new Intent(cordova.getActivity(), HandChatActivity.class);
                intent.putExtra("TYPE", "NORMAL");
                intent.putExtra("USERID", userId);
                intent.putExtra("USERNAME", userName);
                intent.putExtra("ICONURL", iconUrl);
                intent.putExtra("TOKEN", token);
                intent.putExtra("FRIENDID", friendId);
                intent.putExtra("FRIENDNAME", friendName);
                intent.putExtra("FRIENDICON", friendIcon);
                cordova.setActivityResultCallback(this);
                cordova.startActivityForResult(this, intent, RESULT);
//                cordova.getActivity().startActivity(intent);
            } else {
                Toast.makeText(context, "准备重新连接，请检查网络状态", Toast.LENGTH_SHORT).show();
                if (!getRmConnect()) {
                    //获取token 建立连接
                    connect(token);
                }
            }
            return true;
        } else if (ACTION_DELETE_CHAT.equals(action)) {
            String targetId = "";
            String type = "";
            if (args != null && args.length() > 0) {
                //targetId = (String) args.get(0);
                JSONObject obj = args.getJSONObject(0);
                targetId = obj.getString("friendId");
                type = obj.getString("conversationType");
            }
            Conversation.ConversationType deleteType =null;
            if(type.equals("2")){
                deleteType = Conversation.ConversationType.DISCUSSION;
            }else if(type.equals("1")){
                deleteType = Conversation.ConversationType.PRIVATE;
            }
            if(deleteType!=null) {
                RongIMClient.getInstance().removeConversation(deleteType, targetId, new RongIMClient.ResultCallback<Boolean>() {
                    @Override
                    public void onSuccess(Boolean aBoolean) {
                        //删除成功
                        mCallbackContext.success("Success");
                    }

                    @Override
                    public void onError(RongIMClient.ErrorCode errorCode) {
                        mCallbackContext.error("Error");
                    }
                });
            }
            return true;
        } else if (ACTION_RETURN_CONVERSATION.equals(action)) {
            try {
                getChatListInfo();
            } catch (Exception e) {
                e.printStackTrace();
            }
//            mCallbackContext.success();
            return true;
        } else if (action.equals("createDiscussion")) {//panxu
            if (RongIMClient.getInstance() == null) {
                initRY();
            }
            if (!getRmConnect()) {
                //获取token 建立连接
                connect(token);
            }
            if (userId.isEmpty() || token.isEmpty()) {
                Toast.makeText(context, "没有用户数据", Toast.LENGTH_SHORT).show();
                return true;
            }
            Intent intent = new Intent(cordova.getActivity(), ContactActivity.class);
            intent.putExtra("TYPE", "NORMAL");
            intent.putExtra("USERID", userId);//用户Id
            intent.putExtra("USERNAME", userName);//用户姓名
            intent.putExtra("ICONURL", iconUrl);//用户头像
            intent.putExtra("TOKEN", token);
            cordova.startActivityForResult(this, intent, 0);
        } else if (action.equals("openDiscussion")) {//panxu

//            JSONObject jsonObject = new JSONObject(args.getString(0));
//            targetId = jsonObject.getString("targetId");

            //  groupName = jsonObject.getString("groupName");
            //  groupIcon = jsonObject.getString("groupIcon");
            if (args != null && args.length() > 0) {
                JSONObject obj = args.getJSONObject(0);
                targetId = obj.getString("discussionId");
            }

            if (RongIMClient.getInstance() == null) {
                initRY();
            }
            if (!getRmConnect()) {
                //获取token 建立连接
                connect(token);
            }
            if (userId.isEmpty() || targetId.isEmpty() || token.isEmpty()) {
                Toast.makeText(context, "没有用户数据", Toast.LENGTH_SHORT).show();
                return true;
            }

            if (getRmConnect()) {
                Intent intent = new Intent(cordova.getActivity(), HandMulChatActivity.class);
                intent.putExtra("TYPE", "NORMAL");
                intent.putExtra("USERID", userId);//用户Id
                intent.putExtra("USERNAME", userName);//用户姓名
                intent.putExtra("ICONURL", iconUrl);//用户头像
                intent.putExtra("TOKEN", token);
                intent.putExtra("TARGETID", targetId);
                //  intent.putExtra("GROUPNAME", groupName);
                //  intent.putExtra("GROUPICON", groupIcon);
                cordova.setActivityResultCallback(this);
                cordova.startActivityForResult(this, intent, RESULT);
//                cordova.getActivity().startActivity(intent);
            } else {
                Toast.makeText(context, "准备重新连接，请检查网络状态", Toast.LENGTH_SHORT).show();
                if (!getRmConnect()) {
                    //获取token 建立连接
                    connect(token);
                }
            }
        }else if(ACTION_LOG_OUT.equals(action)){
            if(RongIMClient.getInstance()!=null){
                RongIMClient.getInstance().logout();
            }
        }
        return false;

    }

    //初始化操作
    public void init() {
        context = cordova.getActivity().getApplicationContext();
        myConversations = new ArrayList<myConversation>();
        dBhelper = new DBhelper(context);
        //初始化表情数据
        FaceConversionUtil.getInstace(cordova.getActivity().getApplicationContext()).getFileText(cordova.getActivity().getApplication());
        //初始化ImageLoader
        initImageLoader(context);
    }

    public void initRY() {
        //初始化融云
        if (cordova.getActivity().getApplicationInfo().packageName.equals(getCurProcessName(context)) ||
                "io.rong.push".equals(getCurProcessName(context))) {
            RongIMClient.init(cordova.getActivity());
        }
        //设置消息监听（需要在连接之前）
        RongIMClient.setOnReceiveMessageListener(new MyReceiveMessageListener());
        RongCallClient.setReceivedCallListener(this);
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
     *
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
                    try {
                        getChatListInfo();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    Log.d("Login", "--onError" + errorCode);
                    Toast.makeText(context, "尝试重新连接，请检查网络状态", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////  接到语音通话回调 //////////////////////////////////
    @Override
    public void onReceivedCall(RongCallSession rongCallSession) {
        String name = rongCallSession.getConversationType().name();
        if ("PRIVATE".equals(name)) {//单人电话
            Intent intent = new Intent(context, CallActivity.class);
            intent.putExtra("isReceiverCall", true);
            intent.putExtra("callerUserId", rongCallSession.getCallerUserId());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } else if ("DISCUSSION".equals(name)) {//讨论组电话
            Intent intent = new Intent(context, MulCallActivity.class);
            intent.putExtra("action", "audio_incoming");//来电
            intent.putExtra("callerUserId", rongCallSession.getCallerUserId());//呼叫的userId
            intent.putExtra("targetId", rongCallSession.getTargetId());
            intent.putExtra("selfUserId", rongCallSession.getSelfUserId());//自己的userId
            intent.putParcelableArrayListExtra("usersProfileList", (ArrayList<? extends Parcelable>) rongCallSession.getParticipantProfileList());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
        wakeAndUnlock(true);
    }

    @Override
    public void onCheckPermission(RongCallSession rongCallSession) {
        Log.e("399", "onCheckPermission");
        Log.e("399", "getCallerUserId:" + rongCallSession.getCallerUserId());
        String name = rongCallSession.getConversationType().name();
        if ("PRIVATE".equals(name)) {//单人电话
            Intent intent = new Intent(context, CallActivity.class);
            intent.putExtra("isReceiverCall", true);
            intent.putExtra("callerUserId", rongCallSession.getCallerUserId());
            intent.putExtra("startForCheckPermissions", true);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } else if ("DISCUSSION".equals(name)) {//讨论组电话
            Intent intent = new Intent(context, MulCallActivity.class);
            intent.putExtra("action", "audio_incoming");//来电
            intent.putExtra("callerUserId", rongCallSession.getCallerUserId());//呼叫的userId
            intent.putExtra("targetId", rongCallSession.getTargetId());
            intent.putExtra("selfUserId", rongCallSession.getSelfUserId());//自己的userId
            intent.putExtra("startForCheckPermissions", true);
            intent.putParcelableArrayListExtra("usersProfileList", (ArrayList<? extends Parcelable>) rongCallSession.getParticipantProfileList());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
        wakeAndUnlock(true);
    }

    private void wakeAndUnlock(boolean b) {
        if (b) {
            //获取电源管理器对象
            pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);

            //获取PowerManager.WakeLock对象，后面的参数|表示同时传入两个值，最后的是调试用的Tag
            wl = pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "bright");

            //点亮屏幕
            wl.acquire();

            //得到键盘锁管理器对象
            km = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
            kl = km.newKeyguardLock("unLock");

            //解锁
            kl.disableKeyguard();
        } else {
            //锁屏
            kl.reenableKeyguard();

            //释放wakeLock，关灯
            wl.release();
        }

    }

    ////////////////////////////////////////////////////////////////////////////
    private class MyReceiveMessageListener implements RongIMClient.OnReceiveMessageListener {
        /**
         * 收到消息的处理。
         *
         * @param message 收到的消息实体。
         * @param left    剩余未拉取消息数目。
         */
        @Override
        public boolean onReceived(final Message message, int left) {
            //收到消息后 获取未读消息条数 返回
            RongIMClient.getInstance().getTotalUnreadCount(new RongIMClient.ResultCallback<Integer>() {
                @Override
                public void onSuccess(Integer integer) {
//                  int totalUnreadCount = integer;
                    MessageContent theMC = message.getContent();

                    //收到消息 肯定是别人发的
                    UserInfo mcInfo = theMC.getUserInfo();
                    if (mcInfo != null) {
                        dBhelper.addUserInfo(mcInfo.getUserId(), mcInfo.getName(), mcInfo.getPortraitUri().toString());
                    }
                    try {
                        getChatListInfo();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
					//解析message
                    MessageContent mc = message.getContent();
                    String ContentText = "";
                    String fromName = "";
                    //如果是文本消息获取最后一条消息的文本内容
                    if (mc instanceof TextMessage) {
                        TextMessage tm = (TextMessage) mc;
                        ContentText = tm.getContent();

                    } else if (mc instanceof ImageMessage) {
                        ContentText = "图片";
                    } else if (mc instanceof VoiceMessage) {
                        ContentText = "语音";
                    }
                    if (mcInfo != null) {
                        fromName = mcInfo.getName();
                        ContentText = fromName + ":" + ContentText;
                    }
                    String targetId = message.getTargetId();
                    Intent intent = new Intent(cordova.getActivity(), cordova.getActivity().getClass());
                    intent.putExtra("TYPE", "NOTICE");
                    intent.putExtra("MUSERID", userId);
                    intent.putExtra("MUSERNAME", userName);
                    intent.putExtra("MICONURL", iconUrl);
                    intent.putExtra("MTOKEN", token);
                    intent.putExtra("MFRIENDID", targetId);
                    intent.putExtra("MFRIENDNAME", friendName);
                    intent.putExtra("MFRIENDICON", friendIcon);
                    PendingIntent pendingIntent = PendingIntent.getActivity(context, (int) (Math.random() * 1000) + 1, intent, 0);
                    //获取目标ID
                    //通知栏提示
                    NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
                    NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context);
                    mBuilder.setContentTitle("消息提醒")//设置通知栏标题
                            .setContentText(ContentText)
                            .setContentIntent(pendingIntent) //设置通知栏点击意图
                            .setTicker("会话通知") //通知首次出现在通知栏，带上升动画效果的
                            .setWhen(System.currentTimeMillis())//通知产生的时间，会在通知信息里显示，一般是系统获取到的时间
                            .setDefaults(Notification.DEFAULT_VIBRATE)//向通知添加声音、闪灯和振动效果.setAutoCancel(true)
                            .setAutoCancel(true)
                            .setSmallIcon(Util.getRS("header", "drawable", cordova.getActivity().getApplicationContext()));//设置通知小ICON
                    //.setSmallIcon(R.drawable.header);//设置通知小ICON
                    Notification notification = mBuilder.build();
                    notification.flags |= Notification.FLAG_AUTO_CANCEL;
                    if(!ContentText.isEmpty()) {
                        mNotificationManager.notify(0, mBuilder.build());
                    }
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                }
            });
            return false;
        }
    }

    //获取是否连接到融云
    public static final boolean getRmConnect() {
        String msg = RongIMClient.getInstance().getCurrentConnectionStatus().getMessage();
        if (msg.equals("Connect Success.")) {
            return true;
        } else {
            return false;
        }
    }

    //内部类 传给前端界面的数据
    public class myConversation {
        private String content;
        private String sendId;
        private String sendTime;
        private String messageNum;
        private String userName;
        private String userIcon;
        private String conversationType;
        private String sortTime;

        public myConversation() {
        }

        public myConversation(String txt, String id, String time, String sortTime, String num, String userName, String userIcon, String conversationType) {
            this.content = txt;
            this.sendId = id;
            this.sendTime = time;
            this.sortTime = sortTime;
            this.messageNum = num;
            this.userName = userName;
            this.userIcon = userIcon;
            this.conversationType = conversationType;
        }

        public void setSortTime(String sortTime) {
            this.sortTime = sortTime;
        }

        public String getSortTime() {
            return sortTime;
        }

        public void setContent(String txt) {
            this.content = txt;
        }

        public void setSendId(String id) {
            this.sendId = id;
        }

        public void setSendTime(String time) {
            this.sendTime = time;
        }

        public void setMessageNum(String num) {
            this.messageNum = num;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public void setUserIcon(String userIcon) {
            this.userIcon = userIcon;
        }

        public String getConten() {
            return content;
        }

        public String getSendId() {
            return sendId;
        }

        public String getSendTime() {
            return sendTime;
        }

        public String getMessageNum() {
            return messageNum;
        }

        public String getUserName() {
            return userName;
        }

        public String getUserIcon() {
            return userIcon;
        }

        public String getConversationType() {
            return conversationType;
        }

        public void setConversationType(String conversationType) {
            this.conversationType = conversationType;
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        //设置消息监听（需要在连接之前）
        if (dBhelper == null) {
            dBhelper = new DBhelper(cordova.getActivity().getApplicationContext());
        }
        if (RongIMClient.getInstance() != null) {
            RongIMClient.setOnReceiveMessageListener(new MyReceiveMessageListener());
        } else {
            initRY();
        }
        if (!getRmConnect()) {
            //获取token 建立连接
            connect(token);
        }
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        //清空静态数据
    }

    private void getChatListInfo() throws Exception {

        if (RongIMClient.getInstance() == null || !getRmConnect()) {
            return;
        }
        //拉取会话列表提供给前端刷新数据
        RongIMClient.getInstance().getConversationList(new RongIMClient.ResultCallback<List<Conversation>>() {
            public void onSuccess(List<Conversation> conversations) {
                //清空之前列表
                if (myConversations != null) {
                    myConversations.clear();
                }
                //消息为空需要判断
                if (conversations == null || conversations.size() == 0) {
                    putChatList(myConversations);
                    return;
                }
                for (int i = 0; i < conversations.size(); i++) {
                    Conversation conversation = conversations.get(i);
                    String targetId = conversation.getTargetId();
                    if (dBhelper == null || targetId == null || targetId.equals("")) {
                        continue;
                    }
                    //本回话最后一条消息
                    MessageContent messageContent = conversation.getLatestMessage();
                    //获取消息发送的用户姓名
                    String sendUserName = "";
                    String iconPath = "";
                    DBhelper.MyConversation mc = dBhelper.getUserInfo(targetId);
                    sendUserName = mc.getTargetName();
                    iconPath = mc.getTargetIconUrl();
                    String txt = "";
                    String userInfoName = "";
                    String conversationType = conversation.getConversationType().getName();//panxu update
                    if(conversationType.equals("private")){
                        conversationType="1";
                    }else if(conversationType.equals("discussion")){
                        conversationType="2";
                    }
                    //如果是文本消息获取最后一条消息的文本内容
                    if (messageContent instanceof TextMessage) {
                        TextMessage tm = (TextMessage) messageContent;
                        txt = tm.getContent();
                    } else if (messageContent instanceof ImageMessage) {
                        txt = "图片";
                    } else if (messageContent instanceof VoiceMessage) {
                        txt = "语音";
                    }
                    if(conversationType!=null&&conversationType.equals("2")){
                        UserInfo uinfo  = messageContent.getUserInfo();
                        if(uinfo!=null&&!uinfo.getUserId().equals(userId)){
                            txt = uinfo.getName()+":"+txt;
                        }
                    }

                    long time = conversation.getSentTime();
                    Date date = new Date(time);
                    Date currentDate = new Date();
                    SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    if(date.getYear()==currentDate.getYear()&&date.getMonth()==currentDate.getMonth()&&date.getDate()==currentDate.getDate()){
                        sd = new SimpleDateFormat("HH:mm");
                    }else if(date.getYear()==currentDate.getYear()&&date.getMonth()==currentDate.getMonth()){
                        sd = new SimpleDateFormat("MM-dd HH:mm");
                    }
                    
                    String mTime = sd.format(date);
                    SimpleDateFormat sortTimeFormat = new SimpleDateFormat("yyyyMMddHHmmss");
                    String sortTime = sortTimeFormat.format(date);
                    //获取未读消息数量
                    int num = conversation.getUnreadMessageCount();
                    if (conversationType.equals("2")) {
                        if (iconPath == null || iconPath.equals("")) {
                            iconPath = LoginInfo.url_group_icon;
                        }
                        if (sendUserName == null || sendUserName.equals("")) {
                            sendUserName = "讨论组";
                        }
                    }

                    myConversation myCon = new myConversation(txt, targetId, mTime, sortTime, String.valueOf(num), sendUserName, iconPath, conversationType);
                    myConversations.add(myCon);
                }
                putChatList(myConversations);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
            }
        });
        //}, Conversation.ConversationType.PRIVATE); /*pan xu update for discussion*/
    }

    private void putChatList(List<myConversation> list) {
        if (list == null || list.size() == 0) {
          //  return;
        }
        JSONArray mJson = new JSONArray();
        for (int i = 0; i < list.size(); i++) {
            try {
                JSONObject obj = new JSONObject();
                obj.put("sendId", list.get(i).getSendId());
                obj.put("content", list.get(i).getConten());
                obj.put("sendTime", list.get(i).getSendTime());
                obj.put("sortTime", list.get(i).getSortTime());
                obj.put("messageNum", list.get(i).getMessageNum());
                obj.put("userName", list.get(i).getUserName());

                obj.put("userIcon", list.get(i).getUserIcon());
                obj.put("conversationType", list.get(i).getConversationType());
                mJson.put(new JSONObject().put("message", obj));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        //Log.i("hand", mJson.toString());
        JSONObject result = new JSONObject();
        try {
            result.put("message", mJson);
        } catch (JSONException e) {
        }
        //通过注入js的方法 调用前端js
        String format = "HandIMPlugin.openNotificationInAndroidCallback(%s);";
        final String js = String.format(format, result.toString());
        if (webView != null) {
            HandIMPlugin.this.webView.loadUrl("javascript:" + js);
        }
        mCallbackContext.success(result);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (requestCode == RESULT && (resultCode == 3 || resultCode == 2 || resultCode == 0x0000)) {
            try {
                getChatListInfo();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


}
