package com.hand.im;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.GridView;

/**
 * Created by panx on 2016/8/25.
 */
public class noScrollGridView extends GridView {
    public noScrollGridView(Context context) {
        super(context);
    }

    public noScrollGridView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public noScrollGridView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int expandSpec = MeasureSpec.makeMeasureSpec(Integer.MAX_VALUE >> 2,
                MeasureSpec.AT_MOST);
        super.onMeasure(widthMeasureSpec, expandSpec);
    }
}
