package com.handmobile.cordova.hotpatch;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.webkit.WebView;

import com.handmobile.cordova.hotpatch.DownLoadTask;

import java.io.File;
import java.lang.reflect.Field;


public class HotPatchPlugin extends CordovaPlugin {

	private CordovaActivity mCordovaActivity;

	public  HotPatchPlugin() {
		
	}
	
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		// TODO Auto-generated method stub
		super.initialize(cordova, webView);

		mCordovaActivity  = (CordovaActivity)cordova.getActivity();
		String targetFilePath = webView.getContext().getFilesDir().toString().concat("/www/index.html");
		File targetFile = new File(targetFilePath);
		if(targetFile.exists()){
			Class userCla = (Class) CordovaActivity.class;
			Field[] fs = userCla.getDeclaredFields();

			for(int i = 0 ; i < fs.length; i++){
				Field f = fs[i];
				if(f.getName().equals("launchUrl")){
					try {
						f.setAccessible(true); //设置些属性是可以访问的
						f.set(mCordovaActivity,"file://".concat(targetFilePath));
					} catch (IllegalAccessException e) {
						e.printStackTrace();
					}


				}
			}


		}


	}


	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("updateNewVersion".equals(action)) {
		  	String updateUrl = args.getString(0);
			if(updateUrl ==null || updateUrl.equals("")){
				PluginUtil.showErrorMessage("热更新url 为空",cordova.getActivity());
			}else {

				updateNewVersion(updateUrl);
			}
		}
		else {
			return false;
		}
		return true;
	}
	
	public  void updateNewVersion(String updateUrl)
	{
		DownLoadTask downLoadTask = new DownLoadTask(webView.getContext(),webView);
		downLoadTask.execute(updateUrl);
	}
}
