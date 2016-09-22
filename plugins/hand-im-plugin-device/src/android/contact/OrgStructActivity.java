package com.hand.im.contact;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
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
import com.hand.im.bean.OrgStruct;
import com.hand.im.okhttp.OkHttpClientManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import io.rong.imlib.RongIMClient;
import okhttp3.Call;

/**
 * Created by panx on 2016/9/18.
 */
public class OrgStructActivity extends Activity implements AdapterView.OnItemClickListener, View.OnClickListener {

    private ListView lstOrgStruct;
    private List<OrgStruct> currentData = new ArrayList<OrgStruct>();
    private OrgStructAdapter orgStructAdapter;
    private ProgressBar loading;
    private CheckBox ckbCheckAll;
    private Button btnOk;
    private TextView txtBack;
    private LinearLayout lytNav;
    private HorizontalScrollView hsv;
    private List<List<OrgStruct>> stackDataSet = new ArrayList<List<OrgStruct>>();
    private List<JSONArray> parentDeptArrayList = new ArrayList<JSONArray>();
    private String selfDeptID;
    private String rootID = "1";
    private TextView txtCheckInfo;
    private String targetId;
    private String[] GroupArray;

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
        initData();
    }

    private void initView() {
        txtCheckInfo = (TextView) findViewById(Util.getRS("txt_check_info", "id", this));
        hsv = (HorizontalScrollView) findViewById(Util.getRS("hsv", "id", this));
        lytNav = (LinearLayout) findViewById(Util.getRS("lyt_nav", "id", this));
        lstOrgStruct = (ListView) findViewById(Util.getRS("lsv_org_struct", "id", this));
        lstOrgStruct.setOnItemClickListener(this);
        loading = (ProgressBar) findViewById(Util.getRS("loading", "id", this));
        ckbCheckAll = (CheckBox) findViewById(Util.getRS("checkAll", "id", this));
        txtBack = (TextView) findViewById(Util.getRS("arrow_back", "id", this));
        txtBack.setOnClickListener(this);
        btnOk = (Button) findViewById(Util.getRS("btnOK", "id", this));
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
                pushDataList(tempDataList);
                orgStructAdapter = new OrgStructAdapter(currentData, getApplicationContext(), GroupArray,new OrgStructCallBack() {
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
                    public void pushDataSet(ArrayList<OrgStruct> dataList) {
                        pushDataList(dataList);
                    }

                    @Override
                    public void setParentArray(JSONArray array) {
                        pushParentDeptArray(array);
                        setNarBar(array);
                    }

                    @Override
                    public void setCheckInfo(String info) {
                        txtCheckInfo.setText(info);
                    }
                });
                lstOrgStruct.setAdapter(orgStructAdapter);
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
        txtView0.setTextColor(Color.BLUE);
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
                divView.setLayoutParams(params);
                lytNav.addView(divView);
                JSONObject object = parentDeptArray.getJSONObject(i);
                TextView txtView = new TextView(this);
                txtView.setText(object.getString("name"));
                txtView.setId(object.getInt("id"));
                txtView.setTextColor(Color.BLUE);
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
        try {
            JSONArray currentParentDeptArray = parentDeptArrayList.get(parentDeptArrayList.size() - 1);
            int currentDeptID = (currentParentDeptArray.getJSONObject(currentParentDeptArray.length() - 1)).getInt("id");
            if (id == currentDeptID) {
                return;
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        for (int i = 0; i < parentDeptArrayList.size() - 1; i++) {
            try {
                ArrayList<OrgStruct> tempDataList = popDataList();
                JSONArray tempArray = popParentDeptArray();
                if (tempArray != null && tempDataList != null) {
                    int tempID = (tempArray.getJSONObject(tempArray.length() - 1)).getInt("id");
                    if (id == tempID) {
                        //Toast.makeText(this,id+"--"+tempID,Toast.LENGTH_SHORT).show();
                        setNarBar(tempArray);
                        currentData.clear();
                        currentData.addAll(tempDataList);
                        orgStructAdapter.notifyDataSetChanged();
                        return;
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        //遍历之后没有匹配到数据说明该部门数据之前没有加载过，开始加载该部分数据
        stackDataSet.clear();
        parentDeptArrayList.clear();
        rootID = String.valueOf(id);
        initData();
    }

    private ArrayList<OrgStruct> dealDataList(String data) {
        ArrayList<OrgStruct> tempList = new ArrayList<OrgStruct>();
        JSONObject object = new JSONObject();
        JSONArray deptArray = new JSONArray();
        JSONArray staffArray = new JSONArray();
        JSONArray parentDeptArray = new JSONArray();
        try {
            object = new JSONObject(data).getJSONObject("returnData");
            deptArray = object.getJSONArray("childrenDept");
            staffArray = object.getJSONArray("deptStaff");
            parentDeptArray = object.getJSONArray("deptInfo");
            pushParentDeptArray(parentDeptArray);
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

        return tempList;
    }

    private void setLoading(int status) {
        loading.setVisibility(status);
    }

    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
        OrgStructAdapter.ViewHolder holder = (OrgStructAdapter.ViewHolder) view.getTag();
        orgStructAdapter.setCheckStatus(holder.checkBox);
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        int idBack = Util.getRS("arrow_back", "id", this);
        int idBtnOk = Util.getRS("btnOK", "id", this);
        if (id == idBack) {
            onBackPressed();
        } else if (id == idBtnOk) {
            ArrayList<Boolean> checkList = orgStructAdapter.getCheckList();
            //orgStructAdapter.getAllCheckMember();
            makeGroup(checkList);
        }
    }

    private void pushParentDeptArray(JSONArray array) {
        parentDeptArrayList.add(array);
    }

    private JSONArray popParentDeptArray() {
        if (parentDeptArrayList.size() > 0) {
            parentDeptArrayList.remove(parentDeptArrayList.size() - 1);
        }
        if (parentDeptArrayList.size() > 0) {
            return parentDeptArrayList.get(parentDeptArrayList.size() - 1);
        } else {
            return null;
        }
    }

    private void pushDataList(ArrayList<OrgStruct> dataSet) {
        stackDataSet.add(dataSet);
    }

    private ArrayList<OrgStruct> popDataList() {
        if (stackDataSet.size() > 0) {
            stackDataSet.remove(stackDataSet.size() - 1);
        }
        if (stackDataSet.size() > 0) {
            ArrayList<OrgStruct> tempList = new ArrayList<OrgStruct>();
            tempList.addAll(stackDataSet.get(stackDataSet.size() - 1));
            return tempList;
        } else {
            return null;
        }
    }

    public static abstract class OrgStructCallBack {
        public abstract void setLoading(int status);

        public abstract void setOkButton(int status);

        public abstract void setCheckAll(Boolean status);

        public abstract void pushDataSet(ArrayList<OrgStruct> dataList);

        public abstract void setParentArray(JSONArray array);

        public abstract void setCheckInfo(String info);
    }

    private ArrayList<String> memberList = new ArrayList<String>();
    private int loadNum = 0;
    private int totalNum = 0;

    public void makeGroup(final ArrayList<Boolean> checkList) {
        setLoading(View.VISIBLE);
        memberList.clear();
        loadNum = 0;
        totalNum = 0;
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i))
                totalNum++;
        }
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i)) {
                if (currentData.get(i).getType() == OrgStruct.STAFF) {
                    loadNum++;
                    memberList.add(currentData.get(i).getId());
                } else if (currentData.get(i).getType() == OrgStruct.DEPTARTMENT) {
                    String url = LoginInfo.baseUrl + "/hrmsv2/v2/api/dept/getTotalStaffInfo?" + "access_token=" + LoginInfo.access_token;
                    JSONObject object = new JSONObject();
                    try {
                        object.put("id", currentData.get(i).getId());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    OkHttpClientManager.postAsyn(url, object, new OkHttpClientManager.ResultCallback<String>() {
                        @Override
                        public void onError(Call call, Exception e) {
                            setLoading(View.GONE);
                            Log.e("ERROR", e.toString());
                            Toast.makeText(getApplicationContext(), "可能由于您同时加载的人数过多，导致超时，创建失败", Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onResponse(String response) {
                            Log.e("Response", response);
                            loadNum++;
                            try {
                                JSONObject resObject = new JSONObject(response);
                                JSONArray resArray = resObject.getJSONArray("returnData");
                                for (int j = 0; j < resArray.length(); j++) {
                                    JSONObject memObject = resArray.getJSONObject(j);
                                    String emp_id = memObject.getString("accountNumber");
                                    memberList.add(emp_id);
                                }

                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            if (loadNum == totalNum) {
                                //所有数据加载完成
                                setLoading(View.GONE);
                                subExistMember();
                                showDialog(checkList);
                               /* */

                            }
                        }
                    });
                }
            }
        }
        if (loadNum == totalNum) {
            setLoading(View.GONE);
            showDialog(checkList);
        }
    }

    /**
     * 邀请新成员时。使用部门编号获取的成员可能已经存在
     * 减去已经存在的成员
     */
    private void subExistMember(){
        if (GroupArray == null || GroupArray.length == 0) {
            return;
        }
        Iterator<String> iterator = memberList.iterator();
        while(iterator.hasNext()){
            String temp_emp_id = iterator.next();
            if(isMemberExist(temp_emp_id)){
                iterator.remove();
            }
        }
    }
    public boolean isMemberExist(String emp_id) {
        if (GroupArray == null || GroupArray.length == 0) {
            return false;
        }
        for (int i = 0; i < GroupArray.length; i++) {
            if (GroupArray[i].equals(emp_id)) {
                return true;
            }
        }
        return false;
    }
    private String getGroupTitle(ArrayList<Boolean> checkList) {
        String groupTitle = "";
        //优先根据部门名称确定讨论组名称
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i)) {
                if (currentData.get(i).getType() == OrgStruct.DEPTARTMENT) {
                    if (groupTitle.equals("")) {
                        groupTitle = currentData.get(i).getName();
                    } else {
                        try {
                            JSONArray currentArray = parentDeptArrayList.get(parentDeptArrayList.size() - 1);
                            if (currentArray.length() > 0) {
                                JSONObject object = currentArray.getJSONObject(currentArray.length() - 1);
                                groupTitle = object.getString("name") + "小分队";
                                return groupTitle;
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i) && currentData.get(i).getType() == OrgStruct.STAFF) {
                JSONArray currentArray = parentDeptArrayList.get(parentDeptArrayList.size() - 1);
                if (currentArray.length() > 0) {
                    JSONObject object = null;
                    try {
                        object = currentArray.getJSONObject(currentArray.length() - 1);
                        groupTitle = object.getString("name") + "小分队";
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    return groupTitle;
                }
            }
        }
        if (groupTitle.equals("")) {
            groupTitle = "讨论组";
        }
        return groupTitle;
    }

    private void inviteNewMember(final ArrayList<String> members) {
        setLoading(View.VISIBLE);
        RongIMClient.getInstance().addMemberToDiscussion(targetId, members, new RongIMClient.OperationCallback() {
            @Override
            public void onSuccess() {
                setLoading(View.GONE);
                Toast.makeText(getApplicationContext(), "已邀请" + members.size() + "位新成员加入群聊", Toast.LENGTH_SHORT).show();
                setResult(1);
                finish();
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                setLoading(View.GONE);
                Toast.makeText(getApplicationContext(), "邀请失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void createNewDiscussion(final ArrayList<String> members, final String title) {
        setLoading(View.VISIBLE);
        if (RongIMClient.getInstance() != null) {
            RongIMClient.getInstance().createDiscussion(title, members, new RongIMClient.CreateDiscussionCallback() {
                @Override
                public void onSuccess(String s) {
                    setLoading(View.GONE);
                    DBhelper dBhelper = new DBhelper(getApplicationContext());
                    dBhelper.addUserInfo(s, title, "http://zhouzybk.img-cn-shanghai.aliyuncs.com/discussionGroupImage1472535269374.png");
                    Toast.makeText(getApplicationContext(), "讨论组创建成功", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(OrgStructActivity.this, HandMulChatActivity.class);
                    intent.putExtra("TYPE", "NORMAL");
                    intent.putExtra("USERID", LoginInfo.userId);//用户Id
                    intent.putExtra("TARGETID", s);
                    intent.putExtra("GROUPNAME", title);
                    intent.putExtra("GROUPICON", members);
                    startActivity(intent);
                    finish();
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    setLoading(View.GONE);
                    Toast.makeText(getApplicationContext(), "fail:" + errorCode, Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (stackDataSet.size() > 0) {
            currentData.clear();
            ArrayList<OrgStruct> tempList = popDataList();
            if (tempList != null) {
                btnOk.setVisibility(View.GONE);
                ckbCheckAll.setChecked(false);
                currentData.addAll(tempList);
                orgStructAdapter.notifyDataSetChanged();
                setNarBar(popParentDeptArray());
            } else {
                super.onBackPressed();
            }
        } else {
            super.onBackPressed();
        }
    }
    private void toCreateOrInviteToDiscussion(ArrayList<Boolean> checkList){
        if (targetId == null) {
            createNewDiscussion(memberList, getGroupTitle(checkList));
            return;
        } else {
            //条件讨论组成员
            inviteNewMember(memberList);
            return;
        }
    }
    private void showDialog(final ArrayList<Boolean> checkList){
        String content = "";
        Boolean flag = false;
        if(memberList.size()==0){
            flag =true;
            content = "您邀请的成员都已在讨论组中，无需重复邀请";
        }else{
            content = "您将邀请"+memberList.size()+"位成员加入到讨论组中！";
        }
        final Boolean finalFlag = flag;
        TipDialog.Builder builder = new TipDialog.Builder(this);
        builder.setContent(content)
        .setPositiveButton("确定", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                if(finalFlag){
                    dialogInterface.dismiss();
                    return;
                }else{
                    toCreateOrInviteToDiscussion(checkList);
                    return;
                }
            }
         })
         .setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
            }
        }).create().show();
    }
}
