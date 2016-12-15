package com.hand.face.utils;

import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.os.Environment;
import android.util.Log;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by USER on 2016/12/10.
 */
public class FileUtil {
    private static final String TAG = "FileUtil";
    private static final File parentPath = Environment.getExternalStorageDirectory();
    private static String storagePath = "";
    private static final String DST_FOLDER_NAME = "PlayCamera";
    private static String jpegPath = "";
    /**初始化保存路径
     * @return
     */
    private static String initPath(){
        if(storagePath.equals("")){
            storagePath = parentPath.getAbsolutePath()+"/" + DST_FOLDER_NAME;
            File f = new File(storagePath);
            if(!f.exists()){
                f.mkdir();
            }
        }
        return storagePath;
    }

    /**保存Bitmap到sdcard
     * @param b
     */
    public static void saveBitmap(Bitmap b){
        //等比例宽高压缩到原来的三分之一
        Matrix matrix = new Matrix();
        matrix.setScale(0.3f, 0.3f);
        b = Bitmap.createBitmap(b, 0, 0, b.getWidth(), b.getHeight(), matrix, true);
        String path = initPath();
        //long dataTake = System.currentTimeMillis();
        String dataTake = "myFace";
        String jpegName = path + "/" + dataTake +".jpg";
        jpegPath = jpegName;
        Log.i(TAG, "saveBitmap:jpegName = " + jpegName);
        try {
            FileOutputStream fout = new FileOutputStream(jpegName);
            BufferedOutputStream bos = new BufferedOutputStream(fout);
            b.compress(Bitmap.CompressFormat.JPEG, 70, bos);
            bos.flush();
            bos.close();
            Log.i(TAG, "saveBitmap成功");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            Log.i(TAG, "saveBitmap:失败");
            e.printStackTrace();
        }

    }

    public static String getSavePath(){
        return jpegPath;
    }
}
