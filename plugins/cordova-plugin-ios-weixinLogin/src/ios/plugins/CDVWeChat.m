//
//  CDVWeChat.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/8.
//
//

#import "CDVWeChat.h"
#import "WXOAuthEngine.h"
#import "AppDelegate.h"
@interface CDVWeChat ()<UIAlertViewDelegate>
{
    WXOAuthEngine *wxOAuthEngine;
}
@end

@implementation CDVWeChat

-(void)openWeChatLoad:(CDVInvokedUrlCommand *)command
{
    wxOAuthEngine = [WXOAuthEngine shared];
    [self WXOAuthLogin:command];
    
}
- (void)WXOAuthLogin:(CDVInvokedUrlCommand *)cmd;
{
    __block CDVPluginResult *result;
    __weak CDVWeChat *weakSelf = self;
    if ([WXOAuthEngine isWXAppInstalled]) {
        [wxOAuthEngine authLoginWeChatWithSuccess:^(id response) {
            //获取用户的昵称(nickname)，图像(headimgurl),用户统一标示(unionid)
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:(NSDictionary *)response];
            [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
        } Failure:^(NSError *error) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[NSDictionary dictionaryWithObjects:@[@(error.code),error.userInfo] forKeys:@[@"errorCode",@"errorDescription"]]];
            [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
        }];
    }else{
        [self showAlertView];
    }
}
//弹出框提示去下载微信
- (void)showAlertView
{
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:nil message:@"您的手机上面没有安装微信客户端,请前往appStore下载" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"前往", nil];
    [alertView show];
}
//打开appstore 微信客户端 https://itunes.apple.com/cn/app/id414478124/
- (void)openAppStore
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"itms-apps://itunes.apple.com/cn/app/id414478124"]];
}
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if (buttonIndex==1) {
        [self openAppStore];//去appStore下载微信
    }
}
@end
