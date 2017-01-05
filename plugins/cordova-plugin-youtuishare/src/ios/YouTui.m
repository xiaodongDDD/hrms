#import "YouTui.h"
#import "PrefixHeader.pch"
#import "GiftTalkSheetView.h"
#import "FreeGeekSheet.h"
#import "FreeGeekNavigationController.h"
#import <Cordova/CDVPluginResult.h>
#import <ScreenShot/ScreenShot.h>


@interface YouTui()<GiftTalkSheetDelegate,FreeGeekDelegate,MessageCallBackDelegate,MailCallBackDelegate,YouTuiScreenShotDelegate,WxandQQDelegate>
{
    NSString * resultsMessage;
    NSArray * titleArray;
    NSArray * imageArray;
    YouTuiSDK * YTsdk;
    NSDictionary * ChannelPoint;
    NSString * ActivityName;
    NSArray * PointArray;
    BOOL IsShowRedDot;
    Singleton * singletonObject;
    NSString * Token;
    NSUserDefaults * defaults;
    BOOL IsAuth;
    BOOL IsShare;
    
}

@end

@implementation YouTui

@synthesize callbackId;

- (void)share:(CDVInvokedUrlCommand*)command
{
    callbackId = command.callbackId;
    NSArray* arguments = command.arguments;
    NSLog(@"arguments = %@",arguments);
    [self youtui:arguments];
}

- (void) youtui:args
{
    NSLog(@"args1 = %@",[args objectAtIndex:1]);
    [YouTuiSDK connectYouTuiSDKWithAppId:YOUTUIAPPKEY
                               appSecret:YOUTUIAPPSECRET
                              inviteCode:@""
                               appUserId:AppUserID];
    
    NSLog(@"微信是否安装:%d",[YouTuiSDK WxIsAppOnstalled]);
    NSLog(@"新浪微博是否安装:%d",[YouTuiSDK SinaIsAppInstalled]);
    NSLog(@"QQ是否安装:%d",[YouTuiSDK QQisInstalled]);
    NSLog(@"腾讯微博是否安装:%d",[YouTuiSDK TencentWBIsAppOnstalled]);
    NSLog(@"人人网是否安装:%d",[YouTuiSDK RennIsAppOnstalled]);
    
    //    titleArray =
    //    @[@"微信",@"微信朋友圈",@"微信收藏",@"新浪微博",@"QQ",@"QQ空间",@"腾讯微博",@"人人网",@"短信",@"邮件",@"复制链接",@"截屏涂鸦"];
    //    imageArray = @[@"wechat",@"wechatf",@"wechatc",@"sina",@"qq",@"qqzone",@"tcwb",@"renn",@"sms",@"email",@"mark",@"shot"];
    
    titleArray =
    @[@"微信",@"微信朋友圈",@"微信收藏", @"QQ", @"QQ空间", @"复制链接"];
    imageArray = @[@"wechat",@"wechatf", @"wechatc", @"qq", @"qqzone", @"mark"];
    
    
    /**
     *  这里是获取友推后台设置的分享内容,开发者根据实际情况在友推后台设置参数.
     */
    [self GetShareContent:args];
    NSLog(@"singletonObject = %@",singletonObject.ShareTitle);
    
    GiftTalkSheetView * SheetView = [[GiftTalkSheetView alloc]initWithTitleArray:titleArray
                                                                      ImageArray:imageArray
                                                                      PointArray:PointArray
                                                                    ActivityName:ActivityName
                                                                        Delegate:self];
    [SheetView ShowInView:self.webView];
}


-(void)GetShareContent:arguments
{
    NSLog(@"arguments = %@",arguments);
    NSString* shareTitle = [arguments objectAtIndex:0];
    NSString* shareURL = [arguments objectAtIndex:1];
    NSString* shareDesc = [arguments objectAtIndex:2];
    NSString* shareImageURL = [arguments objectAtIndex:3];
    
    singletonObject = [Singleton ObtainSingletonObject];
    singletonObject.ShareTitle = shareTitle;
    singletonObject.ShareURL = shareURL;
    singletonObject.ShareDescription = shareDesc;
    singletonObject.ShareImageURL = shareImageURL;
    singletonObject.ShareVideoURL = nil;
    singletonObject.ShareImage = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:singletonObject.ShareImageURL]]];
}


