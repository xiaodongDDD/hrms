//
//  ViewControllerDelegate.h
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/24.
//
//

#import <Foundation/Foundation.h>


@protocol ViewControllerDelegate <NSObject>

- (void) nativeViewDismissSuccess:(NSString*)result;
- (void) nativeViewDismissFaild:(NSString*)result;


@end

