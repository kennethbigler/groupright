//
//  UpdatesTableCell.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/21/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "UpdatesTableCell.h"

@implementation UpdatesTableCell
@synthesize nameLabel = _nameLabel;
@synthesize infoLabel = _infoLabel;
@synthesize thumbnailImageView = _thumbnailImageView;

- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
