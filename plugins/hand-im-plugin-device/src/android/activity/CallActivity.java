package com.hand.im.activity;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.os.Vibrator;
import android.text.TextUtils;
import android.util.Log;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.control.PlayControl;
import com.hand.im.model.NameModel;
import com.hand.im.model.RequestModel;
import com.hand.im.service.PlayService;
import com.hand.im.widget.CallFloatBoxView;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.display.RoundedBitmapDisplayer;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import io.rong.calllib.IRongCallListener;
import io.rong.calllib.RongCallClient;
import io.rong.calllib.RongCallCommon;
import io.rong.calllib.RongCallSession;
import okhttp3.Cache;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by cool on 2016/8/23.
 */
public class CallActivity extends BaseActivity implements IRongCallListener, View.OnClickListener {

    private static final int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 100;
    private boolean startForCheckPermissions = false;

    private ImageView mMinimizeImageView;
    private ImageView mHeadImageView;
    private TextView mNameTextView;
    private TextView mCallStateTextView;
    private ImageButton mCallCancelImageButton;
    private ImageButton mMuteImageButton;
    private ImageButton mHandFreeImageButton;
    private String targetId;
    private LinearLayout mStartVoiceChatContainer;
    private LinearLayout mAnswerVoiceChatContainer;
    private LinearLayout mMuteContainer;
    private LinearLayout mHandFreeContainer;
    private LinearLayout mHandUpConatiner;
    private LinearLayout mAcceptCallContainer;
    private ImageButton mAcceptCallImageButton;
    private ImageButton mHangUpCallImageButton;
    private static SharedPreferences sp;
    private String callerUserId;//呼叫方id
    private boolean isReceiverCall;//是否是接到来电
    private boolean isOnThePhone;//是否正在通话中
    private PlayControl playControl;
//    private boolean isMuteImageButtonSelect = false;//静音按钮是否按下
//    private boolean isHandFreeImageButtonSelect = false;//免提按钮是否按下
    private ServiceConnection connection;
    private String friendName;
    private String friendIcon;
    private DisplayImageOptions options;
    private OkHttpClient mOkHttpClient;
    private String net_state;
    private AlertDialog alertDialog;

    @Override
    public int getLayoutId() {
        Log.e("399", "onCreate");
        sp = getSharedPreferences("config", Context.MODE_PRIVATE);
        net_state = sp.getString("net_state","");
//        Log.e("399","net_state:" + net_state);
        if("NETWORK_ERROR".equals(net_state)){//此处处理的逻辑思路为：当发起方发起通话请求时，发的请求时网络是好的，刚发出请求网络就出问题了，界面显示就会出问题
            if (playControl != null) {
                playControl.stop();
            }
            sp.edit().putString("net_state","").commit();
            showToast("当前网络不可用，请检查您的网络设置");
            finish();
        }
        return Util.getRS("activity_call","layout",this);
    }

