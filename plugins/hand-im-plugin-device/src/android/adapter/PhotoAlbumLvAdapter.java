package com.hand.im.adapter;

import android.content.Context;
import android.graphics.Bitmap;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.hand.im.Util;
import com.hand.im.model.PhotoAlbumLVItem;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;

import java.io.File;
import java.util.ArrayList;

/**
 * Created by cool on 2016/10/10.
 */

public class PhotoAlbumLvAdapter extends BaseAdapter {

    private Context mContext;
    private ArrayList<PhotoAlbumLVItem> mPhotoAlbumLVItems;
    private DisplayImageOptions options;

    public PhotoAlbumLvAdapter(Context context, ArrayList<PhotoAlbumLVItem> mPhotoAlbumLVItems) {
        this.mContext = context;
        this.mPhotoAlbumLVItems = mPhotoAlbumLVItems;
        initImageLoader();
    }

    private void initImageLoader() {
        //显示图片的配置
        options = new DisplayImageOptions.Builder()
                .cacheInMemory(true)
                .cacheOnDisk(true)
                .bitmapConfig(Bitmap.Config.RGB_565)
                .build();
    }

    @Override
    public int getCount() {
        if(mPhotoAlbumLVItems != null && mPhotoAlbumLVItems.size() >0){
            return mPhotoAlbumLVItems.size();
        }
        return 0;
    }

    @Override
    public Object getItem(int position) {
        return mPhotoAlbumLVItems.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder;
        if(convertView == null){
            viewHolder = new ViewHolder();
            convertView = View.inflate(mContext, Util.getRS("item_photo_album_lv","layout",mContext),null);
            viewHolder.mFirstImageView = (ImageView) convertView.findViewById(Util.getRS("iv_first","id",mContext));
            viewHolder.mPhotoCountTextView = (TextView) convertView.findViewById(Util.getRS("tv_photo_count","id",mContext));
            convertView.setTag(viewHolder);
        }else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        PhotoAlbumLVItem photoAlbumLVItem = mPhotoAlbumLVItems.get(position);
        String path = "file://" + photoAlbumLVItem.getFirstImagePath();
        ImageLoader.getInstance().displayImage(path, viewHolder.mFirstImageView, options);

        //设置文字
        viewHolder.mPhotoCountTextView.setText(getPathNameToShow(photoAlbumLVItem));

        return convertView;
    }

    static class ViewHolder{
        ImageView mFirstImageView;
        TextView mPhotoCountTextView;
    }

    /**根据完整路径，获取最后一级路径，并拼上文件数用以显示。*/
    private String getPathNameToShow(PhotoAlbumLVItem item) {
        String absolutePath = item.getPathName();
        int lastSeparator = absolutePath.lastIndexOf(File.separator);
        return absolutePath.substring(lastSeparator + 1) + "(" + item.getFileCount() + ")";
    }
}
