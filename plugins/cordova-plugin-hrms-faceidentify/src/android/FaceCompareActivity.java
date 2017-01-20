package com.hand.face.ui;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.graphics.Point;
import android.graphics.RectF;
import android.hardware.Camera;
import android.hardware.Camera.Face;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.sdk.android.oss.ClientConfiguration;
import com.alibaba.sdk.android.oss.ClientException;
import com.alibaba.sdk.android.oss.OSS;
import com.alibaba.sdk.android.oss.OSSClient;
import com.alibaba.sdk.android.oss.ServiceException;
import com.alibaba.sdk.android.oss.callback.OSSCompletedCallback;
import com.alibaba.sdk.android.oss.callback.OSSProgressCallback;
import com.alibaba.sdk.android.oss.common.auth.OSSCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSPlainTextAKSKCredentialProvider;
import com.alibaba.sdk.android.oss.internal.OSSAsyncTask;
import com.alibaba.sdk.android.oss.model.PutObjectRequest;
import com.alibaba.sdk.android.oss.model.PutObjectResult;
import com.hand.face.common.Config;
import com.hand.face.common.LoadingDialog;
import com.hand.face.myinterface.CameraInterface;
import com.hand.face.utils.DisplayUtil;
import com.hand.face.utils.EventUtil;
import com.hand.face.utils.FileUtil;
import com.hand.face.utils.GoogleFaceDetect;
import com.hand.face.utils.NotifyMessageManager;
import com.hand.face.utils.Utils;
import com.hand.face.view.CameraSurfaceView;
import com.hand.face.view.FaceView;
import com.hand.face.view.MaskView;
import com.youtu.Youtu;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by xiang.wang on 2016/12/8.
 * 视频流获取检测到人脸的那一帧视频
 */
