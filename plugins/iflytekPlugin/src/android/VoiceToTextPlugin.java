package hand;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.iflytek.cloud.ErrorCode;
import com.iflytek.cloud.InitListener;
import com.iflytek.cloud.RecognizerListener;
import com.iflytek.cloud.RecognizerResult;
import com.iflytek.cloud.SpeechConstant;
import com.iflytek.cloud.SpeechError;
import com.iflytek.cloud.SpeechRecognizer;
import com.iflytek.cloud.SpeechUtility;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.LinkedHashMap;

public class VoiceToTextPlugin extends CordovaPlugin {

  private CallbackContext mCallbackContext;
  // 语音听写对象
  private SpeechRecognizer mIat;
  // 引擎类型
  private String mEngineType = SpeechConstant.TYPE_CLOUD;
  private int ret = 0; // 函数调用返回值
  // 用HashMap存储听写结果
  private HashMap<String, String> mIatResults = new LinkedHashMap<String, String>();
  private String voiceResult;
  private Toast toast;
  protected final static String[] permissions = {Manifest.permission.RECORD_AUDIO};

  @Override
  public void onRestoreStateForActivityResult(Bundle state, CallbackContext callbackContext) {
    mCallbackContext = callbackContext;
    Toast.makeText(cordova.getActivity(), "内存不足，应用已被回收，请重试", Toast.LENGTH_LONG).show();
  }


  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    SpeechUtility.createUtility(cordova.getActivity(), SpeechConstant.APPID + "=580441bf");
    mIat = SpeechRecognizer.createRecognizer(cordova.getActivity(), null);
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    this.mCallbackContext = callbackContext;
    if ("startRecorerRecognize".equals(action)) {
      // 移动数据分析，收集开始听写事件
      checkPermission();
      return true;
    } else if ("stopRecorderRecognize".equals(action)) {
      mIat.stopListening();
      return true;
    }
    mCallbackContext.error("error");
    return false;
  }

  /**
   * 开始进行语言识别
   */
  private void startRecognize() {
    // 设置参数
    setParam();
    // 不显示听写对话框
    ret = mIat.startListening(mRecognizerListener);
    if (ret != ErrorCode.SUCCESS) {
      mCallbackContext.error("听写失败,错误码：" + ret);
    } else {

    }
  }

  private void checkPermission() {
    if (!PermissionHelper.hasPermission(this, Manifest.permission.RECORD_AUDIO)) {
      PermissionHelper.requestPermission(this, 100, Manifest.permission.RECORD_AUDIO);
    } else {
      //已经不是第一次,已经有权限
      startRecognize();
    }
  }

  /**
   * 听写监听器。
   */
  private RecognizerListener mRecognizerListener = new RecognizerListener() {

    @Override
    public void onBeginOfSpeech() {
      // 此回调表示：sdk内部录音机已经准备好了，用户可以开始语音输入
      showToast("开始说话");
    }

    @Override
    public void onError(SpeechError error) {
      // Tips：
      // 错误码：10118(您没有说话)，可能是录音机权限被禁，需要提示用户打开应用的录音权限。
      // 如果使用本地功能（语记）需要提示用户开启语记的录音权限。
      mCallbackContext.error(error.getPlainDescription(true));
    }

    @Override
    public void onEndOfSpeech() {
      // 此回调表示：检测到了语音的尾端点，已经进入识别过程，不再接受语音输入
      showToast("结束说话");
    }

    @Override
    public void onResult(RecognizerResult results, boolean isLast) {
      Log.e("399", results.getResultString());
      printResult(results);

      if (isLast) {
        // TODO 最后的结果
        Log.e("399", "voiceResult: " + voiceResult);
        mCallbackContext.success(voiceResult);
      }
    }

    @Override
    public void onVolumeChanged(int volume, byte[] data) {
//      showTip("当前正在说话，音量大小：" + volume);
//      Log.e("399", "返回音频数据：" + data.length);
    }

    @Override
    public void onEvent(int eventType, int arg1, int arg2, Bundle obj) {
      // 以下代码用于获取与云端的会话id，当业务出错时将会话id提供给技术支持人员，可用于查询会话日志，定位出错原因
      // 若使用本地能力，会话id为null
      //	if (SpeechEvent.EVENT_SESSION_ID == eventType) {
      //		String sid = obj.getString(SpeechEvent.KEY_EVENT_SESSION_ID);
      //		Log.d(TAG, "session id =" + sid);
      //	}
    }
  };

  private void printResult(RecognizerResult results) {
    String text = JsonParser.parseIatResult(results.getResultString());

    String sn = null;
    // 读取json结果中的sn字段
    try {
      JSONObject resultJson = new JSONObject(results.getResultString());
      sn = resultJson.optString("sn");
    } catch (JSONException e) {
      e.printStackTrace();
    }

    mIatResults.put(sn, text);

    StringBuffer resultBuffer = new StringBuffer();
    for (String key : mIatResults.keySet()) {
      resultBuffer.append(mIatResults.get(key));
    }
    voiceResult = resultBuffer.toString();

  }

  /**
   * 参数设置
   *
   * @return
   */
  public void setParam() {
    // 清空参数
    mIat.setParameter(SpeechConstant.PARAMS, null);

    // 设置听写引擎
    mIat.setParameter(SpeechConstant.ENGINE_TYPE, mEngineType);
    // 设置返回结果格式
    mIat.setParameter(SpeechConstant.RESULT_TYPE, "json");

    // 设置语言
    mIat.setParameter(SpeechConstant.LANGUAGE, "zh_cn");
    // 设置语言区域
//    mIat.setParameter(SpeechConstant.ACCENT, "mandarin");

    // 设置语音前端点:静音超时时间，即用户多长时间不说话则当做超时处理
    mIat.setParameter(SpeechConstant.VAD_BOS, "4000");

    // 设置语音后端点:后端点静音检测时间，即用户停止说话多长时间内即认为不再输入， 自动停止录音
    mIat.setParameter(SpeechConstant.VAD_EOS, "1000");

    // 设置标点符号,设置为"0"返回结果无标点,设置为"1"返回结果有标点
    mIat.setParameter(SpeechConstant.ASR_PTT, "0");

    // 设置音频保存路径，保存音频格式支持pcm、wav，设置路径为sd卡请注意WRITE_EXTERNAL_STORAGE权限
    // 注：AUDIO_FORMAT参数语记需要更新版本才能生效
//    mIat.setParameter(SpeechConstant.AUDIO_FORMAT, "wav");
//    mIat.setParameter(SpeechConstant.ASR_AUDIO_PATH, Environment.getExternalStorageDirectory() + "/msc/iat.wav");
  }

  @Override
  public void onDestroy() {
    // 退出时释放连接
    mIat.cancel();
    mIat.destroy();
  }

  private void showToast(String msg) {
//    if (toast == null) {
//      toast = Toast.makeText(cordova.getActivity(), "", Toast.LENGTH_SHORT);
//    }
//    toast.setText(msg);
//    toast.show();
  }

  @Override
  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
    if (requestCode == 100) {
      if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        startRecognize();//开始识别
      } else {
        showToast("授权失败");
        mCallbackContext.error("授权失败");
      }
    }
  }
}
