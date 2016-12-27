package camcard;

import android.Manifest;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CamcardPlugin extends CordovaPlugin {

  private static final int PHOTO_WITH_CAMERA = 0;
  private static final int PHOTO_WITH_DATA = 1;
  private CallbackContext mCallbackContext;
  private String imgName = "camcard.jpg";
  protected final static String[] permissions = {Manifest.permission.CAMERA, Manifest.permission.READ_EXTERNAL_STORAGE};
  private boolean hasCameraPermission = false;
  private boolean hasWritePermission = false;
  private String imagePath;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    File externalFilesDir = cordova.getActivity().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
    imagePath = externalFilesDir.getAbsolutePath();
  }

  @Override
  public void onRestoreStateForActivityResult(Bundle state, CallbackContext callbackContext) {
    mCallbackContext = callbackContext;
    Toast.makeText(cordova.getActivity(), "内存不足，应用已被回收，请重试", Toast.LENGTH_LONG).show();
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    this.mCallbackContext = callbackContext;

    if ("takePicture".equals(action)) {
      checkTakePhotoPermission();
      return true;
    } else if ("choosePicture".equals(action)) {
      checkPickPhotoPermission();
      return true;
    }
    callbackContext.error("error");
    return false;
  }

  private void checkTakePhotoPermission() {
    if (PermissionHelper.hasPermission(this, Manifest.permission.CAMERA)) {
      hasCameraPermission = true;
    }
    if (PermissionHelper.hasPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
      hasWritePermission = true;
    }
    if (!hasWritePermission && !hasCameraPermission) {//两个权限都没有
      PermissionHelper.requestPermissions(this, 1, permissions);
    } else if (!hasCameraPermission) {//没有照相机权限
      PermissionHelper.requestPermission(this, 2, Manifest.permission.CAMERA);
    } else if (!hasWritePermission) {//没有sd卡写权限
      PermissionHelper.requestPermission(this, 3, Manifest.permission.WRITE_EXTERNAL_STORAGE);
    } else {//有权限
      takePhoto();
    }
  }

  private void checkPickPhotoPermission() {
    if (!PermissionHelper.hasPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
      PermissionHelper.requestPermission(this, 4, Manifest.permission.WRITE_EXTERNAL_STORAGE);
    } else {
      //已经不是第一次,已经有权限
      pickPhoto();
    }
  }

  @Override
  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {

    switch (requestCode) {
      case 1:
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
          takePhoto();
        } else {
          Toast.makeText(cordova.getActivity(), "授权失败", Toast.LENGTH_SHORT).show();
          mCallbackContext.error("cancel");
        }
        break;
      case 2:
      case 3:
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          takePhoto();
        } else {
          Toast.makeText(cordova.getActivity(), "授权失败", Toast.LENGTH_SHORT).show();
          mCallbackContext.error("cancel");
        }
        break;
      case 4:
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          pickPhoto();
        } else {
          Toast.makeText(cordova.getActivity(), "授权失败", Toast.LENGTH_SHORT).show();
          mCallbackContext.error("cancel");
        }
        break;
    }
  }

  private void pickPhoto() {
    Intent intent = new Intent();
    intent.setType("image/*");  // 开启Pictures画面Type设定为image
    intent.setAction(Intent.ACTION_GET_CONTENT); //使用Intent.ACTION_GET_CONTENT这个Action
    cordova.startActivityForResult(this, intent, PHOTO_WITH_DATA); //取得相片后返回到本画面
  }

  /**
   * 启动相机拍照
   */
  private void takePhoto() {
    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE); //调用系统相机
    Uri imageUri = Uri.fromFile(new File(imagePath, "image.jpg"));
    //指定照片保存路径（SD卡），image.jpg为一个临时文件，每次拍照后这个图片都会被替换
    intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);

    //直接使用，没有缩小
    cordova.startActivityForResult(this, intent, PHOTO_WITH_CAMERA);  //用户点击了从相机获取
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (resultCode == cordova.getActivity().RESULT_OK) {  //返回成功
      switch (requestCode) {
        case PHOTO_WITH_CAMERA: {//拍照获取图片
          String status = Environment.getExternalStorageState();
          if (status.equals(Environment.MEDIA_MOUNTED)) { //是否有SD卡
            Bitmap smallBitmap = zoomBitmap(imagePath + "/image.jpg");
            smallBitmap = Edit.Brightness(smallBitmap, 30);
            //保存图片
            savePhotoToSDCard(imagePath, imgName, smallBitmap);
            cardRecognize();

          } else {
            mCallbackContext.error("请检查您的SD卡");
          }
          break;
        }
        case PHOTO_WITH_DATA: {//从图库中选择图片
          ContentResolver resolver = cordova.getActivity().getContentResolver();
          //照片的原始资源地址
          Uri originalUri = data.getData();

          try {
            //使用ContentProvider通过URI获取原始图片
            Bitmap photo = MediaStore.Images.Media.getBitmap(resolver, originalUri);
            savePhotoToSDCard(imagePath, "image.jpg", photo);
            Bitmap smallBitmap = zoomBitmap(imagePath + File.separator + "image.jpg");
            smallBitmap = Edit.Brightness(smallBitmap, 30);
            savePhotoToSDCard(imagePath, imgName, smallBitmap);
            cardRecognize();

          } catch (FileNotFoundException e) {
            e.printStackTrace();
          } catch (IOException e) {
            e.printStackTrace();
          }
          break;
        }
      }
    } else {
      mCallbackContext.error("cancel");//取消拍照或者取消从相册中选取照片
    }

  }

  private void cardRecognize() {
    new Thread() {
      @Override
      public void run() {
        try {
          String filepath = imagePath + File.separator + imgName;
          File file = new File(filepath);
          Log.e("399", file.getAbsolutePath());
          URL url = new URL("https://bcr2.intsig.net/BCRService/BCR_VCF2?user=yanjun.li@hand-china.com&pass=T6LD4LTJG8GK5RT3&lang=15&json=1&size=" + file.length());
          HttpURLConnection con = (HttpURLConnection) url.openConnection();
          con.setDoOutput(true);
          con.setDoInput(true);
          con.setRequestMethod("POST");
          OutputStream out = con.getOutputStream();
          FileInputStream inputStream = new FileInputStream(file);
          byte[] data = new byte[2048];
          int len = 0;
          int sum = 0;
          while ((len = inputStream.read(data)) != -1) {
            out.write(data, 0, len);
            sum = len + sum;
          }
          Log.e("399", "upload size=" + sum);
          out.flush();
          inputStream.close();
          out.close();

          int code = con.getResponseCode();
          Log.e("399", "code=" + code + " url=" + url);
          if (code == 200) {
            InputStream inputStream2 = con.getInputStream();
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            while ((len = inputStream2.read(data)) != -1) {
              bos.write(data, 0, len);
            }
            Log.e("399", "result =" + bos.toString());
            Log.e("399", "callbackContext2: " + mCallbackContext);
            mCallbackContext.success(bos.toString());
            inputStream2.close();
            bos.close();
          } else {
            mCallbackContext.error(code);
          }
          con.disconnect();
        } catch (MalformedURLException e) {
          e.printStackTrace();
        } catch (IOException e) {
          mCallbackContext.error("IO异常");
          e.printStackTrace();
        }
      }

      ;
    }.start();

  }

  private Bitmap zoomBitmap(String imagePath) {
    BitmapFactory.Options options = new BitmapFactory.Options();
    options.inJustDecodeBounds = true;
    BitmapFactory.decodeFile(imagePath, options);
    int outWidth = options.outWidth;
    int outHeight = options.outHeight;
    WindowManager windowManager = cordova.getActivity().getWindowManager();
    int winWidth = windowManager.getDefaultDisplay().getWidth();
    int winHeight = windowManager.getDefaultDisplay().getHeight();

    int scale = 1;
    int scaleWidth = outWidth / winWidth;
    int scaleHeight = outHeight / winHeight;
    if (scaleWidth >= scaleHeight && scaleWidth > 1) {
      scale = scaleWidth;
    }
    if (scaleHeight > scaleWidth && scaleHeight > 1) {
      scale = scaleHeight;
    }
    options.inJustDecodeBounds = false;
    options.inSampleSize = scale;
    Bitmap bitmap = BitmapFactory.decodeFile(imagePath, options);
    int degree = readPictureDegree(imagePath);
    bitmap = rotaingImageView(degree, bitmap);
    return bitmap;
  }

  /**
   * 读取图片属性：旋转的角度
   *
   * @param path 图片绝对路径
   * @return degree旋转的角度
   */
  public static int readPictureDegree(String path) {
    int degree = 0;
    try {
      ExifInterface exifInterface = new ExifInterface(path);
      int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
      switch (orientation) {
        case ExifInterface.ORIENTATION_ROTATE_90:
          degree = 90;
          break;
        case ExifInterface.ORIENTATION_ROTATE_180:
          degree = 180;
          break;
        case ExifInterface.ORIENTATION_ROTATE_270:
          degree = 270;
          break;
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
    return degree;
  }

  /**
   * 旋转图片
   *
   * @param angle
   * @param bitmap
   * @return Bitmap
   */
  public static Bitmap rotaingImageView(int angle, Bitmap bitmap) {
    //旋转图片 动作
    Matrix matrix = new Matrix();
    ;
    matrix.postRotate(angle);
    Log.e("marykay", "angle2=" + angle);
    // 创建新的图片
    Bitmap resizedBitmap = Bitmap.createBitmap(bitmap, 0, 0,
      bitmap.getWidth(), bitmap.getHeight(), matrix, true);
    return resizedBitmap;
  }

  /**
   * 保存照片到SDCard
   *
   * @param path        需要保存的路径
   * @param photoName   保存的相片名字
   * @param photoBitmap 照片的Bitmap对象
   */
  private void savePhotoToSDCard(String path, String photoName, Bitmap photoBitmap) {
    FileOutputStream fileOutputStream = null;
    if (android.os.Environment.getExternalStorageState().equals(android.os.Environment.MEDIA_MOUNTED)) {
      File dir = new File(path);
      if (!dir.exists()) {
        dir.mkdirs();
      }
      File photoFile = new File(path, photoName);
      try {
        fileOutputStream = new FileOutputStream(photoFile);
        if (photoBitmap != null) {
          if (photoBitmap.compress(Bitmap.CompressFormat.JPEG, 30, fileOutputStream)) {
            fileOutputStream.flush();
            fileOutputStream.close();
          }
        }
      } catch (FileNotFoundException e) {
        photoFile.delete();
        e.printStackTrace();
      } catch (IOException e) {
        photoFile.delete();
      } finally {
        if (fileOutputStream != null) {
          try {
            fileOutputStream.close();
          } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }
        }
      }
    }
  }
}
