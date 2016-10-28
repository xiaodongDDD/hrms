package com.hand.im.model;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by cool on 2016/10/17.
 */

public class PhotoModel implements Parcelable {
  private String path;
  private boolean isSelected;

  public PhotoModel(String path) {
    this.path = path;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public boolean isSelected() {
    return isSelected;
  }

  public void setSelected(boolean selected) {
    isSelected = selected;
  }

  @Override
  public int describeContents() {
    return 0;
  }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeString(this.path);
    dest.writeByte(this.isSelected ? (byte) 1 : (byte) 0);
  }

  public PhotoModel() {
  }

  protected PhotoModel(Parcel in) {
    this.path = in.readString();
    this.isSelected = in.readByte() != 0;
  }

  public static final Parcelable.Creator<PhotoModel> CREATOR = new Parcelable.Creator<PhotoModel>() {
    @Override
    public PhotoModel createFromParcel(Parcel source) {
      return new PhotoModel(source);
    }

    @Override
    public PhotoModel[] newArray(int size) {
      return new PhotoModel[size];
    }
  };
}
