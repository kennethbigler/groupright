//
//  SettingsViewController.m
//  GroupRight
//
//  Created by Scott on 4/27/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "SettingsViewController.h"
#import "LoginViewController.h"
#import "GRMainModule.h"
#import "GroupRightNetworking.h"

@interface SettingsViewController ()

@end

@implementation SettingsViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)viewDidAppear:(BOOL)animated
{
    GRMainModule *grmm = [GRMainModule grMain];
    
    
    if([grmm ac] == nil )
    {
        UIStoryboard *storyboard = self.storyboard;
        
        LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
        [self presentViewController:lvc animated:NO completion:nil];
    }
    
    self.accountName.text=[grmm user];
    //NSLog(@"hello");
    //NSLog([grmm user]);
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

- (IBAction)logout:(id)sender {
    GRMainModule *grmm = [GRMainModule grMain];

    [GroupRightNetworking logoutOfGroupServeWithUsername:[grmm user] andCookier:[grmm ac]];
    
    UIStoryboard *storyboard = self.storyboard;
    
    LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
    [self presentViewController:lvc animated:NO completion:nil];
    
}

- (IBAction)toggleCalendarSyncing:(id)sender {
}
@end
