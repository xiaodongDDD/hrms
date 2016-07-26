package hand;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.xutils.BuildConfig;
import org.xutils.x;

import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

public class WeiLoginPlugin extends CordovaPlugin {
	private static final String ACTION = "com.hand.receiver.BROADCAST";
	private static String APP_ID="wxaaeac85f01714b29";
	private IWXAPI api;
	private CallbackContext mCallbackContext;
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		api = WXAPIFactory.createWXAPI(cordova.getActivity(),APP_ID,true);
		api.registerApp(APP_ID);
		
		x.Ext.init(cordova.getActivity().getApplication());
		x.Ext.setDebug(BuildConfig.DEBUG); // 是否输出debug日志, 开启debug会影响性能.
		
		IntentFilter filter = new IntentFilter();  
        filter.addAction(ACTION);  
        cordova.getActivity().registerReceiver(myReceiver, filter);
		Log.e("399", "eeee");
	}

	@Override
	public void onDestroy() {
		cordova.getActivity().unregisterReceiver(myReceiver);
	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		this.mCallbackContext = callbackContext;
		if("weiLogin".equals(action)){
            
			SendAuth.Req req = new SendAuth.Req();
		    req.scope = "snsapi_userinfo";
		    req.state = "wechat_sdk_demo_test";
			api.sendReq(req);
			//Toast.makeText(cordova.getActivity(), "login...", Toast.LENGTH_SHORT).show();
			return true;
		}
		callbackContext.error("error");  
        return false; 
	}
	private BroadcastReceiver myReceiver = new BroadcastReceiver(){  
		  
        @Override  
        public void onReceive(Context context, Intent intent) {  
            String result = intent.getStringExtra("result");
            mCallbackContext.success(result);
            Log.e("399", result);
        }  
          
    };
}
