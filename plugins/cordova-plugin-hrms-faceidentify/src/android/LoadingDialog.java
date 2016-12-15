package com.hand.face.common;

import android.app.Dialog;
import android.content.Context;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.hand.face.utils.Utils;


public class LoadingDialog extends Dialog {
    private LinearLayout parentLayout;
    private TextView loadingText;

    public LoadingDialog(Context context) {
        super(context, Utils.getResourceId(context, "loading_dialog", "style"));
        init(context);
    }

    public LoadingDialog(Context context, int theme) {
        super(context, Utils.getResourceId(context, "loading_dialog", "style"));
        init(context);
    }

    private void init(Context context){
        this.setContentView(LayoutInflater.from(context).inflate(Utils.getResourceId(context, "loading_dialog", "layout"), null));
        parentLayout = (LinearLayout) findViewById(Utils.getResourceId(context, "dialog_view", "id"));
        loadingText = (TextView) findViewById(Utils.getResourceId(context, "text", "id"));
        this.setCancelable(false);
    }

    //设置名字和外层背景色
    public void setText(String text, int color){
        if(!TextUtils.isEmpty(text)) {
            parentLayout.setBackgroundColor(color);
            loadingText.setText(text);
            loadingText.setVisibility(View.VISIBLE);
        }else {
            loadingText.setVisibility(View.GONE);
        }
    }

    public void setText(String text){
        if(!TextUtils.isEmpty(text)) {
            loadingText.setText(text);
            loadingText.setVisibility(View.VISIBLE);
        }else {
            loadingText.setVisibility(View.GONE);
        }
    }
}
