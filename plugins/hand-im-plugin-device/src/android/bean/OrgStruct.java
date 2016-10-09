package com.hand.im.bean;

import java.util.ArrayList;

/**
 * Created by panx on 2016/9/18.
 */
public class OrgStruct {
    public static final int DEPTARTMENT = 0;
    public static final int STAFF = 1;
    //部门和员工的公共属性
    private String id;
    private String name;
    private int type;
    //部门
    private String totalStaffNumber;
    //员工
    private String avatar;
    private String deptName;

    public String getTotalStaffNumber() {
        return totalStaffNumber;
    }

    public void setTotalStaffNumber(String totalStaffNumber) {
        this.totalStaffNumber = totalStaffNumber;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }
}
