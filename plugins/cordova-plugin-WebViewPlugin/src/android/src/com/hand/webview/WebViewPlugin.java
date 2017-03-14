package com.hand.webview;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.List;

/**
 * Created by panx on 2017/2/22.
 */
public class WebViewPlugin extends CordovaPlugin {
  private final static String LOAD_WEBVIEW = "loadWebView";
  private final static String DISMISS_WEBVIEW = "dismissWebView";
  private CallbackContext callbackContext;
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    this.callbackContext = callbackContext;
    if(LOAD_WEBVIEW.equals(action)){
      loadWebview(args);
      return true;
    }else if(DISMISS_WEBVIEW.equals(action)){
      disMissWebView();
      return true;
    }
    return false;
  }

  private void loadWebview(JSONArray args){
    try {
      String url = args.getString(0);
      Intent intent = new Intent(cordova.getActivity(),WebViewActivity.class);
      intent.putExtra(WebViewActivity.URL,url);
      cordova.setActivityResultCallback(this);
      cordova.startActivityForResult(this, intent, 1);
    } catch (JSONException e) {
      callbackContext.error("Wrong arguments");
      e.printStackTrace();
    }
  }


  private void disMissWebView(){
    Log.e("WebViewPlugin","dismisswebView");
   /* if(WebViewActivity.instance!=null) {
      WebViewActivity.instance.finish();
    }*/
    List<Activity> activities = WebViewActivityManager.GetActivityList();
    if(activities!=null&&activities.size()>0){
      activities.get(activities.size()-1).finish();
    }
  }

}
