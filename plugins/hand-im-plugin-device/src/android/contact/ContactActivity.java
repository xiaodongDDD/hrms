package com.hand.im.contact;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.im.DBhelper;
import com.hand.im.HandMulChatActivity;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.volley.HttpUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.rong.imlib.RongIMClient;

/**
 * Created by panx on 2016/8/24.
 */
public class ContactActivity extends Activity implements View.OnClickListener {
    private ListView listView;
    private SortAdapter sortadapter;
    private List<PersonBean> data;
    private SideBar sidebar;
    private TextView dialog;
    private EditText edtSearch;
    private ImageView btnSearch;
    private Button btnOK;
    private String targetId;

    private String TYPE;
    private String USERID;
    private String USERNAME;
    private String ICONURL;
    private String TOKEN;
    //查询联系人是否结束
    private boolean isRequestFinish = true;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(Util.getRS("activity_contact","layout",this));
        targetId = getIntent().getStringExtra("targetId");

        TYPE = getIntent().getStringExtra("TYPE");
        USERID = getIntent().getStringExtra("USERID");
        USERNAME = getIntent().getStringExtra("USERNAME");
        ICONURL = getIntent().getStringExtra("ICONURL");
        TOKEN = getIntent().getStringExtra("TOKEN");

        initView();
        init();
    }

    private void initView() {
        sidebar = (SideBar) findViewById(Util.getRS("sidebar","id",this));
        listView = (ListView) findViewById(Util.getRS("listview","id",this));
        dialog = (TextView) findViewById(Util.getRS("dialog","id",this));
        edtSearch = (EditText) findViewById(Util.getRS("edtSearch","id",this));
        btnOK = (Button) findViewById(Util.getRS("btnOK","id",this));
        btnOK.setOnClickListener(this);
        btnSearch = (ImageView) findViewById(Util.getRS("imgSearch","id",this));
        btnSearch.setOnClickListener(this);
        edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }
            @Override
            public void afterTextChanged(Editable editable) {
                data.clear();
                Map<String, String> hashMap = new HashMap<String, String>();
                hashMap.put("key", edtSearch.getText().toString());
                hashMap.put("page", "1");
                hashMap.put("pageSize", "30");
                HttpUtil.JSONObjectPost(LoginInfo.baseUrl+"/hrmsv2/v2/api/staff/query?" +
                        "access_token="+ LoginInfo.access_token, hashMap, getApplicationContext(), handlerObject);
            }
        });
    }

    private List<PersonBean> getData(String[] data) {
        List<PersonBean> listarray = new ArrayList<PersonBean>();
        for (int i = 0; i < data.length; i++) {
            String pinyin = PinyinUtils.getPingYin(data[i]);
            String Fpinyin = pinyin.substring(0, 1).toUpperCase();
            PersonBean person = new PersonBean();
            person.setName(data[i]);
            person.setPinYin(pinyin);
            if (Fpinyin.matches("[A-Z]")) {
                person.setFirstPinYin(Fpinyin);
            } else {
                person.setFirstPinYin("#");
            }
            listarray.add(person);
        }
        return listarray;
    }

    private List<PersonBean> dealData(List<PersonBean> data) {
        for (int i = 0; i < data.size(); i++) {
            String pinyin = PinyinUtils.getPingYin(data.get(i).getName());
            String Fpinyin = pinyin.substring(0, 1).toUpperCase();
            if (!Fpinyin.matches("[A-Z]")) {
                Fpinyin = "#";
            }
            data.get(i).setPinYin(pinyin);
            data.get(i).setFirstPinYin(Fpinyin);
        }
        return data;
    }

    private void init() {
        // TODO Auto-generated method stub
        sidebar.setTextView(dialog);
        sidebar.setOnTouchingLetterChangedListener(new SideBar.OnTouchingLetterChangedListener() {

            @Override
            public void onTouchingLetterChanged(String s) {
            // TODO Auto-generated method stub
            int position = sortadapter.getPositionForSelection(s.charAt(0));
            if (position != -1) {
                listView.setSelection(position);
            }
            }
        });
        data = new ArrayList<PersonBean>();
        sortadapter = new SortAdapter(this, data, btnOK);
        listView.setAdapter(sortadapter);
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        int idImgSearch = Util.getRS("imgSearch","id",this);
        int idBtnOK = Util.getRS("btnOK","id",this);
        if(id==idImgSearch){
            if (!isRequestFinish) {
                return;
            }
            Log.e("search.......","..................");
            isRequestFinish = false;
            data.clear();
            Map<String, String> hashMap = new HashMap<String, String>();
            hashMap.put("key", edtSearch.getText().toString());
            hashMap.put("page", "1");
            hashMap.put("pageSize", "30");
            HttpUtil.JSONObjectPost(LoginInfo.baseUrl+"/hrmsv2/v2/api/staff/query?" +
                    "access_token="+ LoginInfo.access_token, hashMap, this, handlerObject);
            //Log.e("access_token",LoginInfo.access_token);
            dialog.setVisibility(View.VISIBLE);
            dialog.setText("加载中...");
            dialog.setTextSize(10);
        }else if(id==idBtnOK){
            dialog.setVisibility(View.VISIBLE);
            dialog.setText("保存中...");
            dialog.setTextSize(10);
            ArrayList<String> members = sortadapter.getDealMember();
            if(targetId==null){
                createNewDiscussion(members);
            }else {
                inviteNewMember(members);
            }
        }
    }
    private void inviteNewMember(final ArrayList<String> members){
        RongIMClient.getInstance().addMemberToDiscussion(targetId, members, new RongIMClient.OperationCallback() {
            @Override
            public void onSuccess() {
                Toast.makeText(getApplicationContext(),"已邀请"+members.size()+"位新成员加入群聊",
                        Toast.LENGTH_SHORT).show();
                setResult(1);
                dialog.setVisibility(View.INVISIBLE);
                dialog.setTextSize(30);
                finish();
            }
            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                Toast.makeText(getApplicationContext(),"邀请失败", Toast.LENGTH_SHORT).show();
                dialog.setVisibility(View.INVISIBLE);
                dialog.setTextSize(30);
            }
        });
    }
    private void createNewDiscussion(final ArrayList<String> members){
        final String title = sortadapter.getTitle();
        if (RongIMClient.getInstance() != null) {
            RongIMClient.getInstance().createDiscussion(title, members, new RongIMClient.CreateDiscussionCallback() {
                @Override
                public void onSuccess(String s) {
                    dialog.setVisibility(View.INVISIBLE);
                    dialog.setTextSize(30);
					DBhelper dBhelper = new DBhelper(getApplicationContext());
                    dBhelper.addUserInfo(s, title, "http://zhouzybk.img-cn-shanghai.aliyuncs.com/discussionGroupImage1472535269374.png");
                    Toast.makeText(getApplicationContext(),"讨论组创建成功", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(ContactActivity.this, HandMulChatActivity.class);
                    intent.putExtra("TYPE", "NORMAL");
                    intent.putExtra("USERID", USERID);//用户Id
                    intent.putExtra("USERNAME", USERNAME);//用户姓名
                    intent.putExtra("ICONURL", ICONURL);//用户头像
                    intent.putExtra("TOKEN", TOKEN);
                    intent.putExtra("TARGETID", s);
                    intent.putExtra("GROUPNAME", title);
                    intent.putExtra("GROUPICON", members);
                    startActivity(intent);
                    finish();
                }
                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    dialog.setVisibility(View.INVISIBLE);
                    dialog.setTextSize(30);
                    Toast.makeText(getApplicationContext(),"fail:"+errorCode, Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    public Handler handlerObject = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);

            dialog.setVisibility(View.INVISIBLE);
            dialog.setTextSize(30);
            try {
                JSONObject object = new JSONObject(msg.getData().getString("message"));
                JSONArray array = new JSONArray(object.getString("rows"));
                for (int i = 0; i < array.length(); i++) {
                    PersonBean person = new PersonBean();
                    JSONObject object1 = new JSONObject(array.get(i).toString());
                    person.setId(object1.getString("emp_code"));
                    person.setName(object1.getString("emp_name"));
                    person.setAvatar(object1.getString("avatar"));
                    person.setPosition_name(object1.getString("position_name"));
                    data.add(person);
                }
                data = dealData(data);
                Collections.sort(data, new PinyinComparator());
                sortadapter.notifyDataSetChanged();
                isRequestFinish = true;
            } catch (JSONException e) {
                isRequestFinish = true;
                e.printStackTrace();
                Toast.makeText(getApplicationContext(),"请检查您的网络连接状态",Toast.LENGTH_SHORT).show();
            }
        }
    };

}
