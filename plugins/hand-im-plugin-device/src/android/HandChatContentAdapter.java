package com.hand.im;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.text.SpannableString;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import java.util.List;
import com.hand.china.hrms2.research.R;

/**
 * Created by USER on 2016/7/1.
 */
public class HandChatContentAdapter extends BaseAdapter{
    private List<HandChatActivity.ChatContant> data;
    private LayoutInflater inflater;
    private Context context;
    private ViewHolder viewHolder;
    private DisplayImageOptions options;
    //当前的用户ID
    private String userId;
    //单聊消息接收者的ID
    private String friendId;
    public static final String IMG = "IMG";
    public static final String TXT = "TXT";
    public HandChatContentAdapter(Context context,List<HandChatActivity.ChatContant> chats,String userId,String friendId){
        this.data = chats;
        this.context = context;
        inflater = LayoutInflater.from(context);
        this.userId = userId;
        this.friendId = friendId;
        options = new DisplayImageOptions.Builder()
                .showImageOnLoading(R.drawable.picture_loading)
                .showImageOnFail(R.drawable.pictures_no)
                .cacheOnDisk(true)
                .cacheInMemory(true)
                .bitmapConfig(Bitmap.Config.RGB_565)
                .resetViewBeforeLoading(true)
                .build();
    }
    @Override
    public int getCount() {
        return data.size();
    }

    @Override
    public Object getItem(int position) {
        return data.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView != null){
            viewHolder = (ViewHolder) convertView.getTag();
        }else{
            convertView = inflater.inflate(R.layout.chat_item_layout,null);
            viewHolder = new ViewHolder();
            viewHolder.imgv_chat_left_head_portrait = (ImageView) convertView.findViewById(R.id.imgv_chat_left_head_portrait);
            viewHolder.textv_chat_content = (TextView) convertView.findViewById(R.id.textv_chat_content);
            viewHolder.textv_chat_right_content = (TextView) convertView.findViewById(R.id.textv_chat_right_content);
            viewHolder.imgv_chat_img = (ImageView) convertView.findViewById(R.id.imgv_chat_img);
            viewHolder.imgv_chat_right_img = (ImageView) convertView.findViewById(R.id.imgv_chat_right_img);
            convertView.setTag(viewHolder);
        }
        if(data.get(position).getType().equals(IMG)){
            viewHolder.imgv_chat_img.setVisibility(View.VISIBLE);
            viewHolder.imgv_chat_right_img.setVisibility(View.VISIBLE);
            viewHolder.textv_chat_content.setVisibility(View.GONE);
            viewHolder.textv_chat_right_content.setVisibility(View.GONE);
            if(data.get(position).getFromUser().equals(friendId)){
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.imgv_chat_img.setVisibility(View.VISIBLE);
                viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
                final String url = data.get(position).getRyUri().toString();
                //imageLoader处理图片
                ImageLoader.getInstance().displayImage(data.get(position).getRyUri().toString(), viewHolder.imgv_chat_img, options);
                viewHolder.imgv_chat_img.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(context,ImageActivity.class);
                        intent.putExtra("URL",url);
                        context.startActivity(intent);
                    }
                });
            }else if(data.get(position).getFromUser().equals(userId)){
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.GONE);
                viewHolder.imgv_chat_img.setVisibility(View.GONE);
                viewHolder.imgv_chat_right_img.setVisibility(View.VISIBLE);
                //imageLoader处理图片
                final String url = data.get(position).getRyUri().toString();
                ImageLoader.getInstance().displayImage(url, viewHolder.imgv_chat_right_img, options);
                viewHolder.imgv_chat_right_img.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(context, ImageActivity.class);
                        intent.putExtra("URL", url);
                        context.startActivity(intent);
                    }
                });
            }
        }else if(data.get(position).getType().equals(TXT)){
            viewHolder.imgv_chat_img.setVisibility(View.GONE);
            viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
            viewHolder.textv_chat_content.setVisibility(View.VISIBLE);
            viewHolder.textv_chat_right_content.setVisibility(View.VISIBLE);
            //单聊对象的ID
            if(data.get(position).getFromUser().equals(friendId)){
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.textv_chat_content.setVisibility(View.VISIBLE);
                SpannableString spannableString = FaceConversionUtil.getInstace().getExpressionString(context, data.get(position).getTxt());
                viewHolder.textv_chat_content.setText(spannableString);
                viewHolder.textv_chat_right_content.setVisibility(View.GONE);
            }else if(data.get(position).getFromUser().equals(userId)){
                //本人的ID
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.GONE);
                viewHolder.textv_chat_content.setVisibility(View.GONE);
                viewHolder.textv_chat_right_content.setVisibility(View.VISIBLE);
                SpannableString spannableString = FaceConversionUtil.getInstace().getExpressionString(context, data.get(position).getTxt());
                viewHolder.textv_chat_right_content.setText(spannableString);
            }
        }
        return convertView;
    }
    public class ViewHolder{
        public ImageView imgv_chat_left_head_portrait;
        public TextView  textv_chat_content;
        public TextView  textv_chat_right_content;
        public ImageView imgv_chat_img;
        public ImageView imgv_chat_right_img;
    }
}
