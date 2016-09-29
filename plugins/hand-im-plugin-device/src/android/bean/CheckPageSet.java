package com.hand.im.bean;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

/**
 * Created by panx on 2016/9/21.
 */
public class CheckPageSet {
    private String ParentDeptID;//当前的父级部门的id
    private ArrayList<OrgStruct> dataSet;//当前层级的页面内容
    private JSONArray parentArray;//当前页面所属的层次结构
    private ArrayList<Boolean> checkList;

    public String getParentDeptID() {
        return ParentDeptID;
    }

    public void setParentDeptID(String parentDeptID) {
        ParentDeptID = parentDeptID;
    }

    public ArrayList<OrgStruct> getDataSet() {
        return dataSet;
    }

    public void setDataSet(ArrayList<OrgStruct> dataSet) {
        this.dataSet = dataSet;
    }

    public JSONArray getParentArray() {
        return parentArray;
    }

    public void setParentArray(JSONArray parentArray) {
        this.parentArray = parentArray;
    }

    public ArrayList<Boolean> getCheckList() {
        return checkList;
    }

    public void setCheckList(ArrayList<Boolean> checkList) {
        this.checkList = checkList;
    }

    //获取上一级别的父id
    public String getUpLevelParentId(){
        String id ="0";
        try {
            id = parentArray.getJSONObject(parentArray.length()-1).getString("parentId");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return id;
    }
}
