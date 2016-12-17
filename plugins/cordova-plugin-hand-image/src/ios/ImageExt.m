//
//  ImageExt.m
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/25.
//
//

#import "ImageExt.h"
#import "ImageCutViewController.h"

// 字符空值验证
#define  MY_NSString_IsEmpty(x) !(x && x.length > 0)

@interface ImageExt (){
    
    //    NSString* _databasePath;
    //    sqlite3 *_personDB;
    //    NSString* _statusString;
    //    NSString* _nameString;
    //    NSString* _ageString;
    NSString * _callbackId;
    NSInteger _resCode;
    
    NSMutableArray* rowsArray;
    
}

@end


@implementation ImageExt




- (void) cropdrawable:(CDVInvokedUrlCommand*)command {
    _callbackId = [command callbackId];
    _resCode = 0;
    //[self callResultSucc];
    
    NSString* imagePath = [[command arguments] objectAtIndex:0];
    NSNumber* width = [[command arguments] objectAtIndex:1];
    NSNumber* height = [[command arguments] objectAtIndex:2];
    
//    [self.commandDelegate runInBackground:^{
    
        ImageCutViewController * imageCutViewController =
        [[ImageCutViewController alloc] initWithImagePath:imagePath
                                                    width:[width integerValue]
                                                   height:[height integerValue]];
        
        imageCutViewController.delegate = self;
        
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:imageCutViewController];
        
        [self.viewController presentViewController:nav animated:YES completion:nil];
        
//    }];
    
}



- (void) cropCircleDrawable:(CDVInvokedUrlCommand*)command {
    _callbackId = [command callbackId];
    _resCode = 0;
    //[self callResultSucc];
    
    NSString* imagePath = [[command arguments] objectAtIndex:0];
    NSNumber* radius = [[command arguments] objectAtIndex:1];
    
    
    
//    [self.commandDelegate runInBackground:^{
    
        ImageCutViewController * imageCutViewController =
        [[ImageCutViewController alloc] initWithImagePath:imagePath
                                                    width:[radius integerValue]
                                                   height:[radius integerValue]];
        imageCutViewController.pageTitle = @"移动和缩放";
        imageCutViewController.masktype = kMASK_TYPE_CIRCLE;
        imageCutViewController.delegate = self;
        imageCutViewController.showToolBarView = NO;
        
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:imageCutViewController];
        
        [self.viewController presentViewController:nav animated:YES completion:nil];
        
//    }];
    
}


- (void) cropimage:(CDVInvokedUrlCommand*)command {
    _callbackId = [command callbackId];
    _resCode = 0;
    //[self callResultSucc];
    
    NSString* imagePath = [[command arguments] objectAtIndex:0];
    NSNumber* radius = [NSNumber numberWithInteger:350];
    
    if (MY_NSString_IsEmpty(imagePath)) {
        [self nativeViewDismissFaild:@"url为空"];
    }
    else{
        //    [self.commandDelegate runInBackground:^{
        
        ImageCutViewController * imageCutViewController =
        [[ImageCutViewController alloc] initWithImagePath:imagePath
                                                    width:[radius integerValue]
                                                   height:[radius integerValue]];
        imageCutViewController.pageTitle = @"移动和缩放";
        imageCutViewController.masktype = kMASK_TYPE_CIRCLE;
        imageCutViewController.delegate = self;
        imageCutViewController.showToolBarView = NO;
        
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:imageCutViewController];
        
        [self.viewController presentViewController:nav animated:YES completion:nil];
        
        //    }];
    }
    

}






- (void) rotatedrawable:(CDVInvokedUrlCommand*)command {
    _callbackId = [command callbackId];
    _resCode = 0;
    //[self callResultSucc];
    
    NSString* imagePath = [[command arguments] objectAtIndex:0];
    
    if (MY_NSString_IsEmpty(imagePath)) {
        [self nativeViewDismissFaild:@"url为空"];
    }
    else{
//    [self.commandDelegate runInBackground:^{
    
        ImageRotateViewController * imageRotateViewController = [[ImageRotateViewController alloc] initWithImagePath:imagePath];
        
        imageRotateViewController.delegate = self;
        
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:imageRotateViewController];
        
        [self.viewController presentViewController:nav animated:YES completion:nil];
        
//    }];
    }
    
}



- (void) nativeViewDismissSuccess:(NSString*)resultStr {
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:resultStr];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    
}

- (void) nativeViewDismissFaild:(NSString*)resultStr {
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_ERROR
                               messageAsString:resultStr];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    
}


- (void) callResultSucc {
    
    NSMutableArray * resultArray = [[NSMutableArray alloc] init];
    
    
    NSMutableDictionary *obj = [[NSMutableDictionary alloc] init];
    [obj setValue:[NSNumber numberWithInteger:_resCode] forKey:@"code"];
    //    [obj setValue:_statusString forKey:@"desc"];
    //    [obj setValue:fullPath forKey:@"fullPath"];
    //    [obj setValue:[NSNumber numberWithBool:isDir] forKey:@"isDirectory"];
    //    [obj setValue:directory forKey:@"parentPath"];
    //    [obj setValue:[NSNumber numberWithInt:isEncFile] forKey:@"isEnryptedFile"];
    [resultArray addObject:obj];
    
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsArray:resultArray];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

- (void) callResultFail {
    
    NSMutableArray * resultArray = [[NSMutableArray alloc] init];
    
    
    NSMutableDictionary *obj = [[NSMutableDictionary alloc] init];
    [obj setValue:[NSNumber numberWithInteger:_resCode] forKey:@"code"];
    //    [obj setValue:_statusString forKey:@"desc"];
    
    //    [obj setValue:fullPath forKey:@"fullPath"];
    //    [obj setValue:[NSNumber numberWithBool:isDir] forKey:@"isDirectory"];
    //    [obj setValue:directory forKey:@"parentPath"];
    //    [obj setValue:[NSNumber numberWithInt:isEncFile] forKey:@"isEnryptedFile"];
    [resultArray addObject:obj];
    
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_ERROR
                               messageAsArray:resultArray];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}


@end

