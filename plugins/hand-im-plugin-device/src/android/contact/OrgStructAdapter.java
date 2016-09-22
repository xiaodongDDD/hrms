package com.hand.im.contact;

import android.content.Context;
import android.graphics.Bitmap;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.bean.OrgStruct;
import com.hand.im.okhttp.OkHttpClientManager;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.display.RoundedBitmapDisplayer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;

/**
 * Created by panx on 2016/9/18.
 */
public class OrgStructAdapter extends BaseAdapter {
    private List<OrgStruct> data;
    private Context context;
    private LayoutInflater mInflater;
    private ArrayList<Boolean> checkList = new ArrayList<Boolean>();
    private DisplayImageOptions options;
    private OrgStructActivity.OrgStructCallBack callBack;
    private String[] GroupArray;

    public OrgStructAdapter(List<OrgStruct> data, Context context, String[] GroupArray, OrgStructActivity.OrgStructCallBack callBack) {
        this.data = data;
        this.context = context;
        this.GroupArray = GroupArray;
        mInflater = LayoutInflater.from(context);
        this.callBack = callBack;
        initOptions();
        for (int i = 0; i < data.size(); i++) {
            checkList.add(false);
        }
    }

    @Override
    public int getCount() {
        return data.size();
    }

    @Override
    public Object getItem(int i) {
        return data.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public int getItemViewType(int position) {
        return data.get(position).getType();
    }

    @Override
    public int getViewTypeCount() {
        return 2;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup viewGroup) {
        ViewHolder holder;
        if (convertView == null) {
            if (data.get(position).getType() == OrgStruct.DEPTARTMENT) {
                holder = new ViewHolder();
                convertView = mInflater.inflate(Util.getRS("item_org_org", "layout", context), null);
                holder.checkBox = (CheckBox) convertView.findViewById(Util.getRS("ckbCheckOrg", "id", context));
                holder.txtName = (TextView) convertView.findViewById(Util.getRS("txtOrg", "id", context));
                holder.rltNextLevel = (RelativeLayout) convertView.findViewById(Util.getRS("nextLevel", "id", context));
            } else {
                holder = new ViewHolder();
                convertView = mInflater.inflate(Util.getRS("item_org_person", "layout", context), null);
                holder.checkBox = (CheckBox) convertView.findViewById(Util.getRS("ckbCheckStaff", "id", context));
                holder.avatar = (ImageView) convertView.findViewById(Util.getRS("imgHeader", "id", context));
                holder.txtName = (TextView) convertView.findViewById(Util.getRS("txtStaff", "id", context));
            }
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        holder.checkBox.setTag(position);
        holder.checkBox.setChecked(checkList.get(position));
        if (isMemberExist(data.get(position).getId())) {
            holder.checkBox.setChecked(true);
        }
        if (data.get(position).getType() == OrgStruct.DEPTARTMENT) {
            holder.rltNextLevel.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    String deptId = data.get(position).getId();
                    refreshData(deptId);
                }
            });
            holder.txtName.setText(data.get(position).getName() + "(" + data.get(position).getTotalStaffNumber() + ")");
        } else {
            holder.txtName.setText(data.get(position).getName());
            if (data.get(position).getAvatar() != null && !data.get(position).getAvatar().equals("") && !data.get(position).getAvatar().equals("null")) {
                ImageLoader.getInstance().displayImage(data.get(position).getAvatar(), holder.avatar, options);
            } else {
                holder.avatar.setImageResource(Util.getRS("head_1", "drawable", context));
            }
        }
        holder.checkBox.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setCheckStatus(view);

            }
        });
        return convertView;
    }

    public final class ViewHolder {
        public CheckBox checkBox;
        public TextView txtName;
        public ImageView avatar;
        public RelativeLayout rltNextLevel;
    }

    //初始化加载头像时的参数
    private void initOptions() {
        options = new DisplayImageOptions.Builder()
                //.showImageOnLoading(R.drawable.picture_loading)
                //.showImageOnFail(R.drawable.pictures_no)
                .showImageOnLoading(Util.getRS("picture_loading", "drawable", context))
                .showImageOnFail(Util.getRS("pictures_no", "drawable", context))
                .cacheOnDisk(true)
                .cacheInMemory(true)
                .displayer(new RoundedBitmapDisplayer(100)) // 设置成圆角图片
                .bitmapConfig(Bitmap.Config.RGB_565)
                .resetViewBeforeLoading(true)
                .build();
    }

    //加载动画的显示与隐藏
    private void setLoading(int status) {
        callBack.setLoading(status);
    }

    @Override
    public void notifyDataSetChanged() {
        checkList.clear();
        for (int i = 0; i < data.size(); i++) {
            checkList.add(false);
        }
        refreshCheckInfo();
        super.notifyDataSetChanged();
    }

    //点击下级时刷新数据
    private void refreshData(String deptId) {
        callBack.setCheckAll(false);
        data.clear();
        notifyDataSetChanged();
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
                data.addAll(tempDataList);
                callBack.pushDataSet(tempDataList);
                notifyDataSetChanged();
                setLoading(View.GONE);
            }
        });
    }

    //处理获取到的数据
    private ArrayList<OrgStruct> dealDataList(String data) {
        ArrayList<OrgStruct> tempList = new ArrayList<OrgStruct>();
        JSONObject object = new JSONObject();
        JSONArray deptArray = new JSONArray();
        JSONArray staffArray = new JSONArray();
        try {
            object = new JSONObject(data).getJSONObject("returnData");
            deptArray = object.getJSONArray("childrenDept");
            staffArray = object.getJSONArray("deptStaff");
            callBack.setParentArray(object.getJSONArray("deptInfo"));
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

    public void checkAll() {
        for (int i = 0; i < checkList.size(); i++) {
            if(!isMemberExist(data.get(i).getId())) {
                checkList.set(i, true);
            }
        }
        refreshCheckInfo();
        if(isHaveCheck()){
            callBack.setOkButton(View.VISIBLE);
        }
        super.notifyDataSetChanged();
    }

    public void unCheckAll() {
        callBack.setOkButton(View.GONE);
        for (int i = 0; i < checkList.size(); i++) {
            checkList.set(i, false);
        }
        refreshCheckInfo();
        super.notifyDataSetChanged();
    }

    private boolean isHaveCheck() {
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i)) {
                return true;
            }
        }
        return false;
    }

    private boolean isAllChecked() {
        for (int i = 0; i < checkList.size(); i++) {
            if (!checkList.get(i)) {
                return false;
            }
        }
        return true;
    }

    public void setCheckStatus(View view) {
        int id = Integer.parseInt(view.getTag().toString());
        if (isMemberExist(data.get(id).getId())) {
            ((CheckBox) view).setChecked(true);
            return;
        }
        if (checkList.get(id)) {
            checkList.set(id, false);
            ((CheckBox) view).setChecked(false);
        } else {
            checkList.set(id, true);
            ((CheckBox) view).setChecked(true);
        }
        if (isHaveCheck()) {
            callBack.setOkButton(View.VISIBLE);
        } else {
            callBack.setOkButton(View.GONE);
        }
        if (isAllChecked()) {
            callBack.setCheckAll(true);
        } else {
            callBack.setCheckAll(false);
        }
        refreshCheckInfo();
    }

    private void refreshCheckInfo() {
        int checkNum = 0;
        int deptNum = 0;
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i)) {
                if (data.get(i).getType() == OrgStruct.STAFF) {
                    checkNum++;
                }
                if (data.get(i).getType() == OrgStruct.DEPTARTMENT) {
                    deptNum++;
                    checkNum = checkNum + Integer.valueOf(data.get(i).getTotalStaffNumber());
                }
            }
        }
        if (checkNum == 0) {
            callBack.setCheckInfo("");
        } else {
            callBack.setCheckInfo(checkNum + "人，其中包含" + deptNum + "个部门");
        }
    }

    public ArrayList<Boolean> getCheckList() {
        return checkList;
    }

    public boolean isMemberExist(String emp_id) {
        if(emp_id!=null&&emp_id.equals(LoginInfo.userId)){
            return true;
        }
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
}
