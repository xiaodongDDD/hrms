package com.hand.im;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import io.rong.push.notification.PushMessageReceiver;
import io.rong.push.notification.PushNotificationMessage;

/**
 * Created by panx on 2016/10/2.
 */
public class RYNotificationReceiver extends PushMessageReceiver {
    @Override
    public boolean onNotificationMessageArrived(Context context, PushNotificationMessage pushNotificationMessage) {
        //解析message
        String fromName = pushNotificationMessage.getTargetUserName();
        String ContentText = fromName + ":" + pushNotificationMessage.getPushContent();
        Intent intent = new Intent(context,com.hand_china.hrms.MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, (int) (Math.random() * 1000) + 1, intent, 0);
        //获取目标ID
        //通知栏提示
        NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context);
        mBuilder.setContentTitle("消息提醒")//设置通知栏标题
                .setContentText(ContentText)
                .setContentIntent(pendingIntent) //设置通知栏点击意图
                .setTicker("会话通知") //通知首次出现在通知栏，带上升动画效果的
                .setWhen(System.currentTimeMillis())//通知产生的时间，会在通知信息里显示，一般是系统获取到的时间
                .setDefaults(Notification.DEFAULT_VIBRATE)//向通知添加声音、闪灯和振动效果.setAutoCancel(true)
                .setAutoCancel(true)
                .setSmallIcon(Util.getRS("hrms_icon", "drawable", context.getApplicationContext()));//设置通知小ICON
        Notification notification = mBuilder.build();
        notification.flags |= Notification.FLAG_AUTO_CANCEL;
        mNotificationManager.notify(0, mBuilder.build());
        return true;
}

    @Override
    public boolean onNotificationMessageClicked(Context context, PushNotificationMessage pushNotificationMessage) {
        Log.e("MESSAGE", "点击了一条新消息");
        return true;
    }
}
