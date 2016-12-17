//
//  ContactsCordova.m
//  联系人插件演示
//
//  Created by 吴笑诚 on 2016/12/12.
//
//

#import "ContactsCordova.h"

#import <AddressBook/AddressBook.h>
#import <AddressBookUI/AddressBookUI.h>
#import <ContactsUI/ContactsUI.h>


@interface ContactsCordova ()<ABPeoplePickerNavigationControllerDelegate, CNContactPickerDelegate> {
    
    
    NSString * _callbackId;
    
}

@end


@implementation ContactsCordova





- (void) pickContact:(CDVInvokedUrlCommand*)command {
    _callbackId = [command callbackId];
    
    //    NSString* imagePath = [[command arguments] objectAtIndex:0];
    //    NSNumber* width = [[command arguments] objectAtIndex:1];
    //    NSNumber* height = [[command arguments] objectAtIndex:2];
    
    //爱直至成伤lie
    //ios copy项目文件到Documents目录下
    
    
    
    
    [self.commandDelegate runInBackground:^{
        
        
        
        if ([[[UIDevice currentDevice] systemVersion] floatValue] <= 8.0) {
            ABAuthorizationStatus status = ABAddressBookGetAuthorizationStatus();
            ABAddressBookRef addressBookRef = ABAddressBookCreateWithOptions(NULL, NULL);
            if (status == kABAuthorizationStatusNotDetermined) {
                NSLog(@"还没问");
                ABAddressBookRequestAccessWithCompletion(addressBookRef, ^(bool granted, CFErrorRef error){
                    if(granted){
                        NSLog(@"点击同意");
                        [self showPickContact];
                        
                    }else{
                        NSLog(@"点击拒绝");
                        [self nativeViewDismissFaild:@"未授权使用通讯录"];
                        
                    }
                });
            }else if (status == kABAuthorizationStatusAuthorized){
                NSLog(@"已经授权");
                [self showPickContact];
            }else {
                NSLog(@"没有授权");
                // 弹窗提示去获取权限
                [self nativeViewDismissFaild:@"请允许应用程序使用通讯录"];
                
            }
            
        }
        else {
            CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
            if (status == CNAuthorizationStatusNotDetermined) {
                [[[CNContactStore alloc]init] requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
                    NSLog(@"还没问");
                    if(granted){
                        NSLog(@"点击了同意");
                        [self showPickContact];
                        
                    }else{
                        NSLog(@"点击了拒绝");
                        [self nativeViewDismissFaild:@"未授权使用通讯录"];
                        
                    }
                }];
            }else if (status == CNAuthorizationStatusAuthorized){
                NSLog(@"已经授权");
                [self showPickContact];
                
            }
            else {
                NSLog(@"没有授权");
                [self nativeViewDismissFaild:@"请允许应用程序使用通讯录"];
                
            }
        }
        
        
    }];
    
}


#pragma mark - 显示通讯录
- (void) showPickContact {
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 9.0) {
        
        CNContactPickerViewController* contactController = [[CNContactPickerViewController alloc] init];
        contactController.delegate = self;
        
        [self.viewController presentViewController:contactController animated:YES completion:nil];
        
        
    }
    else {
        ABPeoplePickerNavigationController* peopleController = [[ABPeoplePickerNavigationController alloc] init];
        peopleController.peoplePickerDelegate = self;
        
        [self.viewController presentViewController:peopleController animated:YES completion:nil];
        
    }
}



#pragma mark - ios 7


// Called after the user has pressed cancel.


// Deprecated, use predicateForSelectionOfPerson and/or -peoplePickerNavigationController:didSelectPerson: instead.
- (BOOL)peoplePickerNavigationController:(ABPeoplePickerNavigationController *)peoplePicker shouldContinueAfterSelectingPerson:(ABRecordRef)person {
    [self setSelectedPerson:person];
    
    return NO;
}

// Deprecated, use predicateForSelectionOfProperty and/or -peoplePickerNavigationController:didSelectPerson:property:identifier: instead.
- (BOOL)peoplePickerNavigationController:(ABPeoplePickerNavigationController *)peoplePicker shouldContinueAfterSelectingPerson:(ABRecordRef)person property:(ABPropertyID)property identifier:(ABMultiValueIdentifier)identifier {
    
    [self setSelectedPerson:person];
    
    return YES;
}




#pragma mark - ios 8

// Called after a person has been selected by the user.
- (void)peoplePickerNavigationController:(ABPeoplePickerNavigationController*)peoplePicker didSelectPerson:(ABRecordRef)person {
    [self setSelectedPerson:person];
    
}

// Called after a property has been selected by the user.
- (void)peoplePickerNavigationController:(ABPeoplePickerNavigationController*)peoplePicker didSelectPerson:(ABRecordRef)person property:(ABPropertyID)property identifier:(ABMultiValueIdentifier)identifier {
    [self setSelectedPerson:person];
    
}

// Called after the user has pressed cancel.
- (void)peoplePickerNavigationControllerDidCancel:(ABPeoplePickerNavigationController *)peoplePicker {
    
}




