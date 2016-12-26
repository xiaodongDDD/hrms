package com.sleepgod.cuiweicai.hand_image_library.activity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;

import com.sleepgod.cuiweicai.hand_image_library.BitmapUtil;
import com.sleepgod.cuiweicai.hand_image_library.CropImageView;
import com.sleepgod.cuiweicai.hand_image_library.R;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by cuiweicai on 16/10/18.
 */
public class CropdrawableActivity extends Activity {
    private static final int SAVEBACK = 1000;
    private CropImageView mView;
    private Button mCropButton;
    private Button mCropBLButton;
    private ImageButton mCloseButton;
    private EditText wideED;
    private EditText lengthED;
    public static Drawable drawable;
    private Bitmap mBitmap =null;

    private  Uri uri;
    private  String filepath="";
    public static  String savepath="";



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.crop_activity);
        mView = (CropImageView) findViewById(R.id.cropimage);
        mCropButton = (Button) findViewById(R.id.bt_crop);
//        mCropBLButton =(Button) findViewById(R.id.bt_cropbl);
        mCloseButton =(ImageButton) findViewById(R.id.bt_close);
//        wideED =(EditText)findViewById(R.id.wide_ed);
//        lengthED =(EditText)findViewById(R.id.length_ed);


        filepath =getIntent().getStringExtra("filepath");
        getpath(filepath);
        decodefileAsDrawable(filepath);
        //设置资源和默认长宽
//        File file = new File("/storage/sdcard0/TEST_APP/201.jpg");
//        uri =Uri.fromFile(file);
//        mBitmap =decodeUriAsBitmap(uri);
//        drawable =new BitmapDrawable(mBitmap);

//        mView.setDrawable(getResources().getDrawable(R.drawable.bird), 300,
//                300);
        mView.setDrawable(drawable, 300,
                300);
        //调用该方法得到剪裁好的图片
        // Bitmap mBitmap= mView.getCropImage();

        mCropButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                 mBitmap= mView.getCropImage();
                drawable =new BitmapDrawable(mBitmap);

//                Intent intent = new Intent(CropdrawableActivity.this,SaveDrawbleActivity.class);
//                startActivityForResult(intent,SAVEBACK);
                //   mView.setDrawable(drawable,300,300);
                savepic();
            }
        });




//        mCropBLButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                int length =Integer.parseInt(lengthED.getText().toString());
//                int wide   =Integer.parseInt(wideED.getText().toString());
//                Bitmap  bitmap1 = BitmapUtil.readBitmapById(CropdrawableActivity.this,R.drawable.bird);
//                bitmap1=  BitmapUtil.imageCrop(bitmap1,length ,wide,true);
//                drawable =new BitmapDrawable(bitmap1);
//                Intent intent = new Intent(CropdrawableActivity.this,SaveDrawbleActivity.class);
//                startActivity(intent);
//            }
//        });

        mCloseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent    intent=new Intent();
                setResult(Activity.RESULT_CANCELED,intent);
                finish();
            }
        });



    }

    private void getpath(String filepath) {

        savepath =filepath.substring(0,filepath.lastIndexOf("/")+1);
        Log.d("crop","savepath: "+savepath);
    }



    @Override
    public void onBackPressed() {
        super.onBackPressed();
        Intent    intent=new Intent();
        setResult(Activity.RESULT_CANCELED,intent);
        finish();
    }


    private Bitmap decodeUriAsBitmap(Uri uri){

        Bitmap bitmap = null;

        try {

            bitmap = BitmapFactory.decodeStream(getContentResolver().openInputStream(uri));

        } catch (FileNotFoundException e) {

            e.printStackTrace();

            return null;

        }

        return bitmap;

    }


    private void decodefileAsDrawable(String filepath) {


        File file = new File(filepath);
        if(file.exists()) {
            uri = Uri.fromFile(file);
            mBitmap = decodeUriAsBitmap(uri);
            drawable = new BitmapDrawable(mBitmap);
        }else {
            setbackmessage("error","error");
        }
    }



    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case SAVEBACK:
                    String path =intent.getStringExtra("path");

                        setbackmessage("path",path);

                    break;

            }
        } else if (resultCode == Activity.RESULT_CANCELED) {
            Log.d("corp","cancel");
        }
    }



    private void setbackmessage(String tag, String content){
        Intent intent=new Intent();
        intent.putExtra(tag,content);
        setResult(Activity.RESULT_OK,intent);
        finish();
    }


    private String getfilename() {
        SimpleDateFormat formatter    =   new    SimpleDateFormat    ("yyyyMMddHHmmss");
        Date curDate    =   new    Date(System.currentTimeMillis());//获取当前时间
        String    str    =    formatter.format(curDate);
        str = str+".jpg";
        return str;
    }


    private void savepic(){
        Bitmap bmp=((BitmapDrawable)drawable).getBitmap();
        FileOutputStream fop;
        String allpath =CropdrawableActivity.savepath + getfilename();
        try {


            fop=new FileOutputStream(allpath);
            //实例化FileOutputStream，参数是生成路径
            bmp.compress(Bitmap.CompressFormat.JPEG, 100, fop);
            //压缩bitmap写进outputStream 参数：输出格式  输出质量  目标OutputStream
            //格式可以为jpg,png,jpg不能存储透明
            fop.close();
            //关闭流
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        drawable.setCallback(null);
        setbackmessage("path",allpath);
    }

}
