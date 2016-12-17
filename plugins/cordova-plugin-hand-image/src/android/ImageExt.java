package  com.hand;


import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.util.Log;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;


public class  ImageExt extends CordovaPlugin {

    private String TAG ="ImageExt";
    public CallbackContext callbackContext;


    @Override
   public void initialize(CordovaInterface cordova, CordovaWebView webView) {
      super.initialize(cordova, webView);
   }

   @Override
   public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
       this.callbackContext = callbackContext;
      String filepath = args.getString(0);
     if(filepath.startsWith("file://")){
         filepath = filepath.substring(7);
     }

       int t1=  filepath.indexOf(".jpg");
       int t2=  filepath.indexOf(".png");
       if(t1>0){
           filepath = filepath.substring(0,filepath.indexOf(".jpg")+4);
       }

       if(t2>0){
           filepath = filepath.substring(0,filepath.indexOf(".png")+4);
       }
    //   final String filepath = "/storage/emulated/0/test/test.jpg";
    //   final String filepath = "/storage/emulated/0/Android/data/com.handcrm.com/cache/IMG_20161217_144630.jpg";

       //剪裁图片
      if("cropdrawable".equals(action)){

          try {
              //下面两句最关键，利用intent启动新的Activity
              Intent intent = new Intent().setClass(cordova.getActivity(), Class.forName("com.sleepgod.cuiweicai.hand_image_library.activity.CropdrawableActivity"));
              intent.putExtra("filepath",filepath);
              this.cordova.startActivityForResult(this, intent, 1);
              //下面三句为cordova插件回调页面的逻辑代码
              PluginResult mPlugin = new PluginResult(PluginResult.Status.NO_RESULT);
              mPlugin.setKeepCallback(true);

              callbackContext.sendPluginResult(mPlugin);

          } catch (Exception e) {
              e.printStackTrace();
              return false;
          }

         return true;

       //图片旋转
      }else if ("rotatedrawable".equals(action)){
          try {
              //下面两句最关键，利用intent启动新的Activity
              Intent intent = new Intent().setClass(cordova.getActivity(), Class.forName("com.sleepgod.cuiweicai.hand_image_library.activity.RotateDrawableActivity"));
              intent.putExtra("filepath",filepath);
              this.cordova.startActivityForResult(this, intent, 2);
              //下面三句为cordova插件回调页面的逻辑代码
              PluginResult mPlugin = new PluginResult(PluginResult.Status.NO_RESULT);
              mPlugin.setKeepCallback(true);

              callbackContext.sendPluginResult(mPlugin);

          } catch (Exception e) {
              e.printStackTrace();
              return false;
          }

          return true;
      }else if("cropimage".equals(action)){

          try {
              //下面两句最关键，利用intent启动新的Activity
              Intent intent = new Intent().setClass(cordova.getActivity(), Class.forName("com.sleepgod.cuiweicai.hand_image_library.activity.CropdrawableActivity"));
              intent.putExtra("filepath",filepath);
              this.cordova.startActivityForResult(this, intent, 1);
              //下面三句为cordova插件回调页面的逻辑代码
              PluginResult mPlugin = new PluginResult(PluginResult.Status.NO_RESULT);
              mPlugin.setKeepCallback(true);

              callbackContext.sendPluginResult(mPlugin);

          } catch (Exception e) {
              e.printStackTrace();
              return false;
          }

         return true;
       }
       callbackContext.error("error");
      return false;
   }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case 1:
                    String path =intent.getStringExtra("path");
                  //  util.showToast(cordova.getActivity(),path);
                    this.callbackContext.success(path);

                    break;
                case 2:
                    String path2 =intent.getStringExtra("path");
                  //  util.showToast(cordova.getActivity(),path2);
                    this.callbackContext.success(path2);

                    break;
            }
        } else if (resultCode == Activity.RESULT_CANCELED) {
            this.callbackContext.error("Editor Canceled");
        }
    }
}
