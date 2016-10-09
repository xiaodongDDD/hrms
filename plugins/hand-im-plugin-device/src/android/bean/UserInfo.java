package com.hand.im.bean;

/**
 * Created by panx on 2016/8/24.
 */
public class UserInfo {
    private String emp_code;
    private String avatar;
    private String emp_name;

    public String getEmp_code() {
        return emp_code;
    }

    public void setEmp_code(String emp_code) {
        this.emp_code = emp_code;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getEmp_name() {
        return emp_name;
    }

    public void setEmp_name(String emp_name) {
        this.emp_name = emp_name;
    }

    @Override
    public String toString() {
        return "UserInfo{" +
                "emp_code='" + emp_code + '\'' +
                ", avatar='" + avatar + '\'' +
                ", emp_name='" + emp_name + '\'' +
                '}';
    }
}
