//
//  EmotionViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/26.
//
//

#import <UIKit/UIKit.h>

@protocol EmotionViewControllerDelegate <NSObject>
@optional
- (void)emotionViewDidSelect:(UICollectionView *)collectionView Text:(NSString *)exchangeText;
- (void)emotionViewDidDelete:(UICollectionView *)collerctionView;
- (void)emotionViewDidTapSend:(UIButton *)sender;
@end
@interface EmotionViewController : UIViewController
@property (nonatomic,weak)id<EmotionViewControllerDelegate>delegate;
@end
