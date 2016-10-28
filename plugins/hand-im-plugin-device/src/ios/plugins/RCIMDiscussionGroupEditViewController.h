//
//  RCIMDiscussionGroupEditViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/24.
//
//

#import <UIKit/UIKit.h>

@interface RCIMDiscussionGroupEditViewController : UIViewController
/*
 * memberList存的是工号
 */
@property (nonatomic,strong)NSArray *memberList;
@property (nonatomic,copy)NSString *discussionId;
@end
