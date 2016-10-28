package com.hand.im;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.util.Log;

import java.io.IOException;

public class MediaPlayUtil {
    private static MediaPlayUtil mMediaPlayUtil;
    private MediaPlayer mMediaPlayer;
    private Context context;

    public void setPlayOnCompleteListener(MediaPlayer.OnCompletionListener playOnCompleteListener){
        if(mMediaPlayer != null){
            mMediaPlayer.setOnCompletionListener(playOnCompleteListener);
        }
    }

    public static MediaPlayUtil getInstance(Context context){
        if(mMediaPlayUtil == null){
            mMediaPlayUtil = new MediaPlayUtil(context);
        }
        return  mMediaPlayUtil;
    }

    private MediaPlayUtil(Context context){
        mMediaPlayer = new MediaPlayer();
        mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
        this.context = context;
    }

    public void play(Uri uri){
        //将uri转为path
        if(mMediaPlayer == null){
            return;
        }
        try {
            mMediaPlayer.reset();
            mMediaPlayer.setDataSource(context,uri);
            mMediaPlayer.prepare();
            mMediaPlayer.start();
            mMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mediaPlayer) {
                    VoiceAnimManger.stop(context);
                }
            });
        }catch (Exception e){
            VoiceAnimManger.stop(context);
            e.printStackTrace();
        }
    }

    public void pause(){
        if(mMediaPlayer != null){
            mMediaPlayer.pause();
        }
    }

    public void stop(){
        if(mMediaPlayer != null && mMediaPlayer.isPlaying()){
            mMediaPlayer.stop();
        }
    }

    public int getCurrentPosition(){
        if(mMediaPlayer != null && mMediaPlayer.isPlaying()){
            return mMediaPlayer.getCurrentPosition();
        }else{
            return 0;
        }
    }

    public int getDutation(){
        if(mMediaPlayer!= null && mMediaPlayer.isPlaying()){
            return mMediaPlayer.getDuration();
        }else{
            return 0;
        }
    }

    public boolean isPlaying(){
        if(mMediaPlayer != null){
            return mMediaPlayer.isPlaying();
        }else{
            return false;
        }
    }
}
