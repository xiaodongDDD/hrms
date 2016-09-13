package com.hand.im.activity;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.os.Message;
import android.os.Parcelable;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.adapter.CallSelectAdapter;
import com.hand.im.model.CallMemberModel;
import com.hand.im.model.NameModel;
import com.hand.im.model.RequestModel;
import com.hand.im.widget.SmoothCheckBox;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import io.rong.calllib.RongCallClient;
import io.rong.calllib.RongCallCommon;
import io.rong.calllib.RongCallSession;
import io.rong.imlib.model.Conversation;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by cool on 2016/9/6.
 */
public class CallSelectActivity extends BaseActivity implements View.OnClickListener {

    private final static String ACTION_CALLSELECT = "callSelect";//直接选择
    private final static String ACTION_INVITE = "callInvite";//用户邀请

    private ListView mListListView;
    private TextView mBackTextView;
    private TextView mComplishTextView;

    private String callerUserId;//呼叫方的userId
    private String targetId;//群组语音的id
    private List<String> joinIds = new ArrayList<String>();//参加群组聊天人的id
    List<CallMemberModel> mCallMemberModels = new ArrayList<CallMemberModel>();
    private CallSelectAdapter mCallSelectAdapter;

    private List<String> onLineIds;//正在通话的usierId
    private String selfUserId;
    private String action;
    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            if(msg.what == 0){
                CallMemberModel callMemberModel = (CallMemberModel) msg.obj;
                mCallMemberModels.add(callMemberModel);
                mCallSelectAdapter.notifyDataSetChanged();
            }else if(msg.what == 1){
                showToast("连接服务器失败，请稍后再试...");
            }
        }
    };

    @Override
    public int getLayoutId() {

        return Util.getRS("activity_call_select","layout",this);
    }

    @Override
    protected void initData() {
        Intent intent = getIntent();
        action = intent.getStringExtra("action");
        if (ACTION_CALLSELECT.equals(action)) {//直接选择
            callerUserId = intent.getStringExtra("callerUserId");
            targetId = intent.getStringExtra("targetId");
            joinIds = intent.getStringArrayListExtra("joinIds");
        } else if (ACTION_INVITE.equals(action)) {//用户邀请
            joinIds = intent.getStringArrayListExtra("memberIdList");
            callerUserId = intent.getStringExtra("callerUserId");
            selfUserId = intent.getStringExtra("selfUserId");
            onLineIds = intent.getStringArrayListExtra("onLineIds");
            onLineIds.add(selfUserId);
        }
        if (joinIds.size() > 0) {
            for (int i = 0; i < joinIds.size(); i++) {
//                Log.e("399", "已经在通话列表id: " + joinIds.get(i));
                getDataFromSever(joinIds.get(i));
            }
        }
    }

    @Override
    protected void intView() {
        mListListView = (ListView) findViewById(Util.getRS("lv_list","id",this));
        mBackTextView = (TextView) findViewById(Util.getRS("tv_back","id",this));
        mComplishTextView = (TextView) findViewById(Util.getRS("tv_complish","id",this));

        mCallSelectAdapter = new CallSelectAdapter(this, mCallMemberModels, callerUserId, onLineIds, action);
        mListListView.setAdapter(mCallSelectAdapter);
    }

    @Override
    protected void initListeners() {
        mBackTextView.setOnClickListener(this);
        mComplishTextView.setOnClickListener(this);

        mListListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                CallMemberModel callMemberModel = (CallMemberModel) parent.getAdapter().getItem(position);
                if (callerUserId.equals(callMemberModel.getEmp_code())) {
                    return;
                }
                if (ACTION_INVITE.equals(action)) {
                    if (onLineIds.contains(callMemberModel.getEmp_code())) {
                        return;
                    }
                }
                callMemberModel.isChecked = !callMemberModel.isChecked;
                SmoothCheckBox checkBox = (SmoothCheckBox) view.findViewById(Util.getRS("scb_select","id",CallSelectActivity.this));
                checkBox.setChecked(callMemberModel.isChecked, true);
            }
        });
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();

        int tv_back = Util.getRS("tv_back", "id", this);
        int tv_complish = Util.getRS("tv_complish","id",this);
        if(id == tv_back){
            finish();
        }else if(id == tv_complish){
            List<CallMemberModel> shouldCallMemberList = new ArrayList<CallMemberModel>();
            List<String> shouldCallUserIds = new ArrayList<String>();
            if (mCallMemberModels != null && mCallMemberModels.size() > 0) {
                for (CallMemberModel callMemberModel : mCallMemberModels) {
                    if (callMemberModel.isChecked) {
                        shouldCallMemberList.add(callMemberModel);
                        shouldCallUserIds.add(callMemberModel.emp_code);
                    }
                }
            }


            if (ACTION_CALLSELECT.equals(action)) {//直接选择
                if (shouldCallMemberList != null && shouldCallMemberList.size() > 1) {

                    //拨打电话
                    ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
                    NetworkInfo networkInfo = cm.getActiveNetworkInfo();
                    if (networkInfo == null || !networkInfo.isConnected() || !networkInfo.isAvailable()) {
                        Toast.makeText(this, "当前网络不可用，请检查您的网络设置", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    RongCallSession profile = RongCallClient.getInstance().getCallSession();
                    if (profile != null && profile.getActiveTime() > 0) {//当前正在通话中
                        showToast("正在通话中。。。");
                        return;
                    }

                    Intent intent = new Intent(this, MulCallActivity.class);
                    intent.putExtra("action", "audio_outgoing");
                    intent.putExtra("callerUserId", callerUserId);
                    intent.putExtra("targetId", targetId);
                    intent.putParcelableArrayListExtra("shouldCallMemberList", (ArrayList<? extends Parcelable>) shouldCallMemberList);
                    startActivity(intent);
                    finish();
                    startCall(shouldCallUserIds);
                } else {
                    showToast("最少选择一人");
                }
            } else if (ACTION_INVITE.equals(action)) {
                if (shouldCallUserIds != null && shouldCallUserIds.size() > 0) {
                    shouldCallUserIds.removeAll(onLineIds);
                    if (shouldCallUserIds != null && shouldCallUserIds.size() > 0) {
                        Intent intent = new Intent();
                        intent.putStringArrayListExtra("invitedUserIdList", (ArrayList<String>) shouldCallUserIds);
                        setResult(2, intent);
                        finish();
                    } else {
                        showToast("最少邀请一人");
                    }
                }
            }

        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////////自己的方法 ///////////////////////////////////////

    /**
     * 拨打语音群组电话
     */
    private void startCall(List<String> userIds) {
        RongCallClient.getInstance().startCall(Conversation.ConversationType.DISCUSSION, targetId, userIds, RongCallCommon.CallMediaType.AUDIO, null);
    }

    private void getDataFromSever(String id) {
        RequestModel requestModel = new RequestModel();
        requestModel.setPage("1");
        requestModel.setPageSize("20");
        requestModel.setKey(id);
        asynPost(new Gson().toJson(requestModel));
    }

    /**
     * okHttp post异步请求网络
     */
    public void asynPost(String json) {
//        String json = "{" + "\"key\":" + "\"付\"" +",\"page\":" + "\"1\"" + ",\"pageSize\":" + "\"10\"" +  "}";
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);

        Request request = new Request.Builder()
//                .url("http://mobile-app.hand-china.com/hrmsv2/v2/api/staff/query?access_token=" + sp.getString("access_token", ""))
                .url(LoginInfo.baseUrl + "/hrmsv2/v2/api/staff/detail?" + "access_token=" + LoginInfo.access_token)
                .header("content-type", "application/json")
                .post(body)
                .build();
        Call call = mOkHttpClient.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {

            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {//成功
                    String str = response.body().string();
                    NameModel nameModel = new Gson().fromJson(str, NameModel.class);
                    if (nameModel != null) {
                        if (nameModel.isSuccess()) {
                            List<NameModel.RowsEntity> rows = nameModel.getRows();
                            if (rows != null && rows.size() > 0) {
                                NameModel.RowsEntity rowsEntity = rows.get(0);
                                boolean isChecked = false;

                                if (callerUserId.equals(rowsEntity.getEmp_code())) {//呼叫人的id让其选上
                                    isChecked = true;
                                } else {
                                    isChecked = false;
                                }
                                if (ACTION_INVITE.equals(action)) {
                                    if (onLineIds.contains(rowsEntity.getEmp_code())) {
                                        isChecked = true;
                                    }
//                                    if(selfUserId.equals(rowsEntity.getEmp_code())){
//                                        isChecked = true;
//                                    }
                                }

                                //mCallMemberModels.add(new CallMemberModel(isChecked, rowsEntity.getEmp_name(), rowsEntity.getEmp_code(), rowsEntity.getAvatar()));
                                CallMemberModel callMemberModel = new CallMemberModel(isChecked, rowsEntity.getEmp_name(), rowsEntity.getEmp_code(), rowsEntity.getAvatar());
                                Message message = new Message();
                                message.obj = callMemberModel;
                                message.what=0;
                                handler.sendMessage(message);
                            }
                        }
                    }
                } else {//失败
                    Log.e("399", "失败");
                    Message message = new Message();
                    message.what=1;
                    handler.sendMessage(message);
                }
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////

}
