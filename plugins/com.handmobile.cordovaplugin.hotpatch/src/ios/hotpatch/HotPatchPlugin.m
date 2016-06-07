//
//  BaiduPushPlugin.m
//  HelloCordova
//
//  Created by titengjiang on 15/9/23.
//
//

#import "HotPatchPlugin.h"
#import <AFNetworkingFramwork/AFURLSessionManager.h>
#import <ZipArchive/SSZipArchive.h>
#import "SDPieLoopProgressView.h"
#import "CustomIOSAlertView.h"
//#import "AFURLSessionManager.h"
//#import "SSZipArchive.h"

@implementation HotPatchPlugin{
    NSURL *  _newWWWFloderUrl;
    UIWebView * _webView;
    CDVViewController * _cdvViewController;
    
    UIProgressView * _progressView;
    
    UIAlertView * _alertView;
    SDPieLoopProgressView* _pieView;
    CustomIOSAlertView* _malertView;
}



- (void)pluginInitialize
{
    
    _webView = self.webView;
    _cdvViewController = (CDVViewController *)self.viewController;
    
    
    NSArray  *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    
    NSString * targetUrl =  [documentsDirectory stringByAppendingString:@"/www/index.html"];
    BOOL  isExist = [[NSFileManager defaultManager] fileExistsAtPath:targetUrl];
    
    if(isExist){
        _cdvViewController.startPage = [[NSURL fileURLWithPath:[documentsDirectory stringByAppendingString:@"/www/index.html"]] absoluteString];
        
    }
}

-(void)dealloc{
    
}


#pragma mark public
-(void)updateNewVersion:(CDVInvokedUrlCommand*)command{
    
    _pieView = [[SDPieLoopProgressView alloc] init];
    _pieView.frame=CGRectMake(0, 0, self.webView.center.x/2, self.webView.center.y/2);
    
    
   _malertView = [[CustomIOSAlertView alloc] init];
    
    // Add some custom content to the alert view
    [_malertView setContainerView:_pieView];
    

    [_malertView setUseMotionEffects:true];
    
    // And launch the dialog
    [_malertView show];
    
    
    NSString * updateUrl = [command argumentAtIndex:0];
    if(updateUrl == nil || [updateUrl isEqualToString:@""]){
        [self showProgressAlert:@"错误" withMessage:@"更新地址不能为空"];
        return;
    }
    
    
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
    
    NSProgress *progress;
    
    NSURL *URL = [NSURL URLWithString:updateUrl];
    NSURLRequest *request = [NSURLRequest requestWithURL:URL];
    
    
    
    
    //  [self showProgressAlert:@"正在下载" withMessage:@"下载中"];
    NSURLSessionDownloadTask *downloadTask = [manager downloadTaskWithRequest:request progress:&progress destination:^NSURL *(NSURL *targetPath, NSURLResponse *response) {
        
        NSURL *documentsDirectoryURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
        
        NSURL * targetUrl =  [documentsDirectoryURL URLByAppendingPathComponent:[response suggestedFilename]];
        
        [[NSFileManager defaultManager] removeItemAtURL:targetUrl error:nil];
        
        
        return targetUrl;
        
    } completionHandler:^(NSURLResponse *response, NSURL *filePath, NSError *error) {
        
        NSLog(@"File downloaded to: %@", [filePath path]);
        NSArray  *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        
        _newWWWFloderUrl = [NSURL fileURLWithPath:[documentsDirectory stringByAppendingString:@"/www/index.html"]];
        
        [SSZipArchive unzipFileAtPath:[filePath path] toDestination:documentsDirectory delegate:self];
        
        [_malertView removeFromSuperview];
        
    }];
    [downloadTask resume];
    // 给这个progress添加监听任务
    [progress addObserver:self
               forKeyPath:@"fractionCompleted"
                  options:NSKeyValueObservingOptionNew
                  context:NULL];
    
    
}

#pragma mark kvo
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"fractionCompleted"] && [object isKindOfClass:[NSProgress class]]) {
        NSProgress *progress = (NSProgress *)object;
        NSLog(@"Progress is %f", progress.fractionCompleted);
        [self performSelectorOnMainThread:@selector(progress:) withObject:@(progress.fractionCompleted) waitUntilDone:NO];
        
        
        // 打印这个唯一标示符
        NSLog(@"%@", progress.userInfo);
        
    }
}

#pragma mark delegate

- (void)zipArchiveDidUnzipArchiveAtPath:(NSString *)path zipInfo:(unz_global_info)zipInfo unzippedPath:(NSString *)unzippedPath;
{
    NSURLRequest* appReq = [NSURLRequest requestWithURL:_newWWWFloderUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:20.0];
    [self.webView loadRequest:appReq];
    [_alertView dismissWithClickedButtonIndex:0 animated:YES];
}




- (void)showProgressAlert:(NSString*)title withMessage:(NSString*)message {
    if(_alertView == nil){
        _alertView = [[UIAlertView alloc] initWithTitle:title
                                                message:message
                                               delegate:nil
                                      cancelButtonTitle:nil
                                      otherButtonTitles:nil]
        ;
        
        
    }
    
    
    [_alertView show];
}

-(void)progress:(NSNumber*) progress{
    _pieView.progress=[progress floatValue];
}



@end
