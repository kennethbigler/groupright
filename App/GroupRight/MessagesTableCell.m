//
//  MessagesTableCell.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/24/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "MessagesTableCell.h"

@implementation MessagesTableCell
@synthesize sender_name = _sender_name;
@synthesize message_content = _message_content;
@synthesize message_time = _message_time;

- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
