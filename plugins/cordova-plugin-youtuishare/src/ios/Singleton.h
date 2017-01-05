//
//  Singleton.h
//  youtuiShareDemo
//
//  Created by FreeGeek on 15-1-13.
//  Copyright (c) 2015年 FreeGeek. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Singleton : NSObject
@property (strong , nonatomic) NSString * ShareTitle;
@property (strong , nonatomic) NSString * ShareURL;
@property (strong , nonatomic) NSString * ShareDescription;
@property (strong , nonatomic) NSString * ShareImageURL;
@property (strong , nonatomic) NSString * ShareVideoURL;
@property (strong , nonatomic) UIImage  * ShareImage;
+(Singleton *)ObtainSingletonObject;
@end
