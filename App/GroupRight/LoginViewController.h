//
//  LoginViewController.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/19/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LoginViewController : UIViewController
@property (strong, nonatomic) IBOutlet UITextField *email;
@property (strong, nonatomic) IBOutlet UITextField *password;
- (IBAction)login1:(id)sender;
-(BOOL) isValidEmail:(NSString *) checkString;
//-(NSData *)postDataToUrl:(NSString*)jsonString;
@end
