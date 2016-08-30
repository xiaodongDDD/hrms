//
//  BelongPlaceManager.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/16.
//
//

#import "BelongPlaceManager.h"
#define appKey @"577768c6f0a5f59ff3f8fd90de9ccda6"
static BelongPlaceManager *belongPlaceManager;
 NSString *formatStr = nil;
@implementation BelongPlaceManager

+ (instancetype)sharedInsance
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (belongPlaceManager==nil) {
            belongPlaceManager = [[BelongPlaceManager alloc] init];
        }
    });
    return belongPlaceManager;
}

- (void)APIRequest:(NSString *)phoneNumber
{
    NSString *requestStr = [NSString stringWithFormat:@"http://apis.juhe.cn/mobile/get?phone=%@&key=%@",phoneNumber,appKey];
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:requestStr]];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSDictionary *result = jsonDic[@"result"];
            if (result!=nil&&![result isEqual:[NSNull null]]) {
                NSLog(@"result:%@,%@,%@,%@,%@,%@",result[@"areacode"],result[@"card"],result[@"city"],result[@"company"],result[@"province"],result[@"zip"]);
                formatStr = [NSString stringWithFormat:@"%@%@ %@",result[@"province"],result[@"city"],[result[@"company"] substringWithRange:NSMakeRange(2, 2)]];
                self.successCall(formatStr);
            }
            
        }
    }];
    [dataTask resume];
}

@end
