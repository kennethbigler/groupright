//
//  TaskDetailViewController.m
//  GroupRight
//
//  Created by Scott on 5/7/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "TaskDetailViewController.h"

@interface TaskDetailViewController ()

@end

@implementation TaskDetailViewController
@synthesize color;

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)viewWillAppear:(BOOL)animated {
    // Do any additional setup after loading the view.
    self.task_title.text=_task_title_string;
    self.task_title.backgroundColor=color;
    self.responsibility.text=_responsibility_string;
    self.group.text=_group_string;
    self.creator.text=_creator_string;
    self.description_label.text=_description_string;
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

- (IBAction)close:(id)sender {
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}
@end
