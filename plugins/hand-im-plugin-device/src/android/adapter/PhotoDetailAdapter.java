package com.hand.im.adapter;

import android.content.Context;
import android.graphics.Bitmap;
import android.support.v4.view.PagerAdapter;
import android.view.View;
import android.view.ViewGroup;

import com.hand.im.Util;
import com.hand.im.activity.PhotoDetailActivity;
import com.hand.im.model.PhotoModel;
import com.hand.im.widget.ZoomImageView;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;

import java.util.List;

/**
 * Created by cool on 2016/9/26.
 */
public class PhotoDetailAdapter extends PagerAdapter {

  private List<PhotoModel> mPhotoModels;
  private Context mContext;
  private DisplayImageOptions options;

  public PhotoDetailAdapter(Context context, List<PhotoModel> photoModels) {
    this.mPhotoModels = photoModels;
    this.mContext = context;
    initImageLoader();
  }

  private void initImageLoader() {
    //显示图片的配置
    options = new DisplayImageOptions.Builder()
      .cacheInMemory(true)
      .bitmapConfig(Bitmap.Config.RGB_565)
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
  public boolean isViewFromObject(View view, Object object) {
    return view == object;
  }

  @Override
  public Object instantiateItem(ViewGroup container, int position) {
    View view = View.inflate(mContext, Util.getRS("item_photo","layout",mContext), null);
    ZoomImageView mPhotoZoomImageView = (ZoomImageView) view.findViewById(Util.getRS("iv_photo","id",mContext));
    PhotoModel photoModel = mPhotoModels.get(position);

    String path = "file://" + photoModel.getPath();
    ImageLoader.getInstance().displayImage(path, mPhotoZoomImageView, options);

    mPhotoZoomImageView.setOnCustomerClickListener(new ZoomImageView.OnCustomerClickListener() {
      @Override
      public void onClick() {
        ((PhotoDetailActivity) mContext).onPhotoClick();//点击事件传递给PhotoDetailActivity
      }
    });

    container.addView(view);
    return view;
  }

  @Override
  public void destroyItem(ViewGroup container, int position, Object object) {
    container.removeView((View) object);
  }
}
