//
//  DidiView.h
//  didiPlugin
//
//  Created by yanjun.li on 16/1/7
//
//

#import "AppDelegate.h"
#import "scanCard.h"
#import <MobileCoreServices/MobileCoreServices.h>


@implementation scanCard



- (void)takePicture:(CDVInvokedUrlCommand *)command;
{
    NSLog(@"test begin1231");
    //    UIAlertView *alertview = [[UIAlertView alloc] initWithTitle:@"标题" message:@"打开相机" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
    //    [alertview show];
    //   [self setViewController:[super viewController]];
    
    self._command = command;
    UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
    imagePickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
    imagePickerController.mediaTypes = @[(NSString *)kUTTypeImage];
    imagePickerController.allowsEditing = NO;
    
    imagePickerController.delegate = (id <UINavigationControllerDelegate, UIImagePickerControllerDelegate> )self;
    
    UIViewController *view = [self viewController];
    
    
    [view presentViewController:imagePickerController animated:YES completion:NULL];
    //    [self _command]= command;
    
    //   [self returnMess:self._command andError:nil andSuccess:@"我成功啦" andError:@"我失败了"];
    
}


- (void)choosePicture:(CDVInvokedUrlCommand *)command;
{
    NSLog(@"test begin1231");
    //    UIAlertView *alertview = [[UIAlertView alloc] initWithTitle:@"标题" message:@"打开相册" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
    //    [alertview show];
    self._command = command;
    
    UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
    imagePickerController.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    imagePickerController.mediaTypes = @[(NSString *)kUTTypeImage];
    imagePickerController.allowsEditing = NO;
    imagePickerController.delegate = (id <UINavigationControllerDelegate, UIImagePickerControllerDelegate> )self;
    UIViewController *view = [self viewController];
    
    
    //    NSLog(@"the begin command is  %@",command);
    [view presentViewController:imagePickerController animated:YES completion:NULL];
    //    [self returnMess:self._command andError:nil andSuccess:@"我成功啦" andError:@"我失败了"];
    
    
    
    
}


- (void)returnMess:(CDVInvokedUrlCommand *)command
          andError:(NSString *)error
        andSuccess:(NSDictionary *)successMsg
          andError:(NSString *)errorMsg {
    //   测试回调
    
    //    ISContactItem
    CDVPluginResult *pluginResult = nil;
    //    NSError*  error = nil;
    
    
    if (error == nil) {
        
        NSLog(@"the 心思 是%@", successMsg);
        
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsDictionary  :successMsg];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsString:errorMsg];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult
                                callbackId:command.callbackId];
    
}

//调用网络接口，并返回识别结果

