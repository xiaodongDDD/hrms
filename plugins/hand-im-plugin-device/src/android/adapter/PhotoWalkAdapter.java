package com.hand.im.adapter;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

import com.hand.im.Util;
import com.hand.im.activity.PhotoWalkActivity;
import com.hand.im.model.PhotoModel;
import com.hand.im.widget.CommonToast;
import com.hand.im.widget.SelectView;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.assist.ImageScaleType;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by cool on 2016/10/10.
 */

public class PhotoWalkAdapter extends BaseAdapter {
  private Context mContext;
  private List<PhotoModel> mPhotoModels;
  private DisplayImageOptions options;
  private List<String> selectPaths = new ArrayList<String>();

  public PhotoWalkAdapter(Context context, List<PhotoModel> mPhotoModels, List<String> selectPaths) {
    this.mContext = context;
    this.mPhotoModels = mPhotoModels;
    this.selectPaths = selectPaths;
    initImageLoader();
  }

  private void initImageLoader() {
    //显示图片的配置
    options = new DisplayImageOptions.Builder()
      .showImageOnLoading(Util.getRS("empty_photo","drawable",mContext))
      .cacheInMemory(true)//设置下载的图片是否缓存在内存中
      .imageScaleType(ImageScaleType.IN_SAMPLE_INT)//设置图片以如何的编码方式显示
      .bitmapConfig(Bitmap.Config.RGB_565)//设置图片的解码类型
      .build();
  }

  @Override
  public int getCount() {
    if (mPhotoModels != null && mPhotoModels.size() > 0) {
      return mPhotoModels.size();
    }
    return 0;
  }

  @Override
  public Object getItem(int position) {
    return mPhotoModels.get(position);
  }

  @Override
  public long getItemId(int position) {
    return position;
  }

  @Override
  public View getView(int position, View convertView, ViewGroup parent) {
    final ViewHolder viewHolder;
    if (convertView == null) {
      viewHolder = new ViewHolder();
      convertView = View.inflate(mContext, Util.getRS("item_photo_walk","layout",mContext), null);
      viewHolder.mAlbumImageView = (ImageView) convertView.findViewById(Util.getRS("iv_album","id",mContext));
      viewHolder.mPointSelectView = (SelectView) convertView.findViewById(Util.getRS("sv_point","id",mContext));
      convertView.setTag(viewHolder);
    } else {
      viewHolder = (ViewHolder) convertView.getTag();
    }
    final PhotoModel photoModel = mPhotoModels.get(position);
    final String originalPath = photoModel.getPath();
    String path = "file://" + originalPath;
    if(!originalPath.equals(viewHolder.mAlbumImageView.getTag())){
      ImageLoader.getInstance().displayImage(path, viewHolder.mAlbumImageView, options);
      viewHolder.mAlbumImageView.setTag(originalPath);
    }
    viewHolder.mPointSelectView.setOnStateChangeListener(new SelectView.OnOnStateChangeListener() {
      @Override
      public void onClick(boolean isSelected) {
        photoModel.setSelected(isSelected);
        if (isSelected) {
          if(selectPaths.size() >=6){
            CommonToast toast = CommonToast.getInstance();
            toast.showToast(mContext,"最多选只能选取6张照片");
            viewHolder.mPointSelectView.setViewText("",false);
            photoModel.setSelected(false);
            return;
          }
          selectPaths.add(originalPath);
        } else {
          selectPaths.remove(originalPath);
        }

        ((PhotoWalkActivity)mContext).updatePhotoSelectCount(selectPaths);
        notifyDataSetChanged();
      }
    });

    if (photoModel.isSelected()) {
      viewHolder.mPointSelectView.setViewText(selectPaths.indexOf(originalPath) + 1 + "", false);
      viewHolder.mAlbumImageView.setColorFilter(Color.parseColor("#66000000"));
    } else {
      viewHolder.mPointSelectView.setViewText("", false);
      viewHolder.mAlbumImageView.setColorFilter(null);
    }

    return convertView;
  }


  static class ViewHolder {
    ImageView mAlbumImageView;
    SelectView mPointSelectView;
  }
}
