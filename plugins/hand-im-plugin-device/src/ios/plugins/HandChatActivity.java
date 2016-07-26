package com.hand.im;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.RectF;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.view.ViewPager;
import android.text.Editable;
import android.text.SpannableString;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import io.rong.imlib.IRongCallback;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.MessageContent;
import io.rong.imlib.model.UserInfo;
import io.rong.message.ImageMessage;
import io.rong.message.TextMessage;
import io.rong.message.VoiceMessage;


public class HandChatActivity extends Activity implements View.OnClickListener,AdapterView.OnItemClickListener,VoiceLayout.OnSuccessListener{
    public static final String TAG = "HandChatActivity";
    public static final String IMAGE_UNSPECIFIED = "image/*";
    public static final String IMG = "IMG";
    public static final String TXT = "TXT";
    public static final String VOICE="VOICE";
    private static final int PHOTO_GRAPH = 1;// 拍照
    private static final int PHOTO_LIST = 2; // 相册界面
    private static String mSdRootPath = Environment.getExternalStorageDirectory().getPath();
    //用户信息
    private static String userId="";
    private static String token="";
    private static String access_token="";
    private static String userName="";
    //头像url
    private static String iconUrl="";
    //聊天对象信息
    private static String friendId="";
    private static String friendName="";
    private static String friendIcon="";
    //发送按钮
    private TextView send;
    //输入内容
    private EditText edit_content;
    //返回按钮
    private TextView textv_back;
    //标题 即接收消息的用户名
    private TextView textv_name;
    //拨打电话按钮
    private ImageView imgv_call;
    //功能图片按钮
    private ImageView imgv_emjoe,imgv_record,imgv_album,imgv_camera;
    //消息列表
    private ListView listv_content;
    //自定义录音布局快
    private VoiceLayout voice_layout;
    //消息内容
    private List<ChatContant> contentList;
    private HandChatContentAdapter adapter;
    /** 显示表情页的viewpager */
    private ViewPager vp_face;
    /** 表情页界面集合 */
    private ArrayList<View> pageViews;
    /** 游标显示布局 */
    private LinearLayout layout_point;
    /** 游标点集合 */
    private ArrayList<ImageView> pointViews;
    /** 表情集合 */
    private List<List<ChatEmoji>> emojis;
    /** 表情区域 */
    private View view;
    /** 表情数据填充器 */
    private List<FaceAdapter> faceAdapters;
    /** 当前表情页 */
    private int current = 0;
    /** 表情页的监听事件 */
    private OnCorpusSelectedListener mListener;
    //拍照图片保存地址
    private String cameraUrl = "";
    //用户信息
    private UserInfo uinfo;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        //setContentView(R.layout.hand_chat_act);
        setContentView(Util.getRS("hand_chat_act", "layout", HandChatActivity.this));
        Intent intent = getIntent();
        String type = intent.getStringExtra("TYPE");
        if(type !=null && type.equals("NORMAL")){
            userId = intent.getStringExtra("USERID");
            userName = intent.getStringExtra("USERNAME");
            iconUrl = intent.getStringExtra("ICONURL");
            token = intent.getStringExtra("TOKEN");
            friendId = intent.getStringExtra("FRIENDID");
            friendName = intent.getStringExtra("FRIENDNAME");
            friendIcon = intent.getStringExtra("FRIENDICON");
        }else if(type !=null && type.equals("NOTICE")){
            userId = intent.getStringExtra("MUSERID");
            userName = intent.getStringExtra("MUSERNAME");
            iconUrl = intent.getStringExtra("MICONURL");
            token = intent.getStringExtra("MTOKEN");
            friendId = intent.getStringExtra("MFRIENDID");
            friendName = intent.getStringExtra("MFRIENDNAME");
            friendIcon = intent.getStringExtra("MFRIENDICON");
        }
        android.net.Uri uri = Uri.parse(iconUrl);
        uinfo = new UserInfo(userId,userName,uri);
        emojis = FaceConversionUtil.getInstace(HandChatActivity.this).emojiLists;
        initView();
        initEditTextViewListener();
        initMyRongIM();
    }
    //加载融云
    private void initMyRongIM(){
        //单聊对象的ID 获取消息记录
        RongIMClient.getInstance().getLatestMessages(Conversation.ConversationType.PRIVATE,friendId, Integer.MAX_VALUE, new RongIMClient.ResultCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> messages) {
                if (messages != null) {
                    for (int i = (messages.size()-1); i >= 0; i--) {
                        String senderUserId = messages.get(i).getSenderUserId();
                        if(messages.get(i).getContent() instanceof ImageMessage){
                            ImageMessage im = (ImageMessage) messages.get(i).getContent();
                            Uri mThumUri = im.getThumUri();
                            Uri mLocalUri = im.getLocalUri();
                            Uri ryUri = im.getRemoteUri();
                            ChatContant md = new ChatContant(senderUserId,mThumUri,mLocalUri,ryUri,IMG);
                            contentList.add(md);
                        }else if(messages.get(i).getContent() instanceof TextMessage){
                            TextMessage tm = (TextMessage) messages.get(i).getContent();
                            String msg = tm.getContent();
                            ChatContant md = new ChatContant(senderUserId,msg,TXT);
                            contentList.add(md);
                        }else if(messages.get(i).getContent() instanceof VoiceMessage){
                            VoiceMessage voiceMessage = (VoiceMessage) messages.get(i).getContent();
                            Uri voiceUri = voiceMessage.getUri();
                            int duration = voiceMessage.getDuration();
                            ChatContant md = new ChatContant(senderUserId,voiceUri,VOICE,duration);
                            contentList.add(md);
                        }
                    }
                    adapter.notifyDataSetChanged();
                    listv_content.setSelection(listv_content.getBottom());
                }
            }
            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                Log.d(TAG, "getLatestMessages" + errorCode.getMessage());
            }
        });
        //设置消息监听
        RongIMClient.setOnReceiveMessageListener(new MyReceiveMessageListener());
        //发送文字消息
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!HandIMPlugin.getRmConnect()){
                    //获取token 建立连接
                    Toast.makeText(HandChatActivity.this,"连接中断，准备重连",Toast.LENGTH_SHORT).show();
                    connect(token);
                    return;
                }
                if (view.getVisibility() == View.VISIBLE) {
                    view.setVisibility(View.GONE);
                }
                if(voice_layout.getVisibility() == View.VISIBLE){
                    voice_layout.setVisibility(View.GONE);
                }
                final String content = edit_content.getText().toString();
                if(content==null || content.isEmpty()){
                    return;
                }
                //登录用户ID
                ChatContant md = new ChatContant(userId,content,TXT);
                contentList.add(md);
                adapter.notifyDataSetChanged();
                listv_content.setSelection(listv_content.getBottom());
                edit_content.setText("");
                TextMessage tm = TextMessage.obtain(content);
                tm.setUserInfo(uinfo);
                //发送测试消息
                //单聊对象的ID
                RongIMClient.getInstance().sendMessage(Conversation.ConversationType.PRIVATE, friendId,
                        tm, null, null, new RongIMClient.SendMessageCallback() {
                            @Override
                            public void onSuccess(Integer integer) {
                            }

                            @Override
                            public void onError(Integer integer, RongIMClient.ErrorCode errorCode) {
                            }
                        }, null);
            }
        });
    }
    //加载布局控件
    private void initView(){
        //voice_layout = (VoiceLayout) findViewById(R.id.voice_layout);
        voice_layout = (VoiceLayout) findViewById(Util.getRS("voice_layout","id",HandChatActivity.this));
        voice_layout.setListener(this);
        edit_content = (EditText) findViewById(Util.getRS("edit_content","id",HandChatActivity.this));
        listv_content = (ListView) findViewById(Util.getRS("listv_content","id",HandChatActivity.this));
        textv_back = (TextView) findViewById(Util.getRS("textv_back","id",HandChatActivity.this));
        textv_back.setOnClickListener(this);
        textv_name = (TextView) findViewById(Util.getRS("textv_name","id",HandChatActivity.this));
        imgv_call = (ImageView) findViewById(Util.getRS("imgv_call","id",HandChatActivity.this));
        imgv_call.setOnClickListener(this);
        imgv_emjoe = (ImageView) findViewById(Util.getRS("imgv_emjoe","id",HandChatActivity.this));
        imgv_emjoe.setOnClickListener(this);
        imgv_record = (ImageView) findViewById(Util.getRS("imgv_record","id",HandChatActivity.this));
        imgv_record.setOnClickListener(this);
        imgv_album = (ImageView) findViewById(Util.getRS("imgv_album","id",HandChatActivity.this));
        imgv_album.setOnClickListener(this);
        imgv_camera = (ImageView) findViewById(Util.getRS("imgv_camera","id",HandChatActivity.this));
        imgv_camera.setOnClickListener(this);
        //加载顶部信息layout
//        listv_content.addHeaderView(LayoutInflater.from(this).inflate( R.layout.chat_header_view, null),null,false);
        send = (TextView) findViewById(Util.getRS("btn_send","id",HandChatActivity.this));
        contentList = new ArrayList<ChatContant>();
        adapter = new HandChatContentAdapter(HandChatActivity.this,contentList,userId,friendId,friendIcon);
        listv_content.setAdapter(adapter);
        listv_content.setSelection(listv_content.getBottom());
        vp_face = (ViewPager) findViewById(Util.getRS("vp_contains","id",HandChatActivity.this));
        layout_point = (LinearLayout) findViewById(Util.getRS("iv_image","id",HandChatActivity.this));
        view = findViewById(Util.getRS("ll_facechoose","id",HandChatActivity.this));
        textv_name.setText(friendName);
        Init_viewPager();
        Init_Point();
        Init_Data();
    }
    /**
     * 初始化显示表情的viewpager
     */
    private void Init_viewPager() {
        pageViews = new ArrayList<View>();
        pageViews.clear();
        // 左侧添加空页
        View nullView1 = new View(this);
        // 设置透明背景
        nullView1.setBackgroundColor(Color.TRANSPARENT);
        pageViews.add(nullView1);
        // 中间添加表情页
        faceAdapters = new ArrayList<FaceAdapter>();
        for (int i = 0; i < emojis.size(); i++) {
            GridView view = new GridView(this);
            FaceAdapter adapter = new FaceAdapter(this, emojis.get(i));
            view.setAdapter(adapter);
            faceAdapters.add(adapter);
            view.setOnItemClickListener(this);
            view.setNumColumns(6);
            view.setBackgroundColor(Color.TRANSPARENT);
            view.setHorizontalSpacing(1);
            view.setVerticalSpacing(1);
            view.setStretchMode(GridView.STRETCH_COLUMN_WIDTH);
            view.setCacheColorHint(0);
            view.setPadding(5, 0, 5, 0);
            view.setSelector(new ColorDrawable(Color.TRANSPARENT));
            view.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.FILL_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT));
            view.setGravity(Gravity.CENTER);
            pageViews.add(view);
        }
        // 右侧添加空页面
        View nullView2 = new View(this);
        // 设置透明背景
        nullView2.setBackgroundColor(Color.TRANSPARENT);
        pageViews.add(nullView2);
    }
    /**
     * 初始化游标
     */
    private void Init_Point() {
        pointViews = new ArrayList<ImageView>();
        pointViews.clear();
        ImageView imageView;
        for (int i = 0; i < pageViews.size(); i++) {
            imageView = new ImageView(this);
            imageView.setBackgroundResource(Util.getRS("d1","drawable",HandChatActivity.this));
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                    new ViewGroup.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT,
                            LinearLayout.LayoutParams.WRAP_CONTENT));
            layoutParams.leftMargin = 10;
            layoutParams.rightMargin = 10;
            layoutParams.width = 8;
            layoutParams.height = 8;
            layout_point.addView(imageView, layoutParams);
            if (i == 0 || i == pageViews.size() - 1) {
                imageView.setVisibility(View.GONE);
            }
            if (i == 1) {
                imageView.setBackgroundResource(Util.getRS("d2","drawable",HandChatActivity.this));
            }
            pointViews.add(imageView);
        }
    }
    /**
     * 填充数据
     */
    private void Init_Data() {
        vp_face.setAdapter(new ViewPagerAdapter(pageViews));
        vp_face.setCurrentItem(1);
        current = 0;
        vp_face.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageSelected(int arg0) {
                current = arg0 - 1;
                // 描绘分页点
                draw_Point(arg0);
                // 如果是第一屏或者是最后一屏禁止滑动，其实这里实现的是如果滑动的是第一屏则跳转至第二屏，如果是最后一屏则跳转到倒数第二屏.
                if (arg0 == pointViews.size() - 1 || arg0 == 0) {
                    if (arg0 == 0) {
                        vp_face.setCurrentItem(arg0 + 1);// 第二屏 会再次实现该回调方法实现跳转.
                        pointViews.get(1).setBackgroundResource(Util.getRS("d2","drawable",HandChatActivity.this));
                    } else {
                        vp_face.setCurrentItem(arg0 - 1);// 倒数第二屏
                        pointViews.get(arg0 - 1).setBackgroundResource(
                                Util.getRS("d2","drawable",HandChatActivity.this));
                    }
                }
            }
            @Override
            public void onPageScrolled(int arg0, float arg1, int arg2) {
            }
            @Override
            public void onPageScrollStateChanged(int arg0) {
            }
        });

    }
    /**
     * 绘制游标背景
     */
    public void draw_Point(int index) {
        for (int i = 1; i < pointViews.size(); i++) {
            if (index == i) {
                pointViews.get(i).setBackgroundResource(Util.getRS("d2","drawable",HandChatActivity.this));
            } else {
                pointViews.get(i).setBackgroundResource(Util.getRS("d1","drawable",HandChatActivity.this));
            }
        }
    }
    //输入框事件监听 由于单个输入框需要监听事件太多 抽出来方便寻找
    private void initEditTextViewListener(){
        edit_content.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (view.getVisibility() == View.VISIBLE) {
                    view.setVisibility(View.GONE);
                }
                if(voice_layout.getVisibility() == View.VISIBLE){
                    voice_layout.setVisibility(View.GONE);
                }
            }
        });
        edit_content.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (view.getVisibility() == View.VISIBLE) {
                    view.setVisibility(View.GONE);
                }
                if(voice_layout.getVisibility() == View.VISIBLE){
                    voice_layout.setVisibility(View.GONE);
                }
                return false;
            }
        });
        edit_content.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String str = "";
                str = edit_content.getText().toString();
                if(str.equals("")){
                    send.setTextColor(Color.parseColor("#FFD2D2D2"));
                }else{
                    send.setTextColor(Color.parseColor("#6BB9F0"));
                }
            }
            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }
    //控件点击事件监听
    @Override
    public void onClick(View v) {
        int textv_back_id = Util.getRS("textv_back","id",HandChatActivity.this);
        int imgv_call_id = Util.getRS("imgv_call","id",HandChatActivity.this);
        int imgv_emjoe_id = Util.getRS("imgv_emjoe","id",HandChatActivity.this);
        int imgv_record_id = Util.getRS("imgv_record","id",HandChatActivity.this);
        int imgv_album_id = Util.getRS("imgv_album","id",HandChatActivity.this);
        int imgv_camera_id = Util.getRS("imgv_camera","id",HandChatActivity.this);
        if(v.getId() == textv_back_id){
            Intent intent = getIntent();
            intent.putExtra("FID",friendId);
            setResult(0x0000,intent);
            //返回
            this.finish();
        }else if(v.getId() == imgv_call_id){
            //拨打电话
            Toast.makeText(HandChatActivity.this, "敬请期待", Toast.LENGTH_SHORT).show();
        }else if(v.getId() == imgv_emjoe_id){
            //隐藏软键盘
            View pdView = getWindow().peekDecorView();
            if (pdView != null) {
                InputMethodManager inputmanger = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                inputmanger.hideSoftInputFromWindow(pdView.getWindowToken(), 0);
            }
            if(voice_layout.getVisibility() == View.VISIBLE){
                voice_layout.setVisibility(View.GONE);
            }
            // 表情选择框
            if (view.getVisibility() == View.VISIBLE) {
                view.setVisibility(View.GONE);
            } else {
                view.setVisibility(View.VISIBLE);
            }
        }else if(v.getId() == imgv_record_id){
            //隐藏软键盘
            View pdView1 = getWindow().peekDecorView();
            if (pdView1 != null) {
                InputMethodManager inputmanger = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                inputmanger.hideSoftInputFromWindow(pdView1.getWindowToken(), 0);
            }
            if (view.getVisibility() == View.VISIBLE) {
                view.setVisibility(View.GONE);
            }
            if(voice_layout.getVisibility() == View.VISIBLE){
                voice_layout.setVisibility(View.GONE);
            }else{
                voice_layout.setVisibility(View.VISIBLE);
            }
        }else if(v.getId() == imgv_album_id){
            if(!HandIMPlugin.getRmConnect()){
                //获取token 建立连接
                Toast.makeText(HandChatActivity.this,"连接中断，准备重连",Toast.LENGTH_SHORT).show();
                connect(token);
                return;
            }
            //相册选择
            Intent albumIntent = new Intent(Intent.ACTION_PICK, null);
            albumIntent.setType(IMAGE_UNSPECIFIED);
            startActivityForResult(albumIntent, PHOTO_LIST);
        }else if(v.getId() == imgv_camera_id){
            if(!HandIMPlugin.getRmConnect()){
                //获取token 建立连接
                Toast.makeText(HandChatActivity.this,"连接中断，准备重连",Toast.LENGTH_SHORT).show();
                connect(token);
                return;
            }
            //调用系统拍照功能 拍照
            String state = Environment.getExternalStorageState();
            if (state.equals(Environment.MEDIA_MOUNTED)) {
                Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                cameraUrl = mSdRootPath+"/hand.jpg";
                intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(new File(cameraUrl)));
                startActivityForResult(intent, PHOTO_GRAPH);
            } else {
                Toast.makeText(HandChatActivity.this, "没有SD卡", Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        ChatEmoji emoji = (ChatEmoji) faceAdapters.get(current).getItem(position);
        int face_del_icon_id = Util.getRS("face_del_icon", "drawable", HandChatActivity.this);
        if (emoji.getId() == face_del_icon_id) {
            int selection = edit_content.getSelectionStart();
            String text = edit_content.getText().toString();
            if (selection > 0) {
                String text2 = text.substring(selection - 1);
                if ("]".equals(text2)) {
                    int start = text.lastIndexOf("[");
                    int end = selection;
                    edit_content.getText().delete(start, end);
                    return;
                }
                edit_content.getText().delete(selection - 1, selection);
            }
        }
        if (!TextUtils.isEmpty(emoji.getCharacter())) {
            if (mListener != null)
                mListener.onCorpusSelected(emoji);
            SpannableString spannableString = FaceConversionUtil.getInstace(HandChatActivity.this)
                    .addFace(this, emoji.getId(), emoji.getCharacter());
            edit_content.append(spannableString);
        }
    }

    private class MyReceiveMessageListener implements RongIMClient.OnReceiveMessageListener {
        /**
         * 收到消息的处理。
         * @param message 收到的消息实体。
         * @param left 剩余未拉取消息数目。
         * @return
         */
        @Override
        public boolean onReceived(final Message message, int left) {
            //收到消息后 获取未读消息条数 返回
            RongIMClient.getInstance().getTotalUnreadCount(new RongIMClient.ResultCallback<Integer>() {
                @Override
                public void onSuccess(Integer integer) {
                    int totalUnreadCount = integer;
                    String senderUserId = message.getSenderUserId();
                    //如果是单聊对象发来的消息 则加入到列表中
                    if(senderUserId.equals(friendId)){
                        if(message.getContent() instanceof ImageMessage){
                            ImageMessage im = (ImageMessage) message.getContent();
                            Uri mThumUri = im.getThumUri();
                            Uri mLocalUri = im.getLocalUri();
                            Uri ryUri = im.getRemoteUri();
                            ChatContant md = new ChatContant(senderUserId,mThumUri,mLocalUri,ryUri,IMG);
                            contentList.add(md);
                            adapter.notifyDataSetChanged();
                            listv_content.setSelection(listv_content.getBottom());
                        }else if(message.getContent() instanceof TextMessage){
                            TextMessage tm = (TextMessage) message.getContent();
                            String msg = tm.getContent();
                            ChatContant md = new ChatContant(senderUserId,msg,TXT);
                            contentList.add(md);
                            adapter.notifyDataSetChanged();
                            listv_content.setSelection(listv_content.getBottom());
                        }else if(message.getContent() instanceof VoiceMessage){
                            VoiceMessage voiceMessage = (VoiceMessage) message.getContent();
                            Uri voiceUri = voiceMessage.getUri();
                            int duration = voiceMessage.getDuration();
                            ChatContant md = new ChatContant(senderUserId,voiceUri,VOICE,duration);
                            contentList.add(md);
                            adapter.notifyDataSetChanged();
                            listv_content.setSelection(listv_content.getBottom());
                        }
                    }
                }
                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    Log.d(TAG,"MyReceiveMessageListener"+errorCode.toString());
                }
            });
            return false;
        }
    }
    public class ChatContant {
        private String fromUser;
        private String txt;
        //压缩图片路径
        private Uri mThumUri;
        //本地原图路径
        private Uri mLocalUri;
        //服务器图片路径
        private Uri ryUri;
        //服务器语音路径
        private Uri voiceUri;
        //用来区分是图片消息还是文本消息 IMG-图片消息 TXT-文本消息
        private String type;
        private int duration;
        public ChatContant(){
            super();
        }
        public ChatContant(String from,String text,String type){
            this.fromUser = from;
            this.txt = text;
            this.type = type;
        }
        public ChatContant(String from,Uri thumUri,Uri localUri,Uri ryUri,String type){
            this.fromUser = from;
            this.type = type;
            this.mThumUri = thumUri;
            this.mLocalUri = localUri;
            this.ryUri = ryUri;
        }
        public ChatContant(String from,Uri voiceUri,String type,int duration){
            this.fromUser = from;
            this.voiceUri = voiceUri;
            this.type = type;
            this.duration = duration;
        }
        public void setFromUser(String fs){
            this.fromUser = fs;
        }
        public void setTxt(String txt){
            this.txt = txt;
        }
        public void setmThumUri(Uri thumUri){
            this.mThumUri = thumUri;
        }
        public void setmLocalUri(Uri localUri){
            this.mLocalUri = localUri;
        }
        public void setRyUri(Uri ryUri){
            this.ryUri = ryUri;
        }
        public void setType(String type){
            this.type = type;
        }
        public void setVoiceUri(Uri voiceUri){this.voiceUri=voiceUri;}
        public void setDuration(int dur){this.duration = dur;}
        public String getFromUser(){
            return fromUser;
        }
        public String getTxt(){
            return txt;
        }
        public Uri getmThumUri(){
            return mThumUri;
        }
        public Uri getmLocalUri(){
            return mLocalUri;
        }
        public Uri getRyUri(){
            return ryUri;
        }
        public String getType(){
            return type;
        }
        public Uri getVoiceUri(){return  voiceUri;}
        public int getDuration(){return duration;}
    }

    public interface OnCorpusSelectedListener {
        void onCorpusSelected(ChatEmoji emoji);
        void onCorpusDeleted();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //判断是否连接到即时通讯服务器 进行重连操作
        //获取相册选择到的照片 或者照相机拍摄到的照片
        if(resultCode == RESULT_OK){
            switch (requestCode) {
                case PHOTO_GRAPH:
                    if (cameraUrl != null && !cameraUrl.equals("")) {
                        Log.i("Hand cameraUrl", cameraUrl);
                        sendImg(cameraUrl);
                    } else {
                        Toast.makeText(HandChatActivity.this, "图片路径不正确", Toast.LENGTH_SHORT).show();
                    }
                    break;
                case PHOTO_LIST:
                    Uri photoUrl = data.getData();
                    if (photoUrl != null) {
//                        sendImg(photoUrl.getPath());
                        String[] proj = {MediaStore.Images.Media.DATA};
                        Cursor cursor = HandChatActivity.this.getContentResolver().query(photoUrl, proj, null, null, null);
                        if ( null != cursor ) {
                            if ( cursor.moveToFirst() ) {
                                int index = cursor.getColumnIndex( MediaStore.Images.ImageColumns.DATA );
                                if ( index > -1 ) {
                                    String path = cursor.getString( index );
                                    sendImg(path);
                                }
                            }
                            cursor.close();
                        }else {
                            sendImg(photoUrl.getPath());
                        }
////                       Log.i("Hand path", path);
//                        sendImg(path);
                    }
                    break;
            }
        }
            super.onActivityResult(requestCode, resultCode, data);
    }

    //发送图片消息
    private void sendImg(String path){
        //发送图片消息
        File imageFileSource = new File(getCacheDir(), "source.jpg");
        File imageFileThumb = new File(getCacheDir(), "thumb.jpg");
        try {
            // 读取图片。
            // 读取图片。
            InputStream is = new FileInputStream(new File(path));
            //InputStream is = getAssets().open("file://"+path);
            Bitmap bmpSource = BitmapFactory.decodeStream(is);
            imageFileSource.createNewFile();
            FileOutputStream fosSource = new FileOutputStream(imageFileSource);
            // 保存原图。
            bmpSource.compress(Bitmap.CompressFormat.JPEG, 100, fosSource);
            // 创建缩略图变换矩阵。
            Matrix m = new Matrix();
            m.setRectToRect(new RectF(0, 0, bmpSource.getWidth(), bmpSource.getHeight()), new RectF(0, 0, 160, 160), Matrix.ScaleToFit.CENTER);
            // 生成缩略图。
            Bitmap bmpThumb = Bitmap.createBitmap(bmpSource, 0, 0, bmpSource.getWidth(), bmpSource.getHeight(), m, true);
            imageFileThumb.createNewFile();
            FileOutputStream fosThumb = new FileOutputStream(imageFileThumb);
            // 保存缩略图。
            bmpThumb.compress(Bitmap.CompressFormat.JPEG, 60, fosThumb);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }
        ImageMessage imgMsg = ImageMessage.obtain(Uri.fromFile(imageFileThumb), Uri.fromFile(imageFileSource));
        imgMsg.setUserInfo(uinfo);
        RongIMClient.getInstance().sendImageMessage(Conversation.ConversationType.PRIVATE, friendId, imgMsg, "", "", new RongIMClient.SendImageMessageCallback() {
            @Override
            public void onAttached(Message message) {
                //保存数据库成功
                Log.i("Hand", "保存数据库成功");
            }
            @Override
            public void onError(Message message, RongIMClient.ErrorCode code) {
                //发送失败
                Log.i("Hand", "发送失败");
            }
            @Override
            public void onSuccess(Message message) {
                //发送成功
                Log.i("Hand", "发送成功");
                //刷新
                String senderUserId = message.getSenderUserId();
                ImageMessage im = (ImageMessage) message.getContent();
                Uri mThumUri = im.getThumUri();
                Uri mLocalUri = im.getLocalUri();
                Uri ryUri = im.getRemoteUri();
                ChatContant md = new ChatContant(senderUserId, mThumUri, mLocalUri, ryUri, IMG);
                contentList.add(md);
                adapter.notifyDataSetChanged();
                listv_content.setSelection(listv_content.getBottom());
            }

            @Override
            public void onProgress(Message message, int progress) {
                //发送进度
                Log.i("Hand", String.valueOf(progress));
            }
        });
    }
    //录音成功后回调
    @Override
    public void onSuccess(String path,int time) {
        try {
            File voiceFile = new File(getCacheDir(), "voice.amr");
            try {
                // 读取音频文件。
                File oldfile = new File(path);
                InputStream is = new FileInputStream(oldfile);
                OutputStream os = new FileOutputStream(voiceFile);
                byte[] buffer = new byte[1024];
                int bytesRead;
                // 写入缓存文件。
                while ((bytesRead = is.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
                is.close();
                os.flush();
                os.close();
                //删除原音频文件
                try {
                    File file = new File(path);
                    file.delete();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            VoiceMessage vocMsg = VoiceMessage.obtain(Uri.fromFile(voiceFile), time);
            vocMsg.setUserInfo(uinfo);
            if(!HandIMPlugin.getRmConnect()){
                //获取token 建立连接
                Toast.makeText(HandChatActivity.this,"连接中断，准备重连",Toast.LENGTH_SHORT).show();
                connect(token);
                return;
            }
            sendMessage(vocMsg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**
     * 建立与融云服务器的连接
     */
    private void connect(final String mtoken) {
        if (HandChatActivity.this.getApplicationInfo().packageName.equals(getCurProcessName(HandChatActivity.this))) {
            RongIMClient.connect(mtoken, new RongIMClient.ConnectCallback() {
                @Override
                public void onTokenIncorrect() {
                    Log.d("Login", "--onTokenIncorrect");
                }
                @Override
                public void onSuccess(String userid) {
                }
                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    Toast.makeText(HandChatActivity.this,"尝试重新连接，请检查网络状态",Toast.LENGTH_SHORT).show();
                }
            });
        }
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
    //处理返回按钮逻辑
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if(keyCode == KeyEvent.KEYCODE_BACK){
            if (view.getVisibility() == View.VISIBLE) {
                view.setVisibility(View.GONE);
                return false;
            }
        }
        return super.onKeyDown(keyCode, event);
    }
    private void sendMessage(final MessageContent msg) {
            RongIMClient.getInstance().sendMessage(Conversation.ConversationType.PRIVATE, friendId, msg, null, null, new IRongCallback.ISendMessageCallback() {
                @Override
                public void onAttached(io.rong.imlib.model.Message message) {
                    if(voice_layout.getVisibility() == View.GONE){
                    voice_layout.setVisibility(View.VISIBLE);}
                }
                @Override
                public void onError(io.rong.imlib.model.Message message, RongIMClient.ErrorCode errorCode) {
                    if(voice_layout.getVisibility() == View.GONE){
                        voice_layout.setVisibility(View.VISIBLE);}
                }
                @Override
                public void onSuccess(io.rong.imlib.model.Message message) {
                    if (msg instanceof VoiceMessage) {
                        String senderUserId = message.getSenderUserId();
                        VoiceMessage voiceMessage = (VoiceMessage) msg;
                        Uri voiceUri = voiceMessage.getUri();
                        int duration = voiceMessage.getDuration();
                        ChatContant cd = new ChatContant(senderUserId,voiceUri,VOICE,duration);
                        contentList.add(cd);
                        adapter.notifyDataSetChanged();
                        listv_content.setSelection(listv_content.getBottom());
                        if(voice_layout.getVisibility() == View.GONE){
                            voice_layout.setVisibility(View.VISIBLE);}
                    }
                }
            });

        }

}
