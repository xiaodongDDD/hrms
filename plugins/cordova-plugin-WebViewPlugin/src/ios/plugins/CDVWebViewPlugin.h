//
//  CDVWebViewPlugin.h
//  HelloCordova
//
//  Created by Mr.xiao on 17/2/16.
//
//

#import <Cordova/CDVPlugin.h>

@interface CDVWebViewPlugin : CDVPlugin


- (void)loadWebView:(CDVInvokedUrlCommand *)command;

- (void)dismissWebView:(CDVInvokedUrlCommand *)command;


@end

