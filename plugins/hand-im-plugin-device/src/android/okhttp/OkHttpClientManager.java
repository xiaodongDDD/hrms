package com.hand.im.okhttp;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.ImageView;

import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by panx on 2016/9/3.
 */
public class OkHttpClientManager {
    private static OkHttpClientManager mInstance;
    private OkHttpClient mOkHttpClient;
    private Handler mHandler;

    private OkHttpClientManager() {
        mOkHttpClient = new OkHttpClient();
        mHandler = new Handler(Looper.getMainLooper());
    }

    public static OkHttpClientManager getInstance() {
        if (mInstance == null) {
            synchronized (OkHttpClientManager.class) {
                if (mInstance == null) {
                    mInstance = new OkHttpClientManager();
                }
            }
        }
        return mInstance;
    }
    //请求JSONObject
    private void _postAsyn(String url,JSONObject object,ResultCallback callback){
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), object.toString());
        Request request = new Request.Builder().url(url).header("content-type", "application/json").post(body).build();
        deliveryRequest(callback,request);
    }

    private void deliveryRequest(final ResultCallback callback, Request request){
        mOkHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(final Call call, final IOException e) {
                mHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        callback.onError(call,e);
                    }
                });
            }

            @Override
            public void onResponse(final Call call, final Response response) throws IOException {
                final String responseStr = response.body().string();
                mHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        if(callback!=null) {
                            callback.onResponse(responseStr);
                        }
                    }
                });
            }
        });
    }
    public static void postAsyn(String url, JSONObject object,ResultCallback callback) {
        getInstance()._postAsyn(url,object,callback);
    }

    public static abstract class ResultCallback<T> {
        public abstract void onError(Call call, Exception e);

        public abstract void onResponse(T response);
    }
}
