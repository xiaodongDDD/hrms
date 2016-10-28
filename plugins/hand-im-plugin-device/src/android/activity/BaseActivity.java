package com.hand.im.activity;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.im.Util;

import java.io.File;
import java.lang.reflect.Field;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import okhttp3.Cache;
import okhttp3.OkHttpClient;

/**
 * Created by cool on 2016/8/20.
 */
public abstract class BaseActivity extends Activity {
  protected OkHttpClient mOkHttpClient;
  protected static SharedPreferences sp;
  protected int time = 0;//通话时长
  protected boolean isMuteImageButtonSelect = false;//静音按钮是否按下
  protected boolean isHandFreeImageButtonSelect = false;//免提按钮是否按下
  protected Vibrator vibrator;
  private Toast mToast;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    sp = getSharedPreferences("config", Context.MODE_PRIVATE);
    setContentView(getLayoutId());
    initOkHttp();
    initData();
    intView();
    initListeners();
  }

  protected void initListeners() {

  }

  protected void initData() {

  }

  protected abstract void intView();

  /**
   * 获取布局id
   *
   * @return
   */
  public abstract int getLayoutId();

  /**
   * 打印吐司
   *
   * @param msg
   */
  public void showToast(String msg) {
//        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    if (mToast == null) {
      mToast = Toast.makeText(this, "", Toast.LENGTH_SHORT);
    }
    mToast.setText(msg);
    mToast.show();
  }

  private void initOkHttp() {
    File cacheDir = getExternalCacheDir();
    int cacheSize = 10 * 1024 * 1024;
    OkHttpClient.Builder builder = new OkHttpClient.Builder()
      .connectTimeout(15, TimeUnit.SECONDS)//设置连接超时
      .writeTimeout(20, TimeUnit.SECONDS)
      .readTimeout(15, TimeUnit.SECONDS)
      .cache(new Cache(cacheDir.getAbsoluteFile(), cacheSize));
    mOkHttpClient = builder.build();
  }

  /**
   * 设置通话时长
   *
   * @param timeView
   */
  public void setupTime(final TextView timeView) {
    TimerTask task = new TimerTask() {
      @Override
      public void run() {
        runOnUiThread(new Runnable() {
          @Override
          public void run() {
            time++;
            if (time >= 3600) {
              timeView.setText(String.format("%d:%02d:%02d", time / 3600, (time % 3600) / 60, (time % 60)));
            } else {
              timeView.setText(String.format("%02d:%02d", (time % 3600) / 60, (time % 60)));
            }
          }
        });
      }
    };

    Timer timer = new Timer();
    timer.schedule(task, 0, 1000);
  }

  /**
   * 开始震动
   */
  public void startVibrator() {
    vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
    long[] pattern = {1000, 1500, 1000, 1500}; // 停止 开启 停止 开启
    vibrator.vibrate(pattern, 2); //重复两次上面的pattern 如果只想震动一次，index设为-1
  }

  /**
   * 取消震动
   */
  public void cancelVibrator() {
    if (vibrator != null) {
      vibrator.cancel();
    }
  }

  protected void immerseStatusBar() {
    //当系统版本为4.4或者4.4以上时可以使用沉浸式状态栏
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      //透明状态栏
      getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
      //透明导航栏
      getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

      LinearLayout ll_fill = (LinearLayout) findViewById(Util.getRS("ll_fill", "id", this));
      ll_fill.setVisibility(View.VISIBLE);
      //获取到状态栏的高度
      int statusHeight = getStatusBarHeight();
      //动态的设置隐藏布局的高度
      LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) ll_fill.getLayoutParams();
      params.height = statusHeight;
      ll_fill.setLayoutParams(params);
    }
  }

  /**
   * 通过反射的方式获取状态栏高度
   *
   * @return
   */
  private int getStatusBarHeight() {
    try {
      Class<?> c = Class.forName("com.android.internal.R$dimen");
      Object obj = c.newInstance();
      Field field = c.getField("status_bar_height");
      int x = Integer.parseInt(field.get(obj).toString());
      return getResources().getDimensionPixelSize(x);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return 0;
  }

}

