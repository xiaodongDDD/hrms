package com.hand.face.view;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.widget.ImageView;

import com.hand.face.utils.DisplayUtil;

/**
 * Created by USER on 2016/12/13.
 */
public class MaskView extends ImageView {
    int widthScreen, heightScreen;
    private RectF shelterR;
    private Paint mPaint;
    public MaskView(Context context) {
        super(context);
    }
    public MaskView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }
    public MaskView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }
    private void init(Context context){
        Point p = DisplayUtil.getScreenMetrics(context);
        widthScreen = p.x;
        heightScreen = p.y;
        mPaint = new Paint();
        mPaint.setStyle(Paint.Style.FILL);
        mPaint.setStrokeWidth(2);
        mPaint.setAntiAlias(true);
        mPaint.setColor(Color.WHITE);
    }
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (shelterR == null || shelterR.isEmpty()) {
            shelterR = new RectF(0, 0,widthScreen, heightScreen);
        }
        // 画入前景圆形蒙板层
        int sc = canvas.saveLayer(shelterR, null, Canvas.MATRIX_SAVE_FLAG
                | Canvas.CLIP_SAVE_FLAG | Canvas.HAS_ALPHA_LAYER_SAVE_FLAG
                | Canvas.FULL_COLOR_LAYER_SAVE_FLAG
                | Canvas.CLIP_TO_LAYER_SAVE_FLAG | Canvas.ALL_SAVE_FLAG);
        mPaint.setAlpha(125);
        canvas.drawRect(shelterR, mPaint);
        mPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OUT));
        mPaint.setColor(Color.WHITE);
        canvas.drawCircle(getWidth() / 2, getHeight() / 2, widthScreen*9/20, mPaint);
        canvas.restoreToCount(sc);
        mPaint.setXfermode(null);
        mPaint.setColor(Color.WHITE);
    }
}
