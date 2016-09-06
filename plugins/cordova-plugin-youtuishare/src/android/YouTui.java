package com.hand.cordova.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import java.text.SimpleDateFormat;
import java.util.Date;

import cn.bidaround.youtui_template.YouTuiViewType;
import cn.bidaround.youtui_template.YtTemplate;
import cn.bidaround.ytcore.YtShareListener;
import cn.bidaround.ytcore.data.ShareData;
import cn.bidaround.ytcore.data.YtPlatform;
import cn.bidaround.ytcore.login.AuthListener;
import cn.bidaround.ytcore.login.AuthUserInfo;
import cn.bidaround.ytcore.util.HttpUtils;

/**
 * This class starts an activity for an intent to view files
 */
public class YouTui extends CordovaPlugin {
  private static final String TAG = "Youtui";

  /**
   * 是否使用积分系统
   */
  private boolean usePointSys = true;

  /**
   * 点击社交平台后，是否隐藏分享界面, 默认是显示的
   */
  private boolean isShowSharePop = true;

  /**
   * 分享的数据对象
   */
  private ShareData shareData;

  /**
   * 分享的界面平台
   */
  private YtTemplate template;

  private CallbackContext callbackContext;

  private static final int SHARE_SUCCESS = 0;
  private static final int SHARE_ERROR = -1;
  private static final int USER_CANCELED = -2;

  protected void pluginInitialize() {
    Log.i(TAG, "cordova plugin initialize");
    YtTemplate.init(this.cordova.getActivity());
  }

  /**
   * 初始化分享界面
   */
  private void initTemplate() {
    template = new YtTemplate(this.cordova.getActivity(),
      YouTuiViewType.WHITE_GRID, usePointSys);
    template.setShareData(shareData);
    template.setScreencapVisible(true);
    template.addListeners(listener);
    template.setDismissAfterShare(true);
  }

  @Override
  public boolean execute(String action, JSONArray args,
                         CallbackContext callbackContext) throws JSONException {
    if (action.equals("share")) {
      Log.i(TAG, "args = " + args);
      String shareTitle = args.getString(0);
      String shareUrl = args.getString(1);
      String shareDesc = args.getString(2);
      String imageUrl = args.getString(3);
      shareData = new ShareData();
      shareData.setAppShare(false); // 是否为应用分享，如果为true，分享的数据需在友推后台设置
      shareData.setDescription(shareDesc);
      shareData.setImage(ShareData.IMAGETYPE_INTERNET, imageUrl);
      shareData.setTargetUrl(shareUrl);
      shareData.setText(shareDesc);
      shareData.setTitle(shareTitle);
      shareData.setShareType(ShareData.SHARETYPE_IMAGEANDTEXT);
      SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
      shareData.setPublishTime(dateFormat.format(new Date()));
      initTemplate();
      showTemplate(YouTuiViewType.WHITE_GRID);
      this.callbackContext = callbackContext;

      return true;
    }
    return false;
  }

