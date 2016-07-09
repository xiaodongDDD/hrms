//
//  WXOAuthEngine.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/8.
//
//

#import <Foundation/Foundation.h>
#import "WXApi.h"


//微信参数
#define WXAppKey @"wxaaeac85f01714b29"
#define WXAppSecret @"44d3af96ad276e74c992380c71d20929"

/*
 *  回调闭包
 *
 *  @param error    错误信息
 *  @param response 成功回调
 */
typedef void(^WXOAuthSuccessBlock)(id response);
typedef void(^WXOAuthFailureBlock)(NSError *error);


@interface WXOAuthEngine : NSObject<WXApiDelegate>
@property (nonatomic,strong)WXOAuthSuccessBlock successBlock;
@property (nonatomic,strong)WXOAuthFailureBlock failureBlock;

/**
 *  初始化工具类单例
 */
+ (instancetype)shared;

/**
 *  检测微信是否已安装
 */
+ (BOOL)isWXAppInstalled;
/**
 *  授权微信登陆
 *
 *  @param success  成功回调
 *  @param failure  失败回调
 */
- (void)authLoginWeChatWithSuccess:(WXOAuthSuccessBlock )success Failure:(WXOAuthFailureBlock )failure;

@end
