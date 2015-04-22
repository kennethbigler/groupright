//
//  TasksTableViewCell.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface TasksTableViewCell : UITableViewCell
@property (strong, nonatomic) IBOutlet UILabel *description;
@property (strong, nonatomic) IBOutlet UIButton *statusImage;
@property (strong, nonatomic) IBOutlet UIImageView *colorImage;

@end
