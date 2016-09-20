package com.hand.im.adapter;

import android.content.Context;
import android.graphics.Bitmap;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.hand.im.Util;
import com.hand.im.model.CallMemberModel;
import com.hand.im.widget.SmoothCheckBox;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.display.RoundedBitmapDisplayer;

import java.util.List;

/**
 * Created by cool on 2016/9/6.
 */
public class CallSelectAdapter extends BaseAdapter {

    private List<CallMemberModel> mCallMemberModels;
    private Context mContext;
    private DisplayImageOptions options;
    private String mCallerUserId;
    private List<String> mOnLineIds;//正在通话的usierId
    private String action;

    public CallSelectAdapter(Context context, List<CallMemberModel> callMemberModels, String callerUserId,List<String> onLineIds,String action) {
        this.mContext = context;
        this.mCallMemberModels = callMemberModels;
        this.mCallerUserId = callerUserId;
        this.mOnLineIds = onLineIds;
        this.action = action;
        initOptions();
    }

    @Override
    public int getCount() {
        if (mCallMemberModels != null && mCallMemberModels.size() > 0) {
            return mCallMemberModels.size();
        }
        return 0;
    }

    @Override
    public Object getItem(int position) {
        return mCallMemberModels.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder;
        if (convertView == null) {
            viewHolder = new ViewHolder();
            convertView = View.inflate(mContext, Util.getRS("item_call_select","layout",mContext), null);
            viewHolder.mHeadImageView = (ImageView) convertView.findViewById(Util.getRS("iv_head","id",mContext));
            viewHolder.mNameTextView = (TextView) convertView.findViewById(Util.getRS("tv_name","id",mContext));
            viewHolder.mCodeTextView = (TextView) convertView.findViewById(Util.getRS("tv_code","id",mContext));
            viewHolder.mSelectSmoothCheckBox = (SmoothCheckBox) convertView.findViewById(Util.getRS("scb_select","id",mContext));
            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        final CallMemberModel callMemberModel = mCallMemberModels.get(position);
        viewHolder.mNameTextView.setText(callMemberModel.getEmp_name());
        viewHolder.mCodeTextView.setText(callMemberModel.getEmp_code());
        String avatar = callMemberModel.getAvatar();
        if (TextUtils.isEmpty(avatar)) {
            viewHolder.mHeadImageView.setImageResource(Util.getRS("head_1","drawable",mContext));
        } else {
            ImageLoader.getInstance().displayImage(avatar, viewHolder.mHeadImageView, options);
        }
        viewHolder.mSelectSmoothCheckBox.setOnCheckedChangeListener(new SmoothCheckBox.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(SmoothCheckBox checkBox, boolean isChecked) {
                if (mCallerUserId.equals(callMemberModel.getEmp_code())) {
                    callMemberModel.isChecked = true;
                } else {
                    callMemberModel.isChecked = isChecked;
                }
            }
        });
        if (mCallerUserId.equals(callMemberModel.getEmp_code())) {
            viewHolder.mSelectSmoothCheckBox.setChecked(callMemberModel.isChecked,false);
            viewHolder.mSelectSmoothCheckBox.setCanClick(false);
        }else {
            viewHolder.mSelectSmoothCheckBox.setChecked(callMemberModel.isChecked);
        }
        if("callInvite".equals(action)){
            if(mOnLineIds != null && mOnLineIds.size() >0){
                if(mOnLineIds.contains(callMemberModel.getEmp_code())){
                    viewHolder.mSelectSmoothCheckBox.setChecked(callMemberModel.isChecked,false);
                    viewHolder.mSelectSmoothCheckBox.setCanClick(false);
                }
            }
        }

        return convertView;
    }


    static class ViewHolder {
        ImageView mHeadImageView;
        TextView mNameTextView;
        TextView mCodeTextView;
        SmoothCheckBox mSelectSmoothCheckBox;
    }

    /**
     * 初始化ImageLoader的参数
     */
    private void initOptions() {
        options = new DisplayImageOptions.Builder()
//                .showImageOnLoading(R.drawable.picture_loading)
//                .showImageOnFail(R.drawable.pictures_no)
                .showImageOnLoading(Util.getRS("picture_loading", "drawable", mContext))
                .showImageOnFail(Util.getRS("pictures_no", "drawable", mContext))
                .cacheOnDisk(true)
                .cacheInMemory(true)
                .displayer(new RoundedBitmapDisplayer(100)) // 设置成圆角图片
                .bitmapConfig(Bitmap.Config.RGB_565)
                .resetViewBeforeLoading(true)
                .build();
    }
}
