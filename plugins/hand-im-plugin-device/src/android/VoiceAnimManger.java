package com.hand.im;

import android.content.Context;
import android.graphics.drawable.AnimationDrawable;
import android.widget.ImageView;

/**
 * Created by panx on 2016/10/9.
 */
public class VoiceAnimManger {
    public static int LEFT = 0;
    public static int RIGHT =1 ;
    private Context context;
    private static VoiceAnimManger mInstance;
    private ImageView currentImageView;
    //flag =0时为左侧，flag=1时为右侧
    private int flag;

    private VoiceAnimManger(Context context) {
        this.context = context;
    }

    private static VoiceAnimManger getInstance(Context context) {
        if (mInstance == null) {
            synchronized (VoiceAnimManger.class) {
                mInstance = new VoiceAnimManger(context);
            }
        }
        return mInstance;
    }

    private void _start(ImageView imageView,int flag) {
        if (currentImageView != null) {
            _stop();
        }
        this.flag = flag;
        String anim_list ="";
        if(flag == 0){
            anim_list = "voice_left_anim";
        }else if(flag == 1){
            anim_list = "voice_right_anim";
        }
        currentImageView = imageView;
        currentImageView.setImageResource(Util.getRS(anim_list, "drawable", context));
        AnimationDrawable animationDrawable = (AnimationDrawable) currentImageView.getDrawable();
        animationDrawable.start();
    }

    private void _stop() {
        if (currentImageView == null) {
            return;
        }
        String anim_list ="";
        String bg = "";
        if(flag == 0){
            anim_list = "voice_left_anim";
            bg = "v_l_f";
        }else if(flag == 1){
            anim_list = "voice_right_anim";
            bg = "v_r_f";
        }
        currentImageView.setImageResource(Util.getRS(anim_list, "drawable", context));
        AnimationDrawable animationDrawable = (AnimationDrawable) currentImageView.getDrawable();
        animationDrawable.stop();
        currentImageView.setImageResource(Util.getRS(bg,"drawable",context));
    }

    public static void start(Context context, ImageView imageView,int flag) {
        getInstance(context)._start(imageView,flag);
    }

    public static void stop(Context context) {
        getInstance(context)._stop();
    }

}
