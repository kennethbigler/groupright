//
//  MessagesViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "MessagesViewController.h"
#import "GRMainModule.h"
#import "MessagesTableCell.h"

@interface MessagesViewController ()

@end

@implementation MessagesViewController
NSString* activeGroupId;
BOOL isSelectingGroups=YES;
NSString* activeGroupName;
- (void)viewDidLoad {
    [super viewDidLoad];
    GRMainModule *grmm=[GRMainModule grMain];
    activeGroupId=[[grmm.groups objectAtIndex:0] objectForKey:@"group_id"];
    activeGroupName=[[grmm.groups objectAtIndex:0] objectForKey:@"group_name"];
    [self.messagesTable setHidden:YES];
    [self.messageInput setHidden:YES];
    [self.sendButton setHidden:YES];
    //NSLog(@"here");
    //NSLog(activeGroupName);
    //NSLog(activeGroupId);
    //NSLog(@"hello");
    // Do any additional setup after loading the view.
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)toggleGroupPicker:(id)sender {
    GRMainModule *grmm=[GRMainModule grMain];
    if(isSelectingGroups){
        self.currentGroupNameLabel.text=activeGroupName;
        self.groupPIcker.hidden=YES;
        //self.confirmButton.=@"Change Group";
        [self.confirmButton setTitle:@"Change" forState:UIControlStateNormal];
        [grmm setMessagesForGroupWithId:activeGroupId];
        [_messagesTable reloadData];
        [self.messagesTable setHidden:NO];
        [self.messageInput setHidden:NO];
        [self.sendButton setHidden:NO];
    }
    else{
        //self.activeGroup.topItem.title=@"Select Group";
        self.groupPIcker.hidden=NO;
        //self.changeButton.title=@"Done";
        [self.confirmButton setTitle:@"Done" forState:UIControlStateNormal];
        [self.messagesTable setHidden:YES];
        [self.messageInput setHidden:YES];
        [self.sendButton setHidden:YES];
    }
    isSelectingGroups=!isSelectingGroups;
    //if (self.groupPIcker) self.groupPIcker.hidden = !self.groupPIcker.hidden;
}

-(NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView{
    return 1;
}
-(NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component{
    GRMainModule *grmm=[GRMainModule grMain];
    return [grmm.groups count];
}
-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component{
    GRMainModule *grmm=[GRMainModule grMain];
    //return @"hello";
    return [[grmm.groups objectAtIndex:row] objectForKey:@"group_name"];
}
-(void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component{
    GRMainModule *grmm=[GRMainModule grMain];
    //return @"hello";
    activeGroupId=[[grmm.groups objectAtIndex:row] objectForKey:@"group_id"];
    activeGroupName=[[grmm.groups objectAtIndex:row] objectForKey:@"group_name"];
}

// =============================================================================================
//  Updates Table
// =============================================================================================

- (NSInteger) numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    GRMainModule *grmm = [GRMainModule grMain];
    //NSLog(@"Hello");
    return [grmm.messages count];
}

- (UITableViewCell *) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    GRMainModule *grmm = [GRMainModule grMain];
    NSDictionary *message = [grmm.messages objectAtIndex: indexPath.row];
    NSString * email= [message objectForKey:@"email"];
    
    static NSString *cellID;
    static NSString *nibName;
    //if the user sent the message
    if([email isEqualToString:[grmm user]]){
        cellID = @"MessagesSentCell";
        nibName=@"MessagesSentTableCell";
    }
    else{
        cellID = @"MessagesReceivedCell";
        nibName=@"MessagesTableCell";
    }
    
    
    //Get a new or recycled cell
    MessagesTableCell *cell = (MessagesTableCell *)[tableView dequeueReusableCellWithIdentifier:cellID];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:nibName owner:self options:nil];
        cell = (MessagesTableCell*)[nib objectAtIndex:0];
    }
    
    
    //Set Name and Description
    cell.sender_name.text = [grmm getFullNameForEmail:[message objectForKey:@"email"]];
    cell.message_content.text=[message objectForKey:@"content"];
    cell.message_time.text=@"8:30 PM";
    
    return cell;
}

- (void) tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
}


@end