public class FaceCompareActivity extends Activity {
    private String endpoint = "http://oss-cn-shanghai.aliyuncs.com";
    private String nameSapce = "http://handbk.oss-cn-shanghai.aliyuncs.com";
    private OSSCredentialProvider credentialProvider = new OSSPlainTextAKSKCredentialProvider("LTAIf20TU2Tdb8jz", "7f2vPdAYXeImOg80I6y43huIvu171i");
    private OSS oss;
    private static final int CAMERA_PERMISSION_REQUEST = 1;
    private static final String TAG = "FaceCompareActivity";
    CameraSurfaceView surfaceView = null;
    FaceView faceView;
    float previewRate = -1f;
    private MainHandler mMainHandler = null;
    GoogleFaceDetect googleFaceDetect = null;
    ImageButton switchBtn;
    //视频检测到人脸的次数
    private int times = 0;
//    private ImageView img;
    private MaskView mask;
    private String APP_ID = "";
    private String SECRET_ID = "";
    private String SECRET_KEY = "";
    private Youtu faceYoutu;
    private LoadingDialog loadingDialog;
    private boolean pictureLock = true;
    private ExecutorService mImageThreadPool = Executors.newFixedThreadPool(3);
    private MyHandler handler;
    private Matrix mMatrix = new Matrix();
    private RectF mRect = new RectF();
    //人脸矩形的左右左边范围
    private int faceLeft=0;
    private int faceRight=0;
    //人脸矩形的上下范围
    private int faceTop=0;
    private int faceBottom=0;
    private TextView textv_face_info;
    private NotifyMessageManager notify;
    //屏幕宽度
    private int w_screen;
    private Timer timer;
    public static void actionStart(Context context){
        Intent intent = new Intent(context,FaceCompareActivity.class);
        context.startActivity(intent);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(Utils.getResourceId(FaceCompareActivity.this, "activity_video", "layout"));
        ClientConfiguration conf = new ClientConfiguration();
        conf.setConnectionTimeout(15 * 1000); // 连接超时，默认15秒
        conf.setSocketTimeout(20 * 1000); // socket超时，默认15秒
        conf.setMaxConcurrentRequest(5); // 最大并发请求书，默认5个
        conf.setMaxErrorRetry(2); // 失败后最大重试次数，默认2次
        oss = new OSSClient(FaceCompareActivity.this, endpoint, credentialProvider,conf);
        //运行时权限检测
        if (ContextCompat.checkSelfPermission(FaceCompareActivity.this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
        {
            //不具有camera权限 申请权限
            ActivityCompat.requestPermissions(FaceCompareActivity.this, new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST);
        }else{
        init();}
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case CAMERA_PERMISSION_REQUEST: {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    init();
                } else {
                }
                return;
            }
        }
    }
    private void init(){
        initUI();
        initViewParams();
        //计算测量范围
        initWH();
        notify = NotifyMessageManager.getInstance();
        handler = new MyHandler(FaceCompareActivity.this);
        timer = new Timer(true);
        APP_ID = Config.APP_ID;
        SECRET_ID = Config.SECRET_ID;
        SECRET_KEY = Config.SECRET_KEY;
        faceYoutu = new Youtu(APP_ID, SECRET_ID, SECRET_KEY, Youtu.API_YOUTU_END_POINT);
        loadingDialog = new LoadingDialog(FaceCompareActivity.this);
        mMainHandler = new MainHandler();
        googleFaceDetect = new GoogleFaceDetect(getApplicationContext(), mMainHandler);
        mMainHandler.sendEmptyMessageDelayed(EventUtil.CAMERA_HAS_STARTED_PREVIEW, 1500);
    }
    private void initWH(){
        DisplayMetrics dm = getResources().getDisplayMetrics();
        w_screen = dm.widthPixels;
        int h_screen = dm.heightPixels;
        //获取屏幕的百分之九十的一半作为半径 根据圆内最大正方形的左上角坐标计算left
        faceLeft = w_screen * 9 / 20 * 2 / 10;
        faceRight = w_screen-faceLeft;
        faceTop = h_screen/2 -  w_screen*9/20 + 20;
        faceBottom = h_screen/2 +  w_screen*9/20 + 20;
        boolean isMirror = false;
        int Id = CameraInterface.getInstance().getCameraId();
        if(Id == Camera.CameraInfo.CAMERA_FACING_BACK){
            isMirror = false; //后置Camera无需mirror
        }else if(Id == Camera.CameraInfo.CAMERA_FACING_FRONT){
            isMirror = true;  //前置Camera需要mirror
        }
        Utils.prepareMatrix(mMatrix, isMirror, 90, w_screen, h_screen);
        mMatrix.postRotate(0);
    }
    private void initUI(){
        surfaceView = (CameraSurfaceView)findViewById(Utils.getResourceId(FaceCompareActivity.this, "camera_surfaceview", "id"));
        faceView = (FaceView)findViewById(Utils.getResourceId(FaceCompareActivity.this, "face_view", "id"));
        textv_face_info = (TextView) findViewById(Utils.getResourceId(FaceCompareActivity.this, "textv_face_info", "id"));
        switchBtn = (ImageButton) findViewById(Utils.getResourceId(FaceCompareActivity.this, "btn_switch", "id"));
        mask = (MaskView) findViewById(Utils.getResourceId(FaceCompareActivity.this, "mask", "id"));
        switchBtn.setVisibility(View.GONE);
//        img = (ImageView) findViewById(R.id.img);
//        switchBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                 //切换摄像头
//                stopGoogleFaceDetect();
//                int newId = (CameraInterface.getInstance().getCameraId() + 1)%2;
//                CameraInterface.getInstance().doStopCamera();
//                //人脸登录默认前置摄像头
//                CameraInterface.getInstance().doOpenCamera(null,newId);
//                CameraInterface.getInstance().doStartPreview(surfaceView.getSurfaceHolder(), previewRate);
//                mMainHandler.sendEmptyMessageDelayed(EventUtil.CAMERA_HAS_STARTED_PREVIEW, 1500);
//            }
//        });
    }
    private void initViewParams(){
        LayoutParams params = surfaceView.getLayoutParams();
        Point p = DisplayUtil.getScreenMetrics(this);
        params.width = p.x;
        params.height = p.y;
        previewRate = DisplayUtil.getScreenRate(this); //默认全屏的比例预览
        surfaceView.setLayoutParams(params);
    }



//    @Override
//    public void onClick(View v) {
//
//        switch (v.getId()){
//
//            case R.id.btn_switch:
//                //切换摄像头
//                stopGoogleFaceDetect();
//                int newId = (CameraInterface.getInstance().getCameraId() + 1)%2;
//                CameraInterface.getInstance().doStopCamera();
//                //人脸登录默认前置摄像头
//                CameraInterface.getInstance().doOpenCamera(null,newId);
//                CameraInterface.getInstance().doStartPreview(surfaceView.getSurfaceHolder(), previewRate);
//                mMainHandler.sendEmptyMessageDelayed(EventUtil.CAMERA_HAS_STARTED_PREVIEW, 1500);
////                startGoogleFaceDetect();
//                break;
//        }
//    }

