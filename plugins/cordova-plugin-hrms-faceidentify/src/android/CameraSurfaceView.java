package com.hand.face.view;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageFormat;
import android.graphics.Matrix;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.hardware.Camera;
import android.hardware.Camera.CameraInfo;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import com.hand.face.myinterface.CameraInterface;
import com.hand.face.ui.FaceCompareActivity;

import java.io.ByteArrayOutputStream;

/**
 * Created by USER on 2016/12/10.
 */
public class CameraSurfaceView extends SurfaceView implements SurfaceHolder.Callback,FaceCompareActivity.NV21ImgCallBack {
    private static final String TAG = "CameraSurfaceView";
    CameraInterface mCameraInterface;
    Context mContext;
    SurfaceHolder mSurfaceHolder;
//    /** 当前屏幕旋转角度*/
//    private int mOrientation=0;
    private byte[] buffer;
    private String contextName;
    private int orientation = -90;
    private int cameraId = 0;
    public CameraSurfaceView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // TODO Auto-generated constructor stub
        mContext = context;
        mSurfaceHolder = getHolder();
        mSurfaceHolder.setFormat(PixelFormat.TRANSPARENT);//translucent半透明 transparent透明
        mSurfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
        mSurfaceHolder.addCallback(this);
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        // TODO Auto-generated method stub
        Log.i(TAG, "surfaceCreated...");
        CameraInterface.getInstance().setCallBack(this);
        contextName = mContext.getClass().getName();
        if("com.hand.face.ui.FaceCompareActivity".equals(contextName)){
            CameraInterface.getInstance().doOpenCamera(null, CameraInfo.CAMERA_FACING_FRONT);
            cameraId = CameraInfo.CAMERA_FACING_FRONT;
        }else if("com.hand.face.ui.FaceSerchActivity".equals(contextName)){
            CameraInterface.getInstance().doOpenCamera(null, CameraInfo.CAMERA_FACING_BACK);
            cameraId = CameraInfo.CAMERA_FACING_BACK;
        }else{
            CameraInterface.getInstance().doOpenCamera(null, CameraInfo.CAMERA_FACING_FRONT);
            cameraId = CameraInfo.CAMERA_FACING_FRONT;
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width,
                               int height) {
        // TODO Auto-generated method stub
        Log.i(TAG, "surfaceChanged...");
        CameraInterface.getInstance().doStartPreview(mSurfaceHolder, 1.333f);
//        updateCameraOrientation();
        if(CameraInterface.getInstance()!=null &&  CameraInterface.getInstance().getCameraParams()!=null){
            if("com.hand.face.ui.FaceCompareActivity".equals(contextName)){
                setCameraDisplayOrientation((Activity)mContext,cameraId,CameraInterface.getInstance().getmCamera());
            }else if("com.hand.face.ui.FaceSerchActivity".equals(contextName)){
                setCameraDisplayOrientation((Activity)mContext,cameraId,CameraInterface.getInstance().getmCamera());
            }
        }
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        // TODO Auto-generated method stub
        Log.i(TAG, "surfaceDestroyed...");
        CameraInterface.getInstance().doStopCamera();
    }
    public SurfaceHolder getSurfaceHolder(){
        return mSurfaceHolder;
    }
    public Bitmap getPicture(){
        Bitmap bmp = null;
        //转化为图片
        if(buffer!=null){
            YuvImage image = new YuvImage(buffer, ImageFormat.NV21, CameraInterface.getInstance().getCameraParams().getPreviewSize().width, CameraInterface.getInstance().getCameraParams().getPreviewSize().height, null);            //ImageFormat.NV21  640 480
            ByteArrayOutputStream outputSteam = new ByteArrayOutputStream();
            image.compressToJpeg(new Rect(0, 0, image.getWidth(), image.getHeight()), 85, outputSteam); // 将NV21格式图片，以质量70压缩成Jpeg，并得到JPEG数据流
            byte[] jpegData = outputSteam.toByteArray();                                                //从outputSteam得到byte数据
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inSampleSize = 1;
            bmp = BitmapFactory.decodeByteArray(jpegData, 0, jpegData.length, options);
            if(CameraInfo.CAMERA_FACING_FRONT == CameraInterface.getInstance().getCameraId()){
                bmp =  rotaingImageView(-orientation, bmp);//旋转图片
            }else{
                bmp =  rotaingImageView(orientation, bmp);//旋转图片
            }
        }
        return bmp;
    }
    private Bitmap rotaingImageView(int angle , Bitmap bitmap) {
        //旋转图片 动作
        Matrix matrix = new Matrix();;
        matrix.postRotate(angle);
        System.out.println("angle2=" + angle);
        // 创建新的图片
        Bitmap resizedBitmap = Bitmap.createBitmap(bitmap, 0, 0,
                bitmap.getWidth(), bitmap.getHeight(), matrix, true);
        return resizedBitmap;
    }
    /**
     *   根据当前朝向修改保存图片的旋转角度
     */
//    private void updateCameraOrientation(){
//        if(CameraInterface.getInstance()!=null &&  CameraInterface.getInstance().getCameraParams()!=null){
//            Camera.Parameters parameters = CameraInterface.getInstance().getCameraParams();
//            //rotation参数为 0、90、180、270。水平方向为0。
//            int rotation=90+mOrientation==360?0:90+mOrientation;
//            //前置摄像头需要对垂直方向做变换，否则照片是颠倒的
//            if(CameraInfo.CAMERA_FACING_FRONT == CameraInterface.getInstance().getCameraId()){
//                if(rotation==90) rotation=270;
//                else if (rotation==270) rotation=90;
//            }
//            parameters.setRotation(rotation);//生成的图片转90°
//            //预览图片旋转90°
//            CameraInterface.getInstance().getmCamera().setDisplayOrientation(90);//预览转90°
//            CameraInterface.getInstance().getmCamera().setParameters(parameters);
//            //开启屏幕朝向监听
//            startOrientationChangeListener();
//        }
//    }
    /**
     *   启动屏幕朝向改变监听函数 用于在屏幕横竖屏切换时改变保存的图片的方向
     */
//    private  void startOrientationChangeListener() {
//        OrientationEventListener mOrEventListener = new OrientationEventListener(mContext) {
//            @Override
//            public void onOrientationChanged(int rotation) {
//
//                if (((rotation >= 0) && (rotation <= 45)) || (rotation > 315)){
//                    rotation=0;
//                }else if ((rotation > 45) && (rotation <= 135))  {
//                    rotation=90;
//                }
//                else if ((rotation > 135) && (rotation <= 225)) {
//                    rotation=180;
//                }
//                else if((rotation > 225) && (rotation <= 315)) {
//                    rotation=270;
//                }else {
//                    rotation=0;
//                }
//                if(rotation==mOrientation)
//                    return;
//                mOrientation=rotation;
//                updateCameraOrientation();
//            }
//        };
//        mOrEventListener.enable();
//    }

