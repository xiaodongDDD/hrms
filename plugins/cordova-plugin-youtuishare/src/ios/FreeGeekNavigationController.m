//
//  FreeGeekNavigationController.m
//  youtuiShare-ios
//
//  Created by FreeGeek on 14-12-30.
//  Copyright (c) 2014年 FreeGeek. All rights reserved.
//

#import "FreeGeekNavigationController.h"

@interface FreeGeekNavigationController ()

@end

@implementation FreeGeekNavigationController

- (void)viewDidLoad
{
    [super viewDidLoad];
}

-(void)SetTitleColor:(UIColor *)color
{
    [[UINavigationBar appearance] setTitleTextAttributes: [NSDictionary dictionaryWithObjectsAndKeys:color, NSForegroundColorAttributeName, nil]];
}

-(void)setNavigationColor:(UIColor *)color{
    if([self.navigationBar respondsToSelector:@selector(setBarTintColor:)]){
        self.navigationBar.barTintColor=color;
        self.navigationBar.tintColor=[UIColor whiteColor];
    }else{
        self.navigationBar.tintColor=color;
    }
    
}

-(BOOL)shouldAutorotate{
    return NO;
}
-(NSUInteger)supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskPortrait;
}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
