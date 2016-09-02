package com.hand.im.volley;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by panx on 2016/8/8.
 */
public class HttpUtil {
    private static Map<String,String> map = new HashMap<String,String >();
    public static void Get(String url, final Context context, final Handler handler) {
        //判断网络是否可用
        if(!NetWorkUtil.isNetWorkAvailable(context)){
            Message msg = new Message();
            Bundle bundle = new Bundle();
            bundle.putString("statusCode","-1");
            bundle.putString("message","The network connection is unavailable!");
            msg.setData(bundle);
            handler.sendMessage(msg);
            return;
        }
        NormalStringRequest request = new NormalStringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","200");
                bundle.putString("message",response);
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","0");
                bundle.putString("message",error.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        });
        MyApplication.getHttpQueue(context).add(request);
        //return "";
    }
    public static void JsonObjectGet(String url, Context context, final Handler handler){
        if(!NetWorkUtil.isNetWorkAvailable(context)){
            Message msg = new Message();
            Bundle bundle = new Bundle();
            bundle.putString("statusCode","-1");
            bundle.putString("message","The network connection is unavailable!");
            msg.setData(bundle);
            handler.sendMessage(msg);
            return;
        }
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                    Message msg = new Message();
                    Bundle bundle = new Bundle();
                    bundle.putString("statusCode","200");
                    bundle.putString("message",response.toString());
                    msg.setData(bundle);
                    handler.sendMessage(msg);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","0");
                bundle.putString("message",error.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        });
        MyApplication.getHttpQueue(context).add(request);
    }
    public static void JsonArrayGet(String url, Context context, final Handler handler){
        if(!NetWorkUtil.isNetWorkAvailable(context)){
            Message msg = new Message();
            Bundle bundle = new Bundle();
            bundle.putString("statusCode","-1");
            bundle.putString("message","The network connection is unavailable!");
            msg.setData(bundle);
            handler.sendMessage(msg);
            return;
        }
        JsonArrayRequest request =new JsonArrayRequest(Request.Method.GET, url, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","200");
                bundle.putString("message",response.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","0");
                bundle.putString("message",error.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        });
        MyApplication.getHttpQueue(context).add(request);
    }
    public static void Post(String url, final Map<String,String> hashMap, final Context context, final Handler handler){
        //判断网络是否可用
        if(!NetWorkUtil.isNetWorkAvailable(context)){
            Message msg = new Message();
            Bundle bundle = new Bundle();
            bundle.putString("statusCode","-1");
            bundle.putString("message","The network connection is unavailable!");
            msg.setData(bundle);
            handler.sendMessage(msg);
            return;
        }
        NormalStringRequest request = new NormalStringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","200");
                bundle.putString("message",response);
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","0");
                bundle.putString("message",error.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);

            }
        }){
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                return hashMap;
            }
        };
        MyApplication.getHttpQueue(context).add(request);
    }
    public static void JSONObjectPost(String url, final Map<String,String> hashMap, final Context context, final Handler handler){
        if(!NetWorkUtil.isNetWorkAvailable(context)){
            Message msg = new Message();
            Bundle bundle = new Bundle();
            bundle.putString("statusCode","-1");
            bundle.putString("message","The network connection is unavailable!");
            msg.setData(bundle);
            handler.sendMessage(msg);
            return;
        }
        HBRequest request = new HBRequest(Request.Method.POST, url,hashMap, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                //Toast.makeText(context,response.toString(),Toast.LENGTH_SHORT).show();
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","200");
                bundle.putString("message",response.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                //Toast.makeText(context,error.toString(),Toast.LENGTH_SHORT).show();
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","0");
                bundle.putString("message",error.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        });
        MyApplication.getHttpQueue(context).add(request);
    }
    public static void JsonArrayPost(String url, final Map<String,String> hashMap, final Context context, final Handler handler){
        if(!NetWorkUtil.isNetWorkAvailable(context)){
            Message msg = new Message();
            Bundle bundle = new Bundle();
            bundle.putString("statusCode","-1");
            bundle.putString("message","The network connection is unavailable!");
            msg.setData(bundle);
            handler.sendMessage(msg);
            return;
        }
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, url, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Toast.makeText(context,response.toString(), Toast.LENGTH_SHORT).show();
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","200");
                bundle.putString("message",response.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
              //  Toast.makeText(context,error.toString(),Toast.LENGTH_SHORT).show();
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("statusCode","0");
                bundle.putString("message",error.toString());
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        }){
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                return hashMap;
            }
        };
        MyApplication.getHttpQueue(context).add(request);
    }
}
