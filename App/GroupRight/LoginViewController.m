//
//  LoginViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/19/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "LoginViewController.h"
#import "GroupRightNetworking.h"
#import "FirstViewController.h"
#import "GRMainModule.h"

@interface LoginViewController ()

@end

@implementation LoginViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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
        [grmm setAc:cookie];
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}


/*-(NSData *)postDataToUrl:(NSString*)jsonString
{
    NSString *urlString = @"https://www.groupright.net/dev/groupserve.php";
    NSData* responseData = nil;
    NSURL *url=[NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    responseData = [NSMutableData data] ;
    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:url];
    NSString *bodydata=[NSString stringWithFormat:@"data=%@",jsonString];
    bodydata=[NSString stringWithFormat:@"function=login&email=zwilson7@gmail.com&password=test1"];
    //Valid Cookie f18YMPFEP0otkZpRVsQV7B2FPLTaFG3L
    bodydata=[NSString stringWithFormat:@"function=get_user_info&email=zwilson7@gmail.com&ac=f18YMPFEP0otkZpRVsQV7B2FPLTaFG3L"];
    NSLog(bodydata);
    [request setHTTPMethod:@"POST"];
    NSData *req=[NSData dataWithBytes:[bodydata UTF8String] length:[bodydata length]];
    [request setHTTPBody:req];
    NSURLResponse* response;
    NSError* error = nil;
    responseData = [NSURLConnection sendSynchronousRequest:request     returningResponse:&response error:&error];
    NSString *responseString = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    
    //NSLog(@"the final output is:%@",responseString);
    
    NSError *jsonError;
    NSData *objectData = [responseString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:objectData
                                                         options:NSJSONReadingMutableContainers
                                                           error:&jsonError];
    for (id key in json) {
        if([key isEqual:@"updates"]){
            for(int i=0; i<[[json objectForKey:key] count];i++){
                    NSLog(@"key: %@, value: %@", key, [json objectForKey:key]);
            }
        }
    }
    return responseData;
}*/



@end
