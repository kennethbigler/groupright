//
//  MessagesViewController.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface MessagesViewController : UIViewController <UIPickerViewDataSource,UIPickerViewDelegate>
- (IBAction)toggleGroupPicker:(id)sender;
@property (strong, nonatomic) IBOutlet UIPickerView *groupPIcker;
@property (strong, nonatomic) IBOutlet UILabel *currentGroupNameLabel;
@property (strong, nonatomic) IBOutlet UIButton *confirmButton;
@property (strong, nonatomic) IBOutlet UITableView *messagesTable;
@property (strong, nonatomic) IBOutlet UITextField *messageInput;
@property (strong, nonatomic) IBOutlet UIButton *sendButton;

@end
