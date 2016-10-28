package com.hand.im.volley;

import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.ParseError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.HttpHeaderParser;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by panx on 2016/8/23.
 */
public class HBRequest extends Request<JSONObject> {
    private Response.Listener<JSONObject> mListener;
    private Map<String,String> map;
    public HBRequest(int method, String url, Map<String,String> map, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener){
        super(method,url,errorListener);
        mListener = listener;
        this.map = map;
    }

    @Override
    protected Map<String, String> getParams() throws AuthFailureError {
        Log.e("key",map.get("key")+"-----------------------------");
        return map;
    }
    /*NSDictionary *requestBody = @{@"key":text,@"page":@(page),@"pageSize":@10};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};*/

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String,String> headers = new HashMap<String,String>();
     //   headers = super.getHeaders();
        headers.put("Content-Type","application/json");

        return headers;
    }

    @Override
    public byte[] getBody() throws AuthFailureError {

        Map<String, String> params = getParams();
        if (params != null && params.size() > 0) {
            JSONObject jsonObject = new JSONObject(params);
            return jsonObject.toString().getBytes();
        }
        return null;
    }
    private byte[] encodeParameters(Map<String, String> params, String paramsEncoding) {
        StringBuilder encodedParams = new StringBuilder();
        try {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                encodedParams.append(URLEncoder.encode(entry.getKey(), paramsEncoding));
                encodedParams.append('=');
                encodedParams.append(URLEncoder.encode(entry.getValue(), paramsEncoding));
                encodedParams.append('&');
            }
            return encodedParams.toString().getBytes(paramsEncoding);
        } catch (UnsupportedEncodingException uee) {
            throw new RuntimeException("Encoding not supported: " + paramsEncoding, uee);
        }
    }
    @Override
    protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
        try {
            Log.e("header code", response.statusCode+"");

            String jsonString = new String(response.data,"utf-8");
            return Response.success(new JSONObject(jsonString), HttpHeaderParser.parseCacheHeaders(response));
        } catch (UnsupportedEncodingException e) {
            return Response.error(new ParseError(e));
        } catch (JSONException je) {
            return Response.error(new ParseError(je));
        }
    }

    @Override
    protected void deliverResponse(JSONObject response) {
        mListener.onResponse(response);
    }
}
