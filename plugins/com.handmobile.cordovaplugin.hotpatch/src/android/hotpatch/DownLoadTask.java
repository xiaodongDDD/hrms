package com.handmobile.cordova.hotpatch;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.zip.ZipEntry;

import org.apache.cordova.CordovaWebView;

import com.hand_china.hrms.R;

import android.R.bool;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnKeyListener;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.Message;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.widget.TextView;


public class DownLoadTask extends AsyncTask<String, String, Boolean>{
    private final static int TIME_OUT = 30 * 1000;

    private Context mContext;
    private CordovaWebView mWebView;
    private ProgressDialog mProgressDialog;
    private MyProgressBar mProgressBar;
	private TextView mPercent;
	private String mPercentString;
	private Handler mHandler = new Handler(){
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			mPercent.setText(mPercentString);
		}
	};

	public  DownLoadTask(Context context,CordovaWebView webView)
	{
		mContext = context;
		mWebView = webView;

		mProgressDialog = new ProgressDialog(mContext);
//		mProgressDialog.setTitle("升级文件下载");
//		mProgressDialog.setMessage("文件下载中，请稍候...");
//		mProgressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
		mProgressDialog.setProgress(0);
		mProgressDialog.setMax(100);
		mProgressDialog.setCancelable(false);
		mProgressDialog.show();

		mProgressDialog.setOnKeyListener(onKeyListener);
		mProgressDialog.setContentView(R.layout.alterlayout);
		mProgressBar = (MyProgressBar) mProgressDialog.findViewById(R.id.progressBar1);
		mProgressBar.setProgress(0);
		mPercent =(TextView)mProgressDialog.findViewById(R.id.tv_percent);
	}


	@Override
	protected Boolean doInBackground(String... params) {
		if(params[0] !=null){
			String  url = params[0];

			try {
                HttpURLConnection connection = null;
				URL u = new URL(url);
                connection = (HttpURLConnection) u.openConnection();
                connection.setDoInput(true);
                connection.setUseCaches(false);
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(TIME_OUT);
                connection.connect();

                int lenghtOfFile = connection.getContentLength();
                InputStream input = new BufferedInputStream(
                		connection.getInputStream());
                mContext.deleteFile("www.zip");
                OutputStream output  =  mContext.openFileOutput("www.zip", Context.MODE_PRIVATE);
                byte data[] = new byte[1024 * 20];
                long total = 0;
                int count;
                while ((count = input.read(data)) != -1) {
                    total += count;
                    output.write(data, 0, count);
                    publishProgress(String.valueOf((total * 100) / lenghtOfFile));
                }
                output.flush();
                output.close();
                input.close();

                mContext.deleteFile("www");
                ZipUtil.UnZipFolder(mContext.getFileStreamPath("www.zip").toString(), mContext.getFilesDir().toString().concat("/"));



			} catch (MalformedURLException e) {

				e.printStackTrace();
				return false;
			} catch (IOException e) {

				e.printStackTrace();
				return false;
			} catch (Exception e) {
				e.printStackTrace();
				return  false;
			}




		}else {

			return false;
		}


		return true;
	}
    @Override
    protected void onProgressUpdate(String... values) {
        // TODO Auto-generated method stub
        super.onProgressUpdate(values);
        mProgressDialog.setProgress(Integer.parseInt(values[0]));
        mProgressBar.setProgress(Integer.parseInt(values[0]));
        mPercentString =values[0]+"%";
        mHandler.sendEmptyMessage(100);
    }


	@Override
	protected void onPostExecute(Boolean result) {
		// TODO Auto-generated method stub
		super.onPostExecute(result);

        if (mProgressDialog != null && mProgressDialog.isShowing()) {
        	mProgressDialog.dismiss();
        }

		if(true){
			mWebView.clearHistory();
	        mWebView.loadUrlIntoView("file://".concat(mContext.getFilesDir().getPath()).concat("/www/index.html") ,false);

	        new Handler().postDelayed(new Runnable(){
	            public void run() {
	        		mWebView.clearHistory();
	            }
	         }, 1000);
		}else {



		}

	}


	///////////////////
	 private OnKeyListener onKeyListener = new OnKeyListener() {
		   @Override
	        public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
	            if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
	            	mProgressDialog.dismiss();

	            }
	            return false;
	        }
	    };



}
