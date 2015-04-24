//
//  MessagesTableCell.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/24/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface MessagesTableCell : UITableViewCell
@property (strong, nonatomic) IBOutlet UILabel *sender_name;
@property (strong, nonatomic) IBOutlet UILabel *message_content;
@property (strong, nonatomic) IBOutlet UILabel *message_time;

@end
