package com.hand.face.utils;

import com.hand.face.myinterface.NotifyMessage;

/**
 * Created by USER on 2016/12/14.
 */
public class NotifyMessageManager {
    private static NotifyMessageManager notify;
    private NotifyMessage listener;
    private NotifyMessageManager(){

    }
    public static synchronized NotifyMessageManager getInstance() {
        if (notify == null) {
            notify = new NotifyMessageManager();
        }
        return notify;
    }
    public void setNotifyMessage(NotifyMessage nm){
        listener = nm;
    }
    public void sendNotifyMessage(String msg){
        listener.sendMessage(msg);
    }
}
