//
//  UpdatesTableCell.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/21/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UpdatesTableCell : UITableViewCell
@property (nonatomic, weak) IBOutlet UILabel *nameLabel;
@property (nonatomic, weak) IBOutlet UILabel *infoLabel;
@property (nonatomic, weak) IBOutlet UIImageView *thumbnailImageView;

@end
