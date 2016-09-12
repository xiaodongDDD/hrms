//
//  CVDPlugin-Bridging-Header.h
//  IMTest
//
//  Created by wangsheng on 16/7/11.
//
//

#import <RongIMLib/RongIMLib.h>

#ifndef CVDPlugin_Bridging_Header_h

// 测试0vnjpoadnd4cz
// e5t4ouvptpsaa
#define AppKey @"0vnjpoadnd4cz"
#define appSecret @"e5t4ouvptpsaa"
#define CDVIMPluginPushNotification @"CDVIMPluginPushNotification"

#define rootService @"http://wechat.hand-china.com"

#define localService [NSString stringWithFormat:@"%@/hrmsv2/v2/api/staff/detail?",rootService]
#define localServiceQuery [NSString stringWithFormat:@"%@/hrmsv2/v2/api/staff/query?",rootService]
#define localServiceUpload [NSString stringWithFormat:@"%@/hrmsv2/v2/api/objectUpload?",rootService]
#define discussionGroup @"http://zhouzybk.img-cn-shanghai.aliyuncs.com/"
/*!
 *头像左间距
 */
#define timeLineBottomSpace 15
/*!
 *头像左间距
 */
#define iconLeftSpace 10
/*!
 *头像右间距 其他间距
 */
#define iconRightSpace 10
/*!
 *头像大小
 */
#define iconSize_iphone6 CGSizeMake(40,40)
#define iconSize_phone5 CGSizeMake(40,40)
/*!
 *头像右间距 其他间距
 */
#define imageMessageSize CGSizeMake(120,120)
/*!
 *头像右间距 其他间距
 */
#define textLeftRightSpace 21.0
/*!
 *头像右间距 其他间距
 */
#define textTopBottomSpace 17/2.0
/*!
 *文本消息字体大小
 */
#define textMesaageFont 17.0
#define imageMessageBoder 2
/*!
 * emoji，录音，图库，相机按钮常规间距
 */
#define standardSpaceX 20
#define standardSpaceY 10

#define screenWidth [UIScreen mainScreen].bounds.size.width
#define screenHeight [UIScreen mainScreen].bounds.size.height

#define RCIMLibReceivedMessageNotification @"RCIMLibReceivedMessageNotification"

#define RCIMChattingViewControllerNotification @"RCIMChattingViewControllerNotification"

#endif /* CVDPlugin_Bridging_Header_h */

