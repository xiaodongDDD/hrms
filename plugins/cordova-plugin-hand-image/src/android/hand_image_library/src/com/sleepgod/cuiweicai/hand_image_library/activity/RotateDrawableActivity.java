package com.sleepgod.cuiweicai.hand_image_library.activity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.PixelFormat;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import com.sleepgod.cuiweicai.hand_image_library.BitmapUtil;
import com.sleepgod.cuiweicai.hand_image_library.R;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by cuiweicai on 16/10/19.
 */
public class RotateDrawableActivity extends Activity {
    private ImageView pic;
    private Drawable drawable;
    private Drawable drawable_tmp;
    private Button back;
    private Button rotate;
    private Button save;
    private EditText du;
    private Bitmap bitmap;
    private Bitmap bitmap_cust;
    private Bitmap bitmap_temp =null;

    private  String filepath="";
    private  String savepath="";
    private Bitmap mBitmap =null;
    private  Uri uri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rotatepic);

        init();
    }

    private void init() {
        pic = (ImageView)findViewById(R.id.pic_IV);
        bitmap = BitmapUtil.readBitmapById(RotateDrawableActivity.this,R.drawable.bird);
        bitmap_cust= BitmapUtil.readBitmapById(RotateDrawableActivity.this,R.drawable.bird);
        back =(Button) findViewById(R.id.back_bt);
        save=(Button) findViewById(R.id.save_bt);
        rotate =(Button) findViewById(R.id.rotate);
        du =(EditText) findViewById(R.id.du_ed);

        filepath =getIntent().getStringExtra("filepath");
        getpath(filepath);
        decodefileAsDrawable(filepath);
        pic.setImageDrawable(drawable);

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent    intent=new Intent();
                setResult(Activity.RESULT_CANCELED,intent);
                finish();
            }
        });


        rotate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                int num = Integer.parseInt(du.getText().toString());
                if(bitmap_temp!=null){
                    bitmap_temp.recycle();
                }

                bitmap =drawableToBitmap(drawable);
            //    bitmap = BitmapUtil.readBitmapById(RotateDrawableActivity.this,R.drawable.bird);
                bitmap_temp = BitmapUtil.rotaingImageView(num,bitmap);
                drawable_tmp =new BitmapDrawable(bitmap_temp);
                pic.setImageDrawable(drawable_tmp);
            }
        });



        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FileOutputStream fop;
                String allpath =savepath + getfilename();
                try {


                    fop=new FileOutputStream(allpath);
                    //实例化FileOutputStream，参数是生成路径
                    bitmap_temp.compress(Bitmap.CompressFormat.JPEG, 100, fop);
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

                Intent intent=new Intent();
                intent.putExtra("path",allpath);
                setResult(Activity.RESULT_OK,intent);
                finish();
            }
        });
    }



    private void getpath(String filepath) {

        savepath =filepath.substring(0,filepath.lastIndexOf("/")+1);
        Log.d("crop","savepath: "+savepath);
    }

    private void decodefileAsDrawable(String filepath) {


        File file = new File(filepath);
        if(file.exists()) {
            uri = Uri.fromFile(file);
            mBitmap = decodeUriAsBitmap(uri);
            drawable = new BitmapDrawable(mBitmap);
        }else {
            Log.d("crop","路径不存在!");
            finish();

        }
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


    public static Bitmap drawableToBitmap(Drawable drawable) {
        Bitmap bitmap = Bitmap.createBitmap(
                drawable.getIntrinsicWidth(),
                drawable.getIntrinsicHeight(),
                drawable.getOpacity() != PixelFormat.OPAQUE ? Bitmap.Config.ARGB_8888
                        : Bitmap.Config.RGB_565);
        Canvas canvas = new Canvas(bitmap);
        //canvas.setBitmap(bitmap);
        drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
        drawable.draw(canvas);

        return bitmap;
    }


    private String getfilename() {
        SimpleDateFormat formatter    =   new    SimpleDateFormat    ("yyyyMMddHHmmss");
        Date curDate    =   new    Date(System.currentTimeMillis());//获取当前时间
        String    str    =    formatter.format(curDate);
        str = str+".jpg";
        return str;
    }
}
