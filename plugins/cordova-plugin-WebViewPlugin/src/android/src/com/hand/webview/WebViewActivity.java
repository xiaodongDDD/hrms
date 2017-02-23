package com.hand.webview;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.ProgressBar;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewImpl;
import org.apache.cordova.engine.SystemWebChromeClient;
import org.apache.cordova.engine.SystemWebView;
import org.apache.cordova.engine.SystemWebViewEngine;

/**
 * Created by panx on 2017/2/22.
 */
public class WebViewActivity extends CordovaActivity {
  public static final String URL = "url";
  private SystemWebView webView;
  
  private String url;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    super.onCreate(savedInstanceState);
    WebViewActivityManager.OnCreateActivity(this);
    setContentView(Util.getRS("activity_webview","layout",this));
    readIntent();
    initView();
    loadUrl(url);
  }

  private void readIntent(){
    url = getIntent().getStringExtra(URL);
  }

  private void initView() {
    webView = (SystemWebView)findViewById(Util.getRS("webview","id",this));
    
  }

 @Override
  protected CordovaWebView makeWebView() {

    webView.getSettings().setJavaScriptEnabled(true);
    webView.clearCache(true);
    webView.clearHistory();
    SystemWebViewEngine webViewEngine = new SystemWebViewEngine(webView);
   
    return new CordovaWebViewImpl(webViewEngine);
  }

  @Override
  public void finish() {
    Log.e("WebViewActivity","finish");
      super.finish();
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    WebViewActivityManager.OnDestroyActivity(this);
  }

  @Override
  protected void createViews() {
    appView.getView().requestFocusFromTouch();
  }

}
