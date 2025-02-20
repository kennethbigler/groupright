//
//  TaskDetailViewController.h
//  GroupRight
//
//  Created by Scott on 5/7/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface TaskDetailViewController : UIViewController
@property (strong, nonatomic) NSString* task_title_string;
@property (strong, nonatomic) UIColor* color;
@property (strong, nonatomic) NSString* responsibility_string;
@property (strong, nonatomic) NSString* group_string;
@property (strong, nonatomic) NSString* creator_string;
@property (strong, nonatomic) NSString* description_string;

@property (weak, nonatomic) IBOutlet UILabel *task_title;
@property (weak, nonatomic) IBOutlet UILabel *responsibility;
@property (weak, nonatomic) IBOutlet UILabel *group;
@property (weak, nonatomic) IBOutlet UILabel *creator;
@property (weak, nonatomic) IBOutlet UILabel *description_label;

- (IBAction)close:(id)sender;

@end
