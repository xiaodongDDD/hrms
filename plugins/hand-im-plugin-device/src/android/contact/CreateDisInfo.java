package com.hand.im.contact;

import android.util.Log;
import android.widget.Toast;

import com.hand.im.bean.CheckPageSet;
import com.hand.im.bean.OrgStruct;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by panx on 2016/9/22.
 */
public class CreateDisInfo {
    public static List<CheckPageSet> historyCheckPageSet = new ArrayList<CheckPageSet>();
    public static int currentPageNo = -1;
    public static List<PersonBean> memberList = new ArrayList<PersonBean>();

    public static void reset() {
        historyCheckPageSet.clear();
        currentPageNo = -1;
        memberList.clear();
    }

    public static boolean isMenberExist(String emp_id) {
        if (isInMemberList(emp_id)) {
            return true;
        }
        for (int i = 0; i < historyCheckPageSet.size(); i++) {
            ArrayList<Boolean> checkList = historyCheckPageSet.get(i).getCheckList();
            ArrayList<OrgStruct> data = historyCheckPageSet.get(i).getDataSet();
            for (int j = 0; j < checkList.size(); j++) {
                if (checkList.get(j) && data.get(j).getId().equals(emp_id)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean isInMemberList(String emp_id) {
        for (int i = 0; i < memberList.size(); i++) {
            if (emp_id.equals(memberList.get(i).getId())) {
                return true;
            }
        }
        return false;
    }

    public static void addMember(PersonBean person) {
        if (!isMenberExist(person.getId())) {
            memberList.add(person);
        }
    }

    public static void removeMember(PersonBean person) {
        Iterator<PersonBean> it = memberList.iterator();
        while ((it.hasNext())){
            PersonBean p = it.next();
            if(p.getId().equals(person.getId())){
                it.remove();
            }
        }
    }

    public static String getCreateInfo() {
        String rtInfo = "";
        int staffNo = memberList.size();
        int deptNo = 0;
        for (int i = 0; i < historyCheckPageSet.size(); i++) {
            ArrayList<OrgStruct> tempList = historyCheckPageSet.get(i).getDataSet();
            ArrayList<Boolean> checkList = historyCheckPageSet.get(i).getCheckList();
            for (int j = 0; j < checkList.size(); j++) {
                if (checkList.get(j)) {
                    if (tempList.get(j).getType() == OrgStruct.DEPTARTMENT) {
                        staffNo = staffNo + Integer.parseInt(tempList.get(j).getTotalStaffNumber());
                        deptNo++;
                    } else {
                        staffNo++;
                    }
                }
            }
        }
        if (deptNo != 0) {
            rtInfo = staffNo + "人，其中包含" + deptNo + "个部门";
        } else {
            rtInfo = staffNo + "人";
        }
        return rtInfo;
    }

    private static int totalNum = 0;
    private static int loadNum = 0;
    private static ArrayList<PersonBean> rtMemberList;

    /**
     * 创建讨论组前获取所有数据
     * @return
     */
    public static void getMemberList(final CreateCallBack callBack) {
        totalNum = 0;
        loadNum = 0;
        rtMemberList = new ArrayList<PersonBean>();
        for (int i = 0; i < memberList.size(); i++) {
            addToRtMemberList(rtMemberList, memberList.get(i));
        }
        for (int i = 0; i < historyCheckPageSet.size(); i++) {
            ArrayList<Boolean> checkList = historyCheckPageSet.get(i).getCheckList();
            for (int j = 0; j < checkList.size(); j++) {
                if (checkList.get(j)) {
                    totalNum++;
                }
            }
        }
        if(totalNum==0){
            callBack.response(memberList);
        }
        ContactDataSource contactDataSource = new ContactDataSource();
        for (int i = 0; i < historyCheckPageSet.size(); i++) {
            ArrayList<OrgStruct> data = historyCheckPageSet.get(i).getDataSet();
            ArrayList<Boolean> checkList = historyCheckPageSet.get(i).getCheckList();
            for (int j = 0; j < checkList.size(); j++) {
                if (checkList.get(j) && data.get(j).getType() == OrgStruct.DEPTARTMENT) {
                    contactDataSource.getTotalStaffByDeptId(data.get(j).getId(), new ContactDataSource.DataSourceCallBack<ArrayList<PersonBean>>() {
                        @Override
                        public void error(String msg) {
                            Log.e("error", msg);
                            callBack.error(msg);
                        }

                        @Override
                        public void response(ArrayList<PersonBean> members) {
                            loadNum++;
                            addAllToRtMemberList(rtMemberList, members);
                            //所有数据均以加载完成
                            if (loadNum == totalNum) {
                                callBack.response(rtMemberList);
                                //Log.e("NUM", "all done:" + rtMemberList.size());
                            }
                        }
                    });
                } else if (checkList.get(j) && data.get(j).getType() == OrgStruct.STAFF) {
                    PersonBean person = new PersonBean();
                    person.setId(data.get(j).getId());
                    person.setAvatar(data.get(j).getAvatar());
                    addToRtMemberList(rtMemberList, person);
                    loadNum++;
                    if (loadNum == totalNum) {
                        callBack.response(rtMemberList);
                        //Log.e("NUM", "all done:" + rtMemberList.size());
                    }
                }

            }
        }
    }

    private static void addAllToRtMemberList(ArrayList<PersonBean> rtMemberList, ArrayList<PersonBean> members) {
        for (int i = 0; i < members.size(); i++) {
            addToRtMemberList(rtMemberList, members.get(i));
        }
    }

    private static void addToRtMemberList(ArrayList<PersonBean> rtMemberList, PersonBean person) {
        if (!isInRtMemberList(rtMemberList, person.getId())) {
            rtMemberList.add(person);
        }
    }

    private static boolean isInRtMemberList(ArrayList<PersonBean> rtMemberList, String emp_id) {
        for (int i = 0; i < rtMemberList.size(); i++) {
            if (rtMemberList.get(i).getId().equals(emp_id)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 初始化讨论组名称
     * @return
     */
    public static String getGroupTitle(){
        String title="";
        int n=0;
        //优先根据部门名称命名讨论组
        for(int i=0;i<historyCheckPageSet.size();i++){
            ArrayList<OrgStruct> data = historyCheckPageSet.get(i).getDataSet();
            ArrayList<Boolean> checkList = historyCheckPageSet.get(i).getCheckList();
            for(int j = 0;j<checkList.size();j++){
                if(checkList.get(j)&&data.get(j).getType()==OrgStruct.DEPTARTMENT){
                    title = title+data.get(j).getName()+"、";
                    n++;
                    if(n>=3){
                        return title.substring(0,title.length()-1);
                    }
                }
            }
        }

        //根据讨论组成员命名讨论组
        for(int i=0;i<historyCheckPageSet.size();i++){
            ArrayList<OrgStruct> data = historyCheckPageSet.get(i).getDataSet();
            ArrayList<Boolean> checkList = historyCheckPageSet.get(i).getCheckList();
            for(int j = 0;j<checkList.size();j++){
                if(checkList.get(j)&&data.get(j).getType()==OrgStruct.STAFF){
                    title = title+data.get(j).getName()+"、";
                    n++;
                    if(n>=4){
                        return title.substring(0,title.length()-1);
                    }
                }
            }
        }

        for(int i=0;i<memberList.size();i++){
            title = title+memberList.get(i).getName()+"、";
            n++;
            if(n>=4){
                return title.substring(0,title.length()-1);
            }
        }
        if(!title.equals("")){
            return title.substring(0,title.length()-1);
        }else{
            title= "讨论组";
        }
        return title;
    }
    public static abstract class CreateCallBack<T>{
        public abstract void error(String msg);
        public abstract void response(T object);
    }
}
