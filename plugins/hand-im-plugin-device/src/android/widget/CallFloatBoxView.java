package com.hand.im.widget;

import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
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

import com.hand.im.Util;
import com.hand.im.activity.CallActivity;

import java.util.Timer;
import java.util.TimerTask;

import io.rong.calllib.IRongCallListener;
import io.rong.calllib.RongCallClient;
import io.rong.calllib.RongCallCommon;
import io.rong.calllib.RongCallSession;
import io.rong.calllib.message.CallSTerminateMessage;

/**
 * Created by cool on 2016/8/25.
 */
public class CallFloatBoxView {
    private static Context mContext;
    private static Timer timer;
    private static int mTime;
    private static View mView;
    private static Boolean isShown = false;
    private static WindowManager wm;
    private static String mTargetId;
    private static String mCallerUserId;
    private static String mFriendName;
    private static String mFriendIcon;
    private static final String TAG = "CallFloatBoxView";

    public static void showFloatBox(Context context,int time,String targetId,String callerUserId,String friendName,String friendIcon) {
        if (isShown) {
            return;
        }

        mContext = context;
        isShown = true;
        mTime = time;
        mTargetId = targetId;
        mCallerUserId = callerUserId;
        mFriendName = friendName;
        mFriendIcon = friendIcon;
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
        mView = LayoutInflater.from(context).inflate(Util.getRS("rc_voip_float_box","layout",mContext), null);
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
        TextView timeV = (TextView)mView.findViewById(Util.getRS("rc_time","id",mContext));
        setupTime(timeV);
//        ImageView mediaIconV = (ImageView)mView.findViewById(R.id.rc_voip_media_type);
//        RongCallCommon.CallMediaType mediaType = RongCallCommon.CallMediaType.valueOf(bundle.getInt("mediaType"));
//        if (mediaType.equals(RongCallCommon.CallMediaType.AUDIO)) {
//            mediaIconV.setImageResource(R.drawable.rc_voip_float_audio);
//        } else {
////            mediaIconV.setImageResource(R.drawable.rc_voip_float_video);
//        }
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

                    //RongIM.getInstance().insertMessage(Conversation.ConversationType.PRIVATE, callProfile.getTargetId(), senderId, message, null);
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

            }

            @Override
            public void onRemoteUserJoined(String userId, RongCallCommon.CallMediaType mediaType, SurfaceView remoteVideo) {
            }

            @Override
            public void onRemoteUserLeft(String userId, RongCallCommon.CallDisconnectedReason reason) {

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
//        Log.e("399","targetId:" + mTargetId);
        Intent intent = new Intent(mContext, CallActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("targetId", mTargetId);
        intent.putExtra("callerUserId",mCallerUserId);
        intent.putExtra("isOnThePhone", true);//正在通话中
        intent.putExtra("friendName", mFriendName);//好友名字
        intent.putExtra("friendIcon", mFriendIcon);//好友头像
        intent.putExtra("time", System.currentTimeMillis() - mTime*1000);//通话的时长
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
}
