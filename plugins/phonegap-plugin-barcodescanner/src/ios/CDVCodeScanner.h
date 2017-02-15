//
//  CDVCodeScanner.h
//  智美开发
//
//  Created by xiaowei on 16/9/26.
//
//

#import <Cordova/CDVPlugin.h>
#import "ZFScanViewController.h"

@interface CDVCodeScanner : CDVPlugin

- (void)scan:(CDVInvokedUrlCommand*)command;


@end
