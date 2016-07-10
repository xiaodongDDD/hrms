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
import java.util.ArrayList;
import java.util.List;

import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Message;
import io.rong.message.ImageMessage;
import io.rong.message.TextMessage;
import com.hand_china.hrms.R;

public class HandChatActivity extends Activity implements View.OnClickListener,AdapterView.OnItemClickListener{
    public static final String TAG = "HandChatActivity";
    public static final String IMAGE_UNSPECIFIED = "image/*";
    public static final String IMG = "IMG";
    public static final String TXT = "TXT";
    private static final int PHOTO_GRAPH = 1;// 拍照
    private static final int PHOTO_LIST = 2; // 相册界面
    private static String mSdRootPath = Environment.getExternalStorageDirectory().getPath();
    //当前的用户ID
    private String userId="";
    //单聊消息接收者的ID
    private String friendId="";
    //token防止连接中断需要重新连接的操作
    private String token="";
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
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.hand_chat_act);
        Intent intent = getIntent();
        userId = intent.getStringExtra("USERID");
        Log.i("HandChatActivity","userId="+userId);
        friendId = intent.getStringExtra("FRIENDID");
        Log.i("HandChatActivity","friendId="+friendId);
        token = intent.getStringExtra("TOKEN");
        Log.i("HandChatActivity","token="+token);
        emojis = FaceConversionUtil.getInstace().emojiLists;
        initView();
        initEditTextViewListener();
        //单聊对象的ID 获取消息记录 这里只区分图片消息和文本消息
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
                //发送测试消息
                //单聊对象的ID
                RongIMClient.getInstance().sendMessage(Conversation.ConversationType.PRIVATE, friendId,
                        TextMessage.obtain(content), null, null, new RongIMClient.SendMessageCallback() {
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
        edit_content = (EditText) findViewById(R.id.edit_content);
        listv_content = (ListView) findViewById(R.id.listv_content);
        textv_back = (TextView) findViewById(R.id.textv_back);
        textv_back.setOnClickListener(this);
        textv_name = (TextView) findViewById(R.id.textv_name);
        imgv_call = (ImageView) findViewById(R.id.imgv_call);
        imgv_call.setOnClickListener(this);
        imgv_emjoe = (ImageView) findViewById(R.id.imgv_emjoe);
        imgv_emjoe.setOnClickListener(this);
        imgv_record = (ImageView) findViewById(R.id.imgv_record);
        imgv_record.setOnClickListener(this);
        imgv_album = (ImageView) findViewById(R.id.imgv_album);
        imgv_album.setOnClickListener(this);
        imgv_camera = (ImageView) findViewById(R.id.imgv_camera);
        imgv_camera.setOnClickListener(this);
        //加载顶部信息layout
//        listv_content.addHeaderView(LayoutInflater.from(this).inflate( R.layout.chat_header_view, null),null,false);
        send = (TextView) findViewById(R.id.btn_send);
        contentList = new ArrayList<ChatContant>();
        adapter = new HandChatContentAdapter(HandChatActivity.this,contentList,userId,friendId);
        listv_content.setAdapter(adapter);
        listv_content.setSelection(listv_content.getBottom());
        vp_face = (ViewPager) findViewById(R.id.vp_contains);
        layout_point = (LinearLayout) findViewById(R.id.iv_image);
        view = findViewById(R.id.ll_facechoose);
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
            view.setNumColumns(7);
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
            imageView.setBackgroundResource(R.drawable.d1);
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
                imageView.setBackgroundResource(R.drawable.d2);
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
                        pointViews.get(1).setBackgroundResource(R.drawable.d2);
                    } else {
                        vp_face.setCurrentItem(arg0 - 1);// 倒数第二屏
                        pointViews.get(arg0 - 1).setBackgroundResource(
                                R.drawable.d2);
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
                pointViews.get(i).setBackgroundResource(R.drawable.d2);
            } else {
                pointViews.get(i).setBackgroundResource(R.drawable.d1);
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
            }
        });
        edit_content.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (view.getVisibility() == View.VISIBLE) {
                    view.setVisibility(View.GONE);
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
        switch (v.getId()){
            case R.id.textv_back:
                //返回
                this.finish();
                break;
            case R.id.imgv_call:
                //拨打电话
                Toast.makeText(HandChatActivity.this, "敬请期待", Toast.LENGTH_SHORT).show();
                break;
            case R.id.imgv_emjoe:
                //隐藏软键盘
                View pdView = getWindow().peekDecorView();
                if (pdView != null) {
                    InputMethodManager inputmanger = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    inputmanger.hideSoftInputFromWindow(pdView.getWindowToken(), 0);
                }
                // 表情选择框
                if (view.getVisibility() == View.VISIBLE) {
                    view.setVisibility(View.GONE);
                } else {
                    view.setVisibility(View.VISIBLE);
                }
                break;
            case R.id.imgv_record:
                //发送语音
                Toast.makeText(HandChatActivity.this, "敬请期待", Toast.LENGTH_SHORT).show();
                break;
            case R.id.imgv_album:
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
                break;
            case R.id.imgv_camera:
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
                break;
        }
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        ChatEmoji emoji = (ChatEmoji) faceAdapters.get(current).getItem(position);
        if (emoji.getId() == R.drawable.face_del_icon) {
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
            SpannableString spannableString = FaceConversionUtil.getInstace()
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
                    adapter.notifyDataSetChanged();
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
                            listv_content.setSelection(listv_content.getBottom());}}
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
        private Uri mThumUri;
        private Uri mLocalUri;
        private Uri ryUri;
        //用来区分是图片消息还是文本消息 IMG-图片消息 TXT-文本消息
        private String type;
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
    }

    public interface OnCorpusSelectedListener {
        void onCorpusSelected(ChatEmoji emoji);
        void onCorpusDeleted();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //判断是否连接到即时通讯服务器 进行重连操作
        //获取相册选择到的照片 或者照相机拍摄到的照片
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
                        String[] proj = {MediaStore.Images.Media.DATA};
                        //好像是android多媒体数据库的封装接口，具体的看Android文档
                        Cursor cursor = managedQuery(photoUrl, proj, null, null, null);
                        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                        cursor.moveToFirst();
                        String path = cursor.getString(column_index);
                        Log.i("Hand path", path);
                        sendImg(path);
                    }
                    break;
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
                Log.i("Hand",String.valueOf(progress));
            }
        });
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
}
