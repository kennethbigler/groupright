//
//  MessagesViewController.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface MessagesViewController : UIViewController
- (IBAction)toggleGroupPicker:(id)sender;

@property (strong, nonatomic) IBOutlet UIPickerView *groupPIcker;

@end
