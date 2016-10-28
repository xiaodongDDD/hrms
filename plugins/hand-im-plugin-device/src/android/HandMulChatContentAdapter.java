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
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.Date;
import java.text.SimpleDateFormat;

import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import io.rong.imlib.model.Message;

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
    public static final String VOICE = "VOICE";
    private MediaPlayUtil mMediaPlayUtil;
    //线程池
    private ExecutorService mImageThreadPool = Executors.newFixedThreadPool(3);

    public HandMulChatContentAdapter(Context context, List<HandMulChatActivity.ChatContant> chats, String userId, String friendId, String iconUrl) {
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
        if (convertView != null) {
            viewHolder = (ViewHolder) convertView.getTag();
        } else {
            //convertView = inflater.inflate(R.layout.chat_item_layout,null);
            convertView = inflater.inflate(Util.getRS("chat_item_layout", "layout", context), null);
            viewHolder = new ViewHolder();
            viewHolder.txtv_chat_name = (TextView) convertView.findViewById(Util.getRS("txtv_chat_name", "id", context));
            viewHolder.txtv_received_time = (TextView) convertView.findViewById(Util.getRS("txtv_received_time", "id", context));
            viewHolder.imgv_chat_left_head_portrait = (ImageView) convertView.findViewById(Util.getRS("imgv_chat_left_head_portrait", "id", context));
            viewHolder.imgv_chat_right_head_portrait = (ImageView) convertView.findViewById(Util.getRS("imgv_chat_right_head_portrait","id",context));
            viewHolder.textv_chat_content = (TextView) convertView.findViewById(Util.getRS("textv_chat_content", "id", context));
            viewHolder.textv_chat_right_content = (TextView) convertView.findViewById(Util.getRS("textv_chat_right_content", "id", context));
            viewHolder.imgv_chat_img = (ImageView) convertView.findViewById(Util.getRS("imgv_chat_img", "id", context));
            viewHolder.imgv_chat_right_img = (ImageView) convertView.findViewById(Util.getRS("imgv_chat_right_img", "id", context));
            viewHolder.imgv_left_voice = (ImageView) convertView.findViewById(Util.getRS("imgv_left_voice", "id", context));
            viewHolder.txt_left_voice_duration = (TextView) convertView.findViewById(Util.getRS("txt_left_voice_duration", "id", context));
            viewHolder.lyt_left_voice = (LinearLayout) convertView.findViewById(Util.getRS("lyt_left_voice", "id", context));
            viewHolder.rlt_left_voice = (RelativeLayout) convertView.findViewById(Util.getRS("rlt_left_voice", "id", context));
            viewHolder.imgv_right_voice = (ImageView) convertView.findViewById(Util.getRS("imgv_right_voice", "id", context));
            viewHolder.txt_right_voice_duration = (TextView) convertView.findViewById(Util.getRS("txt_right_voice_duration", "id", context));
            viewHolder.lyt_right_voice = (LinearLayout) convertView.findViewById(Util.getRS("lyt_right_voice", "id", context));
            viewHolder.rlt_right_voice = (RelativeLayout) convertView.findViewById(Util.getRS("rlt_right_voice", "id", context));
            viewHolder.msg_status_failed = (ImageView)convertView.findViewById(Util.getRS("msg_status_failed","id",context));
            viewHolder.msg_status_sending = (ProgressBar)convertView.findViewById(Util.getRS("msg_status_sending","id",context));
            convertView.setTag(viewHolder);
        }
		
		if(LoginInfo.userIcon!=null&&!LoginInfo.userIcon.equals("")&&!LoginInfo.userIcon.equals("null")){
			ImageLoader.getInstance().displayImage(LoginInfo.userIcon+"64", viewHolder.imgv_chat_right_head_portrait, options);
		}else{
			viewHolder.imgv_chat_right_head_portrait.setImageResource(Util.getRS("head_1","drawable",context));
		}
		if (data.get(position).getPortraitUri() != null &&!data.get(position).getPortraitUri().toString().equals("")&&!data.get(position).getPortraitUri().toString().equals("null")) {
			ImageLoader.getInstance().displayImage(data.get(position).getPortraitUri().toString()+"64", viewHolder.imgv_chat_left_head_portrait, options);
		}else{
			viewHolder.imgv_chat_left_head_portrait.setImageResource(Util.getRS("head_1","drawable",context));
		}
		
        if (getReceviedTime(position).equals("")) {
            viewHolder.txtv_received_time.setVisibility(View.GONE);
        } else {
            viewHolder.txtv_received_time.setVisibility(View.VISIBLE);
            viewHolder.txtv_received_time.setText(getReceviedTime(position));
        }
        //消息发送状态的显示
        if(data.get(position).getMsgStatus() == Message.SentStatus.SENDING){
            viewHolder.msg_status_failed.setVisibility(View.GONE);
            viewHolder.msg_status_sending.setVisibility(View.VISIBLE);
        }else if(data.get(position).getMsgStatus() == Message.SentStatus.FAILED){
            viewHolder.msg_status_failed.setVisibility(View.VISIBLE);
            viewHolder.msg_status_sending.setVisibility(View.GONE);
        }else{
            viewHolder.msg_status_sending.setVisibility(View.GONE);
            viewHolder.msg_status_failed.setVisibility(View.GONE);
        }
        if (data.get(position).getType().equals(IMG)) {
            viewHolder.imgv_chat_img.setVisibility(View.GONE);
            viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
            viewHolder.textv_chat_content.setVisibility(View.GONE);
            viewHolder.textv_chat_right_content.setVisibility(View.GONE);
            viewHolder.lyt_left_voice.setVisibility(View.GONE);
            viewHolder.lyt_right_voice.setVisibility(View.GONE);
            if (data.get(position).getFromUser().equals(userId)) {
                viewHolder.txtv_chat_name.setVisibility(View.GONE);
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.GONE);
                viewHolder.imgv_chat_right_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.imgv_chat_img.setVisibility(View.GONE);
                viewHolder.imgv_chat_right_img.setVisibility(View.VISIBLE);
                //imageLoader处理图片
                final String url = data.get(position).getmLocalUri().toString();
                ImageLoader.getInstance().displayImage(url, viewHolder.imgv_chat_right_img, options);
                viewHolder.imgv_chat_right_img.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(context, ImageActivity.class);
                        intent.putExtra("URL", url);
                        context.startActivity(intent);
                    }
                });
            } else {
                viewHolder.txtv_chat_name.setVisibility(View.VISIBLE);
                viewHolder.txtv_chat_name.setText(data.get(position).getMsgSenderName());
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.imgv_chat_right_head_portrait.setVisibility(View.GONE);
                viewHolder.imgv_chat_img.setVisibility(View.VISIBLE);
                viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
                final String url = data.get(position).getRyUri().toString();
                //imageLoader处理图片
                ImageLoader.getInstance().displayImage(data.get(position).getRyUri().toString(), viewHolder.imgv_chat_img, options);
                viewHolder.imgv_chat_img.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(context, ImageActivity.class);
                        intent.putExtra("URL", url);
                        context.startActivity(intent);
                    }
                });
            }
        } else if (data.get(position).getType().equals(TXT)) {
            viewHolder.imgv_chat_img.setVisibility(View.GONE);
            viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
            viewHolder.lyt_left_voice.setVisibility(View.GONE);
            viewHolder.lyt_right_voice.setVisibility(View.GONE);
            viewHolder.textv_chat_content.setVisibility(View.GONE);
            viewHolder.textv_chat_right_content.setVisibility(View.GONE);
            if (data.get(position).getFromUser().equals(userId)) {
                //本人的ID
                viewHolder.txtv_chat_name.setVisibility(View.GONE);
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.GONE);
                viewHolder.imgv_chat_right_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.textv_chat_content.setVisibility(View.GONE);
                viewHolder.textv_chat_right_content.setVisibility(View.VISIBLE);
                SpannableString spannableString = FaceConversionUtil.getInstace(context).getExpressionString(context, data.get(position).getTxt());
                viewHolder.textv_chat_right_content.setText(spannableString);
            } else {
                //对方的ID
                viewHolder.txtv_chat_name.setVisibility(View.VISIBLE);
                viewHolder.txtv_chat_name.setText(data.get(position).getMsgSenderName());
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.imgv_chat_right_head_portrait.setVisibility(View.GONE);
                viewHolder.textv_chat_content.setVisibility(View.VISIBLE);
                SpannableString spannableString = FaceConversionUtil.getInstace(context).getExpressionString(context, data.get(position).getTxt());
                viewHolder.textv_chat_content.setText(spannableString);
                viewHolder.textv_chat_right_content.setVisibility(View.GONE);

            }
        } else if (data.get(position).getType().equals(VOICE)) {
            viewHolder.imgv_chat_img.setVisibility(View.GONE);
            viewHolder.imgv_chat_right_img.setVisibility(View.GONE);
            viewHolder.lyt_left_voice.setVisibility(View.GONE);
            viewHolder.lyt_right_voice.setVisibility(View.GONE);
            viewHolder.textv_chat_content.setVisibility(View.GONE);
            viewHolder.textv_chat_right_content.setVisibility(View.GONE);
            if (data.get(position).getFromUser().equals(userId)) {
                viewHolder.txtv_chat_name.setVisibility(View.GONE);
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.GONE);
                viewHolder.imgv_chat_right_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.lyt_left_voice.setVisibility(View.GONE);
                viewHolder.lyt_right_voice.setVisibility(View.VISIBLE);
                viewHolder.txt_right_voice_duration.setText(data.get(position).getDuration()+"\"");
                setWidth(data.get(position).getDuration(),viewHolder.rlt_right_voice);
                viewHolder.rlt_right_voice.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        ImageView imgView = getVoiceChild((RelativeLayout)v);
                        VoiceAnimManger.start(context,imgView,VoiceAnimManger.RIGHT);
                        mImageThreadPool.execute(new Runnable() {
                            @Override
                            public void run() {
                                synchronized (this) {
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
            } else {
                viewHolder.txtv_chat_name.setVisibility(View.VISIBLE);
                viewHolder.txtv_chat_name.setText(data.get(position).getMsgSenderName());
                viewHolder.imgv_chat_left_head_portrait.setVisibility(View.VISIBLE);
                viewHolder.imgv_chat_right_head_portrait.setVisibility(View.GONE);
                viewHolder.lyt_left_voice.setVisibility(View.VISIBLE);
                viewHolder.lyt_right_voice.setVisibility(View.GONE);
                viewHolder.txt_left_voice_duration.setText(data.get(position).getDuration()+"\"");
                setWidth(data.get(position).getDuration(),viewHolder.rlt_left_voice);
                viewHolder.rlt_left_voice.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        ImageView imgView = getVoiceChild((RelativeLayout)v);
                        VoiceAnimManger.start(context,imgView,VoiceAnimManger.LEFT);
                        mImageThreadPool.execute(new Runnable() {
                            @Override
                            public void run() {
                                synchronized (this) {
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

    private String getReceviedTime(int i) {
        String rt = "";
        long time = data.get(i).getTime();
        long preTime = 0;
        Date date = null;
        Date preDate = new Date();
        long minutes = 10;
        date = new Date(time);
        SimpleDateFormat sd;
        if (i > 0) {
            preTime = data.get(i - 1).getTime();
            preDate = new Date(preTime);
        }
        if (preTime != 0) {
            minutes = (time - preTime) / (1000 * 60);
        }
        if (minutes <= 3) {
            return "";
        } else {
            if (date.getYear() != preDate.getYear()) {
                sd = new SimpleDateFormat("yyyy-MM-dd");
            } else if (date.getMonth() != preDate.getMonth()) {
                sd = new SimpleDateFormat("MM-dd");
            } else if (date.getDate() != preDate.getDate()) {
                sd = new SimpleDateFormat("MM-dd HH:mm");
            } else {
                sd = new SimpleDateFormat("HH:mm");
            }
        }
        rt = sd.format(date);
        return rt;
    }

    public class ViewHolder {
        public TextView txtv_received_time;
        public TextView txtv_chat_name;
        public ImageView imgv_chat_left_head_portrait;
        public ImageView imgv_chat_right_head_portrait;
        public TextView textv_chat_content;
        public TextView textv_chat_right_content;
        public ImageView imgv_chat_img;
        public ImageView imgv_chat_right_img;
        public ImageView imgv_left_voice;
        public ImageView imgv_right_voice;
        public TextView txt_left_voice_duration;
        public LinearLayout lyt_left_voice;
        public RelativeLayout rlt_left_voice;
        public TextView txt_right_voice_duration;
        public LinearLayout lyt_right_voice;
        public RelativeLayout rlt_right_voice;
        public ProgressBar msg_status_sending;
        public ImageView msg_status_failed;
    }

    private void setWidth(int duration, RelativeLayout rlt_right_voice) {
        ViewGroup.LayoutParams params = rlt_right_voice.getLayoutParams();
        if (duration > 7) duration = 7;
        params.height = DensityUtil.dip2px(context, 40);
        params.width = (DensityUtil.dip2px(context, 50 + 10 * duration));
        rlt_right_voice.setLayoutParams(params);
    }

    private ImageView getVoiceChild(RelativeLayout rlt) {
        ImageView imgView = (ImageView) rlt.getChildAt(0);
        return imgView;
    }

}
