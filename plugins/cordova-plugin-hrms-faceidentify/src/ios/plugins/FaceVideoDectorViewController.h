//
//  FaceVideoDectorViewController.h
//  讯飞-人脸识别-从组中识别
//
//  Created by wangsheng on 2016/12/8.
//  Copyright © 2016年 wangsheng. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, FaceRecognizerType) {
    FaceRecognizerTypeRegister = 0, //注册
    FaceRecognizerTypeCompare = 1,  //比对(1:1)
    FaceRecognizerTypeSelect  =2    //筛选(1:N)
};

typedef void(^FaceVideoDectorSuccessRecognizer)(UIImage *image,NSDictionary *dict);

@interface FaceVideoDectorViewController : UIViewController

@property (nonatomic,strong)FaceVideoDectorSuccessRecognizer successBlock;

@property (nonatomic,assign)FaceRecognizerType faceRecognizerType;

@property (nonatomic,strong)NSDictionary *dict;

@property (nonatomic,copy)NSString *userId;
@end
