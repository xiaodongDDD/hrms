package com.hand_china.hrms.wxapi;
import org.xutils.x;
import org.xutils.common.Callback;
import org.xutils.http.RequestParams;

import com.google.gson.Gson;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelbase.BaseResp.ErrCode;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import hand.TokenBean;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

	private IWXAPI api;
	private TokenBean tokenBean;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		api = WXAPIFactory.createWXAPI(this, "wxaaeac85f01714b29");
		api.handleIntent(getIntent(), this);
	}

	@Override
	protected void onNewIntent(Intent intent) {
		// TODO Auto-generated method stub
		super.onNewIntent(intent);
		api.handleIntent(getIntent(), this);
	}

	@Override
	public void onReq(BaseReq arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onResp(BaseResp resp) {
		if (resp instanceof SendAuth.Resp) {
			SendAuth.Resp newResp = (SendAuth.Resp) resp;
			switch (newResp.errCode) {
			case ErrCode.ERR_OK:// 用户同意
				// 获取微信传回的code
				String code = newResp.code;
				getToken(code);
				Log.e("399", code);
				break;
			case ErrCode.ERR_AUTH_DENIED:// 用户拒绝授权
				Log.e("399", "用户拒绝授权");
//				finish();
//				overridePendingTransition(0, 0);
				break;
			case ErrCode.ERR_USER_CANCEL:// 用户取消
				//finish();
//				overridePendingTransition(0, 0);
				Log.e("399", "用户取消");
				break;
			default:
				break;
			}

		}
	}

	/**
	 * 获取token
	 * 
	 * @param code
	 */
	private void getToken(String code) {
		RequestParams params = new RequestParams("https://api.weixin.qq.com/sns/oauth2/access_token");
		params.addBodyParameter("appid", "wxaaeac85f01714b29");
		params.addBodyParameter("secret", "44d3af96ad276e74c992380c71d20929");
		params.addBodyParameter("code", code);
		params.addBodyParameter("grant_type", "authorization_code");
		x.http().post(params, new Callback.CommonCallback<String>() {
			@Override
			public void onSuccess(String result) {
				Log.e("399", result);
				Gson gson  = new Gson();
				tokenBean = gson.fromJson(result, TokenBean.class);
				Log.e("399", tokenBean.toString());
				getUserInfo(tokenBean);
			}

			@Override
			public void onError(Throwable ex, boolean isOnCallback) {
				Log.e("399", ex.getMessage());
				Log.e("399", ex.getMessage());
				Intent intent = new Intent("com.hand.receiver.BROADCAST");
				intent.putExtra("ex", ex.getMessage());
				sendBroadcast(intent);
				finish();
				overridePendingTransition(0, 0);
			}

			@Override
			public void onCancelled(CancelledException cex) {
				Log.e("399", "onCancelled");
			}

			@Override
			public void onFinished() {
				Log.e("399", "onFinished");
			}
		});
	}
	
	private void getUserInfo(TokenBean tokenBean) {
		RequestParams params = new RequestParams("https://api.weixin.qq.com/sns/userinfo");
		params.addBodyParameter("access_token", tokenBean.access_token);
		params.addBodyParameter("openid", tokenBean.openid);
		x.http().post(params, new Callback.CommonCallback<String>() {
			@Override
			public void onSuccess(String result) {
				Log.e("399", result);
				Intent intent = new Intent("com.hand.receiver.BROADCAST");
				intent.putExtra("result", result);
				sendBroadcast(intent);
				finish();
				overridePendingTransition(0, 0);
			}

			@Override
			public void onError(Throwable ex, boolean isOnCallback) {
				Log.e("399", ex.getMessage());
				Intent intent = new Intent("com.hand.receiver.BROADCAST");
				intent.putExtra("ex", ex.getMessage());
				sendBroadcast(intent);
				finish();
				overridePendingTransition(0, 0);
			}

			@Override
			public void onCancelled(CancelledException cex) {
				Log.e("399", "onCancelled");
			}

			@Override
			public void onFinished() {
				Log.e("399", "onFinished");
			}
		});
	}
}
