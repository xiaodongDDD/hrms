package com.hand.im.widget;

import android.content.Context;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.china.hrms2.research.R;

/**
 * 打印自定义Toast
 * Created by cool on 2016/10/20.
 */

public class CommonToast {
    private volatile static CommonToast mCommonToast;
    private Toast mToast;

    private CommonToast() {

    }

    /**
     * 懒汉单例模式
     * @return
     */
    public static CommonToast getInstance() {
        if (mCommonToast == null) {
            synchronized (CommonToast.class) {
                if(mCommonToast == null) {
                    mCommonToast = new CommonToast();
                }
            }
        }
        return mCommonToast;
    }

    /**
     * 打印Toast
     * @param context
     * @param msg
     */
    public void showToast(Context context, String msg){
        if (mToast == null) {
            synchronized (CommonToast.class) {
                if(mToast == null) {
                    mToast = new Toast(context);
                }
            }
        }
        View layout = LayoutInflater.from(context).inflate(R.layout.item_toast,null);
        TextView text = (TextView) layout.findViewById(R.id.text);
        text.setText(msg);
        mToast.setGravity(Gravity.TOP, 0, 0);
        mToast.setDuration(Toast.LENGTH_SHORT);
        mToast.setView(layout);
        mToast.show();
    }
}
