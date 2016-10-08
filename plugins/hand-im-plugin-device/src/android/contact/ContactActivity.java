package com.hand.im.contact;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.im.DBhelper;
import com.hand.im.HandMulChatActivity;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.bean.Project;
import com.hand.im.okhttp.OkHttpClientManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;


/**
 * Created by panx on 2016/8/24.
 */
public class ContactActivity extends Activity implements View.OnClickListener {
    private String[] GroupArray;
    private EditText edtSearch;
    private LinearLayout btnOK;
    private String targetId;
    private TextView imgBack;

    private TextView txt_check_info;

    private String TYPE;
    private String USERID;
    private String USERNAME;
    private String ICONURL;
    private String TOKEN;
    private RelativeLayout rltOrgStruct;
    private RelativeLayout rltSelfOrgStruct;
    private ProgressBar loading;
    private TextView txtSelfOrg;
    private String currentDeptID;
    private ContactDataSource contactDataSource = new ContactDataSource();
    private ArrayList<Project> projectData;
    private ListView lsvProject;
    private ProjectAdapter projectAdapter;
    private ListView lsvOftenContact;
    private ContactSearchAdapter oftenAdapter;
    private ArrayList<PersonBean> oftenList;
    private ProgressBar projectProgress;
    private ProgressBar oftenContactProgress;
    private ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(Util.getRS("activity_contact", "layout", this));
        targetId = getIntent().getStringExtra("targetId");
        GroupArray = getIntent().getExtras().getStringArray("GroupArray");
        TYPE = getIntent().getStringExtra("TYPE");
        USERID = getIntent().getStringExtra("USERID");
        USERNAME = getIntent().getStringExtra("USERNAME");
        ICONURL = getIntent().getStringExtra("ICONURL");
        TOKEN = getIntent().getStringExtra("TOKEN");
        initView();
        initData();
        initEvent();
    }

    @Override
    protected void onStart() {
        super.onStart();
        setCreateInfo();
        if (oftenAdapter != null) {
            oftenAdapter.notifyDataSetChanged();
        }
    }

    private void initView() {
        imgBack = (TextView) findViewById(Util.getRS("arrow_back", "id", this));
        edtSearch = (EditText) findViewById(Util.getRS("edtSearch", "id", this));
        btnOK = (LinearLayout) findViewById(Util.getRS("btnOK", "id", this));
        loading = (ProgressBar) findViewById(Util.getRS("loading", "id", this));
        rltOrgStruct = (RelativeLayout) findViewById(Util.getRS("lyt_org_struct", "id", this));
        rltSelfOrgStruct = (RelativeLayout) findViewById(Util.getRS("lyt_org_self_struct", "id", this));
        txtSelfOrg = (TextView) findViewById(Util.getRS("txtSelfOrg", "id", this));
        lsvProject = (ListView) findViewById(Util.getRS("lsv_my_project", "id", this));
        lsvOftenContact = (ListView) findViewById(Util.getRS("lsv_often_contact", "id", this));
        txt_check_info = (TextView) findViewById(Util.getRS("txt_check_info", "id", this));
        lsvProject.setEmptyView(findViewById(Util.getRS("txtProjectTip", "id", this)));
        lsvOftenContact.setEmptyView(findViewById(Util.getRS("txtTip", "id", this)));
        projectProgress = (ProgressBar) (findViewById(Util.getRS("projectLoading", "id", this)));
        oftenContactProgress = (ProgressBar) (findViewById(Util.getRS("oftenLoading", "id", this)));
    }

    private void initData() {
        initSelfOrgStruct();
        initProject();
        initOftenContact();
    }

    private void initEvent() {
        imgBack.setOnClickListener(this);
        edtSearch.setOnClickListener(this);
        btnOK.setOnClickListener(this);
        rltOrgStruct.setOnClickListener(this);
        rltSelfOrgStruct.setOnClickListener(this);
        lsvProject.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Intent intent = new Intent(ContactActivity.this, ProjectActivity.class);
                intent.putExtra("projectId", projectData.get(i).getProject_id());
                intent.putExtra("projectName", projectData.get(i).getProject_name());
                intent.putExtra("targetId", targetId);
                intent.putExtra("GroupArray", GroupArray);
                startActivityForResult(intent, 0);
            }
        });
    }

    private void initProject() {

        contactDataSource.getProjectList(LoginInfo.userId, new ContactDataSource.DataSourceCallBack<ArrayList<Project>>() {
            @Override
            public void error(String msg) {
                projectProgress.setVisibility(View.GONE);
                Log.e("ERROR", msg);
            }

            @Override
            public void response(ArrayList<Project> projects) {
                projectProgress.setVisibility(View.GONE);
                setProjectAdapter(projects);
            }
        });
    }

    private void setProjectAdapter(ArrayList<Project> projects) {
        projectData = projects;
        projectAdapter = new ProjectAdapter(this, projects);
        lsvProject.setAdapter(projectAdapter);
        setListViewHeightBasedOnChildren(lsvProject);
    }

    private void initOftenContact() {
        contactDataSource.getOftenContact(new ContactDataSource.DataSourceCallBack<ArrayList<PersonBean>>() {
            @Override
            public void error(String msg) {
                oftenContactProgress.setVisibility(View.GONE);
                Log.e("error", msg);
            }

            @Override
            public void response(ArrayList<PersonBean> response) {
                oftenContactProgress.setVisibility(View.GONE);
                setOftenAdapter(response);
                initOftenContactImage(response);
            }
        });
    }

    private void setOftenAdapter(ArrayList<PersonBean> response) {
        oftenList = response;
        oftenAdapter = new ContactSearchAdapter(this, oftenList, new DataCheckCallBack() {
            @Override
            public void setCheckInfo() {
                setCreateInfo();
            }
        },GroupArray);
        lsvOftenContact.setAdapter(oftenAdapter);
        setListViewHeightBasedOnChildren(lsvOftenContact);
    }

    private void initOftenContactImage(ArrayList<PersonBean> persons) {
        contactDataSource.getStaffImageList(persons, new ContactDataSource.DataSourceCallBack<String>() {
            @Override
            public void error(String msg) {

            }

            @Override
            public void response(String response) {
                oftenAdapter.notifyDataSetChanged();
            }
        });
    }

    private void initSelfOrgStruct() {
        loading.setVisibility(View.VISIBLE);
        rltSelfOrgStruct.setClickable(false);
        String url = LoginInfo.baseUrl + "/hrmsv2/v2/api/dept/getStaffDeptInfo?" + "access_token=" + LoginInfo.access_token;
        OkHttpClientManager.postAsyn(url, new JSONObject(), new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
                Log.e("ERROR", e.toString());
                loading.setVisibility(View.GONE);
            }

            @Override
            public void onResponse(String response) {
                loading.setVisibility(View.GONE);
                rltSelfOrgStruct.setClickable(true);
                JSONObject object;
                JSONArray parentDeptArray;
                try {
                    object = new JSONObject(response).getJSONObject("returnData");
                    parentDeptArray = object.getJSONArray("deptInfo");
                    String title = "";
                    for (int i = 1; i < parentDeptArray.length(); i++) {
                        if (i == parentDeptArray.length() - 1) {
                            currentDeptID = parentDeptArray.getJSONObject(i).getString("id");
                            title = title + parentDeptArray.getJSONObject(i).getString("name");
                        } else {
                            title = title + parentDeptArray.getJSONObject(i).getString("name") + "-";
                        }
                    }
                    if (title.length() > 20) {
                        title = title.substring(0, 20) + "...";
                    }
                    txtSelfOrg.setText(title);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        int idBtnOK = Util.getRS("btnOK", "id", this);
        int idImgBack = Util.getRS("arrow_back", "id", this);
        int idEdtSearch = Util.getRS("edtSearch", "id", this);
        int idRltOrgStruct = Util.getRS("lyt_org_struct", "id", this);
        int idRltSelfOrgStruct = Util.getRS("lyt_org_self_struct", "id", this);
        if (id == idEdtSearch) {
            Intent intent = new Intent(ContactActivity.this, ContactSearchActivity.class);
            startActivityForResult(intent, 0);
        } else if (id == idRltOrgStruct) {
            Intent intent = new Intent(ContactActivity.this, OrgStructActivity.class);
            if (targetId != null) {
                intent.putExtra("targetId", targetId);
                intent.putExtra("GroupArray", GroupArray);
            }
            startActivityForResult(intent, 0);
        } else if (id == idRltSelfOrgStruct) {
            Intent intent = new Intent(ContactActivity.this, OrgStructActivity.class);
            intent.putExtra("selfDeptId", currentDeptID);
            if (targetId != null) {
                intent.putExtra("targetId", targetId);
                intent.putExtra("GroupArray", GroupArray);
            }
            startActivityForResult(intent, 0);
        } else if (id == idBtnOK) {
            btnOK.setClickable(false);
            showProgressDialog(true);
            CreateDisInfo.getMemberList(new CreateDisInfo.CreateCallBack<ArrayList<PersonBean>>() {
                @Override
                public void error(String msg) {
                    btnOK.setClickable(true);
                    showProgressDialog(false);
                    Toast.makeText(getApplicationContext(), "可能由于您同时加载的人数过多，导致加载失败", Toast.LENGTH_SHORT).show();
                    Log.e("error", msg);
                }

                @Override
                public void response(ArrayList<PersonBean> members) {
                    btnOK.setClickable(true);
                    showProgressDialog(false);
                    toCreateOrInvite(members);
                }
            });
        } else if (id == idImgBack) {
            onBackPressed();
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
    private void toCreateOrInvite(final ArrayList<PersonBean> members) {
        DiscussionManager dm = new DiscussionManager(ContactActivity.this);
        final int type;
        if (targetId != null && !targetId.equals("")) {
            type = DiscussionManager.INVITE;
        } else {
            type = DiscussionManager.CREATE;
        }
        dm.CreateOrInviteToDiscussion(new DiscussionManager.DisMCallBack<String>() {
            @Override
            public void onError(String msg) {
                btnOK.setClickable(true);
                Toast.makeText(getApplicationContext(), "ERROR:" + msg, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onReponse(String id, String title,String url) {
                btnOK.setClickable(true);
                if (type == DiscussionManager.CREATE) {
                    afterCreate(id, title,url);

                } else {
                    afterInvite();
                }
            }
        }, type, members, targetId, GroupArray);
    }

    private void afterCreate(String id, String title,String url) {
        String url_group;
        if(url!=null&&!url.equals("")){
            url_group = url;
        }else{
            url_group = LoginInfo.url_group_icon;
        }
        DBhelper dBhelper = new DBhelper(getApplicationContext());
        dBhelper.addUserInfo(id, title, url_group);
        Toast.makeText(getApplicationContext(), "讨论组创建成功", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(ContactActivity.this, HandMulChatActivity.class);
        intent.putExtra("TYPE", "NORMAL");
        intent.putExtra("USERID", LoginInfo.userId);//用户Id
        intent.putExtra("TARGETID", id);
        intent.putExtra("USERNAME",LoginInfo.userName);
        intent.putExtra("ICONURL",LoginInfo.userIcon);
        intent.putExtra("GROUPNAME", title);
        CreateDisInfo.reset();
        startActivity(intent);
        finish();
    }

    private void afterInvite() {
        Toast.makeText(this, "已邀请新成员", Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //邀请新成员时返回，101通过组织架构页面，102项目页面，103搜索页面
        if (requestCode == 0 && (resultCode == 101 || resultCode == 102|| resultCode==103)) {
            setResult(1);
            finish();
        }
        //创建讨论组时返回，201通过组织架构页面,202项目页面，203搜索页面
        if (requestCode == 0 && (resultCode == 201 || resultCode == 202 || resultCode == 203)) {
            String id = data.getStringExtra("id");
            String title = data.getStringExtra("title");
            String url = data.getStringExtra("url");
            afterCreate(id, title,url);
        }
    }

    private void setCreateInfo() {
        txt_check_info.setText(CreateDisInfo.getCreateInfo());
    }

    @Override
    public void onBackPressed() {
        CreateDisInfo.reset();
        super.onBackPressed();
    }

    private void setListViewHeightBasedOnChildren(ListView listView) {
        ListAdapter listAdapter = listView.getAdapter();
        if (listAdapter == null) {
            return;
        }
        int totalHeight = 0;
        for (int i = 0; i < listAdapter.getCount(); i++) {
            View listItem = listAdapter.getView(i, null, listView);
            listItem.measure(0, 0);
            totalHeight += listItem.getMeasuredHeight();
        }
        ViewGroup.LayoutParams params = listView.getLayoutParams();
        params.height = totalHeight
                + (listView.getDividerHeight() * (listAdapter.getCount() - 1));
        listView.setLayoutParams(params);
    }
}
