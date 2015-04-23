//
//  EventsTableCell.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface EventsTableCell : UITableViewCell
@property (strong, nonatomic) IBOutlet UILabel *event_day;
@property (strong, nonatomic) IBOutlet UILabel *event_month;
@property (strong, nonatomic) IBOutlet UILabel *event_title;
@property (strong, nonatomic) IBOutlet UILabel *event_time;

@end
