package com.hand.hrms.face;


import android.widget.Toast;

import com.hand.face.myinterface.NotifyMessage;
import com.hand.face.ui.FaceCompareActivity;
import com.hand.face.ui.FaceSerchActivity;
import com.hand.face.utils.NotifyMessageManager;
import com.hand.face.utils.Utils;
import com.youtu.sign.Base64Util;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by USER on 2016/12/13.
 */
public class FacePlugin extends CordovaPlugin implements NotifyMessage {
    private NotifyMessageManager notify;
    private CallbackContext mCallbackContext;
    //初始化插件
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        notify = NotifyMessageManager.getInstance();
        notify.setNotifyMessage(this);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        mCallbackContext = callbackContext;
        if("faceDetect".equals(action)){
            if(args!=null && args.length()>0){
                JSONObject obj = args.getJSONObject(0);
                if(obj!=null){
                    if(obj.has("direction")){
                        String value = obj.getString("direction");
                        if(value!=null && !value.isEmpty()){
                            if("front".equals(value)){
                                FaceCompareActivity.actionStart(cordova.getActivity());
                            }else if("back".equals(value)){
                                FaceSerchActivity.actionStart(cordova.getActivity());
                            }else{
                                FaceCompareActivity.actionStart(cordova.getActivity());
                            }
                        }else{
                            FaceCompareActivity.actionStart(cordova.getActivity());
                        }
                    }else{
                        FaceCompareActivity.actionStart(cordova.getActivity());
                    }
                }else{
                    FaceCompareActivity.actionStart(cordova.getActivity());
                }
            }else{
                FaceCompareActivity.actionStart(cordova.getActivity());
            }
            return true;
        }else if("getLocalImage".equals(action)){
            String imgPath = args.getString(0);
            byte[] bytes = Utils.File2byte(imgPath);
            String path = Base64Util.encode(bytes);
            mCallbackContext.success(path);
            return true;
        }
        return super.execute(action, args, callbackContext);
    }

    @Override
    public void sendMessage(String msg) {
        try {
            JSONObject msgObj = new JSONObject(msg);
            mCallbackContext.success(msgObj);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