    private  class MainHandler extends Handler {

        @Override
        public void handleMessage(Message msg) {
            // TODO Auto-generated method stub
            switch (msg.what){
                case EventUtil.UPDATE_FACE_RECT:
                    Face[] faces = (Face[]) msg.obj;
//                    //当检测到人脸
                    if(faces.length>0){
                        Log.i(TAG,String.valueOf(times));
                        mRect.set(faces[0].rect);
                        mMatrix.mapRect(mRect);
                        //加范围控制 给范围四周加一些误差 左右20 上下40
                        if(mRect.left>=(faceLeft-20) && mRect.right<=(faceRight+20) && mRect.top >= (faceTop-40) && mRect.bottom <=(faceBottom+40)){
                            textv_face_info.setText("请保持不动");
                            times++;
                        }else{
                            textv_face_info.setText("请将人脸放入圆圈内");
                            times = 0;
                        }
                    }else{
                        times = 0;
                        textv_face_info.setText("未检测到人脸");
                    }
                    if(times>=10 && pictureLock){
                        textv_face_info.setVisibility(View.GONE);
                        //检测
                        try {
                            detect();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    //停止画框功能
//                    faceView.setFaces(faces);
                    break;
                case EventUtil.CAMERA_HAS_STARTED_PREVIEW:
                    try {
                        startGoogleFaceDetect();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    break;
            }
            super.handleMessage(msg);
        }

    }
    private void detect() throws Exception{
        pictureLock = false;
        if(loadingDialog!=null) {
            loadingDialog.setText("正在检测人脸,请等待...");
            loadingDialog.show();}
        if(faceYoutu!=null){
            mImageThreadPool.execute(new Runnable() {
                @Override
                public void run() {
                    Bitmap mImage = surfaceView.getPicture();
                    //保存图片
                    String path = getFilesDir().getPath();
                    FileUtil.saveBitmap(FileUtil.centerSquareScaleBitmap(mImage, (faceRight - faceLeft) * mImage.getWidth() / w_screen + 20), path);
                    if (mImage != null) {
                        try {
                            JSONObject respose = faceYoutu.DetectFace(mImage, 1);
                            Message msg = new Message();
                            msg.what = 0x100;
                            Bundle bundle = new Bundle();
                            bundle.putString("respose", respose.toString());
                            msg.setData(bundle);
                            handler.sendMessage(msg);
                        } catch (Exception e) {
							Message msg = new Message();
							handler.sendEmptyMessage(0x101);
                            e.printStackTrace();
                        }
                    } else {
                        Message msg = new Message();
                        handler.sendEmptyMessage(0x101);
                    }
                }
            });
        }
    }
    private void startGoogleFaceDetect() throws Exception{
        Camera.Parameters params = CameraInterface.getInstance().getCameraParams();
        String phoneName = android.os.Build.MODEL;
        if(phoneName!=null && !phoneName.isEmpty() && phoneName.contains("HUAWEI")){
            //开启定时器进行获取视频流图片检测
            textv_face_info.setText("请将人脸放入圆圈内");
            TimerTask task = new TimerTask(){
                public void run() {
                    Message message = new Message();
                    message.what = 0x103;
                    handler.sendMessage(message);
                }
            };
            if(timer!=null){
                timer.schedule(task, 3000, 3000);
            }
        }else if(phoneName!=null && !phoneName.isEmpty() && phoneName.contains("X800")){
            //开启定时器进行获取视频流图片检测
            textv_face_info.setText("请将人脸放入圆圈内");
            TimerTask task = new TimerTask(){
                public void run() {
                    Message message = new Message();
                    message.what = 0x103;
                    handler.sendMessage(message);
                }
            };
            if(timer!=null){
                timer.schedule(task, 3000, 3000);
            }
        }else if(phoneName!=null && !phoneName.isEmpty() && phoneName.contains("vivo X7Plus")){
            //开启定时器进行获取视频流图片检测
            textv_face_info.setText("请将人脸放入圆圈内");
            TimerTask task = new TimerTask(){
                public void run() {
                    Message message = new Message();
                    message.what = 0x103;
                    handler.sendMessage(message);
                }
            };
            if(timer!=null){
                timer.schedule(task, 3000, 3000);
            }
        }else if(params.getMaxNumDetectedFaces() > 0){
            if(faceView != null){
                faceView.clearFaces();
                faceView.setVisibility(View.VISIBLE);
            }
            CameraInterface.getInstance().getCameraDevice().setFaceDetectionListener(googleFaceDetect);
            CameraInterface.getInstance().getCameraDevice().startFaceDetection();
        }else{
            //开启定时器进行获取视频流图片检测
            textv_face_info.setText("请将人脸放入圆圈内");
            TimerTask task = new TimerTask(){
                public void run() {
                    Message message = new Message();
                    message.what = 0x103;
                    handler.sendMessage(message);
                }
            };
            if(timer!=null){
                timer.schedule(task, 3000, 3000);
            }
        }
    }
    private void stopGoogleFaceDetect(){
        Camera.Parameters params = CameraInterface.getInstance().getCameraParams();
        if(params!=null  && params.getMaxNumDetectedFaces() > 0){
            CameraInterface.getInstance().getCameraDevice().setFaceDetectionListener(null);
            CameraInterface.getInstance().getCameraDevice().stopFaceDetection();
            faceView.clearFaces();
        }
    }
    public interface NV21ImgCallBack{
        public void getImgBuffer(byte[] nv21);
    }
    // 防止handler出现内存泄露 写成静态类
    static class MyHandler extends Handler {
        // 持有当前activity的弱引用
        WeakReference<FaceCompareActivity> myActivity;

        public MyHandler(FaceCompareActivity act) {
            myActivity = new WeakReference<FaceCompareActivity>(act);
        }
        @Override
        public void handleMessage(Message msg) {
            FaceCompareActivity myAct = myActivity.get();
            switch (msg.what) {
                case 0x100:
                    //图片检测返回
                    if(myAct.loadingDialog!=null && myAct.loadingDialog.isShowing())  myAct.loadingDialog.dismiss();
                    String respose = msg.getData().getString("respose");
                    try {
                        JSONObject face = new JSONObject(respose);
                        //错误码和错误编号
                        String errorcode = face.getString("errorcode");
                        String errormsg = face.getString("errormsg");
                        if(!"0".equals(errorcode)){
                            myAct.times = 0;
                            myAct.pictureLock = true;
                            myAct.textv_face_info.setVisibility(View.VISIBLE);
                            Toast.makeText(myAct, "图片校验失败，请重新检测人脸照片", Toast.LENGTH_SHORT).show();
                        }else{
                            JSONArray jsonArr = face.getJSONArray("face");
                            JSONObject faceObj = jsonArr.getJSONObject(0);
                            //获取保存的图片路径
                            String imgPath = FileUtil.getSavePath();
                            faceObj.put("imgPath", imgPath);
                            myAct.uploadImage(imgPath,faceObj);
//                            myAct.notify.sendNotifyMessage(faceObj.toString());
                            if(myAct.timer!=null){
                                myAct.timer.cancel();
                            }
//                            myAct.finish();
                        }
                    }catch (JSONException e) {
                        //打开检测锁 重置检测次数
                        myAct.times = 0;
                        myAct.pictureLock = true;
                        myAct.textv_face_info.setVisibility(View.VISIBLE);
                        Toast.makeText(myAct, "图片校验失败，请重新检测人脸照片", Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    }
                    break;
                case 0x101:
                    if(myAct.loadingDialog!=null && myAct.loadingDialog.isShowing()) myAct.loadingDialog.dismiss();
                    myAct. times = 0;
                    myAct.pictureLock = true;
                    myAct.textv_face_info.setVisibility(View.VISIBLE);
                    break;
                case 0x103:
                    if(myAct.pictureLock){
                        try {
                            myAct.detect();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    break;
                default:
                    break;
            }
        }

    }

    @Override
    protected void onDestroy() {
        //关闭人脸识别
        stopGoogleFaceDetect();
        //关闭摄像头
        CameraInterface.getInstance().doStopCamera();
        if(timer!=null){
            timer.cancel();
        }
        super.onDestroy();
    }
    private void uploadImage(String url,final JSONObject obj){
        if(loadingDialog!=null) {
            loadingDialog.setText("正在上传图片,请等待...");
            loadingDialog.show();}
        final String time = System.currentTimeMillis()+"";
        // 构造上传请求
        PutObjectRequest put = new PutObjectRequest("handbk",time+".jpg", url);
        // 异步上传时可以设置进度回调
        put.setProgressCallback(new OSSProgressCallback<PutObjectRequest>() {
            @Override
            public void onProgress(PutObjectRequest request, long currentSize, long totalSize) {
                Log.d("PutObject", "currentSize: " + currentSize + " totalSize: " + totalSize);
            }
        });
        OSSAsyncTask task = oss.asyncPutObject(put, new OSSCompletedCallback<PutObjectRequest, PutObjectResult>() {
            @Override
            public void onSuccess(PutObjectRequest request, PutObjectResult result) {
                Log.d("PutObject", "UploadSuccess");
                try {
                    obj.put("aliyunPath", nameSapce+"/"+time+".jpg");
                    Log.d("PutObject", obj.toString());
                    notify.sendNotifyMessage(obj.toString());
                    if(loadingDialog!=null && loadingDialog.isShowing()) loadingDialog.dismiss();
                    FaceCompareActivity.this.finish();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
//                Toast.makeText(FaceCompareActivity.this,"上传成功"+result.toString(),Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onFailure(PutObjectRequest request, ClientException clientExcepion, ServiceException serviceException) {
                // 请求异常
                if (clientExcepion != null) {
                    // 本地异常如网络异常等
                    clientExcepion.printStackTrace();
                }
                if (serviceException != null) {
                    // 服务异常
                    Log.e("ErrorCode", serviceException.getErrorCode());
                    Log.e("RequestId", serviceException.getRequestId());
                    Log.e("HostId", serviceException.getHostId());
                    Log.e("RawMessage", serviceException.getRawMessage());
                }
                if(loadingDialog!=null && loadingDialog.isShowing()) loadingDialog.dismiss();
                FaceCompareActivity.this.finish();
                Toast.makeText(FaceCompareActivity.this,"图片上传失败",Toast.LENGTH_SHORT).show();
            }
        });
        // task.cancel(); // 可以取消任务
        // task.waitUntilFinished(); // 可以等待任务完成
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if(timer!=null){
            timer.cancel();
        }
        return super.onKeyDown(keyCode, event);
    }
}