- (NSDictionary *)postRequestWithURL:(NSString *)url  // IN
                          postParems:(NSMutableDictionary *)postParems // IN
                             picFile:(UIImage *)uiImage // IN;  // IN
{
    
    
    NSString *TWITTERFON_FORM_BOUNDARY = @"AaB03x";
    //根据url初始化request
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                       timeoutInterval:10];
    //分界线 --AaB03x
    NSString *MPboundary = [[NSString alloc] initWithFormat:@"--%@", TWITTERFON_FORM_BOUNDARY];
    //结束符 AaB03x--
    NSString *endMPboundary = [[NSString alloc] initWithFormat:@"%@--", MPboundary];
    //得到图片的data
    NSData *imaData;
    //    data = UIImagePNGRepresentation(uiImage);
    imaData = UIImageJPEGRepresentation(uiImage, 0.1);
    NSLog(@"the image is %@", uiImage);
    //http body的字符串
    NSMutableString *body = [[NSMutableString alloc] init];
    //参数的集合的所有key的集合
    
    NSArray *keys = [postParems allKeys];
    
    
    //遍历keys
    for (int i = 0; i < [keys count]; i++) {
        //得到当前key
        NSString *key = [keys objectAtIndex:i];
        
        //添加分界线，换行
        [body appendFormat:@"%@\r\n", MPboundary];
        //添加字段名称，换2行
        [body appendFormat:@"Content-Disposition: form-data; name=\"%@\"\r\n\r\n", key];
        //添加字段的值
        [body appendFormat:@"%@\r\n", [postParems objectForKey:key]];
        
        NSLog(@"添加字段的值==%@", [postParems objectForKey:key]);
    }
    
    
    ////添加分界线，换行
    [body appendFormat:@"%@\r\n", MPboundary];
    
    //声明pic字段，文件名为boris.png
    [body appendFormat:@"Content-Disposition: form-data; name=\"files\"; filename=\"boris.png\"\r\n"];
    
    
    //声明上传文件的格式
    [body appendFormat:@"Content-Type: image/png\r\n\r\n"];
    
    //声明结束符：--AaB03x--
    NSString *end = [[NSString alloc] initWithFormat:@"\r\n%@", endMPboundary];
    
    //声明myRequestData，用来放入http body
    NSMutableData *myRequestData = [NSMutableData data];
    //将body字符串转化为UTF8格式的二进制
    [myRequestData appendData:[body dataUsingEncoding:NSUTF8StringEncoding]];
    //将image的data加入
    [myRequestData appendData:imaData];
    //加入结束符--AaB03x--
    [myRequestData appendData:[end dataUsingEncoding:NSUTF8StringEncoding]];
    //设置HTTPHeader中Content-Type的值
    NSString *content = [[NSString alloc] initWithFormat:@"multipart/form-data; boundary=%@", TWITTERFON_FORM_BOUNDARY];
    //设置HTTPHeader
    [request setValue:content forHTTPHeaderField:@"Content-Type"];
    //设置Content-Length
    [request setValue:[NSString stringWithFormat:@"%lu", (unsigned long)[myRequestData length]] forHTTPHeaderField:@"Content-Length"];
    //设置http body
    [request setHTTPBody:myRequestData];
    //http method
    [request setHTTPMethod:@"POST"];
    
    
    NSHTTPURLResponse *urlResponese = nil;
    NSError *error = [[NSError alloc] init];
    
    NSData *resultData = [NSURLConnection sendSynchronousRequest:request returningResponse:&urlResponese error:&error];
    
    //    NSString* result= [[NSString alloc] initWithData:resultData encoding:NSUTF8StringEncoding];
    //    if([urlResponese statusCode] >=200&&[urlResponese statusCode]<300){
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:resultData options:NSJSONReadingAllowFragments error:nil];
    
    
    //    NSLog(@"返回结果=====%@",result);
    return dic;
    //    }
    
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(NSDictionary *)editingInfo {
    NSLog(@"impgPick");
    [picker dismissViewControllerAnimated:YES completion:^
     {
         [self reconizeCardWithCardImage:image];
     }];
}

