//
//  DetailController.m
//  CordBradge-OC
//
//  Created by Mr.xiao on 17/2/14.
//  Copyright © 2017年 keepJion. All rights reserved.
//

#import "WebPluginController.h"

@interface WebPluginController ()<UIGestureRecognizerDelegate>

@property (nonatomic,strong) UILabel *titleLalel;

@end

@implementation WebPluginController



- (void)viewDidLoad {
    
//    self.startPage = @"http://www.baidu.com";
    self.startPage = self.fileUrl;
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    // Do any additional setup after loading the view.
    self.webView.frame = CGRectMake(0, 0, CGRectGetWidth(self.view.frame), CGRectGetHeight(self.view.frame) );
    self.webView.backgroundColor = [UIColor orangeColor];
    
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
