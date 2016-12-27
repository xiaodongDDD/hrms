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
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
/**
 * Created by xiangwang on 2016/12/17.
 */
public class FaceSerchActivity extends Activity {
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
        Intent intent = new Intent(context,FaceSerchActivity.class);
        context.startActivity(intent);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(Utils.getResourceId(FaceSerchActivity.this, "activity_video", "layout"));
        //运行时权限检测
        if (ContextCompat.checkSelfPermission(FaceSerchActivity.this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
        {
            //不具有camera权限 申请权限
            ActivityCompat.requestPermissions(FaceSerchActivity.this, new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST);
        }else{
            init();}
    }
    private void init(){
        initUI();
        initViewParams();
        //计算测量范围
        initWH();
        notify = NotifyMessageManager.getInstance();
        handler = new MyHandler(FaceSerchActivity.this);
        APP_ID = Config.APP_ID;
        SECRET_ID = Config.SECRET_ID;
        SECRET_KEY = Config.SECRET_KEY;
        faceYoutu = new Youtu(APP_ID, SECRET_ID, SECRET_KEY, Youtu.API_YOUTU_END_POINT);
        loadingDialog = new LoadingDialog(FaceSerchActivity.this);
        mMainHandler = new MainHandler();
        googleFaceDetect = new GoogleFaceDetect(getApplicationContext(), mMainHandler);
        mMainHandler.sendEmptyMessageDelayed(EventUtil.CAMERA_HAS_STARTED_PREVIEW, 1500);
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
        surfaceView = (CameraSurfaceView)findViewById(Utils.getResourceId(FaceSerchActivity.this, "camera_surfaceview", "id"));
        faceView = (FaceView)findViewById(Utils.getResourceId(FaceSerchActivity.this, "face_view", "id"));
        textv_face_info = (TextView) findViewById(Utils.getResourceId(FaceSerchActivity.this, "textv_face_info", "id"));
        switchBtn = (ImageButton) findViewById(Utils.getResourceId(FaceSerchActivity.this, "btn_switch", "id"));
        mask = (MaskView) findViewById(Utils.getResourceId(FaceSerchActivity.this, "mask", "id"));
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
                        detect();
                    }
                    //停止画框功能
//                    faceView.setFaces(faces);
                    break;
                case EventUtil.CAMERA_HAS_STARTED_PREVIEW:
                    startGoogleFaceDetect();
                    break;
            }
            super.handleMessage(msg);
        }

    }
    private void detect(){
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
                    FileUtil.saveBitmap(FileUtil.centerSquareScaleBitmap(mImage,(faceRight-faceLeft)*mImage.getWidth()/w_screen+20),path);
                    if (mImage != null) {
                        try {
                            JSONObject respose = faceYoutu.DetectFace(mImage, 1);
                            Message msg = new Message();
                            msg.what = 0x100;
                            Bundle bundle=new Bundle();
                            bundle.putString("respose", respose.toString());
                            msg.setData(bundle);
                            handler.sendMessage(msg);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }else{
                        Message msg = new Message();
                        handler.sendEmptyMessage(0x101);
                    }
                }
            });
        }
    }
    private void startGoogleFaceDetect(){
        Camera.Parameters params = CameraInterface.getInstance().getCameraParams();
        if(params.getMaxNumDetectedFaces() > 0){
            if(faceView != null){
                faceView.clearFaces();
                faceView.setVisibility(View.VISIBLE);
            }
            CameraInterface.getInstance().getCameraDevice().setFaceDetectionListener(googleFaceDetect);
            CameraInterface.getInstance().getCameraDevice().startFaceDetection();
        }else{
            //开启定时器进行获取视频流图片检测
            textv_face_info.setText("请将人脸放入圆圈内");
            timer = new Timer(true);
            TimerTask task = new TimerTask(){
                public void run() {
                    Message message = new Message();
                    message.what = 0x103;
                    handler.sendMessage(message);
                }
            };
            timer.schedule(task, 3000, 3000);
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
        WeakReference<FaceSerchActivity> myActivity;

        public MyHandler(FaceSerchActivity act) {
            myActivity = new WeakReference<FaceSerchActivity>(act);
        }
        @Override
        public void handleMessage(Message msg) {
            FaceSerchActivity myAct = myActivity.get();
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
                            faceObj.put("imgPath",imgPath);
                            myAct.notify.sendNotifyMessage(faceObj.toString());
                            myAct.finish();
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
                        myAct.detect();
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
        super.onDestroy();
    }
}
