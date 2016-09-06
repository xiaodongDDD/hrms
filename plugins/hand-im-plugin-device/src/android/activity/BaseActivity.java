package com.hand.im.activity;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.Toast;

import java.lang.reflect.Field;

/**
 * Created by cool on 2016/8/20.
 */
public abstract class BaseActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutId());
        initData();
        intView();
        initListeners();
    }

    protected void initListeners() {

    }

    protected void initData(){

    }

    protected abstract void intView();

    /**
     * 获取布局id
     * @return
     */
    public abstract int getLayoutId();

    /**
     * 打印吐司
     * @param msg
     */
    public void showToast(String msg){
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }

}