    @Override
    protected void intView() {
        mMinimizeImageView = (ImageView) findViewById(Util.getRS("iv_minimize","id",this));//最小化窗口
        mHeadImageView = (ImageView) findViewById(Util.getRS("iv_head","id",this));
        mNameTextView = (TextView) findViewById(Util.getRS("tv_name","id",this));
        mCallStateTextView = (TextView) findViewById(Util.getRS("tv_call_state","id",this));
        mCallCancelImageButton = (ImageButton) findViewById(Util.getRS("ib_call_cancel","id",this));
        mMuteImageButton = (ImageButton) findViewById(Util.getRS("ib_mute","id",this));
        mHandFreeImageButton = (ImageButton) findViewById(Util.getRS("ib_hand_free","id",this));
        mAcceptCallImageButton = (ImageButton) findViewById(Util.getRS("ib_accept_call","id",this));
        mHangUpCallImageButton = (ImageButton) findViewById(Util.getRS("bt_hang_up_call","id",this));
        mStartVoiceChatContainer = (LinearLayout) findViewById(Util.getRS("ll_start_voice_chat_cotainer","id",this));
        mAnswerVoiceChatContainer = (LinearLayout) findViewById(Util.getRS("ll_answer_voice_chat_cotainer","id",this));
        mMuteContainer = (LinearLayout) findViewById(Util.getRS("ll_mute_container","id",this));
        mHandFreeContainer = (LinearLayout) findViewById(Util.getRS("ll_hand_free_container","id",this));
        mHandUpConatiner = (LinearLayout) findViewById(Util.getRS("ll_hand_up_container","id",this));
        mAcceptCallContainer = (LinearLayout) findViewById(Util.getRS("ll_accept_call_container","id",this));

        mNameTextView.setText(friendName);
        mCallStateTextView.setText("正在等待对方接受邀请...");
        if (TextUtils.isEmpty(friendIcon)) {
            mHeadImageView.setImageResource(Util.getRS("head_1","drawable",this));
        } else {
            ImageLoader.getInstance().displayImage(friendIcon, mHeadImageView, options);
        }

        if (isReceiverCall) {//是否是接受来电
            mStartVoiceChatContainer.setVisibility(View.GONE);//(静音，挂断，免提)容器隐藏
            mAnswerVoiceChatContainer.setVisibility(View.VISIBLE);//(接听，挂断)容器隐藏
            mCallStateTextView.setText("是否接受对方来电...");
            loadCallUserInfo();
        }

        if (isOnThePhone) {//是否正在通话
            controlViewVisibility();
            time = CallFloatBoxView.hideFloatBox();
            long activeTime = getIntent().getLongExtra("time", 0);
            long t = System.currentTimeMillis() - activeTime;
            time = (int) (t / 1000);//以通话时长

            setupTime(mCallStateTextView);//设置通话时长
        }

        Intent intent = new Intent(this, PlayService.class);
        startService(intent);

        connection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                playControl = (PlayControl) iBinder;
                if (isReceiverCall) {
                    playControl.play("ringing.mp3");
                    startVibrator();//开始震动
                } else {
                    if (!playControl.isPlaying() && !"NETWORK_ERROR".equals(net_state)) {
                        playControl.play("outgoing.mp3");
                    }
                }
            }

