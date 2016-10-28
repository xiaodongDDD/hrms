package com.hand.im.activity;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Parcelable;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.hand.im.Util;
import com.hand.im.adapter.PhotoWalkAdapter;
import com.hand.im.model.PhotoModel;

import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class PhotoWalkActivity extends BaseActivity implements View.OnClickListener, AdapterView.OnItemClickListener {

  private List<PhotoModel> mPhotoModels = new ArrayList<PhotoModel>();
  private String mFolderPath;//某个相册

  private Button mBackButton;
  private TextView mTitleTextView;
  private Button mCancelButton;
  private GridView mPhotoGridView;
  private Button mSendButton;
  private String action;
  private PhotoWalkAdapter mPhotoWalkAdapter;
  private List<String> mSelectPaths = new ArrayList<String>();//已经选择好了的相片
  private String albumName = "";//相册名字
  private TextView mPreviewTextView;


  @Override
  public int getLayoutId() {
    return Util.getRS("activity_photo_walk","layout",this);
  }

  @Override
  protected void initData() {
    Intent intent = getIntent();
    action = intent.getStringExtra("action");
    if ("action_latest".equals(action)) {//最近100张照片
      List<String> latestImages = intent.getStringArrayListExtra("latestImages");
      for (String path : latestImages) {
        mPhotoModels.add(new PhotoModel(path));
      }
    } else if ("action_album".equals(action)) {//某个相册
      mFolderPath = intent.getStringExtra("folderPath");
      mPhotoModels.addAll(getAllImagePathsByFolder(mFolderPath));
    } else if ("action_detail".equals(action)) {//从照片详细页返回
      albumName = intent.getStringExtra("albumName");
      mPhotoModels = intent.getParcelableArrayListExtra("photoModels");
      mSelectPaths = intent.getStringArrayListExtra("selectPaths");
    }
  }

  @Override
  protected void intView() {
    immerseStatusBar();//设置状态栏沉浸
    mBackButton = (Button) findViewById(Util.getRS("bt_back","id",this));
    mTitleTextView = (TextView) findViewById(Util.getRS("tv_title","id",this));
    mCancelButton = (Button) findViewById(Util.getRS("bt_cancel","id",this));
    mPhotoGridView = (GridView) findViewById(Util.getRS("gv_photo","id",this));
    mSendButton = (Button) findViewById(Util.getRS("bt_send","id",this));
    mPreviewTextView = (TextView) findViewById(Util.getRS("tv_preview","id",this));

    mPreviewTextView.setClickable(false);

    //设置标题
    if ("action_latest".equals(action)) {
      albumName = "最近照片";
    } else if ("action_album".equals(action)) {
      albumName = getPathNameToShow(mFolderPath);
    }
    mTitleTextView.setText(albumName);
    mPhotoWalkAdapter = new PhotoWalkAdapter(this, mPhotoModels, mSelectPaths);
    mPhotoGridView.setAdapter(mPhotoWalkAdapter);
    //更新发送按钮的文本和状态
    updateSendButtonState();
    //更新预览选择状态
    updatePreviewTextViewState();
  }

  @Override
  protected void initListeners() {
    mBackButton.setOnClickListener(this);
    mCancelButton.setOnClickListener(this);
    mSendButton.setOnClickListener(this);
    mPhotoGridView.setOnItemClickListener(this);
    mPreviewTextView.setOnClickListener(this);
  }

  ////////////////////////////////////////////////////////////////////////////
  /////////////////////////event handler//////////////////////////////////////
  @Override
  public void onClick(View v) {
    int id = v.getId();
    int bt_back = Util.getRS("bt_back","id",this);//返回相册
    int bt_cancel = Util.getRS("bt_cancel","id",this);///取消
    int bt_send = Util.getRS("bt_send","id",this);//发送
    int tv_preview = Util.getRS("tv_preview","id",this);//预览

    if(id == bt_back){//返回相册
      Intent intent = new Intent(this, PhotoAlbumActivity.class);
      startActivity(intent);
      finish();
      overridePendingTransition(Util.getRS("activity_left_in","anim",this), Util.getRS("activity_left_out","anim",this));
    }else if(id == bt_cancel){//取消
      finish();
      overridePendingTransition(Util.getRS("activity_bottom_alpha_in","anim",this), Util.getRS("activity_bottom_out","anim",this));
    }else if(id == bt_send){//发送
      Intent data = new Intent("com.hand.action.receiver.photo");
      data.putStringArrayListExtra("paths", (ArrayList<String>) mSelectPaths);
      sendBroadcast(data);
      finish();
      overridePendingTransition(Util.getRS("activity_bottom_alpha_in","anim",this), Util.getRS("activity_bottom_out","anim",this));
    }else if(id == tv_preview){
      if(mSelectPaths.size() <=0){
        return;
      }
      List<PhotoModel> previewPhotoModels = new ArrayList<PhotoModel>();
      for(String path : mSelectPaths){
        previewPhotoModels.add(new PhotoModel(path));
      }
      Intent previewIntent = new Intent(this, PhotoDetailActivity.class);
      previewIntent.putExtra("action","action_preview");
      previewIntent.putExtra("albumName", albumName);
      previewIntent.putStringArrayListExtra("selectPaths", (ArrayList<String>) mSelectPaths);
      previewIntent.putParcelableArrayListExtra("photoModels", (ArrayList<? extends Parcelable>) previewPhotoModels);
      previewIntent.putParcelableArrayListExtra("previewPhotoModels", (ArrayList<? extends Parcelable>) mPhotoModels);
      previewIntent.putExtra("currentPosition", mSelectPaths.size()-1);
      startActivityForResult(previewIntent, 100);
      finish();
      overridePendingTransition(Util.getRS("activity_right_in","anim",this), Util.getRS("activity_right_out","anim",this));
    }
  }


  @Override
  public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
    Intent intent = new Intent(this, PhotoDetailActivity.class);
    intent.putExtra("action","action_itemClick");
    intent.putExtra("albumName", albumName);
    intent.putStringArrayListExtra("selectPaths", (ArrayList<String>) mSelectPaths);
    intent.putParcelableArrayListExtra("photoModels", (ArrayList<? extends Parcelable>) mPhotoModels);
    intent.putExtra("currentPosition", position);
    startActivityForResult(intent, 100);
    finish();
    overridePendingTransition(Util.getRS("activity_right_in","anim",this), Util.getRS("activity_right_out","anim",this));
  }
  ////////////////////////////////////////////////////////////////////////////

  @Override
  public void onBackPressed() {
    Intent intent = new Intent(this, PhotoAlbumActivity.class);
    startActivity(intent);
    super.onBackPressed();
    overridePendingTransition(Util.getRS("activity_left_in","anim",this), Util.getRS("activity_left_out","anim",this));
  }


  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////// 自己的方法 //////////////////////////////////////

  /**
   * 更新相片选择的数量
   *
   * @param selectPaths
   */
  public void updatePhotoSelectCount(List<String> selectPaths) {
    this.mSelectPaths = selectPaths;
    updateSendButtonState();//更新发送按钮的文本和状态
    updatePreviewTextViewState();//更新预览选择状态
  }

  /**
   * 更新预览选择状态
   */
  private void updatePreviewTextViewState() {
    if(mSelectPaths.size()>0){
      mPreviewTextView.setClickable(true);
      mPreviewTextView.setTextColor(getResources().getColor(Util.getRS("text_select","color",this)));
    }else {
      mPreviewTextView.setClickable(false);
      mPreviewTextView.setTextColor(Color.parseColor("#DDDEE2"));
    }
  }

  /**
   * 更新发送按钮的文本和状态
   */
  private void updateSendButtonState() {
    if (mSelectPaths.size() > 0) {
      mSendButton.setText("发送(" + mSelectPaths.size() + "/6)");
      mSendButton.setBackgroundResource(Util.getRS("bt_send_selector","drawable",this));
      mSendButton.setEnabled(true);
    } else {
      mSendButton.setText("发送");
      mSendButton.setBackgroundResource(Util.getRS("bt_send_press","drawable",this));
      mSendButton.setEnabled(false);
    }
  }

  /**
   * 获取指定路径下的所有图片文件。
   */
  private ArrayList<PhotoModel> getAllImagePathsByFolder(String folderPath) {
    File folder = new File(folderPath);
    String[] allFileNames = folder.list();
    if (allFileNames == null || allFileNames.length == 0) {
      return null;
    }

    ArrayList<PhotoModel> imageFilePaths = new ArrayList<PhotoModel>();
    for (int i = allFileNames.length - 1; i >= 0; i--) {
      if (isImage(allFileNames[i])) {
        imageFilePaths.add(new PhotoModel(folderPath + File.separator + allFileNames[i]));
      }
    }

    return imageFilePaths;
  }

  /**
   * 根据完整路径，获取最后一级路径
   */
  private String getPathNameToShow(String absolutePath) {
    int lastSeparator = absolutePath.lastIndexOf(File.separator);
    return absolutePath.substring(lastSeparator + 1);
  }

  /**
   * 判断该文件是否是一个图片。
   */
  private boolean isImage(String fileName) {
    return fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png");
  }

  ////////////////////////////////////////////////////////////////////////////
}