-(void)GiftTalkShareButtonAction:(NSInteger *)buttonIndex
{

    NSLog(@"singletonObject = %@",singletonObject.ShareTitle);
    NSLog(@"buttonIndex = %d",(int)buttonIndex);
    if (YTsdk == nil)
    {
        YTsdk = [[YouTuiSDK alloc]init];
    }
    switch ((int)buttonIndex)
    {
        case 0:
        {
            NSLog(@"微信好友--图文");
            //微信
            NSInteger len = UIImageJPEGRepresentation(singletonObject.ShareImage, 1.0).length / 1024;
            
            while (len > 10) {
                singletonObject.ShareImage = [self compressForUpload:singletonObject.ShareImage scale:0.7];
                len = UIImageJPEGRepresentation(singletonObject.ShareImage, 1.0).length / 1024;
                NSLog(@"current image size is: %ld", (long)len);
            }

            [YTsdk connectWxWithAppKey:WXAppKey WithDescription:@"YoutuiPlugin"];
            
            
            //图文分享
            [YTsdk WxShareTitle:singletonObject.ShareTitle
                    Description:singletonObject.ShareDescription
                          Image:singletonObject.ShareImage
                            Url:singletonObject.ShareURL
                     publicTime:@"2015-1-22 18:30"
                          ArtID:@"WX1"
                           Type:0];
            IsShare = YES;
            [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
        }
            break;
        case 1:
        {
            NSLog(@"微信朋友圈--图文");
            
            NSInteger len = UIImageJPEGRepresentation(singletonObject.ShareImage, 1.0).length / 1024;
            
            while (len > 10) {
                singletonObject.ShareImage = [self compressForUpload:singletonObject.ShareImage scale:0.7];
                len = UIImageJPEGRepresentation(singletonObject.ShareImage, 1.0).length / 1024;
                NSLog(@"current image size is: %ld", (long)len);
            }
            
            [YTsdk connectWxWithAppKey:WXAppKey WithDescription:@"YoutuiPlugin"];
            
            //图文分享
            [YTsdk WxShareTitle:singletonObject.ShareTitle
                    Description:singletonObject.ShareDescription
                          Image:singletonObject.ShareImage
                            Url:singletonObject.ShareURL
                     publicTime:@"2015-1-22 18:30"
                          ArtID:@"WX1"
                           Type:1];
            IsShare = YES;
            [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
        }
            break;
        case 2:
        {
            NSLog(@"微信收藏");
            
            NSInteger len = UIImageJPEGRepresentation(singletonObject.ShareImage, 1.0).length / 1024;
            
            while (len > 10) {
                singletonObject.ShareImage = [self compressForUpload:singletonObject.ShareImage scale:0.7];
                len = UIImageJPEGRepresentation(singletonObject.ShareImage, 1.0).length / 1024;
                NSLog(@"current image size is: %ld", (long)len);
            }
            
            [YTsdk connectWxWithAppKey:WXAppKey WithDescription:@"YoutuiPlugin"];
            
            //图文分享
            [YTsdk WxShareTitle:singletonObject.ShareTitle
                    Description:singletonObject.ShareDescription
                          Image:singletonObject.ShareImage
                            Url:singletonObject.ShareURL
                     publicTime:@"2015-1-22 18:30"
                          ArtID:@"WX1"
                           Type:2];
            IsShare = YES;
            [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
        }
            break;
//        case 3:
//        {
//            //新浪微博
//            NSLog(@"新浪微博");
//            [YouTuiSDK connectSinaWithAppKey:SinaWBAppKey];
//            
//            [YouTuiSDK SinaWbShareMessage:singletonObject.ShareDescription
//                                    Image:singletonObject.ShareImage
//                                      Url:singletonObject.ShareURL
//                              RedirectURI:SinaWBURI
//                              AccessToken:[defaults stringForKey:TOKEN]
//                               publicTime:@"2015-1-22 18:30"
//                                 ArtTitle:singletonObject.ShareTitle
//                                    ArtID:@"SINA3"];
//            IsShare = YES;
//            [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
//        }
//            break;
        case 3:
        {
            //QQ
            NSLog(@"QQ");
            [YTsdk connectQQWithAppId:QQAppID Delegate:self Uri:QQURI];

            //图文分享
            [YTsdk QQShareNewsTitle:singletonObject.ShareTitle
                        Description:singletonObject.ShareDescription
                              Image:singletonObject.ShareImage
                                Url:singletonObject.ShareURL
                         publicTime:@"2015-1-22 18:30"
                              ArtID:@"QQ1"
                               Type:0];
            IsShare = YES;
            [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
        }
            break;
        case 4:
        {
            NSLog(@"QQ空间");
            [YTsdk connectQQWithAppId:QQAppID Delegate:self Uri:QQURI];
            
            //图文分享
            [YTsdk QQShareNewsTitle:singletonObject.ShareTitle
                        Description:singletonObject.ShareDescription
                              Image:singletonObject.ShareImage
                                Url:singletonObject.ShareURL
                         publicTime:@"2015-1-22 18:30"
                              ArtID:@"QQ1"
                               Type:1];
            IsShare = YES;
            [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
        }
            break;
//        case 4:
//        {
//            //腾讯微博
//            NSLog(@"腾讯微博");
//            [YTsdk connectTcWbWithAppKey:TCWBAppKey andSecret:TCWBAppSecret andRedirectUri:TCWBURI];
//            
//            [self TcwbShare];
//            
//            //            [YTsdk TcWbShareMessage:singletonObject.ShareTitle
//            //                               Link:singletonObject.ShareURL
//            //                        andImageUrl:singletonObject.ShareImageURL
//            //                           VideoUrl:singletonObject.ShareVideoURL
//            //                          Longitude:@"113.391541"
//            //                           Latitude:@"23.124452"
//            //                           MusicUrl:@"http://stream20.qqmusic.qq.com/325090.mp3"
//            //                         MusicTitle:@"Back at one"
//            //                        MusicAuthor:@"Brian McKnight"
//            //                         publicTime:@"2015-1-22 18:30"
//            //                              ArtID:@"TCWB1"
//            //                           delegate:self];
//        }
//            break;
//        case 5:
//        {
//            //人人网
//            NSLog(@"人人网");
//            [YTsdk connectRennWithAppId:RennAPPID ApiKey:RennAPIKEY SecretKey:RennSecretKey];
//            
//            //图文分享
//            [YTsdk RennShareTitle:singletonObject.ShareTitle
//                              Url:singletonObject.ShareURL
//                      Description:singletonObject.ShareDescription
//                        ThumbData:[UIImage imageNamed:@"logo"]
//                       publicTime:@"2015-1-22 18:30"
//                            ArtID:@"RENN3"
//                    MessageTarget:To_Renren];
//            IsShare = YES;
//            [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
//        }
//            break;
//        case 6:
//        {
//            //短信
//            [YTsdk ShareToMsg:singletonObject.ShareDescription
//              ReceivePhoneNum:@""
//                        Image:singletonObject.ShareImage
//               TypeIdentifier:@"image/png"
//                     FileName:@"0525.png"
//               ViewController:self.viewController];
//            IsShare = YES;
//        }
//            break;
//        case 7:
//        {
//            //邮件
//            [YTsdk ShareToMail:singletonObject.ShareTitle
//                   MessageBody:singletonObject.ShareDescription
//                         Image:singletonObject.ShareImage
//                 ImageFileName:@"0525.png"
//                         SetCc:@""
//                         SetTo:@""
//                ViewController:self.viewController];
//        }
//            break;
        case 5:
        {
            //复制链接
            [YouTuiSDK CopyLinkWithLink:singletonObject.ShareURL];
            ShowAlertView(@"复制链接成功");
        }
            break;
        case 9:
        {
            //截屏涂鸦
            [self performSelector:@selector(ScreenShotAction) withObject:nil afterDelay:0.55f];
        }
            break;
        default:
            break;
    }
}


//截屏分享
-(void)ScreenShotAction
{
    ScreenShot * ScreenShotView = [[ScreenShot alloc]init];
    ScreenShotView.image = [ScreenShot ScreenShotView:self.webView];
    ScreenShotView.delegate = self;
    ScreenShotView.title = @"截屏分享";
    [ScreenShotView SetLeftItemName:@"Back" WithRightItemName:@"Share"];
    
    FreeGeekNavigationController * nav = [[FreeGeekNavigationController alloc]initWithRootViewController:ScreenShotView];
    [nav setNavigationColor:ThemColors];
    [nav SetTitleColor:[UIColor whiteColor]];
    [self.viewController presentViewController:nav animated:YES completion:nil];
}

-(void)drawerSaveImage:(UIImage *)drawerImage
{
    NSLog(@"涂鸦获取的图片:%@",drawerImage);
    [YTsdk connectWxWithAppKey:WXAppKey WithDescription:WXAppSecret];
    [YTsdk WxShareTitle:singletonObject.ShareTitle
            Description:singletonObject.ShareDescription
                  Image:drawerImage
                    Url:singletonObject.ShareURL
             publicTime:@"2015-1-28 17:10"
                  ArtID:@"weixin"
                   Type:1];
    IsShare = YES;
    [[NSNotificationCenter defaultCenter]  addObserver:self selector:@selector(HandleOpenURL:) name:CDVPluginHandleOpenURLNotification object:nil];
}

//腾讯微博分享
-(void)TcwbShare
{
    /**
     *  判断授权是否有效,包括是否已授权,授权是否已过期
     *
     *  @param delegate 回调delegate
     */
    [YTsdk checkAuthValidDelegate:self];
}

/**
 *  选择使用服务器验证token有效性时,需实现此回调
 *
 *  @param bResult       检查结果,YES为有效,NO为无效
 *  @param strSuggestion 当bResult 为NO时,此参数为建议
 */
-(void)didCheckAuthValid:(BOOL)bResult suggest:(NSString *)strSuggestion
{
    NSLog(@"bResult = %d",bResult);
    bResult = NO;
    if(bResult) //授权有效
    {
        NSLog(@"腾讯微博授权有效");
        
        [self ShareButtonAction];
        
    }
    else
    {
        NSLog(@"腾讯微博授权无效");
        [YTsdk TcWbLoginWithDelegate:self andRootController:self.viewController];
    }
}

-(void)ShareButtonAction
{
    NSLog(@"call sharebuttonaction");
    [YTsdk TcWbShareMessage:singletonObject.ShareTitle
                       Link:singletonObject.ShareURL
                andImageUrl:singletonObject.ShareImageURL
                   VideoUrl:singletonObject.ShareVideoURL
                  Longitude:@"113.391541"
                   Latitude:@"23.124452"
                   MusicUrl:@"http://stream20.qqmusic.qq.com/325090.mp3"
                 MusicTitle:@"Back at one"
                MusicAuthor:@"Brian McKnight"
                 publicTime:@"2015-1-22 18:30"
                      ArtID:@"TCWB1"
                   delegate:self];
    IsShare = YES;
}

-(void)HandleOpenURL:(NSNotification*)notification
{
    NSURL* url = [notification object];
    NSLog(@"url = %@",url);
    
    NSString * UrlStr = [url absoluteString];
    NSLog(@"UrlStr = %@",UrlStr);
    
    if ([UrlStr hasPrefix:@"wx"])
    {
        NSLog(@"微信客户端回调");
        [YouTuiSDK WxhandleOpenURL:url delegate:self];
    }
    else if ([UrlStr hasPrefix:@"wb"])
    {
        //测试--UrlStr结尾包含sina
        if ([UrlStr hasSuffix:@"sina"])
        {
            NSLog(@"新浪微博客户端回调");
            [YouTuiSDK SinaWbhandleOpenURL:url delegate:self];
        }
        else
        {
            NSLog(@"腾讯微博回调");
            [YTsdk TcWbhandleOpenURL:url];
        }
    }
    else if ([UrlStr hasPrefix:@"tencent"])
    {
        NSLog(@"QQ回调");
        [YouTuiSDK QQhandleOpenURL:url delegate:self];
    }
    else if ([UrlStr hasPrefix:@"rm"])
    {
        NSLog(@"人人网回调");
        [YouTuiSDK RennHandleOpenURL:url];
    }
}


//微信客户端回调
-(void)onResp:(BaseResp *)resp
{
    NSString * message;
    NSMutableDictionary* resultProps = [NSMutableDictionary dictionaryWithCapacity:4];
    
    /**
     *  微信分享回调
     */
    if ([resp isKindOfClass:[SendMessageToWXResp class]])
    {
        //        errorCode   错误码
        //         0 = 成功
        //        -1 = 普通错误类型
        //        -2 = 用户点击取消返回
        //        -3 = 发送失败
        //        -4 = 授权失败
        //        -5 = 微信不支持
        SendMessageToWXResp * sendWXResp = (SendMessageToWXResp *)resp;
        
        NSLog(@"微信分享完毕返回数据");
        NSLog(@"错误码:%d",sendWXResp.errCode);
        NSLog(@"错误提示字符串:%@",sendWXResp.errStr);
        NSLog(@"相应类型:%d",sendWXResp.type);
        message = [NSString stringWithFormat:@"微信分享完毕返回数据\n错误码:%d\n错误提示字符串:%@\n相应类型:%d",sendWXResp.errCode,sendWXResp.errStr,sendWXResp.type];
        
        if (sendWXResp.errCode == 0)
        {
            /**
             *  分享成功以后,获取友推后台的对应积分
             */
            //[YouTuiSDK ObtainSharePoint];
            [resultProps setObject:@"0" forKey:@"code"];
            [resultProps setObject:@"微信分享成功" forKey:@"message"];
            NSDictionary* resultReturn = [NSDictionary dictionaryWithDictionary:resultProps];
            [self successWithMessage:resultReturn];
        }else{
            if(sendWXResp.errCode == -1)
            {
                [resultProps setObject:@"-1" forKey:@"code"];
                [resultProps setObject:@"普通错误类型" forKey:@"message"];
            }else if(sendWXResp.errCode == -2)
            {
                [resultProps setObject:@"-2" forKey:@"code"];
                [resultProps setObject:@"用户点击取消返回" forKey:@"message"];
            }else if (sendWXResp.errCode == -3)
            {
                [resultProps setObject:@"-3" forKey:@"code"];
                [resultProps setObject:@"发送失败" forKey:@"message"];
            }else if (sendWXResp.errCode == -4)
            {
                [resultProps setObject:@"-4" forKey:@"code"];
                [resultProps setObject:@"授权失败" forKey:@"message"];
            }else if (sendWXResp.errCode == -5)
            {
                [resultProps setObject:@"-5" forKey:@"code"];
                [resultProps setObject:@"微信不支持" forKey:@"message"];
            }
            
            NSDictionary* resultReturn = [NSDictionary dictionaryWithDictionary:resultProps];
            [self errorWithMessage:resultReturn];
        }
    }
    /**
     *  微信授权成功的回调
     */
    else if ([resp isKindOfClass:[SendAuthResp class]])
    {
        SendAuthResp * sendAuth = (SendAuthResp *)resp;
        {
            NSLog(@"返回码:%@",sendAuth.code);
            NSLog(@"状态:%@",sendAuth.state);
            NSLog(@"错误提示字符串:%@",sendAuth.errStr);
            //获取授权凭证
            NSDictionary * AuthDict = [YouTuiSDK WxAuthGetAccessTokenWithAppId:WXAppKey Secret:WXAppSecret Code:sendAuth.code];
            //获取用户信息
            NSDictionary * UserInfo = [YouTuiSDK WxAuthGetUserInfoWithAccessToken:[AuthDict objectForKey:@"access_token"] Openid:[AuthDict objectForKey:@"openid"]];
            message = [NSString stringWithFormat:@"%@",UserInfo];
            //头像url,name,token 存进沙盒
            NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
            [defaults setObject:[UserInfo objectForKey:@"headimgurl"] forKey:HEADER];
            [defaults setObject:[UserInfo objectForKey:@"nickname"] forKey:NAME];
            [defaults setObject:[AuthDict objectForKey:@"access_token"] forKey:TOKEN];
            //发送通知给CustomViewController更新UI
            [[NSNotificationCenter defaultCenter] postNotificationName:REFRESHUI object:nil];
        }
    }
    
    /**
     *  QQ回调
     */
    else if ([resp isKindOfClass:[SendMessageToQQResp class]])
    {
        SendMessageToQQResp * sendQQResp = (SendMessageToQQResp *)resp;
        
        NSLog(@"QQ分享完毕返回数据");
        NSLog(@"请求处理结果是:%@",sendQQResp.result); //-- result = 0 分享成功, 其余分享失败
        NSLog(@"具体错误描述信息:%@",sendQQResp.errorDescription);
        NSLog(@"相应类型:%d",sendQQResp.type);
        NSLog(@"扩展信息:%@",sendQQResp.extendInfo);
        
        message = [NSString stringWithFormat:@"QQ分享完毕返回数据\n请求处理结果是:%@\n具体错误描述信息:%@\n相应类型:%d\n扩展信息:%@",sendQQResp.result,sendQQResp.errorDescription,sendQQResp.type,sendQQResp.extendInfo];
        
        
        
        if ([sendQQResp.result isEqualToString:@"0"])
        {
            /**
             *  分享成功以后,获取友推后台的对应积分 isShare 是否为友推分享
             */
            [YouTuiSDK ObtainSharePoint];
            [resultProps setObject:@"0" forKey:@"code"];
            [resultProps setObject:@"QQ分享成功" forKey:@"message"];
            NSDictionary* resultReturn = [NSDictionary dictionaryWithDictionary:resultProps];
            [self successWithMessage:resultReturn];
        }else
        {
            [resultProps setObject:@"-1" forKey:@"code"];
            [resultProps setObject:@"QQ分享失败" forKey:@"message"];
            NSDictionary* resultReturn = [NSDictionary dictionaryWithDictionary:resultProps];
            [self errorWithMessage:resultReturn];
        }
    }
    
    //ShowAlertView([YouTuiSDK replaceUnicode:message]);
}


//QQ微信发送分享信息回调
-(void)onReq:(BaseReq *)req
{
    NSLog(@"req = %@",req);
}


//   QQ登陆成功后的回调
-(void)tencentDiNSLogin
{
    [YTsdk QQGetUserInfo];    //授权成功回调后调用此接口,返回执行代理方法getUserInfoResponse:
}

// 登陆失败后的回调
-(void)tencentDidNotLogin:(BOOL)cancelled
{
    ShowAlertView(@"QQ登陆失败")
}

//退出登陆的回调
-(void)tencentDiNSLogout
{
    ShowAlertView(@"您取消了QQ授权")
}

//获取当前授权用户信息的回调
-(void)getUserInfoResponse:(APIResponse *)response
{
    NSDictionary * UserDict = [[NSDictionary alloc]init];
    if (response.retCode == URLREQUEST_SUCCEED)
    {
        NSMutableString * str = [NSMutableString stringWithFormat:@""];
        for (id key in response.jsonResponse)     //-----返回用户信息的json数据
        {
            [str appendString:[NSString stringWithFormat:@"%@:%@\n",key,[response.jsonResponse objectForKey:key]]];
            UserDict = response.jsonResponse;
        }
        //头像url,name,token 存进沙盒
        NSUserDefaults * defaluts = [NSUserDefaults standardUserDefaults];
        [defaluts setObject:[UserDict objectForKey:@"figureurl_qq_2"] forKey:HEADER];
        [defaluts setObject:[UserDict objectForKey:@"nickname"] forKey:NAME];
        [defaluts setObject:[YTsdk QQAuthorizeWithAccessToken] forKey:TOKEN];
        [[NSNotificationCenter defaultCenter] postNotificationName:REFRESHUI object:nil];
        ShowAlertView(str)
        NSLog(@"QQ授权用户信息:%@",str);
    }
    else
    {
        ShowAlertView(response.errorMsg)
    }
}


//登陆时网络有问题的回调
-(void)tencentDidNotNetWork
{
    ShowAlertView(@"请检查网络链接")
}



//新浪微博客户端回调
/**
 *  收到新浪微博客户端的相应
 *
 *  @param response 具体的相应对象
 */
#pragma mark 新浪微博授权回调
-(void)didReceiveWeiboResponse:(WBBaseResponse *)response
{
    NSMutableDictionary* resultProps = [NSMutableDictionary dictionaryWithCapacity:4];
    if ([response isKindOfClass:WBSendMessageToWeiboResponse.class])
    {
        //        response.statusCode    响应状态码
        //         0 :  成功
        //        -1 :  用户取消发送
        //        -2 :  发送失败
        //        -3 :  授权失败
        //        -4 :  用户取消安装微博客户端
        //        -99:  不支持的请求
        //    response.userInfo         用户信息
        //    response.requestUserInfo  用户详细信息
        
        NSString *message = [NSString stringWithFormat:@"响应状态: %d\n响应UserInfo数据: %@\n原请求UserInfo数据: %@",(int)response.statusCode, response.userInfo, response.requestUserInfo];
        NSLog(@"%@",message);
        ShowAlertView(message)
        /**
         *  分享成功以后,获取友推后台的对应积分 isShare 是否为友推分享
         */
        [YouTuiSDK ObtainSharePoint];
        if(response.statusCode == 0)
        {
            [resultProps setObject:@"0" forKey:@"code"];
            [resultProps setObject:@"成功" forKey:@"message"];
            NSDictionary* resultReturn = [NSDictionary dictionaryWithDictionary:resultProps];
            [self successWithMessage:resultReturn];
        }else
        {
            if(response.statusCode == -1)
            {
                [resultProps setObject:@"-1" forKey:@"code"];
                [resultProps setObject:@"用户取消发送" forKey:@"message"];
            }else if (response.statusCode == -2)
            {
                [resultProps setObject:@"-2" forKey:@"code"];
                [resultProps setObject:@"发送失败" forKey:@"message"];
            }else if (response.statusCode == -3)
            {
                [resultProps setObject:@"-3" forKey:@"code"];
                [resultProps setObject:@"授权失败" forKey:@"message"];
            }else if (response.statusCode == -4)
            {
                [resultProps setObject:@"-4" forKey:@"code"];
                [resultProps setObject:@"用户取消安装微博客户端" forKey:@"message"];
            }else if (response.statusCode == -99)
            {
                [resultProps setObject:@"-99" forKey:@"code"];
                [resultProps setObject:@"不支持的请求" forKey:@"message"];
            }
            NSDictionary* resultReturn = [NSDictionary dictionaryWithDictionary:resultProps];
            [self errorWithMessage:resultReturn];
        }
    }
    else if([response isKindOfClass:WBAuthorizeResponse.class])
    {
        //        response.statusCode    响应状态码
        //         0 :  成功
        //        -1 :  用户取消发送
        //        -2 :  发送失败
        //        -3 :  授权失败
        //        -4 :  用户取消安装微博客户端
        //        -99:  不支持的请求
        
        //        [(WBAuthorizeResponse *)response userInfo]        用户信息
        //        [(WBAuthorizeResponse *)response userID]          用户ID
        //        [(WBAuthorizeResponse *)response accessToken]     认证口令
        //        response.requestUserInfo                          用户详细信息
        NSString * UserToken = [(WBAuthorizeResponse *)response accessToken];   //授权获得的认证口令,登出的时候需要调用它
        NSDictionary * UserDict = [YouTuiSDK SinaGetUserInfoWithAppkey:UserToken
                                                                   Uid:[(WBAuthorizeResponse *)response userID]];
        //头像url,name,token 存进沙盒
        NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
        [defaults setObject:[UserDict objectForKey:@"avatar_hd"] forKey:HEADER];
        [defaults setObject:[UserDict objectForKey:@"name"] forKey:NAME];
        [defaults setObject:UserToken forKey:TOKEN];
        [defaults synchronize];
        [[NSNotificationCenter defaultCenter] postNotificationName:REFRESHUI object:nil];
        NSString * message = [NSString stringWithFormat:@"%@",UserDict];
        NSLog(@"%@",message);
        ShowAlertView(message)
    }
}
/**
 *  收到新浪微博客户端程序的请求
 *
 *  @param request 具体的请求对象
 */

-(void)didReceiveWeiboRequest:(WBBaseRequest *)request
{
    NSLog(@"request = %@",request);
}

//腾讯微博回调

/**
 *  腾讯微博授权成功的回调
 *
 *  @param wbobj 返回的对象
 */
-(void)DidAuthFinished:(WeiboApiObject *)wbobj
{
    [YTsdk TcWbRequestUserInfoDelegate:self];   //登陆成功获取当前授权用户的信息
    Token = wbobj.accessToken;
}
/**
 *  腾讯微博取消授权的回调
 *
 *  @param wbobj 返回的对象
 */
-(void)DidAuthCanceled:(WeiboApiObject *)wbobj
{
    ShowAlertView(@"您取消了腾讯微博的授权")
}
/**
 *  腾讯微博授权失败的回调
 *
 *  @param error 返回的对象
 */
-(void)DidAuthFailWithError:(NSError *)error
{
    ShowAlertView(@"授权失败")
}

//腾讯微博调用接口成功的回调--------(分享,获取当前授权用户信息)
/**
 *  腾讯微博分享成功后的回调
 *
 *  @param data  接口返回的数据
 */
-(void)didReceiveRawData:(NSData *)data reqNo:(int)reqno
{
    NSDictionary * dict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
    NSString * message = [NSString stringWithFormat:@"%@",dict];
    if (IsShare)
    {
        /**
         *  分享成功以后,获取友推后台的对应积分 isShare 是否为友推分享
         */
        [YouTuiSDK ObtainSharePoint];
        NSLog(@"分享回调");
        IsShare = NO;
    }
    else
    {
        NSLog(@"授权回调");
        //头像url,name,token 存进沙盒
        NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
        [defaults setObject:[NSString stringWithFormat:@"%@/100",[[dict objectForKey:@"data"] objectForKey:@"head"]] forKey:HEADER];
        [defaults setObject:[[dict objectForKey:@"data"] objectForKey:@"nick"] forKey:NAME];
        [defaults setObject:Token forKey:TOKEN];
        [[NSNotificationCenter defaultCenter] postNotificationName:REFRESHUI object:nil];
        [self ShareButtonAction];
    }
    
}
/**
 *  腾讯微博分享失败后的回调
 *
 *  @param error 接口返回的错误信息
 */
-(void)didFailWithError:(NSError *)error reqNo:(int)reqno
{
    NSString * message = [NSString stringWithFormat:@"%@",error.userInfo];
    ShowAlertView(message)
}

/**
 *  腾讯微博分享失败,且失败原因为授权无效
 *
 *  @param error 接口返回的错误信息
 */
-(void)didNeedRelogin:(NSError *)error reqNo:(int)reqno
{
    ShowAlertView(@"分享错误,请先授权")
}


//人人网回调
/**
 *  人人网授权成功的回调
 */
-(void)rennLoginSuccess
{
    [YTsdk RennGetUserInfoDelegate:self];    //获取当前授权用户信息
    IsAuth = YES;
}
/**
 *  人人网授权失败的回调
 *
 *  @param error 错误信息
 */
-(void)rennLoginDidFailWithError:(NSError *)error
{
    NSString * ErrorMessage = [NSString stringWithFormat:@"%@",error];
    ShowAlertView([YouTuiSDK replaceUnicode:ErrorMessage])
}
/**
 *  人人网取消登陆的回调
 */
-(void)rennLoginCancelded
{
    ShowAlertView(@"您取消了人人网的授权")
}
/**
 *  人人网登出成功的回调
 */
-(void)rennLogoutSuccess
{
    ShowAlertView(@"登出成功");
}
/**
 *  人人网获取当前授权用户信息成功的回调
 */
-(void)rennService:(RennService *)service requestSuccessWithResponse:(id)response
{
    DLog(@"用户信息:%@",response);
    NSString * UserInfo = [NSString stringWithFormat:@"%@",response];
    
    if (IsAuth)
    {
        ////头像url,name,token 存进沙盒
        NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
        [defaults setObject:[[[response objectForKey:@"avatar"] objectAtIndex:1] objectForKey:@"url"] forKey:HEADER];
        [defaults setObject:[response objectForKey:@"name"] forKey:NAME];
        [defaults setObject:[response objectForKey:@"id"] forKey:TOKEN];
        [[NSNotificationCenter defaultCenter] postNotificationName:REFRESHUI object:nil];
        IsAuth = NO;
    }
    else
    {
        /**
         *  分享成功以后,获取友推后台的对应积分 isShare 是否为友推分享
         */
        [YouTuiSDK ObtainSharePoint];
        
        
    }
    ShowAlertView([YouTuiSDK replaceUnicode:UserInfo])
}
/**
 *  人人网获取当前授权用户信息失败的回调
 */
-(void)rennService:(RennService *)service requestFailWithError:(NSError *)error
{
    NSString * message = [NSString stringWithFormat:@"Error Domain = %@\nError Code = %@",[error domain],[[error userInfo] objectForKey:@"code"]];
    ShowAlertView([YouTuiSDK replaceUnicode:message])
}



//插件回调
-(void)successWithMessage:(NSDictionary *)message
{
    if (self.callbackId != nil)
    {
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
        [self.commandDelegate sendPluginResult:commandResult callbackId:self.callbackId];
    }
}

-(void)errorWithMessage:(NSDictionary *)message
{
    if (self.callbackId != nil)
    {
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:message];
        [self.commandDelegate sendPluginResult:commandResult callbackId:self.callbackId];
    }
}

- (UIImage *)compressForUpload:(UIImage *)original scale:(CGFloat)scale
{
    // Calculate new size given scale factor.
    CGSize originalSize = original.size;
    CGSize newSize = CGSizeMake(originalSize.width * scale, originalSize.height * scale);
    
    // Scale the original image to match the new size.
    UIGraphicsBeginImageContext(newSize);
    [original drawInRect:CGRectMake(0, 0, newSize.width, newSize.height)];
    UIImage* compressedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return compressedImage;
}

@end
