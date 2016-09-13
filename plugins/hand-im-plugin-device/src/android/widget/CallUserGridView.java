package com.hand.im.widget;

import android.content.Context;
import android.graphics.Bitmap;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.hand.im.Util;

import java.util.ArrayList;
import java.util.List;

import com.hand.im.model.CallMemberModel;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.display.RoundedBitmapDisplayer;

/**
 * Created by weiqinxiao on 16/3/25.
 */
public class CallUserGridView extends ScrollView {
    private Context context;
    private boolean enableTitle;
    private LinearLayout linearLayout;

    private final static int CHILDREN_PER_LINE = 4;
    private final static int CHILDREN_SPACE = 10;

    private int portraitSize;
    private DisplayImageOptions options;

    public CallUserGridView(Context context) {
        super(context);
        init(context);
    }

    public CallUserGridView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    private void init(Context context) {
        this.context = context;
        initOptions();
        linearLayout = new LinearLayout(context);
        linearLayout.setLayoutParams(new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        linearLayout.setOrientation(LinearLayout.VERTICAL);
        addView(linearLayout);
    }

    public int dip2pix(int dipValue) {
        float scale = getResources().getDisplayMetrics().density;
        return (int) (dipValue * scale + 0.5f);
    }

    public int getScreenWidth() {
        return getResources().getDisplayMetrics().widthPixels;
    }

    public void setChildPortraitSize(int size) {
        portraitSize = size;
    }

    public void enableShowState(boolean enable) {
        enableTitle = enable;
    }

    public void addChild(String childId, CallMemberModel callMemberModel) {
        addChild(childId, callMemberModel, null);
    }

    public void addChild(String childId, CallMemberModel callMemberModel, String state) {
        int containerCount = linearLayout.getChildCount();
        LinearLayout lastContainer = null;
        int i;
        for (i = 0; i < containerCount; i++) {
            LinearLayout container = (LinearLayout) linearLayout.getChildAt(i);
            if (container.getChildCount() < CHILDREN_PER_LINE) {
                lastContainer = container;
                break;
            }
        }
        if (lastContainer == null) {
            lastContainer = new LinearLayout(context);
            lastContainer.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            lastContainer.setGravity(Gravity.CENTER);
            lastContainer.setPadding(0, dip2pix(CHILDREN_SPACE), 0, 0);
            linearLayout.addView(lastContainer);
        }

        LinearLayout child = (LinearLayout) LayoutInflater.from(context).inflate(Util.getRS("item_mul_user_info","layout",context), null);
        child.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        child.setPadding(0, 0, dip2pix(CHILDREN_SPACE), 0);
        child.setTag(childId);
        if (portraitSize > 0) {
            child.findViewById(Util.getRS("rc_user_portrait_layout","id",context)).setLayoutParams(new LinearLayout.LayoutParams(portraitSize, portraitSize));
        }
        ImageView imageView = (ImageView) child.findViewById(Util.getRS("rc_user_portrait","id",context));
        TextView name = (TextView) child.findViewById(Util.getRS("rc_user_name","id",context));
        name.setVisibility(enableTitle ? VISIBLE : GONE);
        TextView stateV = (TextView) child.findViewById(Util.getRS("rc_voip_member_state","id",context));
        stateV.setVisibility(enableTitle ? VISIBLE : GONE);
        if (state != null) {
            stateV.setText(state);
        } else {
            stateV.setVisibility(GONE);
        }

        if (callMemberModel != null) {
            if (TextUtils.isEmpty(callMemberModel.avatar)) {
                imageView.setImageResource(Util.getRS("head_1","drawable",context));
            } else {
                ImageLoader.getInstance().displayImage(callMemberModel.avatar, imageView, options);
            }
            name.setText(callMemberModel.getEmp_name() == null ? callMemberModel.getEmp_code() : callMemberModel.getEmp_name());
        } else {
            name.setText(childId);
        }
        lastContainer.addView(child);
    }


    public void removeChild(String childId) {
        int containerCount = linearLayout.getChildCount();

        LinearLayout lastContainer = null;
        List<LinearLayout> containerList = new ArrayList<LinearLayout>();
        for (int i = 0; i < containerCount; i++) {
            LinearLayout container = (LinearLayout) linearLayout.getChildAt(i);
            containerList.add(container);
        }
        for (LinearLayout resultContainer : containerList) {
            if (lastContainer == null) {
                LinearLayout child = (LinearLayout) resultContainer.findViewWithTag(childId);
                if (child != null) {
                    resultContainer.removeView(child);
                    if (resultContainer.getChildCount() == 0) {
                        linearLayout.removeView(resultContainer);
                        break;
                    } else {
                        lastContainer = resultContainer;
                    }
                }
            } else {
                View view = resultContainer.getChildAt(0);
                resultContainer.removeView(view);
                lastContainer.addView(view);
                if (resultContainer.getChildCount() == 0) {
                    linearLayout.removeView(resultContainer);
                    break;
                } else {
                    lastContainer = resultContainer;
                }
            }
        }
    }

    public View findChildById(String childId) {
        int containerCount = linearLayout.getChildCount();

        for (int i = 0; i < containerCount; i++) {
            LinearLayout container = (LinearLayout) linearLayout.getChildAt(i);
            LinearLayout child = (LinearLayout) container.findViewWithTag(childId);
            if (child != null) {
                return child;
            }
        }
        return null;
    }

    public void updateChildInfo(String childId, CallMemberModel callMemberModel) {
        int containerCount = linearLayout.getChildCount();

        LinearLayout lastContainer = null;
        for (int i = 0; i < containerCount; i++) {
            LinearLayout container = (LinearLayout) linearLayout.getChildAt(i);
            LinearLayout child = (LinearLayout) container.findViewWithTag(childId);
            if (child != null) {
                ImageView imageView = (ImageView) child.getChildAt(0);
                if (TextUtils.isEmpty(callMemberModel.avatar)) {
                    imageView.setImageResource(Util.getRS("head_1","drawable",context));
                } else {
                    ImageLoader.getInstance().displayImage(callMemberModel.avatar, imageView, options);
                }
                if (enableTitle) {
                    TextView textView = (TextView) child.getChildAt(1);
                    textView.setText(callMemberModel.getEmp_name());
                }
            }
        }

    }

    public void updateChildState(String childId, String state) {
        int containerCount = linearLayout.getChildCount();

        for (int i = 0; i < containerCount; i++) {
            LinearLayout container = (LinearLayout) linearLayout.getChildAt(i);
            LinearLayout child = (LinearLayout) container.findViewWithTag(childId);
            if (child != null) {
                TextView textView = (TextView) child.findViewById(Util.getRS("rc_voip_member_state","id",context));
                textView.setText(state);
            }
        }
    }

    public void updateChildState(String childId, boolean visible) {
        int containerCount = linearLayout.getChildCount();

        for (int i = 0; i < containerCount; i++) {
            LinearLayout container = (LinearLayout) linearLayout.getChildAt(i);
            LinearLayout child = (LinearLayout) container.findViewWithTag(childId);
            if (child != null) {
                TextView textView = (TextView) child.findViewById(Util.getRS("rc_voip_member_state","id",context));
                textView.setVisibility(visible ? VISIBLE : GONE);
            }
        }
    }

    /**
     * 初始化ImageLoader的参数
     */
    private void initOptions() {
        options = new DisplayImageOptions.Builder()
//                .showImageOnLoading(R.drawable.picture_loading)
//                .showImageOnFail(R.drawable.pictures_no)
                .showImageOnLoading(Util.getRS("picture_loading", "drawable", context))
                .showImageOnFail(Util.getRS("pictures_no", "drawable", context))
                .cacheOnDisk(true)
                .cacheInMemory(true)
                .displayer(new RoundedBitmapDisplayer(100)) // 设置成圆角图片
                .bitmapConfig(Bitmap.Config.RGB_565)
                .resetViewBeforeLoading(true)
                .build();
    }
}
