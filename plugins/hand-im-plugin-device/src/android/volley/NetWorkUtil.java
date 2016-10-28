package com.hand.im.volley;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

/**
 * Created by panx on 2016/8/11.
 */
public class NetWorkUtil {

    public static  boolean isNetWorkAvailable(Context context){

        ConnectivityManager connectivityManager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if(connectivityManager==null){
            return false;
        }
        NetworkInfo[] networkInfos = connectivityManager.getAllNetworkInfo();
        if(networkInfos!=null&&networkInfos.length>0){
            for(int i = 0;i<networkInfos.length;i++){
                if(networkInfos[i].getState() == NetworkInfo.State.CONNECTED){
                    return  true;
                }
            }
        }
        return false;
    }
    public static boolean isWifiAvailable(Context context){
        ConnectivityManager connectivityManager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if(connectivityManager==null){
            return false;
        }
        NetworkInfo[] networkInfos = connectivityManager.getAllNetworkInfo();
        if(networkInfos!=null&&networkInfos.length>0){
            for(int i = 0;i<networkInfos.length;i++){

                if(networkInfos[i].getTypeName().equals("WIFI")&&networkInfos[i].getState() == NetworkInfo.State.CONNECTED){
                    return  true;
                }
            }
        }
        return false;
    }


}
