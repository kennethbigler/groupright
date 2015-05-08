//
//  TaskDetailViewController.h
//  GroupRight
//
//  Created by Scott on 5/7/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface TaskDetailViewController : UIViewController
@property (weak, nonatomic) NSString* task_title_string;
@property (weak, nonatomic) IBOutlet UILabel *task_title;
@property (weak, nonatomic) IBOutlet UILabel *responsibility;
@property (weak, nonatomic) IBOutlet UILabel *group;
@property (weak, nonatomic) IBOutlet UILabel *creator;
- (IBAction)close:(id)sender;

@end
