package com.hand.im.widget;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.hand.im.Util;
import com.hand.im.activity.MulCallActivity;
import com.hand.im.model.CallMemberModel;
import com.hand.im.model.NameModel;
import com.hand.im.model.RequestModel;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import io.rong.calllib.IRongCallListener;
import io.rong.calllib.RongCallClient;
import io.rong.calllib.RongCallCommon;
import io.rong.calllib.RongCallSession;
import io.rong.calllib.message.CallSTerminateMessage;
import okhttp3.Cache;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by cool on 2016/8/25.
 */
public class MulCallFloatBoxView {
    private static OkHttpClient mOkHttpClient;
    protected static SharedPreferences sp;
    private static Context mContext;
    private static Timer timer;
    private static int mTime;
    private static View mView;
    private static Boolean isShown = false;
    private static WindowManager wm;
    private static List<CallMemberModel> mShouldCallMemberList;
    private static String mSelfUserId;
    private static String mCallerUserId;
    private static String mTargetId;
    private static List<String> mJoinIds;
    private static List<String> mInvitedButNotJoinIds;
    private static CallUserGridView mMembersCallUserGridView;
    private static Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            mMembersCallUserGridView.addChild(callMemberModel.getEmp_code(), callMemberModel, "连接中");
            mShouldCallMemberList.add(callMemberModel);
        }
    };
    private static CallMemberModel callMemberModel;

    public static void showFloatBox(final Context context, int time, List<CallMemberModel> shouldCallMemberList, String selfUserId, String callerUserId, String targetId, List<String> joinIds, CallUserGridView membersCallUserGridView, List<String> invitedButNotJoinIds) {
        if (isShown) {
            return;
        }

        mContext = context;
        isShown = true;
        mTime = time;
        mShouldCallMemberList = shouldCallMemberList;
        mSelfUserId = selfUserId;
        mCallerUserId = callerUserId;
        mTargetId = targetId;
        mJoinIds = joinIds;
        mMembersCallUserGridView = membersCallUserGridView;
        mInvitedButNotJoinIds = invitedButNotJoinIds;

        sp = mContext.getSharedPreferences("config", Context.MODE_PRIVATE);
        initOkHttp();

        wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        final WindowManager.LayoutParams params = new WindowManager.LayoutParams();

        int type;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            type = WindowManager.LayoutParams.TYPE_TOAST;
        } else {
            type = WindowManager.LayoutParams.TYPE_PHONE;
        }
        params.type = type;
        params.flags = WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM
                | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;

        params.format = PixelFormat.TRANSLUCENT;
        params.width = ViewGroup.LayoutParams.WRAP_CONTENT;
        params.height = ViewGroup.LayoutParams.WRAP_CONTENT;
        params.gravity = Gravity.CENTER;
        params.x = context.getResources().getDisplayMetrics().widthPixels;
        params.y = 0;
        mView = LayoutInflater.from(context).inflate(Util.getRS("rc_voip_float_box", "layout", mContext), null);
        mView.setOnTouchListener(new View.OnTouchListener() {
            float lastX, lastY;
            int oldOffsetX, oldOffsetY;
            int tag = 0;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                final int action = event.getAction();
                float x = event.getX();
                float y = event.getY();
                if (tag == 0) {
                    oldOffsetX = params.x;
                    oldOffsetY = params.y;
                }
                if (action == MotionEvent.ACTION_DOWN) {
                    lastX = x;
                    lastY = y;
                } else if (action == MotionEvent.ACTION_MOVE) {
                    // 减小偏移量,防止过度抖动
                    params.x += (int) (x - lastX) / 3;
                    params.y += (int) (y - lastY) / 3;
                    tag = 1;
                    if (mView != null)
                        wm.updateViewLayout(mView, params);
                } else if (action == MotionEvent.ACTION_UP) {
                    int newOffsetX = params.x;
                    int newOffsetY = params.y;
                    if (Math.abs(oldOffsetX - newOffsetX) <= 20 && Math.abs(oldOffsetY - newOffsetY) <= 20) {
                        onClickToResume();
                    } else {
                        tag = 0;
                    }
                }
                return true;
            }
        });
        wm.addView(mView, params);
        TextView timeV = (TextView) mView.findViewById(Util.getRS("rc_time", "id", mContext));
        setupTime(timeV);

        RongCallClient.getInstance().setVoIPCallListener(new IRongCallListener() {

            @Override
            public void onCallOutgoing(RongCallSession callInfo, SurfaceView localVideo) {

            }

            @Override
            public void onRemoteUserRinging(String userId) {

            }

            @Override
            public void onCallDisconnected(RongCallSession callProfile, RongCallCommon.CallDisconnectedReason reason) {
                String senderId;
                String extra = "";
                senderId = callProfile.getInviterUserId();
                switch (reason) {
                    case HANGUP:
                    case REMOTE_HANGUP:
                        if (mTime >= 3600) {
                            extra = String.format("%d:%02d:%02d", mTime / 3600, (mTime % 3600) / 60, (mTime % 60));
                        } else {
                            extra = String.format("%02d:%02d", (mTime % 3600) / 60, (mTime % 60));
                        }
                        break;
                }

                if (!TextUtils.isEmpty(senderId)) {
                    CallSTerminateMessage message = new CallSTerminateMessage();
                    message.setReason(reason);
                    message.setMediaType(callProfile.getMediaType());
                    message.setExtra(extra);
                    if (senderId.equals(callProfile.getSelfUserId())) {
                        message.setDirection("MO");
                    } else {
                        message.setDirection("MT");
                    }

                }
                Toast.makeText(mContext, "通话结束", Toast.LENGTH_SHORT).show();
                if (wm != null && mView != null) {
                    wm.removeView(mView);
                    timer.cancel();
                    timer = null;
                    isShown = false;
                    mView = null;
                    mTime = 0;
                }
                RongCallClient.getInstance().setVoIPCallListener(null);
            }

            @Override
            public void onRemoteUserInvited(String userId, RongCallCommon.CallMediaType mediaType) {
                getCallMemberModel(userId);
                mJoinIds.add(userId);
                mInvitedButNotJoinIds.add(userId);
            }

            @Override
            public void onRemoteUserJoined(String userId, RongCallCommon.CallMediaType mediaType, SurfaceView remoteVideo) {
                View view = mMembersCallUserGridView.findChildById(userId);
                if (view != null) {
                    mMembersCallUserGridView.updateChildState(userId, false);
                } else {
//                  mMembersCallUserGridView.addChild(userId, );
                }
                if (!mJoinIds.contains(userId)) {
                    mJoinIds.add(userId);
                }
                mInvitedButNotJoinIds.remove(userId);
            }

            @Override
            public void onRemoteUserLeft(String userId, RongCallCommon.CallDisconnectedReason reason) {
                Log.e("399", "box 离开用户Id: " + userId);
                mJoinIds.remove(userId);
                if (mShouldCallMemberList == null) {
                    return;
                }

                ////////////////////////////////////////
                if (mInvitedButNotJoinIds.contains(userId)) {
                    mInvitedButNotJoinIds.remove(userId);
                }
                ////////////////////////////////////////////

                List<CallMemberModel> leftModel = new ArrayList<CallMemberModel>();
                for (int i = 0; i < mShouldCallMemberList.size(); i++) {
                    if (userId.equals(mShouldCallMemberList.get(i).getEmp_code())) {
                        leftModel.add(mShouldCallMemberList.get(i));
                    }
                }
                mShouldCallMemberList.removeAll(leftModel);
            }

            @Override
            public void onMediaTypeChanged(String userId, RongCallCommon.CallMediaType mediaType, SurfaceView video) {

            }

            @Override
            public void onError(RongCallCommon.CallErrorCode errorCode) {

            }

            @Override
            public void onCallConnected(RongCallSession callInfo, SurfaceView localVideo) {
            }

            @Override
            public void onRemoteCameraDisabled(String userId, boolean muted) {

            }
        });
    }

    public static int hideFloatBox() {
        int t = mTime;
        if (isShown && null != mView) {
            wm.removeView(mView);
            timer.cancel();
            timer = null;
            isShown = false;
            mView = null;
            mTime = 0;
        }
        return t;
    }

    private static void onClickToResume() {
        Intent intent = new Intent(mContext, MulCallActivity.class);
        intent.putExtra("action", "audio_floatbox");
        intent.putExtra("callerUserId", mCallerUserId);
        intent.putExtra("selfUserId", mSelfUserId);
        intent.putExtra("targetId", mTargetId);
        intent.putParcelableArrayListExtra("shouldCallMemberList", (ArrayList<? extends Parcelable>) mShouldCallMemberList);
        intent.putStringArrayListExtra("joinIds", (ArrayList<String>) mJoinIds);
        intent.putStringArrayListExtra("invitedButNotJoinIds", (ArrayList<String>) mInvitedButNotJoinIds);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mContext.startActivity(intent);
    }

    private static void setupTime(final TextView timeView) {
        final Handler handler = new Handler(Looper.getMainLooper());
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        mTime++;
                        if (mTime >= 3600) {
                            timeView.setText(String.format("%d:%02d:%02d", mTime / 3600, (mTime % 3600) / 60, (mTime % 60)));
                        } else {
                            timeView.setText(String.format("%02d:%02d", (mTime % 3600) / 60, (mTime % 60)));
                        }
                    }
                });
            }
        };

        timer = new Timer();
        timer.schedule(task, 0, 1000);
    }

    private static void getCallMemberModel(String userId) {
        RequestModel requestModel = new RequestModel();
        requestModel.setPage("1");
        requestModel.setPageSize("20");
        requestModel.setKey(userId);
        asynPostGetCallMemberModel(new Gson().toJson(requestModel));
    }

    private static void asynPostGetCallMemberModel(String json) {
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
        Request request = new Request.Builder()
                .url("http://mobile-app.hand-china.com/hrmsv2/v2/api/staff/query?access_token=" + sp.getString("access_token", ""))
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
                                callMemberModel = new CallMemberModel(true, rowsEntity.getEmp_name(), rowsEntity.getEmp_code(), rowsEntity.getAvatar());
                                mHandler.sendEmptyMessage(0);
                            }
                        }
                    }
                } else {//失败
                    Log.e("399", "失败");
                }
            }
        });
    }

    private static void initOkHttp() {
        File cacheDir = mContext.getExternalCacheDir();
        int cacheSize = 10 * 1024 * 1024;
        OkHttpClient.Builder builder = new OkHttpClient.Builder()
                .connectTimeout(15, TimeUnit.SECONDS)//设置连接超时
                .writeTimeout(20, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .cache(new Cache(cacheDir.getAbsoluteFile(), cacheSize));
        mOkHttpClient = builder.build();
    }
}
