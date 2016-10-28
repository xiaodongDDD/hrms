package com.hand.im.widget;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.View;

/**
 * Created by cool on 2016/9/27.
 */

public class SelectView extends View {

    private int mBackgroundColorNormal = Color.parseColor("#33000000");
    private int mBackgroundColorSelect = Color.parseColor("#2A5BA2");
    private int mTextColor = Color.parseColor("#FFFFFF");
    private int mStrokeColor = Color.parseColor("#56FFFFFF");
    private float mStrokeWidth = dp2px(1.0f);
    private float mSolidRadius = dp2px(14.0f);//实心圆半径
    private float mRingRadius;//圆环半径
    private float mTextSize = sp2px(12.0f);

    private int mCenterX;//圆心x坐标
    private int mCenterY;//圆心y坐标

    private Paint mStrokePaint;//圆环画笔
    private Paint mSolidPaint;//背景填充画笔
    private Paint mTextPaint;//文字画笔

    private String text = "1";//要画的数字
    private boolean isSelected;//是否已经被选上

    private OnOnStateChangeListener listener;

    public void setOnStateChangeListener(OnOnStateChangeListener listener) {
        this.listener = listener;
    }

    public interface OnOnStateChangeListener {
        void onClick(boolean isSelected);
    }


    public SelectView(Context context) {
        this(context, null);
    }

    public SelectView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public SelectView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    /**
     * 初始化操作
     */
    private void init() {
        mRingRadius = mSolidRadius + mStrokeWidth / 2;
        setClickable(true);
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                toggle();
                if (listener != null) {
                    listener.onClick(isSelected);
                }

            }
        });

        mStrokePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mStrokePaint.setColor(mStrokeColor);
        mStrokePaint.setStyle(Paint.Style.STROKE);
        mStrokePaint.setStrokeWidth(mStrokeWidth);

        mSolidPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mSolidPaint.setColor(mBackgroundColorNormal);
        mSolidPaint.setStyle(Paint.Style.FILL);

        mTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mTextPaint.setColor(mTextColor);
        mTextPaint.setTextSize(mTextSize);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        drawCircle(canvas);//画实心圆
        drawRing(canvas);//画圆环
        drawText(canvas);//画文本
    }

    private void drawText(Canvas canvas) {
        Rect bounds = new Rect();
        mTextPaint.getTextBounds(text, 0, text.length(), bounds);
        int textWith = bounds.right - bounds.left;
        int textHight = bounds.bottom - bounds.top;
        float x = (getMeasuredWidth() - textWith) / 2;
        float y = (getMeasuredHeight() + textHight) / 2;
        if (isSelected) {
            canvas.drawText(text, x, y, mTextPaint);
        } else {
            canvas.drawText("", x, y, mTextPaint);
        }
    }

    private void drawRing(Canvas canvas) {
        RectF rectF = new RectF();
        rectF.top = mCenterY - mRingRadius;
        rectF.bottom = mCenterY + mRingRadius;
        rectF.left = mCenterX - mRingRadius;
        rectF.right = mCenterX + mRingRadius;
        canvas.drawArc(rectF, 0, 360, false, mStrokePaint);
    }

    private void drawCircle(Canvas canvas) {
        if (!isSelected) {
            canvas.drawCircle(mCenterX, mCenterY, mSolidRadius, mSolidPaint);
        } else {
            mSolidPaint.setColor(mBackgroundColorSelect);
            canvas.drawCircle(mCenterX, mCenterY, mSolidRadius, mSolidPaint);
            mSolidPaint.setColor(mBackgroundColorNormal);
        }

    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int exceptWidth = (int) ((mSolidRadius + mStrokeWidth) * 2);
        widthMeasureSpec = MeasureSpec.makeMeasureSpec(exceptWidth, MeasureSpec.EXACTLY);
        super.onMeasure(widthMeasureSpec, widthMeasureSpec);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        mCenterX = w / 2;//获取圆心x坐标
        mCenterY = h / 2;//获取圆心y坐标
    }

    private void toggle() {
        isSelected = !isSelected;
        invalidate();
    }

    public void setViewText(String text, boolean isViewClick) {
        this.text = text;
        if (!isViewClick) {
            if (TextUtils.isEmpty(text)) {
                isSelected = false;
            } else {
                isSelected = true;
            }
        }

        invalidate();
    }

    public String getViewText() {
        return text;
    }

    public boolean isViewSelected() {
        return isSelected;
    }

    /**
     * dp转px
     *
     * @param dp
     * @return
     */
    public int dp2px(float dp) {
        float density = getContext().getResources().getDisplayMetrics().density;
        int px = (int) (dp * density + 0.5f);
        return px;
    }

    /**
     * px转dp
     *
     * @param px
     * @return
     */
    public int px2dp(float px) {
        float density = getContext().getResources().getDisplayMetrics().density;
        int dp = (int) (px / density + 0.5f);
        return dp;
    }

    /**
     * sp转px
     *
     * @param sp
     * @return
     */
    public float sp2px(float sp) {
        final float scale = getContext().getResources().getDisplayMetrics().scaledDensity;
        return sp * scale;
    }
}
