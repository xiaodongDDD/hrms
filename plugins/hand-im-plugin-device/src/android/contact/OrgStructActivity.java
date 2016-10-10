package com.hand.im.contact;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.im.DBhelper;
import com.hand.im.HandMulChatActivity;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.bean.CheckPageSet;
import com.hand.im.bean.OrgStruct;
import com.hand.im.okhttp.OkHttpClientManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;

/**
 * Created by panx on 2016/9/18.
 */
public class OrgStructActivity extends Activity implements View.OnClickListener {

    private ListView lstOrgStruct;
    private List<OrgStruct> currentData = new ArrayList<OrgStruct>();
    private OrgStructAdapter orgStructAdapter;
    private ProgressBar loading;
    private CheckBox ckbCheckAll;
    private LinearLayout btnOk;
    private TextView txtBack;
    private LinearLayout lytNav;
    private HorizontalScrollView hsv;
    private List<CheckPageSet> historyCheckPageSet = CreateDisInfo.historyCheckPageSet;
    private int currentPageNo = CreateDisInfo.currentPageNo;

    private String selfDeptID;
    private String rootID = "1";
    private TextView txtCheckInfo;
    private String targetId;
    private String[] GroupArray;
    private EditText edtSearch;
    private ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(Util.getRS("activity_org_struct", "layout", this));
        selfDeptID = getIntent().getStringExtra("selfDeptId");
        targetId = getIntent().getStringExtra("targetId");
        GroupArray = getIntent().getStringArrayExtra("GroupArray");
        if (selfDeptID != null) {
            rootID = selfDeptID;
        }
        initView();
        setCreateInfo();
        if (historyCheckPageSet.size() > 0 && currentPageNo != -1) {
            initHisData();
        } else {
            initData();
        }
        initEvent();
    }

    @Override
    protected void onStart() {
        super.onStart();
        setCreateInfo();
        if (orgStructAdapter != null) {
            orgStructAdapter.notifyDataSetChanged();
        }
    }

    private void initView() {
        edtSearch = (EditText) findViewById(Util.getRS("edtSearch", "id", this));
        edtSearch.setOnClickListener(this);
        txtCheckInfo = (TextView) findViewById(Util.getRS("txt_check_info", "id", this));
        hsv = (HorizontalScrollView) findViewById(Util.getRS("hsv", "id", this));
        lytNav = (LinearLayout) findViewById(Util.getRS("lyt_nav", "id", this));
        lstOrgStruct = (ListView) findViewById(Util.getRS("lsv_org_struct", "id", this));
        loading = (ProgressBar) findViewById(Util.getRS("loading", "id", this));
        ckbCheckAll = (CheckBox) findViewById(Util.getRS("checkAll", "id", this));
        txtBack = (TextView) findViewById(Util.getRS("arrow_back", "id", this));
        txtBack.setOnClickListener(this);
        btnOk = (LinearLayout) findViewById(Util.getRS("btnOK", "id", this));
        btnOk.setOnClickListener(this);
        ckbCheckAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (ckbCheckAll.isChecked() && orgStructAdapter != null) {
                    orgStructAdapter.checkAll();
                } else if (!ckbCheckAll.isChecked() && orgStructAdapter != null) {
                    orgStructAdapter.unCheckAll();
                }
            }
        });
    }

    private void initEvent() {
        lstOrgStruct.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                OrgStructAdapter.ViewHolder holder = (OrgStructAdapter.ViewHolder) view.getTag();
                orgStructAdapter.checkButtonOnClick(holder,holder.checkBox,i);
            }
        });
    }

    private void setOrgStructAdapter() {
        orgStructAdapter = new OrgStructAdapter(currentData, getApplicationContext(), GroupArray, new OrgStructCallBack() {
            @Override
            public void setLoading(int status) {
                loading.setVisibility(status);
            }

            @Override
            public void setOkButton(int status) {
                btnOk.setVisibility(status);
            }

            @Override
            public void setCheckAll(Boolean status) {
                ckbCheckAll.setChecked(status);
            }

            @Override
            public void setCheckInfo() {
                setCreateInfo();
            }

            @Override
            public void nextLevel(String deptId) {
                refreshData(deptId);
            }
        });
        lstOrgStruct.setAdapter(orgStructAdapter);
        historyCheckPageSet.get(currentPageNo).setCheckList(orgStructAdapter.getCheckList());
    }

    private void initData() {
        String url = LoginInfo.baseUrl + "/hrmsv2/v2/api/dept/getDetail?" + "access_token=" + LoginInfo.access_token;
        JSONObject object = new JSONObject();
        try {
            object.put("id", rootID);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        setLoading(View.VISIBLE);
        OkHttpClientManager.postAsyn(url, object, new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
                Log.e("error", e.toString());
                setLoading(View.GONE);
            }

            @Override
            public void onResponse(String response) {
                setLoading(View.GONE);
                currentData.clear();

                ArrayList<OrgStruct> tempDataList = dealDataList(response);
                currentData.addAll(tempDataList);
                setOrgStructAdapter();
            }
        });
    }

    private void initHisData() {
        setLoading(View.GONE);
        if (selfDeptID != null && isDataSetExist(selfDeptID) != -1) {
            currentPageNo = isDataSetExist(selfDeptID);

        } else if (selfDeptID != null && isDataSetExist(selfDeptID) == -1) {
            rootID = selfDeptID;
            initData();
            return;
        } else if (selfDeptID == null && !historyCheckPageSet.get(currentPageNo).getParentDeptID().equals("1")) {
            if (isDataSetExist("1") != -1) {
                currentPageNo = isDataSetExist("1");
            } else {
                initData();
                return;
            }
        }
        ArrayList<OrgStruct> tempDataList = historyCheckPageSet.get(currentPageNo).getDataSet();
        JSONArray parentArray = historyCheckPageSet.get(currentPageNo).getParentArray();
        ArrayList<Boolean> checkList = historyCheckPageSet.get(currentPageNo).getCheckList();
        setNarBar(parentArray);
        currentData.addAll(tempDataList);
        setOrgStructAdapter();
        orgStructAdapter.setCheckList(checkList);
        orgStructAdapter.notifyDataSetChanged();
    }

    private int isDataSetExist(String deptId) {
        for (int i = 0; i < historyCheckPageSet.size(); i++) {
            if (deptId.equals(historyCheckPageSet.get(i).getParentDeptID())) {
                return i;
            }
        }
        return -1;
    }

    private void refreshHisData(String deptId) {
        JSONArray parentArray;
        ArrayList<OrgStruct> data;
        ArrayList<Boolean> checkList;
        for (int i = 0; i < historyCheckPageSet.size(); i++) {
            if (deptId.equals(historyCheckPageSet.get(i).getParentDeptID())) {
                data = historyCheckPageSet.get(i).getDataSet();
                parentArray = historyCheckPageSet.get(i).getParentArray();
                checkList = historyCheckPageSet.get(i).getCheckList();
                currentData.clear();
                currentData.addAll(data);
                orgStructAdapter.setCheckList(checkList);
                orgStructAdapter.notifyDataSetChanged();
                currentPageNo = i;
                setNarBar(parentArray);

                break;
            }
        }

    }

    //点击下级时刷新数据
    private void refreshData(String deptId) {
        //获取下级目录前保存当前目录的选中情况
        historyCheckPageSet.get(currentPageNo).setCheckList(orgStructAdapter.getCheckList());
        ckbCheckAll.setChecked(false);
        currentData.clear();
        orgStructAdapter.setCheckList();
        orgStructAdapter.notifyDataSetChanged();
        if (isDataSetExist(deptId) != -1) {
            refreshHisData(deptId);
            return;
        }

        setLoading(View.VISIBLE);
        String url = LoginInfo.baseUrl + "/hrmsv2/v2/api/dept/getDetail?" + "access_token=" + LoginInfo.access_token;
        JSONObject object = new JSONObject();
        try {
            object.put("id", deptId);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        OkHttpClientManager.postAsyn(url, object, new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
                Log.e("error", e.toString());
                setLoading(View.GONE);
            }

            @Override
            public void onResponse(String response) {
                ArrayList<OrgStruct> tempDataList = dealDataList(response);
                currentData.addAll(tempDataList);
                // callBack.pushDataSet(tempDataList);
                orgStructAdapter.setCheckList();
                orgStructAdapter.notifyDataSetChanged();
                historyCheckPageSet.get(currentPageNo).setCheckList(orgStructAdapter.getCheckList());
                setLoading(View.GONE);
            }
        });
    }

    private void setNarBar(JSONArray parentDeptArray) {
        lytNav.removeAllViews();
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMargins(20, 0, 0, 0);
        TextView txtView0 = new TextView(this);
        txtView0.setText("通讯录");
        txtView0.setId(-1);
        txtView0.setTextColor(0xFF003CA7);
        txtView0.setLayoutParams(params);
        txtView0.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int id = view.getId();
                toNavBarSelect(id);
            }
        });
        lytNav.addView(txtView0);
        for (int i = 0; i < parentDeptArray.length(); i++) {
            try {
                TextView divView = new TextView(this);
                divView.setText(">");
                divView.setTextColor(Color.BLUE);
                divView.setTextColor(0xFF003CA7);
                divView.setLayoutParams(params);
                lytNav.addView(divView);
                JSONObject object = parentDeptArray.getJSONObject(i);
                TextView txtView = new TextView(this);
                txtView.setText(object.getString("name"));
                txtView.setId(object.getInt("id"));
                txtView.setTextColor(0xFF003CA7);
                if (i == parentDeptArray.length() - 1) {
                    txtView.setTextColor(Color.BLACK);
                }
                txtView.setLayoutParams(params);
                txtView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        int id = view.getId();
                        toNavBarSelect(id);
                    }
                });
                lytNav.addView(txtView);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        new Handler().post(new Runnable() {
            @Override
            public void run() {
                hsv.fullScroll(HorizontalScrollView.FOCUS_RIGHT);
            }
        });
    }

    /**
     * 通过导航栏上的点击刷新数据
     *
     * @param id
     */
    private void toNavBarSelect(int id) {
        if (id == -1) {
            finish();
            return;
        }
        int currentDeptID = Integer.valueOf(historyCheckPageSet.get(currentPageNo).getParentDeptID());
        if (id == currentDeptID) {
            return;
        }
        refreshData(String.valueOf(id));
    }

    private ArrayList<OrgStruct> dealDataList(String data) {
        CheckPageSet checkPageSet = new CheckPageSet();
        ArrayList<OrgStruct> tempList = new ArrayList<OrgStruct>();
        JSONObject object = new JSONObject();
        JSONArray deptArray = new JSONArray();
        JSONArray staffArray = new JSONArray();
        JSONArray parentDeptArray = new JSONArray();
        String deptId = "";
        try {
            object = new JSONObject(data).getJSONObject("returnData");
            deptArray = object.getJSONArray("childrenDept");
            staffArray = object.getJSONArray("deptStaff");
            parentDeptArray = object.getJSONArray("deptInfo");
            deptId = object.getString("departmentId");
            setNarBar(parentDeptArray);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        for (int i = 0; i < deptArray.length(); i++) {
            OrgStruct orgStruct = new OrgStruct();
            try {
                JSONObject deptObject = deptArray.getJSONObject(i);
                orgStruct.setId(deptObject.getString("departmentId"));
                orgStruct.setName(deptObject.getString("departmentName"));
                orgStruct.setTotalStaffNumber(deptObject.getString("totalStaffNumber"));
                orgStruct.setType(OrgStruct.DEPTARTMENT);
                tempList.add(orgStruct);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        for (int i = 0; i < staffArray.length(); i++) {
            OrgStruct orgStruct = new OrgStruct();
            try {
                JSONObject staffObject = staffArray.getJSONObject(i);
                orgStruct.setId(staffObject.getString("accountNumber"));
                orgStruct.setName(staffObject.getString("userName"));
                orgStruct.setAvatar(staffObject.getString("avatar"));
                orgStruct.setType(OrgStruct.STAFF);
                tempList.add(orgStruct);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        checkPageSet.setParentArray(parentDeptArray);
        checkPageSet.setDataSet(tempList);
        checkPageSet.setParentDeptID(deptId);
        AddHistoryPageSet(checkPageSet);
        return tempList;
    }

    private void AddHistoryPageSet(CheckPageSet checkPageSet) {
        historyCheckPageSet.add(checkPageSet);
        currentPageNo = historyCheckPageSet.size() - 1;
    }


    private void setLoading(int status) {
        loading.setVisibility(status);
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        int idBack = Util.getRS("arrow_back", "id", this);
        int idBtnOk = Util.getRS("btnOK", "id", this);
        int idEdtSearch = Util.getRS("edtSearch", "id", this);
        if (id == idBack) {
            onBackPressed();
        } else if (id == idEdtSearch) {
            Intent intent = new Intent(OrgStructActivity.this, ContactSearchActivity.class);
            intent.putExtra("targetId", targetId);
            intent.putExtra("GroupArray", GroupArray);
            startActivityForResult(intent, 1);
        } else if (id == idBtnOk) {
            showProgressDialog(true);
            btnOk.setClickable(false);
            CreateDisInfo.getMemberList(new CreateDisInfo.CreateCallBack<ArrayList<PersonBean>>() {
                @Override
                public void error(String msg) {
                    showProgressDialog(false);
                    btnOk.setClickable(true);
                    Toast.makeText(getApplicationContext(), "可能由于您同时加载的人数过多，导致加载失败", Toast.LENGTH_SHORT).show();
                    Log.e("error", msg);
                }

                @Override
                public void response(ArrayList<PersonBean> members) {
                    showProgressDialog(false);
                    btnOk.setClickable(true);
                    toCreateOrInvite(members);
                }
            });
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
        DiscussionManager dm = new DiscussionManager(OrgStructActivity.this);
        final int type;
        if (targetId != null && !targetId.equals("")) {
            type = DiscussionManager.INVITE;
        } else {
            type = DiscussionManager.CREATE;
        }
        dm.CreateOrInviteToDiscussion(new DiscussionManager.DisMCallBack<String>() {
            @Override
            public void onError(String msg) {
                setLoading(View.GONE);
                btnOk.setClickable(true);
                Toast.makeText(getApplicationContext(), "ERROR:" + msg, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onReponse(String id, String title, String url) {
                setLoading(View.GONE);
                btnOk.setClickable(true);
                if (type == DiscussionManager.CREATE) {
                    afterCreate(id, title, url);
                } else {
                    afterInvite();
                }
            }
        }, type, members, targetId, GroupArray);
    }

    private void afterCreate(String id, String title, String url) {
        Intent intent = new Intent();
        intent.putExtra("id", id);
        intent.putExtra("title", title);
        intent.putExtra("url", url);
        setResult(201, intent);
        finish();
    }

    private void afterInvite() {
        Toast.makeText(this, "已邀请新成员", Toast.LENGTH_SHORT).show();
        setResult(101);
        finish();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == 203) {
            setResult(201, data);
            finish();
        }

        if (requestCode == 1 && resultCode == 103) {
            setResult(101);
            finish();
        }
    }

    @Override
    public void onBackPressed() {
        if (selfDeptID != null && !selfDeptID.equals("")) {
            super.onBackPressed();
            return;
        }
        String upLevelParentId;
        if (historyCheckPageSet.size() > currentPageNo && currentPageNo > 0) {
            upLevelParentId = historyCheckPageSet.get(currentPageNo).getUpLevelParentId();
        } else {
            super.onBackPressed();
            return;
        }
        if (!upLevelParentId.equals("0") || selfDeptID == null) {
            if (isDataSetExist(upLevelParentId) != -1) {
                refreshData(upLevelParentId);
            } else {
                //返回前保存当前目录的选中情况
                historyCheckPageSet.get(currentPageNo).setCheckList(orgStructAdapter.getCheckList());
                CreateDisInfo.historyCheckPageSet = historyCheckPageSet;
                CreateDisInfo.currentPageNo = currentPageNo;
                super.onBackPressed();

            }
        } else {
            //返回前保存当前目录的选中情况
            historyCheckPageSet.get(currentPageNo).setCheckList(orgStructAdapter.getCheckList());
            CreateDisInfo.historyCheckPageSet = historyCheckPageSet;
            CreateDisInfo.currentPageNo = currentPageNo;
            super.onBackPressed();

        }
    }

    private void setCreateInfo() {
        if (orgStructAdapter != null) {
            historyCheckPageSet.get(currentPageNo).setCheckList(orgStructAdapter.getCheckList());
        }
        txtCheckInfo.setText(CreateDisInfo.getCreateInfo());
    }

    public static abstract class OrgStructCallBack {
        public abstract void setLoading(int status);

        public abstract void setOkButton(int status);

        public abstract void setCheckAll(Boolean status);

        public abstract void setCheckInfo();

        public abstract void nextLevel(String deptId);
    }
}
