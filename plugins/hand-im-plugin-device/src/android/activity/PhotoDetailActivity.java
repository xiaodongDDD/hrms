package com.hand.im.activity;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Parcelable;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.hand.im.Util;
import com.hand.im.adapter.PhotoDetailAdapter;
import com.hand.im.model.PhotoModel;
import com.hand.im.widget.CommonToast;
import com.hand.im.widget.SelectView;

import java.util.ArrayList;
import java.util.List;

public class PhotoDetailActivity extends BaseActivity implements View.OnClickListener, ViewPager.OnPageChangeListener, SelectView.OnOnStateChangeListener {

  private int mCurrentPosition;
  private ViewPager mPhotoViewPager;
  private LinearLayout mBackLinearLayout;
  private TextView mCurrentPositionTextView;
  private RelativeLayout mFootContainer;
  private RelativeLayout mHeadContainer;
  private Button mSendButton;
  private boolean isContainerShow = true;//容器是否显示
  private SelectView mPointSelectView;

  private List<String> mSelectPaths;//已经选择好了的相片
  private List<String> mPths = new ArrayList<String>();//所有照片的path
  private List<PhotoModel> mPhotoModels;
  private List<PhotoModel> mPreviewPhotoModels;
  private String mAlbumName;//相册名字
  private String action;

  @Override
  public int getLayoutId() {
    return Util.getRS("activity_photo_detail","layout",this);
  }

  @Override
  protected void initData() {
    Intent intent = getIntent();
    action = intent.getStringExtra("action");
    if("action_itemClick".equals(action)){

    }else if("action_preview".equals(action)){
      mPreviewPhotoModels = intent.getParcelableArrayListExtra("previewPhotoModels");
    }
    mSelectPaths = intent.getStringArrayListExtra("selectPaths");
    mPhotoModels = intent.getParcelableArrayListExtra("photoModels");
    mCurrentPosition = intent.getIntExtra("currentPosition", 0);
    mAlbumName = intent.getStringExtra("albumName");
    for (PhotoModel photoModel : mPhotoModels) {
      mPths.add(photoModel.getPath());
    }
  }

  @Override
  protected void intView() {
    mPhotoViewPager = (ViewPager) findViewById(Util.getRS("vp_photo","id",this));
    mHeadContainer = (RelativeLayout) findViewById(Util.getRS("rl_head_container","id",this));
    mBackLinearLayout = (LinearLayout) findViewById(Util.getRS("ll_back","id",this));
    mCurrentPositionTextView = (TextView) findViewById(Util.getRS("tv_current_position","id",this));
    mFootContainer = (RelativeLayout) findViewById(Util.getRS("rl_foot_container","id",this));
    mSendButton = (Button) findViewById(Util.getRS("bt_send","id",this));
    mPointSelectView = (SelectView) findViewById(Util.getRS("sv_point","id",this));

    PhotoDetailAdapter photoDetailAdapter = new PhotoDetailAdapter(this, mPhotoModels);
    mPhotoViewPager.setAdapter(photoDetailAdapter);
    mPhotoViewPager.setCurrentItem(mCurrentPosition);

    //初始化话顶部标题
    mCurrentPositionTextView.setText(mCurrentPosition + 1 + "/" + mPhotoModels.size());
    //初始化数字选择view
    updateSelectStates(mPhotoModels.get(mCurrentPosition).getPath());
    //初始化发送按钮文本显示
    upDateSendButtonText();
  }

  @Override
  protected void initListeners() {
    mPhotoViewPager.setOnPageChangeListener(this);
    mBackLinearLayout.setOnClickListener(this);
    mSendButton.setOnClickListener(this);
    mPointSelectView.setOnStateChangeListener(this);
  }

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////// event handler/////////////////////////////////////
  @Override
  public void onClick(View v) {
    int id = v.getId();
    int ll_back = Util.getRS("ll_back","id",this);
    int bt_send = Util.getRS("bt_send","id",this);
    if(id == ll_back){
      if("action_preview".equals(action)){
        mPhotoModels = mPreviewPhotoModels;
      }
      Intent intent = new Intent(this, PhotoWalkActivity.class);
      intent.putExtra("action", "action_detail");
      intent.putExtra("albumName", mAlbumName);
      intent.putStringArrayListExtra("selectPaths", (ArrayList<String>) mSelectPaths);
      intent.putParcelableArrayListExtra("photoModels", (ArrayList<? extends Parcelable>) mPhotoModels);
      startActivity(intent);
      finish();

      overridePendingTransition(Util.getRS("activity_left_in","anim",this), Util.getRS("activity_left_out","anim",this));
    }else if(id == bt_send){
      if(mSelectPaths.size() <=0){
        mSelectPaths.add(mPths.get(mCurrentPosition));
      }
      Intent data = new Intent("com.hand.action.receiver.photo");
      data.putStringArrayListExtra("paths", (ArrayList<String>) mSelectPaths);
      sendBroadcast(data);
      finish();
      overridePendingTransition(Util.getRS("activity_bottom_alpha_in","anim",this), Util.getRS("activity_bottom_out","anim",this));
    }
  }

