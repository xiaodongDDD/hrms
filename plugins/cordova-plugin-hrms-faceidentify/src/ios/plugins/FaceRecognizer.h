//
//  FaceRecognizer.h
//  HelloCordova
//
//  Created by wangsheng on 2016/12/13.
//
//

#import <Cordova/CDV.h>

@interface FaceRecognizer : CDVPlugin

- (void)faceDetect:(CDVInvokedUrlCommand *)commamd;

//人脸注册登录

- (void)faceLogin:(CDVInvokedUrlCommand *)command;

//人脸对比

- (void)faceCompare:(CDVInvokedUrlCommand *)command;

//人脸刷选

- (void)faceSelect:(CDVInvokedUrlCommand *)command;

//传一个本地图片路径获取本地图片

- (void)getLocalImage:(CDVInvokedUrlCommand *)command;

@end
