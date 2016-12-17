//
//  ImageExt.h
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/25.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "ViewControllerDelegate.h"
#import "ImageRotateViewController.h"


@interface ImageExt : CDVPlugin <ViewControllerDelegate>

- (void) cropdrawable:(CDVInvokedUrlCommand*)command;
- (void) rotatedrawable:(CDVInvokedUrlCommand*)command;
- (void) cropCircleDrawable:(CDVInvokedUrlCommand*)command;

- (void) cropimage:(CDVInvokedUrlCommand*)command;


@end

