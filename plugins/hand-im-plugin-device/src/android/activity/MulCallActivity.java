package com.hand.im.activity;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.control.PlayControl;
import com.hand.im.model.CallMemberModel;
import com.hand.im.model.NameModel;
import com.hand.im.model.RequestModel;
import com.hand.im.service.PlayService;
import com.hand.im.widget.CallUserGridView;
import com.hand.im.widget.MulCallFloatBoxView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.rong.calllib.CallUserProfile;
import io.rong.calllib.IRongCallListener;
import io.rong.calllib.RongCallClient;
import io.rong.calllib.RongCallCommon;
import io.rong.calllib.RongCallSession;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Discussion;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MulCallActivity extends BaseActivity implements IRongCallListener, View.OnClickListener {

    private final static String ACTION_OUTGOING = "audio_outgoing";//去电
    private final static String ACTION_INCOMING = "audio_incoming";//来电
    private final static String ACTION_FLOATBOX = "audio_floatbox";//悬浮窗
    private String action;//判断是来电还是去电
    private String callerUserId;//呼叫方的userId
    private String targetId;//群组语音的id
    private String selfUserId;//自己的userId
    List<CallMemberModel> shouldCallMemberList = new ArrayList<CallMemberModel>();//参加群组聊天人的对象
    private RelativeLayout mOutgoingContainer;
    private FrameLayout mHeadContainer;
    private ImageView mAddImageView;
    private ImageView mMinimizeImageView;
    private TextView mTimeTextView;
    private CallUserGridView mMembersCallUserGridView;
    private TextView mStateTextView;
    private LinearLayout mMuteContainer;
    private ImageButton mMuteImageButton;
    private ImageButton mCallCancelImageButton;
    private LinearLayout mHandFreeContainer;
    private ImageButton mHandFreeImageButton;
    private RelativeLayout mIncomingContainer;
    private LinearLayout mCallContainer;
    private TextView mCallNameTextView;
    private CallUserGridView mIncomingMembersCallUserGridView;
    private ImageButton mAcceptCallImageButton;
    private ImageButton mHangupCallImageButton;
    private int callUserProfileSize;
    private int count = 0;
    private String mul_net_state;
    private List<String> joinIds = new ArrayList<String>();//已经在通话中的userId
    private List<String> mMemberIdList = new ArrayList<String>();//讨论组中所有成员的id
    private List<String> invitedButNotJoinIds = new ArrayList<String>();//被邀请了，但是还没有加入的userId
    private ServiceConnection connection;
    private PlayControl playControl;
    private boolean isConnected;
    private RongCallSession rongCallSession;
    private boolean startForCheckPermissions = false;
    private static final int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 100;
    private AlertDialog alertDialog;
    private boolean isFirst = true;

    @Override
    public int getLayoutId() {
        mul_net_state = sp.getString("mul_net_state", "");
//        Log.e("399","net_state:" + net_state);
        if ("NETWORK_ERROR".equals(mul_net_state)) {//此处处理的逻辑思路为：当发起方发起通话请求时，发的请求时网络是好的，刚发出请求网络就出问题了，界面显示就会出问题
            if (playControl != null) {
                playControl.stop();
            }
            sp.edit().putString("mul_net_state", "").commit();
            showToast("当前网络不可用，请检查您的网络设置");
            finish();
        }

        return Util.getRS("activity_mul_call", "layout", this);
    }

    @Override
    protected void initData() {
        RongCallClient.getInstance().setVoIPCallListener(this);//设置监听
        Intent intent = getIntent();
        action = intent.getStringExtra("action");
        if (ACTION_OUTGOING.equals(action)) {//去电
            selfUserId = callerUserId = intent.getStringExtra("callerUserId");
            targetId = intent.getStringExtra("targetId");
            shouldCallMemberList = intent.getParcelableArrayListExtra("shouldCallMemberList");
        } else if (ACTION_INCOMING.equals(action)) {//来电
            callerUserId = intent.getStringExtra("callerUserId");
            targetId = intent.getStringExtra("targetId");
            selfUserId = intent.getStringExtra("selfUserId");
            List<CallUserProfile> callUserProfiles = intent.getParcelableArrayListExtra("usersProfileList");
            startForCheckPermissions = getIntent().getBooleanExtra("startForCheckPermissions", false);
            //去除集合相同的元素
            if (!callUserProfiles.isEmpty()) {
                for (int i = 0; i < callUserProfiles.size(); i++) {
                    for (int j = callUserProfiles.size() - 1; j > i; j--) {
                        if (callUserProfiles.get(i).getUserId().equals(callUserProfiles.get(j).getUserId())) {
                            callUserProfiles.remove(j);
                        }
                    }
                }
            }

            if (callUserProfiles != null && callUserProfiles.size() > 0) {
                callUserProfileSize = callUserProfiles.size();
                for (CallUserProfile callUserProfile : callUserProfiles) {
                    getDataFromSever(callUserProfile.getUserId());
                }
            }
        } else if (ACTION_FLOATBOX.equals(action)) {//悬浮窗
            isFirst = false;
            callerUserId = intent.getStringExtra("callerUserId");
            targetId = intent.getStringExtra("targetId");
            selfUserId = intent.getStringExtra("selfUserId");
            shouldCallMemberList = intent.getParcelableArrayListExtra("shouldCallMemberList");
            joinIds = intent.getStringArrayListExtra("joinIds");
            invitedButNotJoinIds = intent.getStringArrayListExtra("invitedButNotJoinIds");
        }
        getDiscussionMember();//获取讨论组中所有成员的userId

        if (!requestCallPermissions(RongCallCommon.CallMediaType.AUDIO)) {
            return;
        }
    }

    @Override
    protected void intView() {
        //去电相关布局view
        mOutgoingContainer = (RelativeLayout) findViewById(Util.getRS("rl_outgoing_container", "id", this));//呼出电话的容器
        mHeadContainer = (FrameLayout) findViewById(Util.getRS("fl_head_container", "id", this));//装邀请、最小化、通话时间容器
        mAddImageView = (ImageView) findViewById(Util.getRS("iv_add", "id", this));//邀请
        mMinimizeImageView = (ImageView) findViewById(Util.getRS("iv_minimize", "id", this));//最小化
        mTimeTextView = (TextView) findViewById(Util.getRS("tv_time", "id", this));//时间
        mMembersCallUserGridView = (CallUserGridView) findViewById(Util.getRS("cg_members", "id", this));//显示通话人列表
        mStateTextView = (TextView) findViewById(Util.getRS("tv_state", "id", this));//连接状态
        mMuteContainer = (LinearLayout) findViewById(Util.getRS("ll_mute_container", "id", this));//静音容器
        mMuteImageButton = (ImageButton) findViewById(Util.getRS("ib_mute", "id", this));//静音
        mCallCancelImageButton = (ImageButton) findViewById(Util.getRS("ib_call_cancel", "id", this));//挂断
        mHandFreeContainer = (LinearLayout) findViewById(Util.getRS("ll_hand_free_container", "id", this));//免提容器
        mHandFreeImageButton = (ImageButton) findViewById(Util.getRS("ib_hand_free", "id", this));//免提

        //来电相关布局view
        mIncomingContainer = (RelativeLayout) findViewById(Util.getRS("rl_incoming_container", "id", this));//来电容器
        mCallContainer = (LinearLayout) findViewById(Util.getRS("ll_call_container", "id", this));//来电人信息容器
        mCallNameTextView = (TextView) findViewById(Util.getRS("tv_call_name", "id", this));//来电人的名字
        mIncomingMembersCallUserGridView = (CallUserGridView) findViewById(Util.getRS("cg_incoming_members", "id", this));//群组来电朋友列表
        mAcceptCallImageButton = (ImageButton) findViewById(Util.getRS("ib_accept_call", "id", this));//接听
        mHangupCallImageButton = (ImageButton) findViewById(Util.getRS("bt_hang_up_call", "id", this));//拒绝接听

        //控制view的显示与隐藏
        if (ACTION_OUTGOING.equals(action)) {//去电
            showOutgoingView();
            showCallMemberList();//显示通话成员列表
        } else if (ACTION_INCOMING.equals(action)) {//来电
            showIncomingView();
        } else if (ACTION_FLOATBOX.equals(action)) {//悬浮窗
            time = MulCallFloatBoxView.hideFloatBox();
            setupTime(mTimeTextView);
            showConnectedView();
            showCallMemberList();//显示通话成员列表
        }

        Intent intent = new Intent(this, PlayService.class);
        startService(intent);
        connection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                playControl = (PlayControl) iBinder;
                if (ACTION_INCOMING.equals(action)) {
                    playControl.play("ringing.mp3");
                    startVibrator();//开始震动
                } else if (ACTION_OUTGOING.equals(action)) {
                    if (!playControl.isPlaying() && !"NETWORK_ERROR".equals(mul_net_state)) {
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
    protected void initListeners() {
        mAddImageView.setOnClickListener(this);
        mMinimizeImageView.setOnClickListener(this);
        mMuteImageButton.setOnClickListener(this);
        mCallCancelImageButton.setOnClickListener(this);
        mHandFreeImageButton.setOnClickListener(this);
        mAcceptCallImageButton.setOnClickListener(this);
        mHangupCallImageButton.setOnClickListener(this);
    }


    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////click even call back //////////////////////////////

    @Override
    public void onClick(View v) {
        int id = v.getId();
        int iv_add = Util.getRS("iv_add", "id", this);
        int iv_minimize = Util.getRS("iv_minimize", "id", this);
        int ib_mute = Util.getRS("ib_mute", "id", this);
        int ib_call_cancel = Util.getRS("ib_call_cancel", "id", this);
        int ib_hand_free = Util.getRS("ib_hand_free", "id", this);
        int ib_accept_call = Util.getRS("ib_accept_call", "id", this);
        int bt_hang_up_call = Util.getRS("bt_hang_up_call", "id", this);
        if (id == iv_add) {//邀请
            if (mMemberIdList.size() <= 0) {
                getDiscussionMember();
                showToast("网络错误，正在重新获取，请重试");
                return;
            }
            Intent intent = new Intent(this, CallSelectActivity.class);
            intent.putExtra("action", "callInvite");
            intent.putExtra("callerUserId", callerUserId);
            intent.putStringArrayListExtra("memberIdList", (ArrayList<String>) mMemberIdList);
            intent.putStringArrayListExtra("onLineIds", (ArrayList<String>) joinIds);
            intent.putExtra("selfUserId", selfUserId);
            startActivityForResult(intent, 1);
        } else if (id == iv_minimize) {//最小化
            MulCallFloatBoxView.showFloatBox(getApplication(), time, shouldCallMemberList, selfUserId, callerUserId, targetId, joinIds, mMembersCallUserGridView, invitedButNotJoinIds);
            finish();
        } else if (id == ib_mute) {//静音
            mMuteImageButton.setSelected(isMuteImageButtonSelect ? false : true);
            isMuteImageButtonSelect = !isMuteImageButtonSelect;
            RongCallClient.getInstance().setEnableLocalAudio(!isMuteImageButtonSelect);
        } else if (id == ib_call_cancel) {//挂断
            RongCallClient.getInstance().hangUpCall(targetId);
        } else if (id == ib_hand_free) {//免提
            mHandFreeImageButton.setSelected(isHandFreeImageButtonSelect ? false : true);
            isHandFreeImageButtonSelect = !isHandFreeImageButtonSelect;
            RongCallClient.getInstance().setEnableSpeakerphone(isHandFreeImageButtonSelect);
        } else if (id == ib_accept_call) {//接听电话
            RongCallClient.getInstance().acceptCall(targetId);
        } else if (id == bt_hang_up_call) {//拒绝接听
            RongCallClient.getInstance().hangUpCall(targetId);
        }
    }
    ////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////电话回调///////////////////////////////////
    @Override
    public void onCallOutgoing(RongCallSession rongCallSession, SurfaceView surfaceView) {
        Log.e("399", "onCallOutgoing");

    }

    @Override
    public void onCallConnected(RongCallSession rongCallSession, SurfaceView surfaceView) {
        this.rongCallSession = rongCallSession;
        Log.e("399", "onCallConnected");
        isConnected = true;
        showConnectedView();//显示连接之后的view
        setupTime(mTimeTextView);//设置通话时长

        if (playControl != null) {
            playControl.stop();
        }
        if (ACTION_INCOMING.equals(action)) {
            cancelVibrator();//取消震动
        }
    }

    @Override
    public void onCallDisconnected(RongCallSession rongCallSession, RongCallCommon.CallDisconnectedReason callDisconnectedReason) {
        Log.e("399", "onCallDisconnected");
        String name = callDisconnectedReason.name();
        Log.e("399", "name: " + name);

        isConnected = false;
        if (playControl != null) {
            playControl.stop();
        }
        if (ACTION_INCOMING.equals(action)) {
            cancelVibrator();//取消震动
        }

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
        sp.edit().putString("mul_net_state", name).commit();//保存网络的状态
        finish();
    }

    @Override
    public void onRemoteUserRinging(String userId) {
        Log.e("399", "onRemoteUserRinging");
    }

    @Override
    public void onRemoteUserJoined(String userId, RongCallCommon.CallMediaType callMediaType, SurfaceView surfaceView) {
        Log.e("399", "加入的userId: " + userId);
        View view = mMembersCallUserGridView.findChildById(userId);
        if (view != null) {
            mMembersCallUserGridView.updateChildState(userId, false);
        } else {
//            mMembersCallUserGridView.addChild(userId, );
        }
        if (!joinIds.contains(userId)) {
            joinIds.add(userId);
        }
        invitedButNotJoinIds.remove(userId);
    }

    @Override
    public void onRemoteUserInvited(String userId, RongCallCommon.CallMediaType callMediaType) {
        Log.e("399", "onRemoteUserInvited");
        joinIds.add(userId);
        invitedButNotJoinIds.add(userId);
        getCallMemberModel(userId);
    }

    @Override
    public void onRemoteUserLeft(String userId, RongCallCommon.CallDisconnectedReason callDisconnectedReason) {
        Log.e("399", "离开的userId: " + userId);
        joinIds.remove(userId);

        ////////////////////////////////////////
        if (invitedButNotJoinIds.contains(userId)) {
            invitedButNotJoinIds.remove(userId);
        }
        ////////////////////////////////////////////
        String text = null;
        switch (callDisconnectedReason) {
            case REMOTE_BUSY_LINE:
                text = "对方忙，请稍后再拨";
                break;
            case REMOTE_CANCEL:
                text = "对方已取消";
                break;
            case REMOTE_REJECT:
                text = "对方已拒绝";
                break;
            case NO_RESPONSE:
                text = "对方未接听";
                break;
            case NETWORK_ERROR:
            case HANGUP:
            case REMOTE_HANGUP:
                break;
        }
        if (text != null) {
            mMembersCallUserGridView.updateChildState(userId, text);
        }
        mMembersCallUserGridView.removeChild(userId);
        mIncomingMembersCallUserGridView.removeChild(userId);

        if (joinIds != null && joinIds.size() == 0) {
            if (isConnected) {
                RongCallClient.getInstance().hangUpCall(targetId);
            }
            if (ACTION_OUTGOING.equals(action) && isConnected) {
                RongCallClient.getInstance().hangUpCall(targetId);
            }
        }

        if (shouldCallMemberList == null) {
            return;
        }
        //移除退出群聊的用户
        List<CallMemberModel> leftModel = new ArrayList<CallMemberModel>();
        for (int i = 0; i < shouldCallMemberList.size(); i++) {
            if (userId.equals(shouldCallMemberList.get(i).getEmp_code())) {
                leftModel.add(shouldCallMemberList.get(i));
            }
        }
        shouldCallMemberList.removeAll(leftModel);

        //如果去电的用户在拨打电话时，被叫用户都离开时，去电用户挂掉电话
        if (shouldCallMemberList.size() == 1) {
            if (shouldCallMemberList.get(0).getEmp_code().equals(callerUserId)) {
                RongCallClient.getInstance().hangUpCall(targetId);
            }
        }
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
    ////////////////////////////自己的方法///////////////////////////////////////

    /**
     * 显示来电的View，去电的View隐藏
     */
    private void showIncomingView() {
        mOutgoingContainer.setVisibility(View.GONE);//去电容器隐藏
        mIncomingContainer.setVisibility(View.VISIBLE);//来电容器显示
    }

    /**
     * 显示去电的View,隐藏来电的View
     */
    private void showOutgoingView() {
        mOutgoingContainer.setVisibility(View.VISIBLE);//去电容器显示
        mIncomingContainer.setVisibility(View.GONE);//来电容器隐藏
    }

    /**
     * 显示连接之后的View
     */
    private void showConnectedView() {
        showOutgoingView();
        mHeadContainer.setVisibility(View.VISIBLE);//装邀请、最小化、通话时间容器显示
        mMuteContainer.setVisibility(View.VISIBLE);//静音容器显示
        mHandFreeContainer.setVisibility(View.VISIBLE);//免提容器显示
        mStateTextView.setVisibility(View.GONE);
    }

    /**
     * 去电和接通时显示通话成员列表
     */
    private void showCallMemberList() {
        mMembersCallUserGridView.enableShowState(true);
        for (int i = 0; i < shouldCallMemberList.size(); i++) {
            CallMemberModel callMemberModel = shouldCallMemberList.get(i);
            if (!selfUserId.equals(callMemberModel.getEmp_code())) {


                ////////////////////////////////////////
                if (!joinIds.contains(callMemberModel.emp_code) && isFirst) {
                    joinIds.add(callMemberModel.emp_code);
                }
                ////////////////////////////////////////

                mMembersCallUserGridView.addChild(callMemberModel.getEmp_code(), callMemberModel, "连接中");
                if (ACTION_FLOATBOX.equals(action)) {
                    joinIds.removeAll(invitedButNotJoinIds);
                    for (int j = 0; j < joinIds.size(); j++) {
                        mMembersCallUserGridView.updateChildState(joinIds.get(j), false);
                    }
                    joinIds.addAll(invitedButNotJoinIds);
                }

                ///////////////////////////////////
                if (!invitedButNotJoinIds.contains(callMemberModel.emp_code) && isFirst) {
                    invitedButNotJoinIds.add(callMemberModel.emp_code);
                }
                /////////////////////////////////

            }
        }
        mMembersCallUserGridView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        isFirst = false;
    }

    /**
     * 当数据都加载完通知显示来电时的通话成员列表
     */
    private void notifyShowIncomingMemberList() {
        if (ACTION_INCOMING.equals(action)) {
            count++;
        }
        if (ACTION_INCOMING.equals(action) && count == callUserProfileSize) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    showIncomingMemberList();//显示通话成员列表
                }
            });
        }
    }

    /**
     * 来电时显示通话成员列表
     */
    private void showIncomingMemberList() {
        showCallMemberList();
        mIncomingMembersCallUserGridView.setChildPortraitSize(mIncomingMembersCallUserGridView.dip2pix(40));

        for (int i = 0; i < shouldCallMemberList.size(); i++) {
            CallMemberModel callMemberModel = shouldCallMemberList.get(i);
            String emp_code = callMemberModel.getEmp_code();
            if (callerUserId.equals(emp_code)) {
                mCallNameTextView.setText(callMemberModel.getEmp_name());
            } else if (selfUserId.equals(emp_code)) {

            } else {
                mIncomingMembersCallUserGridView.addChild(emp_code, callMemberModel);
            }
        }
        mIncomingMembersCallUserGridView.setOverScrollMode(View.OVER_SCROLL_NEVER);
    }

    /**
     * 加载用户数据
     */
    private void getDataFromSever(String id) {
        RequestModel requestModel = new RequestModel();
        requestModel.setPage("1");
        requestModel.setPageSize("20");
        requestModel.setKey(id);
        asynPost(new Gson().toJson(requestModel));
    }

    private void getCallMemberModel(String userId) {
        RequestModel requestModel = new RequestModel();
        requestModel.setPage("1");
        requestModel.setPageSize("20");
        requestModel.setKey(userId);
        asynPostGetCallMemberModel(new Gson().toJson(requestModel));
    }

    private void asynPostGetCallMemberModel(String json) {
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
                if (response.isSuccessful()) {//成功
                    String str = response.body().string();
                    NameModel nameModel = new Gson().fromJson(str, NameModel.class);
                    if (nameModel != null) {
                        if (nameModel.isSuccess()) {
                            List<NameModel.RowsEntity> rows = nameModel.getRows();
                            if (rows != null && rows.size() > 0) {
                                NameModel.RowsEntity rowsEntity = rows.get(0);
                                final CallMemberModel callMemberModel = new CallMemberModel(true, rowsEntity.getEmp_name(), rowsEntity.getEmp_code(), rowsEntity.getAvatar());
                                shouldCallMemberList.add(callMemberModel);
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        mMembersCallUserGridView.addChild(callMemberModel.getEmp_code(), callMemberModel, "连接中");
                                    }
                                });
                            }
                        }
                    }
                } else {//失败
                    Log.e("399", "失败");
                }
            }
        });
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
                if (response.isSuccessful()) {//成功
                    String str = response.body().string();
                    NameModel nameModel = new Gson().fromJson(str, NameModel.class);
                    if (nameModel != null) {
                        if (nameModel.isSuccess()) {
                            List<NameModel.RowsEntity> rows = nameModel.getRows();
                            if (rows != null && rows.size() > 0) {
                                NameModel.RowsEntity rowsEntity = rows.get(0);
                                shouldCallMemberList.add(new CallMemberModel(true, rowsEntity.getEmp_name(), rowsEntity.getEmp_code(), rowsEntity.getAvatar()));
                                notifyShowIncomingMemberList();
                            }
                        }
                    }
                } else {//失败
                    Log.e("399", "失败");
                }
            }
        });
    }

    /**
     * 获取讨论组中的所有的成员
     */
    private void getDiscussionMember() {
        RongIMClient.getInstance().getDiscussion(targetId, new RongIMClient.ResultCallback<Discussion>() {
            @Override
            public void onSuccess(Discussion dis) {
                mMemberIdList = dis.getMemberIdList();
                Log.e("399", "讨论组中的所有成员UserId成功拿到");
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {

            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////


    @TargetApi(Build.VERSION_CODES.M)
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == 2) {
            ArrayList<String> invitedUserIdList = data.getStringArrayListExtra("invitedUserIdList");
            for (int i = 0; i < invitedUserIdList.size(); i++) {
                Log.e("399", "邀请: " + invitedUserIdList.get(i));
            }
            if (rongCallSession != null)
                RongCallClient.getInstance().addParticipants(rongCallSession.getCallId(), invitedUserIdList);
            Log.e("399","呼叫联系人");
        } else if (requestCode == 0) {
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
        }
    }

    @Override
    protected void onPause() {
        if (playControl != null) {
            playControl.stop();
        }
        if (ACTION_INCOMING.equals(action)) {
            cancelVibrator();//取消震动
        }
        super.onPause();
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.e("399", "onDestroy");
        if (connection != null) {
            unbindService(connection);
        }
    }

    @Override
    public void onBackPressed() {
        if (ACTION_INCOMING.equals(action) || ACTION_OUTGOING.equals(action)) {
            if (!isConnected)
                RongCallClient.getInstance().hangUpCall(targetId);
        }
        if (isConnected)
            MulCallFloatBoxView.showFloatBox(getApplication(), time, shouldCallMemberList, selfUserId, callerUserId, targetId, joinIds, mMembersCallUserGridView, invitedButNotJoinIds);
        super.onBackPressed();
    }

    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////             //////////////////////////////////////
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
                    AlertDialog.Builder builder = new AlertDialog.Builder(MulCallActivity.this, Util.getRS("SampleTheme_Light", "style", MulCallActivity.this));
                    View view = View.inflate(this, Util.getRS("item_alert_dialog", "layout", MulCallActivity.this), null);
//                    builder.setView(view);
                    builder.setCancelable(false);
                    Button mConfirmButton = (Button) view.findViewById(Util.getRS("bt_confirm", "id", MulCallActivity.this));
                    Button mCancelButton = (Button) view.findViewById(Util.getRS("bt_cancel", "id", MulCallActivity.this));
                    TextView mMessageTextView = (TextView) view.findViewById(Util.getRS("tv_message", "id", MulCallActivity.this));
                    mMessageTextView.setText(message);
                    mConfirmButton.setOnClickListener(new View.OnClickListener() {

                        @Override
                        public void onClick(View v) {
                            if (ACTION_OUTGOING.equals(action)) {
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
                            if (playControl != null) {
                                playControl.stop();
                            }
                            cancelVibrator();//取消震动
                            RongCallClient.getInstance().hangUpCall(callerUserId);//挂掉电话
                            finish();
                            alertDialog.dismiss();
                        }
                    });
                    alertDialog = builder.create();
                    alertDialog.setView(view, 0, 0, 0, 0);
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
    public Intent getAppDetailSettingIntent() {
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

    ////////////////////////////////////////////////////////////////////////////
}
