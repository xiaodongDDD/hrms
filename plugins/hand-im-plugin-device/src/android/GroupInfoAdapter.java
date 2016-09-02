package com.hand.im;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;


import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.ImageRequest;
import com.hand.im.bean.UserInfo;
import com.hand.im.contact.PersonBean;
import com.hand.im.volley.HttpUtil;
import com.hand.im.volley.MyApplication;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by panx on 2016/8/24.
 */
public class GroupInfoAdapter extends BaseAdapter {
  private ArrayList<UserInfo> data;
  private Context context;
  private LayoutInflater layoutInflater;
  private String createrId;
  //private List<View> viewList = new ArrayList<View>();

  public GroupInfoAdapter(Context context, ArrayList<UserInfo> data, String createrId) {
    this.context = context;
    this.data = data;
    layoutInflater = LayoutInflater.from(context);
    this.createrId = createrId;
    //initData();
  }




  private void setImageView(final ImageView imageView, String url) {
    if (url == null) {
      return;
    }
    ImageRequest imageRequest = new ImageRequest(url, new Response.Listener<Bitmap>() {
      @Override
      public void onResponse(Bitmap bitmap) {
        imageView.setImageBitmap(bitmap);
      }
    }, 0, 0, Bitmap.Config.RGB_565, new Response.ErrorListener() {
      @Override
      public void onErrorResponse(VolleyError volleyError) {
        imageView.setImageResource(Util.getRS("avatar_default", "drawable", context));
      }
    });
    MyApplication.getHttpQueue(context).add(imageRequest);
  }

  @Override
  public int getCount() {
    // if(UserUtil.emp_code!=null&&UserUtil.emp_code.equals(createrId)) {
    //   return data.size();
    //}else{
    return data.size() - 1;
    //}
  }

  @Override
  public Object getItem(int i) {
    return data.get(i);
  }

  @Override
  public long getItemId(int i) {
    return i;
  }

  //public final class ViewHolder {
  private ImageView imgAvatar;
  private TextView txtTmpName;
  //}

  @Override
  public View getView(int i, View view, ViewGroup viewGroup) {
      view = layoutInflater.inflate(Util.getRS("item_group_info", "layout", context), null);
      imgAvatar = (ImageView) view.findViewById(Util.getRS("imgAvatar", "id", context));
      txtTmpName = (TextView) view.findViewById(Util.getRS("txtEmpName", "id", context));
      if (i == data.size() - 2) {
        imgAvatar.setImageResource(Util.getRS("group_add", "drawable", context));
        txtTmpName.setText("邀请");
      } else if (i == data.size() - 1) {
        //holder.imgAvatar.setImageResource( Util.getRS("group_add","drawable",context));
        // if(!UserUtil.emp_code.equals(createrId)){
        view.setVisibility(View.GONE);
        // }
      } else {
        imgAvatar.setImageResource(Util.getRS("avatar_default", "drawable", context));
        txtTmpName.setText(data.get(i).getEmp_name());
      }
//      viewList.set(i,view);
      if(data.get(i).getAvatar()!=null){
        setImageView(imgAvatar,data.get(i).getAvatar());
      }
      return view;
  }
}