-(void)setSelectedPerson:(ABRecordRef)person {
    
    
    NSString *contactName = CFBridgingRelease(ABRecordCopyCompositeName(person));
    
    NSString *organizationName = CFBridgingRelease(ABRecordCopyValue(person, kABPersonOrganizationProperty));
    organizationName = organizationName!=nil?organizationName:@"";
    ABMultiValueRef phoneRecord = ABRecordCopyValue(person, kABPersonPhoneProperty);
    //        CFStringRef phoneNumber = ABMultiValueCopyValueAtIndex(phoneRecord, 0);
    
    
    
    NSArray * phoneArray = CFBridgingRelease(ABMultiValueCopyArrayOfAllValues(phoneRecord));
    
    NSMutableArray* phoneMutableArray = [[NSMutableArray alloc] init];
    
    
    
    for (int index = 0; index < phoneArray.count; index++) {
        NSString *phone = [phoneArray objectAtIndex:index];
        //        NSString *phoneLabel = CFBridgingRelease(ABMultiValueCopyLabelAtIndex(phoneRecord, index));
        
        //判断当前这个值得标签
        //        if ([emailLabel isEqualToString:(NSString *)kABWorkLabel]) {
        //            NSLog(@"%@", email);
        //        }
        
        NSString *phoneLabel = CFBridgingRelease(ABAddressBookCopyLocalizedLabel(ABMultiValueCopyLabelAtIndex(phoneRecord, index)));
        
        phoneLabel = [self checkTypeString:phoneLabel];
        phone = [self checkString:phone];

        NSMutableDictionary* phoneDict = [[NSMutableDictionary alloc] init];
        phone = [self formatPhoneNumber:phone];
        [phoneDict setObject:phoneLabel forKey:@"type"];
        [phoneDict setObject:phone forKey:@"value"];
        [phoneMutableArray addObject:phoneDict];
        
    }
    
    
    
    
    
    //通过ABRecord 查找多值属性
    ABMultiValueRef emailProperty = ABRecordCopyValue(person, kABPersonEmailProperty);
    //将多值属性的多个值转化为数组
    NSArray * emailArray = CFBridgingRelease(ABMultiValueCopyArrayOfAllValues(emailProperty));
    NSMutableArray* emailMutableArray = [[NSMutableArray alloc] init];
    
    for (int index = 0; index < emailArray.count; index++) {
        NSString *email = [emailArray objectAtIndex:index];
        NSString *emailLabel = CFBridgingRelease(ABMultiValueCopyLabelAtIndex(emailProperty, index));
        //判断当前这个值得标签
//        if ([emailLabel isEqualToString:(NSString *)kABWorkLabel]) {
//            NSLog(@"%@", email);
//        }
        NSMutableDictionary* emailDict = [[NSMutableDictionary alloc] init];
        NSString* localLabel = [CNLabeledValue localizedStringForLabel:emailLabel];
        
        localLabel = [self checkTypeString:localLabel];
        email = [self checkString:email];
        [emailDict setObject:localLabel forKey:@"type"];
        [emailDict setObject:email forKey:@"value"];
        [emailMutableArray addObject:emailDict];
    }
    
    NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];
    
    organizationName = [self checkString:organizationName];
    contactName = [self checkString:contactName];
    [dict setObject:organizationName forKey:@"orgName"];
    [dict setObject:contactName forKey:@"name"];
    [dict setObject:phoneMutableArray forKey:@"phoneList"];
    [dict setObject:emailMutableArray forKey:@"emailList"];
    
    [self nativeViewDismissSuccessWithDict:dict];
    
    //Handling Social Media Contacts - Crash
    
    //        if(contactName.length>0 && phone.length>0){
    
    //            [self setRecieverName:contactName
    //                           number:phone];
    CFRelease(phoneRecord);
    CFRelease(emailProperty);
    //        }
    
}


- (NSString*) checkString: (NSString*) string {
    string = string!=nil?string:@"";
    return string;
}

- (NSString*) checkTypeString: (NSString*) string {
    if (string==nil || [string isEqualToString:@""]) {
        string = @"Default";
    }

    return string;
}


#pragma mark - CNContactPickerDelegate

- (void)contactPickerDidCancel:(CNContactPickerViewController *)picker{
    NSLog(@"取消");
}
/**
 *  选中联系人时执行该方法
 *
 *  @param picker  联系人控制器
 *  @param contact 联系人
 */
