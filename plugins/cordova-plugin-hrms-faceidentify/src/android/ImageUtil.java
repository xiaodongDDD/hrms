package com.hand.face.utils;

import android.graphics.Bitmap;
import android.graphics.Matrix;

/**
 * Created by USER on 2016/12/10.
 */
public class ImageUtil {
    /**
     * 旋转图片
     */
    public static Bitmap getRotateBitmap(Bitmap b, float rotateDegree){
        Matrix matrix = new Matrix();
        matrix.postRotate((float)rotateDegree);
        Bitmap rotaBitmap = Bitmap.createBitmap(b, 0, 0, b.getWidth(), b.getHeight(), matrix, false);
        return rotaBitmap;
    }
}
