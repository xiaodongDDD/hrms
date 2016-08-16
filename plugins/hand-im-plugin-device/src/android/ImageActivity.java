package com.hand.im;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.assist.FailReason;
import com.nostra13.universalimageloader.core.assist.ImageScaleType;
import com.nostra13.universalimageloader.core.display.SimpleBitmapDisplayer;
import com.nostra13.universalimageloader.core.listener.ImageLoadingListener;

import uk.co.senab.photoview.PhotoViewAttacher;
/**
 * Created by USER on 2016/7/6.
 */
public class ImageActivity extends Activity{
    private ImageView mImgView;
    private Bitmap bitmap;
    private PhotoViewAttacher mAttacher;
    private DisplayImageOptions options;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
//        setContentView(R.layout.image_act);
        setContentView(Util.getRS("image_act", "layout", ImageActivity.this));
        options = new DisplayImageOptions.Builder()
//                .showImageOnLoading(R.drawable.picture_loading)
//                .showImageOnFail(R.drawable.pictures_no)
                .showImageOnLoading(Util.getRS("picture_loading", "drawable", ImageActivity.this))
                .showImageOnFail(Util.getRS("pictures_no", "drawable", ImageActivity.this))
                .cacheOnDisk(true).cacheInMemory(true)
                .imageScaleType(ImageScaleType.IN_SAMPLE_POWER_OF_2)
                .bitmapConfig(Bitmap.Config.RGB_565)
                .displayer(new SimpleBitmapDisplayer())
                .build();

//        mImgView = (ImageView) findViewById(R.id.img_forwatch);
        mImgView = (ImageView) findViewById(Util.getRS("img_forwatch","id",ImageActivity.this));
        String url = getIntent().getStringExtra("URL");
        mAttacher = new PhotoViewAttacher(mImgView);
        ImageLoader.getInstance().displayImage(url, mImgView, options,
                new ImageLoadingListener() {
                    @Override
                    public void onLoadingStarted(String arg0, View arg1) {
                    }

                    @Override
                    public void onLoadingFailed(String arg0, View arg1,
                                                FailReason arg2) {
                    }

                    @Override
                    public void onLoadingComplete(String arg0, View arg1,
                                                  Bitmap arg2) {
                        mAttacher.update();
                    }

                    @Override
                    public void onLoadingCancelled(String arg0, View arg1) {
                    }
                });
        mAttacher.setOnPhotoTapListener(new PhotoViewAttacher.OnPhotoTapListener() {
            @Override
            public void onPhotoTap(View view, float x, float y) {
                finish();
            }
            @Override
            public void onOutsidePhotoTap() {
            }
        });
    }
}
