package com.hand.im.contact;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.im.DBhelper;
import com.hand.im.HandMulChatActivity;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.okhttp.OkHttpClientManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import okhttp3.Call;

/**
 * Created by panx on 2016/9/22.
 */
public class ContactSearchActivity extends Activity implements View.OnClickListener{
    private EditText edtSearch;
    private ArrayList<PersonBean> data;
    private ListView lsvContent;
    private ContactSearchAdapter contactSearchAdapter;
    private LinearLayout btnOK;
    private TextView txt_check_info;
    private TextView txtCancel;
    private String targetId;
    private String[] GroupArray;
    private ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(Util.getRS("activity_contact_search", "layout", this));
        targetId = getIntent().getStringExtra("targetId");
        GroupArray = getIntent().getStringArrayExtra("GroupArray");
        initView();
        initData();
        initEvent();
    }

    @Override
    protected void onStart() {
        super.onStart();
        setCreateInfo();
    }

    private void initView() {
        edtSearch = (EditText) findViewById(Util.getRS("edtSearch", "id", this));
        lsvContent = (ListView) findViewById(Util.getRS("lsv_content", "id", this));
        btnOK = (LinearLayout)findViewById(Util.getRS("btnOK","id",this));
        txt_check_info = (TextView)findViewById(Util.getRS("txt_check_info","id",this));
        txtCancel = (TextView)findViewById(Util.getRS("txtCancel","id",this));
    }

    private void initData() {
        data = new ArrayList<PersonBean>();
        contactSearchAdapter = new ContactSearchAdapter(this, data, new DataCheckCallBack() {
            @Override
            public void setCheckInfo() {
                setCreateInfo();
            }
        },GroupArray);
        lsvContent.setAdapter(contactSearchAdapter);
        btnOK.setOnClickListener(this);
    }

    private void initEvent() {
        edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable editable) {
                updateDataList();
            }
        });
        txtCancel.setOnClickListener(this);
        lsvContent.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                ContactSearchAdapter.ViewHolder holder = (ContactSearchAdapter.ViewHolder) view.getTag();
                contactSearchAdapter.checkButtonOnClick(holder.checkBox,i);
            }
        });
    }

    private void updateDataList() {
        String url = LoginInfo.baseUrl + "/hrmsv2/v2/api/staff/query?" + "access_token=" + LoginInfo.access_token;
        JSONObject object = new JSONObject();
        try {
            object.put("key", edtSearch.getText().toString());
            object.put("page", "1");
            object.put("pageSize", "30");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        OkHttpClientManager.postAsyn(url, object, new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
            }

            @Override
            public void onResponse(String response) {
                Log.e("Response",response);
                dealDataList(response);
            }
        });
    }

    public void dealDataList(String str) {
        JSONObject object = null;
        try {
            data.clear();
            object = new JSONObject(str);
            JSONArray array = new JSONArray(object.getString("rows"));
            for (int i = 0; i < array.length(); i++) {
                PersonBean person = new PersonBean();
                JSONObject object1 = new JSONObject(array.get(i).toString());
                person.setId(object1.getString("emp_code"));
                person.setName(object1.getString("emp_name"));
                person.setAvatar(object1.getString("avatar"));
                person.setPosition_name(object1.getString("position_name"));
                person.setEmail(object1.getString("email"));
                data.add(person);
            }
            contactSearchAdapter.notifyDataSetChanged();

        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "获取数据错误："+e.toString(), Toast.LENGTH_SHORT).show();
        }

    }
    private void setCreateInfo(){
        txt_check_info.setText(CreateDisInfo.getCreateInfo());
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        int idBtnOK = Util.getRS("btnOK","id",this);
        int idTxtCancel = Util.getRS("txtCancel","id",this);
        if(id == idBtnOK){
            showProgressDialog(true);
            btnOK.setClickable(false);
            CreateDisInfo.getMemberList(new CreateDisInfo.CreateCallBack<ArrayList<PersonBean>>() {
                @Override
                public void error(String msg) {
                    btnOK.setClickable(true);
                    showProgressDialog(false);
                    Toast.makeText(getApplicationContext(),"可能由于您同时加载的人数过多，导致加载失败",Toast.LENGTH_SHORT).show();
                    Log.e("error",msg);
                }
                @Override
                public void response(ArrayList<PersonBean> members) {
                    toCreateOrInvite(members);
                    btnOK.setClickable(true);
                    showProgressDialog(false);
                }
            });
        }else if(id == idTxtCancel){
            InputMethodManager imm =  (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
            if(imm != null) {
                imm.hideSoftInputFromWindow(getWindow().getDecorView().getWindowToken(),0);
            }
            super.onBackPressed();
        }
    }
    private void showProgressDialog(Boolean b){
        if(progressDialog == null&&b){
            progressDialog = ProgressDialog.show(this,null,"处理中...");
        }else if(b){
            progressDialog.show();
        }else if(!b&&progressDialog!=null){
            progressDialog.dismiss();
        }
    }
    private void toCreateOrInvite(ArrayList<PersonBean> members){
        DiscussionManager dm = new DiscussionManager(ContactSearchActivity.this);
        final int type;
        if(targetId!=null&&!targetId.equals("")){
            type = DiscussionManager.INVITE;
        }else{
            type = DiscussionManager.CREATE;
        }
        dm.CreateOrInviteToDiscussion(new DiscussionManager.DisMCallBack<String>() {
            @Override
            public void onError(String msg) {
                btnOK.setClickable(true);
                Toast.makeText(getApplicationContext(),"ERROR:"+msg,Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onReponse(String id,String title,String url) {
                btnOK.setClickable(true);
                if(type == DiscussionManager.CREATE){
                    afterCreate(id,title,url);
                }else{
                    afterInvite();
                }
            }
        },type, members,targetId,GroupArray);
    }

    private void afterCreate(String id,String title,String url){
        Intent intent = new Intent();
        intent.putExtra("id",id);
        intent.putExtra("title",title);
        intent.putExtra("url",url);
        setResult(203,intent);
        finish();
    }

    private void afterInvite(){
        Toast.makeText(this,"已邀请新成员",Toast.LENGTH_SHORT).show();
        setResult(103);
        finish();
    }
}
