package com.hand.im;

import android.content.Context;
import android.graphics.drawable.AnimationDrawable;
import android.media.MediaRecorder;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.ScaleAnimation;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;


/**
 * Created by 汪翔 on 2016/7/11.
 * 录音自定义布局
 */
public class VoiceLayout extends LinearLayout{
    private MediaRecorder mRecorder;
    private Context context;
    private float downY;
    //录音操作结果提示
    private TextView m_tv_notice;
    private LinearLayout chat_tv_sound_length_layout;
    //录音时长显示
    private TextView my_tv_time;
    //录音按钮
    private ImageView chat_record;
    // 语音相关
    private ScaleAnimation mScaleBigAnimation;
    private ScaleAnimation mScaleLittleAnimation;
    private String mSoundData = "";//语音数据
    //为了能录音成功 直接在内置存储的根目录下面建一个文件
    private String dataPath;
    private boolean isStop;  // 录音是否结束的标志 超过1分钟停止
    private boolean isCanceled = false; // 是否取消录音
    private long mStartTime;
    private long mEndTime;
    private int mTime;
    private String mVoiceData;
    private AnimationDrawable mImageAnim;
    private Handler mHandler;
    private OnSuccessListener sl;

    public VoiceLayout(Context context) {
        super(context);
    }
    //xml方式加载 会执行 context,attrs的构造
    public VoiceLayout(Context context, AttributeSet attrs) {
        super(context,attrs);
        this.context = context;
        LayoutInflater inflater=(LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        //inflater.inflate(R.layout.voice_view, this);
        inflater.inflate(Util.getRS("voice_view", "layout", context),this);
        initview();
        initSoundData();
        mHandler = new Handler(){
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);
            }
        };
    }
    public void setListener(OnSuccessListener l){
        this.sl = l;
    }
    //加载控件
    private void initview(){
//        m_tv_notice = (TextView) findViewById(R.id.m_tv_notice);
//        chat_tv_sound_length_layout = (LinearLayout) findViewById(R.id.chat_tv_sound_length_layout);
//        my_tv_time = (TextView) findViewById(R.id.my_tv_time);
//        chat_record = (ImageView) findViewById(R.id.chat_record);
        m_tv_notice = (TextView) findViewById(Util.getRS("m_tv_notice","id",context));
        chat_tv_sound_length_layout = (LinearLayout) findViewById(Util.getRS("chat_tv_sound_length_layout","id",context));
        my_tv_time = (TextView) findViewById(Util.getRS("my_tv_time","id",context));
        chat_record = (ImageView) findViewById(Util.getRS("chat_record","id",context));
        chat_record.setOnTouchListener(new VoiceTouch());
    }
    /**
     * 录音存放路径
     */
    public void initSoundData() {
        dataPath = Environment.getExternalStorageDirectory().getPath() + "/Hand/Voice/";
        File folder = new File(dataPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }
    /**
     * 录音的触摸监听
     */
    class VoiceTouch implements View.OnTouchListener {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {
            switch (motionEvent.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    downY = motionEvent.getY();
                    m_tv_notice.setText("向上滑动取消发送");
                    //固定文件名 本地只保存一份 其他的在线播放
                    mSoundData = dataPath + getRandomFileName() + ".amr";
                    //防止开权限后崩溃
                    if (mRecorder != null) {
                        mRecorder.reset();
                    } else {
                        mRecorder = new MediaRecorder();
                    }
                    mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                    mRecorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_NB);
                    mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
                    mRecorder.setOutputFile(mSoundData);
                    try {
                        mRecorder.prepare();
                    } catch (IOException e) {
                        Log.i("recoder", "prepare() failed-Exception-" + e.toString());
						return false;
                    }
                    try {
                        mRecorder.start();
                        mStartTime = System.currentTimeMillis();
                        chat_tv_sound_length_layout.setVisibility(View.VISIBLE);
                        my_tv_time.setText("0" + '"');
                        //开启定时器
                        mHandler.postDelayed(runnable, 1000);
                    } catch (Exception e) {
                        Log.i("recoder", "prepare() failed-Exception-" + e.toString());
						return false;
                    }
                    initScaleAnim();
                    // 录音过程重复动画
                    mScaleBigAnimation.setAnimationListener(new Animation.AnimationListener() {
                        @Override
                        public void onAnimationStart(Animation animation) {
                        }
                        @Override
                        public void onAnimationEnd(Animation animation) {
                            if (mScaleLittleAnimation != null) {
                                chat_record.startAnimation(mScaleLittleAnimation);
                            }
                        }
                        @Override
                        public void onAnimationRepeat(Animation animation) {
                        }
                    });
                    mScaleLittleAnimation.setAnimationListener(new Animation.AnimationListener() {
                        @Override
                        public void onAnimationStart(Animation animation) {
                        }
                        @Override
                        public void onAnimationEnd(Animation animation) {
                            if (mScaleBigAnimation != null) {
                                chat_record.startAnimation(mScaleBigAnimation);
                            }
                        }
                        @Override
                        public void onAnimationRepeat(Animation animation) {
                        }
                    });
                    chat_record.startAnimation(mScaleBigAnimation);
                    break;
                case MotionEvent.ACTION_UP:
                    if (!isStop) {
                        mEndTime = System.currentTimeMillis();
                        mTime = (int) ((mEndTime - mStartTime) / 1000);
                        stopRecord();
                        chat_record.setVisibility(View.VISIBLE);
                        try {
                            mVoiceData = Util.encodeBase64File(mSoundData);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        if (isCanceled) {
                            deleteSoundFileUnSend();
                            my_tv_time.setText("0" +'"' );
                            m_tv_notice.setText("录音取消");
                        } else {
                            //录音的总时长为 mTime + "" +'"'
                        }
                    }else{
                        my_tv_time.setText("0");
                        m_tv_notice.setText("重新录音");
                    }
                    break;
                case MotionEvent.ACTION_CANCEL: // 首次开权限时会走这里，录音取消
                    Log.i("record_test","权限影响录音录音");
                    mHandler.removeCallbacks(runnable);
                    chat_tv_sound_length_layout.setVisibility(View.GONE);
                    // 这里一定注意，先release，还要置为null，否则录音会发生错误，还有可能崩溃
                    if (mRecorder != null) {
                        mRecorder.release();
                        mRecorder = null;
                        System.gc();
                    }
                    chat_record.clearAnimation();
                    m_tv_notice.setText("按住说话");
                    isCanceled = true;
                    mScaleBigAnimation = null;
                    mScaleLittleAnimation = null;
                    break;

                case MotionEvent.ACTION_MOVE: // 滑动手指
                    float moveY = motionEvent.getY();
                    if (downY - moveY > 100) {
                        isCanceled = true;
                        m_tv_notice.setText("松开手指可结束录音");
                    }
                    if (downY - moveY < 20) {
                        isCanceled = false;
                        m_tv_notice.setText("向上滑动取消发送");
                    }
                    break;
            }
            return true;
        }
    }
    /**
     * 结束录音
     */
    public void stopRecord() {
        chat_record.clearAnimation();
        mScaleBigAnimation = null;
        mScaleLittleAnimation = null;
        if (mTime < 1) {
            deleteSoundFileUnSend();
            isCanceled = true;
            Toast.makeText(context, "录音时间太短，长按开始录音", Toast.LENGTH_SHORT).show();
        } else {
            m_tv_notice.setText("录音成功");
            // 不加  "" 空串 会出  Resources$NotFoundException 错误
            my_tv_time.setText(mTime + "" + '"');
            if (isCanceled) {

            }else{
            //发送语音消息
            if(sl!=null && mSoundData!=null && !mSoundData.isEmpty()){
                sl.onSuccess(mSoundData,mTime);}}
        }
        //mRecorder.setOnErrorListener(null);
        try {
            mRecorder.stop();
            mRecorder.reset();
            mRecorder.release();
        } catch (Exception e) {
            Log.i("recoder", "stop() failed");
            isCanceled = true;
            m_tv_notice.setVisibility(View.VISIBLE);
            my_tv_time.setText("");
            Toast.makeText(context, "录音发生错误,请重新录音", Toast.LENGTH_LONG).show();
            Log.i("record_test","录音发生错误");
        }
        mHandler.removeCallbacks(runnable);
        if (mRecorder != null) {
            mRecorder = null;
            System.gc();
        }

    }

    // 定时器
    Runnable runnable = new Runnable() {
        @Override
        public void run() {
            // handler自带方法实现定时器
            try {
                long endTime = System.currentTimeMillis();
                int time = (int) ((endTime - mStartTime) / 1000);
                //mRlSoundLengthLayout.setVisibility(View.VISIBLE);
                my_tv_time.setText(time + "" + '"');
                // 限制录音时间不长于一分钟
                if (time > 59) {
                    isStop = true;
                    mTime = time;
                    stopRecord();
                    Toast.makeText(context, "时间过长", Toast.LENGTH_SHORT).show();
                } else {
                    mHandler.postDelayed(this, 1000);
                    isStop = false;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };
    /**
     * 初始化录音动画
     */
    public void initScaleAnim() {
        // TODO 放大
        mScaleBigAnimation = new ScaleAnimation(0.9f, 1.1f, 0.9f, 1.1f,
                Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        mScaleBigAnimation.setDuration(700);
        // TODO 缩小
        mScaleLittleAnimation = new ScaleAnimation(1.1f, 0.9f, 1.1f, 0.9f,
                Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        mScaleLittleAnimation.setDuration(700);
    }

    /**
     * 录音完毕后，若不发送，则删除文件
     */
    public void deleteSoundFileUnSend() {
        mTime = 0;
        if (!"".equals(mSoundData)) {
            try {
                File file = new File(mSoundData);
                file.delete();
                mSoundData = "";
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    //成功回调接口
    public interface OnSuccessListener {
        public void onSuccess(String path,int time);
    }
    /**
     * 生成一个随机的文件名
     *
     * @return
     */
    public String getRandomFileName() {
        String rel = "";
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Date curDate = new Date(System.currentTimeMillis());
        rel = formatter.format(curDate);
        rel = rel + new Random().nextInt(1000);
        return rel;
    }

}
