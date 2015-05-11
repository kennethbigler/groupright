//
//  TasksTableViewCell.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "TasksTableViewCell.h"
#import "GroupRightNetworking.h"
#import "TasksViewController.h"
#import "GRMainModule.h"
#import <UIKit/UIKit.h>

@implementation TasksTableViewCell
@synthesize description = _description;
@synthesize completedButton = _completedButton;
@synthesize colorImage = _colorImage;

- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

- (IBAction)markTaskComplete:(id)sender {
    NSLog(@"Task Completed");
    NSLog(@"btnSelected data is %@", [sender accessibilityValue]);
    if([[sender accessibilityValue] isEqual:@"null"]){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Web Version Feature"
                                                        message:@"We're sorry. This action corresponds to an event or list and can currently only be completed on the Web version of GroupRight."
                                                       delegate:self
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alert show];
        return;
    }
    else if([[sender accessibilityValue] isEqual:@"completed"]){
        return;
    }
    GRMainModule *grmm = [GRMainModule grMain];
    UIColor *grColor=[grmm getColorForTaskWithId:[sender accessibilityValue]];
    CAShapeLayer *circleLayer;
    circleLayer=[self.completedButton.layer.sublayers objectAtIndex:0];
    circleLayer.fillColor = grColor.CGColor;
    circleLayer.strokeColor = [UIColor colorWithRed:.44 green:.44 blue:.44 alpha:1].CGColor;
    circleLayer.lineWidth = 2;
    
    [self.completedButton.layer addSublayer:circleLayer];
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [GroupRightNetworking markTaskCompleteWithTaskId:[sender accessibilityValue]];
        [GroupRightNetworking getUserInfo];
    });
}
@end
