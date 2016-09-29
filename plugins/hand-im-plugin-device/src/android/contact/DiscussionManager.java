package com.hand.im.contact;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Iterator;

import io.rong.imlib.RongIMClient;

/**
 * Created by panx on 2016/9/26.
 */
public class DiscussionManager {
    public static int CREATE = 0;
    public static int INVITE = 1;
    private Context context;
    private int type;
    private ArrayList<String> memberList;
    private String targetId;
    private String[] GroupArray;
    private DisMCallBack mCallBack;
    private ProgressDialog progressDialog;
    public DiscussionManager(Context context) {
        this.context = context;
    }

    private void showDialog(ArrayList<String> memberList) {
        String content = "";
        Boolean flag = false;
        if (memberList.size() == 0) {
            flag = true;
            content = "您邀请的成员为空或已均在讨论组中，无需邀请";
            mCallBack.onError(null);
        } else {
            content = "您将邀请" + memberList.size() + "位成员加入到讨论组中！";
        }
        final Boolean finalFlag = flag;
        TipDialog.Builder builder = new TipDialog.Builder(context);
        builder.setContent(content)
                .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        if (finalFlag) {
                            dialogInterface.dismiss();
                            return;
                        } else {
                            toCreateOrInviteToDiscussion();
                            dialogInterface.dismiss();
                            return;
                        }
                    }
                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        dialogInterface.dismiss();
                    }
                }).create().show();
    }

    private void showProgressDialog(Boolean b){
        if(progressDialog == null&&b){
            progressDialog = ProgressDialog.show(context,null,"处理中");
        }else if(b){
            progressDialog.show();
        }else if(!b&&progressDialog!=null){
            progressDialog.dismiss();
        }
    }

    public void CreateOrInviteToDiscussion(DisMCallBack callBack,int type, ArrayList<String> memberList, String targetId, String[] existMembers) {
        this.mCallBack = callBack;
        this.type = type;
        this.memberList = memberList;
        this.targetId = targetId;
        this.GroupArray = existMembers;
        showDialog(memberList);
    }

    private void toCreateOrInviteToDiscussion() {
        if (type == DiscussionManager.CREATE) {
            this.CreateNewDiscussion();
        } else {
            this.inviteToDiscussion();
        }
    }

    private void CreateNewDiscussion() {
        showProgressDialog(true);
        final String title = CreateDisInfo.getGroupTitle();
        RongIMClient.getInstance().createDiscussion(title, memberList, new RongIMClient.CreateDiscussionCallback() {
            @Override
            public void onSuccess(String s) {
                showProgressDialog(false);
                mCallBack.onReponse(s,title);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                showProgressDialog(false);
                mCallBack.onError(errorCode.toString());
            }
        });
    }

    private void inviteToDiscussion() {
        showProgressDialog(true);
        subExistMember();
        RongIMClient.getInstance().addMemberToDiscussion(targetId, memberList, new RongIMClient.OperationCallback() {
            @Override
            public void onSuccess() {
                showProgressDialog(false);
                mCallBack.onReponse("success",null);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                showProgressDialog(false);
                mCallBack.onError("error");
            }
        });
    }

    private void subExistMember() {
        if (GroupArray == null || GroupArray.length == 0) {
            return;
        }
        Iterator<String> iterator = memberList.iterator();
        while (iterator.hasNext()) {
            String temp_emp_id = iterator.next();
            if (isMemberExist(temp_emp_id)) {
                iterator.remove();
            }
        }
    }

    public boolean isMemberExist(String emp_id) {
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
    private String getDiscussionTitle() {
        String title = getDiscussionTitle();

        return title;
    }

    public static abstract class DisMCallBack<T>{
        public abstract void onError(String msg);
        public abstract void onReponse(T object,String title);
    }

}
