package com.hand.im.volley;

import android.content.Context;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

/**
 * Created by panx on 2016/8/8.
 */
public class MyApplication {
    public static RequestQueue queue;

    public static RequestQueue getHttpQueue(Context context){
        if(queue==null){
            queue = Volley.newRequestQueue(context);
        }
        return queue;
    }
}
