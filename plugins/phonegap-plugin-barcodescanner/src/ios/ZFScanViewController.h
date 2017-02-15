
//
//  ZFScanViewController.h
//  ZFScan
//
//  Created by xiaowei on 16/6/26.
//  Copyright © 2016年 xiaowei. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ZFScanViewController : UIViewController

/** 扫描结果 */
@property (nonatomic, copy) void (^returnScanBarCodeValue)(NSString * barCodeString);

@property (nonatomic,copy)void(^dismissBlock)();

@end