- (void)contactPicker:(CNContactPickerViewController *)picker didSelectContact:(CNContact *)contact{
    NSLog(@"联系人的资料:%@",contact);
    NSString *fullName = [CNContactFormatter stringFromContact:contact style:CNContactFormatterStyleFullName];

    
    NSString* organizationName = contact.organizationName;
    //    NSLog(@"联系人的组织名:%@",organizationName);
    
    
    NSMutableArray* phoneMutableArray = [[NSMutableArray alloc] init];
    NSArray<CNLabeledValue *> *phoneArray = contact.phoneNumbers;
    for (CNLabeledValue *label in phoneArray) {
        
        NSString *phone = label.label;
        CNPhoneNumber *phoneNum = label.value;
        NSString *code = phoneNum.stringValue;
        
//        if ([label.label isEqualToString:CNLabelPhoneNumberMobile]) {
//            NSLog(@"%@手机号码是phone:%@---%@",fullName,phone,code);
//        }
//        NSLog(@"%@号码是phone:%@---%@",fullName,phone,code);
        
        NSMutableDictionary* phoneDict = [[NSMutableDictionary alloc] init];
        NSString* localLabel = [CNLabeledValue localizedStringForLabel:phone];
        phone = [self formatPhoneNumber:code];

        // 检查是否为空
        localLabel = [self checkTypeString:localLabel];
        phone = [self checkString:phone];

        [phoneDict setObject:localLabel forKey:@"type"];
        [phoneDict setObject:phone forKey:@"value"];
        [phoneMutableArray addObject:phoneDict];
        
    }
    
//    NSString *name =  [CNContactFormatter stringFromContact:contact style:CNContactFormatterStyleFullName];
    //NSLog(@"全名是---%@",name);
//    NSString *phoneName = [CNContactFormatter stringFromContact:contact style:CNContactFormatterStylePhoneticFullName];
    //NSLog(@"号码全名是---%@",phoneName);
    
//    NSArray<CNLabeledValue *> *postAddressArray = contact.postalAddresses;
//    for (CNLabeledValue *addressLabel in postAddressArray) {
//        CNPostalAddress *address = addressLabel.value;
//        NSString *ad = [CNPostalAddressFormatter stringFromPostalAddress:address style:CNPostalAddressFormatterStyleMailingAddress];
//        NSLog(@"地址是---%@",ad);
//        
//    }
 
    NSMutableArray* emailMutableArray = [[NSMutableArray alloc] init];
    
    NSArray<CNLabeledValue *> *emailAddresses = contact.emailAddresses;
    for (CNLabeledValue *label in emailAddresses) {
        
        
        NSString *mailLabel = label.label;
        
        NSString* mailAddressString = label.value;
        
        //NSLog(@"%@ 邮件地址: %@-%@", fullName,mailLabel,mailAddressString);
        
        NSMutableDictionary* emailDict = [[NSMutableDictionary alloc] init];
        
        NSString* localLabel = [CNLabeledValue localizedStringForLabel:mailLabel];
        
        localLabel = [self checkTypeString:localLabel];
        mailAddressString = [self checkString:mailAddressString];
        [emailDict setObject:localLabel forKey:@"type"];
        [emailDict setObject:mailAddressString forKey:@"value"];
        [emailMutableArray addObject:emailDict];
        
    }
    
    
    NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];
    
    organizationName = [self checkString:organizationName];
    fullName = [self checkString:fullName];
    [dict setObject:organizationName forKey:@"orgName"];
    [dict setObject:fullName forKey:@"name"];
    [dict setObject:phoneMutableArray forKey:@"phoneList"];
    [dict setObject:emailMutableArray forKey:@"emailList"];
    
    [self nativeViewDismissSuccessWithDict:dict];
    
    
}

//选中属性时候执行
- (void)contactPicker:(CNContactPickerViewController *)picker didSelectContactProperty:(CNContactProperty *)contactProperty {
    NSString *key = contactProperty.key;
    NSString *value = contactProperty.value;
    NSLog(@"%@号码是phone:%@---",key,value);
    
}


- (void) nativeViewDismissSuccess:(NSString*)resultStr {
    
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:resultStr];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    
    
}
- (void) nativeViewDismissFaild:(NSString*)resultStr {
    
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_ERROR
                               messageAsString:resultStr];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    
}

- (void) nativeViewDismissSuccessWithDict:(NSMutableDictionary*)dict {
    
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsDictionary:dict];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    
    
}



//去除号码格式
- (NSString *)formatPhoneNumber:(NSString*)number
{
    number = [number stringByReplacingOccurrencesOfString:@"-"withString:@""];
    number = [number stringByReplacingOccurrencesOfString:@" "withString:@""];
    number = [number stringByReplacingOccurrencesOfString:@"("withString:@""];
    number = [number stringByReplacingOccurrencesOfString:@")"withString:@""];
    number = [number stringByReplacingOccurrencesOfString:@" "withString:@""];
    
    NSInteger len = number.length;
    if (len < 6)
    {
        return number;
    }
    
//    if ([[number substringToIndex:2]isEqualToString:@"86"])
//    {
//        number = [number substringFromIndex:2];
//    }
//    elseif ([[number substringToIndex:3]isEqualToString:@"+86"])
//    {
//        number = [number substringFromIndex:3];
//    }
//    elseif ([[number substringToIndex:4]isEqualToString:@"0086"])
//    {
//        number = [number substringFromIndex:4];
//    }
//    elseif ([[number substringToIndex:5]isEqualToString:@"12593"])
//    {
//        number = [number substringFromIndex:5];
//    }
//    elseif ([[number substringToIndex:5]isEqualToString:@"17951"])
//    {
//        number = [number substringFromIndex:5];
//    }
//    else if (len ==16 && [[number substringToIndex:6]isEqualToString:@"125201"])
//    {
//        number = [number substringFromIndex:5];
//    }
    
    return number;
}



@end








