package com.hand.im;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import io.rong.imlib.model.UserInfo;

public class DBhelper extends SQLiteOpenHelper{
    private final static String DATABASE_NAME = "_ConversationDB.db";
    private final static int DATABASE_VERSION = 1;
    private final static String TABLE_NAME = "_conversation";
    private final static String ID = "_id";
    private final static String TARGET_ID = "_targetId";
    private final static String TARGET_NAME = "_targetName";
    private final static String TARGET_ICON_URL = "_targetIconUrl";
    //唯一索引
    private final static String MYINDEX = "mIndex";
    public DBhelper(Context context){
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String sql = "Create table " + TABLE_NAME + "(" + ID
                + " integer primary key autoincrement, " + TARGET_ID + " varchar(20) UNIQUE, "+ TARGET_NAME + " varchar(20), "+ TARGET_ICON_URL+" varchar(1000) "+")";
        db.execSQL(sql);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        String sql = " DROP TABLE IF EXISTS " + TABLE_NAME;
        db.execSQL(sql);
        onCreate(db);
        db.execSQL(sql);
    }
    public MyConversation getUserInfo(String targetId){
        MyConversation mc = new MyConversation("","","");
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("select "+TARGET_ID+","+TARGET_NAME+","+TARGET_ICON_URL+" from " + TABLE_NAME + " where "+TARGET_ID+"='"+targetId+"'", null);
        while (cursor.moveToNext()){
            String id = cursor.getString(cursor.getColumnIndex(TARGET_ID));
            String name = cursor.getString(cursor.getColumnIndex(TARGET_NAME));
            String url = cursor.getString(cursor.getColumnIndex(TARGET_ICON_URL));
            mc.setTargetId(id);
            mc.setTargetName(name);
            mc.setTargetIconUrl(url);
        }
        db.close();
        return mc;
    }
    public void addUserInfo(String tid,String tnamee,String tcurl){
        SQLiteDatabase db = this.getReadableDatabase();
        db.beginTransaction(); // 开始事务
        try
        {
            db.execSQL("REPLACE INTO " + TABLE_NAME
                        + " VALUES(null, ?, ?, ?)", new Object[] { tid,
                    tnamee, tcurl });
            db.setTransactionSuccessful();
        }
        finally
        {
            db.endTransaction(); // 结束事务
        }
    }

    public class  MyConversation{
        String targetId;
        String targetName;
        String targetIconUrl;
        public MyConversation() {
            super();
        }
        public MyConversation(String targetId, String targetName, String targetIconUrl) {
            super();
            this.targetId = targetId;
            this.targetName = targetName;
            this.targetIconUrl = targetIconUrl;
        }
        public String getTargetId() {
            return targetId;
        }
        public void setTargetId(String targetId) {
            this.targetId = targetId;
        }
        public String getTargetName() {
            return targetName;
        }
        public void setTargetName(String targetName) {
            this.targetName = targetName;
        }
        public String getTargetIconUrl() {
            return targetIconUrl;
        }
        public void setTargetIconUrl(String targetIconUrl) {
            this.targetIconUrl = targetIconUrl;
        }
    }
}
