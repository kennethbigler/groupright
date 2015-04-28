//
//  SettingsViewController.h
//  GroupRight
//
//  Created by Scott on 4/27/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SettingsViewController : UIViewController
@property (weak, nonatomic) IBOutlet UILabel *accountName;
- (IBAction)logout:(id)sender;

@end
