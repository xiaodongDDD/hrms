package com.hand.im.service;

import android.app.Service;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.hand.im.control.PlayControl;

/**
 * Created by cool on 2016/8/24.
 */
public class PlayService extends Service implements MediaPlayer.OnPreparedListener, MediaPlayer.OnCompletionListener {
    private MediaPlayer mMediaPlayer;
    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return super.onStartCommand(intent, flags, startId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return new PlayBinder();
    }

    class PlayBinder extends Binder implements PlayControl {

        @Override
        public void play(String mp3Name) {
            PlayService.this.play(mp3Name);
        }

        @Override
        public void stop() {
            PlayService.this.stop();
        }

        @Override
        public boolean isPlaying() {
            return PlayService.this.isPlaying();
        }
    }

    private void stop(){
        if(mMediaPlayer != null){
            mMediaPlayer.stop();
        }
    }

    public void play(String mp3Name) {
        Intent i = new Intent("com.android.music.musicservicecommand");
        i.putExtra("command", "pause");
        sendBroadcast(i);
        release(false);
        try {
            AssetManager assetManager = getAssets();
            AssetFileDescriptor assetFileDescriptor = assetManager.openFd(mp3Name);
            if(mMediaPlayer == null) {
                mMediaPlayer = new MediaPlayer();
            }
            mMediaPlayer.setOnPreparedListener(this);
            mMediaPlayer.setOnCompletionListener(this);
            mMediaPlayer.setDataSource(assetFileDescriptor.getFileDescriptor(),assetFileDescriptor.getStartOffset(),assetFileDescriptor.getLength());
            mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            mMediaPlayer.setLooping(true);
            mMediaPlayer.prepareAsync();

        } catch (Exception ex) {
            ex.printStackTrace();
            return;
        }
    }

    private boolean isPlaying(){
        if(mMediaPlayer != null){
            return mMediaPlayer.isPlaying();
        }
        return false;
    }

    /**
     * release the media player in any state
     */
    private void release(boolean cleartargetstate) {
        if (mMediaPlayer != null) {
            mMediaPlayer.reset();
            mMediaPlayer.release();
            mMediaPlayer = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// MediaPlay callBack ///////////////////////////////
    @Override
    public void onPrepared(MediaPlayer mediaPlayer) {
        if(mMediaPlayer != null){
            mMediaPlayer.start();
        }
    }

    @Override
    public void onCompletion(MediaPlayer mediaPlayer) {

    }
    ////////////////////////////////////////////////////////////////////////////
}
