package com.hand.im.contact;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;

import com.hand.im.Util;


public class SideBar extends View {
	
    private Context context;
    private OnTouchingLetterChangedListener onTouchingLetterChangedListener;  
    public static String[] A_Z = { "A", "B", "C", "D", "E", "F", "G", "H", "I",
            "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",  
            "W", "X", "Y", "Z", "#" };  
    private int choose = -1;
    private Paint paint = new Paint();
  
    private TextView mTextDialog;
  

    public void setTextView(TextView mTextDialog) {
        this.mTextDialog = mTextDialog;  
    }  
  
  
    public SideBar(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        this.context = context;
    }  
  
    public SideBar(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.context = context;
    }  
  
    public SideBar(Context context) {
        super(context);
        this.context = context;
    }  
  

    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);  

        int height = getHeight();
        int width = getWidth();
        int singleHeight = height / A_Z.length-2;
  
        for (int i = 0; i < A_Z.length; i++) {  
            paint.setColor(Color.rgb(33, 65, 98));
            paint.setTypeface(Typeface.DEFAULT_BOLD);
            paint.setAntiAlias(true);
            paint.setTextSize(30);

            if (i == choose) {  
                paint.setColor(Color.parseColor("#3399ff"));
                paint.setFakeBoldText(true);
            }  

            float xPos = width / 2 - paint.measureText(A_Z[i]) / 2;  
            float yPos = singleHeight * i + singleHeight;  
            canvas.drawText(A_Z[i], xPos, yPos, paint);
            paint.reset();
        }  
  
    }  
  
    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        final int action = event.getAction();  
        final float y = event.getY();
        final int oldChoose = choose;  
        final OnTouchingLetterChangedListener listener = onTouchingLetterChangedListener;  
        final int c = (int) (y / getHeight() * A_Z.length);
  
        switch (action) {  
        case MotionEvent.ACTION_UP:
            setBackgroundDrawable(new ColorDrawable(0x00000000));
            choose = -1;
            invalidate();  
            if (mTextDialog != null) {  
                mTextDialog.setVisibility(View.INVISIBLE);
            }  
            break;  
  
        default:  
            setBackgroundResource(Util.getRS("sidebar_background","drawable",context));
            if (oldChoose != c) {
                if (c >= 0 && c < A_Z.length) {  
                    if (listener != null) {  
                        listener.onTouchingLetterChanged(A_Z[c]);  
                    }  
                    if (mTextDialog != null) {  
                        mTextDialog.setText(A_Z[c]);  
                        mTextDialog.setVisibility(View.VISIBLE);
                    }  
                    
                    choose = c;  
                    invalidate();  
                }  
            }  
  
            break;  
        }  
        return true;  
    }  
  

    public void setOnTouchingLetterChangedListener(  
            OnTouchingLetterChangedListener onTouchingLetterChangedListener) {  
        this.onTouchingLetterChangedListener = onTouchingLetterChangedListener;  
    }  
  

    public interface OnTouchingLetterChangedListener {  
        public void onTouchingLetterChanged(String s);
    }

}
