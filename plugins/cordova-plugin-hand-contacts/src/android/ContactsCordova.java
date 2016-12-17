package  com.hand;


import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;

import android.util.Log;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PermissionHelper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;




public class  ContactsCordova extends CordovaPlugin {
    private  final  String TAG="ContactsCordova";
    private static final int PERMISSION_DENIED_ERROR = 20;
    private CallbackContext mcallbackContext;
    private static final int MY_PERMISSIONS_REQUEST_CONTACTS = 10001;
    private JSONObject allInfomation = new JSONObject();


    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        mcallbackContext =callbackContext;

        if("pickContact".equals(action)){
            grantContactPermission();

        }else{
            mcallbackContext.error("error");
            return false;
        }
        return true;
    }



    private void grantContactPermission() {
        boolean readContactsPermission;
        readContactsPermission = PermissionHelper.hasPermission(this, Manifest.permission.READ_CONTACTS);

        if(!readContactsPermission){
            PermissionHelper.requestPermission(this, MY_PERMISSIONS_REQUEST_CONTACTS, Manifest.permission.READ_CONTACTS);
        }else{
            pickContact();

        }


    }


    private void pickContact() {
        Intent intent = new Intent(
                Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI);
        this.cordova.startActivityForResult(this,intent, 0);

        PluginResult mPlugin = new PluginResult(PluginResult.Status.NO_RESULT);
        mPlugin.setKeepCallback(true);
        mcallbackContext.sendPluginResult(mPlugin);
    }


    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {

        for (int r : grantResults) {
            if (r == PackageManager.PERMISSION_DENIED) {
                this.mcallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, PERMISSION_DENIED_ERROR));
                return;
            }
        }

        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_CONTACTS:
                pickContact();
                break;

        }

    }



        @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {

            String usernumber="";
            String company ="";
            String phonetype="";
            int type=0;


            ContentResolver reContentResolverol = cordova.getActivity().getContentResolver();
            Uri contactData = data.getData();
            @SuppressWarnings("deprecation")
            Cursor cursor = cordova.getActivity().managedQuery(contactData, null, null, null, null);
            cursor.moveToFirst();
            String username = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));

            String contactId = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts._ID));


            //////获取公司名字
            String orgWhere = ContactsContract.Data.CONTACT_ID + " = ? AND " + ContactsContract.Data.MIMETYPE + " = ?";
            String[] orgWhereParams = new String[]{contactId,
                    ContactsContract.CommonDataKinds.Organization.CONTENT_ITEM_TYPE};
            Cursor orgCur = reContentResolverol.query(ContactsContract.Data.CONTENT_URI,
                    null, orgWhere, orgWhereParams, null);
            if (orgCur.moveToFirst()) {
                //组织名 (公司名字)
                 company = orgCur.getString(orgCur.getColumnIndex(ContactsContract.CommonDataKinds.Organization.DATA));

            }
            orgCur.close();

            try {
                allInfomation.put("name",username);
                allInfomation.put("orgName", company);
            } catch (JSONException e) {
                e.printStackTrace();
            }


            /////获取联系人电话
            Cursor phone = reContentResolverol.query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                    null,
                    ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = " + contactId,
                    null,
                    null);
            JSONArray phonearray = new JSONArray();

            while (phone.moveToNext()) {
                JSONObject phonejson = new JSONObject();
                 usernumber = phone.getString(phone.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                 type =phone.getInt(phone.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DATA2));
                 phonetype = String.valueOf(ContactsContract.CommonDataKinds.Phone.getTypeLabel(cordova.getActivity().getResources(),type,"自定义"));

                try {
                    phonejson.put("type",phonetype);
                    phonejson.put("value",usernumber);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                phonearray.put(phonejson);
            }
            phone.close();
            /////获取联系人电话


            ///////获取e-mail
            Cursor emails = reContentResolverol.query(ContactsContract.CommonDataKinds.Email.CONTENT_URI,
                    null,
                    ContactsContract.CommonDataKinds.Email.CONTACT_ID + "=" + contactId,
                    null, null);
            int emailIndex = 0;
            int typeEmailIndex=0;
            if(emails.getCount() > 0) {
                emailIndex = emails.getColumnIndex(ContactsContract.CommonDataKinds.Email.DATA);
                typeEmailIndex =emails.getColumnIndex(ContactsContract.CommonDataKinds.Email.DATA2);
            }
            JSONArray eamilarray = new JSONArray();
            while(emails.moveToNext()) {

                JSONObject emailjson = new JSONObject();
                String email = emails.getString(emailIndex);
                type  = emails.getInt(typeEmailIndex);
                String typestring = String.valueOf(ContactsContract.CommonDataKinds.Email.getTypeLabel(cordova.getActivity().getResources(),type,"自定义"));

                try {
                    emailjson.put("type",typestring);
                    emailjson.put("value",email);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                eamilarray.put(emailjson);
            }
            emails.close();
            ///////获取e-mail

            try {
                allInfomation.put("phoneList",phonearray);
                allInfomation.put("emailList",eamilarray);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            mcallbackContext.success(allInfomation);
        }
    }




    /**
     * cursor 转jason
     * @param cursor
     * @return
     */
    private JSONArray getReasult2JsonArray(Cursor cursor) {
        JSONArray reasult = new JSONArray();

        cursor.moveToFirst();
        while (cursor.isAfterLast() == false) {

            int totalColumn = cursor.getColumnCount();
            JSONObject rowObject = new JSONObject();

            for( int i=0 ;  i< totalColumn ; i++ )
            {
                if( cursor.getColumnName(i) != null )
                {
                    try
                    {
                        if( cursor.getString(i) != null )
                        {
                            Log.d("TAG_NAME", cursor.getString(i) );
                            if(cursor.getType(i)==Cursor.FIELD_TYPE_STRING){
                                rowObject.put(cursor.getColumnName(i) ,  cursor.getString(i) );
                            }else if(cursor.getType(i)==Cursor.FIELD_TYPE_INTEGER){
                                rowObject.put(cursor.getColumnName(i) ,  cursor.getInt(i) );
                            }else if(cursor.getType(i)==Cursor.FIELD_TYPE_FLOAT){
                                rowObject.put(cursor.getColumnName(i) ,  cursor.getFloat(i) );
                            }

                        }
                        else
                        {
                            rowObject.put( cursor.getColumnName(i) ,  "" );
                        }
                    }
                    catch( Exception e )
                    {
                        Log.d("TAG_NAME", e.getMessage()  );
                    }
                }
            }
            reasult.put(rowObject);
            cursor.moveToNext();
        }
        cursor.close();
        return reasult;
    }




}


