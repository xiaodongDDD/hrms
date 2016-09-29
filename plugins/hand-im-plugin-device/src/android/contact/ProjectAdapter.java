package com.hand.im.contact;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.hand.im.Util;
import com.hand.im.bean.Project;

import java.util.ArrayList;

/**
 * Created by panx on 2016/9/23.
 */
public class ProjectAdapter extends BaseAdapter {
    private ArrayList<Project> data;
    private Context context;
    private LayoutInflater mInflater;

    public ProjectAdapter(Context context, ArrayList<Project> data) {
        this.data = data;
        this.context = context;
        mInflater = LayoutInflater.from(context);
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
    public View getView(int position, View view, ViewGroup viewGroup) {
        ViewHolder holder;
        if(view == null){
            holder = new ViewHolder();
            view = mInflater.inflate(Util.getRS("item_project","layout",context),null);
            holder.imgProjectType = (ImageView)view.findViewById(Util.getRS("imgProjectType","id",context));
            holder.txtProjectName = (TextView)view.findViewById(Util.getRS("projectName","id",context));
            view.setTag(holder);
        }else{
            holder = (ViewHolder) view.getTag();
        }
        String projectName = data.get(position).getProject_name();
        if(projectName.length()>20){
            projectName = projectName.substring(0,20)+"...";
        }
        holder.txtProjectName .setText(projectName);
        if(data.get(position).getProject_name().contains("汉得内部项目")){
            holder.imgProjectType.setImageResource(Util.getRS("project_icon_in","drawable",context));
        }else {
            holder.imgProjectType.setImageResource(Util.getRS("project_icon_out", "drawable", context));
        }
        return view;
    }

    public static final class ViewHolder{
        public ImageView imgProjectType;
        public TextView txtProjectName;
    }
}
