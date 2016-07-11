//
//  MyPlugin.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/5.
//
//

#import "CDVCalendar.h"
#import "RootViewController.h"
#import "CalendarDayModel.h"

@interface CDVCalendar()
{
    RootViewController *rootVC;
}
@end

@implementation CDVCalendar

-(void)openCalendar:(CDVInvokedUrlCommand *)cmd
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
    __weak CDVCalendar *weakSelf = self;
    rootVC.rootBlock = ^(NSMutableArray *array){
        CDVPluginResult *result;
        if (cmd.arguments.count) {
            NSMutableArray *daysString = [NSMutableArray array];
            //返回Json文件
            for (CalendarDayModel *dayModel in array) {
                [daysString addObject:[dayModel toString]];//把数据模型转换成字符串
            }
            NSDictionary *JSon = [NSDictionary dictionaryWithObject:@[daysString.firstObject,daysString.lastObject] forKey:@"result"];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:JSon];
        }else{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:@{@"result":@"Please pass args!"}];
        }
        
        [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
    };
    [self.viewController presentViewController:rootVC animated:YES completion:nil];
    
}
//截止日期
-(void)function2:(CDVInvokedUrlCommand *)cmd
{
    rootVC = [[RootViewController alloc] initIfIsCalender:NO];
    __weak CDVCalendar *weakSelf = self;
    //  CalendarDayModel *day;
    rootVC.rootBlock = ^(NSMutableArray *array){
        CDVPluginResult *result;
        if (cmd.arguments.count) {
            //返回Json文件
            NSString *dayString = [(CalendarDayModel *)array.firstObject toString];//把数据模型转换成字符串
            NSDictionary *JSon = [[NSDictionary alloc]initWithObjects:@[dayString] forKeys:@[@"result"]];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:JSon];
        }else{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:@{@"result":@"Please pass args!"}];
        }
        
        [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
    };
    [self.viewController presentViewController:rootVC animated:YES completion:nil];
    
}

@end
