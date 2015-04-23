//
//  EventsTableCell.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "EventsTableCell.h"

@implementation EventsTableCell
@synthesize event_day = _event_day;
@synthesize event_month = _event_month;
@synthesize event_title = _event_title;
@synthesize event_time = _event_time;

- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