    @Override
    public void getImgBuffer(byte[] nv21) {
        if (null == nv21) {
            return;
        }
        if(buffer == null){
            buffer = new byte[nv21.length];
        }
        synchronized (nv21) {
            System.arraycopy(nv21, 0, buffer, 0, nv21.length);
        }
    }
    public  int getDisplayRotation(Activity activity) {
        int rotation = activity.getWindowManager().getDefaultDisplay()
                .getRotation();
        switch (rotation) {
            case Surface.ROTATION_0: return 0;
            case Surface.ROTATION_90: return 90;
            case Surface.ROTATION_180: return 180;
            case Surface.ROTATION_270: return 270;
        }
        return 0;
    }
    public  void setCameraDisplayOrientation(Activity activity,
                                             int cameraId, Camera camera) {
        // See android.hardware.Camera.setCameraDisplayOrientation for
        // documentation.
        Camera.CameraInfo info = new Camera.CameraInfo();
        Camera.getCameraInfo(cameraId, info);
        int degrees = getDisplayRotation(activity);
        int result;
        if (info.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
            result = (info.orientation + degrees) % 360;
            result = (360 - result) % 360; // compensate the mirror
        } else { // back-facing
            result = (info.orientation - degrees + 360) % 360;
        }
        orientation = result;
        camera.setDisplayOrientation(result);
    }
}
