package camcard;

import android.Manifest;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CamcardPlugin extends CordovaPlugin {

  private static final String imgSavePath = "/sdcard/camcard";
  private static final int PHOTO_WITH_CAMERA = 0;
  private static final int PHOTO_WITH_DATA = 1;
  private CallbackContext mCallbackContext;
  private String imgName = "camcard.jpg";
  protected final static String[] permissions = {Manifest.permission.CAMERA, Manifest.permission.READ_EXTERNAL_STORAGE};

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
//      takePhoto();

      return true;
    } else if ("choosePicture".equals(action)) {
      checkPickPhotoPermission();

      return true;
    }
    callbackContext.error("error");
    return false;
  }

  private void checkTakePhotoPermission() {
    final List<String> permissionsList = new ArrayList<String>();
    if (!PermissionHelper.hasPermission(this, Manifest.permission.CAMERA))
      permissionsList.add(Manifest.permission.CAMERA);
    if (!PermissionHelper.hasPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE))
      permissionsList.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
    if (permissionsList.size() != 0) {
      PermissionHelper.requestPermissions(this, 100, permissions);
    } else {
      //已经不是第一次,已经有权限
      takePhoto();
    }
  }

  private void checkPickPhotoPermission() {
    if (!PermissionHelper.hasPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
      PermissionHelper.requestPermission(this, 101, Manifest.permission.WRITE_EXTERNAL_STORAGE);
    } else {
      //已经不是第一次,已经有权限
      pickPhoto();
    }
  }

  @Override
  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
    if (requestCode == 100) {
      if (grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
        takePhoto();
      } else {
        Toast.makeText(cordova.getActivity(), "授权失败", Toast.LENGTH_SHORT).show();
        mCallbackContext.error("cancel");
      }
    } else if (requestCode == 101) {
      if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        pickPhoto();
      } else {
        Toast.makeText(cordova.getActivity(), "授权失败", Toast.LENGTH_SHORT).show();
        mCallbackContext.error("cancel");
      }
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
//      Uri imageUri = Uri.fromFile(new File(Environment.getExternalStorageDirectory(),"image.jpg"));
    Uri imageUri = Uri.fromFile(new File(getCacheDir(), "image.jpg"));
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

            Bitmap bitmap = BitmapFactory.decodeFile(getCacheDir() + "image.jpg");

            //保存图片
            savePhotoToSDCard(imgSavePath, imgName, bitmap);
            Bitmap smallBitmap = getSmallBitmap(imgSavePath + "/" + imgName);
            savePhotoToSDCard(imgSavePath, imgName, smallBitmap);
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
            savePhotoToSDCard(imgSavePath, imgName, photo);
            File imgFile = new File(imgSavePath, imgName);
            if (imgFile.length() > 300000) {
              Bitmap smallBitmap = getSmallBitmap(imgSavePath + "/" + imgName);
              savePhotoToSDCard(imgSavePath, imgName, smallBitmap);
            }
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
//          File file = new File(imgSavePath,imgName);
          String filepath = imgSavePath + "/" + imgName;
          File file = new File(filepath);
          Log.e("399", file.getAbsolutePath());
          URL url = new URL("http://bcr2.intsig.net/BCRService/BCR_VCF2?user=yanjun.li@hand-china.com&pass=T6LD4LTJG8GK5RT3&lang=15&json=1&size=" + file.length());
          HttpURLConnection con = (HttpURLConnection) url.openConnection();
          con.setDoOutput(true);
          con.setDoInput(true);
          con.setRequestMethod("POST");
//          con.setRequestProperty("transfer-encoding", "chunked");
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
//            Log.e("399", "result ="+bos.toString());
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

  /**
   * 创建图片不同的文件名
   **/
  private String createPhotoFileName() {
    String fileName = "";
    Date date = new Date(System.currentTimeMillis());  //系统当前时间
    SimpleDateFormat dateFormat = new SimpleDateFormat("'IMG'_yyyyMMdd_HHmmss");
    fileName = dateFormat.format(date) + ".jpg";
    return fileName;
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
          if (photoBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fileOutputStream)) {
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

  //计算图片的缩放值
  public static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
    final int height = options.outHeight;
    final int width = options.outWidth;
    int inSampleSize = 1;

    if (height > reqHeight || width > reqWidth) {
      final int heightRatio = Math.round((float) height / (float) reqHeight);
      final int widthRatio = Math.round((float) width / (float) reqWidth);
      inSampleSize = heightRatio < widthRatio ? heightRatio : widthRatio;
    }
    return inSampleSize;
  }

  // 根据路径获得图片并压缩，返回bitmap用于显示
  public static Bitmap getSmallBitmap(String filePath) {
    final BitmapFactory.Options options = new BitmapFactory.Options();
    options.inJustDecodeBounds = true;
    BitmapFactory.decodeFile(filePath, options);

    // Calculate inSampleSize
    options.inSampleSize = calculateInSampleSize(options, 288, 480);
//      options.inSampleSize = calculateInSampleSize(options, 400, 800);

    // Decode bitmap with inSampleSize set
    options.inJustDecodeBounds = false;

    return BitmapFactory.decodeFile(filePath, options);
  }

  /**
   * 获取缓存目录
   */
  public String getCacheDir() {
    return getDir("cache");
  }

  /**
   * 获取应用目录，当SD卡存在时，获取SD卡上的目录，当SD卡不存在时，获取应用的cache目录
   */
  public String getDir(String name) {
    StringBuilder sb = new StringBuilder();
    if (isSDCardAvailable()) {
      sb.append(getExternalStoragePath());
    } else {
      sb.append(getCachePath());
    }
    sb.append(name);
    sb.append(File.separator);
    String path = sb.toString();
    if (createDirs(path)) {
      return path;
    } else {
      return null;
    }
  }

  /**
   * 判断SD卡是否挂载
   */
  public boolean isSDCardAvailable() {
    if (Environment.MEDIA_MOUNTED.equals(Environment
      .getExternalStorageState())) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 获取SD下的应用目录
   */
  public String getExternalStoragePath() {
    StringBuilder sb = new StringBuilder();
    sb.append(Environment.getExternalStorageDirectory().getAbsolutePath());
    sb.append(File.separator);
    String root_dir = "Android/data/" + cordova.getActivity().getPackageName();
    sb.append(root_dir);
    sb.append(File.separator);
    return sb.toString();
  }

  /**
   * 获取应用的cache目录
   */
  public String getCachePath() {
    File f = cordova.getActivity().getCacheDir();
    if (null == f) {
      return null;
    } else {
      return f.getAbsolutePath() + "/";
    }
  }

  /**
   * 创建文件夹
   */
  public static boolean createDirs(String dirPath) {
    File file = new File(dirPath);
    if (!file.exists() || !file.isDirectory()) {
      return file.mkdirs();
    }
    return true;
  }

}
