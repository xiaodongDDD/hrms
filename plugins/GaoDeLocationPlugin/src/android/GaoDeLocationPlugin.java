package hand;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationClientOption.AMapLocationMode;
import com.amap.api.location.AMapLocationListener;

import android.util.Log;

public class GaoDeLocationPlugin extends CordovaPlugin {

	// 声明AMapLocationClient类对象
	private AMapLocationClient mLocationClient = null;
	private CallbackContext mCallbackContext;
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		// 声明定位回调监听器
		AMapLocationListener mLocationListener = new MyAMapLocationListener();
		// 初始化定位
		mLocationClient = new AMapLocationClient(cordova.getActivity());
		// 设置定位回调监听
		mLocationClient.setLocationListener(mLocationListener);
	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		this.mCallbackContext= callbackContext;
		if ("startLocation".equals(action)) {
			initParams();
			return true;
		}

		callbackContext.error("error");
		return false;
	}
	
	private void initParams() {
		// 声明mLocationOption对象
		AMapLocationClientOption mLocationOption = null;
		// 初始化定位参数
		mLocationOption = new AMapLocationClientOption();
		// 设置定位模式为高精度模式，Battery_Saving为低功耗模式，Device_Sensors是仅设备模式
		mLocationOption.setLocationMode(AMapLocationMode.Hight_Accuracy);
		// 设置是否返回地址信息（默认返回地址信息）
		mLocationOption.setNeedAddress(true);
		// 设置是否只定位一次,默认为false
		mLocationOption.setOnceLocation(false);

		if (mLocationOption.isOnceLocationLatest()) {
			mLocationOption.setOnceLocationLatest(true);
			// 设置setOnceLocationLatest(boolean
			// b)接口为true，启动定位时SDK会返回最近3s内精度最高的一次定位结果。
			// 如果设置其为true，setOnceLocation(boolean b)接口也会被设置为true，反之不会。
		}

		// 设置是否强制刷新WIFI，默认为强制刷新
		mLocationOption.setWifiActiveScan(true);
		// 设置是否允许模拟位置,默认为false，不允许模拟位置
		mLocationOption.setMockEnable(false);
		// 设置定位间隔,单位毫秒,默认为2000ms
		mLocationOption.setInterval(2000);
		// 给定位客户端对象设置定位参数
		mLocationClient.setLocationOption(mLocationOption);
		// 启动定位
		mLocationClient.startLocation();
	}
	
	class MyAMapLocationListener implements AMapLocationListener {
		@Override
		public void onLocationChanged(AMapLocation amapLocation) {
			if (amapLocation != null) {
		        if (amapLocation.getErrorCode() == 0) {
		        //定位成功回调信息，设置相关消息
		        amapLocation.getLocationType();//获取当前定位结果来源，如网络定位结果，详见定位类型表
		        double latitude = amapLocation.getLatitude();//获取纬度
		        double longitude = amapLocation.getLongitude();//获取经度
		        amapLocation.getAccuracy();//获取精度信息
		        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		        Date date = new Date(amapLocation.getTime());
		        df.format(date);//定位时间
		        String address = amapLocation.getAddress();//地址，如果option中设置isNeedAddress为false，则没有此结果，网络定位结果中会有地址信息，GPS定位不返回地址信息。
		        String country = amapLocation.getCountry();//国家信息
		        String province = amapLocation.getProvince();//省信息
		        String city = amapLocation.getCity();//城市信息
		        String district = amapLocation.getDistrict();//城区信息
		        String street = amapLocation.getStreet();//街道信息
		        String streetNum = amapLocation.getStreetNum();//街道门牌号信息
		        String cityCode = amapLocation.getCityCode();//城市编码
		        String adCode = amapLocation.getAdCode();//地区编码
				String aoiName = amapLocation.getAoiName();//获取当前定位点的AOI信息
		        Log.e("399", "address:" + address + " country:" + " province:" + province +" city :" + city + " district:" + district + " street :" + street);
		        Log.e("399", "latitude :" + latitude + "  longitude :" + longitude);
		        String result = "{\"address:\""+address + ",\"country:\"" + country + ",\"city:\"" + city + ",\"district:\"" + district + ",\"street:\"" + street +",\"latitude:\"" + latitude +",\"longitude:\"" + longitude +"}";
		        mCallbackContext.success(result);
		        mLocationClient.stopLocation();//停止定位
		    } else {
		              //显示错误信息ErrCode是错误码，errInfo是错误信息，详见错误码表。
		        Log.e("399","location Error, ErrCode:"
		            + amapLocation.getErrorCode() + ", errInfo:"
		            + amapLocation.getErrorInfo());
		        mCallbackContext.error("location Error, ErrCode:"
		            + amapLocation.getErrorCode() + ", errInfo:"
		            + amapLocation.getErrorInfo());
		        }
		    }
		}
	}

}