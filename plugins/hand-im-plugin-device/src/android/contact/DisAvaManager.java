package com.hand.im.contact;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;

import com.hand.im.DBhelper;
import com.hand.im.LoginInfo;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.assist.FailReason;
import com.nostra13.universalimageloader.core.listener.ImageLoadingListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by panx on 2016/10/3.
 */
public class DisAvaManager {
    private ArrayList<PersonBean> persons;
    private ArrayList<String> urlList = new ArrayList<String>();
    private ArrayList<Bitmap> bitmaps = new ArrayList<Bitmap>();
    private DisplayImageOptions options;
    private Paint paint;
    private Context context;
    private AvatarCallBack callBack;
    private Handler mHandler;

    public DisAvaManager(ArrayList<PersonBean> persons, Context context, AvatarCallBack callBack) {
        this.persons = persons;
        this.context = context;
        initOptions();
        initPaint();
        this.callBack = callBack;
        mHandler = new Handler(Looper.getMainLooper());
    }

    private void initPaint() {
        paint = new Paint();
        paint.setStyle(Paint.Style.STROKE);
        // 消除锯齿
        paint.setAntiAlias(true);
        // 设置画笔的颜色
        paint.setColor(Color.WHITE);
        // 设置paint的外框宽度
        paint.setStrokeWidth(4);
    }

    private void initOptions() {
        options = new DisplayImageOptions.Builder()
                .cacheOnDisk(true)
                .cacheInMemory(true)
                .bitmapConfig(Bitmap.Config.RGB_565)
                .resetViewBeforeLoading(true)
                .build();
    }

    public void createAvatar() {
        int n = 0;
        for (int i = 0; i < persons.size(); i++) {
            if (persons.get(i).getAvatar() != null && !persons.get(i).getAvatar().equals("") && !persons.get(i).getAvatar().equals("null")) {
                urlList.add(persons.get(i).getAvatar());
                n++;
                if (n >= 5) {
                    break;
                }
            }
        }
        if (n < 5 && (LoginInfo.userIcon != null && !LoginInfo.userIcon.equals(""))) {
            urlList.add(LoginInfo.userIcon);
        }
        initBitmap();
    }

    private void initBitmap() {
        Log.e("aaa", "initBitmap");
        final int num = urlList.size();
        final int[] i = {0};
        for (String url : urlList) {
            ImageLoader.getInstance().loadImage(url, options, new ImageLoadingListener() {
                @Override
                public void onLoadingStarted(String s, View view) {

                }

                @Override
                public void onLoadingFailed(String s, View view, FailReason failReason) {
                    callBack.error();
                }

                @Override
                public void onLoadingComplete(String s, View view, Bitmap bitmap) {
                    bitmaps.add(bitmap);
                    i[0]++;
                    if (i[0] == num) {
                        makeAvatar();
                    }
                }

                @Override
                public void onLoadingCancelled(String s, View view) {
                    callBack.error();
                }
            });
        }
    }

    private void makeAvatar() {
        for (int i = 0; i < bitmaps.size(); i++) {
            bitmaps.set(i, zoomImage(bitmaps.get(i), 80, 80));
        }
        Bitmap.Config config = bitmaps.get(0).getConfig();
        //矩形宽高
        int width = bitmaps.get(0).getWidth() * 2;
        int height = width;
        //矩形中心点
        int point_x = width / 2;
        int point_y = height / 2;
        int d;

        ArrayList<Point> points;
        switch (bitmaps.size()) {
            case 5: {
                d = (width * 2) / 5;
                points = getFivePoints(point_x, point_y, d);
                break;
            }
            case 4: {
                d = (width * 3) / 7;
                points = getFourPoints(point_x, point_y, d);
                break;
            }
            case 3: {
                d = (width * 1) / 2;
                points = getThreePoints(point_x, point_y, d);
                break;
            }
            case 2: {
                d = (width * 1) / 2;
                points = getTwoPoints(point_x, point_y, d);
                break;
            }
            default: {
                callBack.error();
                return;
            }
        }
        int r = d / 2;
        for (int i = 0; i < bitmaps.size(); i++) {
            bitmaps.set(i, makeRoundCorner(bitmaps.get(i), d, d));
        }
        Bitmap bitmap = Bitmap.createBitmap(width, height, config);
        Canvas canvas = new Canvas(bitmap);
        canvas.drawColor(0xFFFFFFFF);
        for (int i = 0; i < bitmaps.size(); i++) {
            canvas.drawBitmap(bitmaps.get(i), points.get(i).x, points.get(i).y, null);
            canvas.drawCircle(points.get(i).x + r, points.get(i).y + r, r - 1, paint);
        }
        Bitmap bitmap1 = makeRoundCorner(bitmap, width, height);
        uploadBitmap(bitmap1);
    }

