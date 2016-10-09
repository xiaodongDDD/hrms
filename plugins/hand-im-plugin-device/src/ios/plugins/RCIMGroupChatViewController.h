//
//  RCIMGroupChatViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/17.
//
//

#import <UIKit/UIKit.h>
typedef NS_ENUM(NSInteger, RCKeyboardShowType) {
    RCKeyboardShowDefaultType=0,
    RCKeyboardShowEmotionType,
    RCKeyboardShowImageCollectionType,
    RCKeyboardShowRecorderType,
    RCKeyboardShowMoreType
};

@interface RCIMGroupChatViewController : UIViewController
/*!
 * discussionId 讨论组id
 */
@property (nonatomic,strong)NSString *discussionId;
/*!
 * navTitle 讨论组名称
 */
@property (nonatomic,strong)NSString *navTitle;
/*!
 * membersId 讨论组成员id
 */
@property (nonatomic,strong)NSArray *membersList;
/*!
 * discussionImage 讨论组头像
 */
@property (nonatomic,strong)NSString *discussionImageName;

@end
