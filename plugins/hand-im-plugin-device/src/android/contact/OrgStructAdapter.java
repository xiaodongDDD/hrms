package com.hand.im.contact;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
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
import com.hand.im.bean.CheckPageSet;
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
        final ViewHolder holder;
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
        if(isInMemberList(data.get(position).getId())){
            holder.checkBox.setChecked(true);
            checkList.set(position,true);
        }
        if (data.get(position).getType() == OrgStruct.DEPTARTMENT) {
            if(checkList.get(position)){
                holder.rltNextLevel.setBackgroundColor(0xFFF2F2F2);
            }else{
                holder.rltNextLevel.setBackgroundColor(0xFFFFFFFF);
            }
            holder.rltNextLevel.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if(checkList.get(position)){
                        return;
                    }
                    String deptId = data.get(position).getId();
                    callBack.nextLevel(deptId);
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
                if(getItemViewType(position)==OrgStruct.DEPTARTMENT){
                    if(checkList.get(position)){
                        holder.rltNextLevel.setBackgroundColor(0xFFF2F2F2);
                    }else{
                        holder.rltNextLevel.setBackgroundColor(0xFFFFFFFF);
                    }
                }
                if(getItemViewType(position)==OrgStruct.STAFF){
                    if(!checkList.get(position)){
                        refreshMemberList(data.get(position).getId(),false);
                    }
                }
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

    public void setCheckList(){
        checkList.clear();
        for(int i=0;i<data.size();i++){
            checkList.add(false);
        }
    }
    public void setCheckList(ArrayList<Boolean> checkList){
        this.checkList.clear();
        this.checkList.addAll(checkList);
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

        if (isAllChecked()) {
            callBack.setCheckAll(true);
        } else {
            callBack.setCheckAll(false);
        }
        refreshCheckInfo();
    }
    /**
     *
     * @param emp_id
     * @param b 为true时添加，false时删除
     */
    private void refreshMemberList(String emp_id,boolean b){
        if(!b){
            CreateDisInfo.removeMember(emp_id);
        }
    }
    private void refreshCheckInfo() {

        callBack.setCheckInfo();
    }

    public ArrayList<Boolean> getCheckList() {
        ArrayList<Boolean> reCheckList = new ArrayList<Boolean>();
        reCheckList.addAll(checkList);
        return reCheckList;
    }
    //成员已经在讨论组中，邀请成员时使用
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
    //成员在准备添加的memberList中
    public boolean isInMemberList(String emp_id){
        return CreateDisInfo.isInMemberList(emp_id);
    }
}