  /**
   * 授权登录监听器
   */
  AuthListener authListener = new AuthListener() {

    @Override
    public void onAuthSucess(AuthUserInfo userInfo) {

      // YtToast.showS(MainActivity.this, "onAuthSucess");
      Log.i(TAG, "授权成功");
      // 授权平台为QQ
      if (userInfo.isQqPlatform()) {
        // 授权完成后返回的QQ用户信息
        Log.w("QQ", userInfo.getQqUserInfoResponse());

        Log.w("QQ", userInfo.getQqOpenid());
        Log.w("QQ", userInfo.getQqGender());
        Log.w("QQ", userInfo.getQqImageUrl());
        Log.w("QQ", userInfo.getQqNickName());
      }

      // 授权平台为新浪
      else if (userInfo.isSinaPlatform()) {
        // 授权完成后返回的新浪用户信息
        Log.w("Sina", userInfo.getSinaUserInfoResponse());

        Log.w("Sina", userInfo.getSinaUid());
        Log.w("Sina", userInfo.getSinaGender());
        Log.w("Sina", userInfo.getSinaName());
        Log.w("Sina", userInfo.getSinaProfileImageUrl());
        Log.w("Sina", userInfo.getSinaScreenname());
        Log.w("Sina", userInfo.getSinaAccessToken());

      }


      // 授权平台为微信
      else if (userInfo.isWechatPlatform()) {
        // 授权完成后返回的微信用户信息
        Log.w("Wechat", userInfo.getWeChatUserInfoResponse());

        Log.w("Wechat", userInfo.getWechatOpenId());
        Log.w("Wechat", userInfo.getWechatCountry());
        Log.w("Wechat", userInfo.getWechatImageUrl());
        Log.w("Wechat", userInfo.getWechatLanguage());
        Log.w("Wechat", userInfo.getWechatNickName());
        Log.w("Wechat", userInfo.getWechatProvince());
        Log.w("Wechat", userInfo.getWechatSex());
      }
    }

    @Override
    public void onAuthFail() {
      // YtToast.showS(MainActivity.this, "onAuthFail");
      Log.i(TAG, "授权失败");
    }

    @Override
    public void onAuthCancel() {
      // YtToast.showS(MainActivity.this, "onAuthCancel");
      Log.i(TAG, "取消授权");
    }
  };

  YtShareListener listener = new YtShareListener() {

    /** 分享成功后回调方法 */
    @Override
    public void onSuccess(YtPlatform platform, String result) {
      Log.i(TAG, platform.getName() + " success!");

      /** 清理缓存 */
      HttpUtils.deleteImage(shareData.getImagePath());
      returnPluginResult(SHARE_SUCCESS, callbackContext);
    }

    /** 分享之前调用方法 */
    @Override
    public void onPreShare(YtPlatform platform) {
      if (!isShowSharePop)
        YtTemplate.dismiss();
      Log.i(TAG, "platformname = " + platform.getName());

    }

    /** 分享失败回调方法 */
    @Override
    public void onError(YtPlatform platform, String error) {
      Log.i(TAG, platform.getName());
      Log.i(TAG, error);
      returnPluginResult(SHARE_ERROR, callbackContext);
    }

    /** 分享取消回调方法 */
    @Override
    public void onCancel(YtPlatform platform) {
      Log.i(TAG, platform.getName());

      /** 清理缓存 */
      HttpUtils.deleteImage(shareData.getImagePath());
      returnPluginResult(USER_CANCELED, callbackContext);
    }
  };

  @Override
  public void onDestroy() {
    // 释放资源
    YtTemplate.release(this.webView.getContext());
    super.onDestroy();

    /** 清理缓存 */
    HttpUtils.deleteImage(shareData.getImagePath());
  }

  private void showTemplate(int type) {
    Log.i(TAG, "type = " + type);
    template.setTemplateType(type);
    template.setHasAct(usePointSys);
    template.show();
  }

  public void returnPluginResult(int resultCode, CallbackContext callbackContext) {
    Log.i(TAG, "plugin resultCode = " + resultCode);
    JSONObject result = new JSONObject();
    if (resultCode == 0) {
      // 分享成功
      Log.i(TAG, "分享成功！");
      try {
        result.put("code", "0");
        result.put("message", "SHARE_SUCCESS");
      } catch (JSONException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
      callbackContext.success(result);
    } else if (resultCode == -1) {
      // 分享失败
      Log.i(TAG, "分享失败！");
      try {
        result.put("code", "-1");
        result.put("message", "SHARE_ERROR");
      } catch (JSONException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
      callbackContext.error(result);
    } else if (resultCode == -2) {
      // 取消分享
      Log.i(TAG, "取消分享！");
      try {
        result.put("code", "-2");
        result.put("message", "USER_CANCELED");
      } catch (JSONException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
      callbackContext.error(result);
    }
  }

}
