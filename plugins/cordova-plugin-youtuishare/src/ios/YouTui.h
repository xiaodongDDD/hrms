#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>


@interface YouTui : CDVPlugin

@property (nonatomic, copy) NSString *callbackId;

- (void)share:(CDVInvokedUrlCommand*)command;

@end
