package com.hand.im;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.text.SpannableString;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by panx on 2016/8/27.
 */
public class HandMulChatContentAdapter extends BaseAdapter {
  private List<HandMulChatActivity.ChatContant> data;
  private LayoutInflater inflater;
  private String iconUrl;
  private Context context;
  private ViewHolder viewHolder;
  private DisplayImageOptions options;
  //当前的用户ID
  private String userId;
  //单聊消息接收者的ID
  private String friendId;
  public static final String IMG = "IMG";
  public static final String TXT = "TXT";
  public static final String VOICE="VOICE";
  private MediaPlayUtil mMediaPlayUtil;
  //线程池
  private ExecutorService mImageThreadPool = Executors.newFixedThreadPool(3);

  public HandMulChatContentAdapter(Context context,List<HandMulChatActivity.ChatContant> chats,String userId,String friendId,String iconUrl){
    this.data = chats;
    this.context = context;
    this.iconUrl = iconUrl;
    inflater = LayoutInflater.from(context);
    this.userId = userId;
    this.friendId = friendId;
    mMediaPlayUtil = MediaPlayUtil.getInstance(context);
    options = new DisplayImageOptions.Builder()
//                .showImageOnLoading(R.drawable.picture_loading)
//                .showImageOnFail(R.drawable.pictures_no)
      .showImageOnLoading(Util.getRS("picture_loading", "drawable", context))
      .showImageOnFail(Util.getRS("pictures_no", "drawable", context))
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
  public View getView(final int position, View convertView, ViewGroup parent) {
    if (convertView != null){
      viewHolder = (ViewHolder) convertView.getTag();
    }else{
      //convertView = inflater.inflate(R.layout.chat_item_layout,null);
      convertView = inflater.inflate(Util.getRS("chat_item_layout", "layout", context),null);
      viewHolder = new ViewHolder();
//            viewHolder.imgv_chat_left_head_portrait = (ImageView) convertView.findViewById(R.id.imgv_chat_left_head_portrait);
//            viewHolder.textv_chat_content = (TextView) convertView.findViewById(R.id.textv_chat_content);
//            viewHolder.textv_chat_right_content = (TextView) convertView.findViewById(R.id.textv_chat_right_content);
//            viewHolder.imgv_chat_img = (ImageView) convertView.findViewById(R.id.imgv_chat_img);
//            viewHolder.imgv_chat_right_img = (ImageView) convertView.findViewById(R.id.imgv_chat_right_img);
//            viewHolder.imgv_left_voice = (ImageView) convertView.findViewById(R.id.imgv_left_voice);
//            viewHolder.imgv_right_voice = (ImageView) convertView.findViewById(R.id.imgv_right_voice);
      viewHolder.imgv_chat_left_head_portrait = (ImageView) convertView.findViewById(Util.getRS("imgv_chat_left_head_portrait","id",context));
      viewHolder.textv_chat_content = (TextView) convertView.findViewById(Util.getRS("textv_chat_content","id",context));
      viewHolder.textv_chat_right_content = (TextView) convertView.findViewById(Util.getRS("textv_chat_right_content","id",context));
      viewHolder.imgv_chat_img = (ImageView) convertView.findViewById(Util.getRS("imgv_chat_img","id",context));
      viewHolder.imgv_chat_right_img = (ImageView) convertView.findViewById(Util.getRS("imgv_chat_right_img","id",context));
      viewHolder.imgv_left_voice = (ImageView) convertView.findViewById(Util.getRS("imgv_left_voice","id",context));
      viewHolder.imgv_right_voice = (ImageView) convertView.findViewById(Util.getRS("imgv_right_voice","id",context));
      convertView.setTag(viewHolder);
    }
    /*if(!iconUrl.isEmpty()){
      ImageLoader.getInstance().displayImage(iconUrl, viewHolder.imgv_chat_left_head_portrait, options);
    }*/
    if(data.get(position).getPortraitUri()!=null){
      ImageLoader.getInstance().displayImage(data.get(position).getPortraitUri().toString(), viewHolder.imgv_chat_left_head_portrait, options);
    }
    if(data.get(position).getType().equals(IMG)){
      viewHolder.imgv_chat_img.setVisibility(View.GONE);
      viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
      viewHolder.textv_chat_content.setVisibility(View.GONE);
      viewHolder.textv_chat_right_content.setVisibility(View.GONE);
      viewHolder.imgv_left_voice.setVisibility(View.GONE);
      viewHolder.imgv_right_voice.setVisibility(View.GONE);
      if(data.get(position).getFromUser().equals(userId)){
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
      }else{

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
      }
    }else if(data.get(position).getType().equals(TXT)){
      viewHolder.imgv_chat_img.setVisibility(View.GONE);
      viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
      viewHolder.imgv_left_voice.setVisibility(View.GONE);
      viewHolder.imgv_right_voice.setVisibility(View.GONE);
      viewHolder.textv_chat_content.setVisibility(View.GONE);
      viewHolder.textv_chat_right_content.setVisibility(View.GONE);
      if(data.get(position).getFromUser().equals(userId)){
        //本人的ID
        viewHolder.imgv_chat_left_head_portrait.setVisibility(View.GONE);
        viewHolder.textv_chat_content.setVisibility(View.GONE);
        viewHolder.textv_chat_right_content.setVisibility(View.VISIBLE);
        SpannableString spannableString = FaceConversionUtil.getInstace(context).getExpressionString(context, data.get(position).getTxt());
        viewHolder.textv_chat_right_content.setText(spannableString);
      }else{
        //单聊对象的ID
        viewHolder.imgv_chat_left_head_portrait.setVisibility(View.VISIBLE);
        viewHolder.textv_chat_content.setVisibility(View.VISIBLE);
        SpannableString spannableString = FaceConversionUtil.getInstace(context).getExpressionString(context, data.get(position).getTxt());
        viewHolder.textv_chat_content.setText(spannableString);
        viewHolder.textv_chat_right_content.setVisibility(View.GONE);

      }
    }else if(data.get(position).getType().equals(VOICE)){
      viewHolder.imgv_chat_img.setVisibility(View.GONE);
      viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
      viewHolder.imgv_left_voice.setVisibility(View.GONE);
      viewHolder.imgv_right_voice.setVisibility(View.GONE);
      viewHolder.textv_chat_content.setVisibility(View.GONE);
      viewHolder.textv_chat_right_content.setVisibility(View.GONE);
     if(data.get(position).getFromUser().equals(userId)){
        viewHolder.imgv_chat_left_head_portrait.setVisibility(View.GONE);
        viewHolder.imgv_left_voice.setVisibility(View.GONE);
        viewHolder.imgv_right_voice.setVisibility(View.VISIBLE);
        viewHolder.imgv_right_voice.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View v) {
            mImageThreadPool.execute(new Runnable() {
              @Override
              public void run() {
                synchronized (this){
                  //播放音频
                  if (mMediaPlayUtil.isPlaying()) {
                    mMediaPlayUtil.stop();
                    mMediaPlayUtil.play(data.get(position).getVoiceUri());
                  } else {
                    mMediaPlayUtil.play(data.get(position).getVoiceUri());
                  }
                }
              }
            });
          }
        });
      }else{
        viewHolder.imgv_chat_left_head_portrait.setVisibility(View.VISIBLE);
        viewHolder.imgv_left_voice.setVisibility(View.VISIBLE);
        viewHolder.imgv_right_voice.setVisibility(View.GONE);
        viewHolder.imgv_left_voice.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View v) {
            mImageThreadPool.execute(new Runnable() {
              @Override
              public void run() {
                synchronized (this){
                  //播放音频
                  if (mMediaPlayUtil.isPlaying()) {
                    mMediaPlayUtil.stop();
                    mMediaPlayUtil.play(data.get(position).getVoiceUri());
                  } else {
                    mMediaPlayUtil.play(data.get(position).getVoiceUri());
                  }
                }
              }
            });

          }
        });
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
    public ImageView imgv_left_voice;
    public ImageView imgv_right_voice;
  }
}
