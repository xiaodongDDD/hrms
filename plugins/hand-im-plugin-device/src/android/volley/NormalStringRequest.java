package com.hand.im.volley;

import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.HttpHeaderParser;

import java.io.UnsupportedEncodingException;

/**
 * Created by panx on 2016/8/8.
 */
public class NormalStringRequest extends Request<String> {
    private Response.Listener<String> mListener;
    public NormalStringRequest(int method, String url, Response.Listener<String> listener, Response.ErrorListener errorListener) {
        super(method, url, errorListener);
        mListener=listener;
    }

    @Override
    protected Response<String> parseNetworkResponse(NetworkResponse response) {

            String string = null;
            try {
                string = new String(response.data, "utf-8");

            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        return Response.success(string, HttpHeaderParser.parseCacheHeaders(response));
    }

    @Override
    protected void deliverResponse(String response) {
        mListener.onResponse(response);
    }
}