            @Override
            public void onServiceDisconnected(ComponentName componentName) {

            }
        };
        bindService(intent, connection, BIND_AUTO_CREATE);
    }

    @Override
    protected void initData() {
        initOptions();
        initOkHttp();
        RongCallClient.getInstance().setVoIPCallListener(this);
        isReceiverCall = getIntent().getBooleanExtra("isReceiverCall", false);//是否是接到来电
        callerUserId = getIntent().getStringExtra("callerUserId");//来电的userId
        targetId = getIntent().getStringExtra("targetId");
        isOnThePhone = getIntent().getBooleanExtra("isOnThePhone", false);
        startForCheckPermissions = getIntent().getBooleanExtra("startForCheckPermissions", false);
        friendName = getIntent().getStringExtra("friendName");
        friendIcon = getIntent().getStringExtra("friendIcon");
        if (isReceiverCall) {
            targetId = callerUserId;
        }

        if (!requestCallPermissions(RongCallCommon.CallMediaType.AUDIO)) {
            return;
        }
    }


    @Override
    protected void initListeners() {
        mMinimizeImageView.setOnClickListener(this);
        mCallCancelImageButton.setOnClickListener(this);
        mMuteImageButton.setOnClickListener(this);
        mHandFreeImageButton.setOnClickListener(this);
        mAcceptCallImageButton.setOnClickListener(this);
        mHangUpCallImageButton.setOnClickListener(this);
    }


    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// click event callBack     /////////////////////////
    @Override
    public void onClick(View view) {

        int ib_call_cancel = Util.getRS("ib_call_cancel","id",this);//挂断电话
        int ib_mute = Util.getRS("ib_mute","id",this);//静音
        int ib_hand_free = Util.getRS("ib_hand_free","id",this);//免提
        int ib_accept_call = Util.getRS("ib_accept_call","id",this);//接听
        int bt_hang_up_call = Util.getRS("bt_hang_up_call","id",this);//拒绝接听
        int iv_minimize = Util.getRS("iv_minimize","id",this);//最小化窗口

        if(view.getId() == ib_call_cancel){//挂断电话
            String userId;
            if (isReceiverCall || isOnThePhone) {
                userId = callerUserId;
            } else {
                userId = targetId;
            }
            RongCallClient.getInstance().hangUpCall(userId);
        }else if(view.getId() == ib_mute){//静音
            mMuteImageButton.setSelected(isMuteImageButtonSelect ? false : true);
            isMuteImageButtonSelect = !isMuteImageButtonSelect;
            RongCallClient.getInstance().setEnableLocalAudio(!isMuteImageButtonSelect);
        }else if(view.getId() == ib_hand_free){//免提
            mHandFreeImageButton.setSelected(isHandFreeImageButtonSelect ? false : true);
            isHandFreeImageButtonSelect = !isHandFreeImageButtonSelect;
            RongCallClient.getInstance().setEnableSpeakerphone(isHandFreeImageButtonSelect);
        }else if(view.getId() == ib_accept_call){//接听
            RongCallClient.getInstance().acceptCall(callerUserId);
            if (playControl != null) {
                playControl.stop();
            }
            controlViewVisibility();
        }else if(view.getId() == bt_hang_up_call){//拒绝接听
            RongCallClient.getInstance().hangUpCall(callerUserId);
            if (playControl != null) {
                playControl.stop();
            }
            finish();
        }else if(view.getId() == iv_minimize){//最小化窗口
            Log.e("399", "friendIcon::" + friendIcon);
            CallFloatBoxView.showFloatBox(getApplication(), time, targetId, callerUserId, friendName, friendIcon);//启动悬浮窗口
            finish();
        }

    }
    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// 发起语音通话回调//////////////////////////////////////

    @Override
    public void onCallOutgoing(RongCallSession rongCallSession, SurfaceView surfaceView) {
        Log.e("399", "onCallOutgoing");
        mStartVoiceChatContainer.setVisibility(View.VISIBLE);//(静音，挂断，免提)容器显示
        mAnswerVoiceChatContainer.setVisibility(View.GONE);//(接听，挂断)容器隐藏
        mMuteContainer.setVisibility(View.GONE);//静音按钮容器隐藏，通话建立之后再显示
        mHandFreeContainer.setVisibility(View.GONE);//免提按钮容器隐藏，通话建立之后再显示
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = cm.getActiveNetworkInfo();
        if (networkInfo == null || !networkInfo.isConnected() || !networkInfo.isAvailable()) {
            Toast.makeText(this, "当前网络不可用，请检查您的网络设置", Toast.LENGTH_SHORT).show();
            if (playControl != null) {
                playControl.stop();
            }
            if (isReceiverCall) {
                cancelVibrator();//取消震动
            }
            finish();
        }
    }

    @Override
    public void onCallConnected(RongCallSession rongCallSession, SurfaceView surfaceView) {
        Log.e("399", "onCallConnected");
        if (playControl != null) {
            playControl.stop();
        }
        if (isReceiverCall) {
            cancelVibrator();//取消震动
        }
        setupTime(mCallStateTextView);//设置通话时长
        controlViewVisibility();
    }


    @Override
    public void onCallDisconnected(RongCallSession rongCallSession, RongCallCommon.CallDisconnectedReason callDisconnectedReason) {
        Log.e("399", "onCallDisconnected");
        /**
         * 此方方有时会在CallActivity的onCreate方法之前执行，如果网连接错误时，
         * 显示界面就会出问题，所以也finish不掉，所以这里处理的方式是此处保存网络的状态，
         * 在Activity的onCreate中检查网络状态再finish()
         */
        if (playControl != null) {
            playControl.stop();
        }
        if (isReceiverCall) {
            cancelVibrator();//取消震动
        }

        String name = callDisconnectedReason.name();
        Log.e("399", "name: " + name);
        if (RongCallCommon.CallDisconnectedReason.REMOTE_BUSY_LINE.name().equals(name)) {
            showToast("正在通话中，请稍后再拨");
        } else if (RongCallCommon.CallDisconnectedReason.NETWORK_ERROR.name().equals(name)) {
            showToast("网络错误，请稍后再试");
        } else if (RongCallCommon.CallDisconnectedReason.REMOTE_REJECT.name().equals(name)) {
            showToast("对方拒绝接听");
        } else if (RongCallCommon.CallDisconnectedReason.CANCEL.name().equals(name)) {
            showToast("取消通话");
        } else if (RongCallCommon.CallDisconnectedReason.REMOTE_HANGUP.name().equals(name)) {
            showToast("通话结束");
        } else if (RongCallCommon.CallDisconnectedReason.HANGUP.name().equals(name)) {
            showToast("通话结束");
        } else if (RongCallCommon.CallDisconnectedReason.REMOTE_NO_RESPONSE.name().equals(name)) {
            showToast("对方未接听");
        }
        sp.edit().putString("net_state",name).commit();//保存网络的状态
        finish();
    }


    @Override
    public void onRemoteUserRinging(String s) {
        Log.e("399", "onRemoteUserRinging");

    }

    @Override
    public void onRemoteUserJoined(String s, RongCallCommon.CallMediaType callMediaType, SurfaceView surfaceView) {
        Log.e("399", "onRemoteUserJoined");
    }

    @Override
    public void onRemoteUserInvited(String s, RongCallCommon.CallMediaType callMediaType) {
        Log.e("399", "onRemoteUserInvited");
    }

    @Override
    public void onRemoteUserLeft(String s, RongCallCommon.CallDisconnectedReason callDisconnectedReason) {
        Log.e("399", "onRemoteUserLeft");
    }

    @Override
    public void onMediaTypeChanged(String s, RongCallCommon.CallMediaType callMediaType, SurfaceView surfaceView) {

    }

    @Override
    public void onError(RongCallCommon.CallErrorCode callErrorCode) {
        Log.e("399", "onError");
    }

    @Override
    public void onRemoteCameraDisabled(String s, boolean b) {

    }

    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////自己的方法   //////////////////////////////////////
    private void initOkHttp() {
        File cacheDir = getExternalCacheDir();
        int cacheSize = 10 * 1024 * 1024;
        OkHttpClient.Builder builder = new OkHttpClient.Builder()
                .connectTimeout(15, TimeUnit.SECONDS)//设置连接超时
                .writeTimeout(20, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .cache(new Cache(cacheDir.getAbsoluteFile(), cacheSize));
        mOkHttpClient = builder.build();
    }

    /**
     * 获取来电方的用户信息
     */
    private void loadCallUserInfo() {
        Log.e("399", "loadCallUserInfo:" + targetId);
        RequestModel requestModel = new RequestModel();
        requestModel.setPage("1");
        requestModel.setPageSize("20");
        if (isReceiverCall) {
            requestModel.setKey(targetId);
        } else {
            requestModel.setKey(callerUserId);
        }
        asynPost(new Gson().toJson(requestModel));
    }

    /**
     * okHttp post异步请求网络
     */
    public void asynPost(String json) {
//        String json = "{" + "\"key\":" + "\"付\"" +",\"page\":" + "\"1\"" + ",\"pageSize\":" + "\"10\"" +  "}";
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);

        Request request = new Request.Builder()
//                .url("http://mobile-app.hand-china.com/hrmsv2/v2/api/staff/query?access_token=" + sp.getString("access_token", ""))
                .url(LoginInfo.baseUrl + "/hrmsv2/v2/api/staff/detail?" + "access_token=" + LoginInfo.access_token)
                .header("content-type", "application/json")
                .post(body)
                .build();
        Call call = mOkHttpClient.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {

            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String str = response.body().string();
                    NameModel nameModel = new Gson().fromJson(str, NameModel.class);
                    if (nameModel != null) {
                        if (nameModel.isSuccess()) {
                            List<NameModel.RowsEntity> rows = nameModel.getRows();
                            if (rows != null && rows.size() > 0) {
                                NameModel.RowsEntity rowsEntity = rows.get(0);
                                friendName = rowsEntity.getEmp_name();
                                friendIcon = rowsEntity.getAvatar();
                                Log.e("399", "friendIcon:" + friendIcon);
                            }
                        }
                    }
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mNameTextView.setText(friendName);
                            if (!TextUtils.isEmpty(friendIcon)) {
                                ImageLoader.getInstance().displayImage(friendIcon, mHeadImageView, options);
                            } else {
                                mHeadImageView.setImageResource(Util.getRS("head_1", "drawable", CallActivity.this));
                            }
                        }
                    });
                } else {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mNameTextView.setText("未知联系人");
                            mHeadImageView.setImageResource(Util.getRS("head_1", "drawable", CallActivity.this));
                        }
                    });
                }
            }
        });
    }

    /**
     * 控制View的显示与隐藏
     */
    private void controlViewVisibility() {
        mStartVoiceChatContainer.setVisibility(View.VISIBLE);//(静音，挂断，免提)容器显示
        mHandFreeContainer.setVisibility(View.GONE);//(接听，挂断)容器隐藏
        mMuteContainer.setVisibility(View.VISIBLE);//静音按钮容器显示，语音通话建立
        mHandFreeContainer.setVisibility(View.VISIBLE);//免提按钮容器显示，语音通话建立
        mAnswerVoiceChatContainer.setVisibility(View.GONE);//(接听，挂断)容器隐藏
        mMinimizeImageView.setVisibility(View.VISIBLE);
    }

    /**
     * 初始化ImageLoader的参数
     */
    private void initOptions() {
        options = new DisplayImageOptions.Builder()
//                .showImageOnLoading(R.drawable.picture_loading)
//                .showImageOnFail(R.drawable.pictures_no)
                .showImageOnLoading(Util.getRS("picture_loading", "drawable", this))
                .showImageOnFail(Util.getRS("pictures_no", "drawable", this))
                .cacheOnDisk(true)
                .cacheInMemory(true)
                .displayer(new RoundedBitmapDisplayer(100)) // 设置成圆角图片
                .bitmapConfig(Bitmap.Config.RGB_565)
                .resetViewBeforeLoading(true)
                .build();
    }

    @TargetApi(23)
    private boolean requestCallPermissions(RongCallCommon.CallMediaType type) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M)
            return true;

        if (type.equals(RongCallCommon.CallMediaType.VIDEO)) {
            List<String> permissionsNeeded = new ArrayList<String>();
            final List<String> permissionsList = new ArrayList<String>();

            if (!addPermission(permissionsList, Manifest.permission.RECORD_AUDIO)) {
                permissionsNeeded.add("RecordAudio");
            }
            if (!addPermission(permissionsList, Manifest.permission.CAMERA)) {
                permissionsNeeded.add("Camera");
            }

            if (permissionsList.size() > 0) {
                if (permissionsNeeded.size() > 0) {
                    String message = null;
                    if (permissionsNeeded.size() > 1) {
                        message = "您需要在设置中打开权限（麦克风，相机）。";
                    } else {
                        if (permissionsNeeded.get(0).equals("RecordAudio")) {
                            message = "您需要在设置中打开权限（麦克风）。";
                        } else if (permissionsNeeded.get(0).equals("Camera")) {
                            message = "您需要在设置中打开权限（相机）。";
                        }
                    }
                    new AlertDialog.Builder(this)
                            .setMessage(message)
                            .setPositiveButton("确认", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    requestPermissions(permissionsList.toArray(new String[permissionsList.size()]), REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
                                }
                            })
                            .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    finish();
                                }
                            })
                            .create().show();
                    return false;
                }
                requestPermissions(permissionsList.toArray(new String[permissionsList.size()]), REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
                return false;
            } else {
                return true;
            }
        } else if (type.equals(RongCallCommon.CallMediaType.AUDIO)) {
            int checkPermission = this.checkSelfPermission(Manifest.permission.RECORD_AUDIO);
            if (checkPermission != PackageManager.PERMISSION_GRANTED) {
                if (shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO)) {
                    requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
                } else {
                    String message = "您需要开启录音权限";
                    AlertDialog.Builder builder = new AlertDialog.Builder(CallActivity.this,Util.getRS("SampleTheme_Light","style",CallActivity.this));
                    View view = View.inflate(this, Util.getRS("item_alert_dialog","layout",CallActivity.this), null);
//                    builder.setView(view);
                    builder.setCancelable(false);
                    Button mConfirmButton = (Button) view.findViewById(Util.getRS("bt_confirm","id",CallActivity.this));
                    Button mCancelButton = (Button) view.findViewById(Util.getRS("bt_cancel","id",CallActivity.this));
                    TextView mMessageTextView = (TextView) view.findViewById(Util.getRS("tv_message","id",CallActivity.this));
                    mMessageTextView.setText(message);
                    mConfirmButton.setOnClickListener(new View.OnClickListener() {

                        @Override
                        public void onClick(View v) {
                            if (!isReceiverCall) {
                                if (playControl != null) {
                                    playControl.stop();
                                }
                                startActivity(getAppDetailSettingIntent());
                                finish();
                            }
                            if (sp.getBoolean("isFirst", false)) {
                                startActivityForResult(getAppDetailSettingIntent(), 0);
                            } else {
                                requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
                            }
                            sp.edit().putBoolean("isFirst", true).commit();
                            alertDialog.dismiss();
                        }
                    });
                    mCancelButton.setOnClickListener(new View.OnClickListener() {

                        @Override
                        public void onClick(View v) {
                            if(playControl != null){
                                playControl.stop();
                            }
                            cancelVibrator();//取消震动
                            RongCallClient.getInstance().hangUpCall(callerUserId);//挂掉电话
                            finish();
                            alertDialog.dismiss();
                        }
                    });
                    alertDialog = builder.create();
                    alertDialog.setView(view,0,0,0,0);
                    alertDialog.show();
                }
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    @TargetApi(23)
    private boolean addPermission(List<String> permissionList, String permission) {
        if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
            permissionList.add(permission);
            if (!shouldShowRequestPermissionRationale(permission))
                return false;
        }
        return true;
    }


    /**
     * 跳转到应用的权限设置页面
     *
     * @return
     */
    private Intent getAppDetailSettingIntent() {
        Intent localIntent = new Intent();
//        localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= 9) {
            localIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            localIntent.setData(Uri.fromParts("package", getPackageName(), null));
        } else if (Build.VERSION.SDK_INT <= 8) {
            localIntent.setAction(Intent.ACTION_VIEW);
            localIntent.setClassName("com.android.settings", "com.android.settings.InstalledAppDetails");
            localIntent.putExtra("com.android.settings.ApplicationPkgName", getPackageName());
        }
        return localIntent;
    }

    ////////////////////////////////////////////////////////////////////////////

    @TargetApi(23)
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        Log.e("399", "onRequestPermissionsResult");
        switch (requestCode) {
            case REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS:
                Map<String, Integer> mapPermissions = new HashMap<String, Integer>();
                mapPermissions.put(Manifest.permission.RECORD_AUDIO, PackageManager.PERMISSION_GRANTED);
                mapPermissions.put(Manifest.permission.CAMERA, PackageManager.PERMISSION_GRANTED);

                for (int i = 0; i < permissions.length; i++) {
                    mapPermissions.put(permissions[i], grantResults[i]);
                }
                if (mapPermissions.get(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
                        && mapPermissions.get(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    if (startForCheckPermissions) {
                        startForCheckPermissions = false;
                        RongCallClient.getInstance().onPermissionGranted();
                    } else {

                    }
                } else {
                    if (startForCheckPermissions) {
                        startForCheckPermissions = false;
                        RongCallClient.getInstance().onPermissionDenied();
                    } else {
                        finish();
                    }
                }
                break;
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }

    }

    @TargetApi(Build.VERSION_CODES.M)
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
    }

    @Override
    public void onBackPressed() {
        CallFloatBoxView.showFloatBox(getApplication(), time, targetId, callerUserId, friendName, friendIcon);//启动悬浮窗口
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        if (playControl != null) {
            playControl.stop();
        }
        if (isReceiverCall) {
            cancelVibrator();//取消震动
        }
        super.onPause();
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.e("399","onDestroy");
        if (connection != null) {
            unbindService(connection);
        }
    }
}
