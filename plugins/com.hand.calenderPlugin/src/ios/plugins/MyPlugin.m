//
//  MyPlugin.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/5.
//
//

#import "MyPlugin.h"
#import "RootViewController.h"
#import "CalendarDayModel.h"
@interface MyPlugin()
{
    CDVInvokedUrlCommand *cmd1;
    CDVInvokedUrlCommand *cmd2;
    RootViewController *rootVC;
}
@end

@implementation MyPlugin

-(void)openCalender:(CDVInvokedUrlCommand *)cmd
{
    if ([cmd.arguments.firstObject boolValue]) {
        [self function1:cmd];
    }else{
        [self function2:cmd];
    }
}

//日期区间
- (void)function1:(CDVInvokedUrlCommand *)cmd
{
    rootVC = [[RootViewController alloc] initIfIsCalender:YES];
    __weak MyPlugin *weakSelf = self;
    rootVC.rootBlock = ^(NSMutableArray *array){
        CDVPluginResult *result;
        if (cmd.arguments.count) {
            NSMutableArray *daysString = [NSMutableArray array];
            //返回Json文件
            for (CalendarDayModel *dayModel in array) {
                [daysString addObject:[dayModel toString]];//把数据模型转换成字符串
            }
            NSDictionary *JSon = [[NSDictionary alloc]initWithObjects:@[daysString] forKeys:@[@"result"]];
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",JSon]];
        }else{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OK"];
        }
        
        [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
    };
    [self.viewController presentViewController:rootVC animated:YES completion:nil];
    
}
//截止日期
-(void)function2:(CDVInvokedUrlCommand *)cmd
{
    rootVC = [[RootViewController alloc] initIfIsCalender:NO];
    __weak MyPlugin *weakSelf = self;
    //  CalendarDayModel *day;
    rootVC.rootBlock = ^(NSMutableArray *array){
        CDVPluginResult *result;
        if (cmd.arguments.count) {
            //返回Json文件
            NSString *dayString = [(CalendarDayModel *)array.firstObject toString];//把数据模型转换成字符串
            NSDictionary *JSon = [[NSDictionary alloc]initWithObjects:@[dayString] forKeys:@[@"result"]];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",JSon]];
        }else{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OK"];
        }
        
        [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
    };
    [self.viewController presentViewController:rootVC animated:YES completion:nil];
    
}

@end
