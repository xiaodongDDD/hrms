package com.hand.im.model;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by cool on 2016/9/6.
 */
public class CallMemberModel implements Parcelable {
    public boolean isChecked;
    public String emp_name;
    public String emp_code;
    public String avatar;

    public CallMemberModel(boolean isChecked, String emp_name, String emp_code, String avatar) {
        this.isChecked = isChecked;
        this.emp_name = emp_name;
        this.emp_code = emp_code;
        this.avatar = avatar;
    }

    protected CallMemberModel(Parcel in) {
        isChecked = in.readByte() != 0;
        emp_name = in.readString();
        emp_code = in.readString();
        avatar = in.readString();
    }

    public static final Creator<CallMemberModel> CREATOR = new Creator<CallMemberModel>() {
        @Override
        public CallMemberModel createFromParcel(Parcel in) {
            return new CallMemberModel(in);
        }

        @Override
        public CallMemberModel[] newArray(int size) {
            return new CallMemberModel[size];
        }
    };

    public boolean isChecked() {
        return isChecked;
    }

    public void setIsChecked(boolean isChecked) {
        this.isChecked = isChecked;
    }

    public String getEmp_name() {
        return emp_name;
    }

    public void setEmp_name(String emp_name) {
        this.emp_name = emp_name;
    }

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

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeByte((byte) (isChecked ? 1 : 0));
        dest.writeString(emp_name);
        dest.writeString(emp_code);
        dest.writeString(avatar);
    }
}
