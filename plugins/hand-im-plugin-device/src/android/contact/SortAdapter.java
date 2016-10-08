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
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.TextView;
import com.hand.im.LoginInfo;
import com.hand.im.Util;
import com.hand.im.okhttp.OkHttpClientManager;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.display.RoundedBitmapDisplayer;

import java.util.ArrayList;
import java.util.List;

public class SortAdapter extends BaseAdapter {
    private Context context;
    private List<PersonBean> persons;
    private LayoutInflater inflater;
    private static List<Boolean> checkList = new ArrayList<Boolean>();
    private List<ImageView> imgList = new ArrayList<ImageView>();
    private Button btnOK;
    private DisplayImageOptions options;
    private String[] GroupArray;

    public SortAdapter(Context context, List<PersonBean> persons, Button btnOK) {
        this.context = context;
        this.persons = persons;
        this.btnOK = btnOK;
        this.inflater = LayoutInflater.from(context);
        for (int i = 0; i < persons.size(); i++) {
            checkList.add(false);
        }
        initOptions();
    }
    public SortAdapter(Context context,List<PersonBean> persons,Button btnOK,String[] GroupArray){
        this.context = context;
        this.persons = persons;
        this.btnOK = btnOK;
        this.GroupArray = GroupArray;
        this.inflater = LayoutInflater.from(context);
        for (int i = 0; i < persons.size(); i++) {
            checkList.add(false);
        }
        initOptions();
    }
    @Override
    public int getCount() {
        // TODO Auto-generated method stub
        return persons.size();
    }

    @Override
    public Object getItem(int position) {
        // TODO Auto-generated method stub
        return persons.get(position);
    }

    @Override
    public long getItemId(int position) {
        // TODO Auto-generated method stub
        return position;
    }
    private void initOptions() {
        options = new DisplayImageOptions.Builder()
//                .showImageOnLoading(R.drawable.picture_loading)
//                .showImageOnFail(R.drawable.pictures_no)
                .showImageOnLoading(Util.getRS("picture_loading", "drawable", context))
                .showImageOnFail(Util.getRS("pictures_no", "drawable", context))
                .cacheOnDisk(true)
                .cacheInMemory(true)
                .displayer(new RoundedBitmapDisplayer(100)) // 设置成圆角图片
                .bitmapConfig(Bitmap.Config.RGB_565)
                .resetViewBeforeLoading(true)
                .build();
    }
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewholder = null;
        PersonBean person = persons.get(position);
        if (convertView == null) {
            viewholder = new ViewHolder();
            convertView = inflater.inflate(Util.getRS("list_item", "layout", context), null);
            viewholder.tv_tag = (TextView) convertView.findViewById(Util.getRS("tv_lv_item_tag","id",context));
            viewholder.tv_name = (TextView) convertView.findViewById(Util.getRS("tv_lv_item_name","id",context));
            viewholder.line = (View) convertView.findViewById(Util.getRS("view_lv_item_line","id",context));
            viewholder.checkToGroup = (CheckBox) convertView.findViewById(Util.getRS("cbToGroup","id",context));
            viewholder.imgAvatar = (ImageView) convertView.findViewById(Util.getRS("iv_lv_item_head","id",context));
            imgList.add(viewholder.imgAvatar);
            convertView.setTag(viewholder);

        } else {
            viewholder = (ViewHolder) convertView.getTag();
        }
        int selection = person.getFirstPinYin().charAt(0);
        int positionForSelection = getPositionForSelection(selection);
        if (position == positionForSelection) {
            viewholder.tv_tag.setVisibility(View.VISIBLE);
            viewholder.tv_tag.setText(person.getFirstPinYin());
            viewholder.line.setVisibility(View.GONE);
        } else {
            viewholder.tv_tag.setVisibility(View.GONE);
            viewholder.line.setVisibility(View.VISIBLE);
        }
        if(person.getId().equals(LoginInfo.userId)||isMemberExist(person.getId())){
            viewholder.checkToGroup.setVisibility(View.INVISIBLE);
        }else{
            viewholder.checkToGroup.setVisibility(View.VISIBLE);
        }

        viewholder.tv_name.setText(person.getName());
        if (person.getAvatar() != null&&!person.getAvatar().equals("")) {
            ImageLoader.getInstance().displayImage(person.getAvatar(), viewholder.imgAvatar, options);
        }else{
            viewholder.imgAvatar.setImageResource(Util.getRS("head_1","drawable",context));
        }

        viewholder.checkToGroup.setChecked(checkList.get(position));
        viewholder.checkToGroup.setTag(position);
        viewholder.checkToGroup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int id = Integer.parseInt(view.getTag().toString());
                if(checkList.get(id)){
                    checkList.set(id,false);
                    ((CheckBox)view).setChecked(false);
                }else{
                    checkList.set(id,true);
                    ((CheckBox)view).setChecked(true);
                }
                if (!isHaveCheck()) {
                    btnOK.setVisibility(View.GONE);
                } else {
                    btnOK.setVisibility(View.VISIBLE);
                }
            }
        });
        return convertView;
    }

    private boolean isHaveCheck() {
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i)) {
                return true;
            }
        }
        return false;
    }

    public int getPositionForSelection(int selection) {
        for (int i = 0; i < persons.size(); i++) {
            String Fpinyin = persons.get(i).getFirstPinYin();
            char first = Fpinyin.toUpperCase().charAt(0);
            if (first == selection) {
                return i;
            }
        }
        return -1;
    }

    class ViewHolder {
        ImageView imgAvatar;
        TextView tv_tag;
        TextView tv_name;
        View line;
        CheckBox checkToGroup;
    }

    @Override
    public void notifyDataSetChanged() {
        checkList.clear();
        imgList.clear();
        super.notifyDataSetChanged();
        for (int i = 0; i < persons.size(); i++) {
            checkList.add(false);
        }
    }

    public ArrayList<String> getDealMember() {
        ArrayList<String> members = new ArrayList<String>();
        for (int i = 0; i < checkList.size(); i++) {
            if (checkList.get(i)) {
                members.add(persons.get(i).getId());
            }
        }
        return members;
    }

    public String getTitle() {
        String title = LoginInfo.userName;
        int n = 0;
        for (int i = 0; i < checkList.size() && n < 3; i++) {
            if (checkList.get(i)) {
                title = title +"、"+persons.get(i).getName() ;
                n++;
            }
        }
        return title;
    }
    public boolean isMemberExist(String id){
        if(GroupArray==null||GroupArray.length==0){
            return false;
        }
        for(int i=0;i<GroupArray.length;i++){
            if(GroupArray[i].equals(id)){
                return true;
            }
        }
        return false;
    }
}
