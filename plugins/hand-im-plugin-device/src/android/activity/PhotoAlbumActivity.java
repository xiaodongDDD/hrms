package com.hand.im.activity;

import android.content.AsyncQueryHandler;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ListView;

import com.hand.im.Util;
import com.hand.im.adapter.PhotoAlbumLvAdapter;
import com.hand.im.model.PhotoAlbumLVItem;

import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class PhotoAlbumActivity extends BaseActivity implements AdapterView.OnItemClickListener, View.OnClickListener {
  private List<String> latestImages = new ArrayList<String>();
  private ArrayList<PhotoAlbumLVItem> mPhotoAlbumLVItems = new ArrayList<PhotoAlbumLVItem>();
  private ListView mAlbulmListView;
  private PhotoAlbumLvAdapter photoAlbumLvAdapter;
  private Button mCancelButton;

  @Override
  public int getLayoutId() {
    return Util.getRS("activity_photo_album", "layout", this);
  }

  @Override
  protected void initData() {
    getLatestImage();
    mPhotoAlbumLVItems.addAll(getImagePathsByContentProvider());
  }

  @Override
  protected void intView() {
    immerseStatusBar();//状态栏沉浸
    mAlbulmListView = (ListView) findViewById(Util.getRS("lv_albulm", "id", this));
    mCancelButton = (Button) findViewById(Util.getRS("bt_cancel", "id", this));

    photoAlbumLvAdapter = new PhotoAlbumLvAdapter(this, mPhotoAlbumLVItems);
    mAlbulmListView.setAdapter(photoAlbumLvAdapter);
  }

  @Override
  protected void initListeners() {
    mAlbulmListView.setOnItemClickListener(this);
    mCancelButton.setOnClickListener(this);
  }

  ////////////////////////////////////////////////////////////////////////////
  /////////////////////////event handler//////////////////////////////////////
  @Override
  public void onClick(View v) {
    int bt_cancel = Util.getRS("bt_cancel", "id", this);
    if (v.getId() == bt_cancel) {
      finish();
      overridePendingTransition(Util.getRS("activity_bottom_alpha_in","anim",this), Util.getRS("activity_bottom_out","anim",this));
    }
  }

  @Override
  public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
    Intent intent = new Intent(this, PhotoWalkActivity.class);
    if (position == 0) {//最近100张照片
      intent.putExtra("action", "action_latest");
      intent.putStringArrayListExtra("latestImages", (ArrayList<String>) latestImages);
    } else {
      intent.putExtra("action", "action_album");
      intent.putExtra("folderPath", mPhotoAlbumLVItems.get(position).getPathName());
    }
    startActivity(intent);
    finish();
    overridePendingTransition(Util.getRS("activity_right_in","anim",this), Util.getRS("activity_right_out","anim",this));
  }
  ////////////////////////////////////////////////////////////////////////////

  @Override
  public void onBackPressed() {
    super.onBackPressed();
    overridePendingTransition(Util.getRS("activity_bottom_alpha_in","anim",this), Util.getRS("activity_bottom_out","anim",this));
  }


  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////// 自己的方法// //////////////////////////////////////

  /**
   * 使用ContentProvider读取SD卡所有图片。
   */
  private ArrayList<PhotoAlbumLVItem> getImagePathsByContentProvider() {
    Uri mImageUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

    String key_MIME_TYPE = MediaStore.Images.Media.MIME_TYPE;
    String key_DATA = MediaStore.Images.Media.DATA;

    ContentResolver mContentResolver = getContentResolver();

    // 只查询jpg和png的图片
    Cursor cursor = mContentResolver.query(mImageUri, new String[]{key_DATA},
      key_MIME_TYPE + "=? or " + key_MIME_TYPE + "=? or " + key_MIME_TYPE + "=?",
      new String[]{"image/jpg", "image/jpeg", "image/png"},
      MediaStore.Images.Media.DATE_MODIFIED);

    ArrayList<PhotoAlbumLVItem> list = null;
    if (cursor != null) {
      if (cursor.moveToLast()) {
        //路径缓存，防止多次扫描同一目录
        HashSet<String> cachePath = new HashSet<String>();
        list = new ArrayList<PhotoAlbumLVItem>();

        while (true) {
          // 获取图片的路径
          String imagePath = cursor.getString(0);

          File parentFile = new File(imagePath).getParentFile();
          String parentPath = parentFile.getAbsolutePath();

          //不扫描重复路径
          if (!cachePath.contains(parentPath)) {
            list.add(new PhotoAlbumLVItem(parentPath, getImageCount(parentFile),
              getFirstImagePath(parentFile)));
            cachePath.add(parentPath);
          }

          if (!cursor.moveToPrevious()) {
            break;
          }
        }
      }

      cursor.close();
    }

    return list;
  }

  /**
   * 获取目录中图片的个数。
   */
  private int getImageCount(File folder) {
    int count = 0;
    File[] files = folder.listFiles();
    for (File file : files) {
      if (isImage(file.getName())) {
        count++;
      }
    }

    return count;
  }

  /**
   * 获取目录中最新的一张图片的绝对路径。
   */
  private String getFirstImagePath(File folder) {
    File[] files = folder.listFiles();
    for (int i = files.length - 1; i >= 0; i--) {
      File file = files[i];
      if (isImage(file.getName())) {
        return file.getAbsolutePath();
      }
    }

    return null;
  }

  /**
   * 判断该文件是否是一个图片。
   */
  private boolean isImage(String fileName) {
    return fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png");
  }

  /**
   * 获取最近图片
   */
  private void getLatestImage() {
    AsyncQueryHandler asyncQueryHandler = new AsyncQueryHandler(getContentResolver()) {
      @Override
      protected void onQueryComplete(int token, Object cookie, Cursor cursor) {
        parseCursor(cursor);//解析Cursor
      }
    };
    int token = 0;
    Object cookie = null;
    Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
    String[] projection = new String[]{MediaStore.Images.Media.DATA, MediaStore.Images.Media.DISPLAY_NAME};
    String selection = null;
    String[] selectionArgs = null;
    String orderBy = MediaStore.Images.Media.DATE_ADDED + " DESC limit 100";
    asyncQueryHandler.startQuery(token, cookie, uri, projection, selection, selectionArgs, orderBy);
  }

  /**
   * 将cursor解析成AlbumModel
   *
   * @param cursor
   */
  private void parseCursor(Cursor cursor) {
    if (cursor.moveToFirst()) {
      do {
        String path = cursor.getString(0);
        latestImages.add(path);

      } while (cursor.moveToNext());
    }
    cursor.close();
    mPhotoAlbumLVItems.add(0, new PhotoAlbumLVItem("最近照片", latestImages.size(), latestImages.get(0)));
    photoAlbumLvAdapter.notifyDataSetChanged();
  }
  ////////////////////////////////////////////////////////////////////////////

}
