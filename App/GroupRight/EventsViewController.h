//
//  EventsViewController.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface EventsViewController : UIViewController
@property (strong, nonatomic) IBOutlet UITableView *EventsTable;
@property (strong, nonatomic) NSMutableArray *displayEvents;
@end
