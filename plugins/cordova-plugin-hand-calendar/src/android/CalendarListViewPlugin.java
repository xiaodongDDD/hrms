package hand;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.util.Log;

public class CalendarListViewPlugin extends CordovaPlugin {

	private CallbackContext mCallbackContext;

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		this.mCallbackContext = callbackContext;
		if ("openCalendar".equals(action)) {
			String type = args.getString(0);
			if ("0".equals(type)) {//选择单个日期
				Intent singleIntent = new Intent(cordova.getActivity(), CalendarActivity.class);
				singleIntent.putExtra("isSingle", true);
				cordova.startActivityForResult(this, singleIntent, 0);
			} else if ("1".equals(type)) {//选择日期期间
				Intent rangeIntent = new Intent(cordova.getActivity(), CalendarActivity.class);
				rangeIntent.putExtra("isSingle", false);
				cordova.startActivityForResult(this, rangeIntent, 1);
			}
			return true;
		}

		mCallbackContext.error("error");
		return false;
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		super.onActivityResult(requestCode, resultCode, intent);
		//Log.e("399", resultCode + "");
		if (resultCode == CalendarActivity.CHOOSE_SINGLE) {
			String pickData = intent.getStringExtra("pickData");
			mCallbackContext.success(pickData);
			//Log.e("399", pickData);
		} else if (resultCode == CalendarActivity.CHOOSE_RANGE) {
			String pickDatas = intent.getStringExtra("pickDatas");
			mCallbackContext.success(pickDatas);
			//Log.e("399", pickDatas);
		}
	}

}