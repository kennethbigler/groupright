//
//  TasksTableViewCell.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "TasksTableViewCell.h"

@implementation TasksTableViewCell
@synthesize description = _description;
@synthesize statusImage = _statusImage;
@synthesize colorImage = _colorImage;

- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
