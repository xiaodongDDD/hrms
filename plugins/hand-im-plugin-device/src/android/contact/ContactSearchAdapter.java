package com.hand.im.contact;

import android.content.Context;
import android.graphics.Bitmap;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.display.RoundedBitmapDisplayer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by panx on 2016/9/22.
 */
public class ContactSearchAdapter extends BaseAdapter {
    private ArrayList<PersonBean> data;
    private Context context;
    private DisplayImageOptions options;
    private LayoutInflater mInflater;
    private List<Boolean> checkList = new ArrayList<Boolean>();
    private DataCheckCallBack checkCallBack;
    private String[] GroupArray;

    public ContactSearchAdapter(Context context, ArrayList<PersonBean> data, DataCheckCallBack callBack,String[] GroupArray){
        this.checkCallBack = callBack;
        this.context = context;
        this.data = data;
        this.GroupArray = GroupArray;
        mInflater = LayoutInflater.from(context);
        for(int i=0;i<data.size();i++){
            checkList.add(false);
        }
        initOptions();
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
    public View getView(final int position, View convertView, ViewGroup viewGroup) {
        ViewHolder holder;
        if(convertView == null){
            holder = new ViewHolder();
            convertView = mInflater.inflate(Util.getRS("item_staff","layout",context),null);
            holder.checkBox = (CheckBox) convertView.findViewById(Util.getRS("ckbCheckStaff", "id", context));
            holder.avatar = (ImageView) convertView.findViewById(Util.getRS("imgHeader", "id", context));
            holder.txtName = (TextView) convertView.findViewById(Util.getRS("txtStaff", "id", context));
            holder.txtEmail = (TextView) convertView.findViewById(Util.getRS("txtEmail","id",context));
            convertView.setTag(holder);
        }else{
            holder=(ViewHolder) convertView.getTag();
        }
        holder.txtName.setText(data.get(position).getName()+"("+data.get(position).getId()+")");
        holder.txtEmail.setText(data.get(position).getEmail());
        if (data.get(position).getAvatar() != null && !data.get(position).getAvatar().equals("") && !data.get(position).getAvatar().equals("null")) {
            ImageLoader.getInstance().displayImage(data.get(position).getAvatar(), holder.avatar, options);
        } else {
            holder.avatar.setImageResource(Util.getRS("head_1", "drawable", context));
        }
        holder.checkBox.setTag(position);
        holder.checkBox.setChecked(checkList.get(position));
        if(isMemberExist(data.get(position).getId())){
            holder.checkBox.setChecked(true);
            checkList.set(position,true);
        }
        if(isMemberInDiscussion(data.get(position).getId())){
            holder.checkBox.setChecked(true);
        }
        holder.checkBox.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.e("id",1+"");
                int id = Integer.parseInt(view.getTag().toString());
                if(isMemberInDiscussion(data.get(id).getId())){
                    Log.e("id",2+"");
                    ((CheckBox)view).setChecked(true);
                    return;
                }
                if(checkList.get(id)){
                    Log.e("id",3+"");
                    checkList.set(id,false);
                    refreshMemberList(data.get(position),false);
                }else{
                    Log.e("id",4+"");
                    checkList.set(id,true);
                    refreshMemberList(data.get(position),true);
                }
                checkCallBack.setCheckInfo();
            }
        });
        return convertView;
    }
    public final class ViewHolder{
        public CheckBox checkBox;
        public TextView txtName;
        public ImageView avatar;
        public TextView txtEmail;
    }

    @Override
    public void notifyDataSetChanged() {
        checkList.clear();
        for(int i=0;i<data.size();i++){
            checkList.add(false);
        }
        super.notifyDataSetChanged();
    }

    /**
     *
     * @param person
     * @param b 为true时添加，false时删除
     */
    private void refreshMemberList(PersonBean person,boolean b){
        if(b){
            CreateDisInfo.addMember(person);
        }else{
            CreateDisInfo.removeMember(person);
        }
    }
    public void checkAll(){
        for(int i=0;i<data.size();i++){
            if(data.get(i).getId().equals(LoginInfo.userId)){
                continue;
            }
            checkList.set(i,true);
            refreshMemberList(data.get(i),true);
        }
        super.notifyDataSetChanged();
        checkCallBack.setCheckInfo();
    }
    public void unCheckAll(){
        for(int i=0;i<data.size();i++){
            if(data.get(i).getId().equals(LoginInfo.userId)){
                continue;
            }
            checkList.set(i,false);
            refreshMemberList(data.get(i),false);
        }
        super.notifyDataSetChanged();
        checkCallBack.setCheckInfo();
    }
    private boolean isMemberExist(String emp_id){
        return CreateDisInfo.isMenberExist(emp_id);
    }

    private boolean isMemberInDiscussion(String emp_id){
        if(emp_id.equals(LoginInfo.userId)){
            return true;
        }
        if(GroupArray==null||GroupArray.length==0){
            return false;
        }
        for(int i=0;i<GroupArray.length;i++){
            if(emp_id.equals(GroupArray[i])){
                return true;
            }
        }
        return false;
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
}
