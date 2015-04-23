//
//  LoginViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/19/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "LoginViewController.h"
#import "GroupRightNetworking.h"
#import "UpdatesViewController.h"
#import "GRMainModule.h"

@interface LoginViewController ()

@end

@implementation LoginViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.email.delegate=self;
    self.password.delegate=self;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event{
    [self.email resignFirstResponder];
    [self.email resignFirstResponder];
}

-(BOOL)textFieldShouldReturn:(UITextField *)textField{
    if(textField){
        [textField resignFirstResponder];
    }
    return NO;
}

-(BOOL) isValidEmail:(NSString *)checkString{
    BOOL stricterFilter = NO;
    NSString *stricterFilterString = @"[A-Z0-9a-z\\._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}";
    NSString *laxString = @".+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2}[A-Za-z]*";
    NSString *emailRegex = stricterFilter ? stricterFilterString : laxString;
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    return [emailTest evaluateWithObject:checkString];
}
-(BOOL) isFunction: (NSString *) function{
    return YES;
}
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)login1:(id)sender {
    if(![self isValidEmail:self.email.text]){
        self.email.text=@"Invalid Email";
        self.email.textColor=[UIColor colorWithRed:1 green:0 blue:0 alpha:1];
        return;
    }
    if(self.password.text.length<2){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Password Required"
                                                        message:@"Please enter a valid password."
                                                       delegate:nil
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alert show];
        return;
        
    }
    //[GroupRightNetworking postDataToGroupServe:jsonInputString];
    GRMainModule *grmm = [GRMainModule grMain];
    [grmm setUser:self.email.text];
    NSString *cookie=[GroupRightNetworking loginToGroupServeWithUsername:self.email.text andPassword:self.password.text];
    
    if(![cookie isEqualToString:@""])
    {
        cookie = [cookie stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        cookie = [cookie stringByReplacingOccurrencesOfString:@" " withString:@""];
        [grmm setAc:cookie];
        [self dismissViewControllerAnimated:YES completion:nil];
        [GroupRightNetworking getUserInfo];
    }
}

- (IBAction)bypassLogin:(id)sender {
    GRMainModule *grmm = [GRMainModule grMain];
    [grmm setUser:@"zwilson7@gmail.com"];
    NSString *cookie=[GroupRightNetworking loginToGroupServeWithUsername:@"zwilson7@gmail.com" andPassword:@"test1"];
    
    if(![cookie isEqualToString:@""])
    {
        cookie = [cookie stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        cookie = [cookie stringByReplacingOccurrencesOfString:@" " withString:@""];
        [grmm setAc:cookie];
        [self dismissViewControllerAnimated:YES completion:nil];
        [GroupRightNetworking getUserInfo];
    }
}

- (IBAction)signup:(id)sender{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"https://groupright.net/dev/login.html?signup=1"]];
}

- (IBAction)dismissKeyboard:(id)sender {
}



@end
