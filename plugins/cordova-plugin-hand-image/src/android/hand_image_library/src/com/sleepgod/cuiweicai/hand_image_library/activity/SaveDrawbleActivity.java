package com.sleepgod.cuiweicai.hand_image_library.activity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.sleepgod.cuiweicai.hand_image_library.R;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by cuiweicai on 16/10/18.
 */
public class SaveDrawbleActivity extends Activity{
    private ImageView pic;
    private Drawable drawable;
    private Button back;
    private Button save;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_savepic);

        init();
    }

    private void init() {
        pic = (ImageView)findViewById(R.id.pic_IV);
        drawable  = CropdrawableActivity.drawable;
        back =(Button) findViewById(R.id.back_bt);
        save =(Button) findViewById(R.id.save_bt);
        pic.setImageDrawable(drawable);

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent=new Intent();
                setResult(Activity.RESULT_CANCELED,intent);
                finish();
            }
        });


        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
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

                setbackmessage("path",allpath);

            }
        });
    }

    private String getfilename() {
        SimpleDateFormat formatter    =   new    SimpleDateFormat    ("yyyyMMddHHmmss");
        Date curDate    =   new    Date(System.currentTimeMillis());//获取当前时间
        String    str    =    formatter.format(curDate);
        str = str+".jpg";
        return str;
    }


    private void setbackmessage(String tag, String content){
        Intent intent=new Intent();
        intent.putExtra(tag,content);
        setResult(Activity.RESULT_OK,intent);
        finish();
    }



}
