package com.hand.im.contact;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.im.DBhelper;
import com.hand.im.HandMulChatActivity;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.okhttp.OkHttpClientManager;

import java.net.URI;
import java.util.ArrayList;

/**
 * Created by panx on 2016/9/23.
 */
public class ProjectActivity extends Activity implements View.OnClickListener {
    private TextView txtProjectName;
    private String projectId;
    private ArrayList<PersonBean> data;
    private String projectName;
    private ContactSearchAdapter projectInfoAdapter;
    private ContactDataSource contactDataSource;
    private ListView lsvContent;
    private LinearLayout btnOK;
    private TextView txt_check_info;
    private CheckBox checkAll;
    private ProgressBar progressBar;
    private String targetId;
    private String[] GroupArray;
    private ProgressDialog progressDialog;
    private TextView arrow_back;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(Util.getRS("activity_project", "layout", this));
        projectId = getIntent().getStringExtra("projectId");
        projectName = getIntent().getStringExtra("projectName");
        targetId = getIntent().getStringExtra("targetId");
        GroupArray = getIntent().getExtras().getStringArray("GroupArray");
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
        txtProjectName = (TextView) findViewById(Util.getRS("txt_project_name", "id", this));
        lsvContent = (ListView) findViewById(Util.getRS("lsv_member", "id", this));
        btnOK = (LinearLayout) findViewById(Util.getRS("btnOK", "id", this));
        txt_check_info = (TextView) findViewById(Util.getRS("txt_check_info", "id", this));
        checkAll = (CheckBox) findViewById(Util.getRS("checkAll", "id", this));
        progressBar = (ProgressBar) findViewById(Util.getRS("loading", "id", this));
        lsvContent.setEmptyView(findViewById(Util.getRS("txtTip", "id", this)));
        arrow_back = (TextView) findViewById(Util.getRS("arrow_back", "id", this));
    }

    private void initData() {
        if (projectName.length() > 10) {
            projectName = projectName.substring(0, 10) + "...";
        }
        txtProjectName.setText(projectName);
        contactDataSource = new ContactDataSource();
        initProjectData();
    }

    private void initEvent() {
        btnOK.setOnClickListener(this);
        checkAll.setOnClickListener(this);
        arrow_back.setOnClickListener(this);
    }

    private void initProjectData() {
        contactDataSource.getProjectInfoList(projectId, new ContactDataSource.DataSourceCallBack<ArrayList<PersonBean>>() {
            @Override
            public void error(String msg) {
                Log.e("ERROR", msg);
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void response(ArrayList<PersonBean> response) {
                progressBar.setVisibility(View.GONE);
                data = response;
                setAdapter(response);
                initProjectImage();
            }
        });
    }

    private void initProjectImage() {
        contactDataSource.getStaffImageList(data, new ContactDataSource.DataSourceCallBack<String>() {
            @Override
            public void error(String msg) {
                Log.e("Error", msg);
            }

            @Override
            public void response(String response) {
                projectInfoAdapter.notifyDataSetChanged();
            }
        });
    }

    private void setAdapter(ArrayList<PersonBean> response) {
        projectInfoAdapter = new ContactSearchAdapter(this, response, new DataCheckCallBack() {
            @Override
            public void setCheckInfo() {
                setCreateInfo();
            }
        }, GroupArray);
        lsvContent.setAdapter(projectInfoAdapter);
    }

    private void setCreateInfo() {
        txt_check_info.setText(CreateDisInfo.getCreateInfo());
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        int idBtnOk = Util.getRS("btnOK", "id", this);
        int idCheckAll = Util.getRS("checkAll", "id", this);
        int idTextBack = Util.getRS("arrow_back", "id", this);
        if (id == idBtnOk) {
            showProgressDialog(true);
            btnOK.setClickable(false);
            CreateDisInfo.getMemberList(new CreateDisInfo.CreateCallBack<ArrayList<PersonBean>>() {
                @Override
                public void error(String msg) {
                    showProgressDialog(false);
                    btnOK.setClickable(true);
                    Toast.makeText(getApplicationContext(), "可能由于您同时加载的人数过多，导致加载失败", Toast.LENGTH_SHORT).show();
                    Log.e("error", msg);
                }

                @Override
                public void response(ArrayList<PersonBean> members) {
                    showProgressDialog(false);
                    btnOK.setClickable(true);
                    toCreateOrInvite(members);
                }
            });
        } else if (id == idCheckAll) {
            if (checkAll.isChecked()) {
                projectInfoAdapter.checkAll();
            } else {
                projectInfoAdapter.unCheckAll();
            }
        } else if (id == idTextBack) {
            finish();
        }
    }

    private void showProgressDialog(Boolean b) {
        if (progressDialog == null && b) {
            progressDialog = ProgressDialog.show(this, null, "处理中...");
        } else if (b) {
            progressDialog.show();
        } else if (!b && progressDialog != null) {
            progressDialog.dismiss();
        }
    }

    private void toCreateOrInvite(ArrayList<PersonBean> members) {
        DiscussionManager dm = new DiscussionManager(ProjectActivity.this);
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
                if (msg != null && !msg.equals("")) {
                    Toast.makeText(getApplicationContext(), "ERROR:" + msg, Toast.LENGTH_SHORT).show();
                }
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
        Intent intent = new Intent();
        intent.putExtra("id", id);
        intent.putExtra("title", title);
        intent.putExtra("url",url);
        setResult(202, intent);
        finish();
    }

    private void afterInvite() {
        Toast.makeText(this, "已邀请新成员", Toast.LENGTH_SHORT).show();
        setResult(102);
        finish();
    }
}
