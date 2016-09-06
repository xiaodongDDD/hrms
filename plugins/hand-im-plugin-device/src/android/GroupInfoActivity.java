package com.hand.im;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;

import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.GridView;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;


import com.hand.im.bean.UserInfo;
import com.hand.im.contact.ContactActivity;
import com.hand.im.okhttp.OkHttpClientManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Discussion;
import okhttp3.Call;

/**
 * Created by panx on 2016/8/23.
 */
public class GroupInfoActivity extends Activity implements CompoundButton.OnCheckedChangeListener, AdapterView.OnItemClickListener, View.OnClickListener {
  private String targetId;
  private GridView grvGroupInfo;
  private GroupInfoAdapter adapter;
  private Switch switchConvTip;
  private Switch switchConvTop;
  private Button btnQuitDiscussion;
  private ArrayList<UserInfo> data = new ArrayList<UserInfo>();
  private TextView txtGroupNo;
  private TextView txtBack;
  private TextView txtGroupName;
  private Discussion dis;
  private RelativeLayout btnUpdateName;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    setContentView(Util.getRS("activity_group_info", "layout", getApplicationContext()));
    //get the id of the group
    targetId = getIntent().getExtras().getString("targetId");
    initView();
    initData();
  }

  private void initView() {
    btnUpdateName = (RelativeLayout)findViewById(Util.getRS("rltUpdateGroupName","id",getApplicationContext()));
    txtGroupName = (TextView)findViewById(Util.getRS("txtGroupName","id",this));
    txtBack = (TextView)findViewById(Util.getRS("textv_back","id",getApplicationContext()));
    txtGroupNo = (TextView)findViewById(Util.getRS("txtGroupNo","id",getApplicationContext()));
    grvGroupInfo = (GridView) findViewById(Util.getRS("grvGroupInfo", "id", getApplicationContext()));
    switchConvTip = (Switch) findViewById(Util.getRS("switchConvTip", "id", getApplicationContext()));
    switchConvTop = (Switch) findViewById(Util.getRS("switchConvTop", "id", getApplicationContext()));
    btnQuitDiscussion = (Button) findViewById(Util.getRS("btnQuitDiscussion", "id", getApplicationContext()));
    switchConvTop.setOnCheckedChangeListener(this);
    switchConvTip.setOnCheckedChangeListener(this);
    btnQuitDiscussion.setOnClickListener(this);
    btnUpdateName.setOnClickListener(this);
    txtBack.setOnClickListener(this);
    //get status of converstion(Notify or Don't disturb),then set the status of switchConvTip
    RongIMClient.getInstance().getConversationNotificationStatus(Conversation.ConversationType.DISCUSSION, targetId,
      new RongIMClient.ResultCallback<Conversation.ConversationNotificationStatus>() {
        @Override
        public void onSuccess(Conversation.ConversationNotificationStatus conversationNotificationStatus) {
          if (conversationNotificationStatus.equals(Conversation.ConversationNotificationStatus.DO_NOT_DISTURB)) {
            switchConvTip.setChecked(true);
          } else {
            switchConvTip.setChecked(false);
          }
        }

        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {

        }
      });
    //get isTop of conversation,then set the status of switchConvTop
    RongIMClient.getInstance().getConversation(Conversation.ConversationType.DISCUSSION, targetId,
      new RongIMClient.ResultCallback<Conversation>() {
        @Override
        public void onSuccess(Conversation conversation) {
          switchConvTop.setChecked(conversation.isTop());
        }

        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {

        }
      });
    grvGroupInfo.setOnItemClickListener(this);
  }

  private void initData() {
    RongIMClient.getInstance().getDiscussion(targetId, new RongIMClient.ResultCallback<Discussion>() {
      @Override
      public void onSuccess(Discussion discussion) {
        Log.e("MemeberList Size", "--success--" + discussion.getMemberIdList().size());
        //refreshView(discussion.getMemberIdList().size());
        txtGroupName.setText(discussion.getName());
        data = getData(discussion);
        adapter = new GroupInfoAdapter(getApplicationContext(), data, discussion.getCreatorId());
        grvGroupInfo.setAdapter(adapter);
      //  dis=discussion;
        dealData();

      }

      @Override
      public void onError(RongIMClient.ErrorCode errorCode) {
        Log.e("MemeberList", "--error--" + errorCode);
      }
    });
  }
  private void dealData() {

    String url = LoginInfo.baseUrl+"/hrmsv2/v2/api/staff/detail?" + "access_token=" + LoginInfo.access_token;
    for(int i=0;i<data.size()-2;i++){
      JSONObject object = new JSONObject();
      try {
        object.put("key",data.get(i).getEmp_name());
      } catch (JSONException e) {
        e.printStackTrace();
      }
      OkHttpClientManager.postAsyn(url, object, new OkHttpClientManager.ResultCallback<String>() {
        @Override
        public void onError(Call call, Exception e) {
        }
        @Override
        public void onResponse(String response) {
          dealDataList(response);
        }
      });
    }
  }
  private int n=0;
  private void dealDataList(String str){
    JSONObject object = null;
    try {
      object = new JSONObject(str);
      JSONArray array = new JSONArray(object.getString("rows"));
      JSONObject object1 = new JSONObject(array.get(0).toString());

      for (int i = 0; i < data.size() - 2; i++) {
        if (data.get(i).getEmp_name().equals(object1.getString("emp_code"))) {
          data.get(i).setEmp_name(object1.getString("emp_name"));
          data.get(i).setEmp_code(object1.getString("emp_code"));
          data.get(i).setAvatar(object1.getString("avatar"));
          n++;
          if(n%5==0){
            adapter.notifyDataSetChanged();
          }
          if(n==data.size()-2){
            adapter.notifyDataSetChanged();
          }
          break;
        }
      }

    } catch (JSONException e) {
      e.printStackTrace();
    }
  }
  private ArrayList<UserInfo> getData(Discussion discussion) {
    data.clear();
    for (int i = 0; i < discussion.getMemberIdList().size(); i++) {
      UserInfo userInfo = new UserInfo();
      userInfo.setEmp_name(discussion.getMemberIdList().get(i));
      data.add(userInfo);
    }
    txtGroupNo.setText(data.size()+"人");
    data.add(new UserInfo());
    data.add(new UserInfo());

    return data;
  }

  private void refreshView(int i) {
    Toast.makeText(this, String.valueOf(i), Toast.LENGTH_SHORT).show();
  }

  @Override
  public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
    int id = compoundButton.getId();
    int idSwitchConvTip = Util.getRS("switchConvTip", "id", getApplicationContext());
    int idSwitchConvTop = Util.getRS("switchConvTop", "id", getApplicationContext());
    if (id == idSwitchConvTip) {
      Conversation.ConversationNotificationStatus status;
      if (b) {
        status = Conversation.ConversationNotificationStatus.DO_NOT_DISTURB;
      } else {
        status = Conversation.ConversationNotificationStatus.NOTIFY;
      }
      RongIMClient.getInstance().setConversationNotificationStatus(Conversation.ConversationType.DISCUSSION, targetId,
        status, new RongIMClient.ResultCallback<Conversation.ConversationNotificationStatus>() {
          @Override
          public void onSuccess(Conversation.ConversationNotificationStatus conversationNotificationStatus) {
            Log.e("Notification success", conversationNotificationStatus.toString());
          }

          @Override
          public void onError(RongIMClient.ErrorCode errorCode) {
            Log.e("Notification error", errorCode.toString());
          }
        });
    } else if (id == idSwitchConvTop) {
      RongIMClient.getInstance().setConversationToTop(Conversation.ConversationType.DISCUSSION, targetId, b, new RongIMClient.ResultCallback<Boolean>() {
        @Override
        public void onSuccess(Boolean aBoolean) {
          Log.e("success to Top", aBoolean + "");
        }

        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {
          Log.e("error to Top", errorCode + "");
        }
      });
    }
  }

  @Override
  public void onClick(View view) {
    int id = view.getId();
    int idQuitDiscussion = Util.getRS("btnQuitDiscussion", "id", getApplicationContext());
    int idBack = Util.getRS("textv_back","id",getApplicationContext());
    int idBtnUpdateName = Util.getRS("rltUpdateGroupName","id",getApplicationContext());
    if (id == idQuitDiscussion) {
      RongIMClient.getInstance().quitDiscussion(targetId, new RongIMClient.OperationCallback() {
        @Override
        public void onSuccess() {
          setResult(0, null);
          finish();
        }
        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {
          Log.e("Quit discussion", errorCode + "");
        }
      });
    }else if(id == idBack){
      finish();
    }else if(id == idBtnUpdateName){
      Toast.makeText(this,"123",Toast.LENGTH_SHORT).show();
      Intent intent = new Intent(GroupInfoActivity.this,UpdateDisNameActivity.class);
      intent.putExtra("targetId",targetId);
      startActivityForResult(intent,0);
    }
  }


  @Override
  public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
    //add the member of discussion
    if (i == data.size() - 2) {
      Intent intent = new Intent(GroupInfoActivity.this, ContactActivity.class);
      intent.putExtra("targetId", targetId);
      //startActivity(intent);
      startActivityForResult(intent, 0);
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data2) {
    super.onActivityResult(requestCode, resultCode, data2);
    if (requestCode == 0 && resultCode == 1) {
      //finish();
      RongIMClient.getInstance().getDiscussion(targetId, new RongIMClient.ResultCallback<Discussion>() {
        @Override
        public void onSuccess(Discussion discussion) {
          Log.e("MemeberList Size", "--success--" + discussion.getMemberIdList().size());
          data = getData(discussion);
          adapter.notifyDataSetChanged();

          dealData();
        }

        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {
          Log.e("MemeberList", "--error--" + errorCode);
        }
      });
    }else if(requestCode == 0 && resultCode ==2){
      RongIMClient.getInstance().getDiscussion(targetId, new RongIMClient.ResultCallback<Discussion>() {
        @Override
        public void onSuccess(Discussion discussion) {
          String name = discussion.getName();
          txtGroupName.setText(name);
        }

        @Override
        public void onError(RongIMClient.ErrorCode errorCode) {

        }
      });
    }
  }
}
