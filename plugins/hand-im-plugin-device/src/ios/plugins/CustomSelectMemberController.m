//
//  CustomSelectMemberController.m
//  正式内测版
//
//  Created by xiaowei on 16/10/13.
//
//

#import "CustomSelectMemberController.h"
#import "CustomRCCall.h"

#import <objc/runtime.h>

typedef void (^CompleteBlock)(NSArray *addUserIdList);

@interface CustomSelectMemberController ()

@property(nonatomic, strong) NSMutableArray *selectUserIds;
@property(nonatomic, strong) CompleteBlock successBlock;
@property(nonatomic, strong) UITableView *tableView;
@property(nonatomic, strong) UIBarButtonItem *rightBarButtonItem;
@end

@implementation CustomSelectMemberController

- (UIStatusBarStyle)preferredStatusBarStyle{
    
    return UIStatusBarStyleLightContent;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.view.backgroundColor = [UIColor whiteColor];
    UINavigationBar *navigationBar = [[UINavigationBar alloc]
                                      initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, 64)];
    navigationBar.backgroundColor = [UIColor clearColor];
    [navigationBar setTintColor:[UIColor whiteColor]];
    [navigationBar setBarTintColor:[UIColor colorWithPatternImage:[UIImage imageNamed:@"NavBar"]]];
    [navigationBar setTitleTextAttributes:@{NSForegroundColorAttributeName:[UIColor whiteColor]}];
    [self.view addSubview:navigationBar];
    
    UINavigationItem *navigationBarTitle = [[UINavigationItem alloc]
                                            initWithTitle:NSLocalizedStringFromTable(@"VoIPCallSelectMember",
                                                                                     @"RongCloudKit", nil)];
    [navigationBar pushNavigationItem:navigationBarTitle animated:YES];
    
    
    
    UIBarButtonItem *leftBarButtonItem = [[UIBarButtonItem alloc]
                                          initWithTitle:NSLocalizedStringFromTable(@"Cancel", @"RongCloudKit", nil)
                                          style:UIBarButtonItemStylePlain
                                          target:self
                                          action:@selector(cancel:)];
    navigationBarTitle.leftBarButtonItem = leftBarButtonItem;
    
    self.rightBarButtonItem = [[UIBarButtonItem alloc]
                               initWithTitle:NSLocalizedStringFromTable(@"OK", @"RongCloudKit", nil)
                               style:UIBarButtonItemStylePlain
                               target:self
                               action:@selector(done:)];
    navigationBarTitle.rightBarButtonItem = self.rightBarButtonItem;
    [navigationBar setItems:[NSArray arrayWithObject:navigationBarTitle]];
    
    [self updateRightButton];
}


- (void)cancel:(id)sender {
    [[CustomRCCall sharedRCCall] dismissCallViewController:self];
}

- (void)done:(id)sender {
    
    NSLog(@"list = %li,exitList = %li",self.listingUserIdList.count,self.existUserIdList.count);
    unsigned int count;
    
    Ivar *ivarList = class_copyIvarList([super class], &count);
    for (unsigned int i=0; i<count; i++) {
        Ivar ivar = ivarList[i];
        const char *ivarName = ivar_getName(ivar);
        NSLog(@"ivar = %@",[NSString stringWithUTF8String:ivarName]);
    }
    self.selectUserIds = (NSMutableArray *)[super valueForKey:@"selectUserIds"];
    self.successBlock = (CompleteBlock)[super valueForKey:@"successBlock"];
    
    
    if ((self.selectUserIds.count + self.existUserIdList.count >
         [RCCall sharedRCCall].maxMultiAudioCallUserNumber) &&
        self.mediaType == RCCallMediaAudio) {
        [self loadErrorAlert:
         [NSString stringWithFormat:NSLocalizedStringFromTable(
                                                               @"VoIPAudioCallMaxNumSelectMember",
                                                               @"RongCloudKit", nil),
          [RCCall sharedRCCall]
          .maxMultiAudioCallUserNumber]];
    } else if ((self.selectUserIds.count + self.existUserIdList.count >
                [RCCall sharedRCCall].maxMultiVideoCallUserNumber) &&
               self.mediaType == RCCallMediaVideo) {
        [self loadErrorAlert:
         [NSString stringWithFormat:NSLocalizedStringFromTable(
                                                               @"VoIPVideoCallMaxNumSelectMember",
                                                               @"RongCloudKit", nil),
          [RCCall sharedRCCall]
          .maxMultiVideoCallUserNumber]];
    } else {
        [[RCCall sharedRCCall] dismissCallViewController:self];
        if (self.successBlock) {
            self.successBlock(self.selectUserIds);
        }
    }
}


- (void)loadErrorAlert:(NSString *)title {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title
                                                    message:nil
                                                   delegate:nil
                                          cancelButtonTitle:nil
                                          otherButtonTitles:nil];
    [NSTimer scheduledTimerWithTimeInterval:1.0f
                                     target:self
                                   selector:@selector(cancelAlert:)
                                   userInfo:alert
                                    repeats:NO];
    [alert show];
}
- (void)cancelAlert:(NSTimer *)scheduledTimer {
    UIAlertView *alert = (UIAlertView *)(scheduledTimer.userInfo);
    [alert dismissWithClickedButtonIndex:0 animated:NO];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    
}

- (void)updateRightButton {
    [self.rightBarButtonItem setEnabled:self.selectUserIds.count > 0];
}


@end



