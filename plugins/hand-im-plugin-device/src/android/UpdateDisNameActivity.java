package com.hand.im;

import android.app.Activity;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import io.rong.imlib.RongIMClient;

/**
 * Created by panx on 2016/8/29.
 */
public class UpdateDisNameActivity extends Activity implements View.OnClickListener{
  private EditText edtDiscussName;
  private TextView btnOK;
  private String targetId;
  private TextView txtBack;
  private ImageView img_clear;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    setContentView(Util.getRS("activity_update_dis_name","layout",this));
    targetId = getIntent().getStringExtra("targetId");
    initView();
  }
  private void initView(){
    img_clear = (ImageView)findViewById(Util.getRS("img_clear","id",this));
    img_clear.setOnClickListener(this);
    txtBack = (TextView)findViewById(Util.getRS("textv_back","id",this));
    txtBack.setOnClickListener(this);
    btnOK = (TextView) findViewById(Util.getRS("btnOK","id",this));
    btnOK.setOnClickListener(this);
    edtDiscussName = (EditText)findViewById(Util.getRS("newDisName","id",this));
    edtDiscussName.addTextChangedListener(new TextWatcher() {
      @Override
      public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
      }
      @Override
      public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
        if(charSequence.length()>0) {
          img_clear.setVisibility(View.VISIBLE);
          btnOK.setVisibility(View.VISIBLE);
        }else{
          img_clear.setVisibility(View.GONE);
          btnOK.setVisibility(View.GONE);
        }
      }
      @Override
      public void afterTextChanged(Editable editable) {
      }
    });
  }

  @Override
  public void onClick(View view) {
    int id = view.getId();
    int idBtnOK = Util.getRS("btnOK","id",this);
    int idTxtBack = Util.getRS("textv_back","id",this);
    int idImgClear = Util.getRS("img_clear","id",this);
    if(idBtnOK == id){
      final String newName = edtDiscussName.getText().toString();
      RongIMClient.getInstance().setDiscussionName(targetId, newName, new RongIMClient.OperationCallback() {
        @Override
        public void onSuccess() {
          DBhelper dBhelper = new DBhelper(getApplicationContext());
          DBhelper.MyConversation mc = dBhelper.getUserInfo(targetId);
          String iconPath = mc.getTargetIconUrl();
          dBhelper.addUserInfo(targetId,newName,iconPath);
          setResult(2);
          finish();
        }

        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {
          Toast.makeText(getApplicationContext(),"讨论组名称修改失败",Toast.LENGTH_SHORT).show();
        }
      });
    }else if(idImgClear==id){
      edtDiscussName.setText("");
      img_clear.setVisibility(View.GONE);
    }else if(idTxtBack == id){
      finish();
    }
  }
}