  @Override
  public void onBackPressed() {
    if("action_preview".equals(action)){
      mPhotoModels = mPreviewPhotoModels;
    }
    Intent intent = new Intent(this, PhotoWalkActivity.class);
    intent.putExtra("action", "action_detail");
    intent.putExtra("albumName", mAlbumName);
    intent.putStringArrayListExtra("selectPaths", (ArrayList<String>) mSelectPaths);
    intent.putParcelableArrayListExtra("photoModels", (ArrayList<? extends Parcelable>) mPhotoModels);
    startActivity(intent);
    overridePendingTransition(Util.getRS("activity_left_in","anim",this), Util.getRS("activity_left_out","anim",this));
    super.onBackPressed();
  }

  /**
   * SelectView点击事件
   *
   * @param isSelected
   */
  @Override
  public void onClick(boolean isSelected) {

    String path = mPths.get(mCurrentPosition);
    PhotoModel photoModel = mPhotoModels.get(mCurrentPosition);
    if (isSelected) {//选择上
      if(mSelectPaths.size() >=6){
        CommonToast toast = CommonToast.getInstance();
        toast.showToast(this,"最多选只能选取6张照片");
        mPointSelectView.setViewText("",false);
        return;
      }
      mSelectPaths.add(path);
      photoModel.setSelected(true);
      udatePreviewModels(path, action, true);
    } else {
      mSelectPaths.remove(path);
      photoModel.setSelected(false);
      udatePreviewModels(path, action, false);
    }
    updateSelectStates(path);
    upDateSendButtonText();
  }


  /**
   * 相片点击事件
   */
  public void onPhotoClick() {
    if (isContainerShow) {
      hideContainer();
    } else {
      showContainer();
    }
    isContainerShow = !isContainerShow;
  }

  @Override
  public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

  }

  @Override
  public void onPageSelected(int position) {
    mCurrentPosition = position;
    mCurrentPositionTextView.setText(mCurrentPosition + 1 + "/" + mPhotoModels.size());

    String path = mPths.get(position);
    updateSelectStates(path);
  }

  @Override
  public void onPageScrollStateChanged(int state) {

  }

  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  /////////////////////////自己的方法//////////////////////////////////////////

  /**
   * 更新选择状态
   * @param path
   * @param action
   * @param selected
   */
  private void udatePreviewModels(String path, String action, boolean selected) {
    if ("action_preview".equals(action)) {
      for (PhotoModel photoModel1 : mPreviewPhotoModels) {
        if (photoModel1.getPath().equals(path)) {
          photoModel1.setSelected(selected);
        }
      }
    }
  }
  /**
   * 初始化发送按钮文本显示
   */
  private void upDateSendButtonText() {
    if(mSelectPaths.size() > 0){
      mSendButton.setText("发送(" + mSelectPaths.size() + "/6)");
    }else {
      mSendButton.setText("发送");
    }
  }

  /**
   * 更新SelectView的选择状态
   * @param path
     */
  private void updateSelectStates(String path) {
    int index = mSelectPaths.indexOf(path);
    if (index != -1) {
      mPointSelectView.setViewText(index + 1 + "", false);
    } else {
      mPointSelectView.setViewText("", false);
    }
  }

  /**
   * 隐藏容器
   */
  private void hideContainer() {
    int headContainerHeight = mHeadContainer.getHeight();
    int footConatinerHeight = mFootContainer.getHeight();
    ObjectAnimator headAnimator = ObjectAnimator.ofFloat(mHeadContainer, "translationY", mHeadContainer.getTranslationY() - headContainerHeight);
    headAnimator.start();
    ObjectAnimator footAnimator = ObjectAnimator.ofFloat(mFootContainer, "translationY", mFootContainer.getTranslationY() + footConatinerHeight);
    footAnimator.start();
  }

  /**
   * 显示容器
   */
  private void showContainer() {
    int headContainerHeight = mHeadContainer.getHeight();
    int footConatinerHeight = mFootContainer.getHeight();
    ObjectAnimator headAnimator = ObjectAnimator.ofFloat(mHeadContainer, "translationY", mHeadContainer.getTranslationY() + headContainerHeight);
    headAnimator.start();
    ObjectAnimator footAnimator = ObjectAnimator.ofFloat(mFootContainer, "translationY", mFootContainer.getTranslationY() - footConatinerHeight);
    footAnimator.start();
  }
  ////////////////////////////////////////////////////////////////////////////
}