- (void)reconizeCardWithCardImage:(UIImage *)image {
    //    webView *p=[[webView alloc] init];
    
    NSLog(@"reconize");
    
    
    
    
    
    
    //第一步，创建URL
    NSString *url = @"http://bcr2.intsig.net/BCRService/BCR_VCF2?user=mobile.hand@vip.hand-china.com&pass=T6LD4LTJG8GK5RT3&lang=15&json=1";
    //    NSMutableDictionary * dir=[[NSMutableDictionary alloc] init];
    //    [dir setValue:@"yanjun.li@hand-china.com" forKey:@"user"];
    //    [dir setValue:@"T6LD4LTJG8GK5RT3" forKey:@"pass"];
    //    [dir setValue:@"28" forKey:@"lang"];
    //    [dir setValue:@"1" forKey:@"json"];
    NSDictionary *resultDict = [self postRequestWithURL:url postParems:nil picFile:image];
    NSLog(@"返回的字典是%@", resultDict);
    
    if (resultDict != nil) {
        //可变字典
        NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
        //        姓名
        for (NSDictionary *item in  [resultDict objectForKey:@"name"]) {
            
            NSDictionary *name = [item objectForKey:@"item"];
            
            [dic setObject:[NSString stringWithFormat:@"%@", [name objectForKey:@"family_name"]]
                    forKey:@"lastName"];
            [dic setObject:[NSString stringWithFormat:@"%@", [name objectForKey:@"given_name"]]
                    forKey:@"firstName"];
            
        }
        
        
        //        电话
        NSMutableArray *phones = [[NSMutableArray alloc] init
                                  ];
        
        for (NSDictionary *item in  [resultDict objectForKey:@"telephone"]) {
            
            NSDictionary *phone = [item objectForKey:@"item"];
            NSString *type = [NSString stringWithFormat:@"%@", [phone objectForKey:@"type"]];
            NSRange pos = [type rangeOfString:@"cellular"];
            if (pos.length > 0) {
                type = @"CELL";
            } else {
                type = @"WORK";
            }
            NSDictionary *dic1 = @{@"itemInfo" : [NSString stringWithFormat:@"%@", [phone objectForKey:@"number"]],
                                   @"itemLabel" : type};
            [phones addObject:dic1];
            
            
        }
        
        [dic setObject:phones forKey:@"phones"];
        
        
        
        //        email
        NSMutableArray *emails = [[NSMutableArray alloc] init
                                  ];
        
        for (NSDictionary *item in  [resultDict objectForKey:@"email"]) {
            
            NSString *email = [NSString stringWithFormat:@"%@", [item objectForKey:@"item"]];
            NSLog(@"email is %@", email);
            NSDictionary *dic1 = @{@"itemInfo" : email,
                                   @"itemLabel" : @"WORK"};
            [emails addObject:dic1];
            
            
        }
        
        [dic setObject:emails forKey:@"emails"];
        
        
        //        company
        NSMutableArray *companys = [[NSMutableArray alloc] init
                                    ];
        
        for (NSDictionary *item in  [resultDict objectForKey:@"organization"]) {
            
            
            NSDictionary *company = [item objectForKey:@"item"];
            NSString *name = [NSString stringWithFormat:@"%@", [company objectForKey:@"name"]];
            NSLog(@"name=%@", name);
            if ([name isEqualToString:@"(null)"]) {
                
            } else {
                
                NSDictionary *dic1 = @{@"company" : name,
                                       @"department" :  [NSString stringWithFormat:@"%@", [company objectForKey:@"unit"]]};
                [companys addObject:dic1];
                
                
            }
            
            
        }
        
        [dic setObject:companys forKey:@"companys"];
        
        
        //        jobtitle
        NSMutableArray *jobtitles = [[NSMutableArray alloc] init
                                     ];
        
        for (NSDictionary *item in  [resultDict objectForKey:@"title"]) {
            
            NSString *jobtitle = [NSString stringWithFormat:@"%@", [item objectForKey:@"item"]];
            NSLog(@"email is %@", jobtitle);
            
            NSDictionary *dic1 = @{@"jobtitle" : jobtitle};
            [jobtitles addObject:dic1];
            
            
        }
        
        [dic setObject:jobtitles forKey:@"jobtitles"];
        
        
        
        //        address
        
        NSMutableArray *addresses = [[NSMutableArray alloc] init
                                     ];
        
        
        for (NSDictionary *item in  [resultDict objectForKey:@"address"]) {
            
            NSDictionary *addre = [item objectForKey:@"item"];
            
            
            NSString *type = [NSString stringWithFormat:@"%@", [addre objectForKey:@"type"]];
            NSRange pos = [type rangeOfString:@"work"];
            if (pos.length > 0) {
                type = @"WORK";
            }
            
            NSDictionary *dic1 = @{@"lable" : type,
                                   @"country" :  [NSString stringWithFormat:@"%@", [addre objectForKey:@"country"]],
                                   @"province" :  [NSString stringWithFormat:@"%@", [addre objectForKey:@"locality"]],
                                   @"city" :  [NSString stringWithFormat:@"%@", [addre objectForKey:@"locality"]],
                                   @"street" :  [NSString stringWithFormat:@"%@", [addre objectForKey:@"street"]],
                                   @"street2" :  [NSString stringWithFormat:@"%@", [addre objectForKey:@"street"]],
                                   @"postcode" :  [NSString stringWithFormat:@"%@", [addre objectForKey:@"postal_code"]]};
            
            
            [addresses addObject:dic1];
            
        }
        
        [dic setObject:addresses forKey:@"addresses"];
        
        
        
        NSMutableArray *url = [[NSMutableArray alloc] init
                               ];
        
        
        for (NSDictionary *item in  [resultDict objectForKey:@"url"]) {
            
            NSString *urlItem = [NSString stringWithFormat:@"%@", [item objectForKey:@"item"]];
            
            
            NSDictionary *dic1 = @{@"itemInfo" : urlItem,
                                   @"itemLabel" :@"HOMEPAGE"};
            
            [url addObject:dic1];
            
        }
        
        [dic setObject:url forKey:@"url"];
        
        
        self.dict = dic;
        NSLog(@"dic =%@", dic);
        
    } else {
        _errorflag = @"1";
        _errorMsg = @"没有返回结果";
    }
    
    
    
    
    [self returnMess:self._command
            andError:_errorflag
          andSuccess:self.dict
            andError:self.errorMsg];
    //    NSLog(@"the result is %@",result);
    
    
}

@end
