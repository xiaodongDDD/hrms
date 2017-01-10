//
//  FaceRecognizer.m
//  HelloCordova
//
//  Created by wangsheng on 2016/12/13.
//
//

#import "FaceRecognizer.h"
#import "FaceVideoDectorViewController.h"
#import "FaceHeader.h"
#import "UIImage+FaceExtensions.h"

@interface FaceRecognizer ()
{
    CDVInvokedUrlCommand *cmd;
}

@end

@implementation FaceRecognizer

-(void)faceDetect:(CDVInvokedUrlCommand *)commamd
{
    cmd = commamd;
    
    FaceVideoDectorViewController *faceVideoDectorVC = [[FaceVideoDectorViewController alloc] init];
    if (commamd.arguments) {
        faceVideoDectorVC.dict = commamd.arguments[0];
    }
    //成功回调
    faceVideoDectorVC.successBlock = ^(UIImage *image,NSDictionary *dict){
        
        if (dict) {
            //把图片写入临时文件中存储
            NSURL *tempPathUrl = [NSURL fileURLWithPath:NSTemporaryDirectory()];
            
            NSString *dateStr = [NSString stringWithFormat:@"%lf.jpg",[[NSDate date] timeIntervalSince1970]];
            
            tempPathUrl = [tempPathUrl URLByAppendingPathComponent:dateStr];
            
            NSData *imageData = UIImageJPEGRepresentation([image fixOrientation],0.92f);
            
            //NSString *imageBase64Str = [imageData base64EncodedStringWithOptions:0];
            
            if ([imageData writeToFile:tempPathUrl.path atomically:YES]) {
                
                NSMutableDictionary *mutableDict = [NSMutableDictionary dictionaryWithDictionary:dict];
                
                [mutableDict setObject:tempPathUrl.absoluteString forKey:@"imgPath"];
                
                [self faceRecognizerDidEnd:mutableDict IsSuccess:YES];
                
            }
        }else{
            NSDictionary *dict = @{@"errorMsg":@"识别失败!"};
            [self faceRecognizerDidEnd:dict IsSuccess:NO];
        }
    };
    
    [self.viewController presentViewController:faceVideoDectorVC animated:NO completion:nil];
    
}

-(void)faceLogin:(CDVInvokedUrlCommand *)command
{
    
}

-(void)faceCompare:(CDVInvokedUrlCommand *)command
{

}

-(void)faceSelect:(CDVInvokedUrlCommand *)command
{
    
}

#pragma makr - 根据图片地址获取本地图片，会返回一个base64图片
-(void)getLocalImage:(CDVInvokedUrlCommand *)command
{
    NSString* localImageUrl = [command.arguments objectAtIndex:0];
    
    NSLog(@"--localImageUrl:%@",localImageUrl);
    
    //取出本地存储的base64的图片
    NSData *imageBase64str = [[NSData alloc] initWithContentsOfFile:localImageUrl];
    
    NSData *data = [[NSData alloc] initWithBase64EncodedData:imageBase64str options:0];
    
    UIImage *image = [[UIImage alloc] initWithData:data];
    
    NSData *compressData = [[image fixOrientation] compressedData];
    
    NSString *base64Str = [compressData base64EncodedStringWithOptions:0];
        
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:base64Str];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

#pragma mark - 回调方法
- (void)faceRecognizerDidEnd:(NSDictionary *)returnDict IsSuccess:(BOOL)isSuccess
{
    CDVPluginResult *result;
    
    NSLog(@"faceRecognizerDidEnd:%@",returnDict);
    if (isSuccess) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:returnDict];
    }else{
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:returnDict];
    }
    
    if (cmd) {
        [self.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
    }
}

@end
