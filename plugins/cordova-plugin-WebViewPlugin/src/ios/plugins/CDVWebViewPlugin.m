//
//  CDVWebViewPlugin.m
//  HelloCordova
//
//  Created by Mr.xiao on 17/2/16.
//
//

#import "CDVWebViewPlugin.h"
#import "WebPluginController.h"

@interface CDVWebViewPlugin ()

@property (nonatomic ,strong) WebPluginController *webPluginCtrl;

@end

@implementation CDVWebViewPlugin

- (void)loadWebView:(CDVInvokedUrlCommand *)command{
    NSString *result = [[command arguments] firstObject];
    self.webPluginCtrl = [[WebPluginController alloc] init];
    self.webPluginCtrl.fileUrl = result;
    __weak CDVWebViewPlugin *weakSelf = self;
    
    [self.commandDelegate runInBackground:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            dispatch_async(dispatch_get_main_queue(), ^{
                weakSelf.webPluginCtrl.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                [weakSelf.viewController presentViewController:weakSelf.webPluginCtrl animated:YES completion:nil];
            });
        });
        
    }];
}

- (void)dismissWebView:(CDVInvokedUrlCommand *)command{
    
    __weak CDVWebViewPlugin *weakSelf = self;
    
    [self.commandDelegate runInBackground:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            [weakSelf.viewController dismissViewControllerAnimated:YES completion:nil];
        });
    }];
}

@end
