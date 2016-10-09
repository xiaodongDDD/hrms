package com.hand.im.contact;

import android.util.Log;

import com.hand.im.LoginInfo;
import com.hand.im.bean.Project;
import com.hand.im.okhttp.OkHttpClientManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import okhttp3.Call;

/**
 * Created by panx on 2016/9/23.
 */
public class ContactDataSource {
    private String projectUrl = LoginInfo.baseUrl + "/hrmsv2/v2/api/l/api_resources_query/get_personal_projects?access_token=" + LoginInfo.access_token;
    private String projectInfoUrl = LoginInfo.baseUrl + "/hrmsv2/v2/api/l/api_resources_query/get_project_member?access_token=" + LoginInfo.access_token;
    private String mulStaffImageUrl = LoginInfo.baseUrl + "/hrmsv2/v2/api/staff/detailList?access_token=" + LoginInfo.access_token;
    private String totalStaffUrl = LoginInfo.baseUrl + "/hrmsv2/v2/api/dept/getTotalStaffInfo?access_token=" + LoginInfo.access_token;
    //private String userDetailUrl = LoginInfo.baseUrl + "/hrmsv2/v2/api/staff/detail?" + "access_token=" + LoginInfo.access_token;

    /**
     * 获取项目列表
     *
     * @param p_employee_number
     * @param callBack
     */
    public void getProjectList(String p_employee_number, final DataSourceCallBack callBack) {
        JSONObject object = new JSONObject();
        JSONObject paramsObject = new JSONObject();
        try {
            paramsObject.put("p_employee_number", p_employee_number);
            object.put("params", paramsObject);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        OkHttpClientManager.postAsyn(projectUrl, object, new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
                Log.e("error", e.toString());
                callBack.error(e.toString());
            }

            @Override
            public void onResponse(String response) {
                ArrayList<Project> projectList = dealProjectList(response);
                if (projectList == null) {
                    callBack.error("获取数据失败");
                    return;
                }
                callBack.response(projectList);

            }
        });
    }

    private ArrayList<Project> dealProjectList(String response) {
        ArrayList<Project> projectList = new ArrayList<Project>();
        try {
            JSONObject rootObject = new JSONObject(response);
            JSONObject returnDataObject = rootObject.getJSONObject("returnData");
            JSONArray projectArray = returnDataObject.getJSONArray("my_project_list");
            for (int i = 0; i < projectArray.length(); i++) {
                Project project = new Project();
                JSONObject projectObject = projectArray.getJSONObject(i);
                project.setProject_id(projectObject.getString("project_id"));
                project.setProject_name(projectObject.getString("project_name"));
                projectList.add(project);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
        return projectList;

    }

    /**
     * 获取项目中的成员列表
     *
     * @param p_project_id
     * @param callBack
     */
    public void getProjectInfoList(String p_project_id, final DataSourceCallBack callBack) {

        JSONObject object = new JSONObject();
        JSONObject paramsObject = new JSONObject();
        try {
            paramsObject.put("p_project_id", p_project_id);
            object.put("params", paramsObject);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        OkHttpClientManager.postAsyn(projectInfoUrl, object, new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
                callBack.error(e.toString());
            }

            @Override
            public void onResponse(String response) {

                ArrayList<PersonBean> persons = dealProjectInfoList(response);
                if (persons == null) {
                    callBack.error("获取的数据失败");
                    return;
                }
                callBack.response(persons);

            }
        });
    }

    private ArrayList<PersonBean> dealProjectInfoList(String response) {
        ArrayList<PersonBean> projectInfoList = new ArrayList<PersonBean>();
        try {
            JSONObject rootObject = new JSONObject(response);
            JSONArray projectInfoArray = rootObject.getJSONArray("employee_list");
            for (int i = 0; i < projectInfoArray.length(); i++) {
                PersonBean person = new PersonBean();
                JSONObject projectInfoObject = projectInfoArray.getJSONObject(i);
                person.setId(projectInfoObject.getString("employee_number"));
                person.setName(projectInfoObject.getString("employee_name"));
                projectInfoList.add(person);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
        return projectInfoList;
    }

    /**
     * 获取一组组成员照片
     *
     * @param persons
     * @param callBack
     */
    public void getStaffImageList(final ArrayList<PersonBean> persons, final DataSourceCallBack callBack) {
        JSONArray array = new JSONArray();
        for (int i = 0; i < persons.size(); i++) {
            JSONObject object = new JSONObject();
            try {
                object.put("key", persons.get(i).getId());
            } catch (JSONException e) {
                e.printStackTrace();
            }
            array.put(object);
        }
        OkHttpClientManager.postAsyn(mulStaffImageUrl, array, new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
                Log.e("ERROR", e.toString());
            }

            @Override
            public void onResponse(String response) {
                dealImageList(response, persons);
                callBack.response(response);

            }
        });
    }

    private void dealImageList(String response, ArrayList<PersonBean> persons) {
        JSONObject rootObject;
        JSONArray rowsArray;
        try {
            rootObject = new JSONObject(response);
            rowsArray = rootObject.getJSONArray("rows");
            for (int i = 0; i < rowsArray.length(); i++) {
                if (rowsArray.getString(i)!=null&&!rowsArray.getString(i).equals("null")&&!rowsArray.getString(i).equals("")) {
                    JSONObject object = rowsArray.getJSONObject(i);
                    String emp_code = object.getString("emp_code");
                    String avatar = object.getString("avatar");
                    String emp_name = object.getString("emp_name");
                    String email = object.getString("email");
                    updateImage(emp_code, avatar, emp_name,email,persons);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void updateImage(String emp_code, String avatar, String emp_name,String email,ArrayList<PersonBean> persons) {
        for (int i = 0; i < persons.size(); i++) {
            if (persons.get(i).getId().equals(emp_code)) {
                persons.get(i).setAvatar(avatar);
                persons.get(i).setName(emp_name);
                persons.get(i).setEmail(email);
                return;
            }
        }
    }

    /**
     * 获取常用联系人列表
     */
    public void getOftenContact(final DataSourceCallBack callBack) {
        RongIMClient.getInstance().getConversationList(new RongIMClient.ResultCallback<List<Conversation>>() {
            @Override
            public void onSuccess(List<Conversation> conversations) {
                if (conversations == null) {
                    callBack.error("最近联系人为空！");
                    return;
                }
                ArrayList<PersonBean> persons = new ArrayList<PersonBean>();
                for (int i = 0; i < conversations.size(); i++) {
                    //Log.e(   ,conversations.get(0).getTargetId());
                    PersonBean person = new PersonBean();
                    person.setId(conversations.get(i).getTargetId());
                    person.setName(conversations.get(i).getTargetId());
                    persons.add(person);
                }
                callBack.response(persons);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                callBack.error(errorCode.toString());
            }
        }, Conversation.ConversationType.PRIVATE);
    }

    /**
     * 根据部门Id获取该部门下的全部成员
     * @param deptId
     * @param callBack
     */
    public void getTotalStaffByDeptId(String deptId, final DataSourceCallBack callBack){
        JSONObject object = new JSONObject();
        try {
            object.put("id", deptId);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        OkHttpClientManager.postAsyn(totalStaffUrl, object, new OkHttpClientManager.ResultCallback<String>() {
            @Override
            public void onError(Call call, Exception e) {
                callBack.error(e.toString());
                Log.e("error",toString());
            }

            @Override
            public void onResponse(String response) {
                //Log.e("Response",response);
                ArrayList<PersonBean> members = dealTotalStaffList(response);
                callBack.response(members);
            }
        });
    }

    private ArrayList<PersonBean> dealTotalStaffList(String response){
        ArrayList<PersonBean> members = new ArrayList<PersonBean>();
        JSONObject rootObject;
        JSONArray rowsArray;
        try {
            rootObject = new JSONObject(response);
            rowsArray = rootObject.getJSONArray("returnData");
            for(int i=0;i<rowsArray.length();i++){
                PersonBean person = new PersonBean();
                String emp_id = rowsArray.getJSONObject(i).getString("accountNumber");
                String avatar = rowsArray.getJSONObject(i).getString("avatar");
                person.setId(emp_id);
                person.setAvatar(avatar);
                members.add(person);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return members;
    }


    public static abstract class DataSourceCallBack<T> {
        public abstract void error(String msg);

        public abstract void response(T response);
    }
}
