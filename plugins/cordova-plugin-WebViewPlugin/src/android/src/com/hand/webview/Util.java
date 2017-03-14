package com.hand.webview;

import android.content.Context;

/**
 * Created by panx on 2017/2/7.
 */
public class Util {

  public static int getRS(String name, String type, Context context){
    int resID=0;
    resID = context.getResources().getIdentifier(name, type, context.getPackageName());
    return resID;
  }

}
