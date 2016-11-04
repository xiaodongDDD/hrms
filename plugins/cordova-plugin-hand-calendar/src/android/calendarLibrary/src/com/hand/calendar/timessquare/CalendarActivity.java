package com.hand.calendar.timessquare;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.ImageView;
import android.widget.TextView;

import com.hand.calendar.R;


public class CalendarActivity extends Activity {
    ImageView mBack;
    private CalendarPickerView calendar;
    public final static int CHOOSE_SINGLE = 1;
    public final static int CHOOSE_RANGE = 2;
    public final static int CHOOSE_NONE = 3;
    private boolean isSingle;
    private TextView mSelectTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);// 去掉标题
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);
        mSelectTextView = (TextView) findViewById(R.id.tv_select);
        init();
        isSingle = getIntent().getBooleanExtra("isSingle", true);
        if (isSingle) {
            calendar.setSelectionMode(CalendarPickerView.SelectionMode.SINGLE);
        } else {
            calendar.setSelectionMode(CalendarPickerView.SelectionMode.RANGE);
        }
    }

    private void init() {
        mBack = (ImageView) findViewById(R.id.back_iv);

        Calendar nextYear = Calendar.getInstance();
        Calendar startYear = Calendar.getInstance();
        nextYear.add(Calendar.YEAR, 1);
        startYear.add(Calendar.YEAR, -1);
        calendar = (CalendarPickerView) findViewById(R.id.calendar_view);
        Date today = new Date();
        calendar.init(startYear.getTime(), nextYear.getTime()).withSelectedDate(today);

        mBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setResult(CHOOSE_NONE);
                finish();
            }
        });

        mSelectTextView.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                List<Date> temp = calendar.getSelectedDates();
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
                if (isSingle) {
                    Intent intent = new Intent();
                    intent.putExtra("pickData", df.format(temp.get(0)));
                    setResult(CHOOSE_SINGLE, intent);
                } else {
                    Intent intent = new Intent();
                    intent.putExtra("pickDatas",
                            "{\"result\":[\"" + df.format(temp.get(0)) + "\",\"" + df.format(temp.get(temp.size() - 1)) + "\"]}");
                    setResult(CHOOSE_RANGE, intent);
                }
                finish();
            }
        });
    }

    private int getId(String id) {
        return getResources().getIdentifier(id, "id", getPackageName());
    }

    private int getLayoutId(String layoutId) {
        return getResources().getIdentifier(layoutId, "layout", getPackageName());
    }
}
