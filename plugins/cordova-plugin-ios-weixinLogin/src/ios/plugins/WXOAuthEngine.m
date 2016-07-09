//
//  WXOAuthEngine.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/8.
//
//

#import "WXOAuthEngine.h"

@interface WXOAuthEngine ()

@end

static WXOAuthEngine *wxOAuthEngine;

@implementation WXOAuthEngine


+ (instancetype)shared {
    
    @synchronized(self) {
        wxOAuthEngine = [[self alloc] init];
    }
    return wxOAuthEngine;
}
//初始化就调用的方法
+(void)initialize
{
    // 微信注册授权
    [WXApi registerApp:WXAppKey withDescription:@"weixin"];
}
+(BOOL)isWXAppInstalled
{
    return [WXApi isWXAppInstalled];
}

//微信登录部分

/*
 这个代理可以不写任何东西，因为是微信向我发送消息，一般不存在这个情况
 */
-(void)onReq:(BaseReq *)req {
    
    
}

/*
 在这里接收微信返回的状态（成功或者失败）
 以此进行相应的回应操作如：登陆成功进入APP、提示用户分享成功或者失败etc
 
 当然你可以不做任何操作不会报错（用户体验不敢想象- - ~！）
 */
-(void)onResp:(BaseResp *)resp {
    
    // 回应有2种：1：授权登陆回应 2：分享回应
    if ([resp isKindOfClass:[SendAuthResp class]]) { // 授权登陆回应
        
        [self completeAuth:(SendAuthResp*)resp];
    }
}

// 授权登陆操作：获取code、access_token、openid、userinfo
- (void)completeAuth:(SendAuthResp *)resp {
    NSLog(@"获取code：%@",resp.code);
    
    // 获取code
    NSString *code = resp.code;
    
    // 拼接获取token url
    NSURL *getTokenUrl = [NSURL URLWithString:[NSString stringWithFormat:@"https://api.weixin.qq.com/sns/oauth2/access_token?appid=%@&secret=%@&code=%@&grant_type=authorization_code",WXAppKey,WXAppSecret,code]];
    
    // 获取access_token
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration ephemeralSessionConfiguration]];
    NSURLSessionDataTask *access_tokenTask = [session dataTaskWithURL:getTokenUrl completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        
        if(!error) {
            
            // 响应状态代码为200，代表请求数据成功，判断成功后我们再进行数据解析
            NSHTTPURLResponse *access_tokenHttpResp = (NSHTTPURLResponse*) response;
            if (access_tokenHttpResp.statusCode == 200) {
                
                NSError *access_tokenError;
                //解析NSData数据
                NSDictionary *access_tokenJSON =
                [NSJSONSerialization JSONObjectWithData:data
                                                options:NSJSONReadingAllowFragments
                                                  error:&access_tokenError];
                if (!access_tokenError) {
                    
                    // 记录access_token 和 openid
                    NSString *access_token = access_tokenJSON[@"access_token"];
                    NSString *openid = access_tokenJSON[@"openid"];
                    
                    NSLog(@"access_token:%@",access_token);
                    NSURL *getUserInfoUrl = [NSURL URLWithString:[NSString stringWithFormat:@"https://api.weixin.qq.com/sns/userinfo?access_token=%@&openid=%@",access_token,openid]];
                    
                    NSURLSessionDataTask *userInfoTask = [session dataTaskWithURL:getUserInfoUrl completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
                        
                         NSDictionary *userInfoJSON =
                        [NSJSONSerialization JSONObjectWithData:data
                                                        options:NSJSONReadingAllowFragments
                                                          error:nil];
                        
                        if(self.successBlock){
                            self.successBlock(userInfoJSON);
                        }
                        
                    }];
                    [userInfoTask resume];
                }
                else {
                    
                    if(self.failureBlock) self.failureBlock(error);
                }
            }
            else {
                
                if(self.failureBlock) self.failureBlock(error);
            }
        }
        else {
            
            if(self.failureBlock) self.failureBlock(error);
        }
    }];
    [access_tokenTask resume];
}

-(void)authLoginWeChatWithSuccess:(WXOAuthSuccessBlock)success Failure:(WXOAuthFailureBlock)failure
{
    self.successBlock = success;
    self.failureBlock = failure;
    
    
    //构造SendAuthReq结构体
    SendAuthReq *req =[[SendAuthReq alloc ] init];
    // 这个字符串参考官方注释,有以下几个可选:@"snsapi_message,snsapi_userinfo,snsapi_friend,snsapi_contact"
    req.scope = @"snsapi_userinfo" ;
    // 这个字符串你最好使用加密算法得到,这里我是乱写的,功能无影响
    req.state = @"qwertyuioplkjhgfdsazxcvbnm" ;
    //第三方向微信终端发送一个SendAuthReq消息结构
    [WXApi sendReq:req];

}

@end