    public void saveBitmap(Bitmap bm) {
        File f = new File(Environment.getExternalStorageDirectory(), "icon.png");
        if (f.exists()) {
            f.delete();
        }
        try {
            FileOutputStream out = new FileOutputStream(f);
            bm.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private void uploadBitmap(Bitmap bitmap) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, bos);
        byte[] data = bos.toByteArray();
        MultipartBody.Builder builder = new MultipartBody.Builder().setType(MultipartBody.FORM);
        builder.addFormDataPart("file", "groupicon.png", RequestBody.create(MediaType.parse("image/png"), data));
        MultipartBody requestBody = builder.build();

        Request request = new Request.Builder()
                .url(LoginInfo.baseUrl + "/hrmsv2/v2/api/objectUpload?access_token=" + LoginInfo.access_token)//地址
                .post(requestBody)//添加请求体
                .build();
        OkHttpClient client = new OkHttpClient();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e("error", e.toString());

                mHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        callBack.error();
                    }
                });
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                // Log.e("success", response.body().string());
                String res = response.body().string();
                try {
                    JSONObject rootObject = new JSONObject(res);
                    JSONObject fileObject = rootObject.getJSONObject("returnData");
                    String fileName = fileObject.getString("objectUrl");
                    final String url = "http://zhouzybk.img-cn-shanghai.aliyuncs.com/" + fileName;
                    mHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            callBack.success(url);
                        }
                    });
                } catch (JSONException e) {
                    e.printStackTrace();
                    callBack.error();
                }
            }
        });
    }

    public static Bitmap zoomImage(Bitmap bgimage, double newWidth,
                                   double newHeight) {
        // 获取这个图片的宽和高
        float width = bgimage.getWidth();
        float height = bgimage.getHeight();
        // 创建操作图片用的matrix对象
        Matrix matrix = new Matrix();
        // 计算宽高缩放率
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        // 缩放图片动作
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap bitmap = Bitmap.createBitmap(bgimage, 0, 0, (int) width,
                (int) height, matrix, true);
        return bitmap;
    }

    private Bitmap makeRoundCorner(Bitmap bitmap, int width, int height) {
        int left = 0, top = 0, right = width, bottom = height;
        float roundPx = height / 2;
        if (width > height) {
            left = (width - height) / 2;
            top = 0;
            right = left + height;
            bottom = height;
        } else if (height > width) {
            left = 0;
            top = (height - width) / 2;
            right = width;
            bottom = top + width;
            roundPx = width / 2;
        }
        Bitmap output = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(output);
        int color = 0xff424242;
        Paint paint = new Paint();
        Rect rect = new Rect(left, top, right, bottom);
        RectF rectF = new RectF(rect);

        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        paint.setColor(color);
        canvas.drawRoundRect(rectF, roundPx, roundPx, paint);
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);
        return output;
    }

    private ArrayList<Point> getFivePoints(int point_x, int point_y, int d) {
        ArrayList<Point> points = new ArrayList<Point>();
        //圆心至图片的距离
        int wr = point_y - d;
        //大圆心至小圆心的距离
        int R = wr + d / 2;
        //头像半径,头像直径为d
        int r = d / 2;
        int RCos18 = (int) (R * (Math.cos(0.1 * Math.PI)));
        int RSin18 = (int) (R * (Math.sin(0.1 * Math.PI)));
        int RCos36 = (int) (R * (Math.cos(0.2 * Math.PI)));
        int RSin36 = (int) (R * (Math.sin(0.2 * Math.PI)));
        Point point1 = new Point(point_x - r, 0);
        Point point2 = new Point();
        point2.x = RCos18 + point_x - r;
        point2.y = point_y - RSin18 - r;
        Point point3 = new Point();
        point3.x = RSin36 + point_x - r;
        point3.y = point_y + RCos36 - r;
        Point point4 = new Point();
        point4.x = point_x - RSin36 - r;
        point4.y = point3.y;
        Point point5 = new Point();
        point5.x = point_x - (int) (RCos18) - r;
        point5.y = point2.y;

        points.add(point1);
        points.add(point2);
        points.add(point3);
        points.add(point4);
        points.add(point5);

        return points;
    }

    private ArrayList<Point> getFourPoints(int point_x, int point_y, int d) {
        ArrayList<Point> points = new ArrayList<Point>();
        Point point1 = new Point();
        point1.x = point_x - (9 * d) / 10;
        point1.y = point_y - (9 * d) / 10;
        Point point2 = new Point();
        point2.x = point_x - d / 10;
        point2.y = point1.y;
        Point point3 = new Point();
        point3.x = point2.x;
        point3.y = point_y - d / 10;
        Point point4 = new Point();
        point4.x = point1.x;
        point4.y = point3.y;
        points.add(point1);
        points.add(point2);
        points.add(point3);
        points.add(point4);
        return points;
    }

    private ArrayList<Point> getThreePoints(int point_x, int point_y, int d) {
        ArrayList<Point> points = new ArrayList<Point>();
        int R = d / 2;
        int RCos45 = (int) (R * (Math.cos(0.25 * Math.PI)));
        Point point1 = new Point();
        point1.x = point_x - (d / 2);
        point1.y = point_y - R - (d / 2);
        Point point2 = new Point();
        point2.x = point_x - ((d / 2) - RCos45);
        point2.y = point_y - ((d / 2) - RCos45);
        Point point3 = new Point();
        point3.x = point_x - RCos45 - (d / 2);
        point3.y = point2.y;
        points.add(point1);
        points.add(point2);
        points.add(point3);
        return points;
    }

    private ArrayList<Point> getTwoPoints(int point_x, int point_y, int d) {
        ArrayList<Point> points = new ArrayList<Point>();
        Point point1 = new Point();
        point1.y = point_y - (d / 2);
        point1.x = point_x - (9 * d) / 10;
        Point point2 = new Point();
        point2.x = point_x - (d) / 10;
        point2.y = point1.y;
        points.add(point1);
        points.add(point2);
        return points;
    }

    public static abstract class AvatarCallBack<T> {
        public abstract void error();

        public abstract void success(T object);
    }
}
