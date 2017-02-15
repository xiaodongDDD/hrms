//
//  CDVCodeScanner.m
//  智美开发
//
//  Created by xiaowei on 16/9/26.
//
//

#import "CDVCodeScanner.h"
#import <AVFoundation/AVFoundation.h>

typedef NS_ENUM(NSUInteger,XWAuthStatus){
    XWAuthStatusAuthorized,//接受
    XWAuthStatusDenoied,//拒绝
    XWAuthStatusRestricted,//权限
    XWAuthStatusNoSupported //不支持
};

@implementation CDVCodeScanner{

    CDVPluginResult* result;
}

- (void)excuteWithStatus:(XWAuthStatus)status command:(CDVInvokedUrlCommand *)command{
    switch (status) {
        case XWAuthStatusAuthorized:{
            [self startCamera:command];
            break;
        }
        case XWAuthStatusDenoied:
        case XWAuthStatusRestricted:{
            UIAlertController *alertCtrl = [UIAlertController alertControllerWithTitle:@"无法访问相机" message:@"请在iPhone的""设置-隐私-相机""中允许访问相机" preferredStyle:UIAlertControllerStyleAlert];
            [alertCtrl addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {

            }]];
            [alertCtrl addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
                });
            }]];
            dispatch_async(dispatch_get_main_queue(), ^{
            [self.viewController presentViewController:alertCtrl animated:YES completion:NULL];
            });
            break;
        }
        case XWAuthStatusNoSupported:{

            break;
        }
        default:
            break;
    }
}

- (void)scan:(CDVInvokedUrlCommand*)command{
    __weak typeof(self)weakSelf = self;
    if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]){
        AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
        if(authStatus == AVAuthorizationStatusNotDetermined){
            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
                if(granted){
                    [weakSelf excuteWithStatus:XWAuthStatusAuthorized command:command];
                }else{
                    [weakSelf excuteWithStatus:XWAuthStatusDenoied command:command];
                }
            }];
        }else if (authStatus == AVAuthorizationStatusAuthorized){
            [weakSelf excuteWithStatus:XWAuthStatusAuthorized command:command];
        }else if (authStatus == AVAuthorizationStatusDenied){
            [weakSelf excuteWithStatus:XWAuthStatusDenoied command:command];
        }else if (authStatus == AVAuthorizationStatusRestricted){
            [weakSelf excuteWithStatus:XWAuthStatusRestricted command:command];
        }
    }else{
        [weakSelf excuteWithStatus:XWAuthStatusNoSupported command:command];
    }
}

- (void)startCamera:(CDVInvokedUrlCommand *)command{
    ZFScanViewController *scanCtrl = [[ZFScanViewController alloc]init];

    __weak CDVCodeScanner *weakSelf = self;

    scanCtrl.returnScanBarCodeValue = ^(NSString *barCodeString){
        NSMutableDictionary* resultDict = [[NSMutableDictionary alloc] init];
        [resultDict setObject:barCodeString forKey:@"text"];
        [resultDict setObject:@"sdf" forKey:@"format"];
        [resultDict setObject:@(0) forKey:@"cancelled"];
        NSLog(@"bar = %@",barCodeString);

        result = [CDVPluginResult resultWithStatus: CDVCommandStatus_OK
                               messageAsDictionary: resultDict
                  ];
        [weakSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    };
    scanCtrl.dismissBlock = ^(){
        CDVPluginResult *cancelResult = [CDVPluginResult resultWithStatus: CDVCommandStatus_OK
                                                      messageAsDictionary: @{@"text":@"cancel",@"cancelled":@(1),@"format":@"sdf"}
                                         ];
        [weakSelf.commandDelegate sendPluginResult:cancelResult callbackId:command.callbackId];
    };

    dispatch_async(dispatch_get_main_queue(), ^{
        [self.viewController presentViewController:scanCtrl animated:YES completion:NULL];
    });
}

@end
