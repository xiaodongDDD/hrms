package com.hand.im.contact;

import android.app.ActionBar;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.TextView;

import com.hand.im.Util;

/**
 * Created by panx on 2016/9/21.
 */
public class TipDialog extends Dialog {
    public TipDialog(Context context) {
        super(context);
    }

    public TipDialog(Context context, int themeResId) {
        super(context, themeResId);
    }

    protected TipDialog(Context context, boolean cancelable, OnCancelListener cancelListener) {
        super(context, cancelable, cancelListener);
    }

    public static class Builder {
        private Context context;
        private String title;
        private String content;
        private String positiveButtonText;
        private String negativeButtonText;
        private DialogInterface.OnClickListener positiveButtonOnClickListener;
        private DialogInterface.OnClickListener negativeButtonOnClickListener;

        public Builder(Context context) {
            this.context = context;
        }

        public Builder setTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder setContent(String content) {
            this.content = content;
            return this;
        }

        public Builder setPositiveButton(String text, DialogInterface.OnClickListener listener) {
            this.positiveButtonText = text;
            this.positiveButtonOnClickListener = listener;
            return this;
        }

        public Builder setNegativeButton(String text,DialogInterface.OnClickListener listener){
            this.negativeButtonText = text;
            this.negativeButtonOnClickListener = listener;
            return this;
        }

        public TipDialog create(){
            LayoutInflater inflater = LayoutInflater.from(context);
            final TipDialog dialog = new TipDialog(context, Util.getRS("Dialog","style",context));
            dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
            View view = inflater.inflate(Util.getRS("dialog_tip","layout",context),null);
            dialog.addContentView(view,new
                    ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            if(title!=null){
                ((TextView)view.findViewById(Util.getRS("title","id",context))).setText(title);
            }
            if(content!=null){
                ((TextView)view.findViewById(Util.getRS("content","id",context))).setText(content);
            }
            TextView txtOK = (TextView)view.findViewById(Util.getRS("txtOK","id",context));
            TextView txtCancel = (TextView)view.findViewById(Util.getRS("txtCancel","id",context));
            if(positiveButtonText!=null){
                txtOK.setText(positiveButtonText);
            }
            if(negativeButtonText!=null){
                txtCancel.setText(negativeButtonText);
            }
            if(positiveButtonOnClickListener!=null){
                txtOK.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View view) {
                        positiveButtonOnClickListener.onClick(dialog,
                                DialogInterface.BUTTON_POSITIVE);
                    }
                });
            }
            if(negativeButtonOnClickListener!=null){
                txtCancel.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View view) {
                        negativeButtonOnClickListener.onClick(dialog,
                                DialogInterface.BUTTON_NEGATIVE);
                    }
                });
            }

            dialog.setContentView(view);
            return dialog;
        }
    }
}
