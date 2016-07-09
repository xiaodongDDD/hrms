//
//  DidiView.h
//  didiPlugin
//
//  Created by yanjun.li on 16/1/7.
//
//

#import <Cordova/CDVPlugin.h>


@interface scanCard : CDVPlugin{
 NSString* _errorflag;
}
-(void)takePicture:(CDVInvokedUrlCommand *)command;
-(void)choosePicture:(CDVInvokedUrlCommand *)command;

@property (weak, nonatomic) NSString             * successMsg;
@property (weak, nonatomic) NSString             * errorMsg;
@property (strong, nonatomic) CDVInvokedUrlCommand * _command;
@property (strong, nonatomic) NSDictionary * dict;

@end

