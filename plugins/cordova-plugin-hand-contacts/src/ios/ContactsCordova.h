//
//  ContactsCordova.h
//  联系人插件演示
//
//  Created by 吴笑诚 on 2016/12/12.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>


@interface ContactsCordova : CDVPlugin

- (void) pickContact:(CDVInvokedUrlCommand*)command;



@end

